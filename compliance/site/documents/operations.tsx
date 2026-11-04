import Document from '@root/compliance/site/Document';
import ciCdDeploys from '@root/compliance/site/images/ci-cd-render-deploys.png';
import ciCdProject from '@root/compliance/site/images/ci-cd-render-project.png';
import internalCommunication1 from '@root/compliance/site/images/internal-communication-1.webp';
import internalCommunication2 from '@root/compliance/site/images/internal-communication-2.webp';

import { DeployFeed, StatusBoard } from '@root/compliance/site/Live';
import { ReleaseChecks } from '@root/compliance/site/Evidence';
import { CheckTable, Fields, Figure, Group, Links, List, Mail, Member, People, Section, Table } from '@root/compliance/site/Blocks';
import { CONTACTS, FORMER_TEAM, TEAM } from '@root/compliance/site/facts';
import { ALL_TERMINATIONS_VERIFIED_AT, DOMAIN_GRANT_BLOCK_RELEASE, EVIDENCE_ENDPOINTS, LEVEL_RESTORED_AT, ORGANIZATIONS_REMOVED_AT, PLATFORM_ADMINS_SETTLED_AT, RECORDED_AT, RENDER_REMOVAL_VERIFIED_AT, SHARED_ORGANIZATIONS_REMOVED_AT, TERMINATION_CHECKLIST, TERMINATIONS, TERMINATIONS_REVERIFIED_AT } from '@root/compliance/site/records';

const OWNER = <Member name="Jimmy Lee" />;

export function TabletopExercise() {
  return (
    <Document
      slug="tabletop-exercise"
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
            ['Facilitator', <Member key="facilitator" name="Jimmy Lee (CEO, Incident Manager)" />],
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
            ['Harden credential storage and cross-origin encryption (INTDEV-2026-CRYPTO-01), coordinated with consuming sites', OWNER, 'December 4, 2026'],
            ['Narrow the database network allow list (INTDEV-2026-NET-01)', OWNER, 'January 3, 2027'],
            ['Turn on secret scanning and push protection for every repository in the internet-development GitHub organization', OWNER, 'December 4, 2026'],
            ['Add alerts for unusual database connections and exports, and review Render audit logs monthly', OWNER, 'January 3, 2027'],
            ['Run a real backup restore of the production database into an isolated instance, time it against the RTO, and record the result', OWNER, 'December 18, 2026'],
            ['Write a credential-rotation runbook covering Render, AWS, Stripe, Mailgun, Twilio, OAuth clients, and the shared AES keys', OWNER, 'December 18, 2026'],
            ['Remind everyone never to paste customer credentials into GitHub Issues or Slack, and cover it in security awareness training', OWNER, 'November 18, 2026'],
          ]}
        />
      </Section>

      <Section title="Participants and acknowledgement">
        <People people={TEAM} note={() => 'Acknowledged the scenario, took part in the exercise, and signed off on the action items on November 4, 2026.'} />
      </Section>

    </Document>
  );
}

