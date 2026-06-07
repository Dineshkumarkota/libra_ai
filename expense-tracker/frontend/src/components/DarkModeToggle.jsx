import { useContext } from 'react';
import { Moon, Sun } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';

const DarkModeToggle = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? (
        <Sun size={20} className="text-yellow-400" />
      ) : (
        <Moon size={20} className="text-gray-700" />
      )}
    </button>
  );
};

export default DarkModeToggle;
