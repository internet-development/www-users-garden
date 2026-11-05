import type { Person, PolicyDocument, SecurityRole, SoftwarePackage, Vendor, Vulnerability } from '@root/compliance/site/types';

export const COMPANY = {
  name: 'Internet Development Studio Company',
  short: 'INTDEV',
  entity: 'Delaware C-Corporation, incorporated November 11, 2023',
  headquarters: 'Seattle, WA',
  website: 'https://internet.dev',
};

export const CONTACTS = {
  support: 'eng@internet.dev',
  security: 'security@internet.dev',
  ceo: 'j@internet.dev',
};

export const PUBLISHED = 'November 4, 2026';

export const COMPLIANCE_HOSTS = ['https://internet.dev', 'https://users.garden'];

export const API_HOST = 'https://api.internet.dev';

const TRUST_CENTER_URL = 'https://app.vanta.com/internet.dev/trust/xltqhb9ptbz0kvdqz27d';

export const TRUST_CENTER = {
  name: 'INTDEV Trust Center',
  operator: 'Vanta',
  url: TRUST_CENTER_URL,
  controls: `${TRUST_CENTER_URL}/controls`,
  resources: `${TRUST_CENTER_URL}/resources`,
  readAt: 'November 5, 2026',
  publicResources: ['Engagement Letter'],
};

export const PRODUCTS = [
  {
    name: 'INTDEV API',
    url: 'https://api.internet.dev',
    description: 'The universal backend for every INTDEV product: accounts, API keys, OAuth (Google, Apple, Bluesky), organizations, credits, payments, uploads, analytics, and documents.',
    hosting: 'Render web service internet-apis (Oregon, us-west) with Render-managed PostgreSQL (Oregon); files in Amazon S3 (us-west-2); edge TLS by Cloudflare.',
    documentation: 'https://api.internet.dev/SKILL.md',
    changelog: '/compliance/changelog',
  },
  {
    name: 'Users Garden',
    url: 'https://users.garden',
    description: 'The only public way to use the INTDEV API: sign in, manage API keys, credits, subscriptions, organizations, and delete your own account.',
    hosting: 'Render web service www-users-garden (Ohio, us-east); calls the INTDEV API over HTTPS; edge TLS by Cloudflare.',
    documentation: '/compliance/documentation',
    changelog: '/compliance/changelog',
  },
  {
    name: 'Terminal Graph',
    url: 'https://terminalgraph.com',
    description: 'INTDEV’s product: a native macOS spatial development environment that puts terminals, browsers, editors, notes, and dataflow connections on one infinite canvas.',
    hosting: 'Signed macOS application distributed through a Sparkle appcast; marketing site, documentation, and changelog on Render web service terminalgraph (Oregon); accounts and payments through the INTDEV API and Stripe.',
    documentation: 'https://terminalgraph.com/docs/',
    changelog: 'https://terminalgraph.com/changelog',
  },
];

const AVATAR = 'https://pbs.twimg.com/profile_images';

export const JIMMY_LEE_CV = 'https://www.linkedin.com/in/jimmyylee/';

export const TEAM: Person[] = [
  { name: 'Jimmy Lee', title: 'Staff Janitor', role: 'Chief Executive Officer and Chief Information Security Officer (CISO); Director; Privacy Management Lead (Data Protection Officer); acting CTO, COO, and Security & Compliance Manager', avatar: `${AVATAR}/2086911496098070528/eV9UzyBw_400x400.jpg`, href: 'https://x.com/wwwjim', linkedin: JIMMY_LEE_CV, joined: 'November 11, 2023', type: 'Founder', userId: 'b997a0b4-abb6-4d05-9d53-d12d4c69ab6d' },
  { name: 'Andrew Alimbuyuguen', title: 'Webmaster', role: 'Member of Technical Staff', avatar: `${AVATAR}/1958569334726668288/GFE8mhKI_400x400.jpg`, href: 'https://x.com/aalimbuyuguen', linkedin: 'https://www.linkedin.com/in/andrew-alimbuyuguen-aa31a3a6/', joined: 'November 11, 2023', type: 'Co-founder, Partner', userId: '52f9fbc7-67c3-41df-8178-15671d3f92e7' },
  { name: 'Elijah Seed Arita', title: 'Webmaster', role: 'Member of Technical Staff', avatar: `${AVATAR}/1890125319224598528/ZILr9OGp_400x400.jpg`, href: 'https://x.com/elijaharita', linkedin: 'https://www.linkedin.com/in/elijah-seed-arita-386a12251/', joined: 'March 6, 2024', type: 'Partner', userId: '82fdbce2-8e8a-4875-ab8c-6880387c4259' },
  { name: 'Caidan Williams', title: 'Webmaster', role: 'Member of Technical Staff; Terminal Graph product lead', avatar: `${AVATAR}/1989080994687991809/CoUHUW0A_400x400.jpg`, href: 'https://x.com/caidanwilliams', linkedin: 'https://www.linkedin.com/in/caidan-williams/', joined: 'June 24, 2025', type: 'Partner', userId: '0f419e87-dbac-4fca-bb5d-42562c8a0825' },
  { name: 'Hannah Suh', title: 'Webmaster', role: 'Member of Technical Staff', avatar: `${AVATAR}/2111650312314638336/qsx-UDAb_400x400.jpg`, href: 'https://x.com/hellohsuh', linkedin: 'https://www.linkedin.com/in/hhsuh/', joined: 'June 24, 2025', type: 'Partner', userId: '9832d912-5afc-4f44-8a49-85028eefadb3' },
  { name: 'Sol Ruck', title: 'Webmaster', role: 'Member of Technical Staff', avatar: `${AVATAR}/2090924616269414400/q7qc0FcP_400x400.jpg`, href: 'https://x.com/solruck', linkedin: 'https://www.linkedin.com/in/solruck/', joined: null, type: 'Member of Technical Staff', userId: '28769d62-01a0-4e2b-8cf4-5c31e5e407f5' },
  { name: 'Vani Agarwal', title: 'Webmaster', role: 'Member of Technical Staff', avatar: `${AVATAR}/1953144649725431808/fbHIGXnV_400x400.jpg`, href: 'https://x.com/vaniagrwall', linkedin: 'https://www.linkedin.com/in/vaniagarwal-/', joined: 'September 16, 2026', type: 'Employee', userId: 'f9548b4b-281d-4052-9d3c-f4a369bef6c2' },
  { name: 'Rishav Kundu', title: 'Webmaster', role: 'Member of Technical Staff', avatar: 'https://osoi4zg5m42do5ig.public.blob.vercel-storage.com/rishav.avif', href: 'https://github.com/rishavkundu', linkedin: 'https://www.linkedin.com/in/riskun/', joined: 'October 5, 2026', type: 'Employee', userId: '9eecc6aa-0e96-4388-abab-63b787142634' },
];

