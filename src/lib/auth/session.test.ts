import { describe, it, expect } from 'vitest';
import { signSessionId, verifySessionId } from './session';

describe('Signed Sessions', () => {
  it('should successfully sign and verify a session ID', async () => {
    const originalSessionId = 'test-session-id-12345';
    const signed = await signSessionId(originalSessionId);

    expect(signed).toContain(originalSessionId);
    expect(signed.split('.')).toHaveLength(2);

    const verified = await verifySessionId(signed);
    expect(verified).toBe(originalSessionId);
  });

  it('should fail verification for tampered session IDs', async () => {
    const originalSessionId = 'test-session-id-12345';
    const signed = await signSessionId(originalSessionId);

    // Tamper with the session ID part
    const tamperedSessionId = 'test-session-id-12346';
    const parts = signed.split('.');
    const tampered = `${tamperedSessionId}.${parts[1]}`;

    const verified = await verifySessionId(tampered);
    expect(verified).toBeNull();
  });

  it('should fail verification for tampered signatures', async () => {
    const originalSessionId = 'test-session-id-12345';
    const signed = await signSessionId(originalSessionId);

    // Tamper with the signature part
    const parts = signed.split('.');
    const tamperedSig = parts[1].replace(/.$/, parts[1].endsWith('0') ? '1' : '0');
    const tampered = `${parts[0]}.${tamperedSig}`;

    const verified = await verifySessionId(tampered);
    expect(verified).toBeNull();
  });

  it('should fail verification for invalid formatted strings', async () => {
    expect(await verifySessionId('')).toBeNull();
    expect(await verifySessionId('invalid-string')).toBeNull();
    expect(await verifySessionId('a.b.c')).toBeNull();
  });
});
