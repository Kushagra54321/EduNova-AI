import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, Github } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    try {
      const response = await axios.post('https://edunova-ai-1.onrender.com/api/auth/register', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({ _id: response.data._id, name: response.data.name, email: response.data.email }));
      navigate('/dashboard'); // Redirect to dashboard on successful signup
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
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
          <h2 className="text-3xl font-bold mb-2">Create Your Account</h2>
          <p className="text-gray-400 mb-8">Join EduNova AI and transform your learning.</p>

          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            {/* Name Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-400 mb-1 ml-1 cursor-text">Name</label>
              <div className="relative flex items-center">
                <User className="absolute left-3 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

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

            {/* Gender Select */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-400 mb-1 ml-1 cursor-text">Gender</label>
              <div className="relative flex items-center">
                <select
                  required
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                  defaultValue=""
                >
                  <option value="" disabled className="text-gray-900">Select Gender</option>
                  <option value="Male" className="text-gray-900">Male</option>
                  <option value="Female" className="text-gray-900">Female</option>
                  <option value="Other" className="text-gray-900">Other</option>
                  <option value="Prefer not to say" className="text-gray-900">Prefer not to say</option>
                </select>
              </div>
            </div>

            {/* Age Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-400 mb-1 ml-1 cursor-text">Age</label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  min="10"
                  max="120"
                  placeholder="20"
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
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

            {error && <p className="text-red-400 text-sm text-center font-medium bg-red-400/10 p-2 rounded-lg">{error}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-6 py-4 bg-gradient-to-r from-primary to-secondary rounded-xl text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-[1.02]"
            >
              Sign Up
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-6">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:text-white transition-colors font-medium">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
