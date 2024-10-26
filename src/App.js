import React from 'react';
import ExpensesList from './components/ExpensesList.tsx';


function App() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Expense Tracker</h1>
      <ExpensesList />
    </div>
  );
}

export default App;
