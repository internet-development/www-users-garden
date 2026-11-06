import Document from '@root/compliance/site/Document';

import type { Person } from '@root/compliance/site/types';

import { API_HOST, AGREEMENT_TEMPLATES, COMPANY, CONTACTS, EXECUTIVE, TEAM } from '@root/compliance/site/facts';
import { EVIDENCE_ENDPOINTS, TRAINING_ACKNOWLEDGEMENT, TRAINING_COURSES, VANTA_TRAINING, formatRecordDay } from '@root/compliance/site/records';
import { Fields, Group, Links, List, Mail, Member, Note, Section, Table } from '@root/compliance/site/Blocks';
import { TrainingRoster } from '@root/compliance/site/Evidence';

const LEADERSHIP_TYPES: Record<string, string> = {
  'Jimmy Lee': 'Founder; Chief Executive Officer and Chief Information Security Officer',
  'Andrew Alimbuyuguen': 'Co-founder, Partner',
};

function staffType(person: Person): string {
  return LEADERSHIP_TYPES[person.name] ?? 'Member of Technical Staff';
}

export function Whistleblower() {
  return (
    <Document
      slug="whistleblower"
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
      <Section title="Policy">
        <Group>
          <p>INTDEV’s Whistleblower Policy is the Whistleblower Anonymous Fraud Reporting section of the Information Security Policy: it asks employees and others to raise serious concerns internally, makes reporting violations of the code of ethics or of law everyone’s responsibility, prohibits retaliation, and names direct outreach to the CEO as the channel for anonymous reports. The Code of Conduct’s Reporting Violations section points to the same policy and channel. Both policies are Restricted and available to auditors under NDA.</p>
          <Links items={[{ label: 'Code of Conduct for contractors', href: '/compliance/contractor-code-of-conduct' }, { label: 'Board of directors charter (ethical management survey)', href: '/compliance/board-charter' }]} />
        </Group>
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
      slug="background-checks"
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
        <Table columns={['Team member', 'Position', 'Background check']} rows={TEAM.map((person) => [<Member key="name" name={person.name} />, staffType(person), 'Completed before access was granted'])} />
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
      slug="contractor-code-of-conduct"
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
      slug="contractor-confidentiality"
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
      slug="employee-confidentiality"
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
        <Table columns={['Team member', 'Type', 'Confidentiality and IP agreement', 'Policies acknowledged']} rows={TEAM.map((person) => [<Member key="name" name={person.name} />, person.type, 'Signed at onboarding', 'Information Security Policy, Code of Conduct'])} />
        <p>The Human Resource Security Policy requires these agreements, and the Access Control Policy grants no production access until they are signed. Termination does not end the obligation, and departing team members are reminded of it at exit.</p>
        <Links items={[AGREEMENT_TEMPLATES[2] ?? { label: 'Employment agreement template', href: 'https://wireframes.internet.dev/examples/features/employment' }]} />
      </Section>
    </Document>
  );
}

