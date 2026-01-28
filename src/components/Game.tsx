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

type UpdateGameAction = {
  type: 'UPDATE_GAME_STATE'
  status: Status
  gameId: string
  playerSymbol: 'X' | 'O'
  board: Board
  currentTurn: 'X' | 'O'
  winner?: 'X' | 'O' | 'DRAW'
}

type GameAction = StatusAction | SetPlayerIdAction | UpdateGameAction

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SET_STATUS':
      return { ...state, status: action.status }
    case 'SET_PLAYER_ID':
      return { ...state, playerId: action.playerId }
    case 'UPDATE_GAME_STATE':
      return {
        ...state,
        status: action.status,
        gameId: action.gameId,
        playerSymbol: action.playerSymbol,
        board: action.board,
        currentTurn: action.currentTurn,
        winner: action.winner,
      }

    default:
      return state
  }
}

export const Game = () => {
  const socketRef = useRef<WebSocket | null>(null)
  const [gameState, setGameState] = useReducer(gameReducer, initialGameState)
  const serverUrl =
    import.meta.env.VITE_SERVER_URL_LOCAL ??
    import.meta.env.VITE_SERVER_URL_PROD

  console.table(gameState)

  useEffect(() => {
    if (socketRef.current) {
      return
    }

    const socket = new WebSocket(serverUrl)
    socketRef.current = socket

    const handleMessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data)
      if (message.type === 'GAME_STATE') {
        setGameState({
          type: 'UPDATE_GAME_STATE',
          status: message.status,
          gameId: message.gameId,
          playerSymbol: message.playerSymbol,
          board: message.board,
          currentTurn: message.currentTurn,
          winner: message.winner,
        })
      }
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
      {gameState.status === 'NOT_CONNECTED' && (
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

      {gameState.status === 'WAITING_FOR_OPPONENT' && (
        <div>WAITING_FOR_OPPONENT</div>
      )}

      {gameState.status === 'IN_PROGRESS' && <div>IN_PROGRESS</div>}

      {gameState.status === 'COMPLETED' && <div>COMPLETED</div>}
    </main>
  )
}
