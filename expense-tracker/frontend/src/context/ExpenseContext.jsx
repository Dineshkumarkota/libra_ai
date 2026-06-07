import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../api';

const ExpenseContext = createContext();

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within ExpenseProvider');
  }
  return context;
};

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchExpenses = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const response = await api.get('/expenses', { params: filters });
      setExpenses(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const response = await api.get('/expenses/stats/dashboard');
      setStats(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch stats');
    }
  }, []);

  const addExpense = useCallback(async (expenseData) => {
    try {
      const response = await api.post('/expenses', expenseData);
      setExpenses([response.data.data, ...expenses]);
      setError(null);
      return response.data.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  }, [expenses]);

  const updateExpense = useCallback(async (id, expenseData) => {
    try {
      const response = await api.put(`/expenses/${id}`, expenseData);
      setExpenses(expenses.map((exp) => (exp._id === id ? response.data.data : exp)));
      setError(null);
      return response.data.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  }, [expenses]);

  const deleteExpense = useCallback(async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      setExpenses(expenses.filter((exp) => exp._id !== id));
      setError(null);
    } catch (err) {
      throw err.response?.data || err;
    }
  }, [expenses]);

  const searchExpenses = useCallback(async (query) => {
    await fetchExpenses({ search: query });
  }, [fetchExpenses]);

  const filterByCategory = useCallback(async (category) => {
    await fetchExpenses({ category });
  }, [fetchExpenses]);

  const value = {
    expenses,
    stats,
    loading,
    error,
    fetchExpenses,
    fetchStats,
    addExpense,
    updateExpense,
    deleteExpense,
    searchExpenses,
    filterByCategory,
  };

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
};
