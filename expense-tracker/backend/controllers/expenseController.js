import Expense from '../models/Expense.js';

const createExpense = async (req, res) => {
  try {
    const { title, amount, category, date, description } = req.body;
    const userId = req.userId;

    if (!title || !amount || !category || !date) {
      return res
        .status(400)
        .json({ message: 'Please provide title, amount, category, and date' });
    }

    const expense = new Expense({
      userId,
      title,
      amount,
      category,
      date,
      description: description || '',
    });

    await expense.save();
    res.status(201).json({ message: 'Expense created successfully', expense });
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({ message: 'Error creating expense' });
  }
};

const getExpenses = async (req, res) => {
  try {
    const userId = req.userId;
    const { startDate, endDate, category } = req.query;

    let filter = { userId };

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ message: 'Error fetching expenses' });
  }
};

const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { title, amount, category, date, description } = req.body;

    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (expense.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: 'Not authorized to update this expense' });
    }

    if (title) expense.title = title;
    if (amount) expense.amount = amount;
    if (category) expense.category = category;
    if (date) expense.date = date;
    if (description !== undefined) expense.description = description;

    await expense.save();
    res.json({ message: 'Expense updated successfully', expense });
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ message: 'Error updating expense' });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (expense.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: 'Not authorized to delete this expense' });
    }

    await Expense.deleteOne({ _id: id });
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ message: 'Error deleting expense' });
  }
};

const getExpenseStats = async (req, res) => {
  try {
    const userId = req.userId;
    const { startDate, endDate } = req.query;

    let filter = { userId };

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }

    const expenses = await Expense.find(filter);

    const stats = {};
    expenses.forEach((expense) => {
      if (!stats[expense.category]) {
        stats[expense.category] = 0;
      }
      stats[expense.category] += expense.amount;
    });

    const total = Object.values(stats).reduce((a, b) => a + b, 0);

    res.json({ stats, total });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Error fetching stats' });
  }
};

export {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getExpenseStats,
};
