// src/api/services/DashboardService.js
import { apiClient } from '../client.js';

class DashboardService {
  #client;

  constructor(client) {
    this.#client = client;
  }

  /**
   * GET /api/v1/dashboard/summary
   * Returns the full range-aware dashboard data: dist, mau, trend, deposits,
   * movers, rgAdoption, signals, statDeltas, etc.
   *
   * @param {{ brand: string, range: string, country: string }} params
   */
  getSummary({ brand, range, country } = {}) {
    return this.#client.get('/api/v1/dashboard/summary', { brand, range, country });
  }
}

export default new DashboardService(apiClient);

