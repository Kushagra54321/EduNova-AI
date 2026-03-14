import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AuthSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card border border-primary/20 p-10 md:p-16 text-center relative overflow-hidden rounded-[2.5rem]"
        >
          {/* Inner Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-b from-primary/20 to-transparent pointer-events-none" />
          
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 relative z-10">
            Ready to transform your <br className="hidden md:block" />
            <span className="text-gradient hover:scale-105 inline-block transition-transform cursor-default">study sessions ?</span>
          </h2>
          
          <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto relative z-10">
            Join thousands of students learning faster, smarter, and more efficiently with EduNova AI.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Link
              to="/signup"
              className="px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-primary to-secondary rounded-full shadow-lg hover:shadow-primary/40 transition-all hover:scale-105"
            >
              Create Free Account
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 text-base font-semibold text-white glass-panel rounded-full hover:bg-white/10 transition-all hover:scale-105"
            >
              Sign In
            </Link>
          </div>
          
        </motion.div>
      </div>
    </section>
  );
};

export default AuthSection;
