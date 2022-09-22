import Marquee from './Marquee';

type Props = {};

function Hero({}: Props) {
  return (
    <div className='h-2/6  '>
      <Marquee />

      <div className='flex flex-col items-center justify-center  my-12 mx-4 md:my-48'>
        <h1 className='font-normal text-7xl tracking-tighter	'>
          welcome to specto
        </h1>
        <p className='font-light text-lg text-gray-400'>
          a web3 platform to connect and share your favorite moments at a
          concert
        </p>
      </div>
    </div>
  );
}

export default Hero;
