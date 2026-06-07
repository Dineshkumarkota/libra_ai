import React, { useEffect } from 'react';
import { useExpense } from '../context/ExpenseContext';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import './Dashboard.css';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0', '#ffb347', '#87ceeb'];

const Dashboard = () => {
  const { stats, fetchStats } = useExpense();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (!stats) {
    return <div className="loading">Loading dashboard...</div>;
  }

  const chartData = stats.categoryBreakdown.map((item) => ({
    name: item.category,
    value: item.amount,
  }));

  return (
    <div className="dashboard">
      <div className="stats-grid">
        <div className="stat-card total">
          <h3>Total Expenses</h3>
          <p className="stat-value">₹{stats.totalExpenses.toFixed(2)}</p>
        </div>
        <div className="stat-card monthly">
          <h3>Monthly Expenses</h3>
          <p className="stat-value">₹{stats.monthlyExpenses.toFixed(2)}</p>
        </div>
        <div className="stat-card transactions">
          <h3>Total Transactions</h3>
          <p className="stat-value">{stats.totalTransactions}</p>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-container">
          <h3>Expenses by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ₹${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {stats.recentTransactions.length > 0 && (
        <div className="recent-transactions">
          <h3>Recent Transactions</h3>
          <div className="transactions-list">
            {stats.recentTransactions.map((transaction) => (
              <div key={transaction._id} className="transaction-item">
                <div className="transaction-info">
                  <p className="transaction-title">{transaction.title}</p>
                  <p className="transaction-date">{new Date(transaction.date).toLocaleDateString()}</p>
                </div>
                <div className={`transaction-amount ${transaction.category.toLowerCase()}`}>
                  ₹{transaction.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
