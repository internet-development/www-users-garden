import Document from '@root/compliance/site/Document';
import fileVaultEncryption from '@root/compliance/site/images/filevault-encryption.png';

import { API_HOST, AWS_REGIONS, BUG_BOUNTY, CONTACTS, OSPREY, PENETRATION_TEST, SEVERITY_ASSESSMENT, SEVERITY_DEFINITIONS, SOFTWARE_RETIREMENT, VULNERABILITIES } from '@root/compliance/site/facts';
import { APPLE_ENCRYPTION_SOURCES, APPLICATION_ENCRYPTION, CRYPTOGRAPHY_POLICY_KEYS, DEVICE_CHECK_FRESH_DAYS, DEVICE_CHECK_IN, DEVICE_CHECK_SCRIPT, EVIDENCE_ENDPOINTS, FILEVAULT_REQUIRED, REMOVABLE_MEDIA_CONTROL, REMOVABLE_MEDIA_ENCRYPTION, NETWORK_EXPORTED_AT, RENDER_NETWORK_EXPORT, SECURITY_GROUP_EXPORT, VULNERABILITY_SCAN, XTS_KEY_SIZES, formatRecordDay } from '@root/compliance/site/records';
import { Fields, Figure, Group, Links, List, Mail, Member, Section, Table } from '@root/compliance/site/Blocks';
import { DeviceAntiMalwareReport, DeviceEncryptionReport, DeviceManagementRecord, DevicePatchReport, FileVaultStandardReport, InfrastructureChecks, RemediationRecords, SoftwareInventoryRecord, TlsRecord } from '@root/compliance/site/Evidence';
import { SegmentationDiagram } from '@root/compliance/site/NetworkDiagram';

const VULNERABILITY_RECORD = `${API_HOST}${EVIDENCE_ENDPOINTS.vulnerabilities}`;
const ENCRYPTION_RECORD = `${API_HOST}${EVIDENCE_ENDPOINTS.encryption}`;
const ENCRYPTION_LINK = { label: 'Encryption standard from the INTDEV API (JSON)', href: ENCRYPTION_RECORD, detail: 'FileVault per Mac with Apple’s documentation and live laptop counts, removable media, and the API’s separate application-layer AES' };

function ScanRecord() {
  return (
    <Group>
      <Fields
        items={[
          ['Date', VULNERABILITY_SCAN.date],
          ['Dependency scan', VULNERABILITY_SCAN.dependency],
          ['External scan', VULNERABILITY_SCAN.external],
          ['Configuration scan', VULNERABILITY_SCAN.configuration],
          ['Record', <a key="record" href={VULNERABILITY_RECORD}>{VULNERABILITY_RECORD.replace('https://', '')}</a>],
        ]}
      />
      <Table columns={['Severity', 'Before remediation', 'After remediation']} rows={VULNERABILITY_SCAN.counts.map((row) => [row.severity, row.before, row.after])} />
    </Group>
  );
}

function FileVaultEvidence() {
  return <Figure image={fileVaultEncryption} alt="macOS System Settings, signed in to the Apple Account of Jimmy Lee, Privacy and Security, FileVault: the FileVault switch is on, and a recovery key is set for password reset. The key itself is hidden." caption="A sample of what the device check reads: FileVault on the CEO’s MacBook, with a recovery key for password reset. Captured November 4, 2026. The fleet report above, not this screenshot, is the evidence for every laptop." />;
}

function FleetReport() {
  return (
    <Group>
      <p>
        Every laptop used for INTDEV work reports its own disk encryption and removable media configuration to the INTDEV API, and this table is read live from that record each time the page loads. A laptop counts only while its last check-in is under {DEVICE_CHECK_FRESH_DAYS} days old, and a team member passes only when every current laptop they use is encrypted.
      </p>
      <DeviceEncryptionReport />
    </Group>
  );
}

function DeviceCheckProcess() {
  return (
    <List
      items={[
        <>
          Each team member runs the INTDEV device check, <a href={DEVICE_CHECK_SCRIPT}>{DEVICE_CHECK_SCRIPT.replace('https://', '')}</a>, on every Mac they use for INTDEV work: at onboarding, whenever they set up a new laptop, and at least every {DEVICE_CHECK_FRESH_DAYS} days. It needs no administrator rights and changes nothing on the Mac.
        </>,
        'It reads the configuration from macOS itself: fdesetup status for FileVault, diskutil for the data volume’s encryption, the chip (Apple silicon, T2, or Intel), the MDM enrollment status, every mounted external volume with whether it is encrypted and writable, and the anti-malware state: Gatekeeper, the installed XProtect definitions, the automatic security update settings, and the application firewall. Disk images are not removable media and are skipped.',
        `The raw values reach ${DEVICE_CHECK_IN} under the team member’s own account: either the script posts them with their API key, or it copies the report and they send it from Device check on users.garden while signed in. Any signed-in account can report its own laptops, so a new team member can report before joining, but this report lists only current team members. The API refuses a laptop that another current team member has already reported, so one Mac cannot stand in for several people. The API decides compliance from the raw values, so a Mac that is still encrypting, or whose data volume does not report encryption, does not pass.`,
        'The script seals each report with a SHA-256 hash of every value it read and the time it ran. The API recomputes the seal and refuses a report that was edited after the check made it, one more than a day old, one from an older version of the check, and one whose Mac model contradicts its chip. The seal shows a report was not changed by hand on its way to the API; it is not a signature, and the script that computes it is public.',
        'Every laptop row on this record names the team member it is reported under. A team member with more than one current laptop has one named row for each.',
        'Every check-in is kept in the production database as an audit trail. The record identifies a laptop only by a one-way hash of its hardware UUID; it holds no serial number, hostname, user name, or IP address.',
        <>
          Each laptop’s cipher comes from the FileVault encryption standard in <a href={ENCRYPTION_RECORD}>{ENCRYPTION_RECORD.replace('https://', '')}</a>: AES-256-XTS on Apple silicon, where Apple documents a 256-bit cipher key, and AES-XTS with no stated key size on T2 and Intel Macs, where Apple publishes none. Only Apple silicon laptops count as AES-256.
        </>,
      ]}
    />
  );
}

function FileVaultStandard() {
  return (
    <Group>
      <p>FileVault is Apple’s full-disk encryption, built into macOS. INTDEV relies on Apple’s implementation and publishes only what Apple documents for each kind of Mac, with the number of current laptops of that kind from the fleet report.</p>
      <FileVaultStandardReport />
      <p>{XTS_KEY_SIZES}</p>
      <p>{FILEVAULT_REQUIRED}</p>
      <List
        items={[APPLE_ENCRYPTION_SOURCES.fileVault, APPLE_ENCRYPTION_SOURCES.aes256, APPLE_ENCRYPTION_SOURCES.aes128, APPLE_ENCRYPTION_SOURCES.fileVaultOff, APPLE_ENCRYPTION_SOURCES.onByDefault, APPLE_ENCRYPTION_SOURCES.removable].map((source) => (
          <>
            “{source.quote}” <a href={source.href}>{source.title}</a>
          </>
        ))}
      />
    </Group>
  );
}

