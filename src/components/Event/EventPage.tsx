import { GET_COMMENTS, GET_SINGLE_PUBLICATION } from '@queries/publication';
import { useRouter } from 'next/router';
import { gql, useQuery } from '@apollo/client';
import Spinner from '@components/Spinner';
import Comment from '../Publications/Comment';
import { useAppStore } from 'src/store/app';
import { CommentFields } from '@queries/fragments/CommentFields';

type Props = {};

export const COMMENT_FEED_QUERY = gql`
  query CommentFeed(
    $request: PublicationsQueryRequest!
    $reactionRequest: ReactionFieldResolverRequest
  ) {
    publications(request: $request) {
      items {
        ... on Comment {
          ...CommentFields
        }
      }
      pageInfo {
        totalCount
        next
      }
    }
  }
  ${CommentFields}
`;

function EventPage({}: Props) {
  const router = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);

  const publicationId = router.query.publicationId || router.query.id;

  const { data, loading, error } = useQuery(GET_SINGLE_PUBLICATION, {
    variables: {
      request: { publicationId },
      reactionRequest: publicationId ? { publicationId: publicationId } : null,
      profileId: publicationId ?? null,
    },
  });

  const request = { commentsOf: publicationId, limit: 10, sources: 'acroama' };
  const reactionRequest = currentProfile
    ? { profileId: currentProfile?.id }
    : null;
  const profileId = currentProfile?.id ?? null;

  const commentFeedQuery = useQuery(COMMENT_FEED_QUERY, {
    variables: { request, reactionRequest },
    skip: !publicationId,
  });
  console.log(commentFeedQuery.data);

  if (!publicationId) {
    return <>error</>;
  }
  if (loading && commentFeedQuery.loading) {
    return <Spinner />;
  }

  console.log(data.publication);

  return (
    <div className='m-auto max-w-6xl p-8'>
      <div className='flex flex-col justify-between h-full'>
        <></>
        <div className='flex items-center '>
          {data.publication.metadata.name}
        </div>
        <Comment publication={data.publication} />
        {commentFeedQuery?.data?.publications?.items.map((comment) => {
          return (
            <div key={comment.id}>
              <span>{comment.metadata.content}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default EventPage;
