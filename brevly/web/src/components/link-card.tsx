import { TrashIcon } from '@phosphor-icons/react'
import { CopyIcon } from '@phosphor-icons/react/dist/ssr'
import type { HTMLAttributes } from 'react'
import { Link as NavigateLink } from 'react-router-dom'
import { toast } from 'sonner'
import { normalizeBaseDomain } from '../helpers/form'
import type { Link } from '../types/links'
import { IconButton } from './ui/icon-button'

type LinkCardProps = {
  link: Link
  className?: string
  onDelete: (link: Link) => Promise<void>
} & HTMLAttributes<HTMLDivElement>

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(' ')
}

export function LinkCard({
  link,
  className,
  onDelete,
  ...divProps
}: LinkCardProps) {
  const { slug: shortUrl, originalUrl, accessCount } = link
  const handleCopy = async () => {
    try {
      const appUrl = import.meta.env.VITE_FRONTEND_URL
      const fullUrl = `${appUrl}/${shortUrl}`

      await navigator.clipboard.writeText(fullUrl)
      toast.success('Link copiado!', { duration: 3000 })
    } catch {
      toast.error('Não foi possível copiar o link', { duration: 5000 })
    }
  }

  return (
    <div
      {...divProps}
      className={cn(
        'flex items-center justify-between border-b-[1px] border-gray-200 py-3 md:py-4',
        className
      )}
    >
      <div className="flex flex-col max-w-[140px] md:max-w-[360px]">
        <NavigateLink to={shortUrl}>
          <p className="truncate text-sm md:text-base text-blue-base font-semibold hover:underline">
            {`${normalizeBaseDomain(import.meta.env.VITE_FRONTEND_URL)}/${shortUrl}`}
          </p>
        </NavigateLink>
        <p className="truncate text-xs md:text-sm text-gray-500">
          {originalUrl}
        </p>
      </div>

      <div className="ml-2 flex shrink-0 items-center gap-3">
        <span className="whitespace-nowrap text-xs text-gray-500">
          {accessCount} {accessCount === 1 ? 'acesso' : 'acessos'}
        </span>

        <div className="flex items-center gap-2">
          <IconButton
            onClick={handleCopy}
            icon={<CopyIcon className="h-3 w-3 md:h-4 md:w-4" />}
          />
          <IconButton
            onClick={() => onDelete(link)}
            icon={<TrashIcon className="h-3 w-3 md:h-4 md:w-4" />}
          />
        </div>
      </div>
    </div>
  )
}
