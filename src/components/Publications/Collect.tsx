import { apolloClient } from '@api/client';
import { gql } from '@apollo/client/core';
import { CREATE_COLLECT_TYPED_DATA } from '@queries/publication';

type Props = {
  publicationID: string;
};

const createCollectTypedData = (createCollectTypedDataRequest: any) => {
  return apolloClient.mutate({
    mutation: gql(CREATE_COLLECT_TYPED_DATA),
    variables: {
      request: createCollectTypedDataRequest,
    },
  });
};

function Collect({ publicationID }: Props) {
  return <div>Collect</div>;
}

export default Collect;
