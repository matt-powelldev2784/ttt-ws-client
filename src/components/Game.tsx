import { useEffect, useReducer, useRef } from 'react'

export type Cell = 'X' | 'O' | null
export type Line = [Cell, Cell, Cell]
export type Board = [Line, Line, Line]

type Status =
  | 'NOT_CONNECTED'
  | 'CONNECTED'
  | 'WAITING_FOR_OPPONENT'
  | 'IN_PROGRESS'
  | 'COMPLETED'

type GameState = {
  status: Status
  board: Board
  playerSymbol: 'X' | 'O' | null
  playerId: string | null
  opponentId: string | null
  gameId: string | null
  currentTurn?: 'X' | 'O'
  winner?: 'X' | 'O' | 'DRAW'
}

const initialGameState: GameState = {
  status: 'NOT_CONNECTED',
  board: [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ],
  playerSymbol: null,
  playerId: null,
  opponentId: null,
  gameId: null,
  currentTurn: undefined,
  winner: undefined,
}

type StatusAction = {
  type: 'SET_STATUS'
  status: Status
}

type SetPlayerIdAction = {
  type: 'SET_PLAYER_ID'
  playerId: string
}

type GameAction = StatusAction | SetPlayerIdAction

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SET_STATUS':
      return { ...state, status: action.status }
    case 'SET_PLAYER_ID':
      return { ...state, playerId: action.playerId }
    default:
      return state
  }
}

export const Game = () => {
  const socketRef = useRef<WebSocket | null>(null)
  const [gameState, setGameState] = useReducer(gameReducer, initialGameState)
  console.log('gameState', gameState)

  useEffect(() => {
    if (socketRef.current) {
      return
    }

    const socket = new WebSocket('ws://localhost:8081/ws')
    socketRef.current = socket
    setGameState({ type: 'SET_STATUS', status: 'CONNECTED' })

    const handleMessage = (event: MessageEvent) => {
      setGameState(event.data)
    }

    socket.addEventListener('message', handleMessage)

    return () => {
      socket.removeEventListener('message', handleMessage)
      socket.close()
      socketRef.current = null
    }
  }, [])

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
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-800">
      {gameState.status !== 'CONNECTED' && (
        <p className="bg-gray-600 p-2 px-4 m-2 rounded text-white text-bold w-40">
          Connecting...
        </p>
      )}

      {gameState.status === 'CONNECTED' && (
        <button
          type="button"
          className="bg-green-600 cursor-pointer p-2 px-4 m-2 rounded text-white text-bold"
          onClick={() =>
            sendMessage(JSON.stringify({ type: 'START_GAME', payload: {} }))
          }
        >
          Start Game
        </button>
      )}
    </main>
  )
}
