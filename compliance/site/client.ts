import type { DeviceAssessment, DeviceMember, DeviceReport, EvidenceMeta, TrainingCompletion, TrainingCourse, TrainingSignature } from '@root/compliance/site/types';

import { API_HOST, CONTACTS, TEAM } from '@root/compliance/site/facts';
import { DEVICE_CHECK_IN, DEVICE_CHECK_SCRIPT, EVIDENCE_ENDPOINTS, SUPPORTED_MACOS, TRAINING_ACKNOWLEDGEMENT, TRAINING_SIGN, isTerminatedAccount } from '@root/compliance/site/records';
import type { EvidenceKey } from '@root/compliance/site/records';

// NOTE(@claude)
// The SHA-256 of public/compliance/device-check.sh, compiled into each site that
// renders the kit. The commands run the script only when the downloaded copy
// matches it, so a changed or substituted script on the API host is refused
// rather than run, which a pipe from curl into bash cannot do. The spec fails
// until this is updated with the script, and a site serving an older kit than
// the API refuses the new script until both are deployed.
export const DEVICE_CHECK_SCRIPT_SHA256 = 'b5aff087148a4f620789b7354ee482ae7066900b0789f5f838f887e2e3186377';

export const DEVICE_CHECK_COMMAND = `f="$(mktemp -d)/device-check.sh" && curl -fsSL -o "$f" ${DEVICE_CHECK_SCRIPT} && echo "${DEVICE_CHECK_SCRIPT_SHA256}  $f" | shasum -a 256 -c - && bash "$f" --copy`;

export const DEVICE_CHECK_DOWNLOADED_COMMAND = `cd ~/Downloads && echo "${DEVICE_CHECK_SCRIPT_SHA256}  device-check.sh" | shasum -a 256 -c - && bash device-check.sh --copy`;

export type HelpLink = { label: string; href: string };

export type DeviceCheckRequirement = { name: string; detail: string; link: HelpLink };

const APPLE_TERMINAL = 'https://support.apple.com/guide/terminal/open-or-quit-terminal-apd5265185d-f365-44cb-8b09-71a064a42125/mac';
const APPLE_UPDATE_MACOS = 'https://support.apple.com/en-us/108382';
const APPLE_DOWNLOAD_MACOS = 'https://support.apple.com/en-us/102662';
const APPLE_MACOS_VERSION = 'https://support.apple.com/en-us/109033';
const APPLE_FILEVAULT_HELP = 'https://support.apple.com/guide/mac-help/protect-data-on-your-mac-with-filevault-mh11785/mac';
const APPLE_FIREWALL_HELP = 'https://support.apple.com/guide/mac-help/block-connections-to-your-mac-with-a-firewall-mh34041/mac';
const APPLE_SAFE_APPS = 'https://support.apple.com/en-us/102445';
const APPLE_UPDATE_SETTINGS = 'https://support.apple.com/guide/mac-help/software-update-settings-on-mac-mchla7037245/mac';
const APPLE_ENCRYPT_DRIVE = 'https://support.apple.com/guide/disk-utility/encrypt-protect-a-storage-device-password-dskutl35612/mac';
const APPLE_BACKGROUND_SECURITY = 'https://support.apple.com/en-us/102657';

export const DEVICE_CHECK_REQUIREMENTS: DeviceCheckRequirement[] = [
  {
    name: `A Mac on macOS ${SUPPORTED_MACOS.minimum_major} or later`,
    detail: `The check reads macOS and runs only on a Mac. A laptop passes only on macOS ${SUPPORTED_MACOS.minimum_major} or later, so update it first if About This Mac shows an older version.`,
    link: { label: 'Update macOS', href: APPLE_UPDATE_MACOS },
  },
  {
    name: 'Terminal',
    detail: 'Built into macOS, in Applications, then Utilities, or found by typing Terminal in Spotlight. Nothing else needs to be installed: curl, bash, and the clipboard tool the check uses come with macOS.',
    link: { label: 'Open Terminal', href: APPLE_TERMINAL },
  },
  {
    name: 'The device check script',
    detail: 'The command Device check shows downloads it to a private temporary folder, confirms its SHA-256 matches the version users.garden was published with, and only then runs it. To read it first, download device-check.sh to your Downloads folder and run Device check’s second command, which makes the same check before running your copy.',
    link: { label: 'Download device-check.sh', href: DEVICE_CHECK_SCRIPT },
  },
];

export type DeviceFixId = 'rerun' | 'filevault' | 'removable_media' | 'gatekeeper' | 'xprotect' | 'automatic_updates' | 'macos' | 'firewall';

export type DeviceFix = { id: DeviceFixId; title: string; problem: string; steps: string[]; command: string | null; commandNote: string | null; links: HelpLink[] };

const SOFTWARE_UPDATE_DEFAULTS = '/Library/Preferences/com.apple.SoftwareUpdate';

