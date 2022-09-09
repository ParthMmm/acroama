import { setDefaultProfile } from '@api/setDefaultProfile';
import CreateEventModal from '@components/Admins/CreateEventModal';
import Events from '@components/Publications/PublicationsFeed';
import { NextPage } from 'next';
import React from 'react';
import { ethersProvider } from 'src/ethers.service';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { trpc } from '@utils/trpc';
import Hero from './Hero';
type Props = {};

export const Home: NextPage = () => {
  const profiles = useAppStore((state) => state.profiles);
  const currentProfile = useAppStore((state) => state.currentProfile);
  // const { data, isLoading, isError } = trpc.useQuery([
  //   'example.hello',
  //   { text: 'from tRPC' },
  // ]);

  // const test = trpc.useQuery(['test.getAll']);

  // console.log(test.data);

  return (
    <div className='flex flex-col items-center ml-auto mr-auto w-full h-full    mt-1 overflow-hidden '>
      <Hero />
      <Events />
      <CreateEventModal />
    </div>
  );
};
