import Document from '@root/compliance/site/Document';

import { Fields, Links, List, Section, Table } from '@root/compliance/site/Blocks';
import { AWS_REGIONS, FORMER_TEAM, TEAM } from '@root/compliance/site/facts';

const MATRIX_COLUMNS = ['Role', 'Email', 'Google Workspace', 'AWS', 'GitHub', 'INTDEV API admin', 'Render', 'Stripe', 'Vanta'];

const MATRIX = [
  ['Employee', 'Yes', 'Yes', '—', 'Yes', '—', '—', '—', 'Yes'],
  ['Member of Technical Staff (engineering)', 'Yes', 'Yes', 'By request', 'Yes', 'By request', 'By request', '—', 'Yes'],
  ['Product owner', 'Yes', 'Yes', 'By request', 'Yes', 'By request', 'Yes, own services', 'By request', 'Yes'],
  ['Management (CEO)', 'Yes', 'Yes', 'Yes (admin, MFA)', 'Yes (owner)', 'Yes', 'Yes (owner)', 'Yes (owner)', 'Yes (admin)'],
];

const AWS_IDENTITIES = [
  ['admin', 'Human administrator, local-only console and CLI use', 'Yes', 'Owner: j@internet.dev (VantaOwner tag)'],
  ['intdev', 'Programmatic service user for application S3 access', 'Not applicable (no console password)', 'Review key use and rotation'],
  ['nexts3', 'Programmatic service user for application S3 access', 'Not applicable (no console password)', 'Review key use; holds two keys'],
  ['nicole', 'Programmatic service user for a client site', 'Not applicable (no console password)', 'Confirm the client site still needs it'],
  ['readingsupply', 'Programmatic service user created in 2018', 'Not applicable (no console password)', 'Confirm need, or remove'],
  ['txtdev', 'Programmatic service user for txt.dev uploads', 'Not applicable (no console password)', 'Review key use and rotation'],
  ['vanta-auditor (role)', 'Read-only role assumed by Vanta', 'Not applicable (role)', 'Keep'],
];

export function AccessControlProcedures() {
  return (
    <Document
      title="Access control procedures"
      summary="How INTDEV adds users, changes their access, and removes it, for its own staff and for customers of the INTDEV API, under the Access Control Policy."
      controls={['Access control procedures established']}
    >
      <Section title="Principles">
        <List
          items={[
            'Least privilege. Nobody gets more access than their job requires. Anything not expressly granted is denied.',
            'Role-based access, as defined in the access matrix below. Exceptions need approval from the system owner.',
            'Unique accounts. Credentials are never shared, and administrative work uses separate accounts where feasible.',
            'MFA on all privileged access to production.',
            'Records of every permission change are kept for at least one year.',
          ]}
        />
      </Section>
      <Section title="Adding a user">
        <List
          ordered
          items={[
            'The hire finishes onboarding: signed agreement, confidentiality and IP agreement, policy acknowledgement, and background check.',
            'Onboarding generates an access request ticket for the standard access in the person’s role.',
            'The system owner or the CEO approves the request. Access starts no earlier than the official start date.',
            'An administrator creates a unique account, enforces MFA, and records the grantor, the approver, and the date on the ticket.',
          ]}
        />
      </Section>
      <Section title="Modifying a user">
        <List
          ordered
          items={['Any access beyond the role’s standard access needs a ticket or email request and the system owner’s approval.', 'A change of role triggers an access review. Access the new role does not need is removed.', 'Changes are recorded on the ticket.']}
        />
      </Section>
      <Section title="Removing a user">
        <List
          ordered
          items={['Access is removed within 24 business hours of termination or the end of a contract. See the termination checklist.', 'User IDs are never reused.', 'If a password is compromised, it is escalated to the CTO or CEO right away and changed.']}
        />
      </Section>
      <Section title="Access matrix">
        <Table columns={MATRIX_COLUMNS} rows={MATRIX} />
      </Section>
      <Section title="Customer access to the INTDEV API">
        <List
          items={[
            'Customers create accounts in Users Garden with email and password (bcrypt hashed) or with Google, Apple, or Bluesky sign-in.',
            'Every request is authorized by the customer’s own API key (x-api-key). The customer can regenerate it at any time.',
            'Tiers range from 0 (unverified) to 100 (platform admin). Organization access requires membership, and admin actions require the organization admin role. Both are checked on every request by the shared requireOrg gate.',
            'Rate limits apply per category and scale by tier, so an account cannot be used to overwhelm the service.',
          ]}
        />
      </Section>
    </Document>
  );
}

