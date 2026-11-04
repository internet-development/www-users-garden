import Document from '@root/compliance/site/Document';

import { ComplianceReport } from '@root/compliance/site/Evidence';
import { Group, Links, List, Section, Table } from '@root/compliance/site/Blocks';
import { COMPLIANCE_DOCUMENTS } from '@root/compliance/site/registry';
import { API_HOST, POLICIES, POLICY_DATES } from '@root/compliance/site/facts';
import { EVIDENCE_ENDPOINTS } from '@root/compliance/site/records';

function record(path: string) {
  return <a href={`${API_HOST}${path}`}>{`${API_HOST.replace('https://', '')}${path}`}</a>;
}

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
      <Section title="Policies">
        <List items={POLICIES.map((policy) => policy.name)} />
        <p>
          {POLICY_DATES}. Policies are Restricted; the full text is available to customers and auditors under NDA from eng@internet.dev. The list and its approval are published at {record(EVIDENCE_ENDPOINTS.policies)}.
        </p>
      </Section>
    </Document>
  );
}
