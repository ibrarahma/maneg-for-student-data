import React, { useState, useEffect } from 'react';
import { 
  FileText, Download, Printer, Filter, Calendar, 
  Search, ArrowLeft, CheckCircle 
} from 'lucide-react';
import { 
  AttendanceReportRow, SchoolClass, dataService, User 
} from '../services/dataService';

interface AttendanceReportModuleProps {
  currentUser: User;
  onBackToAttendance: () => void;
}

export const AttendanceReportModule: React.FC<AttendanceReportModuleProps> = ({
  currentUser,
  onBackToAttendance
}) => {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('cls-ukg');
  const [selectedSection, setSelectedSection] = useState<string>('A');
  const [startDate, setStartDate] = useState<string>('2026-09-01');
  const [endDate, setEndDate] = useState<string>('2026-09-30');
  const [reportRows, setReportRows] = useState<AttendanceReportRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const init = async () => {
      const cls = await dataService.getClasses();
      setClasses(cls);
    };
    init();
  }, []);

  const generateReport = async () => {
    setLoading(true);
    const data = await dataService.getAttendanceReport({
      classId: selectedClassId,
      section: selectedSection,
      startDate,
      endDate
    });
    setReportRows(data);
    setLoading(false);
  };

  useEffect(() => {
    generateReport();
  }, [selectedClassId, selectedSection, startDate, endDate]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    const headers = ['Admission No', 'Student Name', 'Class', 'Section', 'Total Working Days', 'Present', 'Absent', 'Leave', 'Attendance %'];
    const rows = reportRows.map(r => [
      r.admissionNo,
      `"${r.studentName}"`,
      r.className,
      r.section,
      r.totalWorkingDays,
      r.presentDays,
      r.absentDays,
      r.leaveDays,
      `${r.attendancePercentage}%`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `Attendance_Report_${selectedClassId}_${selectedDateRange()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectedDateRange = () => `${startDate}_to_${endDate}`;

  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToAttendance}
              className="p-1 hover:bg-slate-100 rounded-md text-slate-500"
              title="Back to Daily Attendance"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h2 className="text-xl font-bold text-slate-900">Attendance Report</h2>
          </div>
          <p className="text-xs text-slate-500 ml-6">
            Detailed student-wise monthly attendance percentage analytics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Card */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Class</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-slate-800"
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
              className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-slate-800"
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">From Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-slate-800"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">To Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Attendance Summary Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex justify-between items-center text-xs">
          <span className="font-bold text-slate-800 uppercase">
            Formula: Attendance % = (Present Days / Total Working Days) × 100
          </span>
          <span className="text-slate-500 font-mono">
            Period: {startDate} to {endDate}
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Calculating attendance percentages...</div>
        ) : reportRows.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No attendance records found for this period.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase">
                  <th className="py-2.5 px-4 w-12 text-center">#</th>
                  <th className="py-2.5 px-4 w-32">Adm No</th>
                  <th className="py-2.5 px-4">Student Name</th>
                  <th className="py-2.5 px-4 text-center">Total Days</th>
                  <th className="py-2.5 px-4 text-center text-emerald-700">Present</th>
                  <th className="py-2.5 px-4 text-center text-rose-700">Absent</th>
                  <th className="py-2.5 px-4 text-center text-amber-700">Leave</th>
                  <th className="py-2.5 px-4 text-center">Attendance %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reportRows.map((row, idx) => (
                  <tr key={row.studentId} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 text-center text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-700">{row.admissionNo}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{row.studentName}</td>
                    <td className="py-3 px-4 text-center tabular-nums font-medium text-slate-600">{row.totalWorkingDays}</td>
                    <td className="py-3 px-4 text-center tabular-nums font-bold text-emerald-600">{row.presentDays}</td>
                    <td className="py-3 px-4 text-center tabular-nums font-bold text-rose-600">{row.absentDays}</td>
                    <td className="py-3 px-4 text-center tabular-nums font-bold text-amber-600">{row.leaveDays}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded font-bold tabular-nums text-xs ${
                        row.attendancePercentage >= 80 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : row.attendancePercentage >= 60
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {row.attendancePercentage}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
