import type { Person, Vendor } from '@root/compliance/site/types';

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
  ceo: 'jimmy@internet.dev',
};

export const PUBLISHED = 'November 4, 2026';

export const COMPLIANCE_HOSTS = ['https://internet.dev', 'https://users.garden'];

export const API_HOST = 'https://api.internet.dev';

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

export const TEAM: Person[] = [
  { name: 'Jimmy Lee', title: 'Staff Janitor', role: 'Chief Executive Officer; Director; acting CTO, COO, and Security & Compliance Manager', avatar: `${AVATAR}/2086911496098070528/eV9UzyBw_400x400.jpg`, href: 'https://x.com/wwwjim', joined: 'November 11, 2023', type: 'Founder' },
  { name: 'Andrew Alimbuyuguen', title: 'Webmaster', role: 'Member of Technical Staff', avatar: `${AVATAR}/1958569334726668288/GFE8mhKI_400x400.jpg`, href: 'https://x.com/aalimbuyuguen', joined: 'November 11, 2023', type: 'Co-founder, Partner' },
  { name: 'Elijah Seed Arita', title: 'Webmaster', role: 'Member of Technical Staff', avatar: `${AVATAR}/1890125319224598528/ZILr9OGp_400x400.jpg`, href: 'https://x.com/elijaharita', joined: 'March 6, 2024', type: 'Partner' },
  { name: 'Caidan Williams', title: 'Webmaster', role: 'Member of Technical Staff; Terminal Graph product lead', avatar: `${AVATAR}/1989080994687991809/CoUHUW0A_400x400.jpg`, href: 'https://x.com/caidanwilliams', joined: 'June 24, 2025', type: 'Partner' },
  { name: 'Hannah Suh', title: 'Webmaster', role: 'Member of Technical Staff', avatar: `${AVATAR}/2091636350445629440/4WCkh6JZ_400x400.jpg`, href: 'https://x.com/hellohsuh', joined: 'June 24, 2025', type: 'Partner' },
  { name: 'Sol Ruck', title: 'Webmaster', role: 'Member of Technical Staff', avatar: `${AVATAR}/2090924616269414400/q7qc0FcP_400x400.jpg`, href: 'https://x.com/solruck', joined: null, type: 'Member of Technical Staff' },
  { name: 'Vani Agarwal', title: 'Webmaster', role: 'Member of Technical Staff', avatar: `${AVATAR}/1953144649725431808/fbHIGXnV_400x400.jpg`, href: 'https://x.com/vaniagrwall', joined: 'September 16, 2026', type: 'Employee' },
  { name: 'Rishav Kundu', title: 'Webmaster', role: 'Member of Technical Staff', avatar: 'https://osoi4zg5m42do5ig.public.blob.vercel-storage.com/rishav.avif', href: 'https://github.com/rishavkundu', joined: 'October 5, 2026', type: 'Employee' },
];

export const FORMER_TEAM = [
  { name: 'Anastasiya Uraleva', type: 'Co-founder, Partner', joined: 'November 11, 2023', left: 'July 11, 2026' },
  { name: 'Chenyu Huang', type: 'Partner', joined: 'January 15, 2025', left: 'No longer on the active roster at internet.dev' },
];

export const EXECUTIVE = 'Jimmy Lee';

export const POLICIES = [
  { name: 'Information Security Policy (including Acceptable Use)', owner: 'CEO' },
  { name: 'Access Control Policy', owner: 'CEO' },
  { name: 'Business Continuity and Disaster Recovery Plan', owner: 'Chief Technology Officer' },
  { name: 'Code of Conduct', owner: 'CEO' },
  { name: 'Cryptography Policy', owner: 'CEO' },
  { name: 'Data Management Policy', owner: 'CEO' },
  { name: 'Human Resource Security Policy', owner: 'Chief Executive Officer' },
  { name: 'Incident Response Plan', owner: 'CEO' },
  { name: 'Information Security Roles and Responsibilities Policy', owner: 'CEO' },
  { name: 'Operations Security Policy', owner: 'CEO' },
  { name: 'Risk Management Policy', owner: 'Chief Executive Officer' },
  { name: 'Secure Development Policy', owner: 'CEO' },
  { name: 'Third-Party Management Policy', owner: 'CEO' },
];

