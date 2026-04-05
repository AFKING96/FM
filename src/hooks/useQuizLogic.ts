"use client";

import { useState, useEffect } from "react";
import { Question, quizQuestions } from "@/data/questions";
import { useSound } from "./useSound";

export type GameState = "intro" | "level_select" | "playing" | "result";

export interface QuizStats {
  score: number;
  combo: number;
  maxCombo: number;
  correctCount: number;
  wrongCount: number;
  history: { question: Question; user: string; correct: boolean }[];
}

export function useQuizLogic() {
  const [gameState, setGameState] = useState<GameState>("intro");
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Track user answers by index
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  
  const [stats, setStats] = useState<QuizStats>({
    score: 0,
    combo: 0,
    maxCombo: 0,
    correctCount: 0,
    wrongCount: 0,
    history: []
  });

  const { playSound } = useSound();

  useEffect(() => {
    const saved = localStorage.getItem("fm_quiz_progress");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.gameState !== "intro" && data.gameState !== "result") {
          // Can restore, omitted for brevity
        }
      } catch (e) {
        console.error("Parse error", e);
      }
    }
  }, []);

  const startGame = () => {
    playSound("click");
    setGameState("level_select");
  };

  const selectSection = (section: number) => {
    playSound("level");
    setSelectedSection(section);
    
    // Filter questions
    const filtered = quizQuestions.filter((q) => q.section === section);
    
    // Sort: MCQ first, then True/False
    const selected = [...filtered].sort((a, b) => {
      if (a.type === "multiple_choice" && b.type === "true_false") return -1;
      if (a.type === "true_false" && b.type === "multiple_choice") return 1;
      return 0; // maintain original order within same type, or we could shuffle within types
    });
    
    setCurrentQuestions(selected);
    setCurrentIndex(0);
    setUserAnswers({});
    setStats({
      score: 0,
      combo: 0,
      maxCombo: 0,
      correctCount: 0,
      wrongCount: 0,
      history: []
    });
    setGameState("playing");
  };

  const answerQuestion = (answer: string) => {
    // If already answered this index, ignore it
    if (userAnswers[currentIndex] !== undefined) return false;

    const currentQ = currentQuestions[currentIndex];
    const isCorrect = answer === currentQ.correctAnswer;
    
    setUserAnswers(prev => ({ ...prev, [currentIndex]: answer }));

    if (isCorrect) {
      playSound("correct");
      setStats((prev) => {
        const combo = prev.combo + 1;
        return {
          ...prev,
          score: prev.score + 100 + (combo * 10),
          combo,
          maxCombo: Math.max(prev.maxCombo, combo),
          correctCount: prev.correctCount + 1,
          history: [...prev.history, { question: currentQ, user: answer, correct: true }]
        };
      });
    } else {
      playSound("wrong");
      setStats((prev) => ({
        ...prev,
        combo: 0,
        wrongCount: prev.wrongCount + 1,
        history: [...prev.history, { question: currentQ, user: answer, correct: false }]
      }));
    }
    
    return isCorrect;
  };

  const nextQuestion = () => {
    playSound("click");
    if (currentIndex + 1 < currentQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const previousQuestion = () => {
    if (currentIndex > 0) {
      playSound("click");
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const finishQuiz = () => {
    playSound("win");
    setGameState("result");
  };

  const resetGame = () => {
    playSound("click");
    setGameState("level_select");
  };

  return {
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
  };
}
