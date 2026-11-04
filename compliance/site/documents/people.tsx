import Document from '@root/compliance/site/Document';

import type { Person } from '@root/compliance/site/types';

import { API_HOST, AGREEMENT_TEMPLATES, COMPANY, CONTACTS, TEAM } from '@root/compliance/site/facts';
import { EVIDENCE_ENDPOINTS, TRAINING_COURSES } from '@root/compliance/site/records';
import { Fields, Group, Links, List, Mail, Note, Section, Table } from '@root/compliance/site/Blocks';
import { TrainingRoster } from '@root/compliance/site/Evidence';

const LEADERSHIP_TYPES: Record<string, string> = {
  'Jimmy Lee': 'Founder; Chief Executive Officer',
  'Andrew Alimbuyuguen': 'Co-founder, Partner',
};

function staffType(person: Person): string {
  return LEADERSHIP_TYPES[person.name] ?? 'Member of Technical Staff';
}

export function Whistleblower() {
  return (
    <Document
      title="Anonymous whistleblower channel"
      summary="How employees, contractors, customers, and anyone else can report fraud, ethics violations, suspected illegal activity, or retaliation, with or without giving their name."
      controls={['Anonymous whistleblower channel']}
    >
      <Section title="Make a report">
        <Group>
          <p>
            Write to the CEO, Jimmy Lee, at <Mail address={CONTACTS.ceo} />. The Information Security Policy names this as the channel for anonymous reports. The CEO is the only person who reads it.
          </p>
          <List
            items={[
              'To stay anonymous, send from an email address that does not identify you. A new free address works, or a privacy-focused mail service. You do not need to give your name, role, or any way to reach you.',
              'Describe what happened, when, where, who was involved, and how you know. Include documents if you have them. The more specific you are, the more we can act on it.',
              'If you want follow-up questions or an update, reply from the same anonymous address. We will never try to find out who you are.',
              `If your report is about the CEO, send it to ${CONTACTS.security}, which reaches the whole security response team, and say that it concerns the CEO.`,
            ]}
          />
        </Group>
      </Section>
      <Section title="What to report">
        <List items={['Fraud, theft, or misuse of company or customer funds', 'Violations of the Code of Conduct, including harassment and discrimination', 'Suspected violations of law or regulation, including privacy and data protection', 'Misuse of customer data, or a cover-up of a security incident', 'Retaliation against anyone who reported a concern']} />
      </Section>
      <Section title="Our commitments">
        <List
          items={[
            'No retaliation. Anyone who retaliates against a person who reported in good faith is disciplined, up to and including termination.',
            'Confidentiality. Reports and the reporter’s identity, if known, are shared only with people who need them to investigate.',
            'Action. Every report is acknowledged within five business days when a reply address is given, investigated, and closed with a documented outcome.',
            'Internal matters. A report that involves an employee, contractor, vendor, or partner is handled by the CEO directly, as the Incident Response Plan requires.',
          ]}
        />
      </Section>
    </Document>
  );
}

export function BackgroundChecks() {
  return (
    <Document
      title="Employee background checks"
      summary="INTDEV background checks every new employee and partner before granting access to production systems or confidential data, as the Screening section of the Human Resource Security Policy requires."
      controls={['Employee background checks performed']}
    >
      <Section title="Requirements">
        <List
          items={[
            'Checks follow applicable law, and scale with the role, the data the person will access, and the risk.',
            'Checks include criminal history, unless local law prohibits it, along with identity and work authorization.',
            'Contractors with privileged or administrative access to production are checked, or must show evidence of an acceptable check.',
            'No production access is granted until the check and the rest of onboarding are complete.',
          ]}
        />
      </Section>
      <Section title="Record">
        <Table columns={['Team member', 'Position', 'Background check']} rows={TEAM.map((person) => [person.name, staffType(person), 'Completed before access was granted'])} />
        <p>Background check reports are Confidential personnel records, kept for seven years, and available to auditors on request.</p>
      </Section>
    </Document>
  );
}

const CONDUCT = [
  'Be welcoming. INTDEV welcomes people of every background and identity.',
  'Be considerate. Other people use your work, and you depend on theirs.',
  'Be respectful. Disagreement is never an excuse for personal attacks.',
  'No harassment, discrimination, violence or threats, doxing, unwelcome sexual attention, intimidation, stalking, or inappropriate recording.',
  'No weapons at INTDEV events or offices.',
  'Protect confidential information, and follow the Information Security Policy and the Acceptable Use Policy.',
  'Report violations to INTDEV leadership or through the whistleblower channel. Retaliation is prohibited.',
];

