import { useEffect, useRef } from 'react'

export default function Home() {
  const socketRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (socketRef.current) {
      return
    }

    const socket = new WebSocket('ws://localhost:8081/ws')
    socketRef.current = socket

    return () => {
      socket.close()
      socketRef.current = null
    }
  }, [socketRef])

  const sendMessage = (message: string) => {
    const socket = socketRef.current
    if (!socket) {
      return
    }

    if (socket.readyState !== WebSocket.OPEN) {
      socket.addEventListener('open', () => socket.send(message), {
        once: true,
      })
      return
    }

    socket.send(message)
  }

  return (
    <div>
      <button
        type="button"
        className="bg-green-600 p-2 px-4 m-2 rounded text-white text-bold"
        onClick={() =>
          sendMessage(JSON.stringify({ type: 'START_GAME', payload: {} }))
        }
      >
        Start Game
      </button>
    </div>
  )
}
