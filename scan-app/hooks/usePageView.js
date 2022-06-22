//================================================================================================
// Project: SCAN - Searching Chemical Actions and Networks
//                 Hokkaido University (2021)
//________________________________________________________________________________________________
// Authors: Jun Fujima (Former Lead Developer) [2021]
//          Mikael Nicander Kuwahara (Current Lead Developer) [2022-]
//________________________________________________________________________________________________
// Description: This is a Google Analytics feature not yet fully developed... 
//              [Next.js React.js]
//------------------------------------------------------------------------------------------------
// Notes: While no Google Analytic Id exists in the .env file this does nothing
//------------------------------------------------------------------------------------------------
// References: React.js components, router from Next.js, and internal gtag
//================================================================================================

//------------------------------------------------------------------------------------------------
// Load required libraries
//------------------------------------------------------------------------------------------------
import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { existsGaId, pageview } from '../lib/gtag';

//------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------
// Use Page View 
//------------------------------------------------------------------------------------------------
export default function usePageView() {
  const router = useRouter();

  useEffect(() => {
    if (!existsGaId) {
      return;
    }

    const handleRouteChange = (path) => {
      pageview(path);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);
}
//------------------------------------------------------------------------------------------------
