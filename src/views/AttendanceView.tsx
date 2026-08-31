import React, { useState, useMemo } from 'react';
import { StudentRosterItem, SubjectItem } from '../types';
import { 
  ChevronDown, 
  Search, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AttendanceViewProps {
  roster: StudentRosterItem[];
  subjects: SubjectItem[];
  searchQuery: string;
  onUpdateRoster: (updatedRoster: StudentRosterItem[]) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  roster,
  subjects,
  searchQuery,
  onUpdateRoster
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || 'sub-1');
  const [selectedDate, setSelectedDate] = useState<string>('2024-10-24');
  const [rosterState, setRosterState] = useState<StudentRosterItem[]>(roster);
  const [localSearch, setLocalSearch] = useState<string>('');
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const selectedSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];

  // Search filter
  const activeSearch = (searchQuery || localSearch).toLowerCase();
  const filteredRoster = useMemo(() => {
    return rosterState.filter(std => 
      std.name.toLowerCase().includes(activeSearch) ||
      std.rollNo.toLowerCase().includes(activeSearch)
    );
  }, [rosterState, activeSearch]);

  // Dynamic statistics calculations
  const presentCount = rosterState.filter(s => s.status === 'P').length;
  const totalStudents = rosterState.length;
  const currentAttendancePct = Math.round((presentCount / Math.max(1, totalStudents)) * 100);

  // Overall attendance calculation across semester
  const totalClassesAttended = subjects.reduce((acc, sub) => acc + sub.attendedClasses, 0) + (presentCount > 0 ? 1 : 0);
  const totalClassesHeld = subjects.reduce((acc, sub) => acc + sub.totalClasses, 0) + 1;
  const overallSemesterPct = Math.round((totalClassesAttended / Math.max(1, totalClassesHeld)) * 100);

  const toggleStudentStatus = (studentId: string, status: 'P' | 'A') => {
    const updated = rosterState.map(std => {
      if (std.id === studentId) {
        return { ...std, status };
      }
      return std;
    });
    setRosterState(updated);
  };

  const handleMarkAllPresent = () => {
    const updated = rosterState.map(std => ({ ...std, status: 'P' as const }));
    setRosterState(updated);
  };

  const handleClearAll = () => {
    const updated = rosterState.map(std => ({ ...std, status: 'A' as const }));
    setRosterState(updated);
  };

  const handleSave = () => {
    onUpdateRoster(rosterState);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
    setSaveToast(`Attendance for ${selectedSubject.name} on ${selectedDate} saved successfully!`);
    setTimeout(() => setSaveToast(null), 3500);
  };

  const handleCancel = () => {
    setRosterState(roster);
    setSaveToast('Reverted modifications to original roster state.');
    setTimeout(() => setSaveToast(null), 2500);
  };

  return (
    <div className="p-4 md:p-8 flex-1 max-w-7xl mx-auto w-full space-y-6">
      {/* Toast */}
      {saveToast && (
        <div className="p-3 bg-[#000f27] text-white text-xs font-semibold rounded-xl shadow-lg flex items-center justify-between animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{saveToast}</span>
          </div>
          <button onClick={() => setSaveToast(null)} className="text-white/70 hover:text-white text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Header Controls Card */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-[#c4c6cf]/30">
        <div>
          <h2 className="text-2xl font-bold text-[#000f27] tracking-tight">Record Attendance</h2>
          <p className="text-xs text-[#5c5f60] mt-0.5">Select subject and date to mark student attendance.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          {/* Subject Dropdown */}
          <div className="flex-1 sm:w-60">
            <label className="block text-[11px] font-bold text-[#5c5f60] uppercase tracking-wider mb-1">
              Subject
            </label>
            <div className="relative">
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full appearance-none bg-[#faf9fc] border border-[#c4c6cf] text-[#1b1b1e] py-2.5 pl-3.5 pr-9 rounded-xl focus:outline-none focus:border-[#000f27] focus:ring-1 focus:ring-[#000f27] text-xs font-semibold"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#74777f] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Date Picker */}
          <div className="flex-1 sm:w-48">
            <label className="block text-[11px] font-bold text-[#5c5f60] uppercase tracking-wider mb-1">
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-[#faf9fc] border border-[#c4c6cf] text-[#1b1b1e] py-2 px-3.5 rounded-xl focus:outline-none focus:border-[#000f27] focus:ring-1 focus:ring-[#000f27] text-xs font-semibold"
            />
          </div>
        </div>
      </div>

      {/* Main Grid: 1 Col Summary + 2 Col Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Metrics & Subject Breakdown (4 of 12 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Overall Attendance Gauge */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#c4c6cf]/30 p-6 text-center">
            <h3 className="font-bold text-base text-[#000f27] mb-5">Overall Attendance</h3>
            
            {/* SVG Radial Gauge */}
            <div className="relative w-44 h-44 mx-auto mb-5">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="15.9155"
                  fill="none"
                  stroke="#e3e2e5"
                  strokeWidth="3.2"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.9155"
                  fill="none"
                  stroke="#1e6b40"
                  strokeWidth="3.2"
                  strokeDasharray={`${overallSemesterPct}, 100`}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-[#000f27] tracking-tight">{overallSemesterPct}%</span>
                <span className="text-[11px] font-bold text-[#5c5f60] tracking-widest uppercase mt-0.5">PRESENT</span>
              </div>
            </div>

            <p className="text-xs text-[#5c5f60] leading-relaxed">
              Minimum requirement is 75%. You are currently{' '}
              <span className={`font-bold ${overallSemesterPct >= 75 ? 'text-[#1e6b40]' : 'text-[#ba1a1a]'}`}>
                {overallSemesterPct >= 75 ? 'on track' : 'below threshold'}
              </span>. Total attended: <strong>{totalClassesAttended} / {totalClassesHeld}</strong> classes.
            </p>
          </div>

          {/* Subject Breakdown Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#c4c6cf]/30 p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-base text-[#000f27]">Subject Breakdown</h3>
              <span className="bg-[#efedf1] px-3 py-0.5 rounded-full text-[11px] font-semibold text-[#5c5f60] border border-[#c4c6cf]/40">
                Fall 2024
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#efedf1] text-[#5c5f60] text-[11px] font-bold uppercase tracking-wider">
                    <th className="pb-2.5 font-bold">Subject</th>
                    <th className="pb-2.5 font-bold text-right px-2">%</th>
                    <th className="pb-2.5 font-bold text-center w-8">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#efedf1]">
                  {subjects.map((sub) => {
                    const isAlert = sub.percentage < 70;
                    return (
                      <tr 
                        key={sub.id} 
                        className={`hover:bg-[#faf9fc] transition-colors ${
                          isAlert ? 'bg-[#ffdad6]/20 border-l-4 border-l-[#ba1a1a]' : ''
                        }`}
                      >
                        <td className="py-3 pr-2">
                          <div className="font-bold text-[#1b1b1e]">{sub.name}</div>
                          <div className="text-[10px] text-[#5c5f60]">{sub.code}</div>
                        </td>
                        <td className="py-3 text-right font-bold px-2">
                          <span className={
                            sub.percentage >= 85 ? 'text-[#1e6b40]' :
                            sub.percentage >= 75 ? 'text-[#b8860b]' :
                            'text-[#ba1a1a]'
                          }>
                            {sub.percentage}%
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <div className={`w-3 h-3 rounded-full mx-auto ring-4 ${
                            sub.percentage >= 85 ? 'bg-[#1e6b40] ring-[#1e6b40]/20' :
                            sub.percentage >= 75 ? 'bg-[#b8860b] ring-[#b8860b]/20' :
                            'bg-[#ba1a1a] ring-[#ba1a1a]/20'
                          }`} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Student Roster Table (8 of 12 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-[#c4c6cf]/30 p-6 flex flex-col justify-between">
          <div>
            {/* Header & Local Search */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
              <div>
                <h3 className="font-bold text-lg text-[#000f27]">Student Roster</h3>
                <p className="text-xs text-[#5c5f60]">Today's attendance: <strong>{presentCount}</strong> Present, <strong>{totalStudents - presentCount}</strong> Absent ({currentAttendancePct}%)</p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-[#74777f] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Search student name or ID..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#c4c6cf] bg-[#faf9fc] text-xs text-[#1b1b1e] focus:outline-none focus:border-[#000f27] focus:ring-1 focus:ring-[#000f27]"
                />
              </div>
            </div>

            {/* Bulk Actions Bar */}
            <div className="flex justify-between items-center mb-4 bg-[#efedf1] py-2 px-4 rounded-xl text-xs">
              <div className="flex items-center gap-3">
                <span className="font-bold text-[#5c5f60] uppercase tracking-wider text-[10px]">Bulk Actions:</span>
                <button
                  onClick={handleMarkAllPresent}
                  className="font-bold text-[#000f27] hover:underline cursor-pointer"
                >
                  Mark All Present
                </button>
                <span className="text-[#c4c6cf]">|</span>
                <button
                  onClick={handleClearAll}
                  className="font-medium text-[#5c5f60] hover:underline cursor-pointer"
                >
                  Clear All
                </button>
              </div>
              <span className="font-semibold text-[#5c5f60] text-xs">{filteredRoster.length} Students</span>
            </div>

            {/* Roster Table */}
            <div className="overflow-x-auto border border-[#efedf1] rounded-xl max-h-[460px] overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#efedf1] sticky top-0 z-10">
                  <tr className="text-[#5c5f60] text-[11px] font-bold uppercase tracking-wider">
                    <th className="py-3 px-4 w-12 text-center">#</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4 w-36 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#efedf1]">
                  {filteredRoster.map((student, idx) => {
                    const isAbsent = student.status === 'A';
                    return (
                      <tr 
                        key={student.id} 
                        className={`hover:bg-[#faf9fc] transition-colors ${
                          isAbsent ? 'bg-[#ffdad6]/10' : ''
                        }`}
                      >
                        <td className="py-3 px-4 text-center font-medium text-[#5c5f60]">{idx + 1}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {student.avatar ? (
                              <img
                                src={student.avatar}
                                alt={student.name}
                                className="w-8 h-8 rounded-full object-cover border border-[#c4c6cf]"
                              />
                            ) : (
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${student.avatarBg || 'bg-[#000f27] text-white'}`}>
                                {student.initials}
                              </div>
                            )}
                            <div>
                              <div className="font-bold text-[#1b1b1e]">{student.name}</div>
                              <div className="text-[10px] text-[#5c5f60]">{student.rollNo}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center bg-[#e3e2e5] p-1 rounded-xl gap-1 border border-[#c4c6cf]/40 max-w-[120px] mx-auto">
                            <button
                              type="button"
                              onClick={() => toggleStudentStatus(student.id, 'P')}
                              className={`flex-1 py-1.5 px-3 rounded-lg font-bold text-xs transition-all shadow-sm ${
                                student.status === 'P'
                                  ? 'bg-[#1e6b40] text-white'
                                  : 'text-[#5c5f60] hover:bg-white/60'
                              }`}
                            >
                              P
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleStudentStatus(student.id, 'A')}
                              className={`flex-1 py-1.5 px-3 rounded-lg font-bold text-xs transition-all shadow-sm ${
                                student.status === 'A'
                                  ? 'bg-[#ba1a1a] text-white'
                                  : 'text-[#5c5f60] hover:bg-white/60'
                              }`}
                            >
                              A
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-[#efedf1]">
            <button
              onClick={handleCancel}
              className="px-6 py-2.5 rounded-xl bg-[#efedf1] text-[#000f27] font-bold text-xs hover:bg-[#e3e2e5] transition-colors border border-[#c4c6cf]/40"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-[#000f27] hover:bg-[#0b2447] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Attendance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
