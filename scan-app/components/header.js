//================================================================================================
// Project: SCAN - Searching Chemical Actions and Networks
//                 Hokkaido University (2021)
//________________________________________________________________________________________________
// Authors: Jun Fujima (Former Lead Developer) [2021]
//          Mikael Nicander Kuwahara (Current Lead Developer) [2022-]
//________________________________________________________________________________________________
// Description: This is a Top level Head and Menu Display Component that is basically visible on 
//              all pages and let you navigate to the different main pages of SCAN. 
//              [Next.js React.js]
//------------------------------------------------------------------------------------------------
// Notes: 
//------------------------------------------------------------------------------------------------
// References: React.js components, link and image from Next.js, 3rd-party libraries; auth0 
//             and material-ui tooltip
//================================================================================================

//------------------------------------------------------------------------------------------------
// Load required libraries
//------------------------------------------------------------------------------------------------
import React from 'react';
import Link from 'next/link';
import Tooltip from '@material-ui/core/Tooltip';
import { useUser } from '@auth0/nextjs-auth0';
import Image from 'next/image';

//------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------
// Header Component
//------------------------------------------------------------------------------------------------
const Header = () => {
  const { user } = useUser();

  return (
    <header>
      <nav>
        <ul>
          <li>            
            <Link href="/">
              <a>
                <Tooltip title="HOME" placement="bottom">
                  <div>
                    <Image src="/images/android-chrome-192x192.png" width={72} height={72} />
                  </div>
                </Tooltip>
              </a>
            </Link>            
          </li>
          <li style={{paddingTop: '1rem'}}>
            <Link href="/map-search">
              <a>Map Search</a>
            </Link>
          </li>
          {user ? (
            <>
              <li style={{paddingTop: '1rem'}}>
                <a href="/api/auth/logout" data-testid="logout">
                  Logout
                </a>
              </li>
            </>
          ) : (
            <>
              <li style={{paddingTop: '1rem'}}>
                <a href="/api/auth/login" data-testid="login">
                  Login
                </a>
              </li>
            </>
          )}
        </ul>
      </nav>

      <style jsx>{`
        header {
          padding: 0.1rem;
          color: #fff;
          background-color: #333;
        }
        nav {
          max-width: 42rem;
          margin: 0.2rem auto;
        }
        ul {
          display: flex;
          list-style: none;
          margin-left: 0;
          padding-left: 0;
        }
        li {
          margin-right: 1rem;
        }
        li:nth-child(2) {
          margin-right: auto;
        }
        a {
          color: #fff;
          text-decoration: none;
        }
      `}</style>
    </header>
  );
};
//------------------------------------------------------------------------------------------------

export default Header;
