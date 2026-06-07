import { useContext, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ExpenseCard from '../components/ExpenseCard';
import ExpenseChart from '../components/ExpenseChart';
import { AuthContext } from '../context/AuthContext';
import { ExpenseContext } from '../context/ExpenseContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { expenses, setExpensesList, addExpense, updateExpense, deleteExpense } =
    useContext(ExpenseContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          'http://localhost:5000/api/expenses?category=' + filterCategory,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        setExpensesList(data);

        const total = data.reduce((sum, exp) => sum + exp.amount, 0);
        setTotalAmount(total);
      } catch (error) {
        console.error('Failed to fetch expenses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [user, navigate, filterCategory, setExpensesList]);

  const handleEdit = (expense) => {
    setEditingExpense(expense);
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
          setTotalAmount((prev) =>
            prev - (expenses.find((e) => e._id === id)?.amount || 0)
          );
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
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Welcome, {user.username}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Track and manage your expenses efficiently
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
              Total Expenses
            </h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              ${totalAmount.toFixed(2)}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
              Number of Expenses
            </h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {expenses.length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
              Average Expense
            </h3>
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              ${(totalAmount / (expenses.length || 1)).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Filter by Category:
          </label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {expenses.length > 0 && <ExpenseChart expenses={expenses} />}

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Recent Expenses
          </h2>

          {loading ? (
            <div className="text-center text-gray-600 dark:text-gray-400">
              Loading expenses...
            </div>
          ) : expenses.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No expenses found. Start tracking your expenses!
              </p>
              <a
                href="/add-expense"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Add Your First Expense
              </a>
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

export default Dashboard;
