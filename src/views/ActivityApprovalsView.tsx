import React, { useState } from 'react';
import { ActivityCertificate, ApprovalStatus, ActivityCategory } from '../types';
import { 
  Filter, 
  ChevronRight, 
  BadgeCheck, 
  ExternalLink, 
  ZoomIn, 
  ChevronUp, 
  ChevronDown, 
  CheckCircle2, 
  XCircle, 
  MoreVertical,
  IdCard,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ActivityApprovalsViewProps {
  certificates: ActivityCertificate[];
  searchQuery: string;
  onApprove: (id: string, points: number, note: string) => void;
  onReject: (id: string, note: string) => void;
  onOpenViewer: (certificate: ActivityCertificate) => void;
}

export const ActivityApprovalsView: React.FC<ActivityApprovalsViewProps> = ({
  certificates,
  searchQuery,
  onApprove,
  onReject,
  onOpenViewer
}) => {
  const [selectedStatusTab, setSelectedStatusTab] = useState<ApprovalStatus>('pending');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState<boolean>(false);
  const [selectedCertId, setSelectedCertId] = useState<string>(certificates[0]?.id || '');
  const [awardPoints, setAwardPoints] = useState<number>(10);
  const [facultyNote, setFacultyNote] = useState<string>('');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Filter certificates based on status tab, category, and search query
  const filteredCertificates = certificates.filter(cert => {
    const matchesStatus = cert.status === selectedStatusTab;
    const matchesCategory = selectedCategoryId === 'all' || cert.category === selectedCategoryId;
    const matchesSearch = searchQuery === '' || 
      cert.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.activityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesCategory && matchesSearch;
  });

  const pendingCount = certificates.filter(c => c.status === 'pending').length;
  const approvedCount = certificates.filter(c => c.status === 'approved').length;
  const rejectedCount = certificates.filter(c => c.status === 'rejected').length;

  // Selected certificate for detail panel
  const selectedCertificate = certificates.find(c => c.id === selectedCertId) || filteredCertificates[0] || certificates[0];

  const handleSelectCertificate = (cert: ActivityCertificate) => {
    setSelectedCertId(cert.id);
    setAwardPoints(cert.awardedPoints || 10);
    setFacultyNote(cert.facultyNote || '');
  };

  const handleApprove = () => {
    if (!selectedCertificate) return;
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 }
    });
    onApprove(selectedCertificate.id, awardPoints, facultyNote);
    setActionFeedback(`Approved ${selectedCertificate.studentName}'s certificate with ${awardPoints} points!`);
    setTimeout(() => setActionFeedback(null), 3500);
  };

  const handleReject = () => {
    if (!selectedCertificate) return;
    onReject(selectedCertificate.id, facultyNote);
    setActionFeedback(`Rejected submission for ${selectedCertificate.studentName}.`);
    setTimeout(() => setActionFeedback(null), 3500);
  };

  return (
    <div className="p-4 md:p-8 flex-1 max-w-7xl mx-auto w-full">
      {/* Toast Notification */}
      {actionFeedback && (
        <div className="mb-4 p-3 bg-[#000f27] text-white text-xs font-semibold rounded-xl shadow-lg flex items-center justify-between animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{actionFeedback}</span>
          </div>
          <button onClick={() => setActionFeedback(null)} className="text-white/70 hover:text-white text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Bento Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Main List View (Left Column - 8 Cols) */}
        <div className="xl:col-span-8 bg-[#ffffff] rounded-2xl shadow-sm border border-[#c4c6cf]/30 overflow-hidden flex flex-col min-h-[620px]">
          {/* Table Header Controls */}
          <div className="px-6 py-4 border-b border-[#efedf1] flex flex-wrap justify-between items-center bg-[#faf9fc]/70 gap-3">
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedStatusTab('pending')}
                className={`px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                  selectedStatusTab === 'pending'
                    ? 'bg-[#000f27] text-white shadow-sm'
                    : 'text-[#5c5f60] hover:bg-[#efedf1] hover:text-[#000f27]'
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                onClick={() => setSelectedStatusTab('approved')}
                className={`px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                  selectedStatusTab === 'approved'
                    ? 'bg-[#000f27] text-white shadow-sm'
                    : 'text-[#5c5f60] hover:bg-[#efedf1] hover:text-[#000f27]'
                }`}
              >
                Approved ({approvedCount})
              </button>
              <button
                onClick={() => setSelectedStatusTab('rejected')}
                className={`px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                  selectedStatusTab === 'rejected'
                    ? 'bg-[#000f27] text-white shadow-sm'
                    : 'text-[#5c5f60] hover:bg-[#efedf1] hover:text-[#000f27]'
                }`}
              >
                Rejected ({rejectedCount})
              </button>
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#c4c6cf] text-[#5c5f60] hover:text-[#000f27] hover:bg-white text-xs font-semibold transition-colors"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>{selectedCategoryId === 'all' ? 'Filter Category' : selectedCategoryId}</span>
              </button>

              {isFilterMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-[#c4c6cf]/40 py-2 z-20 animate-in fade-in duration-100">
                  <div className="px-3 py-1 text-[11px] font-bold text-[#5c5f60] uppercase tracking-wider">
                    Categories
                  </div>
                  {['all', 'Clubs & Societies', 'Technical', 'Cultural', 'Sports', 'Leadership'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategoryId(cat);
                        setIsFilterMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-[#faf9fc] flex items-center justify-between ${
                        selectedCategoryId === cat ? 'text-[#000f27] font-bold bg-[#efedf1]/50' : 'text-[#5c5f60]'
                      }`}
                    >
                      <span>{cat === 'all' ? 'All Categories' : cat}</span>
                      {selectedCategoryId === cat && <span className="w-1.5 h-1.5 rounded-full bg-[#000f27]"></span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Scrollable Submissions List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredCertificates.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-[#5c5f60]">
                <BadgeCheck className="w-10 h-10 text-[#c4c6cf] mb-2" />
                <p className="font-semibold text-sm text-[#000f27]">No submissions found</p>
                <p className="text-xs mt-1">There are no {selectedStatusTab} activity submissions matching your criteria.</p>
              </div>
            ) : (
              filteredCertificates.map((cert) => {
                const isSelected = selectedCertificate?.id === cert.id;
                return (
                  <div
                    key={cert.id}
                    onClick={() => handleSelectCertificate(cert)}
                    className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-150 ${
                      isSelected
                        ? 'border-2 border-[#000f27] bg-[#d6e3ff]/20 shadow-sm'
                        : 'border border-[#c4c6cf]/30 bg-white hover:border-[#000f27]/40 hover:bg-[#faf9fc]'
                    }`}
                  >
                    {/* Left: Avatar & Names */}
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${cert.avatarBg}`}>
                        {cert.initials}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#1b1b1e] text-sm leading-tight">{cert.studentName}</h4>
                        <p className="text-xs text-[#5c5f60] mt-0.5">{cert.activityName}</p>
                      </div>
                    </div>

                    {/* Middle: Category & Date */}
                    <div className="hidden md:flex flex-col gap-0.5 items-end">
                      <span className="text-xs font-semibold text-[#5c5f60]">{cert.category}</span>
                      <span className="text-[11px] text-[#5c5f60]">{cert.date}</span>
                    </div>

                    {/* Right: Status Pill & Arrow */}
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                        cert.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                        cert.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                        'bg-[#e1e3e4] text-[#1b1b1e]'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          cert.status === 'approved' ? 'bg-emerald-600' :
                          cert.status === 'rejected' ? 'bg-rose-600' :
                          'bg-[#5c5f60]'
                        }`} />
                        {cert.status === 'pending' ? 'Pending' : cert.status === 'approved' ? 'Approved' : 'Rejected'}
                      </span>
                      <ChevronRight className={`w-5 h-5 ${isSelected ? 'text-[#000f27]' : 'text-[#c4c6cf]'}`} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Detail Panel (Right Column - 4 Cols) */}
        {selectedCertificate ? (
          <div className="xl:col-span-4 bg-white rounded-2xl shadow-md border border-[#c4c6cf]/30 flex flex-col min-h-[620px] relative overflow-hidden">
            {/* Decorative Top Accent Banner */}
            <div className="absolute top-0 left-0 w-full h-28 bg-[#0b2447]/10" />

            {/* Profile Header */}
            <div className="relative px-6 pt-6 pb-4 border-b border-[#efedf1] z-10">
              <div className="flex justify-between items-start mb-3">
                <div className="w-16 h-16 rounded-2xl bg-[#e1e3e4] flex items-center justify-center text-[#191c1d] font-bold text-xl shadow-sm border-2 border-white">
                  {selectedCertificate.initials}
                </div>
                <button
                  onClick={() => alert(`Options for student ${selectedCertificate.studentName}: Activity transcript and history synced.`)}
                  className="text-[#5c5f60] hover:text-[#000f27] bg-white rounded-full p-1.5 shadow-sm border border-[#efedf1]"
                  title="More actions"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              <h3 className="font-bold text-lg text-[#000f27]">{selectedCertificate.studentName}</h3>
              <p className="text-xs text-[#5c5f60] flex items-center gap-1 mt-0.5">
                <IdCard className="w-3.5 h-3.5 text-[#5c5f60]" />
                <span className="font-mono">{selectedCertificate.studentId}</span>
              </p>
            </div>

            {/* Scrollable Body Info */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Activity Info */}
              <div className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-bold text-[#5c5f60] uppercase tracking-wider block mb-1">
                    Activity Name
                  </label>
                  <p className="text-[#1b1b1e] font-semibold text-sm">{selectedCertificate.activityName}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-[#5c5f60] uppercase tracking-wider block mb-1">
                      Category
                    </label>
                    <p className="text-[#1b1b1e] text-xs font-medium">{selectedCertificate.category}</p>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#5c5f60] uppercase tracking-wider block mb-1">
                      Date
                    </label>
                    <p className="text-[#1b1b1e] text-xs font-medium">{selectedCertificate.date}</p>
                  </div>
                </div>
              </div>

              {/* Certificate Document Thumbnail Preview */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[11px] font-bold text-[#5c5f60] uppercase tracking-wider block">
                    Certificate Document
                  </label>
                  <button
                    onClick={() => onOpenViewer(selectedCertificate)}
                    className="text-[#000f27] hover:text-[#0b2447] text-xs font-bold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <ExternalLink className="w-3 h-3" /> View Full
                  </button>
                </div>

                <div
                  onClick={() => onOpenViewer(selectedCertificate)}
                  className="rounded-xl border border-[#c4c6cf]/40 overflow-hidden bg-[#faf9fc] relative group cursor-pointer h-36 flex items-center justify-center"
                >
                  <img
                    src={selectedCertificate.certificateImage}
                    alt={selectedCertificate.activityName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                  />
                  <div className="absolute inset-0 bg-[#000f27]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                    <div className="bg-white text-[#000f27] p-2 rounded-full shadow-lg flex items-center gap-1 text-xs font-bold px-3">
                      <ZoomIn className="w-4 h-4" /> Inspect Document
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Inputs */}
              <div className="space-y-4 pt-3 border-t border-[#efedf1]">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-[#5c5f60] uppercase tracking-wider">
                      Award Points
                    </label>
                    <span className="text-[11px] text-[#5c5f60]">Max {selectedCertificate.maxPoints} pts</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={selectedCertificate.maxPoints}
                      value={awardPoints}
                      onChange={(e) => setAwardPoints(Math.min(selectedCertificate.maxPoints, Math.max(0, parseInt(e.target.value) || 0)))}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#c4c6cf] bg-white font-bold text-base text-[#000f27] focus:border-[#000f27] focus:ring-1 focus:ring-[#000f27] outline-none"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col">
                      <button
                        type="button"
                        onClick={() => setAwardPoints(prev => Math.min(selectedCertificate.maxPoints, prev + 1))}
                        className="text-[#5c5f60] hover:text-[#000f27] p-0.5"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setAwardPoints(prev => Math.max(0, prev - 1))}
                        className="text-[#5c5f60] hover:text-[#000f27] p-0.5"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5c5f60] uppercase tracking-wider block mb-1">
                    Faculty Note (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={facultyNote}
                    onChange={(e) => setFacultyNote(e.target.value)}
                    placeholder="Add comments for the student..."
                    className="w-full px-3.5 py-2 rounded-xl border border-[#c4c6cf] bg-white text-xs text-[#1b1b1e] placeholder-[#74777f] focus:border-[#000f27] focus:ring-1 focus:ring-[#000f27] outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="p-4 border-t border-[#efedf1] bg-white flex gap-3">
              <button
                onClick={handleReject}
                className="flex-1 py-2.5 px-3 rounded-xl border border-[#c4c6cf] text-[#1b1b1e] hover:bg-[#ffdad6]/40 hover:text-[#ba1a1a] hover:border-[#ffdad6] font-bold text-xs transition-colors"
              >
                Reject
              </button>
              <button
                onClick={handleApprove}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#000f27] hover:bg-[#0b2447] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                Approve
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
