"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { BrainCircuit, Play, LayoutGrid, CheckCircle2, XCircle, Trophy, Volume2, VolumeX, RotateCcw, Home, Lightbulb, Rocket, BarChart3 } from "lucide-react";
import { NeonButton } from "./ui/NeonButton";
import { GlassCard } from "./ui/GlassCard";
import { useQuizLogic } from "@/hooks/useQuizLogic";
import { useSound } from "@/hooks/useSound";
import { Question } from "@/data/questions";

export function GameLogic() {
  const {
    gameState,
    selectedSection,
    currentQuestions,
    currentIndex,
    stats,
    userAnswers,
    startGame,
    selectSection,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    resetGame,
    setGameState
  } = useQuizLogic();

  const { enabled, toggleSound, playSound } = useSound();

  return (
    <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center p-4">
      {/* Top Controls */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-3">
        {gameState !== "intro" && (
          <button 
            onClick={() => {
              playSound("click");
              setGameState("intro");
            }}
            className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white backdrop-blur-md transition-all shadow-lg hover:animate-pulse"
            title="Return Home"
          >
            <Home size={20} />
          </button>
        )}
        <button 
          onClick={toggleSound}
          className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white backdrop-blur-md transition-all shadow-lg hover:animate-pulse"
          title="Toggle Sound"
        >
          {enabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {gameState === "intro" && <IntroScreen key="intro" onStart={startGame} />}
        {gameState === "level_select" && <LevelSelection key="level_select" onSelect={selectSection} />}
        {gameState === "playing" && (
          <QuizActive 
            key="playing" 
            question={currentQuestions[currentIndex]} 
            currentIndex={currentIndex}
            total={currentQuestions.length}
            onAnswer={answerQuestion}
            stats={stats}
            userAnswers={userAnswers}
            onNext={nextQuestion}
            onPrev={previousQuestion}
          />
        )}
        {gameState === "result" && (
          <ResultScreen 
            key="result" 
            stats={stats} 
            total={currentQuestions.length}
            onReplay={resetGame}
            onHome={() => { setGameState("intro"); }}
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-4 text-white/50 text-xs font-medium tracking-wider">
        MADE BY AF
      </div>
    </div>
  );
}

// ----------------------------------------------------
// INTRO SCREEN
// ----------------------------------------------------
function IntroScreen({ onStart }: { onStart: () => void }) {
  // Mouse tracking logic for parallax
  const x = useMotionValue(typeof window !== "undefined" ? window.innerWidth / 2 : 500);
  const y = useMotionValue(typeof window !== "undefined" ? window.innerHeight / 2 : 500);

  const mouseXSpring = useSpring(x, { stiffness: 50, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 50, damping: 20 });

  const moveX1 = useTransform(mouseXSpring, [0, typeof window !== "undefined" ? window.innerWidth : 1000], [50, -50]);
  const moveY1 = useTransform(mouseYSpring, [0, typeof window !== "undefined" ? window.innerHeight : 1000], [50, -50]);

  const moveX2 = useTransform(mouseXSpring, [0, typeof window !== "undefined" ? window.innerWidth : 1000], [-40, 40]);
  const moveY2 = useTransform(mouseYSpring, [0, typeof window !== "undefined" ? window.innerHeight : 1000], [-50, 50]);

  const moveX3 = useTransform(mouseXSpring, [0, typeof window !== "undefined" ? window.innerWidth : 1000], [60, -60]);
  const moveY3 = useTransform(mouseYSpring, [0, typeof window !== "undefined" ? window.innerHeight : 1000], [-30, 30]);

  const handleMouseMove = (e: React.MouseEvent) => {
    x.set(e.clientX);
    y.set(e.clientY);
  };

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center text-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(10px)", transition: { duration: 0.5 } }}
      onMouseMove={handleMouseMove}
    >
      {/* Floating Hologram 1: Top Left */}
      <motion.div 
        className="absolute top-[15%] left-[10%] md:left-[20%] p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.3)] hidden md:block"
        style={{ x: moveX1, y: moveY1 }}
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Lightbulb size={36} className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
      </motion.div>

      {/* Floating Hologram 2: Bottom Right */}
      <motion.div 
        className="absolute bottom-[15%] right-[10%] md:right-[20%] p-5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.3)] hidden md:block"
        style={{ x: moveX2, y: moveY2 }}
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <Rocket size={40} className="text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
      </motion.div>

      {/* Floating Hologram 3: Center Left */}
      <motion.div 
        className="absolute top-[60%] left-[5%] md:left-[15%] p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.3)] hidden md:block z-0"
        style={{ x: moveX3, y: moveY3 }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <BarChart3 size={28} className="text-brand-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
      </motion.div>

      {/* Main Center Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center pointer-events-none"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="mb-8 relative"
        >
          <BrainCircuit className="w-28 h-28 text-brand-500 drop-shadow-[0_0_20px_rgba(168,85,247,1)]" />
        </motion.div>

        <h1 className="text-6xl md:text-8xl font-extrabold text-white mb-4 tracking-tighter mix-blend-screen drop-shadow-2xl">
          FM <span className="text-gradient">Quiz</span>
        </h1>
        <p className="text-xl md:text-3xl text-brand-100/80 mb-12 font-light tracking-wide shadow-black drop-shadow-lg">
          Upgrade Your Mind 🚀
        </p>
        
        <div className="pointer-events-auto">
          <NeonButton size="lg" onClick={onStart} className="text-xl shadow-[0_0_40px_rgba(168,85,247,0.6)] px-14 py-4 rounded-2xl">
            <Play size={28} fill="currentColor" /> Let's Go
          </NeonButton>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ----------------------------------------------------
// LEVEL SELECTION
// ----------------------------------------------------
function LevelSelection({ onSelect }: { onSelect: (section: number) => void }) {
  return (
    <motion.div
      className="flex flex-col items-center max-w-4xl w-full"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-3">Select Mission</h2>
        <p className="text-white/60">Choose your knowledge domain</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full px-4">
        {[1, 2].map((section) => (
          <GlassCard 
            key={section}
            glow
            className="cursor-pointer group"
            onClick={() => onSelect(section)}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="p-4 rounded-xl bg-brand-900/40 text-brand-500 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all">
                <LayoutGrid size={28} />
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-brand-100 border border-white/10">
                MODULE {section}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-brand-500 transition-colors">
              Section {section} Challenge
            </h3>
            <p className="text-white/50 text-sm mb-6 line-clamp-2">
              Master the core concepts of Family Business planning, commitment, and longevity.
            </p>
            <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
              <div className="bg-brand-500 w-0 h-full group-hover:w-full transition-all duration-700 ease-out"></div>
            </div>
          </GlassCard>
        ))}
      </div>
    </motion.div>
  );
}

// ----------------------------------------------------
// QUIZ ACTIVE (GAMEPLAY)
// ----------------------------------------------------
function QuizActive({ question, currentIndex, total, onAnswer, userAnswers, onNext, onPrev, stats }: any) {
  // Derive status from userAnswers if this question was already answered
  const existingAnswer = userAnswers[currentIndex];
  let status: "idle" | "correct" | "wrong" = "idle";
  
  if (existingAnswer) {
    status = existingAnswer === question.correctAnswer ? "correct" : "wrong";
  }

  const handleSelect = (opt: string) => {
    if (status !== "idle") return; // block further answers
    onAnswer(opt);
  };

  // Build options array (merge T/F into normal options logic)
  const options = question.type === "true_false" ? ["True", "False"] : question.options;

  return (
    <motion.div
      key={question.id + "_" + currentIndex}
      className="w-full max-w-3xl"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
    >
      <div className="flex justify-between items-center mb-6 px-2">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 px-4 py-1.5 rounded-full text-brand-100 text-sm font-semibold border border-white/10 backdrop-blur-md flex items-center gap-2">
            Question <span className="text-white">{currentIndex + 1} / {total}</span>
          </div>
          {stats.combo > 1 && (
            <motion.div 
              initial={{ scale: 0 }} animate={{ scale: 1 }} 
              className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-[0_0_10px_rgba(249,115,22,0.3)]"
            >
              🔥 {stats.combo}x Combo
            </motion.div>
          )}
        </div>
      </div>

      <GlassCard className="mb-6 relative overflow-visible">
        {/* Progress horizontal line */}
        <div className="absolute top-0 left-0 h-1 bg-white/5 w-full rounded-t-2xl overflow-hidden">
          <motion.div 
            className="h-full bg-brand-500" 
            initial={{ width: `${((currentIndex) / total) * 100}%` }}
            animate={{ width: `${((currentIndex + 1) / total) * 100}%` }}
          />
        </div>

        <h2 className="text-2xl md:text-3xl font-medium text-white my-6 leading-tight">
          {question.question}
        </h2>

        {status !== "idle" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`absolute -bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full font-bold shadow-lg border flex items-center gap-2 ${
            status === "correct" ? "bg-green-600 border-green-400 text-white shadow-[0_0_20px_rgba(22,163,74,0.6)]" : "bg-red-600 border-red-400 text-white shadow-[0_0_20px_rgba(220,38,38,0.6)]"
          }`}>
            {status === "correct" ? <><CheckCircle2 size={18}/> Nailed it!</> : <><XCircle size={18}/> Incorrect</>}
          </motion.div>
        )}
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {options.map((opt: string, i: number) => {
          const isSelected = existingAnswer === opt;
          const isCorrectAns = opt === question.correctAnswer;
          
          let btnClass = "bg-white/5 hover:bg-white/10 text-white border-white/10 hover:border-brand-500";
          let animation = {};

          if (status !== "idle") {
            if (isCorrectAns) {
              // Highlight the correct answer always
              btnClass = "bg-green-600/30 border-green-500 text-green-100 shadow-[0_0_15px_rgba(22,163,74,0.3)]";
              animation = { scale: [1, 1.05, 1] };
            } else if (isSelected && !isCorrectAns) {
              btnClass = "bg-red-600/30 border-red-500 text-red-100 shadow-[0_0_15px_rgba(220,38,38,0.3)]";
              animation = { x: [-5, 5, -5, 5, 0] }; // Shake
            } else {
              btnClass = "opacity-50 pointer-events-none bg-white/5 border-white/5";
            }
          }

          return (
            <motion.button
              key={i}
              onClick={() => handleSelect(opt)}
              disabled={status !== "idle"}
              className={`p-5 rounded-xl border text-left font-medium transition-all duration-300 backdrop-blur-sm ${btnClass}`}
              animate={animation}
              whileHover={status === "idle" ? { y: -2, boxShadow: "0 0 15px rgba(168,85,247,0.2)" } : {}}
              whileTap={status === "idle" ? { scale: 0.98 } : {}}
            >
              {opt}
            </motion.button>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-4">
        <NeonButton 
          variant="outline" 
          onClick={onPrev} 
          disabled={currentIndex === 0}
          className={`${currentIndex === 0 ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
          &larr; Previous
        </NeonButton>

        <NeonButton 
          variant={existingAnswer ? "primary" : "outline"} 
          onClick={onNext}
        >
          {currentIndex + 1 === total ? "Finish" : "Next"} &rarr;
        </NeonButton>
      </div>

    </motion.div>
  );
}

// ----------------------------------------------------
// RESULT SCREEN
// ----------------------------------------------------
function ResultScreen({ stats, total, onReplay, onHome }: any) {
  const isPerfect = stats.correctCount === total;
  
  return (
    <motion.div
      className="w-full max-w-3xl flex flex-col items-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      {isPerfect && (
        <motion.div 
          className="absolute -z-10 w-full h-full"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        >
          {/* Confetti simulation using pure divs could go here, but omitted for brevity, using extreme glow instead */}
        </motion.div>
      )}

      <GlassCard className="w-full text-center p-12 relative overflow-visible" glow={isPerfect}>
        {isPerfect && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }} 
            animate={{ y: -40, opacity: 1 }}
            className="absolute top-0 right-10 text-6xl"
          >
            👨‍💼🚀
          </motion.div>
        )}
        
        <div className="flex justify-center mb-6">
          <div className={`p-6 rounded-full inline-block ${isPerfect ? 'bg-yellow-500/20 text-yellow-500' : 'bg-brand-500/20 text-brand-500'} shadow-[0_0_30px_rgba(0,0,0,0.5)]`}>
            <Trophy size={64} className={isPerfect ? 'drop-shadow-[0_0_15px_rgba(234,179,8,1)]' : ''}/>
          </div>
        </div>

        <h2 className="text-4xl font-extrabold text-white mb-2">
          {isPerfect ? "Flawless Execution!" : "Mission Complete!"}
        </h2>
        <p className="text-white/60 mb-8 max-w-md mx-auto">
          {isPerfect 
            ? "You're unstoppable! Peak startup performance achieved. The board is thrilled."
            : "You've successfully completed this module. Review your metrics below and try to optimize your performance."}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 w-full">
          <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col">
            <span className="text-xs text-brand-100 uppercase font-bold tracking-wider mb-1">Score</span>
            <span className="text-2xl text-white font-mono">{stats.score}</span>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col">
            <span className="text-xs text-green-400 uppercase font-bold tracking-wider mb-1">Correct</span>
            <span className="text-2xl text-white font-mono">{stats.correctCount}</span>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col">
            <span className="text-xs text-red-400 uppercase font-bold tracking-wider mb-1">Errors</span>
            <span className="text-2xl text-white font-mono">{stats.wrongCount}</span>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col">
            <span className="text-xs text-orange-400 uppercase font-bold tracking-wider mb-1">Max Combo</span>
            <span className="text-2xl text-white font-mono">{stats.maxCombo}x</span>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <NeonButton onClick={onReplay} className="min-w-40">
            <RotateCcw size={18}/> Replay Level
          </NeonButton>
          <NeonButton variant="secondary" onClick={onHome} className="min-w-40">
            <Home size={18} /> Main Menu
          </NeonButton>
        </div>
      </GlassCard>

      {/* Review Section */}
      {stats.wrongCount > 0 && (
        <div className="w-full mt-12">
          <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Performance Review (Errors)</h3>
          <div className="space-y-4">
            {stats.history.filter((h: any) => !h.correct).map((item: any, i: number) => (
              <div key={i} className="bg-red-950/20 border border-red-500/20 p-5 rounded-xl block w-full px-5 text-left">
                <p className="text-white mb-3 font-medium text-lg">{item.question.question}</p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-2 text-red-400 text-sm">
                    <XCircle size={16} className="mt-0.5 shrink-0" />
                    <span>Your answer: <span className="line-through opacity-80">{item.user}</span></span>
                  </div>
                  <div className="flex items-start gap-2 text-green-400 text-sm">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                    <span>Correct answer: <strong>{item.question.correctAnswer}</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
