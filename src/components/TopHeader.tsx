import React from 'react';
import { Menu, Search, Bell, Settings } from 'lucide-react';
import { NavigationTab, AdminNotification } from '../types';

interface TopHeaderProps {
  currentTab: NavigationTab;
  onOpenMobileMenu: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  notifications: AdminNotification[];
  isNotificationsOpen: boolean;
  onToggleNotifications: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentTab,
  onOpenMobileMenu,
  searchQuery,
  onSearchChange,
  notifications,
  isNotificationsOpen,
  onToggleNotifications
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  const getPageInfo = () => {
    switch (currentTab) {
      case 'approvals':
        return {
          title: 'Activity Approvals',
          subtitle: 'Review and approve student activity certificates.'
        };
      case 'attendance':
        return {
          title: 'Campus Connect Admin',
          subtitle: 'Record and track academic attendance.'
        };
      case 'bus':
        return {
          title: 'Campus Connect Admin',
          subtitle: 'Live campus transit telematics and stop dispatch.'
        };
      case 'marks':
        return {
          title: 'Campus Connect Admin',
          subtitle: 'Record and review student academic performance.'
        };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-8 py-3.5 bg-white/95 backdrop-blur-md border-b border-[#efedf1] shadow-sm">
      {/* Left: Mobile Hamburger + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-lg text-[#000f27] hover:bg-[#efedf1] transition-colors"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <h2 className="text-base md:text-lg font-bold text-[#000f27] leading-tight">{pageInfo.title}</h2>
          {currentTab === 'approvals' && (
            <p className="text-xs text-[#5c5f60] font-normal">{pageInfo.subtitle}</p>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#5c5f60] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              currentTab === 'approvals' ? 'Search students...' :
              currentTab === 'attendance' ? 'Search student name or ID...' :
              currentTab === 'marks' ? 'Search student ID or name...' :
              'Search routes...'
            }
            className="pl-9 pr-4 py-2 rounded-full border border-[#c4c6cf] bg-[#faf9fc] text-xs md:text-sm text-[#1b1b1e] placeholder-[#74777f] focus:outline-none focus:border-[#000f27] focus:ring-1 focus:ring-[#000f27] w-44 sm:w-60 md:w-64 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#5c5f60] hover:text-[#000f27]"
            >
              ×
            </button>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={onToggleNotifications}
            className="p-2 text-[#5c5f60] hover:text-[#000f27] hover:bg-[#efedf1] rounded-full transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#ba1a1a] rounded-full ring-2 ring-white"></span>
            )}
          </button>
        </div>

        {/* Settings */}
        <button
          onClick={() => alert('Campus System Settings: All services operating normally with synced offline cache.')}
          className="hidden sm:flex p-2 text-[#5c5f60] hover:text-[#000f27] hover:bg-[#efedf1] rounded-full transition-colors"
          title="System Settings"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* Admin Profile */}
        <div className="flex items-center gap-3 pl-2 md:pl-4 border-l border-[#efedf1]">
          <div className="hidden lg:block text-right">
            <div className="text-xs font-bold text-[#000f27]">Admin Profile</div>
            <div className="text-[11px] text-[#5c5f60]">Administrator</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#000f27] text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-[#efedf1]">
            A
          </div>
        </div>
      </div>
    </header>
  );
};
