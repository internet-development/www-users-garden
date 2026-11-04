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
