//================================================================================================
// Project: SCAN - Searching Chemical Actions and Networks
//                 Hokkaido University (2021)
//________________________________________________________________________________________________
// Authors: Jun Fujima (Former Lead Developer) [2021]
//          Mikael Nicander Kuwahara (Current Lead Developer) [2022-]
//________________________________________________________________________________________________
// Description: This is a pagination panel display component that let DB result be displayed as 
//              pages with x number of items. It takes page number info as input and returns a 
//              html snippet showing the pagination panel in its current mode. [Next.js React.js]
//------------------------------------------------------------------------------------------------
// Notes: 
//------------------------------------------------------------------------------------------------
// References: link from Next.js, 3rd party swr, and internal date and mol-viewer-cd component
//================================================================================================

//------------------------------------------------------------------------------------------------
// Load required libraries
//------------------------------------------------------------------------------------------------
import { useState } from 'react';
import { useRouter } from 'next/router';
import Pagination from '@material-ui/lab/Pagination';

//------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------
// Pagination Panel Component
//------------------------------------------------------------------------------------------------
export default function PaginationPanel({
  currentPage,
  start,
  end,
  all,
  totalPages,
}) {
  const router = useRouter();
  const [page, setPage] = useState(currentPage);

  const onChangePage = (e, pageNumber) => {
    setPage(pageNumber);
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: pageNumber },
    });
  };

  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div className="flex-1 flex justify-between sm:hidden">
        <a
          href="#"
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:text-gray-500"
        >
          Previous
        </a>
        <a
          href="#"
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:text-gray-500"
        >
          Next
        </a>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{start}</span> to{' '}
            <span className="font-medium">{end > all ? all : end}</span> of{' '}
            <span className="font-medium">{all}</span> results
          </p>
        </div>
        <div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <Pagination
              count={totalPages}
              page={page}
              variant="outlined"
              shape="rounded"
              onChange={onChangePage}
            />
          </nav>
        </div>
      </div>
    </div>
  );
}
//------------------------------------------------------------------------------------------------
