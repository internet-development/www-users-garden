import styles from '@components/UserGardenUpgrade.module.scss';

import * as React from 'react';

import Button from '@system/Button';
import Content from '@system/layouts/Content';
import CheckmarkItem from '@system/documents/CheckmarkItem';

import { P, H5, SubLead, SubTitle } from '@system/typography';

export default function UserGardenUpgrade(props) {
  return (
    <>
      <header className={styles.header}>
        <SubTitle style={{ opacity: 0.6 }}>UPGRADE</SubTitle>
        <P style={{ marginTop: 6 }}>
          Upgrade your account to gain increased access to our APIs and other services as they become available. Please note that some services are exclusively available to
          residents of Seattle, WA.
        </P>
      </header>
      <div className={styles.row}>
        <div className={styles.container}>
          <div className={styles.column}>
            <div className={styles.content}>
              <SubTitle style={{ opacity: 0.6 }}>FREE</SubTitle>
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
              <SubTitle style={{ opacity: 0.6 }}>PROFESSIONAL</SubTitle>
              <H5 style={{ marginTop: 24 }}>
                $8.99 USD<span className={styles.subtle}>/mo</span>
              </H5>
              {props.viewer ? (
                props.viewer.level >= 20 ? (
                  <Button visual style={{ height: 48, marginTop: 24, width: '100%' }}>
                    Already obtained
                  </Button>
                ) : (
                  <Button
                    href={`https://buy.stripe.com/28og0B2f9eIj8Io9AA?prefilled_email=${props.viewer.email}`}
                    style={{ height: 48, marginTop: 24, width: '100%' }}
                    target="_blank"
                  >
                    Get started
                  </Button>
                )
              ) : (
                <Button style={{ height: 48, marginTop: 24, width: '100%' }} href="/examples/features/authentication">
                  Sign up
                </Button>
              )}
              <div className={styles.caption}>
                All the benefits of <strong>"Free"</strong>, and ↴
              </div>
              <div>
                <CheckmarkItem>15,000 credits deposited every month.</CheckmarkItem>
                <CheckmarkItem>Send credits to other users.</CheckmarkItem>
                <CheckmarkItem>Access to all professional APIs, products, and games.</CheckmarkItem>
              </div>
            </div>
          </div>
          <div className={styles.column}>
            <div className={styles.content}>
              <SubTitle style={{ opacity: 0.6 }}>COLLABORATOR</SubTitle>
              <H5 style={{ marginTop: 24 }}>
                $399 USD<span className={styles.subtle}>/mo</span>
              </H5>
              <Button onClick={() => alert('Coming soon!')} style={{ height: 48, marginTop: 24, width: '100%' }}>
                Apply
              </Button>
              <div className={styles.caption}>
                All the benefits of <strong>"Professional"</strong>, and ↴
              </div>
              <div>
                <CheckmarkItem>30,000 additional credits deposited every month (45,000 in total).</CheckmarkItem>
                <CheckmarkItem>A reserved desk [2] at the collaborative space in Seattle, WA.</CheckmarkItem>
              </div>
            </div>
          </div>
          <div className={styles.column}>
            <div className={styles.content}>
              <SubTitle style={{ opacity: 0.6 }}>PARTNER</SubTitle>
              <H5 style={{ opacity: 0, marginTop: 24, visibility: 'hidden' }}>
                $X USD<span className={styles.subtle}>/mo</span>
              </H5>
              <Button onClick={() => alert('Coming soon!')} style={{ height: 48, marginTop: 24, width: '100%' }}>
                Apply
              </Button>
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
              . Our API enforces a strict file size limit of 100MB to prevent misuse of our services. However, we may consider increasing this limit once we have a clearer
              understanding of your use case. Reach out to us if you wish to discuss.
            </div>
            <div className={styles.disclaimer}>
              [2] Reserved desks — Our office space offers a mix of reserved and open desks. The reserved desks are allocated on a first-come, first-served basis. Should we be
              unable to assign you a desk immediately, you will be placed on a waitlist and informed as soon as one becomes available. Please note that all desk assignments are
              subject to availability, regardless of application status.
            </div>
            <div className={styles.disclaimer} style={{ paddingBottom: 128 }}>
              [3] Collaborative team space — Availability for reserved team and startup space is limited. Please note that all spaces are subject to availability, even upon
              application.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