export const FORMER_TEAM = [
  { name: 'Anastasiya Uraleva', type: 'Co-founder, Partner', joined: 'November 11, 2023', left: 'July 11, 2026', userId: 'b8abafa4-6c7b-4e6c-9db2-ab146ecfaaad' },
  { name: 'Chenyu Huang', type: 'Partner', joined: 'January 15, 2025', left: 'Before February 1, 2026, having joined Discord; exact date not recorded', userId: 'fa784f8d-5410-4f51-8dd1-4c6afb7d22a1' },
  { name: 'Louanne Murphy', type: 'Team member', joined: 'March 12, 2026 (account created)', left: 'Offboarding recorded November 4, 2026', userId: '3b1bda59-6474-4cb4-9883-63772d575992' },
  { name: 'Xiangan He', type: 'Team member', joined: 'January 4, 2024 (account created)', left: 'April 2025, having quit; exact day not recorded', userId: '729f61e8-085e-4954-b5e6-06047a8cb029' },
];

const TEAM_BY_NAME = new Map(TEAM.map((person) => [person.name, person]));

export function teamMember(text: string): Person | null {
  const exact = TEAM_BY_NAME.get(text);
  if (exact) return exact;
  return TEAM.find((person) => text.startsWith(`${person.name},`) || text.startsWith(`${person.name} (`) || text.startsWith(`${person.name} `)) ?? null;
}

export const EXECUTIVE = 'Jimmy Lee';

const TECHNICAL_STAFF = TEAM.filter((person) => person.name !== EXECUTIVE).map((person) => person.name);

export const EVERY_MEMBER_LABEL = 'Every Member of Technical Staff';

export const EVERY_MEMBER = `${EVERY_MEMBER_LABEL}: ${TECHNICAL_STAFF.join(', ')}`;

const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];

export function countWord(count: number): string {
  return NUMBER_WORDS[count] ?? String(count);
}

export const POLICIES: PolicyDocument[] = [
  { name: 'Information Security Policy (including Acceptable Use)', owner: 'CEO', file: 'information-security-policy-aup.pdf' },
  { name: 'Access Control Policy', owner: 'CEO', file: 'access-control-policy.pdf' },
  { name: 'Asset Management Policy', owner: 'Chief Technology Officer', file: 'asset-management-policy.pdf' },
  { name: 'Business Continuity and Disaster Recovery Plan', owner: 'Chief Technology Officer', file: 'business-continuity-and-disaster-recovery-plan.pdf' },
  { name: 'Code of Conduct', owner: 'CEO', file: 'code-of-conduct.pdf' },
  { name: 'Cryptography Policy', owner: 'CEO', file: 'cryptography-policy.pdf' },
  { name: 'Data Management Policy', owner: 'CEO', file: 'data-management-policy.pdf' },
  { name: 'Human Resource Security Policy', owner: 'Chief Executive Officer', file: 'human-resource-security-policy.pdf' },
  { name: 'Incident Response Plan', owner: 'CEO', file: 'incident-response-plan.pdf' },
  { name: 'Information Security Roles and Responsibilities Policy', owner: 'CEO', file: 'information-security-roles-and-responsibilities.pdf' },
  { name: 'Operations Security Policy', owner: 'CEO', file: 'operations-security-policy.pdf' },
  { name: 'Physical Security Policy', owner: 'CEO', file: 'physical-security-policy.pdf' },
  { name: 'Risk Management Policy', owner: 'Chief Executive Officer', file: 'risk-management-policy.pdf' },
  { name: 'Secure Development Policy', owner: 'CEO', file: 'secure-development-policy.pdf' },
  { name: 'Third-Party Management Policy', owner: 'CEO', file: 'third-party-management-policy.pdf' },
];

