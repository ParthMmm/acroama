import { useMutation } from '@apollo/client';
import CustomTooltip from '@components/CustomTooltip';
import { CreateCollectBroadcastItemResult, Mutation } from '@generated/types';
import getSignature from '@lib/getSignature';
import splitSignature from '@lib/splitSignature';
import { CREATE_COLLECT_TYPED_DATA_MUTATION } from '@queries/publication';
import useBroadcast from '@utils/hooks/useBroadcast';
import { useAccount, useContractWrite, useSignTypedData } from 'wagmi';
import onError from '@lib/onError';
import toast from 'react-hot-toast';
import { LensHubProxy } from '@abis/LensHubProxy';
import { LENS_HUB_PROXY_ADDRESS } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { LensterPublication } from '@generated/lenstertypes';
import { PROXY_ACTION_MUTATION } from '@queries/fragments/ProxyAction';

type Props = {
  publication: LensterPublication;
};
function Collect({ publication }: Props) {
  const { address, connector: activeConnector } = useAccount();
  const currentProfile = useAppStore((state) => state.currentProfile);

  const onCompleted = () => {
    toast.success('Collect success!');
  };

  const collectModule: any = publication?.collectModule;

  const {
    broadcast,
    data: broadcastData,
    loading: broadcastLoading,
  } = useBroadcast({ onCompleted });

  // console.log(collectModule);

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

  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({
    onError,
  });

  const [createCollectTypedData, { loading: typedDataLoading }] =
    useMutation<Mutation>(CREATE_COLLECT_TYPED_DATA_MUTATION, {
      onCompleted: async ({
        createCollectTypedData,
      }: {
        createCollectTypedData: CreateCollectBroadcastItemResult;
      }) => {
        try {
          const { id, typedData } = createCollectTypedData;
          const {
            profileId,
            pubId,
            data: collectData,
            deadline,
          } = typedData?.value;
          const signature = await signTypedDataAsync(getSignature(typedData));
          const { v, r, s } = splitSignature(signature);
          const sig = { v, r, s, deadline };
          const inputStruct = {
            collector: address,
            profileId,
            pubId,
            data: collectData,
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

  const [createCollectProxyAction, { loading: proxyActionLoading }] =
    useMutation<Mutation>(PROXY_ACTION_MUTATION, {
      onCompleted,
      onError,
    });

  const createCollect = () => {
    if (!currentProfile) {
      return toast.error('sign in');
    }

    if (collectModule?.__typename === 'FreeCollectModuleSettings') {
      createCollectProxyAction({
        variables: {
          request: {
            collect: { freeCollect: { publicationId: publication?.id } },
          },
        },
      });
    } else {
      createCollectTypedData({
        variables: {
          //   options: { overrideSigNonce: userSigNonce },
          request: { publicationId: publication?.id },
        },
      });
    }
  };

  return (
    <div className='text-white'>
      <button aria-label='collect' onClick={createCollect}>
        <div className='flex items-center space-x-1 '>
          <CustomTooltip content={'Collect'} defaultOpen={false}>
            <div className='rounded-full p-1.5 pl-0 transition-all hover:bg-opacity-40'>
              <span>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-5 w-5'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z'
                  />
                </svg>
              </span>
            </div>
          </CustomTooltip>

          <div>{publication.stats.totalAmountOfCollects}</div>
        </div>
      </button>
    </div>
  );
}

export default Collect;
