import { ReactNode, useEffect, useState } from 'react';
import Head from 'next/head';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import Cookies from 'js-cookie';
import { useAccount, useDisconnect, useNetwork } from 'wagmi';
import { gql, useQuery } from '@apollo/client';
import { ProfileFields } from '@gql/ProfileFields';
import clearAuthData from '@lib/clearAuthData';
import { Profile } from '@generated/types';
import { Toaster } from 'react-hot-toast';
import dynamic from 'next/dynamic';

type Props = {
  children: ReactNode;
};

export const CURRENT_PROFILE_QUERY = gql`
  query CurrentProfile($ownedBy: [EthereumAddress!]) {
    profiles(request: { ownedBy: $ownedBy }) {
      items {
        ...ProfileFields
        isDefault
        dispatcher {
          canUseRelay
        }
      }
    }
    userSigNonces {
      lensHubOnChainSigNonce
    }
  }
  ${ProfileFields}
`;

const Navbar = dynamic(() => import('@components/Navbar'), { ssr: false });

function Layout({ children }: Props) {
  const setProfiles = useAppStore((state) => state.setProfiles);
  const profiles = useAppStore((state) => state.profiles);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);
  const isConnected = useAppPersistStore((state) => state.isConnected);
  const setIsConnected = useAppPersistStore((state) => state.setIsConnected);
  const isAuthenticated = useAppPersistStore((state) => state.isAuthenticated);
  const setIsAuthenticated = useAppPersistStore(
    (state) => state.setIsAuthenticated
  );
  const profileId = useAppPersistStore((state) => state.profileId);
  const setProfileId = useAppPersistStore((state) => state.setProfileId);

  const [mounted, setMounted] = useState(false);
  const { address, isDisconnected } = useAccount();
  const { chain } = useNetwork();
  const { disconnect } = useDisconnect();

  const { loading } = useQuery(CURRENT_PROFILE_QUERY, {
    variables: { ownedBy: address },
    skip: !isConnected,
    onCompleted: (data) => {
      const profiles: Profile[] = data?.profiles?.items
        ?.slice()
        ?.sort((a: Profile, b: Profile) => Number(a.id) - Number(b.id))
        ?.sort((a: Profile, b: Profile) =>
          !(a.isDefault !== b.isDefault) ? 0 : a.isDefault ? -1 : 1
        );

      setUserSigNonce(data?.userSigNonces?.lensHubOnChainSigNonce);

      if (profiles.length === 0) {
        setProfileId(null);
      } else {
        const selectedUser = profiles.find(
          (profile) => profile.id === profileId
        );
        setProfiles(profiles);
        setCurrentProfile(selectedUser as Profile);
        console.log('🗃️', { profiles, selectedUser });
      }
    },
  });

  useEffect(() => {
    const accessToken = Cookies.get('accessToken');
    const refreshToken = Cookies.get('refreshToken');
    const hasAuthTokens =
      accessToken !== 'undefined' && refreshToken !== 'undefined';
    const currentProfileAddress = currentProfile?.ownedBy;
    const hasSameAddress =
      currentProfileAddress !== undefined && currentProfileAddress !== address;

    // if (
    //   (hasSameAddress || // If the current address is not the same as the profile address
    //     chain?.id !== process.env.CHAIN_ID || // If the user is not on the correct chain
    //     isDisconnected || // If the user is disconnected from the wallet
    //     !profileId || // If the user has no profile
    //     !hasAuthTokens) && // If the user has no auth tokens
    //   isAuthenticated // If the user is authenticated
    // ) {
    //   setIsAuthenticated(false);
    //   setIsConnected(false);
    //   setCurrentProfile(null);
    //   setProfileId(null);
    //   clearAuthData();
    //   disconnect();
    // }
    if (isDisconnected) {
      setIsConnected(false);
      setCurrentProfile(null);
      setProfileId(null);
      clearAuthData();
      disconnect();
    }

    console.log('🐵', { currentProfileAddress }, { hasSameAddress });

    // Set mounted state to true after the first render
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isDisconnected,
    address,
    chain,
    currentProfile,
    disconnect,
    setCurrentProfile,
  ]);

  // if (loading || !mounted) {
  //   return <div>loading</div>;
  // }

  return (
    <>
      <Head>
        <title>acroama</title>
      </Head>
      <Toaster position='bottom-center' />
      <div className='fixed bg-[#fcfcfc] dark:bg-[#141414]  transition-all duration-700 ease-in-out  h-screen  w-screen text-white'>
        <Navbar />
        {children}
      </div>
    </>
  );
}

export default Layout;
