import type { AccessGrant, ChecklistStep, DeviceChip, DiskEncryptionStandard, EncryptionSource, SystemAccount, TerminationRecord, TrainingCompletion, TrainingCourse } from '@root/compliance/site/types';

import { FORMER_TEAM, TEAM } from '@root/compliance/site/facts';

export const RECORDED_AT = '2026-11-04T03:05:23.589Z';

export const EVIDENCE_ENDPOINTS = {
  index: '/api/compliance',
  accessRequests: '/api/compliance/access-requests',
  terminations: '/api/compliance/terminations',
  training: '/api/compliance/training',
  vulnerabilities: '/api/compliance/vulnerabilities',
  dataDeletions: '/api/compliance/data-deletions',
  report: '/api/compliance/report',
  releases: '/api/compliance/releases',
  devices: '/api/compliance/devices',
  encryption: '/api/compliance/encryption',
  pages: '/api/compliance/pages',
  team: '/api/compliance/team',
  policies: '/api/compliance/policies',
  vendors: '/api/compliance/vendors',
  network: '/api/compliance/network',
  penetrationTest: '/api/compliance/penetration-test',
  bugBounty: '/api/compliance/bug-bounty',
} as const;

export type EvidenceKey = keyof typeof EVIDENCE_ENDPOINTS;

export const COMPILED_EVIDENCE: readonly EvidenceKey[] = ['pages', 'team', 'policies', 'vendors', 'network', 'penetrationTest', 'bugBounty'];

export function isCompiledEvidence(key: EvidenceKey): boolean {
  return COMPILED_EVIDENCE.includes(key);
}

export const DEVICE_CHECK_IN = '/api/compliance/devices/check-in';

export const DEVICE_CHECK_SCRIPT = 'https://api.internet.dev/compliance/device-check.sh';

export const DEVICE_CHECK_FRESH_DAYS = 30;

export const REMOVABLE_MEDIA_CONTROL = {
  enforced_by: 'conduct',
  requirement: 'Team members do not write company or customer data to removable media. INTDEV’s rules of conduct prohibit it: the Information Security Policy’s acceptable use rules and the Data Management Policy forbid storing confidential information on USB drives or other removable media, and the Cryptography Policy allows it only with a documented exception approved by the CEO.',
  status: 'Enforced by conduct, not by device configuration. Each team member uses their own judgement to make sure company data never reaches removable media, and acknowledges the rule in security awareness training. INTDEV does not require device management to block writes to removable media. The device check reports any unencrypted writable removable volume mounted on a laptop, and the compliance report opens an item when it finds one.',
};

export const ENCRYPTION_RECORDED_AT = '2026-11-04';

const APPLE_FILEVAULT = 'https://support.apple.com/guide/security/volume-encryption-with-filevault-sec4c6dc1b6e/web';
const APPLE_DATA_PROTECTION = 'https://support.apple.com/guide/security/data-protection-overview-secf6276da8a/web';
const APPLE_ENCRYPTION_OVERVIEW = 'https://support.apple.com/guide/security/encryption-and-data-protection-overview-sece3bee0835/web';

export const APPLE_ENCRYPTION_SOURCES = {
  fileVault: { title: 'Apple Platform Security: Volume encryption with FileVault in macOS', href: APPLE_FILEVAULT, quote: 'FileVault uses the AES-XTS data encryption algorithm to protect full volumes on internal and removable storage devices.' },
  appleSilicon: { title: 'Apple Platform Security: Volume encryption with FileVault in macOS', href: APPLE_FILEVAULT, quote: 'FileVault on a Mac with Apple silicon is implemented using Data Protection Class C with a volume key.' },
  aes256: {
    title: 'Apple Platform Security: Data Protection overview',
    href: APPLE_DATA_PROTECTION,
    quote: 'On A14 through A18 and M1 or later devices, the encryption uses AES-256 in XTS mode, where the 256-bit per-file-key goes through a Key Derivation Function (NIST Special Publication 800-108) to derive a 256-bit value and a 256-bit cipher key.',
  },
  aes128: { title: 'Apple Platform Security: Data Protection overview', href: APPLE_DATA_PROTECTION, quote: 'On A9 through A13 and S5 or later devices, the encryption uses AES-128 in XTS mode, where the 256-bit per file key is split to provide a 128-bit value and a 128-bit cipher key.' },
  t2: {
    title: 'Apple Platform Security: Volume encryption with FileVault in macOS',
    href: APPLE_FILEVAULT,
    quote: 'On a Mac with Apple silicon and a Mac with an Apple T2 Security Chip, encrypted internal storage devices directly connected to the Secure Enclave leverage its hardware security capabilities as well as that of the AES Engine.',
  },
  intel: { title: 'Apple Platform Security: Encryption and Data Protection overview', href: APPLE_ENCRYPTION_OVERVIEW, quote: '(An Intel-based Mac with a T1 or lacking a Secure Enclave doesn’t use dedicated silicon to protect its FileVault encryption keys.)' },
  removable: {
    title: 'Apple Platform Security: Volume encryption with FileVault in macOS',
    href: APPLE_FILEVAULT,
    quote: 'Encryption of removable storage devices doesn’t utilize the security capabilities of the Secure Enclave and instead is performed in the same manner as an Intel-based Mac without the T2 chip.',
  },
  fileVaultOff: {
    title: 'Apple Platform Security: Volume encryption with FileVault in macOS',
    href: APPLE_FILEVAULT,
    quote: 'If FileVault isn’t turned on in a Mac with Apple silicon or a Mac with the T2 chip during the initial Setup Assistant process, the volume is still encrypted but the volume encryption key is protected only by the hardware UID in the Secure Enclave.',
  },
  onByDefault: {
    title: 'Apple Platform Security: Data Protection overview',
    href: APPLE_DATA_PROTECTION,
    quote: 'On a Mac with macOS 26.4 or later, FileVault is turned on by default, which automatically provides users the full protection of entangling the encryption key hierarchy with their password.',
  },
} satisfies Record<string, EncryptionSource>;

