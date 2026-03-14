import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Target, Brain, Award, RefreshCw } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get('https://edunova-ai-1.onrender.com/api/ai/analytics', config);
        setAnalytics(data.result);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
        const errMsg = err.response?.data?.message || err.response?.data?.error || err.message;
        setError(`Failed to load Learning Analytics. Error: ${errMsg}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalytics();
  }, []);

  if (isLoading) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)]">
              <RefreshCw className="w-10 h-10 animate-spin text-primary mb-4" />
              <p className="text-gray-400">Compiling your Learning Analytics...</p>
          </div>
      );
  }

  if (error) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)]">
              <p className="text-red-400">{error}</p>
          </div>
      );
  }

  const hasData = analytics?.graphData && analytics.graphData.length > 0;

  // Calculate Average from graphData
  const calculateAverage = () => {
      if (!hasData) return 0;
      let total = 0;
      analytics.graphData.forEach(d => total += d.score);
      return Math.round(total / analytics.graphData.length);
  };

  const statCards = [
    { title: 'Average Quiz Score', value: `${calculateAverage()}%`, icon: <Award className="w-6 h-6 text-yellow-400" /> },
    { title: 'Topics Practiced', value: hasData ? analytics.graphData.length : 0, icon: <Brain className="w-6 h-6 text-secondary" /> },
    { title: 'Strongest Subject', value: hasData ? analytics.graphData.reduce((prev, current) => (prev.score > current.score) ? prev : current).subject : '-', icon: <Target className="w-6 h-6 text-primary" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4">AI Learning Analytics</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">Analyze your knowledge patterns, track adaptive AI quiz scores, and let EduNova structure the perfect learning path for your weak points.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {statCards.map((stat, idx) => (
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: idx * 0.1 }}
             key={idx}
             className="glass-card p-6 flex items-center justify-between border-white/10"
          >
             <div>
                <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
                <h3 className="text-3xl font-bold text-white max-w-[150px] truncate" title={stat.value}>{stat.value}</h3>
             </div>
             <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                {stat.icon}
             </div>
          </motion.div>
        ))}
      </div>

      {/* Charts & AI Box */}
      {hasData ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            
            {/* Bar Chart: Topic Strength */}
            <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10"
            >
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-semibold mb-1">Subject Mastery</h3>
                        <p className="text-sm text-gray-400">Your average score percentage by topic based on AI Quizzes.</p>
                    </div>
                </div>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.graphData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        {/* Gradient definition for the bars */}
                        <defs>
                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#a18cd1" stopOpacity={0.9}/>
                                <stop offset="95%" stopColor="#fbc2eb" stopOpacity={0.7}/>
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />
                        <XAxis dataKey="subject" stroke="#9ca3af" axisLine={false} tickLine={false} />
                        <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={(tick) => `${tick}%`}/>
                        <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#0f0c29', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', padding: '12px' }}
                        cursor={{fill: 'rgba(255,255,255,0.05)'}}
                        />
                        <Bar dataKey="score" name="Mastery Score" fill="url(#colorScore)" radius={[6, 6, 0, 0]} maxBarSize={60} />
                        
                    </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* AI Suggestions Sidebar */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="lg:col-span-1"
            >
                <div className="glass-card p-6 border-white/10 h-full flex flex-col bg-gradient-to-br from-primary/10 to-transparent relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-3 relative z-10">
                        <span className="p-2 bg-primary/20 rounded-lg border border-primary/30">
                            <Brain className="w-6 h-6 text-primary" />
                        </span>
                        AI Expert Analysis
                    </h3>
                    
                    <div className="text-gray-300 leading-relaxed flex-1 relative z-10 space-y-4 text-sm sm:text-base">
                        {analytics.aiAnalysis.split('. ').map((sentence, i) => (
                            sentence && <p key={i} className="bg-background/50 p-4 rounded-xl border border-white/5">{sentence}{"."}</p>
                        ))}
                    </div>
                    
                    <div className="mt-8 relative z-10">
                        <p className="text-xs text-center text-gray-500 mb-3">AI Engine: LLaMA 3.1 8B</p>
                        <a href="/planner" className="block w-full text-center py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-semibold transition-all hover:scale-[1.02]">
                            Adjust Study Planner
                        </a>
                    </div>
                </div>
            </motion.div>

        </div>
      ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-16 glass-panel rounded-3xl border-dashed border-2 border-white/10 text-center"
          >
              <Target className="w-16 h-16 text-gray-600 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No Quiz Data Yet</h3>
              <p className="text-gray-400 max-w-md mb-6">{analytics?.aiAnalysis || "Go take some AI Adaptive Quizzes to start building your knowledge profile and receive personalized study suggestions."}</p>
              <a href="/quiz" className="px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-xl text-white font-bold hover:shadow-lg transition-all">Go to Quizzes</a>
          </motion.div>
      )}

    </div>
  );
};

export default Dashboard;
