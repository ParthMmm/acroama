import React from 'react';

type Props = {};

function Hero({}: Props) {
  return (
    <div className='flex h-2/6 my-48 justify-center items-center'>
      <div className='flex flex-col items-center justify-center'>
        <h1 className='font-black text-7xl '>welcome to specto</h1>
        <span className='font-medium text-lg text-gray-400'>
          a web3 platform to connect and share your favorite moments at a show
        </span>
      </div>
    </div>
  );
}

export default Hero;
