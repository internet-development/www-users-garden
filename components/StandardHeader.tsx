import styles from '@components/StandardHeader.module.scss';

import * as React from 'react';

import { P, SubTitle } from '@system/typography';

export default function StandardHeader(props) {
  return (
    <header className={styles.header} style={props.style}>
      <SubTitle>{props.title}</SubTitle>
      <P style={{ marginTop: 6 }}>{props.children}</P>
      {props.footerElement}
    </header>
  );
}
