/**
 * Claude API Proxy Handler
 * Converts King's Guard AI API requests to Anthropic Claude API calls
 * Uses VITE_CLAUDE_API_KEY from environment (stored server-side, never exposed to browser)
 */

const CLAUDE_API_BASE = 'https://api.anthropic.com/v1';
const CLAUDE_MODEL = 'claude-sonnet-4-5';

/**
 * System prompts for different AI endpoints
 */
const SYSTEM_PROMPTS = {
  insights: `You are King's Guard, an expert RG (Responsible Gaming) intelligence analyst for sports betting platforms.
Your role is to generate morning-brief callouts that highlight risk signals, player behavior patterns, and recommended actions.
Always be concise, data-driven, and actionable. Use markdown formatting for structure.
Never provide investment advice or encourage gambling.`,

  chat: `You are King's Guard's RG Copilot, an expert assistant for responsible gaming operations teams.
You have live context on the current dashboard view (brand, country, date range, player data, risk distribution).
Answer questions directly and professionally. Keep responses under 150 words unless asked for detail.
If a question is outside RG operations, briefly explain why it's out of scope.
Always suggest concrete next steps when actionable.`,
};

/**
 * POST /api/v1/ai/insights
 * Generate morning-brief insights from dashboard data
 *
 * Request body:
 * {
 *   brand: string,
 *   country: string,
 *   rangeLabel: string,
 *   mau: number,
 *   dist: { high, med, low, unrated },
 *   total: number,
 *   sd: { high, med, low, dailyVs },
 *   rangeData: { trend, signals, movers, ... },
 *   riskFilter: string|null
 * }
 *
 * Response: { insights: string[], meta: { generatedAt, riskFilter } }
 */
export async function handleInsightsRequest(body, apiKey) {
  if (!body.brand || !body.country) {
    return {
      status: 400,
      body: {
        error: {
          code: 'MISSING_CONTEXT',
          message: 'Request must include brand and country',
        },
      },
    };
  }

  const {
    brand,
    country,
    rangeLabel,
    mau,
    dist = {},
    total,
    sd = {},
    rangeData = {},
    riskFilter,
  } = body;

  const pct = (n) => (n / total * 100).toFixed(1);
  const depositTotal = rangeData.depositTotal || 0;
  const topSignals = (rangeData.signals || [])
    .slice(0, 3)
    .map((s) => `${s.label} ${s.share}%`)
    .join(', ');
  const topMover = (rangeData.movers || [])[0];

  const filterDirective = riskFilter
    ? `Focus on ${riskFilter}-risk cohort only.`
    : '';

  const prompt = `You are generating 5 key insights for the King's Guard morning brief for ${brand.toUpperCase()} / ${country.toUpperCase()} for the ${rangeLabel}.

DASHBOARD SNAPSHOT:
- Active base: ${(mau || 0).toLocaleString()} ${rangeData.activeUnitFull || 'players'}
- Risk-monitored: ${(total || 0).toLocaleString()}
- High risk: ${(dist.high || 0).toLocaleString()} (${pct(dist.high || 0)}%) — ${sd.high || '?'} ${sd.dailyVs || ''}
- Medium risk: ${(dist.med || 0).toLocaleString()} (${pct(dist.med || 0)}%) — ${sd.med || '?'} ${sd.dailyVs || ''}
- Low risk: ${(dist.low || 0).toLocaleString()} (${pct(dist.low || 0)}%) — ${sd.low || '?'} ${sd.dailyVs || ''}
- Insufficient data: ${(dist.unrated || 0).toLocaleString()} (${pct(dist.unrated || 0)}%)
- Deposit volume ${rangeLabel}: ${(depositTotal || 0).toLocaleString()} (${rangeData.depositGrowth || '?'}% ${rangeData.deltaLabel || ''})
- Risk-trend growth: ${rangeData.trendGrowthPct || '?'}% ${rangeLabel}
- Top signals driving alerts: ${topSignals}
${topMover ? `- Notable mover: ${topMover.id} risk score now ${topMover.riskScore} (was ${topMover.riskFrom}); insight "${topMover.insight}"` : ''}
${filterDirective}

Each callout MUST:
- Start with a 2–4 word punchy title in **bold markdown** followed by a colon, then a single sentence ≤ 22 words.
- Anchor to the ${rangeLabel} window — say "this week", "over the last 30 days", "quarter-to-date", etc. as appropriate.
- Reference at least one specific number from the data above.
- Suggest a concrete next action OR call out a pattern worth investigating.

Tone: calm, professional, operational. No emojis. No preamble. No closing summary. Output exactly 5 bullets, each on its own line, prefixed with "- ".`;

  try {
    const response = await fetch(`${CLAUDE_API_BASE}/messages`, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 1024,
        system: SYSTEM_PROMPTS.insights,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[Claude API Error]', response.status, errorData);
      return {
        status: response.status,
        body: {
          error: {
            code: 'CLAUDE_API_ERROR',
            message: `Claude API returned ${response.status}`,
            details: errorData,
          },
        },
      };
    }

    const data = await response.json();
    const text = data.content[0]?.text || '';

    // Parse insights from Claude's response
    const insights = text
      .split('\n')
      .filter((line) => line.trim().startsWith('-'))
      .map((line) => line.replace(/^-\s*/, '').trim())
      .filter((line) => line.length > 0);

    return {
      status: 200,
      body: {
        insights: insights.length > 0 ? insights : [text],
        meta: {
          generatedAt: new Date().toISOString(),
          riskFilter: riskFilter ?? 'all',
          model: CLAUDE_MODEL,
        },
      },
    };
  } catch (error) {
    console.error('[Claude Insights Error]', error);
    return {
      status: 500,
      body: {
        error: {
          code: 'INSIGHTS_GENERATION_FAILED',
          message: error.message,
        },
      },
    };
  }
}

