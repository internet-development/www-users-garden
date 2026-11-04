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

export interface SecurityRole {
  title: string;
  holders: string;
  members: string[];
  reportsTo: string;
  policyRoles: string;
  purpose: string;
  responsibilities: string[];
  qualifications: string[];
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
  registers: string | null;
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

export interface SystemAccount {
  id: string;
  account: string;
  user_id: string;
  level: number;
  level_name: string;
  purpose: string;
  owner: string;
  approved_at: string;
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

export type DeviceChip = 'apple_silicon' | 't2' | 'intel';

export interface DeviceReport {
  tool_version: string;
  device_ref: string;
  model: string;
  chip: DeviceChip;
  os_version: string;
  filevault: { status: string; on: boolean; in_progress: boolean };
  data_volume: { encrypted: boolean; filevault: boolean };
  mdm_enrolled: boolean;
  removable_media: { mounted: number; unencrypted_writable: number };
}

export interface EncryptionSource {
  title: string;
  href: string;
  quote: string;
}

export interface DiskEncryptionStandard {
  hardware: string;
  algorithm: string;
  aes_key_bits: 128 | 256 | null;
  key_handling: string;
  cipher: string;
  sources: EncryptionSource[];
}

export interface DeviceAssessment {
  disk_encrypted: boolean;
  cipher: string;
  aes_256: boolean;
  removable_media_clear: boolean;
}

export interface DeviceRecord extends DeviceReport {
  checked_at: string;
  current: boolean;
  assessment: DeviceAssessment;
}

export interface DeviceMember {
  person: string;
  role: string;
  user_id: string;
  reporting: boolean;
  encrypted: boolean | null;
  devices: DeviceRecord[];
}

export interface DeviceFleetSummary {
  members: number;
  members_reporting: number;
  members_encrypted: number;
  devices: number;
  devices_encrypted: number;
  devices_aes_256: number;
  devices_removable_clear: number;
  devices_mdm_enrolled: number;
}

export interface LaptopEncryptionStandard extends DiskEncryptionStandard {
  chip: DeviceChip;
  current_laptops: number | null;
  encrypted: number | null;
}

export interface EncryptionFinding {
  id: string;
  severity: Vulnerability['severity'];
  status: string;
  state: Vulnerability['state'];
  target: string | null;
}

export interface RenderMembership {
  checked_at: string;
  members: Record<string, boolean | null>;
}

export interface ReportInputs {
  release: string | null;
  accounts: Record<string, AccountState> | null;
  intdevOrganizations: Record<string, number> | null;
  renderMembership: RenderMembership | null;
  platformAdmins: PlatformAdminCensus | null;
  deletions: { evidenced: number; logged: number } | null;
  releaseScan: ReleaseScan | null;
  devices: DeviceFleetSummary | null;
}

export interface SoftwarePackage {
  name: string;
  scope: 'production' | 'development';
  purpose: string;
}

export interface LiveSoftwarePackage extends SoftwarePackage {
  declared: string | null;
  installed: string | null;
}

export interface SoftwareInventory {
  node: { declared: string | null; running: string };
  packages: LiveSoftwarePackage[];
  undocumented: string[];
}
