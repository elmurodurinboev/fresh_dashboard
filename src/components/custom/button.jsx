import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { IconLoader2 } from '@tabler/icons-react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        danger: "text-red-500 hover:text-white bg-rose-200 hover:bg-red-500",
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
        xl: 'h-10 w-full rounded-md'
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, children, ...props }, ref) => {
    const { asChild, ...rest } = props;
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...rest}
        >
          {children}
        </Slot>
      );
    }

    const {
      loading = false,
      leftSection,
      rightSection,
      disabled,
      ...otherProps
    } = props;

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={loading || disabled}
        ref={ref}
        {...otherProps}
      >
        {((leftSection && loading) || (!leftSection && !rightSection && loading)) && (
          <IconLoader2 className='mr-2 h-4 w-4 animate-spin' />
        )}
        {!loading && leftSection && <div className='mr-2'>{leftSection}</div>}
        {children}
        {!loading && rightSection && <div className='ml-2'>{rightSection}</div>}
        {rightSection && loading && (
          <IconLoader2 className='ml-2 h-4 w-4 animate-spin' />
        )}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };