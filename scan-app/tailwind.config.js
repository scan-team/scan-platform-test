/* 
=================================================================================================
 Project: SCAN - Searching Chemical Actions and Networks
          Hokkaido University (2021)
          Last Update: Q2 2023
________________________________________________________________________________________________
 Authors: Mikael Nicander Kuwahara (Lead Developer) [2022-]
          Jun Fujima (Former Lead Developer) [2021]
________________________________________________________________________________________________
 Description: This is the Tailwind Config file that expand and improve CSS management 
              of the site.
------------------------------------------------------------------------------------------------
 Notes: 
------------------------------------------------------------------------------------------------
 References: 
=================================================================================================
*/

module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
};
