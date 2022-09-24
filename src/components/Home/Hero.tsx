import Link from 'next/link';
import Marquee from './Marquee';

type Props = {};

function Hero({}: Props) {
  return (
    <div className='h-2/6  '>
      {/* <Marquee /> */}

      <div className='flex flex-col items-center justify-center mx-4    my-12 md:mx-4 md:my-48'>
        <div className='font-bold   text-5xl md:text-7xl tracking-tighter  	'>
          <h1>
            welcome to{' '}
            <span className='shadow-[inset_0_-0.5em_0_0] shadow-burp-500'>
              specto
            </span>
          </h1>
        </div>

        <p className='font-light   text-2xl text-white  mt-12   md:mx-64 md:mt-12 uppercase'>
          Specto is a web3 hub for concerts. Share your favorite picture, find
          that ID you&apos;ve been looking for, show off your support, or relive
          the experience. Own and monetize your data with{' '}
          <span>
            <Link href='https://lens.xyz/'>
              <a className='shadow-[inset_0_-0.5em_0_0] shadow-[#00501f] hover:shadow-none '>
                🌿 Lens Protocol
              </a>
            </Link>
          </span>
          , a user-owned, open social graph.
        </p>
      </div>
    </div>
  );
}

export default Hero;
