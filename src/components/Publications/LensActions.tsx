import { GET_SINGLE_PUBLICATION } from '@queries/publication';
import React from 'react';
import { useQuery } from '@apollo/client';

type Props = {
  publicationId: string;
};

function LensActions({ publicationId }: Props) {
  const { data, loading, error } = useQuery(GET_SINGLE_PUBLICATION, {
    variables: {
      request: { publicationId: publicationId },
      reactionRequest: publicationId ? { publicationId: publicationId } : null,
      publicationId: publicationId ?? null,
    },
  });

  console.log(data);

  if (loading) {
    return <></>;
  }
  if (error) {
    return <></>;
  }

  return (
    <div className='flex gap-6 items-center pt-3 -ml-2'>
      <button aria-label='collect'>
        <div className='flex space-x-1 items-center text-green-600'>
          <div className='hover:bg-green-400 p-1.5 rounded-full hover:bg-opacity-40'>
            <span>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-5 h-5'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
                />
              </svg>
            </span>
          </div>
          <div>{data.publication.stats.totalAmountOfCollects}</div>
        </div>
      </button>
      <button aria-label='collect'>
        <div className='flex space-x-1 items-center text-purple-600'>
          <div className='hover:bg-purple-400 p-1.5 rounded-full hover:bg-opacity-40'>
            <span>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-5 h-5'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5'
                />
              </svg>
            </span>
          </div>
          <div>{data.publication.stats.totalAmountOfMirrors}</div>
        </div>
      </button>
      <button aria-label='collect'>
        <div className='flex space-x-1 items-center text-blue-600'>
          <div className='hover:bg-blue-400 p-1.5 rounded-full hover:bg-opacity-40'>
            <span>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-5 h-5'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z'
                ></path>
              </svg>
            </span>
          </div>
          <div>{data.publication.stats.totalAmountOfComments}</div>
        </div>
      </button>
    </div>
  );
}

export default LensActions;
