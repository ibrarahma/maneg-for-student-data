import React, { useState, useEffect } from 'react';
import { 
  Users, CheckCircle2, XCircle, GraduationCap, DollarSign, 
  CreditCard, TrendingDown, BookOpen, Clock, AlertCircle, ArrowUpRight 
} from 'lucide-react';
import { DashboardStats, dataService, User } from '../services/dataService';

interface DashboardModuleProps {
  currentUser: User;
  onNavigateTab: (tab: string) => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  currentUser,
  onNavigateTab
}) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      const data = await dataService.getDashboardStats();
      setStats(data);
      setLoading(false);
    };
    loadStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center p-12 text-xs text-slate-500">
        Loading dashboard metrics...
      </div>
    );
  }

  const kpis = [
    { title: 'Total Students', value: stats.totalStudents, icon: Users, color: 'text-blue-600 bg-blue-50 border-blue-200', tab: 'students' },
    { title: 'Present Today', value: stats.presentToday, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-200', tab: 'attendance' },
    { title: 'Absent Today', value: stats.absentToday, icon: XCircle, color: 'text-rose-600 bg-rose-50 border-rose-200', tab: 'attendance' },
    { title: 'Total Teachers', value: stats.totalTeachers, icon: GraduationCap, color: 'text-purple-600 bg-purple-50 border-purple-200', tab: 'staff' },
    { title: 'Pending Fees', value: `₹${stats.pendingFees.toLocaleString()}`, icon: DollarSign, color: 'text-amber-600 bg-amber-50 border-amber-200', tab: 'fees' },
    { title: 'Fees Collected', value: `₹${stats.feesCollected.toLocaleString()}`, icon: CreditCard, color: 'text-teal-600 bg-teal-50 border-teal-200', tab: 'fees' },
    { title: 'Total Expenses', value: `₹${stats.totalExpenses.toLocaleString()}`, icon: TrendingDown, color: 'text-red-600 bg-red-50 border-red-200', tab: 'expenses' },
    { title: 'Active Classes', value: stats.activeClassesCount, icon: BookOpen, color: 'text-indigo-600 bg-indigo-50 border-indigo-200', tab: 'students' }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-emerald-900 rounded-2xl p-5 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold tracking-wider text-teal-200 uppercase">Academic Overview · 2026-2027</span>
          <h2 className="text-xl font-bold mt-0.5">Welcome back, {currentUser.name}</h2>
          <p className="text-xs text-teal-100/80 mt-1">
            Today's overall student attendance rate is <strong className="text-white underline">{stats.attendancePercentageToday}%</strong> across all sections.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => onNavigateTab('attendance')}
            className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-900 text-xs font-bold rounded-lg transition-colors whitespace-nowrap"
          >
            Mark Attendance
          </button>
          <button 
            onClick={() => onNavigateTab('fees')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg border border-white/20 transition-colors whitespace-nowrap"
          >
            Collect Fee
          </button>
        </div>
      </div>

      {/* 8 Stat Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div 
              key={idx}
              onClick={() => onNavigateTab(kpi.tab)}
              className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs hover:border-teal-400 cursor-pointer transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-500">{kpi.title}</span>
                <div className={`p-2 rounded-lg border ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2">
                <span className="text-xl sm:text-2xl font-bold text-slate-800 tabular-nums">
                  {kpi.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Section: Attendance Bar Chart & Income vs Expense */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Attendance Visualizer */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Weekly Attendance Trend</h3>
              <p className="text-[11px] text-slate-500">Present vs Absent count by day</p>
            </div>
            <button onClick={() => onNavigateTab('attendance_report')} className="text-xs text-teal-600 hover:underline font-medium">
              Full Report →
            </button>
          </div>
          <div className="space-y-3">
            {stats.weeklyAttendance.map((item) => {
              const total = item.present + item.absent;
              const pct = total > 0 ? Math.round((item.present / total) * 100) : 100;
              return (
                <div key={item.day} className="text-xs">
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span className="font-semibold">{item.day}</span>
                    <span className="tabular-nums font-medium text-slate-700">{item.present} Present ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                    <div className="bg-emerald-600 h-full" style={{ width: `${pct}%` }}></div>
                    <div className="bg-rose-400 h-full" style={{ width: `${100 - pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Income vs Expense Bar Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Income vs Expenses (Monthly)</h3>
              <p className="text-[11px] text-slate-500">Fee collections compared to expenditures</p>
            </div>
            <button onClick={() => onNavigateTab('expenses')} className="text-xs text-teal-600 hover:underline font-medium">
              View Expenses →
            </button>
          </div>
          <div className="space-y-3">
            {stats.incomeVsExpense.map((item) => (
              <div key={item.month} className="text-xs">
                <div className="flex justify-between text-slate-600 mb-1">
                  <span className="font-semibold">{item.month} 2026</span>
                  <span className="tabular-nums font-mono text-[11px]">
                    <span className="text-teal-700 font-bold">₹{(item.income / 1000).toFixed(0)}k</span> vs <span className="text-rose-600 font-bold">₹{(item.expense / 1000).toFixed(0)}k</span>
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="bg-teal-600 h-full rounded-full" style={{ width: `${Math.min(100, (item.income / 200000) * 100)}%` }}></div>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full" style={{ width: `${Math.min(100, (item.expense / 200000) * 100)}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Admissions & Recent Payments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Recent Admissions */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-800">Recent Admissions</h3>
            <button onClick={() => onNavigateTab('students')} className="text-xs text-teal-600 hover:underline font-medium">
              View All ({stats.totalStudents})
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {stats.recentAdmissions.map((s) => (
              <div key={s.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-800">{s.name}</p>
                  <p className="text-[11px] text-slate-500 font-mono">{s.admissionNo} · {s.className} - {s.section}</p>
                </div>
                <span className="text-[11px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Fee Payments */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-800">Recent Fee Receipts</h3>
            <button onClick={() => onNavigateTab('fees')} className="text-xs text-teal-600 hover:underline font-medium">
              Fees Dashboard →
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {stats.recentPayments.map((p) => (
              <div key={p.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-800">{p.studentName}</p>
                  <p className="text-[11px] text-slate-500 font-mono">{p.receiptNo} · {p.paymentMode}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-teal-700 tabular-nums">₹{p.paidAmount.toLocaleString()}</span>
                  <p className="text-[10px] text-slate-400">{p.paymentDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
