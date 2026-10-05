import styles from '@scenes/UserGardenSettingsPreview.module.css';

import * as React from 'react';
import * as Sms from '@common/sms';

import AnyTextHeader from '@components/AnyTextHeader';
import InternetDevelopmentLogoWordmark from '@components/InternetDevelopmentLogoWordmark';
import SmsServiceExamples from '@components/SmsServiceExamples';
import UserGardenSmsSettings from '@components/UserGardenSmsSettings';
import WaterFrame from '@components/WaterFrame';

export default function UserGardenSettingsPreview() {
  const [phone, setPhone] = React.useState('');
  const state = React.useRef<Sms.SmsSettings>({ contact: null, available: true });
  const actions = React.useMemo(() => ({
    get: async (): Promise<Sms.SmsResult> => ({ success: true, data: state.current }),
    save: async (phone: string): Promise<Sms.PhoneResult> => {
      setPhone(phone);
      return { success: true, phone };
    },
    request: async (phone: string): Promise<Sms.SmsResult> => {
      state.current = { available: true, contact: { phone, status: 'pending', delivery: null, requestedAt: new Date().toISOString(), confirmedAt: null } };
      return { success: true, data: state.current };
    },
    remove: async (): Promise<Sms.PhoneResult> => {
      setPhone('');
      return { success: true, phone: '' };
    },
    reply: async (reply: 'YES' | 'NO' | 'CANCEL'): Promise<Sms.SmsResult> => {
      state.current = { available: true, contact: { ...state.current.contact!, status: reply === 'YES' ? 'confirmed' : reply === 'NO' ? 'declined' : 'stopped', confirmedAt: reply === 'YES' ? new Date().toISOString() : null } };
      return { success: true, data: state.current };
    },
  }), []);

  return (
    <div className={styles.root}>
      <AnyTextHeader href="/" actionHref="/" actionLabel="SIGN IN ↗">USERS.GARDEN</AnyTextHeader>
      <main className={styles.main}>
        <section className={styles.hero} aria-labelledby="preview-heading">
          <div className={styles.introduction}>
            <InternetDevelopmentLogoWordmark />
            <h1 id="preview-heading" className={styles.title}>INTDEV can provide you direct access to your API credits and desk space</h1>
            <p className={styles.lead}>Text our dedicated number for support if you are paying for INTDEV services.</p>
          </div>
          <div className={styles.artwork}><WaterFrame /></div>
        </section>

        <section className={styles.section} id="phone-settings" aria-labelledby="phone-heading">
          <div className={styles.sectionHeading}><h2 id="phone-heading">Text settings</h2></div>
          <div className={styles.sectionContent}><UserGardenSmsSettings phone={phone} preview verified onGet={actions.get} onSave={actions.save} onRequest={actions.request} onRemove={actions.remove} onPreviewReply={actions.reply} /></div>
        </section>

        <section className={styles.examples} aria-label="Example SMS conversations">
          <SmsServiceExamples />
        </section>
      </main>
      <footer className={styles.footer}>
        <a href={Sms.SMS_TERMS_URL}>Terms of Service</a>
        <a href={Sms.SMS_PRIVACY_URL}>Privacy Policy</a>
      </footer>
    </div>
  );
}
