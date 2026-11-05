import Document from '@root/compliance/site/Document';

import { API_HOST, AWS_REGIONS, TEAM } from '@root/compliance/site/facts';
import { AccessRequestRecords, AwsIdentityRecord, InfrastructureChecks, SystemAccountRecords, TerminationRecords } from '@root/compliance/site/Evidence';
import { EVIDENCE_ENDPOINTS, SYSTEM_ACCOUNTS, TERMINATION_CHECKLIST } from '@root/compliance/site/records';
import { Fields, Group, List, Member, Members, Section, Table } from '@root/compliance/site/Blocks';

function endpointLink(path: string) {
  return <a href={`${API_HOST}${path}`}>{`${API_HOST.replace('https://', '')}${path}`}</a>;
}

const MATRIX_COLUMNS = ['Role', 'Email', 'Google Workspace', 'AWS', 'GitHub', 'INTDEV API admin', 'Render', 'Stripe', 'Vanta'];

const MATRIX = [
  ['Employee', 'Yes', 'Yes', '—', 'Yes', '—', '—', '—', 'Yes'],
  ['Member of Technical Staff (engineering)', 'Yes', 'Yes', 'By request', 'Yes', 'By request', 'By request', '—', 'Yes'],
  ['Product owner', 'Yes', 'Yes', 'By request', 'Yes', 'By request', 'Yes, own services', 'By request', 'Yes'],
  ['Management (CEO)', 'Yes', 'Yes', 'Yes (admin, MFA)', 'Yes (owner)', 'Yes', 'Yes (owner)', 'Yes (owner)', 'Yes (admin)'],
];

export function AccessControlProcedures() {
  return (
    <Document
      slug="access-control"
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
            'Onboarding opens an access request for the standard access in the person’s role: a record in the access register, proposed as a pull request.',
            'The system owner or the CEO approves the request by reviewing and merging it. Access starts no earlier than the official start date.',
            'An administrator creates a unique account, enforces MFA, and assigns the approved level. The INTDEV API publishes the record with the request, the approval, the assigned level, and the user_id, and checks the level against production on every read.',
          ]}
        />
      </Section>
      <Section title="Modifying a user">
        <List
          ordered
          items={['Any access beyond the role’s standard access needs a request in the access register and the system owner’s approval.', 'A change of role triggers an access review. Access the new role does not need is removed.', 'Changes are recorded in the access register and published by the INTDEV API.']}
        />
      </Section>
      <Section title="Removing a user">
        <List
          ordered
          items={[
            'Access is removed within 24 business hours of termination or the end of a contract. See the termination checklist.',
            'The termination record is added to the termination register by pull request. Once it is deployed, the INTDEV API refuses that account every staff grant based on an INTDEV email address, and checks its level and organization memberships against production on every read.',
            'User IDs are never reused.',
            'If a password is compromised, it is escalated to the CTO or CEO right away and changed.',
          ]}
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
      slug="access-reviews"
      title="Access reviews"
      summary="INTDEV reviews access to every in-scope system at least once a quarter, so that access stays limited to what each job requires. Any change a review requires is tracked to completion."
      controls={['Access reviews conducted']}
    >
      <Section title="Scope of every review">
        <List items={['AWS IAM users, access keys, and roles', 'Render workspace members and service access', 'GitHub organization members, teams, and repository admins', 'Google Workspace accounts', 'Stripe dashboard users', 'Vanta users', 'Platform admin (tier 100) accounts on the INTDEV API']} />
        <p>Every access request, approval, and assigned access level the review relies on is published by the INTDEV API at {endpointLink(EVIDENCE_ENDPOINTS.accessRequests)}, with each user_id and its live level.</p>
      </Section>
      <Section title="Q4 2026 review">
        <Fields
          items={[
            ['Date', 'November 4, 2026'],
            ['Reviewer', <Member key="reviewer" name="Jimmy Lee, CEO" />],
            ['AWS method', `Read-only listing of IAM users, MFA devices, access keys, and roles in the account monitored by Vanta (${AWS_REGIONS.join(', ')} for regional controls)`],
            ['Render method', 'Read-only Render API listing of workspace members, their roles, and MFA status'],
            ['INTDEV API method', 'Read-only query of platform admin (level 100) accounts in the production users table'],
            ['Access register', endpointLink(EVIDENCE_ENDPOINTS.accessRequests)],
          ]}
        />
        <AwsIdentityRecord />
        <InfrastructureChecks ids={['aws-console-mfa', 'aws-owners']} />
        <List
          items={[
            'Result: one human administrator account, with MFA, and five programmatic service users that have never signed in to the console. The root account has MFA. The IAM password policy requires at least 14 characters including symbols.',
            'Ownership: every IAM user, the vanta-auditor role, and all seven S3 buckets carry the VantaOwner tag naming j@internet.dev, the account owner, so Vanta assigns each one to a person. The service users and buckets were tagged on November 4, 2026, and a read-only IAM and S3 listing confirmed every tag the same day.',
            'Follow-up 1, closed November 4, 2026: a read-only IAM read recorded when each access key was last used, and the CEO reviewed every identity and kept all of them. The table above is regenerated from the AWS read compiled into each INTDEV API release, so a new identity, a removed MFA device, or a missing owner tag shows up as an open item. The service users store images, such as those for blog posts, and none can sign in to the console.',
            'Follow-up 2: record GitHub, Google Workspace, Stripe, and Vanta memberships against the current roster, and remove former team members. Owner: Jimmy Lee. Due: December 4, 2026.',
            'INTDEV API: two former team members still held platform admin. Both were lowered to level 20 on November 4, 2026. A third never held admin and stays at level 10, the level the account had before the review. All three are verified live in the access register and the termination records.',
            'INTDEV API organizations: re-checking termination found one former team member still an organization admin of internet.dev and events.internet.dev, and another still a member of internet.dev. Those three memberships were removed at 03:58 UTC on November 4, 2026. On the CEO’s instruction, four more memberships of former team members in organizations outside INTDEV’s domains (three shared with current team members, one not) were removed at 04:29 UTC. The termination checklist now includes this step, and the live termination record checks it on every load.',
            'INTDEV API email-domain grants: an @internet.dev address on a former team member’s account still qualified it for staff grants (Vmax Public access management and organization waitlists). From INTDEV API 2.0.9 the API refuses those grants to every account in the termination register.',
            'Render: a former team member was still listed as a workspace Developer. The CEO removed the membership on November 4, 2026, a Render API read of workspace members confirmed it the same day, and termination record TR-2026-001 is closed. MFA is not yet enforced for every workspace member; enforcement is due November 18, 2026. Owner: Jimmy Lee.',
            'INTDEV API platform admin census, closed November 4, 2026: 13 accounts held platform admin. Six belong to people in the access register, and the treasury was already a documented system account. The other six were settled the same day: Xiangan He, who quit INTDEV in April 2025, was lowered to level 10 and removed from analytics.page and internet.dev under termination record TR-2026-004; a second account of Elijah Seed Arita was registered to him in the access register; three accounts (blogs, caladbolg, and intdev_vendors) were documented as system accounts with an owner and a purpose; and the southparkcommons example account was documented as a system account and lowered to level 30. Platform admin is now held by 11 accounts: 7 registered to people and 4 documented system accounts. The compliance report recounts them live against both registers on every load.',
          ]}
        />
      </Section>
      <Section title="System accounts">
        <Group>
          <p>Accounts on the INTDEV API that belong to no one person. Each has a named owner, a documented purpose, and a documented level, and the INTDEV API checks that level against the production users table every time {endpointLink(EVIDENCE_ENDPOINTS.accessRequests)} loads. {SYSTEM_ACCOUNTS.filter((record) => record.level >= 100).length} hold platform admin because the system they serve requires it; the compliance report counts any platform admin account in neither this register nor the access register as open.</p>
          <SystemAccountRecords />
        </Group>
      </Section>
      <Section title="Cadence">
        <Table columns={['Quarter', 'Due', 'Status']} rows={[['Q4 2026', 'December 31, 2026', 'In progress: the AWS and INTDEV API reviews closed November 4, 2026; Render MFA enforcement (due November 18, 2026) and follow-up 2 (due December 4, 2026) remain open'], ['Q1 2027', 'March 31, 2027', 'Scheduled'], ['Q2 2027', 'June 30, 2027', 'Scheduled'], ['Q3 2027', 'September 30, 2027', 'Scheduled']]} />
      </Section>
    </Document>
  );
}

