import '@/lib/db/d1-shim';
import { defineMiddleware } from 'astro/middleware';
import { getSession } from '@/lib/auth/session';

const PUBLIC_PATHS = [
  '/login',
  '/logout',
  '/favicon.ico',
];

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  return false;
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies } = context;
  const pathname = url.pathname;

  // Make D1 binding available to getDb() in Cloudflare Workers
  // In Cloudflare, env.DB is the D1 binding; in local dev, d1-shim sets globalThis.__D1__
  const env = context.locals.runtime?.env;
  if (env?.DB) {
    (globalThis as Record<string, unknown>).__D1__ = env.DB;
  }

  if (isPublicPath(pathname)) {
    return next();
  }

  const sessionId = cookies.get('hayd_session')?.value;
  if (!sessionId) {
    if (pathname.startsWith('/app') || pathname.startsWith('/admin')) {
      return Response.redirect(new URL('/login', url), 302);
    }
    return next();
  }

  const session = await getSession(sessionId);
  if (!session) {
    cookies.delete('hayd_session', { path: '/' });
    if (pathname.startsWith('/app') || pathname.startsWith('/admin')) {
      return Response.redirect(new URL('/login', url), 302);
    }
    return next();
  }

  const user = await import('@/lib/db/client').then((m) => m.findUserById(session.user_id));
  if (!user || user.status === 'deleted') {
    cookies.delete('hayd_session', { path: '/' });
    return Response.redirect(new URL('/login', url), 302);
  }

  if (user.status === 'inactive') {
    if (pathname !== '/inactive') {
      return Response.redirect(new URL('/inactive', url), 302);
    }
    context.locals.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    context.locals.session = {
      id: session.id,
      userId: session.user_id,
      expiresAt: session.expires_at,
    };
    return next();
  }

  context.locals.user = {
    id: user.id,
    email: user.email,
    role: user.role,
  };
  context.locals.session = {
    id: session.id,
    userId: session.user_id,
    expiresAt: session.expires_at,
  };

  if (pathname.startsWith('/admin') && user.role !== 'admin') {
    return Response.redirect(new URL('/app', url), 302);
  }

  return next();
});