export function ContractorCodeOfConduct() {
  return (
    <Document
      title="Code of Conduct for contractors"
      summary="Every INTDEV contractor agreement and statement of work includes, or incorporates by reference, the INTDEV Code of Conduct. The contractor acknowledges it at engagement."
      controls={['Code of Conduct acknowledged by contractors']}
    >
      <Section title="The Code of Conduct, in summary">
        <List items={CONDUCT} />
      </Section>
      <Section title="Clause included in every contractor agreement">
        <Note>
          <p>Conduct. Contractor has received and read the {COMPANY.name} Code of Conduct, Information Security Policy, and Acceptable Use Policy, and agrees that Contractor and anyone acting for Contractor will follow them in all work for INTDEV: online, in person, and in all communication with INTDEV staff and customers. A breach of the Code of Conduct is a material breach of this agreement, and INTDEV may end the engagement immediately.</p>
        </Note>
      </Section>
      <Section title="How it is enforced">
        <List
          items={[
            'The clause is part of the INTDEV statement of work and contractor agreement templates.',
            'No contractor receives access to any system until the signed agreement, including this acknowledgement, is on file, as the Access Control Policy requires.',
            'Signed agreements are kept with the engagement records for the life of the engagement plus seven years.',
          ]}
        />
        <Links items={[...AGREEMENT_TEMPLATES, { label: 'Acceptable Use — Services', href: 'https://txt.dev/wwwjim/intdev-acceptable-use' }, { label: 'Acceptable Use — Office', href: 'https://txt.dev/wwwjim/office-use-agreement' }]} />
      </Section>
    </Document>
  );
}

const CONFIDENTIALITY_CLAUSE = 'Confidentiality. Recipient acknowledges that in the course of the engagement it will have access to confidential and proprietary information of INTDEV and its customers, including business plans, technical specifications, source code, customer data, financial information, and security information. Recipient will keep that information confidential, use it only to perform the engagement, and not disclose it to any third party without INTDEV’s prior written consent. On completion or termination, Recipient will promptly return or destroy all INTDEV materials and certify the destruction on request. These obligations survive termination indefinitely.';

export function ContractorConfidentiality() {
  return (
    <Document
      title="Confidentiality agreements for contractors"
      summary="Contractors sign a confidentiality agreement when they are engaged, before they receive any INTDEV or customer information. It lives in the INTDEV statement of work and contractor agreement, and every invoice repeats the notice."
      controls={['Confidentiality agreement acknowledged by contractors']}
    >
      <Section title="Clause">
        <Note>
          <p>{CONFIDENTIALITY_CLAUSE}</p>
        </Note>
      </Section>
      <Section title="Where it is enforced">
        <Table
          columns={['Document', 'Provision']}
          rows={[
            ['Statement of Work', 'Section 8: 8.1 Confidential Information, 8.2 Non-Disclosure, 8.3 Publicity Restrictions, 8.4 Return of Materials. Section 9 makes sections 7 and 8 survive termination indefinitely.'],
            ['Contractor agreement', 'Section 5, Confidentiality and Intellectual Property'],
            ['Invoices', 'A confidentiality notice limits the invoice to its intended recipient'],
          ]}
        />
        <p>No access is provisioned until the signed agreement is on file. That is a precondition in the Access Control Policy.</p>
        <Links items={AGREEMENT_TEMPLATES} />
      </Section>
    </Document>
  );
}

export function EmployeeConfidentiality() {
  return (
    <Document
      title="Confidentiality agreements for employees"
      summary="Employees and partners sign a confidentiality and intellectual property agreement during onboarding, before they are granted access to any production system."
      controls={['Confidentiality agreement acknowledged by employees']}
    >
      <Section title="Clause">
        <Note>
          <p>Confidentiality. The Employee acknowledges that during employment they will have access to confidential and proprietary information about the Company, its customers, and its operations. The Employee will keep that information confidential and will not disclose it to any third party without the Company’s prior written consent. This obligation continues indefinitely, including after this Agreement ends.</p>
        </Note>
      </Section>
      <Section title="Onboarding record">
        <Table columns={['Team member', 'Type', 'Confidentiality and IP agreement', 'Policies acknowledged']} rows={TEAM.map((person) => [person.name, person.type, 'Signed at onboarding', 'Information Security Policy, Code of Conduct'])} />
        <p>The Human Resource Security Policy requires these agreements, and the Access Control Policy grants no production access until they are signed. Termination does not end the obligation, and departing team members are reminded of it at exit.</p>
        <Links items={[AGREEMENT_TEMPLATES[2] ?? { label: 'Employment agreement template', href: 'https://wireframes.internet.dev/examples/features/employment' }]} />
      </Section>
    </Document>
  );
}

export function PerformanceEvaluations() {
  return (
    <Document
      title="Performance evaluations"
      summary="Every INTDEV employee and partner has a performance review at least once a year with their manager. The review covers job performance, competence in the role, adherence to company policies and the Code of Conduct, and role-specific objectives, including security responsibilities."
      controls={['Performance evaluations conducted']}
    >
      <Section title="Process">
        <List
          ordered
          items={[
            'Each December, the CEO opens a review for every direct report.',
            'The team member writes a self-assessment: work shipped, skills gained, and goals for next year.',
            'The CEO reviews it against delivered work, pull request history, policy adherence, Code of Conduct conduct, and completion of security training.',
            'They meet, agree on objectives for the next year, and both sign the review.',
            'Signed reviews are kept as Confidential personnel records for seven years.',
          ]}
        />
      </Section>
      <Section title="2026 cycle">
        <Table columns={['Team member', 'Manager', 'Review due']} rows={TEAM.filter((person) => person.name !== 'Jimmy Lee').map((person) => [person.name, 'Jimmy Lee', 'December 31, 2026'])} />
        <p>The CEO’s own review is done by the board as part of its annual meeting.</p>
      </Section>
    </Document>
  );
}

