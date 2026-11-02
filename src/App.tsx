import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AttendanceModule } from './components/AttendanceModule';
import { AttendanceReportModule } from './components/AttendanceReportModule';
import { DashboardModule } from './components/DashboardModule';
import { StudentsModule } from './components/StudentsModule';
import { FeesModule } from './components/FeesModule';
import { ExamsModule } from './components/ExamsModule';
import { StaffModule } from './components/StaffModule';
import { FinanceModule } from './components/FinanceModule';
import { NoticesModule } from './components/NoticesModule';
import { SettingsModule } from './components/SettingsModule';
import { User, UserRole, dataService } from './services/dataService';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  useEffect(() => {
    const init = async () => {
      const user = await dataService.getCurrentUser();
      setCurrentUser(user);
    };
    init();
  }, []);

  const handleSwitchRole = async (role: UserRole) => {
    const switched = await dataService.setCurrentUser(role);
    setCurrentUser(switched);
  };

  if (!currentUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 text-xs text-slate-500 font-medium">
        Initializing ScholarSync system...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar with dark-green/teal aesthetic */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
        onSwitchRole={handleSwitchRole}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        <Header
          currentUser={currentUser}
          onOpenMobileSidebar={() => setIsMobileOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {currentTab === 'dashboard' && (
            <DashboardModule currentUser={currentUser} onNavigateTab={setCurrentTab} />
          )}

          {currentTab === 'attendance' && (
            <AttendanceModule
              currentUser={currentUser}
              onNavigateToReport={() => setCurrentTab('attendance_report')}
            />
          )}

          {currentTab === 'attendance_report' && (
            <AttendanceReportModule
              currentUser={currentUser}
              onBackToAttendance={() => setCurrentTab('attendance')}
            />
          )}

          {currentTab === 'students' && (
            <StudentsModule currentUser={currentUser} showNewAdmissionInitial={false} />
          )}

          {currentTab === 'new_admission' && (
            <StudentsModule currentUser={currentUser} showNewAdmissionInitial={true} />
          )}

          {currentTab === 'fees' && (
            <FeesModule currentUser={currentUser} />
          )}

          {currentTab === 'fee_structures' && (
            <FeesModule currentUser={currentUser} />
          )}

          {currentTab === 'exams' && (
            <ExamsModule currentUser={currentUser} />
          )}

          {currentTab === 'staff' && (
            <StaffModule currentUser={currentUser} />
          )}

          {currentTab === 'expenses' && (
            <FinanceModule currentUser={currentUser} />
          )}

          {currentTab === 'notices' && (
            <NoticesModule currentUser={currentUser} />
          )}

          {currentTab === 'reports' && (
            <AttendanceReportModule
              currentUser={currentUser}
              onBackToAttendance={() => setCurrentTab('attendance')}
            />
          )}

          {(currentTab === 'settings' || currentTab === 'audit_logs') && (
            <SettingsModule currentUser={currentUser} />
          )}
        </main>
      </div>
    </div>
  );
}
