import React, { useState, useEffect } from 'react';
import { StudentMarks, SubjectItem, StudentRosterItem } from '../types';
import { 
  Search, 
  Save, 
  MessageSquare, 
  RotateCcw, 
  CheckCircle2, 
  UserCheck, 
  BookOpen,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MarksEntryViewProps {
  marksList: StudentMarks[];
  subjects: SubjectItem[];
  students: StudentRosterItem[];
  searchQuery: string;
  onSaveMarks: (updated: StudentMarks) => void;
}

export const MarksEntryView: React.FC<MarksEntryViewProps> = ({
  marksList,
  subjects,
  students,
  searchQuery,
  onSaveMarks
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(marksList[0]?.studentId || 'std-1');
  const [selectedCourseCode, setSelectedCourseCode] = useState<string>('CS301');
  const [localSearch, setLocalSearch] = useState<string>('');
  const [firstInternal, setFirstInternal] = useState<number>(18);
  const [secondInternal, setSecondInternal] = useState<number>(16);
  const [assignments, setAssignments] = useState<number>(8);
  const [remarks, setRemarks] = useState<string>('"Excellent performance in dynamic programming assignments. Needs focus on graph algorithms."');
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Active student and course
  const currentStudent = students.find(s => s.id === selectedStudentId) || students[0];
  const currentSubject = subjects.find(s => s.code === selectedCourseCode) || subjects[0];
  
  // Find or create record for selected student & course
  const existingRecord = marksList.find(
    m => (m.studentId === selectedStudentId || m.rollNo === currentStudent?.rollNo) && m.courseCode === selectedCourseCode
  );

  useEffect(() => {
    if (existingRecord) {
      setFirstInternal(existingRecord.firstInternal);
      setSecondInternal(existingRecord.secondInternal);
      setAssignments(existingRecord.assignments);
      setRemarks(existingRecord.remarks || '');
    } else {
      setFirstInternal(15);
      setSecondInternal(14);
      setAssignments(7);
      setRemarks('Satisfactory performance. Regular attendance recommended.');
    }
  }, [selectedStudentId, selectedCourseCode]);

  // Calculations
  const totalScore = Math.min(50, Math.max(0, (Number(firstInternal) || 0) + (Number(secondInternal) || 0) + (Number(assignments) || 0)));
  const isPass = totalScore >= 25;
  const isDistinction = totalScore >= 45;

  const handleSave = () => {
    const updatedRecord: StudentMarks = {
      id: existingRecord?.id || `marks-${Date.now()}`,
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      rollNo: currentStudent.rollNo,
      courseCode: currentSubject.code,
      courseName: currentSubject.name,
      faculty: currentSubject.faculty,
      firstInternal: Number(firstInternal) || 0,
      secondInternal: Number(secondInternal) || 0,
      assignments: Number(assignments) || 0,
      remarks,
      updatedAt: new Date().toISOString()
    };

    onSaveMarks(updatedRecord);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
    setSaveToast(`Marks recorded for ${currentStudent.name} (${currentSubject.code}): ${totalScore}/50 (${isPass ? 'Pass' : 'Fail'}).`);
    setTimeout(() => setSaveToast(null), 3500);
  };

  const handleClear = () => {
    setFirstInternal(0);
    setSecondInternal(0);
    setAssignments(0);
    setRemarks('');
    setSaveToast('Form cleared for re-entry.');
    setTimeout(() => setSaveToast(null), 2500);
  };

  // Filter students for search bar
  const query = (searchQuery || localSearch).toLowerCase();
  const searchResults = students.filter(s =>
    s.name.toLowerCase().includes(query) || s.rollNo.toLowerCase().includes(query)
  );

  return (
    <div className="p-4 md:p-8 flex-1 max-w-5xl mx-auto w-full space-y-6">
      {/* Save Notification Toast */}
      {saveToast && (
        <div className="p-3 bg-[#000f27] text-white text-xs font-semibold rounded-xl shadow-lg flex items-center justify-between animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{saveToast}</span>
          </div>
          <button onClick={() => setSaveToast(null)} className="text-white/70 hover:text-white text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Page Header & Search Student */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#000f27] tracking-tight">Marks Entry</h2>
          <p className="text-xs text-[#5c5f60] mt-0.5">Record and review student academic performance.</p>
        </div>

        {/* Student Search & Quick Select */}
        <div className="w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-[#74777f] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search student ID or name..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#c4c6cf] bg-white text-xs text-[#1b1b1e] placeholder-[#74777f] focus:outline-none focus:border-[#000f27] focus:ring-1 focus:ring-[#000f27] shadow-sm"
          />

          {localSearch && searchResults.length > 0 && (
            <div className="absolute top-12 left-0 w-full bg-white rounded-xl shadow-xl border border-[#efedf1] z-20 py-2 max-h-48 overflow-y-auto">
              {searchResults.map(st => (
                <button
                  key={st.id}
                  onClick={() => {
                    setSelectedStudentId(st.id);
                    setLocalSearch('');
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-[#faf9fc] flex items-center justify-between text-xs transition-colors"
                >
                  <span className="font-bold text-[#000f27]">{st.name}</span>
                  <span className="font-mono text-[#5c5f60] text-[11px]">{st.rollNo}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Student & Course Fast Switcher Pills */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#c4c6cf]/30 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <span className="text-[11px] font-bold text-[#5c5f60] uppercase tracking-wider whitespace-nowrap">Student:</span>
          {students.slice(0, 5).map(std => (
            <button
              key={std.id}
              onClick={() => setSelectedStudentId(std.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedStudentId === std.id
                  ? 'bg-[#000f27] text-white shadow-sm'
                  : 'bg-[#efedf1] text-[#5c5f60] hover:bg-[#e3e2e5]'
              }`}
            >
              {std.name} ({std.rollNo})
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-[#5c5f60] uppercase tracking-wider whitespace-nowrap">Course:</span>
          <select
            value={selectedCourseCode}
            onChange={(e) => setSelectedCourseCode(e.target.value)}
            className="bg-[#faf9fc] border border-[#c4c6cf] rounded-lg px-2.5 py-1 text-xs font-bold text-[#000f27] outline-none"
          >
            {subjects.map(s => (
              <option key={s.id} value={s.code}>{s.code} - {s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Marks Entry Card (Matching Image 5 & 6) */}
      <div className="bg-white rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-[#c4c6cf]/20 border-l-4 border-l-[#000f27] overflow-hidden">
        <div className="p-6 md:p-8 space-y-6">
          {/* Course Info Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end pb-6 border-b border-[#efedf1] gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0b2447] bg-[#d6e3ff]/40 px-2.5 py-1 rounded-lg mb-2">
                <UserCheck className="w-3.5 h-3.5 text-[#0b2447]" />
                <span>Student: {currentStudent?.name} ({currentStudent?.rollNo})</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-[#000f27]">
                {currentSubject.name}
              </h3>
              <p className="text-xs text-[#5c5f60] mt-1 flex items-center gap-2">
                <span className="font-semibold text-[#1b1b1e]">Course Code: {currentSubject.code}</span>
                <span className="w-1 h-1 rounded-full bg-[#c4c6cf]" />
                <span>Faculty: {currentSubject.faculty}</span>
              </p>
            </div>

            <div className="flex flex-col items-end">
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-bold text-[#000f27] tracking-tight">{totalScore}</span>
                <span className="text-base font-medium text-[#5c5f60]">/ 50</span>
              </div>

              {/* Status Badge */}
              <div className={`mt-2 inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold ${
                isDistinction ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                isPass ? 'bg-[#d6e3ff] text-[#011b3e] border border-[#b1c7f3]' :
                'bg-[#ffdad6] text-[#93000a] border border-rose-300'
              }`}>
                {isDistinction ? 'Distinction' : isPass ? 'Pass' : 'Needs Improvement (Fail)'}
              </div>
            </div>
          </div>

          {/* Input Grid (3 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* First Internal */}
            <div className="bg-[#f5f3f6] rounded-xl p-4 border border-transparent focus-within:border-[#000f27] focus-within:bg-white transition-all shadow-inner">
              <div className="flex justify-between items-center mb-2">
                <label className="text-[11px] font-bold text-[#5c5f60] uppercase tracking-wider">
                  First Internal
                </label>
                <span className="text-[11px] text-[#5c5f60] font-semibold">Max: 20</span>
              </div>
              <input
                type="number"
                min={0}
                max={20}
                value={firstInternal}
                onChange={(e) => setFirstInternal(Math.min(20, Math.max(0, parseInt(e.target.value) || 0)))}
                className="w-full bg-transparent border-none p-0 text-3xl font-bold text-[#000f27] focus:ring-0 outline-none"
              />
            </div>

            {/* Second Internal */}
            <div className="bg-[#f5f3f6] rounded-xl p-4 border border-transparent focus-within:border-[#000f27] focus-within:bg-white transition-all shadow-inner">
              <div className="flex justify-between items-center mb-2">
                <label className="text-[11px] font-bold text-[#5c5f60] uppercase tracking-wider">
                  Second Internal
                </label>
                <span className="text-[11px] text-[#5c5f60] font-semibold">Max: 20</span>
              </div>
              <input
                type="number"
                min={0}
                max={20}
                value={secondInternal}
                onChange={(e) => setSecondInternal(Math.min(20, Math.max(0, parseInt(e.target.value) || 0)))}
                className="w-full bg-transparent border-none p-0 text-3xl font-bold text-[#000f27] focus:ring-0 outline-none"
              />
            </div>

            {/* Assignments */}
            <div className="bg-[#f5f3f6] rounded-xl p-4 border border-transparent focus-within:border-[#000f27] focus-within:bg-white transition-all shadow-inner">
              <div className="flex justify-between items-center mb-2">
                <label className="text-[11px] font-bold text-[#5c5f60] uppercase tracking-wider">
                  Assignments
                </label>
                <span className="text-[11px] text-[#5c5f60] font-semibold">Max: 10</span>
              </div>
              <input
                type="number"
                min={0}
                max={10}
                value={assignments}
                onChange={(e) => setAssignments(Math.min(10, Math.max(0, parseInt(e.target.value) || 0)))}
                className="w-full bg-transparent border-none p-0 text-3xl font-bold text-[#000f27] focus:ring-0 outline-none"
              />
            </div>
          </div>

          {/* Remarks Section */}
          <div className="bg-[#faf9fc] rounded-xl p-4 border border-[#efedf1] flex gap-3.5 items-start">
            <MessageSquare className="w-5 h-5 text-[#000f27] mt-1 shrink-0" />
            <div className="flex-1">
              <label className="text-[10px] font-bold text-[#5c5f60] uppercase tracking-wider block mb-1">
                Faculty Evaluation Remarks
              </label>
              <textarea
                rows={2}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter remarks..."
                className="w-full bg-transparent border-none p-0 text-xs text-[#5c5f60] italic resize-none focus:ring-0 outline-none leading-relaxed"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#efedf1]">
            <button
              onClick={handleClear}
              className="px-5 py-2.5 rounded-xl border border-[#c4c6cf] text-xs font-bold text-[#5c5f60] hover:bg-[#f5f3f6] transition-colors"
            >
              Clear
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-[#000f27] hover:bg-[#0b2447] text-white text-xs font-bold shadow-md transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Marks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
