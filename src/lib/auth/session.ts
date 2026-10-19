export interface SessionData {
  userId: string;
  email: string;
  displayName: string;
  mfaVerified: boolean;
  createdAt: number;
  expiresAt: number; // Timestamp in ms
}

export const SESSION_COOKIE_NAME = "folio_session";
export const SESSION_DURATION_DAYS = 7;

/**
 * Creates a valid session object with a 7-day expiration timestamp.
 */
export function createSessionPayload(
  userId: string,
  email: string,
  displayName: string
): SessionData {
  const now = Date.now();
  return {
    userId,
    email,
    displayName,
    mfaVerified: true,
    createdAt: now,
    expiresAt: now + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000,
  };
}

/**
 * Sets the session cookie in the browser.
 */
export function setClientSessionCookie(session: SessionData) {
  if (typeof document === "undefined") return;

  const maxAgeSeconds = SESSION_DURATION_DAYS * 24 * 60 * 60;
  const encoded = encodeURIComponent(JSON.stringify(session));
  document.cookie = `${SESSION_COOKIE_NAME}=${encoded}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
}

/**
 * Reads and parses the session cookie in the browser.
 */
export function getClientSessionCookie(): SessionData | null {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split(";").map((c) => c.trim());
  const found = cookies.find((c) => c.startsWith(`${SESSION_COOKIE_NAME}=`));

  if (!found) return null;

  try {
    const raw = found.split("=")[1];
    const decoded = decodeURIComponent(raw);
    const session: SessionData = JSON.parse(decoded);

    // Validate expiration
    if (Date.now() > session.expiresAt) {
      clearClientSessionCookie();
      return null;
    }

    return session;
  } catch (err) {
    clearClientSessionCookie();
    return null;
  }
}

/**
 * Clears the session cookie in the browser.
 */
export function clearClientSessionCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_COOKIE_NAME}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}
