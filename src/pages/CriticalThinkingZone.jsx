import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Brain, Trophy, Target, CheckCircle, X, AlertTriangle, Clock, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// reCAPTCHA-style Case File Game Component
const CaseFileGame = () => {
  const [currentCase, setCurrentCase] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const cases = [
    {
      id: 1,
      type: 'image',
      content: '📸 Celebrity spotted at secret meeting with aliens! 👽',
      headline: 'BREAKING: Famous Actor Confirms Alien Contact',
      source: 'TotallyRealNews.com',
      indicators: ['Sensational headline', 'Unreliable source', 'No credible evidence'],
      correct: 'fake',
      explanation: 'This is fake news. The sensational headline, unreliable source, and lack of credible evidence are red flags.'
    },
    {
      id: 2,
      type: 'text',
      content: 'Scientists at Harvard University published a peer-reviewed study showing climate change effects on polar ice caps.',
      headline: 'Harvard Study: Polar Ice Melting Faster Than Expected',
      source: 'Harvard Climate Research Journal',
      indicators: ['Credible institution', 'Peer-reviewed', 'Scientific evidence'],
      correct: 'real',
      explanation: 'This appears to be real news. Harvard is a credible institution, the study is peer-reviewed, and it presents scientific evidence.'
    },
    {
      id: 3,
      type: 'social',
      content: '🚨 URGENT: New vaccine contains microchips to track you! Share before they delete this! 🚨',
      headline: 'EXPOSED: Government Tracking Chips in Vaccines',
      source: 'Anonymous Facebook Post',
      indicators: ['Fear-mongering language', 'Anonymous source', 'Conspiracy theory'],
      correct: 'fake',
      explanation: 'This is misinformation. The fear-mongering language, anonymous source, and conspiracy theory content are clear warning signs.'
    }
  ];

  useEffect(() => {
    let timer;
    if (gameStarted && timeLeft > 0 && !showResult) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !showResult) {
      handleTimeUp();
    }
    return () => clearTimeout(timer);
  }, [gameStarted, timeLeft, showResult]);

  const startGame = () => {
    setGameStarted(true);
    setCurrentCase(0);
    setScore(0);
    setTimeLeft(30);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    if (answer === cases[currentCase].correct) {
      setScore(score + 1);
    }
  };

  const handleTimeUp = () => {
    setShowResult(true);
    setSelectedAnswer('timeout');
  };

  const nextCase = () => {
    if (currentCase < cases.length - 1) {
      setCurrentCase(currentCase + 1);
      setTimeLeft(30);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Game completed
      setGameStarted(false);
    }
  };

  const currentCaseData = cases[currentCase];

  if (!gameStarted) {
    return (
      <Card className="glass-card max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4">🕵️</div>
          <CardTitle className="text-2xl gradient-text">Case File Challenge</CardTitle>
          <p className="text-muted-foreground">
            Test your ability to spot fake news! Analyze each case and determine if it's real or fake.
          </p>
        </CardHeader>
        <CardContent className="text-center">
          <div className="space-y-4 mb-6">
            <div className="flex justify-around text-sm">
              <div className="text-center">
                <div className="font-bold text-lg">{cases.length}</div>
                <div className="text-muted-foreground">Cases</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">30s</div>
                <div className="text-muted-foreground">Per Case</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">100</div>
                <div className="text-muted-foreground">Max Score</div>
              </div>
            </div>
          </div>
          <Button onClick={startGame} className="hover-lift">
            <Brain className="mr-2 h-4 w-4" />
            Start Challenge
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge variant="outline">Case {currentCase + 1}/{cases.length}</Badge>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-warning" />
              <span className="font-bold">{score}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className={`font-bold ${timeLeft <= 10 ? 'text-destructive' : ''}`}>
              {timeLeft}s
            </span>
          </div>
        </div>
        <Progress value={(timeLeft / 30) * 100} className="mt-2" />
      </CardHeader>
      
      <CardContent className="space-y-6">
        {!showResult ? (
          <>
            <div className="p-6 bg-background-alt rounded-lg border-2 border-dashed border-border">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold mb-2">{currentCaseData.headline}</h3>
                <Badge variant="secondary">{currentCaseData.source}</Badge>
              </div>
              <div className="text-lg text-center py-8 bg-background rounded-lg">
                {currentCaseData.content}
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg font-semibold mb-4">Is this REAL or FAKE news?</p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => handleAnswer('real')}
                  variant="outline"
                  size="lg"
                  className="hover-lift px-8"
                >
                  <CheckCircle className="mr-2 h-5 w-5 text-success" />
                  REAL
                </Button>
                <Button
                  onClick={() => handleAnswer('fake')}
                  variant="outline"
                  size="lg"
                  className="hover-lift px-8"
                >
                  <X className="mr-2 h-5 w-5 text-destructive" />
                  FAKE
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">
              {selectedAnswer === 'timeout' ? '⏰' : 
               selectedAnswer === currentCaseData.correct ? '✅' : '❌'}
            </div>
            
            <div>
              {selectedAnswer === 'timeout' ? (
                <h3 className="text-xl font-bold text-warning">Time's Up!</h3>
              ) : selectedAnswer === currentCaseData.correct ? (
                <h3 className="text-xl font-bold text-success">Correct!</h3>
              ) : (
                <h3 className="text-xl font-bold text-destructive">Incorrect!</h3>
              )}
            </div>

            <div className="p-4 bg-background-alt rounded-lg text-left">
              <h4 className="font-semibold mb-2">Explanation:</h4>
              <p className="text-muted-foreground mb-4">{currentCaseData.explanation}</p>
              
              <h4 className="font-semibold mb-2">Key Indicators:</h4>
              <div className="flex flex-wrap gap-2">
                {currentCaseData.indicators.map((indicator, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {indicator}
                  </Badge>
                ))}
              </div>
            </div>

            <Button onClick={nextCase} className="hover-lift">
              {currentCase < cases.length - 1 ? 'Next Case' : 'View Results'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Quiz Component
const QuizGame = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);

  const questions = [
    {
      question: "What is the first thing you should do when you see a suspicious news article?",
      options: [
        "Share it immediately",
        "Check the source and publication date",
        "Believe it if it confirms your views",
        "Ignore it completely"
      ],
      correct: 1,
      explanation: "Always verify the source and check when the article was published before believing or sharing."
    },
    {
      question: "Which of these is a red flag for fake news?",
      options: [
        "Multiple credible sources",
        "Sensational headlines with lots of caps and emojis",
        "Author's name and credentials listed",
        "Recent publication date"
      ],
      correct: 1,
      explanation: "Sensational headlines with excessive capitalization and emojis are common in fake news."
    },
    {
      question: "What does 'confirmation bias' mean?",
      options: [
        "Confirming facts with multiple sources",
        "The tendency to search for information that confirms our existing beliefs",
        "A bias towards positive news",
        "Confirming the author's identity"
      ],
      correct: 1,
      explanation: "Confirmation bias is our tendency to favor information that confirms our preexisting beliefs."
    }
  ];

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
  };

  const handleAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    if (answerIndex === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setQuizStarted(false);
    }
  };

  if (!quizStarted) {
    return (
      <Card className="glass-card max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4">🧠</div>
          <CardTitle className="text-2xl gradient-text">Media Literacy Quiz</CardTitle>
          <p className="text-muted-foreground">
            Test your knowledge of media literacy and critical thinking skills.
          </p>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={startQuiz} className="hover-lift">
            <Brain className="mr-2 h-4 w-4" />
            Start Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <Card className="glass-card max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="outline">Question {currentQuestion + 1}/{questions.length}</Badge>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-warning" />
            <span className="font-bold">{score}/{questions.length}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <h3 className="text-xl font-bold text-center">{currentQ.question}</h3>
        
        <div className="grid gap-3">
          {currentQ.options.map((option, index) => (
            <Button
              key={index}
              variant={selectedAnswer === index ? 
                (index === currentQ.correct ? "default" : "destructive") : 
                "outline"
              }
              className="justify-start p-4 h-auto hover-lift"
              onClick={() => handleAnswer(index)}
              disabled={selectedAnswer !== null}
            >
              <span className="font-semibold mr-2">{String.fromCharCode(65 + index)}.</span>
              {option}
            </Button>
          ))}
        </div>

        {selectedAnswer !== null && (
          <div className="p-4 bg-background-alt rounded-lg">
            <h4 className="font-semibold mb-2">
              {selectedAnswer === currentQ.correct ? '✅ Correct!' : '❌ Incorrect!'}
            </h4>
            <p className="text-muted-foreground">{currentQ.explanation}</p>
            <Button onClick={nextQuestion} className="mt-4 hover-lift">
              {currentQuestion < questions.length - 1 ? 'Next Question' : 'View Results'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const CriticalThinkingZone = () => {
  const leaderboard = [
    { rank: 1, name: 'Alex M.', score: 2850, badge: '🏆' },
    { rank: 2, name: 'Sarah K.', score: 2720, badge: '🥈' },
    { rank: 3, name: 'Jordan P.', score: 2650, badge: '🥉' },
    { rank: 4, name: 'Maya C.', score: 2580, badge: '⭐' },
    { rank: 5, name: 'You', score: 2340, badge: '🎯' },
  ];

  const achievements = [
    { name: 'Fact Checker', description: 'Completed 10 case files', icon: '🕵️', unlocked: true },
    { name: 'Critical Thinker', description: 'Perfect score on quiz', icon: '🧠', unlocked: true },
    { name: 'Debunker', description: 'Identified 50 fake news articles', icon: '🚫', unlocked: false },
    { name: 'Media Guru', description: 'Reached expert level', icon: '👑', unlocked: false },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-glass" />
          <div className="container relative z-10 text-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Critical Thinking Zone
              </h1>
              <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                Sharpen your media literacy skills through interactive games, quizzes, and case studies. Learn to spot misinformation like a pro!
              </p>
            </div>
          </div>
        </section>

        {/* Games Section */}
        <section className="py-20">
          <div className="container">
            <Tabs defaultValue="games" className="w-full">
              <TabsList className="grid w-full grid-cols-3 max-w-xl mx-auto mb-12">
                <TabsTrigger value="games" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Games
                </TabsTrigger>
                <TabsTrigger value="leaderboard" className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  Leaderboard
                </TabsTrigger>
                <TabsTrigger value="achievements" className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Badges
                </TabsTrigger>
              </TabsList>

              {/* Games */}
              <TabsContent value="games" className="space-y-16">
                <div>
                  <h2 className="text-2xl font-bold text-center mb-8 gradient-text">
                    Case File Challenge
                  </h2>
                  <CaseFileGame />
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-center mb-8 gradient-text">
                    Quick Quiz
                  </h2>
                  <QuizGame />
                </div>
              </TabsContent>

              {/* Leaderboard */}
              <TabsContent value="leaderboard">
                <Card className="glass-card max-w-2xl mx-auto">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl gradient-text">
                      <Trophy className="inline-block mr-2 h-6 w-6" />
                      Leaderboard
                    </CardTitle>
                    <p className="text-muted-foreground">Top media literacy champions</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {leaderboard.map((player) => (
                        <div 
                          key={player.rank}
                          className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 hover-lift ${
                            player.name === 'You' ? 'bg-gradient-primary/10 border border-primary/20' : 'bg-background-alt'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="text-2xl">{player.badge}</div>
                            <div>
                              <div className="font-semibold">{player.name}</div>
                              <div className="text-sm text-muted-foreground">Rank #{player.rank}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg">{player.score.toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground">points</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Achievements */}
              <TabsContent value="achievements">
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {achievements.map((achievement, index) => (
                    <Card 
                      key={index}
                      className={`glass-card hover-lift transition-all duration-300 ${
                        achievement.unlocked ? 'border-success/50 bg-success/5' : 'opacity-60'
                      }`}
                    >
                      <CardContent className="flex items-center gap-4 p-6">
                        <div className={`text-4xl ${achievement.unlocked ? 'animate-pulse-glow' : ''}`}>
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold">{achievement.name}</h3>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          <Badge 
                            variant={achievement.unlocked ? "default" : "secondary"}
                            className="mt-2"
                          >
                            {achievement.unlocked ? 'Unlocked' : 'Locked'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CriticalThinkingZone;