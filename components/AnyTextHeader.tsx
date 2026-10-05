import styles from '@components/AnyTextHeader.module.css';

import * as React from 'react';

type Props = {
  children: React.ReactNode;
  href?: string;
  actionHref?: string;
  actionLabel?: string;
};

export default function AnyTextHeader(props: Props) {
  return (
    <nav className={styles.root}>
      <section className={styles.left}>
        {props.href ? <a href={props.href} className={styles.item}>{props.children}</a> : <span className={styles.item}>{props.children}</span>}
      </section>
      {props.actionHref && props.actionLabel ? <section className={styles.right}><a href={props.actionHref} className={styles.item}>{props.actionLabel}</a></section> : null}
    </nav>
  );
}
