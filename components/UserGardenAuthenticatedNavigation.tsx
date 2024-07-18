import styles from '@components/UserGardenAuthenticatedNavigation.module.scss';

import * as React from 'react';

import { SubTitle } from '@system/typography';

const Item = (props) => {
  let style = props.active ? { opacity: 1 } : {};
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
  return (
    <div className={styles.root}>
      <div className={styles.top}>
        <SubTitle style={{ opacity: 0.6, padding: '8px 24px 8px 24px' }}>ACCOUNT</SubTitle>
        <Item active={'USER_PROFILE' === props.active} onClick={() => props.onNavigate({ active: 'USER_PROFILE', nextOrganization: null })} mark={`┌`}>
          You
        </Item>
        <Item active={'USER_UPGRADE' === props.active} onClick={() => props.onNavigate({ active: 'USER_UPGRADE', nextOrganization: null })} mark={`├`}>
          Upgrade
        </Item>
        <Item active={'USER_ORGANIZATIONS' === props.active} onClick={() => props.onNavigate({ active: 'USER_ORGANIZATIONS', nextOrganization: null })} mark={`├`}>
          Organizations
        </Item>
        <Item active={'USER_GRANTS' === props.active} onClick={() => props.onNavigate({ active: 'USER_GRANTS', nextOrganization: null })} mark={`├`}>
          Grants
        </Item>
        <Item active={'USER_WALLET' === props.active} onClick={() => props.onNavigate({ active: 'USER_WALLET', nextOrganization: null })} mark={`└`}>
          Wallet
        </Item>

        {props.yourOrganizations && props.yourOrganizations.length ? (
          <>
            <SubTitle style={{ marginTop: 24, opacity: 0.6, padding: '8px 24px 8px 24px' }}>PROJECTS</SubTitle>

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

        <SubTitle style={{ marginTop: 24, opacity: 0.6, padding: '8px 24px 8px 24px' }}>OTHER</SubTitle>
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
