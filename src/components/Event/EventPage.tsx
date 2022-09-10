import { GET_SINGLE_PUBLICATION } from '@queries/publication';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import Spinner from '@components/Spinner';

type Props = {};

function EventPage({}: Props) {
  const router = useRouter();

  const publicationId = router.query.publicationId || router.query.id;

  const { data, loading, error } = useQuery(GET_SINGLE_PUBLICATION, {
    variables: {
      request: { publicationId },
      reactionRequest: publicationId ? { publicationId: publicationId } : null,
      profileId: publicationId ?? null,
    },
  });

  // console.log(data);

  if (!publicationId) {
    return <>error</>;
  }
  if (loading) {
    return <Spinner />;
  }

  return (
    <div className='m-auto max-w-6xl p-8'>
      <div className='flex flex-col justify-between h-full'>
        <></>
        <div className='flex items-center '>
          {data.publication.metadata.name}
        </div>
      </div>
    </div>
  );
}

export default EventPage;
