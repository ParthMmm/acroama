import { useQuery } from '@apollo/client';
import { PROFILE_QUERY } from '@queries/profile';
import { useRouter } from 'next/router';
import { useAppStore } from 'src/store/app';
import Image from 'next/image';
import Spinner from '@components/Spinner';
import ProfilePublicationsFeed from './ProfilePublicationsFeed';
type Props = {};

function ProfileView({}: Props) {
  const {
    query: { username, type },
  } = useRouter();

  const currentProfile = useAppStore((state) => state.currentProfile);
  const { data, loading, error } = useQuery(PROFILE_QUERY, {
    variables: {
      request: { handle: username },
      who: currentProfile?.id ?? null,
    },
    skip: !username,
  });

  if (loading) {
    return <Spinner />;
  }

  if (data) {
    return (
      <div className=' mx-auto h-full flex flex-row justify-between overflow-y-scroll'>
        <div className='mt-20  mx-20 w-1/4 border-green-400 border-2 rounded-xl p-4 h-3/4'>
          <Image
            alt='profile picture'
            src={
              'https://lens.infura-ipfs.io/ipfs/QmQ7fPzqhQRvZ5pioCTM8otSgmHAVmZjDn1GuobptBpd8f'
            }
            width={200}
            height={200}
            className='rounded-full'
          />
          <div className='text-white ml-2'>
            <div className='mt-4 '>
              <span className='font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-purple-500 text-2xl'>
                {data.profile.handle}
              </span>
            </div>
            <div className='flex flex-row space-x-2 mt-2'>
              <div className='space-x-1'>
                <span className='font-semibold'>
                  {data.profile.stats.totalFollowers}
                </span>
                <span className='font-thin'>followers</span>
              </div>
              <div className='space-x-1'>
                <span className='font-semibold'>
                  {data.profile.stats.totalFollowing}
                </span>
                <span className='font-thin'>following</span>
              </div>
            </div>
            <div>
              <div className='space-x-1'>
                <span className='font-semibold'>
                  {data.profile.stats.totalPosts}
                </span>
                <span className='font-thin'>
                  {data.profile.stats.totalPosts > 1 ? 'posts' : 'post'}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className='w-3/4 mt-20 '>
          <ProfilePublicationsFeed profileId={currentProfile?.id} />
        </div>
      </div>
    );
  }
}

export default ProfileView;
