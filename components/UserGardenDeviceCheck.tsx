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
import { CONTACTS } from '@root/compliance/site/facts';
import { DEVICE_CHECK_FRESH_DAYS, DEVICE_CHECK_SCRIPT, SUPPORTED_MACOS } from '@root/compliance/site/records';

import type { DeviceFixId } from '@root/compliance/site/client';
import type { DeviceAntiMalware, DeviceAssessment, DeviceMember } from '@root/compliance/site/types';

const CHIP_LABELS = { apple_silicon: 'Apple silicon', t2: 'Intel with T2', intel: 'Intel' };

const BEFORE_CHECK_3 = 'reported before device check 3; rerun the check';

const NOT_IN_REPORT = 'Not in this report, which is from before device check 3; rerun the check';

function formatDate(value: string): string {
  return new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

function dueDate(checkedAt: string, freshDays: number): string {
  return new Date(new Date(checkedAt).getTime() + freshDays * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, { dateStyle: 'medium' });
}

function sentence(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function automatic(on: boolean): string {
  return on ? 'Installed automatically' : 'Not installed automatically';
}

function xprotectLabel(version: string | null, installedAt: string | null): string {
  if (!version) return 'Definitions not found';
  return installedAt ? `Version ${version}, installed ${formatDate(installedAt)}` : `Version ${version}`;
}

function antiMalwareText(active: boolean | null, malware: DeviceAntiMalware | undefined): string {
  if (active === null || !malware) return BEFORE_CHECK_3;
  if (active) return `active (Gatekeeper on, XProtect ${malware.xprotect.version}, security responses installed automatically)`;
  const failing = [
    malware.gatekeeper.on ? null : 'Gatekeeper is off',
    malware.xprotect.version ? null : 'XProtect definitions were not found',
    malware.automatic_updates.xprotect ? null : 'security responses are not installed automatically',
  ].filter(Boolean);
  return failing.length ? `not active (${failing.join(', ')})` : 'not active';
}

function firewallText(on: boolean | null): string {
  if (on === null) return BEFORE_CHECK_3;
  return on ? 'on' : 'off';
}

function patchText(assessment: DeviceAssessment, osVersion: string): string | null {
  if (assessment.patch_current === undefined) return null;
  if (assessment.patch_current === null) return BEFORE_CHECK_3;
  if (assessment.patch_current) return `patched (macOS ${osVersion} is supported, and security updates install automatically)`;
  const failing = [assessment.os_supported ? null : `macOS ${osVersion} is no longer supported; update to macOS ${SUPPORTED_MACOS.minimum_major} or later`, assessment.security_updates_on ? null : 'security updates do not install automatically'].filter(Boolean);
  return `not patched (${failing.join(', ')})`;
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

function laptopLabel(model: string, chip: string): string {
  return `${model} (${CHIP_LABELS[chip] ?? chip})`;
}

function fixElementId(id: DeviceFixId): string {
  return `device-fix-${id}`;
}

function scrollToFix(id: DeviceFixId) {
  document.getElementById(fixElementId(id))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function FixLinks(props: { fixes: DeviceFixId[] }) {
  return (
    <>
      {props.fixes.map((id, index) => (
        <React.Fragment key={id}>
          {index ? ', ' : ''}
          <button className={styles.link} onClick={() => scrollToFix(id)} type="button">
            {DeviceCheck.DEVICE_FIXES[id].title}
          </button>
        </React.Fragment>
      ))}
    </>
  );
}

function Command(props: { command: string; label: string }) {
  const [copied, setCopied] = React.useState<boolean>(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(props.command);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <>
      <pre aria-label={props.label} className={styles.command}>
        {props.command}
      </pre>
      <div className={styles.actions}>
        <Button onClick={onCopy}>{copied ? 'Copied' : 'Copy command'}</Button>
      </div>
    </>
  );
}

export default function UserGardenDeviceCheck(props) {
  const isTeamMember = DeviceCheck.isCurrentTeamMember(props.viewer);
  const [text, setText] = React.useState<string>('');
  const [sending, setSending] = React.useState<boolean>(false);
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

  const resultPatch = result && result.success ? patchText(result.data.assessment, result.data.device.os_version) : null;
  const resultFixes = result && result.success ? DeviceCheck.deviceFixes({ anti_malware: result.data.device.anti_malware, assessment: result.data.assessment }) : [];

  const neededBy: Partial<Record<DeviceFixId, string[]>> = {};
  const need = (id: DeviceFixId, laptop: string) => {
    neededBy[id] = [...new Set([...(neededBy[id] ?? []), laptop])];
  };
  if (result && result.success) resultFixes.forEach((id) => need(id, laptopLabel(result.data.device.model, result.data.device.chip)));
  (member?.devices ?? []).forEach((each) => DeviceCheck.deviceFixes(each).forEach((id) => need(id, laptopLabel(each.model, each.chip))));
  const allFixes = Object.values(DeviceCheck.DEVICE_FIXES);
  const orderedFixes = [...allFixes.filter((fix) => neededBy[fix.id]), ...allFixes.filter((fix) => !neededBy[fix.id])];

  return (
    <StandardLayout>
      <StandardHeader title="Device check">
        Report a Mac’s disk encryption, removable media, anti-malware, firewall, and patch state to the INTDEV API. Anyone signed in can run the check. INTDEV team members report every Mac they use for INTDEV work at least every {freshDays} days, so at least once a month, and whenever they set up a new one, and the fleet record on the compliance pages is built only from their reports.
      </StandardHeader>

      <StandardLayoutSection title="What you need">
        <P style={{ marginTop: 6 }}>Everything the check uses comes with macOS, so there is nothing to install. These links are Apple’s instructions and the script itself.</P>
        <Rows
          rows={DeviceCheck.DEVICE_CHECK_REQUIREMENTS.map((item): [string, React.ReactNode] => [
            item.name,
            <>
              {item.detail}{' '}
              <a className={styles.inline} href={item.link.href} rel="noreferrer" target="_blank">
                {item.link.label}
              </a>
            </>,
          ])}
        />
      </StandardLayoutSection>

      <StandardLayoutSection title="1. Run the check on your Mac">
        <P style={{ marginTop: 6 }}>Open Terminal on the laptop you are reporting, paste this command, and press Return. It reads FileVault, the data volume, the chip, MDM enrollment, and any mounted external drives from macOS, along with Gatekeeper, the installed XProtect definitions, whether security responses and security updates install automatically, and the application firewall, then copies the report to your clipboard. It changes nothing, needs no administrator password, and never asks for your API key.</P>
        <Command command={DeviceCheck.DEVICE_CHECK_COMMAND} label="Device check command" />
        <P style={{ marginTop: 24 }}>
          The command saves the script to a private temporary folder and runs it only when its SHA-256 matches the version this page was published with, so Terminal prints OK before the check starts. If it prints FAILED instead, nothing ran: reload this page and try again, and if it fails again, tell {CONTACTS.support}. Never run a version of the command that skips this step.
        </P>
        <P style={{ marginTop: 24 }}>
          If you would rather read the script before it runs,{' '}
          <a className={styles.inline} href={DEVICE_CHECK_SCRIPT} rel="noreferrer" target="_blank">
            download device-check.sh
          </a>{' '}
          to your Downloads folder, read it, and run it with this command instead, which makes the same check first. If your browser saved it under another name, such as device-check (1).sh, delete the older copy and rename the new one device-check.sh. Both commands print what they found in Terminal and copy the same report.
        </P>
        <Command command={DeviceCheck.DEVICE_CHECK_DOWNLOADED_COMMAND} label="Downloaded device check command" />
        <P style={{ marginTop: 24 }}>
          SHA-256 of this version of device-check.sh: <code className={styles.hash}>{DeviceCheck.DEVICE_CHECK_SCRIPT_SHA256}</code>
        </P>
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
              ['Laptop', `${laptopLabel(device.model, device.chip)}, macOS ${device.os_version}`],
              ['FileVault', device.filevault_status.split('\n')[0]],
              ['Data volume', device.data_volume.encrypted && device.data_volume.filevault ? 'Encrypted with FileVault' : 'Not reported as encrypted'],
              ['External drives', `${device.removable_media.mounted} mounted, ${device.removable_media.unencrypted_writable} unencrypted and writable`],
              ['MDM enrolled', device.mdm_enrolled ? 'Yes' : 'No'],
              ...((device.anti_malware
                ? [
                    ['Gatekeeper', device.anti_malware.gatekeeper_status || 'Not reported'],
                    ['XProtect', xprotectLabel(device.anti_malware.xprotect_version || null, device.anti_malware.xprotect_installed_at || null)],
                    ['Security responses', automatic(device.anti_malware.xprotect_updates)],
                    ['Security updates', automatic(device.anti_malware.security_updates)],
                    ['Firewall', device.firewall_status || 'Not reported'],
                  ]
                : [['Anti-malware', NOT_IN_REPORT]]) as [string, string][]),
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
            Recorded {formatDate(result.data.checked_at)}. {result.data.assessment.disk_encrypted ? `Disk encrypted: ${result.data.assessment.cipher}.` : 'This laptop does not pass: FileVault must be on and finished encrypting.'} {result.data.assessment.removable_media_clear ? 'No unencrypted writable external drive is mounted.' : 'An unencrypted writable external drive is mounted; eject it or encrypt it.'} Anti-malware: {antiMalwareText(result.data.assessment.anti_malware_active, result.data.device.anti_malware)}. Firewall: {firewallText(result.data.assessment.firewall_on)}. {resultPatch ? `Patch state: ${resultPatch}. ` : ''}{resultFixes.length ? (
              <>
                To pass, fix these and run the check again: <FixLinks fixes={resultFixes} />.{' '}
              </>
            ) : (
              'Every check passed. '
            )}
            {isTeamMember ? (
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
          ? member.devices.map((each) => {
              const patch = patchText(each.assessment, each.os_version);
              const fixes = DeviceCheck.deviceFixes(each);
              return (
                <Rows
                  key={each.device_ref}
                  rows={[
                    ['Laptop', `${laptopLabel(each.model, each.chip)}, macOS ${each.os_version}`],
                    ['Encrypted', each.assessment.disk_encrypted ? `Yes, ${each.assessment.cipher}` : 'No'],
                    ['External drives', each.assessment.removable_media_clear ? 'None unencrypted and writable' : 'An unencrypted writable drive was mounted'],
                    ['Anti-malware', sentence(antiMalwareText(each.assessment.anti_malware_active, each.anti_malware))],
                    ['Firewall', sentence(firewallText(each.assessment.firewall_on))],
                    ...(patch ? [['Patch state', sentence(patch)] as [string, string]] : []),
                    ['Last check', `${formatDate(each.checked_at)}${each.current ? '' : ', out of date'}`],
                    ['Next due', each.current ? dueDate(each.checked_at, freshDays) : 'Now'],
                    ['To fix', fixes.length ? <FixLinks fixes={fixes} /> : 'Nothing; every check passed'],
                    ['Reference', each.device_ref],
                  ]}
                />
              );
            })
          : null}
        {isTeamMember ? <P style={{ marginTop: 16 }}>The compliance page validates every team member’s laptops from these reports. It can take up to a minute to show a new one.</P> : null}
        <div className={styles.actions}>
          <Button href={DeviceCheck.DEVICE_CHECK_RECORD_URL} target="_blank">
            View compliance page
          </Button>
        </div>
      </StandardLayoutSection>

      <StandardLayoutSection title="If a check does not pass">
        <P style={{ marginTop: 6 }}>Each fix below is a setting you change yourself on the Mac. After a fix, run the check again on that Mac and send the new report: the compliance record counts only the newest report from each laptop. {Object.keys(neededBy).length ? 'The fixes your laptops need are listed first.' : ''}</P>
        {orderedFixes.map((fix) => (
          <div className={styles.fix} id={fixElementId(fix.id)} key={fix.id}>
            <div className={styles.fixTitle}>
              {fix.title}
              {neededBy[fix.id] ? <span className={styles.needed}>Needed on {neededBy[fix.id]?.join(', ')}</span> : null}
            </div>
            <P style={{ marginTop: 6 }}>{fix.problem}</P>
            <ol className={styles.steps}>
              {fix.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            {fix.command ? (
              <>
                {fix.commandNote ? <P style={{ marginTop: 16 }}>{fix.commandNote}</P> : null}
                <Command command={fix.command} label={`${fix.title} command`} />
              </>
            ) : null}
            {fix.links.length ? (
              <P style={{ marginTop: 16 }}>
                Apple’s instructions:{' '}
                {fix.links.map((link, index) => (
                  <React.Fragment key={link.href}>
                    {index ? ', ' : ''}
                    <a className={styles.inline} href={link.href} rel="noreferrer" target="_blank">
                      {link.label}
                    </a>
                  </React.Fragment>
                ))}
              </P>
            ) : null}
          </div>
        ))}
      </StandardLayoutSection>
    </StandardLayout>
  );
}
