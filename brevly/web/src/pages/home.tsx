import { DownloadSimpleIcon, LinkIcon } from '@phosphor-icons/react/dist/ssr'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import Logo from '../assets/svgs/Logo.svg'
import { LinkCard } from '../components/link-card'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Input } from '../components/ui/input'

export function Home() {
  const isEmpty = false

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
  }

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
                label="Link original"
                placeholder="www.exemplo.com.br"
                type="url"
                required
              />

              <Input
                label="Link encurtado"
                placeholder="brev.ly/"
                type="text"
              />

              <Button type="submit" className="mt-1 md:mt-2">
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
                disabled
              >
                Baixar CSV
              </Button>
            }
          >
            <div className="border-t-1 border-gray-200">
              <ScrollArea.Root type="scroll" className="overflow-hidden">
                <ScrollArea.Viewport className="max-h-[360px]">
                  {isEmpty ? (
                    <div className="flex flex-col gap-3 items-center my-6 md:my-8">
                      <LinkIcon size={32} className="text-gray-400" />
                      <span className="text-xs uppercase tracking-wide text-gray-500">
                        Ainda não existem links cadastrados
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <LinkCard
                        shortUrl="brev.ly/Portfolio-Dev"
                        originalUrl="devsite.portfolio.com.br/devname-123456"
                        accessCount={30}
                      />
                      <LinkCard
                        shortUrl="brev.ly/Linkedin-Profile"
                        originalUrl="linkedin.com/in/myprofile"
                        accessCount={15}
                      />
                      <LinkCard
                        shortUrl="brev.ly/Github-Project"
                        originalUrl="github.com/devname/project-name-v2"
                        accessCount={34}
                      />
                      <LinkCard
                        shortUrl="brev.ly/Figma-Encurtador-de-Links"
                        originalUrl="figma.com/design/file/Encurtador-de-Links"
                        accessCount={53}
                      />
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
