import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import termStyles from '../styles/terms.module.css';

import Layout from '../components/layout';

import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import terms from './terms.md';

export default function Home({}) {
  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>SCAN: Terms of Use</title>
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
          <div className={termStyles.content}>
            <ReactMarkdown children={terms} rehypePlugins={[rehypeRaw]} />
          </div>
        </main>

        <footer className={styles.footer}>
          <div>
            <div>© 2021 SCAN developers</div>
          </div>
        </footer>
      </div>
    </Layout>
  );
}