export const FILEVAULT_STANDARD: Record<DeviceChip, DiskEncryptionStandard> = {
  apple_silicon: {
    hardware: 'Mac with Apple silicon (M1 or later)',
    algorithm: 'AES-256 in XTS mode',
    aes_key_bits: 256,
    key_handling: 'FileVault is Data Protection Class C with a volume key. All FileVault key handling occurs in the Secure Enclave and the AES Engine encrypts the data, so encryption keys are never directly exposed to the CPU.',
    cipher: 'AES-256-XTS (Apple silicon AES Engine, keys in the Secure Enclave)',
    sources: [APPLE_ENCRYPTION_SOURCES.appleSilicon, APPLE_ENCRYPTION_SOURCES.aes256],
  },
  t2: {
    hardware: 'Intel Mac with the Apple T2 Security Chip',
    algorithm: 'AES in XTS mode. Apple does not publish the key size.',
    aes_key_bits: null,
    key_handling: 'Keys are handled in the T2 Secure Enclave, and its AES Engine encrypts the data.',
    cipher: 'AES-XTS (T2 Secure Enclave and AES Engine; Apple publishes no key size)',
    sources: [APPLE_ENCRYPTION_SOURCES.fileVault, APPLE_ENCRYPTION_SOURCES.t2],
  },
  intel: {
    hardware: 'Intel Mac without the T2 chip',
    algorithm: 'AES in XTS mode. Apple does not publish the key size.',
    aes_key_bits: null,
    key_handling: 'Encrypted in software. No dedicated silicon protects the keys.',
    cipher: 'AES-XTS (software, no Secure Enclave; Apple publishes no key size)',
    sources: [APPLE_ENCRYPTION_SOURCES.fileVault, APPLE_ENCRYPTION_SOURCES.intel],
  },
};

export const REMOVABLE_MEDIA_ENCRYPTION: DiskEncryptionStandard = {
  hardware: 'External or USB drive, only with an approved exception',
  algorithm: 'AES in XTS mode on an APFS (Encrypted) volume. Apple does not publish the key size.',
  aes_key_bits: null,
  key_handling: 'Unlocked with a unique password. The Secure Enclave is not used.',
  cipher: 'AES-XTS (APFS Encrypted, software)',
  sources: [APPLE_ENCRYPTION_SOURCES.removable],
};

export const XTS_KEY_SIZES =
  'AES-XTS uses two AES keys of the same size: one encrypts the data and the other computes the XTS tweak. A “256-bit key” in XTS-AES-128 is therefore two 128-bit halves, and the data is encrypted with AES-128, which is how Apple describes its AES-128 XTS configuration: a 256-bit key split into a 128-bit value and a 128-bit cipher key. AES-256-XTS, which Apple documents for M1 and later, uses a 256-bit cipher key. The fleet report counts a laptop as AES-256 only where Apple documents a 256-bit cipher key, which today means Apple silicon. IEEE 1619 and NIST SP 800-38E define XTS-AES only with AES-128 or AES-256, so every FileVault configuration meets the Cryptography Policy’s endpoint storage standard of AES with 128 or 256-bit keys.';

export const FILEVAULT_REQUIRED =
  'A Mac with Apple silicon or a T2 chip encrypts its internal volume even with FileVault off, but its key is then protected only by the hardware UID, not by the user’s password. FileVault ties the key to the user’s password, which is what protects a lost or stolen laptop that is powered off. That is why the device check requires FileVault on, not only an encrypted volume.';

