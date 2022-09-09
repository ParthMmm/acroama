import React, { useState } from 'react';
import { gql } from '@apollo/client/core';
import { apolloClient } from '@api/client';
import {
  Connector,
  useAccount,
  useConnect,
  useNetwork,
  useSignMessage,
} from 'wagmi';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { COOKIE_CONFIG } from '@api/client';
import { prettyJSON } from 'src/helpers';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { ProfileFields } from '@gql/ProfileFields';
import { CURRENT_PROFILE } from '@queries/auth';
import { Profile } from '../../../generated/types';

// const getUser = (address: string) => {
//   return apolloClient.query({
//     query: gql(CURRENT_PROFILE),
//     variables: {
//       request: {
//         address,
//       },
//     },
//   });
// };

type Props = {};

function Login({}: Props) {
  const { chain } = useNetwork();
  const [isOpen, setIsOpen] = useState(false);

  const { connectors, error, connectAsync } = useConnect();
  const { address, connector: activeConnector } = useAccount();
  const { signMessageAsync, isLoading: signLoading } = useSignMessage({});
  const isAuthenticated = useAppPersistStore((state) => state.isAuthenticated);
  const setIsAuthenticated = useAppPersistStore(
    (state) => state.setIsAuthenticated
  );
  const setProfiles = useAppStore((state) => state.setProfiles);
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);
  const setProfileId = useAppPersistStore((state) => state.setProfileId);
  const setIsConnected = useAppPersistStore((state) => state.setIsConnected);
  // const handleLogIn = async () => {
  //   // we request a challenge from the server
  //   if (address) {
  //     const challengeResponse = await generateChallenge(address);

  //     console.log({ challengeResponse });

  //     // sign the text with the wallet

  //     if (!challengeResponse?.data?.challenge?.text) {
  //       return;
  //     }

  //     const signature = await signMessageAsync({
  //       message: challengeResponse?.data?.challenge?.text,
  //     });

  //     console.log({ signature });

  //     const accessTokens = await authenticate(address, signature);
  //     prettyJSON('login: result', accessTokens.data);

  //     if (accessTokens.data?.authenticate?.accessToken) {
  //       setIsAuthenticated(true);
  //     }

  //     //   setAuthenticationToken(accessTokens.data.authenticate.accessToken);
  //     Cookies.set(
  //       'accessToken',
  //       accessTokens.data.authenticate.accessToken,
  //       COOKIE_CONFIG
  //     );
  //     Cookies.set(
  //       'refreshToken',
  //       accessTokens.data.authenticate.accessToken,
  //       COOKIE_CONFIG
  //     );

  //     // if (accessTokens.data?.authenticate?.accessToken) {
  //     //   const { data: profilesData } = await getUser(address);
  //     //   console.log(profilesData, '🎋');
  //     // }

  //     // if (profilesData?.profiles?.items?.length === 0) {
  //     //   setProfiles([]);
  //     // } else {
  //     //   const profiles: Profile[] = profilesData?.profiles?.items
  //     //     ?.slice()
  //     //     ?.sort((a: Profile, b: Profile) => Number(a.id) - Number(b.id))
  //     //     ?.sort((a: Profile, b: Profile) =>
  //     //       !(a.isDefault !== b.isDefault) ? 0 : a.isDefault ? -1 : 1
  //     //     );
  //     //   const currentProfile = profiles[0];
  //     //   console.log(currentProfile, '🫑');
  //     //   if (currentProfile) {
  //     //     setProfiles(profiles);
  //     //     setCurrentProfile(currentProfile);
  //     //     setProfileId(currentProfile.id);
  //     //   }
  //     //   setIsConnected(true);
  //     // }
  //   }
  // };

  console.log({ isOpen });

  return (
    <div>
      <div className='flex gap-12 items-center'>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='bg-green-500 hover:bg-green-600 border border-green-600 text-white focus:ring-green-400 px-3 py-1 flex items-center space-x-1.5 rounded-lg font-bold disabled:opacity-50 shadow-sm focus:ring-2 focus:ring-opacity-50 focus:ring-offset-1 outline-none'
        >
          <Image
            src='/lens.png'
            width='16'
            height='16'
            alt='len protocol logo'
          />
          <div>Login</div>
        </button>
        {/* <ModalHandler isOpen={isOpen} setIsOpen={setIsOpen} /> */}
      </div>
    </div>
  );
}

export default Login;
