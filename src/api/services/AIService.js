// src/api/services/AIService.js
// When VITE_USE_MOCK=true, both endpoints are intercepted by MSW handlers.
// When a real backend is available it will proxy to the Anthropic Claude API
// using the VITE_CLAUDE_API_KEY stored server-side — NEVER exposed in the browser.
import { apiClient } from '../client.js';

class AIService {
  #client;

  constructor(client) {
    this.#client = client;
  }

  /**
   * POST /api/v1/ai/insights
   * Generates morning-brief callouts for the RGCopilotCard.
   *
   * @param {{
   *   brand: string, country: string, rangeLabel: string,
   *   mau: number, dist: object, total: number, sd: object,
   *   rangeData: object, riskFilter: string|null
   * }} payload
   * @returns {{ insights: string[] }}
   */
  getInsights(payload) {
    return this.#client.post('/api/v1/ai/insights', payload);
  }

  /**
   * POST /api/v1/ai/chat
   * Sends a chat turn to the sidebar RG Copilot.
   *
   * @param {{
   *   messages: { role: 'user'|'assistant', text: string }[],
   *   context: { brand: string, country: string, range: string }
   * }} payload
   * @returns {{ reply: string }}
   */
  chat(payload) {
    return this.#client.post('/api/v1/ai/chat', payload);
  }
}

export default new AIService(apiClient);

