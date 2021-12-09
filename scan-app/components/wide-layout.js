import React from 'react';
import Head from 'next/head';
import Header from './header';

const Layout = ({ children }) => (
  <>
    <Head>
      <title>SCAN: Searching Chemical Actions and Networks</title>
    </Head>

    <Header />

    <main>
      <div className="container">{children}</div>
    </main>

    <style jsx>{`
      .container {
        // max-width: 84rem;
        margin: 1.5rem auto;
      }
    `}</style>
    <style jsx global>{`
      body {
        margin: 0;
        color: #333;
        font-family: -apple-system, 'Segoe UI';
      }
    `}</style>
  </>
);

export default Layout;
