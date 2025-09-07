import { type ComponentProps, forwardRef, type ReactNode } from 'react'
import { tv } from 'tailwind-variants'

const iconButtonStyles = tv({
  slots: {
    base:
      'inline-flex items-center justify-center rounded-sm border border-transparent ' +
      'bg-gray-200 text-gray-600 hover:border-blue-base disabled:opacity-50 disabled:cursor-not-allowed ' +
      'h-6 w-6 md:h-8 md:w-8',
  },
})

export type IconButtonProps = ComponentProps<'button'> & {
  icon?: ReactNode
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ icon, className, children, ...rest }, ref) {
    const { base } = iconButtonStyles()

    return (
      <button ref={ref} className={base({ class: className })} {...rest}>
        {icon ?? children}
      </button>
    )
  }
)
