import { LensterPublication } from '@generated/lenstertypes';
import Collect from './Collect';

type Props = {
  publication: LensterPublication;
};

function Actions({ publication }: Props) {
  // console.log(stats);
  return (
    <div>
      <Collect publication={publication} />{' '}
    </div>
  );
}

export default Actions;
