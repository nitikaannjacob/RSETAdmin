import React from 'react';
import { AdminNotification } from '../types';
import { Award, Bus, Calendar, FileText, CheckCheck, X } from 'lucide-react';

interface NotificationsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AdminNotification[];
  onMarkAllAsRead: () => void;
  onSelectNotification: (notif: AdminNotification) => void;
}

export const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onSelectNotification
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'approval': return <Award className="w-4 h-4 text-[#0b2447]" />;
      case 'bus': return <Bus className="w-4 h-4 text-emerald-600" />;
      case 'attendance': return <Calendar className="w-4 h-4 text-[#b8860b]" />;
      default: return <FileText className="w-4 h-4 text-[#000f27]" />;
    }
  };

  return (
    <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#c4c6cf]/30 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      <div className="p-4 border-b border-[#efedf1] flex items-center justify-between bg-[#faf9fc]">
        <div className="flex items-center gap-2">
          <h4 className="font-bold text-sm text-[#000f27]">Notifications</h4>
          {unreadCount > 0 && (
            <span className="bg-[#000f27] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="text-[11px] font-medium text-[#0b2447] hover:underline flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Mark read
            </button>
          )}
          <button onClick={onClose} className="p-1 text-[#5c5f60] hover:text-[#000f27]">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-[#efedf1]">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#5c5f60]">No notifications at this time.</div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                onSelectNotification(n);
                onClose();
              }}
              className={`p-3.5 hover:bg-[#faf9fc] cursor-pointer transition-colors flex items-start gap-3 ${
                !n.read ? 'bg-[#d6e3ff]/15' : ''
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-[#efedf1] flex items-center justify-center shrink-0 mt-0.5">
                {getIcon(n.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-semibold text-xs text-[#000f27] truncate">{n.title}</span>
                  <span className="text-[10px] text-[#5c5f60] whitespace-nowrap">{n.timestamp}</span>
                </div>
                <p className="text-xs text-[#5c5f60] mt-0.5 line-clamp-2 leading-relaxed">{n.message}</p>
              </div>
              {!n.read && (
                <span className="w-2 h-2 rounded-full bg-[#000f27] shrink-0 mt-2"></span>
              )}
            </div>
          ))
        )}
      </div>

      <div className="p-2.5 text-center border-t border-[#efedf1] bg-[#faf9fc]">
        <span className="text-[11px] text-[#5c5f60]">Campus Connect Live Syncing</span>
      </div>
    </div>
  );
};