export function ContinuousDeployment() {
  return (
    <Document
      slug="ci-cd"
      title="CI/CD: production deployments"
      summary="Every change to the INTDEV API, Users Garden, the Terminal Graph site, and internet.dev ships through the same pipeline. A reviewed commit lands on main in GitHub, and Render builds it and releases it to production. Each table below is the Render API read made on a maintainer machine before the serving INTDEV API release was built; a deploy after that read, including the release’s own, appears with the next release."
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
            'Render installs a fresh resolution of package.json (no lockfile is committed), builds, and starts the new version. For the API, npm run build regenerates the route manifest, runs the build scan described below, then runs next build. Traffic moves to the new version only once it is up.',
            'The INTDEV API’s automated tests run on maintainers’ machines, not in Render’s build: npm test runs the Vitest specs, which hold the permission boundaries, the compliance registers, and the device check contract, and separate integration suites run the slides, Vmax Public access, SMS, and device check-in routes against a temporary embedded PostgreSQL with synthetic accounts only.',
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
      <Section title="Release scans">
        <Group>
          <p>Every production build of the INTDEV API runs a build scan, and every instance that starts the release runs a launch scan: the build stamp, required configuration, encryption, token signing, the database, the compliance registers, revoked access for former team members, and the evidence routes. Each result is written to the Render log and published here.</p>
          <ReleaseChecks />
        </Group>
      </Section>
      <Section title="How to read the tables">
        <Group>
          <p>Release is the first line of the commit message and the short commit ID. INTDEV tags releases by version in the commit message, for example 2.0.6 for the API. Deployment IDs match the Render dashboard. A state of Succeeded, superseded means the deploy went live and a later release replaced it.</p>
          <p>
            The data comes from the public, read-only endpoint <a href="https://api.internet.dev/api/status/deploys">api.internet.dev/api/status/deploys</a>, which accepts a service name. It returns only these fields, from the Render API read made on a maintainer machine before the serving INTDEV API release was built and compiled into it. The running API holds no Render key and never calls Render, so a deploy made after that read appears with the next release.
          </p>
        </Group>
      </Section>
    </Document>
  );
}

export function StatusPage() {
  return (
    <Document
      slug="status"
      title="Application status"
      summary="Live health of the INTDEV API, Users Garden, the Terminal Graph site, and internet.dev, plus how we tell customers about incidents and about critical changes that may affect their processing."
      controls={['System changes externally communicated', 'Support system available']}
    >
      <Section title="Current status">
        <StatusBoard />
      </Section>
      <Section title="Release scans">
        <Group>
          <p>Every production build of the INTDEV API runs a build scan, and every instance that starts the release runs a launch scan: the build stamp, required configuration, encryption, token signing, the database, the compliance registers, revoked access for former team members, and the evidence routes. Each result is written to the Render log and published here.</p>
          <ReleaseChecks limit={5} />
        </Group>
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
    </Document>
  );
}

export function Changelog() {
  return (
    <Document
      slug="changelog"
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
      <Section title="Release scans">
        <Group>
          <p>Every production build of the INTDEV API runs a build scan, and every instance that starts the release runs a launch scan: the build stamp, required configuration, encryption, token signing, the database, the compliance registers, revoked access for former team members, and the evidence routes. Each result is written to the Render log and published here.</p>
          <ReleaseChecks />
        </Group>
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
      slug="backups"
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
            ['User uploads and private attachments', 'Amazon S3, us-west-2', 'S3 stores every object redundantly across at least three availability zones (eleven nines of durability). The intdev-global and txtdev buckets, which hold customer uploads, are versioned: an overwritten or deleted object can be restored for 7 days, after which S3 deletes the old version.', 'Inherited from the AWS S3 SLA; 7 days to restore an overwritten or deleted object'],
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
      slug="internal-change-communication"
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
    </Document>
  );
}

const INCIDENT_ID = 'INC-2026-001';

const utc = (value: string) => `${value.slice(11, 16)} UTC`;

const departure = (name: string) => FORMER_TEAM.find((person) => person.name === name)?.left ?? 'Not recorded';

const terminationRecords = TERMINATIONS.map((record) => `${record.id} (${record.person})`).join(', ');

