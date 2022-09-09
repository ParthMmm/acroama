import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useQuery } from '@apollo/client';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { useAccount, useConnect, useNetwork, useSignMessage } from 'wagmi';
import { Profile } from '../../generated/types';
import { CURRENT_USER_QUERY } from '@api/getProfiles';
import { useEffect, useState } from 'react';
import ProfileButton from './Profile/ProfileButton';

import Auth from './Auth';
type Props = {};

function Navbar({}: Props) {
  const { chain } = useNetwork();
  const { connectors, error, connectAsync } = useConnect();
  const { address, connector: activeConnector, isConnected } = useAccount();
  const { signMessageAsync, isLoading: signLoading } = useSignMessage({});
  const [isOpen, setIsOpen] = useState(false);

  const profiles = useAppStore((state) => state.profiles);
  const setProfiles = useAppStore((state) => state.setProfiles);
  const profileId = useAppPersistStore((state) => state.profileId);
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);
  const setProfileId = useAppPersistStore((state) => state.setProfileId);
  const isAuthenticated = useAppPersistStore((state) => state.isAuthenticated);
  const setIsAuthenticated = useAppPersistStore(
    (state) => state.setIsAuthenticated
  );

  const { loading, refetch } = useQuery(CURRENT_USER_QUERY, {
    variables: { ownedBy: address },
    skip: !address,
    onCompleted(data) {
      const profiles: Profile[] = data?.profiles?.items
        ?.slice()
        ?.sort((a: Profile, b: Profile) => Number(a.id) - Number(b.id))
        ?.sort((a: Profile, b: Profile) =>
          !(a.isDefault !== b.isDefault) ? 0 : a.isDefault ? -1 : 1
        );

      console.log(data?.userSigNonces?.lensHubOnChainSigNonce, '🖋️');

      profiles.map((p) => {
        if (p.isDefault === true) {
          setProfileId(p.id);
          setCurrentProfile(p);
        }
      });

      if (profiles.length === 0) {
      } else {
        setProfiles(profiles);
      }
    },
  });
  console.log({
    isConnected,
    isAuthenticated,
    profiles,
    address,
    loading,
    profileId,
  });

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId, isConnected, isAuthenticated, profiles, address]);

  const AuthButtons = () => {
    if (!isConnected) {
      return (
        <ConnectButton
          showBalance={{ smallScreen: false, largeScreen: false }}
        />
      );
    }

    if (isConnected && !profileId) {
      return <Auth />;
    }

    if (isConnected && isAuthenticated && profileId) {
      return <ProfileButton />;
    }
  };

  return (
    <nav>
      <div className='sticky top-0 z-10 w-full bg-[#141414] border-b  dark:border-b-green-500/80'>
        <div className='container px-5 mx-auto max-w-screen-xl'>
          <div className='flex relative justify-between items-center h-14 sm:h-16'>
            <h1 className='text-white text-4xl font-bold'>
              <a href={'/'}>spectō</a>
            </h1>
            <div className='flex flex-row gap-4'>{AuthButtons()}</div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
