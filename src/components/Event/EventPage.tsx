import { GET_COMMENTS, GET_SINGLE_PUBLICATION } from '@queries/publication';
import { useRouter } from 'next/router';
import { gql, useQuery } from '@apollo/client';
import Spinner from '@components/Spinner';
import { useAppStore } from 'src/store/app';
import { CommentFields } from '@queries/fragments/CommentFields';
import { trpc } from '@utils/trpc';
import PublicationCard from '@components/Publications/PublicationCard';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';

const Actions = dynamic(() => import('./Actions/Actions'), {
  suspense: true,
  ssr: false,
});

const Comment = dynamic(() => import('../Publications/Comment'), {
  suspense: true,
  ssr: false,
});

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

  const publicationId: any = router?.query?.publicationId || router?.query?.id;

  const trpcQuery = trpc.useQuery(
    ['event.getEventById', { publicationId: publicationId }],
    { enabled: !!publicationId }
  );

  const publicationQuery = useQuery(GET_SINGLE_PUBLICATION, {
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

  const commentFeedQuery = useQuery(COMMENT_FEED_QUERY, {
    variables: { request, reactionRequest },
    skip: !publicationId,
  });

  if (!publicationId) {
    return <>error</>;
  }
  if (
    publicationQuery.loading ||
    commentFeedQuery.loading ||
    trpcQuery.isLoading
  ) {
    return <Spinner />;
  }

  console.log(publicationQuery.data.publication);

  return (
    <div className='flex flex-col md:flex-row lg:mt-24'>
      <div className=' mx-4 p-4 md:mx-24   flex border-2 md:sticky '>
        {/* {commentFeedQuery?.data?.publications?.items.map((comment) => {
          return (
            <div key={comment.id}>
              <span>{comment.metadata.content}</span>
            </div>
          );
        })} */}
        {/* <PublicationCard event={trpcQuery.data} /> */}
        <div className='flex flex-col justify-between '>
          <div className='flex flex-col'>
            <h1 className=' font-bold   text-4xl md:text-5xl tracking-[-0.08em]  shadow-[inset_0_-0.5em_0_0] shadow-burp-500'>
              {trpcQuery.data?.name}
            </h1>
            <h2 className=' sm:text-2xl md:text-3xl tracking-tighter'>
              {trpcQuery.data?.artist.name}
            </h2>
            <span className='font-light text-lg tracking-tight '>
              {trpcQuery.data?.genre.name}
            </span>
          </div>

          <div className='flex flex-col mt-11 '>
            <span className='tracking-tight text-xl font-bold '>
              {trpcQuery.data?.description}
            </span>

            <div className='flex space-x-1 items-center align-middle '>
              <div className=' pl-0 p-1.5 rounded-full hover:bg-opacity-40 '>
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
                {dayjs(trpcQuery.data?.date).format('MMMM D, YYYY')}
              </div>
            </div>
            <div className='flex space-x-1 items-center align-middle '>
              <div className='pl-0 p-1.5 rounded-full hover:bg-opacity-40 '>
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
              <div className='text-white'>{trpcQuery.data?.location}</div>
            </div>
          </div>
          <Actions publication={publicationQuery.data.publication} />
        </div>
      </div>
      <div className='mx-4'>
        <Comment publication={publicationQuery.data.publication} />
      </div>
    </div>
  );
}

export default EventPage;
