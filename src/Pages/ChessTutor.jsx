import React, { useState } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { toast } from 'react-hot-toast';
import { explainMove } from "../services/operations/aiService";

const game = new Chess();

const ChessTutor = () => {
  const [fen, setFen] = useState(game.fen());
  const [moveHistory, setMoveHistory] = useState([]);
  const [historyFens, setHistoryFens] = useState([game.fen()]);
  const [activeFenIndex, setActiveFenIndex] = useState(0);
  const [fenInput, setFenInput] = useState('');
 const [aiSections, setAiSections] = useState({
  bestMove: null,
  tactical: "",
  positional: "",
});

  const onDrop = (sourceSquare, targetSquare) => {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q',
    });

    if (move === null) return false;

    const newFen = game.fen();
    const updatedFens = [...historyFens.slice(0, activeFenIndex + 1), newFen];
    setHistoryFens(updatedFens);
    setMoveHistory([...moveHistory, move.san]);
    setActiveFenIndex(updatedFens.length - 1);
    setFen(newFen);

    return true;
  };

const handleExplainMove = async () => {
  const currentFen = fen;
  const lastMove = moveHistory[moveHistory.length - 1];

  if (!lastMove) {
    toast.error("No move found to explain!");
    return;
  }

  try {
    const aiResponse = await explainMove(currentFen, lastMove);

    // Most likely structure of returned `response` from backend:
 
    const content = aiResponse?.choices?.[0]?.message?.content;



    if (!content) {
      toast.error("No explanation received from AI.");
      return;
    }

    console.log("🧠 Raw AI content:\n", content);

    const tactical = content.split("2.")[0]?.replace("1. Tactical purpose:", "").trim();
    const positional = content
      .split("2.")[1]
      ?.split("3.")[0]
      ?.replace("Positional benefit:", "")
      .trim();
    const strategic = content
      .split("3.")[1]
      ?.replace("Strategic goals:", "")
      .trim();

    setAiSections({
      bestMove: lastMove,
      tactical,
      positional,
      strategic,
    });

    toast.success("Explanation received!");
  } catch (err) {
    console.error("AI Request failed:", err);
    toast.error("Failed to get explanation");
  }
};




  const goBack = () => {
    if (activeFenIndex > 0) {
      const newIndex = activeFenIndex - 1;
      setActiveFenIndex(newIndex);
      setFen(historyFens[newIndex]);
    }
  };

  const goNext = () => {
    if (activeFenIndex < historyFens.length - 1) {
      const newIndex = activeFenIndex + 1;
      setActiveFenIndex(newIndex);
      setFen(historyFens[newIndex]);
    }
  };

  const goToCurrent = () => {
    setActiveFenIndex(historyFens.length - 1);
    setFen(historyFens[historyFens.length - 1]);
  };

  const handlePasteFEN = () => {
    try {
      game.load(fenInput);
      const loadedFen = game.fen();
      setFen(loadedFen);
      setHistoryFens([loadedFen]);
      setMoveHistory([]);
      setActiveFenIndex(0);
    } catch (err) {
      alert("Invalid FEN");
    }
  };


  const handleReset = () => {
    game.reset();
    const startFen = game.fen();
    setFen(startFen);
    setMoveHistory([]);
    setHistoryFens([startFen]);
    setActiveFenIndex(0);
    setFenInput('');
  };

  return (
    <div className="w-full h-screen flex px-6 py-4 text-white gap-6">
      {/* Left Panel */}
      <div className="w-[500px]">
     

        <Chessboard
          position={fen}
          onPieceDrop={onDrop}
          boardWidth={500}
          customBoardStyle={{
            borderRadius: '8px',
            boxShadow: '0 0 8px rgba(0,0,0,0.3)',
          }}
        />

        {/* Controls */}
        <div className="flex justify-between mt-4 gap-2">
          <button
            onClick={goBack}
            className="bg-richblack-800 px-3 py-1 rounded hover:bg-richblack-700"
          >
            ⬅️ Back
          </button>
          <button
            onClick={goNext}
            className="bg-richblack-800 px-3 py-1 rounded hover:bg-richblack-700"
          >
            ➡️ Next
          </button>
          <button
            onClick={goToCurrent}
            className="bg-richblack-800 px-3 py-1 rounded hover:bg-richblack-700"
          >
            🕑 Current
          </button>
          <button
            onClick={handleExplainMove}
            className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-300"
          >
            🧠 Explain
          </button>
        </div>

        {/* Just FEN input */}
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="FEN placeholder only"
            className="flex-1 px-2 py-1 rounded text-black text-sm"
            value={fenInput}
            onChange={(e) => setFenInput(e.target.value)}
          />
          <button
            onClick={handlePasteFEN}
            className="bg-green-500 text-white px-3 rounded hover:bg-green-600"
          >
            Load
          </button>
        </div>

        {/* Export + Reset Buttons */}
        <div className="mt-3 flex gap-2">
         <div className="mt-4">
       <button
       onClick={() => {
      navigator.clipboard.writeText(game.pgn());
      toast.success("PGN copied to clipboard!");
       }}
       className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
         >
       📋 Export PGN (Copy)
        </button>
      </div>

          <button
            onClick={handleReset}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            ♻️ Reset
          </button>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 bg-richblack-800 rounded-lg p-4">
  <h2 className="text-lg font-semibold mb-3">AI Tutor</h2>
  <p className="text-richblack-300 text-sm">
    Use the board to play and navigate. The AI can explain any move or FEN you paste.
  </p>

  <div className="w-full bg-richblack-800 rounded-lg p-4 space-y-4">
    <h2 className="text-lg font-semibold text-yellow-300">AI Tutor Analysis</h2>

    <div className="bg-richblack-900 p-3 rounded shadow">
      <h4 className="text-yellow-400 mb-1 font-medium">🧠 Tactical Purpose</h4>
      <p className="text-sm text-richblack-200">{aiSections.tactical}</p>
    </div>

    <div className="bg-richblack-900 p-3 rounded shadow">
      <h4 className="text-yellow-400 mb-1 font-medium">♟️ Positional Benefit</h4>
      <p className="text-sm text-richblack-200">{aiSections.positional}</p>
    </div>

    <div className="bg-richblack-900 p-3 rounded shadow">
      <h4 className="text-yellow-400 mb-1 font-medium">🎯 Strategic Goals</h4>
      <p className="text-sm text-richblack-200">{aiSections.strategic}</p>
    </div>

     {aiSections.bestMove && (
  <div className="mb-4 p-3 rounded bg-blue-900 text-white shadow">
    <h3 className="font-semibold text-yellow-400">🏆 Your Last Move :</h3>
    <p className="text-lg font-bold">{aiSections.bestMove}</p>
  </div>
)}
  </div>
</div>

    </div>
  );
};

export default ChessTutor;
