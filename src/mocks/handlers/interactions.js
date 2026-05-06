// src/mocks/handlers/interactions.js
import { http, HttpResponse } from 'msw';
import { INTERACTIONS } from '../data/interactions.js';

// In-memory store (seeded with fixture data, survives across requests)
let store = [...INTERACTIONS];

// Valid enum values
const VALID_TYPES = new Set(['phone_call', 'sms', 'email', 'in_app', 'support_ticket']);
const VALID_OUTCOMES = new Set(['completed', 'failed', 'pending', null]);
const VALID_RISKS = new Set(['high', 'medium', 'low']);

export const interactionHandlers = [
  /**
   * GET /api/v1/interactions?brand=&type=&agent=&risk=&search=&limit=&page=
   * Response: { data: Interaction[], meta: { total }, stats: { ... } }
   */
  http.get('/api/v1/interactions', ({ request }) => {
    const url    = new URL(request.url);
    const type   = url.searchParams.get('type')   ?? 'all';
    const agent  = url.searchParams.get('agent')  ?? 'all';
    const risk   = url.searchParams.get('risk')   ?? 'all';
    const search = (url.searchParams.get('search') ?? '').toLowerCase();

    // Validation: type must be valid or 'all'
    if (type !== 'all' && !VALID_TYPES.has(type)) {
      return HttpResponse.json({
        error: {
          code: 'INVALID_TYPE',
          message: `Invalid type '${type}'. Expected one of: all, ${Array.from(VALID_TYPES).join(', ')}`,
          details: { provided: type, valid: Array.from(VALID_TYPES) }
        }
      }, { status: 400 });
    }

    // Validation: risk must be valid or 'all'
    if (risk !== 'all' && !VALID_RISKS.has(risk)) {
      return HttpResponse.json({
        error: {
          code: 'INVALID_RISK',
          message: `Invalid risk '${risk}'. Expected one of: all, ${Array.from(VALID_RISKS).join(', ')}`,
          details: { provided: risk, valid: Array.from(VALID_RISKS) }
        }
      }, { status: 400 });
    }

    const filtered = store.filter(e => {
      if (type   !== 'all' && e.type  !== type)  return false;
      if (agent  !== 'all' && e.agent !== agent) return false;
      if (risk   !== 'all' && e.risk  !== risk)  return false;
      if (search && !e.player.toLowerCase().includes(search) && !e.desc.toLowerCase().includes(search)) return false;
      return true;
    });

    const outreachEntries = store.filter(e => e.type === 'phone_call');
    const contacted       = outreachEntries.filter(e => e.outcome === 'completed');
    const stats = {
      total:       store.length,
      outreach:    outreachEntries.length,
      contactRate: outreachEntries.length ? Math.round(contacted.length / outreachEntries.length * 100) : 0,
      autoFlags:   store.filter(e => e.type === 'support_ticket').length,
    };

    return HttpResponse.json({
      data: filtered,
      meta: {
        total: filtered.length,
        fetchedAt: new Date().toISOString()
      },
      stats
    });
  }),

  /**
   * POST /api/v1/interactions
   * Request body: { userId: string (required), type: string (required), outcome?: string, notes?: string }
   * Response: { data: Interaction, meta: { ... } }
   */
  http.post('/api/v1/interactions', async ({ request }) => {
    const body = await request.json();
    const { userId, type, outcome, notes } = body;

    // Validation: userId is required
    if (!userId || typeof userId !== 'string') {
      return HttpResponse.json({
        error: {
          code: 'MISSING_REQUIRED_FIELD',
          message: 'Field "userId" is required and must be a string',
          details: { provided: userId }
        }
      }, { status: 400 });
    }

    // Validation: type is required and must be valid
    if (!type || !VALID_TYPES.has(type)) {
      return HttpResponse.json({
        error: {
          code: 'MISSING_OR_INVALID_FIELD',
          message: `Field "type" is required and must be one of: ${Array.from(VALID_TYPES).join(', ')}`,
          details: { provided: type, valid: Array.from(VALID_TYPES) }
        }
      }, { status: 400 });
    }

    // Validation: outcome must be valid if provided
    if (outcome !== undefined && outcome !== null && !VALID_OUTCOMES.has(outcome)) {
      return HttpResponse.json({
        error: {
          code: 'INVALID_OUTCOME',
          message: `Field "outcome" must be one of: completed, failed, pending, or null`,
          details: { provided: outcome, valid: Array.from(VALID_OUTCOMES).filter(o => o !== null) }
        }
      }, { status: 400 });
    }

    const entry = {
      id: Date.now(),
      ts: new Date().toISOString(),
      player: userId,
      type,
      outcome: outcome ?? null,
      desc: notes ?? '',
      agent: 'system',
      risk: 'high',
    };
    store = [entry, ...store];

    return HttpResponse.json({
      data: entry,
      meta: {
        interactionId: entry.id,
        createdAt: entry.ts
      }
    }, { status: 201 });
  }),
];

