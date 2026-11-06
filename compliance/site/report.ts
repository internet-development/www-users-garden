import type { AccountState, CheckStatus, ComplianceReportData, InfrastructureSnapshot, ReportCheck, ReportInputs } from '@root/compliance/site/types';

import { AWS_REGIONS, CONTACTS, VULNERABILITIES } from '@root/compliance/site/facts';
import { ACCESS_GRANTS, ALL_TERMINATIONS_VERIFIED_AT, DEVICE_CHECK_FRESH_DAYS, DOMAIN_GRANT_BLOCK_RELEASE, EVIDENCE_ENDPOINTS, OPEN_SECURITY_GROUP_FINDING, SUPPORTED_MACOS, SYSTEM_ACCOUNTS, TERMINATIONS, TRAINING_COMPLETIONS, TRAINING_COURSES, signedCourses } from '@root/compliance/site/records';

export const EMPTY_REPORT_INPUTS: ReportInputs = { release: null, accounts: null, intdevOrganizations: null, renderMembership: null, platformAdmins: null, deletions: null, releaseScan: null, devices: null, training: null, infrastructure: null, checkedAt: null };

export const CERTIFICATE_MARGIN_DAYS = 14;

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

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function utcMoment(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const pad = (part: number) => String(part).padStart(2, '0');
  return `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())} UTC on ${MONTHS[date.getUTCMonth()] ?? ''} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
}

function counted(ok: number, total: number): CheckStatus {
  return ok === total ? 'pass' : 'open';
}

function counting(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

function regionList(regions: string[]): string {
  return regions.length ? regions.join(', ') : 'none';
}

export function infrastructureChecks(snapshot: InfrastructureSnapshot | null, checkedAt: string | null = null): ReportCheck[] {
  const endpoint = EVIDENCE_ENDPOINTS.infrastructure;
  const aws = snapshot?.aws ?? null;
  const read = snapshot ? `when it was read at ${utcMoment(snapshot.captured_at)}, before this release was built` : '';
  const none = 'This release carries no AWS read. Each release carries the AWS and TLS read made on a maintainer machine when it was built';
  const checks: ReportCheck[] = [];
  const awsCheck = (id: string, title: string, page: string, judge: (value: NonNullable<typeof aws>) => { status: CheckStatus; result: string }) => {
    if (!aws) return checks.push(check(id, 'Infrastructure', title, page, endpoint, 'unavailable', none));
    const verdict = judge(aws);
    return checks.push(check(id, 'Infrastructure', title, page, endpoint, verdict.status, `${verdict.result} ${read}`));
  };

  awsCheck('aws-guardduty', `GuardDuty is enabled in every monitored AWS region (${AWS_REGIONS.join(', ')})`, '/compliance/intrusion-detection', (value) => {
    const enabled = AWS_REGIONS.filter((region) => value.regions.find((item) => item.region === region)?.guardduty === 'enabled');
    const missing = AWS_REGIONS.filter((region) => !enabled.includes(region));
    return { status: missing.length ? 'open' : 'pass', result: `${enabled.length} of ${AWS_REGIONS.length} regions had an enabled detector${missing.length ? `; not enabled in ${regionList(missing)}` : ''}` };
  });

  awsCheck('aws-finding-alerts', `Every GuardDuty finding is emailed to ${CONTACTS.support}`, '/compliance/intrusion-detection', (value) => {
    const alerting = AWS_REGIONS.filter((region) => {
      const item = value.regions.find((entry) => entry.region === region);
      return !!item && item.alerts.rule === 'enabled' && item.alerts.targets_topic && item.alerts.confirmed.includes(CONTACTS.support);
    });
    const missing = AWS_REGIONS.filter((region) => !alerting.includes(region));
    return { status: missing.length ? 'open' : 'pass', result: `${alerting.length} of ${AWS_REGIONS.length} regions routed findings to a confirmed ${CONTACTS.support} subscription${missing.length ? `; missing in ${regionList(missing)}` : ''}` };
  });

  awsCheck('aws-flow-logs', 'Every VPC records all traffic in VPC Flow Logs', '/compliance/intrusion-detection', (value) => {
    const vpcs = value.regions.reduce((sum, item) => sum + item.flow_logs.vpcs, 0);
    const logged = value.regions.reduce((sum, item) => sum + item.flow_logs.logged, 0);
    return { status: counted(logged, vpcs), result: `${logged} of ${vpcs} VPCs had an active flow log` };
  });

  awsCheck('aws-cloudtrail', 'CloudTrail is logging across regions to a versioned, Object Lock bucket', '/compliance/intrusion-detection', (value) => {
    const healthy = value.trails.filter((trail) => trail.logging && trail.multi_region && !trail.delivery_error && trail.bucket_versioning && trail.bucket_object_lock).length;
    return { status: value.trails.length && healthy === value.trails.length ? 'pass' : 'open', result: value.trails.length ? `${healthy} of ${counting(value.trails.length, 'trail', 'trails')} logging with no delivery error to a versioned, Object Lock bucket` : 'No trail was found' };
  });

  awsCheck('aws-snapshots-encrypted', 'No EBS or RDS snapshot is unencrypted', '/compliance/backups', (value) => {
    const ebs = value.regions.reduce((sum, item) => sum + item.unencrypted_ebs_snapshots, 0);
    const rds = value.regions.reduce((sum, item) => sum + item.unencrypted_rds_snapshots, 0);
    return { status: ebs + rds === 0 ? 'pass' : 'open', result: ebs + rds === 0 ? `No unencrypted snapshot in ${value.regions.length} regions` : `${ebs} unencrypted EBS and ${rds} unencrypted RDS snapshots` };
  });

  awsCheck('aws-data-buckets', 'Customer data buckets are versioned and keep every version, with no automatic expiry', '/compliance/backups', (value) => {
    const ok = value.buckets.data.filter((bucket) => bucket.versioning === 'Enabled' && bucket.noncurrent_days === null && bucket.expires_current_versions === false);
    return { status: value.buckets.data.length && ok.length === value.buckets.data.length ? 'pass' : 'open', result: `${ok.length} of ${value.buckets.data.length} data buckets (${value.buckets.data.map((bucket) => bucket.name).join(', ') || 'none found'}) versioned with no lifecycle expiry of current or old versions` };
  });

  awsCheck('aws-malware-protection', 'GuardDuty Malware Protection scans every customer upload bucket', '/compliance/anti-malware', (value) => {
    const active = value.buckets.data.filter((bucket) => bucket.malware_protection === 'ACTIVE');
    return { status: value.buckets.data.length && active.length === value.buckets.data.length ? 'pass' : 'open', result: `${active.length} of ${value.buckets.data.length} data buckets had an active protection plan` };
  });

  awsCheck('aws-https-only', 'Every S3 bucket refuses requests that are not HTTPS', '/compliance/encryption-in-transit', (value) => ({ status: counted(value.buckets.https_only, value.buckets.total), result: `${value.buckets.https_only} of ${value.buckets.total} buckets deny requests without TLS` }));

  awsCheck('aws-console-mfa', 'Every AWS user who can sign in to the console has MFA', '/compliance/access-control', (value) => {
    const consoleUsers = value.iam_users.filter((user) => user.console);
    const mfa = consoleUsers.filter((user) => user.mfa).length;
    return { status: counted(mfa, consoleUsers.length), result: `${mfa} of ${counting(consoleUsers.length, 'console user has', 'console users have')} MFA; ${value.iam_users.length - consoleUsers.length} programmatic users have no console password` };
  });

  awsCheck('aws-owners', 'Every IAM user, customer-managed role, and S3 bucket has a named owner', '/compliance/access-reviews', (value) => {
    const owned = value.iam_users.filter((user) => user.owner_tagged).length + value.roles.owner_tagged + value.buckets.owner_tagged;
    const total = value.iam_users.length + value.roles.total + value.buckets.total;
    return { status: counted(owned, total), result: `${owned} of ${total} carry the VantaOwner tag` };
  });

  awsCheck('aws-security-groups', 'No AWS security group admits traffic from any address', '/compliance/network-segmentation', (value) => {
    const open = value.regions.flatMap((item) => item.security_groups.filter((group) => group.open_to_internet).map((group) => `${item.region} ${group.group}`));
    const running = value.regions.flatMap((item) => item.security_groups.filter((group) => group.open_to_internet && group.instances.running > 0)).length;
    return { status: open.length ? 'open' : 'pass', result: open.length ? `${counting(open.length, 'group admits', 'groups admit')} any address (${open.join(', ')}), ${OPEN_SECURITY_GROUP_FINDING ? `tracked as ${OPEN_SECURITY_GROUP_FINDING}` : 'not yet tracked in the vulnerability register'}; ${running ? `${running} with a running instance` : 'none is attached to a running instance'}` : 'No group admits any address' };
  });

  const hosts = snapshot?.tls ?? [];
  if (!hosts.length) {
    checks.push(check('tls-hosts', 'Infrastructure', 'Every public hostname is HTTPS-only, negotiates TLS 1.2 or later, and refuses TLS 1.1', '/compliance/encryption-in-transit', endpoint, 'unavailable', 'This release carries no TLS read'));
    checks.push(check('tls-certificates', 'Infrastructure', `Every public certificate is valid for at least ${CERTIFICATE_MARGIN_DAYS} more days`, '/compliance/encryption-in-transit', endpoint, 'unavailable', 'This release carries no TLS read'));
    return checks;
  }
  const secure = hosts.filter((host) => !host.error && host.http.endsWith('to HTTPS') && (host.protocol === 'TLSv1.3' || host.protocol === 'TLSv1.2') && host.tls_1_1 === 'refused');
  const insecure = hosts.filter((host) => !secure.includes(host)).map((host) => host.host);
  checks.push(check('tls-hosts', 'Infrastructure', 'Every public hostname is HTTPS-only, negotiates TLS 1.2 or later, and refuses TLS 1.1', '/compliance/encryption-in-transit', endpoint, insecure.length ? 'open' : 'pass', `${secure.length} of ${hosts.length} hostnames redirect HTTP to HTTPS, negotiate ${[...new Set(secure.map((host) => host.protocol))].join(' or ') || 'TLS'}, and refuse TLS 1.1${insecure.length ? `; check ${insecure.join(', ')}` : ''} ${read}`));

  const reference = checkedAt ?? snapshot?.captured_at ?? null;
  const margin = CERTIFICATE_MARGIN_DAYS * 24 * 60 * 60 * 1000;
  const valid = hosts.filter((host) => host.valid_to && reference && new Date(host.valid_to).getTime() - new Date(reference).getTime() >= margin);
  const soonest = hosts.map((host) => host.valid_to).filter((value): value is string => !!value).sort()[0] ?? null;
  checks.push(
    check(
      'tls-certificates',
      'Infrastructure',
      `Every public certificate is valid for at least ${CERTIFICATE_MARGIN_DAYS} more days`,
      '/compliance/encryption-in-transit',
      endpoint,
      counted(valid.length, hosts.length),
      `${valid.length} of ${hosts.length} certificates valid ${CERTIFICATE_MARGIN_DAYS} days past ${checkedAt ? 'this check' : 'the read'}; the first expires ${soonest ? utcMoment(soonest) : 'at an unknown time'}. Cloudflare renews them automatically`
    )
  );
  return checks;
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

  if (inputs.accounts) {
    const atLevel = SYSTEM_ACCOUNTS.filter((record) => {
      const account = state(inputs.accounts, record.user_id);
      return !!account && account.exists && account.level === record.level;
    }).length;
    checks.push(check('system-accounts', 'Access', 'Every documented system account is at its documented level in production', '/compliance/access-reviews', EVIDENCE_ENDPOINTS.accessRequests, counted(atLevel, SYSTEM_ACCOUNTS.length), `${atLevel} of ${SYSTEM_ACCOUNTS.length} system accounts match the production users table`));
  } else {
    checks.push(check('system-accounts', 'Access', 'Every documented system account is at its documented level in production', '/compliance/access-reviews', EVIDENCE_ENDPOINTS.accessRequests, 'unavailable', `${SYSTEM_ACCOUNTS.length} system accounts published. ${pending}`));
  }

  const admins = inputs.platformAdmins;
  checks.push(
    check(
      'platform-admins',
      'Access',
      'Every platform admin account has a named owner in the access register or the system account register',
      '/compliance/access-reviews',
      EVIDENCE_ENDPOINTS.accessRequests,
      admins ? (admins.unregistered === 0 ? 'pass' : 'open') : 'unavailable',
      admins
        ? admins.unregistered === 0
          ? `${counting(admins.total, 'account holds', 'accounts hold')} platform admin: ${counting(admins.registered, 'belongs', 'belong')} to people in the register and ${counting(admins.system, 'is a documented system account', 'are documented system accounts')}`
          : `${admins.registered} of ${admins.total} belong to people in the register and ${counting(admins.system, 'is a documented system account', 'are documented system accounts')}. The other ${admins.unregistered} need a named owner in the access register or the system account register, or a lower level`
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

  const render = inputs.renderMembership;
  if (render) {
    const absent = TERMINATIONS.filter((record) => render.members[record.user_id] === false).length;
    const unread = TERMINATIONS.filter((record) => typeof render.members[record.user_id] !== 'boolean').length;
    checks.push(
      check(
        'former-render',
        'Termination',
        'No former team member is in a Render workspace',
        '/compliance/access-termination',
        EVIDENCE_ENDPOINTS.terminations,
        counted(absent, former),
        `${absent} of ${former} former team members were absent from every Render workspace INTDEV administers when the Render API was read at ${utcMoment(render.checked_at)}, before this release was built${unread ? `. ${unread} not covered by that read` : ''}`
      )
    );
  } else {
    checks.push(check('former-render', 'Termination', 'No former team member is in a Render workspace', '/compliance/access-termination', EVIDENCE_ENDPOINTS.terminations, 'unavailable', `All ${former} verified absent through the Render API at ${utcMoment(ALL_TERMINATIONS_VERIFIED_AT)}. Each release carries the Render read made on a maintainer machine when it was built; this release has none`));
  }

  const signed = TRAINING_COMPLETIONS.filter((record) => {
    const courses = signedCourses(record, inputs.training?.[record.user_id] ?? []);
    return TRAINING_COURSES.every((course) => courses.includes(course.id));
  }).length;
  const trainingStatus: CheckStatus = signed === TRAINING_COMPLETIONS.length ? 'pass' : inputs.training ? 'open' : 'unavailable';
  checks.push(check('training', 'People', 'Every team member has signed every training course', '/compliance/security-awareness-training', EVIDENCE_ENDPOINTS.training, trainingStatus, `${signed} of ${TRAINING_COMPLETIONS.length} team members signed all ${TRAINING_COURSES.length} courses${inputs.training ? '' : `. ${pending} of the signatures made in Users Garden`}`));

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
  checks.push(
    check(
      'device-anti-malware',
      'Devices',
      'Every current laptop reported Gatekeeper on, XProtect definitions installed, and automatic security responses on at its last check-in',
      '/compliance/anti-malware',
      EVIDENCE_ENDPOINTS.devices,
      devices ? (devices.devices > 0 && devices.devices_anti_malware === devices.devices ? 'pass' : 'open') : 'unavailable',
      devices ? (devices.devices ? `${devices.devices_anti_malware} of ${devices.devices} current laptops reported anti-malware active; ${devices.devices_firewall_on} with the application firewall on` : 'No laptop has checked in yet') : pending
    )
  );
  checks.push(
    check(
      'device-patch-state',
      'Devices',
      `Every current laptop runs a supported macOS (macOS ${SUPPORTED_MACOS.minimum_major} or later) and installs security updates automatically`,
      '/compliance/infrastructure-maintenance',
      EVIDENCE_ENDPOINTS.devices,
      devices ? (devices.devices > 0 && devices.devices_patch_current === devices.devices ? 'pass' : 'open') : 'unavailable',
      devices ? (devices.devices ? `${devices.devices_patch_current} of ${devices.devices} current laptops patched; ${devices.devices_os_supported} on a supported macOS` : 'No laptop has checked in yet') : pending
    )
  );

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

  checks.push(...infrastructureChecks(inputs.infrastructure, inputs.checkedAt));

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
