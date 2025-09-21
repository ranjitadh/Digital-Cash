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
import { motion } from "framer-motion"

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary-dark text-primary-foreground shadow-xl sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Gamepad2 className="h-6 w-6 sm:h-8 sm:w-8" />
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Ante Game System</h1>
            </div>
          </div>
          <p className="text-primary-foreground/80 mt-2 text-sm sm:text-base max-w-2xl">
            Professional card game management for Indian games
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {[
            {
              icon: Users,
              value: players.length,
              label: "Active Players",
              color: "text-primary",
            },
            {
              icon: IndianRupee,
              value: `₹${players.reduce((sum, p) => sum + p.balance, 0).toLocaleString()}`,
              label: "Total Balance",
              color: "text-primary",
            },
            {
              icon: TrendingUp,
              value: transactions.length,
              label: "Transactions",
              color: "text-accent",
            },
            {
              icon: Gamepad2,
              value: gameSession ? "Active" : "None",
              label: "Current Game",
              color: "text-primary",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    <div>
                      <div className="text-2xl sm:text-3xl font-bold">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="players" className="space-y-6">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full bg-white/50 dark:bg-gray-800/50 p-2 rounded-lg backdrop-blur-sm">
            {["players", "games", "teen-patti", "tracking"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="py-3 px-4 text-sm sm:text-base font-medium capitalize transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
              >
                {tab.replace("-", " ")}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="players" className="mt-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <PlayerManagement
                players={players}
                onAddPlayer={addPlayer}
                onRemovePlayer={removePlayer}
                onUpdateBalance={updatePlayerBalance}
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="games" className="mt-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
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
            </motion.div>
          </TabsContent>

          <TabsContent value="teen-patti" className="mt-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {teenPattiState && gameSession?.gameType === "teen-patti" ? (
                <TeenPattiGame
                  gameState={teenPattiState}
                  onUpdateGameState={setTeenPattiState}
                  onEndGame={endGame}
                  onUpdateBalance={updatePlayerBalance}
                />
              ) : (
                <Card className="bg-white dark:bg-gray-800 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl">Teen Patti Game</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm sm:text-base">
                      Start a Teen Patti game from the Games tab to play here.
                    </p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="tracking" className="mt-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <MoneyTracking transactions={transactions} players={players} />
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}