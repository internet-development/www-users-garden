import styles from '@components/UserGardenDanger.module.scss';

import * as Constants from '@common/constants';
import * as React from 'react';

import Button from '@system/Button';
import ButtonWarning from '@system/ButtonWarning';
import Input from '@system/Input';
import StandardLayout from '@components/StandardLayout';
import StandardHeader from '@components/StandardHeader';
import StandardLayoutSection from '@components/StandardLayoutSection';

const CONFIRM_DELETE_KEY = `DELETE-THIS-ACCOUNT-NOW`;

export default function UserDanger(props) {
  const [loading, setLoading] = React.useState<boolean>(false);

  const isVerified = props.viewer.level >= Constants.Users.tiers.VERIFIED;
  const isPaying = props.viewer.level >= Constants.Users.tiers.PAYING;
  const isOffice = props.viewer.level >= Constants.Users.tiers.GENERAL_CO_WORKING;
  const isPartner = props.viewer.level >= Constants.Users.tiers.PARTNER;
  const isAdmin = props.viewer.level >= Constants.Users.tiers.ADMIN;

  return (
    <StandardLayout>
      <StandardHeader title="Dangerous account changes">
        You can delete your account and subscriptions to our services here. Please note that if you do so, you’ll need to recreate your account to access anything built on the
        Internet Development Studio Company’s API.
      </StandardHeader>

      <StandardLayoutSection title="Your account status">
        <ul className={styles.list}>
          <li style={isVerified ? { opacity: 0.1 } : undefined}>
            You are an <strong>unverified user</strong>. You can not use most of the API.
          </li>
          <li style={!isVerified ? { opacity: 0.1 } : undefined}>
            You are a <strong>verified user</strong>. You can use the API.
          </li>
          <li style={!isPaying ? { opacity: 0.1 } : undefined}>
            You are a <strong>professional user</strong>. You have access to all premium features.
          </li>
          <li style={!isOffice ? { opacity: 0.1 } : undefined}>
            You are a <strong>collaborator</strong>. You have access to physical workspace.
          </li>
          <li style={!isPartner ? { opacity: 0.1 } : undefined}>
            You are a <strong>partner</strong>. You have special privileges.
          </li>
          <li style={!isAdmin ? { opacity: 0.1 } : undefined}>
            You are an <strong>administrator</strong>. You made this world.
          </li>
        </ul>
      </StandardLayoutSection>

      {isPaying ? (
        <StandardLayoutSection title="Cancel your subscription">
          <ul className={styles.list}>
            <li>Canceling your account ends all payments to our services.</li>
            <li>You will lose API permissions and potentially physical workspace.</li>
            <li>Resubscribe anytime.</li>
          </ul>

          <div className={styles.actions}>
            <ButtonWarning
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
            >
              Cancel
            </ButtonWarning>
          </div>
        </StandardLayoutSection>
      ) : (
        <StandardLayoutSection title="You do not have a subscription">
          <ul className={styles.list}>
            <li>You are not paying for services.</li>
          </ul>
        </StandardLayoutSection>
      )}

      {isPaying ? (
        <StandardLayoutSection title="Delete your account">
          <ul className={styles.list}>
            <li>Cancel your subscription first before deleting your account.</li>
          </ul>
        </StandardLayoutSection>
      ) : (
        <StandardLayoutSection title="Delete your account">
          <ul className={styles.list}>
            <li>Deleting your account completely removes you from the Internet Development Studio Company's infrastructure.</li>
            <li>Recreate your account at anytime.</li>
          </ul>

          <div className={styles.actions}>
            <ButtonWarning
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
            >
              Delete my account
            </ButtonWarning>
          </div>
        </StandardLayoutSection>
      )}
    </StandardLayout>
  );
}
