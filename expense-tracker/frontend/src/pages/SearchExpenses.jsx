import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ExpenseCard from '../components/ExpenseCard';
import { AuthContext } from '../context/AuthContext';
import { ExpenseContext } from '../context/ExpenseContext';

const SearchExpenses = () => {
  const { user } = useContext(AuthContext);
  const { deleteExpense } = useContext(ExpenseContext);
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: 'All',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();

      if (filters.category !== 'All') {
        params.append('category', filters.category);
      }
      if (filters.startDate) {
        params.append('startDate', filters.startDate);
      }
      if (filters.endDate) {
        params.append('endDate', filters.endDate);
      }

      const response = await fetch(
        `http://localhost:5000/api/expenses?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      let data = await response.json();

      if (filters.minAmount) {
        data = data.filter((exp) => exp.amount >= parseFloat(filters.minAmount));
      }
      if (filters.maxAmount) {
        data = data.filter((exp) => exp.amount <= parseFloat(filters.maxAmount));
      }

      setExpenses(data);
    } catch (error) {
      console.error('Failed to search expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (expense) => {
    navigate('/add-expense', { state: { expense } });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/expenses/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          deleteExpense(id);
          setExpenses((prev) => prev.filter((exp) => exp._id !== id));
        }
      } catch (error) {
        console.error('Failed to delete expense:', error);
      }
    }
  };

  const categories = [
    'All',
    'Food',
    'Transportation',
    'Entertainment',
    'Shopping',
    'Health',
    'Utilities',
    'Education',
    'Other',
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          Search Expenses
        </h1>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Min Amount
                </label>
                <input
                  type="number"
                  name="minAmount"
                  value={filters.minAmount}
                  onChange={handleFilterChange}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Max Amount
                </label>
                <input
                  type="number"
                  name="maxAmount"
                  value={filters.maxAmount}
                  onChange={handleFilterChange}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Results ({expenses.length})
          </h2>

          {expenses.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow text-center">
              <p className="text-gray-600 dark:text-gray-400">
                No expenses found matching your criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {expenses.map((expense) => (
                <ExpenseCard
                  key={expense._id}
                  expense={expense}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchExpenses;
