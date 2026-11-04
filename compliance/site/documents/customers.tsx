import Document from '@root/compliance/site/Document';
import NetworkDiagram from '@root/compliance/site/NetworkDiagram';

import { Fields, Group, Links, List, Mail, Note, Section, Table } from '@root/compliance/site/Blocks';
import { COMPANY, CONTACTS, PRODUCTS, PUBLIC_TERMS, VENDORS } from '@root/compliance/site/facts';

export function DataDeletion() {
  return (
    <Document
      title="Customer data deleted on departure"
      summary="When customers leave, INTDEV removes their confidential data from the application environment. Customers can delete their own account at any time in Users Garden, and INTDEV deletes the rest within 30 days of a contract ending."
      controls={['Customer data deleted upon leaving']}
    >
      <Section title="Self-service deletion in Users Garden">
        <List
          ordered
          items={[
            'Sign in at users.garden and open the account danger zone.',
            'Cancel any active subscription first. Users Garden won’t delete an account that still has a live subscription, so nothing keeps billing after the account is gone.',
            'Choose Delete my account and type DELETE-THIS-ACCOUNT-NOW to confirm.',
            'Users Garden calls the INTDEV API’s POST /api/users/delete with the user’s own API key. The API accepts the request only from the account owner or a platform admin.',
            'The API permanently deletes the user’s row from the production database. This is a hard delete, not a soft delete. Records that depend on the account are cascaded or detached by the database’s foreign keys. If a dependent record would block the delete, the request fails without deleting anything partially, and support finishes the deletion by hand.',
          ]}
        />
      </Section>
      <Section title="What is removed and when">
        <Table
          columns={['Data', 'On account deletion', 'Retention ceiling']}
          rows={[
            ['Account, email, password hash, API key, profile data, SMS contact', 'Deleted immediately', '—'],
            ['Organization memberships and analytics project memberships', 'Deleted with the account (cascade)', '—'],
            ['Slide decks and assets the user created', 'Detached from the user by the database, then tombstoned by the slide cleanup worker', 'Per the slide retention rules'],
            ['Uploaded files in S3', 'Removed by support on request, or within 30 days of contract termination', '30 days'],
            ['Database backups (point-in-time recovery)', 'Age out of Render’s rolling recovery window', 'About 7 days'],
            ['API and security logs', 'Not deleted on request; kept for security', '90 days'],
            ['Financial records (invoices, transactions)', 'Kept to meet legal obligations', '7 years'],
            ['SMS opt-out records', 'Kept, so a deleted number is never texted again', 'As long as needed to honor the opt-out'],
          ]}
        />
      </Section>
      <Section title="Contract termination">
        <p>When an enterprise or API contract ends, INTDEV deletes the customer’s accounts and data within 30 days, as Appendix A of the Data Management Policy requires, and confirms by email on request. PII is also deleted when a consumer or data subject makes a verified request and no legal obligation requires keeping it.</p>
      </Section>
      <Section title="Ask for deletion">
        <p>
          Email <Mail address={CONTACTS.support} /> from the address on the account if you can’t sign in.
        </p>
      </Section>
    </Document>
  );
}

export function Support() {
  return (
    <Document
      title="Customer support"
      summary="How to get help with the INTDEV API, Users Garden, and Terminal Graph, and how to report failures, incidents, concerns, and complaints so they reach the right people."
      controls={['Customer support site or email alias', 'Support system available', 'External support resources available']}
    >
      <Section title="Contact">
        <Fields
          items={[
            ['Help and support', <Mail key="support" address={CONTACTS.support} />],
            ['Security issues and incidents', <Mail key="security" address={CONTACTS.security} />],
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
            'Sign in at users.garden with email and password, or with Google, Apple, or Bluesky. Password accounts verify their email first.',
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
          <Links items={[{ label: 'api.internet.dev/SKILL.md', href: 'https://api.internet.dev/SKILL.md' }, { label: 'Pricing and rate limits (api.internet.dev/api/credits/pricing)', href: 'https://api.internet.dev/api/credits/pricing' }]} />
        </Group>
      </Section>
    </Document>
  );
}

export function ServiceDescription() {
  return (
    <Document
      title="Service description and network diagram"
      summary="What INTDEV provides, how it is built, and how data moves between its components. The same description is shared with staff and customers."
      controls={['Service description communicated']}
    >
      <Section title="Products and services">
        <Table columns={['Product', 'What it does', 'Where it runs']} rows={PRODUCTS.map((product) => [<a key={product.url} href={product.url}>{product.name}</a>, product.description, product.hosting])} />
      </Section>
      <Section title="Network diagram">
        <NetworkDiagram />
      </Section>
      <Section title="Further reading">
        <Links items={[{ label: 'System description (SOC 2 Section III)', href: '/compliance/system-description' }, { label: 'Product documentation', href: '/compliance/documentation' }, { label: 'Security', href: '/compliance/security' }]} />
      </Section>
    </Document>
  );
}

export function SecurityInformation() {
  return (
    <Document
      title="Security at INTDEV"
      summary="The security commitments INTDEV makes to its customers, and how they are met across the INTDEV API, Users Garden, and Terminal Graph."
      controls={['Company commitments externally communicated']}
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
            'We notify affected customers of a breach without undue delay, as our contracts and the law require.',
          ]}
        />
      </Section>
      <Section title="Report a vulnerability">
        <p>
          Email <Mail address={CONTACTS.security} /> with the steps to reproduce. Please don’t access other customers’ data, degrade the service, or disclose the issue publicly before we’ve fixed it. We don’t take legal action against good-faith research that follows these rules.
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
            { label: 'Vendor management', href: '/compliance/vendor-management' },
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
      title="Master Services Agreement (template)"
      summary={`The template ${COMPANY.name} uses for enterprise and API customers. Security, confidentiality, and privacy commitments are in sections 4 through 7.`}
      controls={['Company commitments externally communicated', 'Third-party agreements established']}
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
        <p>INTDEV processes Customer Data only to provide the services and as Customer instructs, follows applicable privacy laws including the CCPA, and uses only the subprocessors listed on its vendor management page. INTDEV will notify Customer of a Security Incident affecting Customer Data without undue delay, and in any case within 72 hours of confirming it, and will cooperate with Customer’s response. On termination INTDEV will delete Customer Data within 30 days, unless law requires otherwise, and will certify the deletion on request.</p>
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
            ['Relationship owner', 'Jimmy Lee'],
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
      title="Vendor management program"
      summary="How INTDEV picks, contracts with, and reviews the vendors behind its services: an inventory of critical vendors, the security and privacy requirements they must meet, and a review at least once a year."
      controls={['Vendor management program established', 'Third-party agreements established']}
    >
      <Section title="Vendor inventory">
        <Table columns={['Vendor', 'Service', 'Criticality', 'Data', 'Owner']} rows={VENDORS.map((vendor) => [vendor.name, vendor.service, vendor.criticality, vendor.data, vendor.owner])} />
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
          rows={VENDORS.filter((vendor) => vendor.criticality === 'Critical').map((vendor) => [vendor.name, 'November 4, 2026', 'Approved. Agreement, security documentation, and service performance reviewed.', 'November 2027'])}
        />
        <p>High and Moderate vendors are reviewed when their contract renews, or at least every two years, and sooner after any material change or incident.</p>
      </Section>
    </Document>
  );
}
