import { apolloClient } from '@api/client';
import { gql } from '@apollo/client/core';
import { GET_PUBLICATIONS } from '@queries/publication';
import { useAppPersistStore } from 'src/store/app';
import { prettyJSON } from 'src/helpers';
import { useEffect, useState } from 'react';
import { LensterPublication } from '@generated/lenstertypes';
import { useQuery } from '@apollo/client';
import Spinner from '@components/Spinner';
import { trpc } from '@utils/trpc';
type Props = {};
import dynamic from 'next/dynamic';

const EventCard = dynamic(() => import('../Publications/PublicationCard'));

// const getPublicationsRequest = (getPublicationQuery: any) => {
//   return apolloClient.query({
//     query: gql(GET_PUBLICATIONS),
//     variables: {
//       request: getPublicationQuery,
//     },
//   });
// };

// id          String   @id @default(cuid())
// name        String
// description String
// date        DateTime
// location    String
// artist      Artist   @relation(fields: [artistId], references: [id])
// artistId    String
// genre       Genre    @relation(fields: [genreId], references: [id])
// genreId     String
// ipfsURI    String
// publicationId String

type Event = {
  event: EventCardProp[];
};

type EventCardProp = {
  event: {
    id: string;
    name: string;
    description: string;
    date: string;
    location: string;
    artistId: number;
    ipfsURI: string;
    publicationId: string;
  };
};

function Events({}: Props) {
  const profileId = useAppPersistStore((state) => state.profileId);

  // const { data, loading, error } = useQuery(GET_PUBLICATIONS, {
  //   variables: {
  //     request: { profileId, publicationTypes: ['POST', 'COMMENT', 'MIRROR'] },
  //     reactionRequest: profileId ? { profileId: profileId } : null,
  //     profileId: profileId ?? null,
  //   },
  //   skip: !profileId,
  //   onCompleted: (data) => {},
  // });

  // const test = trpc.useQuery(['test.getAll']);

  const { data, isLoading, error } = trpc.useQuery(['event.getAllEvents']);
  if (isLoading) {
    return <Spinner />;
  }
  if (error) {
    return <></>;
  }
  if (!data) {
    return <></>;
  }

  return (
    <div className=' flex flex-col  justify-start '>
      <h2 className='font-normal text-2xl mb-2  mx-4 md:mx-12'>
        latest events
      </h2>
      {/* display: grid; max-width: var(--widths-landingMaxWidth); width: 100%; gap:
      40px 16px; justify-items: stretch; grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(2, 380px);
      grid-rows-[200px_minmax(900px,_1fr)_100px] grid-template-rows: repeat(2,
      minmax(0, 1fr)) */}
      <div className='grid grid-cols-1 grid-rows-3 gap-6 md:grid-cols-3  md:grid-rows-2 md:gap-[40px_16px]  w-full px-6 '>
        {data.map((event) => {
          return <EventCard key={event.id} event={event} />;
        })}
      </div>
    </div>
  );
  // const filteredPublications = data.publications.items.map(
  //   (post: { __typename: string; appId: string }) => {
  //     if (post.__typename === 'Post' && post.appId === 'acroama') {
  //       return post;
  //     } else {
  //       return null;
  //     }
  //   }
  // );

  // const publications = filteredPublications.filter((n: any) => n);
}

export default Events;