export const POLICY_COUNT = countWord(POLICIES.length);

export const SECURITY_ROLES: SecurityRole[] = [
  {
    title: 'Chief Information Security Officer (CISO)',
    holders: `${EXECUTIVE}, who is also Chief Executive Officer`,
    members: [EXECUTIVE],
    reportsTo: 'Board of Directors',
    policyRoles: 'Executive Leadership, CTO, and Security and Compliance Manager',
    purpose: 'Owns INTDEV’s information security program and is accountable for the confidentiality, integrity, and availability of every INTDEV system and all customer data.',
    responsibilities: [
      `Writes and approves the ${POLICY_COUNT} information security policies, reviews them every year, and makes sure every team member acknowledges them.`,
      'Runs the risk management program: the annual risk assessment, the Vanta risk register, risk treatment plans and their sign-off, and the annual cybersecurity and privacy briefing to the board.',
      'Sets the security architecture and control requirements for the INTDEV API, Users Garden, Terminal Graph, AWS, Render, and Cloudflare, and monitors them through GuardDuty alerts, VPC Flow Logs, release scans, the device check, and Vanta.',
      'Approves privileged access, runs the quarterly access review, and closes every termination checklist.',
      'Serves as Incident Manager under the Incident Response Plan, makes breach determinations with counsel, and approves customer and regulator notices.',
      'Owns vulnerability management (SLAs, quarterly scans, and the annual penetration test) and the security review of critical vendors.',
      'Runs security awareness training and keeps its completion records, and is the contact for auditors, law enforcement, and counsel.',
    ],
    qualifications: [
      'Experience designing, building, and operating production internet services and their cloud infrastructure',
      'Working knowledge of SOC 2, ISO 27001, NIST SP 800-30, and privacy law, including the CCPA and the GDPR',
      'Authority to stop a release, revoke access, or take a system offline to protect customers',
    ],
  },
  {
    title: 'Security Engineer',
    holders: EVERY_MEMBER,
    members: TECHNICAL_STAFF,
    reportsTo: 'Chief Information Security Officer',
    policyRoles: 'Engineering Lead and Systems Owners',
    purpose: 'Builds security into everything INTDEV ships, and finds and fixes weaknesses before they reach customers.',
    responsibilities: [
      'Designs every feature with authentication, authorization, input validation, and least privilege from the start, following the Secure Development Policy.',
      'Opens every production change as a GitHub pull request, and reviews teammates’ changes for security as well as correctness.',
      'Keeps secrets out of source code, uses only the cryptography the Cryptography Policy approves, and never weakens a security control without the CISO’s approval.',
      'Writes and maintains the tests that hold permission boundaries and other security behavior in place.',
      'Audits dependencies and fixes vulnerabilities within the SLAs: critical and high within 30 days, medium within 60, and low within 90.',
      'Remediates penetration test and scan findings in the code they own, and records the evidence.',
    ],
    qualifications: [
      'Proficiency in TypeScript, Node.js, and web application security, including the OWASP Top 10',
      'Security awareness training within 30 days of hire and every year after',
      'MFA on GitHub, Render, AWS, Google, and every other company account that offers it',
    ],
  },
  {
    title: 'DevOps (production operations)',
    holders: `${EVERY_MEMBER}. Platform admin access is held only as approved in the access register.`,
    members: TECHNICAL_STAFF,
    reportsTo: 'Chief Information Security Officer',
    policyRoles: 'Engineering Lead and Systems Owners, and the operation and monitoring of IT security controls',
    purpose: 'Keeps production available, patched, and monitored, and changes it only through reviewed and audited paths.',
    responsibilities: [
      'Deploys only through GitHub pull requests and Render CI/CD, and never changes production by hand outside an approved change.',
      'Keeps environment secrets only in Render and in git-ignored local files, and rotates any secret that may have been exposed.',
      `Monitors deploys, the status page, release scans, and the GuardDuty alerts sent to ${CONTACTS.support}, and serves on the incident response team when engaged.`,
      'Patches the Node.js runtime, frameworks, and dependencies, and keeps network rules in Cloudflare, Render, and AWS under change management.',
      'Verifies backups, and takes part in the restore test and the business continuity tabletop exercise.',
      'Keeps every laptop used for INTDEV work encrypted with FileVault, and reports it through the device check at least every 30 days.',
    ],
    qualifications: [
      'Experience operating Render, PostgreSQL, Amazon S3, and Cloudflare, or equivalent platforms',
      'Business continuity and disaster recovery training',
      'Access granted through the access request process, at the least privilege the work needs',
    ],
  },
  {
    title: 'Privacy Management Lead (Data Protection Officer)',
    holders: `${EXECUTIVE}, who is also CISO`,
    members: [EXECUTIVE],
    reportsTo: 'Board of Directors',
    policyRoles: 'Security and Compliance Manager (privacy law) and Customer Support Lead (retention and deletion)',
    purpose: 'Accountable for how INTDEV collects, uses, keeps, and deletes personal data, and for compliance with privacy law and customer contracts.',
    responsibilities: [
      'Owns the Privacy Policy and the privacy commitments in the Terms of Service and the Master Services Agreement.',
      'Keeps INTDEV compliant with the CCPA, the GDPR where it applies, and every contractual privacy obligation.',
      'Keeps the inventory and classification of personal data and the list of subprocessors current.',
      'Makes sure access, correction, and deletion requests are answered on time, and that customer data is deleted within 30 days of a contract ending.',
      'Reviews new features and vendors that process personal data before they launch.',
      'Leads the privacy side of incident response, including notice to affected customers within 72 hours of confirming a security incident that affects their data, and to regulators where the law requires it.',
    ],
    qualifications: [
      'Working knowledge of the CCPA, the GDPR, and data protection by design',
      'Authority to block the launch of a feature or vendor that does not meet the Privacy Policy',
    ],
  },
  {
    title: 'Privacy Team member',
    holders: EVERY_MEMBER,
    members: TECHNICAL_STAFF,
    reportsTo: 'Privacy Management Lead',
    policyRoles: 'Customer Support Lead (on rotation) and the duties of all employees and contractors',
    purpose: 'Protects personal data in everything they build and in every request they handle.',
    responsibilities: [
      'Collects only the personal data a feature needs, and handles it only as the Data Management Policy allows.',
      'Never copies customer data into development, test, or local environments, or onto removable media.',
      `Answers privacy and deletion requests sent to ${CONTACTS.support} on the Customer Support Lead rotation: acknowledged within five business days and completed within 30 days.`,
      'Respects each user’s choices, such as email exemptions and SMS consent, in the code they write.',
      `Reports a suspected privacy incident or data exposure to ${CONTACTS.security} right away.`,
    ],
    qualifications: ['Security awareness training, which covers data handling', 'A signed confidentiality agreement'],
  },
];


