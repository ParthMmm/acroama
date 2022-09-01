import { gql } from '@apollo/client/core';
import { apolloClient } from '../../../api/client';
import { prettyJSON } from '../../../helpers';
import Cookies from 'js-cookie';
import { COOKIE_CONFIG } from '../../../api/client';
import { useAccount, useSignMessage } from 'wagmi';
import { Lens } from 'lens-protocol';
import Image from 'next/image';
import { createProfile } from '../../../api/createProfile';
import CreateModal from './CreateModal';
import { useState } from 'react';
type Props = {};

const CREATE_PROFILE = `
  mutation($request: CreateProfileRequest!) { 
    createProfile(request: $request) {
      ... on RelayerResult {
        txHash
      }
      ... on RelayError {
        reason
      }
			__typename
    }
 }
`;

function Create({}: Props) {
  const { address } = useAccount();
  const [isOpen, setIsOpen] = useState(false);

  // const { data, error, isLoading, signMessage } = useSignMessage({
  //   onSuccess(data, variables) {
  //     // Verify the signature
  //     VerifySignature(data);
  //   },
  // });

  // const authenticate = async () => {
  //   // Getting the challenge from the server

  //   const data = await Lens.getChallenge(address);
  //   let message = data.data.challenge.text;
  //   // Signing the challenge with the wallet
  //   signMessage({ message });
  // };

  // const VerifySignature = async (sign) => {
  //   // Sending the signature to the server to verify
  //   const response = await Lens.Authenticate(address, sign);
  //   console.log(response);

  // const createProfileRequest = (createProfileRequest: {
  //   handle: string;
  //   profilePictureUri?: string;
  //   followNFTURI?: string;
  // }) => {
  //   return apolloClient.mutate({
  //     mutation: gql(CREATE_PROFILE),
  //     variables: {
  //       request: createProfileRequest,
  //     },
  //   });
  // };

  // const createProfile = async () => {
  //   console.log('create profile: address', address);

  //   // await login(address);
  //   await authenticate;

  //   const createProfileResult = await createProfileRequest({
  //     handle: new Date().getTime().toString(),
  //   });

  //   prettyJSON('create profile: result', createProfileResult.data);

  //   return createProfileResult.data;
  // };

  return (
    <>
      <div className='flex gap-12 items-center'>
        <button
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          className='bg-green-500 hover:bg-green-600 border border-green-600 text-white focus:ring-green-400 px-3 py-1 flex items-center space-x-1.5 rounded-lg font-bold disabled:opacity-50 shadow-sm focus:ring-2 focus:ring-opacity-50 focus:ring-offset-1 outline-none'
        >
          <Image
            src='/lens.png'
            width='16'
            height='16'
            alt='len protocol logo'
          />
          <div>create</div>
        </button>
      </div>
      <CreateModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}

export default Create;
