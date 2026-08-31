import React, { useState } from 'react';
import { ActivityCertificate } from '../types';
import { X, ZoomIn, ZoomOut, RotateCw, CheckCircle, XCircle, Award, Calendar, Building2, User, ExternalLink, Download } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CertificateModalProps {
  certificate: ActivityCertificate | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string, points: number, note: string) => void;
  onReject: (id: string, note: string) => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  isOpen,
  onClose,
  onApprove,
  onReject
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [points, setPoints] = useState<number>(certificate?.awardedPoints || 10);
  const [note, setNote] = useState<string>(certificate?.facultyNote || '');

  if (!isOpen || !certificate) return null;

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const handleApproveClick = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    onApprove(certificate.id, points, note);
    onClose();
  };

  const handleRejectClick = () => {
    onReject(certificate.id, note);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000f27]/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-[#c4c6cf]/30 max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#efedf1] flex items-center justify-between bg-[#faf9fc]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0b2447] text-white flex items-center justify-center font-bold">
              {certificate.initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-[#000f27]">{certificate.activityName}</h3>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                  certificate.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                  certificate.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                  'bg-[#e1e3e4] text-[#191c1d]'
                }`}>
                  {certificate.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-[#5c5f60]">
                Submitted by <span className="font-semibold text-[#1b1b1e]">{certificate.studentName}</span> ({certificate.studentId}) • {certificate.category}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 text-[#5c5f60] hover:text-[#000f27] hover:bg-[#efedf1] rounded-lg transition-colors"
              title="Close viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
          {/* Certificate Preview Visual */}
          <div className="lg:col-span-8 bg-[#212527] relative flex flex-col items-center justify-center p-6 min-h-[360px] overflow-hidden">
            {/* Toolbar */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-[#000f27]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-white text-xs shadow-lg">
              <button 
                onClick={handleZoomOut}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="font-mono px-1 font-semibold">{Math.round(zoom * 100)}%</span>
              <button 
                onClick={handleZoomIn}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <div className="w-px h-4 bg-white/20 mx-1" />
              <button 
                onClick={handleRotate}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                title="Rotate Clockwise"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>

            {/* Document Render */}
            <div className="w-full h-full flex items-center justify-center overflow-auto p-4">
              <div 
                className="transition-transform duration-200 ease-out shadow-2xl rounded-lg overflow-hidden border-4 border-white/10 max-w-full"
                style={{ 
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transformOrigin: 'center center'
                }}
              >
                <img 
                  src={certificate.certificateImage} 
                  alt={certificate.activityName} 
                  className="max-h-[440px] w-auto object-contain block rounded"
                  onError={(e) => {
                    // Fallback visual certificate canvas if external image is restricted
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="bg-white p-6 text-center text-[#1b1b1e] border-t border-[#c4c6cf]/40">
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#0b2447] uppercase tracking-widest mb-1">
                    <Award className="w-4 h-4 text-[#0b2447]" />
                    Academic Certificate of Verification
                  </div>
                  <h4 className="text-xl font-bold font-serif text-[#000f27]">{certificate.activityName}</h4>
                  <p className="text-xs text-[#5c5f60] mt-1">Conferred upon <strong>{certificate.studentName}</strong> ({certificate.studentId})</p>
                  <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-[#5c5f60]">
                    <span>Category: <strong>{certificate.category}</strong></span>
                    <span>•</span>
                    <span>Date: <strong>{certificate.date}</strong></span>
                    <span>•</span>
                    <span>Issuing Body: <strong>{certificate.organization}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Sidebar */}
          <div className="lg:col-span-4 bg-[#ffffff] p-6 flex flex-col justify-between overflow-y-auto border-l border-[#efedf1]">
            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-bold text-[#5c5f60] uppercase tracking-wider mb-3">Verification Details</h4>
                <div className="bg-[#faf9fc] rounded-xl p-4 space-y-3 border border-[#efedf1]">
                  <div className="flex items-start gap-2.5">
                    <User className="w-4 h-4 text-[#0b2447] mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs text-[#5c5f60]">Student</div>
                      <div className="text-sm font-semibold text-[#1b1b1e]">{certificate.studentName}</div>
                      <div className="text-xs font-mono text-[#5c5f60]">{certificate.studentId}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Building2 className="w-4 h-4 text-[#0b2447] mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs text-[#5c5f60]">Issuing Body</div>
                      <div className="text-sm text-[#1b1b1e]">{certificate.organization}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Calendar className="w-4 h-4 text-[#0b2447] mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs text-[#5c5f60]">Event Date</div>
                      <div className="text-sm text-[#1b1b1e]">{certificate.date}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Award Points Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#5c5f60] uppercase tracking-wider">
                    Award Activity Points
                  </label>
                  <span className="text-xs font-semibold text-[#0b2447]">Max {certificate.maxPoints} pts</span>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="number"
                    min={0}
                    max={certificate.maxPoints}
                    value={points}
                    onChange={(e) => setPoints(Math.min(certificate.maxPoints, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#c4c6cf] bg-[#faf9fc] text-base font-bold text-[#000f27] focus:border-[#000f27] focus:ring-1 focus:ring-[#000f27] outline-none"
                  />
                  <div className="text-xs font-semibold text-[#5c5f60] whitespace-nowrap">Points</div>
                </div>
              </div>

              {/* Faculty Note */}
              <div>
                <label className="text-xs font-bold text-[#5c5f60] uppercase tracking-wider block mb-1.5">
                  Faculty Remarks / Endorsement
                </label>
                <textarea
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g., Verified authentic certificate. Points credited to semester co-curricular transcript..."
                  className="w-full px-4 py-2.5 rounded-lg border border-[#c4c6cf] bg-[#faf9fc] text-sm text-[#1b1b1e] focus:border-[#000f27] focus:ring-1 focus:ring-[#000f27] outline-none resize-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-[#efedf1] flex gap-3 mt-4">
              <button
                onClick={handleRejectClick}
                className="flex-1 py-2.5 px-4 rounded-lg border border-[#c4c6cf] text-[#ba1a1a] hover:bg-[#ffdad6]/40 font-semibold text-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>
              <button
                onClick={handleApproveClick}
                className="flex-1 py-2.5 px-4 rounded-lg bg-[#000f27] hover:bg-[#0b2447] text-white font-semibold text-sm shadow-md transition-colors flex items-center justify-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                Approve & Credit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
