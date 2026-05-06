// src/api/services/InteractionService.js
import { apiClient } from '../client.js';

class InteractionService {
  #client;

  constructor(client) {
    this.#client = client;
  }

  /**
   * GET /api/v1/interactions
   * Returns filtered interaction log entries plus summary stats.
   *
   * @param {{ brand?: string, type?: string, agent?: string, risk?: string, search?: string, limit?: number, page?: number }} params
   * @returns {{ data: Interaction[], meta: { total: number }, stats: object }}
   */
  getInteractions(params = {}) {
    return this.#client.get('/api/v1/interactions', params);
  }

  /**
   * POST /api/v1/interactions
   * Logs a new CS agent interaction.
   *
   * @param {{ player: string, risk: string, tier: number, agent: string, type: string, desc: string, outcome: string|null }} body
   * @returns {{ data: Interaction }}
   */
  createInteraction(body) {
    return this.#client.post('/api/v1/interactions', body);
  }
}

export default new InteractionService(apiClient);

