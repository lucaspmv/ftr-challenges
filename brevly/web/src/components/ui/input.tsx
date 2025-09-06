import { WarningIcon } from '@phosphor-icons/react/dist/ssr'
import { type ComponentProps, forwardRef } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const textField = tv({
  slots: {
    root: 'flex flex-col w-full gap-y-2 group',
    label:
      'text-xs font-medium group-focus-within:font-bold text-gray-500 group-focus-within:text-blue-base ',
    input:
      'w-full rounded-lg border-[1px] border-gray-300 ' +
      'bg-white text-gray-600 placeholder:text-gray-400 outline-none ' +
      'transition-colors focus:border-[1.5px] focus:border-blue-base ' +
      'disabled:cursor-not-allowed disabled:opacity-60',
    message: 'text-sm text-gray-500',
  },
  variants: {
    error: {
      true: {
        label: 'text-danger group-focus-within:text-danger',
        input: 'border-danger focus:border-danger border-[1.5px]',
      },
      false: {},
    },
    size: {
      sm: { input: 'h-10 px-2', message: 'text-xs' },
      md: { input: 'h-11 px-3 text-sm' },
      lg: { input: 'h-12 px-4 text-base' },
    },
  },
  defaultVariants: {
    error: false,
    size: 'lg',
  },
})

type NativeInput = Omit<ComponentProps<'input'>, 'size'>

export type InputStyleVariants = VariantProps<typeof textField>

export type InputProps = NativeInput &
  InputStyleVariants & {
    label?: string
    errorText?: string
  }

// TODO: Remove size and handle responsiveness here
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, errorText, className, id, size, ...rest },
  ref
) {
  const isError = error ?? Boolean(errorText)
  const {
    root,
    label: labelSlot,
    input,
    message,
  } = textField({ error: isError, size })

  return (
    <div className={root({ class: className })}>
      {label && <span className={labelSlot()}>{label?.toUpperCase()}</span>}
      <input ref={ref} id={id} className={input()} {...rest} />
      {isError && errorText && (
        <div className="inline-flex gap-2 items-center">
          <WarningIcon color="#B12C4D" />
          <span className={message()}>{errorText}</span>
        </div>
      )}
    </div>
  )
})
