import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Check, X, RotateCcw, Trophy, Rocket as RocketIcon } from 'lucide-react';

// Image Constants
const ROCKET_IMG = "https://d.top4top.io/p_3712pttp61.png";
const PLANET_IMG = "https://a.top4top.io/p_3712urypr1.png";

// Types
type GameState = 'start' | 'playing' | 'finished';

function App() {
  // Game Configuration State
  const [team1Name, setTeam1Name] = useState('الفريق الأول');
  const [team2Name, setTeam2Name] = useState('الفريق الثاني');
  const [totalQuestions, setTotalQuestions] = useState<string>('10');
  const [error, setError] = useState('');

  // Gameplay State
  const [gameState, setGameState] = useState<GameState>('start');
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [shakingTeam, setShakingTeam] = useState<1 | 2 | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const [isDraw, setIsDraw] = useState(false);

  // Derived State
  const stepsToWin = parseInt(totalQuestions) / 2;

  // Audio refs (optional, but good for "violent shake" feel if we had sound, 
  // for now we just use visual shake)

  const validateAndStart = () => {
    const num = parseInt(totalQuestions);
    if (isNaN(num) || num <= 0) {
      setError('الرجاء إدخال رقم صحيح');
      return;
    }
    if (num % 2 !== 0) {
      setError('عدد الأسئلة يجب أن يكون زوجياً');
      return;
    }
    setError('');
    setGameState('playing');
    setTeam1Score(0);
    setTeam2Score(0);
    setWinner(null);
    setIsDraw(false);
  };

  const handleCorrect = (team: 1 | 2) => {
    if (winner && !isDraw) {
        // If there's already a winner, we check if this move creates a draw
        // But typically we might want to stop interaction? 
        // The requirement says: "If both teams reach... at the same time... Draw"
        // We'll allow the game to continue until reset, updating the status.
    }

    if (team === 1) {
      const newScore = Math.min(team1Score + 1, stepsToWin);
      setTeam1Score(newScore);
      checkWin(newScore, team2Score);
    } else {
      const newScore = Math.min(team2Score + 1, stepsToWin);
      setTeam2Score(newScore);
      checkWin(team1Score, newScore);
    }
  };

  const handleWrong = (team: 1 | 2) => {
    setShakingTeam(team);
    setTimeout(() => setShakingTeam(null), 500);
  };

  const checkWin = (s1: number, s2: number) => {
    const t1Finished = s1 >= stepsToWin;
    const t2Finished = s2 >= stepsToWin;

    if (t1Finished && t2Finished) {
      setWinner('الأبطال معاً!');
      setIsDraw(true);
      triggerConfetti(true);
    } else if (t1Finished) {
      setWinner(team1Name);
      triggerConfetti(false);
    } else if (t2Finished) {
      setWinner(team2Name);
      triggerConfetti(false);
    }
  };

  const triggerConfetti = (isBig: boolean) => {
    const duration = isBig ? 5000 : 3000;
    const end = Date.now() + duration;

    const frame = () => {
      // Left side
      confetti({
        particleCount: isBig ? 5 : 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#39ff14', '#00ffff', '#ffffff'] // Neon colors
      });
      // Right side
      confetti({
        particleCount: isBig ? 5 : 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#39ff14', '#00ffff', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const resetGame = () => {
    setGameState('start');
    setTeam1Score(0);
    setTeam2Score(0);
    setWinner(null);
    setIsDraw(false);
    setError('');
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-hidden relative flex flex-col" dir="rtl">
      
      {/* Animated Stars Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: Math.random(), scale: Math.random() * 0.5 + 0.5 }}
            animate={{ 
              opacity: [0.2, 1, 0.2], 
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{ 
              duration: 2 + Math.random() * 3, 
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            className="absolute bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              boxShadow: '0 0 4px #fff'
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col h-full">
        
        {/* Header */}
        <header className="p-4 text-center border-b border-white/10 bg-black/50 backdrop-blur-md">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#39ff14] to-[#00ffff] drop-shadow-[0_0_10px_rgba(57,255,20,0.5)]">
            رحلة الصاروخ إلى الكوكب
          </h1>
        </header>

        {gameState === 'start' ? (
          // Start Screen
          <div className="flex-1 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/80 border border-[#00ffff]/30 p-8 rounded-3xl max-w-md w-full shadow-[0_0_50px_rgba(0,255,255,0.1)] backdrop-blur-xl"
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-[#00ffff] mb-2 font-bold">اسم الفريق الأول</label>
                  <input 
                    type="text" 
                    value={team1Name}
                    onChange={(e) => setTeam1Name(e.target.value)}
                    className="w-full bg-black/50 border-2 border-[#00ffff]/50 rounded-xl p-3 text-white focus:border-[#00ffff] focus:outline-none focus:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-[#39ff14] mb-2 font-bold">اسم الفريق الثاني</label>
                  <input 
                    type="text" 
                    value={team2Name}
                    onChange={(e) => setTeam2Name(e.target.value)}
                    className="w-full bg-black/50 border-2 border-[#39ff14]/50 rounded-xl p-3 text-white focus:border-[#39ff14] focus:outline-none focus:shadow-[0_0_15px_rgba(57,255,20,0.3)] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2 font-bold">إجمالي عدد الأسئلة (زوجي)</label>
                  <input 
                    type="number" 
                    value={totalQuestions}
                    onChange={(e) => setTotalQuestions(e.target.value)}
                    className="w-full bg-black/50 border-2 border-white/30 rounded-xl p-3 text-white focus:border-white focus:outline-none transition-all"
                  />
                  {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>

                <button 
                  onClick={validateAndStart}
                  className="w-full bg-gradient-to-r from-[#00ffff] to-[#39ff14] text-black font-bold text-xl py-4 rounded-xl hover:scale-105 active:scale-95 transition-transform shadow-[0_0_20px_rgba(57,255,20,0.4)]"
                >
                  انطلق في الرحلة 🚀
                </button>
              </div>
            </motion.div>
          </div>
        ) : (
          // Game Screen
          <div className="flex-1 flex flex-col p-4 overflow-hidden">
            
            {/* Score Board */}
            <div className="flex justify-between max-w-4xl mx-auto w-full mb-4 px-4">
              <div className="bg-[#00ffff]/10 border border-[#00ffff]/50 px-6 py-2 rounded-full backdrop-blur-md">
                <span className="text-[#00ffff] font-bold text-xl ml-2">{team1Name}</span>
                <span className="text-white font-mono text-xl">{team1Score}</span>
              </div>
              <div className="bg-[#39ff14]/10 border border-[#39ff14]/50 px-6 py-2 rounded-full backdrop-blur-md">
                <span className="text-[#39ff14] font-bold text-xl ml-2">{team2Name}</span>
                <span className="text-white font-mono text-xl">{team2Score}</span>
              </div>
            </div>

            {/* Tracks Area */}
            <div className="flex-1 flex justify-center gap-8 md:gap-24 relative max-w-5xl mx-auto w-full h-full">
              
              {/* Planet (Destination) */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 w-full flex justify-center">
                 <img 
                   src={PLANET_IMG} 
                   alt="Planet" 
                   className="w-32 h-32 md:w-48 md:h-48 object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] animate-pulse-slow"
                 />
              </div>

              {/* Track 1 (Team 1 - Blue) */}
              <div className="relative w-32 md:w-48 h-full flex flex-col justify-end pb-32">
                {/* Track Line */}
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 bg-gradient-to-t from-[#00ffff]/20 to-[#00ffff] rounded-full"></div>
                
                {/* Rocket Container */}
                <div className="absolute inset-0 pt-24 pb-32"> {/* Padding for planet and controls */}
                  <motion.div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full flex justify-center"
                    initial={{ bottom: '0%' }}
                    animate={{ 
                      bottom: `${(team1Score / stepsToWin) * 100}%`,
                      x: shakingTeam === 1 ? [-5, 5, -5, 5, 0] : '-50%'
                    }}
                    transition={{ 
                      bottom: { type: "spring", stiffness: 50, damping: 15 },
                      x: { duration: 0.4 }
                    }}
                  >
                    <div className="relative group">
                      <img 
                        src={ROCKET_IMG} 
                        alt="Rocket 1" 
                        className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-[0_0_15px_#00ffff]"
                        style={{ filter: 'hue-rotate(180deg)' }} // Shift hue for blue team if needed, or keep original
                      />
                      {/* Engine Flame */}
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4 h-8 bg-orange-500 blur-md animate-pulse rounded-full"></div>
                      
                      {/* Name Tag */}
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/70 px-2 py-1 rounded text-[#00ffff] text-sm border border-[#00ffff]/30">
                        {team1Name}
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Controls */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 z-30">
                  <button 
                    onClick={() => handleCorrect(1)}
                    disabled={!!winner}
                    className="bg-green-600 hover:bg-green-500 p-3 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-transform active:scale-90"
                  >
                    <Check size={24} />
                  </button>
                  <button 
                    onClick={() => handleWrong(1)}
                    disabled={!!winner}
                    className="bg-red-600 hover:bg-red-500 p-3 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-transform active:scale-90"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Track 2 (Team 2 - Green) */}
              <div className="relative w-32 md:w-48 h-full flex flex-col justify-end pb-32">
                {/* Track Line */}
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 bg-gradient-to-t from-[#39ff14]/20 to-[#39ff14] rounded-full"></div>
                
                {/* Rocket Container */}
                <div className="absolute inset-0 pt-24 pb-32">
                  <motion.div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full flex justify-center"
                    initial={{ bottom: '0%' }}
                    animate={{ 
                      bottom: `${(team2Score / stepsToWin) * 100}%`,
                      x: shakingTeam === 2 ? [-5, 5, -5, 5, 0] : '-50%'
                    }}
                    transition={{ 
                      bottom: { type: "spring", stiffness: 50, damping: 15 },
                      x: { duration: 0.4 }
                    }}
                  >
                    <div className="relative group">
                      <img 
                        src={ROCKET_IMG} 
                        alt="Rocket 2" 
                        className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-[0_0_15px_#39ff14]"
                      />
                      {/* Engine Flame */}
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4 h-8 bg-orange-500 blur-md animate-pulse rounded-full"></div>
                      
                      {/* Name Tag */}
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/70 px-2 py-1 rounded text-[#39ff14] text-sm border border-[#39ff14]/30">
                        {team2Name}
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Controls */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 z-30">
                  <button 
                    onClick={() => handleCorrect(2)}
                    disabled={!!winner}
                    className="bg-green-600 hover:bg-green-500 p-3 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-transform active:scale-90"
                  >
                    <Check size={24} />
                  </button>
                  <button 
                    onClick={() => handleWrong(2)}
                    disabled={!!winner}
                    className="bg-red-600 hover:bg-red-500 p-3 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-transform active:scale-90"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

            </div>

            {/* Winner Overlay */}
            <AnimatePresence>
              {winner && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                >
                  <div className="bg-slate-900 border-4 border-[#ffd700] rounded-3xl p-8 text-center max-w-lg w-full shadow-[0_0_100px_rgba(255,215,0,0.3)]">
                    <Trophy className="w-32 h-32 text-[#ffd700] mx-auto mb-6 drop-shadow-[0_0_20px_rgba(255,215,0,0.8)] animate-bounce" />
                    <h2 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
                      {isDraw ? 'تعادل!' : 'مبروك!'}
                    </h2>
                    <p className="text-3xl text-[#ffd700] mb-8 font-bold">
                      {winner} {isDraw ? '' : 'فاز بالسباق!'}
                    </p>
                    
                    <button
                      onClick={resetGame}
                      className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-[#00ffff] to-[#39ff14] text-black font-bold py-4 px-6 rounded-xl transition-transform hover:scale-105 text-xl"
                    >
                      <RotateCcw size={28} />
                      لعب مرة أخرى
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        )}
      </div>
    </div>
  );
}

export default App;