const TRAINING_MODULES: [string, string[]][] = [
  ['1. Why it matters', ['INTDEV runs one backend for many products. One leaked key can expose every customer.', 'The PingCAP breach claims of 2026 began with cloud credentials committed to the company’s own repositories and went unnoticed for weeks. Our tabletop exercise shows what that would mean here.']],
  ['2. Credentials and secrets', ['Never commit secrets. Keys belong in Render environment settings or your local .env, which git ignores.', 'Never paste customer credentials or API keys into GitHub Issues, Slack, or email. If a customer sends one, delete it and ask them to rotate it.', 'Use a password manager, a unique password of at least 12 characters, and MFA on GitHub, Google, Render, AWS, Stripe, and Slack.', 'If a secret may have leaked, report it right away. Rotating it fast matters more than blame.']],
  ['3. Phishing and social engineering', ['Check the sender and the link before entering credentials. Render, GitHub, and Google never ask for your password by email.', 'Confirm any unusual request for money, access, or data through a second channel, even if it seems to come from the CEO.', `Forward suspicious messages to ${CONTACTS.security}.`]],
  ['4. Data handling', ['Customer data, PII, credentials, source code, and vulnerability reports are Confidential.', 'Never copy customer data into development or test environments, personal devices, or removable media.', 'Delete customer data when it is no longer needed. Users can delete their own accounts in Users Garden.']],
  ['5. Devices', ['Keep FileVault disk encryption on, use a screen lock of 10 minutes or less, and lock your screen whenever you step away.', 'Keep macOS and browsers updated automatically, and leave XProtect and the firewall on.', 'Use a VPN on public Wi-Fi when you handle Confidential data. Report a lost or stolen device right away.']],
  ['6. Secure development', ['Every production change goes through a reviewed pull request.', 'Check authorization on every route, and never trust client-supplied identity headers.', 'Watch for injection, XSS, CSRF, insecure session IDs, and vulnerable libraries. Fix critical and high findings within 30 days.']],
  ['7. Reporting incidents', [`Email ${CONTACTS.security} with what you saw, when, and where. Act as a good witness and preserve the evidence.`, 'Do not discuss a possible breach outside the response team. The CEO and counsel decide on any notice.']],
];

export function SecurityAwarenessTraining() {
  return (
    <Document
      title="Security awareness training"
      summary="INTDEV’s security awareness and business continuity training, and the signed completion record for every team member. Every employee and every contractor with privileged access completes both within 30 days of hire and every year after, as the Human Resource Security Policy requires."
      controls={['Security awareness training implemented']}
    >
      <Section title="Completion record">
        <TrainingRoster />
      </Section>
      {TRAINING_MODULES.map(([title, points]) => (
        <Section key={title} title={title}>
          <List items={points} />
        </Section>
      ))}
      <Section title="Check your understanding">
        <List
          ordered
          items={[
            'You find an AWS key in a pull request diff. What do you do? Report it to security@internet.dev, have it rotated, and remove it from history. Deleting the line is not enough.',
            'A customer pastes their database password into a support email. What do you do? Delete it, tell them to rotate it, and never store it.',
            'You need production data to debug. What do you do? Don’t copy it. Reproduce the problem with synthetic data, or ask the CTO for an approved, scrubbed exception.',
          ]}
        />
      </Section>
      <Section title="Business continuity and disaster recovery training">
        <List
          items={[
            'Your role when the Incident Manager declares a disaster, and the key contacts the plan names.',
            'The recovery objectives: four hours to restore the INTDEV API and its sign-in (RTO), with at most one hour of data loss (RPO).',
            'The restore procedure: point-in-time recovery of the production database into a new instance, verification, credential rotation, and a ticketed record.',
            'Customer communication: only the CEO sends customer notices, through the status page, the changelog, and email.',
            'The November 4, 2026 tabletop exercise, its findings, and the seven action items every participant signed off on.',
          ]}
        />
      </Section>
      <Section title="Program">
        <Fields
          items={[
            ['Who', 'All employees and partners, plus contractors with administrative or privileged technical access'],
            ['When', 'Within 30 days of hire, then every year'],
            ['Courses', TRAINING_COURSES.map((course) => `${course.title} (version: ${course.version})`).join('; ')],
            ['Evidence', <a key="evidence" href={`${API_HOST}${EVIDENCE_ENDPOINTS.training}`}>{`${API_HOST.replace('https://', '')}${EVIDENCE_ENDPOINTS.training}`}</a>],
            ['How it is recorded', 'Each person signs an acknowledgement of both courses. The record is published by the INTDEV API with each person’s user_id and live account level, so it can be checked against the production system.'],
          ]}
        />
      </Section>
    </Document>
  );
}
