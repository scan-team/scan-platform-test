//================================================================================================
// Project: SCAN - Searching Chemical Actions and Networks
//          Hokkaido University (2021)
//          Last Update: Q2 2023
//________________________________________________________________________________________________
// Authors: Mikael Nicander Kuwahara (Lead Developer) [2022-]
//          Jun Fujima (Former Lead Developer) [2021]
//________________________________________________________________________________________________
// Description: This is the Map (of specific ID) display page.
//              [Next.js React.js]
//------------------------------------------------------------------------------------------------
// Notes: 
//------------------------------------------------------------------------------------------------
// References: useref from ReactJS, head and link from NextJS, 3rd partiy libraries: auth0, 
//             axios, js-file-download, swr and fluentui; and internal: wide-layout.
//================================================================================================

//------------------------------------------------------------------------------------------------
// Load required libraries
//------------------------------------------------------------------------------------------------
import { useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import axios from 'axios';
import fileDownload from 'js-file-download';
import { DefaultButton, PrimaryButton } from '@fluentui/react';
import useSWR from 'swr';

import Layout from '../../components/wide-layout';

import getConfig from "next/config"
const { publicRuntimeConfig } = getConfig()

//------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------
// Initiation of global values
//------------------------------------------------------------------------------------------------
const apiProxyRoot = publicRuntimeConfig.NEXT_PUBLIC_SCAN_API_PROXY_ROOT;
const apiRoot = publicRuntimeConfig.SCAN_API_ROOT;

const fetcher = (url) => fetch(url).then((r) => r.text());

//------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------
// Map Info Page
//------------------------------------------------------------------------------------------------
export default function MapInfo({ mapData, id }) {
  const { user, error, isLoading } = useUser();
  const ref = useRef(null);

  const { data } = useSWR(
    `${apiProxyRoot}/maps/${mapData.id}/init-structure?format=can`,
    fetcher
  );

  const properties = [];
  let i = 0;

  const handleDownload = (url, filename) => {
    axios
      .get(url, {
        responseType: 'text-csv',
      })
      .then((res) => {
        fileDownload(res.data, filename);
      });
  };

  const jsonKeys = ['atom_name', 'siml_temperature_kelvin'];
  const hiddenKeys = [
    'fname_top_abs',
    'fname_top_rel',
    'energyshiftvalue_au',
    'accessibility',
  ];

  Object.keys(mapData).forEach((key) => {
    if (hiddenKeys.includes(key)) {
      // just skip...
    } else if (jsonKeys.includes(key)) {
      properties.push(
        <div
          key={key}
          className="md:grid md:grid-cols-3 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b"
        >
          <div className="text-gray-600">{key}</div>
          <div className="md:col-span-2 whitespace-no-wrap overflow-x-auto">
            {JSON.stringify(mapData[key])}
          </div>
        </div>
      );
    } else if (key === 'neq') {
      properties.push(
        <div
          key={key}
          className="md:grid md:grid-cols-3 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b"
        >
          <div className="text-gray-600">{key}</div>
          <div className="md:col-span-2 whitespace-no-wrap overflow-x-auto">
            <Link href={`/maps/${id}/eqs`}>
              <a>{mapData[key]}</a>
            </Link>
          </div>
        </div>
      );
    } else if (key === 'nts' || key === 'npt') {
      properties.push(
        <div
          key={key}
          className="md:grid md:grid-cols-3 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b"
        >
          <div className="text-gray-600">{key}</div>
          <div className="md:col-span-2 whitespace-no-wrap overflow-x-auto">
            {mapData[key] !== 0 ? (
              <Link href={`/maps/${id}/edges`}>
                <a>{mapData[key]}</a>
              </Link>
            ) : (
              mapData[key]
            )}
          </div>
        </div>
      );
    } else if (key !== 'id' && key !== 'initxyz') {
      properties.push(
        <div
          key={key}
          className="md:grid md:grid-cols-3 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b"
        >
          <div className="text-gray-600">{key}</div>
          <div className="md:col-span-2 whitespace-no-wrap overflow-x-auto">
            {mapData[key]}
          </div>
        </div>
      );
    }
  });

  return (
    <Layout>
      <Head>
        <title>Map: {id} - SCAN</title>
      </Head>

      {isLoading && <p>Loading profile...</p>}

      {error && (
        <>
          <h4>Error</h4>
          <pre>{error.message}</pre>
        </>
      )}

      {user && (
        <div>
          <div className="flex items-center justify-center m-3">
            <div className="m-3">
              <Link href={`/maps/${id}/graph`}>
                <a>Go to GraphViewer</a>
              </Link>
            </div>
          </div>

          <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-4xl  bg-white w-full rounded-lg shadow-xl">
              <div className="p-4 border-b">
                <h2 className="text-2xl ">{data}</h2>
                <p className="text-sm text-gray-500">id: {id}</p>
              </div>
              <div>{properties}</div>
            </div>
          </div>

          <div className="flex items-center justify-center m-3">
            <div className="m-3">
              <Link href={`/maps/${id}/graph`}>
                <a>Go to GraphViewer</a>
              </Link>
            </div>
            <DefaultButton
              onClick={() => {
                handleDownload(`${apiProxyRoot}/maps/${id}/graph`, 'graph.csv');
              }}
            >
              Download Graph as CSV
            </DefaultButton>
          </div>
        </div>
      )}
    </Layout>
  );
}
//------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------
// Get Server Side Properties Function
//------------------------------------------------------------------------------------------------
export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    const id = context.query.id;

    if (id) {
      let response = null;
      const url = encodeURI(`${apiRoot}/maps/${id}`);

      response = await fetch(url);

      return {
        props: {
          mapData: await response.json(),
          id,
        },
      };
    }

    return {
      props: {
        mapData: null,
      },
    };
  },
});
//------------------------------------------------------------------------------------------------
