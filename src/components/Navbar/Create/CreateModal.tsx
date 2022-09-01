import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import z, { ZodError } from 'zod';
import {
  CREATE_PROFILE,
  VERIFY,
  CREATE_SET_DEFAULT_PROFILE_TYPED_DATA,
} from '@queries/auth';
import { apolloClient } from '@api/client';
import { gql } from '@apollo/client/core';
import { pollUntilIndexed } from '../../../indexer/has-transaction-been-indexed';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { BigNumber, utils } from 'ethers';
import Cookies from 'js-cookie';
import { useVerify } from '@utils/hooks/useVerify';
import { Listbox } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import {
  getAddressFromSigner,
  signedTypeData,
  splitSignature,
} from '../../../ethers.service';
import {
  useAccount,
  useConnect,
  useNetwork,
  useSignMessage,
  useWaitForTransaction,
  useContractWrite,
  useSignTypedData,
} from 'wagmi';
import { prettyJSON } from 'src/helpers';
import Spinner from '@components/Spinner';
import { lensHub } from 'src/lens-hub';
import { LensHubProxy } from '@abis/LensHubProxy';
// import { useAccount, useContractWrite, useSignTypedData } from 'wagmi';

const accessToken = Cookies.get('accessToken');

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const createProfileRequest = (createProfileRequest: {
  handle: string;
  profilePictureUri?: string;
  followNFTURI?: string;
}) => {
  return apolloClient.mutate({
    mutation: gql(CREATE_PROFILE),
    variables: {
      request: createProfileRequest,
    },
  });
};

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

export const verify = (accessToken: string) => {
  return apolloClient.query({
    query: gql(VERIFY),
    variables: {
      request: {
        accessToken,
      },
    },
  });
};

