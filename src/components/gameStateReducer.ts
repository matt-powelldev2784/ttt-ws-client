export type Cell = 'X' | 'O' | null
export type Board = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell]

type Status =
  | 'NOT_CONNECTED'
  | 'CONNECTED'
  | 'WAITING_FOR_OPPONENT'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CONNECTION_LOST'

type GameState = {
  status: Status
  board: Board
  playerSymbol: 'X' | 'O' | null
  gameId: string | null
  currentTurn?: 'X' | 'O'
  result: 'X' | 'O' | 'DRAW' | undefined
  error?: string | null
  gameMessage: string | null
}

export const initialGameState: GameState = {
  status: 'NOT_CONNECTED',
  board: [null, null, null, null, null, null, null, null, null],
  playerSymbol: null,
  gameId: null,
  currentTurn: undefined,
  result: undefined,
  error: undefined,
  gameMessage: null,
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
  result: 'X' | 'O' | 'DRAW'
  error: string | null | undefined
  gameMessage: string | null
}

export type GameAction = SetPlayerIdAction | UpdateGameAction

export const gameReducer = (
  state: GameState,
  action: GameAction,
): GameState => {
  switch (action.type) {
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
        error: action.error || null,
        gameMessage: action.gameMessage,
        result: action.result,
      }

    default:
      return state
  }
}
