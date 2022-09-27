import { ApolloCache, useMutation } from '@apollo/client';
import CustomTooltip from '@components/CustomTooltip';
import {
  CreateCollectBroadcastItemResult,
  CreateMirrorBroadcastItemResult,
  Mutation,
} from '@generated/types';
import getSignature from '@lib/getSignature';
import splitSignature from '@lib/splitSignature';
import {
  CREATE_COLLECT_TYPED_DATA_MUTATION,
  CREATE_MIRROR_TYPED_DATA_MUTATION,
} from '@queries/publication';
import useBroadcast from '@utils/hooks/useBroadcast';
import { useAccount, useContractWrite, useSignTypedData } from 'wagmi';
import onError from '@lib/onError';
import toast from 'react-hot-toast';
import { LensHubProxy } from '@abis/LensHubProxy';
import { LENS_HUB_PROXY_ADDRESS } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { LensterPublication } from '@generated/lenstertypes';
import { PROXY_ACTION_MUTATION } from '@queries/fragments/ProxyAction';
import { useState } from 'react';

type Props = {
  publication: LensterPublication;
};
function Mirror({ publication }: Props) {
  const { address, connector: activeConnector } = useAccount();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [numMirrors, setNumMirrors] = useState(
    publication.stats.totalAmountOfMirrors
  );
  const onCompleted = () => {
    // updateCache();
    setNumMirrors((numMirrors) => numMirrors + 1);
    toast.success('Mirror success!');
  };

  //   const collectModule: any = publication?.collectModule;

  //   console.log(collectModule);

  const {
    data: writeData,
    isLoading: writeLoading,
    write,
  } = useContractWrite({
    addressOrName: LENS_HUB_PROXY_ADDRESS,
    contractInterface: LensHubProxy,
    functionName: 'collectWithSig',
    mode: 'recklesslyUnprepared',
    onSuccess: onCompleted,
    onError,
  });

  const { broadcast, loading: broadcastLoading } = useBroadcast({
    onCompleted,
  });

  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({
    onError,
  });

  const [createMirrorTypedData, { loading: typedDataLoading }] =
    useMutation<Mutation>(CREATE_MIRROR_TYPED_DATA_MUTATION, {
      onCompleted: async ({
        createMirrorTypedData,
      }: {
        createMirrorTypedData: CreateMirrorBroadcastItemResult;
      }) => {
        try {
          const { id, typedData } = createMirrorTypedData;
          const {
            profileId,
            profileIdPointed,
            pubIdPointed,
            referenceModule,
            referenceModuleData,
            referenceModuleInitData,
            deadline,
          } = typedData?.value;
          const signature = await signTypedDataAsync(getSignature(typedData));
          const { v, r, s } = splitSignature(signature);
          const sig = { v, r, s, deadline };
          const inputStruct = {
            profileId,
            profileIdPointed,
            pubIdPointed,
            referenceModule,
            referenceModuleData,
            referenceModuleInitData,
            sig,
          };

          const {
            data: { broadcast: result },
          } = await broadcast({ request: { id, signature } });

          if ('reason' in result) {
            write?.({ recklesslySetUnpreparedArgs: inputStruct });
          }
        } catch {}
      },
      onError,
    });

  const createMirror = () => {
    if (!currentProfile) {
      return toast.error('Sign In');
    }

    const request = {
      profileId: currentProfile?.id,
      publicationId: publication?.id,
      referenceModule: {
        followerOnlyReferenceModule: false,
      },
    };

    createMirrorTypedData({
      variables: {
        // options: { overrideSigNonce: userSigNonce },
        request,
      },
    });
  };

  return (
    <div className='text-white'>
      <button aria-label='collect' onClick={createMirror}>
        <div className='flex space-x-1 items-center '>
          <CustomTooltip content={'Mirror'} defaultOpen={false}>
            <div className='pl-0 p-1.5 rounded-full hover:bg-opacity-40 transition-all'>
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
                    d='M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5'
                  />
                </svg>
              </span>
            </div>
          </CustomTooltip>

          <div>{numMirrors}</div>
        </div>
      </button>
    </div>
  );
}

export default Mirror;
function signTypedDataAsync(arg0: {
  domain: { [key: string]: any };
  types: { [key: string]: any };
  value: { [key: string]: any };
}) {
  throw new Error('Function not implemented.');
}
