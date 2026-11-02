import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Search, Filter, Trash2, Edit2, 
  Download, Eye, X, CheckCircle, AlertCircle 
} from 'lucide-react';
import { Student, SchoolClass, dataService, User } from '../services/dataService';

interface StudentsModuleProps {
  currentUser: User;
  showNewAdmissionInitial?: boolean;
}

export const StudentsModule: React.FC<StudentsModuleProps> = ({
  currentUser,
  showNewAdmissionInitial = false
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [filterClass, setFilterClass] = useState<string>('all');
  const [filterSection, setFilterSection] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(showNewAdmissionInitial);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    motherName: '',
    dob: '2020-01-01',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    classId: 'cls-ukg',
    className: 'UKG',
    section: 'A',
    session: '2026-2027',
    mobile: '',
    parentMobile: '',
    email: '',
    address: '',
    city: 'Jaipur',
    state: 'Rajasthan',
    pin: '302001',
    admissionDate: '2026-04-01',
    bloodGroup: 'B+',
    status: 'Active' as const,
    rollNo: '01'
  });

  const loadData = async () => {
    setLoading(true);
    const [cls, stds] = await Promise.all([
      dataService.getClasses(),
      dataService.getStudents({
        classId: filterClass,
        section: filterSection,
        search: searchTerm
      })
    ]);
    setClasses(cls);
    setStudents(stds);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [filterClass, filterSection, searchTerm]);

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const clsObj = classes.find(c => c.id === formData.classId);
      const newStd = await dataService.createStudent({
        ...formData,
        className: clsObj ? clsObj.name : 'UKG',
      });
      setToastMessage(`Student ${newStd.name} admitted successfully with ${newStd.admissionNo}`);
      setIsAddModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Error adding student');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete student record for ${name}?`)) {
      await dataService.deleteStudent(id);
      setToastMessage(`Student ${name} deleted.`);
      loadData();
    }
  };

  const handleExportCsv = () => {
    const headers = ['Admission No', 'Roll No', 'Name', 'Class', 'Section', 'Father Name', 'Mobile', 'Status'];
    const rows = students.map(s => [
      s.admissionNo,
      s.rollNo,
      `"${s.name}"`,
      s.className,
      s.section,
      `"${s.fatherName}"`,
      s.mobile,
      s.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `scholarsync_students_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Student Directory</h2>
          <p className="text-xs text-slate-500">Manage student enrollment, admissions, and personal files</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>New Admission</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <div className="relative w-full max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, adm no, parent..."
              className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-slate-700"
          >
            <option value="all">All Classes</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={filterSection}
            onChange={(e) => setFilterSection(e.target.value)}
            className="text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-slate-700"
          >
            <option value="all">All Sections</option>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
          </select>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading student directory...</div>
        ) : students.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No students found matching your criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase">
                  <th className="py-2.5 px-4">Adm No</th>
                  <th className="py-2.5 px-4">Student Name</th>
                  <th className="py-2.5 px-4">Class & Sec</th>
                  <th className="py-2.5 px-4">Father Name</th>
                  <th className="py-2.5 px-4">Mobile</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-4 font-mono font-medium text-slate-700">{student.admissionNo}</td>
                    <td className="py-2.5 px-4 font-semibold text-slate-900">{student.name}</td>
                    <td className="py-2.5 px-4">{student.className} - {student.section}</td>
                    <td className="py-2.5 px-4 text-slate-600">{student.fatherName}</td>
                    <td className="py-2.5 px-4 font-mono text-slate-600">{student.mobile}</td>
                    <td className="py-2.5 px-4">
                      <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {student.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedStudent(student)}
                          title="View Profile"
                          className="p-1 text-slate-500 hover:text-teal-600 rounded hover:bg-slate-100"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {['super_admin', 'admin'].includes(currentUser.role) && (
                          <button
                            onClick={() => handleDelete(student.id, student.name)}
                            title="Delete Student"
                            className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100"
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
        )}
      </div>

      {/* Modal: New Admission */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="font-bold text-sm text-slate-900">New Student Admission Form</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateStudent} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Aryan Dixit"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Class *</label>
                  <select
                    value={formData.classId}
                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md"
                  >
                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Section</label>
                  <select
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Father's Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mother's Name</label>
                  <input
                    type="text"
                    value={formData.motherName}
                    onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value, parentMobile: e.target.value })}
                    placeholder="9876543210"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Blood Group</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md"
                  >
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="O+">O+</option>
                    <option value="AB+">AB+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Address</label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street address, colony..."
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-md"
                >
                  Save & Admit Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Student Profile */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="font-bold text-sm text-slate-900">Student Profile</h3>
              <button onClick={() => setSelectedStudent(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="text-center pb-2">
              <div className="w-14 h-14 rounded-full bg-teal-100 text-teal-800 font-bold text-lg flex items-center justify-center mx-auto mb-2 border border-teal-200">
                {selectedStudent.name.charAt(0)}
              </div>
              <h4 className="font-bold text-base text-slate-900">{selectedStudent.name}</h4>
              <p className="text-xs text-slate-500 font-mono">{selectedStudent.admissionNo} · Roll #{selectedStudent.rollNo}</p>
            </div>

            <div className="space-y-2 text-xs border-t border-b border-slate-100 py-3">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Class & Section:</span>
                <span className="font-semibold text-slate-800">{selectedStudent.className} - {selectedStudent.section}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Father's Name:</span>
                <span className="font-semibold text-slate-800">{selectedStudent.fatherName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Mother's Name:</span>
                <span className="font-semibold text-slate-800">{selectedStudent.motherName || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Date of Birth:</span>
                <span className="font-semibold text-slate-800">{selectedStudent.dob}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Blood Group:</span>
                <span className="font-semibold text-slate-800">{selectedStudent.bloodGroup}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Mobile / WhatsApp:</span>
                <span className="font-semibold font-mono text-slate-800">{selectedStudent.mobile}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Address:</span>
                <span className="font-medium text-slate-800 text-right">{selectedStudent.address}, {selectedStudent.city}</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-md"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
