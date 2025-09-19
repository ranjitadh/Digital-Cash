"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Crown, IndianRupee, Users, Target, Play, Bold as Fold, Plus } from "lucide-react"
import type { TeenPattiGameState, TeenPattiPlayer } from "@/types/game"

interface TeenPattiGameProps {
  gameState: TeenPattiGameState
  onUpdateGameState: (newState: TeenPattiGameState) => void
  onEndGame: (winnerId?: string) => void
  onUpdateBalance: (playerId: string, amount: number, type: "add" | "subtract", description: string) => void
}

export function TeenPattiGame({ gameState, onUpdateGameState, onEndGame, onUpdateBalance }: TeenPattiGameProps) {
  const [raiseAmount, setRaiseAmount] = useState(gameState.currentBet)
  const [showWinnerSelection, setShowWinnerSelection] = useState(false)

  const currentPlayer = gameState.players[gameState.currentPlayer]
  const activePlayers = gameState.players.filter((p) => !p.hasFolded)
  const minBet = gameState.currentBet
  const maxBet = Math.min(...activePlayers.map((p) => p.balance))

  const handleSee = () => {
    const updatedPlayers = [...gameState.players]
    updatedPlayers[gameState.currentPlayer] = {
      ...currentPlayer,
      isSeen: true,
    }

    const newState: TeenPattiGameState = {
      ...gameState,
      players: updatedPlayers,
    }

    onUpdateGameState(newState)
  }

  const handleCall = () => {
    const callAmount = gameState.currentBet - currentPlayer.currentBet

    if (currentPlayer.balance >= callAmount) {
      onUpdateBalance(currentPlayer.id, callAmount, "subtract", "Teen Patti call")

      const updatedPlayers = [...gameState.players]
      updatedPlayers[gameState.currentPlayer] = {
        ...currentPlayer,
        currentBet: gameState.currentBet,
        balance: currentPlayer.balance - callAmount,
      }

      const newState: TeenPattiGameState = {
        ...gameState,
        players: updatedPlayers,
        pot: gameState.pot + callAmount,
        currentPlayer: getNextPlayer(gameState.currentPlayer, updatedPlayers),
      }

      onUpdateGameState(newState)
    }
  }

  const handleRaise = () => {
    const totalBet = raiseAmount
    const additionalAmount = totalBet - currentPlayer.currentBet

    if (currentPlayer.balance >= additionalAmount && totalBet > gameState.currentBet) {
      onUpdateBalance(currentPlayer.id, additionalAmount, "subtract", "Teen Patti raise")

      const updatedPlayers = [...gameState.players]
      updatedPlayers[gameState.currentPlayer] = {
        ...currentPlayer,
        currentBet: totalBet,
        balance: currentPlayer.balance - additionalAmount,
      }

      const newState: TeenPattiGameState = {
        ...gameState,
        players: updatedPlayers,
        pot: gameState.pot + additionalAmount,
        currentBet: totalBet,
        currentPlayer: getNextPlayer(gameState.currentPlayer, updatedPlayers),
      }

      onUpdateGameState(newState)
      setRaiseAmount(totalBet)
    }
  }

  const handleFold = () => {
    const updatedPlayers = [...gameState.players]
    updatedPlayers[gameState.currentPlayer] = {
      ...currentPlayer,
      hasFolded: true,
    }

    const remainingPlayers = updatedPlayers.filter((p) => !p.hasFolded)

    if (remainingPlayers.length === 1) {
      // Only one player left, they win
      const winner = remainingPlayers[0]
      onUpdateBalance(winner.id, gameState.pot, "add", "Won Teen Patti game")
      onEndGame(winner.id)
      return
    }

    const newState: TeenPattiGameState = {
      ...gameState,
      players: updatedPlayers,
      currentPlayer: getNextPlayer(gameState.currentPlayer, updatedPlayers),
    }

    onUpdateGameState(newState)
  }

  const handleShow = () => {
    setShowWinnerSelection(true)
  }

  const handleSelectWinner = (winnerId: string) => {
    onUpdateBalance(winnerId, gameState.pot, "add", "Won Teen Patti showdown")
    onEndGame(winnerId)
  }

  const getNextPlayer = (currentIndex: number, players: TeenPattiPlayer[]): number => {
    let nextIndex = (currentIndex + 1) % players.length
    while (players[nextIndex].hasFolded && players.filter((p) => !p.hasFolded).length > 1) {
      nextIndex = (nextIndex + 1) % players.length
    }
    return nextIndex
  }

  const canCall =
    currentPlayer.currentBet < gameState.currentBet &&
    currentPlayer.balance >= gameState.currentBet - currentPlayer.currentBet
  const canRaise = raiseAmount > gameState.currentBet && currentPlayer.balance >= raiseAmount - currentPlayer.currentBet
  const canShow = activePlayers.length === 2 && currentPlayer.isSeen

  if (showWinnerSelection) {
    return (
      <div className="space-y-6">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <Crown className="h-8 w-8 mx-auto" />
              <h2 className="text-2xl font-bold">Select Winner</h2>
              <div className="flex items-center justify-center gap-1 text-3xl font-bold">
                <IndianRupee className="h-6 w-6" />
                {gameState.pot.toLocaleString()}
              </div>
              <p className="text-primary-foreground/80">Winner takes all</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activePlayers.map((player) => (
            <Card
              key={player.id}
              className="cursor-pointer hover:border-accent transition-all"
              onClick={() => handleSelectWinner(player.id)}
            >
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold">{player.name}</h3>
                  <Badge variant={player.isSeen ? "default" : "secondary"}>{player.isSeen ? "Seen" : "Blind"}</Badge>
                  <div className="text-sm text-muted-foreground">
                    Current bet: ₹{player.currentBet.toLocaleString()}
                  </div>
                  <Button className="w-full bg-accent hover:bg-accent/90">Select as Winner</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Game Header */}
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Target className="h-6 w-6" />
              <h2 className="text-2xl font-bold">Teen Patti Game</h2>
            </div>
            <div className="flex items-center justify-center gap-1 text-3xl font-bold">
              <IndianRupee className="h-6 w-6" />
              {gameState.pot.toLocaleString()}
            </div>
            <p className="text-primary-foreground/80">Current Pot</p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <div>Current Bet: ₹{gameState.currentBet}</div>
              <div>Active Players: {activePlayers.length}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Player */}
      <Card className="border-2 border-accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-accent" />
            Current Turn: {currentPlayer.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="font-semibold">Status</div>
              <Badge variant={currentPlayer.isSeen ? "default" : "secondary"}>
                {currentPlayer.isSeen ? "Seen" : "Blind"}
              </Badge>
            </div>
            <div>
              <div className="font-semibold">Balance</div>
              <div className="flex items-center gap-1">
                <IndianRupee className="h-3 w-3" />
                {currentPlayer.balance.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="font-semibold">Current Bet</div>
              <div className="flex items-center gap-1">
                <IndianRupee className="h-3 w-3" />
                {currentPlayer.currentBet.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="font-semibold">To Call</div>
              <div className="flex items-center gap-1">
                <IndianRupee className="h-3 w-3" />
                {Math.max(0, gameState.currentBet - currentPlayer.currentBet).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Player Actions */}
          <div className="space-y-4">
            {!currentPlayer.isSeen && (
              <Button
                onClick={handleSee}
                variant="outline"
                className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
              >
                <Eye className="h-4 w-4 mr-2" />
                See Cards
              </Button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={handleCall}
                disabled={!canCall}
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
              >
                Call ₹{Math.max(0, gameState.currentBet - currentPlayer.currentBet)}
              </Button>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={raiseAmount}
                    onChange={(e) => setRaiseAmount(Number(e.target.value))}
                    min={gameState.currentBet + 1}
                    max={maxBet}
                    className="flex-1"
                  />
                  <Button onClick={handleRaise} disabled={!canRaise} className="bg-accent hover:bg-accent/90">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button onClick={handleRaise} disabled={!canRaise} className="w-full bg-accent hover:bg-accent/90">
                  Raise to ₹{raiseAmount}
                </Button>
              </div>

              <Button onClick={handleFold} variant="destructive">
                <Fold className="h-4 w-4 mr-2" />
                Fold
              </Button>
            </div>

            {canShow && (
              <Button onClick={handleShow} className="w-full bg-primary hover:bg-primary/90" size="lg">
                <Crown className="h-4 w-4 mr-2" />
                Show Cards
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* All Players */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            All Players
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gameState.players.map((player, index) => (
              <Card
                key={player.id}
                className={`${player.hasFolded ? "opacity-50" : ""} ${
                  index === gameState.currentPlayer ? "border-accent" : ""
                }`}
              >
                <CardContent className="pt-4">
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      {index === gameState.currentPlayer && <Play className="h-4 w-4 text-accent" />}
                      <h3 className="font-semibold">{player.name}</h3>
                    </div>

                    <div className="flex justify-center gap-2">
                      <Badge variant={player.isSeen ? "default" : "secondary"}>
                        {player.isSeen ? (
                          <>
                            <Eye className="h-3 w-3 mr-1" />
                            Seen
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3 mr-1" />
                            Blind
                          </>
                        )}
                      </Badge>
                      {player.hasFolded && <Badge variant="destructive">Folded</Badge>}
                    </div>

                    <div className="text-sm space-y-1">
                      <div className="flex items-center justify-center gap-1">
                        <IndianRupee className="h-3 w-3" />
                        <span>Balance: {player.balance.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <IndianRupee className="h-3 w-3" />
                        <span>Bet: {player.currentBet.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Game Rules */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">Teen Patti Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Betting Rules:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Blind players bet 1x the current bet</li>
                <li>• Seen players bet 2x the current bet</li>
                <li>• You can see your cards anytime</li>
                <li>• Show only available with 2 players left</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Actions:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Call: Match the current bet</li>
                <li>• Raise: Increase the bet amount</li>
                <li>• Fold: Give up your cards</li>
                <li>• Show: Compare cards (2 players only)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
