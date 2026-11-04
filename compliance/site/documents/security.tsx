import Document from '@root/compliance/site/Document';

import { Fields, Group, Links, List, Section, Table } from '@root/compliance/site/Blocks';
import { AWS_REGIONS, CONTACTS, VULNERABILITIES } from '@root/compliance/site/facts';

const TLS_RESULTS = [
  ['api.internet.dev', '301 to HTTPS', 'TLS 1.3, TLS_AES_256_GCM_SHA384', 'Refused', 'Google Trust Services WE1, valid to December 26, 2026'],
  ['users.garden', '301 to HTTPS', 'TLS 1.3, TLS_AES_256_GCM_SHA384', 'Refused', 'Google Trust Services WE1, valid to December 8, 2026'],
  ['internet.dev', '301 to HTTPS', 'TLS 1.3, TLS_AES_256_GCM_SHA384', 'Refused', 'Google Trust Services WE1, valid to December 21, 2026'],
  ['terminalgraph.com', '301 to HTTPS', 'TLS 1.3, TLS_AES_256_GCM_SHA384', 'Refused', 'Google Trust Services WE1, valid to December 6, 2026'],
];

function Register(props: { filter?: (status: string) => boolean }) {
  const rows = VULNERABILITIES.filter((item) => (props.filter ? props.filter(item.status) : true));
  return <Table columns={['ID', 'Component', 'Severity', 'Status', 'Action']} rows={rows.map((item) => [item.id, item.component, item.severity, item.status, item.action])} />;
}

export function RemovableMedia() {
  return (
    <Document
      title="Removable media encryption"
      summary="INTDEV does not allow confidential data on portable or removable media unless there is a documented exception. Any media allowed by exception must be encrypted with an approved standard. Laptops are fully disk-encrypted."
      controls={['Removable media encryption']}
    >
      <Section title="Policy">
        <List
          items={[
            'Cryptography Policy: a documented exception is required before customer or company confidential data is moved, copied, or stored on any media or removable device. All portable devices and removable media holding sensitive data must be encrypted with approved standards and mechanisms.',
            'Data Management Policy: confidential data must not be stored on personal phones or devices, or on removable media such as USB drives, CDs, or DVDs. Laptop drives that hold confidential data must be encrypted.',
            'Information Security Policy: confidential information must not be stored on USB drives. Business contact details are the only exception.',
          ]}
        />
      </Section>
      <Section title="Encryption standard">
        <Table
          columns={['Media', 'Requirement', 'Mechanism']}
          rows={[
            ['Laptop internal storage', 'AES 128 or 256-bit full-disk encryption', 'FileVault, turned on before the device is used for INTDEV work'],
            ['Removable media, by exception only', 'AES-256 encryption with a unique password', 'An APFS (Encrypted) volume on the USB or external drive, created with Disk Utility or diskutil'],
            ['Backups', 'Encrypted', 'Render-managed database backups. No removable backup media is used.'],
          ]}
        />
      </Section>
      <Section title="How it is enforced">
        <List
          items={[
            'There is no need to move customer data onto devices. Customer data lives only in production systems (Render PostgreSQL and S3), and policy forbids copying it into non-production environments.',
            'Exceptions are requested in writing to the CEO and recorded with the media, the data, an encryption confirmation, and the date of destruction. No exceptions had been requested or approved as of November 4, 2026.',
            'Security awareness training covers this rule. A violation is a policy violation and goes through the disciplinary process.',
          ]}
        />
      </Section>
    </Document>
  );
}

