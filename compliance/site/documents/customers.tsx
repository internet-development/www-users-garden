import type * as React from 'react';

import Document from '@root/compliance/site/Document';

import { API_HOST, AWS_REGIONS, COMPANY, CONTACTS, countWord, PRODUCTS, PUBLIC_TERMS, TRUST_CENTER, VENDORS, VENDOR_REVIEW } from '@root/compliance/site/facts';
import { ArchitectureDiagram } from '@root/compliance/site/NetworkDiagram';
import { APPLICATION_ENCRYPTION, DELETION_STATEMENT, DEVICE_CHECK_FRESH_DAYS, DEVICE_INVENTORY, EVIDENCE_ENDPOINTS, RENDER_NETWORK_EXPORT, SUPPORTED_MACOS, TRAINING_COURSES, VANTA_TRAINING, formatRecordDay } from '@root/compliance/site/records';
import { RECOVERY_PROCEDURES } from '@root/compliance/site/documents/operations';
import { DeletionRecord } from '@root/compliance/site/Evidence';
import { SecurityJobDescriptions, SecurityTeamStatement } from '@root/compliance/site/documents/governance';
import { CheckTable, Fields, Group, Links, List, Mail, Member, Note, Section, Table } from '@root/compliance/site/Blocks';

const PRIVACY_POLICY = PUBLIC_TERMS.find((term) => term.href.endsWith('intdev-privacy-policy')) ?? { label: 'Privacy Policy', href: 'https://txt.dev/wwwjim/intdev-privacy-policy' };

export function DataDeletion() {
  return (
    <Document
      slug="data-deletion"
      title="Customer data deleted on departure"
      summary="When customers leave, INTDEV removes their confidential data from the application environment. Customers can delete their own account at any time in Users Garden, and INTDEV deletes the rest within 30 days of a contract ending. The anonymous record of completed deletions is published below."
      controls={['Customer data deleted upon leaving']}
      updated="November 6, 2026"
    >
      <Section title="Deletion record">
        <Group>
          <p>{DELETION_STATEMENT}</p>
          <p>Each row is one deleted customer account, identified only by a one-way reference. Account created and deleted after come from the retained ledger; deleted by is the latest time the deletion could have happened, which is when the absence of the account was last checked. Deletions confirmed within the last 12 months are those of accounts created within that period.</p>
          <DeletionRecord />
        </Group>
      </Section>
      <Section title="Self-service deletion in Users Garden">
        <List
          ordered
          items={[
            <>
              Sign in at <a href="https://users.garden">users.garden</a> and open the account danger zone.
            </>,
            'Cancel any active subscription first. Users Garden won’t delete an account that still has a live subscription, so nothing keeps billing after the account is gone.',
            'Choose Delete my account and type DELETE-THIS-ACCOUNT-NOW to confirm.',
            'Users Garden calls the INTDEV API’s POST /api/users/delete with the user’s own API key. The API accepts the request only from the account owner or a platform admin.',
            'The API permanently deletes the user’s row from the production database in one transaction, together with the user’s organization memberships and an anonymous entry in the deletion log. This is a hard delete, not a soft delete. Other records that depend on the account are cascaded or detached by the database’s foreign keys. If a dependent record would block the delete, the request fails without deleting anything partially, and support finishes the deletion by hand.',
          ]}
        />
      </Section>
      <Section title="What is removed and when">
        <Table
          columns={['Data', 'On account deletion', 'Retention ceiling']}
          rows={[
            ['Account, email, password hash, API key, profile data, SMS contact', 'Deleted immediately', '—'],
            ['Organization memberships', 'Deleted with the account in the same transaction (from INTDEV API 2.0.9)', '—'],
            ['Analytics project memberships', 'Deleted with the account (cascade)', '—'],
            ['Slide decks and assets the user created', 'Detached from the user by the database, then tombstoned by the slide cleanup worker', 'Per the slide retention rules'],
            ['Uploaded files in S3', 'Removed by support on request, or within 30 days of contract termination. The buckets that hold uploads are versioned and never expire old versions automatically, so a removal deletes every stored version of the file, not just the current one', '30 days'],
            ['Database backups (point-in-time recovery)', 'Age out of Render’s rolling recovery window', 'About 7 days'],
            ['API and security logs', 'Not deleted on request; kept for security', '90 days'],
            ['Financial records (invoices, credit ledger)', 'Kept to meet legal obligations, without a link to the deleted user', '7 years'],
            ['Deletion log entry', 'Written at deletion: a one-way reference, the time, and how the deletion was requested. No personal data.', 'Kept as the deletion record'],
            ['SMS opt-out records', 'Kept, so a deleted number is never texted again', 'As long as needed to honor the opt-out'],
          ]}
        />
      </Section>
      <Section title="Contract termination">
        <Group>
          <p>When an enterprise or API contract ends, INTDEV deletes the customer’s accounts and data within 30 days, as Appendix A of the Data Management Policy requires, and confirms by email on request. PII is also deleted when a consumer or data subject makes a verified request and no legal obligation requires keeping it.</p>
          <p>
            Client engagements follow the same limit. When a design, research, or engineering engagement ends, INTDEV deletes the client’s designs, research, and other confidential data within 30 days, including copies outside its own applications, under the <a href="/compliance/client-data-protection">engagement closeout</a> process.
          </p>
        </Group>
      </Section>
      <Section title="Ask for deletion">
        <p>
          Email <Mail address={CONTACTS.support} /> from the address on the account if you can’t sign in.
        </p>
      </Section>
      <Section title="Data privacy policy">
        <Group>
          <p>The full INTDEV Privacy Policy, which covers every INTDEV product and service, explains what personal data is collected, how it is used, and how to have it deleted. Retention and deletion inside INTDEV are governed by the Data Management Policy (Appendix A), which is Restricted and available to auditors under NDA.</p>
          <Links items={[{ label: PRIVACY_POLICY.label, href: PRIVACY_POLICY.href }, { label: 'Terminal Graph Privacy Policy', href: 'https://terminalgraph.com/privacy' }, { label: 'Deletion record (JSON)', href: `${API_HOST}${EVIDENCE_ENDPOINTS.dataDeletions}` }]} />
        </Group>
      </Section>
    </Document>
  );
}

export function Support() {
  return (
    <Document
      slug="support"
      title="Customer support"
      summary="How to get help with the INTDEV API, Users Garden, and Terminal Graph, and how to report failures, incidents, concerns, and complaints so they reach the right people."
      controls={['Customer support site or email alias', 'Support system available', 'External support resources available']}
    >
      <Section title="Contact">
        <Fields
          items={[
            ['Help and support', <Mail key="support" address={CONTACTS.support} />],
            ['Security issues and incidents', <Mail key="security" address={CONTACTS.security} />],
            ['Security research', <a key="bounty" href="/compliance/bug-bounty">Bug bounty program</a>],
            ['Anonymous concerns', <a key="whistle" href="/compliance/whistleblower">Whistleblower channel</a>],
            ['Terminal Graph in-app', 'Help → Report a Bug, or Help → Send Feedback'],
            ['Chat', <a key="telegram" href="https://t.me/internetdevelopmentstudio">Telegram</a>],
          ]}
        />
      </Section>
      <Section title="What to include">
        <List items={['The product and the account email, but never your password or API key', 'What you expected and what happened, with the time and time zone', 'The request URL and the response body. API errors look like { error: true, message }.', 'For Terminal Graph, the app version from About Terminal Graph']} />
      </Section>
      <Section title="How reports are handled">
        <Table
          columns={['Report', 'Routed to', 'First response']}
          rows={[
            ['Outage or failure', 'The on-call Member of Technical Staff, escalated to the Incident Manager if needed', 'Within one business day, sooner for outages'],
            ['Security incident or vulnerability', 'Triaged into P0 to P3 under the Incident Response Plan', 'P0 immediately; P1 within one business day'],
            ['Concern or complaint', 'The CEO', 'Within five business days'],
            ['Data deletion or privacy request', 'The Customer Support Lead', 'Within five business days; completed within 30 days'],
          ]}
        />
      </Section>
      <Section title="Resources">
        <Links
          items={[
            { label: 'Application status', href: '/compliance/status' },
            { label: 'Changelog and release notes', href: '/compliance/changelog' },
            { label: 'Product documentation', href: '/compliance/documentation' },
            { label: 'Terminal Graph documentation', href: 'https://terminalgraph.com/docs/' },
            { label: 'Terminal Graph changelog', href: 'https://terminalgraph.com/changelog' },
            { label: 'INTDEV API guide (SKILL.md)', href: 'https://api.internet.dev/SKILL.md' },
          ]}
        />
      </Section>
    </Document>
  );
}

export function Documentation() {
  return (
    <Document
      slug="documentation"
      title="Product documentation"
      summary="Guidelines and technical references for operating INTDEV products: the INTDEV API, Users Garden, and Terminal Graph."
      controls={['External support resources available', 'Service description communicated', 'Support system available']}
    >
      {PRODUCTS.map((product) => (
        <Section key={product.name} title={product.name}>
          <Group>
            <p>{product.description}</p>
            <Links
              items={[
                { label: product.url.replace('https://', ''), href: product.url },
                { label: 'Documentation', href: product.documentation },
                { label: 'Release notes', href: product.changelog },
              ]}
            />
          </Group>
        </Section>
      ))}
      <Section title="Using Users Garden">
        <List
          ordered
          items={[
            <>
              Sign in at <a href="https://users.garden">users.garden</a> with email and password, or with Google, Apple, or Bluesky. Password accounts verify their email first.
            </>,
            'Copy your API key from the dashboard and send it as the x-api-key header to https://api.internet.dev/api.',
            'Every response includes _usage, which reports the token cost, your remaining balance, and your rate limit. The same values come back in X-Tokens-* and X-RateLimit-* headers.',
            'Regenerate your key whenever it may have been exposed. The old key stops working immediately.',
            'Manage credits, subscriptions, and organizations from the dashboard, and delete your account from the danger zone.',
          ]}
        />
      </Section>
      <Section title="API reference">
        <Group>
          <p>The complete, current contract for every route, including inputs, permission levels, rate-limit categories, token costs, and response shapes, is published for developers and agents at api.internet.dev/SKILL.md. Focused guides cover the marketplace, guest checkout, licenses, slides, and external vendors.</p>
          <Links
            items={[
              { label: 'api.internet.dev/SKILL.md', href: `${API_HOST}/SKILL.md` },
              { label: 'Marketplace guide', href: `${API_HOST}/skills/marketplace/SKILL.md` },
              { label: 'Guest checkout guide', href: `${API_HOST}/skills/marketplace-guest/SKILL.md` },
              { label: 'Licenses guide', href: `${API_HOST}/skills/licenses/SKILL.md` },
              { label: 'Slides guide', href: `${API_HOST}/skills/slides/SKILL.md` },
              { label: 'External vendor guide', href: `${API_HOST}/skills/use-as-external-vendor/SKILL.md` },
              { label: 'Pricing and rate limits (api.internet.dev/api/credits/pricing)', href: `${API_HOST}/api/credits/pricing` },
            ]}
          />
        </Group>
      </Section>
    </Document>
  );
}