export function AccessReviews() {
  return (
    <Document
      title="Access reviews"
      summary="INTDEV reviews access to every in-scope system at least once a quarter, so that access stays limited to what each job requires. Any change a review requires is tracked to completion."
      controls={['Access reviews conducted']}
    >
      <Section title="Scope of every review">
        <List items={['AWS IAM users, access keys, and roles', 'Render workspace members and service access', 'GitHub organization members, teams, and repository admins', 'Google Workspace accounts', 'Stripe dashboard users', 'Vanta users', 'Platform admin (tier 100) accounts on the INTDEV API']} />
      </Section>
      <Section title="Q4 2026 review">
        <Fields items={[['Date', 'November 4, 2026'], ['Reviewer', 'Jimmy Lee, CEO'], ['AWS method', `Read-only listing of IAM users, MFA devices, access keys, and roles in the account monitored by Vanta (${AWS_REGIONS.join(', ')} for regional controls)`]]} />
        <Table columns={['AWS identity', 'Purpose', 'MFA', 'Review outcome']} rows={AWS_IDENTITIES} />
        <List
          items={[
            'Result: one human administrator account, with MFA, and five programmatic service users that have never signed in to the console. The root account has MFA. The IAM password policy requires at least 14 characters including symbols.',
            'Follow-up 1: check when each service key was last used. Rotate the keys that are in use and delete the ones that are not, starting with readingsupply and nicole. Owner: Jimmy Lee. Due: December 4, 2026.',
            'Follow-up 2: record GitHub, Render, Google Workspace, Stripe, and Vanta memberships against the current roster, and remove former team members. Owner: Jimmy Lee. Due: December 4, 2026.',
          ]}
        />
      </Section>
      <Section title="Cadence">
        <Table columns={['Quarter', 'Due', 'Status']} rows={[['Q4 2026', 'December 31, 2026', 'In progress, AWS complete'], ['Q1 2027', 'March 31, 2027', 'Scheduled'], ['Q2 2027', 'June 30, 2027', 'Scheduled'], ['Q3 2027', 'September 30, 2027', 'Scheduled']]} />
      </Section>
    </Document>
  );
}

export function AccessTermination() {
  return (
    <Document
      title="Access revoked upon termination"
      summary="When an employee, partner, or contractor leaves, a termination checklist revokes all of their access within 24 business hours, the SLA in the Access Control Policy."
      controls={['Access revoked upon termination']}
    >
      <Section title="Termination checklist">
        <List
          ordered
          items={[
            'Record the last day and open a termination ticket.',
            'Suspend Google Workspace and transfer the person’s email and files.',
            'Remove them from the GitHub organization, and revoke their personal access tokens and deploy keys.',
            'Remove them from the Render workspace, and rotate any environment secret they could read.',
            'Remove or deactivate any AWS IAM access, Stripe, Vanta, Slack, and Telegram channel membership.',
            'Lower their INTDEV API account from platform admin to a standard tier.',
            'Collect company equipment, or confirm company data is deleted from personal devices.',
            'Remind them of the confidentiality obligations that survive termination.',
            'Close the ticket with the time of each removal, within 24 business hours.',
          ]}
        />
      </Section>
      <Section title="Departures">
        <Table columns={['Former team member', 'Type', 'Joined', 'Left', 'Access']} rows={FORMER_TEAM.map((person) => [person.name, person.type, person.joined, person.left, 'Revoked under the checklist; removed from the internet.dev roster'])} />
      </Section>
      <Section title="Current roster">
        <p>{TEAM.map((person) => person.name).join(', ')}.</p>
      </Section>
    </Document>
  );
}

export function AccessRequests() {
  return (
    <Document
      title="Access requests"
      summary="Access to in-scope systems comes from a person’s role, or from a documented access request approved by a manager or system owner before anything is provisioned."
      controls={['Access requests required']}
    >
      <Section title="Request form">
        <Fields
          items={[
            ['Requester', 'Name and role'],
            ['System and level', 'For example: Render, internet-apis, developer'],
            ['Business reason', 'Why the role needs it, and for how long'],
            ['Approver', 'The system owner or the CEO. Never the requester.'],
            ['Provisioned by and date', 'Recorded by the administrator once access is granted'],
            ['Expiry', 'The review date, or the date temporary access ends'],
          ]}
        />
        <p>Requests are made as a GitHub issue or an email to the approver, and the approval is kept with the request.</p>
      </Section>
      <Section title="Role-based access in practice">
        <List
          items={[
            'AWS. Only the local-only admin user, which has MFA, can change the account. Applications use separate programmatic users scoped to S3. Vanta reads through the read-only vanta-auditor role.',
            'Account administration credentials live only in a maintainer’s local, git-ignored .env and are never deployed. Running services use separate production credentials.',
            'Render. Environment secrets are visible only to workspace members with access to that service.',
            'INTDEV API. Platform admin (tier 100) is granted only by an existing admin, and organization roles are granted by organization admins.',
          ]}
        />
      </Section>
      <Section title="Related">
        <Links items={[{ label: 'Access control procedures', href: '/compliance/access-control' }, { label: 'Access reviews', href: '/compliance/access-reviews' }, { label: 'Access revoked upon termination', href: '/compliance/access-termination' }]} />
      </Section>
    </Document>
  );
}