export function PerformanceEvaluations() {
  return (
    <Document
      slug="performance-evaluations"
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
        <Table columns={['Team member', 'Manager', 'Review due']} rows={TEAM.filter((person) => person.name !== EXECUTIVE).map((person) => [<Member key="name" name={person.name} />, <Member key="manager" name={EXECUTIVE} />, 'December 31, 2026'])} />
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

const UPDATE_COURSE = TRAINING_COURSES.find((course) => course.id === 'security-awareness-2026-update');

const UPDATE_MODULES: [string, string[]][] = [
  [
    '8. Log-in monitoring',
    [
      'Read every new sign-in alert from Google, GitHub, Render, AWS, Stripe, and Slack. Each one names the device and place of the sign-in.',
      'Once a month, and whenever an alert surprises you, review the signed-in devices and sessions of your Google account and your GitHub security log, and sign out any you do not recognize.',
      `A sign-in you did not make is a security incident. Report it to ${CONTACTS.security} at once, sign out every session, change the password, and check that your MFA methods are still yours.`,
      'Repeated MFA prompts you did not ask for mean someone has your password. Never approve one; report it.',
    ],
  ],
  [
    '9. Downloading malicious software',
    [
      'Install software only from the Mac App Store, from identified developers that Gatekeeper accepts, or from the publisher’s own site. Never turn off Gatekeeper or XProtect, and never approve an app macOS warns you about without checking it first.',
      'Open unexpected attachments in a preview, not on your Mac, and never enable macros or run an installer that arrived by email or chat.',
      'Treat code as software you download: check a new npm package’s name, publisher, and install scripts before adding it, because typosquatted and hijacked packages are a common route in. Never run a script piped from the internet unless you have read it.',
      'Install only the browser extensions your work needs. An extension can read every page you open, including Microsoft’s systems.',
      `A known or suspected malware infection is a security incident. Disconnect from the network and report it to ${CONTACTS.security}.`,
    ],
  ],
  [
    '10. Privacy law',
    [
      'The CCPA gives California residents the right to know, delete, and correct the personal information a business holds about them, and to opt out of its sale or sharing. INTDEV never sells or shares personal information.',
      'The GDPR, and its United Kingdom equivalent, protect people in the European Union and the United Kingdom: collect only the personal data a purpose needs, keep it only as long as that purpose lasts, and honor access, correction, and deletion requests.',
      `Send every privacy or deletion request to ${CONTACTS.support}. It is acknowledged within five business days and completed within 30 days, and a security incident that affects personal data is reported to the CEO at once, because customers must hear from INTDEV within 72 hours of confirming it.`,
      'Personal data includes a client’s staff names, emails, and photos in designs and research. It is Confidential and handled like any other client data.',
    ],
  ],
  [
    '11. Contract obligations',
    [
      'Each client agreement says what INTDEV may do with the client’s data. Use it only to perform that engagement, never sell it, and never use it for anything else.',
      'Share client data outside INTDEV only under a contract and with the client’s written permission, and only with the vendors listed in the vendor inventory.',
      'For Microsoft, follow the Microsoft engagement rules on the client data protection page: Microsoft data stays in Microsoft’s systems, arrives only through them over TLS, and enters no AI system without Microsoft’s written permission.',
      'Confidentiality survives the end of an engagement and of your work with INTDEV. When an engagement ends, delete every copy you hold and confirm it in writing under the engagement closeout.',
    ],
  ],
  [
    '12. AI systems',
    [
      'Never enter client or customer Confidential data, personal data, or any secret into an AI system, coding assistants included, unless the client has permitted it in writing. Microsoft data enters only an AI system Microsoft provides and manages, reached through access Microsoft issues.',
      'Anyone who will process Microsoft data in an AI system first completes AI training for their role. Microsoft’s AI Literacy Resources (aka.ms/EUAIAct-AILiteracy) may be used for it.',
      'You are accountable for what an AI system produces. Review generated code in a pull request like any other change, and check generated facts before they reach a client.',
      'AI output can repeat what it was given. Do not paste one client’s material into a tool where another client’s work could see it.',
    ],
  ],
];

export function SecurityAwarenessTraining() {
  return (
    <Document
      slug="security-awareness-training"
      title="Security awareness training"
      summary="INTDEV’s security awareness and business continuity training, and the signed completion record for every team member. Training is taken in Vanta’s employee onboarding, and the INTDEV courses on this page add INTDEV’s own rules. Every employee and every contractor with privileged access completes it within 30 days of hire and every year after, as the Human Resource Security Policy requires."
      controls={['Security awareness training implemented']}
      updated="November 6, 2026"
    >
      <Section title="Completion record">
        <TrainingRoster />
      </Section>
      <Section title="Training in Vanta">
        <p>
          Every team member completes their training in INTDEV’s <a href={VANTA_TRAINING.url}>{VANTA_TRAINING.name}</a>, signed in to Vanta with their own account. It covers most of INTDEV’s training requirements and takes real time to finish. The INTDEV courses below add what is specific to INTDEV: its systems, its incident and recovery procedures, and its customer obligations.
        </p>
        <p>Each person states that they completed their training by signing every course under Training in Users Garden. The INTDEV API records those signatures and publishes them in the completion record above; it does not read Vanta.</p>
      </Section>
      {TRAINING_MODULES.map(([title, points]) => (
        <Section key={title} title={title}>
          <List items={points} />
        </Section>
      ))}
      <Section title="Security awareness update">
        <p>{`Modules 8 to 12 are the ${UPDATE_COURSE?.title.toLowerCase() ?? 'security awareness update'} (${UPDATE_COURSE?.version ?? 'version 2'}). They add the topics Microsoft’s Supplier Data Protection Requirements name for annual training. The CEO approved the course as its owner, and every team member signs it by ${UPDATE_COURSE?.due ? formatRecordDay(UPDATE_COURSE.due) : 'the date the CEO sets'} under Training in Users Garden. The completion record above shows each signature as soon as it is made.`}</p>
      </Section>
      {UPDATE_MODULES.map(([title, points]) => (
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
            ['Where', <a key="vanta" href={VANTA_TRAINING.url}>{VANTA_TRAINING.name}</a>],
            ['Courses', TRAINING_COURSES.map((course) => `${course.title} (version: ${course.version})`).join('; ')],
            ['Evidence', <a key="evidence" href={`${API_HOST}${EVIDENCE_ENDPOINTS.training}`}>{`${API_HOST.replace('https://', '')}${EVIDENCE_ENDPOINTS.training}`}</a>],
            ['How it is recorded', `Each person completes their training in ${VANTA_TRAINING.name} and reads the course on this page, then signs it under Training in the COMPLIANCE sidebar of Users Garden, signed in to their own account. The signature names the course, its exact version, and the time, with the acknowledgement “${TRAINING_ACKNOWLEDGEMENT}” The INTDEV API records it under the person’s user_id, and the completion record and the compliance report show it at once. The November 4, 2026 signatures were confirmed by the CEO. A new version of a course is signed again.`],
            ['Sanctions', 'A team member or contractor who violates INTDEV’s security or privacy policies goes through the progressive disciplinary process of the Human Resource Security Policy, up to and including termination of employment or contract, and can lose system and network privileges immediately.'],
          ]}
        />
      </Section>
    </Document>
  );
}
