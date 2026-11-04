'use client';

import styles from '@root/compliance/site/Blocks.module.css';

import * as React from 'react';

import type { DeployStatus, PublicDeploy } from '@root/compliance/site/types';

import { API_HOST } from '@root/compliance/site/facts';
import { DEPLOY_SNAPSHOT, DEPLOY_SNAPSHOT_CAPTURED_AT } from '@root/compliance/site/deploy-snapshot';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatUtc(value: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  const pad = (part: number) => String(part).padStart(2, '0');
  return `${MONTHS[date.getUTCMonth()] ?? ''} ${date.getUTCDate()}, ${date.getUTCFullYear()} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())} UTC`;
}

const STATUS_LABELS: Record<string, string> = {
  live: 'Live (serving production)',
  deactivated: 'Succeeded, superseded',
  build_failed: 'Build failed, not released',
  update_failed: 'Release failed, previous version kept serving',
  canceled: 'Canceled',
  created: 'Created',
  queued: 'Queued',
  build_in_progress: 'Building',
  update_in_progress: 'Releasing',
  pre_deploy_in_progress: 'Pre-deploy running',
  pre_deploy_failed: 'Pre-deploy failed, not released',
};

const TRIGGER_LABELS: Record<string, string> = {
  new_commit: 'Commit to main',
  manual: 'Manual',
  api: 'API',
  deploy_hook: 'Deploy hook',
  rollback: 'Rollback',
  blueprint_sync: 'Blueprint sync',
  service_updated: 'Service update',
  service_resumed: 'Service resumed',
};

const STATE_LABELS: Record<DeployStatus['state'], string> = {
  operational: 'Operational',
  deploying: 'Operational, release in progress',
  suspended: 'Suspended',
  unknown: 'Unknown',
};

function isDeployStatus(value: unknown): value is DeployStatus {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<DeployStatus>;
  return Array.isArray(candidate.deploys) && !!candidate.service && typeof candidate.state === 'string';
}

export async function fetchDeployStatus(service: string): Promise<DeployStatus | null> {
  try {
    const response = await fetch(`${API_HOST}/api/status/deploys?service=${encodeURIComponent(service)}`, { cache: 'no-store' });
    if (!response.ok) return null;
    const body: unknown = await response.json();
    const data = body && typeof body === 'object' ? (body as { data?: unknown }).data : null;
    return isDeployStatus(data) ? data : null;
  } catch {
    return null;
  }
}

function useDeployStatus(service: string) {
  const snapshot = DEPLOY_SNAPSHOT[service] ?? null;
  const [status, setStatus] = React.useState<DeployStatus | null>(snapshot);
  const [source, setSource] = React.useState<'snapshot' | 'live' | 'loading'>('loading');

  React.useEffect(() => {
    let active = true;
    fetchDeployStatus(service).then((next) => {
      if (!active) return;
      if (next) {
        setStatus(next);
        setSource('live');
      } else {
        setSource('snapshot');
      }
    });
    return () => {
      active = false;
    };
  }, [service]);

  return { status, source };
}

function sourceLine(source: 'snapshot' | 'live' | 'loading', status: DeployStatus | null) {
  if (source === 'live' && status) return `Live from the Render API through ${API_HOST}/api/status/deploys, read ${formatUtc(status.fetched_at)}.`;
  if (source === 'loading') return `Loading live data from ${API_HOST}/api/status/deploys. Showing the snapshot captured ${formatUtc(DEPLOY_SNAPSHOT_CAPTURED_AT)}.`;
  return `Live data is unavailable right now. Showing the Render API snapshot captured ${formatUtc(DEPLOY_SNAPSHOT_CAPTURED_AT)}.`;
}

function release(deploy: PublicDeploy) {
  const message = deploy.commit.message ?? '—';
  return deploy.commit.short_id ? `${message} (${deploy.commit.short_id})` : message;
}