export const CRYPTOGRAPHY_POLICY_KEYS = [
  { domain: 'Endpoint storage (SSD or HDD), including laptops', algorithm: 'AES', key_length: '128 or 256 bit', expiration: 'Not applicable' },
  { domain: 'Confidential data at rest', algorithm: 'AES', key_length: '256 bit', expiration: '1 year' },
];

export const APPLICATION_ENCRYPTION = {
  name: 'INTDEV API application-layer encryption',
  layer: 'A separate layer for a few application values. It is not disk or removable media encryption.',
  algorithm: 'AES in CTR mode',
  implementation: 'modules/aes.js in the INTDEV API, with the matching decryptor on each INTDEV site that receives these values',
  key_custody: 'One key shared by the INTDEV API and the INTDEV sites that receive these values. The API and Users Garden keep it in server-side environment variables and decrypt only on the server; maintainers also hold it in local, git-ignored environment files.',
  covers: [
    'The API key an INTDEV site receives after Google, Apple, or Bluesky sign-in, or after an account transfer. It travels in the URL only as ciphertext and is decrypted on the receiving site’s server, so the plaintext key never appears in a URL.',
    'License keys at rest in the production database, stored as ciphertext beside a SHA-256 hash used for lookup, so the database holds no plaintext license key.',
  ],
  does_not_cover: [
    'Laptop disks and removable media. This layer encrypts nothing stored on a laptop or an external drive; FileVault and APFS encryption do that.',
    'A stolen laptop. The key sits in the same environment files that FileVault protects on that disk, so this layer adds nothing once a disk can be read. FileVault is the protection for lost or stolen hardware.',
    'Exposure of the encrypted value itself. The encrypted sign-in value still signs its holder in, so it is handled as a credential.',
  ],
  status:
    'Not yet at the Cryptography Policy’s standard. Bringing this scheme to that standard is the open High finding INTDEV-2026-CRYPTO-01, coordinated with every site that shares the key. Until that finding closes, no compliance check relies on this layer: TLS protects these values in transit, and FileVault, Render, and Amazon S3 encrypt data at rest.',
  finding: 'INTDEV-2026-CRYPTO-01',
};

export const INTDEV_ORGANIZATION_DOMAINS =['internet.dev', 'users.garden', 'terminalgraph.com', 'txt.dev'];

export function isIntdevOrganizationDomain(domain: string | null | undefined): boolean {
  const value = (domain ?? '').trim().toLowerCase();
  return INTDEV_ORGANIZATION_DOMAINS.some((root) => value === root || value.endsWith(`.${root}`));
}

export const PLATFORM_ADMINS_SETTLED_AT = '2026-11-04T09:48:00.452Z';

export const DOMAIN_GRANT_BLOCK_RELEASE = '2.0.9';

export const LEVEL_NAMES: Record<number, string> = {
  0: 'Unverified',
  10: 'Verified',
  20: 'Paying (standard, no admin)',
  30: 'Co-working',
  40: 'Partner',
  100: 'Platform admin',
};

export function levelName(level: number | null): string {
  if (level === null) return 'No account';
  return LEVEL_NAMES[level] ?? `Level ${level}`;
}

const SYSTEM_ACCOUNT_RECORDS = [
  { account: 'treasury', user_id: '7da03287-2f60-4903-ad68-b9f8f27b2103', level: 100, purpose: 'Platform credit treasury. The credit system requires this account at level 100 for double-entry bookkeeping.' },
  { account: 'blogs', user_id: '78a22648-0922-4abc-8d00-93b7271b21e0', level: 100, purpose: 'Shared account of the eng@internet.dev engineering mailbox, which also receives the GuardDuty alerts. Used for INTDEV engineering posts.' },
  { account: 'caladbolg (no username; named for its internet.dev mailbox)', user_id: '83a2ea7a-9773-4e47-a44a-2e40ef54c66e', level: 100, purpose: 'Systems account for INTDEV experiments.' },
  { account: 'intdev_vendors', user_id: 'f3835b7f-28cb-4632-8b98-efe6c1b39279', level: 100, purpose: 'Service account for vendor credit distribution. POST /api/credits/vendor-distribution-to-email accepts only a platform admin with this username, so lowering it would turn that route off.' },
  { account: 'southparkcommons', user_id: 'b7dbed26-e735-4bc7-aef6-79c96743336f', level: 30, purpose: 'Example account that shows a venture capital firm what its posts could look like. Lowered from platform admin to level 30 on November 4, 2026, so it holds no administrative rights.' },
];

