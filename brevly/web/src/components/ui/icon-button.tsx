import { type ComponentProps, forwardRef, type ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const iconButtonStyles = tv({
  slots: {
    base:
      'inline-flex items-center justify-center rounded-sm border border-transparent ' +
      'bg-gray-200 text-gray-600 hover:border-blue-base disabled:opacity-50 disabled:cursor-not-allowed',
  },
  variants: {
    size: {
      sm: { base: 'h-6 w-6' },
      md: { base: 'h-7 w-7' },
      lg: { base: 'h-8 w-8' },
    },
  },
  defaultVariants: {
    size: 'lg',
  },
})

export type IconButtonStyleVariants = VariantProps<typeof iconButtonStyles>

export type IconButtonProps = ComponentProps<'button'> &
  IconButtonStyleVariants & {
    icon?: ReactNode
  }

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ size, icon, className, children, ...rest }, ref) {
    const { base } = iconButtonStyles({ size })

    return (
      <button ref={ref} className={base({ class: className })} {...rest}>
        {icon ?? children}
      </button>
    )
  }
)