export function AntiMalware() {
  return (
    <Document
      title="Anti-malware"
      summary="INTDEV runs anti-malware where malicious files are most likely to arrive: customer uploads, company email, and company laptops. Detections are logged, definitions update automatically, and detections alert engineering."
      controls={['Anti-malware technology utilized']}
    >
      <Section title="Coverage">
        <Table
          columns={['Environment', 'Technology', 'Updates', 'Logging and alerting']}
          rows={[
            ['Customer uploads in Amazon S3', 'GuardDuty Malware Protection for S3. The protection plans are ACTIVE on the intdev-global and txtdev buckets, and they scan new objects and tag the result.', 'Managed by AWS, continuous', 'Findings flow through EventBridge to the intdev-guardduty-alerts SNS topic, which emails eng@internet.dev'],
            ['AWS account workloads', `GuardDuty threat detection in ${AWS_REGIONS.join(', ')}`, 'Managed by AWS, continuous', 'Same EventBridge, SNS, and email path; findings kept in GuardDuty'],
            ['Company email', 'Google Workspace (Gmail) built-in malware and phishing scanning of attachments and links', 'Managed by Google, continuous', 'Google Workspace security reports'],
            ['Company laptops (macOS)', 'XProtect and Gatekeeper built into macOS, with the macOS application firewall on', 'Automatic XProtect definition updates; automatic security updates turned on', 'macOS unified log; detections reported as security incidents'],
            ['Production application hosts', 'Render-managed platform. INTDEV runs no self-managed servers in production.', 'Managed by Render', 'Render platform security'],
          ]}
        />
      </Section>
      <Section title="Rules">
        <List
          items={[
            'Files are scanned when they enter a system, and when they are accessed or downloaded where the platform supports it.',
            'Disabling or changing anti-malware protection without authorization violates policy.',
            `A known or suspected malware detection is a security incident. Report it to ${CONTACTS.security}.`,
          ]}
        />
      </Section>
    </Document>
  );
}

export function PenetrationTesting() {
  return (
    <Document
      title="Penetration testing"
      summary="INTDEV tests the security of its applications and production network at least once a year, and again after major changes. Every finding gets a remediation plan and is fixed within the vulnerability SLAs."
      controls={['Penetration testing performed']}
    >
      <Section title="2026 assessment">
        <Fields
          items={[
            ['Date', 'November 4, 2026'],
            ['Type', 'Internal white-box assessment by INTDEV engineering'],
            ['Targets', 'The INTDEV API (source, configuration, and dependencies), api.internet.dev, users.garden, internet.dev, terminalgraph.com, the AWS account, and the Render services and database'],
            ['Methods', 'Review of authentication and authorization code paths and of credential and cryptography handling; a dependency audit of the full production dependency tree; external TLS and redirect testing of each hostname; read-only review of AWS IAM, MFA, security groups, and GuardDuty; review of Render database network and backup configuration'],
            ['Findings', 'Two high-severity dependency advisories (one fixed the same day, one awaiting an upstream release), one high and two medium configuration and cryptography findings, two moderate dependency advisories, and one low finding'],
          ]}
        />
      </Section>
      <Section title="Remediation plan">
        <Register />
        <p>Remediation follows the Operations Security Policy SLAs: critical and high within 30 days, medium within 60, and low within 90. Specific details of open findings are Confidential and available to auditors on request.</p>
      </Section>
      <Section title="Next tests">
        <List items={['An independent third-party penetration test of the INTDEV API and Users Garden, before the SOC 2 observation window closes', 'A retest of every open finding after remediation', 'The next annual assessment, by November 2027']} />
      </Section>
    </Document>
  );
}

