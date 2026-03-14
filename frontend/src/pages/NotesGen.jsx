import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Youtube, Type, BookOpen, Layers, CheckCircle, RefreshCw, UploadCloud, BrainCircuit } from 'lucide-react';
import axios from 'axios';

const NotesGen = () => {
  const [inputType, setInputType] = useState('text'); // 'text', 'youtube', 'pdf'
  const [inputValue, setInputValue] = useState('');
  const [file, setFile] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  
  // The grand JSON response
  const [smartData, setSmartData] = useState(null);
  
  // UI States for the results
  const [activeTab, setActiveTab] = useState('summary'); // 'summary', 'flashcards', 'quiz'
  const [flippedCard, setFlippedCard] = useState(null);
  
  // Interactive Quiz State
  const [userAnswers, setUserAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (inputType === 'text' && !inputValue) return;
    if (inputType === 'youtube' && !inputValue) return;
    if (inputType === 'pdf' && !file) return;

    setIsGenerating(true);
    setSmartData(null);
    setError('');
    setUserAnswers({});
    setQuizSubmitted(false);

    try {
      const token = localStorage.getItem('token');
      const config = { 
          headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': inputType === 'pdf' ? 'multipart/form-data' : 'application/json'
          } 
      };

      const formData = new FormData();
      if (inputType === 'text') formData.append('textTopic', inputValue);
      if (inputType === 'youtube') formData.append('youtubeUrl', inputValue);
      if (inputType === 'pdf') formData.append('file', file);

      // We send FormData even for plain text because Multer handles both, but realistically we can just send JSON if not PDF.
      // Wait, aiRoute is using upload.single('file'). Multer parses multipart form-data.
      // So let's send FormData for everything to hit the exact same endpoint uniformly.
      const payload = inputType === 'pdf' ? formData : { 
          textTopic: inputType === 'text' ? inputValue : undefined,
          youtubeUrl: inputType === 'youtube' ? inputValue : undefined
      };
      
      const endpointConfig = inputType === 'pdf' ? config : { headers: { Authorization: `Bearer ${token}` } };
      
      const { data } = await axios.post('http://localhost:5000/api/ai/smart-study', payload, endpointConfig);
      setSmartData(data.result);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to process material. Ensure the file is a PDF or URL is valid.');
    } finally {
      setIsGenerating(false);
    }
  };

  const tabs = [
    { id: 'summary', name: 'Smart Summary', icon: <FileText className="w-5 h-5"/> },
    { id: 'flashcards', name: 'Flashcards', icon: <Layers className="w-5 h-5"/> },
    { id: 'quiz', name: 'Practice Quiz', icon: <CheckCircle className="w-5 h-5"/> },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[calc(100vh-5rem)]">
      
      {!smartData ? (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <BrainCircuit className="w-10 h-10 text-primary drop-shadow-[0_0_15px_rgba(161,140,209,0.5)]" />
              Smart Study Processor
            </h1>
            <p className="text-gray-400">Upload a PDF, paste a YouTube link, or type a topic. Our AI reads the source material and instantly generates notes, flashcards, and quizzes.</p>
          </div>

          <div className="glass-card p-6 border-white/10 rounded-3xl">
            {/* Input Type Selector */}
            <div className="flex bg-background/50 p-1 rounded-xl mb-6">
                <button 
                    onClick={() => { setInputType('text'); setInputValue(''); setFile(null); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${inputType === 'text' ? 'bg-white/10 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                >
                    <Type className="w-4 h-4"/> Topic
                </button>
                <button 
                    onClick={() => { setInputType('youtube'); setInputValue(''); setFile(null); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${inputType === 'youtube' ? 'bg-red-500/20 text-red-200 shadow-md border border-red-500/30' : 'text-gray-400 hover:text-white'}`}
                >
                    <Youtube className="w-4 h-4"/> YouTube URLs
                </button>
                <button 
                    onClick={() => { setInputType('pdf'); setInputValue(''); setFile(null); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${inputType === 'pdf' ? 'bg-blue-500/20 text-blue-200 shadow-md border border-blue-500/30' : 'text-gray-400 hover:text-white'}`}
                >
                    <BookOpen className="w-4 h-4"/> Upload PDF
                </button>
            </div>

            <form onSubmit={handleGenerate}>
              {inputType === 'text' && (
                  <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-400 mb-2">What do you want to learn?</label>
                      <textarea 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="e.g. Explain how Quantum Computing and Qubits work..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary/50 transition-colors h-32 resize-none"
                      />
                  </div>
              )}

              {inputType === 'youtube' && (
                  <div className="mb-6 block">
                      <label className="block text-sm font-medium text-gray-400 mb-2">Paste YouTube Video Link</label>
                      <input 
                        type="url"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-red-500/50 transition-colors"
                      />
                      <p className="text-xs text-gray-500 mt-2">Note: The video must have closed captions (subtitles) enabled for AI to read it.</p>
                  </div>
              )}

              {inputType === 'pdf' && (
                  <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-400 mb-2">Upload Document (.pdf)</label>
                      <label border="true" className="flex flex-col items-center justify-center w-full h-32 bg-white/5 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-blue-400/50 transition-all hover:bg-white/10">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                              <p className="text-sm text-gray-400 font-semibold">{file ? file.name : "Click to select a PDF file"}</p>
                          </div>
                          <input type="file" className="hidden" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} />
                      </label>
                      <p className="text-xs text-gray-500 mt-2 text-center">Max size: ~10MB. Heavy graphic PDFs may lose formatting.</p>
                  </div>
              )}

              <button 
                type="submit"
                disabled={isGenerating}
                className="w-full py-4 bg-gradient-to-r from-primary to-secondary rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50"
              >
                {isGenerating ? <><RefreshCw className="w-5 h-5 animate-spin"/> Processing Material via AI Engine (This takes up to 30s)...</> : 'Process & Generate Smart Study Guide'}
              </button>
            </form>
            {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}
          </div>
        </motion.div>
      ) : (
        // Results View
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
           
           <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
               <h2 className="text-3xl font-bold flex items-center gap-3">
                   <BrainCircuit className="w-8 h-8 text-primary" />
                   Your Smart Study Guide
               </h2>
               <button onClick={() => setSmartData(null)} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">
                   Process New Material
               </button>
           </div>

           {/* Results Navigation Tabs */}
           <div className="flex overflow-x-auto gap-4 mb-8 pb-2 custom-scrollbar">
               {tabs.map((tab) => (
                   <button
                       key={tab.id}
                       onClick={() => setActiveTab(tab.id)}
                       className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                           activeTab === tab.id 
                           ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20' 
                           : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                       }`}
                   >
                       {tab.icon} {tab.name}
                   </button>
               ))}
           </div>

           {/* TABS CONTENT VIEW */}
           <div className="min-h-[400px]">
               {/* SUMMARY TAB */}
               {activeTab === 'summary' && (
                   <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="grid lg:grid-cols-3 gap-8">
                       <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border-white/10 text-gray-300 leading-relaxed space-y-4">
                           <h3 className="text-2xl font-bold text-white mb-6">Comprehensive Summary</h3>
                           {smartData.summary.split('\\n').map((para, i) => (
                               para && <p key={i}>{para}</p>
                           ))}
                       </div>
                       <div className="lg:col-span-1 space-y-4">
                           <h3 className="text-xl font-bold text-white pl-2">Key Takeaways</h3>
                           {smartData.keyPoints.map((kp, idx) => (
                               <div key={idx} className="glass-panel p-4 rounded-xl border-l-4 border-l-primary/70 border-white/5 bg-gradient-to-r from-white/5 to-transparent flex gap-3">
                                  <div className="w-6 h-6 shrink-0 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">{idx + 1}</div>
                                  <p className="text-sm text-gray-200">{kp}</p>
                               </div>
                           ))}
                       </div>
                   </motion.div>
               )}

               {/* FLASHCARDS TAB */}
               {activeTab === 'flashcards' && (
                   <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}}>
                       <h3 className="text-xl font-bold text-white mb-6 text-center">Interactive Flashcards ({smartData.flashcards.length})</h3>
                       <div className="flex flex-wrap gap-6 justify-center">
                           {smartData.flashcards.map((card, idx) => (
                               <div 
                                    key={idx} 
                                    onClick={() => setFlippedCard(flippedCard === idx ? null : idx)}
                                    className="relative w-full sm:w-80 h-64 perspective-[1000px] cursor-pointer group"
                               >
                                    <div className={`w-full h-full transition-transform duration-500 preserve-3d ${flippedCard === idx ? '[transform:rotateY(180deg)]' : ''}`}>
                                        
                                        {/* Front */}
                                        <div className="absolute w-full h-full backface-hidden glass-panel border-white/20 p-6 rounded-2xl flex flex-col items-center justify-center text-center bg-gradient-to-br from-white/5 to-transparent group-hover:border-primary/50 transition-colors shadow-lg">
                                            <div className="absolute top-4 right-4 text-xs font-bold text-primary/50">Card {idx+1}</div>
                                            <h4 className="text-lg font-semibold text-white drop-shadow-md">{card.question}</h4>
                                            <p className="absolute bottom-4 text-xs text-gray-500 font-medium">Click to flip</p>
                                        </div>

                                        {/* Back */}
                                        <div className="absolute w-full h-full backface-hidden glass-panel border-secondary p-6 rounded-2xl flex flex-col items-center justify-center text-center bg-gradient-to-tl from-secondary/20 to-transparent [transform:rotateY(180deg)] shadow-xl shadow-secondary/10">
                                            <h4 className="text-sm text-white/90 leading-relaxed font-medium">{card.answer}</h4>
                                            <p className="absolute bottom-4 text-xs text-secondary/40 font-medium">Click to close</p>
                                        </div>

                                    </div>
                               </div>
                           ))}
                       </div>
                   </motion.div>
               )}

               {/* QUIZ TAB */}
               {activeTab === 'quiz' && (
                   <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="max-w-3xl mx-auto space-y-6">
                        <div className="text-center mb-8">
                            <h3 className="text-xl font-bold text-white">Document Assessment</h3>
                            <p className="text-gray-400">Test your retention of the material immediately.</p>
                        </div>
                        {smartData.quiz.map((q, qIndex) => (
                            <div key={qIndex} className="glass-panel p-6 rounded-3xl border-white/10">
                               <h3 className="text-lg font-semibold mb-4 text-white">
                                  <span className="text-secondary mr-2">{qIndex + 1}.</span> {q.question}
                               </h3>
                               <div className="space-y-3">
                                  {q.options.map((opt, oIndex) => {
                                      const isSelected = userAnswers[qIndex] === oIndex;
                                      const isCorrect = oIndex === q.correctAnswer;
                                      const showCorrect = quizSubmitted && isCorrect;
                                      const showWrong = quizSubmitted && isSelected && !isCorrect;
                                      
                                      let optStyle = "text-gray-300 bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer";
                                      if (isSelected && !quizSubmitted) optStyle = "border-primary bg-primary/20 text-white";
                                      if (showCorrect) optStyle = "border-green-500 bg-green-500/20 text-white";
                                      if (showWrong) optStyle = "border-red-500 bg-red-500/20 text-white";

                                      return (
                                          <div 
                                              key={oIndex} 
                                              onClick={() => !quizSubmitted && setUserAnswers(prev => ({...prev, [qIndex]: oIndex}))}
                                              className={`w-full text-left p-4 rounded-xl border transition-all ${optStyle}`}
                                           >
                                             <span className="font-medium">{opt} 
                                                {showCorrect && <span className="text-xs text-green-500 float-right font-bold tracking-widest uppercase">Correct</span>}
                                                {showWrong && <span className="text-xs text-red-500 float-right font-bold tracking-widest uppercase">Incorrect</span>}
                                             </span>
                                          </div>
                                      )
                                  })}
                               </div>
                            </div>
                        ))}
                        
                        {!quizSubmitted && (
                             <div className="flex justify-center mt-8">
                                <button 
                                   onClick={() => setQuizSubmitted(true)}
                                   disabled={Object.keys(userAnswers).length !== smartData.quiz.length}
                                   className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl hover:shadow-lg disabled:opacity-50 transition-all"
                                >
                                   Submit Answers to Check
                                </button>
                             </div>
                        )}
                        {quizSubmitted && (
                             <div className="flex justify-center mt-8 space-x-4 items-center">
                                <div className="px-6 py-3 bg-green-500/20 text-green-400 font-bold rounded-xl border border-green-500/30">
                                    Score: {Object.keys(userAnswers).filter(qIdx => userAnswers[qIdx] === smartData.quiz[qIdx].correctAnswer).length} / {smartData.quiz.length}
                                </div>
                                <button 
                                   onClick={() => {
                                       setUserAnswers({});
                                       setQuizSubmitted(false);
                                   }}
                                   className="px-6 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all border border-white/20"
                                >
                                   Retake Practice
                                </button>
                             </div>
                        )}
                   </motion.div>
               )}
           </div>
        </motion.div>
      )}

    </div>
  );
};

export default NotesGen;
