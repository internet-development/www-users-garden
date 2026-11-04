export interface PublicDeploy {
  id: string;
  status: string;
  trigger: string | null;
  commit: { id: string | null; short_id: string | null; message: string | null };
  created_at: string | null;
  started_at: string | null;
  finished_at: string | null;
  duration_seconds: number | null;
}

export interface PublicDeployService {
  name: string;
  label: string;
  url: string;
  provider: string;
  type: string | null;
  region: string | null;
  branch: string | null;
  auto_deploy: boolean;
  auto_deploy_trigger: string | null;
  suspended: boolean;
}

export interface DeployStatus {
  service: PublicDeployService;
  state: 'operational' | 'deploying' | 'suspended' | 'unknown';
  live_deploy_id: string | null;
  deploys: PublicDeploy[];
  fetched_at: string;
}

export interface Person {
  name: string;
  title: string;
  role: string;
  avatar: string;
  href: string;
  joined: string | null;
  type: string;
  userId: string;
}

export interface Vendor {
  name: string;
  service: string;
  criticality: 'Critical' | 'High' | 'Moderate';
  data: string;
  owner: string;
  terms: string;
  privacy: string;
  security: string;
}

export interface EvidenceMeta {
  endpoint: string;
  published_at: string;
  release: string | null;
  commit: string | null;
  checked_at: string;
}

export interface AccountState {
  user_id: string;
  exists: boolean;
  level: number | null;
  updated_at: string | null;
}

export interface AccessGrant {
  id: string;
  kind: 'grant' | 'revocation';
  person: string;
  role: string;
  user_id: string;
  system: string;
  request: { by: string; at: string; detail: string };
  approval: { by: string; at: string; decision: 'Approved'; detail: string };
  assignment: { level: number; level_name: string; previous_level: number | null; at: string | null; detail: string };
}

export interface Confirmation {
  by: string;
  at: string;
  detail: string;
}

export interface ChecklistStep {
  step: string;
  status: 'completed' | 'open';
  method: 'system' | 'attested';
  completed_at: string | null;
  evidence: string;
}

export interface TerminationRecord {
  id: string;
  person: string;
  type: string;
  joined: string;
  left: string;
  user_id: string;
  opened_at: string;
  closed_at: string | null;
  account_level: number;
  confirmation: Confirmation;
  steps: ChecklistStep[];
}

export interface TrainingCourse {
  id: string;
  title: string;
  version: string;
  covers: string;
}

export interface TrainingCompletion {
  person: string;
  role: string;
  avatar: string;
  user_id: string;
  courses: string[];
  signed_at: string;
  method: string;
  confirmation: Confirmation;
}

export interface RiskTreatment {
  likelihood: number;
  impact: number;
  treatment: string;
  compensating_controls: string[];
  target: string;
  review: string;
  approved_by: string;
  approved_at: string;
  ratified: string;
}

export interface Vulnerability {
  id: string;
  component: string;
  severity: 'Critical' | 'High' | 'Moderate' | 'Medium' | 'Low';
  found: string;
  status: string;
  state: 'remediated' | 'fixed_pending_release' | 'open';
  fixed_in: string | null;
  action: string;
  evidence: { label: string; detail: string; href?: string }[];
  treatment?: RiskTreatment;
}

export interface DeletionEvidence {
  reference: string;
  source: 'ledger' | 'deletion_log';
  account_created_at: string | null;
  deleted_after: string | null;
  deleted_by: string;
  method: string;
  within_last_12_months: 'confirmed' | 'possible';
}

export type CheckStatus = 'pass' | 'open' | 'unavailable';

export interface ReportCheck {
  id: string;
  area: string;
  title: string;
  status: CheckStatus;
  result: string;
  page: string;
  endpoint: string | null;
}

export interface ComplianceReportData {
  summary: { passed: number; open: number; unavailable: number; total: number };
  checks: ReportCheck[];
}

export interface PlatformAdminCensus {
  total: number;
  registered: number;
  system: number;
  unregistered: number;
}

export interface ReleaseCheck {
  id: string;
  label: string;
  ok: boolean;
  detail: string;
  ms: number | null;
}

export interface ReleaseScan {
  version: string | null;
  commit: string | null;
  built_at: string | null;
  scanned_at: string;
  instance: string;
  passed: number;
  total: number;
  checks: ReleaseCheck[];
}

export interface ReportInputs {
  release: string | null;
  accounts: Record<string, AccountState> | null;
  intdevOrganizations: Record<string, number> | null;
  renderMembers: Record<string, boolean> | null;
  platformAdmins: PlatformAdminCensus | null;
  deletions: { evidenced: number; logged: number } | null;
  releaseScan: ReleaseScan | null;
}