export const SYSTEM_ACCOUNTS: SystemAccount[] = SYSTEM_ACCOUNT_RECORDS.map((record, index) => ({
  id: `SA-2026-${String(index + 1).padStart(3, '0')}`,
  ...record,
  level_name: levelName(record.level),
  owner: 'Jimmy Lee, Chief Executive Officer',
  approved_at: '2026-11-04',
}));

const ACCOUNT_CREATED: Record<string, string> = {
  'Jimmy Lee': '2024-01-17T23:24:41.232Z',
  'Andrew Alimbuyuguen': '2024-04-11T01:22:56.786Z',
  'Elijah Seed Arita': '2024-05-16T20:08:14.689Z',
  'Hannah Suh': '2025-04-24T22:58:33.632Z',
  'Caidan Williams': '2025-05-05T20:23:57.488Z',
  'Vani Agarwal': '2026-08-27T21:59:15.439Z',
  'Sol Ruck': '2026-09-09T22:35:04.483Z',
  'Rishav Kundu': '2026-10-08T23:27:49.934Z',
};

const GRANTED_LEVEL: Record<string, number> = {
  'Jimmy Lee': 100,
  'Andrew Alimbuyuguen': 100,
  'Elijah Seed Arita': 100,
  'Hannah Suh': 100,
  'Caidan Williams': 100,
  'Sol Ruck': 100,
  'Vani Agarwal': 10,
  'Rishav Kundu': 10,
};

const APPROVER = 'Jimmy Lee, Chief Executive Officer';

const GRANTS: AccessGrant[] = TEAM.map((person, index) => {
  const level = GRANTED_LEVEL[person.name] ?? 10;
  const privileged = level === 100;
  return {
    id: `AR-2026-${String(index + 1).padStart(3, '0')}`,
    kind: 'grant',
    person: person.name,
    role: person.role,
    user_id: person.userId,
    system: 'INTDEV API (api.internet.dev)',
    request: {
      by: person.name,
      at: ACCOUNT_CREATED[person.name] ?? RECORDED_AT,
      detail: privileged ? 'Registered a Users Garden account and requested platform admin for production support of INTDEV products' : 'Registered a Users Garden account and requested standard verified access',
    },
    approval: {
      by: APPROVER,
      at: '2026-11-04',
      decision: 'Approved',
      detail: privileged ? 'Approved as required for the role in the Q4 2026 access review; platform admin is limited to staff who operate production' : 'Approved as standard access for the role; no administrative rights',
    },
    assignment: {
      level,
      level_name: levelName(level),
      previous_level: null,
      at: null,
      detail: 'Assigned to this user_id; the current level is read live from the production users table on every request',
    },
  };
});

const CONFIRMED_AT = '2026-11-04';
export const RENDER_REMOVAL_VERIFIED_AT = '2026-11-04T03:37:22.000Z';
export const LEVEL_RESTORED_AT = '2026-11-04T03:37:51.799Z';
export const ORGANIZATIONS_REMOVED_AT = '2026-11-04T03:58:41.614Z';
export const SHARED_ORGANIZATIONS_REMOVED_AT = '2026-11-04T04:29:10.752Z';
export const TERMINATIONS_REVERIFIED_AT = '2026-11-04T04:29:55.178Z';
export const ALL_TERMINATIONS_VERIFIED_AT = '2026-11-04T09:49:49.846Z';

interface Offboarding {
  account: { previous: number; level: number; at: string; detail: string };
  render: { completed_at: string; evidence: string };
  organizations: { completed_at: string; evidence: string };
  aws: string;
  close: { completed_at: string; evidence: string };
}

const REVERIFIED = 'Re-verified at 04:29 UTC on November 4, 2026, and again with every termination record at 09:49 UTC that day';

const NOT_A_RENDER_MEMBER = { completed_at: CONFIRMED_AT, evidence: `Render API read of the members of every Render workspace INTDEV administers on November 4, 2026: not a member. ${REVERIFIED}.` };

const NO_IAM_USER = `AWS IAM list-users on November 4, 2026: no IAM user exists for this person. ${REVERIFIED}`;

const CLOSED_AT_REVERIFICATION = { completed_at: TERMINATIONS_REVERIFIED_AT, evidence: 'Closed November 4, 2026, once every step above was complete, and re-verified against the users table, every INTDEV organization, the Render API, and AWS IAM at 04:29 UTC that day' };

const LOWERED_FROM_ADMIN = { previous: 100, level: 20, at: RECORDED_AT, detail: 'Lowered from platform admin (100) to level 20 in the production users table on November 4, 2026' };

