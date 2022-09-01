import { gql } from '@apollo/client/core';
import { apolloClient } from '../api/client';
import { ethers, utils, Wallet } from 'ethers';

// import { login } from '../auth/login';
// import { PROFILE_ID } from '../config';
import {
  ethersProvider,
  getAddressFromSigner,
  signedTypeData,
  splitSignature,
} from '../ethers.service';
import { pollUntilIndexed } from '../indexer/has-transaction-been-indexed';
import { lensHub } from '../lens-hub';

const CREATE_SET_DEFAULT_PROFILE_TYPED_DATA = `
  mutation($request: CreateSetDefaultProfileRequest!     $options: TypedDataOptions
    ) { 
    createSetDefaultProfileTypedData(options: $options, request: $request) {
      id
      expiresAt
      typedData {
        types {
          SetDefaultProfileWithSig {
            name
            type
          }
        }
      domain {
        name
        chainId
        version
        verifyingContract
      }
      value {
        nonce
        deadline
        wallet
        profileId
      }
    }
  }
}
`;

const createSetDefaultProfileTypedData = (profileId: string) => {
  return apolloClient.mutate({
    mutation: gql(CREATE_SET_DEFAULT_PROFILE_TYPED_DATA),
    variables: {
      request: {
        profileId,
      },
    },
  });
};

export const setDefaultProfile = async () => {
  const profileId = '0x44c2';
  if (!profileId) {
    throw new Error('Must define PROFILE_ID in the .env to run this');
  }

  const address = getAddressFromSigner();
  console.log('set default profile: address', address);

  // await login(address);

  const result = await createSetDefaultProfileTypedData(profileId);
  console.log('set default profile: createSetDefaultProfileTypedData', result);

  const typedData = result.data.createSetDefaultProfileTypedData.typedData;
  console.log('set default profile: typedData', typedData);

  const signature = await signedTypeData(
    typedData.domain,
    typedData.types,
    typedData.value
  );
  console.log('set default profile: signature', signature);

  const { v, r, s } = splitSignature(signature);

  // const aa = await ethers.utils.fetchJson(
  //   `${process.env.MUMBAI_RPC_URL}`,
  //   '{ "id": 42, "jsonrpc": "2.0", "method": "eth_chainId", "params": [ ] }'
  // );
  // console.log(aa);

  const tx = await lensHub.setDefaultProfileWithSig({
    profileId: typedData.value.profileId,
    wallet: typedData.value.wallet,
    sig: {
      v,
      r,
      s,
      deadline: typedData.value.deadline,
    },
  });
  console.log(tx);
  console.log('set default profile: tx hash', tx.hash);

  console.log('set default profile: poll until indexed');
  const indexedResult = await pollUntilIndexed(tx.hash);

  console.log('set default profile: action has been indexed', indexedResult);

  return result.data;
};

(async () => {
  // console.log(ethersProvider.getSigner());
  // console.log(ethersProvider.getGasPrice());
  await setDefaultProfile();
})();
