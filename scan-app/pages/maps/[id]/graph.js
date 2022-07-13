//================================================================================================
// Project: SCAN - Searching Chemical Actions and Networks
//                 Hokkaido University (2021)
//________________________________________________________________________________________________
// Authors: Jun Fujima (Former Lead Developer) [2021]
//          Mikael Nicander Kuwahara (Current Lead Developer) [2022-]
//________________________________________________________________________________________________
// Description: This is the graph for a specific Map (of specific ID) display page.
//              [Next.js React.js]
//------------------------------------------------------------------------------------------------
// Notes: 
//------------------------------------------------------------------------------------------------
// References: useref from ReactJS; head and link from NextJS, 3rd partiy libraries: auth0, axios, 
//             js-file-download, and swr; and internal: wide-layout, graph-viewer and 
//             eqlist-item components.
//================================================================================================

//------------------------------------------------------------------------------------------------
// Load required libraries
//------------------------------------------------------------------------------------------------
import { useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import useSWR from 'swr';

import Layout from '../../../components/wide-layout';
import { GraphViewer } from '../../../components/graph-viewer';

//------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------
// Initiation of global values
//------------------------------------------------------------------------------------------------
const apiProxyRoot = process.env.NEXT_PUBLIC_SCAN_API_PROXY_ROOT;
const apiRoot = process.env.SCAN_API_ROOT;
const fetcher = (url) => fetch(url).then((r) => r.text());

//------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------
// Graph Viewer (for specific Map) Page
//------------------------------------------------------------------------------------------------
export default function GraphViewerPage({ mapData, id }) {
  const { user, error, isLoading } = useUser();
  const ref = useRef(null);

  const { data } = useSWR(
    `${apiProxyRoot}/maps/${mapData.id}/init-structure?format=can`,
    fetcher
  );

  const useWidth = () => {
    const [width, setWidth] = useState(0); // default width, detect on server.
    const handleResize = () => setWidth(window.innerWidth);
    useEffect(() => {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);
    return width;
  };

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
    <Layout style={{width: {useWidth}}}>
      <Head>
        <title>Map Graph: {id} - SCAN</title>
      </Head>
      <GraphViewer
        style={{height: "0px", width: "0px", border: "0px" }}
        className="w-full h-full"
        graphUrl={`${apiProxyRoot}/maps/${id}/graph`}
        mapId={id}
      ></GraphViewer>
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
