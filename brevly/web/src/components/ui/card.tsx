import type { ReactNode } from 'react'

type CardProps = {
  title?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function Card({ title, action, children, className }: CardProps) {
  return (
    <section className={`rounded-lg bg-white p-6 md:p-8 ${className ?? ''}`}>
      {(title || action) && (
        <div className="mb-4 md:mb-6 flex items-center justify-between">
          {title && (
            <h2 className="text-md md:text-lg font-bold text-gray-600">
              {title}
            </h2>
          )}
          {action}
        </div>
      )}
      {children}
    </section>
  )
}
