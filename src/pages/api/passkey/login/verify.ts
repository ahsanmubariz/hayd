import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import { findPasskeyById, findUserById, updatePasskeyCounter } from '@/lib/db/client';
import { createSession, signSessionId } from '@/lib/auth/session';
import type { APIRoute } from 'astro';

export const prerender = false;

// Helper to convert base64url string to Uint8Array
function base64urlToUint8Array(base64url: string): Uint8Array {
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export const POST: APIRoute = async (context) => {
  const expectedChallenge = context.cookies.get('hayd_login_challenge')?.value;
  if (!expectedChallenge) {
    return new Response(JSON.stringify({ error: 'Missing challenge' }), { status: 400 });
  }

  let body;
  try {
    body = await context.request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const credentialId = body.id;
  const passkey = await findPasskeyById(credentialId);
  if (!passkey) {
    return new Response(JSON.stringify({ error: 'Passkey credential not registered' }), { status: 404 });
  }

  const user = await findUserById(passkey.user_id);
  if (!user || user.status === 'deleted') {
    return new Response(JSON.stringify({ error: 'User not found or deleted' }), { status: 403 });
  }

  const rpID = context.url.hostname;
  const origin = context.url.origin;

  try {
    const verification = await verifyAuthenticationResponse({
      response: body,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      credential: {
        id: passkey.id,
        publicKey: base64urlToUint8Array(passkey.public_key) as any,
        counter: passkey.counter,
        transports: passkey.transports ? JSON.parse(passkey.transports) : undefined,
      },
      requireUserVerification: false,
    });

    if (verification.verified && verification.authenticationInfo) {
      const { newCounter } = verification.authenticationInfo;
      await updatePasskeyCounter(passkey.id, newCounter);

      // Create session
      const session = await createSession(user.id);
      const signedSessionId = await signSessionId(session.id);

      // Set signed session cookie (maxAge 90 days / 3 months)
      context.cookies.set('hayd_session', signedSessionId, {
        httpOnly: true,
        sameSite: 'lax',
        secure: import.meta.env.PROD,
        path: '/',
        maxAge: 60 * 60 * 24 * 90,
      });

      context.cookies.delete('hayd_login_challenge', { path: '/' });

      return new Response(JSON.stringify({ verified: true, role: user.role }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Authentication verification failed' }), { status: 400 });
  } catch (err: any) {
    console.error('Authentication verification error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
};
