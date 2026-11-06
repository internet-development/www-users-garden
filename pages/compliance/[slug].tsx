import * as React from 'react';

import Page from '@components/Page';

import { COMPLIANCE_SLUGS, findComplianceDocument } from '@root/compliance/site/registry';

export default function ComplianceDocumentPage(props) {
  const entry = findComplianceDocument(props.slug);
  if (!entry) return null;

  const { Component } = entry;
  return (
    <Page title={`${entry.title} — INTDEV Compliance`} description={entry.description} url={`https://users.garden/compliance/${entry.slug}`}>
      <Component />
    </Page>
  );
}

export async function getStaticPaths() {
  return { paths: COMPLIANCE_SLUGS.map((slug) => ({ params: { slug } })), fallback: false };
}

export async function getStaticProps(context) {
  return { props: { slug: String(context.params?.slug ?? '') } };
}
