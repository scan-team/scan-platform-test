//================================================================================================
// Project: SCAN - Searching Chemical Actions and Networks
//                 Hokkaido University (2021)
//________________________________________________________________________________________________
// Authors: Jun Fujima (Former Lead Developer) [2021]
//          Mikael Nicander Kuwahara (Current Lead Developer) [2022-]
//________________________________________________________________________________________________
// Description: This is the terms of use display page file for the scan-app website (using Next).
//------------------------------------------------------------------------------------------------
// Notes: 
//------------------------------------------------------------------------------------------------
// References: Base-framework Next; 3rd party libs: react-markdown and rehype-raw;
//             Internal styles and layout component + terms.md readme file
//================================================================================================

//------------------------------------------------------------------------------------------------
// Load required libraries
//------------------------------------------------------------------------------------------------
import Head from 'next/head';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

import styles from '../styles/Home.module.css';
import termStyles from '../styles/terms.module.css';
import Layout from '../components/layout';


//------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------
// Service Terms of Use Home Page
//------------------------------------------------------------------------------------------------
export default function Home({}) {
  return (
    <Layout>
      <div className={styles.basics}>
        <Head>
          <title>SCAN: Online Resources</title>
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

        <div className={styles.linklist}>
            <ul>                
                <li><a href='/docs/SCAN-User-Manual-Eng.pdf' target='_blank'>SCAN User Manual (pdf) [ENGLISH]</a></li>
                <li><a href='/docs/SCAN-User-Manual-Jp.pdf' target='_blank'>SCAN User Manual (pdf) [日本語]</a></li>
                {/* <li><a href='/docs/scan_server_manual.pdf' target='_blank'>SCAN Server Setup and Maintanance Manual (pdf)</a></li> */}
                <li><a href='https://onlinelibrary.wiley.com/doi/10.1002/tcr.201600043' target='_blank'>AFIR Chemistry reaction Data (currently used in SCAN)</a></li>                
                <li><a href='https://takahashigroup.github.io' target='_blank'>SCAN Software Development Group</a></li>
                <li><a href='https://www.jst.go.jp/erato/en/about/index.html' target='_blank'>Erato Project, JST, Funding Agency</a></li>                
            </ul>
        </div>

        <footer className={styles.footer}>
          <div>
            <div>© 2021 SCAN developers</div>
          </div>
        </footer>
      </div>
    </Layout>
  );
}
//------------------------------------------------------------------------------------------------
