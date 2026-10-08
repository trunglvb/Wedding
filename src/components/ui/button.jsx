import * as React from 'react';
import { Slot } from 'radix-ui';
import { cva } from 'class-variance-authority';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
const buttonVariants=cva('ui-button',{variants:{variant:{default:'button-default',ghost:'button-ghost',outline:'button-outline'},size:{default:'button-normal',icon:'button-icon'}},defaultVariants:{variant:'default',size:'default'}});
export const Button=React.forwardRef(({className,variant,size,asChild=false,...props},ref)=>{const Comp=asChild?Slot.Root:'button';return <Comp ref={ref} className={twMerge(clsx(buttonVariants({variant,size}),className))} {...props}/>});Button.displayName='Button';
