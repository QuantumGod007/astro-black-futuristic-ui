
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, RotateCcw, Star, Rocket } from 'lucide-react';

interface QuizModalProps {
  open: boolean;
  onClose: () => void;
}

const questions = {
  easy: [
    { q: "Which planet is closest to the sun?", c: ["Mercury", "Venus", "Earth", "Mars"], a: 0 },
    { q: "What is Earth's only natural satellite?", c: ["Moon", "Mars", "Venus", "Io"], a: 0 },
    { q: "What galaxy do we live in?", c: ["Milky Way", "Andromeda", "Whirlpool", "Sombrero"], a: 0 },
    { q: "What is the hottest planet?", c: ["Mercury", "Venus", "Earth", "Mars"], a: 1 },
    { q: "How many planets are in the solar system?", c: ["7", "8", "9", "10"], a: 1 },
  ],
  medium: [
    { q: "Which planet has the most moons?", c: ["Jupiter", "Saturn", "Uranus", "Neptune"], a: 1 },
    { q: "Who was the first person on the Moon?", c: ["Buzz Aldrin", "Neil Armstrong", "Yuri Gagarin", "Michael Collins"], a: 1 },
    { q: "What is the densest planet?", c: ["Earth", "Jupiter", "Venus", "Mars"], a: 0 },
    { q: "Which spacecraft took humans to the moon?", c: ["Apollo 11", "Sputnik", "Voyager", "Challenger"], a: 0 },
    { q: "Which planet has the shortest day?", c: ["Jupiter", "Earth", "Mars", "Neptune"], a: 0 },
  ],
  hard: [
    { q: "What is the name of the black hole at our galaxy's center?", c: ["Sagittarius A*", "Cygnus X-1", "Vega", "Betelgeuse"], a: 0 },
    { q: "Which mission first landed a rover on Mars?", c: ["Viking 1", "Pathfinder", "Spirit", "Curiosity"], a: 0 },
    { q: "What fuels the sun's fusion?", c: ["Hydrogen", "Helium", "Carbon", "Oxygen"], a: 0 },
    { q: "How far is the Earth from the Sun?", c: ["~150 million km", "~93 million km", "~1 million km", "~500,000 km"], a: 0 },
    { q: "Which element was first found in the Sun?", c: ["Helium", "Hydrogen", "Carbon", "Oxygen"], a: 0 },
  ],
};

const QuizModal: React.FC<QuizModalProps> = ({ open, onClose }) => {
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'finished'>('setup');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const startQuiz = () => {
    const shuffled = [...questions[difficulty]].sort(() => Math.random() - 0.5);
    setCurrentQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameState('playing');
  };

  const selectAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    setShowResult(true);
    
    if (index === currentQuestions[currentIndex].a) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentIndex + 1 < currentQuestions.length) {
        setCurrentIndex(currentIndex + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setGameState('finished');
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setGameState('setup');
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const getDifficultyIcon = (diff: string) => {
    switch (diff) {
      case 'easy': return <Star className="w-4 h-4" />;
      case 'medium': return <Rocket className="w-4 h-4" />;
      case 'hard': return <Trophy className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-black/90 backdrop-blur-xl border-white/20 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-thin text-center">
            🚀 Space Quiz Challenge
          </DialogTitle>
        </DialogHeader>

        {gameState === 'setup' && (
          <div className="space-y-6">
            <p className="text-center text-gray-300 font-light">
              Test your knowledge of the cosmos
            </p>
            
            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-300">
                Select Difficulty
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['easy', 'medium', 'hard'] as const).map((level) => (
                  <Card
                    key={level}
                    className={`cursor-pointer transition-all duration-200 ${
                      difficulty === level 
                        ? 'bg-white/20 border-white/40' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                    onClick={() => setDifficulty(level)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        {getDifficultyIcon(level)}
                        <span className="capitalize font-medium">{level}</span>
                      </div>
                      <p className="text-xs text-gray-400">
                        {questions[level].length} questions
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Button
              onClick={startQuiz}
              className="w-full bg-white text-black hover:bg-gray-100 transition-all duration-200"
            >
              Start Quiz
            </Button>
          </div>
        )}

        {gameState === 'playing' && currentQuestions.length > 0 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <Badge variant="outline" className="border-white/30 text-white">
                Question {currentIndex + 1} of {currentQuestions.length}
              </Badge>
              <Badge variant="outline" className="border-white/30 text-white">
                Score: {score}
              </Badge>
            </div>

            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardContent className="p-6">
                <h3 className="text-lg mb-6 text-center font-light">
                  {currentQuestions[currentIndex]?.q}
                </h3>

                <div className="space-y-3">
                  {currentQuestions[currentIndex]?.c.map((choice, index) => {
                    let buttonClass = "w-full p-4 text-left bg-white/5 border border-white/20 rounded-lg hover:bg-white/10 transition-all duration-200";
                    
                    if (showResult) {
                      if (index === currentQuestions[currentIndex].a) {
                        buttonClass += " bg-green-500/20 border-green-500/50 text-green-300";
                      } else if (index === selectedAnswer) {
                        buttonClass += " bg-red-500/20 border-red-500/50 text-red-300";
                      }
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => selectAnswer(index)}
                        disabled={selectedAnswer !== null}
                        className={buttonClass}
                      >
                        {choice}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {gameState === 'finished' && (
          <div className="space-y-6 text-center">
            <div className="space-y-4">
              <Trophy className="w-16 h-16 mx-auto text-yellow-400" />
              <h3 className="text-2xl font-light">Quiz Complete!</h3>
              <div className="text-4xl font-light">
                {score} / {currentQuestions.length}
              </div>
              <p className="text-gray-300">
                {score === currentQuestions.length 
                  ? "Perfect! You're a space expert! 🌟"
                  : score >= currentQuestions.length * 0.7
                  ? "Great job! You know your space facts! 🚀"
                  : "Keep exploring the cosmos! 🌌"
                }
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={resetQuiz}
                variant="outline"
                className="flex-1 border-white/30 text-white hover:bg-white/10"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button
                onClick={onClose}
                className="flex-1 bg-white text-black hover:bg-gray-100"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuizModal;
