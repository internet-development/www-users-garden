import Document from '@root/compliance/site/Document';

import { ComplianceReport } from '@root/compliance/site/Evidence';
import { Group, Links, List, Mail, Section, Table } from '@root/compliance/site/Blocks';
import { COMPLIANCE_DOCUMENTS } from '@root/compliance/site/registry';
import { API_HOST, CONTACTS, POLICIES, POLICY_DATES, PRODUCTS, PUBLIC_TERMS, TRUST_CENTER } from '@root/compliance/site/facts';
import { DEVICE_CHECK_SCRIPT, EVIDENCE_ENDPOINTS, EVIDENCE_RECORDS, isCompiledEvidence } from '@root/compliance/site/records';

function record(path: string) {
  return <a href={`${API_HOST}${path}`}>{`${API_HOST.replace('https://', '')}${path}`}</a>;
}

const PAGE_TITLES = new Map<string, string>([['/compliance', 'Compliance'], ...COMPLIANCE_DOCUMENTS.map((entry): [string, string] => [`/compliance/${entry.slug}`, entry.title])]);

const API_GUIDES = [
  { label: 'INTDEV API guide (every route, permission, rate limit, and token cost)', href: `${API_HOST}/SKILL.md` },
  { label: 'Marketplace guide', href: `${API_HOST}/skills/marketplace/SKILL.md` },
  { label: 'Guest checkout guide', href: `${API_HOST}/skills/marketplace-guest/SKILL.md` },
  { label: 'Licenses guide', href: `${API_HOST}/skills/licenses/SKILL.md` },
  { label: 'Slides guide', href: `${API_HOST}/skills/slides/SKILL.md` },
  { label: 'External vendor guide', href: `${API_HOST}/skills/use-as-external-vendor/SKILL.md` },
  { label: 'Pricing and rate limits (JSON)', href: `${API_HOST}/api/credits/pricing` },
  { label: 'Health check (JSON)', href: `${API_HOST}/api/status` },
  { label: 'Deploy record (JSON)', href: `${API_HOST}/api/status/deploys` },
  { label: 'Device check script', href: DEVICE_CHECK_SCRIPT },
];

export const COMPLIANCE_INDEX_TITLE = 'Compliance';
export const COMPLIANCE_INDEX_DESCRIPTION = 'Public compliance records for the INTDEV API, Users Garden, and Terminal Graph: policies, controls, and live evidence.';

export default function ComplianceIndex() {
  return (
    <Document title={COMPLIANCE_INDEX_TITLE} summary={COMPLIANCE_INDEX_DESCRIPTION} controls={[]}>
      <Section title="Start here">
        <Links
          items={[
            { label: 'Security at INTDEV', href: '/compliance/security' },
            { label: 'Application status', href: '/compliance/status' },
            { label: 'Customer support', href: '/compliance/support' },
            { label: 'Changelog and release notes', href: '/compliance/changelog' },
            { label: `${TRUST_CENTER.name}, monitored by ${TRUST_CENTER.operator}`, href: TRUST_CENTER.url },
            { label: 'Trust Center control map', href: '/compliance/trust-center' },
          ]}
        />
      </Section>
      <Section title="Compliance report">
        <Group>
          <p>Every check below is computed by the INTDEV API when you load this page, from the production database, the published registers, the release it is serving, and the Render API read compiled into that release. A green check means the control holds right now. A red box is a control that production contradicts, and a grey box is a check still waiting for its input, such as a release built without its Render read; neither is ever shown as passing. Each row links to the record behind it.</p>
          <ComplianceReport />
        </Group>
      </Section>
      <Section title="Records">
        <Group>
          <Table columns={['Record', 'Controls', 'Summary']} rows={COMPLIANCE_DOCUMENTS.map((entry) => [<a key={entry.slug} href={`/compliance/${entry.slug}`}>{entry.title}</a>, entry.controls.join(', '), entry.description])} />
          <p>The INTDEV API publishes every page, its controls, and the record behind it at {record(EVIDENCE_ENDPOINTS.pages)}, and the index of every record at {record(EVIDENCE_ENDPOINTS.index)}. Each record names the API release that served it.</p>
        </Group>
      </Section>
      <Section title="API records">
        <Group>
          <p>Every record the pages render is also served as JSON by the INTDEV API. A live record re-reads production each time it loads; a compiled record is the register built into the serving release. Each one names the release that served it.</p>
          <Table
            columns={['Record', 'Kind', 'Page']}
            rows={EVIDENCE_RECORDS.map((entry) => [
              <a key="record" href={`${API_HOST}${EVIDENCE_ENDPOINTS[entry.key]}`}>{entry.name}</a>,
              isCompiledEvidence(entry.key) ? 'Compiled' : 'Live',
              <a key="page" href={entry.page}>{PAGE_TITLES.get(entry.page) ?? entry.page}</a>,
            ])}
          />
        </Group>
      </Section>
      <Section title="Products, guides, and terms">
        <Group>
          <Links items={PRODUCTS.map((product) => ({ label: product.name, href: product.url }))} />
          <Links items={API_GUIDES} />
          <Links items={PUBLIC_TERMS} />
          <p>
            Support: <Mail address={CONTACTS.support} />. Security reports: <Mail address={CONTACTS.security} />.
          </p>
        </Group>
      </Section>
      <Section title="Policies">
        <List items={POLICIES.map((policy) => policy.name)} />
        <p>
          {POLICY_DATES}. Policies are Restricted; the full text is available to customers and auditors under NDA from <Mail address={CONTACTS.support} />. The list and its approval are published at {record(EVIDENCE_ENDPOINTS.policies)}.
        </p>
      </Section>
    </Document>
  );
}
