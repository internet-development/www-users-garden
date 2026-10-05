export const SMS_CONSENT_VERSION = '2026-10-02';
export const SMS_CONSENT_PROMPT = 'Internet Development Studio Company: Reply YES to agree to receive customer-care and service-support text messages from Internet Development Studio Company. Message frequency varies. Message and data rates may apply. Reply HELP for help or CANCEL to opt out. Reply NO to decline.';
export const SMS_NUMBER = '+14256992634';
export const SMS_NUMBER_DISPLAY = '(425) 699-2634';
export const SMS_CONSENT_URL = 'https://internet.dev/consent';
export const SMS_TERMS_URL = 'https://txt.dev/wwwjim/intdev-terms-of-service';
export const SMS_PRIVACY_URL = 'https://txt.dev/wwwjim/intdev-privacy-policy';

export type SmsContact = {
  phone: string;
  status: 'saved' | 'pending' | 'confirmed' | 'declined' | 'stopped';
  delivery: string | null;
  requestedAt: string | null;
  confirmedAt: string | null;
};

export type SmsSettings = { contact: SmsContact | null; available: boolean };
export type SmsResult = { success: true; data: SmsSettings } | { success: false; message: string };
export type PhoneResult = { success: true; phone: string } | { success: false; message: string };

export function normalizePhoneNumber(value: unknown): string | null {
  if (typeof value !== 'string' || value.length > 40) return null;
  const trimmed = value.trim();
  if (!/^\+?[\d\s().-]+$/.test(trimmed)) return null;
  const digits = trimmed.replace(/\D/g, '');
  if (trimmed.startsWith('+')) return /^[1-9]\d{7,14}$/.test(digits) ? `+${digits}` : null;
  if (/^[2-9]\d{9}$/.test(digits)) return `+1${digits}`;
  if (/^1[2-9]\d{9}$/.test(digits)) return `+${digits}`;
  return null;
}
