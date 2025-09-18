import React from "react";

interface GameTypeProps {
  gameType: string;
  setGameType: (type: string) => void;
}

const GameType: React.FC<GameTypeProps> = ({ gameType, setGameType }) => {
  return (
    <div className="p-4 border rounded-md shadow-md my-4">
      <h2 className="text-lg font-bold mb-2">Game Type</h2>
      <select
        value={gameType}
        onChange={(e) => setGameType(e.target.value)}
        className="border p-2 rounded w-full"
      >
        <option value="">Select Game Type</option>
        <option value="poker">Poker</option>
        <option value="blackjack">Blackjack</option>
        <option value="roulette">Roulette</option>
        <option value="teenpatti">Teen Patti</option>
      </select>
    </div>
  );
};

export default GameType;
