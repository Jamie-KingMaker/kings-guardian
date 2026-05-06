// src/mocks/handlers/dashboard.js
import { http, HttpResponse } from 'msw';
import { buildRangeData, MAU, MAU_TOTALS } from '../data/generators.js';

export const dashboardHandlers = [
  /**
   * GET /api/v1/dashboard/summary?brand=&range=&country=
   * Response: { data: { mau, dist, rangeLabel, ... }, meta: { ... } }
   */
  http.get('/api/v1/dashboard/summary', ({ request }) => {
    const url     = new URL(request.url);
    const brand   = url.searchParams.get('brand')   ?? 'all';
    const range   = url.searchParams.get('range')   ?? '7d';
    const country = url.searchParams.get('country') ?? 'ALL';

    // Validation: range must be valid
    const validRanges = new Set(['7d', '14d', '30d', '90d', 'ytd']);
    if (!validRanges.has(range)) {
      return HttpResponse.json({
        error: {
          code: 'INVALID_RANGE',
          message: `Invalid range '${range}'. Expected one of: 7d, 14d, 30d, 90d, ytd`,
          details: { provided: range, valid: Array.from(validRanges) }
        }
      }, { status: 400 });
    }

    const effectiveBrand = brand === 'all' ? null : brand;
    const data = buildRangeData(range, effectiveBrand);

    // Apply country share scaling if a specific country is selected
    let countryShare = 1;
    if (brand === 'supersportbet' && country === 'ZA') {
      countryShare = MAU.supersportbet.ZA / MAU_TOTALS.supersportbet;
    } else if (brand === 'supersportbet' && country === 'ZM') {
      countryShare = MAU.supersportbet.ZM / MAU_TOTALS.supersportbet;
    }

    if (countryShare !== 1) {
      data.mau  = Math.round(data.mau  * countryShare);
      data.dist = {
        high:    Math.round(data.dist.high    * countryShare),
        med:     Math.round(data.dist.med     * countryShare),
        low:     Math.round(data.dist.low     * countryShare),
        unrated: Math.round(data.dist.unrated * countryShare),
      };
    }

    return HttpResponse.json({
      data,
      meta: {
        brand: effectiveBrand ?? 'all',
        range,
        country,
        fetchedAt: new Date().toISOString()
      }
    });
  }),
];

