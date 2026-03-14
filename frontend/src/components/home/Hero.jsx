import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20">
      
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute top-[20%] right-[-10%] w-[35%] h-[40%] bg-secondary/20 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8"
        >
          <Sparkles className="w-4 h-4 text-secondary" />
          <span className="text-sm font-medium text-gray-200">Meet Your AI Study Assistant</span>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Ask anything. <br className="hidden md:block" />
            <span className="text-gradient">Learn everything.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Your powerful AI companion for studying. Generate smart notes, solve complex questions, summarize long topics, and boost your learning journey instantly.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/chat"
            className="flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-primary to-secondary rounded-full shadow-[0_0_30px_rgba(161,140,209,0.3)] hover:shadow-[0_0_40px_rgba(161,140,209,0.5)] transition-all hover:scale-105"
          >
            Start Studying
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/features"
            className="flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white glass-panel rounded-full hover:bg-white/10 transition-all hover:scale-105"
          >
            Try AI Tutor
          </Link>
        </motion.div>

        {/* Dashboard Preview / Illustration (Mockup) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-20 w-full max-w-5xl relative animate-float mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 top-1/2" />
          <div className="glass-card p-2 rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 border-white/5 mx-4 md:mx-0 relative">
             {/* Fake Interface Header */}
             <div className="h-8 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
                 <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                 <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
             </div>
             {/* Fake Interface Content */}
             <div className="h-[300px] md:h-[400px] bg-background/50 relative overflow-hidden flex flex-col">
                <div className="flex-1 p-6 flex gap-4 flex-col">
                   <div className="self-end bg-primary/20 p-4 rounded-t-2xl rounded-bl-2xl max-w-[80%] border border-primary/30">
                     <p className="text-sm">Explain how neural networks learn, keeping it simple.</p>
                   </div>
                   <div className="self-start glass-panel p-4 rounded-t-2xl rounded-br-2xl max-w-[80%]">
                     <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="font-semibold text-sm">EduNova AI</span>
                     </div>
                     <p className="text-sm text-gray-300">Imagine a team of experts trying to identify an image. Each expert looks for a tiny detail (like edges, colors). They pass their findings to the next layer of experts, who combine these details into shapes. Finally, the boss makes a decision based on all the reports. They learn by adjusting how much they trust each expert based on whether the final guess was right or wrong!</p>
                   </div>
                </div>
             </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
