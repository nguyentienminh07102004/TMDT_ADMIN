export function getRole(): string | null {
  return localStorage.getItem("role");
}

export function getFullName(): string | null {
  return localStorage.getItem("fullName");
}

export function getAvatar(): string | null {
  return localStorage.getItem("avatar");
}

export function getAccessToken(): string | null {
  return localStorage.getItem("accessToken");
}

export function clearAuth(): void {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("role");
  localStorage.removeItem("fullName");
  localStorage.removeItem("avatar");
}

// Compatibility helpers used across the app
export function getValidAccessToken(): string | null {
  // For now, simply return the stored access token. Token refresh logic omitted.
  return getAccessToken();
}

export function clearAuthSession(): void {
  clearAuth();
  try {
    // Redirect to login page to force re-authentication
    window.location.href = "/login";
  } catch (e) {
    // noop in non-browser environments
  }
}