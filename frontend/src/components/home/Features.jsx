import { motion } from 'framer-motion';
import { Bot, BookOpen, FileText, LayoutList, Calendar, LineChart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Features = () => {
  const features = [
    {
      title: 'AI Question Solver',
      description: 'Stuck on a problem ? Get instant, detailed explanations and step - by - step solutions for complex questions.',
      icon: <Bot className="w-6 h-6 text-primary" />,
      link: '/chat'
    },
    {
      title: 'Smart Notes Generator',
      description: 'Provide a topic and let AI instantly compile structured, comprehensive notes for efficient studying.',
      icon: <BookOpen className="w-6 h-6 text-secondary" />,
      link: '/notes'
    },
    {
      title: 'Topic Summarizer',
      description: 'Upload PDFs or paste long text to generate concise summaries, highlighting key concepts instantly.',
      icon: <FileText className="w-6 h-6 text-blue-400" />,
      link: '/notes' // Pointing to notes for now
    },
    {
      title: 'Quiz Generator',
      description: 'Test your knowledge with custom - generated MCQs based on specific topics and get instant feedback.',
      icon: <LayoutList className="w-6 h-6 text-green-400" />,
      link: '/chat' // Placeholder link
    },
    {
      title: 'Study Planner',
      description: 'Input your exam date and topics, and receive a smart, balanced daily revision schedule.',
      icon: <Calendar className="w-6 h-6 text-orange-400" />,
      link: '/planner'
    },
    {
      title: 'Progress Tracker',
      description: 'Track your quiz scores, identify weak areas, and visualize your learning growth dynamically.',
      icon: <LineChart className="w-6 h-6 text-pink-400" />,
      link: '/dashboard'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold tracking-tight mb-4"
          >
            Everything you need to <span className="text-gradient">Excel</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Powerful tools designed specifically for students to accelerate learning and maximize productivity.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="glass-card p-6 flex flex-col h-full group transition-all duration-300 hover:shadow-primary/20 hover:border-primary/30"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400 mb-6 flex-grow">
                {feature.description}
              </p>
              <Link 
                to={feature.link}
                className="text-primary font-medium flex items-center gap-1 group/link w-max"
              >
                Learn more 
                <span className="group-hover/link:translate-x-1 transition-transform">→</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Features;
