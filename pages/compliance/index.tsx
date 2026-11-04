import * as React from 'react';

import ComplianceIndex, { COMPLIANCE_INDEX_DESCRIPTION, COMPLIANCE_INDEX_TITLE } from '@root/compliance/site/ComplianceIndex';
import Page from '@components/Page';

export default function CompliancePage() {
  return (
    <Page title={`${COMPLIANCE_INDEX_TITLE} — Users Garden`} description={COMPLIANCE_INDEX_DESCRIPTION} url="https://users.garden/compliance">
      <ComplianceIndex />
    </Page>
  );
}
