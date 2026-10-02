import { getUsersCredits } from '@/actions/global';
import { DAILY_CREDIT_LIMIT } from '@/lib/constants';

const Credits = async () => {
  const userWithCredits = await getUsersCredits();

  return (
    <div className='text-muted-foreground text-sm flex items-center gap-1'>
      {userWithCredits?.credits}/{DAILY_CREDIT_LIMIT}
      <span>Credits</span>
    </div>
  );
};

export default Credits;
