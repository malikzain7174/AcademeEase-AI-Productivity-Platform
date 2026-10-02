'use client';
import React, { HTMLProps, useEffect, useState } from 'react';
import {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from './drawer';
import {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './dialog';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link, { LinkProps } from 'next/link';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';

interface ModalProps {
  children: React.ReactNode;
  routeName: string;
  dialogOnly?: boolean;
}
type CombinedModalProps = ModalProps &
  React.ComponentProps<typeof Dialog> &
  React.ComponentProps<typeof Drawer>;

export const Modal: React.FC<CombinedModalProps> = ({
  routeName,
  children,
  dialogOnly = false,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isOpen =
    searchParams.has(routeName) ||
    searchParams.toString().includes(routeName.split('=')[1]);

  /**
   * We use an effect to update the open state whenever the isOpen prop changes.
   * This ensures that the dialog is only opened after the initial render is complete.
   * By using an effect, we enable the ability to share the link to the dialog with others.
   */
  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  //whenever the open state changes, update the URL accordingly
  function onOpenChanged(open: boolean): void {
    if (!open) {
      router.replace(pathname, { scroll: false });
    } else {
      //this ensures that the DialogTrigger button works as expected
      router.replace(`${pathname}?${routeName}`, { scroll: false });
    }
  }
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop || dialogOnly) {
    return (
      <Dialog open={open} onOpenChange={onOpenChanged} {...props}>
        {children}
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChanged} {...props}>
      {children}
    </Drawer>
  );
};

interface ModalCloseProps {
  children: React.ReactNode;
}
type CombinedCloseProps = ModalCloseProps &
  React.ComponentProps<typeof DialogClose> &
  React.ComponentProps<typeof DrawerClose>;

export const ModalClose: React.FC<CombinedCloseProps> = ({
  children,
  className,
  ...props
}) => {
  const closeClasses = cn('modal-close', className);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <DialogClose className={closeClasses} {...props}>
        {children}
      </DialogClose>
    );
  }

  return (
    <DrawerClose className={closeClasses} {...props}>
      {children}
    </DrawerClose>
  );
};

interface ModalTriggerProps {
  children: React.ReactNode;
}

type CombinedTriggerProps = ModalTriggerProps &
  React.ComponentProps<typeof DialogTrigger> &
  React.ComponentProps<typeof DrawerTrigger>;

export const ModalTrigger: React.FC<CombinedTriggerProps> = ({
  children,
  className,
  ...props
}) => {
  const triggerClasses = cn('modal-trigger', className);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <DialogTrigger className={triggerClasses} {...props}>
        {children}
      </DialogTrigger>
    );
  }

  return (
    <DrawerTrigger className={triggerClasses} {...props}>
      {children}
    </DrawerTrigger>
  );
};

interface ModalHeaderProps {
  children: React.ReactNode;
}

type CombinedHeaderProps = ModalHeaderProps &
  React.ComponentProps<typeof DialogHeader> &
  React.ComponentProps<typeof DrawerHeader>;

export const ModalHeader: React.FC<CombinedHeaderProps> = ({
  children,
  className,
  ...props
}) => {
  const headerClasses = cn('modal-header', className);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <DialogHeader className={headerClasses} {...props}>
        {children}
      </DialogHeader>
    );
  }

  return (
    <DrawerHeader className={headerClasses} {...props}>
      {children}
    </DrawerHeader>
  );
};

interface ModalContentProps {
  children: React.ReactNode;
}

type CombinedContentProps = ModalContentProps &
  React.ComponentProps<typeof DialogContent> &
  React.ComponentProps<typeof DrawerContent>;

export const ModalContent: React.FC<CombinedContentProps> = ({
  children,
  className,
  ...props
}) => {
  const contentClasses = cn('modal-content', className);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <DialogContent
        {...props}
        className={contentClasses}
        aria-describedby='modal-content-description'
      >
        {children}
      </DialogContent>
    );
  }

  return (
    <DrawerContent {...props} className={contentClasses}>
      {children}
    </DrawerContent>
  );
};

interface ModalFooterProps {
  children: React.ReactNode;
}

type CombinedFooterProps = ModalFooterProps &
  React.ComponentProps<typeof DialogFooter> &
  React.ComponentProps<typeof DrawerFooter>;

export const ModalFooter: React.FC<CombinedFooterProps> = ({
  children,
  className,
  ...props
}) => {
  const footerClasses = cn('modal-footer', className);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <DialogFooter className={footerClasses} {...props}>
        {children}
      </DialogFooter>
    );
  }

  return (
    <DrawerFooter className={footerClasses} {...props}>
      {children}
    </DrawerFooter>
  );
};

interface ModalTitleProps {
  children: React.ReactNode;
}

type CombinedTitleProps = ModalTitleProps &
  React.ComponentProps<typeof DialogTitle> &
  React.ComponentProps<typeof DrawerTitle>;

export const ModalTitle: React.FC<CombinedTitleProps> = ({
  children,
  className,
  ...props
}) => {
  const titleClasses = cn('modal-title', className);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <DialogTitle className={titleClasses} {...props}>
        {children}
      </DialogTitle>
    );
  }

  return (
    <DrawerTitle className={titleClasses} {...props}>
      {children}
    </DrawerTitle>
  );
};

interface ModalDescriptionProps {
  children: React.ReactNode;
}

type CombinedDescriptionProps = ModalDescriptionProps &
  React.ComponentProps<typeof DialogDescription> &
  React.ComponentProps<typeof DrawerDescription>;

export const ModalDescription: React.FC<CombinedDescriptionProps> = ({
  children,
  className,
  ...props
}) => {
  const descriptionClasses = cn('modal-description', className);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <DialogDescription className={descriptionClasses} {...props}>
        {children}
      </DialogDescription>
    );
  }

  return (
    <DrawerDescription className={descriptionClasses} {...props}>
      {children}
    </DrawerDescription>
  );
};

type ModalLinkProps = React.PropsWithChildren<
  Omit<LinkProps, 'replace' | 'scroll'> & HTMLProps<HTMLAnchorElement>
>;

export const ModalLink: React.FC<ModalLinkProps> = ({
  children,
  ...rest
}: ModalLinkProps) => {
  return (
    <Link replace={true} scroll={false} {...rest}>
      {children}
    </Link>
  );
};
