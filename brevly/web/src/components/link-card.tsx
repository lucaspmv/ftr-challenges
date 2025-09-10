import { TrashIcon } from '@phosphor-icons/react'
import { CopyIcon } from '@phosphor-icons/react/dist/ssr'
import type { HTMLAttributes } from 'react'
import { IconButton } from './ui/icon-button'

type LinkCardProps = {
  shortUrl: string
  originalUrl: string
  accessCount: number
  className?: string
  onCopy?: (shortUrl: string) => void
  onOpen?: (originalUrl: string) => void
  onDelete?: () => void
} & HTMLAttributes<HTMLDivElement>

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(' ')
}

export function LinkCard({
  shortUrl,
  originalUrl,
  accessCount,
  className,
  onCopy,
  onOpen,
  onDelete,
  ...divProps
}: LinkCardProps) {
  const handleCopy = () => {}

  return (
    <div
      {...divProps}
      className={cn(
        'flex items-center justify-between border-b-[1px] border-gray-200 py-3 md:py-4',
        className
      )}
    >
      <div className="flex flex-col max-w-[140px] md:max-w-[360px]">
        <a href={shortUrl}>
          <p className="truncate text-sm md:text-base text-blue-base font-semibold hover:underline">
            {shortUrl}
          </p>
        </a>
        <p className="truncate text-xs md:text-sm text-gray-500">
          {originalUrl}
        </p>
      </div>

      <div className="ml-2 flex shrink-0 items-center gap-3">
        <span className="whitespace-nowrap text-xs text-gray-500">
          {accessCount} acessos
        </span>

        <div className="flex items-center gap-2">
          <IconButton
            onClick={handleCopy}
            icon={<CopyIcon className="h-3 w-3 md:h-4 md:w-4" />}
          />
          <IconButton
            onClick={onDelete}
            icon={<TrashIcon className="h-3 w-3 md:h-4 md:w-4" />}
          />
        </div>
      </div>
    </div>
  )
}
