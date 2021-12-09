import { useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';

import axios from 'axios';
import fileDownload from 'js-file-download';

import useSWR from 'swr';

import Layout from '../../../components/wide-layout';
import Pagination from '../../../components/pagination-panel';
import EqListItem from '../../../components/eqlist-item';

const apiProxyRoot = process.env.NEXT_PUBLIC_SCAN_API_PROXY_ROOT;
const apiRoot = process.env.SCAN_API_ROOT;
const fetcher = (url) => fetch(url).then((r) => r.text());

export default function EqList({
  mapData,
  id,
  eqListResult,
  sort,
  size = 50,
  order,
  page = 1,
}) {
  console.log('props:', mapData, id, eqListResult, sort, size, order, page);

  const { user, error, isLoading } = useUser();
  const router = useRouter();

  const { data } = useSWR(
    `${apiProxyRoot}/maps/${mapData.id}/init-structure?format=can`,
    fetcher
  );

  let totalPages = 0;
  let start = 1;
  let end = 1;
  let all = 1;

  if (eqListResult) {
    totalPages = Math.ceil(eqListResult.total / eqListResult.size);

    start = (eqListResult.page - 1) * eqListResult.size + 1;
    end = eqListResult.page * eqListResult.size;

    all = eqListResult.total;
  }

  const sortOptions = ['id', 'nid', 'energy'];

  const noiOptions = [50, 100, 200];

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

  const jsonKeys = ['atom_name', 'siml_tempearture_kelvin'];
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
    } else if (key !== 'id' && key !== 'initxyz') {
      properties.push(
        <div
          key={key}
          className="md:grid md:grid-cols-3 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b"
        >
          <div className="text-gray-600">{key}aa</div>
          <div className="md:col-span-2 whitespace-no-wrap overflow-x-auto">
            {mapData[key]}
          </div>
        </div>
      );
    }
  });

  const handleChange = (event) => {
    console.log(event.target.form.sort.value);
    console.log(event.target.form.size.value);

    router.push(
      {
        query: {
          id: id,
          sort: event.target.form.sort.value,
          size: event.target.form.size.value,
          // order: e.target.order.value,
          page: 1,
        },
      },
      null
      // { shallow: true }
    );
  };

  return (
    <Layout>
      <Head>
        <title>EQ List: {id} - SCAN</title>
      </Head>

      {isLoading && <p>Loading profile...</p>}

      {error && (
        <>
          <h4>Error</h4>
          <pre>{error.message}</pre>
        </>
      )}

      {user && (
        <div className="">
          <div className="p-4 mb-3">
            <h2 className="text-2xl ">EQ List in: {data}</h2>
            <p className="text-sm text-gray-500">
              id:{' '}
              <Link href={`/maps/${id}`}>
                <a>{id}</a>
              </Link>
            </p>
          </div>
          <Pagination
            start={start}
            end={end}
            all={all}
            currentPage={parseInt(page)}
            totalPages={totalPages}
          ></Pagination>

          <div className="p-4 flex items-center">
            <label>Sort:</label>
            <form
              onChange={handleChange}
              className="p-4 flex items-center space-x-4"
            >
              <select
                name="sort"
                label="Sort:"
                className="w-28"
                // onChange={handleChange}
                defaultValue={sort}
              >
                {sortOptions?.map((op) => (
                  <option key={op}>{op}</option>
                ))}
              </select>
              <label>Number of items:</label>
              <select
                name="size"
                label="Number of items:"
                className="w-28"
                // onChange={handleChange}
                defaultValue={size}
              >
                {noiOptions?.map((op) => (
                  <option key={op}>{op}</option>
                ))}
              </select>
            </form>
          </div>
          <div className="p-4 flex flex-wrap justify-items-end">
            {eqListResult.items.map((item) => (
              <div key={item.id}>
                <EqListItem className="w-20" item={item}></EqListItem>
              </div>
            ))}
          </div>
          <Pagination
            start={start}
            end={end}
            all={all}
            currentPage={parseInt(page)}
            totalPages={totalPages}
          ></Pagination>
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

      const page = context.query.page || 1;
      const size = context.query.size || 50;
      const sort = context.query.sort || 'id';

      const eqListUrl = encodeURI(
        `${apiRoot}/maps/${id}/eqs?page=${page}&size=${size}&sort=${sort}`
      );

      let eqListResponse = null;
      eqListResponse = await fetch(eqListUrl);

      return {
        props: {
          mapData: await response.json().catch((err) => {
            return { error: err.message };
          }),
          id,
          eqListResult: await eqListResponse.json().catch((err) => {
            return { error: err.message };
          }),
        },
      };
    }

    return {
      props: {
        mapData: null,
        eqListResult: null,
        sort,
        size,
        order,
        page,
      },
    };
  },
});
