import { parseISO, format } from 'date-fns';

import styles from './date.module.css';

export default function Date({ dateString, caption }) {
  console.log(dateString);
  const date = parseISO(dateString);
  console.log(date);
  return (
    <div className={styles.container}>
      {caption && <span>{caption}</span>}
      <time dateTime={dateString}> {format(date, 'LLLL d, yyyy')}</time>
    </div>
  );
}
