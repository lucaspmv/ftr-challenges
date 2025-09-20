import { DownloadSimpleIcon, LinkIcon } from '@phosphor-icons/react/dist/ssr'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import Logo from '../assets/svgs/Logo.svg'
import { LinkCard } from '../components/link-card'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { normalizeSlug, normalizeUrl } from '../helpers/form'
import { createLink } from '../http/links/create-link'
import { deleteLink } from '../http/links/delete-link'
import { exportLinksCsv } from '../http/links/export-links'
import { getLinks } from '../http/links/get-links'
import type { Link } from '../types/links'

type LinkState = Map<string, Link>

export function Home() {
  const [links, setLinks] = useState<LinkState>(new Map<string, Link>())
  const [error, setError] = useState<'both' | 'originalUrl' | 'slug'>()
  const [loading, setLoading] = useState<
    'create-link' | 'delete-link' | 'get-links' | 'export-links' | 'idle'
  >('get-links')

  const isEmpty = useMemo(() => links.size === 0, [links.size])

  const orderedLinks = useMemo(() => {
    return Array.from(links.entries()).sort(
      (a, b) =>
        new Date(b[1].createdAt).getTime() - new Date(a[1].createdAt).getTime()
    )
  }, [links])

  const clearFieldError = (field: 'originalUrl' | 'slug') =>
    setError(prev => (prev === 'both' || prev === field ? undefined : prev))

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setLoading('create-link')

    try {
      const form = e.currentTarget
      const fd = new FormData(form)
      const originalUrlRaw = String(fd.get('originalUrl') || '')
      const slugRaw = String(fd.get('slug') || '')

      if (!originalUrlRaw.trim() && !slugRaw.trim()) {
        setError('both')
        return
      }
      if (!originalUrlRaw.trim()) {
        setError('originalUrl')
        return
      }
      if (!slugRaw.trim()) {
        setError('slug')
        return
      }

      const originalUrl = normalizeUrl(originalUrlRaw)
      if (!originalUrl) {
        setError('originalUrl')
        return
      }

      const slug = normalizeSlug(slugRaw)
      if (!slug) {
        setError('slug')
        return
      }

      const response = await createLink({
        originalUrl,
        slug,
      })

      setLinks(prev => {
        const next = new Map(prev)
        next.set(response.id, {
          id: response.id,
          slug: response.slug,
          originalUrl: response.originalUrl,
          accessCount: response.accessCount,
          createdAt: response.createdAt,
        })
        return next
      })

      setError(undefined)
      form.reset()

      toast.success('Link criado com sucesso!', { duration: 3000 })
      // biome-ignore lint/suspicious/noExplicitAny: error type
    } catch (err: any) {
      if (err.status === 409) {
        toast.error('Este item já existe. Verifique e tente novamente.', {
          duration: 5000,
        })
      } else {
        toast.error(
          'Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.',
          { duration: 5000 }
        )
      }
    } finally {
      setLoading('idle')
    }
  }

  const handleDelete = async (link: Link) => {
    const label = link.slug

    const ok = window.confirm(
      `Tem certeza que deseja excluir ${label}? Esta ação não pode ser desfeita.`
    )
    if (!ok) return

    setLoading('delete-link')

    try {
      await deleteLink(link.slug)

      setLinks(prev => {
        const next = new Map(prev)
        next.delete(link.id)
        return next
      })
      toast.success('Link deletado com sucesso!', { duration: 3000 })
    } catch {
      toast.error(
        'Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.',
        { duration: 5000 }
      )
    } finally {
      setLoading('idle')
    }
  }

  const init = async () => {
    try {
      const response = await getLinks()

      if (response.data) {
        setLinks(new Map(response.data.map(l => [l.id, l])))
      }
    } catch {
      toast.error(
        'Não foi possível carregar os links no momento. Tente novamente em instantes.',
        { duration: 5000 }
      )
    } finally {
      setLoading('idle')
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: init
  useEffect(() => {
    init()
  }, [])

  return (
    <main className="min-h-dvh py-8 md:py-[88px] px-3">
      <div className="mx-auto w-full max-w-[980px]">
        <header className="mb-6 md:mb-8 flex justify-center md:justify-start">
          <img src={Logo} alt="Brev.ly" className="h-6 md:h-8" />
        </header>

        <div className="flex flex-col md:flex-row gap-3 md:gap-5">
          <Card title="Novo link" className="w-full md:max-w-[380px] h-fit">
            <form onSubmit={handleCreate} className="space-y-4">
              <Input
                name="originalUrl"
                label="Link original"
                placeholder="https://www.exemplo.com.br"
                {...(error === 'both' || error === 'originalUrl'
                  ? {
                      error: true,
                      errorText: 'Informe uma url válida',
                    }
                  : {})}
                onInput={() => clearFieldError('originalUrl')}
              />

              <Input
                name="slug"
                label="Link encurtado"
                placeholder="brev.ly/"
                type="text"
                {...(error === 'both' || error === 'slug'
                  ? {
                      error: true,
                      errorText:
                        'Informe uma url minúscula e sem espaço/caracter especial',
                    }
                  : {})}
                onInput={() => clearFieldError('slug')}
              />

              <Button
                type="submit"
                className="mt-1 md:mt-2"
                loading={loading === 'create-link' || loading === 'delete-link'}
              >
                Salvar link
              </Button>
            </form>
          </Card>

          <Card
            title="Meus links"
            className="w-full md:max-w-[580px] h-fit"
            action={
              <Button
                leftIcon={<DownloadSimpleIcon />}
                variant="secondary"
                loading={loading === 'export-links'}
                disabled={links.size === 0}
                onClick={async () => {
                  try {
                    setLoading('export-links')
                    const { reportUrl } = await exportLinksCsv()
                    window.open(reportUrl, '_blank')
                  } catch {
                    toast.error('Não foi possível exportar agora.')
                  } finally {
                    setLoading('idle')
                  }
                }}
              >
                Baixar CSV
              </Button>
            }
          >
            <div className="border-t-1 border-gray-200">
              <ScrollArea.Root type="scroll" className="overflow-hidden">
                <ScrollArea.Viewport className="max-h-[360px]">
                  {loading === 'get-links' ? (
                    <div className="flex justify-center items-center my-6 md:my-8">
                      <div className="h-6 w-6 border-2 border-gray-300 border-t-blue-base rounded-full animate-spin"></div>
                      <span className="ml-3 text-sm text-gray-500">
                        Carregando links...
                      </span>
                    </div>
                  ) : isEmpty ? (
                    <div className="flex flex-col items-center my-6 md:my-8 gap-3">
                      <LinkIcon size={32} className="text-gray-400" />
                      <span className="text-xs uppercase tracking-wide text-gray-500">
                        Ainda não existem links cadastrados
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      {orderedLinks.map(([linkId, link]) => (
                        <LinkCard
                          key={linkId}
                          link={link}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  )}
                </ScrollArea.Viewport>

                <ScrollArea.Scrollbar
                  orientation="vertical"
                  className="z-10 flex select-none touch-none p-0.5 data-[orientation=vertical]:w-2"
                >
                  <ScrollArea.Thumb className="relative flex-1 rounded-full bg-gray-300" />
                </ScrollArea.Scrollbar>
              </ScrollArea.Root>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
