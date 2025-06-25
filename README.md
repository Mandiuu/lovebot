# 💕 LoveBot - Interactive Relationship Quiz Game

> A fun, AI-powered relationship game that helps couples discover how well they really know each other

![LoveBot Screenshot](https://via.placeholder.com/800x400/ec4899/ffffff?text=💕+LoveBot+Quiz+Game)

## 🌟 What LoveBot Does

LoveBot is an interactive relationship quiz game that creates fun challenges between couples. It's not your typical chatbot - it's a **game-based bot** that asks relationship questions, analyzes your answers with AI, and lets you challenge your partner to see how well they know you!

**Game Flow:**
1. **Take the Quiz**: Answer 10 fun questions about yourself and your relationship
2. **Get AI Feedback**: LoveBot gives playful, supportive responses to your answers using Gemini AI
3. **Challenge Your Partner**: Share a personalized quiz link for your partner to guess your answers
4. **Compare Results**: Use AI analysis to see how compatible you are and get relationship insights

## ✨ Key Features

### 🎮 Interactive Quiz Game
- **Multiple Categories**: Getting to know each other, relationship dynamics, daily life, and preferences
- **Custom Questions**: Add your own personalized questions to the mix
- **Smart Scoring**: Detailed answers get higher scores, with levels and rankings
- **Progress Tracking**: Visual progress bars and real-time feedback

### 🤖 AI-Powered Responses
- **Playful Feedback**: Gemini AI gives warm, funny responses to your answers
- **Relationship Analysis**: Deep compatibility analysis comparing partner answers
- **Personalized Insights**: AI generates custom relationship advice based on your responses

### 💌 Partner Challenge System
- **Shareable Links**: Generate encoded challenge links to send to your partner
- **Email Integration**: Auto-compose cute challenge emails
- **Answer Comparison**: See side-by-side how well you know each other
- **Compatibility Scoring**: AI rates how well partners know each other (1-10 scale)

### 🎨 Beautiful Design
- **Gradient Themes**: Beautiful purple/pink gradients with smooth animations
- **Responsive Interface**: Works perfectly on mobile and desktop
- **Modal System**: Clean, organized UI with contextual modals
- **Game-like Feel**: Progress bars, scores, levels, and achievement-style feedback

## 🚀 Tech Stack

- **Frontend**: React 18 with Hooks
- **Styling**: Tailwind CSS with custom gradients and animations
- **Icons**: Lucide React icon library
- **AI Integration**: Google Gemini 1.5 Flash API for intelligent responses
- **Data Encoding**: Base64 encoding for shareable challenge links
- **State Management**: React useState with session memory
- **Storage**: Browser storage for API keys and custom questions

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- A Google Gemini API key (free at [Google AI Studio](https://makersuite.google.com/app/apikey))

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/lovebot-quiz-game.git
   cd lovebot-quiz-game
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables** (optional)
   ```bash
   # Create a .env file in the root directory
   echo "REACT_APP_GEMINI_API_KEY=your_api_key_here" > .env
   ```

4. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

5. **Open your browser**
   Navigate to `https://lovebot-flame.vercel.app/` and start playing!

### Getting Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and add it via the in-app settings or `.env` file

## 💬 How to Play

### Solo Mode
1. **Start the Game**: Click "Start Love Game" on the main menu
2. **Answer Questions**: Type detailed responses to relationship questions
3. **Get AI Feedback**: LoveBot responds with playful, supportive comments
4. **View Results**: See your final score, level, and ranking

### Challenge Mode
1. **Complete Solo Game**: Finish answering your questions first
2. **Generate Challenge**: Click "Challenge Your Partner" to create a shareable link
3. **Send to Partner**: Share via email or copy the link directly
4. **Partner Plays**: They answer questions trying to guess YOUR answers
5. **Compare Results**: Use AI analysis to see how well you know each other

### Example Gameplay

**Question**: "What's your favorite way to spend a weekend?"
**Your Answer**: "I love sleeping in, making a big breakfast, going for a hike, and ending with a movie night at home."
**LoveBot Response**: "Aww, that sounds absolutely perfect! Balance of adventure and cozy vibes! 🏞️"

## 🎯 Contest Requirements Met

✅ **Custom Bot**: Game-based relationship bot with unique personality  
✅ **User Input**: Accepts typed answers to relationship questions  
✅ **Helpful Responses**: Provides supportive feedback and relationship insights  
✅ **API Integration**: Uses Google Gemini API for AI responses and analysis  
✅ **Functional Interface**: Complete web-based game with chat-like interactions  

## 🎨 Design Philosophy

LoveBot focuses on creating a **fun, non-judgmental space** for couples to connect:

- **Playful Tone**: AI responses are warm, funny, and encouraging
- **Beautiful Visuals**: Romantic gradients and smooth animations
- **Gamification**: Scores, levels, and rankings make it engaging
- **Privacy-Focused**: Data stays in browser memory, no server storage
- **Relationship-Positive**: Focuses on growth and understanding, not criticism

## ⚙️ Configuration

### AI Settings
- Add your Gemini API key via the settings panel (gear icon)
- Works offline with fallback responses if no API key provided
- API key stored securely in browser memory

### Customization
- **Custom Questions**: Add personalized questions via the "Custom Questions" panel
- **Question Categories**: Modify the `questionCategories` object to change topics
- **AI Personality**: Update the Gemini prompt to change LoveBot's tone
- **Scoring System**: Adjust the `calculateScore` function for different point values

## 🤝 Contributing

We welcome contributions to make LoveBot even better!

### Ideas for Contributions
- Additional question categories (long-distance, new relationships, married couples)
- Voice response integration
- Multiple language support
- Social sharing features
- Couple progress tracking over time
- Integration with other AI models

## 📱 Mobile Support

LoveBot is fully responsive and works great on:
- 📱 Mobile phones (iOS/Android)
- 📱 Tablets (iPad, Android tablets)
- 💻 Desktop browsers (Chrome, Firefox, Safari, Edge)

## 🎉 Perfect For

- **Date Nights**: Fun activity for couples at home
- **Long-Distance Relationships**: Stay connected through shared challenges
- **New Couples**: Learn about each other in a structured, fun way
- **Anniversary Celebrations**: See how well you've gotten to know each other
- **Friend Groups**: Adapt questions for friendship compatibility

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for powering the intelligent responses and analysis
- **Lucide** for beautiful, consistent icons
- **Tailwind CSS** for rapid, responsive styling
- **React Community** for the amazing framework



---

<div align="center">

**Made with 💕 for the Codedex Challenge**

[Live Demo](https://lovebot-flame.vercel.app/) • [GitHub](https://github.com/yourusername/lovebot) • [API Docs](https://ai.google.dev/)



</div>