import { apolloClient } from '@api/client';
import { gql } from '@apollo/client/core';
import { CREATE_POST_TYPED_DATA } from '@queries/publication';
import { pollUntilIndexed } from '../../indexer/has-transaction-been-indexed';
import { v4 as uuidv4 } from 'uuid';
import { useAccount } from 'wagmi';
import { uploadIpfs } from 'src/ipfs';
import { useAppPersistStore } from 'src/store/app';
import { signedTypeData, splitSignature } from 'src/ethers.service';
import { lensHub } from 'src/lens-hub';
import { BigNumber, utils } from 'ethers';
type Props = {};

const createPostTypedData = (createPostTypedDataRequest: any) => {
  return apolloClient.mutate({
    mutation: gql(CREATE_POST_TYPED_DATA),
    variables: {
      request: createPostTypedDataRequest,
    },
  });
};

function CreateEventModal({}: Props) {
  const { address, connector: activeConnector } = useAccount();
  const profileId = useAppPersistStore((state) => state.profileId);

  const createPost = async () => {
    if (!profileId) {
      throw new Error('Must define PROFILE_ID in the .env to run this');
    }

    console.log('create post: address', address);

    // await login(address);

    const ipfsResult = await uploadIpfs({
      version: '1.0.0',
      metadata_id: uuidv4(),
      description:
        'September 2nd, 2022 at The Rady Shell at Jacobs Park in San Diego, CA',
      content: 'Content',
      external_url: null,
      image:
        'https://assets0.dostuffmedia.com/uploads/aws_asset/aws_asset/10614353/ed72ee70-d762-4c61-bb74-d8ea6beeba0b.jpg',
      imageMimeType: ['image/jpeg', 'image/png'],
      name: 'Flume - Palaces',
      attributes: [],
      locale: 'en-US',
      mainContentFocus: 'IMAGE',
      media: [
        {
          item: 'https://assets0.dostuffmedia.com/uploads/aws_asset/aws_asset/10614353/ed72ee70-d762-4c61-bb74-d8ea6beeba0b.jpg',
          type: ['image/jpeg', 'image/png'],
        },
      ],
      appId: 'acroama',
    });
    console.log('create post: ipfs result', ipfsResult);

    // hard coded to make the code example clear
    const createPostRequest = {
      profileId,
      contentURI: 'ipfs://' + ipfsResult.path,
      collectModule: {
        // feeCollectModule: {
        //   amount: {
        //     currency: currencies.enabledModuleCurrencies.map(
        //       (c: any) => c.address
        //     )[0],
        //     value: '0.000001',
        //   },
        //   recipient: address,
        //   referralFee: 10.5,
        // },
        // revertCollectModule: true,
        freeCollectModule: { followerOnly: false },
        // limitedFeeCollectModule: {
        //   amount: {
        //     currency: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
        //     value: '2',
        //   },
        //   collectLimit: '20000',
        //   recipient: '0x3A5bd1E37b099aE3386D13947b6a90d97675e5e3',
        //   referralFee: 0,
        // },
      },
      referenceModule: {
        followerOnlyReferenceModule: false,
      },
    };

    const result = await createPostTypedData(createPostRequest);
    console.log('create post: createPostTypedData', result);

    const typedData = result.data.createPostTypedData.typedData;
    console.log('create post: typedData', typedData);

    const signature = await signedTypeData(
      typedData.domain,
      typedData.types,
      typedData.value
    );
    console.log('create post: signature', signature);

    const { v, r, s } = splitSignature(signature);

    const tx = await lensHub.postWithSig({
      profileId: typedData.value.profileId,
      contentURI: typedData.value.contentURI,
      collectModule: typedData.value.collectModule,
      collectModuleInitData: typedData.value.collectModuleInitData,
      referenceModule: typedData.value.referenceModule,
      referenceModuleInitData: typedData.value.referenceModuleInitData,
      sig: {
        v,
        r,
        s,
        deadline: typedData.value.deadline,
      },
    });
    console.log('create post: tx hash', tx.hash);

    console.log('create post: poll until indexed');
    const indexedResult = await pollUntilIndexed(tx.hash);

    console.log('create post: profile has been indexed', result);

    const logs = indexedResult.txReceipt.logs;

    console.log('create post: logs', logs);

    const topicId = utils.id(
      'PostCreated(uint256,uint256,string,address,bytes,address,bytes,uint256)'
    );
    console.log('topicid we care about', topicId);

    const profileCreatedLog = logs.find((l: any) => l.topics[0] === topicId);
    console.log('create post: created log', profileCreatedLog);

    let profileCreatedEventLog = profileCreatedLog.topics;
    console.log('create post: created event logs', profileCreatedEventLog);

    const publicationId = utils.defaultAbiCoder.decode(
      ['uint256'],
      profileCreatedEventLog[2]
    )[0];

    console.log(
      'create post: contract publication id',
      BigNumber.from(publicationId).toHexString()
    );
    console.log(
      'create post: internal publication id',
      profileId + '-' + BigNumber.from(publicationId).toHexString()
    );

    return result.data;
  };
  return (
    <div>
      <button
        className='bg-green-500 hover:bg-green-600 border border-green-600 text-white focus:ring-green-400 px-3 py-1 flex items-center space-x-1.5 rounded-lg font-bold disabled:opacity-50 shadow-sm focus:ring-2 focus:ring-opacity-50 focus:ring-offset-1 outline-none'
        onClick={createPost}
      >
        create event
      </button>
    </div>
  );
}

export default CreateEventModal;