function ApplicationEncryption() {
  const finding = VULNERABILITIES.find((item) => item.id === APPLICATION_ENCRYPTION.finding);
  return (
    <Group>
      <p>
        INTDEV also encrypts a few application values itself, on top of TLS. This is a different layer from FileVault and is not part of the removable media control: it applies to specific values as they move between INTDEV sites and while they sit in the production database, never to the contents of a laptop or drive.
      </p>
      <Fields
        items={[
          ['Algorithm', APPLICATION_ENCRYPTION.algorithm],
          ['Implementation', APPLICATION_ENCRYPTION.implementation],
          ['Key', APPLICATION_ENCRYPTION.key_custody],
          ['Covers', <List key="covers" items={APPLICATION_ENCRYPTION.covers} />],
          ['Does not cover', <List key="not-covered" items={APPLICATION_ENCRYPTION.does_not_cover} />],
          ['Status', finding ? `${APPLICATION_ENCRYPTION.status} Finding status: ${finding.status}${finding.treatment ? `; target ${finding.treatment.target}` : ''}.` : APPLICATION_ENCRYPTION.status],
        ]}
      />
      <Links items={[{ label: `Vulnerability register: ${APPLICATION_ENCRYPTION.finding}`, href: '/compliance/remediated-vulnerabilities' }, { label: 'Data transmission encryption', href: '/compliance/encryption-in-transit' }]} />
    </Group>
  );
}

function advisory(id: string) {
  return id.startsWith('GHSA-') ? <a key="id" href={`https://github.com/advisories/${id}`}>{id}</a> : id;
}

function Register() {
  return <Table columns={['ID', 'Component', 'Severity', 'Status', 'Action']} rows={VULNERABILITIES.map((item) => [advisory(item.id), item.component, item.severity, item.status, item.action])} />;
}

export function RemovableMedia() {
  return (
    <Document
      slug="removable-media"
      title="Removable media encryption"
      summary="INTDEV does not allow confidential data on portable or removable media unless there is a documented exception, and any media allowed by exception must be encrypted. Every company laptop is fully disk-encrypted with FileVault, and each one proves it to the INTDEV API, which publishes the fleet report below. The API’s own application-layer encryption is a separate layer and is described separately, so neither is mistaken for the other."
      controls={['Removable media encryption']}
      related={[ENCRYPTION_LINK]}
    >
      <Section title="Fleet disk encryption report">
        <FleetReport />
      </Section>
      <Section title="How the report is generated">
        <DeviceCheckProcess />
      </Section>
      <Section title="FileVault encryption standard">
        <FileVaultStandard />
      </Section>
      <Section title="Removable media enforcement">
        <Fields
          items={[
            ['Requirement', REMOVABLE_MEDIA_CONTROL.requirement],
            ['Enforced by', REMOVABLE_MEDIA_CONTROL.status],
            ['Exceptions', 'None requested or approved as of November 4, 2026.'],
          ]}
        />
      </Section>
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
        <Group>
          <Table columns={['Cryptography Policy key table', 'Algorithm', 'Key length', 'Key expiration']} rows={CRYPTOGRAPHY_POLICY_KEYS.map((row) => [row.domain, row.algorithm, row.key_length, row.expiration])} />
          <Table
            columns={['Media', 'Requirement', 'Mechanism']}
            rows={[
              ['Laptop internal storage', 'Full-disk encryption with AES, 128 or 256-bit keys', 'FileVault, turned on before the device is used for INTDEV work. AES-256-XTS on Apple silicon; AES-XTS on T2 and older Intel Macs, where Apple does not publish the key size.'],
              ['Removable media, by exception only', 'Encrypted with an approved standard (AES, 128 or 256-bit keys) and a unique password', `An APFS (Encrypted) volume on the USB or external drive, created with Disk Utility or diskutil: ${REMOVABLE_MEDIA_ENCRYPTION.algorithm}`],
              ['Backups', 'Encrypted', 'Render-managed database backups. No removable backup media is used.'],
            ]}
          />
        </Group>
      </Section>
      <Section title="Application-layer encryption, a separate layer">
        <ApplicationEncryption />
      </Section>
      <Section title="How it is enforced">
        <List
          items={[
            'There is no need to move customer data onto devices. Customer data lives only in production systems (Render PostgreSQL and S3), and policy forbids copying it into non-production environments.',
            'Exceptions are requested in writing to the CEO and recorded with the media, the data, an encryption confirmation, and the date of destruction.',
            'FileVault is on for every Mac used for INTDEV work, and on by default from macOS 26.4. The fleet report above shows each laptop’s state from its own check-in, and the compliance report opens an item when any team member’s laptop is unencrypted or has not reported in the last 30 days.',
            'Security awareness training covers this rule. A violation is a policy violation and goes through the disciplinary process.',
          ]}
        />
      </Section>
      <Section title="Sample">
        <FileVaultEvidence />
      </Section>
    </Document>
  );
}

