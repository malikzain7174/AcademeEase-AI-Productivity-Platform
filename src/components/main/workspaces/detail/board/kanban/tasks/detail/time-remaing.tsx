'use client';
import React, { useEffect, useState } from 'react';

interface Props {
  deadline: Date;
}

import { differenceInMinutes } from 'date-fns';

function formatRemainingTime(deadline: Date) {
  const now = new Date();
  const end = new Date(deadline);

  const totalMinutes = differenceInMinutes(end, now);
  if (totalMinutes <= 0) {
    return '0d 0h 0m';
  }

  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  return `${days}d ${hours}h ${minutes}m`;
}

const TimeRemaining = ({ deadline }: Props) => {
  const [remainingTime, setRemainingTime] = useState(
    formatRemainingTime(deadline)
  );

  useEffect(() => {
    const interval = setInterval(
      () => {
        setRemainingTime(formatRemainingTime(deadline));
      },
      1 * 60 * 1000
    );

    return () => clearInterval(interval);
  }, [deadline]);

  return <div className='text-muted-foreground'>{remainingTime}</div>;
};

export default TimeRemaining;
