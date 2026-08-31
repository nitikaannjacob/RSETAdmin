import React from 'react';
import { X, HelpCircle, BookOpen, ShieldCheck, Mail, Phone, ExternalLink } from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000f27]/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-[#c4c6cf]/30 max-w-lg w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-[#efedf1] flex items-center justify-between bg-[#faf9fc]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0b2447] text-white flex items-center justify-center font-bold">
              <HelpCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#000f27]">Admin Support & Helpdesk</h3>
              <p className="text-xs text-[#5c5f60]">Campus Connect Administrator Guide</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#5c5f60] hover:text-[#000f27] hover:bg-[#efedf1] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-[#faf9fc] rounded-xl p-4 border border-[#efedf1] space-y-3">
            <h4 className="text-xs font-bold text-[#000f27] uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#0b2447]" /> Quick Operations Reference
            </h4>
            <ul className="text-xs text-[#5c5f60] space-y-2">
              <li>• <strong>Activity Approvals:</strong> Click any student submission in the pending list to review the high-res certificate, adjust awarded points, add faculty notes, and approve/reject.</li>
              <li>• <strong>Attendance:</strong> Mark students Present (P) or Absent (A), or use bulk actions. Overall progress calculates automatically in real-time.</li>
              <li>• <strong>Bus Tracking:</strong> Use manual override controls to push real-time stop updates and live ETA adjustments to the student mobile app.</li>
              <li>• <strong>Marks Entry:</strong> Search for any student, choose the course, adjust first/second internals and assignment scores to immediately compute total marks and Pass/Fail status.</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-[#faf9fc] rounded-xl border border-[#efedf1]">
              <div className="text-xs font-semibold text-[#000f27] flex items-center gap-1.5 mb-1">
                <Mail className="w-3.5 h-3.5 text-[#0b2447]" /> Campus IT Desk
              </div>
              <p className="text-xs text-[#5c5f60]">support@campusconnect.edu</p>
            </div>

            <div className="p-3 bg-[#faf9fc] rounded-xl border border-[#efedf1]">
              <div className="text-xs font-semibold text-[#000f27] flex items-center gap-1.5 mb-1">
                <Phone className="w-3.5 h-3.5 text-[#0b2447]" /> Admin Hotline
              </div>
              <p className="text-xs text-[#5c5f60]">+1 (800) 555-RSET (ext 402)</p>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-[#efedf1] bg-[#faf9fc] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#000f27] hover:bg-[#0b2447] text-white text-xs font-bold transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
