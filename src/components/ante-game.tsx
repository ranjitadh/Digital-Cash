"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, Trophy, IndianRupee, Users, Clock, Target } from "lucide-react"
import type { GameSession } from "@/types/game"

interface AnteGameProps {
  gameSession: GameSession
  onEndGame: (winnerId?: string) => void
  onUpdateBalance: (playerId: string, amount: number, type: "add" | "subtract", description: string) => void
}

export function AnteGame({ gameSession, onEndGame, onUpdateBalance }: AnteGameProps) {
  const [selectedWinner, setSelectedWinner] = useState<string>("")
  const [gamePhase, setGamePhase] = useState<"playing" | "selecting-winner" | "finished">("playing")

  const handleSelectWinner = (playerId: string) => {
    setSelectedWinner(playerId)
  }

  const handleConfirmWinner = () => {
    if (selectedWinner) {
      onEndGame(selectedWinner)
      setGamePhase("finished")
    }
  }

  const handleEndWithoutWinner = () => {
    const amountPerPlayer = Math.floor(gameSession.pot / gameSession.players.length)
    gameSession.players.forEach((player) => {
      onUpdateBalance(player.id, amountPerPlayer, "add", "Pot distributed equally")
    })
    onEndGame()
    setGamePhase("finished")
  }

  const winner = gameSession.players.find((p) => p.id === selectedWinner)

  return (
    <div className="space-y-6">
      {/* Game Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Target className="h-6 w-6" />
                <h2 className="text-2xl font-bold">Ante Game in Progress</h2>
              </div>

              {/* Animated Pot */}
              <motion.div
                className="flex items-center justify-center gap-1 text-3xl font-bold"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 3 }}
              >
                <IndianRupee className="h-6 w-6" />
                {gameSession.pot.toLocaleString()}
              </motion.div>

              <p className="text-primary-foreground/80">Total Pot</p>
              <div className="flex items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {gameSession.players.length} Players
                </div>
                <div className="flex items-center gap-1">
                  <IndianRupee className="h-4 w-4" />
                  {gameSession.anteAmount} Ante
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {new Date(gameSession.createdAt).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Phase Transitions */}
      <AnimatePresence mode="wait">
        {gamePhase === "playing" && (
          <motion.div
            key="playing-phase"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Players */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Players in Game
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {gameSession.players.map((player, index) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="relative hover:shadow-md transition">
                        <CardContent className="pt-4">
                          <div className="text-center space-y-2">
                            <Badge variant="outline" className="text-xs">
                              Player {index + 1}
                            </Badge>
                            <h3 className="font-semibold text-lg">{player.name}</h3>
                            <div className="text-sm text-muted-foreground">
                              Contributed ₹{gameSession.anteAmount.toLocaleString()}
                            </div>
                            <div className="flex items-center justify-center gap-1 text-sm">
                              <IndianRupee className="h-3 w-3" />
                              <span>Balance: ₹{player.balance.toLocaleString()}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Controls */}
            <Card className="bg-secondary">
              <CardHeader>
                <CardTitle>Game Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.div whileTap={{ scale: 0.95 }} className="flex-1">
                    <Button
                      onClick={() => setGamePhase("selecting-winner")}
                      className="bg-accent hover:bg-accent/90 text-accent-foreground w-full"
                      size="lg"
                    >
                      <Trophy className="h-4 w-4 mr-2" />
                      Select Winner
                    </Button>
                  </motion.div>
                  <motion.div whileTap={{ scale: 0.95 }} className="flex-1">
                    <Button onClick={handleEndWithoutWinner} variant="outline" size="lg" className="w-full">
                      End Game (Split Pot)
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {gamePhase === "selecting-winner" && (
          <motion.div
            key="winner-phase"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-accent" />
                  Select the Winner
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {gameSession.players.map((player) => (
                    <motion.div
                      key={player.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleSelectWinner(player.id)}
                    >
                      <Card
                        className={`cursor-pointer transition-all ${
                          selectedWinner === player.id
                            ? "border-accent bg-accent/10 shadow-lg scale-105"
                            : "border-border hover:border-accent/50"
                        }`}
                      >
                        <CardContent className="pt-4">
                          <div className="text-center space-y-2">
                            {selectedWinner === player.id && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                <Crown className="h-6 w-6 text-accent mx-auto" />
                              </motion.div>
                            )}
                            <h3 className="font-semibold text-lg">{player.name}</h3>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    onClick={handleConfirmWinner}
                    disabled={!selectedWinner}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground flex-1"
                  >
                    Confirm Winner: {winner?.name}
                  </Button>
                  <Button onClick={() => setGamePhase("playing")} variant="outline" className="flex-1">
                    Back
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
