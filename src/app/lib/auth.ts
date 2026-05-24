export const AUTH_STORAGE_KEYS = {
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  fullName: "fullName",
  avatar: "avatar",
  role: "role",
} as const;

type JwtPayload = {
  exp?: number;
};

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  fullName?: string;
  avatar?: string | null;
  role?: string;
};

function base64UrlDecode(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return atob(padded);
}

export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const [, payloadPart] = token.split(".");

    if (!payloadPart) {
      return null;
    }

    return JSON.parse(base64UrlDecode(payloadPart)) as JwtPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string, safetyWindowInSeconds = 30) {
  const payload = decodeJwtPayload(token);

  if (!payload?.exp) {
    return true;
  }

  return payload.exp * 1000 <= Date.now() + safetyWindowInSeconds * 1000;
}

export function getStoredAccessToken() {
  return localStorage.getItem(AUTH_STORAGE_KEYS.accessToken) ?? localStorage.getItem("token");
}

export function getValidAccessToken() {
  const token = getStoredAccessToken();

  if (!token) {
    return null;
  }

  if (isTokenExpired(token)) {
    clearAuthSession();
    return null;
  }

  return token;
}

export function isAuthenticated() {
  return Boolean(getValidAccessToken());
}

export function saveAuthSession(session: AuthSession) {
  localStorage.setItem(AUTH_STORAGE_KEYS.accessToken, session.accessToken);
  localStorage.setItem(AUTH_STORAGE_KEYS.refreshToken, session.refreshToken);

  if (session.fullName) {
    localStorage.setItem(AUTH_STORAGE_KEYS.fullName, session.fullName);
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEYS.fullName);
  }

  if (session.avatar) {
    localStorage.setItem(AUTH_STORAGE_KEYS.avatar, session.avatar);
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEYS.avatar);
  }

  if (session.role) {
    localStorage.setItem(AUTH_STORAGE_KEYS.role, session.role);
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEYS.role);
  }

  localStorage.removeItem("token");
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_STORAGE_KEYS.accessToken);
  localStorage.removeItem(AUTH_STORAGE_KEYS.refreshToken);
  localStorage.removeItem(AUTH_STORAGE_KEYS.fullName);
  localStorage.removeItem(AUTH_STORAGE_KEYS.avatar);
  localStorage.removeItem(AUTH_STORAGE_KEYS.role);
  localStorage.removeItem("token");
}

export function getAuthProfile() {
  return {
    fullName: localStorage.getItem(AUTH_STORAGE_KEYS.fullName),
    avatar: localStorage.getItem(AUTH_STORAGE_KEYS.avatar),
    role: localStorage.getItem(AUTH_STORAGE_KEYS.role),
  };
}