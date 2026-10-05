import styles from '@components/UserGardenSmsSettings.module.css';

import * as React from 'react';
import * as Sms from '@common/sms';
import * as SmsExamples from '@common/sms-examples';

import Input from '@system/Input';
import SmsConsentNotice from '@components/SmsConsentNotice';

type Props = {
  phone: string;
  verified: boolean;
  preview?: boolean;
  onGet: () => Promise<Sms.SmsResult>;
  onSave: (phone: string) => Promise<Sms.PhoneResult>;
  onRequest: (phone: string, requestId: string) => Promise<Sms.SmsResult>;
  onRemove: () => Promise<Sms.PhoneResult>;
  onPreviewReply?: (reply: 'YES' | 'NO' | 'CANCEL') => Promise<Sms.SmsResult>;
};

const STATUS_LABELS = { saved: 'Number saved · not subscribed', pending: 'Waiting for your YES reply', confirmed: 'Text messages enabled', declined: 'Consent declined · not subscribed', stopped: 'Text messages stopped' };

const PREVIEW_MESSAGES = [
  { text: 'TOKENS', reply: 'Your API token balance is 12,500 INTDEV credits.' },
  { text: 'DESK', reply: SmsExamples.DESK_PAYMENT.payment },
  { text: 'HELP', reply: 'Text TOKENS for your API balance or DESK for workspace status. Reply CANCEL to opt out.' },
  { text: 'CANCEL', reply: 'You are not subscribed. No further service texts will be sent.' },
];

