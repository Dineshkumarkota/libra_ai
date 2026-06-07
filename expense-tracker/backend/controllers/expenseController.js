const Expense = require('../models/Expense');

// @desc    Get all expenses for a user
// @route   GET /api/expenses
exports.getExpenses = async (req, res, next) => {
  try {
    const { category, startDate, endDate, search } = req.query;
    let query = { user: req.user.id };

    if (category) {
      query.category = category;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const expenses = await Expense.find(query).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single expense
// @route   GET /api/expenses/:id
exports.getExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    // Check if user owns the expense
    if (expense.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this expense' });
    }

    res.status(200).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new expense
// @route   POST /api/expenses
exports.createExpense = async (req, res, next) => {
  try {
    const { title, description, amount, category, date, paymentMethod } = req.body;

    const expense = await Expense.create({
      user: req.user.id,
      title,
      description,
      amount,
      category,
      date,
      paymentMethod,
    });

    res.status(201).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
exports.updateExpense = async (req, res, next) => {
  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    // Check if user owns the expense
    if (expense.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this expense' });
    }

    expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
exports.deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    // Check if user owns the expense
    if (expense.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this expense' });
    }

    await Expense.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get expense statistics
// @route   GET /api/expenses/stats/dashboard
exports.getStats = async (req, res, next) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });

    // Total expenses
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Monthly expenses (current month)
    const now = new Date();
    const currentMonth = expenses.filter((exp) => {
      return (
        exp.date.getMonth() === now.getMonth() && exp.date.getFullYear() === now.getFullYear()
      );
    });
    const monthlyExpenses = currentMonth.reduce((sum, exp) => sum + exp.amount, 0);

    // Category breakdown
    const categoryBreakdown = expenses.reduce((acc, exp) => {
      const existing = acc.find((item) => item.category === exp.category);
      if (existing) {
        existing.amount += exp.amount;
        existing.count += 1;
      } else {
        acc.push({ category: exp.category, amount: exp.amount, count: 1 });
      }
      return acc;
    }, []);

    // Recent transactions (last 5)
    const recentTransactions = expenses.slice(0, 5);

    res.status(200).json({
      success: true,
      data: {
        totalExpenses,
        monthlyExpenses,
        categoryBreakdown,
        recentTransactions,
        totalTransactions: expenses.length,
      },
    });
  } catch (error) {
    next(error);
  }
};
