import React from 'react';
import { useExpense } from '../context/ExpenseContext';
import './ExpenseList.css';

const ExpenseList = ({ onEdit }) => {
  const { expenses, loading, deleteExpense } = useExpense();

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(id);
      } catch (err) {
        alert('Failed to delete expense');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading expenses...</div>;
  }

  if (expenses.length === 0) {
    return <div className="no-expenses">No expenses found. Add your first expense!</div>;
  }

  return (
    <div className="expense-list">
      <h2>Recent Expenses</h2>
      <div className="expenses-table">
        <div className="table-header">
          <div>Title</div>
          <div>Category</div>
          <div>Amount</div>
          <div>Date</div>
          <div>Actions</div>
        </div>
        {expenses.map((expense) => (
          <div key={expense._id} className="table-row">
            <div>{expense.title}</div>
            <div>
              <span className={`category-tag ${expense.category.toLowerCase()}`}>
                {expense.category}
              </span>
            </div>
            <div className="amount">₹{expense.amount.toFixed(2)}</div>
            <div>{new Date(expense.date).toLocaleDateString()}</div>
            <div className="actions">
              <button onClick={() => onEdit(expense)} className="edit-btn">
                Edit
              </button>
              <button onClick={() => handleDelete(expense._id)} className="delete-btn">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;