export default function CreateModal({ isOpen, setIsOpen }: Props) {
  console.log(isOpen, '🥷');
  const [userName, setUserName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [defaultProfile, setDefaultProfile] = useState(false);
  const { address, connector: activeConnector } = useAccount();
  const { signMessageAsync, isLoading: signLoading } = useSignMessage({});
  const [verified, setVerified] = useState(false);
  const profiles = useAppStore((state) => state.profiles);
  const profileId = useAppPersistStore((state) => state.profileId);
  const setProfileId = useAppPersistStore((state) => state.setProfileId);
  const [selectedProfile, setSelectedProfile] = useState({
    handle: '',
    id: '',
  });

  const userNameSchema = z
    .string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
    })
    .min(5, { message: 'Username must be at least 5 characters' })
    .max(31, { message: 'Username must be at most 31 characters' });

  const handleCreate = async () => {
    try {
      setIsPending(true);
      userNameSchema.parse(userName);

      console.log(accessToken, '🥷');
      if (accessToken) {
        const verifyResult = await verify(accessToken);
        console.log({ verifyResult });
        if (verifyResult.data?.verify) {
          setVerified(true);
          await createProfile();
        } else {
          setVerified(false);
          setIsPending(false);
        }
      }
    } catch (e) {
      if (e instanceof ZodError) {
        e.errors.map(({ message }) => setErrorMessage(message));
      } else {
        console.log(e);
      }
      setIsPending(false);
    }
  };
  const onCompleted = () => {
    console.log('default');
  };

  // const {
  //   data: writeData,
  //   isLoading: writeLoading,
  //   error,
  //   write,
  // } = useContractWrite({
  //   addressOrName: '0x60ae865ee4c725cd04353b5aab364553f56cef82',
  //   contractInterface: LensHubProxy,
  //   functionName: 'setDefaultProfileWithSig',
  //   mode: 'recklesslyUnprepared',
  //   onSuccess: onCompleted,
  // });
  // console.log(writeData, writeLoading, error);

  const createProfile = async () => {
    const createProfileResult = await createProfileRequest({
      handle: userName,
    });

    prettyJSON('create profile: result', createProfileResult.data);

    console.log('create profile: poll until indexed');
    console.log(createProfileResult.data);
    const result = await pollUntilIndexed(
      createProfileResult.data.createProfile.txHash
    );

    console.log('create profile: profile has been indexed', result);

    const logs = result.txReceipt.logs;

    console.log('create profile: logs', logs);

    const topicId = utils.id(
      'ProfileCreated(uint256,address,address,string,string,address,bytes,string,uint256)'
    );
    console.log('topicid we care about', topicId);

    const profileCreatedLog = logs.find((l: any) => l.topics[0] === topicId);
    console.log('profile created log', profileCreatedLog);

    let profileCreatedEventLog = profileCreatedLog.topics;
    console.log('profile created event logs', profileCreatedEventLog);

    const profileId = utils.defaultAbiCoder.decode(
      ['uint256'],
      profileCreatedEventLog[1]
    )[0];

    setIsPending(false);
    setProfileId(profileId);

    checkForDefault();

    console.log('profile id', BigNumber.from(profileId).toHexString());

    return result.data;
  };

  const checkForDefault = async () => {
    if (profiles) {
      profiles.map((p) => {
        if (p.isDefault === true) {
          setDefaultProfile(true);
        }
      });
    }
  };

  const handleDefault = async () => {
    try {
      setIsPending(true);
      if (accessToken) {
        const verifyResult = await verify(accessToken);
        console.log({ verifyResult });
        if (verifyResult.data?.verify) {
          setVerified(true);
          setDefault();
        } else {
          setVerified(false);
          setIsPending(false);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const setDefault = async () => {
    const profileID = selectedProfile.id;
    if (!profileID) {
      throw new Error('Must define PROFILE_ID in the .env to run this');
    }

    console.log('set default profile: address', address);

    // await login(address);

    const result = await createSetDefaultProfileTypedData(profileID);
    console.log(
      'set default profile: createSetDefaultProfileTypedData',
      result
    );

    const typedData = result.data.createSetDefaultProfileTypedData.typedData;
    console.log('set default profile: typedData', typedData);

    const { wallet, deadline, profileId, nonce } = typedData?.value;

    const signature = await signedTypeData(
      typedData.domain,
      typedData.types,
      typedData.value
    );
    // console.log('set default profile: signature', signature);

    const { v, r, s } = splitSignature(signature);
    const sig = { v, r, s, deadline };

    // console.log(sig);
    const inputStruct = {
      follower: address,
      wallet,
      profileId,
      sig,
    };

    console.log(inputStruct);
    // const aa = await ethers.utils.fetchJson(
    //   `${process.env.MUMBAI_RPC_URL}`,
    //   '{ "id": 42, "jsonrpc": "2.0", "method": "eth_chainId", "params": [ ] }'
    // );
    // console.log(aa);

    // write?.({ recklesslySetUnpreparedArgs: inputStruct });

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

    setProfileId(profileId);

    return result.data;
    return;
  };

  useEffect(() => {
    const checkVerify = async () => {
      if (accessToken) {
        const verifyResult = await verify(accessToken);
        console.log({ verifyResult });
        if (verifyResult.data?.verify) {
          setVerified(true);
        } else {
          setVerified(false);
        }
      }
    };
    checkVerify();
  });

  console.log({ isPending, profileId, defaultProfile, profiles, verified });

  const innerModal = () => {
    if (!isPending && !profileId && !defaultProfile && profiles.length === 0) {
      return (
        <Dialog.Panel className='mx-auto max-w-lg  bg-[#2c2d2f]   border-[1px] border-green-700/80 rounded-xl'>
          <Dialog.Title>
            <div className=' flex justify-between items-center py-3.5 px-5 divider'>
              <div>
                {' '}
                <span className='font-bold text-white '>
                  Create a Lens profile
                </span>
              </div>
              <div>
                {' '}
                <button
                  onClick={() => {
                    setIsOpen(!isOpen);
                    setErrorMessage('');
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
                <span>
                  {
                    " It looks like you don't have a Lens profile yet. Lets create one now."
                  }
                </span>
              </div>
              <div className='flex flex-col'>
                <input
                  className='w-2/3 border-4 border-green-700/80 rounded-xl bg-[#2c2d2f] p-2 mt-4 text-white mb-4'
                  placeholder='username'
                  onChange={(e) => setUserName(e.target.value)}
                />
                <div>
                  {' '}
                  {errorMessage && (
                    <span className='text-red-400'>{errorMessage}</span>
                  )}
                </div>
              </div>
            </Dialog.Description>
            <div className='flex flex-row-reverse justify-between mt-10'>
              {' '}
              <button onClick={handleCreate} className='text-green-500'>
                create
              </button>
            </div>
          </div>
        </Dialog.Panel>
      );
    }

    if (!isPending && !defaultProfile && (profiles.length > 0 || profileId)) {
      return (
        <Dialog.Panel className='mx-auto max-w-lg  bg-[#2c2d2f]   border-[1px] border-green-700/80 rounded-xl'>
          <Dialog.Title>
            <div className=' flex justify-between items-center py-3.5 px-5 divider'>
              <div>
                {' '}
                <span className='font-bold text-white '>
                  Set a default profile
                </span>
              </div>
              <div>
                {' '}
                <button
                  onClick={() => {
                    setIsOpen(!isOpen);
                    setErrorMessage('');
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
          <div className='p-5 w-full'>
            <Dialog.Description>
              <div className='mt-6 text-white font-light '>
                <span>
                  {
                    'You need to set a default profile. Which one would you like to use?'
                  }
                </span>
              </div>
              <Listbox value={selectedProfile} onChange={setSelectedProfile}>
                <Listbox.Button className='relative w-3/4  cursor-default rounded-lg text-purple-200 py-2 pl-3 pr-10 text-left shadow-md sm:text-sm'>
                  <span className='block truncate font-bold'>
                    {selectedProfile.handle}
                  </span>
                  <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
                    <SelectorIcon
                      className='h-5 w-5 text-gray-400'
                      aria-hidden='true'
                    />
                  </span>
                </Listbox.Button>
                <Listbox.Options className='absolute mt-1 max-h-60 w-1/4  overflow-auto rounded-md bg-gblack py-1 text-base  shadow-lg  focus:outline-none sm:text-sm'>
                  {profiles.map((p) => (
                    <Listbox.Option
                      key={p.id}
                      value={p}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-3 pr-10 rounded-sm transition-colors  ${
                          active ? 'bg-purple-100 text-black' : 'text-white'
                        }`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? 'font-bold' : 'font-normal'
                            }`}
                          >
                            {p.handle}
                          </span>
                          {selected ? (
                            <span className='absolute inset-y-0 right-0 flex items-center pr-4 text-gre-600'>
                              <CheckIcon
                                className='h-5 w-5'
                                aria-hidden='true'
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Listbox>
              <div className='flex flex-col'>
                {/* <div>
                  {' '}
                  {errorMessage && (
                    <span className='text-red-400'>{errorMessage}</span>
                  )}
                </div> */}
              </div>
            </Dialog.Description>
            <div className='flex flex-row-reverse justify-between mt-10'>
              {' '}
              <button onClick={handleDefault} className='text-green-500'>
                set default
              </button>
            </div>
          </div>
        </Dialog.Panel>
      );
    }

    if (isPending) {
      return (
        <Dialog.Panel className='mx-auto max-w-lg  bg-[#2c2d2f]   border-[1px] border-green-700/80 rounded-xl'>
          <Dialog.Title>
            <div className=' flex justify-between items-center py-3.5 px-5 divider'>
              <div>
                {' '}
                <span className='font-bold text-white '>
                  Create a Lens profile
                </span>
              </div>
              <div>
                {' '}
                <button
                  onClick={() => {
                    setIsOpen(!isOpen);
                    setErrorMessage('');
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
                <Spinner loadingText='confirming transaction' />;
              </div>
            </Dialog.Description>
          </div>
        </Dialog.Panel>
      );
    }
    if (!isPending && !verified) {
      return (
        <Dialog.Panel className='mx-auto max-w-lg  bg-[#2c2d2f]   border-[1px] border-green-700/80 rounded-xl'>
          <Dialog.Title>
            <div className=' flex justify-between items-center py-3.5 px-5 divider'>
              <div>
                {' '}
                <span className='font-bold text-white '>
                  Verification Error
                </span>
              </div>
              <div>
                {' '}
                <button
                  onClick={() => {
                    setIsOpen(!isOpen);
                    setErrorMessage('');
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
                <span>
                  {' Try disconnecting and reconnecting your wallet.'}
                </span>
              </div>
            </Dialog.Description>
          </div>
        </Dialog.Panel>
      );
    }
  };

  return <> {innerModal()}</>;
}
