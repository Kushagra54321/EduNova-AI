import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Activity, Info } from 'lucide-react';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load user data from localStorage where we saved it during login/signup
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
    }
  }, []);

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4">
        <p className="text-gray-400">Loading profile data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] p-4 md:p-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 md:p-12 relative overflow-hidden"
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-10 border-b border-white/10 pb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-4xl font-bold text-white shadow-lg shadow-primary/30 border-4 border-background">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
            <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400 font-medium">
              <Mail className="w-4 h-4" />
              {user.email}
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">
               <Activity className="w-3 h-3 text-primary" />
               Active Student
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <Info className="w-5 h-5 text-secondary" />
          Personal Details
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gender Box */}
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-start gap-4 hover:bg-white/10 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">Gender</p>
              <p className="text-lg font-semibold text-white mt-1 capitalize">{user.gender || 'Not specified'}</p>
            </div>
          </div>

          {/* Age Box */}
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-start gap-4 hover:bg-white/10 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">Age</p>
              <p className="text-lg font-semibold text-white mt-1">{user.age ? `${user.age} Years Old` : 'Not specified'}</p>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default Profile;
