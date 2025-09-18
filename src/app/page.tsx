"use client";

import { useState } from "react";
import PlayerSection from "../components/PlayerSection";
import GameType from "../components/GameType";
import ChoosePlayers from "../components/ChoosePlayer";
import Ante from "../components/Ante";
import MoneySummary from "../components/MoneySummary";


export default function Home() {
  const [players, setPlayers] = useState<string[]>([]);
  const [gameType, setGameType] = useState<string>("");
  const [playerMoney, setPlayerMoney] = useState<Record<string, number>>({});

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Next Ante Game</h1>

      <ChoosePlayers setPlayers={setPlayers} />
      <PlayerSection players={players} />
      <GameType gameType={gameType} setGameType={setGameType} />

      <Ante players={players} playerMoney={playerMoney} setPlayerMoney={setPlayerMoney} />
      <MoneySummary playerMoney={playerMoney} />
    </div>
  );
}
