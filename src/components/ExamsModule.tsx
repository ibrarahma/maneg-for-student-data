import React, { useState, useEffect } from 'react';
import { Award, BookOpen, Save, CheckCircle } from 'lucide-react';
import { Exam, Subject, Student, Mark, dataService, User } from '../services/dataService';

export const ExamsModule: React.FC<{ currentUser: User }> = ({ currentUser }) => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>('ex-01');
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('sub-ukg-eng');
  const [marksMap, setMarksMap] = useState<Record<string, number>>({});
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const [exs, subs, stds] = await Promise.all([
        dataService.getExams(),
        dataService.getSubjects('cls-ukg'),
        dataService.getStudents({ classId: 'cls-ukg', section: 'A' })
      ]);
      setExams(exs);
      setSubjects(subs);
      setStudents(stds);

      const existingMarks = await dataService.getMarks({ examId: 'ex-01', subjectId: 'sub-ukg-eng' });
      const m: Record<string, number> = {};
      existingMarks.forEach(em => {
        m[em.studentId] = em.marksObtained;
      });
      setMarksMap(m);
    };
    init();
  }, []);

  const handleSaveMarks = async () => {
    const examObj = exams.find(e => e.id === selectedExamId);
    const subObj = subjects.find(s => s.id === selectedSubjectId);
    if (!examObj || !subObj) return;

    const list = students.map(st => ({
      examId: selectedExamId,
      examName: examObj.name,
      studentId: st.id,
      studentName: st.name,
      admissionNo: st.admissionNo,
      classId: st.classId,
      className: st.className,
      section: st.section,
      subjectId: selectedSubjectId,
      subjectName: subObj.name,
      maxMarks: subObj.maxMarks,
      marksObtained: marksMap[st.id] || 0
    }));

    await dataService.saveMarks(list);
    setToast('Student marks and calculated grades saved successfully.');
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
          <h2 className="text-xl font-bold text-slate-900">Exams & Marks Entry</h2>
          <p className="text-xs text-slate-500">Record assessment results and calculate student letter grades</p>
        </div>
        <button
          onClick={handleSaveMarks}
          className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg flex items-center gap-1.5 shadow-xs"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Marks</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Select Exam</label>
          <select 
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
            className="w-full text-xs p-2 border border-slate-300 rounded-md"
          >
            {exams.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Class</label>
          <input type="text" disabled value="UKG - Section A" className="w-full text-xs p-2 border border-slate-200 bg-slate-50 rounded-md" />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Subject</label>
          <select 
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="w-full text-xs p-2 border border-slate-300 rounded-md"
          >
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name} (Max {s.maxMarks})</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase">
              <th className="py-2.5 px-4 w-32">Adm No</th>
              <th className="py-2.5 px-4">Student Name</th>
              <th className="py-2.5 px-4 w-32">Marks Obtained</th>
              <th className="py-2.5 px-4 w-28">Grade</th>
              <th className="py-2.5 px-4 w-32">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((st) => {
              const currentScore = marksMap[st.id] ?? 40;
              const subObj = subjects.find(s => s.id === selectedSubjectId);
              const max = subObj ? subObj.maxMarks : 50;
              const pct = (currentScore / max) * 100;
              const grade = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 65 ? 'B' : pct >= 40 ? 'C' : 'F';
              const isPass = currentScore >= (subObj?.passMarks || 20);

              return (
                <tr key={st.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-mono">{st.admissionNo}</td>
                  <td className="py-2.5 px-4 font-semibold text-slate-800">{st.name}</td>
                  <td className="py-2.5 px-4">
                    <input
                      type="number"
                      max={max}
                      min={0}
                      value={currentScore}
                      onChange={(e) => setMarksMap({ ...marksMap, [st.id]: Number(e.target.value) })}
                      className="w-20 px-2 py-1 border border-slate-300 rounded font-mono font-bold text-center"
                    />
                    <span className="text-slate-400 text-[11px] ml-1.5">/ {max}</span>
                  </td>
                  <td className="py-2.5 px-4 font-bold text-teal-700">{grade}</td>
                  <td className="py-2.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${isPass ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                      {isPass ? 'PASSED' : 'NEEDS IMPROVEMENT'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
