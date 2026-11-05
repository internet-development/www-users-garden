import Document from '@root/compliance/site/Document';
import { ArchitectureDiagram } from '@root/compliance/site/NetworkDiagram';

import type { SecurityRole } from '@root/compliance/site/types';

import { Fields, Group, Links, List, Member, Members, People, Section, Table } from '@root/compliance/site/Blocks';
import { AWS_REGIONS, COMPANY, CONTACTS, countWord, EVERY_MEMBER, EVERY_MEMBER_LABEL, EXECUTIVE, FORMER_TEAM, JIMMY_LEE_CV, POLICIES, POLICY_COUNT, POLICY_DATES, PRODUCTS, SECURITY_ROLES, TEAM, TRUST_CENTER, VENDORS } from '@root/compliance/site/facts';
import { findCatalogEntry, TRUST_CENTER_CATEGORIES, TRUST_CENTER_CONTROLS, trustCenterCategoryUrl } from '@root/compliance/site/catalog';

const STAFF = TEAM.filter((person) => person.name !== EXECUTIVE);

const STAFF_NAMES = STAFF.map((person) => person.name);

function Holders(props: { role: SecurityRole }) {
  if (!props.role.holders.startsWith(EVERY_MEMBER)) return <Member name={props.role.holders} />;
  return (
    <>
      {EVERY_MEMBER_LABEL}: <Members names={props.role.members} />
      {props.role.holders.slice(EVERY_MEMBER.length)}
    </>
  );
}

function joinNames(names: string[]): string {
  if (names.length < 3) return names.join(' and ');
  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
}

const CV_LINK = <a href={JIMMY_LEE_CV}>CV (LinkedIn)</a>;

const DIRECTOR = <Member name={EXECUTIVE} />;

const DIRECTORS = (
  <Section title="Directors">
    <Table columns={['Director', 'Position', 'CV']} rows={[[DIRECTOR, 'Director and Chair; Chief Executive Officer and Chief Information Security Officer', CV_LINK]]} />
  </Section>
);

