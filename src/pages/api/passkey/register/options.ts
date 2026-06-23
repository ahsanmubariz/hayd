import { generateRegistrationOptions } from '@simplewebauthn/server';
import { findPasskeysByUser } from '@/lib/db/client';
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  const user = context.locals.user;
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const userPasskeys = await findPasskeysByUser(user.id);

  const rpName = 'Hayd Tracker';
  const rpID = context.url.hostname;

  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: new TextEncoder().encode(user.id),
    userName: user.email,
    userDisplayName: user.email.split('@')[0],
    attestationType: 'none',
    excludeCredentials: userPasskeys.map((pk) => ({
      id: pk.id,
      type: 'public-key',
      transports: pk.transports ? JSON.parse(pk.transports) : undefined,
    })),
    authenticatorSelection: {
      residentKey: 'required',
      userVerification: 'preferred',
    },
  });

  context.cookies.set('hayd_register_challenge', options.challenge, {
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