export function MobileDeviceManagement() {
  return (
    <Document
      title="Mobile device management"
      summary="The configuration INTDEV centrally requires on every laptop and mobile device that supports the service, and how devices are enrolled and kept in compliance."
      controls={['MDM system utilized']}
    >
      <Section title="Required configuration">
        <Table
          columns={['Setting', 'Requirement', 'Source']}
          rows={[
            ['Disk encryption', 'FileVault on (AES-XTS)', 'Cryptography Policy; Data Management Policy'],
            ['Screen lock', 'Password or biometric; locks after 5 minutes on devices with confidential data, 10 minutes at most on any device', 'Data Management Policy; Information Security Policy'],
            ['Operating system updates', 'Automatic security updates on', 'Operations Security Policy'],
            ['Anti-malware and firewall', 'XProtect and Gatekeeper on; application firewall on', 'Information Security Policy (Remote Working)'],
            ['Accounts', 'No shared devices; MFA on company accounts; a password manager', 'Access Control Policy'],
            ['Loss or theft', 'Reported right away; remote lock and erase', 'Information Security Policy'],
            ['Offboarding', 'Device returned and erased, or company data removed from personal devices', 'Human Resource Security Policy; Data Management Policy Appendix A'],
          ]}
        />
      </Section>
      <Section title="Management">
        <List
          items={[
            'Every device used for INTDEV work must be enrolled in central device management, which enforces the settings above and reports each device’s compliance before the device can reach company systems.',
            'Enrollment of every current device is due by December 4, 2026, tracked as an access review follow-up. When it is done, this page will name the management platform and the enrolled device count.',
            'Until then, each team member confirms the settings above on their own devices when they acknowledge the security awareness training.',
            'The device register lists each device’s owner, model, serial number, encryption status, and last check-in. It is Confidential and available to auditors on request.',
          ]}
        />
      </Section>
    </Document>
  );
}

export function IntrusionDetection() {
  return (
    <Document
      title="Intrusion detection"
      summary="INTDEV continuously monitors its cloud network for potential security breaches with Amazon GuardDuty, and alerts engineering the moment a finding appears."
      controls={['Intrusion detection system utilized']}
    >
      <Section title="Controls in place">
        <Table
          columns={['Control', 'Configuration', 'Regions']}
          rows={[
            ['GuardDuty detectors', 'One ENABLED detector per region, analyzing CloudTrail, VPC Flow Logs, and DNS logs for threats', AWS_REGIONS.join(', ')],
            ['Finding notifications', 'The EventBridge rule intdev-guardduty-findings-to-sns matches every GuardDuty finding at every severity and targets the SNS topic intdev-guardduty-alerts, which has a confirmed email subscription to eng@internet.dev', AWS_REGIONS.join(', ')],
            ['VPC Flow Logs', 'One flow log per VPC capturing ALL traffic to the CloudWatch log group /intdev/vpc-flow-logs, kept for 365 days', AWS_REGIONS.join(', ')],
            ['Malware Protection for S3', 'Active on the buckets that hold customer uploads', 'us-west-2'],
            ['Edge', 'Cloudflare proxies every public hostname, with DDoS protection and TLS termination', 'Global'],
          ]}
        />
      </Section>
      <Section title="Verification">
        <p>A sample-finding test in all four regions produced one rule invocation per region and one email delivered to eng@internet.dev per topic, with zero failed notifications. A read-only control check is run whenever Vanta reports a change.</p>
      </Section>
      <Section title="Response">
        <p>Findings are triaged under the Incident Response Plan. Unauthorized intrusions and access attempts are investigated and remediated. AWS root account compromise follows the plan’s Appendix D playbook.</p>
      </Section>
    </Document>
  );
}

export function EncryptionInTransit() {
  return (
    <Document
      title="Data transmission encryption"
      summary="INTDEV encrypts confidential and sensitive data whenever it crosses a public network, with TLS between every client, edge, service, database, and processor."
      controls={['Data transmission encrypted']}
    >
      <Section title="External test, November 4, 2026">
        <Table columns={['Hostname', 'HTTP', 'Negotiated', 'TLS 1.1', 'Certificate']} rows={TLS_RESULTS} />
      </Section>
      <Section title="Every hop">
        <Table
          columns={['Connection', 'Protection']}
          rows={[
            ['Browser or app to Cloudflare', 'HTTPS only, TLS 1.3 negotiated, and legacy TLS refused'],
            ['Cloudflare to Render services', 'HTTPS to Render origins, which serve Render-managed TLS certificates'],
            ['INTDEV API to PostgreSQL', 'TLS required by the application’s database client (ssl: true for every non-local host)'],
            ['INTDEV API to S3, Stripe, Mailgun, Twilio, and OAuth providers', 'HTTPS through each provider’s official API'],
            ['Uploads', 'Presigned HTTPS URLs straight to S3 or Google Cloud Storage'],
            ['Cross-origin payloads between INTDEV sites', 'HTTPS, with the payload also encrypted using AES-256'],
            ['Staff remote access', 'Encrypted connections only, and a VPN on public Wi-Fi for confidential work'],
          ]}
        />
      </Section>
      <Section title="Standard">
        <p>The Cryptography Policy requires TLS ciphers rated B or better by SSL Labs, certificates using RSA 2048 or ECC 256 with SHA-2 that are valid for no more than a year, and AES-256 for confidential data at rest.</p>
      </Section>
    </Document>
  );
}

