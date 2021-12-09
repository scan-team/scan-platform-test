import { useRef } from 'react';
import Layout from '../../components/wide-layout';
import Head from 'next/head';
import Link from 'next/link';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';

import axios from 'axios';
import fileDownload from 'js-file-download';
import { DefaultButton, PrimaryButton } from '@fluentui/react';

import Date from '../../components/date';
import utilStyles from '../../styles/utils.module.css';

import { GraphViewer } from '../../components/graph-viewer';
import useSWR from 'swr';

const apiProxyRoot = process.env.NEXT_PUBLIC_SCAN_API_PROXY_ROOT;
const apiRoot = process.env.SCAN_API_ROOT;

const fetcher = (url) => fetch(url).then((r) => r.text());

export default function MapInfo({ mapData, id }) {
  const { user, error, isLoading } = useUser();

  const ref = useRef(null);

  const { data } = useSWR(
    `${apiProxyRoot}/maps/${mapData.id}/init-structure?format=can`,
    fetcher
  );

  console.log(mapData, id);

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

          {/* <GraphViewer
            graphUrl={`${apiRoot}/maps/${id}/graph`}
            mapId={id}
          ></GraphViewer> */}
        </div>
      )}
    </Layout>
  );
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    console.log(context);

    const id = context.query.id;

    if (id) {
      let response = null;

      const url = encodeURI(`${apiRoot}/maps/${id}`);
      console.log(url);

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
