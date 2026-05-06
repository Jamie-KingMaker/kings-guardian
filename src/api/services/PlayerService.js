// src/api/services/PlayerService.js
import { apiClient } from '../client.js';

class PlayerService {
  #client;

  constructor(client) {
    this.#client = client;
  }

  /**
   * GET /api/v1/players
   * Returns paginated player list with bucket counts.
   *
   * @param {{
   *   brand?: string, risk?: string, range?: string, page?: number,
   *   limit?: number, country?: string, status?: string,
   *   product?: string, signal?: string, tier?: number|string, sort?: string
   * }} params
   * @returns {{ data: Player[], meta: { total: number, page: number, limit: number, counts: object } }}
   */
  getPlayers(params = {}) {
    return this.#client.get('/api/v1/players', params);
  }

  /**
   * GET /api/v1/players/:id
   * Returns a single player with full behavioural detail.
   *
   * @param {string} id
   * @returns {{ data: Player }}
   */
  getPlayer(id) {
    return this.#client.get(`/api/v1/players/${encodeURIComponent(id)}`);
  }

  /**
   * PATCH /api/v1/players/:id/status
   * Updates the player's workflow status.
   *
   * @param {string} id
   * @param {string|null} status
   * @returns {{ data: Player }}
   */
  updateStatus(id, status) {
    return this.#client.patch(`/api/v1/players/${encodeURIComponent(id)}/status`, { status });
  }
}

export default new PlayerService(apiClient);