export function NetworkSegmentation() {
  return (
    <Document
      title="Network segmentation"
      summary="INTDEV’s networks and environments are separated so that customer data can be reached only by the production services and administrators that need it."
      controls={['Network segmentation implemented']}
    >
      <Section title="Segments">
        <Table
          columns={['Segment', 'Contains', 'Separation']}
          rows={[
            ['Public edge', 'Cloudflare proxy for every hostname', 'Only HTTPS reaches the origins'],
            ['Production services', 'Render web services for the INTDEV API, Users Garden, and Terminal Graph', 'Each service is an isolated container with its own environment secrets. Only the HTTP port is exposed.'],
            ['Production data', 'Render PostgreSQL (INTDEV DATA) in Oregon', 'Separate managed instance. Every connection needs TLS and the database credential, which only the API environment and administrators hold.'],
            ['Object storage', 'S3 buckets for public assets, private uploads, and private slide exports', 'Separate buckets and prefixes. Private buckets block public access and are reached through short-lived presigned URLs.'],
            ['AWS account', 'Monitoring and legacy resources', 'No production workload. A separate VPC per region, with flow logs on.'],
            ['Development', 'Engineers’ machines and local databases', 'Policy forbids customer data here. Integration tests use embedded PostgreSQL with synthetic accounts only.'],
          ]}
        />
      </Section>
      <Section title="Open item">
        <p>INTDEV-2026-NET-01 narrows the database network allow list to the Render private network and named maintainer addresses (due January 3, 2027).</p>
      </Section>
    </Document>
  );
}

export function FirewallReview() {
  return (
    <Document
      title="Network firewall review"
      summary="INTDEV reviews its firewall rulesets and network access configuration at least once a year. Required changes are tracked to completion."
      controls={['Network firewalls reviewed']}
    >
      <Section title="2026 review">
        <Fields items={[['Date', 'November 4, 2026'], ['Reviewer', 'Jimmy Lee'], ['Scope', 'Cloudflare edge, Render service and database network access, and AWS EC2 security groups and VPCs']]} />
        <Table
          columns={['Ruleset', 'Result', 'Tracked change']}
          rows={[
            ['Cloudflare edge', 'HTTPS only, HTTP redirects, TLS 1.3, legacy TLS refused', 'Add HSTS (INTDEV-2026-HSTS)'],
            ['Render web services', 'Only the service’s HTTP port is exposed, behind Cloudflare', 'None'],
            ['Render PostgreSQL allow list', 'TLS and a credential required; allow list broader than needed', 'INTDEV-2026-NET-01'],
            ['AWS security groups (us-west-2)', 'Legacy groups on stopped instances have rules broader than needed', 'INTDEV-2026-NET-02'],
          ]}
        />
      </Section>
      <Section title="Process">
        <List items={['Every change to network settings goes through change management, with a ticket and an approval.', 'Production rules are revalidated at least once a year against their business justification.', 'Remote access is restricted and logged.']} />
      </Section>
    </Document>
  );
}