export const POLICY_DATES = 'Version 1.0, approved by Jimmy Lee (CEO) on September 8, 2026, effective September 26, 2026';

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

export const VULNERABILITIES = [
  { id: 'GHSA-wq5f-xc86-pv6w', component: 'sharp (direct dependency of the INTDEV API)', severity: 'High', found: 'November 4, 2026', status: 'Remediated November 4, 2026', action: 'Upgraded sharp 0.35.4 to 0.35.5, which bundles the patched librsvg (CVE-2026-96889). The pinned version is in package.json, so every Render build installs the fix.' },
  { id: 'GHSA-mrhx-c7xc-m3w5', component: 'zod 3.x, through 15 @atproto packages used for Bluesky sign-in', severity: 'High', found: 'November 4, 2026', status: 'Open, risk treatment plan', action: 'No fixed release exists for zod 3, and every current @atproto release still requires zod ^3.23.8. Tracked until @atproto moves to zod 4.6.6 or later; the affected code parses OAuth and DID documents from identity servers, not arbitrary customer input. Target: upgrade within 30 days of an upstream release.' },
  { id: 'GHSA-3g3m-2fjr-6pw4', component: 'glob 10.x through rimraf and googleapis-common (googleapis ^172)', severity: 'Moderate', found: 'November 4, 2026', status: 'Open, scheduled', action: 'Fixed by moving googleapis to the current major (189), whose googleapis-common no longer depends on rimraf. Scheduled as a tested upgrade because it changes the Google sign-in client library. SLA: 60 days.' },
  { id: 'GHSA-g3hv-75wg-m249', component: 'minimatch 9.x through the same googleapis chain', severity: 'Moderate', found: 'November 4, 2026', status: 'Open, scheduled', action: 'Resolved by the same googleapis upgrade. SLA: 60 days.' },
  { id: 'INTDEV-2026-CRYPTO-01', component: 'INTDEV API credential storage and cross-origin payload encryption', severity: 'High', found: 'November 4, 2026', status: 'Open, remediation plan approved', action: 'Identified during the November 2026 tabletop exercise. Bring stored credentials and the cross-origin encryption scheme to the Cryptography Policy standard. The change is coordinated with every consuming site because the scheme is shared across origins. Details are Confidential under the Data Management Policy and are available to auditors on request. SLA: 30 days.' },
  { id: 'INTDEV-2026-NET-01', component: 'Managed production database network access', severity: 'Medium', found: 'November 4, 2026', status: 'Open, remediation plan approved', action: 'Identified during the November 2026 tabletop exercise. Narrow the database network allow list to the Render private network and named maintainer addresses. Connections already require TLS and a database credential. SLA: 60 days.' },
  { id: 'INTDEV-2026-NET-02', component: 'Legacy AWS EC2 security groups in us-west-2', severity: 'Medium', found: 'November 4, 2026', status: 'Open, remediation plan approved', action: 'Found in the 2026 firewall review. Inbound rules on legacy security groups are broader than their business need. The instances they protect are stopped, and no production workload runs on EC2. Remove the legacy groups or restrict them to named sources before any instance is started again. SLA: 60 days.' },
  { id: 'INTDEV-2026-HSTS', component: 'api.internet.dev, users.garden, internet.dev, terminalgraph.com', severity: 'Low', found: 'November 4, 2026', status: 'Open, scheduled', action: 'Every hostname redirects HTTP to HTTPS and negotiates TLS 1.3, but none sends a Strict-Transport-Security header. Enable HSTS at the Cloudflare edge. SLA: 90 days.' },
];
