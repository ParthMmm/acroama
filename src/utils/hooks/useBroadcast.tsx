import { gql, useMutation } from '@apollo/client';
import toast from 'react-hot-toast';

const BROADCAST_MUTATION = gql`
  mutation Broadcast($request: BroadcastRequest!) {
    broadcast(request: $request) {
      ... on RelayerResult {
        txHash
      }
      ... on RelayError {
        reason
      }
    }
  }
`;

interface Props {
  onCompleted?: () => void;
}

const useBroadcast = ({ onCompleted }: Props) => {
  const [broadcast, { data, loading }] = useMutation(BROADCAST_MUTATION, {
    onCompleted,
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    broadcast: ({ request }: any) => broadcast({ variables: { request } }),
    data,
    loading,
  };
};

export default useBroadcast;
