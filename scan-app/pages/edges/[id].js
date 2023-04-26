//================================================================================================
// Project: SCAN - Searching Chemical Actions and Networks
//          Hokkaido University (2021)
//          Last Update: Q2 2023
//________________________________________________________________________________________________
// Authors: Mikael Nicander Kuwahara (Lead Developer) [2022-]
//          Jun Fujima (Former Lead Developer) [2021]
//________________________________________________________________________________________________
// Description: This is the edge (of specific ID) display page.
//              [Next.js React.js]
//------------------------------------------------------------------------------------------------
// Notes: 
//------------------------------------------------------------------------------------------------
// References: useref from ReactJS, head and link from NextJS, 3rd partiy libraries: auth0, 
//             axios, js-file-download and fluentui; and internal: wide-layout and 
//             mol-viewer-cd-3d components.
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

import Layout from '../../components/wide-layout';
import MolViewer from '../../components/mol-viewer-cd-3d';

import getConfig from "next/config"
const { publicRuntimeConfig } = getConfig()

//------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------
// Initiation of global values
//------------------------------------------------------------------------------------------------
const apiProxyRoot = publicRuntimeConfig.NEXT_PUBLIC_SCAN_API_PROXY_ROOT;
const apiRoot = publicRuntimeConfig.SCAN_API_ROOT;

//------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------
// Edge Info Page
//------------------------------------------------------------------------------------------------
export default function EdgeInfo({ edgeData, id }) {
  const { user, error, isLoading } = useUser();
  const ref = useRef(null);
  const properties = [];
  let i = 0;

  const handleDownload = (url, filename) => {
    axios
      .get(url, {
        responseType: 'chemical/x-xyz',
      })
      .then((res) => {
        fileDownload(res.data, filename);
      });
  };

  const jsonProps = [
    'energy',
    'xyz',
    'hess_eigenvalue_au',
    'trafficvolume',
    'population',
    'reactionyield',
  ];
  Object.keys(edgeData).forEach((key) => {
    if (jsonProps.includes(key)) {
      properties.push(
        <div
          key={key}
          className="md:grid md:grid-cols-3 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b"
        >
          <div className="text-gray-600">{key}</div>
          <div className="md:col-span-2 whitespace-no-wrap overflow-x-auto text-sm">
            {JSON.stringify(edgeData[key])}
          </div>
        </div>
      );
    } else if (key === 'map_id') {
      properties.push(
        <div
          key={key}
          className="md:grid md:grid-cols-3 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b"
        >
          <div className="text-gray-600">{key}</div>
          <div className="md:col-span-2 whitespace-no-wrap overflow-x-auto">
            <Link href={`/maps/${edgeData[key]}`}>{edgeData[key]}</Link>
          </div>
        </div>
      );
    } else if (key !== 'id' && key !== 'xyz') {
      properties.push(
        <div
          key={key}
          className="md:grid md:grid-cols-3 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b"
        >
          <div className="text-gray-600">{key}</div>
          <div className="md:col-span-2 whitespace-no-wrap overflow-x-auto">
            {edgeData[key]}
          </div>
        </div>
      );
    }
  });

  return (
    <Layout>
      <Head>
        <title>Edge: {id} - SCAN</title>
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
          <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-4xl  bg-white w-full rounded-lg shadow-xl">
              <div className="p-4 border-b">
                <h2 className="text-2xl ">Edge: {edgeData.edge_id}</h2>
                <p className="text-sm text-gray-500">id: {id}</p>
              </div>
              <div className="md:grid md:grid-cols-3 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
                <div className="text-gray-600">Structure</div>
                <div className="md:col-span-2 whitespace-no-wrap overflow-x-auto">
                  <MolViewer
                    item={edgeData}
                    width={300}
                    height={300}
                    href={`${apiProxyRoot}/edges/${edgeData.id}/structure?format=mol`}
                  ></MolViewer>
                  <DefaultButton
                    onClick={() => {
                      handleDownload(
                        `${apiProxyRoot}/edges/${edgeData.id}/structure?format=xml`,
                        `edge${edgeData.edge_id}.xyz`
                      );
                    }}
                  >
                    f Download XYZ file
                  </DefaultButton>
                </div>
              </div>
              <div>{properties}</div>
            </div>
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
      const url = encodeURI(`${apiRoot}/edges/${id}`);
      
      response = await fetch(url);

      return {
        props: {
          edgeData: await response.json(),
          id,
        },
      };
    }

    return {
      props: {
        eqData: null,
      },
    };
  },
});
//------------------------------------------------------------------------------------------------
