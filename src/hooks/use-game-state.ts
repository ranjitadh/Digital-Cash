"use client"

import { useState, useCallback } from "react"
import type { Player, GameSession, Transaction, TeenPattiGameState, TeenPattiPlayer } from "@/types/game"

export function useGameState() {
  const [players, setPlayers] = useState<Player[]>([])
  const [gameSession, setGameSession] = useState<GameSession | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [teenPattiState, setTeenPattiState] = useState<TeenPattiGameState | null>(null)

  const addPlayer = useCallback((name: string, initialBalance = 5000) => {
    const newPlayer: Player = {
      id: Date.now().toString(),
      name,
      balance: initialBalance,
      isActive: true,
      totalWinnings: 0,
      totalLosses: 0,
    }
    setPlayers((prev) => [...prev, newPlayer])
  }, [])

  const removePlayer = useCallback((playerId: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== playerId))
  }, [])

  const updatePlayerBalance = useCallback(
    (playerId: string, amount: number, type: "add" | "subtract", description: string) => {
      setPlayers((prev) =>
        prev.map((player) => {
          if (player.id === playerId) {
            const newBalance = type === "add" ? player.balance + amount : player.balance - amount
            const updatedPlayer = {
              ...player,
              balance: Math.max(0, newBalance),
              totalWinnings: type === "add" ? player.totalWinnings + amount : player.totalWinnings,
              totalLosses: type === "subtract" ? player.totalLosses + amount : player.totalLosses,
            }

            // Add transaction
            const transaction: Transaction = {
              id: Date.now().toString(),
              playerId,
              playerName: player.name,
              type,
              amount,
              description,
              timestamp: new Date(),
            }
            setTransactions((prev) => [transaction, ...prev])

            return updatedPlayer
          }
          return player
        }),
      )
    },
    [],
  )

  const startAnteGame = useCallback(
    (anteAmount: number, selectedPlayerIds: string[]) => {
      const activePlayers = players.filter((p) => selectedPlayerIds.includes(p.id))
      const totalPot = anteAmount * activePlayers.length

      // Deduct ante from each player
      activePlayers.forEach((player) => {
        updatePlayerBalance(player.id, anteAmount, "subtract", `Ante for game`)
      })

      const session: GameSession = {
        id: Date.now().toString(),
        gameType: "ante",
        players: activePlayers,
        anteAmount,
        pot: totalPot,
        isActive: true,
        createdAt: new Date(),
      }

      setGameSession(session)
    },
    [players, updatePlayerBalance],
  )

  const startTeenPattiGame = useCallback(
    (anteAmount: number, selectedPlayerIds: string[]) => {
      const activePlayers = players.filter((p) => selectedPlayerIds.includes(p.id))

      // Deduct ante from each player
      activePlayers.forEach((player) => {
        updatePlayerBalance(player.id, anteAmount, "subtract", `Teen Patti ante`)
      })

      const teenPattiPlayers: TeenPattiPlayer[] = activePlayers.map((player) => ({
        ...player,
        hasCards: true,
        isSeen: false,
        hasFolded: false,
        currentBet: anteAmount,
        isAllIn: false,
      }))

      const gameState: TeenPattiGameState = {
        currentPlayer: 0,
        pot: anteAmount * activePlayers.length,
        currentBet: anteAmount,
        players: teenPattiPlayers,
        gamePhase: "betting",
      }

      setTeenPattiState(gameState)

      const session: GameSession = {
        id: Date.now().toString(),
        gameType: "teen-patti",
        players: activePlayers,
        anteAmount,
        pot: gameState.pot,
        isActive: true,
        createdAt: new Date(),
      }

      setGameSession(session)
    },
    [players, updatePlayerBalance],
  )

  const endGame = useCallback(
    (winnerId?: string) => {
      if (gameSession && winnerId) {
        updatePlayerBalance(winnerId, gameSession.pot, "add", `Won ${gameSession.gameType} game`)
      }
      setGameSession(null)
      setTeenPattiState(null)
    },
    [gameSession, updatePlayerBalance],
  )

  return {
    players,
    gameSession,
    transactions,
    teenPattiState,
    addPlayer,
    removePlayer,
    updatePlayerBalance,
    startAnteGame,
    startTeenPattiGame,
    endGame,
    setTeenPattiState,
  }
}
