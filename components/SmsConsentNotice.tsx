import styles from '@components/SmsConsentNotice.module.css';

import * as React from 'react';
import * as Sms from '@common/sms';

export default function SmsConsentNotice(props: { login?: boolean; compact?: boolean; explanation?: boolean }) {
  return (
    <section className={styles.root} aria-label="Optional text messages">
      {props.compact ? <h3 className={styles.consentHeading}>SMS consent</h3> : (
        <>
          <p className={styles.eyebrow}>A little closer, by text</p>
          <h2 className={styles.heading}>Your account. A conversation away.</h2>
          <p className={styles.description}>Optional customer care for your API token balance and workspace status. {props.login ? 'Sign in, then add your phone number in Settings to request a consent text.' : 'Save your phone number, request the consent text, then reply YES from that number.'}</p>
        </>
      )}
      <blockquote className={styles.prompt}>{Sms.SMS_CONSENT_PROMPT}</blockquote>
      {props.explanation !== false ? <p className={styles.description}>Saving a number or signing in does not subscribe you. Consent is recorded only after your YES reply. SMS consent does not give an organization or application access to your account.</p> : null}
      <div className={styles.links}>
        <a href={Sms.SMS_CONSENT_URL}>SMS consent</a>
        <a href={Sms.SMS_TERMS_URL}>Terms of Service</a>
        <a href={Sms.SMS_PRIVACY_URL}>Privacy Policy</a>
        {props.login ? <a href="/settings-preview">Explore the settings preview ↗</a> : null}
      </div>
    </section>
  );
}
