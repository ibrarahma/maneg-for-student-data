import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, AlertCircle, Save, Check, X, Calendar as CalIcon, 
  RotateCcw, FileText, Users, ArrowRight 
} from 'lucide-react';
import { 
  SchoolClass, Student, AttendanceStatus, dataService, User 
} from '../services/dataService';

interface AttendanceModuleProps {
  currentUser: User;
  onNavigateToReport: () => void;
}

export const AttendanceModule: React.FC<AttendanceModuleProps> = ({
  currentUser,
  onNavigateToReport
}) => {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('cls-ukg');
  const [selectedSection, setSelectedSection] = useState<string>('A');
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-25');
  const [session] = useState<string>('2026-2027');

  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceStatus>>({});
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      const cls = await dataService.getClasses();
      setClasses(cls);
    };
    fetchClasses();
  }, []);

  const handleLoadStudents = async () => {
    setIsLoaded(false);
    const targetStudents = await dataService.getStudents({
      classId: selectedClassId,
      section: selectedSection,
      status: 'Active'
    });

    setStudents(targetStudents);

    // Check if attendance is already recorded for this date
    const existing = await dataService.getAttendance({
      classId: selectedClassId,
      section: selectedSection,
      date: selectedDate
    });

    const newMap: Record<string, AttendanceStatus> = {};
    if (existing.length > 0) {
      existing.forEach(rec => {
        newMap[rec.studentId] = rec.status;
      });
      setToastMessage({
        text: `Loaded existing recorded attendance for ${selectedDate}. You may update and save.`,
        type: 'info'
      });
    } else {
      // Default to PRESENT for all
      targetStudents.forEach(st => {
        newMap[st.id] = 'PRESENT';
      });
    }

    setAttendanceMap(newMap);
    setIsLoaded(true);
  };

  // Auto load on initial render for demonstration of UKG - 25/09/2026
  useEffect(() => {
    handleLoadStudents();
  }, [selectedClassId, selectedSection, selectedDate]);

  const handleSetAll = (status: AttendanceStatus) => {
    const updated: Record<string, AttendanceStatus> = {};
    students.forEach(s => {
      updated[s.id] = status;
    });
    setAttendanceMap(updated);
  };

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSaveAttendance = async () => {
    if (students.length === 0) {
      setToastMessage({ text: 'No students to record attendance for.', type: 'error' });
      return;
    }

    setIsSaving(true);
    try {
      const selectedClassObj = classes.find(c => c.id === selectedClassId);
      const recordsToSave = students.map(s => ({
        studentId: s.id,
        studentAdmissionNo: s.admissionNo,
        studentName: s.name,
        status: attendanceMap[s.id] || 'PRESENT'
      }));

      const res = await dataService.saveAttendance({
        classId: selectedClassId,
        className: selectedClassObj ? selectedClassObj.name : 'Class',
        section: selectedSection,
        date: selectedDate,
        markedBy: currentUser.name,
        records: recordsToSave
      });

      setToastMessage({ text: res.message, type: 'success' });
    } catch (err: any) {
      setToastMessage({ text: err.message || 'Failed to save attendance', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const currentClassObj = classes.find(c => c.id === selectedClassId);
  const classNameDisplay = currentClassObj ? currentClassObj.name : 'UKG';

  // Stats count
  const presentCount = students.filter(s => (attendanceMap[s.id] || 'PRESENT') === 'PRESENT').length;
  const absentCount = students.filter(s => attendanceMap[s.id] === 'ABSENT').length;
  const leaveCount = students.filter(s => attendanceMap[s.id] === 'LEAVE').length;

  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`p-3.5 rounded-lg flex items-center justify-between text-xs font-medium border ${
          toastMessage.type === 'success' 
            ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
            : toastMessage.type === 'error'
            ? 'bg-rose-50 border-rose-300 text-rose-900'
            : 'bg-teal-50 border-teal-300 text-teal-900'
        }`}>
          <div className="flex items-center gap-2">
            {toastMessage.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-teal-600" />}
            <span>{toastMessage.text}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Title Area */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Daily Attendance</h2>
          <p className="text-xs text-slate-500">Mark class attendance</p>
        </div>
        <button
          onClick={onNavigateToReport}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition-colors w-fit"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Attendance Report</span>
        </button>
      </div>

      {/* Top Filter Controls Card */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 items-end">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Academic Session</label>
            <input 
              type="text" 
              value={session} 
              disabled 
              className="w-full text-xs px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-md text-slate-700 font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Class</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleLoadStudents}
              className="flex-1 px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors shadow-xs flex items-center justify-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Load Students</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Attendance Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Attendance Banner Matching Screenshot */}
        <div className="px-5 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                {classNameDisplay} — {selectedDate.split('-').reverse().join('/')}
              </h3>
              <span className="text-xs text-slate-500 font-medium">({students.length} students)</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-600 mt-1">
              <span className="text-emerald-700 font-semibold">{presentCount} Present</span>
              <span>·</span>
              <span className="text-rose-700 font-semibold">{absentCount} Absent</span>
              <span>·</span>
              <span className="text-amber-700 font-semibold">{leaveCount} Leave</span>
            </div>
          </div>

          {/* Bulk Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSetAll('PRESENT')}
              className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-md border border-emerald-300 transition-colors uppercase tracking-wider"
            >
              ALL PRESENT
            </button>
            <button
              onClick={() => handleSetAll('ABSENT')}
              className="px-3 py-1.5 text-xs font-semibold text-rose-800 bg-rose-100 hover:bg-rose-200 rounded-md border border-rose-300 transition-colors uppercase tracking-wider"
            >
              ALL ABSENT
            </button>
            <button
              onClick={() => handleSetAll('LEAVE')}
              className="px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-md border border-amber-300 transition-colors uppercase tracking-wider"
            >
              ALL LEAVE
            </button>
          </div>
        </div>

        {/* Attendance Table */}
        {students.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No active students found in {classNameDisplay} - Section {selectedSection}.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100/70 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-2.5 px-4 w-12 text-center">#</th>
                  <th className="py-2.5 px-4 w-36">Admission No</th>
                  <th className="py-2.5 px-4">Name</th>
                  <th className="py-2.5 px-4 w-28 text-center text-emerald-700">Present</th>
                  <th className="py-2.5 px-4 w-28 text-center text-rose-700">Absent</th>
                  <th className="py-2.5 px-4 w-28 text-center text-amber-700">Leave</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {students.map((student, index) => {
                  const currentStatus = attendanceMap[student.id] || 'PRESENT';

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 text-center font-mono text-slate-500 font-medium">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-700">
                        {student.admissionNo}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {student.name}
                      </td>

                      {/* Present Radio */}
                      <td className="py-3 px-4 text-center">
                        <label className="inline-flex items-center justify-center cursor-pointer p-1">
                          <input
                            type="radio"
                            name={`att_${student.id}`}
                            checked={currentStatus === 'PRESENT'}
                            onChange={() => handleStatusChange(student.id, 'PRESENT')}
                            className="w-4 h-4 text-emerald-600 accent-emerald-600 cursor-pointer"
                          />
                        </label>
                      </td>

                      {/* Absent Radio */}
                      <td className="py-3 px-4 text-center">
                        <label className="inline-flex items-center justify-center cursor-pointer p-1">
                          <input
                            type="radio"
                            name={`att_${student.id}`}
                            checked={currentStatus === 'ABSENT'}
                            onChange={() => handleStatusChange(student.id, 'ABSENT')}
                            className="w-4 h-4 text-rose-600 accent-rose-600 cursor-pointer"
                          />
                        </label>
                      </td>

                      {/* Leave Radio */}
                      <td className="py-3 px-4 text-center">
                        <label className="inline-flex items-center justify-center cursor-pointer p-1">
                          <input
                            type="radio"
                            name={`att_${student.id}`}
                            checked={currentStatus === 'LEAVE'}
                            onChange={() => handleStatusChange(student.id, 'LEAVE')}
                            className="w-4 h-4 text-amber-600 accent-amber-600 cursor-pointer"
                          />
                        </label>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Bottom Save Attendance Button */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/60 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Marked by: <strong className="text-slate-800">{currentUser.name}</strong>
          </span>
          <button
            onClick={handleSaveAttendance}
            disabled={isSaving || students.length === 0}
            className="px-6 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 rounded-lg shadow-sm transition-colors flex items-center gap-2 uppercase tracking-wider"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'SAVING...' : 'SAVE ATTENDANCE'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