const OFFBOARDING: Record<string, Offboarding> = {
  'Anastasiya Uraleva': {
    account: LOWERED_FROM_ADMIN,
    render: { completed_at: RENDER_REMOVAL_VERIFIED_AT, evidence: `Removed from the Render workspace by Jimmy Lee (CEO) on November 4, 2026. A Render API read of workspace members at 03:37 UTC that day no longer lists this person. ${REVERIFIED}.` },
    organizations: {
      completed_at: SHARED_ORGANIZATIONS_REMOVED_AT,
      evidence: 'Found as organization admin of internet.dev and events.internet.dev when termination was re-checked; both memberships were removed from the production organizations_membership table at 03:58 UTC on November 4, 2026. Her memberships in three organizations that current team members also belong to (admin of elcap.xyz and item.market, member of diagram.page) were removed at 04:29 UTC the same day on the CEO’s instruction, and a read at 04:29 UTC found none',
    },
    aws: NO_IAM_USER,
    close: CLOSED_AT_REVERIFICATION,
  },
  'Chenyu Huang': {
    account: LOWERED_FROM_ADMIN,
    render: NOT_A_RENDER_MEMBER,
    organizations: { completed_at: SHARED_ORGANIZATIONS_REMOVED_AT, evidence: 'Held no membership in an INTDEV organization. On the CEO’s instruction, his organization admin membership of talkingheads.vision, an organization outside INTDEV, was also removed from the production organizations_membership table at 04:29 UTC on November 4, 2026, and a read at 04:29 UTC found no INTDEV organization membership' },
    aws: NO_IAM_USER,
    close: CLOSED_AT_REVERIFICATION,
  },
  'Louanne Murphy': {
    account: { previous: 20, level: 10, at: LEVEL_RESTORED_AT, detail: 'Never held platform admin. The 03:05 UTC update on November 4, 2026 raised this account from 10 to 20; it was restored to 10, its earlier level, at 03:37 UTC, before any credit payout' },
    render: NOT_A_RENDER_MEMBER,
    organizations: { completed_at: ORGANIZATIONS_REMOVED_AT, evidence: 'Found as a member of internet.dev when termination was re-checked. The membership was removed from the production organizations_membership table at 03:58 UTC on November 4, 2026, and a read one second later found none' },
    aws: NO_IAM_USER,
    close: CLOSED_AT_REVERIFICATION,
  },
  'Xiangan He': {
    account: { previous: 100, level: 10, at: PLATFORM_ADMINS_SETTLED_AT, detail: 'Found at platform admin in the Q4 2026 review of platform admin accounts outside the access register. Lowered from platform admin (100) to level 10, on the CEO’s instruction, in the production users table at 09:48 UTC on November 4, 2026' },
    render: { completed_at: '2026-11-04T09:45:51.645Z', evidence: 'Render API read of the members of every Render workspace INTDEV administers at 09:45 UTC on November 4, 2026: not a member. Re-verified at 09:49 UTC that day' },
    organizations: {
      completed_at: PLATFORM_ADMINS_SETTLED_AT,
      evidence: 'Found as organization admin of analytics.page and a member of internet.dev. Both memberships were removed from the production organizations_membership table at 09:48 UTC on November 4, 2026, in the same transaction that lowered the account, and a read at 09:49 UTC found no organization membership',
    },
    aws: 'AWS IAM list-users at 09:46 UTC on November 4, 2026: no IAM user exists for this person. Re-verified at 09:49 UTC that day',
    close: { completed_at: ALL_TERMINATIONS_VERIFIED_AT, evidence: 'Closed November 4, 2026, once every step above was complete, and verified against the users table, every INTDEV organization, the Render API, and AWS IAM at 09:49 UTC that day. He left in April 2025, so every removal missed the 24 business hour SLA; each is recorded at the time it was actually completed' },
  },
};

function offboarding(name: string): Offboarding {
  const plan = OFFBOARDING[name];
  if (!plan) throw new Error(`records.ts: add an OFFBOARDING entry for ${name}`);
  return plan;
}

const REVOCATIONS: AccessGrant[] = FORMER_TEAM.map((person, index) => {
  const { account } = offboarding(person.name);
  return {
    id: `AR-2026-${String(GRANTS.length + index + 1).padStart(3, '0')}`,
    kind: 'revocation',
    person: person.name,
    role: `Former ${person.type.toLowerCase()}`,
    user_id: person.userId,
    system: 'INTDEV API (api.internet.dev)',
    request: { by: APPROVER, at: CONFIRMED_AT, detail: 'Termination checklist step: remove administrative rights. A platform admin account is lowered to a standard tier (level 20, or 10 where the CEO directs); an account is never raised' },
    approval: { by: APPROVER, at: CONFIRMED_AT, decision: 'Approved', detail: 'Approved under the Access Control Policy termination procedure' },
    assignment: { level: account.level, level_name: levelName(account.level), previous_level: account.previous, at: account.at, detail: account.detail },
  };
});