export function SystemDescription() {
  return (
    <Document
      slug="system-description"
      title="System description (SOC 2 Section III)"
      summary={`${COMPANY.name}’s description of the system that provides the INTDEV API, Users Garden, and Terminal Graph, written for Section III of the SOC 2 report.`}
      controls={['SOC 2 system description', 'Service description communicated']}
    >
      <Section title="1. Company overview and services provided">
        <Group>
          <p>{COMPANY.name} (&ldquo;INTDEV&rdquo;) is a frontier design and engineering lab in {COMPANY.headquarters}. It is a {COMPANY.entity}. INTDEV builds and runs its own software products and gives its clients design and engineering capacity.</p>
          <Table columns={['Product', 'Description', 'Hosting']} rows={PRODUCTS.map((product) => [<a key={product.url} href={product.url}>{product.name}</a>, product.description, product.hosting])} />
        </Group>
      </Section>

      <Section title="2. Principal service commitments and system requirements">
        <List
          items={[
            'Security. Customer data is reachable only by the customer’s own API key, their organization’s members within their role, and authorized INTDEV administrators. Passwords are stored only as bcrypt hashes. All public traffic is HTTPS (TLS 1.3 at the Cloudflare edge).',
            'Availability. Production runs on managed infrastructure with recovery objectives of four hours (RTO) and one hour (RPO) for the INTDEV API and its authentication, as defined in the BC/DR plan.',
            'Confidentiality. Customer data is classified Confidential. It is never used in non-production environments, and it is deleted when the customer deletes their account or within 30 days after a contract ends.',
            <>
              Commitments are made to customers in the <a href="https://txt.dev/wwwjim/intdev-terms-of-service">Terms of Service</a>, the <a href="https://txt.dev/wwwjim/intdev-privacy-policy">Privacy Policy</a>, the <a href="/compliance/master-services-agreement">Master Services Agreement</a>, and the public API contract at <a href="https://api.internet.dev/SKILL.md">api.internet.dev/SKILL.md</a>.
            </>,
            `System requirements come from INTDEV’s ${POLICY_COUNT} information security policies, regulatory obligations including CCPA, and contracts with customers and vendors.`,
          ]}
        />
      </Section>

      <Section title="3. Components of the system">
        <Group>
          <Fields
            items={[
              ['Infrastructure', 'Render web services: internet-apis in Oregon, www-users-garden in Ohio, terminalgraph in Oregon, www-internet-v3 (internet.dev) in Ohio. Render-managed PostgreSQL in Oregon. Amazon S3 in us-west-2. Google Cloud Storage for presigned uploads. Cloudflare for DNS and TLS. AWS GuardDuty, EventBridge, SNS, and VPC Flow Logs in four US regions.'],
              ['Software', 'The INTDEV API is a Next.js and TypeScript application. Every route runs inside one wrapper that applies CORS, API-key resolution, per-category rate limits, token accounting, and exception reporting. Data access goes through Knex query helpers, and background adjutant workers run from the same codebase. Users Garden is a Next.js client of the API. Terminal Graph is a signed native macOS application. Every package the INTDEV API depends on, with the version in production, is listed in the software inventory on the service infrastructure maintenance page.'],
              ['People', `${TEAM.length} people: the CEO and ${STAFF.length} Members of Technical Staff. See the organization chart.`],
              ['Data', 'Account data (email, username, password hash, API key, tier), organizations and memberships, credit ledger, orders, licenses, download links, posts and documents, analytics events, slide decks, and uploads. Payment card data is held by Stripe and never stored by INTDEV.'],
              ['Procedures', 'Change management through GitHub pull requests and Render deploys. Access provisioning, quarterly reviews, and deprovisioning within 24 business hours. Incident response, vulnerability management, vendor management, and annual policy review.'],
            ]}
          />
          <ArchitectureDiagram />
        </Group>
      </Section>

      <Section title="4. System boundaries">
        <List
          items={[
            'In scope: the INTDEV API and its data stores, Users Garden, the Terminal Graph accounts, payments, and distribution site, and the GitHub and Render configuration that builds and deploys them.',
            'Out of scope: client engagements delivered on client-owned infrastructure, and other INTDEV sites that do not process customer data.',
            `Subservice organizations, carved out: ${VENDORS.filter((vendor) => vendor.criticality === 'Critical').map((vendor) => vendor.name).join(', ')}. INTDEV relies on their controls for physical security, hardware, and the managed services they operate.`,
          ]}
        />
      </Section>

      <Section title="5. Control environment">
        <Group>
          <p>The CEO owns the information security program and approves every policy. {POLICY_DATES}. Policies are kept in Vanta, reviewed every year, and acknowledged by all personnel. Personnel are background checked, sign confidentiality agreements, and take security awareness training.</p>
          <p>Risk assessment follows the Risk Management Policy, which is based on ISO 27005 and NIST SP 800-30. Risks are scored by likelihood and impact on a 1 to 5 scale, kept in the Vanta risk register, and reviewed at least once a year.</p>
          <p>Monitoring includes GuardDuty findings emailed to {CONTACTS.support} from {AWS_REGIONS.length} AWS regions, VPC Flow Logs kept for 365 days, Render deploy and service logs, an annual penetration test, and dependency vulnerability scans.</p>
          <p>Information and communication run through the public compliance pages, the status page, the changelog, {CONTACTS.support} for support, {CONTACTS.security} for security reports, and the published API contract.</p>
          <p>
            {TRUST_CENTER.operator} tests these controls continuously and publishes them on the <a href={TRUST_CENTER.url}>{TRUST_CENTER.name}</a>. The <a href="/compliance/trust-center">control map</a> links each of its controls to the page that documents it.
          </p>
        </Group>
      </Section>

      <Section title="6. Complementary user entity controls">
        <List
          items={[
            'Customers keep their API keys secret, and regenerate a key in Users Garden if it may have been exposed.',
            'Customers manage who is in their organization and at what role.',
            'Customers decide what data they send to the API, and do not send payment card data except through Stripe.',
            `Customers report suspected misuse of their account to ${CONTACTS.security}.`,
          ]}
        />
      </Section>

      <Section title="7. Complementary subservice organization controls">
        <Table columns={['Subservice organization', 'Controls INTDEV relies on']} rows={[['Render', 'Physical security, host patching, database encryption at rest, backups for point-in-time recovery, and isolation between services'], ['Amazon Web Services', 'S3 durability and encryption at rest, and GuardDuty threat detection'], ['Cloudflare', 'TLS termination, DDoS protection, and DNS integrity'], ['GitHub', 'Access control for source code and audit logs'], ['Stripe', 'PCI DSS Level 1 handling of payment card data']]} />
      </Section>

      <Section title="8. Trust services categories in scope">
        <p>Security (common criteria), Availability, and Confidentiality.</p>
      </Section>

      <Section title="Policies">
        <List items={POLICIES.map((policy) => `${policy.name} (owner: ${policy.owner})`)} />
      </Section>
    </Document>
  );
}

