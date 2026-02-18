import type { Dispatch, SetStateAction } from 'react'
import type { GameState } from './types'

type HandleSocketMessageInput = {
  event: MessageEvent
  setGameState: Dispatch<SetStateAction<GameState>>
}

export const handleSocketMessage = ({
  event,
  setGameState,
}: HandleSocketMessageInput) => {
  const message = JSON.parse(event.data)

  setGameState({
    status: message.status,
    gameId: message.gameId,
    playerSymbol: message.playerSymbol,
    board: message.board,
    currentTurn: message.currentTurn,
    error: message.error ?? null,
    gameMessage: message.gameMessage,
    result: message.result,
  })
}
