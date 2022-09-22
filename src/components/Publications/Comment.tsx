import useBroadcast from '@utils/hooks/useBroadcast';
import { v4 as uuidv4 } from 'uuid';
import { useAccount, useContractWrite, useSignTypedData } from 'wagmi';
import { LensHubProxy } from '@abis/LensHubProxy';
import { useMutation } from '@apollo/client';
import { LENS_HUB_PROXY_ADDRESS } from '../../constants';
import { CREATE_COMMENT_TYPED_DATA } from '@queries/publication';
import {
  CreateCommentBroadcastItemResult,
  Mutation,
  PublicationMainFocus,
} from '@generated/types';
import { splitSignature } from 'src/ethers.service';
import onError from '@lib/onError';
import getSignature from '@lib/getSignature';
import toast from 'react-hot-toast';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { uploadIpfs } from 'src/ipfs';
import { LensterAttachment, LensterPublication } from '@generated/lenstertypes';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type Props = {
  publication: LensterPublication;
};

function Comment({ publication }: Props) {
  const { address, connector: activeConnector } = useAccount();
  const profileId = useAppPersistStore((state) => state.profileId);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [attachments, setAttachments] = useState<LensterAttachment[]>([]);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);
  const [comment, setComment] = useState('');
  const {
    error,
    isLoading: writeLoading,
    write,
  } = useContractWrite({
    addressOrName: LENS_HUB_PROXY_ADDRESS,
    contractInterface: LensHubProxy,
    functionName: 'commentWithSig',
    mode: 'recklesslyUnprepared',
    onSuccess: ({ hash }) => {
      console.log(hash);
    },
  });

  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({
    onError,
  });

  const { broadcast, loading: broadcastLoading } = useBroadcast({
    onCompleted: (data) => {
      console.log(data);
    },
  });

  const [createCommentTypedData, { loading: typedDataLoading }] =
    useMutation<Mutation>(CREATE_COMMENT_TYPED_DATA, {
      onCompleted: async ({
        createCommentTypedData,
      }: {
        createCommentTypedData: CreateCommentBroadcastItemResult;
      }) => {
        try {
          const { id, typedData } = createCommentTypedData;
          const {
            profileId,
            profileIdPointed,
            pubIdPointed,
            contentURI,
            collectModule,
            collectModuleInitData,
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
            contentURI,
            collectModule,
            collectModuleInitData,
            referenceModule,
            referenceModuleData,
            referenceModuleInitData,
            sig,
          };

          //   setUserSigNonce(userSigNonce + 1);
          //   if (!RELAY_ON) {
          //     return write?.({ recklesslySetUnpreparedArgs: inputStruct });
          //   }

          const {
            data: { broadcast: result },
          } = await broadcast({ request: { id, signature } });

          console.log(result);
          if ('reason' in result) {
            write?.({ recklesslySetUnpreparedArgs: inputStruct });
          }
        } catch {}
      },
      onError,
    });

  const isLoading =
    // isUploading ||
    typedDataLoading ||
    // dispatcherLoading ||
    signLoading ||
    writeLoading ||
    broadcastLoading;

  const createComment = async () => {
    console.log('yoyoyo');
    if (!profileId) {
      return toast.error('You must be logged in to comment');
    }
    const ipfsResult = await uploadIpfs({
      version: '1.0.0',
      metadata_id: uuidv4(),
      description: comment,
      content: comment,
      external_url: null,
      image: attachments.length > 0 ? attachments[0]?.item : null,
      imageMimeType: attachments.length > 0 ? attachments[0]?.type : null,
      name: `Comment by @${currentProfile?.handle}`,
      attributes: [],
      locale: 'en-US',
      mainContentFocus:
        attachments.length > 0
          ? PublicationMainFocus.Image
          : PublicationMainFocus.TextOnly,
      media: attachments,
      appId: 'acroama',
      createdOn: new Date(),
    });

    const request = {
      profileId: currentProfile?.id,
      publicationId:
        publication?.__typename === 'Mirror'
          ? publication?.mirrorOf?.id
          : publication?.id,
      contentURI: 'ipfs://' + ipfsResult.path,
      collectModule: { freeCollectModule: { followerOnly: false } },
      referenceModule: {
        followerOnlyReferenceModule: false,
      },
    };

    console.log({ request });

    createCommentTypedData({
      variables: {
        // options: { overrideSigNonce: userSigNonce },
        request,
      },
    });
  };

  return (
    <div className=''>
      <form onSubmit={handleSubmit(createComment)}>
        <div className='flex flex-col w-full hidden md:visible p-4'>
          <div className=''>
            <textarea
              {...register('comment', { required: true })}
              placeholder='comment'
              className='w-full p-4 rounded-md resize-none text-white bg-grod-400 outline-none focus:placeholder-opacity-25 focus:ring focus:ring-burp-500 '
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <div className='flex justify-between  mt-2'>
            <button>
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
                  d='M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z'
                />
              </svg>
            </button>
            <button
              type='submit'
              disabled={isLoading}
              className='bg-burp-500 px-3 font-bold h-10 hover:bg-burp-700 align-middle items-center transition-colors rounded-md '
            >
              Comment
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Comment;
