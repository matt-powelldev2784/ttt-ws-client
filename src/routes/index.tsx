import { createFileRoute } from '@tanstack/react-router'
import { Game } from '@/components/Game'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="text-center">
      <Game />
    </div>
  )
}