export function ServiceDescription() {
  return (
    <Document
      slug="service-description"
      title="Service description and network diagram"
      summary="What INTDEV provides, how it is built, and how data moves between its components: boundaries, network zones, devices, subnets, data flows, security controls, critical systems, physical locations, redundancy, and where customer data is stored. The same description is shared with staff and customers."
      controls={['Service description communicated']}
    >
      <Section title="Products and services">
        <Table columns={['Product', 'What it does', 'Where it runs']} rows={PRODUCTS.map((product) => [<a key={product.url} href={product.url}>{product.name}</a>, product.description, product.hosting])} />
      </Section>
      <Section title="Network diagram">
        <ArchitectureDiagram />
      </Section>
      <Section title="Boundaries">
        <Table
          columns={['Boundary', 'Between', 'Enforced by']}
          rows={[
            ['1. Internet to edge', 'Customers and the Cloudflare edge', 'Cloudflare accepts only HTTPS for INTDEV hostnames, terminates TLS 1.3, and redirects HTTP to HTTPS; DDoS protection'],
            ['2. Edge to origins', 'Cloudflare and the Render web services', 'HTTPS to Render origins; each service exposes only its HTTP port; no SSH or other ports'],
            ['3. Application to data', 'The INTDEV API and its data stores', 'Database connections require TLS and the database credential, held only in the API environment and by administrators; S3 objects are reached through short-lived presigned URLs'],
            ['4. Customer to customer', 'Tenants of the INTDEV API', 'Every request is authorized by the caller’s API key; organization data requires membership, and admin actions require the organization admin role'],
            ['System boundary', 'In scope versus out of scope', 'In scope: the INTDEV API and its data stores, Users Garden, the Terminal Graph accounts, payments, and site, internet.dev, and the GitHub and Render configuration that builds them. Out of scope: client engagements on client-owned infrastructure.'],
          ]}
        />
      </Section>
      <Section title="Network zones, devices, and subnets">
        <Table
          columns={['Zone', 'Physical location', 'Devices and resources', 'Addressing']}
          rows={[
            ['Edge', 'Cloudflare global anycast network', 'Cloudflare proxy, DNS, and certificates for all four hostnames', 'Cloudflare anycast addresses'],
            ['Production, US West', 'Render Oregon region', 'internet-apis (2 instances), terminalgraph (1 instance), INTDEV DATA PostgreSQL 15', 'Render private network within the region; the API’s private address is internet-apis:10001'],
            ['Production, US East', 'Render Ohio region', 'www-users-garden and www-internet-v3 (1 instance each)', 'Render private network within the region'],
            ['Object storage', 'AWS us-west-2 (Oregon)', 'Amazon S3 buckets for uploads, private attachments, and public assets', 'AWS regional endpoints over HTTPS'],
            ['AWS account network', `AWS ${AWS_REGIONS.join(', ')}`, 'One default VPC per region; no EC2 instances and no production workload', 'VPC 172.31.0.0/16 in each region, one /20 subnet per availability zone (six in us-east-1, three in us-east-2, two in us-west-1, four in us-west-2)'],
            ['Development', 'Engineers’ Macs', 'Company laptops with FileVault, screen lock, automatic updates, XProtect, and the firewall on', 'Not routable to production data; no customer data permitted'],
          ]}
        />
      </Section>
      <Section title="Data flows">
        <Table
          columns={['Flow', 'Path', 'Protection']}
          rows={[
            ['Sign in and API use', 'Browser, Terminal Graph, or API client → Cloudflare → internet-apis', 'HTTPS (TLS 1.3); API key in the x-api-key header; per-category rate limits; passwords stored only as bcrypt hashes'],
            ['Customer portal', 'Browser → Cloudflare → www-users-garden → Cloudflare → internet-apis', 'HTTPS on every hop; Users Garden stores no customer data at rest'],
            ['Application data', 'internet-apis → INTDEV DATA (PostgreSQL)', 'TLS; database credential; encrypted at rest by Render'],
            ['Uploads and downloads', 'Client → presigned URL → Amazon S3 (or Google Cloud Storage)', 'HTTPS; short-lived signed URLs; SSE AES-256 at rest in S3; malware scanning on upload buckets'],
            ['Payments', 'Client → Stripe; internet-apis → Stripe API; Stripe → webhook', 'Card data goes only to Stripe; webhook signatures verified'],
            ['Email, SMS, and sign-in', 'internet-apis → Mailgun, Twilio, Google, Apple, Bluesky', 'HTTPS to each provider’s API; Twilio callbacks signature-verified'],
            ['Cross-origin payloads', 'internet-apis ↔ INTDEV sites', `HTTPS; the API key in the payload is also encrypted with the API’s application-layer AES, being brought to the Cryptography Policy’s standard under ${APPLICATION_ENCRYPTION.finding}`],
            ['Change', 'Engineer → GitHub pull request → main → Render build → release', 'Review before merge; CodeQL code scanning and Copilot code review on every INTDEV API pull request; only main deploys; every deploy recorded with its commit'],
            ['Monitoring', 'AWS GuardDuty findings → EventBridge → SNS → eng@internet.dev; VPC Flow Logs → CloudWatch', 'All severities alert; flow logs kept 365 days'],
          ]}
        />
      </Section>
      <Section title="Security controls">
        <List
          items={[
            'Encryption in transit everywhere: TLS 1.3 at the edge, HTTPS to origins and processors, and TLS to the database.',
            'Encryption at rest: Render-managed PostgreSQL encryption, SSE AES-256 on every S3 bucket, and FileVault on every laptop.',
            'Authentication and authorization: per-customer API keys, tiered permissions, organization roles checked on every request, and rate limits per category.',
            'Monitoring: GuardDuty with email alerts and VPC Flow Logs in four US regions, GuardDuty Malware Protection on upload buckets, and Render deploy and service logs.',
            'Change management: reviewed pull requests to the INTDEV API, each one analyzed by GitHub CodeQL code scanning and reviewed by GitHub Copilot code review, deploys only from main, and a public deploy record.',
            'Vulnerability management: monthly scans, GitHub Dependabot alerts on the INTDEV API repository, an annual penetration test, and SLAs of 30, 60, and 90 days.',
          ]}
        />
      </Section>
      <Section title="Critical systems">
        <Table columns={['System', 'Vendor', 'Holds customer data']} rows={[['INTDEV API (internet-apis)', 'Render', 'Processes it'], ['INTDEV DATA (PostgreSQL)', 'Render', 'Yes, at rest'], ['Object storage', 'Amazon Web Services', 'Yes, at rest (uploads)'], ['Edge, DNS, TLS', 'Cloudflare', 'In transit only'], ['Source control and deploy trigger', 'GitHub', 'No'], ['Payments', 'Stripe', 'Payment card data, held by Stripe']]} />
      </Section>
      <Section title="Where customer data is stored">
        <Table
          columns={['Data', 'Store', 'Partition and location']}
          rows={[
            ['Accounts, API keys, organizations, credits, orders, licenses, posts, documents, analytics, slide decks', 'Render PostgreSQL, INTDEV DATA', 'Render Oregon region (US West); one managed instance; point-in-time recovery copies managed by Render'],
            ['Uploads and private attachments', 'Amazon S3', 'AWS us-west-2 (Oregon), stored across three or more availability zones'],
            ['Some public uploads', 'Google Cloud Storage', 'The public upload bucket configured for presigned uploads'],
            ['Payment card data', 'Stripe', 'Held by Stripe under PCI DSS Level 1; never stored by INTDEV'],
            ['Terminal Graph workspaces', 'The user’s Mac', 'Stays on the device; not held by INTDEV'],
          ]}
        />
        <p>Users Garden, internet.dev, and the Terminal Graph site keep no customer data at rest. Their Render services in Ohio and Oregon are stateless.</p>
      </Section>
      <Section title="Redundancy">
        <Table columns={['Resource', 'Region', 'Redundancy']} rows={RENDER_NETWORK_EXPORT.map((row) => [row.resource, row.region, row.redundancy])} />
        <List
          items={[
            'Amazon S3 stores each object across at least three availability zones.',
            'Cloudflare serves every hostname from its global anycast network.',
            'Source code is distributed: every maintainer holds a full clone, and Render can redeploy any recorded commit.',
            'The database has no standby replica. Recovery is a point-in-time restore into a new instance, within the four-hour RTO and one-hour RPO in the BC/DR plan.',
          ]}
        />
      </Section>
      <Section title="Further reading">
        <Links items={[{ label: 'System description (SOC 2 Section III)', href: '/compliance/system-description' }, { label: 'Network segmentation', href: '/compliance/network-segmentation' }, { label: 'Product documentation', href: '/compliance/documentation' }, { label: 'Security', href: '/compliance/security' }]} />
      </Section>
    </Document>
  );
}

