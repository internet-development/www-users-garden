import Document from '@root/compliance/site/Document';
import ciCdDeploys from '@root/compliance/site/images/ci-cd-render-deploys.png';
import ciCdProject from '@root/compliance/site/images/ci-cd-render-project.png';
import internalCommunication1 from '@root/compliance/site/images/internal-communication-1.webp';
import internalCommunication2 from '@root/compliance/site/images/internal-communication-2.webp';

import { DeployFeed, StatusBoard } from '@root/compliance/site/Live';
import { Fields, Figure, Group, Links, List, Mail, People, Section, Table } from '@root/compliance/site/Blocks';
import { CONTACTS, TEAM } from '@root/compliance/site/facts';

export function TabletopExercise() {
  return (
    <Document
      title="Disaster recovery tabletop exercise: total compromise of the universal backend"
      summary="The INTDEV team walked through a total-loss scenario for the INTDEV API, the backend behind Users Garden, Terminal Graph accounts, and every other INTDEV product. The scenario is modeled on a comparable industry event, the claimed 2026 breach of PingCAP’s TiDB Cloud. This report records the exercise, how our plans performed, and the action items it produced."
      controls={['Business continuity and disaster recovery plans tested', 'Incident response plan tested']}
      owner="Jimmy Lee, Chief Executive Officer and Incident Manager"
    >
      <Section title="Exercise record">
        <Fields
          items={[
            ['Exercise date', 'November 4, 2026'],
            ['Format', 'Facilitated tabletop discussion with timed injects. No production systems were touched.'],
            ['Facilitator', 'Jimmy Lee (CEO, Incident Manager)'],
            ['Plans exercised', 'Business Continuity and Disaster Recovery Plan v1.0; Incident Response Plan v1.0, including Appendix D (AWS root account compromise)'],
            ['Systems in scope', 'INTDEV API (Render internet-apis, Oregon), its Render PostgreSQL database, Amazon S3 (us-west-2), Users Garden, the Terminal Graph site and account flows, GitHub, Cloudflare'],
            ['Participants', `${TEAM.length} of ${TEAM.length} team members; every participant acknowledged the scenario, worked through it, and signed off on the action items below`],
          ]}
        />
      </Section>

      <Section title="Source incident">
        <Group>
          <p>
            This scenario draws on a comparable industry event, not on an incident at INTDEV. In October 2026 the group calling itself FulcrumSec published a post about PingCAP Inc. and its managed TiDB Cloud database service on its own leak site (fulcrumsec.vg/pingcap). We cite the address as text and do not link it, because the site offers stolen data for download. Every claim below is the attacker’s and has not been independently verified. INTDEV did not access or download any of the leaked data.
          </p>
          <List
            items={[
              'The attackers claim they used cloud service-account keys and a cloud service principal committed to the victim’s own source repositories to build a persistent replication feed from the control-plane database.',
              'They claim the feed ran every six hours from September 8 to September 30, 2026, which is eighty-eight exports without a detection event, and that they took about 10.6 TB, including 413 private repositories.',
              'They claim customer console API keys were stored in plaintext, that a shared encryption library used a static initialization vector, and that customers’ production credentials sat in support tickets.',
              'They describe a staged public leak, with more releases promised and threats against named downstream customers. They describe theft, not destruction.',
            ]}
          />
          <p>We chose it because the INTDEV API is the same kind of system: one multi-tenant backend that holds accounts, API keys, and payment state for many products. Its failure modes are ours.</p>
        </Group>
      </Section>

      <Section title="Scenario and injects">
        <List
          ordered
          items={[
            'Inject 1, 09:00. A Render or cloud credential is found committed in a repository. We assume it has been valid for weeks.',
            'Inject 2, 09:20. The attacker has replicated the production PostgreSQL database on a schedule for three weeks. Nothing has alerted.',
            'Inject 3, 10:00. A leak site posts a sample of user records and API keys and threatens two customers by name.',
            'Inject 4, 10:40. Total disaster. The attacker deletes the production database and the S3 objects they can reach, and the Render service is redeployed from a tampered commit.',
            'Inject 5, 11:30. Recovery. Restore service, rotate everything, notify customers and partners, and prove the restored system is clean.',
          ]}
        />
      </Section>

      <Section title="How the plans performed">
        <Table
          columns={['Area', 'Result', 'Evidence']}
          rows={[
            ['Detection of cloud account abuse', 'Effective for AWS', 'GuardDuty runs in all four US regions and emails eng@internet.dev through EventBridge and SNS. VPC Flow Logs are kept for 365 days.'],
            ['Detection of database exfiltration', 'Gap', 'Render PostgreSQL has no alerting equivalent to GuardDuty. A scheduled export would not raise an alert.'],
            ['Database recovery', 'Effective', 'Point-in-time recovery is enabled on the production database (about seven days of history), so a restore can meet the one-hour RPO and four-hour RTO in Appendix B of the BC/DR plan.'],
            ['Deployment integrity', 'Effective', 'Render deploys only from the main branch on GitHub, and every deploy is recorded with its commit. A tampered release can be found and rolled back to a known commit.'],
            ['Credential rotation', 'Partially effective', 'Environment secrets live only in Render and maintainers’ local files. The cross-origin AES keys cannot be rotated without coordinating every consuming site, which slows containment.'],
            ['Customer communication', 'Effective', 'The status page, the changelog, and email from eng@internet.dev give the CEO the channels the plan requires. Breach determination stays with the CEO and counsel.'],
            ['Credential storage', 'Gap', 'The PingCAP parallel showed that our credential storage and cross-origin encryption need hardening. Details are Confidential and tracked as INTDEV-2026-CRYPTO-01.'],
            ['Database network exposure', 'Gap', 'The database accepts TLS connections from more networks than it needs. Tracked as INTDEV-2026-NET-01.'],
          ]}
        />
      </Section>

      <Section title="Action items">
        <Table
          columns={['Action', 'Owner', 'Due']}
          rows={[
            ['Harden credential storage and cross-origin encryption (INTDEV-2026-CRYPTO-01), coordinated with consuming sites', 'Jimmy Lee', 'December 4, 2026'],
            ['Narrow the database network allow list (INTDEV-2026-NET-01)', 'Jimmy Lee', 'January 3, 2027'],
            ['Turn on secret scanning and push protection for every repository in the internet-development GitHub organization', 'Jimmy Lee', 'December 4, 2026'],
            ['Add alerts for unusual database connections and exports, and review Render audit logs monthly', 'Jimmy Lee', 'January 3, 2027'],
            ['Run a real backup restore of the production database into an isolated instance, time it against the RTO, and record the result', 'Jimmy Lee', 'December 18, 2026'],
            ['Write a credential-rotation runbook covering Render, AWS, Stripe, Mailgun, Twilio, OAuth clients, and the shared AES keys', 'Jimmy Lee', 'December 18, 2026'],
            ['Remind everyone never to paste customer credentials into GitHub Issues or Slack, and cover it in security awareness training', 'Jimmy Lee', 'November 18, 2026'],
          ]}
        />
      </Section>

      <Section title="Participants and acknowledgement">
        <People people={TEAM} note={() => 'Acknowledged the scenario, took part in the exercise, and signed off on the action items on November 4, 2026.'} />
      </Section>

      <Section title="Related">
        <Links
          items={[
            { label: 'Incident response plan test', href: '/compliance/incident-response-test' },
            { label: 'Backup and recovery', href: '/compliance/backups' },
            { label: 'Vulnerability scanning and remediation', href: '/compliance/vulnerability-scans' },
          ]}
        />
      </Section>
    </Document>
  );
}

