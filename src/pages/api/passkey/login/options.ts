import { generateAuthenticationOptions } from '@simplewebauthn/server';
import { findByEmail, findPasskeysByUser } from '@/lib/db/client';
import type { UserPasskey } from '@/lib/db/schema';
import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async (context) => {
  let email = '';
  try {
    const body = await context.request.json();
    email = String(body.email || '').trim().toLowerCase();
  } catch {
    // Email is optional (usernameless / resident key login)
  }

  let userPasskeys: UserPasskey[] = [];
  if (email) {
    const user = await findByEmail(email);
    if (user) {
      userPasskeys = await findPasskeysByUser(user.id);
    }
  }

  const rpID = context.url.hostname;

  const options = await generateAuthenticationOptions({
    rpID,
    allowCredentials: userPasskeys.map((pk) => ({
      id: pk.id,
      type: 'public-key',
      transports: pk.transports ? JSON.parse(pk.transports) : undefined,
    })),
    userVerification: 'preferred',
  });

  context.cookies.set('hayd_login_challenge', options.challenge, {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
    maxAge: 300, // 5 minutes
  });

  return new Response(JSON.stringify(options), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