export function InfrastructureMaintenance() {
  return (
    <Document
      title="Service infrastructure maintenance"
      summary="Infrastructure that supports the service is patched as routine maintenance and whenever a vulnerability is identified, so that the servers behind it stay hardened."
      controls={['Service infrastructure maintained']}
    >
      <Section title="Who patches what">
        <Table
          columns={['Layer', 'Patched by', 'How']}
          rows={[
            ['Host operating systems, container runtime, and PostgreSQL engine', 'Render (managed platform)', 'Continuous platform maintenance; minor PostgreSQL updates applied by Render'],
            ['Node.js runtime and frameworks (Next.js, React)', 'INTDEV', 'Framework upgrades shipped as tagged releases through CI/CD'],
            ['Application dependencies', 'INTDEV', 'Dependency audit every quarter and whenever an advisory is published, fixed within SLA'],
            ['Edge TLS and certificates', 'Cloudflare', 'Automatic certificate issuance and renewal'],
          ]}
        />
      </Section>
      <Section title="Sample of remediated vulnerabilities">
        <Table
          columns={['Vulnerability', 'System', 'Remediation', 'Released']}
          rows={[
            ['GHSA-wq5f-xc86-pv6w, sharp and librsvg (High)', 'INTDEV API', 'sharp 0.35.4 upgraded to 0.35.5', 'Fixed November 4, 2026; ships with the next API release'],
            ['Critical React Server Components remote code execution advisory, December 3, 2025', 'Users Garden', 'Next.js upgraded to 16.0.7 (P0 severity patch)', 'Deployed December 5, 2025 (commit 8c17648)'],
            ['Framework currency', 'Users Garden', 'Next.js 16.1.4', 'Deployed February 2, 2026 (commit 7a247eb)'],
          ]}
        />
      </Section>
      <Section title="Related">
        <Links items={[{ label: 'Vulnerability scanning and remediation', href: '/compliance/vulnerability-scans' }, { label: 'CI/CD production deployments', href: '/compliance/ci-cd' }]} />
      </Section>
    </Document>
  );
}

export function VulnerabilityScans() {
  return (
    <Document
      title="Vulnerability scanning and remediation"
      summary="INTDEV scans its external-facing systems at least once a quarter, and tracks every critical and high vulnerability to remediation."
      controls={['Vulnerabilities scanned and remediated', 'Service infrastructure maintained']}
    >
      <Section title="Q4 2026 scan">
        <Group>
          <Fields
            items={[
              ['Date', 'November 4, 2026'],
              ['Dependency scan', 'npm audit of the INTDEV API’s full production resolution of package.json, the same resolution Render installs: 373 packages'],
              ['External scan', 'TLS, protocol, certificate, redirect, and security-header checks against api.internet.dev, users.garden, internet.dev, and terminalgraph.com'],
              ['Configuration scan', 'AWS IAM, MFA, security groups, GuardDuty, and malware protection; Render database network and backup settings'],
            ]}
          />
          <Table
            columns={['Severity', 'Before remediation', 'After remediation']}
            rows={[
              ['Critical', '0', '0'],
              ['High', '17 package entries from 2 advisories (sharp; zod through @atproto) plus 1 configuration finding', '16 package entries from 1 advisory (zod, no upstream fix) plus 1 configuration finding'],
              ['Moderate and medium', '5 package entries from 2 advisories (glob, minimatch) plus 2 configuration findings', 'Unchanged, scheduled'],
              ['Low', '1 (HSTS)', 'Unchanged, scheduled'],
            ]}
          />
        </Group>
      </Section>
      <Section title="Vulnerability register">
        <Register />
      </Section>
      <Section title="SLAs and schedule">
        <List items={['Critical and high: 30 days. Medium: 60 days. Low: 90 days. Informational: as needed.', 'A finding that can’t meet its SLA needs a risk treatment plan and a new date.', 'Scans run every quarter (Q1 2027 by March 31) and after every major change.']} />
      </Section>
    </Document>
  );
}
