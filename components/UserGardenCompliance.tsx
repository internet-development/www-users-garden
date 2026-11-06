import styles from '@components/UserGardenCompliance.module.css';

import * as Compliance from '@root/compliance/site/client';
import * as React from 'react';

import Button from '@system/Button';
import ButtonPrimary from '@system/ButtonPrimary';
import StandardHeader from '@components/StandardHeader';
import StandardLayout from '@components/StandardLayout';
import StandardLayoutSection from '@components/StandardLayoutSection';

import { P } from '@system/typography';
import { DEVICE_CHECK_FRESH_DAYS, TRAINING_COURSES } from '@root/compliance/site/records';

import type { DeviceMember, TrainingCourse } from '@root/compliance/site/types';

type Item = { label: string; done: boolean | null; detail: React.ReactNode; action: string; active: string };

function formatDay(value: string | number): string {
  return new Date(value).toLocaleDateString(undefined, { dateStyle: 'medium' });
}

function laptopItems(member: DeviceMember | null, freshDays: number, error: string): Item[] {
  if (error) return [{ label: 'Report every laptop', done: null, detail: `${error} Open Device check to see your laptops.`, action: 'Device check', active: 'USER_DEVICE_CHECK' }];
  const devices = member?.devices ?? [];
  if (!devices.length) return [{ label: 'Report every laptop', done: false, detail: `No laptop is reported under your account yet. Run the device check on every Mac you use for INTDEV work, and again at least every ${freshDays} days.`, action: 'Run the device check', active: 'USER_DEVICE_CHECK' }];
  const stale = devices.filter((each) => !each.current);
  const due = devices.filter((each) => each.current).map((each) => new Date(each.checked_at).getTime() + freshDays * 24 * 60 * 60 * 1000);
  const report: Item = stale.length
    ? { label: 'Report every laptop', done: false, detail: `${stale.length} of ${devices.length} laptops ${stale.length === 1 ? 'has' : 'have'} no report in the last ${freshDays} days. Run the device check on ${stale.length === 1 ? 'it' : 'each of them'} again.`, action: 'Run the device check', active: 'USER_DEVICE_CHECK' }
    : { label: 'Report every laptop', done: true, detail: `${devices.length} ${devices.length === 1 ? 'laptop' : 'laptops'} reported. Next check due by ${formatDay(Math.min(...due))}. Report any other Mac you use for INTDEV work too.`, action: 'Device check', active: 'USER_DEVICE_CHECK' };
  const passing = devices.map((each): Item => {
    const fixes = Compliance.deviceFixes(each).filter((id) => id !== 'rerun' || each.current);
    return {
      label: `${each.model}, macOS ${each.os_version}`,
      done: fixes.length === 0,
      detail: fixes.length ? `To fix: ${fixes.map((id) => Compliance.DEVICE_FIXES[id].title).join('; ')}. Device check lists the steps for each.` : 'Passes FileVault, external drives, anti-malware, firewall, and patch state at its last check.',
      action: fixes.length ? 'See how to fix it' : 'Device check',
      active: 'USER_DEVICE_CHECK',
    };
  });
  return [report, ...passing];
}

function trainingItem(courses: TrainingCourse[], signed: string[] | null, error: string): Item {
  if (error) return { label: 'Sign every training course', done: null, detail: `${error} Open Training to see your courses.`, action: 'Training', active: 'USER_TRAINING' };
  const unsigned = courses.filter((course) => !(signed ?? []).includes(course.id));
  if (!unsigned.length) return { label: 'Sign every training course', done: true, detail: `All ${courses.length} ${courses.length === 1 ? 'course' : 'courses'} signed for their current version.`, action: 'Training', active: 'USER_TRAINING' };
  const due = unsigned.map((course) => course.due).filter((value): value is string => !!value).sort()[0];
  return {
    label: 'Sign every training course',
    done: false,
    detail: `${courses.length - unsigned.length} of ${courses.length} signed. Still to sign: ${unsigned.map((course) => course.title).join('; ')}${due ? `, due ${formatDay(`${due.slice(0, 10)}T12:00:00Z`)}` : ''}. Read each course, then sign it with your own account.`,
    action: 'Sign your training',
    active: 'USER_TRAINING',
  };
}