export const DEVICE_FIXES: Record<DeviceFixId, DeviceFix> = {
  rerun: {
    id: 'rerun',
    title: 'Run the check again',
    problem: 'The last report from this laptop is out of date, or it came from an older version of the check that did not read anti-malware, the firewall, or the patch state.',
    steps: ['Run the command in step 1 on this laptop.', 'Paste the new report and send it.'],
    command: null,
    commandNote: null,
    links: [],
  },
  filevault: {
    id: 'filevault',
    title: 'Turn on FileVault',
    problem: 'FileVault is off, or it is still encrypting the disk. A laptop passes only once FileVault is on and has finished encrypting.',
    steps: [
      'Choose Apple menu, then System Settings, click Privacy & Security in the sidebar, then click FileVault.',
      'Click Turn On, and choose how to unlock the disk if you forget your password. If you create a recovery key, keep it in your password manager.',
      'Keep the Mac plugged in while FileVault encrypts the disk in the background. When FileVault no longer shows encryption in progress, run the check again.',
    ],
    command: null,
    commandNote: null,
    links: [{ label: 'Protect data on your Mac with FileVault', href: APPLE_FILEVAULT_HELP }],
  },
  removable_media: {
    id: 'removable_media',
    title: 'Eject the unencrypted external drive',
    problem: 'An external drive that is not encrypted and can be written to was mounted when the check ran. INTDEV’s rules of conduct prohibit writing company data to removable media.',
    steps: [
      'In the Finder sidebar, click the eject button beside each external drive, then unplug it.',
      'If you hold an approved exception to keep company data on a drive, erase it as an encrypted APFS volume in Disk Utility first. Erasing deletes everything on the drive.',
      'Run the check again with no unencrypted drive connected.',
    ],
    command: null,
    commandNote: null,
    links: [{ label: 'Encrypt a storage device in Disk Utility', href: APPLE_ENCRYPT_DRIVE }],
  },
  gatekeeper: {
    id: 'gatekeeper',
    title: 'Turn on Gatekeeper',
    problem: 'Gatekeeper is not assessing apps, so macOS lets any app open without checking who made it.',
    steps: ['Open System Settings, click Privacy & Security, then scroll down to Security.', 'Under Allow apps downloaded from, choose App Store, or App Store and identified developers.', 'Run the check again.'],
    command: null,
    commandNote: null,
    links: [{ label: 'Safely open apps on your Mac', href: APPLE_SAFE_APPS }],
  },
  xprotect: {
    id: 'xprotect',
    title: 'Install the XProtect definitions',
    problem: 'The check found no XProtect malware definitions on this Mac.',
    steps: [
      'Turn on automatic security responses (Install Security Responses and system files), as described under that fix.',
      'Open System Settings, click General, then Software Update, and install every update it offers. Restart if it asks.',
      `Leave the Mac on and connected to the internet. On macOS ${SUPPORTED_MACOS.minimum_major} and later, macOS downloads the XProtect definitions from Apple in the background, without asking.`,
      `Run the check again. If it still finds no definitions a day later, tell ${CONTACTS.support}.`,
    ],
    command: 'sudo xprotect update',
    commandNote: `On macOS ${SUPPORTED_MACOS.minimum_major} and later, this command asks Apple for the newest definitions now instead of waiting. It asks for your Mac password, and it does not always install them at once, so run the check again afterward.`,
    links: [{ label: 'Update macOS on Mac', href: APPLE_UPDATE_MACOS }],
  },
  automatic_updates: {
    id: 'automatic_updates',
    title: 'Install security responses and security updates automatically',
    problem: 'macOS is set not to install Apple’s security responses or security updates on its own, so XProtect definitions and security fixes can fall behind.',
    steps: [
      'Open System Settings, click General, then Software Update, and click the info button next to Automatic Updates.',
      'Turn on Install Security Responses and system files, then click Done.',
      'On macOS 26.1 and later, also open Privacy & Security, go to Background Security Improvements, and make sure Automatically Install is on.',
      'Run the check again.',
    ],
    command: `sudo defaults write ${SOFTWARE_UPDATE_DEFAULTS} ConfigDataInstall -bool true && sudo defaults write ${SOFTWARE_UPDATE_DEFAULTS} CriticalUpdateInstall -bool true`,
    commandNote: 'Or run this command, which turns on the two settings the check reads. It asks for your Mac password.',
    links: [
      { label: 'Software Update settings on Mac', href: APPLE_UPDATE_SETTINGS },
      { label: 'About Background Security Improvements', href: APPLE_BACKGROUND_SECURITY },
    ],
  },
  macos: {
    id: 'macos',
    title: `Update to macOS ${SUPPORTED_MACOS.minimum_major} or later`,
    problem: `This laptop runs a macOS older than macOS ${SUPPORTED_MACOS.minimum_major}, and Apple no longer ships security updates for it.`,
    steps: [
      'Open System Settings, click General, then Software Update, and install the newest macOS it offers.',
      `If Software Update offers no version of macOS ${SUPPORTED_MACOS.minimum_major} or later, this Mac cannot run a supported macOS. Tell the CEO at ${CONTACTS.ceo} so it can be replaced or retired.`,
      'Run the check again after the update.',
    ],
    command: null,
    commandNote: null,
    links: [
      { label: 'Update macOS on Mac', href: APPLE_UPDATE_MACOS },
      { label: 'Download and install macOS', href: APPLE_DOWNLOAD_MACOS },
      { label: 'Find out which macOS your Mac is using', href: APPLE_MACOS_VERSION },
    ],
  },
  firewall: {
    id: 'firewall',
    title: 'Turn on the firewall',
    problem: 'The macOS application firewall is off. INTDEV’s security awareness training asks every team member to leave it on.',
    steps: ['Choose Apple menu, then System Settings, click Network in the sidebar, then click Firewall.', 'Turn on Firewall.', 'Run the check again.'],
    command: 'sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate on',
    commandNote: 'Or run this command. It asks for your Mac password.',
    links: [{ label: 'Block connections to your Mac with a firewall', href: APPLE_FIREWALL_HELP }],
  },
};

