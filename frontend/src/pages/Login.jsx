import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowRight, Github } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('user', JSON.stringify({ _id: response.data._id, name: response.data.name, email: response.data.email }));
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  const handleGuestLogin = async () => {
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/guest-login');
      localStorage.setItem('user', JSON.stringify({ _id: response.data._id, name: response.data.name, email: response.data.email, isGuest: true }));
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Guest login failed. Please try again.');
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
          <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
          <p className="text-gray-400 mb-8">Sign in to continue your learning journey.</p>

          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            
            {/* Email Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-400 mb-1 ml-1 cursor-text">Email</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-400 mb-1 ml-1 cursor-text">Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-6 py-4 bg-gradient-to-r from-primary to-secondary rounded-xl text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-[1.02]"
            >
              Sign In
              <LogIn className="w-5 h-5" />
            </button>
            
            {/* Guest Login Button */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">or</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>
            
            <button
              type="button"
              onClick={handleGuestLogin}
              className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all hover:scale-[1.02]"
            >
              Continue as Guest
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-6 flex flex-col gap-2">
            <Link to="/forgot-password" className="text-gray-500 text-sm hover:text-white transition-colors">
               Forgot your password?
            </Link>
            {error && <p className="text-red-400 text-sm text-center font-medium bg-red-400/10 p-2 rounded-lg">{error}</p>}
            <p className="text-gray-400 text-sm mt-2">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:text-white transition-colors font-medium">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