/**
 * POST /api/v1/ai/chat
 * Handle chat turn with Claude
 *
 * Request body:
 * {
 *   messages: { role: 'user'|'assistant', text: string }[],
 *   context: { brand: string, country: string, range: string }
 * }
 *
 * Response: { reply: string, meta: { generatedAt, messageCount } }
 */
export async function handleChatRequest(body, apiKey) {
  if (!body.messages || !Array.isArray(body.messages)) {
    return {
      status: 400,
      body: {
        error: {
          code: 'INVALID_MESSAGES',
          message: 'Field "messages" must be an array',
        },
      },
    };
  }

  const { messages = [], context = {} } = body;
  const { brand = 'unknown', country = 'unknown', range = 'current' } = context;

  // Convert messages to Claude format
  const claudeMessages = messages.map((msg) => ({
    role: msg.role === 'assistant' ? 'assistant' : 'user',
    content: msg.text || msg.content || '',
  }));

  const userPrompt = `User is asking about RG operations for ${brand.toUpperCase()} / ${country.toUpperCase()} over the ${range} range.
Please provide a direct, actionable response based on your knowledge of responsible gaming best practices.`;

  try {
    const response = await fetch(`${CLAUDE_API_BASE}/messages`, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 512,
        system: SYSTEM_PROMPTS.chat,
        messages: [...claudeMessages, { role: 'user', content: userPrompt }],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[Claude API Error]', response.status, errorData);
      return {
        status: response.status,
        body: {
          error: {
            code: 'CLAUDE_API_ERROR',
            message: `Claude API returned ${response.status}`,
            details: errorData,
          },
        },
      };
    }

    const data = await response.json();
    const reply = data.content[0]?.text || 'I could not generate a response.';

    return {
      status: 200,
      body: {
        reply: reply.trim(),
        meta: {
          generatedAt: new Date().toISOString(),
          messageCount: messages.length,
          model: CLAUDE_MODEL,
        },
      },
    };
  } catch (error) {
    console.error('[Claude Chat Error]', error);
    return {
      status: 500,
      body: {
        error: {
          code: 'CHAT_FAILED',
          message: error.message,
        },
      },
    };
  }
}

/**
 * Route handler for /api/v1/ai/* endpoints
 */
export async function handleClaudeRequest(req, apiKey) {
  const path = req.url || '/';
  let body;

  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    if (chunks.length > 0) {
      body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    }
  } catch {
    return {
      status: 400,
      body: { error: { code: 'INVALID_JSON', message: 'Request body must be valid JSON' } },
    };
  }

  if (path.includes('/insights')) {
    return handleInsightsRequest(body, apiKey);
  } else if (path.includes('/chat')) {
    return handleChatRequest(body, apiKey);
  }

  return {
    status: 404,
    body: { error: { code: 'NOT_FOUND', message: `Endpoint ${path} not found` } },
  };
}

