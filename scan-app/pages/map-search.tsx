//================================================================================================
// Project: SCAN - Searching Chemical Actions and Networks
//                 Hokkaido University (2021)
//________________________________________________________________________________________________
// Authors: Jun Fujima (Former Lead Developer) [2021]
//          Mikael Nicander Kuwahara (Current Lead Developer) [2022-]
//________________________________________________________________________________________________
// Description: This is the Map Search Form Page.
//------------------------------------------------------------------------------------------------
// Notes: 
//------------------------------------------------------------------------------------------------
// References: ReactJS and NextJS libs; 3rd party libs: auth0, Backdrop, material-ui, swr and 
//             node:constants; Internal libs: layout, maplist-item, mapsort-options and 
//             pagination-panel components [ReactJS and NextJS]
//================================================================================================

//------------------------------------------------------------------------------------------------
// Load required libraries
//------------------------------------------------------------------------------------------------
import React from 'react';
import { useState, useEffect } from 'react';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Router from 'next/router';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'node:constants';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import Layout from '../components/layout';
import Pagination from '../components/pagination-panel';
import MapListItem from '../components/maplist-item';
import options from '../lib/mapsort-options';

//------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------
// Initiation of values and constants
//------------------------------------------------------------------------------------------------
const fetcher = (url) => fetch(url).then((res) => res.json());

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const loadingContext = React.createContext(false);

//------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------
// Get Server Side Properties Function
//------------------------------------------------------------------------------------------------
export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    const apiRoot = process.env.SCAN_API_ROOT;
    const q = context.query.q;

    if (q) {
      const searchTarget = context.query['search-target'];
      const { sort, order } = context.query;
      const o = order == 'asc' ? '' : '-';
      const page = context.query.page || 1;
      let response = null;

      if (searchTarget === 'atoms') {
        const url = encodeURI(
          `${apiRoot}/maps?size=10&atoms=${q}&sort=${o}${sort}&page=${page}`
        );

        response = await fetch(url);
      } else if (searchTarget === 'smiles') {
        const url = `${apiRoot}/maps?size=10&smiles=${encodeURIComponent(
          q.toString()
        )}&page=${page}`;

        response = await fetch(url);
      }

      let atoms = null;

      return {
        props: {
          searchResults: await response.json(),
          q,
          searchTarget,
          sort,
          order,
          page,
        },
      };
    }

    return {
      props: {},
    };
  },
});
//------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------
// Map Search Page
//------------------------------------------------------------------------------------------------
const MapSearch = ({ searchResults, q, searchTarget, sort, order, page }) => {
  const { user, error, isLoading } = useUser();
  const router = useRouter();
  const classes = useStyles();

  const [isWaitingResults, setIsWaitingResults] = useState<Boolean>(false);

  useEffect(() => {
    const handleStart = (url) => setIsWaitingResults(true);
    const handleComplete = (url) => setIsWaitingResults(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    let q = e.target.q.value;

    if (e.target['search-target'].value === 'atoms') {
      const k = /,| |\"/g;
      q = q.split(k);
      q = q.filter((i) => i !== '');
      q = q.join(',');
    }

    router.push(
      {
        pathname: '/map-search',
        query: {
          q: q,
          'search-target': e.target['search-target'].value,
          sort: e.target.sort.value,
          order: e.target.order.value,
          page: 1,
        },
      },
      null
    );
  };

  let totalPages = 0;
  let start = 1;
  let end = 1;
  let all = 1;

  if (searchResults) {
    // calculate pagination params
    totalPages = Math.ceil(searchResults.total / searchResults.size);
    start = (searchResults.page - 1) * searchResults.size + 1;
    end = searchResults.page * searchResults.size;
    all = searchResults.total;
  }

  return (
    <Layout>
      <Head>
        <title>SCAN: Map Search</title>
      </Head>

      <h1 className="mb-4">Map Search</h1>

      {isLoading && <p>Loading profile...</p>}

      {error && (
        <>
          <h4>Error</h4>
          <pre>{error.message}</pre>
        </>
      )}

      {user && (
        <>
          <div>
            <form
              onSubmit={handleSubmit}
              className="bg-white shadow-md rounded px-8 pt-6 pb-2 mb-4 flex flex-col my-2"
            >
              <div className="-mx-3 md:flex mb-2">
                <div className="md:w-full px-3">
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="text"
                      name="q"
                      id="q"
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-3 pr-12 sm:text-sm border-gray-300 rounded-md"
                      placeholder="query"
                      defaultValue={q}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <label htmlFor="search-target" className="sr-only">
                        search-target
                      </label>
                      <select
                        id="search-target"
                        name="search-target"
                        className="focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md"
                        defaultValue={searchTarget}
                      >
                        <option>atoms</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="-mx-3 md:flex mb-2">
                <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="sort"
                  >
                    Sort
                  </label>
                  <select
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-3 pr-12 sm:text-sm border-gray-300 rounded-md"
                    id="sort"
                    name="sort"
                    defaultValue={sort}
                  >
                    {options?.map((op) => (
                      <option key={op}>{op}</option>
                    ))}
                  </select>
                </div>
                <div className="md:w-1/2 px-3">
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="order"
                  >
                    Order
                  </label>
                  <div className="relative">
                    <select
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-3 pr-12 sm:text-sm border-gray-300 rounded-md"
                      id="order"
                      name="order"
                      defaultValue={order}
                    >
                      <option>asc</option>
                      <option>desc</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex flex-row items-center justify-between p-5 bg-white border-t border-gray-200 rounded-bl-lg rounded-br-lg">
                <p className="font-semibold text-gray-600"></p>

                <Button
                  color="primary"
                  variant="contained"
                  type="submit"
                  disabled={isWaitingResults.valueOf()}
                >
                  Search
                </Button>
              </div>
            </form>

            {isWaitingResults && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <CircularProgress></CircularProgress>
              </div>
            )}

            {!isWaitingResults && (
              <div>
                {searchResults && searchResults.items && (
                  <>
                    <h4>Results: {searchResults.total} map found.</h4>
                    {searchResults.items.map((item) => (
                      <div key={item.id}>
                        <MapListItem item={item}></MapListItem>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          {!isWaitingResults && searchResults && searchResults.total > 0 && (
            <Pagination
              start={start}
              end={end}
              all={all}
              currentPage={parseInt(page)}
              totalPages={totalPages}
            ></Pagination>
          )}
        </>
      )}

      <Backdrop
        open={false}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Layout>
  );
};
//------------------------------------------------------------------------------------------------

export default MapSearch;
