import { LensterPublication } from '@generated/lenstertypes';
import { PublicationsQueryRequest } from '@generated/types';
import Image from 'next/image';

type Props = {
  publication: LensterPublication;
};

type Event = {
  event: EventCardProp[];
};

type EventCardProp = {
  event: {
    title: string;
    artist: string;
    date: string;
    image: string;
    comments: number;
    mirrors: number;
    likes: number;
    collects: number;
  };
};

function EventCard({ publication }: Props) {
  console.log(event);
  return (
    <div className='max-w-xl block m-auto border-white-1 rounded-lg ml-auto mr-auto  bg-white w-10/12 h-10/12 text-black'>
      <div className='flex flex-col justify-between px-4 mt-4'>
        <div className='font-bold text-lg'>{publication.metadata.name}</div>
      </div>
      <div className='mt-2'>
        <Image
          src={publication?.metadata?.media[0]?.original?.url}
          layout='responsive'
          //   layout={'fixed'}
          width={600}
          height={600}
          alt='tour image'
        />
      </div>

      <div className='flex flex-col mt-1 px-4 '>
        <div className='flex gap-6 items-center pt-3 -ml-2'>
          <button aria-label='collect'>
            <div className='flex space-x-1 items-center'>
              <div className='hover:bg-green-500 p-1.5 rounded-full hover:bg-opacity-20'>
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
              <div>{publication.stats.totalAmountOfCollects}</div>
            </div>
          </button>
          <button aria-label='collect'>
            <div className='flex space-x-1 items-center'>
              <div className='hover:bg-green-500 p-1.5 rounded-full hover:bg-opacity-20'>
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
              <div>{publication.stats.totalAmountOfMirrors}</div>
            </div>
          </button>
          <button aria-label='collect'>
            <div className='flex space-x-1 items-center'>
              <div className='hover:bg-green-500 p-1.5 rounded-full hover:bg-opacity-20'>
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
              <div>{publication.stats.totalAmountOfComments}</div>
            </div>
          </button>
        </div>

        <div>
          <div className='font-normal text-sm my-4'>
            {publication.metadata.description}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
