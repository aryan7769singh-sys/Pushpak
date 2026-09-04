/**
 * PUSHPAK Frontend API Client
 * Uses native fetch() without external HTTP libraries.
 * Handles loading, errors, and degraded states explicitly without silent fallback.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

/**
 * Generic fetch wrapper with explicit error classification.
 */
async function requestApi(endpoint, options = {}) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/json',
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      let errorDetail = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorJson = await response.json();
        if (errorJson?.detail) {
          errorDetail = typeof errorJson.detail === 'string'
            ? errorJson.detail
            : JSON.stringify(errorJson.detail);
        }
      } catch {
        // Fallback to HTTP statusText
      }
      return {
        ok: false,
        error: errorDetail,
        status: response.status,
        data: null,
      };
    }

    const data = await response.json();
    return { ok: true, data, status: response.status, error: null };
  } catch (error) {
    return {
      ok: false,
      error: error.message || 'Network error: Unable to contact PUSHPAK API server',
      status: 0,
      data: null,
    };
  }
}

/**
 * Fetch health status of the PUSHPAK backend and PostgreSQL database.
 */
export async function fetchHealth() {
  const result = await requestApi('/health');
  if (result.ok) {
    return result;
  }
  return {
    ok: false,
    error: result.error,
    data: {
      status: 'error',
      service: 'pushpak-api',
      version: '0.1.0',
      timestamp: new Date().toISOString(),
      environment: 'unknown',
      components: {
        api: { status: 'unreachable', message: result.error },
        database: { status: 'unknown', message: 'Cannot probe database' },
      },
    },
  };
}

/**
 * Fetch system information and metadata.
 */
export async function fetchSystemInfo() {
  return requestApi('/system/info');
}

/**
 * Fetch executive KPI summary metrics for the Executive Overview dashboard.
 */
export async function fetchDashboardSummary() {
  return requestApi('/dashboard/summary');
}

/**
 * Fetch historical index time series for Headline and Core.
 * @param {Object} params
 * @param {'daily'|'weekly'|'monthly'} [params.frequency='daily']
 * @param {string} [params.startDate]
 * @param {string} [params.endDate]
 */
export async function fetchDashboardTimeseries({ frequency = 'daily', startDate, endDate } = {}) {
  const searchParams = new URLSearchParams();
  if (frequency) searchParams.append('frequency', frequency);
  if (startDate) searchParams.append('start_date', startDate);
  if (endDate) searchParams.append('end_date', endDate);

  const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
  return requestApi(`/dashboard/timeseries${query}`);
}

/**
 * Fetch top 5 gainers and top 5 decliners domestic corridors.
 */
export async function fetchDashboardMovers() {
  return requestApi('/dashboard/movers');
}

/**
 * Fetch the complete 50-corridor domestic demonstration basket.
 */
export async function fetchDashboardRoutes() {
  return requestApi('/dashboard/routes');
}

/**
 * Fetch the 5 required project lead-time horizons (T+1, T+7, T+15, T+30, T+45).
 */
export async function fetchDashboardHorizons() {
  return requestApi('/dashboard/horizons');
}

/**
 * Fetch demonstration carrier set comparison metrics.
 */
export async function fetchDashboardCarriers() {
  return requestApi('/dashboard/carriers');
}

/**
 * Fetch demonstration surveillance alerts.
 */
export async function fetchDashboardAlerts() {
  return requestApi('/dashboard/alerts');
}