export const POLICY_APPROVAL = { version: '1.0', approved_by: 'Jimmy Lee, Chief Executive Officer', approved_at: '2026-09-08', effective_at: '2026-09-26', classification: 'Restricted', access: 'Available to customers and auditors under NDA from eng@internet.dev' };

export const POLICY_DATES = `Version ${POLICY_APPROVAL.version}, approved by Jimmy Lee (CEO) on September 8, 2026, effective September 26, 2026`;

export const VENDORS: Vendor[] = [
  { name: 'Render', service: 'Application hosting, CI/CD, and managed PostgreSQL for the INTDEV API, Users Garden, and the Terminal Graph site', criticality: 'Critical', data: 'All customer data at rest in PostgreSQL; application logs', owner: 'Jimmy Lee', terms: 'https://render.com/terms', privacy: 'https://render.com/privacy', security: 'https://render.com/security' },
  { name: 'Amazon Web Services', service: 'S3 file storage (us-west-2), GuardDuty, VPC Flow Logs, CloudWatch, SNS', criticality: 'Critical', data: 'User uploads, private slide and analytics attachments, security logs', owner: 'Jimmy Lee', terms: 'https://aws.amazon.com/agreement/', privacy: 'https://aws.amazon.com/privacy/', security: 'https://aws.amazon.com/compliance/' },
  { name: 'Cloudflare', service: 'DNS, TLS termination, and proxy for every public hostname', criticality: 'Critical', data: 'Traffic in transit; request metadata', owner: 'Jimmy Lee', terms: 'https://www.cloudflare.com/terms/', privacy: 'https://www.cloudflare.com/privacypolicy/', security: 'https://www.cloudflare.com/trust-hub/' },
  { name: 'GitHub', service: 'Source control, pull request review, and the commit trigger for Render deploys', criticality: 'Critical', data: 'Source code; no customer data', owner: 'Jimmy Lee', terms: 'https://docs.github.com/en/site-policy/github-terms/github-terms-of-service', privacy: 'https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement', security: 'https://github.com/security' },
  { name: 'Stripe', service: 'Subscriptions, marketplace checkout, and card payments', criticality: 'Critical', data: 'Payment card data (held by Stripe, never by INTDEV), customer email', owner: 'Jimmy Lee', terms: 'https://stripe.com/legal/ssa', privacy: 'https://stripe.com/privacy', security: 'https://docs.stripe.com/security' },
  { name: 'Google', service: 'Google Workspace email, Google sign-in (OAuth), Google Cloud Storage presigned uploads', criticality: 'High', data: 'Staff email; OAuth identity (email, name); uploaded files', owner: 'Jimmy Lee', terms: 'https://cloud.google.com/terms', privacy: 'https://policies.google.com/privacy', security: 'https://cloud.google.com/security/compliance' },
  { name: 'Mailgun', service: 'Transactional email (verification, receipts, notices)', criticality: 'High', data: 'Recipient email address and message content', owner: 'Jimmy Lee', terms: 'https://www.mailgun.com/legal/terms/', privacy: 'https://www.mailgun.com/legal/privacy-policy/', security: 'https://www.mailgun.com/security/' },
  { name: 'Twilio', service: 'Consent-based SMS for Users Garden', criticality: 'Moderate', data: 'Phone number and consent evidence', owner: 'Jimmy Lee', terms: 'https://www.twilio.com/en-us/legal/tos', privacy: 'https://www.twilio.com/en-us/legal/privacy', security: 'https://www.twilio.com/en-us/security' },
  { name: 'Apple', service: 'Sign in with Apple and App Store in-app purchase verification', criticality: 'Moderate', data: 'OAuth identity; purchase receipts', owner: 'Jimmy Lee', terms: 'https://www.apple.com/legal/internet-services/terms/site.html', privacy: 'https://www.apple.com/legal/privacy/', security: 'https://www.apple.com/legal/privacy/' },
  { name: 'Bluesky (AT Protocol)', service: 'Bluesky sign-in (AT Protocol OAuth)', criticality: 'Moderate', data: 'OAuth identity (handle, DID)', owner: 'Jimmy Lee', terms: 'https://bsky.social/about/support/tos', privacy: 'https://bsky.social/about/support/privacy-policy', security: 'https://bsky.social/about/support/privacy-policy' },
  { name: 'Slack', service: 'Internal communication and incident war room', criticality: 'Moderate', data: 'Restricted internal communication', owner: 'Jimmy Lee', terms: 'https://slack.com/terms-of-service', privacy: 'https://slack.com/trust/privacy/privacy-policy', security: 'https://slack.com/trust' },
  { name: 'Vanta', service: 'Compliance automation, policy management, risk register, and read-only AWS monitoring', criticality: 'Moderate', data: 'Configuration metadata; policy documents', owner: 'Jimmy Lee', terms: 'https://www.vanta.com/legal', privacy: 'https://www.vanta.com/legal/privacy', security: 'https://www.vanta.com/security' },
];

