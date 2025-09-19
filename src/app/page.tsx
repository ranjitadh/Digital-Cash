"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlayerManagement } from "@/components/player-management"
import { GameSelection } from "@/components/game-selection"
import { AnteGame } from "@/components/ante-game"
import { TeenPattiGame } from "@/components/teen-patti-game"
import { MoneyTracking } from "@/components/money-tracking"
import { useGameState } from "@/hooks/use-game-state"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Gamepad2, Users, TrendingUp, IndianRupee } from "lucide-react"

export default function HomePage() {
  const {
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
  } = useGameState()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Gamepad2 className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Ante Game System</h1>
          </div>
          <p className="text-primary-foreground/80 mt-2">Professional card game management for Indian games</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{players.length}</div>
                  <div className="text-sm text-muted-foreground">Active Players</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <IndianRupee className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-2xl font-bold">
                    ₹{players.reduce((sum, p) => sum + p.balance, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Balance</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                <div>
                  <div className="text-2xl font-bold">{transactions.length}</div>
                  <div className="text-sm text-muted-foreground">Transactions</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Gamepad2 className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{gameSession ? "Active" : "None"}</div>
                  <div className="text-sm text-muted-foreground">Current Game</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="players" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="players">Players</TabsTrigger>
            <TabsTrigger value="games">Games</TabsTrigger>
            <TabsTrigger value="teen-patti">Teen Patti</TabsTrigger>
            <TabsTrigger value="tracking">Money Tracking</TabsTrigger>
          </TabsList>

          <TabsContent value="players">
            <PlayerManagement
              players={players}
              onAddPlayer={addPlayer}
              onRemovePlayer={removePlayer}
              onUpdateBalance={updatePlayerBalance}
            />
          </TabsContent>

          <TabsContent value="games">
            {gameSession && gameSession.gameType === "ante" ? (
              <AnteGame gameSession={gameSession} onEndGame={endGame} onUpdateBalance={updatePlayerBalance} />
            ) : (
              <GameSelection
                players={players}
                onStartAnteGame={startAnteGame}
                onStartTeenPattiGame={startTeenPattiGame}
                isGameActive={!!gameSession}
              />
            )}
          </TabsContent>

          <TabsContent value="teen-patti">
            {teenPattiState && gameSession?.gameType === "teen-patti" ? (
              <TeenPattiGame
                gameState={teenPattiState}
                onUpdateGameState={setTeenPattiState}
                onEndGame={endGame}
                onUpdateBalance={updatePlayerBalance}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Teen Patti Game</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Start a Teen Patti game from the Games tab to play here.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="tracking">
            <MoneyTracking transactions={transactions} players={players} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
