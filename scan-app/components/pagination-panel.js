import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import handleCallbackFactory from '@auth0/nextjs-auth0/dist/handlers/callback';
import Pagination from '@material-ui/lab/Pagination';

export default function PaginationPanel({
  currentPage,
  start,
  end,
  all,
  totalPages,
}) {
  // console.log(all);
  const router = useRouter();
  const [page, setPage] = useState(currentPage);

  const onChangePage = (e, pageNumber) => {
    console.log('ssss');
    console.log('page change:', pageNumber);
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