const ADDITIONAL_ACCOUNTS = [{ person: 'Elijah Seed Arita', user_id: '75b06f73-e508-4200-ab55-37edd1e9a7d2', created: '2026-07-28T01:23:25.353Z', level: 100, label: 'a plus address of his internet.dev mailbox' }];

const ADDITIONAL_GRANTS: AccessGrant[] = ADDITIONAL_ACCOUNTS.map((extra, index) => {
  const person = TEAM.find((member) => member.name === extra.person);
  if (!person) throw new Error(`records.ts: ${extra.person} is not in TEAM`);
  return {
    id: `AR-2026-${String(GRANTS.length + REVOCATIONS.length + index + 1).padStart(3, '0')}`,
    kind: 'grant',
    person: person.name,
    role: person.role,
    user_id: extra.user_id,
    system: 'INTDEV API (api.internet.dev)',
    request: { by: person.name, at: extra.created, detail: `Registered a second account, on ${extra.label}, for production support of INTDEV products` },
    approval: { by: APPROVER, at: '2026-11-04', decision: 'Approved', detail: 'Registered in the Q4 2026 access review as the second account of a team member approved for platform admin; it holds the same access as his first account' },
    assignment: { level: extra.level, level_name: levelName(extra.level), previous_level: null, at: null, detail: 'Assigned to this user_id; the current level is read live from the production users table on every request' },
  };
});

export const ACCESS_GRANTS: AccessGrant[] = [...GRANTS, ...REVOCATIONS, ...ADDITIONAL_GRANTS];

const STEP = {
  open: 'Record the last day and open the termination record',
  google: 'Suspend Google Workspace and transfer email and files',
  github: 'Remove from the GitHub organization and revoke personal access tokens and deploy keys',
  render: 'Remove from the Render workspace',
  secrets: 'Review the environment secrets they could read, and rotate any that need it',
  aws: 'Remove or deactivate AWS IAM access',
  tools: 'Remove Stripe, Vanta, Slack, and Telegram channel access',
  account: 'Remove administrative rights from the INTDEV API account; platform admin is lowered to a standard tier',
  organizations: 'Remove membership in INTDEV’s organizations on the INTDEV API: INTDEV’s own domains (internet.dev and its subdomains, users.garden, terminalgraph.com, txt.dev) and every organization a current team member belongs to',
  equipment: 'Collect company equipment, or confirm company data is deleted from personal devices',
  confidentiality: 'Remind them of the confidentiality obligations that survive termination',
  close: 'Close the record with the time of each removal',
} as const;

export const TERMINATION_CHECKLIST: string[] = Object.values(STEP);

const OWNER_CONFIRMATION = { by: APPROVER, at: CONFIRMED_AT, detail: 'Confirmed every attested step of this checklist as complete' };

const CONFIRMED = 'Attested complete by Jimmy Lee (CEO), confirmed November 4, 2026';

function steps(plan: Offboarding): ChecklistStep[] {
  return [
    { step: STEP.open, status: 'completed', method: 'system', completed_at: CONFIRMED_AT, evidence: `This record, published at ${EVIDENCE_ENDPOINTS.terminations}` },
    { step: STEP.google, status: 'completed', method: 'attested', completed_at: null, evidence: CONFIRMED },
    { step: STEP.github, status: 'completed', method: 'attested', completed_at: null, evidence: CONFIRMED },
    { step: STEP.render, status: 'completed', method: 'system', completed_at: plan.render.completed_at, evidence: plan.render.evidence },
    { step: STEP.secrets, status: 'completed', method: 'attested', completed_at: null, evidence: CONFIRMED },
    { step: STEP.aws, status: 'completed', method: 'system', completed_at: CONFIRMED_AT, evidence: plan.aws },
    { step: STEP.tools, status: 'completed', method: 'attested', completed_at: null, evidence: CONFIRMED },
    { step: STEP.account, status: 'completed', method: 'system', completed_at: plan.account.at, evidence: `${plan.account.detail}. The current level is read live on every request.` },
    { step: STEP.organizations, status: 'completed', method: 'system', completed_at: plan.organizations.completed_at, evidence: `${plan.organizations.evidence}. Memberships are read live on every request, and from INTDEV API 2.0.9 the API refuses staff grants based on an INTDEV email address to any account in this register.` },
    { step: STEP.equipment, status: 'completed', method: 'attested', completed_at: null, evidence: CONFIRMED },
    { step: STEP.confidentiality, status: 'completed', method: 'attested', completed_at: null, evidence: CONFIRMED },
    { step: STEP.close, status: 'completed', method: 'system', completed_at: plan.close.completed_at, evidence: plan.close.evidence },
  ];
}

