import { VERIFY } from '@queries/auth';
import { apolloClient } from '@api/client';
import { gql } from '@apollo/client/core';
import Cookies from 'js-cookie';
import { useState } from 'react';

const verify = (accessToken: string | undefined) => {
  return apolloClient.query({
    query: gql(VERIFY),
    variables: {
      request: {
        accessToken,
      },
    },
  });
};
const accessToken = Cookies.get('accessToken');

export const useVerify = async () => {
  const [isVerified, setIsVerified] = useState(false);

  // console.log(isVerified, '♻️');

  const verifyResult = await verify(accessToken);
  console.log(verifyResult.data.verify, '🤔');

  if (verifyResult.data?.verify) {
    setIsVerified(true);
  }

  return isVerified;
};