export const VENDOR_REVIEW = {
  critical: { last: 'November 4, 2026', outcome: 'Approved. Agreement, security documentation, and service performance reviewed.', next: 'November 2027' },
  others: 'High and Moderate vendors are reviewed when their contract renews, or at least every two years, and sooner after any material change or incident.',
};

export const PUBLIC_TERMS = [
  { label: 'Terms of Service — all INTDEV products, services, and open source', href: 'https://txt.dev/wwwjim/intdev-terms-of-service' },
  { label: 'Privacy Policy — all INTDEV products, services, and open source', href: 'https://txt.dev/wwwjim/intdev-privacy-policy' },
  { label: 'Acceptable Use — Services', href: 'https://txt.dev/wwwjim/intdev-acceptable-use' },
  { label: 'Acceptable Use — Office', href: 'https://txt.dev/wwwjim/office-use-agreement' },
  { label: 'Terminal Graph Terms of Service', href: 'https://terminalgraph.com/terms' },
  { label: 'Terminal Graph Privacy Policy', href: 'https://terminalgraph.com/privacy' },
  { label: 'Terminal Graph Acceptable Use', href: 'https://terminalgraph.com/acceptable-use' },
];

export const AGREEMENT_TEMPLATES = [
  { label: 'Statement of Work template (section 8, Confidentiality and Non-Disclosure)', href: 'https://wireframes.internet.dev/examples/features/statement-of-work' },
  { label: 'Invoice template (confidentiality notice)', href: 'https://wireframes.internet.dev/examples/features/invoices' },
  { label: 'Employment and contractor agreement template (section 5, Confidentiality and Intellectual Property)', href: 'https://wireframes.internet.dev/examples/features/employment' },
];

export const AWS_REGIONS = ['us-east-1', 'us-east-2', 'us-west-1', 'us-west-2'];

export const API_MANIFEST = 'package.json in GitHub internet-development/apis';

export const API_SOFTWARE: SoftwarePackage[] = [
  { name: 'next', scope: 'production', purpose: 'Web framework and production server for the API routes and the OAuth sign-in pages' },
  { name: 'react', scope: 'production', purpose: 'Renders the OAuth sign-in, account transfer, and verification pages' },
  { name: 'react-dom', scope: 'production', purpose: 'Server rendering for those pages, required by Next.js' },
  { name: 'knex', scope: 'production', purpose: 'SQL query builder behind every database query helper and migration' },
  { name: 'pg', scope: 'production', purpose: 'PostgreSQL driver for the TLS connection to INTDEV DATA' },
  { name: 'bcrypt', scope: 'production', purpose: 'Password hashing' },
  { name: 'stripe', scope: 'production', purpose: 'Subscriptions, marketplace and guest checkout, and the Stripe webhook' },
  { name: '@aws-sdk/client-s3', scope: 'production', purpose: 'Amazon S3 uploads, download clones, and deletion' },
  { name: '@aws-sdk/s3-request-presigner', scope: 'production', purpose: 'Short-lived presigned S3 URLs' },
  { name: '@aws-sdk/s3-presigned-post', scope: 'production', purpose: 'Presigned POST uploads for private slide images; pinned to an exact version' },
  { name: 'googleapis', scope: 'production', purpose: 'Google sign-in: the OAuth2 client and the People API profile read' },
  { name: '@atproto/oauth-client-node', scope: 'production', purpose: 'Bluesky sign-in over AT Protocol OAuth' },
  { name: '@atproto/api', scope: 'production', purpose: 'Reads the Bluesky account’s confirmed email after sign-in' },
  { name: '@atproto/jwk-jose', scope: 'production', purpose: 'Key handling for the AT Protocol OAuth client, which also depends on it; no INTDEV code imports it directly' },
  { name: 'dotenv', scope: 'production', purpose: 'Loads local environment files for the database client, migrations, and scripts' },
  { name: 'puppeteer', scope: 'production', purpose: 'Headless Chrome for slide exports (HTML, PDF, PNG) and the price-from-URL worker' },
  { name: 'sharp', scope: 'production', purpose: 'Image processing for slide images; pinned to an exact version for GHSA-wq5f-xc86-pv6w' },
  { name: 'typescript', scope: 'development', purpose: 'Type checking' },
  { name: 'vitest', scope: 'development', purpose: 'The unit specs (npm test) and the integration suites' },
  { name: 'embedded-postgres', scope: 'development', purpose: 'A temporary PostgreSQL server for the integration suites, which use synthetic accounts only' },
  { name: 'ts-node', scope: 'development', purpose: 'Runs the TypeScript scripts and workers' },
  { name: 'tsconfig-paths', scope: 'development', purpose: 'Resolves the repository’s import aliases for scripts and workers' },
  { name: '@types/node', scope: 'development', purpose: 'Node.js type definitions' },
  { name: '@types/react', scope: 'development', purpose: 'React type definitions' },
  { name: 'baseline-browser-mapping', scope: 'development', purpose: 'Keeps the browser compatibility data used by the Next.js build current' },
];

