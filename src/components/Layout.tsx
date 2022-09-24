import { ReactNode, useEffect, useState } from 'react';
import Head from 'next/head';

import dynamic from 'next/dynamic';
type Props = {
  children: ReactNode;
};

// const Navbar = dynamic(() => import('@components/Navbar'), { ssr: false });

function Layout({ children }: Props) {
  return (
    <>
      <Head>
        <title>specto</title>
      </Head>
      <div className=' bg-[#141414]  transition-all duration-700 ease-in-out  dark:text-white  antialiased min-h-screen '>
        {children}
      </div>
    </>
  );
}

export default Layout;
