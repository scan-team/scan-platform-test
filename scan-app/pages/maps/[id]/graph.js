import { useRef, useState } from 'react';
import Layout from '../../../components/wide-layout';
import Head from 'next/head';
import Link from 'next/link';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';

import { GraphViewer } from '../../../components/graph-viewer';
import useSWR from 'swr';

const apiProxyRoot = process.env.NEXT_PUBLIC_SCAN_API_PROXY_ROOT;
const apiRoot = process.env.SCAN_API_ROOT;

const fetcher = (url) => fetch(url).then((r) => r.text());

export default function GraphViewerPage({ mapData, id }) {
  const { user, error, isLoading } = useUser();

  const ref = useRef(null);

  const { data } = useSWR(
    `${apiProxyRoot}/maps/${mapData.id}/init-structure?format=can`,
    fetcher
  );

  console.log(mapData, id);

  const properties = [];
  let i = 0;

  const jsonKeys = ['atom_name', 'siml_temperature_kelvin'];
  const hiddenKeys = ['fname_top_abs', 'fname_top_rel', 'energyshiftvalue_au'];

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
    <GraphViewer
      className="w-full h-full"
      graphUrl={`${apiProxyRoot}/maps/${id}/graph`}
      mapId={id}
    ></GraphViewer>
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
