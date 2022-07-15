//================================================================================================
// Project: SCAN - Searching Chemical Actions and Networks
//                 Hokkaido University (2021)
//________________________________________________________________________________________________
// Authors: Jun Fujima (Former Lead Developer) [2021]
//          Mikael Nicander Kuwahara (Current Lead Developer) [2022-]
//________________________________________________________________________________________________
// Description: This is the _app.js main start file that overrides the basic App provided 
//              by next.js and allows a bit more complex and customizable control.
//              [Next.js React.js]
//------------------------------------------------------------------------------------------------
// Notes: 
//------------------------------------------------------------------------------------------------
// References: head from Next.js, 3rd partiy libraries: auth0, nextjs-progressbar, GoogleAnalytics 
//             and internal: usePageView, as well as global and chemdoodle css styles.
//================================================================================================

//------------------------------------------------------------------------------------------------
// Load required libraries
//------------------------------------------------------------------------------------------------
import Head from 'next/head';

import { UserProvider } from '@auth0/nextjs-auth0';
import NextNprogress from 'nextjs-progressbar';

import '../lib/chem-doodle/ChemDoodleWeb.css';

import { GoogleAnalytics, usePageViews } from 'nextjs-google-analytics';

export default function App({ Component, pageProps }) {
  const { user } = pageProps;
  usePageViews();

  return (
    <UserProvider user={user}>
      <Head>
        <script type="text/javascript" src="/lib/ChemDoodleWeb.js"></script>
      </Head>
      <NextNprogress
        color="#29D"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
      />
      <GoogleAnalytics />
      <Component {...pageProps} />
    </UserProvider>
  );
}
//------------------------------------------------------------------------------------------------
