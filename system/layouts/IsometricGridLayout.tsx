import styles from '@system/layouts/IsometricGridLayout.module.css';

import * as React from 'react';

export default function IsometricGridLayout(props) {
  return (
    <div className={styles.root} style={props.style}>
      {props.children}
    </div>
  );
}
