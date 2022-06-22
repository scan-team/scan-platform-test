//================================================================================================
// Project: SCAN - Searching Chemical Actions and Networks
//                 Hokkaido University (2021)
//________________________________________________________________________________________________
// Authors: Jun Fujima (Former Lead Developer) [2021]
//          Mikael Nicander Kuwahara (Current Lead Developer) [2022-]
//________________________________________________________________________________________________
// Description: This is a Google Analytics feature not yet fully developed... 
//------------------------------------------------------------------------------------------------
// Notes: (not yet working since there are no GA Id available)
//------------------------------------------------------------------------------------------------
// References: none
//================================================================================================


//------------------------------------------------------------------------------------------------
// Export Google Analytics values
//------------------------------------------------------------------------------------------------
export const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || '';
export const existsGaId = GA_ID !== '';

//------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------
// Page View
//------------------------------------------------------------------------------------------------
export const pageview = (path) => {
  window.gtag('config', GA_ID, {
    page_path: path,
  });
};

//------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------
// Event
//------------------------------------------------------------------------------------------------
export const event = ({ action, category, label, value = '' }) => {
  if (!existsGaId) {
    return;
  }

  // window.gtag('event', action, {
  //   event_category: category,
  //   event_label: JSON.stringify(label),
  //   value,
  // });
};
//------------------------------------------------------------------------------------------------
