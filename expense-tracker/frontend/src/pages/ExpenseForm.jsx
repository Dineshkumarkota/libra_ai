import { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { ExpenseContext } from '../context/ExpenseContext';

const ExpenseForm = () => {
  const { user } = useContext(AuthContext);
  const { addExpense, updateExpense } = useContext(ExpenseContext);
  const navigate = useNavigate();
  const location = useLocation();
  const editingExpense = location.state?.expense;

  const [formData, setFormData] = useState({
    title: editingExpense?.title || '',
    amount: editingExpense?.amount || '',
    category: editingExpense?.category || 'Food',
    date: editingExpense?.date?.split('T')[0] || new Date().toISOString().split('T')[0],
    description: editingExpense?.description || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const url = editingExpense
        ? `http://localhost:5000/api/expenses/${editingExpense._id}`
        : 'http://localhost:5000/api/expenses';

      const method = editingExpense ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to save expense');
        return;
      }

      if (editingExpense) {
        updateExpense(editingExpense._id, data.expense);
      } else {
        addExpense(data.expense);
      }

      navigate('/dashboard');
    } catch (err) {
      setError('An error occurred while saving the expense');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
            {editingExpense ? 'Edit Expense' : 'Add New Expense'}
          </h1>

          {error && (
            <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Amount
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white outline-none"
              >
                <option>Food</option>
                <option>Transportation</option>
                <option>Entertainment</option>
                <option>Shopping</option>
                <option>Health</option>
                <option>Utilities</option>
                <option>Education</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description (Optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : editingExpense ? 'Update Expense' : 'Add Expense'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="w-full bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExpenseForm;
