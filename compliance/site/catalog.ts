import type { EVIDENCE_ENDPOINTS } from '@root/compliance/site/records';

import { TRUST_CENTER } from '@root/compliance/site/facts';

export interface CatalogEntry {
  slug: string;
  title: string;
  description: string;
  controls: readonly number[];
  related: readonly string[];
  evidence?: keyof typeof EVIDENCE_ENDPOINTS;
}

export const COMPLIANCE_CATALOG = [
  { slug: 'tabletop-exercise', title: 'Disaster recovery tabletop exercise', description: 'Report of the November 2026 tabletop exercise modeled on the PingCAP breach claims, with findings, action items, and every participant’s acknowledgement.', controls: [1, 30], related: ['disaster-recovery', 'incident-response-test', 'incident-report', 'backups', 'remediated-vulnerabilities', 'security-awareness-training'] },
  { slug: 'ci-cd', title: 'CI/CD production deployments', description: 'Render, the CI/CD system, with dashboard screenshots, an approved pull request ready to merge, and the deployment history read from Render for each release of api.internet.dev, users.garden, terminalgraph.com, and internet.dev.', controls: [2], related: ['changelog', 'status', 'internal-change-communication', 'infrastructure-maintenance', 'remediated-vulnerabilities'], evidence: 'releases' },
  { slug: 'system-description', title: 'System description (SOC 2 Section III)', description: 'Services, commitments, components, boundaries, and complementary controls for the INTDEV system.', controls: [3, 38], related: ['service-description', 'network-segmentation', 'roles-and-responsibilities', 'vendor-management', 'documentation'], evidence: 'policies' },
  { slug: 'whistleblower', title: 'Anonymous whistleblower channel', description: 'How to report fraud, ethics violations, or retaliation anonymously.', controls: [4], related: ['contractor-code-of-conduct', 'support', 'roles-and-responsibilities', 'board-oversight'] },
  { slug: 'removable-media', title: 'Removable media encryption', description: 'The live fleet report of every team member’s laptop disk encryption, how it is generated, the FileVault encryption standard Apple documents for each Mac, removable media enforcement, the policy, and the API’s separate application-layer encryption.', controls: [5], related: ['mobile-device-management', 'mobile-device-management-system', 'anti-malware', 'encryption-in-transit', 'security-awareness-training'], evidence: 'devices' },
  { slug: 'data-deletion', title: 'Customer data deleted on departure', description: 'Self-service account deletion, the anonymous record of completed deletions, the 30-day commitment, and the Privacy Policy.', controls: [6], related: ['security', 'client-data-protection', 'master-services-agreement', 'backups', 'support', 'access-termination'], evidence: 'dataDeletions' },
  { slug: 'client-data-protection', title: 'Client data protection and engagement closeout', description: 'How INTDEV protects the designs, research, and personal data clients share in engagements, how an engagement is closed out and its data deleted, including copies outside INTDEV’s own applications, and how INTDEV meets each of Microsoft’s Supplier Data Protection Requirements (SSPA), with anything not yet in place.', controls: [6, 36, 40], related: ['data-deletion', 'master-services-agreement', 'security-awareness-training', 'access-control', 'technical-specification-template', 'security'] },
  { slug: 'anti-malware', title: 'Anti-malware', description: 'Malware protection for uploads, the AWS account, email, and laptops, with each laptop’s live anti-malware check-in and the GuardDuty Malware Protection state read when each INTDEV API release was built.', controls: [7], related: ['intrusion-detection', 'mobile-device-management', 'removable-media', 'infrastructure-maintenance'], evidence: 'infrastructure' },
  { slug: 'board-oversight', title: 'Board oversight briefings', description: 'Annual cybersecurity and privacy risk briefings to the board, with its feedback and direction.', controls: [8], related: ['board-charter', 'board-meetings', 'board-expertise', 'tabletop-exercise', 'penetration-testing'] },
  { slug: 'board-charter', title: 'Board of directors charter', description: 'Roles, responsibilities, composition, independence, and the ethical management survey.', controls: [9], related: ['board-meetings', 'board-expertise', 'board-oversight', 'organization-chart'] },
  { slug: 'board-expertise', title: 'Board expertise and independent advisers', description: 'The board’s security oversight expertise and its use of third-party experts.', controls: [10], related: ['board-charter', 'board-meetings', 'board-oversight'] },
  { slug: 'board-meetings', title: 'Board meetings and minutes', description: 'Annual meeting requirement, minutes, and director independence.', controls: [11], related: ['board-charter', 'board-oversight', 'board-expertise'] },
  { slug: 'backups', title: 'Backup and recovery', description: 'Backup requirements, point-in-time recovery, and the restore procedure.', controls: [12], related: ['disaster-recovery', 'tabletop-exercise', 'incident-response-test', 'service-description', 'render-service-agreement'] },
  { slug: 'disaster-recovery', title: 'Disaster recovery procedures', description: 'The criteria that make a system critical, the list of critical systems with their recovery objectives, and a step-by-step recovery procedure for each, written for an engineer who does not know the system.', controls: [1, 12], related: ['backups', 'tabletop-exercise', 'service-description', 'client-data-protection', 'incident-response-test'] },
  { slug: 'status', title: 'Application status', description: 'Live service health and how critical changes are communicated to customers.', controls: [13, 18], related: ['changelog', 'ci-cd', 'support', 'documentation'], evidence: 'report' },
  { slug: 'support', title: 'Customer support', description: 'eng@internet.dev, security reporting, routing, and response targets.', controls: [14, 18, 37], related: ['status', 'security', 'bug-bounty', 'documentation', 'whistleblower', 'changelog'] },
  { slug: 'changelog', title: 'Changelog and release notes', description: 'Terminal Graph release notes, the INTDEV API and Users Garden release history, and the version ledger of what each INTDEV API version changed.', controls: [15, 18, 37], related: ['ci-cd', 'status', 'documentation', 'internal-change-communication'], evidence: 'versions' },
  { slug: 'organization-chart', title: 'Organization chart', description: 'Structure and reporting lines.', controls: [16], related: ['roles-and-responsibilities', 'board-charter', 'access-control', 'background-checks'], evidence: 'team' },
  { slug: 'roles-and-responsibilities', title: 'Roles and responsibilities', description: 'Who owns each information security responsibility, with job descriptions for the CISO, Security Engineers, DevOps, the Network Administrator, the Privacy Lead (DPO), and the Privacy Team.', controls: [17], related: ['security', 'organization-chart', 'access-control', 'security-awareness-training', 'system-description'], evidence: 'team' },
  { slug: 'documentation', title: 'Product documentation', description: 'Documentation for the INTDEV API, Users Garden, and Terminal Graph.', controls: [18, 37, 38], related: ['service-description', 'system-description', 'changelog', 'support', 'security'] },
  { slug: 'internal-change-communication', title: 'Internal communication of system changes', description: 'How system changes are communicated to the team, with screenshots of the Slack channels in use.', controls: [19], related: ['ci-cd', 'changelog', 'status', 'incident-response-test'] },
  { slug: 'background-checks', title: 'Employee background checks', description: 'Screening requirements and the background check record for the current team.', controls: [20], related: ['employee-confidentiality', 'access-requests', 'organization-chart', 'performance-evaluations'] },
  { slug: 'contractor-code-of-conduct', title: 'Code of Conduct for contractors', description: 'The Code of Conduct and the clause every contractor agreement includes.', controls: [21], related: ['contractor-confidentiality', 'whistleblower', 'third-party-agreements', 'access-control'] },
  { slug: 'contractor-confidentiality', title: 'Confidentiality agreements for contractors', description: 'The confidentiality clause in statements of work, contractor agreements, and invoices.', controls: [22], related: ['contractor-code-of-conduct', 'employee-confidentiality', 'third-party-agreements', 'access-termination'] },
  { slug: 'employee-confidentiality', title: 'Confidentiality agreements for employees', description: 'The confidentiality and IP agreement signed at onboarding.', controls: [23], related: ['contractor-confidentiality', 'background-checks', 'access-termination', 'security-awareness-training'] },
  { slug: 'performance-evaluations', title: 'Performance evaluations', description: 'The annual review process and the 2026 cycle.', controls: [24], related: ['security-awareness-training', 'organization-chart', 'roles-and-responsibilities'] },
  { slug: 'access-control', title: 'Access control procedures', description: 'Adding, modifying, and removing access, with the access matrix.', controls: [25], related: ['access-requests', 'access-reviews', 'access-termination', 'roles-and-responsibilities'] },
  { slug: 'access-reviews', title: 'Access reviews', description: 'Quarterly access reviews, with the Q4 2026 review of AWS, Render, and INTDEV API admin access, and the register of INTDEV API system accounts.', controls: [26], related: ['access-requests', 'access-termination', 'access-control', 'firewall-review'], evidence: 'accessRequests' },
  { slug: 'access-termination', title: 'Access revoked upon termination', description: 'The termination checklist and the completed, live-verified checklist for each recent departure.', controls: [27], related: ['access-requests', 'access-reviews', 'access-control', 'incident-report', 'data-deletion'], evidence: 'terminations' },
  { slug: 'access-requests', title: 'Access requests', description: 'The access request process and every request, approval, and assigned access level by user_id.', controls: [28], related: ['access-control', 'access-reviews', 'access-termination', 'background-checks'], evidence: 'accessRequests' },
  { slug: 'penetration-testing', title: 'Penetration testing', description: 'The 2025 penetration test of the INTDEV API, the 2026 assessment, remediation evidence, risk treatment plans with management sign-off, and upcoming tests.', controls: [29], related: ['penetration-test-report', 'bug-bounty', 'remediated-vulnerabilities', 'vulnerability-scans', 'infrastructure-maintenance', 'encryption-in-transit'], evidence: 'vulnerabilities' },
  { slug: 'penetration-test-report', title: 'Penetration test report: INTDEV API', description: 'The 2025 adversarial test of the INTDEV API, INTDEV’s purpose-built backend, by ROOST guided by Chenyu Huang, who had built its Apple and Bluesky sign-in, reported February 1, 2026: why the builder was asked to break it, scope, method, results (no successful exploit), recommendations, limitations, and INTDEV’s late follow-up.', controls: [29, 44], related: ['penetration-testing', 'remediated-vulnerabilities', 'access-control', 'access-termination', 'security'], evidence: 'penetrationTest' },
  { slug: 'bug-bounty', title: 'Bug bounty program', description: 'INTDEV’s public bug bounty program: scope, rules, safe harbor, how to report, how reports are handled, and how rewards are decided. Reward amounts are not published.', controls: [46], related: ['security', 'support', 'penetration-testing', 'vulnerability-scans', 'remediated-vulnerabilities'], evidence: 'bugBounty' },
  { slug: 'incident-response-test', title: 'Incident response plan test', description: 'The 2026 test of the Incident Response Plan, and the incidents handled under it.', controls: [30], related: ['incident-report', 'tabletop-exercise', 'intrusion-detection', 'support', 'backups'] },
  { slug: 'incident-report', title: 'Incident report and root cause analysis: INC-2026-001', description: 'Former team members kept access after they left: detection, timeline, containment, root cause analysis, corrective actions, effectiveness review, and the ISO 22301 clause 10.1 record.', controls: [30, 45], related: ['access-termination', 'access-reviews', 'incident-response-test', 'tabletop-exercise', 'access-requests'], evidence: 'terminations' },
  { slug: 'mobile-device-management', title: 'Mobile device management', description: 'Required device configuration, the live fleet disk encryption report, and central management.', controls: [31], related: ['mobile-device-management-system', 'removable-media', 'anti-malware', 'security-awareness-training', 'access-control'], evidence: 'devices' },
  { slug: 'mobile-device-management-system', title: 'Mobile device management system', description: 'Proof of INTDEV’s mobile device management system: the central register every laptop supporting the service is enrolled in, the live management status of each one, how laptops are enrolled, monitored, and removed, and what the system does not do.', controls: [31], related: ['mobile-device-management', 'removable-media', 'access-termination', 'security-awareness-training', 'anti-malware'], evidence: 'devices' },
  { slug: 'intrusion-detection', title: 'Intrusion detection', description: 'GuardDuty in four regions, alerting, flow logs, CloudTrail, and S3 malware protection, checked against the AWS read compiled into each INTDEV API release.', controls: [32], related: ['anti-malware', 'network-segmentation', 'firewall-review', 'incident-response-test'], evidence: 'infrastructure' },
  { slug: 'encryption-in-transit', title: 'Data transmission encryption', description: 'TLS results for every public hostname, read when each INTDEV API release was built, HTTPS-only storage, and encryption on every hop.', controls: [33], related: ['network-segmentation', 'service-description', 'security', 'vulnerability-scans'], evidence: 'infrastructure' },
  { slug: 'network-segmentation', title: 'Network segmentation', description: 'How environments and networks are separated, with a topology diagram and Render and AWS configuration exports.', controls: [34], related: ['firewall-review', 'service-description', 'encryption-in-transit', 'intrusion-detection'], evidence: 'network' },
  { slug: 'firewall-review', title: 'Network firewall review', description: 'The 2026 ruleset review and tracked changes.', controls: [35], related: ['network-segmentation', 'intrusion-detection', 'vulnerability-scans', 'access-reviews'], evidence: 'network' },
  { slug: 'security', title: 'Security at INTDEV', description: 'The security commitments made to customers, and the people who keep them: the CISO and every Member of Technical Staff, with job descriptions for each security and privacy role.', controls: [36, 17], related: ['roles-and-responsibilities', 'bug-bounty', 'master-services-agreement', 'encryption-in-transit', 'data-deletion', 'support'], evidence: 'team' },
  { slug: 'master-services-agreement', title: 'Master Services Agreement (template)', description: 'The template agreement with security, confidentiality, and privacy commitments.', controls: [36, 40], related: ['security', 'client-data-protection', 'third-party-agreements', 'data-deletion', 'documentation'] },
  { slug: 'service-description', title: 'Service description and network diagram', description: 'Products, boundaries, zones, subnets, data flows, controls, locations, redundancy, and a detailed network diagram.', controls: [38], related: ['system-description', 'network-segmentation', 'documentation', 'security', 'backups'] },
  { slug: 'security-awareness-training', title: 'Security awareness training', description: 'Security awareness and business continuity training, with each team member’s signed completion record.', controls: [39], related: ['tabletop-exercise', 'mobile-device-management', 'removable-media', 'incident-response-test'], evidence: 'training' },
  { slug: 'third-party-agreements', title: 'Third-party agreements', description: 'INTDEV’s terms and privacy policy, and every vendor’s agreements.', controls: [40], related: ['vendor-management', 'client-data-protection', 'render-service-agreement', 'master-services-agreement', 'contractor-confidentiality', 'employee-confidentiality'], evidence: 'vendors' },
  { slug: 'render-service-agreement', title: 'Render service agreement', description: 'The agreement with Render and the resources it runs for INTDEV.', controls: [40, 41], related: ['vendor-management', 'third-party-agreements', 'ci-cd', 'backups'], evidence: 'vendors' },
  { slug: 'vendor-management', title: 'Vendor management program', description: 'Critical vendor inventory, requirements, and annual review.', controls: [41], related: ['third-party-agreements', 'render-service-agreement', 'system-description'], evidence: 'vendors' },
  { slug: 'infrastructure-maintenance', title: 'Service infrastructure maintenance', description: 'Patching responsibilities, the rule for retiring unsupported software, the INTDEV API software inventory with the versions in production, and a sample of remediated vulnerabilities.', controls: [42], related: ['remediated-vulnerabilities', 'vulnerability-scans', 'ci-cd', 'penetration-testing', 'system-description'], evidence: 'vulnerabilities' },
  { slug: 'remediated-vulnerabilities', title: 'Sample of remediated vulnerabilities', description: 'Proof of the most recent periodic scan, its high-severity findings, and the remediation evidence or approved risk treatment plan for each.', controls: [42, 43], related: ['vulnerability-scans', 'penetration-testing', 'infrastructure-maintenance', 'ci-cd'], evidence: 'vulnerabilities' },
  { slug: 'vulnerability-scans', title: 'Vulnerability scanning and remediation', description: 'The Q4 2026 scan, the monthly scan schedule, the written severity definitions, and the vulnerability register.', controls: [42, 43], related: ['remediated-vulnerabilities', 'penetration-testing', 'infrastructure-maintenance', 'firewall-review'], evidence: 'vulnerabilities' },
  { slug: 'technical-specification-template', title: 'Technical specification template', description: 'The template every technical specification for software INTDEV develops follows, Microsoft deliverables included, with its security validation section, the checkpoints signed off before build, merge, and delivery, and where each specification lives.', controls: [], related: ['ci-cd', 'client-data-protection', 'infrastructure-maintenance', 'roles-and-responsibilities', 'vulnerability-scans'] },
  { slug: 'trust-center', title: 'Trust Center and control map', description: 'INTDEV’s Trust Center, where Vanta publishes the controls it monitors continuously, and a map of each of its controls to the compliance page that documents it, or to the Trust Center where no page does.', controls: [], related: ['security', 'system-description', 'access-control', 'status', 'support'], evidence: 'pages' },
] as const satisfies readonly CatalogEntry[];

