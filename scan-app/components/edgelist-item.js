//================================================================================================
// Project: SCAN - Searching Chemical Actions and Networks
//          Hokkaido University (2021)
//          Last Update: Q2 2023
//________________________________________________________________________________________________
// Authors: Mikael Nicander Kuwahara (Lead Developer) [2022-]
//          Jun Fujima (Former Lead Developer) [2021]
//________________________________________________________________________________________________
// Description: This is a Edge-list Item display component that takes an Edge-list item 
//              (from the DB) and returns a html snippet showing the different item parts 
//              accordingly. [Next.js React.js]
//------------------------------------------------------------------------------------------------
// Notes: 
//------------------------------------------------------------------------------------------------
// References: link for Next, 3rd party swr, and internal date and mol-viewer-cd component
//================================================================================================

//------------------------------------------------------------------------------------------------
// Load required libraries
//------------------------------------------------------------------------------------------------
import Link from 'next/link';

import MolViewerSmall from './mol-viewer-cd';
import useSWR from 'swr';

import Date from './date';

import getConfig from "next/config"
const { publicRuntimeConfig } = getConfig()

//------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------
// Init global constants and variables
//------------------------------------------------------------------------------------------------
const apiRoot = publicRuntimeConfig.NEXT_PUBLIC_SCAN_API_PROXY_ROOT;
const fetcher = (url) => fetch(url).then((r) => r.text());

//------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------
// Edge-list Item Component
//------------------------------------------------------------------------------------------------
export default function EdgeListItem({ item }) {
  const { data, error } = useSWR(
    `${apiRoot}/edges/${item.id}/structure?format=can`,
    fetcher
  );

  return (
    <div className="w-full flex mb-2">
      <MolViewerSmall
        className="h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
        item={item}
        href={`${apiRoot}/edges/${item.id}/structure?format=mol`}
      ></MolViewerSmall>

      <div className="rounded-b lg:rounded-b-none lg:rounded-r p-4 flex-1  justify-between leading-normal">
        <div>
          <div>
            {/* Canonical SMILES: */}
            <Link
              href={'/edges/' + item?.id}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <a>{`Edge: ${item.edge_id}`}</a>
            </Link>
          </div>

          <div className="text-sm text-grey-darker">
            <div className="text-xs text-gray-500">
              <b>Id:</b> {item?.id}
            </div>
            <div>
              <b>Category:</b> {`${item?.category}`}
            </div>
            <div>
              <b>Energy:</b> {`${item?.energy}`}
            </div>
            <div>
              <b>Comment:</b> {`${item?.comment}`}
            </div>
            <div>
              <b>Connection0:</b> {`${item?.connection0}`}
            </div>
            <div>
              <b>Connection1:</b> {`${item?.connection1}`}
            </div>
            <div>
              <b>Canonical SMILES:</b>
              <br></br> {`${data}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
//------------------------------------------------------------------------------------------------
