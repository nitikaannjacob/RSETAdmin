import React, { useState } from 'react';
import { NavigationTab, ActivityCertificate, StudentRosterItem, SubjectItem, BusRouteInfo, StudentMarks, AdminNotification } from './types';
import { 
  INITIAL_CERTIFICATES, 
  INITIAL_STUDENTS_ROSTER, 
  INITIAL_SUBJECTS, 
  INITIAL_BUS_ROUTES, 
  INITIAL_STUDENT_MARKS, 
  INITIAL_NOTIFICATIONS 
} from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { NotificationsPopover } from './components/NotificationsPopover';
import { CertificateModal } from './components/CertificateModal';
import { ReportsModal } from './components/ReportsModal';
import { SupportModal } from './components/SupportModal';
import { ActivityApprovalsView } from './views/ActivityApprovalsView';
import { AttendanceView } from './views/AttendanceView';
import { BusTrackingView } from './views/BusTrackingView';
import { MarksEntryView } from './views/MarksEntryView';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('approvals');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Core App State
  const [certificates, setCertificates] = useState<ActivityCertificate[]>(INITIAL_CERTIFICATES);
  const [roster, setRoster] = useState<StudentRosterItem[]>(INITIAL_STUDENTS_ROSTER);
  const [subjects, setSubjects] = useState<SubjectItem[]>(INITIAL_SUBJECTS);
  const [busRoutes, setBusRoutes] = useState<BusRouteInfo[]>(INITIAL_BUS_ROUTES);
  const [marksList, setMarksList] = useState<StudentMarks[]>(INITIAL_STUDENT_MARKS);
  const [notifications, setNotifications] = useState<AdminNotification[]>(INITIAL_NOTIFICATIONS);

  // Modals and Drawers
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isReportsOpen, setIsReportsOpen] = useState<boolean>(false);
  const [isSupportOpen, setIsSupportOpen] = useState<boolean>(false);
  const [viewerCertificate, setViewerCertificate] = useState<ActivityCertificate | null>(null);

  // Activity Approvals Handlers
  const handleApproveCertificate = (id: string, points: number, note: string) => {
    setCertificates(prev => prev.map(cert => {
      if (cert.id === id) {
        return {
          ...cert,
          status: 'approved',
          awardedPoints: points,
          facultyNote: note,
          verifiedBy: 'Administrator'
        };
      }
      return cert;
    }));

    // Add activity log notification
    const cert = certificates.find(c => c.id === id);
    if (cert) {
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          title: 'Certificate Endorsed',
          message: `Approved ${cert.activityName} for ${cert.studentName} (+${points} pts).`,
          timestamp: 'Just now',
          type: 'approval',
          read: false
        },
        ...prev
      ]);
    }
  };

  const handleRejectCertificate = (id: string, note: string) => {
    setCertificates(prev => prev.map(cert => {
      if (cert.id === id) {
        return {
          ...cert,
          status: 'rejected',
          facultyNote: note,
          verifiedBy: 'Administrator'
        };
      }
      return cert;
    }));
  };

  // Attendance Handlers
  const handleUpdateRoster = (updatedRoster: StudentRosterItem[]) => {
    setRoster(updatedRoster);
  };

  // Bus Tracking Handlers
  const handleUpdateRoute = (updatedRoute: BusRouteInfo) => {
    setBusRoutes(prev => prev.map(r => r.id === updatedRoute.id ? updatedRoute : r));
  };

  // Marks Entry Handlers
  const handleSaveMarks = (updatedRecord: StudentMarks) => {
    setMarksList(prev => {
      const idx = prev.findIndex(m => m.studentId === updatedRecord.studentId && m.courseCode === updatedRecord.courseCode);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updatedRecord;
        return next;
      }
      return [updatedRecord, ...prev];
    });
  };

  // Notification Handlers
  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleSelectNotification = (notif: AdminNotification) => {
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    if (notif.type === 'approval') setCurrentTab('approvals');
    else if (notif.type === 'bus') setCurrentTab('bus');
    else if (notif.type === 'attendance') setCurrentTab('attendance');
    else if (notif.type === 'marks') setCurrentTab('marks');
  };

  return (
    <div className="min-h-screen bg-[#faf9fc] text-[#1b1b1e] flex flex-col md:flex-row antialiased selection:bg-[#000f27] selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenReports={() => setIsReportsOpen(true)}
        onOpenSupport={() => setIsSupportOpen(true)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main App Content Area */}
      <div className="flex-1 md:ml-[280px] flex flex-col min-h-screen relative overflow-x-hidden">
        {/* Sticky Header */}
        <TopHeader
          currentTab={currentTab}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          notifications={notifications}
          isNotificationsOpen={isNotificationsOpen}
          onToggleNotifications={() => setIsNotificationsOpen(!isNotificationsOpen)}
        />

        {/* Notifications Popover */}
        {isNotificationsOpen && (
          <div className="relative max-w-7xl mx-auto w-full px-4 md:px-8">
            <NotificationsPopover
              isOpen={isNotificationsOpen}
              onClose={() => setIsNotificationsOpen(false)}
              notifications={notifications}
              onMarkAllAsRead={handleMarkAllNotificationsRead}
              onSelectNotification={handleSelectNotification}
            />
          </div>
        )}

        {/* Dynamic Main Views */}
        <main className="flex-1 flex flex-col">
          {currentTab === 'approvals' && (
            <ActivityApprovalsView
              certificates={certificates}
              searchQuery={searchQuery}
              onApprove={handleApproveCertificate}
              onReject={handleRejectCertificate}
              onOpenViewer={(cert) => setViewerCertificate(cert)}
            />
          )}

          {currentTab === 'attendance' && (
            <AttendanceView
              roster={roster}
              subjects={subjects}
              searchQuery={searchQuery}
              onUpdateRoster={handleUpdateRoster}
            />
          )}

          {currentTab === 'bus' && (
            <BusTrackingView
              busRoutes={busRoutes}
              onUpdateRoute={handleUpdateRoute}
            />
          )}

          {currentTab === 'marks' && (
            <MarksEntryView
              marksList={marksList}
              subjects={subjects}
              students={roster}
              searchQuery={searchQuery}
              onSaveMarks={handleSaveMarks}
            />
          )}
        </main>
      </div>

      {/* Certificate Viewer Modal */}
      <CertificateModal
        certificate={viewerCertificate}
        isOpen={Boolean(viewerCertificate)}
        onClose={() => setViewerCertificate(null)}
        onApprove={handleApproveCertificate}
        onReject={handleRejectCertificate}
      />

      {/* Reports Generator Modal */}
      <ReportsModal
        isOpen={isReportsOpen}
        onClose={() => setIsReportsOpen(false)}
        certificates={certificates}
        roster={roster}
        subjects={subjects}
        busRoutes={busRoutes}
        marks={marksList}
      />

      {/* Support / Quick Help Modal */}
      <SupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />
    </div>
  );
}
