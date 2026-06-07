import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import DarkModeToggle from './DarkModeToggle';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-blue-600 dark:bg-blue-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-bold">
          💰 Expense Tracker
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link to="/dashboard" className="hover:text-blue-200 transition-colors">
            Dashboard
          </Link>
          <Link to="/add-expense" className="hover:text-blue-200 transition-colors">
            Add Expense
          </Link>
          <Link to="/search" className="hover:text-blue-200 transition-colors">
            Search
          </Link>
          <DarkModeToggle />
          <span className="text-sm">{user.username}</span>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>

        <div className="md:hidden flex items-center space-x-4">
          <DarkModeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-blue-700 dark:bg-blue-800 px-4 py-2 space-y-2">
          <Link
            to="/dashboard"
            className="block py-2 hover:bg-blue-600 px-2 rounded"
          >
            Dashboard
          </Link>
          <Link
            to="/add-expense"
            className="block py-2 hover:bg-blue-600 px-2 rounded"
          >
            Add Expense
          </Link>
          <Link to="/search" className="block py-2 hover:bg-blue-600 px-2 rounded">
            Search
          </Link>
          <span className="block py-2">{user.username}</span>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-1 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