export function ContinuousDeployment() {
  return (
    <Document
      title="CI/CD: production deployments"
      summary="Every change to the INTDEV API, Users Garden, the Terminal Graph site, and internet.dev ships through the same pipeline. A reviewed commit lands on main in GitHub, and Render builds it and releases it to production. Each table below is read from the Render API when you load this page."
      controls={['CI/CD system in use', 'Change management']}
    >
      <Section title="The CI/CD system">
        <Group>
          <Figure image={ciCdProject} alt="Render dashboard: the Internet Development Studio Company project, Production environment, with the internet-apis web service deployed on the Node runtime in Oregon." caption="Render, the CI/CD and hosting system. The Internet Development Studio Company project’s Production environment, with the internet-apis service deployed in Oregon." />
          <Figure image={ciCdDeploys} alt="Render dashboard: the internet-apis web service connected to GitHub internet-development/apis on branch main, live at commit 195333d, with deploys 2.0.8, 2.0.6, and 2.0.5, each triggered by auto-deploy, with durations and rollback controls." caption="The internet-apis service is connected to GitHub internet-development/apis, branch main. Each release (2.0.8, 2.0.6, 2.0.5) was built by auto-deploy from a commit and can be rolled back to. Captured November 4, 2026." />
        </Group>
      </Section>
      <Section title="Pipeline">
        <List
          ordered
          items={[
            'Work happens on a branch and goes through a GitHub pull request. Significant changes are reviewed and approved before merge, as the Secure Development Policy requires.',
            'Merging to main triggers Render automatically (auto-deploy on every commit). Maintainers can also start a manual deploy of a specific commit, or roll back to one.',
            'Render installs dependencies, builds (for the API: route prebuild, then next build), and starts the new version. Traffic moves to it only once it is up.',
            'Render releases only a build that passes. A failed build or release leaves the previous version serving, and the tables show it as failed.',
            'Every deploy is recorded with its ID, trigger, commit, and timestamps. That record is the evidence shown below.',
          ]}
        />
      </Section>
      <Section title="INTDEV API (api.internet.dev)">
        <DeployFeed service="internet-apis" />
      </Section>
      <Section title="Users Garden (users.garden)">
        <DeployFeed service="www-users-garden" />
      </Section>
      <Section title="Terminal Graph site (terminalgraph.com)">
        <DeployFeed service="terminalgraph" />
      </Section>
      <Section title="internet.dev">
        <DeployFeed service="www-internet-v3" limit={5} />
      </Section>
      <Section title="How to read the tables">
        <Group>
          <p>Release is the first line of the commit message and the short commit ID. INTDEV tags releases by version in the commit message, for example 2.0.6 for the API. Deployment IDs match the Render dashboard. A state of Succeeded, superseded means the deploy went live and a later release replaced it.</p>
          <p>
            The data comes from the public, read-only endpoint <a href="https://api.internet.dev/api/status/deploys">api.internet.dev/api/status/deploys</a>, which accepts a service name. It returns only these fields and is cached for 60 seconds.
          </p>
        </Group>
      </Section>
    </Document>
  );
}

