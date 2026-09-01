import React, { useState, useMemo, useEffect } from "react";
import { StudentRosterItem, SubjectItem } from "../types";
import {
  ChevronDown,
  Search,
  Save,
  CheckCircle2,
} from "lucide-react";
import confetti from "canvas-confetti";

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
  onUpdateRoster,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    subjects[0]?.id || "sub-1"
  );

  // Use local date instead of UTC date
  const getLocalDate = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState<string>(getLocalDate());

  const [rosterState, setRosterState] =
    useState<StudentRosterItem[]>(roster);

  const [localSearch, setLocalSearch] = useState<string>("");

  const [saveToast, setSaveToast] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);

  const [isLoadingAttendance, setIsLoadingAttendance] =
    useState(false);

  // ==========================================
  // KEEP LOCAL ROSTER IN SYNC WITH APP
  // ==========================================

  useEffect(() => {
    setRosterState(roster);
  }, [roster]);

  // ==========================================
  // SELECTED SUBJECT
  // ==========================================

  const selectedSubject =
    subjects.find((subject) => subject.id === selectedSubjectId) ||
    subjects[0];

  // ==========================================
  // LOAD SAVED ATTENDANCE
  // ==========================================

  useEffect(() => {
    const loadAttendance = async () => {
      if (!selectedSubject || !selectedDate || roster.length === 0) {
        return;
      }

      setIsLoadingAttendance(true);

      try {
        console.log("======================================");
        console.log("Loading attendance...");
        console.log("Subject:", selectedSubject.name);
        console.log("Subject ID:", selectedSubject.id);
        console.log("Date:", selectedDate);
        console.log("======================================");

        const response = await fetch(
          `http://localhost:5000/api/attendance?subjectId=${encodeURIComponent(
            selectedSubject.id
          )}&date=${encodeURIComponent(selectedDate)}`
        );

        if (!response.ok) {
          throw new Error("Failed to load attendance.");
        }

        const attendanceRecords = await response.json();

        console.log(
          "Attendance records found:",
          attendanceRecords.length
        );

        // If no attendance has been saved for this
        // subject + date, keep the existing roster.
        if (attendanceRecords.length === 0) {
          console.log(
            "No saved attendance found for this subject and date."
          );

          setIsLoadingAttendance(false);
          return;
        }

        // Create a quick lookup:
        // studentId -> P/A
        const attendanceMap = new Map<string, "P" | "A">();

        attendanceRecords.forEach(
          (record: {
            studentId: string;
            status: "P" | "A";
          }) => {
            attendanceMap.set(record.studentId, record.status);
          }
        );

        // Apply saved attendance to the roster.
        const updatedRoster = roster.map((student) => {
          const savedStatus = attendanceMap.get(student.id);

          if (savedStatus) {
            return {
              ...student,
              status: savedStatus,
            };
          }

          return student;
        });

        setRosterState(updatedRoster);

        console.log("Saved attendance loaded successfully.");
      } catch (error) {
        console.error(
          "Failed to load attendance:",
          error
        );

        setSaveToast(
          error instanceof Error
            ? error.message
            : "Failed to load attendance."
        );

        setTimeout(() => {
          setSaveToast(null);
        }, 3000);
      } finally {
        setIsLoadingAttendance(false);
      }
    };

    loadAttendance();
  }, [
    selectedSubjectId,
    selectedDate,
    roster,
  ]);

  // ==========================================
  // SEARCH
  // ==========================================

  const activeSearch = (
    searchQuery || localSearch
  ).toLowerCase();

  const filteredRoster = useMemo(() => {
    return rosterState.filter((student) => {
      return (
        student.name.toLowerCase().includes(activeSearch) ||
        student.rollNo.toLowerCase().includes(activeSearch) ||
        student.id.toLowerCase().includes(activeSearch)
      );
    });
  }, [rosterState, activeSearch]);

  // ==========================================
  // TODAY'S ATTENDANCE STATISTICS
  // ==========================================

  const presentCount = rosterState.filter(
    (student) => student.status === "P"
  ).length;

  const absentCount = rosterState.filter(
    (student) => student.status === "A"
  ).length;

  const totalStudents = rosterState.length;

  const currentAttendancePct =
    totalStudents > 0
      ? Math.round((presentCount / totalStudents) * 100)
      : 0;

  // ==========================================
  // CHANGE INDIVIDUAL STUDENT STATUS
  // ==========================================

  const toggleStudentStatus = (
    studentId: string,
    status: "P" | "A"
  ) => {
    setRosterState((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? {
              ...student,
              status,
            }
          : student
      )
    );
  };

  // ==========================================
  // MARK ALL PRESENT
  // ==========================================

  const handleMarkAllPresent = () => {
    setRosterState((prev) =>
      prev.map((student) => ({
        ...student,
        status: "P",
      }))
    );
  };

  // ==========================================
  // MARK ALL ABSENT
  // ==========================================

  const handleClearAll = () => {
    setRosterState((prev) =>
      prev.map((student) => ({
        ...student,
        status: "A",
      }))
    );
  };

  // ==========================================
  // SAVE ATTENDANCE
  // ==========================================

  const handleSave = async () => {
    if (rosterState.length === 0) {
      setSaveToast("There are no students to save.");
      return;
    }

    if (!selectedSubject) {
      setSaveToast("Please select a subject.");
      return;
    }

    setIsSaving(true);
    setSaveToast(null);

    try {
      console.log("======================================");
      console.log("Saving attendance...");
      console.log("Subject:", selectedSubject.name);
      console.log("Subject ID:", selectedSubject.id);
      console.log("Date:", selectedDate);
      console.log("Students:", rosterState.length);
      console.log("======================================");

      const attendanceRequests = rosterState.map(
        async (student) => {
          const response = await fetch(
            "http://localhost:5000/api/attendance",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                studentId: student.id,
                subjectId: selectedSubject.id,
                subjectName: selectedSubject.name,
                date: selectedDate,
                status: student.status,
              }),
            }
          );

          if (!response.ok) {
            let errorMessage =
              `Failed to save attendance for ${student.name}`;

            try {
              const errorData = await response.json();

              if (errorData?.message) {
                errorMessage = errorData.message;
              }
            } catch {
              // Ignore JSON parsing errors
            }

            throw new Error(errorMessage);
          }

          return response.json();
        }
      );

      const savedAttendance = await Promise.all(
        attendanceRequests
      );

      console.log(
        "======================================"
      );

      console.log(
        "Attendance successfully saved to MongoDB:"
      );

      console.log(savedAttendance);

      console.log(
        "======================================"
      );

      // Update app state
      onUpdateRoster(rosterState);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: {
          y: 0.7,
        },
      });

      setSaveToast(
        `Attendance for ${selectedSubject.name} on ${selectedDate} saved successfully!`
      );
    } catch (error) {
      console.error(
        "Failed to save attendance:",
        error
      );

      setSaveToast(
        error instanceof Error
          ? error.message
          : "Failed to save attendance."
      );
    } finally {
      setIsSaving(false);

      setTimeout(() => {
        setSaveToast(null);
      }, 3500);
    }
  };

  // ==========================================
  // CANCEL CHANGES
  // ==========================================

  const handleCancel = () => {
    setRosterState(roster);

    setSaveToast(
      "Reverted modifications to original roster state."
    );

    setTimeout(() => {
      setSaveToast(null);
    }, 2500);
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="p-4 md:p-8 flex-1 max-w-7xl mx-auto w-full space-y-6">

      {/* Toast */}
      {saveToast && (
        <div className="p-3 bg-[#000f27] text-white text-xs font-semibold rounded-xl shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />

            <span>{saveToast}</span>
          </div>

          <button
            onClick={() => setSaveToast(null)}
            className="text-white/70 hover:text-white text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-[#c4c6cf]/30">

        <div>
          <h2 className="text-2xl font-bold text-[#000f27] tracking-tight">
            Record Attendance
          </h2>

          <p className="text-xs text-[#5c5f60] mt-0.5">
            Select subject and date to mark student attendance.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">

          {/* Subject */}
          <div className="flex-1 sm:w-60">
            <label className="block text-[11px] font-bold text-[#5c5f60] uppercase tracking-wider mb-1">
              Subject
            </label>

            <div className="relative">
              <select
                value={selectedSubjectId}
                onChange={(e) =>
                  setSelectedSubjectId(e.target.value)
                }
                className="w-full appearance-none bg-[#faf9fc] border border-[#c4c6cf] text-[#1b1b1e] py-2.5 pl-3.5 pr-9 rounded-xl focus:outline-none focus:border-[#000f27] focus:ring-1 focus:ring-[#000f27] text-xs font-semibold"
              >
                {subjects.map((subject) => (
                  <option
                    key={subject.id}
                    value={subject.id}
                  >
                    {subject.name} ({subject.code})
                  </option>
                ))}
              </select>

              <ChevronDown className="w-4 h-4 text-[#74777f] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Date */}
          <div className="flex-1 sm:w-48">
            <label className="block text-[11px] font-bold text-[#5c5f60] uppercase tracking-wider mb-1">
              Date
            </label>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) =>
                setSelectedDate(e.target.value)
              }
              className="w-full bg-[#faf9fc] border border-[#c4c6cf] text-[#1b1b1e] py-2 px-3.5 rounded-xl focus:outline-none focus:border-[#000f27] focus:ring-1 focus:ring-[#000f27] text-xs font-semibold"
            />
          </div>

        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-4 flex flex-col gap-6">

          {/* Today's Attendance */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#c4c6cf]/30 p-6 text-center">

            <h3 className="font-bold text-base text-[#000f27] mb-5">
              Today's Attendance
            </h3>

            <div className="relative w-44 h-44 mx-auto mb-5">

              <svg
                className="w-full h-full -rotate-90"
                viewBox="0 0 36 36"
              >
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
                  strokeDasharray={`${currentAttendancePct}, 100`}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">

                <span className="text-3xl font-bold text-[#000f27] tracking-tight">
                  {currentAttendancePct}%
                </span>

                <span className="text-[11px] font-bold text-[#5c5f60] tracking-widest uppercase mt-0.5">
                  PRESENT
                </span>

              </div>
            </div>

            <p className="text-xs text-[#5c5f60] leading-relaxed">
              Present:{" "}
              <strong>{presentCount}</strong>
              {" "} / {" "}
              <strong>{totalStudents}</strong>
              {" "}students.
              <br />

              Absent:{" "}
              <strong>{absentCount}</strong>
              {" "}students.
            </p>

          </div>

          {/* Today's Classes */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#c4c6cf]/30 p-6">

            <div className="flex justify-between items-center mb-5">

              <h3 className="font-bold text-base text-[#000f27]">
                Today's Classes
              </h3>

              <span className="bg-[#efedf1] px-3 py-0.5 rounded-full text-[11px] font-semibold text-[#5c5f60] border border-[#c4c6cf]/40">
                Today
              </span>

            </div>

            <div className="space-y-3">

              {subjects.map((subject) => (
                <div
                  key={subject.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#faf9fc] border border-[#efedf1]"
                >

                  <div>
                    <div className="font-bold text-xs text-[#1b1b1e]">
                      {subject.name}
                    </div>

                    <div className="text-[10px] text-[#5c5f60]">
                      {subject.code}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-[#000f27]">
                      Class
                    </div>

                    <div className="text-[10px] text-[#5c5f60]">
                      Scheduled
                    </div>
                  </div>

                </div>
              ))}

              {subjects.length === 0 && (
                <p className="text-xs text-[#74777f] text-center py-4">
                  No classes scheduled today.
                </p>
              )}

            </div>

          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-[#c4c6cf]/30 p-6 flex flex-col justify-between">

          <div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">

              <div>

                <h3 className="font-bold text-lg text-[#000f27]">
                  Student Roster
                </h3>

                <p className="text-xs text-[#5c5f60]">

                  Today's attendance:{" "}

                  <strong>
                    {presentCount}
                  </strong>{" "}
                  Present,{" "}

                  <strong>
                    {absentCount}
                  </strong>{" "}
                  Absent ({currentAttendancePct}%)

                </p>

              </div>

              {/* Search */}
              <div className="relative w-full sm:w-64">

                <Search className="w-4 h-4 text-[#74777f] absolute left-3 top-1/2 -translate-y-1/2" />

                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) =>
                    setLocalSearch(e.target.value)
                  }
                  placeholder="Search student name, ID or roll no..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#c4c6cf] bg-[#faf9fc] text-xs text-[#1b1b1e] focus:outline-none focus:border-[#000f27] focus:ring-1 focus:ring-[#000f27]"
                />

              </div>

            </div>

            {/* Loading attendance */}
            {isLoadingAttendance && (
              <div className="mb-4 p-3 rounded-xl bg-[#faf9fc] border border-[#efedf1] text-center text-xs font-semibold text-[#5c5f60]">
                Loading saved attendance...
              </div>
            )}

            {/* Bulk Actions */}
            <div className="flex justify-between items-center mb-4 bg-[#efedf1] py-2 px-4 rounded-xl text-xs">

              <div className="flex items-center gap-3">

                <span className="font-bold text-[#5c5f60] uppercase tracking-wider text-[10px]">
                  Bulk Actions:
                </span>

                <button
                  onClick={handleMarkAllPresent}
                  disabled={isSaving || isLoadingAttendance}
                  className="font-bold text-[#000f27] hover:underline disabled:opacity-50"
                >
                  Mark All Present
                </button>

                <span className="text-[#c4c6cf]">
                  |
                </span>

                <button
                  onClick={handleClearAll}
                  disabled={isSaving || isLoadingAttendance}
                  className="font-medium text-[#5c5f60] hover:underline disabled:opacity-50"
                >
                  Clear All
                </button>

              </div>

              <span className="font-semibold text-[#5c5f60] text-xs">
                {filteredRoster.length} Students
              </span>

            </div>

            {/* Student Table */}
            <div className="overflow-x-auto border border-[#efedf1] rounded-xl max-h-[460px] overflow-y-auto">

              <table className="w-full text-left text-xs">

                <thead className="bg-[#efedf1] sticky top-0 z-10">

                  <tr className="text-[#5c5f60] text-[11px] font-bold uppercase tracking-wider">

                    <th className="py-3 px-4 w-12 text-center">
                      #
                    </th>

                    <th className="py-3 px-4">
                      Student
                    </th>

                    <th className="py-3 px-4 w-36 text-center">
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-[#efedf1]">

                  {filteredRoster.length === 0 ? (

                    <tr>

                      <td
                        colSpan={3}
                        className="py-10 text-center text-[#74777f]"
                      >
                        {roster.length === 0
                          ? "Loading students..."
                          : "No students found."}
                      </td>

                    </tr>

                  ) : (

                    filteredRoster.map((student, idx) => {

                      const isAbsent =
                        student.status === "A";

                      return (

                        <tr
                          key={student.id}
                          className={`hover:bg-[#faf9fc] transition-colors ${
                            isAbsent
                              ? "bg-[#ffdad6]/10"
                              : ""
                          }`}
                        >

                          {/* Number */}
                          <td className="py-3 px-4 text-center font-medium text-[#5c5f60]">
                            {idx + 1}
                          </td>

                          {/* Student */}
                          <td className="py-3 px-4">

                            <div className="flex items-center gap-3">

                              {student.avatar ? (

                                <img
                                  src={student.avatar}
                                  alt={student.name}
                                  className="w-8 h-8 rounded-full object-cover border border-[#c4c6cf]"
                                />

                              ) : (

                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                                    student.avatarBg ||
                                    "bg-[#000f27] text-white"
                                  }`}
                                >
                                  {student.initials}
                                </div>

                              )}

                              <div>

                                <div className="font-bold text-[#1b1b1e]">
                                  {student.name}
                                </div>

                                <div className="text-[10px] text-[#5c5f60]">
                                  UID: {student.id} • Roll No:{" "}
                                  {student.rollNo}
                                </div>

                              </div>

                            </div>

                          </td>

                          {/* Status */}
                          <td className="py-3 px-4">

                            <div className="flex items-center justify-center bg-[#e3e2e5] p-1 rounded-xl gap-1 border border-[#c4c6cf]/40 max-w-[120px] mx-auto">

                              <button
                                type="button"
                                disabled={
                                  isSaving ||
                                  isLoadingAttendance
                                }
                                onClick={() =>
                                  toggleStudentStatus(
                                    student.id,
                                    "P"
                                  )
                                }
                                className={`flex-1 py-1.5 px-3 rounded-lg font-bold text-xs transition-all shadow-sm ${
                                  student.status === "P"
                                    ? "bg-[#1e6b40] text-white"
                                    : "text-[#5c5f60] hover:bg-white/60"
                                }`}
                              >
                                P
                              </button>

                              <button
                                type="button"
                                disabled={
                                  isSaving ||
                                  isLoadingAttendance
                                }
                                onClick={() =>
                                  toggleStudentStatus(
                                    student.id,
                                    "A"
                                  )
                                }
                                className={`flex-1 py-1.5 px-3 rounded-lg font-bold text-xs transition-all shadow-sm ${
                                  student.status === "A"
                                    ? "bg-[#ba1a1a] text-white"
                                    : "text-[#5c5f60] hover:bg-white/60"
                                }`}
                              >
                                A
                              </button>

                            </div>

                          </td>

                        </tr>

                      );
                    })

                  )}

                </tbody>

              </table>

            </div>

          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-[#efedf1]">

            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-[#efedf1] text-[#000f27] font-bold text-xs hover:bg-[#e3e2e5] transition-colors border border-[#c4c6cf]/40 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={
                rosterState.length === 0 ||
                isSaving ||
                isLoadingAttendance
              }
              className="px-6 py-2.5 rounded-xl bg-[#000f27] hover:bg-[#0b2447] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >

              <Save className="w-4 h-4" />

              {isSaving
                ? "Saving..."
                : "Save Attendance"}

            </button>

          </div>

        </div>

      </div>

    </div>
  );
};