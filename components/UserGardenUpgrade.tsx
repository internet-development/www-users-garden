import styles from '@components/UserGardenUpgrade.module.scss';

import * as Constants from '@common/constants';
import * as React from 'react';

import Button from '@system/Button';
import ButtonPrimary from '@system/ButtonPrimary';
import Content from '@system/layouts/Content';
import CheckmarkItem from '@system/documents/CheckmarkItem';

import { P, H5, SubLead, SubTitle } from '@system/typography';

function DynamicButton(props) {
  const [isApplicant, setApplicant] = React.useState<boolean>(false);

  React.useEffect(() => {
    async function run() {
      const next = await props.onUserGetOfficeState();
      if (next && next.data && next.data.tier && next.data.tier > 1) {
        setApplicant(true);
      }
    }

    run();
  }, [props]);

  if (!isApplicant) {
    return (
      <Button onClick={() => props.onNavigate({ active: 'USER_OFFICE', nextOrganization: null })} style={props.style}>
        Apply
      </Button>
    );
  }

  return (
    <ButtonPrimary href={props.href} style={props.style} target="_blank">
      Get started
    </ButtonPrimary>
  );
}

export default function UserGardenUpgrade(props) {
  return (
    <>
      <header className={styles.header}>
        <SubTitle>Upgrade your account</SubTitle>
        <P style={{ marginTop: 6 }}>
          Upgrade your account to gain increased access to our APIs and other services as they become available. Please note that some services are exclusively available to
          residents of Seattle, WA.
        </P>
      </header>
      <div className={styles.row}>
        <div className={styles.container}>
          <div className={styles.column}>
            <div className={styles.content}>
              <SubTitle style={{ padding: 0 }}>Free</SubTitle>
              <H5 style={{ marginTop: 24 }}>
                $0 USD<span className={styles.subtle}>/mo</span>
              </H5>
              {props.viewer ? (
                <Button visual style={{ height: 48, marginTop: 24, width: '100%' }}>
                  Already obtained
                </Button>
              ) : (
                <Button style={{ height: 48, marginTop: 24, width: '100%' }} href="/examples/features/authentication">
                  Sign up
                </Button>
              )}
              <div className={styles.hiddenCaption}>All the benefits of "Life", and ↴</div>
              <div>
                <CheckmarkItem>Access to all free APIs, products, and games.</CheckmarkItem>
              </div>
            </div>
          </div>
          <div className={styles.column}>
            <div className={styles.content}>
              <SubTitle style={{ padding: 0 }}>Professional</SubTitle>
              <H5 style={{ marginTop: 24 }}>
                $8.99 USD<span className={styles.subtle}>/mo</span>
              </H5>
              {props.viewer ? (
                props.viewer.level >= Constants.Users.tiers.PAYING ? (
                  <Button visual style={{ height: 48, marginTop: 24, width: '100%' }}>
                    Already obtained
                  </Button>
                ) : (
                  <ButtonPrimary href={`${Constants.LINKS.PAYING}?prefilled_email=${props.viewer.email}`} style={{ height: 48, marginTop: 24, width: '100%' }} target="_blank">
                    Get started
                  </ButtonPrimary>
                )
              ) : (
                <Button style={{ height: 48, marginTop: 24, width: '100%' }} href="https://users.garden">
                  Sign up
                </Button>
              )}
              <div className={styles.caption}>
                All the benefits of <strong>"Free"</strong>, and ↴
              </div>
              <div>
                <CheckmarkItem>{Constants.Payouts.PAYING.toLocaleString()} credits deposited every month.</CheckmarkItem>
                <CheckmarkItem>Send credits to other users.</CheckmarkItem>
                <CheckmarkItem>Access to all professional APIs, products, and games.</CheckmarkItem>
              </div>
            </div>
          </div>
          <div className={styles.column}>
            <div className={styles.content}>
              <SubTitle style={{ padding: 0 }}>Collaborator</SubTitle>
              <H5 style={{ marginTop: 24 }}>
                $329 USD<span className={styles.subtle}>/mo</span>
              </H5>
              {props.viewer ? (
                props.viewer.level >= Constants.Users.tiers.GENERAL_CO_WORKING ? (
                  <Button visual style={{ height: 48, marginTop: 24, width: '100%' }}>
                    Already obtained
                  </Button>
                ) : (
                  <DynamicButton
                    href={`${Constants.LINKS.GENERAL_CO_WORKING}?prefilled_email=${props.viewer.email}`}
                    onNavigate={props.onNavigate}
                    onUserGetOfficeState={props.onUserGetOfficeState}
                    style={{ height: 48, marginTop: 24, width: '100%' }}
                  />
                )
              ) : (
                <Button style={{ height: 48, marginTop: 24, width: '100%' }} href="https://users.garden">
                  Sign up
                </Button>
              )}
              <div className={styles.caption}>
                All the benefits of <strong>"Professional"</strong>, and ↴
              </div>
              <div>
                <CheckmarkItem>{Constants.Payouts.GENERAL_CO_WORKING.toLocaleString()} credits deposited every month.</CheckmarkItem>
                <CheckmarkItem>If available, a reserved desk [2] at the collaborative space in Seattle, WA.</CheckmarkItem>
              </div>
            </div>
          </div>
          <div className={styles.column}>
            <div className={styles.content}>
              <SubTitle style={{ padding: 0 }}>Partner</SubTitle>
              <H5 style={{ marginTop: 24 }}>
                $2790 USD<span className={styles.subtle}>/mo</span>
              </H5>
              {props.viewer ? (
                props.viewer.level >= Constants.Users.tiers.PARTNER ? (
                  <Button visual style={{ height: 48, marginTop: 24, width: '100%' }}>
                    Already obtained
                  </Button>
                ) : (
                  <DynamicButton
                    href={`${Constants.LINKS.PARTNER}?prefilled_email=${props.viewer.email}`}
                    onNavigate={props.onNavigate}
                    onUserGetOfficeState={props.onUserGetOfficeState}
                    style={{ height: 48, marginTop: 24, width: '100%' }}
                  />
                )
              ) : (
                <Button style={{ height: 48, marginTop: 24, width: '100%' }} href="https://users.garden">
                  Sign up
                </Button>
              )}
              <div className={styles.caption}>
                All the benefits of <strong>"Collaborator"</strong>, and ↴
              </div>
              <div>
                <CheckmarkItem>Sections for your company or team to work with symmetrical fiber internet [3].</CheckmarkItem>
                <CheckmarkItem>Reservable event space (2,800 sqft) in Seattle, WA.</CheckmarkItem>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.subRow}>
          <div className={styles.subRowContent}>
            <div className={styles.disclaimer}>
              [1] Data — By uploading data through our service, you consent to our{' '}
              <a href="https://txt.dev/wwwjim/intdev-terms-of-service" className={styles.link} target="_blank">
                Terms of Service
              </a>
              ,{' '}
              <a href="https://txt.dev/wwwjim/intdev-privacy-policy" className={styles.link} target="_blank">
                Privacy Policy
              </a>
              , and{' '}
              <a href="https://txt.dev/wwwjim/intdev-acceptable-use" className={styles.link} target="_blank">
                Acceptable Use Policy
              </a>
              .
            </div>
            <div className={styles.disclaimer}>
              [2] Reserved desks — Our physical workspace offers a mix of reserved and open desks. The reserved desks are allocated on based on the needs of the Internet
              Development Studio Company. View the{' '}
              <a href="https://internet.dev/office" className={styles.link} target="_blank">
                Office Usage Agreement
              </a>
              .
            </div>
            <div className={styles.disclaimer} style={{ paddingBottom: 128 }}>
              [3] Collaborative team space — Availability for reserved team and startup space is limited. View the{' '}
              <a href="https://internet.dev/office" className={styles.link} target="_blank">
                Office Usage Agreement
              </a>
              .
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
