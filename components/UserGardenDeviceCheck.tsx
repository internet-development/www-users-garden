import styles from '@components/UserGardenDeviceCheck.module.css';

import * as DeviceCheck from '@root/compliance/site/client';
import * as React from 'react';

import Button from '@system/Button';
import ButtonPrimary from '@system/ButtonPrimary';
import StandardHeader from '@components/StandardHeader';
import StandardLayout from '@components/StandardLayout';
import StandardLayoutSection from '@components/StandardLayoutSection';
import TextArea from '@system/TextArea';

import { P } from '@system/typography';
import { DEVICE_CHECK_FRESH_DAYS } from '@root/compliance/site/records';

import type { DeviceMember } from '@root/compliance/site/types';

const CHIP_LABELS = { apple_silicon: 'Apple silicon', t2: 'Intel with T2', intel: 'Intel' };

function formatDate(value: string): string {
  return new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

function dueDate(checkedAt: string, freshDays: number): string {
  return new Date(new Date(checkedAt).getTime() + freshDays * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, { dateStyle: 'medium' });
}

function Rows(props: { rows: [string, React.ReactNode][] }) {
  return (
    <dl className={styles.rows}>
      {props.rows.map(([label, value]) => (
        <div className={styles.row} key={label}>
          <dt className={styles.label}>{label}</dt>
          <dd className={styles.value}>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function UserGardenDeviceCheck(props) {
  const isTeamMember = DeviceCheck.isCurrentTeamMember(props.viewer);
  const [text, setText] = React.useState<string>('');
  const [sending, setSending] = React.useState<boolean>(false);
  const [copied, setCopied] = React.useState<boolean>(false);
  const [result, setResult] = React.useState<DeviceCheck.DeviceCheckInResult | null>(null);
  const [member, setMember] = React.useState<DeviceMember | null>(null);
  const [freshDays, setFreshDays] = React.useState<number>(DEVICE_CHECK_FRESH_DAYS);
  const [fleetError, setFleetError] = React.useState<string>('');

  const parsed = DeviceCheck.readDeviceReport(text);
  const device = parsed && 'device' in parsed ? parsed.device : null;

  const loadFleet = React.useCallback(async () => {
    if (!isTeamMember) return;
    const response = await props.onGetDeviceFleet({ id: props.viewer.id });
    if (response.success) {
      setMember(response.member);
      setFreshDays(response.freshDays || DEVICE_CHECK_FRESH_DAYS);
      setFleetError('');
    } else {
      setFleetError(response.message);
    }
  }, [isTeamMember, props.onGetDeviceFleet, props.viewer.id]);

  React.useEffect(() => {
    loadFleet();
  }, [loadFleet]);

  async function onCopyCommand() {
    try {
      await navigator.clipboard.writeText(DeviceCheck.DEVICE_CHECK_COMMAND);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  async function onSend() {
    if (!device || sending) return;
    setSending(true);
    const response = await props.onDeviceCheckIn({ device });
    setSending(false);
    setResult(response);
    if (response.success) {
      setText('');
      loadFleet();
    }
  }

  return (
    <StandardLayout>
      <StandardHeader title="Device check">
        Report a Mac’s disk encryption and removable media to the INTDEV API. Anyone signed in can run the check. INTDEV team members report every Mac they use for INTDEV work at least every {freshDays} days and whenever they set up a new one, and the fleet record on the compliance pages is built only from their reports.
      </StandardHeader>

      <StandardLayoutSection title="1. Run the check on your Mac">
        <P style={{ marginTop: 6 }}>Open Terminal on the laptop you are reporting and run this command. It reads FileVault, the data volume, the chip, MDM enrollment, and any mounted external drives from macOS, then copies the report to your clipboard. It changes nothing, needs no administrator password, and never asks for your API key.</P>
        <pre className={styles.command}>{DeviceCheck.DEVICE_CHECK_COMMAND}</pre>
        <div className={styles.actions}>
          <Button onClick={onCopyCommand}>{copied ? 'Copied' : 'Copy command'}</Button>
        </div>
      </StandardLayoutSection>

      <StandardLayoutSection title="2. Paste the report and send it">
        <P style={{ marginTop: 6 }}>Paste the report here. It is sent with your signed-in account, {props.viewer.email}, and recorded as your laptop. Send only a report made on your own laptop, exactly as the check copied it and within a day: the API refuses an edited or day-old report, and a laptop an INTDEV team member has already reported.</P>
        <TextArea
          aria-label="Device check report"
          autoComplete="off"
          name="device_report"
          onChange={(e) => {
            setText(e.target.value);
            setResult(null);
          }}
          placeholder="Paste the device check report"
          spellCheck={false}
          style={{ marginTop: 16, minHeight: 96 }}
          value={text}
        />
        {parsed && 'error' in parsed ? <p className={styles.error}>{parsed.error}</p> : null}
        {device ? (
          <Rows
            rows={[
              ['Laptop', `${device.model} (${CHIP_LABELS[device.chip] ?? device.chip}), macOS ${device.os_version}`],
              ['FileVault', device.filevault_status.split('\n')[0]],
              ['Data volume', device.data_volume.encrypted && device.data_volume.filevault ? 'Encrypted with FileVault' : 'Not reported as encrypted'],
              ['External drives', `${device.removable_media.mounted} mounted, ${device.removable_media.unencrypted_writable} unencrypted and writable`],
              ['MDM enrolled', device.mdm_enrolled ? 'Yes' : 'No'],
              ['Reference', device.device_ref],
              ...(device.generated_at ? [['Checked on this Mac', formatDate(device.generated_at)] as [string, string]] : []),
            ]}
          />
        ) : null}
        <div className={styles.actions}>
          <ButtonPrimary disabled={!device} loading={sending} onClick={onSend} style={device ? undefined : { opacity: 0.4, cursor: 'not-allowed' }}>
            Send report
          </ButtonPrimary>
        </div>
        {result && !result.success ? (
          <p className={styles.error} role="alert">
            {result.message}
          </p>
        ) : null}
        {result && result.success ? (
          <div className={styles.status} role="status">
            Recorded {formatDate(result.data.checked_at)}. {result.data.assessment.disk_encrypted ? `Disk encrypted: ${result.data.assessment.cipher}.` : 'This laptop does not pass: FileVault must be on and finished encrypting.'} {result.data.assessment.removable_media_clear ? 'No unencrypted writable external drive is mounted.' : 'An unencrypted writable external drive is mounted; eject it or encrypt it.'} {isTeamMember ? (
              <>
                Next check due by {dueDate(result.data.checked_at, freshDays)}.{' '}
                <a href={DeviceCheck.DEVICE_CHECK_RECORD_URL} target="_blank">
                  See your record on the compliance page.
                </a>
              </>
            ) : null}
          </div>
        ) : null}
      </StandardLayoutSection>

      <StandardLayoutSection title="Your laptops">
        {!isTeamMember ? <P style={{ marginTop: 6 }}>The compliance record lists current INTDEV team members only. Laptops you report are kept under your account and appear here and on the record once you join the team.</P> : null}
        {isTeamMember && fleetError ? <P style={{ marginTop: 6 }}>{fleetError}</P> : null}
        {isTeamMember && !fleetError && (!member || !member.devices.length) ? <P style={{ marginTop: 6 }}>No laptop is reported under your account yet.</P> : null}
        {member && member.devices.length
          ? member.devices.map((each) => (
              <Rows
                key={each.device_ref}
                rows={[
                  ['Laptop', `${each.model} (${CHIP_LABELS[each.chip] ?? each.chip}), macOS ${each.os_version}`],
                  ['Encrypted', each.assessment.disk_encrypted ? `Yes, ${each.assessment.cipher}` : 'No'],
                  ['External drives', each.assessment.removable_media_clear ? 'None unencrypted and writable' : 'An unencrypted writable drive was mounted'],
                  ['Last check', `${formatDate(each.checked_at)}${each.current ? '' : ', out of date'}`],
                  ['Next due', each.current ? dueDate(each.checked_at, freshDays) : 'Now'],
                  ['Reference', each.device_ref],
                ]}
              />
            ))
          : null}
        {isTeamMember ? <P style={{ marginTop: 16 }}>The compliance page validates every team member’s laptops from these reports. It can take up to a minute to show a new one.</P> : null}
        <div className={styles.actions}>
          <Button href={DeviceCheck.DEVICE_CHECK_RECORD_URL} target="_blank">
            View compliance page
          </Button>
        </div>
      </StandardLayoutSection>
    </StandardLayout>
  );
}
