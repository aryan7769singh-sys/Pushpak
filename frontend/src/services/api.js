/**
 * PUSHPAK Frontend API Client
 * Uses native fetch() without external HTTP libraries.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

/**
 * Fetch health status of the PUSHPAK backend and PostgreSQL database.
 */
export async function fetchHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return { ok: true, data };
  } catch (error) {
    return {
      ok: false,
      error: error.message || 'Unable to contact backend service',
      data: {
        status: 'error',
        service: 'pushpak-api',
        version: '0.1.0',
        timestamp: new Date().toISOString(),
        environment: 'unknown',
        components: {
          api: { status: 'unreachable', message: error.message || 'API server offline' },
          database: { status: 'unknown', message: 'Cannot probe database' },
        },
      },
    };
  }
}

/**
 * Fetch system information and metadata.
 */
export async function fetchSystemInfo() {
  try {
    const response = await fetch(`${API_BASE_URL}/system/info`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return { ok: true, data };
  } catch (error) {
    return {
      ok: false,
      error: error.message || 'Unable to fetch system info',
    };
  }
}
