import { CopyIcon } from '@phosphor-icons/react/dist/ssr'
import { Button } from './components/ui/button'
import { IconButton } from './components/ui/icon-button'

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
    </main>
  )
}
