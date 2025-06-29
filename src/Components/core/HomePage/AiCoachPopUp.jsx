import { useState } from "react";
import ChessTutor from "../../../Pages/ChessTutor";
import { Bot } from "lucide-react";

export default function Home() {
  const [showCoach, setShowCoach] = useState(false);

  return (
    <div className="relative">
      {/* Button */}
      <div className="fixed bottom-24 right-6 z-50 flex items-center gap-2 bg-yellow-400 text-black text-sm font-bold px-3 py-1 rounded-full shadow-lg animate-bounce">
  ✨ Just Added — Try It!
  <span className="ml-1 animate-wiggle text-xl">👎</span>
</div>


    <button  onClick={() => setShowCoach(true)} 
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 text-lg bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white font-bold rounded-full shadow-[0_0_20px_rgba(236,72,153,0.8)] hover:scale-110 transition-all duration-500 animate-pingOnce ring-4 ring-pink-500/30 ring-offset-2 backdrop-blur-md"
    >
      <Bot className="w-6 h-6 text-white animate-glow" />
      <span className="animate-flicker">AI Coach</span>
    </button>


      {/* Popup Modal */}
      {showCoach && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-richblack-900 w-[90%] max-w-full p-6 rounded-lg shadow-lg relative">
            <button
              onClick={() => setShowCoach(false)}
              className="absolute top-5 right-2 text-white text-2xl hover:text-red-500"
            >
              ✖
            </button>
            <ChessTutor />
          </div>
        </div>
      )}
    </div>
  );
}
