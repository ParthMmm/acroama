import { LensterPublication } from '@generated/lenstertypes';
import Collect from './Collect';
import Mirror from './Mirror';

type Props = {
  publication: LensterPublication;
};

function Actions({ publication }: Props) {
  // console.log(stats);
  return (
    <div className='flex flex-row gap-6'>
      <Collect publication={publication} /> <Mirror publication={publication} />
    </div>
  );
}

export default Actions;
