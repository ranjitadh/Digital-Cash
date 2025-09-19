export interface Player {
  id: string
  name: string
  balance: number
  isActive: boolean
  totalWinnings: number
  totalLosses: number
}

export interface GameSession {
  id: string
  gameType: "ante" | "teen-patti"
  players: Player[]
  anteAmount: number
  pot: number
  isActive: boolean
  createdAt: Date
}

export interface Transaction {
  id: string
  playerId: string
  playerName: string
  type: "ante" | "win" | "loss" | "add" | "subtract"
  amount: number
  description: string
  timestamp: Date
}

export interface TeenPattiGameState {
  currentPlayer: number
  pot: number
  currentBet: number
  players: TeenPattiPlayer[]
  gamePhase: "betting" | "showdown" | "finished"
  winner?: string
}

export interface TeenPattiPlayer extends Player {
  hasCards: boolean
  isSeen: boolean
  hasFolded: boolean
  currentBet: number
  isAllIn: boolean
}
