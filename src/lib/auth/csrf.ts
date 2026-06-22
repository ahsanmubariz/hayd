import type { APIContext } from 'astro';

const TOKEN_LENGTH = 32;
const COOKIE_NAME = 'hayd_csrf';

function generateToken(): string {
  const bytes = new Uint8Array(TOKEN_LENGTH);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Get or create a CSRF token, setting it as a cookie. Returns the token to embed in forms. */
export function getCsrfToken(context: APIContext): string {
  const existing = context.cookies.get(COOKIE_NAME)?.value;
  if (existing && existing.length === TOKEN_LENGTH * 2) return existing;
  const token = generateToken();
  context.cookies.set(COOKIE_NAME, token, {
    httpOnly: false, // must be readable by JS for fetch-based submissions
    sameSite: 'lax',
    secure: import.meta.env.PROD,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return token;
}

/** Validate a submitted CSRF token (from form data or header) against the cookie */
export function validateCsrf(context: APIContext, request: Request, formData?: FormData): boolean {
  const cookieToken = context.cookies.get(COOKIE_NAME)?.value;
  if (!cookieToken) return false;

  // Check header first (for fetch/XHR submissions)
  const headerToken = request.headers.get('x-csrf-token');
  if (headerToken) {
    return constantTimeCompare(cookieToken, headerToken);
  }

  // Check form data
  if (formData) {
    const formToken = formData.get('_csrf');
    if (formToken && typeof formToken === 'string') {
      return constantTimeCompare(cookieToken, formToken);
    }
  }

  return false;
}

function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
