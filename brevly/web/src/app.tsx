import { CopyIcon } from '@phosphor-icons/react/dist/ssr'
import { Button } from './components/ui/button'
import { IconButton } from './components/ui/icon-button'
import { Input } from './components/ui/input'

export function App() {
  return (
    <main className="h-dvh flex items-center justify-center gap-5">
      <Button>Label</Button>
      <IconButton>
        <CopyIcon />
      </IconButton>
      <Button
        variant="secondary"
        leftIcon={<CopyIcon />}
        rightIcon={<CopyIcon />}
      >
        Label
      </Button>
      <div className="flex flex-col max-w-[300px] gap-4">
        <Input label="link original" placeholder="www.exemplo.com.br" />
        <Input label="Error" errorText="Error" />
      </div>
    </main>
  )
}
