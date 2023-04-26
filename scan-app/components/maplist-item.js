//================================================================================================
// Project: SCAN - Searching Chemical Actions and Networks
//          Hokkaido University (2021)
//          Last Update: Q2 2023
//________________________________________________________________________________________________
// Authors: Mikael Nicander Kuwahara (Lead Developer) [2022-]
//          Jun Fujima (Former Lead Developer) [2021]
//________________________________________________________________________________________________
// Description: This is a Map-list Item display component that takes an Map-list item 
//              (from the DB) and returns a html snippet showing the different item parts 
//              accordingly. [Next.js React.js]
//------------------------------------------------------------------------------------------------
// Notes: 
//------------------------------------------------------------------------------------------------
// References: link from Next.js, 3rd party swr, and internal date and mol-viewer-cd component
//================================================================================================

//------------------------------------------------------------------------------------------------
// Load required libraries
//------------------------------------------------------------------------------------------------
import Link from 'next/link';

import Date from '../components/date';
import MolViewerSmall from '../components/mol-viewer-cd';
import useSWR from 'swr';

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
// Map-list Item Component
//------------------------------------------------------------------------------------------------
export default function MapListItem({ item }) {
  const { data, error } = useSWR(
    `${apiRoot}/maps/${item.id}/init-structure?format=can`,
    fetcher
  );

  return (
    <div className="w-full flex mb-2">
      <MolViewerSmall
        className="h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
        item={item}
        href={`${apiRoot}/maps/${item.id}/n0-structure?format=mol`}
      ></MolViewerSmall>

      <div className="rounded-b lg:rounded-b-none lg:rounded-r p-4 flex-1  justify-between leading-normal">
        <div>
          <div>
            {/* Canonical SMILES: */}
            <Link
              href={'/maps/' + item?.id}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <a>{`${data}`}</a>
            </Link>
          </div>

          <div className="text-sm text-grey-darker">
            <div>
              <b>Id:</b> {item?.id}
            </div>
            <div>
              <b>Atoms:</b> {`${item?.atom_name}`}
            </div>
            <div>
              <b>Lowest_energy:</b> {`${item?.lowest_energy}`}
            </div>
            <div>
              <b>highest_energy:</b> {`${item?.highest_energy}`}
            </div>
            <div>{item?.description}</div>
            <div>
              <b>EQs: </b>
              {`${item?.neq}`}, <b>TSs: </b>
              {`${item?.npt}`}
            </div>
            <div>{item?.description}</div>
          </div>

          <Date caption="Created:" dateString={item.created_at} />
          <div>
            <Date caption="Updated:" dateString={item.updated_at} />
          </div>
        </div>
      </div>
    </div>
  );
}
//------------------------------------------------------------------------------------------------
