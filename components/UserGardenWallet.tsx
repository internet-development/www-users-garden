import styles from '@components/UserGardenWallet.module.scss';

import * as Constants from '@common/constants';
import * as React from 'react';

import Button from '@system/Button';
import Input from '@system/Input';

import { P, SubTitle } from '@system/typography';

const Item = (props) => {
  if (props.href) {
    return (
      <a className={styles.item} style={props.style} href={props.href} target={props.target}>
        <span className={styles.left}>⎯</span>
        <span className={styles.right}>{props.children}</span>
      </a>
    );
  }

  return (
    <li className={styles.item} style={props.style} onClick={props.onClick}>
      <span className={styles.left}>⎯</span>
      <span className={styles.right}>{props.children}</span>
    </li>
  );
};

const Group = (props) => {
  return (
    <div className={styles.child}>
      <div className={styles.left}>
        <figure className={styles.line} />
      </div>
      <div className={styles.right}>
        <SubTitle style={{ marginTop: 24 }}>{props.title}</SubTitle>
        {props.children}
      </div>
    </div>
  );
};

export default function UserGardenWallet(props) {
  const [customField, setCustomField] = React.useState<string>('');
  const [customName, setCustomName] = React.useState<string>('');

  const isVerified = props.viewer.level >= Constants.Users.tiers.VERIFIED;
  const isPaying = props.viewer.level >= Constants.Users.tiers.PAYING;
  const isOffice = props.viewer.level >= Constants.Users.tiers.GENERAL_CO_WORKING;
  const isPartner = props.viewer.level >= Constants.Users.tiers.PARTNER;
  const isAdmin = props.viewer.level >= Constants.Users.tiers.ADMIN;

  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <SubTitle>WALLET</SubTitle>
        <P style={{ marginTop: 6 }}>
          Manage your INTDEV credits. INTDEV credits are used to pay for premium features in applications, games, and services. You can also exchange credits with other
          professional users on the platform.
        </P>
      </div>

      <Group title="COMING SOON">
        <ul className={styles.list}>
          <li style={{ opacity: 0.1 }}>This feature is in development.</li>
        </ul>
      </Group>
    </div>
  );
}
