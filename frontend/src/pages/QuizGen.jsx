import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, CheckCircle, XCircle, Trophy, RefreshCw, FolderClock } from 'lucide-react';
import axios from 'axios';

const QuizGen = () => {
  const [topic, setTopic] = useState('');
  const [savedPlans, setSavedPlans] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch user's study plans to suggest topics
    const fetchPlans = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get('http://localhost:5000/api/ai/planner', config);
        setSavedPlans(data.result);
      } catch (err) {
        console.error("Failed to fetch plans for quiz topics");
      }
    };
    fetchPlans();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic) return;
    
    setIsGenerating(true);
    setQuiz(null);
    setIsSubmitted(false);
    setUserAnswers({});
    setError('');

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const { data } = await axios.post('http://localhost:5000/api/ai/quiz/generate', { topic }, config);
      setQuiz(data.result);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to generate quiz. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOptionSelect = (qIndex, oIndex) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [qIndex]: oIndex }));
  };

  const handleSubmitQuiz = async () => {
    if (Object.keys(userAnswers).length !== quiz.length) {
      setError("Please answer all questions before submitting.");
      return;
    }

    let calculatedScore = 0;
    quiz.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) calculatedScore += 1;
    });

    setScore(calculatedScore);
    setIsSubmitted(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.post('http://localhost:5000/api/ai/quiz/submit', { 
        topic, 
        score: calculatedScore, 
        totalQuestions: quiz.length 
      }, config);
    } catch (err) {
      console.error("Failed to save score to analytics database:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[calc(100vh-5rem)]">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <BrainCircuit className="w-8 h-8 text-pink-400" />
          Adaptive AI Quizzes
        </h1>
        <p className="text-gray-400">Generate custom multiple choice quizzes to test your knowledge. Scores are saved to your Analytics Dashboard.</p>
      </div>

      <div className="glass-card p-6 md:p-8 mb-8">
        <form onSubmit={handleGenerate} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input 
              type="text" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic (e.g. Node.js, Quantum Physics)..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
              required
              disabled={isGenerating}
            />
          </div>
          <button 
            type="submit"
            disabled={isGenerating || !topic}
            className="md:w-auto w-full px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 whitespace-nowrap"
          >
            {isGenerating ? <RefreshCw className="w-5 h-5 animate-spin"/> : <BrainCircuit className="w-5 h-5"/>}
            {isGenerating ? 'Generating...' : 'Generate Quiz'}
          </button>
        </form>

        {savedPlans.length > 0 && !quiz && (
            <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-sm text-gray-400 mb-2 flex items-center gap-2"><FolderClock className="w-4 h-4"/> Or select from your current Study Plans:</p>
                <div className="flex flex-wrap gap-2">
                    {savedPlans.map(plan => (
                        <button 
                            key={plan._id}
                            onClick={() => setTopic(plan.topicsCovered.split(',')[0])}
                            className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-primary/50 transition-colors text-gray-300"
                        >
                            {plan.topicsCovered.split(',')[0]}
                        </button>
                    ))}
                </div>
            </div>
        )}

        {/* Removed top error */}
      </div>

      {quiz && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 relative z-10"
        >
          {quiz.map((q, qIndex) => (
            <div key={qIndex} className="glass-panel p-6 rounded-2xl border-white/10">
              <h3 className="text-lg font-semibold mb-4 text-white">
                <span className="text-primary mr-2">{qIndex + 1}.</span> {q.question}
              </h3>
              
              <div className="space-y-3">
                {q.options.map((opt, oIndex) => {
                  const isSelected = userAnswers[qIndex] === oIndex;
                  const isCorrectResult = isSubmitted && oIndex === q.correctAnswer;
                  const isWrongResult = isSubmitted && isSelected && oIndex !== q.correctAnswer;
                  
                  let optStyle = "bg-white/5 border-white/10 hover:bg-white/10 text-gray-300"; // Default
                  
                  if (isSelected && !isSubmitted) {
                    optStyle = "bg-purple-500/30 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] transform scale-[1.01]"; // Selected state
                  } else if (isCorrectResult) {
                    optStyle = "bg-green-500/20 border-green-500 text-green-200"; // Correct answer reveal
                  } else if (isWrongResult) {
                    optStyle = "bg-red-500/20 border-red-500 text-red-200"; // Wrong answer reveal
                  }

                  return (
                    <button
                      key={oIndex}
                      onClick={() => handleOptionSelect(qIndex, oIndex)}
                      disabled={isSubmitted}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between relative cursor-pointer ${optStyle}`}
                    >
                      <span className="font-medium">{opt}</span>
                      {isCorrectResult && <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />}
                      {isWrongResult && <XCircle className="w-5 h-5 text-red-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {!isSubmitted ? (
            <div className="flex flex-col items-center mt-8 pb-12 relative z-20">
              {error && <p className="text-red-400 text-sm mb-4 font-semibold text-center bg-red-500/10 py-2 px-4 rounded-lg">{error}</p>}
              <button 
                type="button"
                onClick={handleSubmitQuiz}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white font-bold text-lg hover:shadow-lg hover:shadow-green-500/20 transition-all hover:scale-[1.02] cursor-pointer"
              >
                Submit Answers
              </button>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 glass-panel border-white/20 p-8 rounded-3xl text-center bg-gradient-to-b from-primary/10 to-transparent"
            >
              <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
              <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
              <p className="text-xl text-gray-300 mb-6">
                You scored <span className="text-white font-bold text-2xl px-2">{score}/{quiz.length}</span>
              </p>
              <p className="text-sm text-green-400 mb-6 font-medium">Results saved to Analytics Dashboard ✓</p>
              <button 
                onClick={() => { setQuiz(null); setTopic(''); }}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white font-medium transition-all"
              >
                Take another topic
              </button>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default QuizGen;