export function StatusPage() {
  return (
    <Document
      title="Application status"
      summary="Live health of the INTDEV API, Users Garden, the Terminal Graph site, and internet.dev, plus how we tell customers about incidents and about critical changes that may affect their processing."
      controls={['System changes externally communicated', 'Support system available']}
    >
      <Section title="Current status">
        <StatusBoard />
      </Section>
      <Section title="How we communicate changes and incidents">
        <List
          items={[
            'Incidents that affect customers are posted here and on the changelog, and the CEO emails affected customers directly, as the BC/DR plan’s customer communication procedure requires.',
            'Critical changes that may affect how customers process data, such as API contract changes, authentication changes, deprecations, or a planned maintenance window, are announced at least 14 days in advance by email from eng@internet.dev and on the changelog. Emergency security fixes may ship immediately and are announced after release.',
            'Response shapes, permission levels, and rate-limit categories of the INTDEV API are published contracts in api.internet.dev/SKILL.md. Any change to them is documented there in the same release.',
            'Terminal Graph release notes are published for every beta at terminalgraph.com/changelog.',
          ]}
        />
      </Section>
      <Section title="Report a problem">
        <p>
          Email <Mail address={CONTACTS.support} /> for outages or failures, and <Mail address={CONTACTS.security} /> for security concerns.
        </p>
      </Section>
      <Section title="Related">
        <Links
          items={[
            { label: 'Changelog and release notes', href: '/compliance/changelog' },
            { label: 'CI/CD production deployments', href: '/compliance/ci-cd' },
            { label: 'Customer support', href: '/compliance/support' },
          ]}
        />
      </Section>
    </Document>
  );
}

