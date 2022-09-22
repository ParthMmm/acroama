import { NextPage } from 'next';
import React from 'react';
// import Hero from './Hero';
import dynamic from 'next/dynamic';
import CreateEvent from '@components/Admins/CreateEvent';
import { gql, useQuery } from '@apollo/client';

const Hero = dynamic(() => import('@components/Home/Hero'), {
  suspense: false,
  ssr: false,
});
const Events = dynamic(
  () => import('@components/Publications/PublicationsFeed'),
  { ssr: false }
);

export const MODULES_QUERY = gql`
  query EnabledModules {
    enabledModules {
      collectModules {
        moduleName
        contractAddress
      }
    }
    enabledModuleCurrencies {
      name
      symbol
      decimals
      address
    }
  }
`;
export const Home: NextPage = () => {
  const { error, data, loading } = useQuery(MODULES_QUERY);
  console.log(data, error, loading);

  return (
    // <div className='flex flex-col items-center ml-auto mr-auto w-full h-full    mt-1 overflow-hidden '>
    <div className=' '>
      <Hero />
      <Events />
      <CreateEvent />
    </div>
  );
};
