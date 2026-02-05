import { useEffect, useReducer, useRef } from 'react'
import logo from '../assets/ttt-logo.svg'
import type { Dispatch } from 'react'

export type Cell = 'X' | 'O' | null
export type Board = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell]

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
  gameId: string | null
  currentTurn?: 'X' | 'O'
  winner?: 'X' | 'O' | 'DRAW'
  error?: string | null | undefined
}

const initialGameState: GameState = {
  status: 'NOT_CONNECTED',
  board: [null, null, null, null, null, null, null, null, null],
  playerSymbol: null,
  gameId: null,
  currentTurn: undefined,
  winner: undefined,
  error: undefined,
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
  error: string | null | undefined
}

type GameMoveAction = {
  type: 'GAME_MOVE'
  board: Board
  currentTurn: 'X' | 'O'
  error: string | null | undefined
}

type GameAction =
  | StatusAction
  | SetPlayerIdAction
  | UpdateGameAction
  | GameMoveAction

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SET_STATUS':
      return { ...state, status: action.status }
    case 'SET_PLAYER_ID':
      return { ...state }
    case 'UPDATE_GAME_STATE':
      return {
        ...state,
        status: action.status,
        gameId: action.gameId,
        playerSymbol: action.playerSymbol,
        board: action.board,
        currentTurn: action.currentTurn,
        winner: action.winner,
        error: action.error || null,
      }
    case 'GAME_MOVE':
      return {
        ...state,
        board: action.board,
        currentTurn: action.currentTurn,
        error: action.error || null,
      }

    default:
      return state
  }
}

type HandleSocketMessageInput = {
  event: MessageEvent
  dispatch: Dispatch<GameAction>
}

const handleSocketMessage = ({ event, dispatch }: HandleSocketMessageInput) => {
  const message = JSON.parse(event.data)

  if (message.type === 'GAME_STATE') {
    dispatch({
      type: 'UPDATE_GAME_STATE',
      status: message.status,
      gameId: message.gameId,
      playerSymbol: message.playerSymbol,
      board: message.board,
      currentTurn: message.currentTurn,
      winner: message.winner,
      error: message.error,
    })
  }

  if (message.type === 'GAME_MOVE') {
    dispatch({
      type: 'GAME_MOVE',
      board: message.board,
      currentTurn: message.currentTurn,
      error: message.error || null,
    })
  }
}

export const Game = () => {
  const socketRef = useRef<WebSocket | null>(null)
  const [gameState, setGameState] = useReducer(gameReducer, initialGameState)
  const connectionLost = gameState.error === 'CONNECTION_LOST'
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
      handleSocketMessage({ event, dispatch: setGameState })
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

  const addMoveToBoard = (index: number) => {
    const move = JSON.stringify({
      type: 'MAKE_MOVE',
      payload: {
        gameId: gameState.gameId,
        index: index,
        symbol: gameState.playerSymbol,
      },
    })

    sendMessage(move)
  }

  const disconnect = () => {
    const socket = socketRef.current
    if (socket) {
      socket.close()
      socketRef.current = null
      window.location.reload()
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-800">
      {/* <button
        className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded"
        onClick={disconnect}
      >
        Disconnect
      </button> */}

      {gameState.status === 'NOT_CONNECTED' && (
        <>
          <img src={logo} alt="tic tac toe logo" className="w-40 h-40  " />
          <p className="text-white font-bold p-2 px-4 m-2"> Connecting...</p>
        </>
      )}

      {gameState.status === 'CONNECTED' && (
        <>
          <img src={logo} alt="tic tac toe logo" className="w-40 h-40  " />
          <button
            type="button"
            className="bg-green-600 cursor-pointer p-2 px-4 m-2 rounded text-white text-bold"
            onClick={() =>
              sendMessage(JSON.stringify({ type: 'START_GAME', payload: {} }))
            }
          >
            Start Game
          </button>
        </>
      )}

      {gameState.status === 'WAITING_FOR_OPPONENT' && (
        <>
          <img src={logo} alt="tic tac toe logo" className="w-40 h-40  " />
          <p className="text-white font-bold p-2 px-4 m-2">
            Waiting for opponent...
          </p>
        </>
      )}

      {gameState.status === 'IN_PROGRESS' && !connectionLost && (
        <div className="flex flex-col items-center">
          <img src={logo} alt="tic tac toe logo" className="w-10 h-10  " />

          <div className="flex flex-col items-center mb-4 text-white font-bold">
            <p className="inline-flex items-center">
              Your symbol is :
              <span
                className={`text-xl ml-1 ${gameState.playerSymbol === 'O' ? 'text-[#1bbbbb]' : 'text-[#3990e5]'}`}
              >
                {gameState.playerSymbol}
              </span>
            </p>

            {gameState.currentTurn === gameState.playerSymbol ? (
              <p className="absolute top-0 bg-red-500 text-white font-bold mb-4 p-3 px-6">
                Your turn!
              </p>
            ) : (
              <p className="absolute top-0 bg-red-100 text-black font-bold mb-4 p-3 px-6">
                Waiting for opponent's move...
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2">
            {gameState.board.map((cell, index) => (
              <button
                key={index}
                type="button"
                className={`w-20 h-20 bg-gray-700 text-5xl font-bold rounded ${cell === 'O' ? 'text-[#1bbbbb]' : 'text-[#3990e5]'}`}
                onClick={() => addMoveToBoard(index)}
              >
                {cell}
              </button>
            ))}
          </div>
        </div>
      )}

      {gameState.status === 'COMPLETED' && <div>COMPLETED</div>}

      {gameState.error === 'CONNECTION_LOST' && (
        <>
          <img src={logo} alt="tic tac toe logo" className="w-40 h-40  " />

          <p className="text-red-500 font-bold p-2 px-4 m-2">
            CONNECTION WITH OPPONENT LOST!
          </p>

          <button
            type="button"
            className="bg-red-600 cursor-pointer p-2 px-4 rounded text-white text-bold"
            onClick={() => disconnect()}
          >
            Restart Game
          </button>
        </>
      )}
    </main>
  )
}
