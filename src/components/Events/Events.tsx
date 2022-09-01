import { apolloClient } from '@api/client';
import { gql } from '@apollo/client/core';
import EventCard from './EventCard';
import { GET_PUBLICATIONS } from '@queries/publication';
import { useAppPersistStore } from 'src/store/app';
import { prettyJSON } from 'src/helpers';
import { useEffect, useState } from 'react';
import { LensterPublication } from '@generated/lenstertypes';
type Props = {};

const getPublicationsRequest = (getPublicationQuery: any) => {
  return apolloClient.query({
    query: gql(GET_PUBLICATIONS),
    variables: {
      request: getPublicationQuery,
    },
  });
};

function Events({}: Props) {
  const profileId = useAppPersistStore((state) => state.profileId);

  const [results, setResults] = useState([]);

  const getPublications = async () => {
    if (!profileId) {
      throw new Error('Must define PROFILE_ID in the .env to run this');
    }

    const result = await getPublicationsRequest({
      profileId,
      publicationTypes: ['POST', 'COMMENT', 'MIRROR'],
    });
    // prettyJSON('publications: result', result.data.publications.items);
    // console.log(
    //   result.data.publications.items.find(
    //     (item) => item.__typename === 'Post' && item.appId === 'acroama'
    //   )
    // );

    // result.data.publications.items.map(
    //   (item) => item.__typename === 'Post' && item.appId === 'acroama'
    // );

    const posts = result.data.publications.items.map(
      (post: { __typename: string; appId: string }) => {
        if (post.__typename === 'Post' && post.appId === 'acroama') {
          return post;
        } else {
          return null;
        }
      }
    );

    setResults(posts.filter((n: any) => n));

    // prettyJSON('publications: result', posts);

    return result.data;
  };

  console.log(results.map((post) => post));

  useEffect(() => {
    getPublications();
  }, []);

  return (
    <div className='grid grid-flow-col	w-full h-full'>
      {results.map((publication: LensterPublication) => {
        return <EventCard key={publication.id} publication={publication} />;
      })}
    </div>
  );
}

export default Events;
