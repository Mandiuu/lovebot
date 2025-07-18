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
  
  // Settings - AI configuration
  const [useAI, setUseAI] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  // Modal states
  const [showCustomQuestionModal, setShowCustomQuestionModal] = useState(false);
  const [newCustomQuestion, setNewCustomQuestion] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [comparisonResults, setComparisonResults] = useState(null);
  const [showChallengeShareModal, setShowChallengeShareModal] = useState(false);
  const [originalAnswers, setOriginalAnswers] = useState([]);

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
        "What's your ideal temperature for the house?"
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
    const savedCustomQuestions = [];
    setCustomQuestions(savedCustomQuestions);

    // Check for environment variable first
    const envApiKey = process.env.REACT_APP_GEMINI_API_KEY;
    
    console.log('🔍 Checking for API key...');
    console.log('Environment variable exists:', !!envApiKey);
    console.log('API key length:', envApiKey?.length || 0);
    
    if (envApiKey && envApiKey.length > 10) {
      setGeminiApiKey(envApiKey);
      setUseAI(true);
      console.log('✅ Gemini API key loaded from environment variable');
    } else {
      console.log('⚠️ No valid Gemini API key found in environment variables');
      console.log('Make sure your .env file contains: REACT_APP_GEMINI_API_KEY=your_key_here');
      
      // Fallback to local storage (but don't use localStorage in artifacts)
      // In a real app, this would check localStorage
      const savedApiKey = ''; // Placeholder - in real app would be localStorage.getItem('lovebot_gemini_api_key')
      if (savedApiKey && savedApiKey.length > 10) {
        setGeminiApiKey(savedApiKey);
        setUseAI(true);
        console.log('✅ Gemini API key loaded from localStorage');
      }
    }

    // Check for shared challenge
    const urlParams = new URLSearchParams(window.location.search);
    const sharedQuestions = urlParams.get('questions');
    const originalAnswers = urlParams.get('answers');
    const compactChallenge = urlParams.get('c');
    const ultraCompactChallenge = urlParams.get('d');
    
    if (ultraCompactChallenge) {
      try {
        // Decode ultra compact format
        const decoded = atob(ultraCompactChallenge + '==='); // Add padding
        const items = decoded.split('|');
        
        const questions = [];
        const answers = [];
        
        items.forEach(item => {
          if (!item) return;
          
          // Extract category (first 3 chars)
          const categoryPrefix = item.substring(0, 3);
          
          // Find matching category
          const categoryKey = Object.keys(questionCategories).find(key => 
            key.startsWith(categoryPrefix)
          );
          
          if (!categoryKey) return;
          
          // Extract question index (next chars until we hit base64)
          let questionIndex = '';
          let i = 3;
          while (i < item.length && !isNaN(parseInt(item[i], 36))) {
            questionIndex += item[i];
            i++;
          }
          
          const qIndex = parseInt(questionIndex, 36);
          const question = questionCategories[categoryKey]?.questions[qIndex];
          
          if (!question) return;
          
          // Rest is the compressed answer
          const compressedAnswer = item.substring(i);
          let answer = '';
          try {
            answer = atob(compressedAnswer + '===');
          } catch (e) {
            answer = compressedAnswer; // fallback
          }
          
          questions.push({
            question: question,
            category: categoryKey
          });
          
          answers.push({
            question: question,
            answer: answer,
            category: categoryKey
          });
        });
        
        setPartnerQuestions(questions);
        setOriginalAnswers(answers);
      } catch (error) {
        console.error('Error parsing ultra compact challenge:', error);
        // Fallback to regular compact format
      }
    } else if (compactChallenge) {
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
        setOriginalAnswers(answers);
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
            setOriginalAnswers(parsed);
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
      return question;
    } else {
      return question
        // Basic "What's your" patterns
        .replace(/What's your /g, "What's your partner's ")
        .replace(/What's something you're /g, "What's something your partner is ")
        .replace(/What's one thing you /g, "What's one thing your partner ")
        
        // Specific time/habit patterns
        .replace(/What time do you /g, "What time does your partner ")
        .replace(/What time does your partner naturally wake up/g, "What time does your partner naturally wake up")
        
        // Action patterns with "you"
        .replace(/What song always gets you /g, "What song always gets your partner ")
        .replace(/What superpower would you /g, "What superpower would your partner ")
        .replace(/What type of music do you /g, "What type of music does your partner ")
        .replace(/What makes you /g, "What makes your partner ")
        
        // "How do you" patterns
        .replace(/How do you /g, "How does your partner ")
        
        // Special relationship-specific replacements
        .replace(/What's something small your partner does that makes you happy/g, "What's something small you do that makes your partner happy")
        .replace(/What's your favorite thing about your relationship/g, "What's your partner's favorite thing about your relationship")
        .replace(/What's your favorite memory of you two together/g, "What's your partner's favorite memory of you two together")
        .replace(/What's one thing you always say about your partner to others/g, "What's one thing your partner always says about you to others")
        
        // Sleep and daily habits
        .replace(/What side of the bed do you /g, "What side of the bed does your partner ")
        
        // Shopping and preferences
        .replace(/What's your shopping /g, "What's your partner's shopping ")
        .replace(/What's your go-to /g, "What's your partner's go-to ")
        .replace(/What's your favorite /g, "What's your partner's favorite ")
        .replace(/What's your biggest /g, "What's your partner's biggest ")
        .replace(/What's your dream /g, "What's your partner's dream ")
        .replace(/What's your ideal /g, "What's your partner's ideal ")
        
        // Preference patterns
        .replace(/What's a hobby you /g, "What's a hobby your partner ")
        .replace(/What's a relationship goal you /g, "What's a relationship goal your partner ")
        
        // Morning routine and habits
        .replace(/What's your morning routine like/g, "What's your partner's morning routine like")
        
        // Coffee/tea preferences
        .replace(/How do you like your coffee or tea/g, "How does your partner like their coffee or tea");
    }
  };

  // Add this helper function to reverse-transform questions back to original
  const getOriginalQuestionFromTransformed = (transformedQuestion) => {
    return transformedQuestion
      .replace(/What's your partner's /g, "What's your ")
      .replace(/What's something your partner is /g, "What's something you're ")
      .replace(/What's one thing your partner /g, "What's one thing you ")
      .replace(/What time does your partner /g, "What time do you ")
      .replace(/What song always gets your partner /g, "What song always gets you ")
      .replace(/What superpower would your partner /g, "What superpower would you ")
      .replace(/What type of music does your partner /g, "What type of music do you ")
      .replace(/What makes your partner /g, "What makes you ")
      .replace(/How does your partner /g, "How do you ")
      .replace(/What's something small you do that makes your partner happy/g, "What's something small your partner does that makes you happy")
      .replace(/What's your partner's favorite thing about your relationship/g, "What's your favorite thing about your relationship")
      .replace(/What's your partner's favorite memory of you two together/g, "What's your favorite memory of you two together")
      .replace(/What's one thing your partner always says about you to others/g, "What's one thing you always say about your partner to others")
      .replace(/What side of the bed does your partner /g, "What side of the bed do you ")
      .replace(/What's your partner's shopping /g, "What's your shopping ")
      .replace(/What's your partner's go-to /g, "What's your go-to ")
      .replace(/What's your partner's favorite /g, "What's your favorite ")
      .replace(/What's your partner's biggest /g, "What's your biggest ")
      .replace(/What's your partner's dream /g, "What's your dream ")
      .replace(/What's your partner's ideal /g, "What's your ideal ")
      .replace(/What's a hobby your partner /g, "What's a hobby you ")
      .replace(/What's a relationship goal your partner /g, "What's a relationship goal you ")
      .replace(/What's your partner's morning routine like/g, "What's your morning routine like")
      .replace(/How does your partner like their coffee or tea/g, "How do you like your coffee or tea");
  };

  const getRandomQuestion = () => {
    if (partnerQuestions.length > 0) {
      const availablePartnerQuestions = partnerQuestions.filter(q => !usedQuestions.includes(q.question));
      
      if (availablePartnerQuestions.length === 0) {
        setUsedQuestions([]);
        const selected = partnerQuestions[0];
        setCurrentCategory(selected.category);
        const formattedQuestion = formatQuestion(selected.question, true);
        setCurrentQuestion(formattedQuestion);
        setUsedQuestions([formattedQuestion]);
        return formattedQuestion;
      }
      
      const randomIndex = Math.floor(Math.random() * availablePartnerQuestions.length);
      const selected = availablePartnerQuestions[randomIndex];
      
      setCurrentCategory(selected.category);
      const formattedQuestion = formatQuestion(selected.question, true);
      setCurrentQuestion(formattedQuestion);
      setUsedQuestions(prev => [...prev, formattedQuestion]);
      
      return formattedQuestion;
    }

    // Use pre-written questions
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
      const formattedQuestion = formatQuestion(selected.question, false);
      setCurrentQuestion(formattedQuestion);
      setUsedQuestions([formattedQuestion]);
      return formattedQuestion;
    }
    
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const selected = availableQuestions[randomIndex];
    
    setCurrentCategory(selected.category);
    const formattedQuestion = formatQuestion(selected.question, false);
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
    
    // Store the ORIGINAL question (not the transformed one) for challenge sharing
    const originalQuestion = partnerQuestions.length > 0 
      ? partnerQuestions[currentQuestionIndex]?.question || currentQuestion
      : getOriginalQuestionFromTransformed(currentQuestion);
    
    setSessionData(prev => [...prev, {
      question: originalQuestion, // Store original question for challenge
      displayQuestion: currentQuestion, // Store what was actually shown to user
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

  const saveApiKey = (apiKey) => {
    if (apiKey.trim()) {
      // In real app would use localStorage.setItem('lovebot_gemini_api_key', apiKey.trim());
      setGeminiApiKey(apiKey.trim());
      setUseAI(true);
      console.log('✅ API key saved successfully');
      return true;
    }
    return false;
  };

  const removeApiKey = () => {
    // In real app would use localStorage.removeItem('lovebot_gemini_api_key');
    setGeminiApiKey('');
    setUseAI(false);
    console.log('API key removed');
  };

  const compareAnswersWithAI = async () => {
    console.log('🔍 Starting AI comparison...');
    console.log('📊 Session data:', sessionData);
    console.log('📊 Original answers:', originalAnswers);
    console.log('🔧 AI Status:', { useAI, hasApiKey: !!geminiApiKey, keyLength: geminiApiKey?.length });
    
    if (!useAI || !geminiApiKey) {
      alert(`🤖 AI comparison requires Gemini API to be configured. 
      
Current status:
- AI Enabled: ${useAI ? 'Yes' : 'No'}
- API Key: ${geminiApiKey ? 'Provided' : 'Missing'}
- Key Length: ${geminiApiKey?.length || 0}

Please check your .env file or add your API key in Settings.`);
      return;
    }

    if (originalAnswers.length === 0) {
      console.log('❌ No original answers found');
      alert('❌ No original answers found for comparison. This feature only works when responding to a partner challenge.');
      return;
    }

    setIsTyping(true);
    
    try {
      const comparisons = sessionData.map((myAnswer) => {
        const originalAnswer = originalAnswers.find(orig => orig.question === myAnswer.question);
        console.log(`🔍 Matching question: "${myAnswer.question}"`);
        console.log(`   - Original: "${originalAnswer?.answer || 'No match'}"`);
        console.log(`   - Current: "${myAnswer.answer}"`);
        
        return {
          question: myAnswer.question,
          partner1Answer: originalAnswer?.answer || 'No answer',
          partner2Answer: myAnswer.answer,
          category: myAnswer.category
        };
      });

      console.log('📋 Final comparisons:', comparisons);

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

Give a compatibility score out of 10 based on actual answer similarity (be honest!). Include:
- Overall compatibility score
- 2-3 specific observations about how well Partner 1 knows Partner 2

Keep it under 100 words, fun but accurate!`;

      console.log('📝 Sending prompt to Gemini API...');
      console.log('🔗 API URL:', `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey.substring(0, 10)}...`);

      const requestBody = {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      };
      
      console.log('📤 Request body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('📋 Full API response:', JSON.stringify(data, null, 2));
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const analysis = data.candidates[0].content.parts[0].text;
        console.log('✅ AI Analysis received:', analysis);
        
        setComparisonResults({
          analysis,
          comparisons
        });
        setShowComparisonModal(true);
      } else {
        console.error('❌ Invalid response structure:', data);
        
        // Check for safety ratings or other issues
        if (data.candidates && data.candidates[0]) {
          const candidate = data.candidates[0];
          if (candidate.finishReason) {
            console.log('🛡️ Finish reason:', candidate.finishReason);
            if (candidate.finishReason === 'SAFETY') {
              alert('❌ The AI detected safety concerns with the content. Try with different answers or shorter responses.');
              return;
            }
          }
          if (candidate.safetyRatings) {
            console.log('🛡️ Safety ratings:', candidate.safetyRatings);
          }
        }
        
        throw new Error('Invalid response from AI - check console for details');
      }
    } catch (error) {
      console.error('❌ AI Comparison Error:', error);
      if (error.message?.includes('401') || error.message?.includes('403')) {
        alert('❌ Invalid Gemini API key. Please check your API key in settings.');
      } else if (error.message?.includes('429')) {
        alert('❌ Too many requests. Please wait a moment and try again.');
      } else if (error.message?.includes('503')) {
        alert('❌ Gemini service is temporarily unavailable. Please try again in a few minutes.');
      } else {
        alert(`❌ AI Error: ${error.message}\n\nCheck browser console for more details.`);
      }
    } finally {
      console.log('🏁 AI comparison finished');
      setIsTyping(false);
    }
  };

  // Update the generateShortChallengeLink function
  const generateShortChallengeLink = (sessionData) => {
    console.log('📝 Generating ultra-compact link for:', sessionData);
    
    // Create a more compact representation
    const compactData = sessionData.map(item => {
      // Use first 3 chars of category
      const categoryPrefix = item.category.substring(0, 3);
      
      // Find question index within its category
      const categoryQuestions = questionCategories[item.category]?.questions || [];
      const questionIndex = categoryQuestions.indexOf(item.question);
      
      console.log(`🔍 Item: ${item.question}`);
      console.log(`📂 Category: ${item.category} -> ${categoryPrefix}`);
      console.log(`📋 Question index: ${questionIndex}`);
      
      return [
        categoryPrefix,
        questionIndex,
        // Compress answer by taking first 30 chars (shorter for even more compression)
        item.answer.substring(0, 30)
      ];
    });
    
    console.log('📦 Compact data:', compactData);
    
    // Convert to even more compact format
    const ultraCompact = compactData.map(([cat, idx, ans]) => {
      if (idx === -1) {
        // If question not found in predefined categories, use custom encoding
        return `cus${btoa(ans.substring(0, 20)).replace(/[=+/]/g, '')}`;
      }
      return `${cat}${idx.toString(36)}${btoa(ans).replace(/[=+/]/g, '')}`;
    }).join('|');
    
    console.log('🗜️ Ultra compact string:', ultraCompact);
    
    const encodedData = btoa(ultraCompact).replace(/[=+/]/g, '');
    const finalUrl = `${window.location.origin}${window.location.pathname}?d=${encodedData}`;
    
    console.log('🔗 Final URL length:', finalUrl.length);
    console.log('🔗 Final URL:', finalUrl);
    
    return finalUrl;
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

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard! 📋');
    } catch (err) {
      alert('Unable to copy to clipboard');
    }
  };

  const saveCustomQuestion = () => {
    if (newCustomQuestion.trim()) {
      const updatedQuestions = [...customQuestions, newCustomQuestion.trim()];
      setCustomQuestions(updatedQuestions);
      // In real app would use localStorage.setItem('lovebot_custom_questions', JSON.stringify(updatedQuestions));
      setNewCustomQuestion('');
      setShowCustomQuestionModal(false);
    }
  };

  const deleteCustomQuestion = (index) => {
    const updatedQuestions = customQuestions.filter((_, i) => i !== index);
    setCustomQuestions(updatedQuestions);
    // In real app would use localStorage.setItem('lovebot_custom_questions', JSON.stringify(updatedQuestions));
  };

  const resetGame = () => {
    setGameState('menu');
    setCurrentQuestionIndex(0);
    setScore(0);
    setLevel(1);
    setSessionData([]);
    setUsedQuestions([]);
    setShowAiResponse(false);
    setPartnerQuestions([]);
    setOriginalAnswers([]);
    setComparisonResults(null);
    setInputText('');
    setCurrentQuestion('');
    setCurrentCategory('');
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
                Custom Questions ({customQuestions.length})
              </button>

              <button
                onClick={() => setShowSettingsModal(true)}
                className="w-full bg-white/20 hover:bg-white/30 px-4 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all"
              >
                <Settings className="w-4 h-4" />
                {geminiApiKey ? '🤖 AI Enabled' : 'Setup AI Features'}
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
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">✏️ Custom Questions</h3>
                <button onClick={() => setShowCustomQuestionModal(false)} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 max-h-[70vh] overflow-y-auto">
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
                          <span className="text-sm flex-1 pr-2">{q}</span>
                          <button
                            onClick={() => deleteCustomQuestion(index)}
                            className="ml-2 text-red-500 hover:text-red-700 flex-shrink-0"
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

        {/* Settings Modal */}
        {showSettingsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">⚙️ AI Settings</h3>
                <button onClick={() => setShowSettingsModal(false)} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-3 h-3 rounded-full ${useAI && geminiApiKey ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="font-medium">
                      AI Status: {useAI && geminiApiKey ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  
                  {geminiApiKey ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-800 mb-2">
                        ✅ API Key Configured
                      </p>
                      <p className="text-xs text-green-600">
                        Key: ••••••••{geminiApiKey.slice(-4)}
                      </p>
                      <button
                        onClick={removeApiKey}
                        className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                      >
                        Remove API Key
                      </button>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm text-yellow-800 mb-2">
                        ⚠️ No API Key Found
                      </p>
                      <p className="text-xs text-yellow-700 mb-3">
                        Add REACT_APP_GEMINI_API_KEY to your .env file, or enter it manually below:
                      </p>
                      
                      <div className="space-y-2">
                        <input
                          type="password"
                          placeholder="Paste your Gemini API key here..."
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          onPaste={(e) => {
                            const apiKey = e.clipboardData.getData('text');
                            if (apiKey && saveApiKey(apiKey)) {
                              alert('✅ API key saved!');
                              setShowSettingsModal(false);
                            }
                          }}
                        />
                        <p className="text-xs text-gray-500">
                          Get your free API key at: https://makersuite.google.com/app/apikey
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="font-medium text-blue-800 mb-2">🤖 AI Features</h4>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Playful responses to your answers</li>
                    <li>• Smart answer comparison with your partner</li>
                    <li>• Relationship compatibility analysis</li>
                  </ul>
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
    const categoryInfo = questionCategories[currentCategory] || { color: "from-purple-400 to-pink-400", name: "Custom Question", icon: Star };
    
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
                    {React.createElement(categoryInfo.icon, { className: "w-8 h-8 text-white" })}
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
                  onClick={compareAnswersWithAI}
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
                onClick={resetGame}
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

        {/* AI Comparison Modal */}
        {showComparisonModal && comparisonResults && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
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

        {/* Detailed Results Modal */}
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
                        <p className="text-sm font-medium mb-2">{item.displayQuestion || item.question}</p>
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

  return null;
};

export default LoveBot;