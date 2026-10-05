import * as React from 'react';

import Page from '@components/Page';
import UserGardenSettingsPreview from '@scenes/UserGardenSettingsPreview';

export default function SettingsPreview() {
  return (
    <Page title="Text settings preview — Users Garden" description="Review optional SMS consent, API token balance and workspace messages, and a planned organization and application permission flow." url="https://users.garden/settings-preview">
      <UserGardenSettingsPreview />
    </Page>
  );
}
