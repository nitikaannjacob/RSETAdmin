import React, { useState } from 'react';
import { X, FileSpreadsheet, FileText, CheckCircle2, Download, Printer, Filter, Calendar } from 'lucide-react';
import { ActivityCertificate, StudentRosterItem, SubjectItem, BusRouteInfo, StudentMarks } from '../types';

interface ReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificates: ActivityCertificate[];
  roster: StudentRosterItem[];
  subjects: SubjectItem[];
  busRoutes: BusRouteInfo[];
  marks: StudentMarks[];
}

export const ReportsModal: React.FC<ReportsModalProps> = ({
  isOpen,
  onClose,
  certificates,
  roster,
  subjects,
  busRoutes,
  marks
}) => {
  const [reportType, setReportType] = useState<'attendance' | 'approvals' | 'bus' | 'marks'>('attendance');
  const [dateRange, setDateRange] = useState<string>('current-term');
  const [format, setFormat] = useState<'csv' | 'pdf'>('csv');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  if (!isOpen) return null;

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      let filename = `Campus_Connect_${reportType}_report_${new Date().toISOString().slice(0, 10)}.csv`;
      let content = '';

      if (reportType === 'attendance') {
        content = 'Student ID,Name,Status,Attendance Rate\n' + 
          roster.map(r => `${r.rollNo},"${r.name}",${r.status === 'P' ? 'Present' : 'Absent'},${r.attendanceRate}%`).join('\n');
      } else if (reportType === 'approvals') {
        content = 'Student ID,Student Name,Activity,Category,Status,Awarded Points,Date\n' + 
          certificates.map(c => `${c.studentId},"${c.studentName}","${c.activityName}",${c.category},${c.status},${c.awardedPoints},${c.date}`).join('\n');
      } else if (reportType === 'bus') {
        content = 'Route Number,Route Name,Pass Number,Status,Morning Pickup,Evening Departure,Driver Name,Contact\n' + 
          busRoutes.map(b => `"${b.routeNumber}","${b.routeName}",${b.passNumber},${b.status},"${b.morningPickup.time} (${b.morningPickup.location})","${b.eveningDeparture.time} (${b.eveningDeparture.location})","${b.driver.name}",${b.driver.phone}`).join('\n');
      } else {
        content = 'Student ID,Student Name,Course Code,Course Name,First Internal (20),Second Internal (20),Assignments (10),Total (50),Remarks\n' + 
          marks.map(m => `${m.rollNo},"${m.studentName}",${m.courseCode},"${m.courseName}",${m.firstInternal},${m.secondInternal},${m.assignments},${m.firstInternal + m.secondInternal + m.assignments},"${m.remarks}"`).join('\n');
      }

      // Download file in browser
      const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSuccessMessage(`Successfully generated and downloaded ${filename}`);
      setTimeout(() => setSuccessMessage(''), 4000);
    }, 600);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000f27]/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-[#c4c6cf]/30 max-w-2xl w-full flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#efedf1] flex items-center justify-between bg-[#faf9fc]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#000f27] text-white flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#000f27]">Campus Report Generator</h3>
              <p className="text-xs text-[#5c5f60]">Export administrative analytics, student records & logs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#5c5f60] hover:text-[#000f27] hover:bg-[#efedf1] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          {successMessage && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Module Select */}
          <div>
            <label className="text-xs font-bold text-[#5c5f60] uppercase tracking-wider block mb-2">
              Select Module Report
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'attendance', label: 'Attendance', count: `${roster.length} students` },
                { id: 'approvals', label: 'Activity Credits', count: `${certificates.length} items` },
                { id: 'bus', label: 'Bus Transit', count: `${busRoutes.length} routes` },
                { id: 'marks', label: 'Academic Marks', count: `${marks.length} evaluations` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setReportType(tab.id as any)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    reportType === tab.id
                      ? 'border-[#000f27] bg-[#0b2447] text-white shadow-sm'
                      : 'border-[#efedf1] bg-[#faf9fc] text-[#1b1b1e] hover:bg-[#efedf1]'
                  }`}
                >
                  <div className="font-semibold text-xs">{tab.label}</div>
                  <div className={`text-[11px] mt-0.5 ${reportType === tab.id ? 'text-[#d6e3ff]' : 'text-[#5c5f60]'}`}>
                    {tab.count}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Period Filter */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#5c5f60] uppercase tracking-wider block mb-1.5">
                Timeframe / Cohort
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#c4c6cf] bg-[#faf9fc] text-sm text-[#1b1b1e] focus:border-[#000f27] focus:ring-1 focus:ring-[#000f27] outline-none"
              >
                <option value="current-term">Current Term (Fall 2024)</option>
                <option value="last-30">Past 30 Days</option>
                <option value="academic-year">Full Academic Year 2024-25</option>
                <option value="custom">Custom Date Range</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#5c5f60] uppercase tracking-wider block mb-1.5">
                Output Format
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormat('csv')}
                  className={`py-2.5 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    format === 'csv'
                      ? 'border-[#000f27] bg-[#000f27] text-white'
                      : 'border-[#c4c6cf] bg-white text-[#5c5f60] hover:bg-[#faf9fc]'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4" /> CSV / Excel
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('pdf')}
                  className={`py-2.5 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    format === 'pdf'
                      ? 'border-[#000f27] bg-[#000f27] text-white'
                      : 'border-[#c4c6cf] bg-white text-[#5c5f60] hover:bg-[#faf9fc]'
                  }`}
                >
                  <FileText className="w-4 h-4" /> Printable Sheet
                </button>
              </div>
            </div>
          </div>

          {/* Preview Box */}
          <div className="bg-[#faf9fc] rounded-xl p-4 border border-[#efedf1]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#000f27]">Report Contents Summary</span>
              <span className="text-[11px] text-[#5c5f60]">Prepared for Campus Administration</span>
            </div>
            <div className="text-xs text-[#5c5f60] space-y-1">
              {reportType === 'attendance' && (
                <p>• Includes {roster.length} student daily check-in statuses, attendance %, and subject threshold alerts.</p>
              )}
              {reportType === 'approvals' && (
                <p>• Includes verified certificates, category allocations (Clubs, Cultural, Tech), and accredited points.</p>
              )}
              {reportType === 'bus' && (
                <p>• Includes route timetables, stop sequences, driver credentials, and active telematics passes.</p>
              )}
              {reportType === 'marks' && (
                <p>• Includes internal marks (1st & 2nd assessments, assignments out of 50 total), faculty notes, and grade thresholds.</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#efedf1] bg-[#faf9fc] flex items-center justify-between">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-lg border border-[#c4c6cf] text-[#5c5f60] hover:text-[#000f27] hover:bg-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" /> Print View
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-[#c4c6cf] text-[#1b1b1e] hover:bg-white text-xs font-semibold transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="px-6 py-2.5 rounded-lg bg-[#000f27] hover:bg-[#0b2447] text-white text-xs font-bold shadow-md transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              {isExporting ? 'Generating...' : `Export ${format.toUpperCase()}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
