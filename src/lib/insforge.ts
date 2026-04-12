const INSFORGE_BASE_URL =
  import.meta.env.VITE_INSFORGE_URL || 'https://w7bhh4bs.us-east.insforge.app';
const INSFORGE_API_KEY = import.meta.env.VITE_INSFORGE_API_KEY || '';

const ACCESS_TOKEN_STORAGE_KEY = 'insforge_access_token';

export interface InsforgeUser {
  id: string;
  email: string;
  emailVerified?: boolean;
  profile?: {
    name?: string;
  };
}

interface AuthResponse {
  user?: InsforgeUser;
  accessToken?: string | null;
  requireEmailVerification?: boolean;
  message?: string;
}

async function insforgeRequest<T>(
  path: string,
  init: RequestInit = {},
  accessToken?: string | null
): Promise<T> {
  const headers = new Headers(init.headers || {});
  headers.set('Content-Type', 'application/json');
  if (INSFORGE_API_KEY) {
    headers.set('x-api-key', INSFORGE_API_KEY);
  }

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await fetch(`${INSFORGE_BASE_URL}${path}`, {
    ...init,
    headers,
    credentials: 'include',
  });

  const text = await response.text();
  let payload: any = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = text;
  }

  if (!response.ok) {
    const errorMessage =
      payload?.error ||
      payload?.message ||
      `Insforge API error (${response.status})`;
    throw new Error(errorMessage);
  }

  return payload as T;
}

export function getStoredAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
}

export function clearStoredAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
}

function setStoredAccessToken(accessToken: string) {
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
}

export async function signUpWithEmail(params: {
  email: string;
  password: string;
  name?: string;
  redirectTo?: string;
}) {
  const data = await insforgeRequest<AuthResponse>('/api/auth/users', {
    method: 'POST',
    body: JSON.stringify(params),
  });

  if (data.accessToken) {
    setStoredAccessToken(data.accessToken);
  }

  return data;
}

export async function signInWithEmail(params: { email: string; password: string }) {
  const data = await insforgeRequest<AuthResponse>('/api/auth/sessions', {
    method: 'POST',
    body: JSON.stringify(params),
  });

  if (data.accessToken) {
    setStoredAccessToken(data.accessToken);
  }

  return data;
}

export async function fetchCurrentUser() {
  const token = getStoredAccessToken();
  if (!token) return null;

  try {
    const data = await insforgeRequest<{ user: InsforgeUser | null }>(
      '/api/auth/sessions/current',
      { method: 'GET' },
      token
    );
    return data.user;
  } catch (error) {
    clearStoredAccessToken();
    throw error;
  }
}

export async function sendPasswordReset(email: string, redirectTo?: string) {
  return insforgeRequest<{ success?: boolean; message?: string }>(
    '/api/auth/email/send-reset-password',
    {
      method: 'POST',
      body: JSON.stringify({
        email,
        redirectTo,
      }),
    }
  );
}

export async function signOutInsforge() {
  const token = getStoredAccessToken();
  try {
    await insforgeRequest<{ success: boolean; message: string }>(
      '/api/auth/logout',
      { method: 'POST' },
      token
    );
  } finally {
    clearStoredAccessToken();
  }
}
