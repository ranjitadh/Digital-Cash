import React, { useState } from "react";

interface AnteProps {
  players: string[];
  playerMoney: Record<string, number>;
  setPlayerMoney: (money: Record<string, number>) => void;
}

const Ante: React.FC<AnteProps> = ({ players, playerMoney, setPlayerMoney }) => {
  const [ante, setAnte] = useState<number>(0);

  const handleSubtractAnte = () => {
    const updatedMoney: Record<string, number> = {};
    players.forEach((p) => {
      updatedMoney[p] = (playerMoney[p] || 1000) - ante; // default 1000 if not set
    });
    setPlayerMoney(updatedMoney);
  };

  return (
    <div className="p-4 border rounded-md shadow-md my-4">
      <h2 className="text-lg font-bold mb-2">Ante</h2>
      <input
        type="number"
        value={ante}
        onChange={(e) => setAnte(Number(e.target.value))}
        className="border p-2 rounded mr-2"
      />
      <button onClick={handleSubtractAnte} className="bg-red-500 text-white px-4 py-2 rounded">
        Subtract Ante
      </button>
    </div>
  );
};

export default Ante;
