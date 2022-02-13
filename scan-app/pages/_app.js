import '../styles/globals.css';
import Head from 'next/head';
import { UserProvider } from '@auth0/nextjs-auth0';
import NextNprogress from 'nextjs-progressbar';

import GoogleAnalytics from '../components/GoogleAnalytics';
import { GA_ID, existsGaId } from '../lib/gtag';
import usePageView from '../hooks/usePageView';

import '../lib/chem-doodle/ChemDoodleWeb.css';

export default function App({ Component, pageProps }) {
  const { user } = pageProps;
  usePageView();

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
