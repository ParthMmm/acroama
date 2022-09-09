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

  return (
    <>
      <div className='flex gap-12 items-center'>
        <button className='bg-green-500 hover:bg-green-600 border border-green-600 text-white focus:ring-green-400 px-3 py-1 flex items-center space-x-1.5 rounded-lg font-bold disabled:opacity-50 shadow-sm focus:ring-2 focus:ring-opacity-50 focus:ring-offset-1 outline-none'>
          <Image
            src='/lens.png'
            width='16'
            height='16'
            alt='len protocol logo'
          />
          <div>Get Started</div>
        </button>
      </div>
    </>
  );
}

export default Create;
