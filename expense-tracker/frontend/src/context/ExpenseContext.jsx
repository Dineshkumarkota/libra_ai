import { createContext, useState, useCallback } from 'react';

export const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addExpense = useCallback((expense) => {
    setExpenses((prev) => [expense, ...prev]);
  }, []);

  const updateExpense = useCallback((id, updatedExpense) => {
    setExpenses((prev) =>
      prev.map((exp) => (exp._id === id ? updatedExpense : exp))
    );
  }, []);

  const deleteExpense = useCallback((id) => {
    setExpenses((prev) => prev.filter((exp) => exp._id !== id));
  }, []);

  const setExpensesList = useCallback((list) => {
    setExpenses(list);
  }, []);

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        loading,
        error,
        setLoading,
        setError,
        addExpense,
        updateExpense,
        deleteExpense,
        setExpensesList,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};
