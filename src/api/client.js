// src/api/client.js
// Base HTTP client — all service classes use this.
// When VITE_USE_MOCK=true, MSW intercepts every fetch() before it hits the network.
// Supports AbortController for request cancellation on component unmount/rapid filter changes.

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

class ApiError extends Error {
  constructor(status, message, body) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

class ApiClient {
  #baseUrl;
  #pendingRequests = new Map(); // Track active requests by key for cancellation

  constructor(baseUrl = '') {
    this.#baseUrl = baseUrl;
  }

  #buildUrl(path, params = {}) {
    const url = new URL(`${this.#baseUrl}${path}`, window.location.href);
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        url.searchParams.set(k, String(v));
      }
    });
    return url.toString();
  }

  /**
   * Create a stable request key for grouping related requests.
   * Example: "GET /api/v1/players?brand=betking" cancels all prior player fetches.
   */
  #makeRequestKey(method, path, params) {
    const url = new URL(`${this.#baseUrl}${path}`, window.location.href);
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        url.searchParams.set(k, String(v));
      }
    });
    return `${method}:${url.pathname}?${url.searchParams.toString()}`;
  }

  /**
   * Cancel any prior in-flight request with the same key (for filter/sort changes).
   */
  #cancelPriorRequest(key) {
    if (this.#pendingRequests.has(key)) {
      const prior = this.#pendingRequests.get(key);
      prior.abort();
      this.#pendingRequests.delete(key);
    }
  }

  async #request(method, path, { params, body } = {}) {
    const url = this.#buildUrl(path, params);
    const requestKey = this.#makeRequestKey(method, path, params);

    // Cancel any prior request with the same key
    this.#cancelPriorRequest(requestKey);

    const abortController = new AbortController();
    this.#pendingRequests.set(requestKey, abortController);

    try {
      const init = {
        method,
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        signal: abortController.signal,
      };
      if (body !== undefined) {
        init.body = JSON.stringify(body);
      }

      const res = await fetch(url, init);

      if (!res.ok) {
        let errBody;
        try { errBody = await res.json(); } catch { errBody = null; }
        throw new ApiError(res.status, `HTTP ${res.status} — ${path}`, errBody);
      }

      return res.json();
    } finally {
      // Clean up after request completes (success or error)
      this.#pendingRequests.delete(requestKey);
    }
  }

  get(path, params = {})       { return this.#request('GET',   path, { params }); }
  post(path, body = {})        { return this.#request('POST',  path, { body });   }
  patch(path, body = {})       { return this.#request('PATCH', path, { body });   }
  put(path, body = {})         { return this.#request('PUT',   path, { body });   }
  delete(path)                 { return this.#request('DELETE',path);             }
}

export const apiClient = new ApiClient(BASE_URL);
export { ApiError };
