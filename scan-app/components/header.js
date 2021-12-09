import React from 'react';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0';
import Image from 'next/image';

const _items = [
  {
    key: 'mapSearch',
    text: 'Map search',
    href: '/top',
  },
  {
    key: 'eqSearch',
    text: 'EQ search',
    href: '/eq-search',
  },
  {
    key: 'pathSearch',
    text: 'Path Search',
    href: '/path-search',
  },
];

const Header = () => {
  const { user } = useUser();

  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link href="/">
              <a>
                <Image src="/favicon-32x32.png" width={32} height={32} />
              </a>
            </Link>
          </li>
          <li>
            <Link href="/map-search">
              <a>Map Search</a>
            </Link>
          </li>
          {/* <li>
            <Link href="/eq-search">
              <a>EQ Search</a>
            </Link>
          </li> */}
          {user ? (
            <>
              <li>
                <a href="/api/auth/logout" data-testid="logout">
                  Logout
                </a>
              </li>
            </>
          ) : (
            <>
              <li>
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
          padding: 0.2rem;
          color: #fff;
          background-color: #333;
        }
        nav {
          max-width: 42rem;
          margin: 1.5rem auto;
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
        button {
          font-size: 1rem;
          color: #fff;
          cursor: pointer;
          border: none;
          background: none;
        }
      `}</style>
    </header>
  );
};

export default Header;