export const VULNERABILITIES: Vulnerability[] = [
  {
    id: 'GHSA-wq5f-xc86-pv6w',
    component: 'sharp (direct dependency of the INTDEV API)',
    severity: 'High',
    found: 'November 4, 2026',
    status: 'Remediated November 4, 2026, live in INTDEV API 2.0.8',
    state: 'remediated',
    fixed_in: '2.0.8',
    action: 'Pinned sharp to 0.35.5, which bundles the patched librsvg (CVE-2026-96889). The exact version is pinned in package.json, so every Render build installs the fix.',
    evidence: [
      { label: 'Change', detail: 'package.json pins "sharp": "0.35.5" (previously 0.35.4), reviewed and merged to main in GitHub internet-development/apis' },
      { label: 'Release', detail: 'INTDEV API 2.0.8, commit 195333d, Render deploy dep-dbl7rd9srm7s73fm9te0 (auto-deploy on commit), live November 4, 2026 00:38 UTC', href: '/compliance/ci-cd' },
      { label: 'Verification', detail: 'A fresh production resolution of package.json was audited after the release. GHSA-wq5f-xc86-pv6w is no longer reported.' },
    ],
  },
  {
    id: 'GHSA-3g3m-2fjr-6pw4',
    component: 'glob 10.x through rimraf and googleapis-common (googleapis ^172)',
    severity: 'Moderate',
    found: 'November 4, 2026',
    status: 'Fixed November 4, 2026 in INTDEV API 2.0.9',
    state: 'fixed_pending_release',
    fixed_in: '2.0.9',
    action: 'Upgraded googleapis from ^172 to ^189, whose googleapis-common no longer depends on rimraf or glob. The API uses googleapis only for the Google OAuth2 client and the People API profile read, and both are unchanged in 189.',
    evidence: [
      { label: 'Change', detail: 'package.json "googleapis": "^172.0.0" changed to "^189.0.0"; the INTDEV API test suite passes on 189.0.0' },
      { label: 'Verification', detail: 'npm audit of a fresh production resolution (googleapis 189.0.0) reports no glob advisory' },
      { label: 'Release', detail: 'Ships in INTDEV API 2.0.9. This page reports it live when api.internet.dev serves 2.0.9 or later.', href: '/compliance/ci-cd' },
    ],
  },
  {
    id: 'GHSA-g3hv-75wg-m249',
    component: 'minimatch 9.x through the same googleapis chain',
    severity: 'Moderate',
    found: 'November 4, 2026',
    status: 'Fixed November 4, 2026 in INTDEV API 2.0.9',
    state: 'fixed_pending_release',
    fixed_in: '2.0.9',
    action: 'Resolved by the same googleapis 189 upgrade.',
    evidence: [
      { label: 'Change', detail: 'Same googleapis upgrade as GHSA-3g3m-2fjr-6pw4' },
      { label: 'Verification', detail: 'npm audit of a fresh production resolution reports no minimatch advisory' },
    ],
  },
  {
    id: 'GHSA-mrhx-c7xc-m3w5',
    component: 'zod 3.x, through 15 @atproto packages used for Bluesky sign-in',
    severity: 'High',
    found: 'November 4, 2026',
    status: 'Open, risk treatment plan approved November 4, 2026',
    state: 'open',
    fixed_in: null,
    action: 'No fixed zod 3 release exists, and every current @atproto release still requires zod ^3.23.8. The advisory is memory exhaustion while validating oversized collections. The affected code parses OAuth metadata and DID documents returned by identity servers during Bluesky sign-in, not arbitrary customer input.',
    evidence: [
      { label: 'Upstream check', detail: 'npm registry, November 4, 2026: @atproto/oauth-client-node 0.5.13 and its @atproto dependencies still declare zod ^3.23.8' },
      { label: 'Verification', detail: 'npm audit of a fresh production resolution: 16 package entries, all from this one advisory' },
    ],
    treatment: {
      likelihood: 2,
      impact: 2,
      treatment: 'Mitigate now with compensating controls; remediate by upgrading @atproto as soon as a release moves to zod 4.6.6 or later',
      compensating_controls: [
        'The API runs as two Render instances, so one exhausted process does not take the service down; Render restarts it',
        'Only identity-server responses reach the vulnerable parser; customer request bodies do not',
        'npm audit runs against a fresh production resolution every week until the advisory clears',
      ],
      target: 'Within 30 days of an @atproto release on zod 4.6.6 or later; plan reviewed December 4, 2026',
      review: 'December 4, 2026',
      approved_by: 'Jimmy Lee, Chief Executive Officer and Director',
      approved_at: '2026-11-04',
      ratified: 'Board resolution of November 4, 2026 approving the vulnerability remediation plan',
    },
  },
  {
    id: 'INTDEV-2026-CRYPTO-01',
    component: 'INTDEV API credential storage and cross-origin payload encryption',
    severity: 'High',
    found: 'November 4, 2026',
    status: 'Open, risk treatment plan approved November 4, 2026',
    state: 'open',
    fixed_in: null,
    action: 'Identified during the November 2026 tabletop exercise. Bring stored credentials and the cross-origin encryption scheme to the Cryptography Policy standard. The change is coordinated with every consuming site because the scheme is shared across origins. Details are Confidential under the Data Management Policy and are available to auditors on request.',
    evidence: [
      { label: 'Source', detail: 'Tabletop exercise of November 4, 2026, action item 1', href: '/compliance/tabletop-exercise' },
      { label: 'Plan', detail: 'Remediation sequenced with users.garden, txt.dev, and payments.internet.dev so no consuming site breaks' },
    ],
    treatment: {
      likelihood: 2,
      impact: 4,
      treatment: 'Mitigate: harden credential storage and replace the cross-origin scheme in a coordinated release',
      compensating_controls: [
        'All traffic is HTTPS with TLS 1.3 at the edge; the database connection requires TLS',
        'Encryption keys and database credentials live only in the Render environment and maintainers’ local, git-ignored files',
        'Credential-guessing routes are in the auth rate-limit category; customers can regenerate an exposed API key at any time',
        'GuardDuty and VPC Flow Logs monitor the AWS account; Render records every deploy',
      ],
      target: 'December 4, 2026 (30-day SLA for High)',
      review: 'November 18, 2026 progress check; December 4, 2026 closure',
      approved_by: 'Jimmy Lee, Chief Executive Officer and Director',
      approved_at: '2026-11-04',
      ratified: 'Board resolution of November 4, 2026 approving the tabletop action items',
    },
  },
  {
    id: 'INTDEV-2026-NET-01',
    component: 'Managed production database network access',
    severity: 'Medium',
    found: 'November 4, 2026',
    status: 'Open, remediation plan approved',
    state: 'open',
    fixed_in: null,
    action: 'Identified during the November 2026 tabletop exercise. The Render PostgreSQL allow list is not restricted to named sources. Narrow it to the Render private network and named maintainer addresses. Connections already require TLS and a database credential. SLA: 60 days (January 3, 2027).',
    evidence: [{ label: 'Configuration export', detail: 'Render API read of INTDEV DATA, November 4, 2026', href: '/compliance/network-segmentation' }],
  },
  {
    id: 'INTDEV-2026-NET-02',
    component: 'Legacy AWS EC2 security groups in us-west-2',
    severity: 'Medium',
    found: 'November 4, 2026',
    status: 'Open, remediation plan approved',
    state: 'open',
    fixed_in: null,
    action: 'Found in the 2026 firewall review. Inbound rules on legacy security groups are broader than their business need. The four instances they protect are stopped, and no production workload runs on EC2. Remove the legacy groups or restrict them to named sources before any instance is started again. SLA: 60 days (January 3, 2027).',
    evidence: [{ label: 'Configuration export', detail: 'AWS EC2 security group export, November 4, 2026', href: '/compliance/network-segmentation' }],
  },
  {
    id: 'INTDEV-2026-HSTS',
    component: 'api.internet.dev, users.garden, internet.dev, terminalgraph.com',
    severity: 'Low',
    found: 'November 4, 2026',
    status: 'Open, scheduled',
    state: 'open',
    fixed_in: null,
    action: 'Every hostname redirects HTTP to HTTPS and negotiates TLS 1.3, but none sends a Strict-Transport-Security header. Enable HSTS at the Cloudflare edge. SLA: 90 days (February 2, 2027).',
    evidence: [{ label: 'External test', detail: 'TLS and header test of each hostname, November 4, 2026', href: '/compliance/encryption-in-transit' }],
  },
];

