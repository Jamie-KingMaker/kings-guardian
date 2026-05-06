// src/mocks/handlers/ai.js
import { http, HttpResponse, delay } from 'msw';

const INSIGHT_SETS = {
  high: [
    '**Escalation wave building:** 47 players crossed the 80+ score threshold this period, a 12% rise — prioritise outreach queue review.',
    '**Chasing-loss pattern spiking:** 14 high-risk players re-deposited within 10 minutes of a losing session, up 31% vs prior period.',
    '**VIP crossover concern:** 3 Tier 8–9 customers have entered the high-risk bucket this week — flag for account manager review.',
    '**Re-deposit velocity critical:** Average gap between loss and next deposit is now 6 minutes among high-risk cohort, down from 22 minutes.',
    '**Outreach queue overdue:** 9 high-risk players have been flagged for outreach but remain uncontacted for more than 72 hours.',
  ],
  medium: [
    '**Medium tier turbulence:** Net inflow of 306 players into the medium bucket this period, driven by late-night activity shifts.',
    '**Sports → Casino migration:** 89 medium-risk players switched primary product this week — a leading indicator of escalation.',
    '**Burst deposit cluster:** 41 medium-risk accounts show 3+ deposits within 30 minutes in at least one session this period.',
    '**Late-night sessions rising:** 58% of medium-risk bets placed between 22:00 and 03:00, up from 34% in the prior period.',
    '**Self-exclusion enquiries up:** 12 medium-risk players contacted support this week — consider proactive limit nudge for the cohort.',
  ],
  low: [
    '**Low-risk base holding steady:** Population stable with only 0.3% net drift toward medium tier — no systemic concern this period.',
    '**Recreational pattern intact:** Average session length among low-risk players is 24 minutes, consistent with healthy leisure behaviour.',
    '**Deposit limit uptake strong:** 18% of low-risk players have an active deposit limit set, the highest rate across all risk tiers.',
    '**Early-signal monitoring clear:** Fewer than 0.4% of low-risk accounts triggered a behavioural flag this period — within normal range.',
    '**Small upward migration noted:** 198 low-risk players migrated to medium this period — monitor for continuation next refresh cycle.',
  ],
  all: [
    '**High-risk spike detected:** 47 players crossed the 80+ threshold this week, up 12% vs prior period — review outreach queue.',
    '**Deposit velocity rising:** Total deposits up 18.3% over the last 7 days, driven by late-night sessions after 22:00.',
    '**Medium cohort stable:** Medium-risk population held steady at 8,241, with a slight downward drift of 34 players this week.',
    '**RG tool adoption up:** Deposit limits set by 312 players this week, a 22% increase — soft intervention nudges are working.',
    '**Attention queue growing:** 6 flagged players remain unactioned for over 48 hours — open Player List filtered to outreach status.',
  ],
};

const CHAT_RESPONSES = [
  '**High-risk cohort** has grown 12% this week. I\'d prioritise reviewing the outreach queue — 9 players have been waiting over 72 hours.',
  'The **deposit velocity spike** stands out: last 7 days are running 18% above baseline, driven primarily by late-night sessions after 22:00.',
  'VIP risk crossover is worth attention — 3 Tier 8–9 accounts entered the high-risk bucket this week. Recommend account manager review.',
  'RG tool adoption is actually a positive signal this period. **Deposit limits up 22%**, suggesting the in-app nudges are landing.',
  'Open the Player List filtered to **Outreach Recommended** status to see your immediate action queue.',
];

/**
 * Frontend must sanitize all AI-generated text using DOMPurify or similar to prevent XSS.
 * The mock responses here are safe markdown/plaintext, but real Claude responses should be treated
 * as untrusted content and sanitized on the client before rendering.
 */

export const aiHandlers = [
  /**
   * POST /api/v1/ai/insights
   * Returns morning-brief callouts segmented by riskFilter.
   * Response: { insights: string[] } — contains markdown-formatted text that should be sanitized on FE
   */
  http.post('/api/v1/ai/insights', async ({ request }) => {
    await delay(600); // Simulate LLM latency
    let body;
    try {
      body = await request.json();
    } catch {
      return HttpResponse.json({
        error: {
          code: 'INVALID_REQUEST',
          message: 'Request body must be valid JSON',
          details: {}
        }
      }, { status: 400 });
    }

    const { riskFilter } = body;
    const validFilters = new Set(['high', 'medium', 'low', null]);
    if (!validFilters.has(riskFilter)) {
      return HttpResponse.json({
        error: {
          code: 'INVALID_RISK_FILTER',
          message: `Invalid riskFilter '${riskFilter}'. Expected one of: high, medium, low, or null`,
          details: { provided: riskFilter, valid: Array.from(validFilters).filter(f => f !== null) }
        }
      }, { status: 400 });
    }

    const key = riskFilter ?? 'all';
    const set = INSIGHT_SETS[key] ?? INSIGHT_SETS.all;
    return HttpResponse.json({
      insights: set,
      meta: {
        generatedAt: new Date().toISOString(),
        riskFilter: riskFilter ?? 'all'
      }
    });
  }),

  /**
   * POST /api/v1/ai/chat
   * Returns a single assistant reply for the sidebar copilot.
   * Response: { reply: string } — contains markdown text that should be sanitized on FE
   */
  http.post('/api/v1/ai/chat', async ({ request }) => {
    await delay(800);
    let body;
    try {
      body = await request.json();
    } catch {
      return HttpResponse.json({
        error: {
          code: 'INVALID_REQUEST',
          message: 'Request body must be valid JSON',
          details: {}
        }
      }, { status: 400 });
    }

    const { messages = [] } = body;
    if (!Array.isArray(messages)) {
      return HttpResponse.json({
        error: {
          code: 'INVALID_MESSAGES',
          message: 'Field "messages" must be an array',
          details: { provided: typeof messages }
        }
      }, { status: 400 });
    }

    const last = messages[messages.length - 1]?.text?.toLowerCase() ?? '';

    let reply;
    if (last.includes('vip') || last.includes('tier'))  reply = CHAT_RESPONSES[2];
    else if (last.includes('deposit'))                  reply = CHAT_RESPONSES[1];
    else if (last.includes('tool') || last.includes('limit')) reply = CHAT_RESPONSES[3];
    else if (last.includes('action') || last.includes('queue')) reply = CHAT_RESPONSES[4];
    else                                                reply = CHAT_RESPONSES[0];

    return HttpResponse.json({
      reply,
      meta: {
        generatedAt: new Date().toISOString(),
        messageCount: messages.length
      }
    });
  }),
];

