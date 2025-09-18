import React from "react";

interface PlayerSectionProps {
  players: string[];
}

const PlayerSection: React.FC<PlayerSectionProps> = ({ players }) => {
  return (
    <div className="p-4 border rounded-md shadow-md">
      <h2 className="text-lg font-bold mb-2">Players</h2>
      <ul>
        {players.map((player, idx) => (
          <li key={idx} className="py-1">{player}</li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerSection;