export const OSPREY = {
  repository: 'https://github.com/roostorg/osprey',
  recognition: { href: 'https://github.com/roostorg/osprey/commit/d748a3e35f92357a2a33d82569928bf570acf27b', detail: 'ROOST founder Juliet Shen adds INTDEV to the Osprey recognition, September 16, 2025 (UTC)' },
  finalCommit: { href: 'https://github.com/roostorg/osprey/commit/4168854768e560e7ca04fa11f5c8cef974f51a9a', detail: 'Chenyu Huang’s commit adding Kafka support for the coordinator, INTDEV’s final Osprey delivery, December 4, 2025' },
};

export const PENETRATION_TEST = {
  id: 'PT-2025-001',
  target: 'INTDEV API (api.internet.dev)',
  engagement: 'INTDEV’s work for Discord and ROOST (Robust Open Online Safety Tools) on Osprey, the open-source safety rules engine ROOST publishes on GitHub',
  window: 'February 10, 2025 to December 4, 2025',
  reportedAt: 'February 1, 2026',
  windowEvidence: 'INTDEV began shipping deliverables for Discord on February 10, 2025, open-sourced Osprey for ROOST in September 2025, and delivered its final Osprey commit on December 4, 2025, as recorded on internet.dev and in the public roostorg/osprey history. The exact dates of the attempts on the API were not recorded.',
  testers: 'ROOST, as part of the Osprey engagement, guided by Chenyu Huang',
  lead: 'Chenyu Huang, a security professional and an INTDEV engineering partner during the test (joined January 15, 2025). He built the INTDEV API’s Sign in with Apple and Bluesky sign-in, and authored INTDEV’s final Osprey commit. By the report date he had joined Discord and was no longer part of INTDEV.',
  leadSite: { href: 'https://chenyu.blog/', detail: 'Chenyu Huang’s site, which lists his engineering partnership at INTDEV and his current role at Discord' },
  rationale: [
    'INTDEV asked Chenyu Huang to break its authentication because he had built part of it. He integrated Sign in with Apple and Bluesky sign-in over the AT Protocol, so he understood from the inside the points at which an identity asserted by an outside provider becomes an INTDEV account: the state that carries a sign-in out to the provider and back, the exchange that turns a provider’s answer into a verified identity, the match of that identity to an account by email address, and the hand-off of the resulting API key to the site where the sign-in began.',
    'An authentication system is only as strong as its resistance to the adversary who understands it best, and no one understands it better than the engineer who wrote it. An outside tester starts from the documentation and the public surface. The author starts from the assumptions behind every check, the cases deferred for later, and the places where one provider’s conventions were bent to fit another’s. Setting the builder against his own work replaced an outsider’s inference with the most precise knowledge of the design that exists.',
    'His departure gave the exercise its second purpose. Offboarding can withdraw every credential an engineer holds, but it cannot withdraw what that engineer knows about how the system decides whom to trust. The person who built Apple and Bluesky sign-in, once he has left the company, is the best-informed adversary the INTDEV API can face, and the one its design, rather than its access controls, has to withstand. Asking him to break what he had built tested whether knowing how INTDEV’s authentication works is enough to defeat it.',
  ],
  result: 'No attempt succeeded. No vulnerability was exploited, no unauthorized access or privilege was gained, no customer data was exposed, and the service was not disrupted.',
  attestation: 'INTDEV’s work with ROOST on Osprey required ROOST to try to break the INTDEV API, guided by Chenyu Huang. The attempts did not succeed. The INTDEV API has never been compromised.',
  attestedBy: 'Jimmy Lee, Chief Executive Officer and Chief Information Security Officer',
  attestedAt: 'November 4, 2026',
  followUp: 'INTDEV took a long time to act on this report. It is dated February 1, 2026, and INTDEV did not act on it until November 4, 2026, nine months later, when it ran the internal assessment recorded on the penetration testing page and the CEO attested to and published this report.',
};

