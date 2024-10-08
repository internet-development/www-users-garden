import styles from '@components/UserGardenAccess.module.scss';

import * as Constants from '@common/constants';
import * as React from 'react';
import * as Utilities from '@common/utilities';

import Button from '@system/Button';
import Cookies from 'js-cookie';
import Input from '@system/Input';
import StandardHeader from '@components/StandardHeader';
import StandardLayout from '@components/StandardLayout';
import StandardLayoutSection from '@components/StandardLayoutSection';

import { P, SubTitle } from '@system/typography';

function UserAccessChangePassword(props) {
  const [password, setPassword] = React.useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = React.useState<string>('');

  return (
    <StandardLayoutSection title="Change your password">
      <ul className={styles.list}>
        <li>Changing your password is irreversible.</li>
        <li>Your password must be at least 4 characters.</li>
      </ul>

      <Input
        autoComplete="off"
        value={password}
        name="password"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        placeholder="Type your new password"
        style={{ marginTop: 16 }}
        type="password"
      />
      <Input
        autoComplete="off"
        value={passwordConfirm}
        name="passwordConfirm"
        onChange={(e) => {
          setPasswordConfirm(e.target.value);
        }}
        placeholder="Confirm your new password"
        style={{ marginTop: 16 }}
        type="password"
      />

      <div className={styles.actions}>
        <Button
          loading={props.loading}
          onClick={async () => {
            if (Utilities.isEmpty(password)) {
              alert('You need to enter a new password to continue');
              return;
            }

            if (Utilities.isEmpty(passwordConfirm)) {
              alert('You need to confirm your new password');
              return;
            }

            if (password !== passwordConfirm) {
              alert('You need to enter a new password to continue');
              return;
            }

            const response = await props.onChangeUserPassword({ password });

            if (response && response.success) {
              alert('Your password was changed successfully');
              setPassword('');
              setPasswordConfirm('');
            }
          }}
        >
          Change
        </Button>
      </div>
    </StandardLayoutSection>
  );
}

function UserAccessViewUserID(props) {
  return (
    <StandardLayoutSection title="Your user ID">
      <ul className={styles.list}>
        <li>This is your User ID, in case you need it for any API operations.</li>
      </ul>
      <Input autoComplete="off" defaultValue={props.viewer.id} name="user_id" readOnly style={{ marginTop: 16 }} />
    </StandardLayoutSection>
  );
}

function UserAccessViewAPIKey(props) {
  const [show, setShow] = React.useState<boolean>(false);
  const [password, setPassword] = React.useState<string>('');

  return (
    <StandardLayoutSection title="Manage your API key">
      <ul className={styles.list}>
        <li>Your API key allows you to programmatically access our API.</li>
        <li>You are only permitted to have one API key per account.</li>
        <li>Requires your current password to change.</li>
      </ul>

      <Input
        autoComplete="off"
        value={password}
        name="password"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        placeholder="Type your current password"
        style={{ marginTop: 16 }}
        type="password"
      />

      <Input autoComplete="off" value={props.sessionKey} name="key" readOnly style={{ marginTop: 16 }} type={!show ? `password` : `text`} />

      <div className={styles.actions}>
        <Button
          loading={props.loading}
          onClick={async () => {
            setShow(!show);
          }}
          style={{ marginRight: 16, marginBottom: 16 }}
        >
          {!show ? `Reveal` : `Hide`}
        </Button>
        {Utilities.isEmpty(password) ? null : (
          <Button
            loading={props.loading}
            onClick={async () => {
              const allow = window.confirm(
                'Regenerating your API key may break existing applications, you may not want to do this if you have applications depending on this API key'
              );
              if (!allow) {
                return;
              }

              const response = await props.onUserRegenerateAPIKey({ email: props.viewer.email, password });

              if (response && response.user) {
                alert('Success, your API key has been regenerated.');
                setPassword('');
                setShow(false);
              } else {
                alert('Something went wrong, please try again later.');
              }

              return response;
            }}
            style={{ marginRight: 16, marginBottom: 16 }}
          >
            Regenerate
          </Button>
        )}
      </div>
    </StandardLayoutSection>
  );
}

export default function UserGardenAccess(props) {
  const [loading, setLoading] = React.useState<boolean>(false);

  const isVerified = props.viewer.level >= Constants.Users.tiers.VERIFIED;
  const isPaying = props.viewer.level >= Constants.Users.tiers.PAYING;
  const isOffice = props.viewer.level >= Constants.Users.tiers.GENERAL_CO_WORKING;
  const isPartner = props.viewer.level >= Constants.Users.tiers.PARTNER;
  const isAdmin = props.viewer.level >= Constants.Users.tiers.ADMIN;

  return (
    <StandardLayout>
      <StandardHeader title="Manage account access">
        Manage your account access: you can change your password here or generate a new API key to programmatically access our API.
      </StandardHeader>

      <UserAccessChangePassword
        loading={props.loading}
        onChangeUserPassword={async (nextData) => {
          setLoading(true);
          const response = await props.onChangeUserPassword(nextData);
          setLoading(false);
          return response;
        }}
        viewer={props.viewer}
      />

      <UserAccessViewUserID viewer={props.viewer} />

      <UserAccessViewAPIKey
        loading={props.loading}
        onUserRegenerateAPIKey={async (nextData) => {
          setLoading(true);
          const response = await props.onUserRegenerateAPIKey(nextData);
          setLoading(false);
          return response;
        }}
        viewer={props.viewer}
        sessionKey={props.sessionKey}
      />
    </StandardLayout>
  );
}
