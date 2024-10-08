import styles from '@components/UserGardenDashboardProfile.module.scss';

import * as Constants from '@common/constants';
import * as React from 'react';
import * as Utilities from '@common/utilities';

import Button from '@system/Button';
import Input from '@system/Input';
import StandardHeader from '@components/StandardHeader';
import StandardLayout from '@components/StandardLayout';
import StandardLayoutSection from '@components/StandardLayoutSection';

export default function UserGardenDashboardProfile(props) {
  const [customField, setCustomField] = React.useState<string>('');
  const [customName, setCustomName] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);

  const isVerified = props.viewer.level >= Constants.Users.tiers.VERIFIED;
  const isPaying = props.viewer.level >= Constants.Users.tiers.PAYING;
  const isOffice = props.viewer.level >= Constants.Users.tiers.GENERAL_CO_WORKING;
  const isPartner = props.viewer.level >= Constants.Users.tiers.PARTNER;
  const isAdmin = props.viewer.level >= Constants.Users.tiers.ADMIN;

  return (
    <StandardLayout>
      <StandardHeader title="Your settings">
        Update your user information here. Please note that some fields require verification to change and modifying certain fields may impact other connected applications. For
        guidance, refer to the provided sections.
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
            You are a <strong>collaborator</strong>. You have access to our physical workspace.
          </li>
          <li style={!isPartner ? { opacity: 0.1 } : undefined}>
            You are a <strong>partner</strong>. You have special privileges.
          </li>
          <li style={!isAdmin ? { opacity: 0.1 } : undefined}>
            You are an <strong>administrator</strong>. You made this world.
          </li>
        </ul>

        {!isPaying ? (
          <div className={styles.actions}>
            <Button onClick={() => props.onNavigate({ active: 'USER_UPGRADE' })}>Upgrade</Button>
          </div>
        ) : null}
      </StandardLayoutSection>

      {!isVerified && (
        <StandardLayoutSection title="Verify your e-mail">
          <ul className={styles.list}>
            <li>You must verify your e-mail to use our services.</li>
          </ul>
          <div className={styles.actions}>
            <Button
              loading={loading}
              onClick={async () => {
                setLoading(true);
                await props.onSendVerifyEmail();
                setLoading(false);
              }}
            >
              Send
            </Button>
          </div>
          {props.status['email'] && (
            <div className={styles.status}>
              <span style={{ color: `var(--theme-success)` }}>✓</span> {props.status['email']}
            </div>
          )}
        </StandardLayoutSection>
      )}

      <StandardLayoutSection title="Your application data">
        <ul className={styles.list}>
          <li>This data comes from applications you have been using.</li>
          <li>Your custom data is editable.</li>
          <li>Altering this data may break other applications.</li>
        </ul>

        <div className={styles.group}>
          <div className={styles.groupLabel}>
            <span className={styles.groupLabelText}>Add new field</span>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputGroupLeft}>
              <Input autoComplete="off" onChange={(e) => setCustomName(e.target.value)} placeholder="Type a name" value={customName} />
            </div>
            <div className={styles.inputGroupRight}>
              <Input autoComplete="off" onChange={(e) => setCustomField(e.target.value)} placeholder="Type a value" value={customField} />
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <Button
            loading={loading}
            onClick={async () => {
              if (Utilities.isEmpty(customName)) {
                alert('You must provide a new variable name.');
                return;
              }

              if (Utilities.isEmpty(customField)) {
                alert('You must provide a value for the variable you added.');
                return;
              }

              setLoading(true);
              await props.onSaveCurrentUserDataField({ name: customName, value: customField });
              setCustomField('');
              setCustomName('');
              setLoading(false);
            }}
          >
            Add
          </Button>
        </div>

        <div className={styles.group}>
          <div className={styles.groupLabel}>
            <span className={styles.groupLabelText}>Custom data ({Object.keys(props.viewer.data).length})</span>
          </div>
          {Object.keys(props.viewer.data).map((name) => {
            const value = props.viewer.data[name];

            return (
              <div className={styles.inputGroup} key={`input-group-${name}`}>
                <div className={styles.inputGroupLeft}>
                  <Input autoComplete="off" disabled style={{ color: `var(--theme-border)` }} value={name} />
                </div>
                <div className={styles.inputGroupRight}>
                  <Input autoComplete="off" name={name} onChange={props.onChangeData} placeholder="type a value" value={value} />
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.actions}>
          <Button
            loading={loading}
            onClick={async () => {
              setLoading(true);
              await props.onSaveCurrentUserData();
              setLoading(false);
            }}
          >
            Save
          </Button>
        </div>

        {props.status['data'] && (
          <div className={styles.status}>
            <span style={{ color: `var(--theme-success)` }}>✓</span> {props.status['data']}
          </div>
        )}
      </StandardLayoutSection>

      <StandardLayoutSection title="Change your username">
        <ul className={styles.list}>
          <li>Your username must be at least 2 characters.</li>
          <li>Your username must be unique.</li>
          <li>This change will effect URLs with your username.</li>
        </ul>

        <Input autoComplete="off" name="username" onChange={props.onChange} placeholder="Type your new username" style={{ marginTop: 16 }} value={props.viewer.username} />
        <div className={styles.actions}>
          <Button
            loading={loading}
            onClick={async () => {
              setLoading(true);
              await props.onSaveCurrentUser();
              setLoading(false);
            }}
          >
            Save
          </Button>
        </div>
        {props.status['username'] && (
          <div className={styles.status}>
            <span style={{ color: `var(--theme-success)` }}>✓</span> {props.status['username']}
          </div>
        )}
      </StandardLayoutSection>
    </StandardLayout>
  );
}
