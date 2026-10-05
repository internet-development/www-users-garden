import styles from '@components/SmsServiceExamples.module.css';

import * as React from 'react';
import * as SmsExamples from '@common/sms-examples';

export default function SmsServiceExamples() {
  return (
    <div className={styles.root}>
      <div className={styles.conversation} aria-label="Token balance and workspace status">
        <div className={styles.context}>
          <h3 className={styles.heading}>Service messages</h3>
          <p className={styles.description}>Check API credits, upcoming desk payments, cancellation options, and invoices for expenses. Message frequency varies. Message and data rates may apply.</p>
        </div>
        <div className={styles.messages}>
          <p className={styles.outgoing}>TOKENS</p>
          <p className={styles.incoming}>Your API token balance is 12,500 INTDEV credits. Reply HELP for help or CANCEL to opt out.</p>
          <p className={styles.outgoing}>DESK</p>
          <p className={styles.incoming}>{SmsExamples.DESK_PAYMENT.payment}</p>
          <p className={styles.incoming}>{SmsExamples.DESK_PAYMENT.cancellation}</p>
          <p className={styles.incoming}>{SmsExamples.DESK_PAYMENT.invoices}</p>
        </div>
      </div>
      <div className={styles.conversation} aria-label="Planned organization and application permission example">
        <div className={styles.context}>
          <h3 className={styles.heading}>A separate decision</h3>
          <p className={styles.description}>Consent to receive texts is separate from a reservation, permission grant, or organization membership. Each request or invitation needs its own response.</p>
        </div>
        <div className={styles.messages}>
          <p className={styles.incoming}>Planned permission request: Example Desk App, by Example Studio, would like to read your desk reservation status. Request 4812.</p>
          <p className={styles.outgoing}>DECLINE 4812</p>
          <p className={styles.incoming}>Request declined. No access granted.</p>
          <p className={styles.incoming}>Planned invitation: Example Projects invites you to join the Example Collective organization so you can use its application. Invitation 7306. Reply JOIN 7306 to accept or DECLINE 7306 to decline.</p>
          <p className={styles.outgoing}>JOIN 7306</p>
          <p className={styles.incoming}>Invitation accepted. You have joined Example Collective and can now use Example Projects with your Users.Garden account.</p>
        </div>
      </div>
      <div className={styles.conversation} aria-label="Help and opting out">
        <div className={styles.context}>
          <h3 className={styles.heading}>Always your choice</h3>
          <p className={styles.description}>Reply YES to confirm, NO to decline, HELP for help, or CANCEL to opt out. SMS is optional.</p>
        </div>
        <div className={styles.messages}>
          <p className={styles.outgoing}>HELP</p>
          <p className={styles.incoming}>Text TOKENS for your API balance or DESK for workspace status. Reply CANCEL to opt out.</p>
          <p className={styles.outgoing}>CANCEL</p>
          <p className={styles.incoming}>You are not subscribed. No further service texts will be sent.</p>
        </div>
      </div>
    </div>
  );
}
