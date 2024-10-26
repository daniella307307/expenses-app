import React, { useEffect, useState } from "react";
import AddExpenseForm from "./AddExpenseForm.tsx";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface Expense {
  id: number;
  amount: number;
  category: string;
  date: string;
  description: string;
}

const ExpensesList: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const savedExpenses = localStorage.getItem("expenses");
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });
  const [filterCategory, setFilterCategory] = useState("");
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const editExpense = (expense: Expense) => {
    setEditingExpense(expense);
  };

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (expense: Expense) => {
    // Check if we are editing an existing expense
    if (editingExpense) {
      setExpenses((prev) =>
        prev.map((exp) => (exp.id === expense.id ? expense : exp))
      );
      setEditingExpense(null); // Reset editing state after saving
    } else {
      // Adding a new expense
      setExpenses((prev) => [...prev, expense]);
    }
  };

  const deleteExpense = (id: number) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  const filteredExpenses = filterCategory
    ? expenses.filter((expense) => expense.category === filterCategory)
    : expenses;

  const total = filteredExpenses.reduce(
    (acc, expense) => acc + expense.amount,
    0
  );

  const groupByCategory = (expenses: Expense[]) => {
    return expenses.reduce((groups, expense) => {
      const category = expense.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(expense);
      return groups;
    }, {} as Record<string, Expense[]>);
  };

  const groupedExpenses = groupByCategory(filteredExpenses);

  // Prepare data for the pie chart
  const pieChartData = Object.keys(groupedExpenses).map((category) => ({
    name: category,
    value: groupedExpenses[category].reduce(
      (sum, expense) => sum + expense.amount,
      0
    ),
  }));

  return (
    <div className="p-4">
      <AddExpenseForm onAddExpense={addExpense} editingExpense={editingExpense} setEditingExpense={setEditingExpense} />
      <div className="mt-6">
        <select
          onChange={(e) => setFilterCategory(e.target.value)}
          className="p-2 border rounded w-full mb-4"
        >
          <option value="">All Categories</option>
          {Array.from(new Set(expenses.map((expense) => expense.category))).map(
            (category) => (
              <option key={category} value={category}>
                {category}
              </option>
            )
          )}
        </select>

        <h2 className="text-xl font-bold mb-4">
          Total Expenses: ${total.toFixed(2)}
        </h2>

        {/* Pie Chart */}
        <PieChart width={400} height={400}>
          <Pie
            data={pieChartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {pieChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#0088FE' : '#FF8042'} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>

        <ul className="space-y-4 mt-6">
          {filteredExpenses.map((expense) => (
            <li key={expense.id} className="p-4 border rounded">
              <p>
                <strong>Amount:</strong> ${expense.amount}
              </p>
              <p>
                <strong>Category:</strong> {expense.category}
              </p>
              <p>
                <strong>Date:</strong> {expense.date}
              </p>
              <p>
                <strong>Description:</strong> {expense.description}
              </p>
              <button
                onClick={() => deleteExpense(expense.id)}
                className="text-red-500 mt-2"
              >
                Delete
              </button>
              <button
                onClick={() => editExpense(expense)}
                className="text-blue-500 mt-2"
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ExpensesList;
