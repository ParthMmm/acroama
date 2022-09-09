import LensLogin from './Login/LensLogin';
import GetStarted from './Onboard/GetStarted';
import { IS_MAINNET } from 'src/constants';
type Props = {};

function Auth({}: Props) {
  return (
    <div className='flex flex-row space-x-2'>
      <LensLogin />
      {!IS_MAINNET && <GetStarted />}
    </div>
  );
}

export default Auth;
