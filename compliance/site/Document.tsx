import styles from '@root/compliance/site/Document.module.css';

import * as React from 'react';

import { geistSerif } from '@root/compliance/site/fonts';
import { COMPANY, CONTACTS, PUBLISHED } from '@root/compliance/site/facts';

const LOGO_PATH =
  'm0 104 17.8841115-25.9808562h59.6300974c6.3930371 0 12.3762642-3.145051 16.0044493-8.4177974l12.1358418-17.6341643h-69.848028l17.8841115-25.9808562h61.7228605c5.081645 0 9.840906-2.5051015 12.725969-6.6948565l6.322003-9.1890186c4.349451-6.32291993 11.534788-10.1024508 19.206432-10.1024508h64.143473l-17.884112 25.9808562h-59.548135c-6.393037 0-12.376264 3.145051-16.004449 8.4177974l-12.108522 17.5958767h69.831636l-17.884111 25.9808563h-61.706469c-5.0816447 0-9.8409057 2.5051015-12.7259686 6.6948564l-6.3438599 9.2218365c-4.3494509 6.3229195-11.5347875 10.1024505-19.206432 10.1024505h-64.2308985z';

export interface DocumentProps {
  title: string;
  summary: React.ReactNode;
  controls: string[];
  owner?: string;
  updated?: string;
  appliesTo?: string;
  children?: React.ReactNode;
}

export default function Document(props: DocumentProps) {
  const updated = props.updated ?? PUBLISHED;
  const year = updated.slice(-4);

  return (
    <div className={`${geistSerif.variable} ${styles.root}`}>
      <main className={styles.container}>
        <nav className={styles.nav}>
          <a className={styles.logo} href="/compliance" aria-label="INTDEV compliance">
            <svg className={styles.logoMark} viewBox="0 0 218 104" fill="currentColor" aria-hidden="true">
              <path d={LOGO_PATH} />
            </svg>
          </a>
          <div className={styles.navLinks}>
            <a href="/compliance">Compliance</a>
            <a href="/compliance/status">Status</a>
            <a href="/compliance/support">Support</a>
          </div>
        </nav>
        <header className={styles.heading}>
          <h1>{props.title}</h1>
          <h2>{props.summary}</h2>
          <div className={styles.meta}>
            {props.controls.length ? <p>Controls: {props.controls.join('; ')}</p> : null}
            <p>
              Owner: {props.owner ?? 'Jimmy Lee, Chief Executive Officer'} · Updated {updated}
            </p>
            <p>Applies to: {props.appliesTo ?? 'INTDEV API (api.internet.dev), Users Garden (users.garden), and Terminal Graph (terminalgraph.com)'}</p>
          </div>
        </header>
        <div className={styles.body}>{props.children}</div>
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerCopy}>
            <p className={styles.footerParagraph}>Public compliance record</p>
            <p className={styles.footerParagraph}>
              This page is published by {COMPANY.name} (&ldquo;INTDEV&rdquo;) for customers, partners, and auditors. It summarizes controls defined in INTDEV&rsquo;s information security policies, which are version controlled and maintained in Vanta. Where a page shows live data, it is read from the system named on the page at the time you load it. Policies are classified Restricted; this summary is classified Public.
            </p>
            <p className={styles.footerParagraph}>
              Questions about this record: {CONTACTS.support}. Security reports: {CONTACTS.security}.
            </p>
            <p className={styles.footerParagraph}>
              &copy; {year} {COMPANY.name}. {COMPANY.entity}. {COMPANY.headquarters}.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