export const BUG_BOUNTY = {
  name: 'INTDEV bug bounty program',
  started: 'November 4, 2026',
  operator: 'INTDEV directly, without an intermediary platform such as HackerOne or Bugcrowd. Reports go straight to the people who fix them.',
  rewards: 'INTDEV does not publish reward amounts or a reward table. Rewards are at INTDEV’s discretion, and researchers who report in good faith, follow the rules on this page, and communicate clearly are likely to be rewarded.',
  inScope: [
    ['INTDEV API', 'api.internet.dev', 'Every route, including authentication, API keys, OAuth sign-in, organizations, credits, payments, uploads, and the compliance evidence endpoints'],
    ['Users Garden', 'users.garden', 'Sign-in, API keys, credits, subscriptions, organizations, and account deletion'],
    ['Terminal Graph', 'terminalgraph.com and the latest release of the macOS application', 'The application, its update channel, and the website'],
    ['INTDEV website', 'internet.dev', 'The website and its compliance pages'],
  ],
  outOfScope: [
    'Services INTDEV uses but does not operate, such as Render, Cloudflare, AWS, Stripe, Google, Apple, Bluesky, Mailgun, and Twilio. Report those to the vendor.',
    'Sites run by other companies that use the INTDEV API as their backend. Report those to the site’s owner.',
    'Denial of service, load testing, or anything that degrades the service for other people.',
    'Social engineering, phishing, or physical attacks against INTDEV staff, offices, or devices.',
    'Output from automated scanners without a demonstrated impact.',
    'Findings already listed in the vulnerability register on the penetration testing page.',
  ],
};
