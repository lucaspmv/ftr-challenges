import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'

type CardProps = {
  title?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

const card = tv({
  base: 'rounded-lg bg-white p-6 md:p-8',
})

const cardHeader = tv({
  base: 'flex items-center justify-between mb-4 md:mb-6',
})

const cardTitle = tv({
  base: 'text-md md:text-lg font-bold text-gray-600',
})

export function Card({ title, action, children, className }: CardProps) {
  const hasHeader = !!(title || action)

  return (
    <section className={card({ className })}>
      {hasHeader && (
        <div className={cardHeader()}>
          {title && <h2 className={cardTitle()}>{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  )
}