export type DeviceFixInput = Pick<DeviceReport, 'anti_malware'> & { assessment: DeviceAssessment; current?: boolean };

export function deviceFixes(record: DeviceFixInput): DeviceFixId[] {
  const { assessment } = record;
  const malware = record.anti_malware;
  const fixes: DeviceFixId[] = [];
  if (record.current === false || assessment.anti_malware_active === null || assessment.firewall_on === null || assessment.patch_current === null) fixes.push('rerun');
  if (!assessment.disk_encrypted) fixes.push('filevault');
  if (!assessment.removable_media_clear) fixes.push('removable_media');
  if (malware && !malware.gatekeeper.on) fixes.push('gatekeeper');
  if (malware && !malware.xprotect.version) fixes.push('xprotect');
  if ((malware && !malware.automatic_updates.xprotect) || assessment.security_updates_on === false) fixes.push('automatic_updates');
  if (assessment.os_supported === false) fixes.push('macos');
  if (assessment.firewall_on === false) fixes.push('firewall');
  return fixes;
}

export const DEVICE_CHECK_RECORD_URL = '/compliance/removable-media';

export const TRAINING_COURSE_URL = '/compliance/security-awareness-training';

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

export type TrainingMember = TrainingCompletion & { signatures: TrainingSignature[]; signed: boolean };

export type TrainingRecordResult = { success: true; courses: TrainingCourse[]; member: TrainingMember | null } | { success: false; message: string };

export type TrainingSignResult = { success: true; signature: TrainingSignature } | { success: false; message: string };

export async function readTrainingMember(options: { id: string; host?: string; fetcher?: typeof fetch }): Promise<TrainingRecordResult> {
  const read = await readEvidence<{ evidence: EvidenceMeta; courses: TrainingCourse[]; records: TrainingMember[]; live_check: string }>(EVIDENCE_ENDPOINTS.training, options);
  if (!read.ok || !Array.isArray(read.data.records) || !Array.isArray(read.data.courses)) return { success: false, message: 'The training record is unavailable right now.' };
  if (read.data.live_check !== 'verified') return { success: false, message: 'The training record could not be read from the database right now.' };
  return { success: true, courses: read.data.courses, member: read.data.records.find((record) => record.user_id === options.id) ?? null };
}

export async function sendTrainingSignature(options: { key: string; course: Pick<TrainingCourse, 'id' | 'version'>; host?: string; fetcher?: typeof fetch }): Promise<TrainingSignResult> {
  const fetcher = options.fetcher ?? fetch;
  try {
    const response = await fetcher(`${options.host ?? API_HOST}${TRAINING_SIGN}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${options.key}`, 'X-API-KEY': options.key, Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ course_id: options.course.id, version: options.course.version, acknowledgement: TRAINING_ACKNOWLEDGEMENT }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: 'no-store',
    });
    const result: { success?: unknown; error?: unknown; message?: unknown; data?: { signature?: TrainingSignature } } | null = await response.json().catch(() => null);
    if (response.ok && result?.success === true && result.data?.signature) return { success: true, signature: result.data.signature };
    if (response.status === 401) return { success: false, message: 'Your session has expired. Sign in again, then sign the course.' };
    if (response.status === 400 && result?.error === true && typeof result.message === 'string') return { success: false, message: `The API refused the signature: ${result.message}` };
    if (response.status === 429) return { success: false, message: 'Too many requests in a short time. Wait a minute, then sign again.' };
    return { success: false, message: 'The signature could not be recorded. Please try again.' };
  } catch {
    return { success: false, message: 'We could not reach the API, so we cannot tell whether the signature was recorded. Reload this page before signing again.' };
  }
}