export function Changelog() {
  return (
    <Document
      title="Changelog and release notes"
      summary="Where to find what changed in each INTDEV product. Terminal Graph publishes release notes for every build. The INTDEV API and Users Garden publish their release history directly from the deployment pipeline."
      controls={['Public change log or release notes', 'System changes externally communicated', 'External support resources available']}
    >
      <Section title="Terminal Graph">
        <Group>
          <p>Terminal Graph’s release notes are at terminalgraph.com/changelog. Every public beta is listed there, newest first, and the in-app updater reads the same releases from the Sparkle appcast.</p>
          <Links items={[{ label: 'terminalgraph.com/changelog', href: 'https://terminalgraph.com/changelog' }]} />
        </Group>
      </Section>
      <Section title="INTDEV API releases">
        <DeployFeed service="internet-apis" />
      </Section>
      <Section title="Users Garden releases">
        <DeployFeed service="www-users-garden" limit={6} />
      </Section>
      <Section title="Contract changes">
        <p>
          Changes to API routes, response shapes, permissions, rate limits, and token costs are documented in the published API guide at <a href="https://api.internet.dev/SKILL.md">api.internet.dev/SKILL.md</a>, in the same release that changes them.
        </p>
      </Section>
    </Document>
  );
}

export function Backups() {
  return (
    <Document
      title="Backup and recovery"
      summary="How INTDEV backs up and recovers customer data for the INTDEV API, Users Garden, and Terminal Graph accounts, under the Information Backup section of the Operations Security Policy and the RTO and RPO targets in the BC/DR plan."
      controls={['Backup processes established']}
    >
      <Section title="Requirements">
        <List
          items={[
            'Back up systems, databases, and customer data on a regular schedule. In-scope systems back up daily.',
            'Protect backups according to the sensitivity of the data. Backups are encrypted.',
            'Store backups separately from the production data location, in another region or availability zone.',
            'Test backup and restore at least once a year, and record the result.',
            'Log or ticket every restore of production data that contains PII.',
            'INTDEV does not back up laptops. Staff keep business files in company-approved cloud storage.',
          ]}
        />
      </Section>
      <Section title="Implementation">
        <Table
          columns={['Data', 'System', 'Backup', 'Objective']}
          rows={[
            ['Accounts, organizations, credits, orders, licenses, posts, documents', 'Render PostgreSQL “INTDEV DATA” (Pro plan, Oregon, PostgreSQL 15)', 'Render point-in-time recovery, enabled and available, with about seven days of continuous history. Render manages the backups outside the primary instance.', 'RPO 1 hour, RTO 4 hours (BC/DR Appendix B, INTDEV API and INTDEV Auth)'],
            ['User uploads and private attachments', 'Amazon S3, us-west-2', 'S3 stores every object redundantly across at least three availability zones (eleven nines of durability).', 'Inherited from the AWS S3 SLA'],
            ['Source code and infrastructure configuration', 'GitHub', 'Distributed: every maintainer holds a full clone, and Render can redeploy any recorded commit.', 'Inherited from the GitHub SLA'],
            ['Terminal Graph user content', 'The user’s Mac', 'Stays on the device. Terminal Graph keeps local workspace history (Restore Earlier Version).', 'Not held by INTDEV'],
          ]}
        />
      </Section>
      <Section title="Restore procedure">
        <List
          ordered
          items={[
            'The Incident Manager declares a restore and opens a GitHub issue to track it. Restores of PII are always ticketed.',
            'In Render, recover the database to a new instance at the chosen point in time, before the corruption or deletion.',
            'Check row counts and recent records against the incident timeline, then point the API at the recovered instance and redeploy.',
            'Rotate the database credential and update the Render environment.',
            'Record the recovery point, how long each step took, and any data loss in the ticket, then review it against the RTO and RPO.',
          ]}
        />
      </Section>
      <Section title="Testing">
        <p>Restore capability was reviewed during the November 4, 2026 tabletop exercise. Point-in-time recovery was confirmed available, with history starting October 27, 2026. A full restore into an isolated instance is scheduled for December 18, 2026, and its timed result will be added here.</p>
      </Section>
    </Document>
  );
}

