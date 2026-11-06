import styles from '@components/UserGardenTraining.module.css';

import * as Compliance from '@root/compliance/site/client';
import * as React from 'react';

import Button from '@system/Button';
import ButtonPrimary from '@system/ButtonPrimary';
import Checkbox from '@system/Checkbox';
import StandardHeader from '@components/StandardHeader';
import StandardLayout from '@components/StandardLayout';
import StandardLayoutSection from '@components/StandardLayoutSection';

import { P } from '@system/typography';
import { TRAINING_ACKNOWLEDGEMENT, TRAINING_COURSES, VANTA_TRAINING } from '@root/compliance/site/records';

import type { TrainingCourse, TrainingSignature } from '@root/compliance/site/types';

function formatDate(value: string): string {
  return new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

function formatDay(value: string): string {
  return new Date(`${value.slice(0, 10)}T12:00:00Z`).toLocaleDateString(undefined, { dateStyle: 'medium' });
}

export default function UserGardenTraining(props) {
  const isTeamMember = Compliance.isCurrentTeamMember(props.viewer);
  const [courses, setCourses] = React.useState<TrainingCourse[]>(TRAINING_COURSES);
  const [confirmed, setConfirmed] = React.useState<string[]>([]);
  const [signatures, setSignatures] = React.useState<TrainingSignature[]>([]);
  const [recordError, setRecordError] = React.useState<string>('');
  const [acknowledged, setAcknowledged] = React.useState<Record<string, boolean>>({});
  const [signing, setSigning] = React.useState<string>('');
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const loadRecord = React.useCallback(async () => {
    if (!isTeamMember) return;
    const response = await props.onGetTrainingRecord({ id: props.viewer.id });
    if (!response.success) {
      setRecordError(response.message);
      return;
    }
    setRecordError('');
    setCourses(response.courses);
    if (response.member) {
      const online = response.member.signatures ?? [];
      setSignatures((current) => [...online, ...current.filter((mine) => !online.some((signature) => signature.course_id === mine.course_id && signature.version === mine.version))]);
      setConfirmed(response.member.courses.filter((id) => !online.some((signature) => signature.course_id === id)));
    }
  }, [isTeamMember, props.onGetTrainingRecord, props.viewer.id]);

  React.useEffect(() => {
    loadRecord();
  }, [loadRecord]);

  async function onSign(course: TrainingCourse) {
    if (!acknowledged[course.id] || signing) return;
    setSigning(course.id);
    const response = await props.onSignTraining({ course });
    setSigning('');
    if (!response.success) {
      setErrors({ ...errors, [course.id]: response.message });
      return;
    }
    setErrors({ ...errors, [course.id]: '' });
    setSignatures((current) => [...current.filter((signature) => signature.course_id !== course.id), response.signature]);
  }

  return (
    <StandardLayout>
      <StandardHeader title="Training">Complete your training in Vanta, then read each INTDEV training course and sign it here with your own account. INTDEV team members sign every course within 30 days of joining and every year after, and sign again whenever a course gets a new version. Your signature is recorded with the course, its version, and the time, and the training record on the compliance pages shows it within a minute.</StandardHeader>

      <StandardLayoutSection title="Start in Vanta">
        <P style={{ marginTop: 6 }}>Your training is taken in {VANTA_TRAINING.name}. Sign in to Vanta and finish every task it assigns you; it covers most of INTDEV’s training requirements and takes real time. The INTDEV courses below add INTDEV’s own rules. Signing them here is your statement that your training is complete, because the INTDEV API does not read Vanta.</P>
        <div className={styles.actions}>
          <Button href={VANTA_TRAINING.url} rel="noreferrer" target="_blank">
            Open Vanta training
          </Button>
        </div>
      </StandardLayoutSection>

      {!isTeamMember ? (
        <StandardLayoutSection title="Before you join the team">
          <P style={{ marginTop: 6 }}>The training record lists current INTDEV team members only. You can read and sign the courses now; your signatures are kept under your account and appear on the record once you join the team.</P>
        </StandardLayoutSection>
      ) : null}
      {isTeamMember && recordError ? (
        <StandardLayoutSection title="Your training record">
          <P style={{ marginTop: 6 }}>{recordError} Courses you have already signed may show as unsigned until it loads.</P>
        </StandardLayoutSection>
      ) : null}

      {courses.map((course) => {
        const online = signatures.find((signature) => signature.course_id === course.id && signature.version === course.version);
        const signed = !!online || confirmed.includes(course.id);
        return (
          <StandardLayoutSection key={course.id} title={course.title}>
            <dl className={styles.rows}>
              <div className={styles.row}>
                <dt className={styles.label}>Version</dt>
                <dd className={styles.value}>{course.version}</dd>
              </div>
              <div className={styles.row}>
                <dt className={styles.label}>Covers</dt>
                <dd className={styles.value}>{course.covers}</dd>
              </div>
              <div className={styles.row}>
                <dt className={styles.label}>Status</dt>
                <dd className={styles.value}>{online ? `Signed ${formatDate(online.signed_at)}` : signed ? 'Signed, and confirmed by the CEO' : course.due ? `Not signed; due ${formatDay(course.due)}` : 'Not signed'}</dd>
              </div>
            </dl>
            <div className={styles.actions}>
              <Button href={Compliance.TRAINING_COURSE_URL} target="_blank">
                Read the course
              </Button>
            </div>
            {!signed ? (
              <>
                <Checkbox name={`training-${course.id}`} onChange={(e) => setAcknowledged({ ...acknowledged, [course.id]: e.target.checked })} style={{ marginTop: 24 }} value={!!acknowledged[course.id]}>
                  {TRAINING_ACKNOWLEDGEMENT}
                </Checkbox>
                <div className={styles.actions}>
                  <ButtonPrimary disabled={!acknowledged[course.id]} loading={signing === course.id} onClick={() => onSign(course)} style={acknowledged[course.id] ? undefined : { opacity: 0.4, cursor: 'not-allowed' }}>
                    Sign as {props.viewer.email}
                  </ButtonPrimary>
                </div>
              </>
            ) : null}
            {errors[course.id] ? (
              <p className={styles.error} role="alert">
                {errors[course.id]}
              </p>
            ) : null}
          </StandardLayoutSection>
        );
      })}

      <StandardLayoutSection title="Your record">
        <P style={{ marginTop: 6 }}>Sign only for yourself, after reading the course. The compliance page lists every team member’s signatures, read from the INTDEV API.</P>
        <div className={styles.actions}>
          <Button href={Compliance.TRAINING_COURSE_URL} target="_blank">
            View training record
          </Button>
        </div>
      </StandardLayoutSection>
    </StandardLayout>
  );
}
