import styles from '@system/documents/ActionItem.module.scss';

import * as React from 'react';

export default function ActionItem(props) {
  if (props.active) {
    return (
      <span className={styles.item} style={{ color: `var(--theme-primary)`, ...props.style }}>
        <figure className={styles.icon}>{props.icon}</figure>
        <span className={styles.text}>{props.children}</span>
      </span>
    );
  }

  if (props.href) {
    return (
      <a className={styles.item} href={props.href} id={props.id} target={props.target} style={props.style}>
        <figure className={styles.icon}>{props.icon}</figure>
        <span className={styles.text}>{props.children}</span>
      </a>
    );
  }

  if (props.htmlFor) {
    return (
      <label className={styles.item} htmlFor={props.htmlFor} id={props.id} onClick={props.onClick} style={props.style}>
        <figure className={styles.icon}>{props.icon}</figure>
        <span className={styles.text}>{props.children}</span>
      </label>
    );
  }

  return (
    <div className={styles.item} id={props.id} onClick={props.onClick} style={props.style}>
      <figure className={styles.icon}>{props.icon}</figure>
      <span className={styles.text}>{props.children}</span>
    </div>
  );
}
