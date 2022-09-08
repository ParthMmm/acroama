import { useQuery } from '@apollo/client';
import EventCard from '@components/Publications/PublicationCard';
import Spinner from '@components/Spinner';
import { LensterPublication } from '@generated/lenstertypes';
import { GET_PUBLICATIONS } from '@queries/publication';
import { useState } from 'react';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import toast from 'react-hot-toast';

type Props = {
  profileId: string;
};

function ProfilePublicationsFeed({ profileId }: Props) {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [results, setResults] = useState([]);

  const { data, loading, error } = useQuery(GET_PUBLICATIONS, {
    variables: {
      request: { profileId, publicationTypes: ['POST', 'COMMENT', 'MIRROR'] },
      reactionRequest: profileId ? { profileId: profileId } : null,
      profileId: profileId ?? null,
    },
    skip: !profileId,
    onCompleted: (data) => {},
  });

  if (loading) {
    return <Spinner />;
  }
  if (!data) {
    toast.error("Couldn't load publications");

    return <></>;
  }
  const filteredPublications = data.publications.items.map(
    (post: { __typename: string; appId: string }) => {
      if (post.__typename === 'Post' && post.appId === 'acroama') {
        return post;
      } else {
        return null;
      }
    }
  );

  const publications = filteredPublications.filter((n: any) => n);

  return (
    <div className='flex flex-col overflow-y-scroll space-y-5'>
      {/* {publications.map((publication: LensterPublication) => {
        return <EventCard key={publication.id} publication={publication} />;
      })} */}
    </div>
  );
}

export default ProfilePublicationsFeed;
