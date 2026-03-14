import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({ email: '', newPassword: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    setIsLoading(true);

    try {
      const response = await axios.post('https://edunova-ai-1.onrender.com/api/auth/reset-password', formData);
      setStatus({ type: 'success', message: response.data.message || 'Password reset successfully.' });
      setFormData({ email: '', newPassword: '' }); // clear form
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: err.response?.data?.message || 'Failed to reset password. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8 md:p-10 relative overflow-hidden text-center">
          {/* Header */}
          <h2 className="text-3xl font-bold mb-2">Reset Password</h2>
          <p className="text-gray-400 mb-8">Enter your email and a new password to reset it.</p>

          {status.message && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-medium flex items-center gap-2 justify-center ${
                status.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
            }`}>
              {status.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
              {status.message}
            </div>
          )}

          {status.type !== 'success' ? (
            <form onSubmit={handleSubmit} className="space-y-5 text-left">
              {/* Email Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-400 mb-1 ml-1 cursor-text">Email</label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    placeholder="name@example.com"
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              {/* New Password Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-400 mb-1 ml-1 cursor-text">New Password</label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    required
                    minLength="6"
                    value={formData.newPassword}
                    placeholder="••••••••"
                    onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 py-4 bg-gradient-to-r from-primary to-secondary rounded-xl text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
                {!isLoading && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>
          ) : (
             <Link 
                to="/login"
                className="w-full mt-2 py-4 bg-white/10 rounded-xl text-white font-bold flex items-center justify-center hover:bg-white/20 transition-all"
             >
                Return to Login
             </Link>
          )}

          {/* Footer Link */}
          <div className="mt-6">
            <Link to="/login" className="text-gray-400 text-sm hover:text-white transition-colors">
              Remember your password? <span className="text-primary font-medium">Sign in</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
