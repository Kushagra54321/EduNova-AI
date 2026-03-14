import { useState } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const AiChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hello! I am EduNova AI, your personal study assistant. What would you like to learn today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to UI immediately
    const userMessage = input;
    const newMessages = [...messages, { id: Date.now(), role: 'user', content: userMessage }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Get token
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Call actual backend
      const res = await axios.post('https://edunova-ai-1.onrender.com/api/ai/chat', {
        prompt: userMessage
      }, config);

      // Add AI response
      setMessages([
        ...newMessages,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: res.data.result
        }
      ]);
    } catch (error) {
       console.error("AI Chat Error:", error);
       let errorMessage = "Sorry, I am having trouble connecting to my brain right now. Please ensure the backend server is running.";
       
       if (error.response) {
         // The request was made and the server responded with a status code outside of 2xx
         if (error.response.status === 401) {
           errorMessage = "Your session has expired or token is invalid. Please log out and log in again.";
         } else {
           errorMessage = error.response.data?.error || error.response.data?.message || `Server error: ${error.response.status}`;
         }
       } else if (error.request) {
         // Network error or server offline
         errorMessage = "Cannot connect to the backend server. Please make sure node server is running on port 5000.";
       } else {
         errorMessage = error.message;
       }

       setMessages([
        ...newMessages,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: errorMessage
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "Explain photosynthesis",
    "Summarize causes of World War 1",
    "Generate notes on Water Cycle"
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-5rem)] flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary p-[2px]">
           <div className="w-full h-full bg-background rounded-[10px] flex items-center justify-center">
             <Bot className="w-5 h-5 text-secondary" />
           </div>
        </div>
        <h1 className="text-2xl font-bold">AI Tutor Chat</h1>
      </div>

      {/* Chat Area */}
      <div className="flex-1 glass-card overflow-hidden flex flex-col relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6 z-10 custom-scrollbar">
          {messages.map((msg) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id}
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-primary' : 'bg-white/10'}`}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Sparkles className="w-4 h-4 text-primary" />}
              </div>
              
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-tr-none'
                    : 'glass-panel text-gray-200 rounded-tl-none'
                }`}
              >
                <div className="prose prose-invert max-w-none text-sm md:text-base leading-relaxed break-words whitespace-pre-wrap">
                  {msg.content}
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-white/10">
                <Sparkles className="w-4 h-4 text-primary animate-spin" />
              </div>
              <div className="glass-panel text-gray-200 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
                 <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                 <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Suggestions */}
        {messages.length === 1 && (
           <div className="px-6 pb-4 flex flex-wrap gap-2 z-10">
              {suggestions.map((suggestion, idx) => (
                 <button 
                  key={idx}
                  onClick={() => setInput(suggestion)}
                  className="px-4 py-2 text-sm rounded-full glass-panel text-gray-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                 >
                    {suggestion}
                 </button>
              ))}
           </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-white/10 bg-background/50 backdrop-blur-md z-10">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question or type a topic..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-4 pr-14 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-2 bg-gradient-to-r from-primary to-secondary rounded-lg text-white hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <p className="text-center text-xs text-gray-500 mt-2">EduNova AI can make mistakes. Verify important information.</p>
        </div>
      </div>
    </div>
  );
};

export default AiChat;