export function SecurityInformation() {
  return (
    <Document
      slug="security"
      title="Security at INTDEV"
      summary="The security commitments INTDEV makes to its customers, how they are met across the INTDEV API, Users Garden, and Terminal Graph, and the people responsible for them: the Chief Information Security Officer and every Member of Technical Staff."
      controls={['Company commitments externally communicated', 'Roles and responsibilities specified']}
      updated="November 6, 2026"
    >
      <Section title="Our commitments">
        <List
          items={[
            'We encrypt all traffic in transit. Every hostname serves HTTPS only, with TLS 1.3 at the edge, and the database connection requires TLS.',
            'We store passwords only as bcrypt hashes. Payment card data never touches our servers; Stripe handles it.',
            'We grant staff access on least privilege, with MFA on privileged access, quarterly reviews, and removal within 24 business hours of departure.',
            'We monitor our cloud account continuously with AWS GuardDuty, alerts to engineering, and VPC Flow Logs kept for a year.',
            'We review every change before release, deploy through an audited pipeline, and publish what changed.',
            'We patch critical and high vulnerabilities within 30 days, medium within 60, and low within 90, and run an annual penetration test.',
            'We delete your data when you delete your account, and within 30 days after a contract ends.',
            'When a client engagement ends, we delete the client’s designs, research, and other confidential data we hold within 30 days, including copies outside our own applications, and confirm the deletion in writing on request.',
            'We notify affected customers of a breach without undue delay, as our contracts and the law require.',
          ]}
        />
      </Section>
      <Section title="Who is responsible for security and privacy">
        <SecurityTeamStatement />
      </Section>
      <SecurityJobDescriptions />
      <Section title="Report a vulnerability">
        <p>
          Email <Mail address={CONTACTS.security} /> with the steps to reproduce. Please don’t access other customers’ data, degrade the service, or disclose the issue publicly before we’ve fixed it. We don’t take legal action against good-faith research that follows these rules. Our <a href="/compliance/bug-bounty">bug bounty program</a> sets out the scope and rules, and researchers who report with good intent and communicate well are likely to be rewarded.
        </p>
      </Section>
      <Section title="Where these commitments are binding">
        <Links items={[{ label: 'Master Services Agreement (template)', href: '/compliance/master-services-agreement' }, ...PUBLIC_TERMS.slice(0, 3)]} />
      </Section>
      <Section title="Controls">
        <Links
          items={[
            { label: 'Data transmission encryption', href: '/compliance/encryption-in-transit' },
            { label: 'Intrusion detection', href: '/compliance/intrusion-detection' },
            { label: 'Vulnerability scanning and remediation', href: '/compliance/vulnerability-scans' },
            { label: 'Penetration testing', href: '/compliance/penetration-testing' },
            { label: 'Bug bounty program', href: '/compliance/bug-bounty' },
            { label: 'Vendor management', href: '/compliance/vendor-management' },
            { label: 'Roles and responsibilities', href: '/compliance/roles-and-responsibilities' },
            { label: 'Fleet disk encryption report', href: '/compliance/removable-media' },
            { label: 'Client data protection, engagement closeout, and Microsoft supplier requirements', href: '/compliance/client-data-protection' },
            { label: `${TRUST_CENTER.name}, where ${TRUST_CENTER.operator} publishes every control it monitors`, href: TRUST_CENTER.url },
            { label: 'All compliance records', href: '/compliance' },
          ]}
        />
      </Section>
    </Document>
  );
}

export function MasterServicesAgreement() {
  return (
    <Document
      slug="master-services-agreement"
      title="Master Services Agreement (template)"
      summary={`The template ${COMPANY.name} uses for enterprise and API customers. Security, confidentiality, and privacy commitments are in sections 4 through 7.`}
      controls={['Company commitments externally communicated', 'Third-party agreements established']}
      updated="November 6, 2026"
    >
      <Note>
        <p>This template is a starting point. The agreement each customer signs, together with its order forms and statements of work, controls.</p>
      </Note>
      <Section title="1. Parties and structure">
        <p>This Master Services Agreement (&ldquo;Agreement&rdquo;) is between {COMPANY.name}, a Delaware corporation (&ldquo;INTDEV&rdquo;), and the customer named in the order form (&ldquo;Customer&rdquo;). Services are described in order forms or statements of work (&ldquo;Orders&rdquo;) that reference this Agreement. If an Order conflicts with this Agreement, the Order controls for that Order only.</p>
      </Section>
      <Section title="2. Services">
        <p>INTDEV will provide the services in each Order, which may include access to the INTDEV API, Users Garden, and Terminal Graph, and design and engineering services. INTDEV may update the services, but will not materially reduce their security or core functionality during a paid term. INTDEV will give at least 14 days’ notice of a change that requires action from Customer.</p>
      </Section>
      <Section title="3. Customer responsibilities">
        <p>Customer will keep its API keys and credentials confidential, manage its users’ access, follow the Acceptable Use Policy, and send no payment card data except through INTDEV’s payment processor.</p>
      </Section>
      <Section title="4. Security">
        <p>INTDEV will maintain a written information security program with administrative, technical, and physical safeguards suited to the services. That includes encryption in transit over public networks, least-privilege access with MFA on privileged access, logging and monitoring, vulnerability management, background checks and confidentiality agreements for personnel, and an incident response plan tested every year. INTDEV may update the program, but will not materially weaken it.</p>
      </Section>
      <Section title="5. Confidentiality">
        <p>Each party will protect the other’s Confidential Information with at least reasonable care, use it only to perform this Agreement, and disclose it only to personnel and subcontractors who need it and are bound by confidentiality obligations at least as protective. These obligations survive termination for five years, and indefinitely for trade secrets and Customer Data.</p>
      </Section>
      <Section title="6. Data protection">
        <p>INTDEV processes Customer Data only to provide the services and as Customer instructs, within the direct business relationship between the parties, and will not sell Customer personal data or process it for any other purpose. INTDEV follows applicable privacy laws including the CCPA, and uses only the subprocessors listed on its vendor management page. Where INTDEV processes personal data for Customer, the Order describes the subject matter and duration of the processing, its nature and purpose, the types of personal data, the categories of data subjects, and Customer’s obligations and rights. INTDEV will notify Customer of a Security Incident affecting Customer Data without undue delay, and in any case within 72 hours of confirming it, and will cooperate with Customer’s response. On termination INTDEV will return or delete Customer Data within 30 days, including copies held outside INTDEV’s own applications, unless law requires otherwise, and will certify the deletion on request.</p>
      </Section>
      <Section title="7. Availability and support">
        <p>INTDEV will use commercially reasonable efforts to keep the services available, publish their status, announce planned maintenance in advance, and respond to support requests sent to {CONTACTS.support}.</p>
      </Section>
      <Section title="8. Fees, term, and termination">
        <p>Customer pays the fees in each Order. This Agreement continues while an Order is in effect. Either party may terminate for a material breach that is not cured within 30 days of written notice.</p>
      </Section>
      <Section title="9. Warranties, liability, and governing law">
        <p>Except as stated in this Agreement, the services are provided as is. Each party’s total liability is capped at the fees paid in the 12 months before the claim, excluding breaches of confidentiality and data protection obligations, and neither party is liable for indirect damages. Delaware law governs.</p>
      </Section>
    </Document>
  );
}

export function ThirdPartyAgreements() {
  return (
    <Document
      slug="third-party-agreements"
      title="Third-party agreements"
      summary="INTDEV has written agreements with every vendor and third party it relies on, and with its own customers. Each one includes confidentiality and privacy commitments for that party."
      controls={['Third-party agreements established']}
    >
      <Section title="INTDEV’s own terms">
        <Links items={PUBLIC_TERMS} />
      </Section>
      <Section title="Vendor agreements">
        <Table
          columns={['Vendor', 'Terms', 'Privacy', 'Security']}
          rows={VENDORS.map((vendor) => [vendor.name, <a key="t" href={vendor.terms}>Terms</a>, <a key="p" href={vendor.privacy}>Privacy</a>, <a key="s" href={vendor.security}>Security</a>])}
        />
      </Section>
      <Section title="Contractor and personnel agreements">
        <Links items={[{ label: 'Contractor confidentiality', href: '/compliance/contractor-confidentiality' }, { label: 'Contractor Code of Conduct', href: '/compliance/contractor-code-of-conduct' }, { label: 'Employee confidentiality', href: '/compliance/employee-confidentiality' }, { label: 'Render service agreement', href: '/compliance/render-service-agreement' }]} />
      </Section>
    </Document>
  );
}

export function RenderServiceAgreement() {
  return (
    <Document
      slug="render-service-agreement"
      title="Render service agreement"
      summary="INTDEV’s agreement with Render Services, Inc., which hosts and deploys the INTDEV API, Users Garden, and the Terminal Graph site, and runs the managed PostgreSQL database behind them."
      controls={['Third-party agreements established', 'Vendor management program established']}
    >
      <Section title="Agreement">
        <Fields
          items={[
            ['Vendor', 'Render Services, Inc.'],
            ['Agreement', <a key="terms" href="https://render.com/terms">Render Terms of Service</a>],
            ['Data processing', <a key="dpa" href="https://render.com/dpa">Render Data Processing Addendum</a>],
            ['Privacy', <a key="privacy" href="https://render.com/privacy">Render Privacy Policy</a>],
            ['Security and compliance', <a key="security" href="https://render.com/security">render.com/security</a>],
            ['Platform status', <a key="status" href="https://status.render.com">status.render.com</a>],
            ['Accepted by', 'INTDEV’s Render workspace, under the terms above'],
            ['Relationship owner', <Member key="owner" name="Jimmy Lee" />],
          ]}
        />
      </Section>
      <Section title="What Render runs for INTDEV">
        <Table
          columns={['Render resource', 'Purpose', 'Region', 'Plan']}
          rows={[
            ['internet-apis (web service)', 'INTDEV API, api.internet.dev', 'Oregon', 'Pro'],
            ['INTDEV DATA (PostgreSQL 15)', 'Production database for the INTDEV API, with point-in-time recovery', 'Oregon', 'Pro'],
            ['www-users-garden (web service)', 'Users Garden, users.garden', 'Ohio', 'Standard'],
            ['terminalgraph (web service)', 'terminalgraph.com, documentation, and changelog', 'Oregon', 'Starter'],
            ['www-internet-v3 (web service)', 'internet.dev', 'Ohio', 'Standard'],
          ]}
        />
      </Section>
      <Section title="Commitments INTDEV relies on">
        <List
          items={[
            'Confidentiality and data processing terms covering INTDEV’s customer data, under the Data Processing Addendum',
            'Physical security, host hardening, and patching of the platform',
            'Encrypted, managed PostgreSQL with point-in-time recovery',
            'Isolation between services, and private networking within a region',
            'Public status reporting and incident notification',
          ]}
        />
        <p>Render is a Critical vendor. It is reviewed at least once a year under the Third-Party Management Policy. The 2026 review was completed November 4, 2026; see vendor management.</p>
      </Section>
    </Document>
  );
}

