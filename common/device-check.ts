import type { DeviceAssessment, DeviceMember, DeviceReport } from '@root/compliance/site/types';

import { TEAM } from '@root/compliance/site/facts';
import { DEVICE_CHECK_SCRIPT, isTerminatedAccount } from '@root/compliance/site/records';

export const DEVICE_CHECK_COMMAND = `curl -fsSL ${DEVICE_CHECK_SCRIPT} | bash -s -- --copy`;

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
};

export type DeviceCheckInResult = { success: true; data: { device: DeviceReport; assessment: DeviceAssessment; checked_at: string } } | { success: false; message: string };

export type DeviceFleetResult = { success: true; freshDays: number; member: DeviceMember | null } | { success: false; message: string };

// NOTE(jimmylee)
// Mirrors the API's own check, so it is the API, not this page, that decides
// whether a laptop is encrypted. A team member who is not on the roster never
// sees the device check, and the API refuses them anyway.
export function isCurrentTeamMember(viewer: { id?: string | null } | null | undefined): boolean {
  return typeof viewer?.id === 'string' && TEAM.some((person) => person.userId === viewer.id) && !isTerminatedAccount(viewer);
}

// NOTE(jimmylee)
// Accepts exactly what `device-check.sh --copy` puts on the clipboard. The
// shape is checked here only so a wrong paste is caught before it is sent;
// the API validates every field again and decides compliance from the raw
// values.
export function readDeviceReport(text: string): { device: DeviceCheckInput } | { error: string } | null {
  const trimmed = text.trim();
  if (!trimmed) return null;
  let parsed: any;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return { error: 'This is not a device check report. Run the command above and paste what it copies.' };
  }
  const device = parsed && typeof parsed === 'object' && parsed.device && typeof parsed.device === 'object' ? parsed.device : parsed;
  if (!device || typeof device !== 'object' || typeof device.device_ref !== 'string' || typeof device.model !== 'string' || typeof device.os_version !== 'string' || typeof device.filevault_status !== 'string' || !device.data_volume || !device.removable_media) {
    return { error: 'This is not a device check report. Run the command above and paste what it copies.' };
  }
  return { device };
}
