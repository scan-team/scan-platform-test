//================================================================================================
// Project: SCAN - Searching Chemical Actions and Networks
//          Hokkaido University (2021)
//          Last Update: Q2 2023
//________________________________________________________________________________________________
// Authors: Mikael Nicander Kuwahara (Lead Developer) [2022-]
//          Jun Fujima (Former Lead Developer) [2021]
//________________________________________________________________________________________________
// Description: This is the start index.js file for the scan-app website (using Next).
//------------------------------------------------------------------------------------------------
// Notes: 
//------------------------------------------------------------------------------------------------
// References: Base-framework Next and internal Layout and styles
//================================================================================================

//------------------------------------------------------------------------------------------------
// Load required libraries
//------------------------------------------------------------------------------------------------
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

import Layout from '../components/layout';

import getConfig from 'next/config';

//------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------
// get Server-Side Properties
//------------------------------------------------------------------------------------------------
export const getServerSideProps = async (context) => {
  const { publicRuntimeConfig } = getConfig()
  const apiRoot = publicRuntimeConfig.SCAN_API_ROOT;
  const url = encodeURI(`${apiRoot}/stats`);

  const response = await fetch(url);
  let atoms = null;

  return {
    props: {
      stats: await response.json(),
    },
  };
};
//------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------
// Home - Site Start
//------------------------------------------------------------------------------------------------
export default function Home({ stats }) {
  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>SCAN: Searching Chemical Actions and Networks</title>
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/images/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/images/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/images/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#ffffff" />
        </Head>

        <main className={styles.main}>
          <Image priority src="/images/scan.png" width={500} height={401} alt="SCAN" />

          <h1>Searching Chemical Actions and Networks</h1>

          <Link href="/map-search">
            <button className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Get Started
              <i className="right arrow icon" />
            </button>
          </Link>

          <h4>Available Resources:</h4>

          <ul>
            <li>{stats.maps} maps</li>
            <li>{stats.eqs} EQs</li>
            <li>{stats.edges} edges</li>
          </ul>
        </main>

        <footer className={styles.footer}>
          <div>
            <div>
              <Link href="/terms">Terms of Use</Link>
            </div>
            <div>
              <a target="_blank" href="mailto:scan-team@sci.hokudai.ac.jp">Contact Us</a>
            </div>
            <div>© 2021 SCAN developers</div>
          </div>
        </footer>
      </div>
    </Layout>
  );
}
//------------------------------------------------------------------------------------------------