const BRIEFINGS = [
  {
    date: 'November 4, 2026',
    attendees: (
      <>
        <Member name="Jimmy Lee (Director and CEO, presenting)" /> and the entire INTDEV team: <Members names={STAFF_NAMES} />
      </>
    ),
    topics: [
      'Adoption of the thirteen information security policies, version 1.0, effective September 26, 2026',
      'The state of the AWS account: GuardDuty with email alerts and VPC Flow Logs in all four US regions',
      'Results of the disaster recovery and incident response tabletop exercise modeled on the PingCAP breach claims',
      'The vulnerability register: one high-severity dependency fixed, plus open items with remediation plans',
      'Vendor inventory and the annual review of critical vendors: Render, AWS, Cloudflare, GitHub, Stripe',
      'Privacy: self-service account deletion in Users Garden, and the 30-day deletion commitment',
    ],
    direction: [
      'Approved every tabletop action item with its due date, putting credential hardening first',
      'Directed management to narrow database network access, enable GitHub secret scanning, and run a timed backup restore before the end of 2026',
      'Asked for a written follow-up on every open high-severity item at the next briefing',
      'Confirmed that the annual penetration test and the incident response test are both due by November 2027',
    ],
  },
];

export function BoardOversight() {
  return (
    <Document
      slug="board-oversight"
      title="Board oversight briefings"
      summary="Senior management briefs INTDEV’s board of directors at least once a year on the state of the company’s cybersecurity and privacy risk. The board gives feedback and direction, and both are recorded here."
      controls={['Board oversight briefings conducted']}
    >
      {BRIEFINGS.map((briefing) => (
        <Section key={briefing.date} title={`Briefing of ${briefing.date}`}>
          <Group>
            <Fields items={[['Date', briefing.date], ['Attendees', briefing.attendees], ['Presented by', <Member key="presenter" name="Jimmy Lee, Chief Executive Officer" />]]} />
            <p>Topics briefed</p>
            <List items={briefing.topics} />
            <p>Board feedback and direction</p>
            <List items={briefing.direction} />
          </Group>
        </Section>
      ))}
      {DIRECTORS}
      <Section title="Attendance">
        <People people={TEAM} note={() => 'Attended the November 4, 2026 briefing.'} />
      </Section>
      <Section title="Cadence">
        <p>Briefings happen at least once a year, and also after any P0 or P1 incident. The next scheduled briefing is due by November 2027.</p>
      </Section>
    </Document>
  );
}

const CHARTER_EXPERTISE = (
  <Section title="4. Expertise and outside advisers">
    <Group>
      <p>
        Directors must have enough expertise to oversee management’s design, implementation, and operation of information security controls. Jimmy Lee has been early technical and design staff at nine venture-backed startups, leads design at Vmax, is a partner at Mana Management, LLC, and founded INTDEV, where he wrote and approved the company’s security policies and administers its production systems. His CV is on <a href={JIMMY_LEE_CV}>LinkedIn</a>.
      </p>
      <p>The board may engage independent information security experts, auditors, and counsel at the company’s expense whenever it needs expertise it does not have. That includes the annual penetration test and the SOC 2 auditor. The company uses Vanta for continuous control monitoring.</p>
    </Group>
  </Section>
);

const CHARTER_MEETINGS = (
  <Section title="5. Meetings and minutes">
    <List
      items={[
        'The board meets at least once a year, and whenever a director or the CEO calls a meeting.',
        'Minutes are taken at every meeting, approved at the next one, and kept for at least seven years with the company’s records.',
        'The board may act by unanimous written consent, which is filed with the minutes.',
      ]}
    />
  </Section>
);

