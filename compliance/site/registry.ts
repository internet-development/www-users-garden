import type * as React from 'react';

import type { CatalogEntry, ComplianceSlug } from '@root/compliance/site/catalog';

import * as Access from '@root/compliance/site/documents/access';
import * as Customers from '@root/compliance/site/documents/customers';
import * as Governance from '@root/compliance/site/documents/governance';
import * as Operations from '@root/compliance/site/documents/operations';
import * as People from '@root/compliance/site/documents/people';
import * as Security from '@root/compliance/site/documents/security';

import { COMPLIANCE_CATALOG } from '@root/compliance/site/catalog';

export interface ComplianceDocument extends CatalogEntry {
  Component: () => React.ReactElement;
}

const COMPONENTS: Record<ComplianceSlug, () => React.ReactElement> = {
  'tabletop-exercise': Operations.TabletopExercise,
  'ci-cd': Operations.ContinuousDeployment,
  'system-description': Governance.SystemDescription,
  'whistleblower': People.Whistleblower,
  'removable-media': Security.RemovableMedia,
  'data-deletion': Customers.DataDeletion,
  'anti-malware': Security.AntiMalware,
  'board-oversight': Governance.BoardOversight,
  'board-charter': Governance.BoardCharter,
  'board-expertise': Governance.BoardExpertise,
  'board-meetings': Governance.BoardMeetings,
  'backups': Operations.Backups,
  'status': Operations.StatusPage,
  'support': Customers.Support,
  'changelog': Operations.Changelog,
  'organization-chart': Governance.OrganizationChart,
  'roles-and-responsibilities': Governance.RolesAndResponsibilities,
  'documentation': Customers.Documentation,
  'internal-change-communication': Operations.InternalChangeCommunication,
  'background-checks': People.BackgroundChecks,
  'contractor-code-of-conduct': People.ContractorCodeOfConduct,
  'contractor-confidentiality': People.ContractorConfidentiality,
  'employee-confidentiality': People.EmployeeConfidentiality,
  'performance-evaluations': People.PerformanceEvaluations,
  'access-control': Access.AccessControlProcedures,
  'access-reviews': Access.AccessReviews,
  'access-termination': Access.AccessTermination,
  'access-requests': Access.AccessRequests,
  'penetration-testing': Security.PenetrationTesting,
  'penetration-test-report': Security.PenetrationTestReport,
  'bug-bounty': Security.BugBounty,
  'incident-response-test': Operations.IncidentResponseTest,
  'incident-report': Operations.IncidentReport,
  'mobile-device-management': Security.MobileDeviceManagement,
  'mobile-device-management-system': Security.MobileDeviceManagementSystem,
  'intrusion-detection': Security.IntrusionDetection,
  'encryption-in-transit': Security.EncryptionInTransit,
  'network-segmentation': Security.NetworkSegmentation,
  'firewall-review': Security.FirewallReview,
  'security': Customers.SecurityInformation,
  'master-services-agreement': Customers.MasterServicesAgreement,
  'service-description': Customers.ServiceDescription,
  'security-awareness-training': People.SecurityAwarenessTraining,
  'third-party-agreements': Customers.ThirdPartyAgreements,
  'render-service-agreement': Customers.RenderServiceAgreement,
  'vendor-management': Customers.VendorManagement,
  'infrastructure-maintenance': Security.InfrastructureMaintenance,
  'remediated-vulnerabilities': Security.RemediatedVulnerabilities,
  'vulnerability-scans': Security.VulnerabilityScans,
};

export const COMPLIANCE_DOCUMENTS: ComplianceDocument[] = COMPLIANCE_CATALOG.map((entry) => ({ ...entry, Component: COMPONENTS[entry.slug] }));

export const COMPLIANCE_SLUGS = COMPLIANCE_DOCUMENTS.map((entry) => entry.slug);

export function findComplianceDocument(slug: string | undefined | null): ComplianceDocument | null {
  return COMPLIANCE_DOCUMENTS.find((entry) => entry.slug === slug) ?? null;
}
