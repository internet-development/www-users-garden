import type { AccessGrant, ChecklistStep, TerminationRecord, TrainingCompletion, TrainingCourse } from '@root/compliance/site/types';

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
} as const;

export const INTDEV_ORGANIZATION_DOMAINS = ['internet.dev', 'users.garden', 'terminalgraph.com', 'txt.dev'];

export function isIntdevOrganizationDomain(domain: string | null | undefined): boolean {
  const value = (domain ?? '').trim().toLowerCase();
  return INTDEV_ORGANIZATION_DOMAINS.some((root) => value === root || value.endsWith(`.${root}`));
}

export const PLATFORM_ADMIN_FOLLOW_UP = 'December 4, 2026';

export const DOMAIN_GRANT_BLOCK_RELEASE = '2.0.9';

export const SYSTEM_ACCOUNTS = [{ username: 'treasury', purpose: 'Platform credit treasury. The credit system requires this account at level 100 for double-entry bookkeeping.' }];

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
const RENDER_REMOVAL_VERIFIED_AT = '2026-11-04T03:37:22.000Z';
const LEVEL_RESTORED_AT = '2026-11-04T03:37:51.799Z';
const ORGANIZATIONS_REMOVED_AT = '2026-11-04T03:58:41.614Z';
const SHARED_ORGANIZATIONS_REMOVED_AT = '2026-11-04T04:29:10.752Z';
export const TERMINATIONS_REVERIFIED_AT = '2026-11-04T04:29:55.178Z';

interface Offboarding {
  account: { previous: number; level: number; at: string; detail: string };
  render: { completed_at: string; evidence: string };
  organizations: { completed_at: string; evidence: string };
}

const REVERIFIED = 'Re-verified at 04:29 UTC on November 4, 2026, when this record was last updated';

const NOT_A_RENDER_MEMBER = { completed_at: CONFIRMED_AT, evidence: `Render API read of the members of every Render workspace INTDEV administers on November 4, 2026: not a member. ${REVERIFIED}.` };

const LOWERED_FROM_ADMIN = { previous: 100, level: 20, at: RECORDED_AT, detail: 'Lowered from platform admin (100) to level 20 in the production users table on November 4, 2026' };

const OFFBOARDING: Record<string, Offboarding> = {
  'Anastasiya Uraleva': {
    account: LOWERED_FROM_ADMIN,
    render: { completed_at: RENDER_REMOVAL_VERIFIED_AT, evidence: `Removed from the Render workspace by Jimmy Lee (CEO) on November 4, 2026. A Render API read of workspace members at 03:37 UTC that day no longer lists this person. ${REVERIFIED}.` },
    organizations: {
      completed_at: SHARED_ORGANIZATIONS_REMOVED_AT,
      evidence: 'Found as organization admin of internet.dev and events.internet.dev when termination was re-checked; both memberships were removed from the production organizations_membership table at 03:58 UTC on November 4, 2026. Her memberships in three organizations that current team members also belong to (admin of elcap.xyz and item.market, member of diagram.page) were removed at 04:29 UTC the same day on the CEO’s instruction, and a read at 04:29 UTC found none',
    },
  },
  'Chenyu Huang': {
    account: LOWERED_FROM_ADMIN,
    render: NOT_A_RENDER_MEMBER,
    organizations: { completed_at: SHARED_ORGANIZATIONS_REMOVED_AT, evidence: 'Held no membership in an INTDEV organization. On the CEO’s instruction, his organization admin membership of talkingheads.vision, an organization outside INTDEV, was also removed from the production organizations_membership table at 04:29 UTC on November 4, 2026, and a read at 04:29 UTC found no INTDEV organization membership' },
  },
  'Louanne Murphy': {
    account: { previous: 20, level: 10, at: LEVEL_RESTORED_AT, detail: 'Never held platform admin. The 03:05 UTC update on November 4, 2026 raised this account from 10 to 20; it was restored to 10, its earlier level, at 03:37 UTC, before any credit payout' },
    render: NOT_A_RENDER_MEMBER,
    organizations: { completed_at: ORGANIZATIONS_REMOVED_AT, evidence: 'Found as a member of internet.dev when termination was re-checked. The membership was removed from the production organizations_membership table at 03:58 UTC on November 4, 2026, and a read one second later found none' },
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
    request: { by: APPROVER, at: CONFIRMED_AT, detail: 'Termination checklist step: remove administrative rights. A platform admin account is lowered to level 20, a standard tier; an account is never raised' },
    approval: { by: APPROVER, at: CONFIRMED_AT, decision: 'Approved', detail: 'Approved under the Access Control Policy termination procedure' },
    assignment: { level: account.level, level_name: levelName(account.level), previous_level: account.previous, at: account.at, detail: account.detail },
  };
});

export const ACCESS_GRANTS: AccessGrant[] = [...GRANTS, ...REVOCATIONS];

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
    { step: STEP.aws, status: 'completed', method: 'system', completed_at: CONFIRMED_AT, evidence: `AWS IAM list-users on November 4, 2026: no IAM user exists for this person. ${REVERIFIED}` },
    { step: STEP.tools, status: 'completed', method: 'attested', completed_at: null, evidence: CONFIRMED },
    { step: STEP.account, status: 'completed', method: 'system', completed_at: plan.account.at, evidence: `${plan.account.detail}. The current level is read live on every request.` },
    { step: STEP.organizations, status: 'completed', method: 'system', completed_at: plan.organizations.completed_at, evidence: `${plan.organizations.evidence}. Memberships are read live on every request, and from INTDEV API 2.0.9 the API refuses staff grants based on an INTDEV email address to any account in this register.` },
    { step: STEP.equipment, status: 'completed', method: 'attested', completed_at: null, evidence: CONFIRMED },
    { step: STEP.confidentiality, status: 'completed', method: 'attested', completed_at: null, evidence: CONFIRMED },
    { step: STEP.close, status: 'completed', method: 'system', completed_at: TERMINATIONS_REVERIFIED_AT, evidence: 'Closed November 4, 2026, once every step above was complete, and re-verified against the users table, every INTDEV organization, the Render API, and AWS IAM at 04:29 UTC that day' },
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