const BOARD_MINUTES = (
  <Section title="7. Minutes">
    <Group>
      <Fields
        items={[
          ['Meeting', 'Annual meeting of the board, November 4, 2026'],
          [
            'Present',
            <span key="present">
              <Member name="Jimmy Lee (Director)" />. Management and staff in attendance: <Members names={STAFF_NAMES} />
            </span>,
          ],
          ['Agenda', 'Cybersecurity and privacy risk briefing; approval of security policies v1.0; tabletop exercise action items; vendor review'],
          ['Resolutions', 'Ratified the thirteen information security policies. Approved the tabletop action items and the vulnerability remediation plan. Directed that a further briefing follow any P0 or P1 incident.'],
          ['Recorded by', DIRECTOR],
        ]}
      />
      <Links items={[{ label: 'Board oversight briefings', href: '/compliance/board-oversight' }]} />
    </Group>
  </Section>
);

export function BoardCharter() {
  return (
    <Document
      slug="board-charter"
      title="Board of directors charter"
      summary={`The charter of the board of directors of ${COMPANY.name}. It sets out the board’s roles, responsibilities, composition, independence, meetings, and oversight of information security and privacy risk.`}
      controls={['Board of directors charter', 'Board expertise and independence', 'Board meetings and minutes']}
    >
      <Section title="1. Purpose">
        <p>The board oversees management on behalf of the company’s stockholders. That includes strategy, financial integrity, legal and regulatory compliance, and the company’s cybersecurity and privacy risk.</p>
      </Section>
      <Section title="2. Composition and independence">
        <List
          items={[
            'The board has at least one director. It seeks to include at least one director who is independent of management, meaning a director who is not an employee and has no material business relationship with the company.',
            'Directors are elected by the stockholders under the company’s certificate of incorporation, bylaws, and the Delaware General Corporation Law.',
            'Every director discloses conflicts of interest and abstains from any decision where they have one.',
          ]}
        />
        <Table columns={['Director', 'Position', 'Independent of management', 'CV']} rows={[[DIRECTOR, 'Director and Chair; Chief Executive Officer and Chief Information Security Officer', 'No', CV_LINK]]} />
      </Section>
      <Section title="3. Responsibilities">
        <List
          items={[
            'Oversee cyber risk and internal control for information security, privacy, and compliance, as the Information Security Roles and Responsibilities Policy assigns.',
            'Consult with executive leadership on INTDEV’s IT mission and risks, and give guidance that aligns business, IT, and security objectives.',
            'Approve capital spending for information security and privacy programs.',
            'Receive a cybersecurity and privacy risk briefing from senior management at least once a year, and give feedback and direction.',
            'Review the annual risk assessment and approve risk acceptance above the company’s risk appetite.',
            'Hold management accountable for the Code of Conduct and for the absence of retaliation against whistleblowers.',
          ]}
        />
      </Section>
      {CHARTER_EXPERTISE}
      {CHARTER_MEETINGS}
      <Section title="6. Ethical management survey">
        <Table
          columns={['Question', 'Answer']}
          rows={[
            ['Has management defined and communicated standards of integrity and ethical conduct?', 'Yes. The Code of Conduct and the Information Security Policy are acknowledged by every employee and contractor.'],
            ['Is there a channel to report concerns anonymously, without retaliation?', 'Yes. See the whistleblower channel page.'],
            ['Does management consider pressure, incentives, and opportunities for fraud?', 'Yes, under the Human Resource Security Policy and through segregation of duties in the Access Control Policy.'],
            ['Is performance evaluated against conduct and policy adherence?', 'Yes. Annual reviews cover competence, policy adherence, and the Code of Conduct.'],
            ['Does management review cybersecurity and privacy risk with the board?', 'Yes. At least once a year; see board oversight briefings.'],
            ['Are deviations from the Code of Conduct addressed promptly?', 'Yes, through the progressive disciplinary process, up to and including termination.'],
          ]}
        />
      </Section>
      {BOARD_MINUTES}
      <Section title="8. Review">
        <p>The board reviews this charter every year. Adopted November 4, 2026.</p>
      </Section>
    </Document>
  );
}

