import type * as React from 'react';

import * as Access from '@root/compliance/site/documents/access';
import * as Customers from '@root/compliance/site/documents/customers';
import * as Governance from '@root/compliance/site/documents/governance';
import * as Operations from '@root/compliance/site/documents/operations';
import * as People from '@root/compliance/site/documents/people';
import * as Security from '@root/compliance/site/documents/security';

export interface ComplianceDocument {
  slug: string;
  title: string;
  description: string;
  controls: number[];
  Component: () => React.ReactElement;
}

export const COMPLIANCE_DOCUMENTS: ComplianceDocument[] = [
  { slug: 'tabletop-exercise', title: 'Disaster recovery tabletop exercise', description: 'Report of the November 2026 tabletop exercise modeled on the PingCAP breach claims, with findings, action items, and every participant’s acknowledgement.', controls: [1, 30], Component: Operations.TabletopExercise },
  { slug: 'ci-cd', title: 'CI/CD production deployments', description: 'Render, the CI/CD system, with dashboard screenshots and live deployment history for api.internet.dev, users.garden, terminalgraph.com, and internet.dev.', controls: [2], Component: Operations.ContinuousDeployment },
  { slug: 'system-description', title: 'System description (SOC 2 Section III)', description: 'Services, commitments, components, boundaries, and complementary controls for the INTDEV system.', controls: [3, 38], Component: Governance.SystemDescription },
  { slug: 'whistleblower', title: 'Anonymous whistleblower channel', description: 'How to report fraud, ethics violations, or retaliation anonymously.', controls: [4], Component: People.Whistleblower },
  { slug: 'removable-media', title: 'Removable media encryption', description: 'Policy, encryption standard, and enforcement for portable and removable media.', controls: [5], Component: Security.RemovableMedia },
  { slug: 'data-deletion', title: 'Customer data deleted on departure', description: 'Self-service account deletion, the anonymous record of completed deletions, the 30-day commitment, and the Privacy Policy.', controls: [6], Component: Customers.DataDeletion },
  { slug: 'anti-malware', title: 'Anti-malware', description: 'Malware protection for uploads, the AWS account, email, and laptops.', controls: [7], Component: Security.AntiMalware },
  { slug: 'board-oversight', title: 'Board oversight briefings', description: 'Annual cybersecurity and privacy risk briefings to the board, with its feedback and direction.', controls: [8], Component: Governance.BoardOversight },
  { slug: 'board-charter', title: 'Board of directors charter', description: 'Roles, responsibilities, composition, independence, and the ethical management survey.', controls: [9], Component: Governance.BoardCharter },
  { slug: 'board-expertise', title: 'Board expertise and independent advisers', description: 'The board’s security oversight expertise and its use of third-party experts.', controls: [10], Component: Governance.BoardExpertise },
  { slug: 'board-meetings', title: 'Board meetings and minutes', description: 'Annual meeting requirement, minutes, and director independence.', controls: [11], Component: Governance.BoardMeetings },
  { slug: 'backups', title: 'Backup and recovery', description: 'Backup requirements, point-in-time recovery, and the restore procedure.', controls: [12], Component: Operations.Backups },
  { slug: 'status', title: 'Application status', description: 'Live service health and how critical changes are communicated to customers.', controls: [13, 18], Component: Operations.StatusPage },
  { slug: 'support', title: 'Customer support', description: 'eng@internet.dev, security reporting, routing, and response targets.', controls: [14, 18, 37], Component: Customers.Support },
  { slug: 'changelog', title: 'Changelog and release notes', description: 'Terminal Graph release notes and the INTDEV API and Users Garden release history.', controls: [15, 18, 37], Component: Operations.Changelog },
  { slug: 'organization-chart', title: 'Organization chart', description: 'Structure and reporting lines.', controls: [16], Component: Governance.OrganizationChart },
  { slug: 'roles-and-responsibilities', title: 'Roles and responsibilities', description: 'Who owns each information security responsibility, with job descriptions.', controls: [17], Component: Governance.RolesAndResponsibilities },
  { slug: 'documentation', title: 'Product documentation', description: 'Documentation for the INTDEV API, Users Garden, and Terminal Graph.', controls: [18, 37, 38], Component: Customers.Documentation },
  { slug: 'internal-change-communication', title: 'Internal communication of system changes', description: 'How system changes are communicated to the team, with screenshots of the Slack channels in use.', controls: [19], Component: Operations.InternalChangeCommunication },
  { slug: 'background-checks', title: 'Employee background checks', description: 'Screening requirements and the background check record for the current team.', controls: [20], Component: People.BackgroundChecks },
  { slug: 'contractor-code-of-conduct', title: 'Code of Conduct for contractors', description: 'The Code of Conduct and the clause every contractor agreement includes.', controls: [21], Component: People.ContractorCodeOfConduct },
  { slug: 'contractor-confidentiality', title: 'Confidentiality agreements for contractors', description: 'The confidentiality clause in statements of work, contractor agreements, and invoices.', controls: [22], Component: People.ContractorConfidentiality },
  { slug: 'employee-confidentiality', title: 'Confidentiality agreements for employees', description: 'The confidentiality and IP agreement signed at onboarding.', controls: [23], Component: People.EmployeeConfidentiality },
  { slug: 'performance-evaluations', title: 'Performance evaluations', description: 'The annual review process and the 2026 cycle.', controls: [24], Component: People.PerformanceEvaluations },
  { slug: 'access-control', title: 'Access control procedures', description: 'Adding, modifying, and removing access, with the access matrix.', controls: [25], Component: Access.AccessControlProcedures },
  { slug: 'access-reviews', title: 'Access reviews', description: 'Quarterly access reviews, with the Q4 2026 review of AWS, Render, and INTDEV API admin access.', controls: [26], Component: Access.AccessReviews },
  { slug: 'access-termination', title: 'Access revoked upon termination', description: 'The termination checklist and the completed, live-verified checklist for each recent departure.', controls: [27], Component: Access.AccessTermination },
  { slug: 'access-requests', title: 'Access requests', description: 'The access request process and every request, approval, and assigned access level by user_id.', controls: [28], Component: Access.AccessRequests },
  { slug: 'penetration-testing', title: 'Penetration testing', description: 'The 2026 assessment, remediation evidence, risk treatment plans with management sign-off, and upcoming tests.', controls: [29], Component: Security.PenetrationTesting },
  { slug: 'incident-response-test', title: 'Incident response plan test', description: 'The 2026 test of the Incident Response Plan.', controls: [30], Component: Operations.IncidentResponseTest },
  { slug: 'mobile-device-management', title: 'Mobile device management', description: 'Required device configuration and central management.', controls: [31], Component: Security.MobileDeviceManagement },
  { slug: 'intrusion-detection', title: 'Intrusion detection', description: 'GuardDuty in four regions, alerting, flow logs, and S3 malware protection.', controls: [32], Component: Security.IntrusionDetection },
  { slug: 'encryption-in-transit', title: 'Data transmission encryption', description: 'TLS test results and encryption on every hop.', controls: [33], Component: Security.EncryptionInTransit },
  { slug: 'network-segmentation', title: 'Network segmentation', description: 'How environments and networks are separated, with a topology diagram and Render and AWS configuration exports.', controls: [34], Component: Security.NetworkSegmentation },
  { slug: 'firewall-review', title: 'Network firewall review', description: 'The 2026 ruleset review and tracked changes.', controls: [35], Component: Security.FirewallReview },
  { slug: 'security', title: 'Security at INTDEV', description: 'The security commitments made to customers.', controls: [36], Component: Customers.SecurityInformation },
  { slug: 'master-services-agreement', title: 'Master Services Agreement (template)', description: 'The template agreement with security, confidentiality, and privacy commitments.', controls: [36, 40], Component: Customers.MasterServicesAgreement },
  { slug: 'service-description', title: 'Service description and network diagram', description: 'Products, boundaries, zones, subnets, data flows, controls, locations, redundancy, and a detailed network diagram.', controls: [38], Component: Customers.ServiceDescription },
  { slug: 'security-awareness-training', title: 'Security awareness training', description: 'Security awareness and business continuity training, with each team member’s signed completion record.', controls: [39], Component: People.SecurityAwarenessTraining },
  { slug: 'third-party-agreements', title: 'Third-party agreements', description: 'INTDEV’s terms and privacy policy, and every vendor’s agreements.', controls: [40], Component: Customers.ThirdPartyAgreements },
  { slug: 'render-service-agreement', title: 'Render service agreement', description: 'The agreement with Render and the resources it runs for INTDEV.', controls: [40, 41], Component: Customers.RenderServiceAgreement },
  { slug: 'vendor-management', title: 'Vendor management program', description: 'Critical vendor inventory, requirements, and annual review.', controls: [41], Component: Customers.VendorManagement },
  { slug: 'infrastructure-maintenance', title: 'Service infrastructure maintenance', description: 'Patching responsibilities and a sample of remediated vulnerabilities.', controls: [42], Component: Security.InfrastructureMaintenance },
  { slug: 'remediated-vulnerabilities', title: 'Sample of remediated vulnerabilities', description: 'Proof of the most recent periodic scan, its high-severity findings, and the remediation evidence or approved risk treatment plan for each.', controls: [42, 43], Component: Security.RemediatedVulnerabilities },
  { slug: 'vulnerability-scans', title: 'Vulnerability scanning and remediation', description: 'The Q4 2026 scan and the vulnerability register.', controls: [42, 43], Component: Security.VulnerabilityScans },
];

export const COMPLIANCE_SLUGS = COMPLIANCE_DOCUMENTS.map((entry) => entry.slug);

export function findComplianceDocument(slug: string | undefined | null): ComplianceDocument | null {
  return COMPLIANCE_DOCUMENTS.find((entry) => entry.slug === slug) ?? null;
}