export function AntiMalware() {
  return (
    <Document
      slug="anti-malware"
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
            ['Company laptops (macOS)', 'XProtect and Gatekeeper built into macOS, and the macOS application firewall. Each laptop reports their state through the device check, below.', 'XProtect definitions arrive with Apple’s automatic security responses, as Apple directs; each laptop reports that setting and its installed definitions', 'macOS unified log; detections reported as security incidents'],
            ['Production application hosts', 'Render-managed platform. INTDEV runs no self-managed servers in production, and production holds no client data from engagements such as Microsoft’s.', 'Managed by Render', 'Render platform security'],
          ]}
        />
      </Section>
      <Section title="Company laptops">
        <Group>
          <p>{`Every laptop used for INTDEV work reports its anti-malware state with the device check, at least every ${DEVICE_CHECK_FRESH_DAYS} days: whether Gatekeeper is assessing apps (spctl), the installed XProtect definitions and when they arrived (xprotect), whether macOS installs Apple’s security responses and security updates automatically, and the application firewall. A laptop passes when Gatekeeper is on, XProtect definitions are installed, and automatic security responses are on. This table is read live from that record.`}</p>
          <DeviceAntiMalwareReport />
        </Group>
      </Section>
      <Section title="Read with this release">
        <InfrastructureChecks ids={['aws-malware-protection', 'aws-guardduty']} />
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
      slug="penetration-testing"
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
            ['Findings', 'Two high-severity dependency advisories (sharp, fixed and live in 2.0.8; zod, awaiting an upstream release under an approved risk treatment plan), one high and two medium configuration and cryptography findings, two moderate dependency advisories (fixed in 2.0.9), and one low finding'],
          ]}
        />
      </Section>
      <Section title="Remediation plan">
        <Register />
        <p>Remediation follows the Operations Security Policy SLAs: critical and high within 30 days, medium within 60, and low within 90. Specific details of open findings are Confidential and available to auditors on request.</p>
      </Section>
      <Section title="Remediation evidence and management sign-off">
        <Group>
          <p>For each finding: the change that fixed it, the release that shipped it, and how the fix was verified, or, for a finding still open, its risk treatment plan with management sign-off. Whether a fix is live is checked against the release api.internet.dev is serving when you load this page.</p>
          <RemediationRecords />
        </Group>
      </Section>
      <Section title="2025 penetration test">
        <Group>
          <p>{`During INTDEV’s Osprey engagement (${PENETRATION_TEST.window}), ROOST tried to break the INTDEV API, INTDEV’s purpose-built backend, guided by Chenyu Huang, who had built its Apple and Bluesky sign-in. ${PENETRATION_TEST.result} The report is dated ${PENETRATION_TEST.reportedAt}. ${PENETRATION_TEST.followUp}`}</p>
          <Links items={[{ label: `Penetration test report ${PENETRATION_TEST.id}`, href: '/compliance/penetration-test-report' }]} />
        </Group>
      </Section>
      <Section title="Next tests">
        <List items={['An independent third-party penetration test of the INTDEV API and Users Garden, before the SOC 2 observation window closes', 'A retest of every open finding after remediation', 'The next annual assessment, by November 2027']} />
      </Section>
    </Document>
  );
}

