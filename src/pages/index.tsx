import type { NextPage } from 'next';
import Head from 'next/head';
import Header from '../components/Header';
import Landing from '../components/Landing';

type TechnologyCardProps = {
  name: string;
  description: string;
  documentation: string;
};

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>acroama</title>
        <meta name='description' content='music' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <div className='fixed bg-[#fcfcfc] dark:bg-[#2c2d2f] transition-all duration-700 ease-in-out  h-screen  w-screen text-white'>
          <Header />
          <Landing />
        </div>
      </main>
    </>
  );
};

export default Home;
