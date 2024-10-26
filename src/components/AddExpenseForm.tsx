import React, { useEffect, useState } from "react";

interface Expense {
  id: number;
  amount: number;
  category: string;
  date: string;
  description: string;
}

interface Props {
  onAddExpense: (expense: Expense) => void;
  editingExpense: Expense | null;
  setEditingExpense: (expense: Expense | null) => void; // New prop
}

const AddExpenseForm: React.FC<Props> = ({ onAddExpense, editingExpense, setEditingExpense }) => {
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    date: "",
    description: "",
  });

  useEffect(() => {
    if (editingExpense) {
      setFormData({
        amount: editingExpense.amount.toString(),
        category: editingExpense.category,
        date: editingExpense.date,
        description: editingExpense.description,
      });
    }
  }, [editingExpense]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { amount, category, date, description } = formData;

    if (!amount || !category || !date || !description) {
      alert("Please fill out all fields");
      return;
    }

    const newExpense = {
      id: editingExpense ? editingExpense.id : Date.now(), // Use existing ID if editing
      amount: parseFloat(amount),
      category,
      date,
      description,
    };

    onAddExpense(newExpense);
    setFormData({ amount: "", category: "", date: "", description: "" });
    
    // Clear editing state after submission
    setEditingExpense(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded">
      <input
        type="number"
        value={formData.amount}
        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        placeholder="Amount"
        className="p-2 border rounded w-full"
      />
      <input
        type="text"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        placeholder="Category"
        className="p-2 border rounded w-full"
      />
      <input
        type="date"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        className="p-2 border rounded w-full"
      />
      <input
        type="text"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Description"
        className="p-2 border rounded w-full"
      />
      <button type="submit" className="p-2 bg-blue-500 text-white rounded">
        {editingExpense ? "Update Expense" : "Add Expense"}
      </button>
    </form>
  );
};

export default AddExpenseForm;
