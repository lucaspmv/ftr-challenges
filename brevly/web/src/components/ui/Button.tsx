import { type ComponentProps, forwardRef, type ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const buttonStyles = tv({
  slots: {
    base: 'relative inline-flex items-center justify-center gap-2 rounded-lg disabled:cursor-not-allowed',
    label: 'font-semibold transition-colors',
    spinner:
      'absolute inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent',
  },

  variants: {
    variant: {
      primary: {
        base: 'w-full max-w-[352px] text-white bg-blue-base hover:bg-blue-dark disabled:bg-blue-base/50',
      },
      secondary: {
        base: 'text-gray-500 bg-gray-200 border border-transparent hover:border-blue-base disabled:border-transparent disabled:opacity-50',
      },
    },
    size: {
      sm: { label: 'text-sm' },
      md: {},
      lg: {},
    },
    loading: {
      true: { label: 'opacity-0' },
      false: {},
    },
  },

  compoundVariants: [
    {
      variant: 'primary',
      size: 'sm',
      class: { base: 'h-9 px-3' },
    },
    { variant: 'primary', size: 'md', class: { base: 'h-10 px-4' } },
    { variant: 'primary', size: 'lg', class: { base: 'h-12 px-6' } },

    {
      variant: 'secondary',
      class: { base: 'h-8 px-2 rounded-sm', label: 'text-sm' },
    },
  ],

  defaultVariants: {
    variant: 'primary',
    size: 'lg',
    loading: false,
  },
})

export type ButtonStyleVariants = VariantProps<typeof buttonStyles>

export type ButtonProps = ComponentProps<'button'> &
  ButtonStyleVariants & {
    leftIcon?: ReactNode
    rightIcon?: ReactNode
  }

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant,
      size,
      loading,
      leftIcon,
      rightIcon,
      className,
      children,
      disabled,
      ...rest
    },
    ref
  ) {
    const { base, label, spinner } = buttonStyles({
      variant,
      size,
      loading,
    })

    return (
      <button
        ref={ref}
        className={base({ class: className })}
        disabled={disabled || loading}
        {...rest}
      >
        {leftIcon && !loading && leftIcon}
        <span className={label()}>{children}</span>
        {rightIcon && !loading && rightIcon}
        {loading && <span className={spinner()} />}
      </button>
    )
  }
)
