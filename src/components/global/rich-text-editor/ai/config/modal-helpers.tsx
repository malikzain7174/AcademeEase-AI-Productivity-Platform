import { ModalLink } from '@/components/ui/modal';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import React from 'react';

export const createAIModalRoute = (featureSuffix: string) =>
  `?${featureSuffix}`;

export type AIModalLinkProps = {
  title: string;
  routeSuffix: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export const AIModalLink = ({
  title,
  routeSuffix,
  children,
  className,
  onClick,
}: AIModalLinkProps) => {
  // Handle the click event before opening the modal
  const handleClick = React.useCallback(
    (e: React.MouseEvent) => {
      try {
        if (onClick) {
          onClick();
        }
      } catch (error) {
        console.error('Error in AIModalLink onClick handler:', error);
      }
    },
    [onClick]
  );

  return (
    <ModalLink
      href={createAIModalRoute(routeSuffix)}
      onClick={handleClick}
      className={className}
    >
      {children}
    </ModalLink>
  );
};