export function AccessTermination() {
  return (
    <Document
      slug="access-termination"
      title="Access revoked upon termination"
      summary="When an employee, partner, or contractor leaves, a termination checklist revokes all of their access within 24 business hours, the SLA in the Access Control Policy. The completed checklists for recent departures are published by the INTDEV API, with each step’s status, completion time, and evidence."
      controls={['Access revoked upon termination']}
    >
      <Section title="Termination checklist">
        <Group>
          <List ordered items={TERMINATION_CHECKLIST.map((step) => `${step}.`)} />
          <p>Every step must be complete within 24 business hours of the last day.</p>
        </Group>
      </Section>
      <Section title="Termination records">
        <Group>
          <p>Each record below is served by {endpointLink(EVIDENCE_ENDPOINTS.terminations)}. Steps marked verified in system were checked against the system itself: the production users table, INTDEV’s organizations on the INTDEV API, the Render API, and AWS IAM. Every one of those was re-checked for every record at 09:49 UTC on November 4, 2026, when this page was last updated. Steps marked attested were confirmed complete by the CEO on November 4, 2026. Removals that missed the 24-hour SLA were found in the Q4 2026 access review or in that re-check, and are recorded with the time they were actually completed.</p>
          <p>The access checks are not a copy of the checklist. The INTDEV API runs them against production every time the record loads: the account’s level, its memberships in INTDEV organizations (INTDEV’s own domains and every organization a current team member belongs to), and whether the API refuses it staff grants based on an INTDEV email address. Render workspace membership comes from the Render API read made on a maintainer machine before the serving release was built and compiled into it; the running API holds no Render key. Naming a person in this register is itself a revocation: from INTDEV API 2.0.9, an account in the register is refused every grant that comes from an @internet.dev address, even though the account keeps that address.</p>
          <TerminationRecords />
        </Group>
      </Section>
      <Section title="Current roster">
        <p>
          <Members names={TEAM.map((person) => person.name)} />.
        </p>
      </Section>
    </Document>
  );
}

export function AccessRequests() {
  return (
    <Document
      slug="access-requests"
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
        <p>Requests are made as a pull request that adds a record to the access register, so the request, the approver’s review, and the merge are kept together in GitHub. Render deploys the register, and the INTDEV API serves it at {endpointLink(EVIDENCE_ENDPOINTS.accessRequests)}.</p>
      </Section>
      <Section title="Access request records">
        <Group>
          <p>Every current grant of access to the INTDEV API, and every recent revocation, with the request, the approval, the assigned access level, and the user_id it was granted to. The live check re-reads the user_id’s level from the production users table each time the record loads, so a record that no longer matches production shows it.</p>
          <AccessRequestRecords />
        </Group>
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
    </Document>
  );
}
