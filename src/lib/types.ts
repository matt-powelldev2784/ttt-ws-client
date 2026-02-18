export type Cell = 'X' | 'O' | null
export type Board = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell]

type Status =
  | 'NOT_CONNECTED'
  | 'CONNECTED'
  | 'WAITING_FOR_OPPONENT'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CONNECTION_LOST'

export type GameState = {
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


