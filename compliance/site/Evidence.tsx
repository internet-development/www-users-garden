'use client';

import styles from '@root/compliance/site/Blocks.module.css';

import * as React from 'react';

import type { AccessGrant, CheckStatus, ComplianceReportData, DeviceFleetSummary, DeviceMember, DeviceRecord, EvidenceMeta, ReleaseScan, TerminationRecord, TrainingCompletion, Vulnerability } from '@root/compliance/site/types';

import { CheckItem, CheckTable, Signed, State } from '@root/compliance/site/Blocks';
import { formatUtc } from '@root/compliance/site/Live';
import { API_HOST, TEAM, VULNERABILITIES } from '@root/compliance/site/facts';
import { ACCESS_GRANTS, DELETION_SNAPSHOT, DEVICE_CHECK_FRESH_DAYS, EVIDENCE_ENDPOINTS, TERMINATIONS, TERMINATIONS_REVERIFIED_AT, TRAINING_COMPLETIONS, TRAINING_COURSES, levelName } from '@root/compliance/site/records';
import { EMPTY_REPORT_INPUTS, buildComplianceReport } from '@root/compliance/site/report';
import { findCatalogEntry } from '@root/compliance/site/catalog';

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
    fetch(`${API_HOST}${path}`, { cache: 'no-store' })
      .then(async (response) => {
        const body: unknown = response.ok ? await response.json() : null;
        const next = body && typeof body === 'object' ? (body as { data?: unknown }).data : null;
        if (!active) return;
        if (next && typeof next === 'object' && 'evidence' in next) {
          setData(next as T);
          setSource('live');
        } else {
          setSource('snapshot');
        }
      })
      .catch(() => {
        if (active) setSource('snapshot');
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
    line = `Live from the INTDEV API (${release}, published ${formatUtc(props.meta.published_at)}), checked ${formatUtc(props.meta.checked_at)}.${props.liveCheck === 'unavailable' ? ' The production database could not be read for this response, so live checks are blank.' : ''}`;
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
            {ACCESS_GRANTS.map((grant) => {
              const current = live.get(grant.id);
              return (
                <tr key={grant.id}>
                  <td>
                    {grant.id}
                    <br />
                    {grant.kind === 'grant' ? 'Grant' : 'Revocation'}
                  </td>
                  <td>
                    {grant.request.by}, {formatDay(grant.request.at)}
                    <br />
                    <span className={styles.muted}>{grant.request.detail}</span>
                  </td>
                  <td>
                    {grant.approval.decision} by {grant.approval.by}, {formatDay(grant.approval.at)}
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

interface TerminationLive extends LiveLevel {
  admin_removed: boolean | null;
  level_in_effect?: boolean | null;
  intdev_organizations?: number | null;
  render_member?: boolean | null;
  domain_grants_refused?: boolean;
}

type LiveTermination = TerminationRecord & { progress: { completed: number; total: number }; live: TerminationLive };

const REVERIFIED = `verified ${formatUtc(TERMINATIONS_REVERIFIED_AT)}`;

function accessChecks(record: TerminationRecord, current: LiveTermination | undefined, renderLive: boolean) {
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
    renderLive && render !== null
      ? { checked: !render, cells: ['Not in a Render workspace', <State key="render" ok={!render}>{render ? 'Still a member' : 'Not a member of any INTDEV workspace'}</State>, 'Render API, live'] }
      : { checked: true, cells: ['Not in a Render workspace', 'Not a member of any INTDEV workspace', `Render API, ${REVERIFIED}`] },
  ];
}

export function TerminationRecords() {
  const path = EVIDENCE_ENDPOINTS.terminations;
  const { data, source } = useEvidence<{ records: LiveTermination[]; evidence: EvidenceMeta; live_check: string; render_check?: string }>(path);
  const live = new Map((data?.records ?? []).map((record) => [record.id, record]));
  const renderLive = data?.render_check === 'verified';
  const closed = TERMINATIONS.filter((record) => record.closed_at !== null).length;
  const steps = TERMINATIONS.flatMap((record) => record.steps);
  const stepsCompleted = steps.filter((step) => step.status === 'completed').length;

  return (
    <div className={styles.group}>
      <p>
        <CheckItem checked={closed === TERMINATIONS.length && stepsCompleted === steps.length}>
          {closed} of {TERMINATIONS.length} termination records closed. {stepsCompleted} of {steps.length} checklist steps complete.
        </CheckItem>
      </p>
      <CheckTable
        columns={['Record', 'Closed', 'Checklist', 'Access checks']}
        rows={TERMINATIONS.map((record) => {
          const checks = accessChecks(record, live.get(record.id), renderLive);
          const passing = checks.filter((item) => item.checked === true).length;
          const failing = checks.some((item) => item.checked === false);
          const completed = record.steps.filter((step) => step.status === 'completed').length;
          return {
            checked: record.closed_at !== null && completed === record.steps.length && !failing,
            cells: [`${record.id} · ${record.person}`, formatDay(record.closed_at), `${completed} of ${record.steps.length} steps`, <State key="live" ok={failing ? false : passing === checks.length ? true : null}>{failing || passing === checks.length ? `${passing} of ${checks.length} passing` : `${passing} of ${checks.length} passing; the rest load from the INTDEV API`}</State>],
          };
        })}
      />
      {TERMINATIONS.map((record) => {
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
            <CheckTable columns={['Access check', 'Result', 'Source']} rows={accessChecks(record, current, renderLive)} />
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
  const { data, source } = useEvidence<{ records: LiveTraining[]; evidence: EvidenceMeta; live_check: string }>(path);
  const live = new Map((data?.records ?? []).map((record) => [record.user_id, record]));
  const signed = TRAINING_COMPLETIONS.filter((record) => TRAINING_COURSES.every((course) => record.courses.includes(course.id))).length;

  return (
    <div className={styles.group}>
      <p>
        <CheckItem checked={signed === TRAINING_COMPLETIONS.length}>
          {signed} of {TRAINING_COMPLETIONS.length} team members signed both courses.
        </CheckItem>
      </p>
      <CheckTable
        columns={['Team member', ...TRAINING_COURSES.map((course) => course.title.replace(/ training$/, '')), 'Signed', 'INTDEV API level']}
        rows={TRAINING_COMPLETIONS.map((record) => {
          const current = live.get(record.user_id);
          return {
            checked: TRAINING_COURSES.every((course) => record.courses.includes(course.id)),
            cells: [
              <span key="person">
                {record.person}
                <br />
                <span className={styles.muted}>{record.role}</span>
              </span>,
              ...TRAINING_COURSES.map((course) => (
                <CheckItem key={course.id} checked={record.courses.includes(course.id)}>
                  {record.courses.includes(course.id) ? 'Completed' : 'Not completed'}
                </CheckItem>
              )),
              <span key="signed">
                {formatDay(record.signed_at)}
                <br />
                <span className={styles.muted}>Confirmed by {record.confirmation.by.split(',')[0]}</span>
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
  const findings = props.ids ? VULNERABILITIES.filter((finding) => props.ids?.includes(finding.id)) : VULNERABILITIES;

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
                      ['Approved by', finding.treatment.approved_by],
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

const PUBLISHED_REPORT = buildComplianceReport(EMPTY_REPORT_INPUTS);

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

function deviceRow(person: string, device: DeviceRecord, first: boolean) {
  const current = device.current;
  const removable = device.removable_media;
  return {
    checked: current ? device.assessment.disk_encrypted && device.assessment.removable_media_clear : null,
    cells: [
      first ? person : '',
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
  const members = new Map((data?.members ?? []).map((member) => [member.user_id, member]));
  const summary = data?.summary ?? null;

  const rows = TEAM.flatMap((person) => {
    const member = members.get(person.userId);
    const devices = member?.devices ?? [];
    if (member?.reporting) return devices.map((device, index) => deviceRow(person.name, device, index === 0));
    const pending = !data;
    const missing = {
      checked: pending ? null : false,
      cells: [person.name, <State key="device" ok={pending ? null : false}>{pending ? 'Pending live check' : `No laptop reported in the last ${DEVICE_CHECK_FRESH_DAYS} days`}</State>, '—', '—', '—'],
    };
    return [missing, ...devices.map((device) => deviceRow(person.name, device, false))];
  });

  return (
    <div className={styles.group}>
      <p>
        <CheckItem checked={summary ? summary.members > 0 && summary.members_encrypted === summary.members : null}>
          {summary
            ? `${summary.members_encrypted} of ${summary.members} team members have every current laptop encrypted with FileVault, and ${summary.members_reporting} reported in the last ${DEVICE_CHECK_FRESH_DAYS} days. ${summary.devices_encrypted} of ${summary.devices} current laptops are encrypted, ${summary.devices_aes_256} of them with AES-256.`
            : `${TEAM.length} team members. Each laptop’s encryption loads from the INTDEV API.`}
        </CheckItem>
      </p>
      {summary ? (
        <p>
          <CheckItem checked={summary.devices > 0 && summary.devices_removable_clear === summary.devices}>
            {summary.devices ? `${summary.devices_removable_clear} of ${summary.devices} current laptops had no unencrypted, writable removable volume mounted at their last check-in.` : 'No laptop has checked in yet.'}
          </CheckItem>
        </p>
      ) : null}
      <CheckTable columns={['Team member', 'Laptop', 'Disk encryption', 'Removable media', 'Last check-in']} rows={rows} />
      <EvidenceSource path={path} source={source} meta={data?.evidence ?? null} liveCheck={data?.live_check} />
    </div>
  );
}
