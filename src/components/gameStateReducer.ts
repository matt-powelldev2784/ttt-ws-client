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
  result?: 'X' | 'O' | 'DRAW'
  error?: string | null | undefined
}

export const initialGameState: GameState = {
  status: 'NOT_CONNECTED',
  board: [null, null, null, null, null, null, null, null, null],
  playerSymbol: null,
  gameId: null,
  currentTurn: undefined,
  result: undefined,
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
  result?: 'X' | 'O' | 'DRAW'
  error: string | null | undefined
}

type GameMoveAction = {
  type: 'UPDATE_BOARD'
  board: Board
  currentTurn: 'X' | 'O'
  error: string | null | undefined
  result?: 'X' | 'O' | 'DRAW' | null
}

type SetResultAction = {
  type: 'SET_RESULT'
  result: 'X' | 'O' | 'DRAW'
  error: null
}

export type GameAction =
  | StatusAction
  | SetPlayerIdAction
  | UpdateGameAction
  | GameMoveAction
  | SetResultAction

export const gameReducer = (
  state: GameState,
  action: GameAction,
): GameState => {
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
        error: action.error || null,
      }
    case 'UPDATE_BOARD':
      return {
        ...state,
        board: action.board,
        currentTurn: action.currentTurn,
        error: action.error || null,
      }
    case 'SET_RESULT':
      return {
        ...state,
        result: action.result,
        error: null,
      }

    default:
      return state
  }
}