export function VendorManagement() {
  return (
    <Document
      slug="vendor-management"
      title="Vendor management program"
      summary="How INTDEV picks, contracts with, and reviews the vendors behind its services: an inventory of critical vendors, the security and privacy requirements they must meet, and a review at least once a year."
      controls={['Vendor management program established', 'Third-party agreements established']}
    >
      <Section title="Vendor inventory">
        <Table columns={['Vendor', 'Service', 'Criticality', 'Data', 'Owner']} rows={VENDORS.map((vendor) => [vendor.name, vendor.service, vendor.criticality, vendor.data, <Member key="owner" name={vendor.owner} />])} />
      </Section>
      <Section title="Security and privacy requirements">
        <List
          items={[
            'Before access or processing begins: due diligence, a risk assessment, and a written agreement covering confidentiality, integrity, availability, and privacy.',
            'Vendors that process Confidential data must have an executive-backed security policy, a risk program, operations security (vulnerability management, logging, incident response, business continuity), access control, a secure development practice, and background checks for personnel with access.',
            'Independent assurance, such as SOC 2 Type II, ISO 27001, or PCI DSS, is preferred, and is reviewed for Critical vendors.',
            'Cloud providers: INTDEV owns every customer-side control in each provider’s shared-responsibility model.',
            'Exit and lock-in risks are assessed before a new vendor is adopted.',
          ]}
        />
      </Section>
      <Section title="Annual review">
        <Table
          columns={['Vendor', 'Last review', 'Outcome', 'Next review']}
          rows={VENDORS.filter((vendor) => vendor.criticality === 'Critical').map((vendor) => [vendor.name, VENDOR_REVIEW.critical.last, VENDOR_REVIEW.critical.outcome, VENDOR_REVIEW.critical.next])}
        />
        <p>{VENDOR_REVIEW.others}</p>
      </Section>
    </Document>
  );
}

const MICROSOFT_TERMS = 'https://www.microsoft.com/en-us/procurement/contracting-terms-conditions.aspx';

interface SupplierRequirement {
  id: number;
  title: string;
  requires: string;
  meets: string[];
  evidence: { label: string; href: string }[];
  open: string[];
  answer?: { response: string; comment: string };
}

const OWNER_DECISION = 'Owner decision, November 6, 2026';

const UPDATE_COURSE = TRAINING_COURSES.find((course) => course.id === 'security-awareness-2026-update') ?? { version: 'version 2', due: null };

const UPDATE_DUE = UPDATE_COURSE.due ? formatRecordDay(UPDATE_COURSE.due) : 'a date not yet decided';

const DPR_V12 = 'https://cdn-dynmedia-1.microsoft.com/is/content/microsoftcorp/microsoft/accex/documents/presentations/FY26-Microsoft-Supplier-Data-Protection-Requirements-v12_en-US.pdf';

const MICROSOFT_DATA_RULES = [
  'Microsoft data stays in Microsoft’s systems. INTDEV team members open Microsoft Personal and Confidential Data, including the designs, documents, and code Microsoft provides, only in systems Microsoft provides, and never download it or keep a copy in INTDEV’s accounts, on INTDEV laptops, or in the INTDEV API. The INTDEV API, the only INTDEV system that stores user data, holds no Microsoft data.',
  'Code INTDEV writes for Microsoft is kept in Microsoft’s systems, or is INTDEV’s own work product until it is delivered. Work product kept by INTDEV lives only in private repositories in INTDEV’s GitHub organization, which hold no Microsoft Personal or Confidential Data and into which nothing Microsoft provides is copied. Delivered code reaches Microsoft through Microsoft’s systems, and INTDEV’s copies are then handled under the engagement closeout.',
  'Microsoft data reaches INTDEV only through those Microsoft systems, over TLS. Anything sent another way, such as on removable media or as an unencrypted file, is refused, deleted without being opened, and reported to the Microsoft contact.',
  'If a laptop or other physical asset is ever found holding Microsoft Personal or Confidential Data despite these rules, its storage is burned, pulverized, or shredded, as Microsoft requires, instead of being erased or kept under FileVault. The destruction is dated in the engagement’s closeout record, and the CEO certifies it to Microsoft in a signed certificate of destruction on request.',
  'No Microsoft Personal or Confidential Data, including designs, documents, and code, is entered into any AI system, coding assistants included, without Microsoft’s written permission. When Microsoft permits it, INTDEV uses only an AI system that Microsoft provides and manages, reached through access Microsoft issues for the engagement, such as a Microsoft Entra guest account in Microsoft’s tenant or an API key for a Microsoft Foundry resource in a Microsoft-owned Azure subscription, and never an AI service of INTDEV’s own. Each person completes AI training for their role before they start.',
  'No INTDEV team member holds @microsoft.com credentials or works inside the Microsoft corporate network environment.',
  'MFA is enforced on every account INTDEV uses for Microsoft work.',
];

