"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Gamepad2, Users, IndianRupee, Play, Settings } from "lucide-react"
import type { Player } from "@/types/game"

interface GameSelectionProps {
  players: Player[]
  onStartAnteGame: (anteAmount: number, selectedPlayerIds: string[]) => void
  onStartTeenPattiGame: (anteAmount: number, selectedPlayerIds: string[]) => void
  isGameActive: boolean
}

export function GameSelection({ players, onStartAnteGame, onStartTeenPattiGame, isGameActive }: GameSelectionProps) {
  const [selectedGameType, setSelectedGameType] = useState<"ante" | "teen-patti">("ante")
  const [anteAmount, setAnteAmount] = useState(100)
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([])

  const gameTypes = [
    {
      id: "ante" as const,
      name: "Ante Game",
      description: "Classic ante-based card game with pot distribution",
      icon: Gamepad2,
      minPlayers: 2,
      maxPlayers: 8,
    },
    {
      id: "teen-patti" as const,
      name: "Teen Patti",
      description: "Traditional Indian 3-card poker with blind/seen betting",
      icon: Users,
      minPlayers: 3,
      maxPlayers: 6,
    },
  ]

  const selectedGame = gameTypes.find((game) => game.id === selectedGameType)
  const eligiblePlayers = players.filter((player) => player.balance >= anteAmount)
  const canStartGame =
    selectedPlayerIds.length >= (selectedGame?.minPlayers || 2) &&
    selectedPlayerIds.length <= (selectedGame?.maxPlayers || 8) &&
    selectedPlayerIds.every((id) => eligiblePlayers.find((p) => p.id === id)) &&
    anteAmount > 0 &&
    !isGameActive

  const handlePlayerToggle = (playerId: string) => {
    setSelectedPlayerIds((prev) =>
      prev.includes(playerId) ? prev.filter((id) => id !== playerId) : [...prev, playerId],
    )
  }

  const handleStartGame = () => {
    if (canStartGame) {
      if (selectedGameType === "ante") {
        onStartAnteGame(anteAmount, selectedPlayerIds)
      } else {
        onStartTeenPattiGame(anteAmount, selectedPlayerIds)
      }
      setSelectedPlayerIds([])
    }
  }

  const totalPot = anteAmount * selectedPlayerIds.length

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Game Setup</h2>
        {isGameActive && (
          <Badge variant="destructive" className="ml-auto">
            Game in Progress
          </Badge>
        )}
      </div>

      {/* Game Type Selection */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg text-primary">Select Game Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gameTypes.map((game) => {
              const Icon = game.icon
              return (
                <Card
                  key={game.id}
                  className={`cursor-pointer transition-all ${
                    selectedGameType === game.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedGameType(game.id)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <Icon
                        className={`h-6 w-6 mt-1 ${
                          selectedGameType === game.id ? "text-primary" : "text-muted-foreground"
                        }`}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{game.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{game.description}</p>
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span>Min: {game.minPlayers} players</span>
                          <span>Max: {game.maxPlayers} players</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Ante Amount */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Set Ante Amount</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="anteAmount">Ante Amount per Player (₹)</Label>
              <Input
                id="anteAmount"
                type="number"
                value={anteAmount}
                onChange={(e) => setAnteAmount(Number(e.target.value))}
                min="1"
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <div className="w-full">
                <Label>Quick Amounts</Label>
                <div className="flex gap-2 mt-1">
                  {[50, 100, 200, 500].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => setAnteAmount(amount)}
                      className="text-xs"
                    >
                      ₹{amount}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Player Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Select Players</CardTitle>
          <p className="text-sm text-muted-foreground">
            Choose {selectedGame?.minPlayers}-{selectedGame?.maxPlayers} players for {selectedGame?.name}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {players.map((player) => {
              const isEligible = player.balance >= anteAmount
              const isSelected = selectedPlayerIds.includes(player.id)

              return (
                <Card
                  key={player.id}
                  className={`cursor-pointer transition-all ${!isEligible ? "opacity-50" : ""} ${
                    isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => isEligible && handlePlayerToggle(player.id)}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-3">
                      <Checkbox checked={isSelected} disabled={!isEligible} onChange={() => {}} />
                      <div className="flex-1">
                        <div className="font-semibold">{player.name}</div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <IndianRupee className="h-3 w-3" />
                          {player.balance.toLocaleString()}
                        </div>
                        {!isEligible && (
                          <Badge variant="destructive" className="text-xs mt-1">
                            Insufficient Balance
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {players.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No players added yet. Add players in the Players tab to start a game.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Game Summary & Start */}
      {selectedPlayerIds.length > 0 && (
        <Card className="bg-secondary">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Game Summary</h3>
                <p className="text-muted-foreground">
                  {selectedGame?.name} with {selectedPlayerIds.length} players
                </p>
              </div>

              <div className="flex items-center justify-center gap-1 text-2xl font-bold text-primary">
                <IndianRupee className="h-5 w-5" />
                {totalPot.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">Total Pot</p>

              <div className="flex flex-wrap gap-2 justify-center">
                {selectedPlayerIds.map((playerId) => {
                  const player = players.find((p) => p.id === playerId)
                  return player ? (
                    <Badge key={playerId} variant="outline">
                      {player.name}
                    </Badge>
                  ) : null
                })}
              </div>

              <Button
                onClick={handleStartGame}
                disabled={!canStartGame}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-2"
                size="lg"
              >
                <Play className="h-4 w-4 mr-2" />
                Start {selectedGame?.name}
              </Button>

              {!canStartGame && selectedPlayerIds.length > 0 && (
                <p className="text-sm text-destructive">
                  {selectedPlayerIds.length < (selectedGame?.minPlayers || 2)
                    ? `Need at least ${selectedGame?.minPlayers} players`
                    : selectedPlayerIds.length > (selectedGame?.maxPlayers || 8)
                      ? `Maximum ${selectedGame?.maxPlayers} players allowed`
                      : isGameActive
                        ? "A game is already in progress"
                        : "Check player eligibility and ante amount"}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
