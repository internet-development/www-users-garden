import styles from '@components/StandardLayout.module.css';

import * as React from 'react';

export default function StandardLayout(props) {
  return (
    <div className={styles.root} style={props.style}>
      {props.children}
    </div>
  );
}
