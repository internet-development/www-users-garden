import type { AccountState, CheckStatus, ComplianceReportData, ReportCheck, ReportInputs } from '@root/compliance/site/types';

import { VULNERABILITIES } from '@root/compliance/site/facts';
import { ACCESS_GRANTS, DEVICE_CHECK_FRESH_DAYS, DOMAIN_GRANT_BLOCK_RELEASE, EVIDENCE_ENDPOINTS, PLATFORM_ADMIN_FOLLOW_UP, REMOVABLE_MEDIA_CONTROL, TERMINATIONS, TERMINATIONS_REVERIFIED_AT, TRAINING_COMPLETIONS, TRAINING_COURSES } from '@root/compliance/site/records';

export const EMPTY_REPORT_INPUTS: ReportInputs = { release: null, accounts: null, intdevOrganizations: null, renderMembers: null, platformAdmins: null, deletions: null, releaseScan: null, devices: null };

export function compareVersions(a: string, b: string): number {
  const left = a.split('.').map((part) => Number.parseInt(part, 10) || 0);
  const right = b.split('.').map((part) => Number.parseInt(part, 10) || 0);
  for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
    const difference = (left[index] ?? 0) - (right[index] ?? 0);
    if (difference !== 0) return Math.sign(difference);
  }
  return 0;
}

export function releaseIncludes(release: string | null, fixedIn: string): boolean | null {
  return release ? compareVersions(release, fixedIn) >= 0 : null;
}

function state(accounts: Record<string, AccountState> | null, userId: string): AccountState | null {
  if (!accounts) return null;
  return accounts[userId] ?? { user_id: userId, exists: false, level: null, updated_at: null };
}

function check(id: string, area: string, title: string, page: string, endpoint: string | null, status: CheckStatus, result: string): ReportCheck {
  return { id, area, title, status, result, page, endpoint };
}

function counted(ok: number, total: number): CheckStatus {
  return ok === total ? 'pass' : 'open';
}

