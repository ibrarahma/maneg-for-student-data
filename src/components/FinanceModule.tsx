import React, { useState, useEffect } from 'react';
import { DollarSign, Plus, Trash2, CheckCircle, X } from 'lucide-react';
import { Expense, dataService, User } from '../services/dataService';

export const FinanceModule: React.FC<{ currentUser: User }> = ({ currentUser }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Form
  const [category, setCategory] = useState<Expense['category']>('Maintenance');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(5000);
  const [paymentMode, setPaymentMode] = useState<Expense['paymentMode']>('UPI');

  const loadData = async () => {
    const data = await dataService.getExpenses({ category: categoryFilter });
    setExpenses(data);
  };

  useEffect(() => {
    loadData();
  }, [categoryFilter]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await dataService.createExpense({
      category,
      description,
      amount,
      date: new Date().toISOString().slice(0, 10),
      paymentMode,
      addedBy: currentUser.name
    });
    setToast(`Logged expense of ₹${amount} under ${category}`);
    setIsAddOpen(false);
    setDescription('');
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this expense record?')) {
      await dataService.deleteExpense(id);
      loadData();
    }
  };

  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      {toast && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-lg text-xs flex items-center justify-between">
          <span>{toast}</span>
          <button onClick={() => setToast(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="flex justify-between items-center pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Expense Management</h2>
          <p className="text-xs text-slate-500">Track and categorize school operating expenditures</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Expense</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase">
              <th className="py-2.5 px-4">Ref</th>
              <th className="py-2.5 px-4">Date</th>
              <th className="py-2.5 px-4">Category</th>
              <th className="py-2.5 px-4">Description</th>
              <th className="py-2.5 px-4">Mode</th>
              <th className="py-2.5 px-4 text-right">Amount</th>
              <th className="py-2.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {expenses.map((e) => (
              <tr key={e.id} className="hover:bg-slate-50">
                <td className="py-2.5 px-4 font-mono font-medium">{e.expenseId}</td>
                <td className="py-2.5 px-4 text-slate-500">{e.date}</td>
                <td className="py-2.5 px-4 font-semibold text-slate-800">{e.category}</td>
                <td className="py-2.5 px-4 text-slate-600 max-w-xs truncate">{e.description}</td>
                <td className="py-2.5 px-4">{e.paymentMode}</td>
                <td className="py-2.5 px-4 text-right font-mono font-bold text-rose-700">₹{e.amount.toLocaleString()}</td>
                <td className="py-2.5 px-4 text-right">
                  <button onClick={() => handleDelete(e.id)} className="text-slate-400 hover:text-rose-600 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-5">
            <h3 className="font-bold text-sm mb-3">Record Expense</h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block mb-1 font-semibold text-slate-700">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value as any)} className="w-full p-2 border rounded">
                  <option value="Electricity">Electricity</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Stationery">Stationery</option>
                  <option value="Transport">Transport</option>
                  <option value="Events">Events</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-semibold text-slate-700">Description</label>
                <input required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded" placeholder="Details..." />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-slate-700">Amount (₹)</label>
                <input required type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full p-2 border rounded font-mono font-bold" />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setIsAddOpen(false)} className="px-3 py-1 bg-slate-100 rounded">Cancel</button>
                <button type="submit" className="px-4 py-1 bg-teal-600 text-white rounded font-semibold">Save Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
