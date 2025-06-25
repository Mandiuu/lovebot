import React, { useState, useRef, useEffect } from 'react';
import { Heart, Send, User, Users, Home, MessageCircle, Share2, Copy, X, Settings, Shield, Trophy, Star, Play, Zap, Target, Award } from 'lucide-react';

const LoveBot = () => {
  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'victory'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [sessionData, setSessionData] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentCategory, setCurrentCategory] = useState('');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [showAiResponse, setShowAiResponse] = useState(false);
  const [usedQuestions, setUsedQuestions] = useState([]);
  const [partnerQuestions, setPartnerQuestions] = useState([]);
  const [customQuestions, setCustomQuestions] = useState([]);
  
  // Settings - simplified since API key comes from .env
  const [useAI, setUseAI] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  
  // Modals - FIXED: Proper state management
  const [showCustomQuestionModal, setShowCustomQuestionModal] = useState(false);
  const [newCustomQuestion, setNewCustomQuestion] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [comparisonResults, setComparisonResults] = useState(null);
  const [showChallengeShareModal, setShowChallengeShareModal] = useState(false);

  const questionCategories = {
    getting_to_know: {
      icon: User,
      name: "Getting to Know Each Other",
      color: "from-purple-400 to-pink-400",
      questions: [
        "What's your biggest dream or life goal?",
        "What makes you laugh the hardest?",
        "What's your biggest pet peeve?",
        "What's your favorite childhood memory?",
        "What's something you're secretly proud of?",
        "What's your go-to comfort food?",
        "What's your favorite way to spend a weekend?",
        "What song always gets you dancing?",
        "What's your biggest fear?",
        "What superpower would you want to have?"
      ]
    },
    relationship_dynamics: {
      icon: Heart,
      name: "Your Relationship Together", 
      color: "from-red-400 to-pink-400",
      questions: [
        "What's your love language?",
        "How do you prefer to resolve arguments?",
        "What's your favorite memory of you two together?",
        "What's something small your partner does that makes you happy?",
        "How do you show when you're stressed?",
        "What's your idea of the perfect date night?",
        "What's one thing you always say about your partner to others?",
        "How do you like to celebrate achievements?",
        "What's your favorite thing about your relationship?",
        "What's a relationship goal you have?"
      ]
    },
    daily_life: {
      icon: Home,
      name: "Daily Life & Habits",
      color: "from-blue-400 to-teal-400",
      questions: [
  "What's your morning routine like?",
  "What side of the bed do you sleep on?",
  "What's your favorite room in your home?",
  "What's your biggest guilty pleasure?",
  "How do you like your coffee or tea?",
  "What's your go-to outfit for feeling confident?",
  "What time do you naturally wake up?",
  "What's your favorite app on your phone?",
  "What's your shopping weakness?",
  "What's your ideal temperature for the house?",
  "What's the weirdest food combination you secretly love?",
  "If you could have any superpower for just one day, what would you do?",
  "What song do you sing in the shower when nobody's listening?",
  "What's your most embarrassing autocorrect fail?",
  "If you had to eat one meal for the rest of your life, what would it be?",
  "What's the strangest thing you believed as a child?",
  "Which celebrity would you want to be stuck in an elevator with?",
  "What's your go-to dance move when you think nobody's watching?",
  "If you could master any skill instantly, what would it be?",
  "What's the most random thing in your search history right now?",
  "What's a tradition from your childhood you want to keep?",
  "What's something you've changed your mind about completely?",
  "What's your most prized possession and why?",
  "What's a compliment you received that you'll never forget?",
  "What's your biggest 'what if' in life?",
  "What's something you're secretly proud of but rarely talk about?",
  "What's the best advice you've ever received?",
  "What's a fear you had as a kid that seems silly now?",
  "What's something you wish you could tell your teenage self?",
  "What's your favorite way to spend a rainy day?",
  "If money wasn't a factor, what would your dream vacation look like?",
  "What's on your bucket list that might surprise me?",
  "If you could live anywhere in the world for a year, where would it be?",
  "What's a skill you've always wanted to learn but haven't yet?",
  "If you could have dinner with anyone, dead or alive, who would it be?",
  "What's your dream job that has nothing to do with your current career?",
  "If you could change one thing about the world, what would it be?",
  "What's something you want to accomplish in the next five years?",
  "If you won the lottery tomorrow, what's the first thing you'd do?",
  "What's a cause you're passionate about?",
  "What's your love language and how did you discover it?",
  "What's the most romantic gesture someone could do for you?",
  "What's your idea of the perfect date night at home?",
  "What's something I do that makes you feel most loved?",
  "What's a relationship milestone you're looking forward to?",
  "What's your favorite memory of us together so far?",
  "How do you prefer to resolve conflicts in relationships?",
  "What's something you've learned about love from your parents?",
  "What's your favorite way to show affection?",
  "What does 'home' mean to you?",
  "If we could time travel together, what era would you want to visit?",
  "If we had to survive a zombie apocalypse, what would your strategy be?",
  "If you could switch lives with me for a day, what would you do?",
  "If we were contestants on a reality show, which one would we win?",
  "If you could read my mind for one hour, would you want to?",
  "If we had to live off-grid for a month, what would you miss most?",
  "If you could give our relationship a theme song, what would it be?",
  "If we were characters in a movie, what genre would our story be?",
  "If you could plan the perfect surprise for me, what would it involve?",
  "If we could have any animal as a pet (real or mythical), what would you choose?"
]
    },
    fun_preferences: {
      icon: Users,
      name: "Favorites & Preferences",
      color: "from-green-400 to-blue-400",
      questions: [
        "What's your favorite movie or TV show right now?",
        "What's your dream vacation destination?",
        "What's your favorite season?",
        "What type of music do you listen to when you're happy?",
        "What's your favorite type of exercise or activity?",
        "What's your go-to takeout order?",
        "What's your favorite holiday?",
        "What's a hobby you would love to try?",
        "What's your favorite way to unwind after a hard day?",
        "What's your dream car?"
      ]
    }
  };

  const totalQuestions = partnerQuestions.length > 0 ? partnerQuestions.length : 10;

  useEffect(() => {
    // Load saved custom questions
    const savedCustomQuestions = JSON.parse(localStorage.getItem('lovebot_custom_questions') || '[]');
    setCustomQuestions(savedCustomQuestions);

    // Check for environment variable first
    const envApiKey = process.env.REACT_APP_GEMINI_API_KEY;
    
    if (envApiKey) {
      setGeminiApiKey(envApiKey);
      setUseAI(true);
      console.log('✅ Gemini API key loaded from environment variable');
    } else {
      console.log('⚠️ No Gemini API key found in environment variables');
      console.log('Add REACT_APP_GEMINI_API_KEY to your .env file for AI features');
    }

    // Check for shared challenge
    const urlParams = new URLSearchParams(window.location.search);
    const sharedQuestions = urlParams.get('questions');
    const originalAnswers = urlParams.get('answers');
    const compactChallenge = urlParams.get('c');
    
    if (compactChallenge) {
      try {
        const challengeData = JSON.parse(atob(compactChallenge));
        const questions = challengeData.q.map(item => ({
          question: item.t,
          category: item.c
        }));
        const answers = challengeData.q.map(item => ({
          question: item.t,
          answer: item.a,
          category: item.c
        }));
        
        setPartnerQuestions(questions);
        sessionStorage.setItem('originalAnswers', JSON.stringify(answers));
      } catch (error) {
        console.error('Error parsing compact challenge:', error);
      }
    } else if (sharedQuestions) {
      // Legacy support for old URL format
      try {
        const questions = JSON.parse(decodeURIComponent(sharedQuestions));
        setPartnerQuestions(questions);
        
        if (originalAnswers) {
          try {
            const parsed = JSON.parse(decodeURIComponent(originalAnswers));
            sessionStorage.setItem('originalAnswers', JSON.stringify(parsed));
          } catch (e) {
            console.error('Error parsing original answers:', e);
          }
        }
      } catch (error) {
        console.error('Error parsing shared questions:', error);
      }
    }
  }, []);

  const calculateScore = (answer) => {
    const words = answer.trim().split(/\s+/).length;
    if (words >= 10) return 100;
    if (words >= 5) return 75;
    if (words >= 2) return 50;
    return 25;
  };

  const calculateLevel = (totalScore) => {
    return Math.floor(totalScore / 500) + 1;
  };

  const getRanking = (finalScore, totalQuestions) => {
    const percentage = (finalScore / (totalQuestions * 100)) * 100;
    
    if (percentage >= 80) return { title: "Love Expert", emoji: "🏆", color: "text-yellow-500" };
    if (percentage >= 60) return { title: "Pretty Good", emoji: "🌟", color: "text-blue-500" };
    if (percentage >= 40) return { title: "Getting There", emoji: "💪", color: "text-green-500" };
    return { title: "Room to Grow", emoji: "🌱", color: "text-purple-500" };
  };

  const formatQuestion = (question, isPartnerChallenge = false) => {
    if (isPartnerChallenge) {
      // Partner answering about themselves - keep as "your"
      return question;
    } else {
      // Original player guessing about partner - convert "your" to "your partner's"
      return question
        .replace(/What's your /g, "What's your partner's ")
        .replace(/What time do you /g, "What time does your partner ")
        .replace(/What song always gets you /g, "What song always gets your partner ")
        .replace(/What superpower would you /g, "What superpower would your partner ")
        .replace(/How do you /g, "How does your partner ")
        .replace(/What's something small your partner does that makes you happy/g, "What's something small you do that makes your partner happy");
    }
  };

  const getRandomQuestion = () => {
    if (partnerQuestions.length > 0) {
      const availablePartnerQuestions = partnerQuestions.filter(q => !usedQuestions.includes(q.question));
      
      if (availablePartnerQuestions.length === 0) {
        setUsedQuestions([]);
        const selected = partnerQuestions[0];
        setCurrentCategory(selected.category);
        const formattedQuestion = formatQuestion(selected.question, true); // Partner challenge
        setCurrentQuestion(formattedQuestion);
        setUsedQuestions([formattedQuestion]);
        return formattedQuestion;
      }
      
      const randomIndex = Math.floor(Math.random() * availablePartnerQuestions.length);
      const selected = availablePartnerQuestions[randomIndex];
      
      setCurrentCategory(selected.category);
      const formattedQuestion = formatQuestion(selected.question, true); // Partner challenge
      setCurrentQuestion(formattedQuestion);
      setUsedQuestions(prev => [...prev, formattedQuestion]);
      
      return formattedQuestion;
    }

    // Use pre-written questions (original logic)
    const allQuestions = [];
    Object.keys(questionCategories).forEach(categoryKey => {
      questionCategories[categoryKey].questions.forEach(questionBase => {
        allQuestions.push({
          question: questionBase,
          category: categoryKey,
          type: 'preset'
        });
      });
    });
    
    customQuestions.forEach(questionBase => {
      allQuestions.push({
        question: questionBase,
        category: 'custom',
        type: 'custom'
      });
    });
    
    const availableQuestions = allQuestions.filter(q => !usedQuestions.includes(q.question));
    
    if (availableQuestions.length === 0) {
      setUsedQuestions([]);
      const randomIndex = Math.floor(Math.random() * allQuestions.length);
      const selected = allQuestions[randomIndex];
      setCurrentCategory(selected.category);
      const formattedQuestion = formatQuestion(selected.question, false); // Original game
      setCurrentQuestion(formattedQuestion);
      setUsedQuestions([formattedQuestion]);
      return formattedQuestion;
    }
    
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const selected = availableQuestions[randomIndex];
    
    setCurrentCategory(selected.category);
    const formattedQuestion = formatQuestion(selected.question, false); // Original game
    setCurrentQuestion(formattedQuestion);
    setUsedQuestions(prev => [...prev, formattedQuestion]);
    
    return formattedQuestion;
  };

  const callGeminiAPI = async (userAnswer, question) => {
    if (!geminiApiKey || !useAI) return null;
    
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are LoveBot, a playful and warm relationship game bot. A player just answered a relationship question. Respond with 1 short, funny but kind comment. Be playful and humorous while staying supportive - think "adorable friend" not "sarcastic critic". Keep it under 18 words, be lighthearted and sweet. Use maximum 1 emoji.

IMPORTANT: Be funny in a warm, supportive way. Never mock, judge, or suggest answers aren't good enough. Make gentle jokes or cute observations, not criticisms.

Question: "${question}"
Answer: "${userAnswer}"

Give a short, playful, supportive response:`
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      if (error.message?.includes('401') || error.message?.includes('403')) {
        return '❌ Invalid Gemini API key. Please check your API key in settings.';
      }
    }
    return null;
  };

  const startGame = () => {
    setGameState('playing');
    setCurrentQuestionIndex(0);
    setScore(0);
    setLevel(1);
    setSessionData([]);
    setUsedQuestions([]);
    
    const firstQuestion = getRandomQuestion();
    setCurrentQuestion(firstQuestion);
  };

  const handleAnswer = async () => {
    if (!inputText.trim()) return;

    const answerScore = calculateScore(inputText);
    const newScore = score + answerScore;
    const newLevel = calculateLevel(newScore);
    
    setScore(newScore);
    setLevel(newLevel);
    
    setSessionData(prev => [...prev, {
      question: currentQuestion,
      answer: inputText,
      category: currentCategory,
      score: answerScore
    }]);

    // Get AI response
    setIsTyping(true);
    const response = await callGeminiAPI(inputText, currentQuestion);
    setIsTyping(false);
    
    if (response) {
      setAiResponse(response);
      setShowAiResponse(true);
    } else {
      const responses = [
        "Aww, that's adorable! 💕",
        "Haha, cute! ✨",
        "That's so sweet! 🥰",
        "Love that answer! 💖",
        "Aww, my heart! 💝"
      ];
      setAiResponse(responses[Math.floor(Math.random() * responses.length)]);
      setShowAiResponse(true);
    }
    
    setInputText('');
    
    // Check if game is complete
    if (currentQuestionIndex + 1 >= totalQuestions) {
      setTimeout(() => {
        setGameState('victory');
      }, 2500);
    } else {
      setTimeout(() => {
        setShowAiResponse(false);
        setCurrentQuestionIndex(prev => prev + 1);
        const nextQuestion = getRandomQuestion();
        setCurrentQuestion(nextQuestion);
      }, 2500);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAnswer();
    }
  };

  // FIXED: Real AI comparison function
  const compareAnswersWithAI = async () => {
    console.log('=== AI Comparison Debug ===');
    console.log('AI Comparison Check:', { useAI, hasApiKey: !!geminiApiKey, apiKeyLength: geminiApiKey?.length });
    console.log('Session Data:', sessionData);
    console.log('Partner Questions:', partnerQuestions);
    
    const originalAnswers = JSON.parse(sessionStorage.getItem('originalAnswers') || '[]');
    console.log('Original Answers from sessionStorage:', originalAnswers);
    
    if (!useAI || !geminiApiKey) {
      alert(`🤖 AI comparison requires Gemini API to be configured. 
      
Current status:
- AI Enabled: ${useAI ? 'Yes' : 'No'}
- API Key: ${geminiApiKey ? 'Provided' : 'Missing'}

Please add REACT_APP_GEMINI_API_KEY to your .env file to enable AI features.`);
      return;
    }

    if (originalAnswers.length === 0) {
      console.log('No original answers found in sessionStorage');
      alert('❌ No original answers found for comparison. This feature only works when responding to a partner challenge.');
      return;
    }

    console.log('Starting AI comparison with valid data...');
    setIsTyping(true);
    
    try {
      const comparisons = sessionData.map((myAnswer, index) => {
        const originalAnswer = originalAnswers.find(orig => orig.question === myAnswer.question);
        return {
          question: myAnswer.question,
          partner1Answer: originalAnswer?.answer || 'No answer',
          partner2Answer: myAnswer.answer,
          category: myAnswer.category
        };
      });

      console.log('Comparisons prepared:', comparisons);

      const prompt = `You are LoveBot, analyzing how well a couple knows each other. Compare these relationship quiz answers and rate similarity accurately.

For each question, Partner 1 was guessing about Partner 2, and Partner 2 answered about themselves.

${comparisons.map((comp, index) => `
Q${index + 1}: ${comp.question}
Partner 1's guess: "${comp.partner1Answer}"
Partner 2's actual answer: "${comp.partner2Answer}"
`).join('\n')}

Analyze each answer pair for similarity:
- Exact/very similar answers = 90-100% match
- Related concepts = 60-89% match  
- Different but reasonable = 30-59% match
- Completely different/unclear = 0-29% match

Give a compatibility score out of 10 based on actual answer similarity (not just being positive). Include:
- Overall compatibility score (be honest!)
- 2-3 specific observations about how well Partner 1 knows Partner 2
- 1 suggestion for improving their connection

Keep it under 100 words, fun but accurate!`;

      console.log('Sending prompt to Gemini API:', prompt);

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      console.log('Gemini API response status:', response.status);

      if (!response.ok) {
        console.error('Gemini API error response:', response);
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Gemini API response data:', data);
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const analysis = data.candidates[0].content.parts[0].text;
        console.log('AI Analysis received:', analysis);
        
        setComparisonResults({
          analysis,
          comparisons
        });
        console.log('Setting comparison results and opening modal...');
        setShowComparisonModal(true);
        console.log('Comparison modal should now be open');
      } else {
        console.error('Invalid response structure from AI:', data);
        throw new Error('Invalid response from AI');
      }
    } catch (error) {
      console.error('AI Comparison Error:', error);
      if (error.message?.includes('401') || error.message?.includes('403')) {
        alert('❌ Invalid Gemini API key. Please check your API key in settings.');
      } else {
        alert('❌ Sorry, I had trouble analyzing your answers. Please try again or check your API settings.');
      }
    } finally {
      console.log('Setting isTyping to false...');
      setIsTyping(false);
    }
  };

  const saveApiSettings = () => {
    // No longer needed since API key comes from .env
    console.log('API key loaded from environment variable');
  };

  const generateShortChallengeLink = (sessionData) => {
    const challengeData = {
      q: sessionData.map(item => ({
        t: item.question,
        c: item.category,
        a: item.answer
      }))
    };
    
    const encodedData = btoa(JSON.stringify(challengeData));
    return `${window.location.origin}${window.location.pathname}?c=${encodedData}`;
  };

  const shareViaEmail = (challengeLink) => {
    const subject = "💕 Love Challenge from Me!";
    const body = `Hey! I just took a fun relationship quiz and want to challenge you to take it too! 

🎮 How well do you think you know me? Answer ${sessionData.length} questions about me and let's see how you do!

Click here to start: ${challengeLink}

After you're done, we can compare our answers and see how well we really know each other! 💖

Love you! 😘`;

    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  const shareViaText = (challengeLink) => {
    const message = `💕 Hey! I made a love quiz for you! Think you know me well? Take my challenge: ${challengeLink} 🎮💖`;
    
    // Try to detect if it's mobile for SMS, otherwise copy to clipboard
    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      window.location.href = `sms:?body=${encodeURIComponent(message)}`;
    } else {
      copyToClipboard(message);
    }
  };

  const shareViaSocial = (challengeLink) => {
    const message = `💕 I created a fun relationship quiz! Think you know me well? Take my love challenge and let's see! 🎮✨ ${challengeLink}`;
    copyToClipboard(message);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard! 📋');
    } catch (err) {
      alert('Unable to copy to clipboard');
    }
  };

  // FIXED: Save custom questions to localStorage
  const saveCustomQuestion = () => {
    if (newCustomQuestion.trim()) {
      const updatedQuestions = [...customQuestions, newCustomQuestion.trim()];
      setCustomQuestions(updatedQuestions);
      localStorage.setItem('lovebot_custom_questions', JSON.stringify(updatedQuestions));
      setNewCustomQuestion('');
    }
  };

  const deleteCustomQuestion = (index) => {
    const updatedQuestions = customQuestions.filter((_, i) => i !== index);
    setCustomQuestions(updatedQuestions);
    localStorage.setItem('lovebot_custom_questions', JSON.stringify(updatedQuestions));
  };

  // MAIN GAME RENDER
  if (gameState === 'menu') {
    return (
      <div>
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl max-w-md w-full p-8 text-white">
            {partnerQuestions.length > 0 ? (
              <div className="text-center mb-8">
                <div className="bg-gradient-to-r from-pink-400 to-purple-400 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent mb-2">
                  💕 Love Challenge!
                </h1>
                <p className="text-lg opacity-90">Your partner wants to see how well you know them!</p>
              </div>
            ) : (
              <div className="text-center mb-8">
                <div className="bg-gradient-to-r from-pink-400 to-purple-400 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent mb-2">
                  LoveBot Game
                </h1>
                <p className="text-lg opacity-90">How well do you know your partner?</p>
              </div>
            )}

            <div className="space-y-3 mb-6">
              <button
                onClick={startGame}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 px-6 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-lg"
              >
                <Play className="w-5 h-5" />
                {partnerQuestions.length > 0 ? 'Accept Challenge!' : 'Start Love Game'}
              </button>
              
              <button
                onClick={() => setShowCustomQuestionModal(true)}
                className="w-full bg-white/20 hover:bg-white/30 px-4 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all"
              >
                <Star className="w-4 h-4" />
                Custom Questions
              </button>
            </div>

            {partnerQuestions.length > 0 && (
              <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl p-6 mb-6 border border-pink-300/30">
                <div className="text-center">
                  <div className="text-2xl mb-2">💌</div>
                  <h3 className="text-lg font-bold text-white mb-2">Challenge Received!</h3>
                  <p className="text-sm opacity-90 mb-3">
                    Your partner has created {partnerQuestions.length} personalized {partnerQuestions.length === 1 ? 'question' : 'questions'} about themselves.
                  </p>
                  <p className="text-xs opacity-80">
                    Can you prove how well you really know them? 💕
                  </p>
                </div>
              </div>
            )}

            <div className="text-center text-sm opacity-80">
              {partnerQuestions.length > 0 ? 
                `🎯 Think you can ace ${totalQuestions} ${totalQuestions === 1 ? 'question' : 'questions'} about your partner?` : 
                `🎮 Answer ${totalQuestions} ${totalQuestions === 1 ? 'question' : 'questions'} about your relationship!`
              }
            </div>
          </div>
        </div>

        {/* Custom Questions Modal */}
        {showCustomQuestionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">✏️ Custom Questions</h3>
                <button onClick={() => setShowCustomQuestionModal(false)} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add Custom Question
                  </label>
                  <textarea
                    value={newCustomQuestion}
                    onChange={(e) => setNewCustomQuestion(e.target.value)}
                    placeholder="e.g., What's the funniest thing I've ever done?"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-20 resize-none"
                  />
                </div>
                
                <button
                  onClick={saveCustomQuestion}
                  disabled={!newCustomQuestion.trim()}
                  className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 disabled:opacity-50 mb-4"
                >
                  ✅ Add Question
                </button>
                
                {customQuestions.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-700">Your Questions ({customQuestions.length})</h4>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {customQuestions.map((q, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm flex-1">{q}</span>
                          <button
                            onClick={() => deleteCustomQuestion(index)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Challenge Share Modal */}
        {showChallengeShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">💕 Share Your Challenge</h3>
                <button onClick={() => setShowChallengeShareModal(false)} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6">
                <p className="text-gray-600 mb-6 text-center">
                  Choose how you'd like to share your love challenge with your partner!
                </p>
                
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      shareViaEmail(generateShortChallengeLink(sessionData));
                      setShowChallengeShareModal(false);
                    }}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-colors"
                  >
                    <span className="text-lg">📧</span>
                    <div className="text-left">
                      <div className="font-medium">Send via Email</div>
                      <div className="text-xs opacity-90">Opens your email app with a cute message</div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => {
                      copyToClipboard(generateShortChallengeLink(sessionData));
                      setShowChallengeShareModal(false);
                    }}
                    className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    <div className="text-left">
                      <div className="font-medium">Copy Link Only</div>
                      <div className="text-xs opacity-90">Just the challenge link</div>
                    </div>
                  </button>
                </div>
                
                <div className="mt-6 p-3 bg-pink-50 rounded-lg">
                  <p className="text-xs text-pink-700 text-center">
                    💡 Your partner will answer the same questions you did, then you can compare results!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (gameState === 'playing') {
    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
    const categoryInfo = questionCategories[currentCategory] || { color: "from-purple-400 to-pink-400", name: "Custom Question" };
    
    return (
      <div>
        <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold">Let's Play! 👋</h2>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowChallengeShareModal(true)}
                    disabled={sessionData.length === 0}
                    className="bg-purple-500/20 hover:bg-purple-500/30 disabled:bg-gray-500/20 disabled:opacity-50 px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1"
                  >
                    <Share2 className="w-3 h-3" />
                    Share Challenge
                  </button>
                  <button
                    onClick={() => setGameState('menu')}
                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                  >
                    ← Back to Menu
                  </button>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-white/20 rounded-full h-3 mb-2">
                <div 
                  className="bg-gradient-to-r from-pink-400 to-purple-400 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-xs opacity-80 text-center">Question {currentQuestionIndex + 1} of {totalQuestions}</div>
            </div>

            {/* Question Card */}
            <div className={`bg-gradient-to-br ${categoryInfo.color} rounded-3xl p-1 mb-6 shadow-2xl transform transition-all duration-500 ${showAiResponse ? 'scale-105' : ''}`}>
              <div className="bg-white rounded-3xl p-8">
                <div className="text-center mb-6">
                  <div className={`bg-gradient-to-r ${categoryInfo.color} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}>
                    {React.createElement(categoryInfo.icon || Star, { className: "w-8 h-8 text-white" })}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 leading-tight">
                    {currentQuestion}
                  </h3>
                </div>

                {showAiResponse ? (
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-6 mb-4">
                      <div className="text-lg font-medium text-gray-800 mb-2">
                        {isTyping ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        ) : (
                          aiResponse
                        )}
                      </div>
                    </div>
                    
                    {!isTyping && currentQuestionIndex + 1 < totalQuestions && (
                      <div className="text-gray-600">
                        Next question coming up...
                      </div>
                    )}
                    
                    {!isTyping && currentQuestionIndex + 1 >= totalQuestions && (
                      <div className="text-purple-600 font-bold text-lg">
                        🎉 Game Complete! Calculating final score...
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your answer here... (Be detailed for the best experience!)"
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 h-32 resize-none text-gray-800"
                      autoFocus
                    />
                    
                    <button
                      onClick={handleAnswer}
                      disabled={!inputText.trim() || isTyping}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-lg"
                    >
                      <Send className="w-5 h-5" />
                      Submit Answer
                    </button>
                    
                    <div className="text-center text-sm text-gray-600">
                      💡 Tip: Give detailed answers for the best experience!
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Challenge Share Modal for playing state */}
        {showChallengeShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">💕 Share Your Challenge</h3>
                <button onClick={() => setShowChallengeShareModal(false)} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6">
                <p className="text-gray-600 mb-6 text-center">
                  Choose how you'd like to share your love challenge with your partner!
                </p>
                
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      shareViaEmail(generateShortChallengeLink(sessionData));
                      setShowChallengeShareModal(false);
                    }}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-colors"
                  >
                    <span className="text-lg">📧</span>
                    <div className="text-left">
                      <div className="font-medium">Send via Email</div>
                      <div className="text-xs opacity-90">Opens your email app with a cute message</div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => {
                      copyToClipboard(generateShortChallengeLink(sessionData));
                      setShowChallengeShareModal(false);
                    }}
                    className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    <div className="text-left">
                      <div className="font-medium">Copy Link Only</div>
                      <div className="text-xs opacity-90">Just the challenge link</div>
                    </div>
                  </button>
                </div>
                
                <div className="mt-6 p-3 bg-pink-50 rounded-lg">
                  <p className="text-xs text-pink-700 text-center">
                    💡 Your partner will answer the same questions you did, then you can compare results!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (gameState === 'victory') {
    const ranking = getRanking(score, totalQuestions);
    const averageScore = Math.round(score / totalQuestions);
    
    return (
      <div>
        <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 text-center">
            <div className="mb-8">
              <div className="text-8xl mb-4 animate-bounce">{ranking.emoji}</div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Game Complete!</h1>
              <div className={`text-2xl font-bold ${ranking.color} mb-4`}>
                {ranking.title}
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 mb-8">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-purple-600">{score}</div>
                  <div className="text-sm text-gray-600">Total Score</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-pink-600">{averageScore}</div>
                  <div className="text-sm text-gray-600">Avg per Question</div>
                </div>
                <div className="col-span-2">
                  <div className="text-2xl font-bold text-indigo-600">Level {level}</div>
                  <div className="text-sm text-gray-600">Final Level Reached</div>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {/* Challenge Partner Button */}
              {sessionData.length > 0 && partnerQuestions.length === 0 && (
                <button
                  onClick={() => setShowChallengeShareModal(true)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-6 py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-lg"
                >
                  <Share2 className="w-5 h-5" />
                  Challenge Your Partner!
                </button>
              )}

              {/* AI Comparison Button */}
              {sessionData.length > 0 && partnerQuestions.length > 0 && (
                <button
                  onClick={() => compareAnswersWithAI()}
                  disabled={isTyping}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:opacity-50 px-6 py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-lg"
                >
                  {isTyping ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      🤖 Compare Answers with AI
                    </>
                  )}
                </button>
              )}
              
              {/* Play Again */}
              <button
                onClick={() => {
                  setGameState('menu');
                  setCurrentQuestionIndex(0);
                  setScore(0);
                  setLevel(1);
                  setSessionData([]);
                  setUsedQuestions([]);
                  setShowAiResponse(false);
                  setPartnerQuestions([]);
                  setComparisonResults(null);
                }}
                className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 px-6 py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-lg"
              >
                <Play className="w-5 h-5" />
                Play Again
              </button>
              
              {/* Detailed Results Button */}
              <button
                onClick={() => setShowShareModal(true)}
                disabled={sessionData.length === 0}
                className="w-full bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-medium text-gray-800 flex items-center justify-center gap-2 transition-all"
              >
                <Trophy className="w-4 h-4" />
                View Detailed Results ({sessionData.length} answers)
              </button>
            </div>

            <div className="text-center text-sm text-gray-600">
              🎮 Thanks for playing LoveBot Game!
            </div>
          </div>
        </div>

        {/* Victory screen modals */}
        {showComparisonModal && comparisonResults && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" 
            style={{ zIndex: 99999 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowComparisonModal(false);
              }
            }}
          >
            <div 
              className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b bg-purple-50">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  🤖 AI Relationship Analysis
                </h3>
                <button
                  onClick={() => {
                    setShowComparisonModal(false);
                    setComparisonResults(null);
                  }}
                  className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="mb-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border-l-4 border-pink-400">
                  <h4 className="font-bold text-lg mb-3 text-pink-800">💕 Your Relationship Insights</h4>
                  <div className="whitespace-pre-line text-gray-700 leading-relaxed">{comparisonResults.analysis}</div>
                </div>
                
                <h4 className="font-bold text-lg mb-4 text-gray-800">📊 Answer Comparison</h4>
                <div className="space-y-4">
                  {comparisonResults.comparisons.map((comp, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50">
                      <p className="font-semibold text-sm text-gray-600 mb-3">
                        Q{index + 1}: {comp.question}
                      </p>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="bg-blue-100 p-3 rounded border-l-4 border-blue-400">
                          <p className="text-xs font-medium text-blue-800 mb-1">Your Partner's Answer:</p>
                          <p className="text-sm text-blue-700">{comp.partner1Answer}</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded border-l-4 border-green-400">
                          <p className="text-xs font-medium text-green-800 mb-1">Your Answer:</p>
                          <p className="text-sm text-green-700">{comp.partner2Answer}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-4 border-t bg-gray-50">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const analysisText = `💕 Our Love Challenge Results 💕\n\n${comparisonResults.analysis}\n\n📊 Our Answers:\n${comparisonResults.comparisons.map((comp, i) => `\nQ${i+1}: ${comp.question}\n🔹 Partner 1: ${comp.partner1Answer}\n🔹 Partner 2: ${comp.partner2Answer}`).join('\n')}\n\n---\nGenerated by LoveBot AI`;
                      copyToClipboard(analysisText);
                    }}
                    className="flex-1 bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Analysis
                  </button>
                  <button
                    onClick={() => {
                      setShowComparisonModal(false);
                      setComparisonResults(null);
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Save your relationship insights to look back on! 💕
                </p>
              </div>
            </div>
          </div>
        )}

        {showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b bg-blue-50">
                <h3 className="text-lg font-semibold">🏆 Detailed Results</h3>
                <button 
                  onClick={() => setShowShareModal(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-4 max-h-[70vh] overflow-y-auto">
                {sessionData.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No game data available.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sessionData.map((item, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-600">Q{index + 1}</span>
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-medium">
                            +{item.score} pts
                          </span>
                        </div>
                        <p className="text-sm font-medium mb-2">{item.question}</p>
                        <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="w-full bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {showChallengeShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">💕 Share Your Challenge</h3>
                <button onClick={() => setShowChallengeShareModal(false)} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6">
                <p className="text-gray-600 mb-6 text-center">
                  Choose how you'd like to share your love challenge with your partner!
                </p>
                
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      shareViaEmail(generateShortChallengeLink(sessionData));
                      setShowChallengeShareModal(false);
                    }}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-colors"
                  >
                    <span className="text-lg">📧</span>
                    <div className="text-left">
                      <div className="font-medium">Send via Email</div>
                      <div className="text-xs opacity-90">Opens your email app with a cute message</div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => {
                      copyToClipboard(generateShortChallengeLink(sessionData));
                      setShowChallengeShareModal(false);
                    }}
                    className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    <div className="text-left">
                      <div className="font-medium">Copy Link Only</div>
                      <div className="text-xs opacity-90">Just the challenge link</div>
                    </div>
                  </button>
                </div>
                
                <div className="mt-6 p-3 bg-pink-50 rounded-lg">
                  <p className="text-xs text-pink-700 text-center">
                    💡 Your partner will answer the same questions you did, then you can compare results!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default LoveBot;