export const TERMINATIONS: TerminationRecord[] = FORMER_TEAM.map((person, index) => {
  const plan = offboarding(person.name);
  const checklist = steps(plan);
  return {
    id: `TR-2026-${String(index + 1).padStart(3, '0')}`,
    person: person.name,
    type: person.type,
    joined: person.joined,
    left: person.left,
    user_id: person.userId,
    opened_at: CONFIRMED_AT,
    closed_at: checklist.every((step) => step.status === 'completed') ? CONFIRMED_AT : null,
    account_level: plan.account.level,
    confirmation: OWNER_CONFIRMATION,
    steps: checklist,
  };
});

const TERMINATED_USER_IDS = new Set(TERMINATIONS.map((record) => record.user_id));

export function isTerminatedAccount(user: { id?: string | null } | null | undefined): boolean {
  return typeof user?.id === 'string' && TERMINATED_USER_IDS.has(user.id);
}

export const TRAINING_COURSES: TrainingCourse[] = [
  { id: 'security-awareness-2026', title: 'Security awareness training', version: 'November 4, 2026', covers: 'Credentials and secrets, phishing, data handling, devices (FileVault, screen lock, updates), secure development, and incident reporting' },
  { id: 'business-continuity-2026', title: 'Business continuity and disaster recovery training', version: 'BC/DR Plan v1.0 and the November 4, 2026 tabletop exercise', covers: 'Roles in a disaster, the restore procedure, RTO and RPO targets, customer communication, and the tabletop action items' },
];

export const TRAINING_COMPLETIONS: TrainingCompletion[] = TEAM.map((person) => ({
  person: person.name,
  role: person.role,
  avatar: person.avatar,
  user_id: person.userId,
  courses: TRAINING_COURSES.map((course) => course.id),
  signed_at: CONFIRMED_AT,
  method: 'Signed acknowledgement of both courses',
  confirmation: { by: APPROVER, at: CONFIRMED_AT, detail: 'Confirmed this team member signed both courses' },
}));

export const VULNERABILITY_SCAN = {
  date: 'November 4, 2026',
  dependency: 'npm audit of a fresh production resolution of the INTDEV API package.json, the same resolution Render installs on every build (no lockfile is committed)',
  external: 'TLS, protocol, certificate, redirect, and security-header checks against api.internet.dev, users.garden, internet.dev, and terminalgraph.com',
  configuration: 'AWS IAM, MFA, security groups, S3 public access, GuardDuty, and malware protection; Render database network, backup, and workspace settings',
  counts: [
    { severity: 'Critical', before: '0', after: '0' },
    { severity: 'High', before: '17 package entries from 2 advisories (sharp; zod through @atproto) plus 1 configuration finding', after: '16 package entries from 1 advisory (zod, risk treatment plan) plus 1 configuration finding (risk treatment plan)' },
    { severity: 'Moderate and medium', before: '5 package entries from 2 advisories (glob, minimatch) plus 2 configuration findings', after: '0 package entries; 2 configuration findings scheduled' },
    { severity: 'Low', before: '1 (HSTS)', after: '1, scheduled' },
  ],
};

export const NETWORK_EXPORTED_AT = '2026-11-04';

export const SECURITY_GROUP_EXPORT = [
  { region: 'us-east-1', group: 'default', inbound: 'All traffic from members of the same group only', outbound: 'All', attached: 'Nothing (no network interfaces)' },
  { region: 'us-east-2', group: 'default', inbound: 'All traffic from members of the same group only', outbound: 'All', attached: 'Nothing (no network interfaces)' },
  { region: 'us-west-1', group: 'default', inbound: 'All traffic from members of the same group only', outbound: 'All', attached: 'Nothing (no network interfaces)' },
  { region: 'us-west-2', group: 'default', inbound: 'All traffic from any IPv4 address (INTDEV-2026-NET-02)', outbound: 'All', attached: 'One stopped legacy t2.micro instance' },
  { region: 'us-west-2', group: 'cantaloupe-app', inbound: 'TCP 80 from any IPv4 address and one named address; TCP 22 from any IPv4 address (INTDEV-2026-NET-02)', outbound: 'All', attached: 'Three stopped legacy t2.micro instances' },
  { region: 'us-west-2', group: 'rds-launch-wizard', inbound: 'TCP 5432 from two named addresses only', outbound: 'All', attached: 'Nothing (no database instance exists)' },
];

