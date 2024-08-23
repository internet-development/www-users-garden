import styles from '@components/UserGardenDanger.module.scss';

import * as Constants from '@common/constants';
import * as React from 'react';

import Button from '@system/Button';
import Input from '@system/Input';

import { P, SubTitle } from '@system/typography';

const CONFIRM_DELETE_KEY = `DELETE-THIS-ACCOUNT-NOW`;

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

export default function UserDanger(props) {
  const [loading, setLoading] = React.useState<boolean>(false);

  const isVerified = props.viewer.level >= Constants.Users.tiers.VERIFIED;
  const isPaying = props.viewer.level >= Constants.Users.tiers.PAYING;
  const isOffice = props.viewer.level >= Constants.Users.tiers.GENERAL_CO_WORKING;
  const isPartner = props.viewer.level >= Constants.Users.tiers.PARTNER;
  const isAdmin = props.viewer.level >= Constants.Users.tiers.ADMIN;

  return (
    <div className={styles.root}>
      <img className={styles.image} src="https://intdev-global.s3.us-west-2.amazonaws.com/public/internet-dev/b22b6f94-f9d3-435f-b519-d5f7baccc5d9.jpg" alt="Danger Image" />

      <div className={styles.section}>
        <SubTitle style={{ opacity: 0.6 }}>DANGER</SubTitle>
        <P style={{ marginTop: 6 }}>
          You can delete your account and subscriptions to our services here. Please note that if you do so, you’ll need to recreate your account to access anything built on the
          Internet Development Studio Company’s API.
        </P>
      </div>

      <Group title="USER STATUS">
        <ul className={styles.list}>
          <li style={isVerified ? { opacity: 0.1 } : undefined}>You are an <strong style={{ color: `var(--theme-primary)`}}>unverified user</strong>. You can not use most of the API.</li>
          <li style={!isVerified ? { opacity: 0.1 } : undefined}>You are a <strong style={{ color: `var(--theme-primary)`}}>verified user</strong>. You can use the API.</li>
          <li style={!isPaying ? { opacity: 0.1 } : undefined}>You are a <strong style={{ color: `var(--theme-primary)`}}>professional user</strong>. You have access to all premium features.</li>
          <li style={!isOffice ? { opacity: 0.1 } : undefined}>You are a <strong style={{ color: `var(--theme-primary)`}}>collaborator</strong>. You have access to our office space.</li>
          <li style={!isPartner ? { opacity: 0.1 } : undefined}>You are a <strong style={{ color: `var(--theme-primary)`}}>partner</strong>. You have special privileges.</li>
          <li style={!isAdmin ? { opacity: 0.1 } : undefined}>You are an <strong style={{ color: `var(--theme-primary)`}}>administrator</strong>. You made this world.</li>
        </ul>
      </Group>

      {isPaying ? (
        <Group title="CANCEL SUBSCRIPTION">
          <ul className={styles.list}>
            <li>Canceling your account ends all payments to our services.</li>
            <li>You will lose API permissions and potentially office space.</li>
            <li>Resubscribe anytime.</li>
          </ul>

          <div className={styles.actions}>
            <Button
              loading={props.loading}
              onClick={async () => {
                setLoading(true);
                const next = window.confirm('Are you sure you want to unsubscribe to all services? If you do this you will no longer receive credits.');

                if (!next) {
                  setLoading(false);
                  return;
                }

                const response = await props.onUserUnsubscribeFromAllServices();

                if (response && response.success) {
                  alert('You have unsubscribed from all services');
                  window.location.reload();
                } else {
                  alert('Something went wrong');
                }

                setLoading(false);
              }}
              style={{ backgroundColor: `var(--theme-error)`, color: `var(--theme-text)` }}
            >
              Cancel
            </Button>
          </div>
        </Group>
      ) : (
        <Group title="CANCEL SUBSCRIPTION">
          <ul className={styles.list}>
            <li>You are not paying for services.</li>
          </ul>
        </Group>
      )}

      {isPaying ? (
        <Group title="DELETE ACCOUNT">
          <ul className={styles.list}>
            <li>Cancel your subscription first before deleting your account.</li>
          </ul>
        </Group>
      ) : (
        <Group title="DELETE ACCOUNT">
          <ul className={styles.list}>
            <li>Deleting your account completely removes you from the Internet Development Studio Company's infrastructure.</li>
            <li>Recreate your account at anytime.</li>
          </ul>

          <div className={styles.actions}>
            <Button
              loading={props.loading}
              onClick={async () => {
                const next = window.prompt(`Are you sure you want to delete your account? Please type ${CONFIRM_DELETE_KEY}`);

                if (next !== CONFIRM_DELETE_KEY) {
                  alert('If you wish to delete your account, try again.');
                  return;
                }

                const response = await props.onUserDeleteAccount();
                setLoading(false);

                if (response && response.success) {
                  alert('You have deleted your account, good bye.');
                  window.location.reload();
                } else {
                  alert('Something went wrong');
                }
              }}
              style={{ backgroundColor: `var(--theme-error)`, color: `var(--theme-text)` }}
            >
              Delete my account
            </Button>
          </div>
        </Group>
      )}
    </div>
  );
}
