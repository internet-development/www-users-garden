import styles from '@components/UserAccess.module.scss';

import * as Constants from '@common/constants';
import * as React from 'react';
import * as Utilities from '@common/utilities';

import Button from '@system/Button';
import Cookies from 'js-cookie';
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

function UserAccessChangePassword(props) {
  const [password, setPassword] = React.useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = React.useState<string>('');

  return (
    <Group title="CHANGE PASSWORD">
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
        placeholder="Your next password"
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
        placeholder="Type the same password again"
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
    </Group>
  );
}

function UserAccessViewAPIKey(props) {
  const [show, setShow] = React.useState<boolean>(false);
  const [password, setPassword] = React.useState<string>('');

  return (
    <Group title="API KEY">
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
        placeholder="Password"
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
    </Group>
  );
}

export default function UserAccess(props) {
  const [loading, setLoading] = React.useState<boolean>(false);

  const isVerified = props.viewer.level >= Constants.Users.tiers.VERIFIED;
  const isPaying = props.viewer.level >= Constants.Users.tiers.PAYING;
  const isOffice = props.viewer.level >= Constants.Users.tiers.GENERAL_CO_WORKING;
  const isPartner = props.viewer.level >= Constants.Users.tiers.PARTNER;
  const isAdmin = props.viewer.level >= Constants.Users.tiers.ADMIN;

  return (
    <div className={styles.root}>
      <img className={styles.image} src="https://intdev-global.s3.us-west-2.amazonaws.com/public/internet-dev/f2cd0f8d-51f9-4059-af55-177218272bb7.png" alt="Access Image" />

      <div className={styles.section}>
        <SubTitle style={{ opacity: 0.6 }}>ACCESS</SubTitle>
        <P style={{ marginTop: 6 }}>Manage your account access: you can change your password here or generate a new API key to programmatically access our API.</P>
      </div>

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
    </div>
  );
}
