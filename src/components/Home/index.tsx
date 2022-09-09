import { NextPage } from 'next';
import React from 'react';

import dynamic from 'next/dynamic';

const Hero = dynamic(() => import('@components/Home/Hero'));
const Events = dynamic(
  () => import('@components/Publications/PublicationsFeed')
);

export const Home: NextPage = () => {
  return (
    <div className='flex flex-col items-center ml-auto mr-auto w-full h-full    mt-1 overflow-hidden '>
      <Hero />
      <Events />
    </div>
  );
};
