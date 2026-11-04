'use client';

import styles from '@root/compliance/site/Blocks.module.css';

import * as React from 'react';

import type { AccessGrant, EvidenceMeta, TerminationRecord, TrainingCompletion, Vulnerability } from '@root/compliance/site/types';

import { formatUtc } from '@root/compliance/site/Live';
import { API_HOST, VULNERABILITIES } from '@root/compliance/site/facts';
import { ACCESS_GRANTS, DELETION_SNAPSHOT, EVIDENCE_ENDPOINTS, TERMINATIONS, TRAINING_COMPLETIONS, TRAINING_COURSES, levelName } from '@root/compliance/site/records';

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

function Signed(props: { at: string }) {
  return (
    <span className={styles.signed}>
      <span className={styles.signedCheck} aria-hidden="true">
        &#10003;
      </span>
      SIGNED {formatDay(props.at)}
    </span>
  );
}

function Checkbox(props: { checked: boolean | null; label: string }) {
  const className = props.checked === null ? `${styles.checkbox} ${styles.checkboxPending}` : props.checked ? `${styles.checkbox} ${styles.checkboxChecked}` : styles.checkbox;
  return (
    <span className={className} role="img" aria-label={props.label}>
      {props.checked ? '✓' : ''}
    </span>
  );
}

function CheckItem(props: { checked: boolean | null; label?: string; children?: React.ReactNode }) {
  const label = props.label ?? (props.checked === null ? 'Pending' : props.checked ? 'Complete' : 'Open');
  return (
    <span className={styles.checkItem}>
      <Checkbox checked={props.checked} label={label} />
      <span>{props.children}</span>
    </span>
  );
}

function State(props: { ok: boolean | null; children?: React.ReactNode }) {
  const className = props.ok === null ? styles.muted : props.ok ? styles.stateOk : styles.stateOpen;
  return <span className={className}>{props.children}</span>;
}

function levelLine(live: LiveLevel | undefined, recorded: number) {
  if (!live) return `Recorded: ${levelName(recorded)} (${recorded})`;
  if (live.current_level === null) return live.current_level_name ?? 'No account';
  return `${live.current_level_name ?? levelName(live.current_level)} (${live.current_level})`;
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

type LiveTermination = TerminationRecord & { progress: { completed: number; total: number }; live: LiveLevel & { admin_removed: boolean | null; level_in_effect?: boolean | null } };

function accountCheck(record: TerminationRecord, current: LiveTermination | undefined): { ok: boolean | null; text: string } {
  if (!current) return { ok: null, text: `Recorded: ${levelName(record.account_level)} (${record.account_level}); pending live check` };
  const ok = current.live.admin_removed === true && current.live.level_in_effect !== false;
  const differs = current.live.level_in_effect === false ? `; the record says ${levelName(record.account_level)} (${record.account_level})` : '';
  return { ok, text: `${levelLine(current.live, record.account_level)}${current.live.admin_removed ? ', no admin' : ''}${differs}` };
}

export function TerminationRecords() {
  const path = EVIDENCE_ENDPOINTS.terminations;
  const { data, source } = useEvidence<{ records: LiveTermination[]; evidence: EvidenceMeta; live_check: string }>(path);
  const live = new Map((data?.records ?? []).map((record) => [record.id, record]));
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
      {TERMINATIONS.map((record) => {
        const current = live.get(record.id);
        const completed = record.steps.filter((step) => step.status === 'completed').length;
        const level = accountCheck(record, current);
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
                  ['Closed', <CheckItem key="closed" checked={record.closed_at !== null}>{record.closed_at ? formatDay(record.closed_at) : <State ok={false}>Open</State>}</CheckItem>],
                  ['Progress', <CheckItem key="progress" checked={completed === record.steps.length}>{`${completed} of ${record.steps.length} steps completed`}</CheckItem>],
                  ['Confirmed by', <CheckItem key="confirmed" checked>{`${record.confirmation.by}, ${formatDay(record.confirmation.at)}. ${record.confirmation.detail}.`}</CheckItem>],
                  ['INTDEV API level now', <CheckItem key="level" checked={level.ok}><State ok={level.ok}>{level.text}</State></CheckItem>],
                ] as [string, React.ReactNode][]
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
                    <th scope="col">Step</th>
                    <th scope="col">Method</th>
                    <th scope="col">Completed</th>
                    <th scope="col">Evidence</th>
                  </tr>
                </thead>
                <tbody>
                  {record.steps.map((step, index) => {
                    const done = step.status === 'completed';
                    return (
                      <tr key={step.step}>
                        <td>
                          <CheckItem checked={done}>
                            {index + 1}. {step.step}
                          </CheckItem>
                        </td>
                        <td>
                          <State ok={done}>{done ? (step.method === 'system' ? 'Verified in system' : 'Attested by the CEO') : 'Open'}</State>
                        </td>
                        <td>{step.completed_at ? formatDay(step.completed_at) : done ? `Confirmed ${formatDay(record.confirmation.at)}` : '—'}</td>
                        <td>{step.evidence}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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
      <div className={styles.people}>
        {TRAINING_COMPLETIONS.map((record) => {
          const current = live.get(record.user_id);
          return (
            <div key={record.user_id}>
              <img className={styles.personImage} src={record.avatar} alt={record.person} />
              <h3 className={styles.personName}>{record.person}</h3>
              <p className={styles.personDetail}>{record.role}</p>
              <p className={styles.personDetail}>
                INTDEV API level: {current ? levelLine(current.live, 0) : <span className={styles.muted}>pending live check</span>}
              </p>
              <p className={styles.personDetail}>
                <Signed at={record.signed_at} />
              </p>
              <ul className={styles.checklist}>
                {TRAINING_COURSES.map((course) => (
                  <li key={course.id}>
                    <CheckItem checked={record.courses.includes(course.id)}>{course.title}</CheckItem>
                  </li>
                ))}
              </ul>
              <p className={styles.personNote}>
                Confirmed by {record.confirmation.by}, {formatDay(record.confirmation.at)}. user_id {record.user_id}
              </p>
            </div>
          );
        })}
      </div>
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
                  ['Status', <State key="status" ok={finding.state !== 'open'}>{finding.status}</State>],
                  ['Live in production', <State key="live" ok={current ? current.live_in_production : null}>{production}</State>],
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
                      ['Management sign-off', <Signed key="signed" at={finding.treatment.approved_at} />],
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
