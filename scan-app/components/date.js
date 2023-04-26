//================================================================================================
// Project: SCAN - Searching Chemical Actions and Networks
//          Hokkaido University (2021)
//          Last Update: Q2 2023
//________________________________________________________________________________________________
// Authors: Mikael Nicander Kuwahara (Lead Developer) [2022-]
//          Jun Fujima (Former Lead Developer) [2021]
//________________________________________________________________________________________________
// Description: This is a Date display component that takes a date-string, parse it and return a 
//              html snippet with the date formatted as hardcoded. [Next.js React.js]
//------------------------------------------------------------------------------------------------
// Notes: 
//------------------------------------------------------------------------------------------------
// References: date-fns and internal date.module css styles
//================================================================================================

//------------------------------------------------------------------------------------------------
// Load required libraries
//------------------------------------------------------------------------------------------------
import { parseISO, format } from 'date-fns';

import styles from './date.module.css';

//------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------
// Date Component
//------------------------------------------------------------------------------------------------
export default function Date({ dateString, caption }) {
  const date = parseISO(dateString);
  return (
    <div className={styles.container}>
      {caption && <span>{caption}</span>}
      <time dateTime={dateString}> {format(date, 'LLLL d, yyyy')}</time>
    </div>
  );
}
//------------------------------------------------------------------------------------------------
