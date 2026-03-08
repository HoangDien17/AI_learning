import { Link, useLocation } from 'react-router-dom';
import { Heart, UserPlus, Search, User } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Home', icon: Heart },
  { to: '/create-profile', label: 'Create Profile', icon: UserPlus },
  { to: '/find-matches', label: 'Find Matches', icon: Search },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="glass sticky top-0 z-50 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Heart className="h-7 w-7 text-primary-500" fill="currentColor" />
            <span className="text-xl font-bold gradient-text">AI Matchmaker</span>
          </Link>

          <div className="flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const active = pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                    ${active
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
