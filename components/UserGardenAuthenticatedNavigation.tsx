import styles from '@components/UserGardenAuthenticatedNavigation.module.scss';

import * as Constants from '@common/constants';
import * as React from 'react';

import { Title } from '@system/typography';

const Item = (props) => {
  let style = props.active ? { color: `var(--theme-primary)`, opacity: 1 } : {};
  let squareStyle = {};

  if (props.href) {
    return (
      <a className={styles.item} style={style} href={props.href} target={props.target}>
        <span className={styles.left}>{props.mark}</span>
        <span className={styles.right}>{props.children}</span>
      </a>
    );
  }

  return (
    <li className={styles.item} style={style} onClick={props.onClick}>
      <span className={styles.left}>{props.mark}</span>
      <span className={styles.right}>{props.children}</span>
    </li>
  );
};

export default function UserGardenAuthenticatedNavigation(props) {
  const isAdmin = props.viewer.level >= Constants.Users.tiers.ADMIN;

  return (
    <div className={styles.root}>
      <div className={styles.top}>
        <Title>ACCOUNT</Title>
        <Item active={'USER_ACCESS' === props.active} onClick={() => props.onNavigate({ active: 'USER_ACCESS', nextOrganization: null })} mark={`┌`}>
          Access
        </Item>
        <Item active={'USER_DANGER' === props.active} onClick={() => props.onNavigate({ active: 'USER_DANGER', nextOrganization: null })} mark={`├`}>
          Danger
        </Item>
        <Item active={'USER_GET_STARTED' === props.active} onClick={() => props.onNavigate({ active: 'USER_GET_STARTED', nextOrganization: null })} mark={`├`}>
          Guide
        </Item>
        <Item active={'USER_GRANTS' === props.active} onClick={() => props.onNavigate({ active: 'USER_GRANTS', nextOrganization: null })} mark={`├`}>
          Grants
        </Item>
        <Item active={'USER_OFFICE' === props.active} onClick={() => props.onNavigate({ active: 'USER_OFFICE', nextOrganization: null })} mark={`├`}>
          Office
        </Item>
        <Item active={'USER_ORGANIZATIONS' === props.active} onClick={() => props.onNavigate({ active: 'USER_ORGANIZATIONS', nextOrganization: null })} mark={`├`}>
          Organizations
        </Item>
        <Item active={'USER_PROFILE' === props.active} onClick={() => props.onNavigate({ active: 'USER_PROFILE', nextOrganization: null })} mark={`├`}>
          Settings
        </Item>
        <Item active={'USER_UPGRADE' === props.active} onClick={() => props.onNavigate({ active: 'USER_UPGRADE', nextOrganization: null })} mark={`├`}>
          Upgrades
        </Item>
        <Item active={'USER_WALLET' === props.active} onClick={() => props.onNavigate({ active: 'USER_WALLET', nextOrganization: null })} mark={`└`}>
          Wallet
        </Item>

        {isAdmin ? (
          <>
            <Title style={{ marginTop: 24 }}>ADMIN</Title>
            <Item active={'ADMIN_TENANTS' === props.active} onClick={() => props.onNavigate({ active: 'ADMIN_TENANTS', nextOrganization: null })} mark={`─`}>
              Tenants
            </Item>
          </>
        ) : null}

        {props.yourOrganizations && props.yourOrganizations.length ? (
          <>
            <Title style={{ marginTop: 24 }}>WEBSITES</Title>

            {props.yourOrganizations.map((each, index) => {
              const thisOrganization = props.organizations.find((org) => org.id === each.organization_id);
              thisOrganization.membership = each;

              let mark = `├`;
              if (index === 0 && props.yourOrganizations.length === 1) {
                mark = `└`;
              } else if (index === 0 && props.yourOrganizations.length > 1) {
                mark = `┌`;
              }

              if (props.yourOrganizations.length > 1 && index === props.yourOrganizations.length - 1) {
                mark = `└`;
              }

              return (
                <Item
                  active={props.currentOrganization && thisOrganization.id === props.currentOrganization.id}
                  key={each.id}
                  onClick={() => {
                    props.onChangeOrganizations(thisOrganization);
                    props.onNavigate({ active: 'USER_APPLICATIONS', nextOrganization: thisOrganization });
                  }}
                  mark={mark}
                >
                  {thisOrganization.domain.toUpperCase()}
                </Item>
              );
            })}
          </>
        ) : null}

        <Title style={{ marginTop: 24 }}>OTHER</Title>
        <Item href="https://txt.dev" target="_blank" mark={`┌`}>
          TXT
        </Item>
        <Item href="https://internet.dev" target="_blank" mark={`├`}>
          INTDEV
        </Item>
        <Item href="https://wireframes.internet.dev" target="_blank" mark={`├`}>
          Templates
        </Item>
        <Item onClick={props.onSignOut} mark={`└`}>
          Sign out
        </Item>
      </div>
    </div>
  );
}
