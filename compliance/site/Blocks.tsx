import styles from '@root/compliance/site/Blocks.module.css';

import * as React from 'react';

import type { Person } from '@root/compliance/site/types';

import { teamMember } from '@root/compliance/site/facts';

export function Section(props: { title: string; children?: React.ReactNode }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{props.title}</h2>
      {props.children}
    </section>
  );
}

export function Group(props: { children?: React.ReactNode }) {
  return <div className={styles.group}>{props.children}</div>;
}

export function List(props: { items: React.ReactNode[]; ordered?: boolean }) {
  const items = props.items.map((item, index) => <li key={index}>{item}</li>);
  return props.ordered ? <ol className={styles.orderedList}>{items}</ol> : <ul className={styles.list}>{items}</ul>;
}

export function Links(props: { items: { label: string; href: string }[] }) {
  return (
    <div className={styles.links}>
      {props.items.map((item) => {
        const external = item.href.startsWith('http');
        return (
          <a key={item.href + item.label} className={styles.link} href={item.href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>
            &rarr; {item.label}
          </a>
        );
      })}
    </div>
  );
}

export function Table(props: { columns: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className={styles.tableScroll}>
      <table className={styles.table}>
        <thead>
          <tr>
            {props.columns.map((column) => (
              <th key={column} scope="col">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Fields(props: { items: [string, React.ReactNode][] }) {
  return (
    <div className={styles.fields}>
      {props.items.map(([label, value]) => (
        <div key={label} className={styles.field}>
          <div className={styles.fieldLabel}>{label}</div>
          <div>{value}</div>
        </div>
      ))}
    </div>
  );
}

export function People(props: { people: Person[]; detail?: (person: Person) => React.ReactNode; note?: (person: Person) => React.ReactNode }) {
  return (
    <div className={styles.people}>
      {props.people.map((person) => (
        <div key={person.name}>
          <a href={person.href} target="_blank" rel="noreferrer" className={styles.personLink}>
            <img className={styles.personImage} src={person.avatar} alt={person.name} />
          </a>
          <h3 className={styles.personName}>{person.name}</h3>
          <p className={styles.personDetail}>{props.detail ? props.detail(person) : `${person.title} · ${person.role}`}</p>
          {props.note ? <p className={styles.personNote}>{props.note(person)}</p> : null}
        </div>
      ))}
    </div>
  );
}

export function Avatar(props: { person: Pick<Person, 'avatar'> }) {
  return <img className={styles.avatar} src={props.person.avatar} alt="" width={16} height={16} loading="lazy" decoding="async" />;
}

export function Member(props: { name: string }) {
  const person = teamMember(props.name);
  if (!person) return <>{props.name}</>;
  return (
    <>
      <span className={styles.member}>
        <Avatar person={person} />
        {person.name}
      </span>
      {props.name.slice(person.name.length)}
    </>
  );
}

export function Members(props: { names: string[] }) {
  const last = props.names.length - 1;
  return (
    <>
      {props.names.map((name, index) => (
        <React.Fragment key={name}>
          {index === 0 ? null : index === last ? (last === 1 ? ' and ' : ', and ') : ', '}
          <Member name={name} />
        </React.Fragment>
      ))}
    </>
  );
}

export function Checkbox(props: { checked: boolean | null; label?: string }) {
  const label = props.label ?? (props.checked === null ? 'Pending' : props.checked ? 'Complete' : 'Open');
  const className = props.checked === null ? `${styles.checkbox} ${styles.checkboxPending}` : props.checked ? `${styles.checkbox} ${styles.checkboxChecked}` : styles.checkbox;
  return (
    <span className={className} role="img" aria-label={label}>
      {props.checked ? (
        <svg className={styles.checkmark} viewBox="0 0 12 12" aria-hidden="true">
          <path d="M2.5 6.25 5 8.75 9.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
    </span>
  );
}

export function CheckItem(props: { checked: boolean | null; label?: string; children?: React.ReactNode }) {
  return (
    <span className={styles.checkItem}>
      <Checkbox checked={props.checked} label={props.label} />
      <span>{props.children}</span>
    </span>
  );
}

export function State(props: { ok: boolean | null; children?: React.ReactNode }) {
  return <span className={props.ok === null ? styles.muted : props.ok ? undefined : styles.stateOpen}>{props.children}</span>;
}

export function Signed(props: { at: string; children?: React.ReactNode }) {
  return <CheckItem checked label="Signed">{props.children ?? `Signed ${props.at}`}</CheckItem>;
}

export interface CheckRow {
  checked: boolean | null;
  cells: React.ReactNode[];
}

export function CheckTable(props: { columns: string[]; rows: CheckRow[] }) {
  return (
    <div className={styles.tableScroll}>
      <table className={styles.table}>
        <thead>
          <tr>
            {props.columns.map((column) => (
              <th key={column} scope="col">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.cells.map((cell, cellIndex) => (
                <td key={cellIndex}>{cellIndex === 0 ? <CheckItem checked={row.checked}>{cell}</CheckItem> : cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Note(props: { children?: React.ReactNode }) {
  return <div className={styles.note}>{props.children}</div>;
}

export function Muted(props: { children?: React.ReactNode }) {
  return <span className={styles.muted}>{props.children}</span>;
}

export function Mail(props: { address: string }) {
  return <a href={`mailto:${props.address}`}>{props.address}</a>;
}

export function Figure(props: { image: { src: string; width: number; height: number }; alt: string; caption?: React.ReactNode }) {
  return (
    <figure className={styles.figure}>
      <a href={props.image.src} target="_blank" rel="noreferrer">
        <img className={styles.figureImage} src={props.image.src} width={props.image.width} height={props.image.height} alt={props.alt} loading="lazy" />
      </a>
      {props.caption ? <figcaption className={styles.muted}>{props.caption}</figcaption> : null}
    </figure>
  );
}
