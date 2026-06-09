import type { ApiError } from './types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export class ApiClientError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

async function parseResponse<T>(res: Response): Promise<T> {
  const json = (await res.json()) as T | ApiError;

  if (!res.ok) {
    const err = json as ApiError;
    throw new ApiClientError(
      err.error?.code ?? 'UNKNOWN_ERROR',
      err.error?.message ?? 'Erreur serveur',
      res.status,
    );
  }

  return json as T;
}

export const api = {
  get: async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      ...options,
    });
    return parseResponse<T>(res);
  },

  post: async <T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...options,
    });
    return parseResponse<T>(res);
  },
};
