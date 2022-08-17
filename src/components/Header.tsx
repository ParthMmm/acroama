import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useSignMessage } from 'wagmi';
import { Lens } from 'lens-protocol';
import { useEffect, useState } from 'react';
import { getDefaultProfile } from '../api/getProfile';
import { gql, useQuery } from '@apollo/client';
import Image from 'next/image';
type Props = {};

type challengeData = {
  data: {
    data: object;
  };
};

function Header({}: Props) {
  const { address } = useAccount();
  console.log(address);
  // const [accessToken, setAccessToken] = useState('');

  const { data, error, isLoading, signMessage } = useSignMessage({
    onSuccess(data, variables) {
      // Verify the signature
      // console.log('3', data, variables);
      VerifySignature(data);
    },
  });

  const authenticate = async () => {
    // Getting the challenge from the server
    const data = await Lens.getChallenge(address as string);
    // console.log('2', data);
    let message: challengeData = data.data.challenge.text;
    // Signing the challenge with the wallet
    signMessage({ message });
  };

  const VerifySignature = async (sign: string) => {
    // Sending the signature to the server to verify
    const response = await Lens.Authenticate(address, sign);
    console.log('1', response);

    const accessToken = response.data?.authenticate.accessToken;
    // const refreshToken = response.data?.authenticate.refreshToken;
    Lens.verify(accessToken).then((res) => {
      console.log(res);
    });
    // console.log({ accessToken, refreshToken });

    // {
    //  data: {
    //   authenticate: {
    //    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjB4YjE5QzI4OTBjZjk0N0FEM2YwYjdkN0U1QTlmZkJjZTM2ZDNmOWJkMiIsInJvbGUiOiJub3JtYWwiLCJpYXQiOjE2NDUxMDQyMzEsImV4cCI6MTY0NTEwNjAzMX0.lwLlo3UBxjNGn5D_W25oh2rg2I_ZS3KVuU9n7dctGIU",
    //    refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjB4YjE5QzI4OTBjZjk0N0FEM2YwYjdkN0U1QTlmZkJjZTM2ZDNmOWJkMiIsInJvbGUiOiJyZWZyZXNoIiwiaWF0IjoxNjQ1MTA0MjMxLCJleHAiOjE2NDUxOTA2MzF9.2Tdts-dLVWgTLXmah8cfzNx7sGLFtMBY7Z9VXcn2ZpE"
    //   }
    // }
  };

  const getProfile = async () => {
    await getDefaultProfile();
  };

  return (
    <nav className='sticky top-0 z-10 w-full bg-white border-b dark:bg-green-900 dark:border-b-green-700/80'>
      <div className='container px-5 mx-auto max-w-screen-xl'>
        <div className='flex relative justify-between items-center h-14 sm:h-16'>
          <h1 className='text-green-400 text-4xl font-bold'>cool project</h1>
          <div className='flex flex-row gap-4'>
            <ConnectButton
              showBalance={{ smallScreen: false, largeScreen: false }}
            />
            <div className='flex gap-12 items-center'>
              <button
                onClick={authenticate}
                className='bg-green-500 hover:bg-green-600 border border-green-600 text-white focus:ring-green-400 px-3 py-1 flex items-center space-x-1.5 rounded-lg font-bold disabled:opacity-50 shadow-sm focus:ring-2 focus:ring-opacity-50 focus:ring-offset-1 outline-none'
              >
                <Image
                  src='/lens.png'
                  width='16'
                  height='16'
                  alt='len protocol logo'
                />
                <div>Login</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
