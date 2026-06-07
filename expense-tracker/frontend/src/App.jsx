import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import { ExpenseProvider } from './context/ExpenseContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ExpenseForm from './pages/ExpenseForm';
import SearchExpenses from './pages/SearchExpenses';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-expense"
        element={
          <ProtectedRoute>
            <ExpenseForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <SearchExpenses />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ExpenseProvider>
            <AppContent />
          </ExpenseProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
