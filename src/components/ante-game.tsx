"use client"

import { useState } from "react"
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
    // Distribute pot equally among players
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
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Target className="h-6 w-6" />
              <h2 className="text-2xl font-bold">Ante Game in Progress</h2>
            </div>
            <div className="flex items-center justify-center gap-1 text-3xl font-bold">
              <IndianRupee className="h-6 w-6" />
              {gameSession.pot.toLocaleString()}
            </div>
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

      {/* Game Phase: Playing */}
      {gamePhase === "playing" && (
        <>
          {/* Players in Game */}
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
                  <Card key={player.id} className="relative">
                    <CardContent className="pt-4">
                      <div className="text-center space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            Player {index + 1}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-lg">{player.name}</h3>
                        <div className="text-sm text-muted-foreground">
                          Contributed ₹{gameSession.anteAmount.toLocaleString()}
                        </div>
                        <div className="flex items-center justify-center gap-1 text-sm">
                          <IndianRupee className="h-3 w-3" />
                          <span>Current Balance: ₹{player.balance.toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Game Controls */}
          <Card className="bg-secondary">
            <CardHeader>
              <CardTitle>Game Controls</CardTitle>
              <p className="text-sm text-muted-foreground">Play your ante game and select the winner when ready</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => setGamePhase("selecting-winner")}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground flex-1"
                  size="lg"
                >
                  <Trophy className="h-4 w-4 mr-2" />
                  Select Winner
                </Button>
                <Button onClick={handleEndWithoutWinner} variant="outline" className="flex-1 bg-transparent" size="lg">
                  End Game (Split Pot)
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Select a winner to award the full pot, or end the game to split the pot equally
              </p>
            </CardContent>
          </Card>
        </>
      )}

      {/* Game Phase: Selecting Winner */}
      {gamePhase === "selecting-winner" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-accent" />
              Select the Winner
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Choose the player who wins the pot of ₹{gameSession.pot.toLocaleString()}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gameSession.players.map((player) => (
                <Card
                  key={player.id}
                  className={`cursor-pointer transition-all ${
                    selectedWinner === player.id
                      ? "border-accent bg-accent/10 shadow-lg"
                      : "border-border hover:border-accent/50"
                  }`}
                  onClick={() => handleSelectWinner(player.id)}
                >
                  <CardContent className="pt-4">
                    <div className="text-center space-y-2">
                      {selectedWinner === player.id && <Crown className="h-6 w-6 text-accent mx-auto" />}
                      <h3 className="font-semibold text-lg">{player.name}</h3>
                      <div className="text-sm text-muted-foreground">
                        Will receive ₹{gameSession.pot.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        New balance: ₹{(player.balance + gameSession.pot).toLocaleString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                onClick={handleConfirmWinner}
                disabled={!selectedWinner}
                className="bg-accent hover:bg-accent/90 text-accent-foreground flex-1"
                size="lg"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Confirm Winner: {winner?.name}
              </Button>
              <Button onClick={() => setGamePhase("playing")} variant="outline" className="flex-1">
                Back to Game
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Game Rules */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">Ante Game Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Basic Rules:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Each player contributes the ante amount</li>
                <li>• All ante money goes into the pot</li>
                <li>• Winner takes the entire pot</li>
                <li>• Game can be split if no clear winner</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Game Info:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Players: {gameSession.players.length}</li>
                <li>• Ante: ₹{gameSession.anteAmount.toLocaleString()}</li>
                <li>• Total Pot: ₹{gameSession.pot.toLocaleString()}</li>
                <li>• Started: {new Date(gameSession.createdAt).toLocaleString()}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
