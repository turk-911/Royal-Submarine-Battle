import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const HowToPlay = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const items = [
    {
      title: "Game Setup",
      content: "Each player has a 10x10 grid to place their submarines. Players take turns in placing their submarines. There are three types of submarines for each player: Ballistic Missile Submarine (length: 5 and count: 1), Cruise Missile Submarine (length: 3 and count: 2), Midget Submarine (length: 2 and count: 2). Players need to choose orientation inorder to place the desired submarine onto his sea. After placing all the submarines, players go ahead into the warzone."
    },
    {
      title: "Game Play",
      content: "Players take turn to attack bombs into each other's sea. If a bomb hits the submarine in other's sea, it is marked with fire and if it does not, it is marked with water. If a player hits a submarine they are given another turn. When a submarine is fully destroyed, it can be seen burning in the sea as it comes to the surface."
    },
    {
      title: "Winning the Game",
      content: "The first player to destroy all opponent submarines wins the game."
    }
  ];

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4">
      <div className="border rounded-lg divide-y">
        {items.map((item, index) => (
          <div key={index} className="bg-blue-200">
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-4 py-4 flex justify-between items-center text-left hover:bg-gray-50 focus:outline-none"
              aria-expanded={openIndex === index}
            >
              <span className="font-medium text-gray-900">{item.title}</span>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`px-4 overflow-hidden transition-all duration-200 ${
                openIndex === index ? 'max-h-40 py-4' : 'max-h-0'
              }`}
            >
              <p className="text-gray-600">{item.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowToPlay;