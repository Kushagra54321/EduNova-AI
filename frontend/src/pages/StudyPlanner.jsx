import { useState, useEffect } from 'react';
import { Calendar, Target, ArrowRight, Sparkles, FolderClock } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const StudyPlanner = () => {
  const [examDate, setExamDate] = useState('');
  const [topics, setTopics] = useState('');
  const [currentPlan, setCurrentPlan] = useState(null);
  const [savedPlans, setSavedPlans] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get('https://edunova-ai-1.onrender.com/api/ai/planner', config);
      setSavedPlans(data.result);
      if(data.result.length > 0) {
        setCurrentPlan(data.result[0].plan);
      }
    } catch (err) {
      console.error("Failed to fetch plans", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleGeneratePlan = async (e) => {
    e.preventDefault();
    if (!examDate || !topics) return;
    
    setIsGenerating(true);
    setCurrentPlan(null);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const res = await axios.post('https://edunova-ai-1.onrender.com/api/ai/planner', { 
        examDate, 
        topics 
      }, config);
      
      setCurrentPlan(res.data.result);
      fetchPlans(); // Refresh the saved plans list
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to generate study plan. Make sure backend servers are running.');
    } finally {
      setIsGenerating(false);
    }
  };

  const loadSavedPlan = (plan) => {
      setCurrentPlan(plan.plan);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[calc(100vh-5rem)]">
      
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <Calendar className="w-8 h-8 text-orange-400" />
          Smart Study Planner
        </h1>
        <p className="text-gray-400">Generate an optimized study schedule based on your exam dates and topics using AI. Automatic tracking directly syncs with your Quiz Analytics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar: Saved Plans */}
        <div className="lg:col-span-1 space-y-4">
             <div className="glass-panel p-4 rounded-2xl border-white/10">
                 <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
                     <FolderClock className="w-5 h-5 text-primary" /> Past Timelines
                 </h3>
                 <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                     {isLoading ? (
                         <div className="animate-pulse flex space-x-4">
                            <div className="flex-1 space-y-4 py-1">
                              <div className="h-4 bg-white/10 rounded w-3/4"></div>
                              <div className="h-4 bg-white/10 rounded"></div>
                            </div>
                         </div>
                     ) : savedPlans.length > 0 ? (
                         savedPlans.map((sp) => (
                             <button 
                                key={sp._id} 
                                onClick={() => loadSavedPlan(sp)}
                                className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all outline-none focus:ring-1 focus:ring-primary/50 text-sm"
                             >
                                 <div className="font-semibold text-white truncate">{sp.topicsCovered}</div>
                                 <div className="text-xs text-gray-400 mt-1">Target: {new Date(sp.examDate).toLocaleDateString()}</div>
                             </button>
                         ))
                     ) : (
                         <p className="text-xs text-gray-500 text-center py-4">No saved plans yet. Create one!</p>
                     )}
                 </div>
             </div>
        </div>

        {/* Form Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="glass-card p-6 border-white/10 sticky top-24">
            <h3 className="text-xl font-semibold mb-6">Create New Plan</h3>
            <form onSubmit={handleGeneratePlan} className="space-y-4">
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Exam Target Date</label>
                <input 
                  type="date" 
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-50 text-sm"
                  required
                  disabled={isGenerating}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Topics to Cover</label>
                <textarea 
                  value={topics}
                  onChange={(e) => setTopics(e.target.value)}
                  placeholder="e.g. Algebra, Geometry, Calculus..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors h-32 resize-none disabled:opacity-50 text-sm"
                  required
                  disabled={isGenerating}
                />
              </div>

              <button 
                type="submit"
                disabled={isGenerating || !examDate || !topics}
                className="w-full py-3.5 mt-4 bg-gradient-to-r from-primary to-secondary rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50"
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin" /> Analyzing timeline...
                  </span>
                ) : 'Generate AI Plan'}
              </button>
            </form>
            {error && (
              <p className="text-red-400 text-sm mt-4 text-center">{error}</p>
            )}
          </div>
        </motion.div>

        {/* Results Section */}
        <div className="lg:col-span-2">
          {currentPlan ? (
            <div className="space-y-4 relative">
              <div className="absolute left-6 top-10 bottom-10 w-px bg-white/10"></div>
              {currentPlan.map((phase, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={idx} 
                  className="relative pl-16 pr-4 py-2"
                >
                  <div className="absolute left-[20px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background z-10 shadow-[0_0_10px_rgba(161,140,209,0.5)]"></div>
                  <div className="glass-panel p-6 rounded-2xl border-white/10 hover:border-primary/30 transition-colors bg-gradient-to-br from-white/5 to-transparent">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 bg-primary/20 rounded-full text-xs font-semibold text-primary/90 border border-primary/20">{phase.day}</span>
                      <Target className="w-5 h-5 text-gray-500" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-3">{phase.title}</h4>
                    <ul className="space-y-2">
                      {phase.tasks && phase.tasks.map((task, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                          <ArrowRight className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 glass-panel rounded-3xl border-dashed border-2 border-white/10">
              <Calendar className="w-16 h-16 text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No active timeline selected</h3>
              <p className="text-gray-500 max-w-sm">Select an exam date and provide the subjects you need to learn. Our AI will automatically structure your timeline and save it.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default StudyPlanner;
