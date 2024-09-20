import styles from '@components/UserGardenApplications.module.scss';

import * as Constants from '@common/constants';
import * as React from 'react';

import Button from '@system/Button';
import Input from '@system/Input';
import Table from '@system/Table';
import SmallButton from '@system/documents/SmallButton';

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

const TableText = (props) => {
  return <div style={{ paddingTop: 1, ...props.style }}>{props.children}</div>;
};

function UserGardenApplicationsUserList(props) {
  const { currentOrganization, onOrganizationSourceUsers, onOrganizationAddUser } = props;
  const [users, setUsers] = React.useState<Record<string, any>[]>([]);

  React.useEffect(() => {
    async function grab() {
      const rootDomain = currentOrganization.domain;
      const response = await onOrganizationSourceUsers({ organizationId: currentOrganization.id });
      if (!response) {
        alert('We could not fetch your source users.');
        return;
      }

      setUsers([
        ...response.data.map((each) => {
          return {
            id: each.id,
            data: [
              <TableText style={each.isMember ? { color: `var(--theme-primary)` } : undefined}>{each.email}</TableText>,
              <TableText>{each.username}</TableText>,
              <TableText style={{ color: `var(--theme-success)` }}>{Number(each.level) >= 10 ? '✓' : ''}</TableText>,
              <div>
                {!each.isMember ? (
                  <SmallButton
                    onClick={async () => {
                      const confirm = window.confirm(`Are you sure you want to add ${each.email} to ${rootDomain.toUpperCase()}?`);

                      if (!confirm) {
                        return;
                      }

                      const response = await onOrganizationAddUser({ email: each.email, domain: rootDomain });
                      if (!response) {
                        alert('Something went wrong, please try again later.');
                        return;
                      }

                      await grab();
                    }}
                  >
                    Invite
                  </SmallButton>
                ) : null}
              </div>,
            ],
          };
        }),
      ]);
    }

    grab();
  }, [currentOrganization, onOrganizationAddUser, onOrganizationSourceUsers]);

  const href = `https://${props.currentOrganization.domain.toUpperCase()}`;

  return (
    <Group title="Who is in the organization?">
      <ul className={styles.list}>
        <li>
          All users who signed up through{' '}
          <a href={href} style={{ color: `var(--theme-primary)` }}>
            {props.currentOrganization.domain.toUpperCase()}
          </a>
        </li>
      </ul>

      <Table data={users} headings={['EMAIL', 'USERNAME', 'VERIFIED', 'ACTIONS']} style={{ marginTop: 24 }} />
    </Group>
  );
}

export default function UserGardenApplications(props) {
  const [customField, setCustomField] = React.useState<string>('');
  const [customName, setCustomName] = React.useState<string>('');

  const isVerified = props.viewer.level >= Constants.Users.tiers.VERIFIED;
  const isPaying = props.viewer.level >= Constants.Users.tiers.PAYING;
  const isOffice = props.viewer.level >= Constants.Users.tiers.GENERAL_CO_WORKING;
  const isPartner = props.viewer.level >= Constants.Users.tiers.PARTNER;
  const isAdmin = props.viewer.level >= Constants.Users.tiers.ADMIN;
  const domainName = props.currentOrganization.domain.toUpperCase();

  const href = `https://${domainName}`;

  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <SubTitle>{domainName}</SubTitle>
        <P style={{ marginTop: 6 }}>
          Manage settings for{' '}
          <a href={href} style={{ color: `var(--theme-primary)` }}>
            {domainName}
          </a>{' '}
          and see users who are signing up using your `source` configuration.
        </P>
      </div>

      <UserGardenApplicationsUserList
        currentOrganization={props.currentOrganization}
        onOrganizationAddUser={props.onOrganizationAddUser}
        onOrganizationSourceUsers={props.onOrganizationSourceUsers}
      />

    </div>
  );
}