const SUPPLIER_REQUIREMENTS: SupplierRequirement[] = [
  {
    id: 1,
    title: 'Data protection terms in every agreement',
    requires: 'Each agreement with Microsoft carries privacy and security terms for Microsoft Personal and Confidential Data and prohibits selling Microsoft Personal Data or processing it outside the direct business relationship. Where the supplier is a processor or subprocessor, the agreement describes the subject matter and duration of the processing, its nature and purpose, the types of personal data, the categories of data subjects, and Microsoft’s obligations and rights.',
    meets: [
      'INTDEV’s statement of work with Microsoft provides its services under the Microsoft Purchase Order Terms and Conditions, which carry Microsoft’s privacy and security data protection terms.',
      'As those terms require, INTDEV never sells Microsoft Personal Data, and uses Microsoft Confidential Data only to perform the engagement, within its direct business relationship with Microsoft.',
      `${OWNER_DECISION}: INTDEV is not a Processor or Subprocessor of Microsoft Personal Data. It processes no Microsoft Personal Data in the engagement, so the processing description Microsoft requires of a processor does not apply to INTDEV’s statement of work. INTDEV still meets the requirement as if it applied: if Microsoft ever asks INTDEV to process Microsoft Personal Data, the processing description is added to the statement of work or purchase order before any processing begins, and a Business Associate Agreement with Microsoft comes first if the work involves PHI.`,
      'INTDEV keeps no Microsoft data in its own systems: team members work with it only in systems Microsoft provides (the Microsoft engagement rules above).',
      'INTDEV’s own Master Services Agreement template makes the same commitments to every customer: no sale of personal data, no processing outside the business relationship, a description of the processing in each order, and deletion of customer data, including copies outside INTDEV’s applications, within 30 days of termination.',
    ],
    evidence: [
      { label: 'Microsoft Purchase Order Terms and Conditions', href: MICROSOFT_TERMS },
      { label: 'Master Services Agreement (template), section 6', href: '/compliance/master-services-agreement' },
    ],
    open: [],
  },
  {
    id: 3,
    title: 'Annual privacy, security, and AI training',
    requires: 'Everyone with access to Microsoft Personal or Confidential Data completes privacy and security training every year, covering incident prevention, safeguarding passwords, log-in monitoring, the risks of downloading malicious software, privacy law, security obligations, AI systems, and contract obligations. Anyone who processes Microsoft data within AI systems completes AI training for their role, and IT staff train for incident response with simulated events.',
    meets: [
      `Every team member completes security awareness training and business continuity and disaster recovery training within 30 days of hire and every year after, as the Human Resource Security Policy requires. The training is taken in INTDEV’s ${VANTA_TRAINING.name}, and INTDEV’s own courses add its systems, procedures, and customer obligations. Each signed completion is published by the INTDEV API with the person’s user_id and live account level, so attendance records are available at any time.`,
      'The security awareness course covers credentials and secrets (a password manager, unique passwords of at least 12 characters, MFA, and reporting a leak at once), phishing and social engineering, data handling and classification, devices, secure development, and incident reporting.',
      'Incident response with a simulated event: every team member took part in the November 4, 2026 tabletop exercise, a timed simulation of a total compromise of the INTDEV API run through every phase of the Incident Response Plan.',
      `The security awareness update (${UPDATE_COURSE.version}) adds log-in monitoring, the risks of downloading malicious software, privacy law such as the CCPA and the GDPR, contract obligations with the Microsoft engagement rules, and AI systems, and is published with the course. The CEO approved it as the course owner.`,
      `Each team member signs every course, the update included, under Training in Users Garden while signed in to their own account. The signature records the course, its exact version, and the time, and the training record and the compliance report’s training check show it as soon as it is made. The update is signed by ${UPDATE_DUE}, and the training check stays open until every current team member has signed every course.`,
      'AI training: no one at INTDEV processes Microsoft data within an AI system. Microsoft data enters an AI system only with Microsoft’s written permission, only one Microsoft provides and manages, and only after the person completes AI training for their role, for which Microsoft’s AI Literacy Resources may be used.',
    ],
    evidence: [
      { label: 'Security awareness training', href: '/compliance/security-awareness-training' },
      { label: 'Training completions (JSON)', href: `${API_HOST}${EVIDENCE_ENDPOINTS.training}` },
      { label: 'Disaster recovery tabletop exercise', href: '/compliance/tabletop-exercise' },
      { label: 'Incident response plan test', href: '/compliance/incident-response-test' },
      { label: 'Microsoft AI Literacy Resources', href: 'https://aka.ms/EUAIAct-AILiteracy' },
    ],
    open: [],
  },
  {
    id: 4,
    title: 'Sanctions for policy violations',
    requires: 'Apply sanctions to personnel who fail to comply with the supplier’s privacy and security policies, or with Microsoft’s policies when working within the Microsoft corporate environment.',
    meets: [
      'Every INTDEV policy states that a violation can lead to immediate withdrawal or suspension of system and network privileges, and to disciplinary action up to and including termination of employment.',
      'The Human Resource Security Policy puts employees and third parties who violate the information security policies through INTDEV’s progressive disciplinary process, up to and including termination of employment or contract, and compliance with the policies is assessed in every annual performance review.',
      'Every contractor agreement makes a breach of the Code of Conduct a material breach, and INTDEV may end the engagement immediately.',
      'Anyone who retaliates against a person who reported a concern in good faith is disciplined, up to and including termination.',
      'Microsoft’s own policies apply to people working within the Microsoft corporate environment. No INTDEV team member works there or holds @microsoft.com credentials, as the owner confirmed on November 6, 2026.',
    ],
    evidence: [
      { label: 'Security awareness training (sanctions)', href: '/compliance/security-awareness-training' },
      { label: 'Code of Conduct for contractors', href: '/compliance/contractor-code-of-conduct' },
      { label: 'Performance evaluations', href: '/compliance/performance-evaluations' },
      { label: 'Anonymous whistleblower channel', href: '/compliance/whistleblower' },
    ],
    open: [],
  },
  {
    id: 12,
    title: 'Retention no longer than necessary',
    requires: 'Microsoft Personal and Confidential Data is kept no longer than needed to perform the work, unless the law requires keeping it, under documented retention policies or the retention Microsoft sets in the contract, with documentary evidence available on request.',
    meets: [
      'Microsoft data stays in Microsoft’s systems, so INTDEV keeps no copy of it that could outlive the work, and Microsoft’s own retention applies (the Microsoft engagement rules above).',
      'The Data Management Policy keeps data only while the company needs it or a regulation or contract requires it, deletes personal data as soon as it has no business use, and sets each system’s retention period in its Data Retention Matrix.',
      'When an engagement ends, every copy of the client’s data INTDEV holds is deleted within 30 days under the engagement closeout above, unless the agreement says otherwise, and the closeout record dates each deletion.',
    ],
    evidence: [
      { label: 'Customer data deleted on departure', href: '/compliance/data-deletion' },
      { label: 'Master Services Agreement (template), section 6', href: '/compliance/master-services-agreement' },
    ],
    open: [],
  },
  {
    id: 13,
    title: 'Return or destruction at the end of the work',
    requires: 'At Microsoft’s choice, Microsoft Personal and Confidential Data in the supplier’s possession is returned or destroyed when the work is complete or on request. Applications securely delete data removed by users or by age; physical assets holding Microsoft data are burned, pulverized, or shredded; a record of disposition is kept; and a certificate of destruction signed by an officer is provided when Microsoft requires destruction.',
    meets: [
      'The engagement closeout returns anything the client asks for and deletes every remaining copy within 30 days. Its record lists each place the data was kept with the date of each deletion, which is the record of disposition.',
      'On request, the CEO, an officer of INTDEV, confirms the deletion in a signed certificate of destruction.',
      'Deletion inside INTDEV’s applications is secure: deleting an INTDEV API account is a hard delete in one transaction, and a file removed from INTDEV’s versioned S3 buckets is removed with every stored version.',
      'Microsoft data is never kept on an INTDEV laptop or other physical asset (the Microsoft engagement rules above).',
      `${OWNER_DECISION}: if a laptop or other physical asset is ever found holding Microsoft data, its storage is burned, pulverized, or shredded, as Microsoft requires, and the destruction is recorded in the closeout record and certified on request (the Microsoft engagement rules above). The Data Management Policy’s exemption from physical destruction for FileVault-encrypted devices applies only to devices that hold no Microsoft data.`,
    ],
    evidence: [
      { label: 'Customer data deleted on departure', href: '/compliance/data-deletion' },
      { label: 'Deletion record (JSON)', href: `${API_HOST}${EVIDENCE_ENDPOINTS.dataDeletions}` },
    ],
    open: [],
  },
  {
    id: 30,
    title: 'Notifying Microsoft of a Data Incident',
    requires: 'An incident response plan that notifies Microsoft of a Data Incident as the contract or privacy law requires, or without undue delay, whichever is sooner; cooperation with Microsoft’s investigation, including an incident summary, the compromise, the scope of data accessed, the mitigations, and access to personnel or hardware for forensic review; and security contacts kept current in Microsoft SupplierWeb.',
    meets: [
      'The Incident Response Plan requires INTDEV to notify customers promptly of relevant incidents and breaches, as its policies, contracts, and the law require, and to report breaches without undue delay. The CEO and legal counsel make that determination.',
      'INTDEV’s Master Services Agreement template sets notice within 72 hours of confirming a Security Incident at the latest, and cooperation with the customer’s response.',
      'The plan commits INTDEV to cooperate with customers, data controllers, and regulators in an incident, and its responders preserve evidence following NIST SP 800-86, so the incident summary, the scope of data accessed, and the mitigations are available to Microsoft.',
      'For Microsoft, notice follows Microsoft’s SSPA Program Guide: INTDEV reports a Data Incident through Microsoft SupplierWeb or by email to SuppIR@microsoft.com, with the date of the incident, INTDEV’s supplier name and supplier number, the Microsoft contacts notified, the associated purchase order, and a summary of the incident.',
      `${OWNER_DECISION}: INTDEV notifies Microsoft immediately once it confirms a Data Incident. Immediate notice is never later than the contract, privacy law, or “without undue delay” requires, so the earliest of the three always governs, as Microsoft’s “whichever is sooner” asks.`,
      'The security contact INTDEV names in Microsoft SupplierWeb and for Section J of the requirements is Jimmy Lee, Chief Executive Officer and CISO. He keeps the SupplierWeb security contact fields current.',
    ],
    evidence: [
      { label: 'Incident response plan test', href: '/compliance/incident-response-test' },
      { label: 'Master Services Agreement (template), section 6', href: '/compliance/master-services-agreement' },
      { label: 'Customer support (reporting an incident)', href: '/compliance/support' },
    ],
    open: [],
  },
  {
    id: 31,
    title: 'Remediation of each Data Incident',
    requires: 'A remediation plan for each Data Incident, monitored to closure, with timely updates to Microsoft until it is resolved and a post-incident review.',
    meets: [
      'The Incident Response Plan takes every critical incident through investigation, containment, eradication, recovery, and remediation of the vulnerabilities, and ends with a post-mortem report of the lessons learned.',
      'Every incident is documented in GitHub Issues with a root cause analysis, and executive staff direct the planning, communication, and execution of each mitigation and remedial action.',
      'The Incident Manager sends status updates at regular intervals until the incident response is formally closed, and INTDEV cooperates with affected customers throughout.',
      'INC-2026-001 shows the process carried to closure: detection, containment, root cause analysis, corrective actions, and a review of their effectiveness.',
    ],
    evidence: [
      { label: 'Incident report INC-2026-001', href: '/compliance/incident-report' },
      { label: 'Incident response plan test', href: '/compliance/incident-response-test' },
    ],
    open: [],
  },
  {
    id: 33,
    title: 'Annual security assessments and change logs',
    requires: 'Assess every year the risks to the confidentiality, integrity, and availability of Microsoft Personal Data and the measures that reduce them; review major changes to the environment, such as new system components, network topology, and firewall rules; and keep change logs that record each change, its reason, and the name and title of its approver, with 90 days of records available on request.',
    meets: [
      'The Risk Management Policy, based on ISO 27005 and NIST SP 800-30, requires a risk assessment every year. Risks are scored by likelihood and impact on a 1 to 5 scale and kept in the Vanta risk register, and the board reviews the assessment. The register is Confidential and available to Microsoft on request.',
      'The Operations Security Policy requires an annual network security assessment that reviews major changes to the environment, such as new system components and network topology. The 2026 assessment, on November 4, 2026, covered authentication and authorization code, credential and cryptography handling, every production dependency, TLS on each hostname, AWS IAM, MFA, security groups, and GuardDuty, and the Render database network and backup settings. The 2026 firewall review covered the Cloudflare, Render, and AWS rulesets the same day.',
      'Change logs: every production change to the INTDEV API is a GitHub pull request with its description and review; Render records every deploy with its commit and time; the version ledger records what each INTDEV API version changed, including routes, dependencies, compliance registers, and AWS, TLS, and Render configuration; and changes to the AWS account are recorded with their approver in the vulnerability register. All of these are kept for more than 90 days.',
      'Every pull request in the INTDEV API repository uses INTDEV’s template, which records the reason for the change and the approver’s name and title, and network changes are recorded by the Network Administrator with their reason and approver. Every approval on an INTDEV pull request, including those from before the template, is made from the approver’s own GitHub account, which belongs to one team member whose name and title the team register publishes, so the name and title of the approver of every change in the last 90 days is on record.',
      'In the INTDEV API repository, a GitHub ruleset on every branch requires an approving review before merge, requests a GitHub Copilot code review on every push to a pull request, and blocks a merge that leaves a high or critical CodeQL code scanning alert, as read through the GitHub API on November 6, 2026.',
      'The INTDEV API repository holds the whole backend of every INTDEV service: every route, data store, permission check, and integration. It is the repository these change controls are enforced and verified on.',
      'Scan results are published in the vulnerability register.',
      'The risks the Microsoft engagement adds, to laptops, GitHub identities, access Microsoft issues, and any local copy, are treated by the Microsoft engagement rules above, FileVault and the device check on every laptop, MFA on every account used for Microsoft work, and the client access step of the termination checklist, and they are reviewed in each annual risk assessment.',
    ],
    evidence: [
      { label: 'Penetration testing (2026 assessment)', href: '/compliance/penetration-testing' },
      { label: 'Network firewall review', href: '/compliance/firewall-review' },
      { label: 'CI/CD production deployments (pull request approval)', href: '/compliance/ci-cd' },
      { label: 'Changelog and version ledger', href: '/compliance/changelog' },
      { label: 'Vulnerability scanning and remediation', href: '/compliance/vulnerability-scans' },
    ],
    open: [],
  },
  {
    id: 35,
    title: 'Asset inventory and ownership',
    requires: 'Every physical and virtual asset that supports the work has a named owner and is kept in an inventory that records each device’s location, the classification of the data on it, its recovery when employment or an agreement ends, and the disposal of storage media. A device used with @microsoft.com credentials to reach Microsoft data is managed solely by Microsoft.',
    meets: [
      'The Asset Management Policy requires an inventory of every asset that stores, processes, or transmits classified information, a named owner for each, acceptable use rules (in the Information Security Policy), the return of every asset when employment or a contract ends, and disposal by an approved erasure method under NIST SP 800-88, or a certificate of destruction from a third-party service.',
      `Laptops: every laptop used for INTDEV work is enrolled in the central device register under its team member, with its location, the classification of the data on it, its model, chip, macOS version, disk encryption, anti-malware state, and last check-in, published live. Every work laptop was in Seattle, WA when the CEO recorded the locations on November 6, 2026, and every one is classified ${DEVICE_INVENTORY.classification}, because the Data Management Policy classifies a system by the highest class of data it holds.`,
      'Virtual assets: the Render services and database are listed with their region and plan; every AWS IAM user, customer-managed role, and S3 bucket carries a named owner tag; the vendor inventory names an owner for each vendor; and the software inventory lists every package the INTDEV API runs, with the version in production.',
      'Data classification: the Data Management Policy classifies data as Confidential, Restricted, or Public, and classifies each system by the highest classification of data it holds. Client data is Confidential.',
      `Recovery and disposal: ${DEVICE_INVENTORY.recovery} ${DEVICE_INVENTORY.disposal} The device register states both beside every laptop.`,
      'No team member uses @microsoft.com credentials on any device, as the owner confirmed on November 6, 2026, so no INTDEV device needs to be managed solely by Microsoft.',
    ],
    evidence: [
      { label: 'Mobile device management system (device register)', href: '/compliance/mobile-device-management-system' },
      { label: 'Render service agreement', href: '/compliance/render-service-agreement' },
      { label: 'Access reviews (AWS owners)', href: '/compliance/access-reviews' },
      { label: 'Vendor management program', href: '/compliance/vendor-management' },
      { label: 'Service infrastructure maintenance (software inventory)', href: '/compliance/infrastructure-maintenance' },
      { label: 'Access revoked upon termination', href: '/compliance/access-termination' },
    ],
    open: [],
  },
  {
    id: 36,
    title: 'Access rights management',
    requires: 'Access control and identification procedures, lockout after unsuccessful attempts, automatic logoff after inactivity, strong password rules (length, complexity, and no reuse), deactivation within 48 hours of termination, MFA for identities, and a least-privilege access review with defined roles, a documented justification for each person in a role, and a strong prohibition on shared accounts or passwords.',
    meets: [
      'The Access Control Policy grants access on least privilege through the roles in the access matrix, requires a unique user ID for every person, forbids sharing credentials, and keeps every permission change for at least a year. User IDs are never reused.',
      'Password rules on confidential systems, wherever the system allows: at least 12 characters with upper and lower case letters, a number, and a special character; no reuse of the last 16 passwords; lockout after 6 failed attempts; new passwords checked against common and leaked password lists; and storage only as bcrypt hashes.',
      'Automatic logoff: a device with confidential data locks after 5 minutes of inactivity, and any device after 10 minutes at most.',
      'MFA is enforced on every account INTDEV uses for Microsoft work, as the owner confirmed on November 6, 2026, and is required for all privileged access to production.',
      'INTDEV has no shared accounts and no shared passwords, as the owner confirmed on November 6, 2026. Every account belongs to one person, or is a system account in the register with one owner. Jimmy Lee is the only person who manages or signs in to the account registered to eng@internet.dev, a mailing alias that delivers to the engineering team. Emergency access is a single break-glass credential held by the CEO, never shared.',
      'Every access request names the system, the level, the business reason, and an approver who is never the requester. Access is reviewed every quarter, and the INTDEV API publishes every grant with its user_id and checks it against production on every read.',
      `Departures: every account is deactivated within 48 hours of a departure at most (${OWNER_DECISION}). The termination checklist removes all access within 24 business hours of the last day and never later than 48 hours, and the INTDEV API checks former team members’ access against production on every read.`,
      'Access a client issues, such as membership in Microsoft’s GitHub organization or a Microsoft Entra guest account, is requested and recorded in the access register like any other grant, with the person, the client, the level, the approver, and the date. The termination checklist asks each client that issued access to remove it within 48 hours of the last day and records the client’s confirmation.',
    ],
    evidence: [
      { label: 'Access control procedures', href: '/compliance/access-control' },
      { label: 'Access requests', href: '/compliance/access-requests' },
      { label: 'Access reviews', href: '/compliance/access-reviews' },
      { label: 'Access revoked upon termination', href: '/compliance/access-termination' },
      { label: 'Mobile device management (screen lock)', href: '/compliance/mobile-device-management' },
    ],
    open: [],
  },
  {
    id: 37,
    title: 'Patch management',
    requires: 'Monthly vulnerability scans with a compliance report covering the prior 12 months; risk-based prioritization of security patches under documented severity definitions; emergency patching; coverage of operating systems and server software; records of the risk each patch mitigates and of exceptions; and retirement of software its vendor no longer supports.',
    meets: [
      'Severity is defined in writing, by CVSS base score and impact, and sets the deadline: critical and high within 30 days, medium within 60, low within 90, and informational as needed (Operations Security Policy). INTDEV may raise or lower a scanner’s severity for real-world impact and exploitability, and records why.',
      'A finding that cannot meet its deadline gets a risk treatment plan with compensating controls and management sign-off, recorded in the vulnerability register.',
      'Emergency patches ship at once and are reviewed afterward. Users Garden moved to Next.js 16.0.7 on December 5, 2025, two days after a critical remote code execution advisory.',
      'Render patches the host operating systems, the container runtime, and the PostgreSQL engine; INTDEV patches the Node.js runtime, frameworks, and dependencies. GitHub Dependabot alerts are on for the INTDEV API repository, and Vanta tests that findings of every severity are fixed within their deadlines.',
      'Software its vendor no longer supports is retired before its end of life, or recorded as a finding of at least Medium severity and replaced within that deadline. The rule covers operating systems, runtimes, packages, and the macOS version on every laptop.',
      'The vulnerability register records each finding, the risk it poses, the change and release that fixed it, and how the fix was verified, and the version ledger and deploy history keep the patch record of every release.',
      `${OWNER_DECISION}: vulnerability scans run every month. Scans ran every quarter before November 4, 2026; from that scan each monthly scan is added to the published record, which builds a full 12 months of monthly scans by November 2027.`,
      `Laptops, the systems used to process Microsoft data, report their patch state through the device check in Users Garden at least every ${DEVICE_CHECK_FRESH_DAYS} days: the macOS version and whether security updates install automatically. The INTDEV API judges each laptop against the supported-macOS rule, the compliance report’s device-patch-state check stays open while any current laptop is unpatched, and each monthly scan reads that record.`,
      `Supported macOS: ${SUPPORTED_MACOS.rule}`,
    ],
    evidence: [
      { label: 'Vulnerability scanning and remediation (severity definitions)', href: '/compliance/vulnerability-scans' },
      { label: 'Sample of remediated vulnerabilities', href: '/compliance/remediated-vulnerabilities' },
      { label: 'Service infrastructure maintenance (retiring unsupported software)', href: '/compliance/infrastructure-maintenance' },
      { label: 'Changelog and version ledger', href: '/compliance/changelog' },
      { label: 'Laptop patch state (device check-ins, JSON)', href: `${API_HOST}${EVIDENCE_ENDPOINTS.devices}` },
    ],
    open: [],
  },
  {
    id: 38,
    title: 'Anti-virus and anti-malware',
    requires: 'Anti-virus and anti-malware software on all equipment connected to any network that processes Microsoft data, including servers and Linux, kept current with definitions updated daily or as the vendor directs, with records showing it is active.',
    meets: [
      'Microsoft data is processed only on the laptops INTDEV team members use to open it in Microsoft’s systems. Production, which runs in Render-managed Linux containers, holds no Microsoft data.',
      `Laptops run XProtect and Gatekeeper, built into macOS, and Apple installs XProtect’s definitions automatically as it directs. Each laptop reports Gatekeeper, its installed XProtect definitions, its automatic update settings, and its application firewall through the device check at least every ${DEVICE_CHECK_FRESH_DAYS} days, and the anti-malware page publishes that record live.`,
      'GuardDuty Malware Protection scans new objects in the S3 buckets that hold customer uploads, and GuardDuty threat detection runs in four AWS regions. The state of both is read when each INTDEV API release is built.',
      'Gmail scans company email attachments and links for malware.',
      'A known or suspected malware detection is a security incident, and disabling anti-malware without authorization violates policy. The Operations Security Policy’s exemption for operating systems not normally prone to malicious software covers no equipment used for Microsoft work, since every laptop reports its anti-malware.',
      `Each team member reruns the device check from Device check in Users Garden on every laptop at least every ${DEVICE_CHECK_FRESH_DAYS} days. From device check 3 it reads the anti-malware state, and the compliance report’s device-anti-malware check stays open while any current laptop has not reported anti-malware active.`,
    ],
    evidence: [
      { label: 'Anti-malware (live laptop record)', href: '/compliance/anti-malware' },
      { label: 'Device check-ins (JSON)', href: `${API_HOST}${EVIDENCE_ENDPOINTS.devices}` },
      { label: 'Intrusion detection', href: '/compliance/intrusion-detection' },
      { label: 'Infrastructure controls (JSON)', href: `${API_HOST}${EVIDENCE_ENDPOINTS.infrastructure}` },
    ],
    open: [],
  },
  {
    id: 39,
    title: 'Security by design',
    requires: 'A supplier that develops software or applications for Microsoft builds security in by design, with security validation checkpoints in its technical specifications and code scanning that alerts on obvious flaws.',
    meets: [
      'INTDEV’s statement of work with Microsoft calls for research, competitive analysis, and design, and INTDEV also delivers code to Microsoft, so this requirement applies. Whenever INTDEV develops software, the Secure Development Policy applies.',
      'The Secure Development Policy applies ten secure-by-design and seven privacy-by-design principles, requires significant changes to be reviewed and approved before merge, forbids deploying code without documented, successful tests, and requires application code to be scanned before deployment.',
      'Security checkpoints in every change to the INTDEV API: each of its pull requests records its reason and approver, confirms that it adds no secret, and states any change to authentication, authorization, or data handling before review, and code is delivered only with its tests passing.',
      'Every production change to the INTDEV API is a reviewed pull request, its tests hold its permission boundaries, and dependencies are scanned with npm audit and GitHub Dependabot. No Microsoft code is given to an AI coding assistant without Microsoft’s written permission.',
      'Code scanning: in the INTDEV API repository, read through the GitHub API on November 6, 2026, GitHub CodeQL scans each pull request, each push to main, and every week and alerts on flaws before merge, and a ruleset blocks a merge that leaves a high or critical alert; its first analysis found eight alerts, recorded in the vulnerability register as INTDEV-2026-CODE-01 and INTDEV-2026-CODE-02 and fixed in INTDEV API 2.0.32. Code kept in Microsoft’s systems follows Microsoft’s own setup.',
      'Every technical specification for software INTDEV develops, each Microsoft deliverable included, follows INTDEV’s technical specification template. Its security validation section records the threat review, authentication and authorization, data classification and handling, secrets, dependencies, and AI use, and lists the security tests and checks that must pass at each checkpoint: before build, before merge, and before delivery. The work is not delivered until every checkpoint is signed off.',
      'A Microsoft deliverable’s specification lives with its code, in Microsoft’s systems or in the private INTDEV repository that holds the work product, and is handled with that code under the engagement closeout.',
    ],
    evidence: [
      { label: 'Technical specification template', href: '/compliance/technical-specification-template' },
      { label: 'CI/CD production deployments', href: '/compliance/ci-cd' },
      { label: 'Roles and responsibilities (Security Engineer)', href: '/compliance/roles-and-responsibilities' },
      { label: 'Sample of remediated vulnerabilities', href: '/compliance/remediated-vulnerabilities' },
    ],
    open: [],
  },
  {
    id: 40,
    title: 'Data loss prevention',
    requires: 'A data loss prevention program: data classified, labeled, and protected; host, network, and cloud intrusion detection where Microsoft data is retained; intrusion prevention configured to stop data loss; analysis for residual vulnerabilities after a breach; procedures for monitoring compromise detection tools; an incident response process; and a reminder to everyone leaving the work not to download or use Microsoft data.',
    meets: [
      'The Data Management Policy classifies data and sets handling rules for each class, and the Operations Security Policy’s data leakage prevention section requires classification and training in handling sensitive data.',
      'Microsoft data stays in Microsoft’s systems, under Microsoft’s own classification, labels, and protection: INTDEV never downloads it or keeps a copy, and refuses it when it arrives any other way. INTDEV therefore retains no Microsoft data, which is the condition under which Microsoft requires host, network, and cloud intrusion detection.',
      'INTDEV’s own systems are still monitored: GuardDuty in four AWS regions with every finding emailed to engineering, VPC Flow Logs kept for 365 days, CloudTrail, and Cloudflare in front of every public hostname.',
      'Findings and suspected intrusions are handled under the Incident Response Plan: report, triage, investigation, containment, recovery and remediation, and lessons learned, with a root cause analysis for every incident.',
      'After an incident the review is widened to similar weaknesses in every related system, as the INC-2026-001 report shows.',
      'Everyone who leaves INTDEV or a client engagement is reminded in writing that they may not download, keep, or use the client’s data, and confirms they hold none, under the engagement closeout above.',
      `${OWNER_DECISION}: because Microsoft data never leaves Microsoft’s systems, no DLP tool or intrusion prevention system of INTDEV’s has Microsoft data to protect, and INTDEV answers requirement 40 “Does Not Apply” in the SSPA portal with the comment below. SSPA support verifies a “Does Not Apply” answer against the statement of work.`,
    ],
    evidence: [
      { label: 'Intrusion detection', href: '/compliance/intrusion-detection' },
      { label: 'Incident report INC-2026-001', href: '/compliance/incident-report' },
      { label: 'Incident response plan test', href: '/compliance/incident-response-test' },
    ],
    open: [],
    answer: {
      response: 'Does Not Apply',
      comment:
        'INTDEV performs its research, design, and engineering for Microsoft only inside systems Microsoft provides and manages, reached through access Microsoft issues for the engagement. INTDEV does not download, store, or retain Microsoft Personal or Confidential Data on its laptops, in its Google Workspace, Slack, or GitHub accounts, or in its own applications, and code INTDEV writes stays in Microsoft’s systems or is INTDEV’s own work product, holding no Microsoft data, until it is delivered. No INTDEV application, system, or infrastructure therefore holds Microsoft data where an INTDEV intrusion detection or prevention system could monitor or stop its loss; Microsoft’s own controls protect it where it lives. INTDEV still classifies its data, runs incident response under its Incident Response Plan, and reminds everyone leaving the engagement in writing not to download or use Microsoft data.',
    },
  },
  {
    id: 41,
    title: 'Network protection',
    requires: 'Controls against unauthorized network access, secure transmission, segmented traffic, current network diagrams and configuration baselines, logs of monitoring and incident response, and network administration roles separate from general IT operations.',
    meets: [
      'Every hostname serves HTTPS only behind Cloudflare, each Render service exposes only its HTTP port, the database requires TLS and a credential, and the S3 buckets refuse plain HTTP.',
      'The public edge, production services, production data, object storage, the AWS account, and development are separate segments, shown in the network diagrams with the only paths between them.',
      'The Render and AWS security group configurations are exported into every INTDEV API release as the current configuration baseline, under the configuration and hardening standards of the Operations Security Policy.',
      'GuardDuty findings, VPC Flow Logs, and the incident record show monitoring and response. Firewall rules are reviewed every year.',
      'Network administration is a written role separate from general IT operations, held by Jimmy Lee alone, as the owner confirmed on November 6, 2026. Only he holds permission to change Cloudflare, which carries no Microsoft work, Render network settings, and AWS network settings; DevOps asks him for any network change. He is the only person with access to the AWS account, through the administrator account he holds with MFA.',
      'The database network allow list is being narrowed (INTDEV-2026-NET-01, due January 3, 2027). The database holds no Microsoft data.',
    ],
    evidence: [
      { label: 'Network segmentation', href: '/compliance/network-segmentation' },
      { label: 'Service description and network diagram', href: '/compliance/service-description' },
      { label: 'Data transmission encryption', href: '/compliance/encryption-in-transit' },
      { label: 'Network firewall review', href: '/compliance/firewall-review' },
      { label: 'Roles and responsibilities (Network Administrator)', href: '/compliance/roles-and-responsibilities' },
      { label: 'Network configuration exports (JSON)', href: `${API_HOST}${EVIDENCE_ENDPOINTS.network}` },
    ],
    open: [],
  },
  {
    id: 42,
    title: 'No secrets in code',
    requires: 'Secrets are never embedded in source or configuration files. A current credential exposure prevention tool, such as GitHub Advanced Security, is in use; a secret found in code is documented as revoked; its replacement is never pushed back into code; and false positives are documented.',
    meets: [
      'Secrets live only in Render’s environment settings and in maintainers’ local, git-ignored files. Account administration credentials are never deployed, and every production instance checks at launch that it holds none of them.',
      'Training requires that secrets are never committed or pasted into issues, chat, or email, and that a possible leak is reported at once, the secret rotated, and the secret removed from history.',
      'A secret found in code is a security incident. It is revoked at its issuer first, and the incident record notes what was exposed (never the value), when it was revoked, and by whom. Its replacement goes only into Render’s environment settings or a git-ignored file, and the reviewer of the fix confirms the diff adds no secret. A scanner alert that is not a secret is dismissed with its reason, which is recorded with the date.',
      'Every pull request in the INTDEV API repository confirms that it adds no secret to any source or configuration file.',
      'GitHub secret scanning and push protection are on for the INTDEV API repository, as read through the GitHub API on November 6, 2026. Its secret scanning includes non-provider patterns, and its ruleset blocks a merge until every secret scanning alert for a known provider’s credential is resolved.',
      'The compliance snapshots compiled into each release are refused if they contain an account ID, an ARN, or an access key ID.',
    ],
    evidence: [
      { label: 'Security awareness training', href: '/compliance/security-awareness-training' },
      { label: 'Access requests (credentials in practice)', href: '/compliance/access-requests' },
      { label: 'Disaster recovery tabletop exercise (action items)', href: '/compliance/tabletop-exercise' },
    ],
    open: [],
  },
  {
    id: 43,
    title: 'Backup',
    requires: 'Documented response and recovery procedures with continuity objectives approved by management, and procedures to back up critical data periodically, store it securely (including encryption), and recover it.',
    meets: [
      'The BC/DR Plan sets the recovery objectives management approved: four hours to restore the INTDEV API and its sign-in, with at most one hour of data loss.',
      'The production database has point-in-time recovery with about seven days of history, kept encrypted by Render outside the primary instance.',
      'The S3 buckets that hold customer uploads are versioned with no automatic expiry, so an overwritten or deleted object stays restorable.',
      'The restore procedure is written: recover to a new instance, verify it, point the API at it, rotate the credential, and record the result against the objectives. Information security continuity is part of the plan, and a security event follows the Incident Response Plan.',
      'Restore capability was reviewed in the November 4, 2026 tabletop exercise, and the first timed restore into an isolated instance is scheduled for December 18, 2026, with its result recorded on the backup page.',
    ],
    evidence: [
      { label: 'Backup and recovery', href: '/compliance/backups' },
      { label: 'Disaster recovery tabletop exercise', href: '/compliance/tabletop-exercise' },
    ],
    open: [],
  },
  {
    id: 44,
    title: 'Business continuity and disaster recovery',
    requires: 'A tested disaster recovery plan with criteria for deciding which systems are critical, the list of critical systems, a recovery procedure for each that lets an engineer who does not know the system recover it in under 72 hours, and testing at least once a year.',
    meets: [
      'The BC/DR Plan ranks INTDEV’s systems by business impact with a recovery time and recovery point objective for each, and sets a procedure for each disruption scenario.',
      `A system is critical when losing it would make a customer-facing INTDEV service or customer sign-in unavailable, put customer data at risk of loss or exposure, or stop INTDEV from shipping a fix to production. By those criteria the ${countWord(RECOVERY_PROCEDURES.length)} critical systems are ${RECOVERY_PROCEDURES.map((procedure) => procedure.system).join(', ')}.`,
      'A step-by-step recovery procedure for each critical system, written for an engineer who does not know the system, is published on the disaster recovery procedures page, with its recovery objective and the access it needs.',
      'Users Garden and TXT.DEV are front-ends that keep no customer data of their own. Their data is held by the INTDEV API, its database, Amazon S3, and Stripe, and is recovered with those systems’ procedures, so each front-end’s procedure only has to redeploy it.',
      'The plan is tested every year. The November 4, 2026 tabletop exercise ran a total loss of the INTDEV API with every team member, and its action items are tracked to completion. The first timed restore of the production database is scheduled for December 18, 2026.',
    ],
    evidence: [
      { label: 'Disaster recovery procedures', href: '/compliance/disaster-recovery' },
      { label: 'Disaster recovery tabletop exercise', href: '/compliance/tabletop-exercise' },
      { label: 'Backup and recovery', href: '/compliance/backups' },
    ],
    open: RECOVERY_PROCEDURES.flatMap((procedure) => procedure.gaps.map((gap) => `${procedure.system}: ${gap}`)),
  },
  {
    id: 45,
    title: 'Identity authentication and least privilege',
    requires: 'Authenticate each individual before granting access to Microsoft Personal or Confidential Data, with a unique user ID, an industry standard authentication method, and MFA, and limit that access to what the individual needs, for no longer than needed.',
    meets: [
      'Every person has a unique user ID, and staff identities are Google Workspace accounts.',
      'MFA is enforced on every account INTDEV uses for Microsoft work, as the owner confirmed on November 6, 2026, and is required for all privileged access to production.',
      'Access comes from a role or from an approved request with a business reason and a review or expiry date, is reviewed every quarter, and is removed when a person leaves. Client data is open only to the team members assigned to the engagement, and Microsoft data only through the access Microsoft grants in its own systems.',
    ],
    evidence: [
      { label: 'Access control procedures', href: '/compliance/access-control' },
      { label: 'Access requests', href: '/compliance/access-requests' },
      { label: 'Access reviews', href: '/compliance/access-reviews' },
    ],
    open: [],
  },
  {
    id: 47,
    title: 'Encryption in transit',
    requires: 'All data processed for Microsoft is encrypted in transit with TLS or IPsec, as NIST SP 800-52 and SP 800-57 describe or an equivalent standard; Microsoft data delivered by unencrypted means is refused; and the creation, deployment, and replacement of certificates is defined and enforced.',
    meets: [
      'Microsoft data reaches INTDEV only through Microsoft’s own systems, over TLS. Anything sent another way, such as on removable media or as an unencrypted file, is refused, deleted without being opened, and reported to the Microsoft contact.',
      'All of INTDEV’s own traffic is HTTPS: TLS 1.3 is negotiated at the Cloudflare edge and legacy TLS is refused, origins are reached over HTTPS, the database requires TLS, and the S3 buckets refuse unencrypted requests. The TLS of each hostname is tested when each INTDEV API release is built.',
      'The Cryptography Policy follows NIST SP 800-57: TLS ciphers rated B or better, and certificates using RSA 2048 or ECC 256 with SHA-2, valid for no more than a year.',
      'Certificates are created, deployed, and renewed automatically by Cloudflare at the edge and by Render at the origins, and their validity is checked on every request to the infrastructure record. A Strict-Transport-Security header, which hardens INTDEV’s own hostnames beyond this requirement, is tracked as INTDEV-2026-HSTS (due February 2, 2027).',
    ],
    evidence: [
      { label: 'Data transmission encryption', href: '/compliance/encryption-in-transit' },
      { label: 'Infrastructure controls (JSON)', href: `${API_HOST}${EVIDENCE_ENDPOINTS.infrastructure}` },
    ],
    open: [],
  },
  {
    id: 48,
    title: 'Full disk encryption',
    requires: 'Every device that accesses or handles Microsoft Personal or Confidential Data uses full disk encryption, such as BitLocker or an industry equivalent.',
    meets: [
      'FileVault, the full disk encryption built into macOS and its equivalent of BitLocker, is required on every laptop used for INTDEV work: AES-256-XTS on Apple silicon, and AES-XTS on T2 and older Intel Macs.',
      `Each laptop proves its encryption to the INTDEV API at least every ${DEVICE_CHECK_FRESH_DAYS} days, and the fleet report is published live. A team member whose laptop is unencrypted or has not reported shows as open.`,
    ],
    evidence: [
      { label: 'Removable media encryption (fleet report)', href: '/compliance/removable-media' },
      { label: 'Mobile device management system', href: '/compliance/mobile-device-management-system' },
      { label: 'Encryption standard (JSON)', href: `${API_HOST}${EVIDENCE_ENDPOINTS.encryption}` },
    ],
    open: [],
  },
  {
    id: 49,
    title: 'Encryption at rest',
    requires: 'Systems and procedures, following current standards such as NIST SP 800-111, encrypt at rest all Microsoft Personal and Confidential Data, including credentials, payment data, personal identifiers, data belonging to Microsoft’s customers, and material about unannounced Microsoft products.',
    meets: [
      'Microsoft data stays at rest in Microsoft’s own systems: INTDEV keeps no copy of it, and the laptops that open it are encrypted with FileVault.',
      'The Cryptography Policy requires AES-256 for confidential data at rest, and the Data Management Policy requires confidential data to be encrypted at rest and every backup to be encrypted.',
      'The production database is encrypted at rest by Render, every S3 bucket uses server-side AES-256 encryption, and every laptop uses FileVault. Passwords are stored only as bcrypt hashes, and payment card data is held only by Stripe.',
      'Credential storage in the INTDEV API, which holds no Microsoft data, is being brought to the Cryptography Policy’s standard (INTDEV-2026-CRYPTO-01, due December 4, 2026).',
    ],
    evidence: [
      { label: 'Service description (where data is stored)', href: '/compliance/service-description' },
      { label: 'Removable media encryption', href: '/compliance/removable-media' },
      { label: 'Encryption standard (JSON)', href: `${API_HOST}${EVIDENCE_ENDPOINTS.encryption}` },
    ],
    open: [],
  },
];

