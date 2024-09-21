import styles from '@components/UserGardenOffice.module.scss';

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

export default function UserGardenOffice(props) {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [status, setStatus] = React.useState<Record<string, any> | null>(null);

  const isVerified = props.viewer.level >= Constants.Users.tiers.VERIFIED;
  const isPaying = props.viewer.level >= Constants.Users.tiers.PAYING;
  const isOffice = props.viewer.level >= Constants.Users.tiers.GENERAL_CO_WORKING;
  const isPartner = props.viewer.level >= Constants.Users.tiers.PARTNER;
  const isAdmin = props.viewer.level >= Constants.Users.tiers.ADMIN;
  const isPayingForDesks = isOffice || isPartner;

  React.useEffect(() => {
    async function init() {
      const next = await props.onUserGetOfficeState();
      if (next && next.data) {
        setStatus(next.data);
      }
    }

    init();
  }, [props]);

  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <SubTitle>Get physical workspace</SubTitle>
        <P style={{ marginTop: 6 }}>
          Manage your physical{' '}
          <a href="https://internet.dev/office" style={{ color: `var(--theme-primary)` }} target="_blank">
            workspace
          </a>{' '}
          at the Internet Development Studio Company Office in Seattle, WA. <br />
          <br />
          We collaborate with individuals and teams who align with our goals, contribute to our ecosystem, or are part of Mana Industries’ investment portfolio. Please note, this
          space is by invitation only and not open to the public.
          {status ? null : (
            <>
              <br />
              <br />
              Apply to get approval for space.
            </>
          )}
        </P>

        {status ? null : (
          <div className={styles.actions}>
            <Button
              loading={props.loading}
              onClick={async () => {
                setLoading(true);
                const response = await props.onUserApplyOfficeSpace({ email: props.viewer.email });
                const next = await props.onUserGetOfficeState();
                if (next && next.data) {
                  setStatus(next.data);
                }
                setLoading(false);
              }}
            >
              Apply
            </Button>
          </div>
        )}
      </div>

      {status && Number(status.tier) === 1 && (
        <Group title="Your workspace application is pending">
          <ul className={styles.list}>
            <li>Your application for physical workspace is pending approval.</li>
            <li>
              Contact the{' '}
              <a href="https://t.me/internetdevelopmentstudio" style={{ color: `var(--theme-primary)` }} target="_blank">
                Internet Development Studio Company
              </a>{' '}
              team to check the status of your application.
            </li>
            <li>
              By using our physical workspace, you agree to our{' '}
              <a href="https://internet.dev/office" target="_blank" style={{ color: `var(--theme-primary)` }}>
                terms and conditions.
              </a>
            </li>
          </ul>
        </Group>
      )}

      {status && Number(status.tier) === 2 && !isPayingForDesks && (
        <Group title="Your workspace application is approved">
          <ul className={styles.list}>
            <li>Complete the payment for your desk or your company's physical workspace.</li>
            <li>
              By using our physical workspace, you agree to our{' '}
              <a href="https://internet.dev/office" target="_blank" style={{ color: `var(--theme-primary)` }}>
                terms and conditions.
              </a>
            </li>
          </ul>

          <div className={styles.actions}>
            <Button
              onClick={async () => {
                props.onNavigate({ active: 'USER_UPGRADE' });
              }}
            >
              Upgrade
            </Button>
          </div>
        </Group>
      )}

      {status && Number(status.tier) === 2 && isPayingForDesks && (
        <Group title="Welcome back">
          <ul className={styles.list}>
            <li>Your physical workspace at the Internet Development Studio Company is confirmed.</li>
            <li>We hope you enjoy the space!</li>
            <li>
              By using our physical workspace, you agree to our{' '}
              <a href="https://internet.dev/office" target="_blank" style={{ color: `var(--theme-primary)` }}>
                terms and conditions.
              </a>
            </li>
          </ul>
        </Group>
      )}
    </div>
  );
}
