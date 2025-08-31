import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Timer, 
  Target,
  Trophy,
  Star,
  Brain,
  Lightbulb
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getQuizzes } from '../services/quizService';

const Quizzes = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [gameState, setGameState] = useState('menu');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(180);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameResults, setGameResults] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);

  const [quizzes2, setQuizzes2] = useState([])

  useEffect(() => {
    const fetechQuizzes = async () => {
      const quizzes = await getQuizzes();
      setQuizzes2(quizzes)
      console.log(quizzes2)
    };
    
    fetechQuizzes()
    console.log(quizzes2)
  }, []);

  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            completeQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, timeRemaining]);

  const startQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setGameState('playing');
    setCurrentQuestion(0);
    setScore(0);
    setTimeRemaining(quiz.time * 60);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setUserAnswers([]);
  };

  const selectAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const submitAnswer = () => {
    // const isCorrect = selectedAnswer === selectedQuiz.questions[currentQuestion].correct;
    const currentQ = selectedQuiz.questions[currentQuestion];
    const selectedAnswerObj = currentQ.answers.find(answer => answer.id === selectedAnswer);
    const isCorrect = selectedAnswerObj ? selectedAnswerObj.correct : false;

    const newAnswers = [...userAnswers, {
      questionIndex: currentQuestion,
      selectedAnswer,
      correct: isCorrect,
      timeTaken: (selectedQuiz.time * 60) - timeRemaining
    }];
    setUserAnswers(newAnswers);
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < selectedQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    const finalScore = Math.round((score / selectedQuiz.questions.length) * 100);
    const totalTime = (selectedQuiz.time * 60) - timeRemaining;
    
    setGameState('completed');
    setGameResults({
      score: finalScore,
      correctAnswers: score,
      totalQuestions: selectedQuiz.questions.length,
      timeTaken: totalTime,
      answers: userAnswers
    });

    // Check for achievements
    if (finalScore === 100) {
      toast({
        title: "Achievement Unlocked! 🏆",
        description: "Quiz Master - Perfect score achieved!"
      });
    } else if (finalScore >= 80) {
      toast({
        title: "Achievement Unlocked! ⭐",
        description: "Quick Learner - Scored 80% or higher!"
      });
    }
  };

  const exitQuiz = () => {
    setGameState('menu');
    setSelectedQuiz(null);
    setShowExplanation(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'Beginner': return 'text-green-500';
      case 'Intermediate': return 'text-blue-500';
      case 'Advanced': return 'text-yellow-500';
      case 'Expert': return 'text-orange-500';
      case 'Master': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  const getDifficultyLabel = (level) => {
    switch (level) {
      case 'Beginner': return 'Beginner';
      case 'Intermediate': return 'Intermediate';
      case 'Advanced': return 'Advanced';
      case 'Expert': return 'Expert';
      case 'Master': return 'Master';
      default: return 'Unknown';
    }
  };

  if (gameState === 'playing' && selectedQuiz) {
    const currentQ = selectedQuiz.questions[currentQuestion];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          {/* Quiz Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold text-foreground">{selectedQuiz.title}</h1>
              <Badge variant="outline" className={getDifficultyColor(selectedQuiz.difficulty)}>
                {getDifficultyLabel(selectedQuiz.difficulty)}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-foreground">
                <Timer className="h-5 w-5" />
                <span className="font-mono text-xl">{formatTime(timeRemaining)}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-foreground">
                <Target className="h-5 w-5" />
                <span className="font-bold">{score}/{selectedQuiz.questions.length}</span>
              </div>
              
              <Button variant="destructive" size="sm" onClick={exitQuiz}>
                Exit Quiz
              </Button>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {selectedQuiz.questions.length}
              </span>
              <span className="text-sm text-muted-foreground">
                Progress: {Math.round(((currentQuestion + 1) / selectedQuiz.questions.length) * 100)}%
              </span>
            </div>
            <Progress value={((currentQuestion + 1) / selectedQuiz.questions.length) * 100} />
          </div>

          {/* Question Card */}
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-3">
                <Brain className="h-6 w-6 text-primary" />
                {currentQ.content}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!showExplanation ? (
                <>
                  <div className="space-y-3">
                    {currentQ.answers.map((answer, index) => (
                      <Button
                        key={answer.id}
                        variant={selectedAnswer === answer.id ? "default" : "outline"}
                        className="w-full text-left justify-start h-auto p-4"
                        onClick={() => selectAnswer(answer.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-medium">{String.fromCharCode(65 + index)}</span>
                          </div>
                          <span className="text-sm">{answer.content}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                  
                  <div className="flex justify-center pt-4">
                    <Button 
                      onClick={submitAnswer} 
                      disabled={selectedAnswer === null}
                      size="lg"
                    >
                      Submit Answer
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  {/* Answer Feedback */}
                  <div className="text-center">
                    {(() => {
                      const selectedAnswerObj = currentQ.answers.find(answer => answer.id === selectedAnswer);
                      const isCorrect = selectedAnswerObj ? selectedAnswerObj.correct : false;
                      const correctAnswer = currentQ.answers.find(answer => answer.correct);
                      
                      return isCorrect ? (
                        <div className="space-y-2">
                          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                          <h3 className="text-2xl font-bold text-green-600">Correct!</h3>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <XCircle className="h-16 w-16 text-red-500 mx-auto" />
                          <h3 className="text-2xl font-bold text-red-600">Incorrect</h3>
                          <p className="text-muted-foreground">
                            The correct answer was: <span className="font-semibold">
                              {correctAnswer ? correctAnswer.content : 'Unknown'}
                            </span>
                          </p>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Explanation */}
                  <div className="bg-primary/5 p-6 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Lightbulb className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-lg mb-2">Explanation</h4>
                        <p className="text-muted-foreground leading-relaxed">
                          {currentQ.explanation || 'No explanation available for this question.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center pt-4">
                    <Button onClick={nextQuestion} size="lg">
                      {currentQuestion === selectedQuiz.questions.length - 1 ? 'Complete Quiz' : 'Next Question'}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </main>

        <Footer />
      </div>
    );
  }

  if (gameState === 'completed' && gameResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-4xl mb-4">
                {gameResults.score >= 80 ? '🏆' : gameResults.score >= 60 ? '⭐' : '📚'} Quiz Complete!
              </CardTitle>
              <div className="text-6xl font-bold text-primary mb-2">
                {gameResults.score}%
              </div>
              <CardDescription className="text-lg">
                You got {gameResults.correctAnswers} out of {gameResults.totalQuestions} questions correct
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div className="space-y-2">
                  <div className="text-3xl font-bold">{gameResults.correctAnswers}</div>
                  <div className="text-sm text-muted-foreground">Correct Answers</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold">{formatTime(gameResults.timeTaken)}</div>
                  <div className="text-sm text-muted-foreground">Time Taken</div>
                </div>
              </div>

              {gameResults.score === 100 && (
                <div className="text-center p-6 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-lg border border-yellow-400/30">
                  <Trophy className="h-12 w-12 mx-auto mb-3 text-yellow-500" />
                  <h3 className="text-xl font-bold text-yellow-600 mb-1">Perfect Score!</h3>
                  <p className="text-muted-foreground">You've mastered this topic!</p>
                </div>
              )}

              <div className="flex justify-center space-x-4">
                <Button onClick={exitQuiz}>
                  Back to Quizzes
                </Button>
                <Button variant="outline" onClick={() => startQuiz(selectedQuiz)}>
                  Retake Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Media Literacy Quizzes
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Test your knowledge with interactive quizzes designed to improve your critical thinking skills
          </p>
          
          {!user && (
            <div className="bg-primary/10 p-6 rounded-lg mb-8">
              <p className="text-lg mb-4">Sign in to track your quiz scores and unlock achievements!</p>
              <Button asChild>
                <a href="/auth">Sign In to Start</a>
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes2.map((quiz) => (
            <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{quiz.title}</CardTitle>
                  <Badge variant="outline" className={getDifficultyColor(quiz.difficulty_display)}>
                    {getDifficultyLabel(quiz.difficulty_display)}
                  </Badge>
                </div>
                <CardDescription>{quiz.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Timer className="h-4 w-4 mr-2" />
                      {/* {formatTime(quiz.timeLimit)} */}
                      {formatTime(quiz.time * 60)}
                    </div>
                    <div className="flex items-center">
                      <Brain className="h-4 w-4 mr-2" />
                      {quiz.questions.length} Questions
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-2" />
                      {quiz.category}
                    </div>
                    <div className="flex items-center">
                      <Target className="h-4 w-4 mr-2" />
                      Level {quiz.difficulty_display}
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={() => user ? startQuiz(quiz) : window.location.href = '/auth'}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Quizzes;