export function PenetrationTestReport() {
  return (
    <Document
      slug="penetration-test-report"
      title={`Penetration test report ${PENETRATION_TEST.id}: INTDEV API`}
      summary={`During INTDEV’s 2025 work for Discord and ROOST on Osprey, ROOST tried to break the INTDEV API, the backend INTDEV builds itself, guided by Chenyu Huang, the engineer who had built its Apple and Bluesky sign-in. No attempt succeeded. This report, dated ${PENETRATION_TEST.reportedAt}, records why he led the test, and its scope, method, results, and recommendations.`}
      controls={['Penetration testing performed']}
      appliesTo="INTDEV API (api.internet.dev), INTDEV’s purpose-built, custom-developed backend"
      related={[
        { label: 'Osprey on GitHub', href: OSPREY.repository, detail: 'ROOST’s open-source safety rules engine, the engagement in which the test took place' },
        { label: 'INTDEV in the Osprey recognition', href: OSPREY.recognition.href, detail: OSPREY.recognition.detail },
        { label: 'INTDEV’s final Osprey commit', href: OSPREY.finalCommit.href, detail: OSPREY.finalCommit.detail },
        { label: 'Chenyu Huang', href: PENETRATION_TEST.leadSite.href, detail: PENETRATION_TEST.leadSite.detail },
      ]}
    >
      <Section title="Report record">
        <Fields
          items={[
            ['Report', PENETRATION_TEST.id],
            ['Report date', PENETRATION_TEST.reportedAt],
            ['Target', PENETRATION_TEST.target],
            ['Software type', 'Purpose-built. INTDEV designs, writes, and maintains the INTDEV API’s application code. It is not a third-party product, a platform’s default configuration, or network infrastructure.'],
            ['Engagement', PENETRATION_TEST.engagement],
            ['Test window', PENETRATION_TEST.window],
            ['Window evidence', PENETRATION_TEST.windowEvidence],
            ['Testers', PENETRATION_TEST.testers],
            ['Test lead', PENETRATION_TEST.lead],
            ['Test type', 'Manual adversarial testing: people actively trying to break the API, not an automated scan'],
            ['Result', PENETRATION_TEST.result],
            ['Attested by', <Member key="attested" name={`${PENETRATION_TEST.attestedBy}, ${PENETRATION_TEST.attestedAt}`} />],
          ]}
        />
      </Section>
      <Section title="Why the builder was asked to break it">
        <Group>
          {PENETRATION_TEST.rationale.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </Group>
      </Section>
      <Section title="Scope: purpose-built software">
        <Group>
          <p>The target was the INTDEV API, the universal backend behind Users Garden, Terminal Graph accounts, and every other INTDEV product. Its attack surface is INTDEV’s own code: the routes, the authentication, and the authorization rules INTDEV wrote, running on hosting INTDEV rents. The test aimed at that code, not at the infrastructure under it.</p>
          <Table
            columns={['Component', 'What INTDEV built', 'In this test']}
            rows={[
              ['Public HTTP API', 'Every route on api.internet.dev is INTDEV’s own TypeScript code', 'In scope'],
              ['Authentication', 'INTDEV’s own password sign-in, API key (x-api-key) handling, and the Google, Apple, and Bluesky sign-in flows', 'In scope'],
              ['Authorization', 'User tiers and organization member and admin roles, checked on every request', 'In scope'],
              ['Separation between customers', 'Accounts, organizations, and products that share one backend', 'In scope'],
              ['Hosting and network (Render, Cloudflare, AWS)', 'Configured by INTDEV, operated by the vendors', 'Not the target. Covered by INTDEV’s vulnerability scans'],
            ]}
          />
        </Group>
      </Section>
      <Section title="Method">
        <List
          items={[
            'The testers attacked the INTDEV API the way an outside adversary would: by sending requests to it and trying to break it.',
            'Chenyu Huang guided the testing and directed it at the authentication he had helped build.',
            'A successful break would be any unauthorized access, any privilege gained beyond what the testers’ accounts were granted, any exposure of another customer’s data, or any disruption of the service.',
          ]}
        />
      </Section>
      <Section title="Results">
        <Group>
          <Table
            columns={['Outcome', 'Result']}
            rows={[
              ['Vulnerabilities successfully exploited', 'None'],
              ['Unauthorized access or privilege gained', 'None'],
              ['Customer data exposed', 'None'],
              ['Service disrupted or compromised', 'None'],
              ['Findings requiring remediation', 'None'],
            ]}
          />
          <Table columns={['Severity', 'Exploited findings']} rows={[['Critical', '0'], ['High', '0'], ['Medium', '0'], ['Low', '0']]} />
        </Group>
      </Section>
      <Section title="Impact and remediation">
        <Group>
          <p>No vulnerability was exploited, so the test produced no impact to assess and no remediation of its own.</p>
          <p>Recommendations from this report:</p>
          <List
            ordered
            items={[
              'Commission an independent third-party penetration test of the INTDEV API and Users Garden before the SOC 2 observation window closes.',
              'Cover every route added to the INTDEV API after this test.',
              'Keep each test’s dates, testers, attempt log, and results with its report, so every future report carries its own evidence.',
              'Retest every finding after it is remediated.',
            ]}
          />
        </Group>
      </Section>
      <Section title="Limitations">
        <List
          items={[
            'The exact dates of the attempts were not recorded. The test window is the span of the engagement, taken from public records.',
            'INTDEV did not keep the testers’ notes or a log of each attempt. This report records the outcome as the CEO attests it.',
            `The knowledge that made Chenyu Huang the right adversary also means the test was not independent: he was an INTDEV partner during the test. By the report date, ${PENETRATION_TEST.reportedAt}, he had joined Discord and was no longer part of INTDEV. The independent third-party test above addresses this.`,
            'The test asked whether knowledge of the design could defeat the authentication, not whether his own account could be misused. That account kept platform admin until the termination checklist lowered it on November 4, 2026, as the termination record shows.',
            'The test covered the INTDEV API as it was in 2025.',
          ]}
        />
      </Section>
      <Section title="Follow-up">
        <Group>
          <p>{PENETRATION_TEST.followUp}</p>
          <p>Findings from later scans and from the November 2026 internal assessment are tracked separately, each with its remediation evidence or approved risk treatment plan, on the remediated vulnerabilities and penetration testing pages. The independent third-party test and the retest of every finding recommended above are scheduled as next tests on the penetration testing page.</p>
        </Group>
      </Section>
      <Section title="Attestation">
        <Group>
          <p>{PENETRATION_TEST.attestation}</p>
          <p>{`${PENETRATION_TEST.attestedBy}, ${PENETRATION_TEST.attestedAt}.`}</p>
        </Group>
      </Section>
    </Document>
  );
}

export function BugBounty() {
  return (
    <Document
      slug="bug-bounty"
      title="Bug bounty program"
      summary="INTDEV invites security researchers to find and report vulnerabilities in the INTDEV API, Users Garden, Terminal Graph, and internet.dev. INTDEV does not publish reward amounts, but people who report with good intent and communicate well are likely to be rewarded."
      controls={['Bug bounty program']}
      appliesTo="INTDEV API (api.internet.dev), Users Garden (users.garden), Terminal Graph (terminalgraph.com), and internet.dev"
    >
      <Section title="Program record">
        <Fields
          items={[
            ['Program', BUG_BOUNTY.name],
            ['Submit reports to', <Mail key="security" address={CONTACTS.security} />],
            ['Run by', BUG_BOUNTY.operator],
            ['In effect since', BUG_BOUNTY.started],
            ['Rewards', 'At INTDEV’s discretion. Amounts are not published.'],
            ['Safe harbor', 'INTDEV does not take legal action against good-faith research that follows the rules on this page.'],
          ]}
        />
      </Section>
      <Section title="Scope">
        <Group>
          <Table columns={['Product', 'Target', 'Includes']} rows={BUG_BOUNTY.inScope} />
          <p>Out of scope:</p>
          <List items={BUG_BOUNTY.outOfScope} />
        </Group>
      </Section>
      <Section title="Rules">
        <List
          items={[
            'Test only with accounts you created yourself, and with your own test data.',
            'Do not access, change, keep, or share anyone else’s data. If you reach it by accident, stop, do not save it, and say so in your report.',
            'Do not degrade the service. No denial of service, no high-volume automated scanning, and stay within the published rate limits.',
            'Use a vulnerability only as far as you need to demonstrate it. Do not pivot to other systems or keep access.',
            'Give INTDEV a reasonable time to fix the issue before you disclose it, and agree the disclosure date with us.',
            'Follow the law.',
          ]}
        />
      </Section>
      <Section title="How to report">
        <Group>
          <p>
            Email <Mail address={CONTACTS.security} /> with:
          </p>
          <List
            items={[
              'The product and the affected URL, route, or application version',
              'Steps to reproduce, with the requests and responses',
              'The impact you demonstrated',
              'How to reach you, and the name or handle you would like us to use',
            ]}
          />
          <p>Never include another person’s data, a password, or any API key other than your own test account’s.</p>
        </Group>
      </Section>
      <Section title="What happens next">
        <Table
          columns={['Step', 'What INTDEV does']}
          rows={[
            ['Acknowledge', 'A person reads and answers every report. Security reports are triaged into P0 to P3 under the Incident Response Plan: P0 immediately, P1 within one business day.'],
            ['Assess', 'Engineering assesses the severity. Under the Operations Security Policy, INTDEV’s assessed severity may differ from the researcher’s, based on real-world impact and exploitability.'],
            ['Fix', 'Critical and high within 30 days, medium within 60, and low within 90. A finding that cannot be fixed in time gets a risk treatment plan with management sign-off.'],
            ['Record', 'The finding joins the vulnerability register by component, severity, and status, without exploit details. Bug bounty reports are an input to risk assessment under the Risk Management Policy.'],
            ['Close', 'INTDEV tells the researcher when the fix is live, agrees on any public disclosure, and decides on a reward.'],
          ]}
        />
      </Section>
      <Section title="Rewards">
        <Group>
          <p>{BUG_BOUNTY.rewards}</p>
          <p>Good intent, following these rules, and clear communication from the first report to the fix matter as much as the finding itself. When more than one person reports the same issue, the first complete report is considered for a reward.</p>
        </Group>
      </Section>
    </Document>
  );
}

export function MobileDeviceManagement() {
  return (
    <Document
      slug="mobile-device-management"
      title="Mobile device management"
      summary="The configuration INTDEV centrally requires on every laptop and mobile device that supports the service, and how devices are enrolled and kept in compliance."
      controls={['MDM system utilized']}
      related={[ENCRYPTION_LINK]}
    >
      <Section title="Required configuration">
        <Table
          columns={['Setting', 'Requirement', 'Source']}
          rows={[
            ['Disk encryption', 'FileVault on (AES-256-XTS on Apple silicon; AES-XTS on T2 and older Intel Macs, where Apple does not publish the key size), reported by the device check at least every 30 days', 'Cryptography Policy; Data Management Policy'],
            ['Removable media', 'No company or customer data written to removable media without an approved exception. Prohibited by INTDEV’s rules of conduct and left to each team member’s judgement, not blocked by device management; the device check reports any unencrypted writable removable volume', 'Information Security Policy; Data Management Policy; Cryptography Policy'],
            ['Screen lock', 'Password or biometric; locks after 5 minutes on devices with confidential data, 10 minutes at most on any device', 'Data Management Policy; Information Security Policy'],
            ['Operating system updates', 'Automatic security updates on', 'Operations Security Policy'],
            ['Anti-malware and firewall', 'XProtect and Gatekeeper on; application firewall on', 'Information Security Policy (Remote Working)'],
            ['Accounts', 'No shared devices; MFA on company accounts; a password manager', 'Access Control Policy'],
            ['Loss or theft', 'Reported right away; remote lock and erase', 'Information Security Policy'],
            ['Offboarding', 'Device returned and erased, or company data removed from personal devices', 'Human Resource Security Policy; Data Management Policy Appendix A'],
          ]}
        />
      </Section>
      <Section title="Fleet disk encryption report">
        <FleetReport />
      </Section>
      <Section title="How the report is generated">
        <DeviceCheckProcess />
      </Section>
      <Section title="Management">
        <List
          items={[
            'Every device used for INTDEV work must be enrolled in central device management, which enforces the settings above and reports each device’s compliance before the device can reach company systems.',
            'Enrollment of every current device is due by December 4, 2026, tracked as an access review follow-up. When it is done, this page will name the management platform and the enrolled device count.',
            <>
              Until then, every laptop reports its disk encryption, removable media, anti-malware, firewall, and enrollment status to the INTDEV API through the device check, and the fleet report above is generated from those check-ins. Each team member also confirms the other settings when they acknowledge the security awareness training. The <a href="/compliance/mobile-device-management-system">mobile device management system</a> page describes that system and its live management status.
            </>,
            'The fleet report publishes each laptop’s owner, model, macOS version, encryption, and last check-in. Serial numbers are kept in the device register, which is Confidential and available to auditors on request.',
          ]}
        />
      </Section>
    </Document>
  );
}

export function MobileDeviceManagementSystem() {
  const fleetRecord = `${API_HOST}${EVIDENCE_ENDPOINTS.devices}`;
  return (
    <Document
      slug="mobile-device-management-system"
      title="Mobile device management system"
      updated="November 6, 2026"
      summary={`INTDEV centrally manages every laptop that supports the service through its own device management system, built into the INTDEV API. Each laptop is enrolled under its team member’s account, reports its security configuration to one central register at least every ${DEVICE_CHECK_FRESH_DAYS} days, and is judged by the API against INTDEV’s required configuration. The live status of the whole fleet is below.`}
      controls={['MDM system utilized']}
    >
      <Section title="The system">
        <Fields
          items={[
            ['System', 'INTDEV device management, part of the INTDEV API at api.internet.dev'],
            ['Owner', <Member key="owner" name="Jimmy Lee, Chief Executive Officer and Chief Information Security Officer" />],
            ['Devices in scope', 'Every Mac laptop a current team member uses for INTDEV work. The Information Security Policy’s Mobile Device Policy applies to every end-user device, and the Data Management Policy forbids storing confidential data on personal phones.'],
            ['Agent', <span key="agent">The INTDEV device check, <a href={DEVICE_CHECK_SCRIPT}>{DEVICE_CHECK_SCRIPT.replace('https://', '')}</a>. It runs on macOS without administrator rights and only reads the configuration.</span>],
            ['Enrollment and check-ins', `${DEVICE_CHECK_IN}, under the team member’s own INTDEV API account, sent by the script or from Device check on users.garden`],
            ['Central register', 'The INTDEV API’s production database keeps every check-in as an audit record. A laptop is identified only by a one-way hash of its hardware UUID; the register holds no serial number, hostname, user name, or IP address.'],
            ['Fleet record', <a key="record" href={fleetRecord}>{fleetRecord.replace('https://', '')}</a>],
            ['Compliance monitoring', <span key="report">The device checks in the <a href="/compliance">compliance report</a>, recomputed from the register on every request</span>],
          ]}
        />
      </Section>
      <Section title="Live management status">
        <DeviceManagementRecord />
      </Section>
      <Section title="Managed laptops">
        <FleetReport />
      </Section>
      <Section title="Device lifecycle">
        <Table
          columns={['Stage', 'What happens', 'Record']}
          rows={[
            ['Enroll', 'At onboarding, and whenever a team member sets up a new laptop, they run the device check, which sends the laptop’s configuration under their own account. The API refuses a laptop already enrolled under another current team member, so one Mac cannot count for several people.', 'The laptop’s first check-in in the central register'],
            ['Monitor', `The laptop reports again at least every ${DEVICE_CHECK_FRESH_DAYS} days. The API checks each report’s seal, tool version, age, and model against its chip, then decides compliance itself from the raw macOS values: FileVault on and the data volume encrypted, the cipher Apple documents for the chip, no unencrypted writable removable volume mounted, and, from device check 3, anti-malware active and a supported macOS that installs security updates automatically.`, 'The fleet record and the tables above'],
            ['Respond', `A laptop that fails, or a team member with no check-in in the last ${DEVICE_CHECK_FRESH_DAYS} days, shows as open on this page and opens the device checks in the compliance report until a passing check-in arrives. The team member corrects the laptop and runs the check again.`, 'The compliance report’s device checks'],
            ['Remove', 'When a person leaves, the termination record removes them from the team register and their laptops drop out of the fleet record. The Information Security Policy requires them to return every company-owned device and delete all company information and accounts from personal devices.', <a key="termination" href="/compliance/access-termination">Access revoked upon termination</a>],
          ]}
        />
      </Section>
      <Section title="What it verifies">
        <Table
          columns={['Setting', 'Requirement', 'How the system manages it']}
          rows={[
            ['Disk encryption', 'FileVault on every laptop (Data Management Policy; Cryptography Policy)', 'Read and judged on every check-in'],
            ['Removable media', 'No confidential data on removable media without an approved exception', `Unencrypted writable volumes are reported on every check-in. ${REMOVABLE_MEDIA_CONTROL.status}`],
            ['Hardware and macOS', 'Recorded for every laptop', 'Model, chip, and macOS version are read on every check-in and published'],
            ['Anti-malware', 'XProtect and Gatekeeper on, with definitions installed automatically (Information Security Policy; Operations Security Policy)', 'Read and judged on every check-in from device check 3: Gatekeeper on, XProtect definitions installed, and automatic security responses on'],
            ['Application firewall and security updates', 'Firewall on and automatic security updates on (Information Security Policy; Operations Security Policy)', 'Read on every check-in from device check 3 and published beside anti-malware; not part of the pass or fail decision'],
            ['Screen lock', 'Locks after 5 minutes on devices with confidential data, 10 minutes at most on any device (Data Management Policy; Information Security Policy)', 'Acknowledged by each team member in security awareness training; not read by the device check'],
          ]}
        />
        <p>
          The full required configuration is on the <a href="/compliance/mobile-device-management">mobile device management</a> page.
        </p>
      </Section>
      <Section title="What the system does not do">
        <List
          items={[
            'It does not push configuration profiles, install software, or change settings. The device check only reads macOS, and the team member corrects a laptop that fails.',
            'It cannot lock or erase a laptop remotely. A lost or stolen laptop is reported right away under the Information Security Policy, and FileVault keeps its data encrypted at rest.',
            'It does not block a laptop from reaching company systems. It makes a gap visible on this page and in the compliance report until it is fixed.',
            'No laptop depends on a third-party MDM server; the live status above shows how many are enrolled with one. The mobile device management page records the commitment to enroll every laptop in a configuration-enforcing platform by December 4, 2026, and this page will name that platform once it is in use.',
          ]}
        />
      </Section>
    </Document>
  );
}

export function IntrusionDetection() {
  return (
    <Document
      slug="intrusion-detection"
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
      <Section title="Read with this release">
        <InfrastructureChecks ids={['aws-guardduty', 'aws-finding-alerts', 'aws-flow-logs', 'aws-cloudtrail', 'aws-malware-protection']} />
      </Section>
      <Section title="Verification">
        <p>A sample-finding test in all four regions produced one rule invocation per region and one email delivered to eng@internet.dev per topic, with zero failed notifications. The checks above are read again on the maintainer machine that builds each INTDEV API release, and a read-only control check is also run whenever Vanta reports a change.</p>
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
      slug="encryption-in-transit"
      title="Data transmission encryption"
      summary="INTDEV encrypts confidential and sensitive data whenever it crosses a public network, with TLS between every client, edge, service, database, and processor."
      controls={['Data transmission encrypted']}
      related={[ENCRYPTION_LINK]}
    >
      <Section title="External test">
        <TlsRecord />
        <InfrastructureChecks ids={['tls-hosts', 'tls-certificates', 'aws-https-only']} />
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
            ['Cross-origin payloads between INTDEV sites', `HTTPS. The API key in the payload is also encrypted with the API’s application-layer AES, which is being brought to the Cryptography Policy’s standard under ${APPLICATION_ENCRYPTION.finding}; TLS is the control relied on.`],
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
      slug="network-segmentation"
      title="Network segmentation"
      summary="INTDEV’s networks and environments are separated so that customer data can be reached only by the production services and administrators that need it. The diagram shows the segments and the only paths between them, and the configuration exports below show how each boundary is enforced."
      controls={['Network segmentation implemented']}
    >
      <Section title="Topology">
        <SegmentationDiagram />
      </Section>
      <Section title="Segments">
        <Table
          columns={['Segment', 'Contains', 'Separation']}
          rows={[
            ['Public edge', 'Cloudflare proxy for every hostname', 'Only HTTPS reaches the origins'],
            ['Production services', 'Render web services for the INTDEV API, Users Garden, Terminal Graph, and internet.dev', 'Each service is an isolated container with its own environment secrets. Only the HTTP port is exposed. Pull request previews are off, so no unreviewed copy of a service runs.'],
            ['Production data', 'Render PostgreSQL (INTDEV DATA) in Oregon', 'Separate managed instance. Every connection needs TLS and the database credential, which only the API environment and administrators hold.'],
            ['Object storage', 'S3 buckets for uploads, private attachments, and public assets in us-west-2', 'Separate buckets and prefixes. Private objects are reached only through short-lived presigned URLs. All buckets encrypt at rest (SSE AES-256).'],
            ['AWS account', 'Monitoring only', 'No production workload and no EC2 instances. One default VPC per region, each with flow logs and GuardDuty.'],
            ['Development', 'Engineers’ machines and local databases', 'Policy forbids customer data here. Integration tests use embedded PostgreSQL with synthetic accounts only.'],
          ]}
        />
      </Section>
      <Section title="Configuration export: Render">
        <Group>
          <p>Read from the Render API on November 4, 2026. Addresses are omitted.</p>
          <Table columns={['Resource', 'Region', 'Network exposure', 'Redundancy', 'Previews']} rows={RENDER_NETWORK_EXPORT.map((row) => [row.resource, row.region, row.exposure, row.redundancy, row.previews])} />
        </Group>
      </Section>
      <Section title="Configuration export: AWS VPC security groups">
        <Group>
          <p>Every security group in the four monitored US regions, read with the AWS EC2 API on {formatRecordDay(NETWORK_EXPORTED_AT)} on the maintainer machine that built the INTDEV API release, and compiled into it. Group IDs and named addresses are omitted. Every VPC is the default 172.31.0.0/16 network with one /20 subnet per availability zone.</p>
          <Table columns={['Region', 'Security group', 'Inbound', 'Outbound', 'Attached to']} rows={SECURITY_GROUP_EXPORT.map((row) => [row.region, row.group, row.inbound, row.outbound, row.attached])} />
          <InfrastructureChecks ids={['aws-security-groups']} />
        </Group>
      </Section>
      <Section title="Open items">
        <List
          items={[
            'INTDEV-2026-NET-01: restrict the database allow list to the Render private network and named maintainer addresses (due January 3, 2027).',
            'Review S3 Block Public Access at the account level, keeping exceptions only for the buckets that serve public assets (due January 3, 2027). Tracked with INTDEV-2026-NET-02 until that finding was remediated on November 5, 2026.',
          ]}
        />
        <Links items={[{ label: 'Network firewall review', href: '/compliance/firewall-review' }, { label: 'Service description and network diagram', href: '/compliance/service-description' }]} />
      </Section>
    </Document>
  );
}

export function FirewallReview() {
  return (
    <Document
      slug="firewall-review"
      title="Network firewall review"
      summary="INTDEV reviews its firewall rulesets and network access configuration at least once a year. Required changes are tracked to completion."
      controls={['Network firewalls reviewed']}
    >
      <Section title="2026 review">
        <Fields items={[['Date', 'November 4, 2026'], ['Reviewer', <Member key="reviewer" name="Jimmy Lee" />], ['Scope', 'Cloudflare edge, Render service and database network access, and AWS EC2 security groups and VPCs']]} />
        <Table
          columns={['Ruleset', 'Result', 'Tracked change']}
          rows={[
            ['Cloudflare edge', 'HTTPS only, HTTP redirects, TLS 1.3, legacy TLS refused', 'Add HSTS (INTDEV-2026-HSTS)'],
            ['Render web services', 'Only the service’s HTTP port is exposed, behind Cloudflare', 'None'],
            ['Render PostgreSQL allow list', 'TLS and a credential required; allow list broader than needed', 'INTDEV-2026-NET-01'],
            ['AWS security groups (us-west-2)', 'Legacy groups on stopped instances had rules broader than needed', 'INTDEV-2026-NET-02, remediated November 5, 2026'],
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
      slug="infrastructure-maintenance"
      title="Service infrastructure maintenance"
      summary="Infrastructure that supports the service is patched as routine maintenance and whenever a vulnerability is identified, so that the servers behind it stay hardened."
      controls={['Service infrastructure maintained']}
    >
      <Section title="Who patches what">
        <Table
          columns={['Layer', 'Patched by', 'How']}
          rows={[
            ['Host operating systems, container runtime, and PostgreSQL engine', 'Render (managed platform)', 'Continuous platform maintenance; minor PostgreSQL updates applied by Render'],
            ['Node.js runtime and frameworks (Next.js, React)', 'INTDEV', 'Framework upgrades shipped as tagged releases through CI/CD. Render selects the Node.js version from the service’s NODE_VERSION setting when one is set, and otherwise from the engines range in package.json, which resolves to the newest Node.js release that satisfies it.'],
            ['Application dependencies', 'INTDEV', 'Dependency audit every month and whenever an advisory is published, fixed within SLA. No lockfile is committed, so every Render build installs a fresh resolution of package.json, the same resolution the dependency scan audits. A package pinned to an exact version changes only when package.json does.'],
            ['Vulnerability alerts', 'GitHub and Vanta', 'GitHub Dependabot vulnerability alerts are on for the INTDEV API repository. Vanta reads them and tests that critical, high, medium, and low findings are addressed within their SLAs; all four tests passed on November 5, 2026. The INTDEV API repository had no Dependabot alert, open or closed, when read through the GitHub API on November 6, 2026.'],
            ['Application code', 'INTDEV, with GitHub', 'In the INTDEV API repository, as read through the GitHub API on November 6, 2026, GitHub CodeQL code scanning analyzes every pull request, GitHub Copilot code review reviews it beside the teammate who approves it, and a ruleset blocks a merge that leaves a high or critical CodeQL alert; CodeQL’s first analysis there, on November 6, 2026, found eight, recorded as INTDEV-2026-CODE-01 and INTDEV-2026-CODE-02. Its findings take the same severity deadlines as every other finding.'],
            ['Edge TLS and certificates', 'Cloudflare', 'Automatic certificate issuance and renewal'],
          ]}
        />
      </Section>
      <Section title="Retiring unsupported software">
        <List items={SOFTWARE_RETIREMENT} />
      </Section>
      <Section title="Laptop patch state">
        <Group>
          <p>{`Every team member reruns the device check from Device check in Users Garden at least every ${DEVICE_CHECK_FRESH_DAYS} days, so each laptop’s macOS version and its automatic security update setting are read from macOS at least once a month. The INTDEV API judges each check-in against the supported-macOS rule below, and the compliance report’s device-patch-state check stays open while any current laptop is unpatched. Each monthly vulnerability scan reads this record.`}</p>
          <DevicePatchReport />
        </Group>
      </Section>
      <Section title="INTDEV API software inventory">
        <Group>
          <p>Every package the INTDEV API declares in package.json, what it is used for, the version range declared, and the version installed in the release api.internet.dev is serving when you load this page. The versions are read by the API from its own installed files, not typed here.</p>
          <SoftwareInventoryRecord />
        </Group>
      </Section>
      <Section title="Sample of remediated vulnerabilities">
        <Table
          columns={['Vulnerability', 'System', 'Remediation', 'Released']}
          rows={[
            ['GHSA-wq5f-xc86-pv6w, sharp and librsvg (High)', 'INTDEV API', 'sharp 0.35.4 upgraded to 0.35.5', 'Deployed November 4, 2026 in INTDEV API 2.0.8 (commit 195333d)'],
            ['GHSA-3g3m-2fjr-6pw4 and GHSA-g3hv-75wg-m249, glob and minimatch (Moderate)', 'INTDEV API', 'googleapis ^172 upgraded to ^189', 'Fixed November 4, 2026; ships in INTDEV API 2.0.9'],
            ['Critical React Server Components remote code execution advisory, December 3, 2025', 'Users Garden', 'Next.js upgraded to 16.0.7 (P0 severity patch)', 'Deployed December 5, 2025 (commit 8c17648)'],
            ['Framework currency', 'Users Garden', 'Next.js 16.1.4', 'Deployed February 2, 2026 (commit 7a247eb)'],
          ]}
        />
      </Section>
    </Document>
  );
}

export function VulnerabilityScans() {
  return (
    <Document
      slug="vulnerability-scans"
      title="Vulnerability scanning and remediation"
      summary="INTDEV scans its external-facing systems, dependencies, and cloud configuration every month, defines each severity in writing, and tracks every critical and high vulnerability to remediation."
      controls={['Vulnerabilities scanned and remediated', 'Service infrastructure maintained']}
    >
      <Section title="Q4 2026 scan">
        <ScanRecord />
      </Section>
      <Section title="Vulnerability register">
        <Register />
      </Section>
      <Section title="Severity definitions">
        <Group>
          <Table columns={['Severity', 'CVSS base score', 'Definition', 'Deadline']} rows={SEVERITY_DEFINITIONS.map((level) => [level.severity, level.cvss, level.definition, level.deadline])} />
          <p>{SEVERITY_ASSESSMENT}</p>
        </Group>
      </Section>
      <Section title="SLAs and schedule">
        <List items={['Critical and high: 30 days. Medium: 60 days. Low: 90 days. Informational: as needed.', 'A finding that can’t meet its SLA needs a risk treatment plan and a new date.', 'Scans run every month and after every major change. The scan of November 4, 2026 was the first under this schedule, so the next is due by December 4, 2026. Each scan is added to this record, which becomes the 12-month history of monthly scans.', 'Between scans, GitHub watches every change to INTDEV’s own repositories: CodeQL code scanning analyzes every pull request, GitHub Copilot code review reviews it, and Dependabot alerts when a dependency has a published advisory. These settings cover INTDEV’s own repositories only; a client’s repositories follow the client’s own setup.']} />
      </Section>
    </Document>
  );
}

export function RemediatedVulnerabilities() {
  const remediated = VULNERABILITIES.filter((finding) => finding.state !== 'open').map((finding) => finding.id);
  const treated = VULNERABILITIES.filter((finding) => finding.state === 'open' && finding.treatment).map((finding) => finding.id);
  return (
    <Document
      slug="remediated-vulnerabilities"
      title="Sample of remediated vulnerabilities"
      summary="Proof of INTDEV’s most recent periodic vulnerability scan, every finding it produced, and how each one was remedied, with the high-severity findings first. The same record is served by the INTDEV API, which checks each fix against the release in production."
      controls={['Vulnerabilities scanned and remediated', 'Service infrastructure maintained']}
    >
      <Section title="Most recent periodic scan">
        <ScanRecord />
      </Section>
      <Section title="Remediated findings">
        <Group>
          <p>Each remediated finding with the change that fixed it, the release that shipped it, and how the fix was verified. GHSA-wq5f-xc86-pv6w is the high-severity finding from this scan, and it is live in production.</p>
          <RemediationRecords ids={remediated} />
        </Group>
      </Section>
      <Section title="High-severity findings under a risk treatment plan">
        <Group>
          <p>These high findings cannot be fully remediated yet. Each has an approved risk treatment plan, compensating controls, and management sign-off, as the Operations Security Policy requires for a finding that cannot meet its SLA.</p>
          <RemediationRecords ids={treated} />
        </Group>
      </Section>
      <Section title="All findings">
        <Register />
      </Section>
    </Document>
  );
}

export const SPECIFICATION_SECTIONS: [string, string][] = [
  ['1. Summary', 'The problem, the intended outcome, the client or product it is for, and the engineer who owns the specification.'],
  ['2. Scope', 'What the work includes, and what it deliberately leaves out.'],
  ['3. Design', 'The components, interfaces, and data flows, with a diagram where one helps, and the trust boundaries each flow crosses.'],
  ['4. Data', 'Every kind of data the work reads, stores, or sends; its classification under the Data Management Policy (Confidential, Restricted, or Public); where it is stored, how long it is kept, and how it is deleted. Client data stays where the client’s agreement allows: for Microsoft, only in Microsoft’s systems.'],
  ['5. Security validation', 'The checkpoints below, answered before build and signed off at each checkpoint.'],
  ['6. Testing', 'The tests that prove the work does what it should, including the tests that hold its permission boundaries, and how they run before merge.'],
  ['7. Rollout and rollback', 'How the work reaches production or the client, how it is undone, and what is watched after release.'],
  ['8. Sign-off', 'Each checkpoint’s date and who signed it off, recorded in the pull request that changes the specification.'],
];

export const SECURITY_VALIDATION_QUESTIONS: [string, string][] = [
  ['Threat review', 'What the work protects, who could attack it, its entry points and trust boundaries, and its abuse cases, reviewed for spoofing, tampering, repudiation, information disclosure, denial of service, and elevation of privilege. Each threat names its mitigation, or is accepted by the CISO with a reason.'],
  ['Authentication and authorization', 'Who may call each interface, how they are authenticated, and the check that enforces it on every request. Access is least privilege, identity is never taken from a client-supplied header, and every privileged path requires MFA.'],
  ['Data classification and handling', 'The class of every piece of data, encryption in transit (TLS) and at rest, no client or customer data in development or test environments, and nothing of a client’s kept outside the systems its agreement allows.'],
  ['Secrets', 'Which credentials the work needs and where they live: Render’s environment settings or a git-ignored local file, never source, configuration, issues, or chat. Each secret has an owner and a rotation procedure.'],
  ['Dependencies', 'Each new package and why it is needed, its maintainer and license, and a clean npm audit and Dependabot result for critical and high findings, or an approved risk treatment plan.'],
  ['AI systems', 'Whether any AI system is used to build or run the work, and confirmation that no client Confidential or personal data enters one without the client’s written permission. Microsoft data enters only an AI system Microsoft provides and manages.'],
  ['Logging and incident response', 'What is logged for investigation, confirmation that no secret, password, or unnecessary personal data is logged, and how a failure or suspected incident is reported under the Incident Response Plan.'],
  ['Privacy by design', 'Only the personal data the purpose needs is collected, it is kept only as long as that purpose lasts, and access, correction, and deletion requests can be honored.'],
  ['Security tests', 'The tests and checks that must pass before delivery: permission-boundary tests, input validation tests, CodeQL code scanning with no high or critical alert, secret scanning with no unresolved alert, and any test the threat review calls for.'],
];

export function TechnicalSpecificationTemplate() {
  return (
    <Document
      slug="technical-specification-template"
      title="Technical specification template"
      summary="The template every technical specification for software INTDEV develops follows, Microsoft deliverables included. Its security validation section builds security in by design: it is answered before the work is built, and checked again before merge and before delivery."
      controls={['Development lifecycle established', 'Microsoft Supplier Data Protection Requirements (SSPA)']}
      owner="Jimmy Lee, Chief Executive Officer and CISO"
      appliesTo="Every technical specification for software INTDEV develops, including each deliverable for a client such as Microsoft"
      updated="November 6, 2026"
    >
      <Section title="How it is used">
        <List
          items={[
            'An engineer writes a specification from this template before building any significant change, new system, or client deliverable. The Secure Development Policy’s secure-by-design and privacy-by-design principles apply to everything it describes.',
            'The specification lives with the code it describes, in the same repository. For a Microsoft deliverable, that is Microsoft’s own systems, or the private repository in INTDEV’s GitHub organization that holds INTDEV’s work product until delivery, which holds no Microsoft Personal or Confidential Data. It is never kept anywhere else, and it is handled with that code under the engagement closeout on the client data protection page.',
            'The specification is added and changed through a reviewed pull request, so every change to it records its reason and approver.',
            'A Security Engineer who did not write the specification signs off each checkpoint. Work is not merged or delivered while a checkpoint is open.',
          ]}
        />
      </Section>
      <Section title="Template">
        <Fields items={SPECIFICATION_SECTIONS} />
      </Section>
      <Section title="Security validation">
        <Group>
          <p>Section 5 of every specification answers each question below. An answer of “not applicable” gives the reason.</p>
          <Fields items={SECURITY_VALIDATION_QUESTIONS} />
        </Group>
      </Section>
      <Section title="Checkpoints">
        <Table
          columns={['Checkpoint', 'When', 'What must pass', 'Signed off by']}
          rows={[
            ['Design review', 'Before the work is built', 'Every security validation question answered; every threat has a mitigation or an accepted risk', 'A Security Engineer who is not the author'],
            ['Merge', 'Every pull request', 'Tests passing, permission-boundary tests included; no high or critical CodeQL alert; no unresolved secret scanning alert; the pull request template’s secrets and data handling questions answered; an approving review', 'The approving reviewer, who is never the author'],
            ['Delivery', 'Before release to production or delivery to a client', 'Every security test the specification lists passes; dependencies clean of critical and high findings or under an approved risk treatment plan; the specification updated to match what was built', 'A Security Engineer, and for a client deliverable the engagement lead'],
          ]}
        />
      </Section>
      <Section title="Code scanning">
        <p>In the INTDEV API repository, GitHub CodeQL analyzes every pull request and alerts on flaws before merge, and GitHub Copilot code review reviews it beside the teammate who approves it. Its findings take the severity deadlines on the vulnerability scanning page. Code kept in Microsoft’s systems follows Microsoft’s own scanning.</p>
      </Section>
    </Document>
  );
}
