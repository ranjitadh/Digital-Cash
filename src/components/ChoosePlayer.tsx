import React, { useState } from "react";

interface ChoosePlayersProps {
  setPlayers: (players: string[]) => void;
}

const ChoosePlayers: React.FC<ChoosePlayersProps> = ({ setPlayers }) => {
  const [input, setInput] = useState("");
  const [localPlayers, setLocalPlayers] = useState<string[]>([]);

  const addPlayer = () => {
    if (input.trim()) {
      const newPlayers = [...localPlayers, input.trim()];
      setLocalPlayers(newPlayers);
      setPlayers(newPlayers);
      setInput("");
    }
  };

  return (
    <div className="p-4 border rounded-md shadow-md my-4">
      <h2 className="text-lg font-bold mb-2">Add Players</h2>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter player name"
        className="border p-2 rounded mr-2"
      />
      <button onClick={addPlayer} className="bg-blue-500 text-white px-4 py-2 rounded">
        Add
      </button>
      <ul className="mt-2">
        {localPlayers.map((p, idx) => (
          <li key={idx}>{p}</li>
        ))}
      </ul>
    </div>
  );
};

export default ChoosePlayers;
