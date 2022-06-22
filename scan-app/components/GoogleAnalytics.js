//================================================================================================
// Project: SCAN - Searching Chemical Actions and Networks
//                 Hokkaido University (2021)
//________________________________________________________________________________________________
// Authors: Jun Fujima (Former Lead Developer) [2021]
//          Mikael Nicander Kuwahara (Current Lead Developer) [2022-]
//________________________________________________________________________________________________
// Description: This is a Google Analytics Script Insert component that will only be cerated if a
//              valid PUBLIC GOOGLE ANALYTICS ID is found in the Project Environment file (.env). 
//              [Next.js React.js]
//------------------------------------------------------------------------------------------------
// Notes: This is currently not used since the required PUBLIC GOOGLE ANALYTICS ID does not exist 
//        in the .env file
//------------------------------------------------------------------------------------------------
// References: script for Next, and internal gtag lib
//================================================================================================

//------------------------------------------------------------------------------------------------
// Load required libraries
//------------------------------------------------------------------------------------------------
import Script from 'next/script';
import { existsGaId, GA_ID } from '../lib/gtag';

//------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------
// Google Analytics Component
//------------------------------------------------------------------------------------------------
const GoogleAnalytics = () => (
  <>
    {existsGaId && (
      <>
        <Script
          defer
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga" defer strategy="afterInteractive">
          {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
          `}
        </Script>
      </>
    )}
  </>
);
//------------------------------------------------------------------------------------------------

export default GoogleAnalytics;
