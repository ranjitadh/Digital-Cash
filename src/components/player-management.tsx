"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Minus, IndianRupee, Users } from "lucide-react"
import type { Player } from "@/types/game"

interface PlayerManagementProps {
  players: Player[]
  onAddPlayer: (name: string, balance: number) => void
  onRemovePlayer: (playerId: string) => void
  onUpdateBalance: (playerId: string, amount: number, type: "add" | "subtract", description: string) => void
}

export function PlayerManagement({ players, onAddPlayer, onRemovePlayer, onUpdateBalance }: PlayerManagementProps) {
  const [newPlayerName, setNewPlayerName] = useState("")
  const [newPlayerBalance, setNewPlayerBalance] = useState(5000)
  const [adjustmentAmounts, setAdjustmentAmounts] = useState<Record<string, number>>({})

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      onAddPlayer(newPlayerName.trim(), newPlayerBalance)
      setNewPlayerName("")
      setNewPlayerBalance(5000)
    }
  }

  const handleBalanceAdjustment = (playerId: string, type: "add" | "subtract") => {
    const amount = adjustmentAmounts[playerId] || 0
    if (amount > 0) {
      onUpdateBalance(playerId, amount, type, `Manual ${type === "add" ? "addition" : "deduction"}`)
      setAdjustmentAmounts((prev) => ({ ...prev, [playerId]: 0 }))
    }
  }

  const totalBalance = players.reduce((sum, player) => sum + player.balance, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Users className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Player Management</h2>
        <Badge variant="secondary" className="ml-auto">
          {players.length} Players
        </Badge>
      </div>

      {/* Add New Player */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg text-primary">Add New Player</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="playerName">Player Name</Label>
              <Input
                id="playerName"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="Enter player name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="initialBalance">Initial Balance (₹)</Label>
              <Input
                id="initialBalance"
                type="number"
                value={newPlayerBalance}
                onChange={(e) => setNewPlayerBalance(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddPlayer} className="w-full bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Player
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Players List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {players.map((player) => (
          <Card key={player.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{player.name}</CardTitle>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onRemovePlayer(player.id)}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-2xl font-bold text-primary">
                  <IndianRupee className="h-5 w-5" />
                  {player.balance.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">Current Balance</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-accent">₹{player.totalWinnings.toLocaleString()}</div>
                  <div className="text-muted-foreground">Total Won</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-destructive">₹{player.totalLosses.toLocaleString()}</div>
                  <div className="text-muted-foreground">Total Lost</div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Adjust Balance</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={adjustmentAmounts[player.id] || ""}
                    onChange={(e) =>
                      setAdjustmentAmounts((prev) => ({
                        ...prev,
                        [player.id]: Number(e.target.value),
                      }))
                    }
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBalanceAdjustment(player.id, "add")}
                    className="text-accent border-accent hover:bg-accent hover:text-accent-foreground"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBalanceAdjustment(player.id, "subtract")}
                    className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      {players.length > 0 && (
        <Card className="bg-secondary">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-3xl font-bold text-primary">
                <IndianRupee className="h-6 w-6" />
                {totalBalance.toLocaleString()}
              </div>
              <p className="text-muted-foreground">Total Money in Play</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