export function DeployFeed(props: { service: string; limit?: number }) {
  const { status, source } = useDeployStatus(props.service);

  if (!status) {
    return <p className={styles.muted}>No deploy data is available for {props.service}.</p>;
  }

  const deploys = status.deploys.slice(0, props.limit ?? 10);

  return (
    <div className={styles.group}>
      <div className={styles.fields}>
        <div className={styles.field}>
          <div className={styles.fieldLabel}>Service</div>
          <div>
            {status.service.label} · <a href={status.service.url}>{status.service.url.replace('https://', '')}</a>
          </div>
        </div>
        <div className={styles.field}>
          <div className={styles.fieldLabel}>Pipeline</div>
          <div>
            Render {status.service.type === 'web_service' ? 'web service' : status.service.type ?? 'service'} {status.service.name}, region {status.service.region ?? '—'}, branch {status.service.branch ?? '—'}, auto-deploy {status.service.auto_deploy ? `on every ${status.service.auto_deploy_trigger ?? 'commit'}` : 'off'}
          </div>
        </div>
        <div className={styles.field}>
          <div className={styles.fieldLabel}>Environment</div>
          <div>Production</div>
        </div>
        <div className={styles.field}>
          <div className={styles.fieldLabel}>Current state</div>
          <div>{STATE_LABELS[status.state]}</div>
        </div>
      </div>
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Deployment</th>
              <th scope="col">Release</th>
              <th scope="col">Trigger</th>
              <th scope="col">State</th>
              <th scope="col">Finished</th>
            </tr>
          </thead>
          <tbody>
            {deploys.map((deploy) => (
              <tr key={deploy.id}>
                <td>{deploy.id}</td>
                <td>{release(deploy)}</td>
                <td>{deploy.trigger ? TRIGGER_LABELS[deploy.trigger] ?? deploy.trigger : '—'}</td>
                <td>{STATUS_LABELS[deploy.status] ?? deploy.status}</td>
                <td>{formatUtc(deploy.finished_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={styles.muted}>{sourceLine(source, status)}</p>
    </div>
  );
}

function StatusRow(props: { service: string; label: string; href: string }) {
  const { status, source } = useDeployStatus(props.service);
  const live = status?.deploys.find((deploy) => deploy.status === 'live') ?? null;
  return (
    <tr>
      <td>
        <a href={props.href}>{props.label}</a>
      </td>
      <td>{status ? STATE_LABELS[status.state] : 'Unknown'}</td>
      <td>{live ? release(live) : '—'}</td>
      <td>{live ? formatUtc(live.finished_at) : '—'}</td>
      <td>{source === 'live' ? 'Live' : source === 'loading' ? 'Loading' : 'Snapshot'}</td>
    </tr>
  );
}

function useApiHealth() {
  const [health, setHealth] = React.useState<{ state: 'checking' | 'operational' | 'unreachable'; latency: number | null; checked: string | null }>({ state: 'checking', latency: null, checked: null });

  React.useEffect(() => {
    let active = true;
    const started = performance.now();
    fetch(`${API_HOST}/api/status`, { cache: 'no-store' })
      .then(async (response) => {
        const body: unknown = response.ok ? await response.json() : null;
        const verified = !!body && typeof body === 'object' && 'verify' in body;
        if (active) setHealth({ state: verified ? 'operational' : 'unreachable', latency: Math.round(performance.now() - started), checked: new Date().toISOString() });
      })
      .catch(() => {
        if (active) setHealth({ state: 'unreachable', latency: null, checked: new Date().toISOString() });
      });
    return () => {
      active = false;
    };
  }, []);

  return health;
}

export function StatusBoard() {
  const health = useApiHealth();
  const healthLabel = health.state === 'checking' ? 'Checking' : health.state === 'operational' ? 'Operational' : 'Not reachable from this browser';

  return (
    <div className={styles.group}>
      <div className={styles.fields}>
        <div className={styles.field}>
          <div className={styles.fieldLabel}>API health check</div>
          <div>
            {healthLabel}
            {health.latency !== null ? ` · ${health.latency} ms round trip` : ''}
          </div>
        </div>
        <div className={styles.field}>
          <div className={styles.fieldLabel}>What it tests</div>
          <div>{API_HOST}/api/status performs a live AES-256 encrypt and decrypt and a JWT sign and verify inside the production API.</div>
        </div>
        <div className={styles.field}>
          <div className={styles.fieldLabel}>Checked</div>
          <div>{health.checked ? formatUtc(health.checked) : 'Now'}</div>
        </div>
      </div>
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Service</th>
              <th scope="col">State</th>
              <th scope="col">Live release</th>
              <th scope="col">Released</th>
              <th scope="col">Data</th>
            </tr>
          </thead>
          <tbody>
            <StatusRow service="internet-apis" label="INTDEV API" href="https://api.internet.dev" />
            <StatusRow service="www-users-garden" label="Users Garden" href="https://users.garden" />
            <StatusRow service="terminalgraph" label="Terminal Graph site" href="https://terminalgraph.com" />
            <StatusRow service="www-internet-v3" label="internet.dev" href="https://internet.dev" />
          </tbody>
        </table>
      </div>
    </div>
  );
}
