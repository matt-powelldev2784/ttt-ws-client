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

  if (message.type === 'GAME_STATE') {
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

  if (message.type === 'UPDATE_BOARD') {
    dispatch({
      type: 'UPDATE_BOARD',
      board: message.board,
      currentTurn: message.currentTurn,
      error: message.error || null,
      gameMessage: message.gameMessage || null,
    })
  }

  if (message.type === 'SET_RESULT') {
    dispatch({
      type: 'SET_RESULT',
      status: message.status,
      error: null,
      result: message.result,
      gameMessage: message.gameMessage,
    })
  }
}
