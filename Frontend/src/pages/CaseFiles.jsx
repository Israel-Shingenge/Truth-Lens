import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import DiscussionForum from '@/components/DiscussionForum';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize,
  Timer,
  Target,
  CheckCircle,
  XCircle,
  Trophy,
  Star,
  MessageSquare
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CaseFiles = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [caseFiles, setCaseFiles] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [gameState, setGameState] = useState('menu'); // menu, playing, completed
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [gameResults, setGameResults] = useState(null);
  const audioRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    fetchCaseFiles();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (gameState === 'playing' && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            completeGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, timeRemaining]);

  const fetchCaseFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('case_files')
        .select('*')
        .eq('is_active', true)
        .order('difficulty_level', { ascending: true });
      
      if (error) throw error;
      setCaseFiles(data || []);
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const startGame = (caseFile) => {
    setSelectedCase(caseFile);
    setGameState('playing');
    setCurrentQuestion(0);
    setScore(0);
    setTimeRemaining(300);
    setSelectedAnswers({});
    
    // Start background music if available
    if (caseFile.background_music_url && audioRef.current) {
      audioRef.current.src = caseFile.background_music_url;
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const selectAnswer = (questionIndex, answer) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const nextQuestion = () => {
    if (selectedCase?.content?.questions && currentQuestion < selectedCase.content.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeGame();
    }
  };

  const completeGame = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Calculate score
    let correctAnswers = 0;
    if (selectedCase?.content?.questions) {
      selectedCase.content.questions.forEach((question, index) => {
        if (selectedAnswers[index] === question.correct_answer) {
          correctAnswers++;
        }
      });
    }

    const finalScore = Math.round((correctAnswers / (selectedCase?.content?.questions?.length || 1)) * 100);
    const timeTaken = 300 - timeRemaining;

    setScore(finalScore);
    setGameState('completed');
    setGameResults({
      correctAnswers,
      totalQuestions: selectedCase?.content?.questions?.length || 0,
      finalScore,
      timeTaken,
      timeBonus: timeRemaining > 0 ? Math.round(timeRemaining / 10) : 0
    });

    // Save attempt to database
    if (user && selectedCase) {
      try {
        const { error } = await supabase
          .from('case_attempts')
          .insert({
            user_id: user.id,
            case_file_id: selectedCase.id,
            score: finalScore,
            time_taken: timeTaken,
            answers: selectedAnswers
          });

        if (error) throw error;

        // Check for achievements
        await checkAchievements(finalScore, timeTaken, correctAnswers);
        
      } catch (error) {
        console.error('Error saving attempt:', error);
      }
    }

    // Stop music
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const checkAchievements = async (score, timeTaken, correctAnswers) => {
    // This would check various achievement conditions
    // For now, we'll show a simple achievement notification
    if (score === 100) {
      toast({
        title: "Achievement Unlocked! 🏆",
        description: "Perfect Score - Answer all questions correctly!"
      });
    } else if (score >= 80) {
      toast({
        title: "Achievement Unlocked! ⭐",
        description: "Expert Analyst - Score 80% or higher!"
      });
    }
  };

  const exitGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setGameState('menu');
    setSelectedCase(null);
    setIsPlaying(false);
    setIsFullscreen(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case 1: return 'text-green-500';
      case 2: return 'text-blue-500';
      case 3: return 'text-yellow-500';
      case 4: return 'text-orange-500';
      case 5: return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  const getDifficultyLabel = (level) => {
    switch (level) {
      case 1: return 'Beginner';
      case 2: return 'Intermediate';
      case 3: return 'Advanced';
      case 4: return 'Expert';
      case 5: return 'Master';
      default: return 'Unknown';
    }
  };

  if (gameState === 'playing' || gameState === 'completed') {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 ${
        isFullscreen ? 'fixed inset-0 z-50 bg-black/95' : ''
      }`}>
        {/* Audio element */}
        <audio ref={audioRef} />

        {/* Game Header */}
        {!isFullscreen && <Header />}
        
        <div className={`${isFullscreen ? 'h-screen flex flex-col' : 'container mx-auto px-4 py-8'}`}>
          {/* Game Controls */}
          <div className={`flex items-center justify-between mb-6 ${
            isFullscreen ? 'px-8 py-4 bg-black/50 backdrop-blur-sm' : ''
          }`}>
            <div className="flex items-center space-x-4">
              <h1 className={`text-2xl font-bold ${isFullscreen ? 'text-white' : 'text-foreground'}`}>
                {selectedCase?.title}
              </h1>
              <Badge variant="outline" className={getDifficultyColor(selectedCase?.difficulty_level)}>
                {getDifficultyLabel(selectedCase?.difficulty_level)}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Timer */}
              <div className={`flex items-center space-x-2 ${isFullscreen ? 'text-white' : 'text-foreground'}`}>
                <Timer className="h-5 w-5" />
                <span className="font-mono text-lg">{formatTime(timeRemaining)}</span>
              </div>

              {/* Score */}
              <div className={`flex items-center space-x-2 ${isFullscreen ? 'text-white' : 'text-foreground'}`}>
                <Target className="h-5 w-5" />
                <span className="font-bold">{score}%</span>
              </div>

              {/* Audio Controls */}
              {selectedCase?.background_music_url && (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMusic}
                    className={isFullscreen ? 'text-white hover:text-primary' : ''}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className={isFullscreen ? 'text-white hover:text-primary' : ''}
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                </div>
              )}

              {/* Fullscreen Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFullscreen}
                className={isFullscreen ? 'text-white hover:text-primary' : ''}
              >
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>

              {/* Exit Game */}
              <Button
                variant="destructive"
                size="sm"
                onClick={exitGame}
              >
                <Square className="h-4 w-4 mr-2" />
                Exit
              </Button>
            </div>
          </div>

          {gameState === 'playing' && selectedCase?.content?.questions && (
            <div className={`flex-1 ${isFullscreen ? 'px-8 pb-8' : ''}`}>
              <Card className={`max-w-4xl mx-auto ${isFullscreen ? 'bg-black/70 border-white/20 text-white' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">
                      Question {currentQuestion + 1} of {selectedCase.content.questions.length}
                    </CardTitle>
                    <Progress 
                      value={(currentQuestion + 1) / selectedCase.content.questions.length * 100} 
                      className="w-32"
                    />
                  </div>
                  <CardDescription className={isFullscreen ? 'text-white/80' : ''}>
                    {selectedCase.content.questions[currentQuestion]?.question}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {selectedCase.content.questions[currentQuestion]?.options?.map((option, index) => (
                      <Button
                        key={index}
                        variant={selectedAnswers[currentQuestion] === option ? "default" : "outline"}
                        className={`h-auto p-4 text-left justify-start ${
                          isFullscreen && selectedAnswers[currentQuestion] !== option ? 'border-white/20 text-white hover:bg-white/10' : ''
                        }`}
                        onClick={() => selectAnswer(currentQuestion, option)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center">
                            {selectedAnswers[currentQuestion] === option && (
                              <CheckCircle className="h-4 w-4" />
                            )}
                          </div>
                          <span>{option}</span>
                        </div>
                      </Button>
                    ))}
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                      disabled={currentQuestion === 0}
                      className={isFullscreen ? 'border-white/20 text-white hover:bg-white/10' : ''}
                    >
                      Previous
                    </Button>
                    <Button 
                      onClick={nextQuestion}
                      disabled={!selectedAnswers[currentQuestion]}
                    >
                      {currentQuestion === selectedCase.content.questions.length - 1 ? 'Complete' : 'Next'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {gameState === 'completed' && gameResults && (
            <div className={`flex-1 ${isFullscreen ? 'px-8 pb-8' : ''}`}>
              <Card className={`max-w-2xl mx-auto ${isFullscreen ? 'bg-black/70 border-white/20 text-white' : ''}`}>
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl mb-4">
                    {gameResults.finalScore >= 80 ? '🏆' : gameResults.finalScore >= 60 ? '⭐' : '📊'} Game Complete!
                  </CardTitle>
                  <div className="text-6xl font-bold text-primary mb-2">
                    {gameResults.finalScore}%
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">{gameResults.correctAnswers}</div>
                      <div className={`text-sm ${isFullscreen ? 'text-white/80' : 'text-muted-foreground'}`}>
                        Correct Answers
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{formatTime(gameResults.timeTaken)}</div>
                      <div className={`text-sm ${isFullscreen ? 'text-white/80' : 'text-muted-foreground'}`}>
                        Time Taken
                      </div>
                    </div>
                  </div>

                  {gameResults.timeBonus > 0 && (
                    <div className="text-center p-4 bg-primary/10 rounded-lg">
                      <Trophy className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <div className="font-semibold">Time Bonus: +{gameResults.timeBonus} points!</div>
                    </div>
                  )}

                  <div className="flex justify-center space-x-4">
                    <Button onClick={exitGame}>
                      Back to Menu
                    </Button>
                    <Button variant="outline" onClick={() => startGame(selectedCase)}>
                      Play Again
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {!isFullscreen && <Footer />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Case Files Challenge
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Interactive detective-style games to sharpen your critical thinking skills
          </p>
          
          {!user && (
            <div className="bg-primary/10 p-6 rounded-lg mb-8">
              <p className="text-lg mb-4">Sign in to track your progress and unlock achievements!</p>
              <Button asChild>
                <a href="/auth">Sign In to Play</a>
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {caseFiles.map((caseFile) => (
            <Card key={caseFile.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{caseFile.title}</CardTitle>
                  <Badge variant="outline" className={getDifficultyColor(caseFile.difficulty_level)}>
                    {getDifficultyLabel(caseFile.difficulty_level)}
                  </Badge>
                </div>
                <CardDescription>{caseFile.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Category: {caseFile.category}</span>
                    <span className="flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      Difficulty {caseFile.difficulty_level}/5
                    </span>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={() => user ? startGame(caseFile) : window.location.href = '/auth'}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Case
                  </Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Discuss Case
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Discussion: {caseFile.title}</DialogTitle>
                      </DialogHeader>
                      <DiscussionForum 
                        caseFileId={caseFile.id} 
                        caseFileTitle={caseFile.title}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {caseFiles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No case files available at the moment.</p>
            <p className="text-muted-foreground">Check back later for new challenges!</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CaseFiles;