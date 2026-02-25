import styles from '@system/Input.module.css';

function Input(props) {
  return <input className={styles.input} {...props} />;
}

export default Input;
