import React, { useState, useEffect } from 'react';
import { UserCheck, Plus, DollarSign, CheckCircle } from 'lucide-react';
import { Staff, SalaryRecord, dataService, User } from '../services/dataService';

export const StaffModule: React.FC<{ currentUser: User }> = ({ currentUser }) => {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [salaries, setSalaries] = useState<SalaryRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'staff' | 'payroll'>('staff');
  const [toast, setToast] = useState<string | null>(null);

  const loadData = async () => {
    const [st, sal] = await Promise.all([
      dataService.getStaff(),
      dataService.getSalaries('September 2026')
    ]);
    setStaffList(st);
    setSalaries(sal);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePaySalary = async (st: Staff) => {
    const allowances = 3000;
    const deductions = 1000;
    const net = st.basicSalary + allowances - deductions;

    await dataService.createSalaryRecord({
      staffId: st.id,
      staffName: st.name,
      employeeId: st.employeeId,
      department: st.department,
      month: 'September 2026',
      basicSalary: st.basicSalary,
      allowances,
      deductions,
      netSalary: net,
      paymentStatus: 'Paid',
      paymentDate: new Date().toISOString().slice(0, 10),
      paymentMode: 'Bank Transfer'
    });

    setToast(`Disbursed net salary ₹${net.toLocaleString()} to ${st.name}`);
    loadData();
  };

  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      {toast && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{toast}</span>
        </div>
      )}

      <div className="flex justify-between items-center pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Staff & Payroll Management</h2>
          <p className="text-xs text-slate-500">Employee database, salary structures, and compensation disbursement</p>
        </div>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('staff')}
            className={`px-3 py-1 text-xs font-semibold rounded-md ${activeTab === 'staff' ? 'bg-white shadow-xs text-teal-800' : 'text-slate-600'}`}
          >
            Staff Directory
          </button>
          <button
            onClick={() => setActiveTab('payroll')}
            className={`px-3 py-1 text-xs font-semibold rounded-md ${activeTab === 'payroll' ? 'bg-white shadow-xs text-teal-800' : 'text-slate-600'}`}
          >
            Payroll (Sep 2026)
          </button>
        </div>
      </div>

      {activeTab === 'staff' ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase">
                <th className="py-2.5 px-4">Emp ID</th>
                <th className="py-2.5 px-4">Name</th>
                <th className="py-2.5 px-4">Department</th>
                <th className="py-2.5 px-4">Designation</th>
                <th className="py-2.5 px-4">Mobile</th>
                <th className="py-2.5 px-4 text-right">Basic Salary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staffList.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-mono font-medium">{st.employeeId}</td>
                  <td className="py-2.5 px-4 font-semibold text-slate-800">{st.name}</td>
                  <td className="py-2.5 px-4">{st.department}</td>
                  <td className="py-2.5 px-4 text-slate-600">{st.designation}</td>
                  <td className="py-2.5 px-4 font-mono">{st.mobile}</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-teal-700">₹{st.basicSalary.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-3 border-b border-slate-200 bg-slate-50 text-xs text-slate-600">
            Formula: <strong>Net Salary = Basic Salary + Allowances - Deductions</strong>
          </div>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase">
                <th className="py-2.5 px-4">Staff Member</th>
                <th className="py-2.5 px-4">Basic</th>
                <th className="py-2.5 px-4">Allowances</th>
                <th className="py-2.5 px-4">Deductions</th>
                <th className="py-2.5 px-4">Net Salary</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staffList.map((st) => {
                const paidRecord = salaries.find(sal => sal.staffId === st.id);
                return (
                  <tr key={st.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-semibold">{st.name} ({st.employeeId})</td>
                    <td className="py-2.5 px-4 font-mono">₹{st.basicSalary.toLocaleString()}</td>
                    <td className="py-2.5 px-4 font-mono text-emerald-600">+₹3,000</td>
                    <td className="py-2.5 px-4 font-mono text-rose-600">-₹1,000</td>
                    <td className="py-2.5 px-4 font-mono font-bold text-teal-800">
                      ₹{(st.basicSalary + 3000 - 1000).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${paidRecord ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {paidRecord ? 'PAID' : 'PENDING'}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      {!paidRecord ? (
                        <button
                          onClick={() => handlePaySalary(st)}
                          className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded text-[11px] font-semibold"
                        >
                          Disburse
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono">{paidRecord.paymentDate}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
