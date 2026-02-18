import type { Dispatch } from 'react'
import type { GameAction } from './gameStateReducer'

type HandleSocketMessageInput = {
  event: MessageEvent
  dispatch: Dispatch<GameAction>
}

export const handleSocketMessage = ({
  event,
  dispatch,
}: HandleSocketMessageInput) => {
  const message = JSON.parse(event.data)

  dispatch({
    type: 'UPDATE_GAME_STATE',
    status: message.status,
    gameId: message.gameId,
    playerSymbol: message.playerSymbol,
    board: message.board,
    currentTurn: message.currentTurn,
    error: message.error,
    gameMessage: message.gameMessage,
  })
}
