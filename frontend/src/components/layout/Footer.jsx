import { Link } from 'react-router-dom';
import { Twitter, Github, Linkedin } from 'lucide-react';
import Logo from '../ui/Logo';

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-background/50 backdrop-blur-sm pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-1 flex flex-col space-y-4">
            <Logo />
            <p className="text-gray-400 text-sm mt-4 max-w-xs">
              Your personal AI-powered study assistant. Ask questions, generate notes, and boost your learning journey.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Group 1 */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              <li><Link to="/features" className="text-gray-400 hover:text-primary text-sm transition-colors">Features</Link></li>
              <li><Link to="/chat" className="text-gray-400 hover:text-primary text-sm transition-colors">AI Tutor</Link></li>
              <li><Link to="/notes" className="text-gray-400 hover:text-primary text-sm transition-colors">Smart Notes</Link></li>
              <li><Link to="/pricing" className="text-gray-400 hover:text-primary text-sm transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Links Group 2 */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><Link to="#" className="text-gray-400 hover:text-primary text-sm transition-colors">Help Center</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-primary text-sm transition-colors">Blog</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-primary text-sm transition-colors">Community</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-primary text-sm transition-colors">Student Guides</Link></li>
            </ul>
          </div>

          {/* Links Group 3 */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link to="#" className="text-gray-400 hover:text-primary text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-primary text-sm transition-colors">Terms of Service</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-primary text-sm transition-colors">Cookie Policy</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-primary text-sm transition-colors">Contact Us</Link></li>
            </ul>
          </div>

        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} EduNova AI. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="#" className="hover:text-white transition-colors">About</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms</Link>
            <Link to="#" className="hover:text-white transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
