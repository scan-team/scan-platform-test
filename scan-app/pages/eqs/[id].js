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

import MolViewer from '../../components/mol-viewer-cd-3d';

const apiProxyRoot = process.env.NEXT_PUBLIC_SCAN_API_PROXY_ROOT;
const apiRoot = process.env.SCAN_API_ROOT;

export default function EqInfo({ eqData, id }) {
  const { user, error, isLoading } = useUser();

  const ref = useRef(null);

  console.log(eqData, id);

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
  Object.keys(eqData).forEach((key) => {
    // if (key === 'energy' || key === 'xyz' || key == 'hess_eigenvalue_au') {
    if (jsonProps.includes(key)) {
      properties.push(
        <div
          key={key}
          className="md:grid md:grid-cols-3 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b"
        >
          <div className="text-gray-600">{key}</div>
          <div className="md:col-span-2 whitespace-no-wrap overflow-x-auto text-sm">
            {JSON.stringify(eqData[key])}
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
            <Link href={`/maps/${eqData[key]}`}>{eqData[key]}</Link>
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
            {eqData[key]}
          </div>
        </div>
      );
    }
  });

  return (
    <Layout>
      <Head>
        <title>EQ: {id} - SCAN</title>
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
                <h2 className="text-2xl ">EQ: {eqData.nid}</h2>
                <p className="text-sm text-gray-500">id: {id}</p>
              </div>
              <div className="md:grid md:grid-cols-3 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
                <div className="text-gray-600">Structure</div>
                <div className="md:col-span-2 whitespace-no-wrap overflow-x-auto">
                  <MolViewer
                    item={eqData}
                    width={300}
                    height={300}
                    href={`${apiProxyRoot}/eqs/${eqData.id}/structure?format=mol`}
                  ></MolViewer>
                  <DefaultButton
                    onClick={() => {
                      handleDownload(
                        `${apiProxyRoot}/eqs/${eqData.id}/structure?format=xml`,
                        `eq${eqData.nid}.xyz`
                      );
                    }}
                  >
                    Download XYZ file
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

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    console.log(context);

    const id = context.query.id;

    if (id) {
      let response = null;

      const url = encodeURI(`${apiRoot}/eqs/${id}`);
      console.log(url);

      response = await fetch(url);

      return {
        props: {
          eqData: await response.json(),
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
