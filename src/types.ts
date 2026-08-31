export type NavigationTab = 'approvals' | 'attendance' | 'bus' | 'marks';

export type ActivityCategory = 'Clubs & Societies' | 'Technical' | 'Cultural' | 'Sports' | 'Leadership';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface ActivityCertificate {
  id: string;
  studentName: string;
  studentId: string;
  initials: string;
  avatarBg: string;
  activityName: string;
  category: ActivityCategory;
  date: string;
  status: ApprovalStatus;
  awardedPoints: number;
  maxPoints: number;
  facultyNote?: string;
  certificateImage: string;
  organization: string;
  submittedAt: string;
  verifiedBy?: string;
}

export interface StudentRosterItem {
  id: string;
  name: string;
  rollNo: string;
  initials: string;
  avatar?: string;
  avatarBg?: string;
  status: 'P' | 'A';
  attendanceRate: number;
}

export interface SubjectItem {
  id: string;
  code: string;
  name: string;
  faculty: string;
  percentage: number;
  attendedClasses: number;
  totalClasses: number;
  term: string;
}

export interface BusStop {
  id: string;
  name: string;
  time: string;
  distance: string;
}

export interface BusRouteInfo {
  id: string;
  routeNumber: string;
  routeName: string;
  passNumber: string;
  status: 'active' | 'inactive';
  morningPickup: {
    time: string;
    location: string;
  };
  eveningDeparture: {
    time: string;
    location: string;
  };
  stops: BusStop[];
  currentStopIndex: number;
  etaNextStopMins: number;
  driver: {
    name: string;
    phone: string;
    initials: string;
    vehicleNumber: string;
    experience: string;
  };
}

export interface StudentMarks {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  courseCode: string;
  courseName: string;
  faculty: string;
  firstInternal: number; // Max 20
  secondInternal: number; // Max 20
  assignments: number; // Max 10
  remarks: string;
  updatedAt: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'approval' | 'bus' | 'attendance' | 'marks';
  read: boolean;
}
