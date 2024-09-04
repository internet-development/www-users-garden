import styles from '@system/ButtonWarning.module.scss';

import Loader from '@system/Loader';

export default function ButtonWarning(props) {
  if (props.loading) {
    return (
      <div className={styles.loader} style={props.style}>
        <Loader />
      </div>
    );
  }

  return <button children={props.children} className={styles.root} disabled={props.disabled} onClick={props.onClick} id={props.id} style={props.style} />;
}
