/**
 * Keira - HTTP Client
 * Regis Architecture v2.9.0
 */

import { API_CONFIG } from '../../constants';

// =============================================================================
// API ERROR
// =============================================================================

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// =============================================================================
// HTTP CLIENT
// =============================================================================

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new ApiError(response.status, error || `HTTP ${response.status}`);
  }

  return response.json();
}

export async function apiFetchBlob(endpoint: string): Promise<Blob> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new ApiError(response.status, 'Failed to fetch blob');
  }

  return response.blob();
}
