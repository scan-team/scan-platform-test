import '../styles/globals.css';
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