export function buildComplianceReport(inputs: ReportInputs): ComplianceReportData {
  const checks: ReportCheck[] = [];
  const pending = 'Pending the live check by the INTDEV API';
  const former = TERMINATIONS.length;

  if (inputs.accounts) {
    const inEffect = ACCESS_GRANTS.filter((grant) => {
      const account = state(inputs.accounts, grant.user_id);
      return !!account && account.exists && account.level === grant.assignment.level;
    }).length;
    checks.push(check('access-register', 'Access', 'Every access grant and revocation is in effect in production', '/compliance/access-requests', EVIDENCE_ENDPOINTS.accessRequests, counted(inEffect, ACCESS_GRANTS.length), `${inEffect} of ${ACCESS_GRANTS.length} records match the production users table`));
  } else {
    checks.push(check('access-register', 'Access', 'Every access grant and revocation is in effect in production', '/compliance/access-requests', EVIDENCE_ENDPOINTS.accessRequests, 'unavailable', `${ACCESS_GRANTS.length} records published. ${pending}`));
  }

  const admins = inputs.platformAdmins;
  checks.push(
    check(
      'platform-admins',
      'Access',
      'Every platform admin account belongs to a person in the access register',
      '/compliance/access-reviews',
      EVIDENCE_ENDPOINTS.accessRequests,
      admins ? (admins.unregistered === 0 ? 'pass' : 'open') : 'unavailable',
      admins
        ? admins.unregistered === 0
          ? `${admins.registered} accounts belong to people in the register; ${admins.system} documented system account`
          : `${admins.registered} of ${admins.total} belong to people in the register and ${admins.system} is a documented system account. The other ${admins.unregistered} each get a named owner or are lowered by ${PLATFORM_ADMIN_FOLLOW_UP} (Q4 2026 access review)`
        : pending
    )
  );

  const steps = TERMINATIONS.flatMap((record) => record.steps);
  const stepsDone = steps.filter((step) => step.status === 'completed').length;
  const closed = TERMINATIONS.filter((record) => record.closed_at !== null).length;
  checks.push(check('terminations-closed', 'Termination', 'Every termination checklist is closed with every step complete', '/compliance/access-termination', EVIDENCE_ENDPOINTS.terminations, closed === former && stepsDone === steps.length ? 'pass' : 'open', `${closed} of ${former} records closed; ${stepsDone} of ${steps.length} steps complete`));

  if (inputs.accounts) {
    const noAdmin = TERMINATIONS.filter((record) => {
      const account = state(inputs.accounts, record.user_id);
      return !!account && (!account.exists || (account.level ?? 0) < 100);
    }).length;
    const atLevel = TERMINATIONS.filter((record) => {
      const account = state(inputs.accounts, record.user_id);
      return !!account && account.exists && account.level === record.account_level;
    }).length;
    checks.push(check('former-admin', 'Termination', 'No former team member holds platform admin', '/compliance/access-termination', EVIDENCE_ENDPOINTS.terminations, counted(noAdmin, former), `${noAdmin} of ${former} former accounts are below platform admin in production`));
    checks.push(check('former-level', 'Termination', 'Every former account is at the level its termination record assigned', '/compliance/access-termination', EVIDENCE_ENDPOINTS.terminations, counted(atLevel, former), `${atLevel} of ${former} match their recorded level`));
  } else {
    checks.push(check('former-admin', 'Termination', 'No former team member holds platform admin', '/compliance/access-termination', EVIDENCE_ENDPOINTS.terminations, 'unavailable', pending));
    checks.push(check('former-level', 'Termination', 'Every former account is at the level its termination record assigned', '/compliance/access-termination', EVIDENCE_ENDPOINTS.terminations, 'unavailable', pending));
  }

  if (inputs.intdevOrganizations) {
    const memberships = TERMINATIONS.reduce((sum, record) => sum + (inputs.intdevOrganizations?.[record.user_id] ?? 0), 0);
    checks.push(check('former-organizations', 'Termination', 'No former team member belongs to an INTDEV organization', '/compliance/access-termination', EVIDENCE_ENDPOINTS.terminations, memberships === 0 ? 'pass' : 'open', memberships === 0 ? `No memberships across ${former} former accounts` : `${memberships} memberships remain across ${former} former accounts`));
  } else {
    checks.push(check('former-organizations', 'Termination', 'No former team member belongs to an INTDEV organization', '/compliance/access-termination', EVIDENCE_ENDPOINTS.terminations, 'unavailable', pending));
  }

  const blocked = releaseIncludes(inputs.release, DOMAIN_GRANT_BLOCK_RELEASE);
  checks.push(check('former-domain-grants', 'Termination', 'Staff grants based on an INTDEV email address are refused to every former team member', '/compliance/access-termination', EVIDENCE_ENDPOINTS.terminations, blocked === null ? 'unavailable' : blocked ? 'pass' : 'open', blocked === null ? pending : blocked ? `Enforced by the termination register in release ${inputs.release}` : `Enforced from release ${DOMAIN_GRANT_BLOCK_RELEASE}; production serves ${inputs.release}`));

  if (inputs.renderMembers) {
    const absent = TERMINATIONS.filter((record) => inputs.renderMembers?.[record.user_id] === false).length;
    checks.push(check('former-render', 'Termination', 'No former team member is in a Render workspace', '/compliance/access-termination', EVIDENCE_ENDPOINTS.terminations, counted(absent, former), `${absent} of ${former} former team members are absent from every Render workspace INTDEV administers`));
  } else {
    checks.push(check('former-render', 'Termination', 'No former team member is in a Render workspace', '/compliance/access-termination', EVIDENCE_ENDPOINTS.terminations, 'unavailable', `Verified absent through the Render API at ${TERMINATIONS_REVERIFIED_AT.slice(11, 16)} UTC on November 4, 2026. A live Render check runs when the API holds a Render key`));
  }

  const signed = TRAINING_COMPLETIONS.filter((record) => TRAINING_COURSES.every((course) => record.courses.includes(course.id))).length;
  checks.push(check('training', 'People', 'Every team member has signed both training courses', '/compliance/security-awareness-training', EVIDENCE_ENDPOINTS.training, counted(signed, TRAINING_COMPLETIONS.length), `${signed} of ${TRAINING_COMPLETIONS.length} team members signed`));

  const devices = inputs.devices;
  checks.push(
    check(
      'device-encryption',
      'Devices',
      `Every team member’s laptops reported FileVault full-disk encryption on in the last ${DEVICE_CHECK_FRESH_DAYS} days`,
      '/compliance/removable-media',
      EVIDENCE_ENDPOINTS.devices,
      devices ? (devices.members > 0 && devices.members_encrypted === devices.members ? 'pass' : 'open') : 'unavailable',
      devices
        ? `${devices.members_encrypted} of ${devices.members} team members encrypted; ${devices.members_reporting} reporting. ${devices.devices_encrypted} of ${devices.devices} current laptops encrypted, ${devices.devices_aes_256} with AES-256`
        : pending
    )
  );
  checks.push(
    check(
      'device-removable-media',
      'Devices',
      'No current laptop had an unencrypted, writable removable volume mounted at its last check-in',
      '/compliance/removable-media',
      EVIDENCE_ENDPOINTS.devices,
      devices ? (devices.devices > 0 && devices.devices_removable_clear === devices.devices ? 'pass' : 'open') : 'unavailable',
      devices ? (devices.devices ? `${devices.devices_removable_clear} of ${devices.devices} current laptops clear` : 'No laptop has checked in yet') : pending
    )
  );
  checks.push(check('removable-media-blocked', 'Devices', 'Writes to removable media are blocked by device management on every laptop', '/compliance/removable-media', EVIDENCE_ENDPOINTS.devices, REMOVABLE_MEDIA_CONTROL.enforced ? 'pass' : 'open', REMOVABLE_MEDIA_CONTROL.enforced ? 'Enforced by the Storage management restriction' : `Not yet enforced by configuration; due ${REMOVABLE_MEDIA_CONTROL.due} with MDM enrollment`));

  const openSevere = VULNERABILITIES.filter((finding) => finding.state === 'open' && (finding.severity === 'Critical' || finding.severity === 'High'));
  const treated = openSevere.filter((finding) => finding.treatment).length;
  checks.push(check('vulnerabilities-treated', 'Vulnerabilities', 'Every open critical or high finding has an approved risk treatment plan', '/compliance/remediated-vulnerabilities', EVIDENCE_ENDPOINTS.vulnerabilities, counted(treated, openSevere.length), `${treated} of ${openSevere.length} open high findings have a signed plan`));

  const fixes = VULNERABILITIES.filter((finding) => finding.fixed_in);
  if (inputs.release) {
    const live = fixes.filter((finding) => finding.fixed_in && releaseIncludes(inputs.release, finding.fixed_in)).length;
    checks.push(check('fixes-live', 'Vulnerabilities', 'Every fixed vulnerability is live in production', '/compliance/remediated-vulnerabilities', EVIDENCE_ENDPOINTS.vulnerabilities, counted(live, fixes.length), `${live} of ${fixes.length} fixes are in release ${inputs.release}`));
  } else {
    checks.push(check('fixes-live', 'Vulnerabilities', 'Every fixed vulnerability is live in production', '/compliance/remediated-vulnerabilities', EVIDENCE_ENDPOINTS.vulnerabilities, 'unavailable', pending));
  }

  checks.push(
    check('deletions', 'Customer data', 'Customer account deletions are evidenced', '/compliance/data-deletion', EVIDENCE_ENDPOINTS.dataDeletions, inputs.deletions ? 'pass' : 'unavailable', inputs.deletions ? `${inputs.deletions.evidenced} deletions evidenced, ${inputs.deletions.logged} of them in the deletion log` : pending)
  );

  const scan = inputs.releaseScan;
  checks.push(
    check(
      'release-scan',
      'Releases',
      'The release serving production passed its launch scan',
      '/compliance/changelog',
      EVIDENCE_ENDPOINTS.releases,
      scan ? (scan.passed === scan.total ? 'pass' : 'open') : 'unavailable',
      scan ? `${scan.passed} of ${scan.total} checks passed on release ${scan.version ?? 'unknown'}${scan.commit ? ` (${scan.commit.slice(0, 7)})` : ''}` : 'No launch scan has been recorded for the serving release yet'
    )
  );

  return {
    summary: {
      passed: checks.filter((item) => item.status === 'pass').length,
      open: checks.filter((item) => item.status === 'open').length,
      unavailable: checks.filter((item) => item.status === 'unavailable').length,
      total: checks.length,
    },
    checks,
  };
}
