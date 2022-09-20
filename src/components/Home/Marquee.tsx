import React from 'react';

type Props = {};

function Marquee({}: Props) {
  return (
    <div className='relative flex overflow-x-hidden'>
      <div className='py-12 animate-marquee whitespace-nowrap uppercase'>
        <span className='mx-4 text-xl'>Flume</span>
        <span className='mx-4 text-xl'>Skeler</span>
        <span className='mx-4 text-xl'>Odesza</span>
        <span className='mx-4 text-xl'>Lane 8</span>
        <span className='mx-4 text-xl'>Porter Robinson</span>
        <span className='mx-4 text-xl'>Zhu</span>
        <span className='mx-4 text-xl'>Charlotte De Witte</span>
        <span className='mx-4 text-xl'>Deadcrow</span>
        <span className='mx-4 text-xl'>Kaskade</span>
        <span className='mx-4 text-xl'>RL Grime</span>
        <span className='mx-4 text-xl'>Juelz</span>
        <span className='mx-4 text-xl'>Devault</span>
        <span className='mx-4 text-xl'>IsoXo</span>
      </div>

      <div className='absolute top-0 py-12 animate-marquee2 whitespace-nowrap uppercase'>
        <span className='mx-4 text-xl'>Flume</span>
        <span className='mx-4 text-xl'>Skeler</span>
        <span className='mx-4 text-xl'>Odesza</span>
        <span className='mx-4 text-xl'>Lane 8</span>
        <span className='mx-4 text-xl'>Porter Robinson</span>
        <span className='mx-4 text-xl'>Zhu</span>
        <span className='mx-4 text-xl'>Charlotte De Witte</span>
        <span className='mx-4 text-xl'>Deadcrow</span>
        <span className='mx-4 text-xl'>Kaskade</span>
        <span className='mx-4 text-xl'>RL Grime</span>
        <span className='mx-4 text-xl'>Juelz</span>
        <span className='mx-4 text-xl'>Devault</span>
        <span className='mx-4 text-xl'>IsoXo</span>
      </div>
    </div>
  );
}

export default Marquee;
