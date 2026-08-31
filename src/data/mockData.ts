import { ActivityCertificate, StudentRosterItem, SubjectItem, BusRouteInfo, StudentMarks, AdminNotification } from '../types';

export const INITIAL_CERTIFICATES: ActivityCertificate[] = [
  {
    id: 'act-001',
    studentName: 'Jane Smith',
    studentId: 'CS-2021-045',
    initials: 'JS',
    avatarBg: 'bg-[#e1e3e4] text-[#191c1d]',
    activityName: 'National Hackathon 2024',
    category: 'Clubs & Societies',
    date: '24 Oct, 2024',
    status: 'pending',
    awardedPoints: 10,
    maxPoints: 20,
    facultyNote: '',
    certificateImage: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=1200&q=80',
    organization: 'National Tech League & IEEE Student Branch',
    submittedAt: '2024-10-24 14:30'
  },
  {
    id: 'act-002',
    studentName: 'Marcus Reed',
    studentId: 'CS-2021-019',
    initials: 'MR',
    avatarBg: 'bg-[#212527] text-white',
    activityName: 'Robotics Workshop',
    category: 'Technical',
    date: '22 Oct, 2024',
    status: 'pending',
    awardedPoints: 8,
    maxPoints: 15,
    facultyNote: '',
    certificateImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    organization: 'Centre for Robotics & Automation Systems',
    submittedAt: '2024-10-22 10:15'
  },
  {
    id: 'act-003',
    studentName: 'Alicia Lee',
    studentId: 'CS-2021-073',
    initials: 'AL',
    avatarBg: 'bg-[#d6e3ff] text-[#011b3e]',
    activityName: 'Inter-College Debate',
    category: 'Cultural',
    date: '20 Oct, 2024',
    status: 'pending',
    awardedPoints: 6,
    maxPoints: 10,
    facultyNote: '',
    certificateImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
    organization: 'State Literary & Debating Society',
    submittedAt: '2024-10-20 16:45'
  },
  {
    id: 'act-004',
    studentName: 'David Chen',
    studentId: 'CS-2021-112',
    initials: 'DC',
    avatarBg: 'bg-[#0b2447] text-[#d6e3ff]',
    activityName: 'ACM ICPC Regional Qualifier',
    category: 'Technical',
    date: '18 Oct, 2024',
    status: 'pending',
    awardedPoints: 15,
    maxPoints: 25,
    facultyNote: '',
    certificateImage: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=1200&q=80',
    organization: 'ACM International Collegiate Programming Contest',
    submittedAt: '2024-10-18 09:20'
  },
  {
    id: 'act-005',
    studentName: 'Elena Gilbert',
    studentId: 'CS-2021-028',
    initials: 'EG',
    avatarBg: 'bg-[#ffdad6] text-[#93000a]',
    activityName: 'Annual Sports Meet - 400m Gold',
    category: 'Sports',
    date: '15 Oct, 2024',
    status: 'approved',
    awardedPoints: 12,
    maxPoints: 15,
    facultyNote: 'Verified gold medal in 400m track event. Excellent athletic spirit.',
    certificateImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    organization: 'University Athletics Board',
    submittedAt: '2024-10-15 11:00',
    verifiedBy: 'Dr. Sarah Jenkins'
  },
  {
    id: 'act-006',
    studentName: 'Vikram Malhotra',
    studentId: 'CS-2021-094',
    initials: 'VM',
    avatarBg: 'bg-[#e1e3e4] text-[#191c1d]',
    activityName: 'Unverified Online Seminar',
    category: 'Technical',
    date: '10 Oct, 2024',
    status: 'rejected',
    awardedPoints: 0,
    maxPoints: 5,
    facultyNote: 'Certificate does not contain valid accreditation QR code or faculty signature.',
    certificateImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
    organization: 'Self-Paced Web Academy',
    submittedAt: '2024-10-10 18:30',
    verifiedBy: 'Admin Office'
  }
];

