import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

import Layout from '../components/layout';

export const getServerSideProps = async (context) => {
  const apiRoot = process.env.SCAN_API_ROOT;
  const url = encodeURI(`${apiRoot}/stats`);
  console.log(url);

  const response = await fetch(url);
  let atoms = null;

  return {
    props: {
      stats: await response.json(),
    },
  };
};

export default function Home({ stats }) {
  console.log(stats);
  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>SCAN: Searching Chemical Actions and Networks</title>
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#ffffff" />
        </Head>

        <main className={styles.main}>
          <Image priority src="/scan.png" width={500} height={401} alt="SCAN" />

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
              <a href="/SCAN_term_of_use.pdf">Terms of Use</a>
            </div>
            <div>© 2021 SCAN developers</div>
          </div>
        </footer>
      </div>
    </Layout>
  );
}
