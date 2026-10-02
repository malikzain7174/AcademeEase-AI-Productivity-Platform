'use client';
import { suggestMissingSubtasks } from '@/actions/subtasks';
import Tooltip from '@/components/global/tooltip';
import { UPGRADE_SUBSCRIPTION_MODAL_ROUTE } from '@/components/global/upgrade-modal';
import { Button } from '@/components/ui/button';
import { WandSparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';
import { CREDITS_ON_SUBTASKS_AI_SUGGESTION } from '@/lib/constants';

type Props = {
  taskId: string;
};

const SuggestTasks = ({ taskId }: Props) => {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleSuggestAI = async () => {
    setLoading(true);
    await suggestMissingSubtasks(taskId)
      .then((result) => {
        toast.success('Subtasks generated', {
          description: `Successfully generated subtasks (${CREDITS_ON_SUBTASKS_AI_SUGGESTION} credits used)`,
          position: 'top-right',
          richColors: true,
        });
      })
      .catch((error) => {
        if (error.message.includes('Insufficient credits')) {
          toast.error('Insufficient credits', {
            description: `You need ${CREDITS_ON_SUBTASKS_AI_SUGGESTION} credits to use this feature`,
            position: 'top-right',
            richColors: true,
          });
          router.push(`?${UPGRADE_SUBSCRIPTION_MODAL_ROUTE}`);
        } else {
          toast.error('Failed to generate subtasks', {
            description: error.message,
            position: 'top-right',
            richColors: true,
          });
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <Tooltip
      content={`Suggest AI (${CREDITS_ON_SUBTASKS_AI_SUGGESTION} credits)`}
    >
      <Button
        loading={loading}
        variant='gradient'
        className='flex items-center gap-2 transition-all duration-200 hover:shadow-md'
        onClick={handleSuggestAI}
      >
        <WandSparkles className='h-4 w-4 transition-transform duration-300 group-hover:scale-110' />
        <span className='hidden sm:inline'>Suggest AI</span>
      </Button>
    </Tooltip>
  );
};

export default SuggestTasks;