export function OrganizationChart() {
  return (
    <Document
      slug="organization-chart"
      title="Organization chart"
      summary="INTDEV’s organizational structure and reporting lines, taken from the team published at internet.dev."
      controls={['Organization structure documented']}
    >
      <Section title="Reporting lines">
        <Table
          columns={['Level', 'Role', 'Person', 'Reports to', 'Profile']}
          rows={[
            ['Governance', 'Board of Directors', <Member key="chair" name="Jimmy Lee (Chair)" />, 'Stockholders', CV_LINK],
            ['Executive', 'Chief Executive Officer and Chief Information Security Officer; Privacy Management Lead (Data Protection Officer); acting Chief Technology Officer, Chief Operating Officer, and Security & Compliance Manager', DIRECTOR, 'Board of Directors', CV_LINK],
            ...STAFF.map((person) => ['Technical Staff', `${person.role}; Security Engineer, DevOps, and Privacy Team`, <Member key="person" name={person.name} />, DIRECTOR, <a key="profile" href={person.linkedin}>LinkedIn</a>]),
          ]}
        />
        <p>Each profile is the person’s public LinkedIn page, the same one the team page at <a href="https://internet.dev">internet.dev</a> links to.</p>
      </Section>
      <Section title="Structure">
        <List
          items={[
            'INTDEV is a flat studio. Every Member of Technical Staff reports directly to the CEO, who is also the Chief Information Security Officer.',
            'Every Member of Technical Staff holds the Security Engineer, DevOps, and Privacy Team roles. See roles and responsibilities for each job description.',
            'Product ownership: Caidan Williams leads Terminal Graph. The CEO owns the INTDEV API and Users Garden.',
            'Affiliates: Andrew Valantine, Hailey Elizabeth, Mitchell Ellero, Sah Pham, and Victoria Venturella are independent friends of the studio engaged case by case for photo, video, events, and ATProto work. They are not staff.',
            `Former team members: ${joinNames(FORMER_TEAM.map((person) => person.name))}.`,
          ]}
        />
      </Section>
      <Section title="Team">
        <People people={TEAM} detail={(person) => `${person.type} · ${person.role}${person.joined ? ` · joined ${person.joined}` : ''}`} />
      </Section>
    </Document>
  );
}

export function SecurityTeamStatement() {
  return (
    <Group>
      <p>
        Security and privacy at INTDEV are not a separate department. INTDEV is a small, flat studio, and every Member of Technical Staff is a founder in training who owns the security and privacy of what they build and run. Each one holds the Security Engineer, DevOps, and Privacy Team roles as part of the job. Jimmy Lee, the Chief Executive Officer, is also the Chief Information Security Officer and the Privacy Management Lead (Data Protection Officer), and reports on both to the board every year.
      </p>
      <Table columns={['Role', 'Held by', 'Reports to', 'Policy roles it covers']} rows={SECURITY_ROLES.map((role) => [role.title, <Holders key="holders" role={role} />, role.reportsTo, role.policyRoles])} />
      <p>The policy roles are those of the Information Security Roles and Responsibilities Policy. Every person in these roles signs the confidentiality agreement, is background checked, and completes security awareness training within 30 days of hire and every year after.</p>
    </Group>
  );
}

export function SecurityJobDescriptions() {
  return (
    <>
      {SECURITY_ROLES.map((role) => (
        <Section key={role.title} title={`Job description: ${role.title}`}>
          <Fields
            items={[
              ['Held by', <Holders key="holders" role={role} />],
              ['Reports to', role.reportsTo],
              ['Purpose', role.purpose],
              ['Responsibilities', <List key="responsibilities" items={role.responsibilities} />],
              ['Qualifications', <List key="qualifications" items={role.qualifications} />],
            ]}
          />
        </Section>
      ))}
    </>
  );
}

