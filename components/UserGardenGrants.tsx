import styles from '@components/UserGardenGrants.module.scss';

import * as Constants from '@common/constants';
import * as React from 'react';

import Button from '@system/Button';
import Input from '@system/Input';
import StandardHeader from '@components/StandardHeader';
import StandardLayout from '@components/StandardLayout';

import { P, SubTitle, Title } from '@system/typography';

const Group = (props) => {
  return (
    <div className={styles.child}>
      <div className={styles.left}>
        <figure className={styles.line} />
      </div>
      <div className={styles.right}>
        {props.isComingSoon ? <Title style={{ marginTop: 24 }}>COMING SOON</Title> : <SubTitle style={{ marginTop: 24 }}>{props.title}</SubTitle>}
        {props.children}
      </div>
    </div>
  );
};

export default function UserGardenGrants(props) {
  const [customField, setCustomField] = React.useState<string>('');
  const [customName, setCustomName] = React.useState<string>('');

  const isVerified = props.viewer.level >= Constants.Users.tiers.VERIFIED;
  const isPaying = props.viewer.level >= Constants.Users.tiers.PAYING;
  const isOffice = props.viewer.level >= Constants.Users.tiers.GENERAL_CO_WORKING;
  const isPartner = props.viewer.level >= Constants.Users.tiers.PARTNER;
  const isAdmin = props.viewer.level >= Constants.Users.tiers.ADMIN;

  return (
    <StandardLayout>
      <StandardHeader title="Create grants">
        View all your grants and assign grants to other users. To give a grant, you must be an administrator or an organization’s admin.
      </StandardHeader>

      <Group isComingSoon>
        <ul className={styles.list}>
          <li style={{ opacity: 0.1 }}>This feature is in development.</li>
        </ul>
      </Group>
    </StandardLayout>
  );
}
