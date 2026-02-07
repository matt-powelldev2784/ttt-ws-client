import { useEffect, useReducer, useRef } from 'react'
import logo from '../assets/ttt-logo.svg'
import { gameReducer, initialGameState } from './gameStateReducer'
import { handleSocketMessage } from './handleSocketMessage'

export const Game = () => {
  const socketRef = useRef<WebSocket | null>(null)
  const [gameState, setGameState] = useReducer(gameReducer, initialGameState)
  const serverUrl =
    import.meta.env.VITE_SERVER_URL_LOCAL ??
    import.meta.env.VITE_SERVER_URL_PROD

  console.table(gameState)

  // connect to server and set up message handler
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

  // send message to server
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

  // handle player move
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

  // to test connection loss states
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
      {gameState.gameMessage !== null && (
        <p className="absolute top-0 bg-white text-black font-bold mb-4 p-3 px-6">
          {gameState.gameMessage}
        </p>
      )}

      {gameState.status === 'NOT_CONNECTED' && (
        <>
          <img src={logo} alt="tic tac toe logo" className="w-40 h-40  " />
          <p className="text-white font-bold p-2 px-4 m-2"> Connecting...</p>
        </>
      )}

      {gameState.status === 'WAITING_FOR_OPPONENT' && (
        <img src={logo} alt="tic tac toe logo" className="w-40 h-40  " />
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

      {gameState.status === 'IN_PROGRESS' && (
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center mb-4 text-white font-bold">
            <p className="inline-flex items-center">
              Your symbol is :
              <span
                className={`text-xl ml-1 ${gameState.playerSymbol === 'O' ? 'text-[#1bbbbb]' : 'text-[#3990e5]'}`}
              >
                {gameState.playerSymbol}
              </span>
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {gameState.board.map((cell, index) => (
              <button
                key={index}
                type="button"
                className={`w-20 h-20 bg-gray-700 text-5xl font-bold rounded ${cell === 'O' ? 'text-[#1bbbbb]' : 'text-[#3990e5]'}`}
                onClick={() => addMoveToBoard(index)}
                disabled={Boolean(gameState.result)}
              >
                {cell}
              </button>
            ))}
            {gameState.result && <div className="absolute" />}
          </div>
        </div>
      )}

      {gameState.result && (
        <button
          type="button"
          className="bg-green-600 cursor-pointer p-2 px-4 rounded text-white text-bold mt-6"
          onClick={() => window.location.reload()}
        >
          Play Again
        </button>
      )}

      {gameState.error === 'CONNECTION_LOST' && !gameState.result && (
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

      <button
        className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded"
        onClick={disconnect}
      >
        Disconnect
      </button>
    </main>
  )
}