export function RolesAndResponsibilities() {
  return (
    <Document
      slug="roles-and-responsibilities"
      title="Information security roles and responsibilities"
      summary="Who is responsible for designing, developing, implementing, operating, maintaining, and monitoring INTDEV’s information security and privacy controls, as the Information Security Roles and Responsibilities Policy assigns, with a job description for every key security and privacy role: the CISO, Security Engineers, DevOps, the Privacy Management Lead (Data Protection Officer), and the Privacy Team."
      controls={['Roles and responsibilities specified']}
    >
      <Section title="Role assignments">
        <Table
          columns={['Role', 'Responsibilities', 'Holder']}
          rows={[
            ['Board of Directors', 'Oversight of cyber risk and internal control for security, privacy, and compliance; approves security spending', <Member key="holder" name="Jimmy Lee" />],
            ['Executive Leadership', 'Oversees the risk management program; aligns security posture with mission and risk appetite; the communication path to the board', <Member key="holder" name="Jimmy Lee" />],
            ['Chief Information Security Officer (CISO)', 'Owns the information security program; holds the CTO and Security and Compliance Manager duties below', <Member key="holder" name="Jimmy Lee" />],
            ['Privacy Management Lead (Data Protection Officer)', 'Privacy law, the Privacy Policy, personal data inventory, data subject requests, and privacy incident notice', <Member key="holder" name="Jimmy Lee" />],
            ['Security Engineers, DevOps, and Privacy Team', 'Security in design, code, and review; production operations; protection of personal data. Job descriptions below', 'Every Member of Technical Staff'],
            ['Chief Technology Officer', 'Designs, implements, operates, maintains, and monitors IT security controls; runs IT risk assessments and the risk register; reports risk to leadership every year; owns identity and access management', <Member key="holder" name="Jimmy Lee (acting)" />],
            ['Engineering Lead', 'Security in the software development process; security controls for development and cloud hosting; reviews and approves production changes', <span key="holder">
                <Member name="Jimmy Lee for the INTDEV API and Users Garden" />; <Member name="Caidan Williams for Terminal Graph" />
              </span>],
            ['Security and Compliance Manager', 'Contractual commitments, privacy law (CCPA, GDPR), SOC 2 and ISO 27001 adherence, and security tooling in production', <Member key="holder" name="Jimmy Lee (acting)" />],
            ['Customer Support Lead', 'Customer data retention and deletion; customer support at eng@internet.dev', 'Members of Technical Staff on rotation'],
            ['Systems Owners', 'Confidentiality, integrity, and availability of the systems they own; approve non-standard access and change requests', 'The product owners above'],
            ['CEO', 'Qualified and competent staff; background checks; policy and Code of Conduct acknowledgement; performance and security training', <Member key="holder" name="Jimmy Lee" />],
            ['COO', 'Third-party risk management and review of vendor contracts', <Member key="holder" name="Jimmy Lee (acting)" />],
            ['Employees and contractors', 'Follow policies and the Code of Conduct; report incidents and weaknesses; minimize contractual and regulatory exposure', 'Everyone'],
          ]}
        />
      </Section>
      <Section title="Who holds the security and privacy roles">
        <SecurityTeamStatement />
      </Section>
      <SecurityJobDescriptions />
      <Section title="Job description: Member of Technical Staff">
        <List
          items={[
            'Designs, builds, tests, and operates INTDEV products under the Secure Development Policy.',
            'Opens every production change as a GitHub pull request for review. Never shares credentials. Uses MFA everywhere it is available.',
            'Handles customer data only as the Data Management Policy allows, and never in non-production environments.',
            `Reports security events to ${CONTACTS.security} right away, and serves on the incident response team when engaged.`,
            'Completes security awareness training within 30 days of hire and every year after.',
          ]}
        />
      </Section>
      <Section title="Job description: Chief Executive Officer">
        <List
          items={[
            'Owns the information security program, approves every policy, and briefs the board every year.',
            'Serves as Incident Manager, and with counsel makes breach determinations and approves customer notices.',
            'Approves access requests for production systems, and runs quarterly access reviews.',
            'Owns vendor risk management and the annual review of critical vendors.',
          ]}
        />
      </Section>
    </Document>
  );
}

export function BoardExpertise() {
  return (
    <Document
      slug="board-expertise"
      title="Board expertise and independent advisers"
      summary="INTDEV’s board has the expertise to oversee how management designs, implements, and operates information security controls, and it engages third-party security experts and consultants when it needs to."
      controls={['Board expertise and use of third-party experts']}
    >
      {CHARTER_EXPERTISE}
      <Section title="Composition">
        <Table columns={['Director', 'Position', 'Security oversight expertise', 'CV']} rows={[[DIRECTOR, 'Director and Chair; CEO', `Author and approver of all ${POLICY_COUNT} security policies; administers the AWS account and its GuardDuty, alerting, and flow-log controls; leads incident response`, CV_LINK]]} />
      </Section>
      <Section title="Third parties engaged">
        <List items={['Vanta, for continuous compliance monitoring and the risk register', 'An independent penetration tester, before the SOC 2 observation window closes', 'The SOC 2 auditor', 'Legal counsel, for breach determinations and customer agreements']} />
      </Section>
    </Document>
  );
}

