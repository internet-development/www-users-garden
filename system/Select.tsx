import styles from '@system/Select.module.css';

import * as Utilities from '@common/utilities';

import Caret from '@system/svg/Caret';

export default function Select(props) {
  let label = 'No options available';
  if (!props.options || !props.options.length) {
    return (
      <figure className={styles.disabled} style={props.style}>
        <span className={styles.passiveText}>{label}</span>
      </figure>
    );
  }

  // An option can also be a group, { label, options }, drawn as a labeled section of the list.
  const flat = props.options.flatMap((each) => (each.options ? each.options : [each]));
  const missing = !Utilities.isEmpty(props.value) && !flat.some((each) => each.value === props.value);
  label = flat[0]?.label || 'No options available';
  if (!Utilities.isEmpty(props.value)) {
    label = flat.find((each) => each.value === props.value)?.label || 'Unavailable selection';
  }

  return (
    <figure className={styles.root} style={props.style}>
      <span className={styles.activeText}>{label}</span>
      <Caret height="12px" className={styles.icon} />
      <select className={styles.select} aria-label={props['aria-label']} onChange={props.onChange} value={props.value === undefined ? undefined : props.value}>
        {missing ? (
          <option value={props.value} disabled>
            Unavailable selection
          </option>
        ) : null}
        {props.options &&
          props.options.map((each) => {
            if (each.options) {
              return (
                <optgroup key={`group-${each.label}`} label={each.label}>
                  {each.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </optgroup>
              );
            }
            return (
              <option hidden={each.hidden} disabled={each.disabled} key={each.label} value={each.value}>
                {each.label}
              </option>
            );
          })}
      </select>
    </figure>
  );
}