export const INITIAL_STUDENTS_ROSTER: StudentRosterItem[] = [
  {
    id: 'std-1',
    name: 'Aarav Jain',
    rollNo: 'S10452',
    initials: 'AJ',
    avatarBg: 'bg-[#0b2447] text-white',
    status: 'P',
    attendanceRate: 94
  },
  {
    id: 'std-2',
    name: 'Sarah Mehta',
    rollNo: 'S10453',
    initials: 'SM',
    avatarBg: 'bg-[#212527] text-white',
    status: 'P',
    attendanceRate: 88
  },
  {
    id: 'std-3',
    name: 'Rohan Kumar',
    rollNo: 'S10455',
    initials: 'RK',
    avatarBg: 'bg-[#e1e3e4] text-[#191c1d]',
    status: 'A',
    attendanceRate: 68
  },
  {
    id: 'std-4',
    name: 'Priya Sharma',
    rollNo: 'S10458',
    initials: 'PS',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    avatarBg: 'bg-[#d6e3ff] text-[#011b3e]',
    status: 'P',
    attendanceRate: 91
  },
  {
    id: 'std-5',
    name: 'Vikram Kapoor',
    rollNo: 'S10461',
    initials: 'VK',
    avatarBg: 'bg-[#0b2447] text-white',
    status: 'P',
    attendanceRate: 82
  },
  {
    id: 'std-6',
    name: 'Ananya Rao',
    rollNo: 'S10464',
    initials: 'AR',
    avatarBg: 'bg-[#e1e3e4] text-[#191c1d]',
    status: 'P',
    attendanceRate: 95
  },
  {
    id: 'std-7',
    name: 'Karthik Nair',
    rollNo: 'S10469',
    initials: 'KN',
    avatarBg: 'bg-[#212527] text-white',
    status: 'P',
    attendanceRate: 84
  },
  {
    id: 'std-8',
    name: 'Meera Patel',
    rollNo: 'S10472',
    initials: 'MP',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    avatarBg: 'bg-[#d6e3ff] text-[#011b3e]',
    status: 'P',
    attendanceRate: 90
  },
  {
    id: 'std-9',
    name: 'Aditya Verma',
    rollNo: 'S10477',
    initials: 'AV',
    avatarBg: 'bg-[#0b2447] text-white',
    status: 'A',
    attendanceRate: 71
  },
  {
    id: 'std-10',
    name: 'Diya Sengupta',
    rollNo: 'S10480',
    initials: 'DS',
    avatarBg: 'bg-[#e1e3e4] text-[#191c1d]',
    status: 'P',
    attendanceRate: 86
  }
];

export const INITIAL_SUBJECTS: SubjectItem[] = [
  {
    id: 'sub-1',
    code: 'CS301',
    name: 'Data Structures',
    faculty: 'Dr. Sarah Jenkins',
    percentage: 92,
    attendedClasses: 35,
    totalClasses: 38,
    term: 'Fall 2024'
  },
  {
    id: 'sub-2',
    code: 'CS305',
    name: 'Computer Networks',
    faculty: 'Prof. Alan Vance',
    percentage: 75,
    attendedClasses: 27,
    totalClasses: 36,
    term: 'Fall 2024'
  },
  {
    id: 'sub-3',
    code: 'CS304',
    name: 'Database Management',
    faculty: 'Dr. Elena Rostova',
    percentage: 63,
    attendedClasses: 15,
    totalClasses: 24,
    term: 'Fall 2024'
  },
  {
    id: 'sub-4',
    code: 'CS302',
    name: 'Operating Systems',
    faculty: 'Prof. Michael Chang',
    percentage: 85,
    attendedClasses: 29,
    totalClasses: 34,
    term: 'Fall 2024'
  }
];

export const INITIAL_BUS_ROUTES: BusRouteInfo[] = [
  {
    id: 'route-42',
    routeNumber: 'Bus Route 42',
    routeName: 'North Campus Route',
    passNumber: '#RSET-BUS-2024-88',
    status: 'active',
    morningPickup: {
      time: '07:45 AM',
      location: 'North Terminal Gate C'
    },
    eveningDeparture: {
      time: '04:45 PM',
      location: 'RSET Main Bus Bay #4'
    },
    stops: [
      { id: 'stop-1', name: 'North Term.', time: '07:45 AM', distance: '0.0 km' },
      { id: 'stop-2', name: 'Tech Park', time: '08:05 AM', distance: '4.2 km' },
      { id: 'stop-3', name: 'Flyover Junc.', time: '08:20 AM', distance: '8.7 km' },
      { id: 'stop-4', name: 'RSET Campus', time: '08:35 AM', distance: '12.4 km' }
    ],
    currentStopIndex: 2, // Flyover Junc.
    etaNextStopMins: 3,
    driver: {
      name: 'James Wilson',
      phone: '+91 98472 11223',
      initials: 'JW',
      vehicleNumber: 'KL-07-CD-4288',
      experience: '8 Years Active Driver'
    }
  },
  {
    id: 'route-15',
    routeNumber: 'Bus Route 15',
    routeName: 'South Metro Connector',
    passNumber: '#RSET-BUS-2024-15',
    status: 'active',
    morningPickup: {
      time: '07:30 AM',
      location: 'South Metro Station Bay 2'
    },
    eveningDeparture: {
      time: '05:00 PM',
      location: 'RSET Main Bus Bay #2'
    },
    stops: [
      { id: 'stop-11', name: 'South Metro', time: '07:30 AM', distance: '0.0 km' },
      { id: 'stop-12', name: 'City Center', time: '07:50 AM', distance: '5.1 km' },
      { id: 'stop-13', name: 'East Ring Rd', time: '08:15 AM', distance: '10.3 km' },
      { id: 'stop-14', name: 'RSET Campus', time: '08:40 AM', distance: '15.8 km' }
    ],
    currentStopIndex: 1, // City Center
    etaNextStopMins: 7,
    driver: {
      name: 'Robert Davis',
      phone: '+91 98472 44556',
      initials: 'RD',
      vehicleNumber: 'KL-07-CD-1590',
      experience: '5 Years Active Driver'
    }
  },
  {
    id: 'route-08',
    routeNumber: 'Bus Route 8B',
    routeName: 'East Hills Transit',
    passNumber: '#RSET-BUS-2024-08',
    status: 'inactive',
    morningPickup: {
      time: '08:00 AM',
      location: 'Hilltop Circle Gate'
    },
    eveningDeparture: {
      time: '04:30 PM',
      location: 'RSET Main Bus Bay #1'
    },
    stops: [
      { id: 'stop-21', name: 'Hilltop Circle', time: '08:00 AM', distance: '0.0 km' },
      { id: 'stop-22', name: 'Valley Road', time: '08:15 AM', distance: '3.8 km' },
      { id: 'stop-23', name: 'Lake Junction', time: '08:30 AM', distance: '7.9 km' },
      { id: 'stop-24', name: 'RSET Campus', time: '08:45 AM', distance: '11.2 km' }
    ],
    currentStopIndex: 0,
    etaNextStopMins: 15,
    driver: {
      name: 'Michael Scott',
      phone: '+91 98472 88990',
      initials: 'MS',
      vehicleNumber: 'KL-07-CD-0812',
      experience: '12 Years Active Driver'
    }
  }
];