export function BoardMeetings() {
  return (
    <Document
      slug="board-meetings"
      title="Board meetings and minutes"
      summary="INTDEV’s board of directors meets at least once a year and keeps formal minutes. The charter sets out how directors independent of the company are seated."
      controls={['Board meets annually and maintains minutes; independent directors']}
    >
      {DIRECTORS}
      {CHARTER_MEETINGS}
      {BOARD_MINUTES}
      <Section title="Independence">
        <p>The charter calls for at least one director independent of management. The current composition is listed in the charter, and any independent director is added there when seated.</p>
        <Links items={[{ label: 'Board of directors charter', href: '/compliance/board-charter' }, { label: 'Board oversight briefings', href: '/compliance/board-oversight' }]} />
      </Section>
    </Document>
  );
}

export function TrustCenter() {
  const documented = TRUST_CENTER_CONTROLS.filter((control) => control.page).length;
  const only = TRUST_CENTER_CONTROLS.length - documented;
  return (
    <Document
      slug="trust-center"
      title="Trust Center and control map"
      updated={TRUST_CENTER.readAt}
      summary={`INTDEV’s Trust Center is published by ${TRUST_CENTER.operator}, which monitors INTDEV’s security controls continuously. This page maps each control the Trust Center lists to the compliance page that documents it, and names the controls whose only public record is the Trust Center.`}
      controls={[]}
    >
      <Section title="The Trust Center">
        <Group>
          <p>
            The <a href={TRUST_CENTER.url}>{TRUST_CENTER.name}</a> is hosted by {TRUST_CENTER.operator}, the compliance platform that keeps INTDEV’s policies and risk register. {TRUST_CENTER.operator} reads the AWS account through the read-only vanta-auditor role and GitHub’s vulnerability alerts, tests INTDEV’s controls against them continuously, and publishes each control with its current status. It is public and needs no account.
          </p>
          <p>
            On {TRUST_CENTER.readAt} it listed {TRUST_CENTER_CONTROLS.length} controls in {countWord(TRUST_CENTER_CATEGORIES.length)} categories, every one shown as passing, and one public resource: the {TRUST_CENTER.publicResources.join(', ')}. The Trust Center shows the status as of the moment you open it, so read it there rather than from this page.
          </p>
          <Links
            items={[
              { label: 'Trust Center overview', href: TRUST_CENTER.url },
              { label: 'Trust Center controls', href: TRUST_CENTER.controls },
              { label: 'Trust Center resources', href: TRUST_CENTER.resources },
            ]}
          />
        </Group>
      </Section>
      <Section title="How it relates to these pages">
        <Group>
          <p>These pages are the evidence INTDEV publishes itself: policies, procedures, signed records, and live records read from production by the INTDEV API. The Trust Center is {TRUST_CENTER.operator}’s view of the same program. Each page whose control appears on the Trust Center links to it in its Related table.</p>
          <p>
            Of the {TRUST_CENTER_CONTROLS.length} Trust Center controls, {documented} are documented on a page here. For the other {only}, the Trust Center is the public record, and the policies behind them are available to customers and auditors under NDA from {CONTACTS.support}.
          </p>
        </Group>
      </Section>
      {TRUST_CENTER_CATEGORIES.map((category) => {
        const controls = TRUST_CENTER_CONTROLS.filter((control) => control.category === category.id);
        return (
          <Section key={category.id} title={`${category.name} (${controls.length})`}>
            <Table
              columns={['Trust Center control', 'INTDEV record']}
              rows={controls.map((control) => {
                const page = findCatalogEntry(control.page);
                return [
                  <a key="control" href={trustCenterCategoryUrl(category.id)}>{control.name}</a>,
                  page ? <a key="page" href={`/compliance/${page.slug}`}>{page.title}</a> : <a key="page" href={trustCenterCategoryUrl(category.id)}>Trust Center only</a>,
                ];
              })}
            />
          </Section>
        );
      })}
    </Document>
  );
}
