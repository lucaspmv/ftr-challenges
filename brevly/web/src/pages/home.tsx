import { DownloadSimpleIcon, LinkIcon } from '@phosphor-icons/react/dist/ssr'
import Logo from '../assets/svgs/Logo.svg'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Input } from '../components/ui/input'

export function Home() {
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <div className="h-full py-8 md:py-[88px] px-3">
      <div className="mx-auto w-full max-w-[980px]">
        <header className="mb-6 md:mb-8 flex justify-center md:justify-start">
          <img src={Logo} alt="Brev.ly" className="h-6 md:h-8" />
        </header>

        <div className="flex flex-col md:flex-row gap-3 md:gap-5">
          <Card title="Novo link" className="w-full md:max-w-[380px]">
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
            className="w-full md:max-w-[580px] h-[234px]"
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
              <div className="flex flex-col gap-3 items-center mt-8">
                <LinkIcon size={32} className="text-gray-400" />
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Ainda não existem links cadastrados
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
