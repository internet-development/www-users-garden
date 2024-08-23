import styles from '@components/UserGardenGrants.module.scss';

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
        <SubTitle style={{ marginTop: 24, opacity: 0.6 }}>{props.title}</SubTitle>
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
    <div className={styles.root}>

      <img className={styles.image} src="https://intdev-global.s3.us-west-2.amazonaws.com/public/internet-dev/d4de517e-346c-4be8-b3c1-9a6f6dc252b0.jpg" alt="Grant Image" />

      <div className={styles.section}>
        <SubTitle style={{ opacity: 0.6 }}>GRANTS</SubTitle>
        <P style={{ marginTop: 6 }}>View all your grants and assign grants to other users. To give a grant, you must be an administrator or an organization’s admin.</P>
      </div>

      <Group title="COMING SOON">
        <ul className={styles.list}>
          <li style={isVerified ? { opacity: 0.1 } : undefined}>This feature is in development.</li>
        </ul>
      </Group>
    </div>
  );
}
