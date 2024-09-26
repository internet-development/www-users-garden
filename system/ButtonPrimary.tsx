import styles from '@system/ButtonPrimary.module.scss';

import Loader from '@system/Loader';

export default function ButtonWarning(props) {
  if (props.loading) {
    return (
      <div className={styles.loader} style={props.style}>
        <Loader />
      </div>
    );
  }

  if (props.href) {
    return <a className={styles.root} {...props} />;
  }

  return <button children={props.children} className={styles.root} disabled={props.disabled} onClick={props.onClick} id={props.id} style={props.style} />;
}
