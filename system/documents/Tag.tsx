import styles from '@system/documents/Tag.module.css';

export default function Tag(props) {
  return <span className={styles.root}>{props.children}</span>;
}
