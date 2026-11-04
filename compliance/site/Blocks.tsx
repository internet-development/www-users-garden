import styles from '@root/compliance/site/Blocks.module.css';

import * as React from 'react';

import type { Person } from '@root/compliance/site/types';

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
