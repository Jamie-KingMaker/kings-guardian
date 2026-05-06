// src/mocks/handlers/players.js
import { http, HttpResponse } from 'msw';
import { PLAYERS }            from '../data/players.js';
import { getPlayerPopulation, bucketCountsForBrand } from '../data/generators.js';

const PAGE_SIZE = 50;

const ACTION_STATUSES = new Set(['outreach', 'reopened', 'flagged', 'under-review', 'monitor']);

// In-memory status overrides (survive across requests within a session)
const statusOverrides = new Map();

function effectiveStatus(p) {
  return statusOverrides.has(p.id) ? statusOverrides.get(p.id) : p.status;
}

export const playerHandlers = [
  /**
   * GET /api/v1/players?brand=&risk=&range=&page=&limit=&country=&status=&product=&signal=&tier=&sort=
   */
  http.get('/api/v1/players', ({ request }) => {
    const url     = new URL(request.url);
    const brand   = url.searchParams.get('brand')   ?? 'all';
    const risk    = url.searchParams.get('risk')    ?? 'all';
    const range   = url.searchParams.get('range')   ?? '7d';
    const page    = Number(url.searchParams.get('page')  ?? 0);
    const limit   = Number(url.searchParams.get('limit') ?? PAGE_SIZE);
    const country = url.searchParams.get('country') ?? 'ALL';
    const status  = url.searchParams.get('status')  ?? 'all';
    const product = url.searchParams.get('product') ?? 'all';
    const signal  = url.searchParams.get('signal')  ?? 'all';
    const tier    = url.searchParams.get('tier')    ?? 'all';
    const sort    = url.searchParams.get('sort')    ?? 'riskScore';

    // Shortcut filters (movers / queue)
    const shortcut = url.searchParams.get('shortcut') ?? null;
    const moverIds = new Set(['BK-4827193','SS-7283910','BK-3918274','BK-5621847','SS-9012384']);
    const queueIds = new Set(PLAYERS.filter(p => p.status).map(p => p.id));

    const pop = getPlayerPopulation(brand, range, PLAYERS);
    const counts = pop.bucketCounts();

    // Post-filter predicate applied row-by-row
    const effectiveCountry = brand === 'betking' ? 'ALL' : country;
    const matchesFilter = (p) => {
      if (risk !== 'all' && p.risk !== risk) return false;
      if (effectiveCountry !== 'ALL' && p.country !== effectiveCountry) return false;
      if (product !== 'all' && !(p.products ?? []).includes(product)) return false;
      if (signal  !== 'all' && !(p.signals  ?? []).includes(signal))  return false;
      if (tier    !== 'all' && p.tier !== Number(tier)) return false;
      if (shortcut === 'movers' && !moverIds.has(p.id)) return false;
      if (shortcut === 'queue'  && !queueIds.has(p.id)) return false;
      if (status !== 'all') {
        const es = effectiveStatus(p);
        if (status === 'needs-action') { if (!ACTION_STATUSES.has(es)) return false; }
        else if (status === 'any-set') { if (!es) return false; }
        else if (es !== status) return false;
      }
      return true;
    };

    // Gather matching rows (scan up to 20k per segment for filtered queries)
    const rows = [];
    const riskOrder = { high: 0, medium: 1, low: 2, unrated: 3 };
    const allSegs = pop.segments;

    let segOffset = 0;
    for (const seg of allSegs) {
      const segLen = seg.pinned.length + seg.synthCount;
      const scan   = Math.min(segLen, 20000);
      for (let j = 0; j < scan; j++) {
        const p = pop.get(segOffset + j);
        if (p && matchesFilter(p)) rows.push({ ...p, status: effectiveStatus(p) });
        if (rows.length > (page + 1) * limit + 1) break;
      }
      segOffset += segLen;
    }

    // Sort
    rows.sort((a, b) => {
      if (sort === 'riskScore') return (b.riskScore ?? -1) - (a.riskScore ?? -1);
      if (sort === 'risk')      return riskOrder[a.risk] - riskOrder[b.risk];
      if (sort === 'spend')     return b.spend - a.spend;
      if (sort === 'spendDelta')return (b.spendDelta ?? -999) - (a.spendDelta ?? -999);
      return 0;
    });

    const pageData = rows.slice(page * limit, (page + 1) * limit);

    return HttpResponse.json({
      data: pageData,
      meta: {
        total: rows.length,
        page,
        limit,
        counts: {
          all:     counts.high + counts.medium + counts.low + counts.unrated,
          high:    counts.high,
          medium:  counts.medium,
          low:     counts.low,
          unrated: counts.unrated,
        },
        moverIds: [...moverIds],
        queueIds: [...queueIds],
      },
    });
  }),

   /**
    * GET /api/v1/players/:id
    * Response: { data: { ...player, status, behaviour, insights, productDistribution }, meta: { ... } }
    */
   http.get('/api/v1/players/:id', ({ params }) => {
     const found = PLAYERS.find(p => p.id === params.id);
     if (!found) {
       return HttpResponse.json({
         error: {
           code: 'PLAYER_NOT_FOUND',
           message: `Player with ID '${params.id}' not found`,
           details: { providedId: params.id }
         }
       }, { status: 404 });
     }

     const player = found;

     // Deterministic behaviour trace for the player detail chart
     const seed = player.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
     function seeded(s) { let v = s; return () => { v = (v * 9301 + 49297) % 233280; return v / 233280; }; }
     const rnd    = seeded(seed);
     const days   = 30;
     const spend  = Array.from({ length: days }, (_, i) => Math.max(10, Math.round(80 + Math.sin(i * 0.4) * 20 + (i > 22 ? (i - 22) * 35 : 0) + rnd() * 10)));
     const dep    = Array.from({ length: days }, (_, i) => (i > 22 ? (rnd() > 0.3 ? 1 + Math.floor(rnd() * 3) : 0) : (rnd() > 0.7 ? 1 : 0)));

     const insights = [
       { sev: 'high',   title: 'Re-deposited within 8 minutes of losing session', detail: '4 deposits totalling ₦480,000 placed between 23:14 and 00:42, immediately following a ₦212,000 loss.', time: '2h ago' },
       { sev: 'high',   title: 'Spend up 142% vs prior 7 days', detail: 'Weekly spend has more than doubled, escalating from ₦760k to ₦1.84M.', time: '6h ago' },
       { sev: 'medium', title: 'Multiple deposits in single session', detail: '3 deposits made within an 18-minute window on Apr 28.', time: '1d ago' },
       { sev: 'medium', title: 'Late-night activity shift', detail: '68% of bets in the last 7 days placed between 22:00 and 03:00, up from 22% prior.', time: '2d ago' },
       { sev: 'low',    title: '2 failed deposit attempts detected', detail: 'Both resolved on retry; flagged as a soft signal.', time: '3d ago' },
     ];

     const productDistribution = [
       { day: 'Apr 09', sports: 80, casino: 18, virtuals: 2 },
       { day: 'Apr 12', sports: 72, casino: 25, virtuals: 3 },
       { day: 'Apr 15', sports: 68, casino: 28, virtuals: 4 },
       { day: 'Apr 18', sports: 58, casino: 38, virtuals: 4 },
       { day: 'Apr 21', sports: 48, casino: 48, virtuals: 4 },
       { day: 'Apr 24', sports: 38, casino: 58, virtuals: 4 },
       { day: 'Apr 27', sports: 28, casino: 68, virtuals: 4 },
       { day: 'Apr 30', sports: 22, casino: 74, virtuals: 4 },
     ];

     return HttpResponse.json({
       data: {
         ...player,
         status: effectiveStatus(player),
         behaviour: { spendTimeSeries: spend, depositTimeSeries: dep },
         insights,
         productDistribution,
       },
       meta: {
         playerId: player.id,
         fetchedAt: new Date().toISOString()
       }
     });
   }),

   /**
    * PATCH /api/v1/players/:id/status
    * Request body: { status: null | string }
    * Valid statuses: outreach, reopened, flagged, under-review, monitor, or null
    * Response: { data: { ...player, status }, meta: { ... } }
    */
   http.patch('/api/v1/players/:id/status', async ({ params, request }) => {
     const body = await request.json();
     const { status } = body;

     // Validation: status must be a valid value or null
     const validStatuses = new Set(['outreach', 'reopened', 'flagged', 'under-review', 'monitor', null]);
     if (!validStatuses.has(status)) {
       return HttpResponse.json({
         error: {
           code: 'INVALID_STATUS',
           message: `Invalid status '${status}'. Expected one of: outreach, reopened, flagged, under-review, monitor, or null`,
           details: { provided: status, valid: Array.from(validStatuses).filter(s => s !== null) }
         }
       }, { status: 400 });
     }

     const found = PLAYERS.find(p => p.id === params.id);
     if (!found) {
       return HttpResponse.json({
         error: {
           code: 'PLAYER_NOT_FOUND',
           message: `Player with ID '${params.id}' not found`,
           details: { providedId: params.id }
         }
       }, { status: 404 });
     }

     statusOverrides.set(params.id, status ?? null);
     return HttpResponse.json({
       data: { ...found, status: statusOverrides.get(params.id) },
       meta: {
         playerId: params.id,
         statusUpdatedAt: new Date().toISOString()
       }
     });
   }),
];