export type ComplianceSlug = (typeof COMPLIANCE_CATALOG)[number]['slug'];

const ENTRIES: readonly CatalogEntry[] = COMPLIANCE_CATALOG;

export const TRUST_CENTER_CATEGORIES = [
  { id: 'infrastructure-security', name: 'Infrastructure security' },
  { id: 'organizational-security', name: 'Organizational security' },
  { id: 'product-security', name: 'Product security' },
  { id: 'internal-security-procedures', name: 'Internal security procedures' },
  { id: 'data-and-privacy', name: 'Data and privacy' },
] as const;

export type TrustCenterCategory = (typeof TRUST_CENTER_CATEGORIES)[number]['id'];

export interface TrustCenterControl {
  name: string;
  category: TrustCenterCategory;
  page: ComplianceSlug | null;
}

export const TRUST_CENTER_CONTROLS: readonly TrustCenterControl[] = [
  { name: 'Production application access restricted', category: 'infrastructure-security', page: 'access-control' },
  { name: 'Access control procedures established', category: 'infrastructure-security', page: 'access-control' },
  { name: 'Production database access restricted', category: 'infrastructure-security', page: null },
  { name: 'Unique production database authentication enforced', category: 'infrastructure-security', page: null },
  { name: 'Encryption key access restricted', category: 'infrastructure-security', page: null },
  { name: 'Firewall access restricted', category: 'infrastructure-security', page: null },
  { name: 'Production OS access restricted', category: 'infrastructure-security', page: null },
  { name: 'Production network access restricted', category: 'infrastructure-security', page: null },
  { name: 'Access revoked upon termination', category: 'infrastructure-security', page: 'access-termination' },
  { name: 'Unique network system authentication enforced', category: 'infrastructure-security', page: null },
  { name: 'Network segmentation implemented', category: 'infrastructure-security', page: 'network-segmentation' },
  { name: 'Intrusion detection system utilized', category: 'infrastructure-security', page: 'intrusion-detection' },
  { name: 'Log management utilized', category: 'infrastructure-security', page: 'intrusion-detection' },
  { name: 'Network firewalls reviewed', category: 'infrastructure-security', page: 'firewall-review' },
  { name: 'Network firewalls utilized', category: 'infrastructure-security', page: 'network-segmentation' },
  { name: 'Remote access MFA enforced', category: 'infrastructure-security', page: 'access-control' },
  { name: 'Remote access encrypted enforced', category: 'infrastructure-security', page: null },
  { name: 'Service infrastructure maintained', category: 'infrastructure-security', page: 'infrastructure-maintenance' },
  { name: 'Network and system hardening standards maintained', category: 'infrastructure-security', page: null },
  { name: 'Infrastructure performance monitored', category: 'infrastructure-security', page: 'status' },
  { name: 'Unique account authentication enforced', category: 'infrastructure-security', page: 'access-control' },
  { name: 'MDM system utilized', category: 'organizational-security', page: 'mobile-device-management-system' },
  { name: 'Visitor procedures enforced', category: 'organizational-security', page: null },
  { name: 'Asset disposal procedures utilized', category: 'organizational-security', page: null },
  { name: 'Anti-malware technology utilized', category: 'organizational-security', page: 'anti-malware' },
  { name: 'Employee background checks performed', category: 'organizational-security', page: 'background-checks' },
  { name: 'Code of Conduct acknowledged by employees and enforced', category: 'organizational-security', page: 'contractor-code-of-conduct' },
  { name: 'Confidentiality Agreement acknowledged by employees', category: 'organizational-security', page: 'employee-confidentiality' },
  { name: 'Performance evaluations conducted', category: 'organizational-security', page: 'performance-evaluations' },
  { name: 'Password policy enforced', category: 'organizational-security', page: null },
  { name: 'Production inventory maintained', category: 'organizational-security', page: 'infrastructure-maintenance' },
  { name: 'Security awareness training implemented', category: 'organizational-security', page: 'security-awareness-training' },
  { name: 'Control self-assessments conducted', category: 'product-security', page: null },
  { name: 'Data encryption utilized', category: 'product-security', page: 'service-description' },
  { name: 'Data transmission encrypted', category: 'product-security', page: 'encryption-in-transit' },
  { name: 'Vulnerability and system monitoring procedures established', category: 'product-security', page: 'vulnerability-scans' },
  { name: 'Data center access reviewed', category: 'internal-security-procedures', page: null },
  { name: 'Access reviews conducted', category: 'internal-security-procedures', page: 'access-reviews' },
  { name: 'Access requests required', category: 'internal-security-procedures', page: 'access-requests' },
  { name: 'Board oversight briefings conducted', category: 'internal-security-procedures', page: 'board-oversight' },
  { name: 'Board charter documented', category: 'internal-security-procedures', page: 'board-charter' },
  { name: 'Board expertise developed', category: 'internal-security-procedures', page: 'board-expertise' },
  { name: 'Board meetings conducted', category: 'internal-security-procedures', page: 'board-meetings' },
  { name: 'Change management procedures enforced', category: 'internal-security-procedures', page: 'ci-cd' },
  { name: 'Production deployment access restricted', category: 'internal-security-procedures', page: 'ci-cd' },
  { name: 'Company commitments externally communicated', category: 'internal-security-procedures', page: 'security' },
  { name: 'Configuration management system established', category: 'internal-security-procedures', page: null },
  { name: 'Continuity and Disaster Recovery plans established', category: 'internal-security-procedures', page: null },
  { name: 'Continuity and Disaster Recovery plans tested', category: 'internal-security-procedures', page: 'tabletop-exercise' },
  { name: 'Backup processes established', category: 'internal-security-procedures', page: 'backups' },
  { name: 'Development lifecycle established', category: 'internal-security-procedures', page: 'technical-specification-template' },
  { name: 'System changes externally communicated', category: 'internal-security-procedures', page: 'status' },
  { name: 'External support resources available', category: 'internal-security-procedures', page: 'support' },
  { name: 'Incident response plan tested', category: 'internal-security-procedures', page: 'incident-response-test' },
  { name: 'Incident response policies established', category: 'internal-security-procedures', page: 'incident-response-test' },
  { name: 'Management roles and responsibilities defined', category: 'internal-security-procedures', page: 'roles-and-responsibilities' },
  { name: 'Organization structure documented', category: 'internal-security-procedures', page: 'organization-chart' },
  { name: 'Incident management procedures followed', category: 'internal-security-procedures', page: 'incident-report' },
  { name: 'Risk assessment objectives specified', category: 'internal-security-procedures', page: null },
  { name: 'Risks assessments performed', category: 'internal-security-procedures', page: null },
  { name: 'Risk management program established', category: 'internal-security-procedures', page: null },
  { name: 'Roles and responsibilities specified', category: 'internal-security-procedures', page: 'roles-and-responsibilities' },
  { name: 'Security policies established and reviewed', category: 'internal-security-procedures', page: 'system-description' },
  { name: 'Service description communicated', category: 'internal-security-procedures', page: 'service-description' },
  { name: 'System changes communicated', category: 'internal-security-procedures', page: 'internal-change-communication' },
  { name: 'SOC 2 - System Description', category: 'internal-security-procedures', page: 'system-description' },
  { name: 'Third-party agreements established', category: 'internal-security-procedures', page: 'third-party-agreements' },
  { name: 'Vendor management program established', category: 'internal-security-procedures', page: 'vendor-management' },
  { name: 'Vulnerabilities scanned and remediated', category: 'internal-security-procedures', page: 'vulnerability-scans' },
  { name: 'Whistleblower policy established', category: 'internal-security-procedures', page: 'whistleblower' },
  { name: 'Customer data deleted upon leaving', category: 'data-and-privacy', page: 'data-deletion' },
  { name: 'Data classification policy established', category: 'data-and-privacy', page: null },
  { name: 'Data retention procedures established', category: 'data-and-privacy', page: 'data-deletion' },
];

export function trustCenterCategoryUrl(category: TrustCenterCategory): string {
  return `${TRUST_CENTER.controls}#${category}`;
}

export function trustCenterControlsFor(slug: string): TrustCenterControl[] {
  return TRUST_CENTER_CONTROLS.filter((control) => control.page === slug);
}

export function findCatalogEntry(slug: string | undefined | null): CatalogEntry | null {
  return ENTRIES.find((entry) => entry.slug === slug) ?? null;
}

export function relatedEntries(slug: string, limit = 6): CatalogEntry[] {
  const entry = findCatalogEntry(slug);
  if (!entry) return [];
  const sharedControl = ENTRIES.filter((other) => other.slug !== slug && other.controls.some((control) => entry.controls.includes(control)));
  const slugs = [...new Set([...entry.related, ...sharedControl.map((other) => other.slug)])].filter((other) => other !== slug);
  return slugs
    .map((other) => findCatalogEntry(other))
    .filter((other): other is CatalogEntry => other !== null)
    .slice(0, limit);
}
