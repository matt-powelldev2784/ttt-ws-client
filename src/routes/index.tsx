import { createFileRoute } from '@tanstack/react-router'
import Home from '@/components/Header'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="text-center">
      <Home />
    </div>
  )
}
