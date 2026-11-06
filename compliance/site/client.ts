import type { DeviceAssessment, DeviceMember, DeviceReport, EvidenceMeta } from '@root/compliance/site/types';

import { API_HOST, TEAM } from '@root/compliance/site/facts';
import { DEVICE_CHECK_IN, DEVICE_CHECK_SCRIPT, EVIDENCE_ENDPOINTS, isTerminatedAccount } from '@root/compliance/site/records';
import type { EvidenceKey } from '@root/compliance/site/records';

export const DEVICE_CHECK_COMMAND = `curl -fsSL ${DEVICE_CHECK_SCRIPT} | bash -s -- --copy`;

export const DEVICE_CHECK_RECORD_URL = '/compliance/removable-media';

const TIMEOUT_MS = 25000;

export type EvidenceRead<T> = { ok: true; data: T } | { ok: false; status: number | null };

export function evidenceUrl(key: EvidenceKey, host: string = API_HOST): string {
  return `${host}${EVIDENCE_ENDPOINTS[key]}`;
}

export async function readEvidence<T extends { evidence: EvidenceMeta }>(path: string, options: { host?: string; fetcher?: typeof fetch } = {}): Promise<EvidenceRead<T>> {
  const fetcher = options.fetcher ?? fetch;
  try {
    const response = await fetcher(`${options.host ?? API_HOST}${path}`, { headers: { Accept: 'application/json' }, cache: 'no-store', signal: AbortSignal.timeout(TIMEOUT_MS) });
    const body: unknown = response.ok ? await response.json() : null;
    const data = body && typeof body === 'object' ? (body as { data?: unknown }).data : null;
    if (data && typeof data === 'object' && 'evidence' in data) return { ok: true, data: data as T };
    return { ok: false, status: response.status };
  } catch {
    return { ok: false, status: null };
  }
}

export function fetchEvidence<T extends { evidence: EvidenceMeta }>(key: EvidenceKey, options: { host?: string; fetcher?: typeof fetch } = {}): Promise<EvidenceRead<T>> {
  return readEvidence<T>(EVIDENCE_ENDPOINTS[key], options);
}

export type DeviceCheckInput = {
  tool_version: string;
  device_ref: string;
  model: string;
  chip: string;
  os_version: string;
  filevault_status: string;
  data_volume: { encrypted: boolean; filevault: boolean };
  mdm_enrolled: boolean;
  removable_media: { mounted: number; unencrypted_writable: number };
  anti_malware?: { gatekeeper_status: string; xprotect_version: string; xprotect_installed_at: string; xprotect_updates: boolean; security_updates: boolean };
  firewall_status?: string;
  generated_at?: string;
  check?: string;
};

export type DeviceCheckInResult = { success: true; data: { device: DeviceReport; assessment: DeviceAssessment; checked_at: string } } | { success: false; message: string };

export type DeviceFleetResult = { success: true; freshDays: number; member: DeviceMember | null } | { success: false; message: string };

export function isCurrentTeamMember(viewer: { id?: string | null } | null | undefined): boolean {
  return typeof viewer?.id === 'string' && TEAM.some((person) => person.userId === viewer.id) && !isTerminatedAccount(viewer);
}

const NOT_A_REPORT = 'This is not a device check report. Run the command above and paste what it copies.';

export function readDeviceReport(text: string): { device: DeviceCheckInput } | { error: string } | null {
  const trimmed = text.trim();
  if (!trimmed) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return { error: NOT_A_REPORT };
  }
  const outer = parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : null;
  const inner = outer && outer.device && typeof outer.device === 'object' ? (outer.device as Record<string, unknown>) : outer;
  if (!inner || typeof inner.device_ref !== 'string' || typeof inner.model !== 'string' || typeof inner.os_version !== 'string' || typeof inner.filevault_status !== 'string' || !inner.data_volume || !inner.removable_media) return { error: NOT_A_REPORT };
  return { device: inner as unknown as DeviceCheckInput };
}

function rejection(status: number, message: string): string {
  if (status === 400 && message) return `The API rejected this report: ${message} Run the command again and paste the new report.`;
  if (status === 401) return 'Your session has expired. Sign in again, then send the report.';
  if (status === 403) return 'Device check-ins are limited to current INTDEV team members.';
  if (status === 409) return 'This laptop is already reported by another team member. Run the check on your own laptop and paste that report.';
  if (status === 429) return 'Too many reports in a short time. Wait a minute, then send it again.';
  return 'The report could not be sent. Please try again.';
}

export async function sendDeviceCheckIn(options: { key: string; device: DeviceCheckInput; host?: string; fetcher?: typeof fetch }): Promise<DeviceCheckInResult> {
  const fetcher = options.fetcher ?? fetch;
  try {
    const response = await fetcher(`${options.host ?? API_HOST}${DEVICE_CHECK_IN}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${options.key}`, 'X-API-KEY': options.key, Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ device: options.device }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: 'no-store',
    });
    const result: { success?: unknown; error?: unknown; message?: unknown; data?: { assessment?: unknown } } | null = await response.json().catch(() => null);
    if (!response.ok || result?.success !== true || !result.data?.assessment) {
      const message = result?.error === true && typeof result.message === 'string' ? result.message : '';
      return { success: false, message: rejection(response.status, message) };
    }
    return { success: true, data: result.data as Extract<DeviceCheckInResult, { success: true }>['data'] };
  } catch {
    return { success: false, message: 'We could not reach the API, so we cannot tell whether the report was recorded. Check Your laptops below before sending it again.' };
  }
}

export async function readDeviceFleetMember(options: { id: string; host?: string; fetcher?: typeof fetch }): Promise<DeviceFleetResult> {
  const read = await readEvidence<{ evidence: EvidenceMeta; members: DeviceMember[]; fresh_days: number; live_check: string }>(EVIDENCE_ENDPOINTS.devices, options);
  if (!read.ok || !Array.isArray(read.data.members)) return { success: false, message: 'The fleet record is unavailable right now.' };
  if (read.data.live_check !== 'verified') return { success: false, message: 'The fleet record could not be read from the database right now.' };
  return { success: true, freshDays: read.data.fresh_days, member: read.data.members.find((member) => member.user_id === options.id) ?? null };
}