export default function UserGardenSmsSettings(props: Props) {
  const [settings, setSettings] = React.useState<Sms.SmsSettings | null>(null);
  const [phone, setPhone] = React.useState(props.phone);
  const [savedPhone, setSavedPhone] = React.useState(props.phone);
  const [refreshing, setRefreshing] = React.useState(false);
  const [statusUnavailable, setStatusUnavailable] = React.useState(false);
  const [authorized, setAuthorized] = React.useState(false);
  const [pending, setPending] = React.useState('');
  const [error, setError] = React.useState('');
  const [notice, setNotice] = React.useState('');
  const mounted = React.useRef(false);
  const busy = React.useRef(false);
  const request = React.useRef<{ phone: string; id: string } | null>(null);
  const statusRequest = React.useRef(0);
  const id = React.useId();

  React.useEffect(() => {
    mounted.current = true;
    let current = true;
    const generation = ++statusRequest.current;
    setRefreshing(true);
    props.onGet().then((result) => {
      if (!current || generation !== statusRequest.current) return;
      if (result.success) {
        setSettings(result.data);
        setStatusUnavailable(false);
      } else {
        setStatusUnavailable(true);
      }
    }).catch(() => {
      if (current && generation === statusRequest.current) setStatusUnavailable(true);
    }).finally(() => {
      if (current && generation === statusRequest.current) setRefreshing(false);
    });
    return () => { current = false; mounted.current = false; };
  }, [props.onGet]);

  React.useEffect(() => {
    setSavedPhone(props.phone);
    setPhone(props.phone);
    setAuthorized(false);
    request.current = null;
  }, [props.phone]);

  async function refreshStatus() {
    const generation = ++statusRequest.current;
    setRefreshing(true);
    try {
      const result = await props.onGet();
      if (!mounted.current || generation !== statusRequest.current) return;
      setStatusUnavailable(!result.success);
      if (result.success) setSettings(result.data);
    } catch {
      if (mounted.current && generation === statusRequest.current) setStatusUnavailable(true);
    } finally {
      if (mounted.current && generation === statusRequest.current) setRefreshing(false);
    }
  }

  async function savePhone(value: string) {
    if (busy.current) return;
    busy.current = true;
    setPending(value ? 'Saving' : 'Removing');
    setError('');
    setNotice('');
    try {
      const result = await (value ? props.onSave(value) : props.onRemove());
      if (!mounted.current) return;
      if (!result.success) { setError(result.message); return; }
      setSavedPhone(result.phone);
      setPhone(result.phone);
      setAuthorized(false);
      request.current = null;
      setNotice(result.phone ? 'Your phone number is saved.' : 'Your saved phone number was removed. To stop existing texts, reply CANCEL.');
    } catch {
      if (mounted.current) setError('We could not confirm the saved number. Reload Settings to check it.');
    } finally {
      busy.current = false;
      if (mounted.current) setPending('');
    }
  }

  async function perform(label: string, action: () => Promise<Sms.SmsResult>, message = '') {
    if (busy.current) return;
    busy.current = true;
    setPending(label);
    setError('');
    setNotice('');
    try {
      const result = await action();
      if (!mounted.current) return;
      if (!result.success) { setError(result.message); return; }
      setSettings(result.data);
      setStatusUnavailable(false);
      setNotice(message);
    } catch {
      if (mounted.current) setError('We could not confirm the result. Refresh your text settings before trying again.');
    } finally {
      busy.current = false;
      if (mounted.current) setPending('');
    }
  }

  const normalized = Sms.normalizePhoneNumber(phone);
  const contact = settings?.contact?.phone === savedPhone ? settings.contact : null;
  const changed = normalized !== savedPhone;
  const disabled = Boolean(pending);
  const consentDisabled = disabled || !props.verified || !settings?.available || statusUnavailable || refreshing || changed;
  const failedDelivery = contact && ['failed', 'undelivered', 'canceled'].includes(contact.delivery || '');

  return (
    <div className={styles.root} aria-busy={Boolean(pending)}>
      {props.preview ? (
        <table className={styles.messageTable}>
          <caption>Example messages</caption>
          <thead>
            <tr><th scope="col">You text</th><th scope="col">We reply</th></tr>
          </thead>
          <tbody>
            {PREVIEW_MESSAGES.map((message) => <tr key={message.text}><th scope="row">{message.text}</th><td>{message.reply}</td></tr>)}
          </tbody>
        </table>
      ) : null}
      <div className={styles.serviceContact}>
        <p className={styles.serviceLabel}>Text Internet Development Studio Company</p>
        <a className={styles.serviceNumber} href={`sms:${Sms.SMS_NUMBER}`}>{Sms.SMS_NUMBER_DISPLAY}</a>
        <p className={styles.description}>After confirming consent, text <strong>TOKENS</strong> for your API balance, <strong>DESK</strong> for your workspace application status, or <strong>HELP</strong> for help.</p>
      </div>
      <form className={styles.form} onSubmit={(event) => {
        event.preventDefault();
        if (!normalized) { setError('Enter a valid phone number, including the country code for numbers outside the US.'); return; }
        void savePhone(normalized);
      }}>
        <label className={styles.label} htmlFor={`${id}-phone`}>Your phone number</label>
        <Input id={`${id}-phone`} name="smsPhone" type="tel" autoComplete="tel" inputMode="tel" placeholder="+1 202 555 0123" maxLength={40} value={phone} disabled={disabled} aria-describedby={`${id}-phone-help`} onChange={(event) => { setPhone(event.target.value); setAuthorized(false); request.current = null; setNotice(''); }} />
        <p id={`${id}-phone-help`} className={styles.help}>Save your phone number to your account. Saving a number does not send a text or subscribe you to messages.</p>
        <div className={styles.actions}>
          <button className={styles.button} type="submit" disabled={disabled || !normalized || !changed}>{pending === 'Saving' ? 'Saving…' : 'Save phone number'}</button>
          <button className={styles.secondary} type="button" disabled={disabled || refreshing} onClick={() => void refreshStatus()}>{refreshing ? 'Refreshing…' : 'Refresh status'}</button>
        </div>
      </form>
      {!props.verified ? <p className={styles.help}>You can save your number now. Verify your account e-mail before requesting a consent text.</p> : null}
      {statusUnavailable || (settings && !settings.available) ? <p className={styles.help}>Text messaging is not available yet. You can still save or update your phone number.</p> : null}
      <SmsConsentNotice compact explanation={!props.preview} />
      {savedPhone ? (
        <div className={styles.contact}>
          <div className={styles.statusRow}><span className={styles.number}>{savedPhone}</span><span className={styles.badge}>{contact && !statusUnavailable ? STATUS_LABELS[contact.status] : 'Phone number saved'}</span></div>
          {contact?.status === 'pending' ? <p className={styles.help}>Reply YES to the consent text from {Sms.SMS_NUMBER_DISPLAY}, then refresh status here. Reply NO to decline. A request expires after 24 hours.</p> : null}
          {contact?.status === 'confirmed' ? <p className={styles.help}>Text TOKENS, DESK, or HELP to <a href={`sms:${Sms.SMS_NUMBER}`}>{Sms.SMS_NUMBER_DISPLAY}</a>. Reply CANCEL at any time to stop.</p> : null}
          {contact?.delivery ? <p className={styles.help}>Consent text: <strong>{contact.delivery === 'requesting' ? 'request in progress' : contact.delivery}</strong>. {contact.delivery === 'delivered' ? 'Delivery does not establish consent.' : 'Delivery is only confirmed when the carrier reports delivered.'}</p> : null}
          {failedDelivery ? <p className={styles.error}>The consent text could not be delivered. Check the number and request a new text when service is available.</p> : null}
          {contact?.delivery === 'unknown' ? <p className={styles.status}>The provider did not confirm the send. Check your phone and refresh status before retrying; the text may still arrive.</p> : null}
          {contact?.status === 'stopped' || contact?.status === 'declined' ? <p className={styles.help}>To begin again, text START to {Sms.SMS_NUMBER_DISPLAY}, then text SUPPORT for a new consent prompt. Only a YES reply to that prompt enables service texts.</p> : null}
          {!contact || contact.status === 'saved' || contact.status === 'pending' ? (
            <>
              <label className={styles.check}>
                <input type="checkbox" checked={authorized} disabled={consentDisabled} onChange={(event) => setAuthorized(event.target.checked)} />
                <span>I own {savedPhone} and request the consent text shown above. I understand that I must reply YES to enable service texts.</span>
              </label>
              <button className={styles.button} type="button" disabled={consentDisabled || !authorized} onClick={() => {
                if (!request.current || request.current.phone !== savedPhone) request.current = { phone: savedPhone, id: crypto.randomUUID() };
                const nextRequest = request.current;
                void perform('Requesting', () => props.onRequest(nextRequest.phone, nextRequest.id), props.preview ? 'Preview consent prompt prepared. Try a reply below.' : 'Request recorded. Check the delivery state below and reply YES when the text arrives.');
              }}>{pending === 'Requesting' ? 'Requesting…' : props.preview ? 'Preview consent text' : 'Request consent text'}</button>
              {contact?.requestedAt ? <p className={styles.help}>One request per minute, up to five per day. To request a new text after checking status, <button type="button" className={styles.inlineButton} disabled={Boolean(pending)} onClick={() => { request.current = null; setAuthorized(false); setNotice('Review the checkbox and request a new consent text when you are ready.'); }}>start a new request</button>.</p> : null}
            </>
          ) : null}
          {props.onPreviewReply && (contact?.status === 'pending' || contact?.status === 'confirmed') ? <div className={styles.actions} aria-label="Simulate a text reply">{(['YES', 'NO', 'CANCEL'] as const).map((reply) => <button className={styles.secondary} type="button" key={reply} disabled={Boolean(pending)} onClick={() => void perform('Previewing', () => props.onPreviewReply!(reply), `Preview only: ${reply} reply recorded.`)}>Preview {reply}</button>)}</div> : null}
          <div className={styles.actions}><button className={styles.secondary} type="button" disabled={disabled} onClick={() => void savePhone('')}>Remove saved number</button></div>
        </div>
      ) : null}
      <div aria-live="polite" aria-atomic="true">
        {pending ? <p className={styles.help}>{pending}…</p> : null}
        {notice ? <p className={styles.status}>{notice}</p> : null}
      </div>
      {error ? <p className={styles.error} role="alert">{error}</p> : null}
    </div>
  );
}
