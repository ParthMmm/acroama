import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
type Props = {
  content: string;
  children: React.ReactNode;
  open?: boolean;
  defaultOpen: boolean;
  onOpenChange?: (open: boolean) => void;
};

function CustomTooltip({
  children,
  content,
  open,
  defaultOpen,
  onOpenChange,
  ...props
}: Props) {
  return (
    <div className=''>
      <Tooltip.Provider delayDuration={700}>
        <Tooltip.Root
          open={open}
          defaultOpen={defaultOpen}
          onOpenChange={onOpenChange}
        >
          <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content className='py-1 px-2  bg-black text-gray-400 text-xs transition-all '>
              {content}
              <Tooltip.TooltipArrow />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>
  );
}

export default CustomTooltip;
