import React, { useEffect, useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import Dashboard from '../components/Dashboard';
import './Home.css';

const Home = () => {
  const { fetchExpenses, fetchStats } = useExpense();
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchExpenses();
    fetchStats();
  }, [fetchExpenses, fetchStats]);

  const handleAddNew = () => {
    setEditingExpense(null);
    setShowForm(!showForm);
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingExpense(null);
    fetchExpenses();
    fetchStats();
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim()) {
      await fetchExpenses({ search: value });
    } else {
      await fetchExpenses();
    }
  };

  const handleCategoryFilter = async (e) => {
    const value = e.target.value;
    setFilterCategory(value);
    if (value) {
      await fetchExpenses({ category: value });
    } else {
      await fetchExpenses();
    }
  };

  return (
    <div className="home-container">
      <Dashboard />
      <div className="controls-section">
        <button className="add-btn" onClick={handleAddNew}>
          {showForm ? '❌ Close' : '➕ Add Expense'}
        </button>
        <input
          type="text"
          placeholder="Search expenses..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />
        <select value={filterCategory} onChange={handleCategoryFilter} className="filter-select">
          <option value="">All Categories</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Utilities">Utilities</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Shopping">Shopping</option>
          <option value="Education">Education</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {showForm && (
        <ExpenseForm editingExpense={editingExpense} onClose={handleFormClose} />
      )}

      <ExpenseList onEdit={handleEdit} />
    </div>
  );
};

export default Home;