export function IncidentReport() {
  return (
    <Document
      slug="incident-report"
      title={`Incident report and root cause analysis ${INCIDENT_ID}: former team members kept access after they left`}
      summary="On November 4, 2026, INTDEV’s quarterly access review found that people who had left INTDEV still held access to the INTDEV API and Render. This report records how the nonconformity was found, contained, and corrected, the root cause analysis, the corrective actions that keep it from recurring, and how their effectiveness is checked."
      controls={['Incident response plan tested', 'Access revoked upon termination', 'Nonconformity and corrective action (ISO 22301:2019 clause 10.1)']}
      owner="Jimmy Lee, Chief Executive Officer and Incident Manager"
      appliesTo="INTDEV API (api.internet.dev) accounts and organizations, and the Render workspace that deploys INTDEV’s services"
    >
      <Section title="Incident record">
        <Fields
          items={[
            ['Incident', INCIDENT_ID],
            ['Type', 'Security event and nonconformity with the Access Control Policy termination procedure, which requires all access removed within 24 business hours of departure'],
            ['Severity', 'P1 (High) under the Incident Response Plan: a weakness with a direct risk of exploitation, because platform admin and Render workspace access were held by people no longer at INTDEV. No exploitation was found.'],
            ['Detected', 'November 4, 2026, by Jimmy Lee (CEO) in the Q4 2026 access review'],
            ['Detection method', 'Read-only query of platform admin (level 100) accounts in the production users table, and a read-only Render API listing of workspace members'],
            ['Incident Manager', <Member key="manager" name="Jimmy Lee, Chief Executive Officer" />],
            ['Contained', `November 4, 2026, ${utc(ALL_TERMINATIONS_VERIFIED_AT)}, when every former account, including the fourth found by the platform admin follow-up, was verified with no access remaining`],
            ['Breach determination', 'Not a reportable breach. The CEO found no evidence that the retained access was used after departure. No customer, partner, or regulator notice was required.'],
            ['Status', 'Closed November 4, 2026. Corrective actions are in place; two follow-up actions are open and tracked below.'],
            ['Plans followed', 'Incident Response Plan v1.0; Access Control Policy v1.0 (termination procedure)'],
            ['Records', <a key="records" href="/compliance/access-termination">{`Termination records ${terminationRecords}`}</a>],
          ]}
        />
      </Section>

      <Section title="What happened">
        <Group>
          <p>Access granted to team members was not removed when they left. The access review found it in four accounts, the fourth through its follow-up on platform admin accounts outside the access register:</p>
          <Table
            columns={['Former team member', 'Departure', 'Access still held', 'Removed (November 4, 2026)']}
            rows={[
              ['Anastasiya Uraleva', departure('Anastasiya Uraleva'), 'INTDEV API platform admin (level 100); Render workspace Developer; organization admin of internet.dev and events.internet.dev; admin of elcap.xyz and item.market and member of diagram.page, organizations current team members also belong to', `Lowered to level 20 at ${utc(RECORDED_AT)}; Render removal verified at ${utc(RENDER_REMOVAL_VERIFIED_AT)}; INTDEV organizations at ${utc(ORGANIZATIONS_REMOVED_AT)}; shared organizations at ${utc(SHARED_ORGANIZATIONS_REMOVED_AT)}`],
              ['Chenyu Huang', departure('Chenyu Huang'), 'INTDEV API platform admin (level 100); organization admin of talkingheads.vision, an organization outside INTDEV', `Lowered to level 20 at ${utc(RECORDED_AT)}; organization at ${utc(SHARED_ORGANIZATIONS_REMOVED_AT)}`],
              ['Louanne Murphy', departure('Louanne Murphy'), 'Member of the internet.dev organization; never platform admin', `Organization at ${utc(ORGANIZATIONS_REMOVED_AT)}`],
              ['Xiangan He', departure('Xiangan He'), 'INTDEV API platform admin (level 100); organization admin of analytics.page; member of internet.dev', `Lowered to level 10, and both organizations removed, at ${utc(PLATFORM_ADMINS_SETTLED_AT)}`],
            ]}
          />
          <p>Anastasiya Uraleva kept her access for 116 days after she left, and Xiangan He, who quit in April 2025, kept platform admin for about 19 months. Only the month of his departure was recorded, and the departure dates of the other two were not recorded at all, which is itself part of the finding. A former team member’s account also kept its @internet.dev address, which still qualified it for staff grants that are based on email domain: Vmax Public access management and organization waitlists.</p>
          <p>A second nonconformity occurred during containment. The update that lowered the two former platform admins at {utc(RECORDED_AT)} also raised Louanne Murphy’s account from level 10 to level 20. It was restored to 10 at {utc(LEVEL_RESTORED_AT)}, 32 minutes later and before any monthly credit payout, which the adjutant worker makes to accounts at level 20 or above.</p>
        </Group>
      </Section>

      <Section title="Timeline">
        <Table
          columns={['When', 'Event']}
          rows={[
            ['April 2025', 'Xiangan He quits INTDEV. No termination checklist is run, and his account keeps platform admin.'],
            [departure('Anastasiya Uraleva'), 'Anastasiya Uraleva leaves INTDEV. No termination checklist is run, and her access stays in place.'],
            ['September 26, 2026', 'The Access Control Policy v1.0 takes effect, with the 24 business hour removal requirement. Departures before it are not re-checked.'],
            ['November 4, 2026', 'The Q4 2026 access review finds two former partners at platform admin and one former team member still a Render workspace Developer. The CEO, as Incident Manager, opens a termination record for each of the three former team members.'],
            [`November 4, ${utc(RECORDED_AT)}`, 'Both former platform admins are lowered to level 20 in production. The same update raises Louanne Murphy’s account from 10 to 20.'],
            [`November 4, ${utc(RENDER_REMOVAL_VERIFIED_AT)}`, 'A Render API read of workspace members confirms that the CEO has removed the former team member from the Render workspace.'],
            [`November 4, ${utc(LEVEL_RESTORED_AT)}`, 'Louanne Murphy’s account is restored to level 10, its earlier level, before any credit payout.'],
            [`November 4, ${utc(ORGANIZATIONS_REMOVED_AT)}`, 'A re-check of every termination finds three memberships in INTDEV organizations (internet.dev and events.internet.dev). They are removed, and a read one second later finds none.'],
            [`November 4, ${utc(SHARED_ORGANIZATIONS_REMOVED_AT)}`, 'On the CEO’s instruction, four memberships of former team members in organizations outside INTDEV’s domains are removed: three shared with current team members, and one not.'],
            [`November 4, ${utc(TERMINATIONS_REVERIFIED_AT)}`, 'Every termination record is re-verified against the production users table, every INTDEV organization, the Render API, and AWS IAM (no IAM user exists for any of the three), and closed.'],
            [`INTDEV API ${DOMAIN_GRANT_BLOCK_RELEASE}`, 'The API refuses staff grants based on an INTDEV email address to every account in the termination register.'],
            [`November 4, ${utc(PLATFORM_ADMINS_SETTLED_AT)}`, 'The follow-up on platform admin accounts outside the access register finds a fourth former team member, Xiangan He, at platform admin, organization admin of analytics.page, and member of internet.dev. On the CEO’s instruction, one transaction lowers his account to level 10 and removes both memberships, and termination record TR-2026-004 is opened. The same transaction lowers the southparkcommons example account to level 30.'],
            [`November 4, ${utc(ALL_TERMINATIONS_VERIFIED_AT)}`, 'All four termination records are verified against the production users table, every INTDEV organization, the Render API, and AWS IAM. TR-2026-004 is closed.'],
          ]}
        />
      </Section>

      <Section title="Root cause analysis">
        <Group>
          <p>Method: a five-whys analysis from the event back to the process that allowed it, followed by a search for similar nonconformities in every system the termination checklist covers.</p>
          <Table
            columns={['Question', 'Finding']}
            rows={[
              ['Why did former team members keep access?', 'No termination checklist was run when they left.'],
              ['Why was no checklist run?', 'Before the Access Control Policy v1.0 took effect on September 26, 2026, INTDEV had no documented termination procedure, and adopting the policy did not trigger a re-check of earlier departures.'],
              ['Why would a checklist alone not have caught all of it?', `Access lived in four separate places with no per-person inventory: the INTDEV API account level, INTDEV API organization memberships, the Render workspace, and grants inferred from an @internet.dev address. The first checklist did not include organization memberships, so the re-check at ${utc(ORGANIZATIONS_REMOVED_AT)} still found them.`],
              ['Why did leaving not end the email-domain grants?', 'Some authorization was based on the account’s email domain alone, and an account keeps its company address after its owner leaves.'],
              ['Why did nothing detect it sooner?', 'Detection relied on the manual quarterly access review, and Q4 2026 was the first one under the policy. No automated check compared admin accounts or organization memberships with the current roster.'],
            ]}
          />
          <p>Root cause: removing access depended on people remembering every system, with no single register of who had left and no automated check that their access was gone.</p>
          <p>Root cause of the second nonconformity: the containment update set every former account to a fixed level (20) instead of lowering each account from its own previous level, and it was not checked against each account’s previous level before it ran.</p>
        </Group>
      </Section>

      <Section title="Similar nonconformities">
        <Group>
          <p>The review was widened from the accounts first found to every former team member and every system on the termination checklist. It confirmed that no former team member holds an AWS IAM user, a Render workspace membership, platform admin, or a membership in any INTDEV organization or any organization a current team member belongs to. It also opened related findings that could lead to the same failure:</p>
          <List
            items={[
              'Platform admin accounts not tied to a current team member. Of the six found, one belonged to Xiangan He, a former team member, who is now in the termination register (TR-2026-004). The other five were given named owners on November 4, 2026: a second account of a current team member in the access register, and four accounts in the system account register on the access reviews page, one of them lowered to level 30. Closed.',
              'GitHub, Google Workspace, Stripe, and Vanta memberships must be recorded against the current roster and former team members removed. Due December 4, 2026.',
              'MFA must be enforced for every Render workspace member. Due November 18, 2026.',
            ]}
          />
        </Group>
      </Section>

      <Section title="Corrective actions">
        <CheckTable
          columns={['Action', 'Prevents', 'Owner', 'Done or due']}
          rows={[
            { checked: true, cells: [`A termination register: every departure is a record with a ${TERMINATION_CHECKLIST.length}-step checklist, published by the INTDEV API at ${EVIDENCE_ENDPOINTS.terminations}`, 'Departures with no checklist', OWNER, 'November 4, 2026'] },
            { checked: true, cells: ['The checklist includes INTDEV organization memberships: INTDEV’s own domains and every organization a current team member belongs to', 'Access missed outside the account level', OWNER, 'November 4, 2026'] },
            { checked: true, cells: ['Naming a person in the termination register makes the API refuse every grant based on an INTDEV email address, even though the account keeps that address', 'Email-domain grants after departure', OWNER, `INTDEV API ${DOMAIN_GRANT_BLOCK_RELEASE}`] },
            { checked: true, cells: ['Live checks: the termination records and the compliance report re-check every former account’s level, organization memberships, and domain grants each time they load, and every release carries a Render membership read made before it was built', 'Undetected retained access', OWNER, `INTDEV API ${DOMAIN_GRANT_BLOCK_RELEASE}`] },
            { checked: true, cells: ['The launch scan checks revoked access for every former team member each time a production instance starts', 'A release that undoes a revocation', OWNER, `INTDEV API ${DOMAIN_GRANT_BLOCK_RELEASE}`] },
            { checked: true, cells: ['A revocation records the account’s previous level and may only lower it. The register validation and the API test suite fail on a revocation that raises an account or leaves platform admin in place', 'A containment change that raises access', OWNER, 'November 4, 2026'] },
            { checked: true, cells: ['Give every platform admin account outside the access register a named owner, or lower it. The compliance report counts platform admin accounts against the access register and the system account register on every load', 'Admin access no one is accountable for', OWNER, 'November 4, 2026'] },
            { checked: false, cells: ['Reconcile GitHub, Google Workspace, Stripe, and Vanta memberships with the current roster', 'Retained access in the remaining systems', OWNER, 'December 4, 2026'] },
            { checked: false, cells: ['Enforce MFA for every Render workspace member', 'Misuse of a Render membership', OWNER, 'November 18, 2026'] },
          ]}
        />
      </Section>

      <Section title="Effectiveness review">
        <List
          items={[
            `Immediate: the re-verification at ${utc(TERMINATIONS_REVERIFIED_AT)} on November 4, 2026, and the verification of all four records at ${utc(ALL_TERMINATIONS_VERIFIED_AT)}, found every checklist step complete and no access remaining for any former team member.`,
            'Continuous: the compliance report runs the termination checks against production every time it loads: no former team member at platform admin, every former account at its recorded level, no INTDEV organization memberships, email-domain grants refused, and no Render workspace membership in the Render read compiled into the serving release. A check that production contradicts shows as open.',
            'Scheduled: the Q1 2027 access review, due March 31, 2027, confirms that every departure since this incident was closed within 24 business hours. A missed departure is recorded as a new nonconformity under the Incident Response Plan.',
          ]}
        />
      </Section>

      <Section title="Lessons learned">
        <List
          items={[
            'A new policy must be applied to the people and accounts that came before it, not only to future events.',
            'Departures need a dated record on the last day. Only one of the four departures here was recorded to the day.',
            'Access granted from an attribute a person keeps after leaving, such as an email domain, must be ended by an explicit record of departure.',
            'A corrective change to access must be checked against each account’s previous state before it runs, and must only ever reduce access.',
            'A control that depends on a quarterly review needs an automated check behind it, so a gap is visible the day it opens.',
          ]}
        />
      </Section>

      <Section title="ISO 22301:2019 clause 10.1">
        <Table
          columns={['Clause', 'Requirement', 'Where this report meets it']}
          rows={[
            ['10.1.1', 'React to the nonconformity: control and correct it, and deal with its consequences', 'What happened; Timeline; the breach determination in the incident record'],
            ['10.1.2', 'Evaluate the root cause and act to prevent recurrence, including similar nonconformities, then review the effectiveness of that action', 'Root cause analysis; Similar nonconformities; Corrective actions; Effectiveness review'],
            ['10.1.3', 'Retain documented information on the nature of the nonconformity, the actions taken, and their results', 'This report, the termination records and the access register served by the INTDEV API, and the Q4 2026 access review. Each change to the registers is a reviewed GitHub pull request.'],
          ]}
        />
      </Section>

      <Section title="Relationship to the tabletop exercise">
        <p>The November 2026 tabletop exercise and the incident response plan test rehearsed a hypothetical compromise. This report records a real nonconformity in INTDEV’s own systems, found by a routine control, and corrected the same day. It follows the plan’s phases, from triage to lessons learned, and adds the documented root cause analysis the plan requires for every incident.</p>
      </Section>

      <Section title="Review and sign-off">
        <Fields
          items={[
            ['Root cause analysis reviewed by', <Member key="reviewer" name="Jimmy Lee, Chief Executive Officer and acting Chief Technology Officer, the reviewer the Incident Response Plan names, November 4, 2026" />],
            ['Breach determination by', <Member key="determination" name="Jimmy Lee, Chief Executive Officer, November 4, 2026" />],
            ['Next review', 'With the Q1 2027 access review, due March 31, 2027'],
          ]}
        />
      </Section>
    </Document>
  );
}

export function IncidentResponseTest() {
  return (
    <Document
      slug="incident-response-test"
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
      <Section title="Incidents under the plan">
        <Group>
          <p>{`${INCIDENT_ID}, November 4, 2026: former team members kept access after they left. P1, contained the same day, with a root cause analysis and corrective actions.`}</p>
          <Links items={[{ label: `Incident report and root cause analysis ${INCIDENT_ID}`, href: '/compliance/incident-report' }]} />
        </Group>
      </Section>
      <Section title="Reporting an incident">
        <p>
          Anyone who sees a security event or incident reports it to <Mail address={CONTACTS.security} /> right away.
        </p>
      </Section>
    </Document>
  );
}
