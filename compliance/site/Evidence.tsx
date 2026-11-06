'use client';

import styles from '@root/compliance/site/Blocks.module.css';

import * as React from 'react';

import type { AccessGrant, AwsControls, CheckStatus, SystemAccount, ComplianceReportData, DeviceChip, DeviceFleetSummary, DeviceMember, DeviceRecord, EvidenceMeta, LaptopEncryptionStandard, ReleaseScan, ReleaseVersion, ReportCheck, SoftwareInventory, TerminationRecord, TlsHostRead, TrainingCompletion, TrainingCourse, Vulnerability } from '@root/compliance/site/types';

import { CheckItem, CheckTable, Member, Signed, State, Table } from '@root/compliance/site/Blocks';
import { formatUtc } from '@root/compliance/site/Live';
import { API_HOST, API_MANIFEST, API_SOFTWARE, TEAM, VULNERABILITIES } from '@root/compliance/site/facts';
import { ACCESS_GRANTS, ALL_TERMINATIONS_VERIFIED_AT, AWS_IAM_REVIEW, AWS_IAM_REVIEWED_AT, DELETION_SNAPSHOT, DEVICE_CHECK_FRESH_DAYS, EVIDENCE_ENDPOINTS, FILEVAULT_STANDARD, SYSTEM_ACCOUNTS, TERMINATIONS, TRAINING_COMPLETIONS, TRAINING_COURSES, DEVICE_INVENTORY, laptopLocation, levelName } from '@root/compliance/site/records';
import { EMPTY_REPORT_INPUTS, buildComplianceReport, infrastructureChecks } from '@root/compliance/site/report';
import { INFRASTRUCTURE_SNAPSHOT } from '@root/compliance/site/infrastructure-snapshot';
import { findCatalogEntry } from '@root/compliance/site/catalog';
import { KIT_REGISTERS } from '@root/compliance/site/kit';
import { readEvidence } from '@root/compliance/site/client';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function formatDay(value: string | null): string {
  if (!value) return '—';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return formatUtc(value);
  const [year, month, day] = value.split('-').map((part) => Number(part));
  return `${MONTHS[(month ?? 1) - 1] ?? ''} ${day ?? ''}, ${year ?? ''}`;
}

interface LiveLevel {
  current_level: number | null;
  current_level_name: string | null;
  account_updated_at: string | null;
}

type Source = 'loading' | 'live' | 'snapshot';

function useEvidence<T extends { evidence: EvidenceMeta }>(path: string) {
  const [data, setData] = React.useState<T | null>(null);
  const [source, setSource] = React.useState<Source>('loading');

  React.useEffect(() => {
    let active = true;
    readEvidence<T>(path).then((read) => {
      if (!active) return;
      if (read.ok) {
        setData(read.data);
        setSource('live');
      } else {
        setSource('snapshot');
      }
    });
    return () => {
      active = false;
    };
  }, [path]);

  return { data, source };
}

function EvidenceSource(props: { path: string; source: Source; meta: EvidenceMeta | null; liveCheck?: string }) {
  const url = `${API_HOST}${props.path}`;
  let line: React.ReactNode;
  if (props.source === 'live' && props.meta) {
    const release = props.meta.release ? `release ${props.meta.release}${props.meta.commit ? `, commit ${props.meta.commit}` : ''}` : 'release unknown';
    const drift = props.meta.registers && props.meta.registers !== KIT_REGISTERS ? ` That release serves registers ${props.meta.registers} and this page was built with ${KIT_REGISTERS}, so the records above come from the API.` : '';
    line = `Live from the INTDEV API (${release}, published ${formatUtc(props.meta.published_at)}), checked ${formatUtc(props.meta.checked_at)}.${props.liveCheck === 'unavailable' ? ' The production database could not be read for this response, so live checks are blank.' : ''}${drift}`;
  } else if (props.source === 'loading') {
    line = 'Loading the live record from the INTDEV API. Showing the published register.';
  } else {
    line = 'The live record is unavailable right now. Showing the published register.';
  }
  return (
    <p className={styles.muted}>
      {line} Record: <a href={url}>{url.replace('https://', '')}</a>
    </p>
  );
}

function served<T>(meta: EvidenceMeta | undefined, live: T | undefined, compiled: T): T {
  return meta?.registers && live ? live : compiled;
}

function levelLine(live: LiveLevel | undefined, recorded: number) {
  if (!live) return `Recorded: ${levelName(recorded)} (${recorded})`;
  if (live.current_level === null) return live.current_level_name ?? 'No account';
  return `${live.current_level_name ?? levelName(live.current_level)} (${live.current_level})`;
}

function statusChecked(status: CheckStatus): boolean | null {
  return status === 'pass' ? true : status === 'open' ? false : null;
}

type LiveGrant = AccessGrant & { live: LiveLevel & { in_effect: boolean | null } };

