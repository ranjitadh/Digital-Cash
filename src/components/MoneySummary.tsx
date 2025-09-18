import React from "react";

interface MoneySummaryProps {
  playerMoney: Record<string, number>;
}

const MoneySummary: React.FC<MoneySummaryProps> = ({ playerMoney }) => {
  return (
    <div className="p-4 border rounded-md shadow-md my-4">
      <h2 className="text-lg font-bold mb-2">Money Summary</h2>
      <ul>
        {Object.entries(playerMoney).map(([player, money]) => (
          <li key={player}>
            {player}: ₹{money}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MoneySummary;
