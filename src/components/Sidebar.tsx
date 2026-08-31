import React from 'react';
import { NavigationTab } from '../types';
import { 
  Award, 
  Calendar, 
  Bus, 
  Star, 
  FileSpreadsheet, 
  HelpCircle, 
  LogOut, 
  GraduationCap,
  X
} from 'lucide-react';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenReports: () => void;
  onOpenSupport: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenReports,
  onOpenSupport,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const navItems: { id: NavigationTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'approvals', label: 'Activity Approvals', icon: Award },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'bus', label: 'Bus Tracking', icon: Bus },
    { id: 'marks', label: 'Marks Entry', icon: Star },
  ];

  const handleTabClick = (tabId: NavigationTab) => {
    onSelectTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  const content = (
    <div className="flex flex-col h-full bg-[#ffffff] border-r border-[#c4c6cf]/30 w-[280px] select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#efedf1] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#000f27] text-white flex items-center justify-center font-bold text-sm shadow-sm">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base text-[#000f27] leading-tight tracking-tight">Campus Connect</h1>
            <p className="text-xs text-[#5c5f60] font-medium">Admin Dashboard</p>
          </div>
        </div>
        {isMobileOpen && (
          <button 
            onClick={onCloseMobile} 
            className="md:hidden p-1.5 rounded-lg text-[#5c5f60] hover:bg-[#efedf1]"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Navigation Items */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 text-left ${
                isActive
                  ? 'bg-[#000f27] text-white shadow-[0px_2px_8px_rgba(0,15,39,0.2)]'
                  : 'text-[#5c5f60] hover:text-[#000f27] hover:bg-[#efedf1]/80'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-[#5c5f60]'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Action / Footer Section */}
      <div className="p-4 border-t border-[#efedf1] space-y-3 bg-[#faf9fc]">
        <button
          onClick={onOpenReports}
          className="w-full bg-[#efedf1] hover:bg-[#e3e2e5] text-[#000f27] font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <FileSpreadsheet className="w-4 h-4 text-[#000f27]" />
          <span>Generate Reports</span>
        </button>

        <div className="space-y-1 pt-1">
          <button
            onClick={onOpenSupport}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-semibold text-[#5c5f60] hover:text-[#000f27] hover:bg-[#efedf1] transition-colors text-left"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Support</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to log out of Campus Connect Admin?')) {
                window.location.reload();
              }
            }}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-semibold text-[#5c5f60] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full z-40">
        {content}
      </nav>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-[#000f27]/60 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 w-[280px] h-full shadow-2xl animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
