import { GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary p-[2px] shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
        <div className="flex items-center justify-center w-full h-full bg-background rounded-[10px]">
          <GraduationCap className="w-5 h-5 text-secondary" />
        </div>
      </div>
      <span className="text-xl font-bold tracking-tight text-white">
        EduNova <span className="text-gradient">AI</span>
      </span>
    </Link>
  );
};

export default Logo;
