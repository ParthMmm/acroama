import { LensterPublication } from '@generated/lenstertypes';
import { PublicationsQueryRequest } from '@generated/types';
import Image from 'next/image';
import dayjs from 'dayjs';
import LensActions from './LensActions';
import { motion } from 'framer-motion';
import Link from 'next/link';

type Props = {
  publication: LensterPublication;
};

type Event = {
  event: EventCardProp[];
};

type Artist = {
  id: string;
  mbid: string;
  name: string;
};

type EventCardProp = {
  event: {
    id: string;
    name: string;
    description: string;
    date: Date;
    location: string;
    artist: Artist;
    ipfsURI: string;
    publicationId: string;
  };
};

function EventCard({ event }: EventCardProp) {
  // console.log(event);
  return (
    // <motion.div
    //   whileHover={{ scale: 1.05 }}
    //   transition={{ type: 'spring', stiffness: 400, damping: 15 }}
    // >
    <Link
      href={{
        pathname: `/e/${event?.publicationId}`,
        query: { publicationId: event.publicationId },
      }}
      as={`/e/${event?.publicationId}`}
    >
      <div className='w-96 flex flex-row h-72   mx-auto shadow-xl border-2 border-[#EFD9CE] rounded-sm hover:cursor-pointer group'>
        <div className=' p-4  h-full  flex flex-col justify-between  space-y-2 rounded-xl rounded-r-none border-r-2 border-bribbon-500  '>
          <div>
            <h2 className='font-bold text-xl shadow-2xl  '>
              <a className='group-hover:shadow-highlight-blurple'>
                {event.name}
              </a>
            </h2>
            <div className='text-lg'>{event.artist.name}</div>
          </div>

          <div className='font-thin text-sm my-4 '>{event.description}</div>
        </div>
        {/* <div className='mt-2 block'>
          <Image
            src={publication?.metadata?.media[0]?.original?.url}
            layout='responsive'
            //   layout={'fixed'}
            width={500}
            height={500}
            alt='tour image'
          />
        </div> */}
        <div className='flex flex-col  justify-between p-4 transition-all '>
          <div>
            <div className='flex space-x-1 items-center '>
              <div className=' p-1.5 rounded-full hover:bg-opacity-40 '>
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
                      d='M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5'
                    />
                  </svg>
                </span>
              </div>
              <div className='text-white'>
                {dayjs(event.date).format('MMMM D, YYYY')}
              </div>
            </div>

            <div className='flex space-x-1 items-center '>
              <div className='p-1.5 rounded-full hover:bg-opacity-40 '>
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
                      d='M15 10.5a3 3 0 11-6 0 3 3 0 016 0z'
                    />
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z'
                    />
                  </svg>
                </span>
              </div>
              <div className='text-white'>{event.location}</div>
            </div>
          </div>
          <div className='   '>
            <LensActions publicationId={event.publicationId} />
          </div>
        </div>
      </div>
    </Link>
    // </motion.div>
  );
}

export default EventCard;
