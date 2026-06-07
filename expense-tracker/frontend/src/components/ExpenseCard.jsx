import { Trash2, Edit2 } from 'lucide-react';

const ExpenseCard = ({ expense, onEdit, onDelete }) => {
  const categoryEmojis = {
    Food: '🍔',
    Transportation: '🚗',
    Entertainment: '🎬',
    Shopping: '🛍️',
    Health: '🏥',
    Utilities: '💡',
    Education: '📚',
    Other: '📌',
  };

  const formattedDate = new Date(expense.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{categoryEmojis[expense.category]}</span>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white">
              {expense.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {expense.category}
            </p>
          </div>
        </div>
        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
          ${expense.amount.toFixed(2)}
        </span>
      </div>

      {expense.description && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
          {expense.description}
        </p>
      )}

      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <span>{formattedDate}</span>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(expense)}
            className="p-1 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900 rounded transition-colors"
            title="Edit expense"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(expense._id)}
            className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
            title="Delete expense"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;
