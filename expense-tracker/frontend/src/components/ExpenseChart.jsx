import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

const ExpenseChart = ({ expenses }) => {
  const chartData = useMemo(() => {
    const categoryStats = {};
    expenses.forEach((expense) => {
      if (!categoryStats[expense.category]) {
        categoryStats[expense.category] = 0;
      }
      categoryStats[expense.category] += expense.amount;
    });

    return Object.entries(categoryStats).map(([category, amount]) => ({
      name: category,
      value: parseFloat(amount.toFixed(2)),
    }));
  }, [expenses]);

  const COLORS = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#FFA07A',
    '#98D8C8',
    '#F7DC6F',
    '#BB8FCE',
    '#85C1E2',
  ];

  if (chartData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center text-gray-500 dark:text-gray-400">
        No expense data available for chart
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Expenses by Category (Pie Chart)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: $${value}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `$${value.toFixed(2)}`}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Expenses by Category (Bar Chart)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value) => `$${value.toFixed(2)}`}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
            <Bar dataKey="value" fill="#4ECDC4" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpenseChart;