export const INITIAL_STUDENT_MARKS: StudentMarks[] = [
  {
    id: 'marks-001',
    studentId: 'std-1',
    studentName: 'Aarav Jain',
    rollNo: 'S10452',
    courseCode: 'CS301',
    courseName: 'Design and Analysis of Algorithms',
    faculty: 'Dr. Sarah Jenkins',
    firstInternal: 18,
    secondInternal: 16,
    assignments: 8,
    remarks: 'Excellent performance in dynamic programming assignments. Needs focus on graph algorithms.',
    updatedAt: '2024-10-24 16:00'
  },
  {
    id: 'marks-002',
    studentId: 'std-2',
    studentName: 'Jane Smith',
    rollNo: 'CS-2021-045',
    courseCode: 'CS301',
    courseName: 'Design and Analysis of Algorithms',
    faculty: 'Dr. Sarah Jenkins',
    firstInternal: 19,
    secondInternal: 18,
    assignments: 9,
    remarks: 'Outstanding analytical skills and prompt assignment submissions.',
    updatedAt: '2024-10-23 11:30'
  },
  {
    id: 'marks-003',
    studentId: 'std-3',
    studentName: 'Marcus Reed',
    rollNo: 'CS-2021-019',
    courseCode: 'CS301',
    courseName: 'Design and Analysis of Algorithms',
    faculty: 'Dr. Sarah Jenkins',
    firstInternal: 14,
    secondInternal: 15,
    assignments: 7,
    remarks: 'Consistent participation. Can improve on time complexity proofs.',
    updatedAt: '2024-10-22 14:10'
  },
  {
    id: 'marks-004',
    studentId: 'std-4',
    studentName: 'Rohan Kumar',
    rollNo: 'S10455',
    courseCode: 'CS301',
    courseName: 'Design and Analysis of Algorithms',
    faculty: 'Dr. Sarah Jenkins',
    firstInternal: 10,
    secondInternal: 11,
    assignments: 5,
    remarks: 'Needs remedial practice on divide and conquer paradigm before end-term examinations.',
    updatedAt: '2024-10-21 09:45'
  }
];

export const INITIAL_NOTIFICATIONS: AdminNotification[] = [
  {
    id: 'notif-1',
    title: 'New Activity Certificate',
    message: 'Jane Smith submitted National Hackathon 2024 certificate for approval.',
    timestamp: '10m ago',
    type: 'approval',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Bus Route 42 Update',
    message: 'Driver James Wilson reported ETA 3 mins to Flyover Junction.',
    timestamp: '25m ago',
    type: 'bus',
    read: false
  },
  {
    id: 'notif-3',
    title: 'Low Attendance Alert',
    message: 'Database Management (CS304) current cohort attendance dropped below 65%.',
    timestamp: '2h ago',
    type: 'attendance',
    read: true
  },
  {
    id: 'notif-4',
    title: 'Marks Verification Due',
    message: 'Second internal evaluations for CS301 are awaiting dean endorsement.',
    timestamp: '1d ago',
    type: 'marks',
    read: true
  }
];
