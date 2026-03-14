import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import axios from 'axios';
import Home from './pages/Home';
import Features from './components/home/Features';
import AiChat from './pages/AiChat';
import NotesGen from './pages/NotesGen';
import StudyPlanner from './pages/StudyPlanner';
import QuizGen from './pages/QuizGen';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import PrivateRoute from './components/layout/PrivateRoute';

function App() {
  useEffect(() => {
    const autoLoginUser = async () => {
      const token = localStorage.getItem('token');
      // If token is missing, attempt to auto-login immediately
      if (!token) {
        try {
          const response = await axios.post('https://edunova-ai-1.onrender.com/api/auth/auto-login');
          localStorage.setItem('user', JSON.stringify({ 
            _id: response.data._id, 
            name: response.data.name, 
            email: response.data.email 
          }));
          localStorage.setItem('token', response.data.token);
          console.log('Initial auto-login successful');
        } catch (err) {
          console.error('Initial auto-login failed:', err);
        }
      }
    };

    autoLoginUser();

    // Global Axios Interceptor to catch 401 Token Errors anywhere in the app
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // If 401 and not already retrying, attempt auto-login
        if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== 'https://edunova-ai-1.onrender.com/api/auth/auto-login') {
          originalRequest._retry = true;
          try {
            const autoRes = await axios.post('https://edunova-ai-1.onrender.com/api/auth/auto-login');
            localStorage.setItem('user', JSON.stringify({ 
              _id: autoRes.data._id, 
              name: autoRes.data.name, 
              email: autoRes.data.email 
            }));
            const newToken = autoRes.data.token;
            localStorage.setItem('token', newToken);
            
            // Retry the original request with the new token
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return axios(originalRequest);
          } catch (autoErr) {
            console.error('Auto-login retry failed:', autoErr);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
            return Promise.reject(autoErr);
          }
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptor on unmount
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-background text-white font-sans selection:bg-primary/30">
        <Navbar />
        <main className="pt-20"> {/* Padding top to account for sticky navbar */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          
            {/* Protected Routes */}
            <Route path="/chat" element={<PrivateRoute><AiChat /></PrivateRoute>} />
            <Route path="/notes" element={<PrivateRoute><NotesGen /></PrivateRoute>} />
            <Route path="/planner" element={<PrivateRoute><StudyPlanner /></PrivateRoute>} />
            <Route path="/quiz" element={<PrivateRoute><QuizGen /></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
