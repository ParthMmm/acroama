import { apolloClient } from '@api/client';
import { gql } from '@apollo/client/core';
import EventCard from './PublicationCard';
import { GET_PUBLICATIONS } from '@queries/publication';
import { useAppPersistStore } from 'src/store/app';
import { prettyJSON } from 'src/helpers';
import { useEffect, useState } from 'react';
import { LensterPublication } from '@generated/lenstertypes';
import { useQuery } from '@apollo/client';
import Spinner from '@components/Spinner';
import { trpc } from '@utils/trpc';
type Props = {};

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

  console.log(data);

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

  return (
    <div className='grid grid-flow-col	w-full h-full'>
      {data.map((event) => {
        return <EventCard key={event.id} event={event} />;
      })}
    </div>
  );
}

export default Events;