function requirementStatus(requirement: SupplierRequirement): string {
  if (!requirement.open.length) return 'In place';
  return `In place, with ${countWord(requirement.open.length)} item${requirement.open.length === 1 ? '' : 's'} not yet in place`;
}

export function ClientDataProtection() {
  const complete = SUPPLIER_REQUIREMENTS.filter((requirement) => !requirement.open.length).length;
  return (
    <Document
      slug="client-data-protection"
      title="Client data protection and engagement closeout"
      updated="November 6, 2026"
      summary="How INTDEV protects the designs, research, and personal data its clients share in design, research, and engineering engagements; how an engagement is closed out and its data deleted, including copies outside INTDEV’s own applications; and how INTDEV meets each of Microsoft’s Supplier Data Protection Requirements, which Microsoft assesses through its Supplier Security and Privacy Assurance (SSPA) program."
      controls={['Microsoft Supplier Data Protection Requirements (SSPA)', 'Customer data deleted upon leaving', 'Third-party agreements established']}
      owner="Jimmy Lee, Chief Executive Officer and Privacy Management Lead"
      appliesTo="INTDEV’s design, research, and engineering engagements for clients, including Microsoft"
      related={[
        { label: 'Microsoft Purchase Order Terms and Conditions', href: MICROSOFT_TERMS, detail: 'The terms INTDEV’s Microsoft statement of work incorporates' },
        { label: 'Microsoft Supplier Data Protection Requirements, version 12', href: DPR_V12, detail: 'The requirements below, as Microsoft published them in March 2026' },
      ]}
    >
      <Section title="Client data in engagements">
        <Group>
          <p>Clients share designs, research, product plans, and sometimes personal data, such as the contact details of their staff, so that INTDEV can do the work. Under the Data Management Policy all of it is Confidential, and the client’s agreement governs how it may be used. For Microsoft, that agreement is the statement of work under the Microsoft Purchase Order Terms and Conditions.</p>
          <List
            items={[
              'Used only to perform the engagement, as the client’s agreement and instructions allow, within INTDEV’s direct business relationship with that client. INTDEV does not sell it or use it for any other purpose.',
              'Open only to the team members assigned to the engagement, under the least privilege rule of the Access Control Policy.',
              'Kept only in company systems listed in the vendor inventory, in the client’s own systems, or on company laptops encrypted with FileVault; never on personal phones or devices, or on removable media (Data Management Policy).',
              'Never copied into development or test environments, and shared outside INTDEV only under a contract and with the client’s written permission.',
              'Encrypted in transit over public networks and at rest, as the Cryptography Policy requires.',
              'A security incident that affects client data is handled under the Incident Response Plan, and the client is notified as its agreement and the law require.',
            ]}
          />
        </Group>
      </Section>
      <Section title="Microsoft engagement rules">
        <Group>
          <p>Microsoft’s engagement adds these rules to the ones above. The owner set them on November 6, 2026, and every team member who works on the engagement follows them.</p>
          <List items={MICROSOFT_DATA_RULES} />
        </Group>
      </Section>
      <Section title="Engagement closeout">
        <Group>
          <p>When an engagement ends, INTDEV deletes the client’s designs, research, and other confidential data it holds, including copies outside INTDEV’s own applications, unless the client asks for them back or its agreement says otherwise. The Data Management Policy requires customer data to be deleted within 30 days of a contract ending, and engagement data follows the same limit.</p>
          <List
            ordered
            items={[
              'The CEO opens a closeout record when the final deliverable is accepted or the agreement ends, whichever comes first.',
              'The record lists every place the client’s data was kept: company laptops; Google Workspace mail and Drive; Slack; GitHub repositories; design, research, and AI tools; INTDEV storage such as Amazon S3; and copies outside INTDEV’s own applications, such as exports, downloads, screenshots, notes, and files shared with contractors.',
              'INTDEV returns anything the client asks to have back, and confirms that the client holds every deliverable.',
              'Every remaining copy is deleted within 30 days of the end of the engagement. In INTDEV’s versioned S3 buckets every stored version of a file is deleted, not just the current one, and the trash or deleted items of every tool that keeps them are emptied.',
              'Each team member and contractor who worked on the engagement confirms in writing that they hold no copy. Anyone who leaves the engagement or INTDEV before it ends is reminded in writing that they may not download, keep, or use the client’s data, and makes the same confirmation.',
              'INTDEV keeps only what the agreement or the law requires, such as the signed agreement, purchase orders, and invoices, which hold no designs or research. Copies inside a vendor’s own backups expire on that vendor’s schedule, and INTDEV never restores them.',
              'The CEO closes the record with the date of each deletion. On request, the CEO, an officer of INTDEV, confirms the deletion to the client in a signed certificate of destruction.',
            ]}
          />
          <p>Closeout records name the client, so they are Restricted under the Data Management Policy, and each is available to its client on request.</p>
        </Group>
      </Section>
      <Section title="Microsoft Supplier Data Protection Requirements">
        <Group>
          <p>{`Each requirement below is numbered as it appears in INTDEV’s SSPA assessment and in version 12 of Microsoft’s Supplier Data Protection Requirements, with what Microsoft requires, how INTDEV meets it, where the evidence is, and anything that is not yet in place. Of the ${countWord(SUPPLIER_REQUIREMENTS.length)} requirements, ${countWord(complete)} ${complete === 1 ? 'has' : 'have'} nothing outstanding. An item not yet in place shows the owner’s decision and its date, or says that it is not yet decided. Section K of the requirements, for AI Systems, applies only to suppliers that provide or deploy AI Systems for Microsoft, and INTDEV’s assessment does not include it. The policies cited are Restricted and available to Microsoft under NDA from ${CONTACTS.support}.`}</p>
          <CheckTable columns={['Requirement', 'Status']} rows={SUPPLIER_REQUIREMENTS.map((requirement) => ({ checked: requirement.open.length === 0, cells: [`${requirement.id}. ${requirement.title}`, requirementStatus(requirement)] }))} />
        </Group>
      </Section>
      {SUPPLIER_REQUIREMENTS.map((requirement) => (
        <Section key={requirement.id} title={`Requirement ${requirement.id}: ${requirement.title}`}>
          <Fields
            items={[
              ['Microsoft requires', requirement.requires],
              ['How INTDEV meets it', <List key="meets" items={requirement.meets} />],
              ['Evidence', <Links key="evidence" items={requirement.evidence} />],
              ['Not yet in place', requirement.open.length ? <List key="open" items={requirement.open} /> : 'Nothing outstanding.'],
              ...(requirement.answer ? [['SSPA answer', `${requirement.answer.response}. Comment: ${requirement.answer.comment}`] as [string, React.ReactNode]] : []),
            ]}
          />
        </Section>
      ))}
    </Document>
  );
}
