const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTROL_CHARS = new RegExp(
  '[' + String.fromCharCode(0) + '-' + String.fromCharCode(31) + ']',
  'g',
);

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email) && email.length <= 254;
}

export function sanitizeText(value: string, maxLength = 500): string {
  return value.replace(CONTROL_CHARS, '').slice(0, maxLength);
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return '***';
  const maskedLocal =
    local.length <= 2
      ? '*'.repeat(local.length)
      : `${local[0]}***${local[local.length - 1]}`;
  return `${maskedLocal}@${domain}`;
}
