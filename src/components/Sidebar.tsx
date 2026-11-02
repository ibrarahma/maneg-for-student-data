import React from 'react';
import { 
  LayoutDashboard, Users, UserPlus, Archive, CheckSquare, 
  CreditCard, Receipt, DollarSign, BookOpen, GraduationCap, 
  Calendar, FileText, Bell, Settings, ShieldCheck, UserCheck, 
  TrendingUp, Award, Clock, X
} from 'lucide-react';
import { User, UserRole } from '../services/dataService';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: User;
  onSwitchRole: (role: UserRole) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  onSwitchRole,
  isMobileOpen,
  setIsMobileOpen
}) => {
  const navSections = [
    {
      title: 'MAIN',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['super_admin', 'admin', 'teacher', 'accountant', 'student', 'parent'] },
      ]
    },
    {
      title: 'ACADEMICS',
      items: [
        { id: 'attendance', label: 'Daily Attendance', icon: CheckSquare, roles: ['super_admin', 'admin', 'teacher'] },
        { id: 'attendance_report', label: 'Attendance Report', icon: Clock, roles: ['super_admin', 'admin', 'teacher', 'student', 'parent'] },
        { id: 'exams', label: 'Exams & Marks', icon: Award, roles: ['super_admin', 'admin', 'teacher', 'student', 'parent'] },
      ]
    },
    {
      title: 'STUDENTS',
      items: [
        { id: 'students', label: 'All Students', icon: Users, roles: ['super_admin', 'admin', 'teacher'] },
        { id: 'new_admission', label: 'New Admission', icon: UserPlus, roles: ['super_admin', 'admin'] },
      ]
    },
    {
      title: 'FEES',
      items: [
        { id: 'fees', label: 'Fee Collection', icon: CreditCard, roles: ['super_admin', 'admin', 'accountant', 'student', 'parent'] },
        { id: 'fee_structures', label: 'Fee Structure', icon: Receipt, roles: ['super_admin', 'admin', 'accountant'] },
      ]
    },
    {
      title: 'FINANCE & PAYROLL',
      items: [
        { id: 'expenses', label: 'Expenses', icon: DollarSign, roles: ['super_admin', 'admin', 'accountant'] },
        { id: 'staff', label: 'Staff & Payroll', icon: UserCheck, roles: ['super_admin', 'admin'] },
      ]
    },
    {
      title: 'COMMUNICATION',
      items: [
        { id: 'notices', label: 'Notices', icon: Bell, roles: ['super_admin', 'admin', 'teacher', 'accountant', 'student', 'parent'] },
        { id: 'reports', label: 'Reports Hub', icon: FileText, roles: ['super_admin', 'admin', 'accountant', 'teacher'] },
      ]
    },
    {
      title: 'ADMIN',
      items: [
        { id: 'settings', label: 'School Settings', icon: Settings, roles: ['super_admin', 'admin'] },
        { id: 'audit_logs', label: 'Audit Logs', icon: ShieldCheck, roles: ['super_admin'] },
      ]
    }
  ];

  return (
    <>
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#064e3b] text-emerald-50 flex flex-col transition-transform duration-300 md:translate-x-0 ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      } border-r border-emerald-900 shadow-xl`}>
        {/* Brand Header */}
        <div className="p-4 border-b border-emerald-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-500/20 border border-teal-400/40 flex items-center justify-center font-bold text-teal-300 text-lg shadow-inner">
              S
            </div>
            <div>
              <h1 className="font-semibold text-base tracking-tight text-white leading-tight">ScholarSync</h1>
              <p className="text-[11px] text-teal-200/70 font-medium">Management System</p>
            </div>
          </div>
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden text-teal-300 hover:text-white p-1 rounded-md"
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card & Role Switcher */}
        <div className="p-3 mx-3 my-2 rounded-lg bg-emerald-950/60 border border-emerald-800/50">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-medium text-xs">
              {currentUser.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-teal-300/80 uppercase tracking-wider">{currentUser.role.replace('_', ' ')}</p>
            </div>
          </div>
          <div className="text-[10px] text-teal-200/60 mb-1">Switch Role Demo:</div>
          <select 
            value={currentUser.role}
            onChange={(e) => onSwitchRole(e.target.value as UserRole)}
            className="w-full text-xs bg-emerald-900/90 text-teal-100 rounded px-2 py-1 border border-emerald-700 focus:outline-hidden focus:ring-1 focus:ring-teal-400"
          >
            <option value="super_admin">Super Administrator</option>
            <option value="admin">Administrator</option>
            <option value="teacher">Teacher (UKG - A)</option>
            <option value="accountant">Accountant</option>
            <option value="student">Student (Rahul)</option>
            <option value="parent">Parent</option>
          </select>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-4">
          {navSections.map((section) => {
            const visibleItems = section.items.filter(item => item.roles.includes(currentUser.role));
            if (visibleItems.length === 0) return null;

            return (
              <div key={section.title}>
                <div className="px-3 pb-1 text-[10px] font-bold tracking-wider text-teal-300/60 uppercase">
                  {section.title}
                </div>
                <div className="space-y-0.5">
                  {visibleItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setCurrentTab(item.id);
                          setIsMobileOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-md transition-colors text-left ${
                          isActive 
                            ? 'bg-teal-600 text-white font-semibold shadow-xs' 
                            : 'text-emerald-100/80 hover:bg-emerald-800/60 hover:text-white'
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-teal-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Session Info */}
        <div className="p-3 border-t border-emerald-800/80 text-[11px] text-teal-300/70 flex justify-between items-center bg-emerald-950/40">
          <span>Session: 2026-2027</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
      </aside>
    </>
  );
};