export function InternalChangeCommunication() {
  return (
    <Document
      title="Internal communication of system changes"
      summary="How INTDEV tells its own team about system changes before and after they reach production."
      controls={['System changes communicated']}
    >
      <Section title="Channels">
        <Table
          columns={['Change', 'Where it is communicated', 'Who sees it']}
          rows={[
            ['Every code change', 'A GitHub pull request with its description, review, and approval; the merge commit is the release note', 'Everyone with access to the repository'],
            ['Every production deploy', 'Render records each deploy with its commit and can notify maintainers when a deploy fails. The history is mirrored on the CI/CD page.', 'Maintainers; the whole team through the CI/CD page'],
            ['Architecture, routes, permissions, rate limits, tables, workers, scripts', 'The repository’s AGENTS.md and published skills, updated in the same change', 'Engineers and the agents working in the repositories'],
            ['Planned work and handoffs', 'Each repository’s NEXT.md control file, which records the selected task, its evidence, and what remains', 'Engineers'],
            ['Production system activity and updates', 'Slack channels where INTDEV systems post each production run and its result, with the team’s discussion in the thread (screenshots below)', 'The whole team'],
            ['Incidents and security changes', 'The incident war room in Slack and the incident ticket in GitHub Issues, as the Incident Response Plan requires', 'The incident response team and executive staff'],
            ['Policy changes', 'Vanta policy versions with approval, then announced to the team', 'All personnel, who acknowledge them'],
          ]}
        />
      </Section>
      <Section title="Internal communication channel in use">
        <Group>
          <p>The team works in the Internet Development Studio Company Slack workspace. Production systems post their own activity to channels, and staff discuss each change in the thread under it. The screenshots below are from the #ask-queries channel in September and October 2026: an INTDEV application posts every production run with its result, and staff review the update and sign off in the thread.</p>
          <Figure image={internalCommunication1} alt="Slack, Internet Development Studio Company workspace, #ask-queries channel: application posts for production runs on October 14, 17, and 21, 2026, with their results and a thread showing each query step. A customer email address is redacted." caption="Slack #ask-queries, October 2026. Each production run is posted with its status, and the thread records each step. A client customer’s email address is redacted." />
          <Figure image={internalCommunication2} alt="Slack #ask-queries channel, September 17, 2026: production runs requested by staff, with a thread in which Hannah Suh shares a screenshot of the change and Sol Ruck replies that it looks good." caption="Slack #ask-queries, September 2026. Staff discuss a system update in the thread and confirm it before it is relied on." />
        </Group>
      </Section>
      <Section title="Expectations">
        <List
          items={[
            'Changes with significant impact are described before deployment: purpose, impact, dependencies, and deployment plan, as the Operations Security Policy requires.',
            'Emergency changes may ship first, and are then described and reviewed in the pull request or incident ticket.',
            'Recent production changes are always visible on the CI/CD page.',
          ]}
        />
      </Section>
      <Section title="Related">
        <Links items={[{ label: 'CI/CD production deployments', href: '/compliance/ci-cd' }]} />
      </Section>
    </Document>
  );
}

export function IncidentResponseTest() {
  return (
    <Document
      title="Incident response plan test"
      summary="INTDEV tests its Incident Response Plan at least once a year. The 2026 test was the November 4, 2026 tabletop exercise, which ran a full compromise of the INTDEV API through every phase of the plan."
      controls={['Incident response plan tested']}
    >
      <Section title="2026 test">
        <Fields
          items={[
            ['Date', 'November 4, 2026'],
            ['Plan version', 'Incident Response Plan v1.0 (effective September 26, 2026)'],
            ['Method', 'Tabletop exercise with timed injects'],
            ['Participants', `All ${TEAM.length} team members`],
            ['Report', <a key="report" href="/compliance/tabletop-exercise">Disaster recovery tabletop exercise report</a>],
            ['Next test', 'By November 2027'],
          ]}
        />
      </Section>
      <Section title="Plan phases exercised">
        <Table
          columns={['Phase', 'Exercised by', 'Outcome']}
          rows={[
            ['Report and triage', 'A leaked credential reported to security@internet.dev and classified as P0 (active exploitation)', 'Severity and escalation to the CEO were immediate and correct'],
            ['Investigation', 'Tracing database replication and reviewing GuardDuty findings and VPC Flow Logs', 'Showed that the database has no exfiltration alerting (action item)'],
            ['Containment', 'Rotating credentials, suspending access, and opening the Slack war room', 'Rotating the shared AES keys requires coordinating every consuming site (action item)'],
            ['Recovery', 'Point-in-time database restore and redeploy of a known commit', 'Fits the one-hour RPO and four-hour RTO'],
            ['Breach determination and notice', 'CEO and counsel decided on customer notice, using the status page and email', 'Roles were clear; notices go out without undue delay'],
            ['Lessons learned', 'Root cause analysis and action items', 'Seven action items with owners and due dates'],
          ]}
        />
      </Section>
      <Section title="Reporting an incident">
        <p>
          Anyone who sees a security event or incident reports it to <Mail address={CONTACTS.security} /> right away.
        </p>
      </Section>
    </Document>
  );
}
