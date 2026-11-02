import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Plus, Search, Receipt, Printer, Trash2, 
  CheckCircle, AlertCircle, X, DollarSign, Share2 
} from 'lucide-react';
import { 
  FeePayment, FeeStructure, Student, dataService, User 
} from '../services/dataService';

interface FeesModuleProps {
  currentUser: User;
}

export const FeesModule: React.FC<FeesModuleProps> = ({ currentUser }) => {
  const [payments, setPayments] = useState<FeePayment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [structures, setStructures] = useState<FeeStructure[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);
  const [viewingReceipt, setViewingReceipt] = useState<FeePayment | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fee collection form state
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedFeeType, setSelectedFeeType] = useState('Tuition Fee (Quarterly)');
  const [feeAmount, setFeeAmount] = useState<number>(12000);
  const [discount, setDiscount] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(12000);
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI' | 'Card' | 'Bank Transfer'>('Cash');
  const [transactionId, setTransactionId] = useState('');
  const [remarks, setRemarks] = useState('');

  const loadData = async () => {
    const [p, s, str] = await Promise.all([
      dataService.getFeePayments({ search: searchTerm }),
      dataService.getStudents({ status: 'Active' }),
      dataService.getFeeStructures()
    ]);
    setPayments(p);
    setStudents(s);
    setStructures(str);
    if (s.length > 0 && !selectedStudentId) {
      setSelectedStudentId(s[0].id);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchTerm]);

  const handleStudentChange = (id: string) => {
    setSelectedStudentId(id);
    const std = students.find(s => s.id === id);
    if (std) {
      const matchStruct = structures.find(st => st.classId === std.classId);
      if (matchStruct) {
        setFeeAmount(matchStruct.amount);
        setPaidAmount(matchStruct.amount);
      }
    }
  };

  const handleCollectFee = async (e: React.FormEvent) => {
    e.preventDefault();
    const std = students.find(s => s.id === selectedStudentId);
    if (!std) return;

    const due = Math.max(0, feeAmount - (paidAmount + discount));

    const newPayment = await dataService.createFeePayment({
      studentId: std.id,
      studentName: std.name,
      admissionNo: std.admissionNo,
      classId: std.classId,
      className: std.className,
      section: std.section,
      feeType: selectedFeeType,
      amount: feeAmount,
      discount,
      paidAmount,
      dueAmount: due,
      paymentDate: new Date().toISOString().slice(0, 10),
      paymentMode,
      transactionId: transactionId || undefined,
      collectedBy: currentUser.name,
      remarks
    });

    setToastMessage(`Payment of ₹${paidAmount} recorded. Receipt #${newPayment.receiptNo}`);
    setIsCollectModalOpen(false);
    setViewingReceipt(newPayment);
    loadData();
  };

  const handleDeletePayment = async (id: string, receiptNo: string) => {
    const reason = prompt(`Enter reason for voiding/deleting receipt ${receiptNo}:`);
    if (!reason || !reason.trim()) return;

    await dataService.deleteFeePayment(id, reason, currentUser.name);
    setToastMessage(`Receipt ${receiptNo} deleted from active ledger.`);
    loadData();
  };

  const totalCollected = payments.reduce((sum, p) => sum + p.paidAmount, 0);

  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-lg text-xs flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)}><X className="w-4 h-4 text-slate-400" /></button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Fee Collection & Counter</h2>
          <p className="text-xs text-slate-500">Collect fees, generate receipts, and manage student fee records</p>
        </div>
        <button
          onClick={() => setIsCollectModalOpen(true)}
          className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Collect Fee Now</span>
        </button>
      </div>

      {/* Fee Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500">Total Collected Recorded</span>
          <p className="text-2xl font-bold text-teal-700 mt-1 tabular-nums">₹{totalCollected.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500">Receipts Issued</span>
          <p className="text-2xl font-bold text-slate-800 mt-1 tabular-nums">{payments.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500">Current Session</span>
          <p className="text-2xl font-bold text-emerald-700 mt-1">2026-2027</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by receipt no, student name..."
            className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-md focus:bg-white"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-3 border-b border-slate-200 bg-slate-50/60 font-bold text-xs text-slate-700">
          Payment Transactions Ledger
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase">
                <th className="py-2.5 px-4">Receipt No</th>
                <th className="py-2.5 px-4">Date</th>
                <th className="py-2.5 px-4">Student</th>
                <th className="py-2.5 px-4">Fee Head</th>
                <th className="py-2.5 px-4">Mode</th>
                <th className="py-2.5 px-4 text-right">Amount Paid</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70">
                  <td className="py-2.5 px-4 font-mono font-medium text-slate-800">{p.receiptNo}</td>
                  <td className="py-2.5 px-4 text-slate-500">{p.paymentDate}</td>
                  <td className="py-2.5 px-4">
                    <p className="font-semibold text-slate-900">{p.studentName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{p.admissionNo} · {p.className}-{p.section}</p>
                  </td>
                  <td className="py-2.5 px-4 text-slate-700">{p.feeType}</td>
                  <td className="py-2.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                      {p.paymentMode}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right font-bold text-teal-700 tabular-nums">
                    ₹{p.paidAmount.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setViewingReceipt(p)}
                        title="Print / View Receipt"
                        className="p-1 text-teal-600 hover:bg-teal-50 rounded"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      {['super_admin', 'admin', 'accountant'].includes(currentUser.role) && (
                        <button
                          onClick={() => handleDeletePayment(p.id, p.receiptNo)}
                          title="Void / Delete Receipt"
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collect Fee Modal */}
      {isCollectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="font-bold text-sm text-slate-900">Collect Student Fee</h3>
              <button onClick={() => setIsCollectModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCollectFee} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Select Student *</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => handleStudentChange(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.admissionNo}) - {s.className}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Fee Type</label>
                  <select
                    value={selectedFeeType}
                    onChange={(e) => setSelectedFeeType(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md"
                  >
                    <option value="Tuition Fee (Quarterly)">Tuition Fee (Quarterly)</option>
                    <option value="Admission Fee">Admission Fee</option>
                    <option value="Activity & Sports Fee">Activity & Sports Fee</option>
                    <option value="Exam Fee">Exam Fee</option>
                    <option value="Computer Lab Fee">Computer Lab Fee</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Gross Fee (₹)</label>
                  <input
                    type="number"
                    value={feeAmount}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setFeeAmount(v);
                      setPaidAmount(v - discount);
                    }}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Discount (₹)</label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => {
                      const d = Number(e.target.value);
                      setDiscount(d);
                      setPaidAmount(feeAmount - d);
                    }}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Paid Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md font-mono font-bold text-teal-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Payment Mode</label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md"
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Transaction Ref (Optional)</label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="e.g. UPI-98124912"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCollectModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-md"
                >
                  Generate Receipt & Collect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 text-xs text-slate-800">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 mb-4">
              <span className="font-bold text-slate-500 uppercase tracking-widest text-[10px]">Official School Receipt</span>
              <button onClick={() => setViewingReceipt(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center pb-4 border-b border-dashed border-slate-300">
              <h3 className="font-bold text-sm text-slate-900">ScholarSync International Academy</h3>
              <p className="text-[10px] text-slate-500">Knowledge Park, Mansarovar, Jaipur</p>
              <div className="mt-2 inline-block bg-teal-50 border border-teal-200 text-teal-800 px-3 py-1 rounded font-mono font-bold text-xs">
                {viewingReceipt.receiptNo}
              </div>
            </div>

            <div className="py-3 space-y-1.5 border-b border-dashed border-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Student Name:</span>
                <span className="font-bold text-slate-900">{viewingReceipt.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Admission No:</span>
                <span className="font-mono text-slate-700">{viewingReceipt.admissionNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Class & Section:</span>
                <span className="text-slate-700">{viewingReceipt.className} - {viewingReceipt.section}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Date:</span>
                <span className="text-slate-700">{viewingReceipt.paymentDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Mode:</span>
                <span className="font-medium text-slate-800">{viewingReceipt.paymentMode}</span>
              </div>
            </div>

            <div className="py-3 space-y-1.5 border-b border-slate-200">
              <div className="flex justify-between text-slate-600">
                <span>{viewingReceipt.feeType}</span>
                <span className="font-mono">₹{viewingReceipt.amount.toLocaleString()}</span>
              </div>
              {viewingReceipt.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Concession / Discount:</span>
                  <span className="font-mono">-₹{viewingReceipt.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm pt-2 text-slate-900">
                <span>Total Paid:</span>
                <span className="font-mono text-teal-700">₹{viewingReceipt.paidAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center text-[10px] text-slate-400">
              <span>Collected by: {viewingReceipt.collectedBy}</span>
              <span>Authorized Signature</span>
            </div>

            <div className="mt-5 flex gap-2 justify-end">
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-md flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
