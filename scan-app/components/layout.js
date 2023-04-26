//================================================================================================
// Project: SCAN - Searching Chemical Actions and Networks
//          Hokkaido University (2021)
//          Last Update: Q2 2023
//________________________________________________________________________________________________
// Authors: Mikael Nicander Kuwahara (Lead Developer) [2022-]
//          Jun Fujima (Former Lead Developer) [2021]
//________________________________________________________________________________________________
// Description: This is a main wrapper Layout Component that will contain the internal header and 
//              whatever children component we give it to be inside main area. [Next.js React.js]
//------------------------------------------------------------------------------------------------
// Notes: 
//------------------------------------------------------------------------------------------------
// References: React.js components, head from Next.js, and internal header
//================================================================================================

//------------------------------------------------------------------------------------------------
// Load required libraries
//------------------------------------------------------------------------------------------------
import React from 'react';
import Head from 'next/head';
import Header from './header';

//------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------
// Layout (main outer html wrapper) Component
//------------------------------------------------------------------------------------------------
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
        max-width: 42rem;
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
//------------------------------------------------------------------------------------------------

export default Layout;
