import styles from '@system/documents/SmallButton.module.scss';

export default function SmallButton(props) {
  if (props.loading) {
    return <button children={props.children} className={styles.loading} disabled onClick={props.onClick} style={props.style} />;
  }

  return <button children={props.children} className={styles.root} disabled={props.disabled} onClick={props.onClick} style={props.style} />;
}
