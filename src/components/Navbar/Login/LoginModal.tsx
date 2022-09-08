import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import Image from 'next/image';
import React from 'react';
import { gql } from '@apollo/client/core';
import { apolloClient } from '@api/client';
import { GET_CHALLENGE, AUTHENTICATION } from '@queries/auth';
import Cookies from 'js-cookie';
import { COOKIE_CONFIG } from '@api/client';
import { prettyJSON } from 'src/helpers';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { useAccount, useConnect, useNetwork, useSignMessage } from 'wagmi';
import { Profile } from '@generated/types';
import { PROFILE_QUERY } from '@queries/profile';
import { useLazyQuery, useMutation } from '@apollo/client';
import { CURRENT_PROFILE_QUERY } from '@components/Layout';
import toast from 'react-hot-toast';

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setHasProfile: Dispatch<SetStateAction<boolean>>;
};

const generateChallenge = (address: string) => {
  return apolloClient.query({
    query: gql(GET_CHALLENGE),
    variables: {
      request: {
        address,
      },
    },
  });
};

const authenticate = (address: string, signature: string) => {
  return apolloClient.mutate({
    mutation: gql(AUTHENTICATION),
    variables: {
      request: {
        address,
        signature,
      },
    },
  });
};

const CHALLENGE_QUERY = gql`
  query Challenge($request: ChallengeRequest!) {
    challenge(request: $request) {
      text
    }
  }
`;

export const AUTHENTICATE_MUTATION = gql`
  mutation Authenticate($request: SignedAuthChallenge!) {
    authenticate(request: $request) {
      accessToken
      refreshToken
    }
  }
`;

function LoginModal({ isOpen, setIsOpen, setHasProfile }: Props) {
  const { chain } = useNetwork();
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

  const [loadChallenge, { error: errorChallenge, loading: challengeLoading }] =
    useLazyQuery(CHALLENGE_QUERY, {
      fetchPolicy: 'no-cache',
    });
  const [authenticate, { error: errorAuthenticate, loading: authLoading }] =
    useMutation(AUTHENTICATE_MUTATION);
  const [getProfiles, { error: errorProfiles, loading: profilesLoading }] =
    useLazyQuery(CURRENT_PROFILE_QUERY);

  const handleLogIn = async () => {
    // we request a challenge from the server
    if (address) {
      const challengeResponse = await loadChallenge({
        variables: { request: { address } },
      });

      console.log({ challengeResponse, errorChallenge });
      console.log(challengeResponse.data.challenge.text);
      // sign the text with the wallet

      // if (challengeResponse?.data?.challenge?.text) {
      //   return toast.error("Error: couldn't get challenge from server");
      // }

      const signature = await signMessageAsync({
        message: challengeResponse?.data?.challenge?.text,
      });

      const accessTokens = await authenticate({
        variables: { request: { address, signature } },
      });

      prettyJSON('login: result', accessTokens.data);

      if (accessTokens.data?.authenticate?.accessToken) {
        setIsAuthenticated(true);
      }

      Cookies.set(
        'accessToken',
        accessTokens.data.authenticate.accessToken,
        COOKIE_CONFIG
      );
      Cookies.set(
        'refreshToken',
        accessTokens.data.authenticate.accessToken,
        COOKIE_CONFIG
      );

      const { data: profilesData } = await getProfiles({
        variables: { ownedBy: address },
      });

      if (profilesData?.profiles?.items?.length === 0) {
        console.log('no profiles');
      } else {
        const profiles: Profile[] = profilesData?.profiles?.items
          ?.slice()
          ?.sort((a: Profile, b: Profile) => Number(a.id) - Number(b.id))
          ?.sort((a: Profile, b: Profile) =>
            !(a.isDefault !== b.isDefault) ? 0 : a.isDefault ? -1 : 1
          );
        const currentProfile = profiles[0];
        setIsAuthenticated(true);
        setProfiles(profiles);
        if (currentProfile) {
          setCurrentProfile(currentProfile);
          setProfileId(currentProfile.id);
        }
      }

      //   if (accessTokens.data?.authenticate?.accessToken) {
      //     const { data: profilesData } = await getUser(address);
      //     console.log(profilesData, '🎋');
      //   }

      //   if (profilesData?.profiles?.items?.length === 0) {
      //     setProfiles([]);
      //   } else {
      //     const profiles: Profile[] = profilesData?.profiles?.items
      //       ?.slice()
      //       ?.sort((a: Profile, b: Profile) => Number(a.id) - Number(b.id))
      //       ?.sort((a: Profile, b: Profile) =>
      //         !(a.isDefault !== b.isDefault) ? 0 : a.isDefault ? -1 : 1
      //       );
      //     const currentProfile = profiles[0];
      //     console.log(currentProfile, '🫑');
      //     if (currentProfile) {
      //       setProfiles(profiles);
      //       setCurrentProfile(currentProfile);
      //       setProfileId(currentProfile.id);
      //     }
      //     setIsConnected(true);
      //   }
    }
  };

  return (
    <Dialog.Panel className='mx-auto max-w-lg  bg-[#2c2d2f]   border-[1px] border-green-700/80 rounded-xl'>
      <Dialog.Title>
        <div className=' flex justify-between items-center py-3.5 px-5 divider'>
          <div>
            {' '}
            <span className='font-bold text-white '>Login</span>
          </div>
          <div>
            {' '}
            <button
              onClick={() => {
                setIsOpen(!isOpen);
                // setErrorMessage('');
              }}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='#fff'
                className='w-6 h-6'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M4.5 19.5l15-15m-15 0l15 15'
                />
              </svg>
            </button>
          </div>
        </div>
      </Dialog.Title>
      <div className='p-5'>
        <Dialog.Description>
          <div className='mt-6 text-white font-light '>
            <span>{'Sign the message with your Lens profile'}</span>
          </div>
        </Dialog.Description>
        <div className='flex flex-row justify-between mt-10'>
          <div className='flex gap-12 items-center'>
            <button
              onClick={handleLogIn}
              className='bg-green-500 hover:bg-green-600 border border-green-600 text-white focus:ring-green-400 px-3 py-1 flex items-center space-x-1.5 rounded-lg font-bold disabled:opacity-50 shadow-sm focus:ring-2 focus:ring-opacity-50 focus:ring-offset-1 outline-none'
            >
              <Image
                src='/lens.png'
                width='16'
                height='16'
                alt='len protocol logo'
              />
              <div>Sign In With Lens</div>
            </button>
          </div>
        </div>
      </div>
    </Dialog.Panel>
  );
}

export default LoginModal;