export function AccessRequestRecords() {
  const path = EVIDENCE_ENDPOINTS.accessRequests;
  const { data, source } = useEvidence<{ records: LiveGrant[]; evidence: EvidenceMeta; live_check: string }>(path);
  const live = new Map((data?.records ?? []).map((record) => [record.id, record]));
  const grants: AccessGrant[] = served(data?.evidence, data?.records, ACCESS_GRANTS);

  return (
    <div className={styles.group}>
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Record</th>
              <th scope="col">Request</th>
              <th scope="col">Approval</th>
              <th scope="col">Assigned access level</th>
              <th scope="col">Live check</th>
            </tr>
          </thead>
          <tbody>
            {grants.map((grant) => {
              const current = live.get(grant.id);
              return (
                <tr key={grant.id}>
                  <td>
                    {grant.id}
                    <br />
                    {grant.kind === 'grant' ? 'Grant' : 'Revocation'}
                  </td>
                  <td>
                    <Member name={grant.request.by} />, {formatDay(grant.request.at)}
                    <br />
                    <span className={styles.muted}>{grant.request.detail}</span>
                  </td>
                  <td>
                    {grant.approval.decision} by <Member name={grant.approval.by} />, {formatDay(grant.approval.at)}
                    <br />
                    <span className={styles.muted}>{grant.approval.detail}</span>
                  </td>
                  <td>
                    {grant.assignment.level_name} ({grant.assignment.level}){grant.assignment.previous_level !== null ? `, from ${grant.assignment.previous_level}` : ''}
                    {grant.assignment.at ? `, ${formatUtc(grant.assignment.at)}` : ''}
                    <br />
                    <span className={styles.muted}>
                      {grant.system}, user_id {grant.user_id}
                    </span>
                  </td>
                  <td>
                    <CheckItem checked={current ? current.live.in_effect : null}>
                      <State ok={current ? current.live.in_effect : null}>{current ? (current.live.in_effect ? `In effect: ${levelLine(current.live, grant.assignment.level)}` : `Differs: ${levelLine(current.live, grant.assignment.level)}`) : 'Pending live check'}</State>
                    </CheckItem>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <EvidenceSource path={path} source={source} meta={data?.evidence ?? null} liveCheck={data?.live_check} />
    </div>
  );
}

type LiveSystemAccount = SystemAccount & { live: LiveLevel & { in_effect: boolean | null } };

export function SystemAccountRecords() {
  const path = EVIDENCE_ENDPOINTS.accessRequests;
  const { data, source } = useEvidence<{ system_accounts?: LiveSystemAccount[]; evidence: EvidenceMeta; live_check: string }>(path);
  const live = new Map((data?.system_accounts ?? []).map((record) => [record.id, record]));

  return (
    <div className={styles.group}>
      <CheckTable
        columns={['Account', 'Purpose', 'Documented level', 'Live check']}
        rows={served<SystemAccount[]>(data?.evidence, data?.system_accounts, SYSTEM_ACCOUNTS).map((record) => {
          const current = live.get(record.id);
          const inEffect = current ? current.live.in_effect : null;
          return {
            checked: inEffect,
            cells: [
              <span key="account">
                {record.id} · {record.account}
                <br />
                <span className={styles.muted}>user_id {record.user_id}</span>
              </span>,
              <span key="purpose">
                {record.purpose}
                <br />
                <span className={styles.muted}>
                  Owner: <Member name={record.owner} />, approved {formatDay(record.approved_at)}
                </span>
              </span>,
              `${record.level_name} (${record.level})`,
              <State key="live" ok={inEffect}>
                {current ? (inEffect ? `In effect: ${levelLine(current.live, record.level)}` : `Differs: ${levelLine(current.live, record.level)}`) : 'Pending live check'}
              </State>,
            ],
          };
        })}
      />
      <EvidenceSource path={path} source={source} meta={data?.evidence ?? null} liveCheck={data?.live_check} />
    </div>
  );
}

interface TerminationLive extends LiveLevel {
  admin_removed: boolean | null;
  level_in_effect?: boolean | null;
  intdev_organizations?: number | null;
  render_member?: boolean | null;
  domain_grants_refused?: boolean;
}

type LiveTermination = TerminationRecord & { progress: { completed: number; total: number }; live: TerminationLive };

const REVERIFIED = `verified ${formatUtc(ALL_TERMINATIONS_VERIFIED_AT)}`;

function accessChecks(record: TerminationRecord, current: LiveTermination | undefined, renderReadAt: string | null) {
  const live = current?.live;
  const organizations = live?.intdev_organizations ?? null;
  const render = live?.render_member ?? null;
  return [
    {
      checked: live ? live.admin_removed : null,
      cells: ['Platform admin removed', live ? <State key="admin" ok={live.admin_removed}>{`${levelLine(live, record.account_level)}${live.admin_removed ? ', no admin' : ''}`}</State> : <State ok={null}>Pending live check</State>, 'Production users table, live'],
    },
    {
      checked: live ? live.level_in_effect ?? null : null,
      cells: ['Level matches this record', <State key="level" ok={live ? live.level_in_effect ?? null : null}>{`${levelName(record.account_level)} (${record.account_level}) recorded`}</State>, 'Production users table, live'],
    },
    {
      checked: organizations === null ? null : organizations === 0,
      cells: ['No INTDEV organization membership', <State key="orgs" ok={organizations === null ? null : organizations === 0}>{organizations === null ? 'Pending live check' : organizations === 0 ? 'None' : `${organizations} memberships remain`}</State>, 'Production organizations_membership, live'],
    },
    {
      checked: live ? live.domain_grants_refused ?? null : null,
      cells: ['Staff grants by INTDEV email address refused', <State key="domain" ok={live ? live.domain_grants_refused ?? null : null}>{live?.domain_grants_refused ? 'Refused by this termination record' : 'Pending live check'}</State>, 'INTDEV API authorization, live'],
    },
    renderReadAt && render !== null
      ? { checked: !render, cells: ['Not in a Render workspace', <State key="render" ok={!render}>{render ? 'Still a member' : 'Not a member of any INTDEV workspace'}</State>, `Render API, read ${formatUtc(renderReadAt)} for the serving release`] }
      : { checked: true, cells: ['Not in a Render workspace', 'Not a member of any INTDEV workspace', `Render API, ${REVERIFIED}`] },
  ];
}

export function TerminationRecords() {
  const path = EVIDENCE_ENDPOINTS.terminations;
  const { data, source } = useEvidence<{ records: LiveTermination[]; evidence: EvidenceMeta; live_check: string; render_check?: string; render_checked_at?: string | null }>(path);
  const live = new Map((data?.records ?? []).map((record) => [record.id, record]));
  const records: TerminationRecord[] = served(data?.evidence, data?.records, TERMINATIONS);
  const renderReadAt = data?.render_check === 'snapshot' ? data.render_checked_at ?? null : null;
  const closed = records.filter((record) => record.closed_at !== null).length;
  const steps = records.flatMap((record) => record.steps);
  const stepsCompleted = steps.filter((step) => step.status === 'completed').length;

  return (
    <div className={styles.group}>
      <p>
        <CheckItem checked={closed === records.length && stepsCompleted === steps.length}>
          {closed} of {records.length} termination records closed. {stepsCompleted} of {steps.length} checklist steps complete.
        </CheckItem>
      </p>
      <CheckTable
        columns={['Record', 'Closed', 'Checklist', 'Access checks']}
        rows={records.map((record) => {
          const checks = accessChecks(record, live.get(record.id), renderReadAt);
          const passing = checks.filter((item) => item.checked === true).length;
          const failing = checks.some((item) => item.checked === false);
          const completed = record.steps.filter((step) => step.status === 'completed').length;
          return {
            checked: record.closed_at !== null && completed === record.steps.length && !failing,
            cells: [`${record.id} · ${record.person}`, formatDay(record.closed_at), `${completed} of ${record.steps.length} steps`, <State key="live" ok={failing ? false : passing === checks.length ? true : null}>{failing || passing === checks.length ? `${passing} of ${checks.length} passing` : `${passing} of ${checks.length} passing; the rest load from the INTDEV API`}</State>],
          };
        })}
      />
      {records.map((record) => {
        const current = live.get(record.id);
        return (
          <div key={record.id} className={styles.group}>
            <h3 className={styles.recordTitle}>
              {record.id} · {record.person}
            </h3>
            <div className={styles.fields}>
              {(
                [
                  ['Type', record.type],
                  ['Joined', record.joined],
                  ['Left', record.left],
                  ['INTDEV API user_id', record.user_id],
                  ['Opened', formatDay(record.opened_at)],
                  ['Closed', record.closed_at ? formatDay(record.closed_at) : 'Open'],
                  ['Confirmed by', `${record.confirmation.by}, ${formatDay(record.confirmation.at)}. ${record.confirmation.detail}.`],
                ] as [string, string][]
              ).map(([label, value]) => (
                <div key={label} className={styles.field}>
                  <div className={styles.fieldLabel}>{label}</div>
                  <div>{value}</div>
                </div>
              ))}
            </div>
            <CheckTable columns={['Access check', 'Result', 'Source']} rows={accessChecks(record, current, renderReadAt)} />
            <CheckTable
              columns={['Checklist step', 'Method', 'Completed', 'Evidence']}
              rows={record.steps.map((step, index) => {
                const done = step.status === 'completed';
                return {
                  checked: done,
                  cells: [`${index + 1}. ${step.step}`, <State key="method" ok={done}>{done ? (step.method === 'system' ? 'Verified in system' : 'Attested by the CEO') : 'Open'}</State>, step.completed_at ? formatDay(step.completed_at) : done ? `Confirmed ${formatDay(record.confirmation.at)}` : '—', step.evidence],
                };
              })}
            />
          </div>
        );
      })}
      <EvidenceSource path={path} source={source} meta={data?.evidence ?? null} liveCheck={data?.live_check} />
    </div>
  );
}

type LiveTraining = TrainingCompletion & { signed: boolean; live: LiveLevel };

export function TrainingRoster() {
  const path = EVIDENCE_ENDPOINTS.training;
  const { data, source } = useEvidence<{ courses?: TrainingCourse[]; records: LiveTraining[]; evidence: EvidenceMeta; live_check: string }>(path);
  const live = new Map((data?.records ?? []).map((record) => [record.user_id, record]));
  const courses = served(data?.evidence, data?.courses, TRAINING_COURSES);
  const completions: TrainingCompletion[] = served(data?.evidence, data?.records, TRAINING_COMPLETIONS);
  const complete = (record: TrainingCompletion) => courses.every((course) => record.courses.includes(course.id));
  const signed = completions.filter(complete).length;

  return (
    <div className={styles.group}>
      <p>
        <CheckItem checked={signed === completions.length}>
          {signed} of {completions.length} team members signed {courses.length === 2 ? 'both courses' : `all ${courses.length} courses`}.
        </CheckItem>
      </p>
      <CheckTable
        columns={['Team member', ...courses.map((course) => course.title.replace(/ training$/, '')), 'Signed', 'INTDEV API level']}
        rows={completions.map((record) => {
          const current = live.get(record.user_id);
          return {
            checked: complete(record),
            cells: [
              <span key="person">
                <Member name={record.person} />
                <br />
                <span className={styles.muted}>{record.role}</span>
              </span>,
              ...courses.map((course) => (
                <CheckItem key={course.id} checked={record.courses.includes(course.id)}>
                  {record.courses.includes(course.id) ? 'Completed' : course.due ? `Not completed; due ${formatDay(course.due)}` : 'Not completed'}
                </CheckItem>
              )),
              <span key="signed">
                {formatDay(record.signed_at)}
                <br />
                <span className={styles.muted}>
                  Confirmed by <Member name={record.confirmation.by.split(',')[0] ?? record.confirmation.by} />
                </span>
              </span>,
              current ? levelLine(current.live, 0) : <State key="level" ok={null}>Pending live check</State>,
            ],
          };
        })}
      />
      <EvidenceSource path={path} source={source} meta={data?.evidence ?? null} liveCheck={data?.live_check} />
    </div>
  );
}

type LiveVulnerability = Vulnerability & { live_in_production: boolean | null };

export function RemediationRecords(props: { ids?: string[] }) {
  const path = EVIDENCE_ENDPOINTS.vulnerabilities;
  const { data, source } = useEvidence<{ findings: LiveVulnerability[]; evidence: EvidenceMeta }>(path);
  const live = new Map((data?.findings ?? []).map((finding) => [finding.id, finding]));
  const register: Vulnerability[] = served(data?.evidence, data?.findings, VULNERABILITIES);
  const findings = props.ids ? register.filter((finding) => props.ids?.includes(finding.id)) : register;

  return (
    <div className={styles.group}>
      {findings.map((finding) => {
        const current = live.get(finding.id);
        const production = finding.fixed_in ? (current ? (current.live_in_production ? `Yes, api.internet.dev is serving ${data?.evidence.release ?? 'a release'} (fix in ${finding.fixed_in})` : `Not yet; fix ships in ${finding.fixed_in}`) : `Fix in ${finding.fixed_in}; pending live check`) : 'Not applicable until remediated';
        return (
          <div key={finding.id} className={styles.group}>
            <h3 className={styles.recordTitle}>
              {finding.id} · {finding.severity}
            </h3>
            <div className={styles.fields}>
              {(
                [
                  ['Component', finding.component],
                  ['Found', finding.found],
                  ['Status', <CheckItem key="status" checked={finding.state !== 'open'}>{finding.status}</CheckItem>],
                  ['Live in production', finding.fixed_in ? <CheckItem key="live" checked={current ? current.live_in_production : null}>{production}</CheckItem> : <State key="live" ok={null}>{production}</State>],
                  ['Action', finding.action],
                  ...finding.evidence.map((item): [string, React.ReactNode] => [item.label, item.href ? <a key={item.label} href={item.href}>{item.detail}</a> : item.detail]),
                ] as [string, React.ReactNode][]
              ).map(([label, value], index) => (
                <div key={`${label}-${index}`} className={styles.field}>
                  <div className={styles.fieldLabel}>{label}</div>
                  <div>{value}</div>
                </div>
              ))}
            </div>
            {finding.treatment ? (
              <div className={styles.note}>
                <div className={styles.fields}>
                  {(
                    [
                      ['Risk treatment plan', finding.treatment.treatment],
                      ['Risk score', `Likelihood ${finding.treatment.likelihood} × impact ${finding.treatment.impact} = ${finding.treatment.likelihood * finding.treatment.impact} of 25 (Risk Management Policy scale)`],
                      ['Compensating controls', <ul key="controls" className={styles.list}>{finding.treatment.compensating_controls.map((control) => <li key={control}>{control}</li>)}</ul>],
                      ['Target', finding.treatment.target],
                      ['Next review', finding.treatment.review],
                      ['Management sign-off', <Signed key="signed" at={formatDay(finding.treatment.approved_at)} />],
                      ['Approved by', <Member key="approved" name={finding.treatment.approved_by} />],
                      ['Ratified', finding.treatment.ratified],
                    ] as [string, React.ReactNode][]
                  ).map(([label, value]) => (
                    <div key={label} className={styles.field}>
                      <div className={styles.fieldLabel}>{label}</div>
                      <div>{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
      <EvidenceSource path={path} source={source} meta={data?.evidence ?? null} />
    </div>
  );
}

function installedLine(item: { scope: string; installed: string | null } | undefined, pending: boolean): React.ReactNode {
  if (!item) return <State ok={null}>{pending ? 'Pending live check' : 'Unavailable'}</State>;
  if (item.installed) return item.installed;
  return item.scope === 'development' ? 'Not installed in production' : <State ok={false}>Not installed</State>;
}

export function SoftwareInventoryRecord() {
  const path = EVIDENCE_ENDPOINTS.vulnerabilities;
  const { data, source } = useEvidence<{ software: (SoftwareInventory & { manifest: string }) | null; evidence: EvidenceMeta }>(path);
  const software = data?.software ?? null;
  const live = new Map((software?.packages ?? []).map((item) => [item.name, item]));
  const pending = source === 'loading';
  const packages: (typeof API_SOFTWARE)[number][] = served(data?.evidence, software?.packages, API_SOFTWARE);
  const row = (item: (typeof API_SOFTWARE)[number]) => {
    const current = live.get(item.name);
    return [item.name, item.purpose, current ? (current.declared ?? 'Not declared') : '—', installedLine(current, pending)];
  };

  return (
    <div className={styles.group}>
      <p>
        Runtime: Node.js {software ? <>{software.node.running} on api.internet.dev; {API_MANIFEST} declares {software.node.declared ?? 'no engine range'}</> : <State ok={null}>{pending ? 'pending live check' : 'unavailable'}</State>}.
      </p>
      <Table columns={['Production package', 'Used for', 'package.json', 'Installed in production']} rows={packages.filter((item) => item.scope === 'production').map(row)} />
      <Table columns={['Development package', 'Used for', 'package.json', 'Installed in production']} rows={packages.filter((item) => item.scope === 'development').map(row)} />
      {software && software.undocumented.length ? (
        <p>
          <State ok={false}>Declared in package.json but not yet described here: {software.undocumented.join(', ')}.</State>
        </p>
      ) : null}
      <EvidenceSource path={path} source={source} meta={data?.evidence ?? null} />
    </div>
  );
}

interface LiveDeletions {
  summary: { evidenced_deletions: number; confirmed_within_last_12_months: number; orphaned_organization_memberships: number | null };
  records: { reference: string; source: string; account_created_at: string | null; deleted_after: string | null; deleted_by: string; within_last_12_months: string }[];
  evidence: EvidenceMeta;
  live_check: string;
}

export function DeletionRecord() {
  const path = EVIDENCE_ENDPOINTS.dataDeletions;
  const { data, source } = useEvidence<LiveDeletions>(path);
  const records = data?.records ?? DELETION_SNAPSHOT.records.map((record) => ({ ...record, source: 'ledger', deleted_by: DELETION_SNAPSHOT.captured_at }));
  const confirmed = records.filter((record) => record.within_last_12_months === 'confirmed').length;
  const memberships = data ? data.summary.orphaned_organization_memberships : DELETION_SNAPSHOT.orphaned_organization_memberships;

  return (
    <div className={styles.group}>
      <div className={styles.fields}>
        {(
          [
            ['Deleted accounts evidenced', `${records.length}`],
            ['Confirmed within the last 12 months', `${confirmed}`],
            ['Earlier, or not datable', `${records.length - confirmed}`],
            ['Leftover organization memberships', memberships === null ? '—' : `${memberships} rows that reference deleted accounts and carry no other personal data; removed with the account from INTDEV API 2.0.9`],
            ['As of', data ? formatUtc(data.evidence.checked_at) : `${formatUtc(DELETION_SNAPSHOT.captured_at)} (published register)`],
          ] as [string, string][]
        ).map(([label, value]) => (
          <div key={label} className={styles.field}>
            <div className={styles.fieldLabel}>{label}</div>
            <div>{value}</div>
          </div>
        ))}
      </div>
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Anonymous reference</th>
              <th scope="col">Account created</th>
              <th scope="col">Deleted after</th>
              <th scope="col">Deleted by</th>
              <th scope="col">Last 12 months</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.reference}>
                <td>{record.reference}</td>
                <td>{formatUtc(record.account_created_at)}</td>
                <td>{formatUtc(record.deleted_after)}</td>
                <td>{record.source === 'deletion_log' ? `${formatUtc(record.deleted_by)} (deletion log)` : `${formatUtc(record.deleted_by)} at the latest`}</td>
                <td>{record.within_last_12_months === 'confirmed' ? 'Yes' : 'Possibly'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <EvidenceSource path={path} source={source} meta={data?.evidence ?? null} liveCheck={data?.live_check} />
    </div>
  );
}

const PUBLISHED_REPORT = buildComplianceReport({ ...EMPTY_REPORT_INPUTS, infrastructure: INFRASTRUCTURE_SNAPSHOT });

export function ComplianceReport() {
  const path = EVIDENCE_ENDPOINTS.report;
  const { data, source } = useEvidence<ComplianceReportData & { evidence: EvidenceMeta; live_check: string }>(path);
  const report = data ?? PUBLISHED_REPORT;
  const { summary } = report;
  const areas = [...new Set(report.checks.map((item) => item.area))];

  return (
    <div className={styles.group}>
      <p>
        <CheckItem checked={summary.open > 0 ? false : summary.unavailable > 0 ? null : true}>
          {summary.passed} of {summary.total} checks pass{summary.open ? `, ${summary.open} open` : ''}
          {summary.unavailable ? `, ${summary.unavailable} awaiting live data` : ''}.
        </CheckItem>
      </p>
      {areas.map((area) => (
        <div key={area} className={styles.group}>
          <h3 className={styles.recordTitle}>{area}</h3>
          <CheckTable
            columns={['Check', 'Result', 'Record']}
            rows={report.checks
              .filter((item) => item.area === area)
              .map((item) => ({
                checked: statusChecked(item.status),
                cells: [
                  item.title,
                  <State key="result" ok={statusChecked(item.status)}>
                    {item.result}
                  </State>,
                  <span key="record">
                    <a href={item.page}>{findCatalogEntry(item.page.replace('/compliance/', ''))?.title ?? item.page}</a>
                    {item.endpoint ? (
                      <>
                        <br />
                        <a href={`${API_HOST}${item.endpoint}`} className={styles.muted}>
                          JSON
                        </a>
                      </>
                    ) : null}
                  </span>,
                ],
              }))}
          />
        </div>
      ))}
      <EvidenceSource path={path} source={source} meta={data?.evidence ?? null} liveCheck={data?.live_check} />
    </div>
  );
}

interface LiveReleases {
  current: ReleaseScan | null;
  scans: ReleaseScan[];
  evidence: EvidenceMeta;
  live_check: string;
}

function releaseName(scan: ReleaseScan) {
  return `${scan.version ?? 'Unknown release'}${scan.commit ? ` (${scan.commit})` : ''}`;
}

export function ReleaseChecks(props: { limit?: number }) {
  const path = EVIDENCE_ENDPOINTS.releases;
  const { data, source } = useEvidence<LiveReleases>(path);
  const latest = data?.current ?? data?.scans[0] ?? null;
  const history = (data?.scans ?? []).slice(0, props.limit ?? 10);

  return (
    <div className={styles.group}>
      {latest ? (
        <>
          <p>
            <CheckItem checked={latest.passed === latest.total}>
              Release {releaseName(latest)} on instance {latest.instance}: {latest.passed} of {latest.total} launch checks passed, {formatUtc(latest.scanned_at)}.
            </CheckItem>
          </p>
          <CheckTable columns={['Launch check', 'Result', 'Time']} rows={latest.checks.map((item) => ({ checked: item.ok, cells: [item.label, <State key="detail" ok={item.ok}>{item.detail}</State>, item.ms === null ? '—' : `${item.ms} ms`] }))} />
          <CheckTable columns={['Release', 'Instance', 'Scanned', 'Checks']} rows={history.map((scan) => ({ checked: scan.passed === scan.total, cells: [releaseName(scan), scan.instance, formatUtc(scan.scanned_at), `${scan.passed} of ${scan.total} passed`] }))} />
        </>
      ) : (
        <p className={styles.muted}>{source === 'loading' ? 'Loading release scans from the INTDEV API.' : 'No release scan has been recorded yet. The first one is written when an INTDEV API release from 2.0.9 starts in production.'}</p>
      )}
      <EvidenceSource path={path} source={source} meta={data?.evidence ?? null} liveCheck={data?.live_check} />
    </div>
  );
}

interface LiveDevices {
  summary: DeviceFleetSummary;
  members: DeviceMember[];
  evidence: EvidenceMeta;
  live_check: string;
}

function encryptionLine(device: DeviceRecord): string {
  if (device.assessment.disk_encrypted) return `FileVault on: ${device.assessment.cipher}`;
  if (device.filevault.on && device.filevault.in_progress) return 'FileVault on, still encrypting';
  return device.filevault.on ? 'FileVault on, but the data volume does not report encryption' : 'FileVault off';
}

function deviceRow(person: React.ReactNode, device: DeviceRecord) {
  const current = device.current;
  const removable = device.removable_media;
  return {
    checked: current ? device.assessment.disk_encrypted && device.assessment.removable_media_clear : null,
    cells: [
      person,
      <span key="device">
        {device.model} · macOS {device.os_version}
        <br />
        <span className={styles.muted}>
          Reference {device.device_ref}
          {device.mdm_enrolled ? ' · MDM enrolled' : ''}
        </span>
      </span>,
      <State key="encryption" ok={current ? device.assessment.disk_encrypted : null}>
        {encryptionLine(device)}
      </State>,
      <State key="removable" ok={current ? device.assessment.removable_media_clear : null}>
        {removable.unencrypted_writable ? `${removable.unencrypted_writable} unencrypted writable volume${removable.unencrypted_writable === 1 ? '' : 's'} mounted` : removable.mounted ? `${removable.mounted} mounted, all encrypted or read-only` : 'None mounted'}
      </State>,
      <span key="checked">
        {formatUtc(device.checked_at)}
        {current ? null : (
          <>
            <br />
            <span className={styles.muted}>Older than {DEVICE_CHECK_FRESH_DAYS} days; not counted</span>
          </>
        )}
      </span>,
    ],
  };
}

export function DeviceEncryptionReport() {
  const path = EVIDENCE_ENDPOINTS.devices;
  const { data, source } = useEvidence<LiveDevices>(path);
  const summary = data?.summary ?? null;
  const members = new Map((data?.members ?? []).map((member) => [member.user_id, member]));
  const compiledRoster = TEAM.map((person) => members.get(person.userId) ?? { person: person.name, user_id: person.userId, reporting: false, devices: [] });
  const roster: Pick<DeviceMember, 'person' | 'user_id' | 'reporting' | 'devices'>[] = served(data?.evidence, data?.members, compiledRoster);

  const rows = roster.flatMap((member) => {
    const location = laptopLocation(member.person);
    const name = (
      <span key="person">
        <Member name={member.person} />
        <br />
        <span className={styles.muted}>{location ?? 'Location not yet recorded'}</span>
      </span>
    );
    if (member.reporting) return member.devices.map((device) => deviceRow(name, device));
    const pending = !data;
    const missing = {
      checked: pending ? null : false,
      cells: [name, <State key="device" ok={pending ? null : false}>{pending ? 'Pending live check' : `No laptop reported in the last ${DEVICE_CHECK_FRESH_DAYS} days`}</State>, '—', '—', '—'],
    };
    return [missing, ...member.devices.map((device) => deviceRow(name, device))];
  });

  return (
    <div className={styles.group}>
      <p>
        <CheckItem checked={summary ? summary.members > 0 && summary.members_encrypted === summary.members : null}>
          {summary
            ? `${summary.members_encrypted} of ${summary.members} team members have every current laptop encrypted with FileVault, and ${summary.members_reporting} reported in the last ${DEVICE_CHECK_FRESH_DAYS} days. ${summary.devices_encrypted} of ${summary.devices} current laptops are encrypted, ${summary.devices_aes_256} of them with AES-256.`
            : `${roster.length} team members. Each laptop’s encryption loads from the INTDEV API.`}
        </CheckItem>
      </p>
      {summary ? (
        <p>
          <CheckItem checked={summary.devices > 0 && summary.devices_removable_clear === summary.devices}>
            {summary.devices ? `${summary.devices_removable_clear} of ${summary.devices} current laptops had no unencrypted, writable removable volume mounted at their last check-in.` : 'No laptop has checked in yet.'}
          </CheckItem>
        </p>
      ) : null}
      <p>{`Every work laptop is classified ${DEVICE_INVENTORY.classification}. ${DEVICE_INVENTORY.classification_basis} Location: ${DEVICE_INVENTORY.location} Recovery: ${DEVICE_INVENTORY.recovery} Disposal: ${DEVICE_INVENTORY.disposal}`}</p>
      <CheckTable columns={['Team member and location', 'Laptop', 'Disk encryption', 'Removable media', 'Last check-in']} rows={rows} />
      <EvidenceSource path={path} source={source} meta={data?.evidence ?? null} liveCheck={data?.live_check} />
    </div>
  );
}

function antiMalwareLine(device: DeviceRecord): string {
  const malware = device.anti_malware;
  if (!malware) return 'Not read: this check-in predates device check 3';
  const xprotect = malware.xprotect.version ? `XProtect ${malware.xprotect.version}${malware.xprotect.installed_at ? `, installed ${formatUtc(malware.xprotect.installed_at)}` : ''}` : 'XProtect definitions not found';
  return `${xprotect} · Gatekeeper ${malware.gatekeeper.on ? 'on' : 'off'} · automatic security responses ${malware.automatic_updates.xprotect ? 'on' : 'off'} · security updates ${malware.automatic_updates.security ? 'on' : 'off'}`;
}

export function DeviceAntiMalwareReport() {
  const path = EVIDENCE_ENDPOINTS.devices;
  const { data, source } = useEvidence<LiveDevices>(path);
  const summary = data?.summary ?? null;
  const members = new Map((data?.members ?? []).map((member) => [member.user_id, member]));
  const compiledRoster = TEAM.map((person) => members.get(person.userId) ?? { person: person.name, user_id: person.userId, reporting: false, devices: [] });
  const roster: Pick<DeviceMember, 'person' | 'user_id' | 'reporting' | 'devices'>[] = served(data?.evidence, data?.members, compiledRoster);

  const rows = roster.flatMap((member) => {
    const name = <Member key="person" name={member.person} />;
    const current = member.devices.filter((device) => device.current);
    if (!current.length) {
      const pending = !data;
      return [{ checked: pending ? null : false, cells: [name, <State key="device" ok={pending ? null : false}>{pending ? 'Pending live check' : `No laptop reported in the last ${DEVICE_CHECK_FRESH_DAYS} days`}</State>, '—', '—'] }];
    }
    return current.map((device) => ({
      checked: device.assessment.anti_malware_active,
      cells: [
        name,
        <span key="device">
          {device.model} · macOS {device.os_version}
          <br />
          <span className={styles.muted}>Reference {device.device_ref} · checked {formatUtc(device.checked_at)}</span>
        </span>,
        <State key="malware" ok={device.assessment.anti_malware_active}>
          {antiMalwareLine(device)}
        </State>,
        <State key="firewall" ok={device.assessment.firewall_on}>
          {device.firewall ? device.firewall.status : 'Not read'}
        </State>,
      ],
    }));
  });

  return (
    <div className={styles.group}>
      <p>
        <CheckItem checked={summary ? summary.devices > 0 && summary.devices_anti_malware === summary.devices : null}>
          {summary
            ? summary.devices
              ? `${summary.devices_anti_malware} of ${summary.devices} current laptops reported Gatekeeper on, XProtect definitions installed, and automatic security responses on at their last check-in. ${summary.devices_firewall_on} of ${summary.devices} reported the application firewall on.`
              : 'No laptop has checked in yet.'
            : `${roster.length} team members. Each laptop’s anti-malware state loads from the INTDEV API.`}
        </CheckItem>
      </p>
      <CheckTable columns={['Team member', 'Laptop', 'Anti-malware', 'Application firewall']} rows={rows} />
      <EvidenceSource path={path} source={source} meta={data?.evidence ?? null} liveCheck={data?.live_check} />
    </div>
  );
}

export function DeviceManagementRecord() {
  const path = EVIDENCE_ENDPOINTS.devices;
  const { data, source } = useEvidence<LiveDevices>(path);
  const summary = data?.summary ?? null;
  const pending = source === 'loading' ? 'Pending live check' : 'Unavailable';
  const row = (label: string, ok: (fleet: DeviceFleetSummary) => boolean, detail: (fleet: DeviceFleetSummary) => string) => {
    const checked = summary ? ok(summary) : null;
    return { checked, cells: [label, <State key="result" ok={checked}>{summary ? detail(summary) : pending}</State>] };
  };

  return (
    <div className={styles.group}>
      <CheckTable
        columns={['Management check', 'Result']}
        rows={[
          row('Every current team member has a laptop enrolled and reporting', (fleet) => fleet.members > 0 && fleet.members_reporting === fleet.members, (fleet) => `${fleet.members_reporting} of ${fleet.members} team members checked in within the last ${DEVICE_CHECK_FRESH_DAYS} days, with ${fleet.devices} current laptop${fleet.devices === 1 ? '' : 's'} under management`),
          row('Every managed laptop is encrypted with FileVault', (fleet) => fleet.devices > 0 && fleet.devices_encrypted === fleet.devices, (fleet) => `${fleet.devices_encrypted} of ${fleet.devices} current laptops encrypted, ${fleet.devices_aes_256} with AES-256`),
          row('No managed laptop has an unencrypted, writable removable volume mounted', (fleet) => fleet.devices > 0 && fleet.devices_removable_clear === fleet.devices, (fleet) => `${fleet.devices_removable_clear} of ${fleet.devices} current laptops clear at their last check-in`),
          row('Every managed laptop reports anti-malware active', (fleet) => fleet.devices > 0 && fleet.devices_anti_malware === fleet.devices, (fleet) => `${fleet.devices_anti_malware} of ${fleet.devices} current laptops reported Gatekeeper, XProtect, and automatic security responses on; ${fleet.devices_firewall_on} with the application firewall on`),
        ]}
      />
      {summary ? <p>{`${summary.devices_mdm_enrolled} of ${summary.devices} current laptops are also enrolled with a third-party MDM server, as macOS reports it (profiles status). INTDEV’s device management does not depend on one.`}</p> : null}
      <EvidenceSource path={path} source={source} meta={data?.evidence ?? null} liveCheck={data?.live_check} />
    </div>
  );
}

interface LiveEncryption {
  laptops: { standards: LaptopEncryptionStandard[] };
  evidence: EvidenceMeta;
  live_check: string;
}

function laptopCount(standard: LaptopEncryptionStandard | undefined, loading: boolean): React.ReactNode {
  if (!standard || standard.current_laptops === null || standard.encrypted === null) return <State ok={null}>{loading ? 'Pending live check' : 'Unavailable'}</State>;
  if (!standard.current_laptops) return 'None';
  return (
    <State ok={standard.encrypted === standard.current_laptops}>
      {standard.encrypted} of {standard.current_laptops} with FileVault on
    </State>
  );
}

export function FileVaultStandardReport() {
  const path = EVIDENCE_ENDPOINTS.encryption;
  const { data, source } = useEvidence<LiveEncryption>(path);
  const live = new Map((data?.laptops.standards ?? []).map((standard) => [standard.chip, standard]));
  const chips = Object.keys(FILEVAULT_STANDARD) as DeviceChip[];

  return (
    <div className={styles.group}>
      <Table
        columns={['Mac', 'FileVault encryption', 'AES cipher key', 'Current laptops', 'Apple’s documentation']}
        rows={chips.map((chip) => {
          const standard = FILEVAULT_STANDARD[chip];
          return [
            standard.hardware,
            <span key="algorithm">
              {standard.algorithm}
              <br />
              <span className={styles.muted}>{standard.key_handling}</span>
            </span>,
            standard.aes_key_bits ? `${standard.aes_key_bits}-bit` : 'Not published by Apple',
            laptopCount(live.get(chip), source === 'loading'),
            <span key="sources">
              {standard.sources
                .filter((item, index, all) => all.findIndex((other) => other.href === item.href) === index)
                .map((item, index) => (
                  <React.Fragment key={item.href}>
                    {index ? <br /> : null}
                    <a href={item.href}>{item.title.replace('Apple Platform Security: ', '')}</a>
                  </React.Fragment>
                ))}
            </span>,
          ];
        })}
      />
      <EvidenceSource path={path} source={source} meta={data?.evidence ?? null} liveCheck={data?.live_check} />
    </div>
  );
}

interface LiveInfrastructure {
  captured_at: string | null;
  aws: AwsControls | null;
  tls: TlsHostRead[];
  checks: ReportCheck[];
  evidence: EvidenceMeta;
  live_check: string;
}

const COMPILED_INFRASTRUCTURE_CHECKS = infrastructureChecks(INFRASTRUCTURE_SNAPSHOT);

function useInfrastructure() {
  const path = EVIDENCE_ENDPOINTS.infrastructure;
  const { data, source } = useEvidence<LiveInfrastructure>(path);
  const live = data && data.captured_at ? data : null;
  return {
    path,
    source,
    data,
    capturedAt: live?.captured_at ?? INFRASTRUCTURE_SNAPSHOT?.captured_at ?? null,
    aws: live ? live.aws : (INFRASTRUCTURE_SNAPSHOT?.aws ?? null),
    tls: live ? live.tls : (INFRASTRUCTURE_SNAPSHOT?.tls ?? []),
    checks: live ? live.checks : COMPILED_INFRASTRUCTURE_CHECKS,
  };
}

function ReadLine(props: { capturedAt: string | null; what: string }) {
  return <p className={styles.muted}>{props.capturedAt ? `${props.what} read on a maintainer machine at ${formatUtc(props.capturedAt)}, when the INTDEV API release serving this record was built, and compiled into it.` : `This release carries no ${props.what} read.`}</p>;
}

export function InfrastructureChecks(props: { ids: string[] }) {
  const { path, source, data, capturedAt, checks } = useInfrastructure();
  const shown = props.ids.map((id) => checks.find((item) => item.id === id)).filter((item): item is ReportCheck => !!item);
  return (
    <div className={styles.group}>
      <CheckTable
        columns={['Check', 'Result']}
        rows={shown.map((item) => ({
          checked: statusChecked(item.status),
          cells: [
            item.title,
            <State key="result" ok={statusChecked(item.status)}>
              {item.result}
            </State>,
          ],
        }))}
      />
      <ReadLine capturedAt={capturedAt} what="AWS and TLS configuration" />
      <EvidenceSource path={path} source={source} meta={data?.evidence ?? null} liveCheck={data?.live_check} />
    </div>
  );
}

export function TlsRecord() {
  const { path, source, data, capturedAt, tls } = useInfrastructure();
  return (
    <div className={styles.group}>
      <Table
        columns={['Hostname', 'HTTP', 'Negotiated', 'TLS 1.1', 'Certificate']}
        rows={tls.map((host) => [
          host.host,
          host.http,
          host.error ? <State key="error" ok={false}>{`Unreachable: ${host.error}`}</State> : `${host.protocol ?? 'Unknown'}, ${host.cipher ?? 'unknown cipher'}`,
          host.tls_1_1 === 'refused' ? 'Refused' : host.tls_1_1 === 'accepted' ? <State key="legacy" ok={false}>Accepted</State> : 'Not tested',
          `${host.issuer ?? 'Unknown issuer'}${host.valid_to ? `, valid to ${formatDay(host.valid_to.slice(0, 10))}` : ''}`,
        ])}
      />
      <ReadLine capturedAt={capturedAt} what="TLS configuration" />
      <EvidenceSource path={path} source={source} meta={data?.evidence ?? null} liveCheck={data?.live_check} />
    </div>
  );
}

function keyUse(user: AwsControls['iam_users'][number]): string {
  if (!user.last_used) return user.active_keys ? 'Never used' : 'No access key';
  const used = `${formatDay(user.last_used)}${user.last_used_service ? ` (${user.last_used_service === 'console' ? 'console' : user.last_used_service.toUpperCase()})` : ''}`;
  return user.unused_keys ? `${used}; ${user.unused_keys === 1 ? 'one key has' : `${user.unused_keys} keys have`} never been used` : used;
}

export function AwsIdentityRecord() {
  const { path, source, data, capturedAt, aws } = useInfrastructure();
  const users = aws?.iam_users ?? [];
  return (
    <div className={styles.group}>
      <Table
        columns={['AWS identity', 'Purpose', 'MFA', 'Access last used', 'Owner', 'Review outcome']}
        rows={[
          ...users.map((user) => {
            const review = AWS_IAM_REVIEW[user.name];
            return [
              user.name,
              review ? review.purpose : <State key="purpose" ok={false}>Not in the review register</State>,
              user.console ? <State key="mfa" ok={user.mfa}>{user.mfa ? 'Yes' : 'No'}</State> : 'Not applicable (no console password)',
              keyUse(user),
              <State key="owner" ok={user.owner_tagged}>{user.owner_tagged ? 'j@internet.dev (VantaOwner tag)' : 'No VantaOwner tag'}</State>,
              review ? `${review.outcome} (${formatDay(AWS_IAM_REVIEWED_AT)})` : <State key="outcome" ok={false}>Review needed</State>,
            ];
          }),
          ['vanta-auditor (role)', 'Read-only role assumed by Vanta', 'Not applicable (role)', 'Not applicable (role)', aws ? `${aws.roles.owner_tagged} of ${aws.roles.total} customer-managed roles carry the VantaOwner tag` : '—', `Keep (${formatDay(AWS_IAM_REVIEWED_AT)})`],
        ]}
      />
      <ReadLine capturedAt={capturedAt} what="AWS IAM configuration" />
      <EvidenceSource path={path} source={source} meta={data?.evidence ?? null} liveCheck={data?.live_check} />
    </div>
  );
}

interface LiveVersions {
  serving: { release: string | null; recorded: boolean; entry: ReleaseVersion | null };
  versions: ReleaseVersion[];
  evidence: EvidenceMeta;
  live_check: string;
}

function changeLine(change: ReleaseVersion['changes'][number]): string {
  if (change.from === null) return `Added ${change.subject}: ${change.to ?? ''}`;
  if (change.to === null) return `Removed ${change.subject} (was ${change.from})`;
  return `${change.subject}: ${change.from} → ${change.to}`;
}

export function VersionHistory(props: { limit?: number }) {
  const path = EVIDENCE_ENDPOINTS.versions;
  const { data, source } = useEvidence<LiveVersions>(path);
  const versions = (data?.versions ?? []).slice(0, props.limit ?? 10);
  return (
    <div className={styles.group}>
      {data ? (
        <>
          <p>
            <CheckItem checked={data.serving.recorded}>
              {data.serving.recorded ? `Release ${data.serving.release ?? 'unknown'} is in the version ledger.` : `Release ${data.serving.release ?? 'unknown'} has no entry in the version ledger.`}
            </CheckItem>
          </p>
          {versions.map((entry) => (
            <div key={entry.version} className={styles.group}>
              <h3 className={styles.recordTitle}>
                {entry.version}, recorded {formatUtc(entry.recorded_at)}
              </h3>
              <p className={styles.muted}>
                {entry.summary.routes ?? 0} routes, {entry.summary.dependencies ?? 0} dependencies, {entry.summary.controls ?? 0} infrastructure controls, {entry.summary.pages ?? 0} compliance pages, registers {entry.registers ?? 'unknown'}.
                {entry.previous ? ` ${entry.changes.length ? `${entry.changes.length} changes` : 'No changes'} since ${entry.previous}.` : ' The first version in the ledger.'}
              </p>
              {entry.changes.length ? <Table columns={['Area', 'Change']} rows={entry.changes.map((change) => [change.area, changeLine(change)])} /> : null}
            </div>
          ))}
        </>
      ) : (
        <p className={styles.muted}>{source === 'loading' ? 'Loading the version ledger from the INTDEV API.' : 'The version ledger is unavailable right now.'}</p>
      )}
      <EvidenceSource path={path} source={source} meta={data?.evidence ?? null} liveCheck={data?.live_check} />
    </div>
  );
}
