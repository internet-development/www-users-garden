import styles from '@components/StandardLayoutSection.module.scss';

import * as React from 'react';

import { SubTitle } from '@system/typography';

export default function StandardLayoutSection(props) {
  return (
    <div className={styles.section}>
      <div className={styles.left}>
        <figure className={styles.line} />
      </div>
      <div className={styles.right}>
        <SubTitle style={{ marginTop: 24 }}>{props.title}</SubTitle>
        {props.children}
      </div>
    </div>
  );
}