export const RENDER_NETWORK_EXPORT = [
  { resource: 'internet-apis (web service)', region: 'Oregon', exposure: 'Public HTTPS only, through Cloudflare; Render private network address internet-apis:10001 for same-region services', redundancy: '2 instances behind Render’s load balancer; zero-downtime deploys', previews: 'Off' },
  { resource: 'INTDEV DATA (PostgreSQL 15, Pro)', region: 'Oregon', exposure: 'TLS and a database credential required; allow list not yet restricted to named sources (INTDEV-2026-NET-01)', redundancy: 'Point-in-time recovery; no standby or read replica', previews: '—' },
  { resource: 'www-users-garden (web service)', region: 'Ohio', exposure: 'Public HTTPS only, through Cloudflare', redundancy: '1 instance; zero-downtime deploys', previews: 'Off' },
  { resource: 'terminalgraph (web service)', region: 'Oregon', exposure: 'Public HTTPS only, through Cloudflare', redundancy: '1 instance; zero-downtime deploys', previews: 'Off' },
  { resource: 'www-internet-v3 (web service)', region: 'Ohio', exposure: 'Public HTTPS only, through Cloudflare', redundancy: '1 instance; zero-downtime deploys', previews: 'Off' },
];

export const DELETION_STATEMENT = 'INTDEV hard-deletes customer accounts on request. A deleted account leaves no users row. Where an account had a credit ledger, the ledger is kept as a financial record without the user, and that orphaned ledger is the anonymous evidence that the deletion happened. From INTDEV API 2.0.9, every deletion through POST /api/users/delete also writes an anonymous entry to the deletion log in the same transaction.';

export const DELETION_SNAPSHOT = {
  captured_at: '2026-11-04T03:15:09.177Z',
  orphaned_organization_memberships: 11,
  records: [
    { reference: '08625e4509218170', account_created_at: '2026-06-15T20:58:04.787Z', deleted_after: '2026-06-15T20:58:04.787Z', within_last_12_months: 'confirmed' },
    { reference: 'e23ce5d44176c006', account_created_at: '2026-06-15T19:39:19.766Z', deleted_after: '2026-06-15T19:39:19.766Z', within_last_12_months: 'confirmed' },
    { reference: '68fe26907a90c93f', account_created_at: '2026-06-15T06:34:38.550Z', deleted_after: '2026-06-15T06:34:38.550Z', within_last_12_months: 'confirmed' },
    { reference: '6a0272850c031a90', account_created_at: '2026-06-14T21:24:04.709Z', deleted_after: '2026-06-14T21:24:04.709Z', within_last_12_months: 'confirmed' },
    { reference: 'ce45907f587a2a4a', account_created_at: '2025-09-10T19:19:38.118Z', deleted_after: '2025-09-10T19:19:38.118Z', within_last_12_months: 'possible' },
    { reference: '6a154fe537359658', account_created_at: '2025-02-07T17:39:33.106Z', deleted_after: '2025-05-03T15:50:37.177Z', within_last_12_months: 'possible' },
    { reference: '7e0293f5e4b560f3', account_created_at: '2025-02-10T19:44:51.598Z', deleted_after: '2025-02-12T14:12:34.610Z', within_last_12_months: 'possible' },
    { reference: 'd7eb3292066fe8e0', account_created_at: '2025-02-08T03:23:29.811Z', deleted_after: '2025-02-08T03:23:29.811Z', within_last_12_months: 'possible' },
    { reference: '166b87a6e002d74f', account_created_at: '2025-02-07T18:25:33.890Z', deleted_after: '2025-02-07T18:25:33.890Z', within_last_12_months: 'possible' },
    { reference: '408830195031fb29', account_created_at: '2025-02-07T18:17:06.324Z', deleted_after: '2025-02-07T18:17:06.324Z', within_last_12_months: 'possible' },
    { reference: 'd695cfb182075d17', account_created_at: '2025-02-07T18:08:36.502Z', deleted_after: '2025-02-07T18:08:36.502Z', within_last_12_months: 'possible' },
    { reference: 'af9707e5ea43ee3d', account_created_at: '2025-02-07T18:08:05.376Z', deleted_after: '2025-02-07T18:08:05.376Z', within_last_12_months: 'possible' },
    { reference: '02a39d918d5a70a4', account_created_at: '2024-09-27T06:21:11.796Z', deleted_after: '2024-09-27T06:21:11.941Z', within_last_12_months: 'possible' },
    { reference: 'b78cf88c7ca42921', account_created_at: '2024-08-23T07:07:57.561Z', deleted_after: '2024-08-23T07:07:57.592Z', within_last_12_months: 'possible' },
    { reference: 'ccb4b0be98697f64', account_created_at: '2024-08-23T04:59:23.562Z', deleted_after: '2024-08-23T05:37:04.369Z', within_last_12_months: 'possible' },
    { reference: 'a90907107225cfc9', account_created_at: '2024-08-23T04:57:13.070Z', deleted_after: '2024-08-23T04:57:13.107Z', within_last_12_months: 'possible' },
  ] as { reference: string; account_created_at: string; deleted_after: string; within_last_12_months: 'confirmed' | 'possible' }[],
};