export default function UserGardenCompliance(props) {
  const isTeamMember = Compliance.isCurrentTeamMember(props.viewer);
  const [loading, setLoading] = React.useState<boolean>(isTeamMember);
  const [member, setMember] = React.useState<DeviceMember | null>(null);
  const [freshDays, setFreshDays] = React.useState<number>(DEVICE_CHECK_FRESH_DAYS);
  const [fleetError, setFleetError] = React.useState<string>('');
  const [courses, setCourses] = React.useState<TrainingCourse[]>(TRAINING_COURSES);
  const [signed, setSigned] = React.useState<string[] | null>(null);
  const [trainingError, setTrainingError] = React.useState<string>('');

  React.useEffect(() => {
    if (!isTeamMember) return;
    let cancelled = false;
    Promise.all([props.onGetDeviceFleet({ id: props.viewer.id }), props.onGetTrainingRecord({ id: props.viewer.id })]).then(([fleet, training]) => {
      if (cancelled) return;
      if (fleet.success) {
        setMember(fleet.member);
        setFreshDays(fleet.freshDays || DEVICE_CHECK_FRESH_DAYS);
      } else {
        setFleetError(fleet.message);
      }
      if (training.success) {
        setCourses(training.courses);
        setSigned(training.member ? training.member.courses : []);
      } else {
        setTrainingError(training.message);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [isTeamMember, props.onGetDeviceFleet, props.onGetTrainingRecord, props.viewer.id]);

  const items = isTeamMember && !loading ? [...laptopItems(member, freshDays, fleetError), trainingItem(courses, signed, trainingError)] : [];
  const open = items.filter((item) => item.done === false).length;

  return (
    <StandardLayout>
      <StandardHeader title="Compliance checklist">
        What INTDEV’s compliance program needs from you, and where to finish each item yourself. INTDEV team members report every Mac they use for INTDEV work with the device check at least every {freshDays} days, and sign every training course. Each item takes a few minutes and is done from this account.
      </StandardHeader>

      <StandardLayoutSection title="Your checklist">
        {!isTeamMember ? <P style={{ marginTop: 6 }}>The compliance record lists current INTDEV team members only, so nothing here is required of this account. You can still run the device check and sign the training courses: what you report and sign is kept under your account and counts once you join the team.</P> : null}
        {isTeamMember && loading ? <P style={{ marginTop: 6 }}>Reading your record from the INTDEV API.</P> : null}
        {isTeamMember && !loading ? <P style={{ marginTop: 6 }}>{open ? `${open} ${open === 1 ? 'item needs' : 'items need'} you. Fix ${open === 1 ? 'it' : 'them'}, then come back here: the record updates within a minute.` : 'Nothing is open. Come back before your next device check is due, and whenever a training course gets a new version.'}</P> : null}
        {items.length ? (
          <dl className={styles.rows}>
            {items.map((item, index) => (
              <div className={styles.row} key={`${index}-${item.label}`}>
                <dt className={styles.label}>{item.label}</dt>
                <dd className={styles.value}>
                  <span className={item.done ? styles.done : item.done === false ? styles.open : styles.unknown}>{item.done ? 'Done' : item.done === false ? 'To do' : 'Unavailable'}</span> {item.detail}
                  <div className={styles.rowActions}>
                    {item.done === false ? (
                      <ButtonPrimary onClick={() => props.onNavigate({ active: item.active, nextOrganization: null })}>{item.action}</ButtonPrimary>
                    ) : (
                      <Button onClick={() => props.onNavigate({ active: item.active, nextOrganization: null })}>{item.action}</Button>
                    )}
                  </div>
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
        {!isTeamMember ? (
          <div className={styles.actions}>
            <Button onClick={() => props.onNavigate({ active: 'USER_DEVICE_CHECK', nextOrganization: null })} style={{ marginRight: 16 }}>
              Device check
            </Button>
            <Button onClick={() => props.onNavigate({ active: 'USER_TRAINING', nextOrganization: null })}>Training</Button>
          </div>
        ) : null}
      </StandardLayoutSection>

      <StandardLayoutSection title="How each item works">
        <P style={{ marginTop: 6 }}>
          Device check: open Terminal on the Mac, run the one command Device check shows, paste the report it copies, and send it. Device check then lists anything that did not pass with the steps to fix it, after which you run the check again. Training: read each course, check the acknowledgement, and sign it as yourself. Never report a laptop or sign a course for someone else.
        </P>
      </StandardLayoutSection>

      <StandardLayoutSection title="What you need">
        <P style={{ marginTop: 6 }}>A web browser for training. For the device check:</P>
        <dl className={styles.rows}>
          {Compliance.DEVICE_CHECK_REQUIREMENTS.map((item) => (
            <div className={styles.row} key={item.name}>
              <dt className={styles.label}>{item.name}</dt>
              <dd className={styles.value}>
                {item.detail}{' '}
                <a className={styles.inline} href={item.link.href} rel="noreferrer" target="_blank">
                  {item.link.label}
                </a>
              </dd>
            </div>
          ))}
        </dl>
      </StandardLayoutSection>

      <StandardLayoutSection title="Where the record is published">
        <P style={{ marginTop: 6 }}>The compliance pages read the same record from the INTDEV API: laptops on the removable media page, and signatures on the security awareness training page.</P>
        <div className={styles.actions}>
          <Button href={Compliance.DEVICE_CHECK_RECORD_URL} style={{ marginRight: 16 }} target="_blank">
            Laptop record
          </Button>
          <Button href={Compliance.TRAINING_COURSE_URL} target="_blank">
            Training record
          </Button>
        </div>
      </StandardLayoutSection>
    </StandardLayout>
  );
}
