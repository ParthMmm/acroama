import useBroadcast from '@utils/hooks/useBroadcast';
import { v4 as uuidv4 } from 'uuid';
import { useAccount, useContractWrite, useSignTypedData } from 'wagmi';
import { LensHubProxy } from '@abis/LensHubProxy';
import { gql, useMutation, useQuery } from '@apollo/client';
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
import CommentModal from '@components/Event/Actions/CommentModal';
import * as Dialog from '@radix-ui/react-dialog';

type Props = {
  publication: LensterPublication;
};

function Comment({ publication }: Props) {
  const { address, connector: activeConnector } = useAccount();
  const profileId = useAppPersistStore((state) => state.profileId);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [attachments, setAttachments] = useState<LensterAttachment[]>([]);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  // const onSubmit = (data: any) => console.log(data);
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
    onCompleted: () => {
      console.log('broadcasted');
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

    console.log(attachments);
    // const ipfsResult = await uploadIpfs({
    //   version: '1.0.0',
    //   metadata_id: uuidv4(),
    //   description: comment,
    //   content: comment,
    //   external_url: null,
    //   image: attachments.length > 0 ? attachments[0]?.item : null,
    //   imageMimeType: attachments.length > 0 ? attachments[0]?.type : null,
    //   name: `Comment by @${currentProfile?.handle}`,
    //   attributes: [],
    //   locale: 'en-US',
    //   mainContentFocus:
    //     attachments.length > 0
    //       ? PublicationMainFocus.Image
    //       : PublicationMainFocus.TextOnly,
    //   media: attachments,
    //   appId: 'acroama',
    //   createdOn: new Date(),
    // });

    // const request = {
    //   profileId: currentProfile?.id,
    //   publicationId:
    //     publication?.__typename === 'Mirror'
    //       ? publication?.mirrorOf?.id
    //       : publication?.id,
    //   contentURI: 'ipfs://' + ipfsResult.path,
    //   collectModule: { freeCollectModule: { followerOnly: false } },
    //   referenceModule: {
    //     followerOnlyReferenceModule: false,
    //   },
    // };

    // console.log({ request });

    // createCommentTypedData({
    //   variables: {
    //     // options: { overrideSigNonce: userSigNonce },
    //     request,
    //   },
    // });
  };

  console.log(attachments);

  return (
    <>
      <CommentModal
        open={open}
        setOpen={setOpen}
        createComment={createComment}
        setComment={setComment}
        isLoading={isLoading}
        attachments={attachments}
        setAttachments={setAttachments}
      />
      <button onClick={() => setOpen(true)}>
        <div className='flex h-10 items-center rounded-lg  bg-black px-3 align-middle font-bold text-black transition-transform hover:scale-105 dark:bg-white '>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='h-4 w-4'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M12 4.5v15m7.5-7.5h-15'
            />
          </svg>
          <div>New Post</div>
        </div>
      </button>
    </>
  );
}

export default Comment;
