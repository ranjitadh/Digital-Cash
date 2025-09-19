"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, TrendingDown, IndianRupee, Clock, User, Activity, BarChart3 } from "lucide-react"
import type { Transaction, Player } from "@/types/game"

interface MoneyTrackingProps {
  transactions: Transaction[]
  players: Player[]
}

export function MoneyTracking({ transactions, players }: MoneyTrackingProps) {
  const stats = useMemo(() => {
    const totalTransactions = transactions.length
    const totalWinnings = transactions
      .filter((t) => t.type === "add" || t.type === "win")
      .reduce((sum, t) => sum + t.amount, 0)
    const totalLosses = transactions
      .filter((t) => t.type === "subtract" || t.type === "loss" || t.type === "ante")
      .reduce((sum, t) => sum + t.amount, 0)
    const netFlow = totalWinnings - totalLosses

    return {
      totalTransactions,
      totalWinnings,
      totalLosses,
      netFlow,
    }
  }, [transactions])

  const playerStats = useMemo(() => {
    return players
      .map((player) => {
        const playerTransactions = transactions.filter((t) => t.playerId === player.id)
        const winnings = playerTransactions
          .filter((t) => t.type === "add" || t.type === "win")
          .reduce((sum, t) => sum + t.amount, 0)
        const losses = playerTransactions
          .filter((t) => t.type === "subtract" || t.type === "loss" || t.type === "ante")
          .reduce((sum, t) => sum + t.amount, 0)

        return {
          ...player,
          winnings,
          losses,
          netGain: winnings - losses,
          transactionCount: playerTransactions.length,
        }
      })
      .sort((a, b) => b.netGain - a.netGain)
  }, [players, transactions])

  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "add":
      case "win":
        return <TrendingUp className="h-4 w-4 text-accent" />
      case "subtract":
      case "loss":
      case "ante":
        return <TrendingDown className="h-4 w-4 text-destructive" />
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getTransactionBadge = (type: Transaction["type"]) => {
    switch (type) {
      case "add":
        return (
          <Badge variant="outline" className="text-accent border-accent">
            Add
          </Badge>
        )
      case "win":
        return <Badge className="bg-accent text-accent-foreground">Win</Badge>
      case "subtract":
        return (
          <Badge variant="outline" className="text-destructive border-destructive">
            Subtract
          </Badge>
        )
      case "loss":
        return <Badge variant="destructive">Loss</Badge>
      case "ante":
        return <Badge variant="secondary">Ante</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Money Tracking Dashboard</h2>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">{stats.totalTransactions}</div>
                <div className="text-sm text-muted-foreground">Total Transactions</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              <div>
                <div className="text-2xl font-bold text-accent">₹{stats.totalWinnings.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Winnings</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-destructive" />
              <div>
                <div className="text-2xl font-bold text-destructive">₹{stats.totalLosses.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Losses</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-primary" />
              <div>
                <div className={`text-2xl font-bold ${stats.netFlow >= 0 ? "text-accent" : "text-destructive"}`}>
                  ₹{Math.abs(stats.netFlow).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Net {stats.netFlow >= 0 ? "Gain" : "Loss"}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Player Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Player Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {playerStats.map((player, index) => (
              <Card key={player.id} className={index === 0 ? "border-accent" : ""}>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">{player.name}</h3>
                      {index === 0 && <Badge className="bg-accent text-accent-foreground">Top Player</Badge>}
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Current Balance:</span>
                        <span className="font-semibold flex items-center gap-1">
                          <IndianRupee className="h-3 w-3" />
                          {player.balance.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Winnings:</span>
                        <span className="text-accent font-semibold">₹{player.winnings.toLocaleString()}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Losses:</span>
                        <span className="text-destructive font-semibold">₹{player.losses.toLocaleString()}</span>
                      </div>

                      <div className="flex justify-between border-t pt-2">
                        <span className="text-muted-foreground">Net Gain/Loss:</span>
                        <span className={`font-bold ${player.netGain >= 0 ? "text-accent" : "text-destructive"}`}>
                          {player.netGain >= 0 ? "+" : ""}₹{player.netGain.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Transactions:</span>
                        <span className="font-semibold">{player.transactionCount}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {players.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No players added yet. Add players to see their performance statistics.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.slice(0, 20).map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(transaction.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell className="font-medium">{transaction.playerName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTransactionIcon(transaction.type)}
                          {getTransactionBadge(transaction.type)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className={`flex items-center gap-1 font-semibold ${
                            transaction.type === "add" || transaction.type === "win"
                              ? "text-accent"
                              : "text-destructive"
                          }`}
                        >
                          <IndianRupee className="h-3 w-3" />
                          {transaction.amount.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{transaction.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No transactions yet. Start playing games to see transaction history.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      {transactions.length > 0 && (
        <Card className="bg-secondary">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Session Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-2xl font-bold text-primary">{transactions.length}</div>
                  <div className="text-muted-foreground">Total Transactions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">
                    ₹{players.reduce((sum, p) => sum + p.balance, 0).toLocaleString()}
                  </div>
                  <div className="text-muted-foreground">Money in Play</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{players.length}</div>
                  <div className="text-muted-foreground">Active Players</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
