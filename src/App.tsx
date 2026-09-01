import React, { useState, useEffect } from 'react';

import {
  NavigationTab,
  ActivityCertificate,
  StudentRosterItem,
  SubjectItem,
  BusRouteInfo,
  StudentMarks,
  AdminNotification
} from './types';

import {
  INITIAL_CERTIFICATES,
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
  const [currentTab, setCurrentTab] =
    useState<NavigationTab>('approvals');

  const [searchQuery, setSearchQuery] =
    useState('');

  const [certificates, setCertificates] =
    useState<ActivityCertificate[]>(INITIAL_CERTIFICATES);

  const [roster, setRoster] =
    useState<StudentRosterItem[]>([]);

  const [subjects, setSubjects] =
    useState<SubjectItem[]>(INITIAL_SUBJECTS);

  const [busRoutes, setBusRoutes] =
    useState<BusRouteInfo[]>(INITIAL_BUS_ROUTES);

  const [marksList, setMarksList] =
    useState<StudentMarks[]>(INITIAL_STUDENT_MARKS);

  const [notifications, setNotifications] =
    useState<AdminNotification[]>(INITIAL_NOTIFICATIONS);

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] =
    useState(false);

  const [isNotificationsOpen, setIsNotificationsOpen] =
    useState(false);

  const [isReportsOpen, setIsReportsOpen] =
    useState(false);

  const [isSupportOpen, setIsSupportOpen] =
    useState(false);

  const [viewerCertificate, setViewerCertificate] =
    useState<ActivityCertificate | null>(null);

  // =====================================================
  // LOAD STUDENTS FROM MONGODB
  // =====================================================

  useEffect(() => {
    const loadStudents = async () => {
      try {
        console.log('Loading students from MongoDB...');

        const response = await fetch(
          'http://localhost:5000/api/students'
        );

        if (!response.ok) {
          throw new Error(
            `HTTP error: ${response.status}`
          );
        }

        const data = await response.json();

        console.log(
          'Students received from MongoDB:',
          data
        );

        if (Array.isArray(data)) {
          setRoster(data);
        } else {
          console.error(
            'Expected an array of students but received:',
            data
          );
          setRoster([]);
        }
      } catch (error) {
        console.error(
          'Failed to load students from MongoDB:',
          error
        );

        setRoster([]);
      }
    };

    loadStudents();
  }, []);

  // =====================================================
  // TEST BACKEND CONNECTION
  // =====================================================

  useEffect(() => {
    const testBackend = async () => {
      try {
        const response = await fetch(
          'http://localhost:5000/api/test'
        );

        if (!response.ok) {
          throw new Error(
            `Backend test failed: ${response.status}`
          );
        }

        const data = await response.json();

        console.log(
          'Backend test:',
          data
        );
      } catch (error) {
        console.error(
          'Backend connection failed:',
          error
        );
      }
    };

    testBackend();
  }, []);

  // =====================================================
  // CERTIFICATE HANDLERS
  // =====================================================

  const handleApproveCertificate = (
    id: string,
    points: number,
    note: string
  ) => {
    setCertificates(prev =>
      prev.map(cert =>
        cert.id === id
          ? {
              ...cert,
              status: 'approved',
              awardedPoints: points,
              facultyNote: note,
              verifiedBy: 'Administrator'
            }
          : cert
      )
    );

    const cert = certificates.find(
      c => c.id === id
    );

    if (cert) {
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          title: 'Certificate Endorsed',
          message:
            `Approved ${cert.activityName} for ${cert.studentName} (+${points} pts).`,
          timestamp: 'Just now',
          type: 'approval',
          read: false
        },
        ...prev
      ]);
    }
  };

  const handleRejectCertificate = (
    id: string,
    note: string
  ) => {
    setCertificates(prev =>
      prev.map(cert =>
        cert.id === id
          ? {
              ...cert,
              status: 'rejected',
              facultyNote: note,
              verifiedBy: 'Administrator'
            }
          : cert
      )
    );
  };

  // =====================================================
  // ATTENDANCE
  // =====================================================

  const handleUpdateRoster = (
    updatedRoster: StudentRosterItem[]
  ) => {
    setRoster(updatedRoster);
  };

  // =====================================================
  // BUS
  // =====================================================

  const handleUpdateRoute = (
    updatedRoute: BusRouteInfo
  ) => {
    setBusRoutes(prev =>
      prev.map(route =>
        route.id === updatedRoute.id
          ? updatedRoute
          : route
      )
    );
  };

  // =====================================================
  // MARKS
  // =====================================================

  const handleSaveMarks = (
    updatedRecord: StudentMarks
  ) => {
    setMarksList(prev => {
      const index = prev.findIndex(
        mark =>
          mark.studentId === updatedRecord.studentId &&
          mark.courseCode === updatedRecord.courseCode
      );

      if (index >= 0) {
        const next = [...prev];

        next[index] = updatedRecord;

        return next;
      }

      return [
        updatedRecord,
        ...prev
      ];
    });
  };

  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({
        ...notification,
        read: true
      }))
    );
  };

  const handleSelectNotification = (
    notification: AdminNotification
  ) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notification.id
          ? {
              ...n,
              read: true
            }
          : n
      )
    );

    if (notification.type === 'approval') {
      setCurrentTab('approvals');
    }

    if (notification.type === 'bus') {
      setCurrentTab('bus');
    }

    if (notification.type === 'attendance') {
      setCurrentTab('attendance');
    }

    if (notification.type === 'marks') {
      setCurrentTab('marks');
    }

    setIsNotificationsOpen(false);
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-[#faf9fc] text-[#1b1b1e] flex flex-col md:flex-row antialiased">

      {/* SIDEBAR */}

      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenReports={() =>
          setIsReportsOpen(true)
        }
        onOpenSupport={() =>
          setIsSupportOpen(true)
        }
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() =>
          setIsMobileSidebarOpen(false)
        }
      />

      {/* MAIN CONTENT */}

      <div className="flex-1 md:ml-[280px] flex flex-col min-h-screen relative overflow-x-hidden">

        {/* TOP HEADER */}

        <TopHeader
          currentTab={currentTab}
          onOpenMobileMenu={() =>
            setIsMobileSidebarOpen(true)
          }
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          notifications={notifications}
          isNotificationsOpen={isNotificationsOpen}
          onToggleNotifications={() =>
            setIsNotificationsOpen(
              !isNotificationsOpen
            )
          }
        />

        {/* NOTIFICATIONS */}

        {isNotificationsOpen && (
          <div className="relative max-w-7xl mx-auto w-full px-4 md:px-8">

            <NotificationsPopover
              isOpen={isNotificationsOpen}
              onClose={() =>
                setIsNotificationsOpen(false)
              }
              notifications={notifications}
              onMarkAllAsRead={
                handleMarkAllNotificationsRead
              }
              onSelectNotification={
                handleSelectNotification
              }
            />

          </div>
        )}

        {/* MAIN VIEWS */}

        <main className="flex-1 flex flex-col">

          {/* APPROVALS */}

          {currentTab === 'approvals' && (
            <ActivityApprovalsView
              certificates={certificates}
              searchQuery={searchQuery}
              onApprove={
                handleApproveCertificate
              }
              onReject={
                handleRejectCertificate
              }
              onOpenViewer={certificate =>
                setViewerCertificate(
                  certificate
                )
              }
            />
          )}

          {/* ATTENDANCE */}

          {currentTab === 'attendance' && (
            <AttendanceView
              roster={roster}
              subjects={subjects}
              searchQuery={searchQuery}
              onUpdateRoster={
                handleUpdateRoster
              }
            />
          )}

          {/* BUS */}

          {currentTab === 'bus' && (
            <BusTrackingView
              busRoutes={busRoutes}
              onUpdateRoute={
                handleUpdateRoute
              }
            />
          )}

          {/* MARKS */}

          {currentTab === 'marks' && (
            <MarksEntryView
              marksList={marksList}
              subjects={subjects}
              students={roster}
              searchQuery={searchQuery}
              onSaveMarks={
                handleSaveMarks
              }
            />
          )}

        </main>

        {/* CERTIFICATE MODAL */}

        <CertificateModal
          certificate={viewerCertificate}
          isOpen={Boolean(viewerCertificate)}
          onClose={() =>
            setViewerCertificate(null)
          }
          onApprove={
            handleApproveCertificate
          }
          onReject={
            handleRejectCertificate
          }
        />

        {/* REPORTS MODAL */}

        <ReportsModal
          isOpen={isReportsOpen}
          onClose={() =>
            setIsReportsOpen(false)
          }
          certificates={certificates}
          roster={roster}
          subjects={subjects}
          busRoutes={busRoutes}
          marks={marksList}
        />

        {/* SUPPORT MODAL */}

        <SupportModal
          isOpen={isSupportOpen}
          onClose={() =>
            setIsSupportOpen(false)
          }
        />

      </div>
    </div>
  );
}