import { GET_SINGLE_PUBLICATION } from '@queries/publication';
import React from 'react';
import { useQuery } from '@apollo/client';
import CustomTooltip from '@components/CustomTooltip';
import { motion } from 'framer-motion';

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

  if (loading) {
    return <></>;
  }
  if (error) {
    return <></>;
  }

  return (
    <div className='flex gap-6 items-center'>
      {/* <motion.div
        whileHover={{ scale: 1.5 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      > */}
      <button aria-label='collect'>
        <div className='flex space-x-1 items-center '>
          <CustomTooltip content={'Collect'} defaultOpen={false}>
            <div className=' p-1.5 rounded-full hover:bg-opacity-40 transition-all'>
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
                    d='M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z'
                  />
                </svg>
              </span>
            </div>
          </CustomTooltip>

          <div>{data.publication.stats.totalAmountOfCollects}</div>
        </div>
      </button>
      {/* </motion.div> */}
      <button aria-label='collect'>
        <div className='flex space-x-1 items-center '>
          <div className='p-1.5 rounded-full hover:bg-opacity-40 transition-all'>
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
        <div className='flex space-x-1 items-center '>
          <div className=' p-1.5 rounded-full hover:bg-opacity-40 transition-all'>
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
                d='M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z'
              />
            </svg>
          </div>
          <div>{data.publication.stats.totalAmountOfComments}</div>
        </div>
      </button>
    </div>
  );
}

export default LensActions;
