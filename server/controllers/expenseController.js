const Expense = require("../models/Expenses");
const User = require("../models/User");

exports.addExpense = async (req, res) => {
  const { description, amount } = req.body;
  const userId = req.user.userId;

  try {
    const expense = await Expense.create({ userId, description, amount });
    const user = await User.findById(userId);
    user.savings -= amount;
    await user.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ error: "Error adding expense" });
  }
};

exports.getExpenses = async (req, res) => {
  const userId = req.user.userId;
  try {
    const expenses = await Expense.find({ userId });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving expenses" });
  }
};

exports.getBalance = async (req, res) => {
  const userId = req.user.userId;
  try {
    const user = await User.findById(userId);
    res.json({ savings: user.savings });
  } catch (error) {
    res.status(500).json({ error: "Error retrieving balance" });
  }
};
