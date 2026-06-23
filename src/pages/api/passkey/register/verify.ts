import { verifyRegistrationResponse } from '@simplewebauthn/server';
import { createPasskey } from '@/lib/db/client';
import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async (context) => {
  const user = context.locals.user;
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const expectedChallenge = context.cookies.get('hayd_register_challenge')?.value;
  if (!expectedChallenge) {
    return new Response(JSON.stringify({ error: 'Missing challenge' }), { status: 400 });
  }

  let body;
  try {
    body = await context.request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const rpID = context.url.hostname;
  const origin = context.url.origin;

  try {
    const verification = await verifyRegistrationResponse({
      response: body,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      requireUserVerification: false,
    });

    if (verification.verified && verification.registrationInfo) {
      const { credential } = verification.registrationInfo;

      // Base64url encode function for web environment compatibility
      const uint8ArrayToBase64url = (array: Uint8Array): string => {
        const base64 = btoa(String.fromCharCode(...array));
        return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
      };

      const pubKeyBase64url = uint8ArrayToBase64url(credential.publicKey);
      const credentialIdBase64url = credential.id; // already base64url string in verification result

      await createPasskey({
        id: credentialIdBase64url,
        user_id: user.id,
        public_key: pubKeyBase64url,
        counter: credential.counter,
        transports: JSON.stringify(body.response.transports || []),
      });

      context.cookies.delete('hayd_register_challenge', { path: '/' });

      return new Response(JSON.stringify({ verified: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Registration verification failed' }), { status: 400 });
  } catch (err: any) {
    console.error('Registration verification error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
};
