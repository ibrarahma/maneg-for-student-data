/**
 * ScholarSync Data Service - Mock Database & Supabase-compatible Service Layer
 * 
 * Provides type definitions, persistent localStorage storage, and async CRUD methods
 * for all school management entities (Students, Attendance, Fees, Staff, Exams, etc.).
 * Designed as a drop-in replacement for a future Supabase backend.
 */

// ============================================================================
// 1. TYPE DEFINITIONS & ENTITY INTERFACES
// ============================================================================

export type UserRole = 
  | 'super_admin' 
  | 'admin' 
  | 'teacher' 
  | 'accountant' 
  | 'student' 
  | 'parent';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  status: 'Active' | 'Inactive';
  studentId?: string;
  teacherId?: string;
  parentId?: string;
  createdAt: string;
}

export interface SchoolClass {
  id: string;
  name: string;
  sections: string[];
  classTeacherName?: string;
  roomNo?: string;
  capacity?: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  classId: string;
  className: string;
  maxMarks: number;
  passMarks: number;
  teacherId?: string;
}

export interface StudentDocument {
  id: string;
  title: string;
  url: string;
  uploadDate: string;
}

export interface Student {
  id: string;
  admissionNo: string;
  rollNo: string;
  name: string;
  fatherName: string;
  motherName: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  classId: string;
  className: string;
  section: string;
  session: string;
  mobile: string;
  parentMobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pin: string;
  admissionDate: string;
  previousSchool?: string;
  bloodGroup: string;
  photoUrl?: string;
  status: 'Active' | 'Inactive' | 'Archived' | 'Passed Out';
  documents?: StudentDocument[];
  createdAt: string;
  updatedAt: string;
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LEAVE';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentAdmissionNo: string;
  studentName: string;
  classId: string;
  className: string;
  section: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  remarks?: string;
  markedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceReportRow {
  studentId: string;
  admissionNo: string;
  studentName: string;
  className: string;
  section: string;
  totalWorkingDays: number;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  attendancePercentage: number;
}

export interface FeeStructure {
  id: string;
  classId: string;
  className: string;
  feeType: string;
  amount: number;
  session: string;
  dueDate: string;
  description?: string;
}

export interface FeePayment {
  id: string;
  receiptNo: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  classId: string;
  className: string;
  section: string;
  feeType: string;
  amount: number;
  discount: number;
  paidAmount: number;
  dueAmount: number;
  paymentDate: string;
  paymentMode: 'Cash' | 'UPI' | 'Card' | 'Bank Transfer';
  transactionId?: string;
  collectedBy: string;
  remarks?: string;
  createdAt: string;
}

export interface FeeDeletionLog {
  id: string;
  paymentId: string;
  receiptNo: string;
  studentName: string;
  amount: number;
  deletedBy: string;
  deletionReason: string;
  deletedAt: string;
}

export interface Exam {
  id: string;
  name: string;
  session: string;
  startDate: string;
  endDate: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
}

export interface ExamSchedule {
  id: string;
  examId: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  date: string;
  startTime: string;
  endTime: string;
  maxMarks: number;
}

export interface Mark {
  id: string;
  examId: string;
  examName: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  classId: string;
  className: string;
  section: string;
  subjectId: string;
  subjectName: string;
  maxMarks: number;
  marksObtained: number;
  grade: string;
  remarks?: string;
  updatedAt: string;
}

export interface Staff {
  id: string;
  employeeId: string;
  name: string;
  photoUrl?: string;
  department: 'Teaching' | 'Administration' | 'Finance' | 'Support' | 'Transport';
  designation: string;
  mobile: string;
  email: string;
  joiningDate: string;
  basicSalary: number;
  status: 'Active' | 'On Leave' | 'Resigned';
  assignedClass?: string;
  qualification?: string;
  createdAt: string;
}

export interface SalaryRecord {
  id: string;
  staffId: string;
  staffName: string;
  employeeId: string;
  department: string;
  month: string; // e.g. "September 2026"
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  paymentStatus: 'Paid' | 'Pending';
  paymentDate?: string;
  paymentMode?: 'Bank Transfer' | 'Cash' | 'Cheque';
  transactionId?: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  expenseId: string;
  category: 'Electricity' | 'Maintenance' | 'Salary' | 'Stationery' | 'Transport' | 'Events' | 'Other';
  description: string;
  amount: number;
  date: string;
  paymentMode: 'Cash' | 'UPI' | 'Card' | 'Bank Transfer';
  addedBy: string;
  receiptUrl?: string;
  createdAt: string;
}

export interface Notice {
  id: string;
  title: string;
  description: string;
  date: string;
  audience: 'Everyone' | 'Teachers' | 'Students' | 'Parents' | 'Class';
  targetClassId?: string;
  targetClassName?: string;
  priority: 'Low' | 'Medium' | 'High';
  attachmentUrl?: string;
  authorName: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  module: string;
  details: string;
  performedBy: string;
  timestamp: string;
}

export interface SchoolSettings {
  schoolName: string;
  tagline: string;
  logoUrl: string;
  phone: string;
  email: string;
  address: string;
  affiliationNo: string;
  principalName: string;
  academicSession: string;
  currencySymbol: string;
}

export interface DashboardStats {
  totalStudents: number;
  presentToday: number;
  absentToday: number;
  onLeaveToday: number;
  attendancePercentageToday: number;
  totalTeachers: number;
  pendingFees: number;
  feesCollected: number;
  totalExpenses: number;
  activeClassesCount: number;
  weeklyAttendance: { day: string; present: number; absent: number }[];
  monthlyAttendanceRate: { month: string; rate: number }[];
  monthlyFeeTrend: { month: string; collected: number; due: number }[];
  incomeVsExpense: { month: string; income: number; expense: number }[];
  classStrength: { className: string; count: number }[];
  recentAdmissions: Student[];
  recentPayments: FeePayment[];
  recentNotices: Notice[];
  recentAttendanceActivity: AttendanceRecord[];
}

// ============================================================================
// 2. INITIAL SEED DATA
// ============================================================================

export const INITIAL_CLASSES: SchoolClass[] = [
  { id: 'cls-nursery', name: 'Nursery', sections: ['A'], classTeacherName: 'Mrs. Sunita Verma', roomNo: '101', capacity: 30 },
  { id: 'cls-lkg', name: 'LKG', sections: ['A', 'B'], classTeacherName: 'Ms. Pooja Sen', roomNo: '102', capacity: 35 },
  { id: 'cls-ukg', name: 'UKG', sections: ['A', 'B'], classTeacherName: 'Mrs. Neha Gupta', roomNo: '103', capacity: 35 },
  { id: 'cls-1', name: 'Class 1', sections: ['A', 'B'], classTeacherName: 'Mr. Arvind Sharma', roomNo: '201', capacity: 40 },
  { id: 'cls-2', name: 'Class 2', sections: ['A', 'B'], classTeacherName: 'Mrs. Meenakshi Rai', roomNo: '202', capacity: 40 },
  { id: 'cls-3', name: 'Class 3', sections: ['A', 'B'], classTeacherName: 'Mr. Deepak Joshi', roomNo: '203', capacity: 40 },
  { id: 'cls-4', name: 'Class 4', sections: ['A', 'B'], classTeacherName: 'Mrs. Rashmi Patel', roomNo: '301', capacity: 40 },
  { id: 'cls-5', name: 'Class 5', sections: ['A', 'B'], classTeacherName: 'Mr. Vikram Singh', roomNo: '302', capacity: 40 },
  { id: 'cls-6', name: 'Class 6', sections: ['A', 'B'], classTeacherName: 'Mrs. Anjali Roy', roomNo: '303', capacity: 42 },
  { id: 'cls-7', name: 'Class 7', sections: ['A', 'B'], classTeacherName: 'Mr. Rajesh Kumar', roomNo: '401', capacity: 42 },
  { id: 'cls-8', name: 'Class 8', sections: ['A', 'B'], classTeacherName: 'Mrs. Kavita Saxena', roomNo: '402', capacity: 42 },
  { id: 'cls-9', name: 'Class 9', sections: ['A', 'B'], classTeacherName: 'Mr. Sandeep Mathur', roomNo: '403', capacity: 45 },
  { id: 'cls-10', name: 'Class 10', sections: ['A', 'B'], classTeacherName: 'Dr. R. K. Mukherjee', roomNo: '404', capacity: 45 }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-1001',
    admissionNo: 'ADM-26-1001',
    rollNo: '01',
    name: 'Rahul Kumar',
    fatherName: 'Suresh Kumar',
    motherName: 'Anita Kumar',
    dob: '2021-03-14',
    gender: 'Male',
    classId: 'cls-ukg',
    className: 'UKG',
    section: 'A',
    session: '2026-2027',
    mobile: '9876543210',
    parentMobile: '9876543210',
    email: 'suresh.kumar@example.com',
    address: '14/B Gandhi Marg, Civil Lines',
    city: 'Jaipur',
    state: 'Rajasthan',
    pin: '302006',
    admissionDate: '2026-04-05',
    previousSchool: 'Little Angels Nursery',
    bloodGroup: 'B+',
    status: 'Active',
    createdAt: '2026-04-05T09:30:00.000Z',
    updatedAt: '2026-04-05T09:30:00.000Z'
  },
  {
    id: 'std-1002',
    admissionNo: 'ADM-26-1023',
    rollNo: '02',
    name: 'Ravi Kumar',
    fatherName: 'Mahesh Kumar',
    motherName: 'Sunita Kumar',
    dob: '2021-06-22',
    gender: 'Male',
    classId: 'cls-ukg',
    className: 'UKG',
    section: 'A',
    session: '2026-2027',
    mobile: '9876543211',
    parentMobile: '9876543211',
    email: 'mahesh.k@example.com',
    address: '88 Green Park Extension',
    city: 'Jaipur',
    state: 'Rajasthan',
    pin: '302016',
    admissionDate: '2026-04-06',
    previousSchool: 'Sunshine Play School',
    bloodGroup: 'O+',
    status: 'Active',
    createdAt: '2026-04-06T10:15:00.000Z',
    updatedAt: '2026-04-06T10:15:00.000Z'
  },
  {
    id: 'std-1003',
    admissionNo: 'ADM-26-1045',
    rollNo: '03',
    name: 'Aman Khan',
    fatherName: 'Tariq Khan',
    motherName: 'Nasreen Khan',
    dob: '2021-08-11',
    gender: 'Male',
    classId: 'cls-ukg',
    className: 'UKG',
    section: 'A',
    session: '2026-2027',
    mobile: '9876543212',
    parentMobile: '9876543212',
    email: 'tariq.khan@example.com',
    address: '52 Crescent Colony',
    city: 'Jaipur',
    state: 'Rajasthan',
    pin: '302001',
    admissionDate: '2026-04-08',
    previousSchool: 'Model Kids School',
    bloodGroup: 'A+',
    status: 'Active',
    createdAt: '2026-04-08T11:00:00.000Z',
    updatedAt: '2026-04-08T11:00:00.000Z'
  },
  {
    id: 'std-1004',
    admissionNo: 'ADM-26-1062',
    rollNo: '04',
    name: 'Arman Ali',
    fatherName: 'Irfan Ali',
    motherName: 'Shabana Ali',
    dob: '2021-02-19',
    gender: 'Male',
    classId: 'cls-ukg',
    className: 'UKG',
    section: 'A',
    session: '2026-2027',
    mobile: '9876543213',
    parentMobile: '9876543213',
    email: 'irfan.ali@example.com',
    address: '109 Noor Manzil, Station Road',
    city: 'Jaipur',
    state: 'Rajasthan',
    pin: '302002',
    admissionDate: '2026-04-10',
    bloodGroup: 'AB+',
    status: 'Active',
    createdAt: '2026-04-10T12:00:00.000Z',
    updatedAt: '2026-04-10T12:00:00.000Z'
  },
  {
    id: 'std-1005',
    admissionNo: 'ADM-26-1080',
    rollNo: '05',
    name: 'Priya Sharma',
    fatherName: 'Ramesh Sharma',
    motherName: 'Kavita Sharma',
    dob: '2021-05-30',
    gender: 'Female',
    classId: 'cls-ukg',
    className: 'UKG',
    section: 'A',
    session: '2026-2027',
    mobile: '9876543214',
    parentMobile: '9876543214',
    email: 'ramesh.sharma@example.com',
    address: '23 Anand Vihar, Tonk Road',
    city: 'Jaipur',
    state: 'Rajasthan',
    pin: '302015',
    admissionDate: '2026-04-11',
    bloodGroup: 'O-',
    status: 'Active',
    createdAt: '2026-04-11T09:45:00.000Z',
    updatedAt: '2026-04-11T09:45:00.000Z'
  },
  {
    id: 'std-1006',
    admissionNo: 'ADM-26-2010',
    rollNo: '01',
    name: 'Ananya Deshmukh',
    fatherName: 'Vikas Deshmukh',
    motherName: 'Smita Deshmukh',
    dob: '2016-10-15',
    gender: 'Female',
    classId: 'cls-5',
    className: 'Class 5',
    section: 'A',
    session: '2026-2027',
    mobile: '9876543215',
    parentMobile: '9876543215',
    email: 'vikas.desh@example.com',
    address: '74 Ashok Nagar',
    city: 'Jaipur',
    state: 'Rajasthan',
    pin: '302001',
    admissionDate: '2024-04-02',
    bloodGroup: 'B+',
    status: 'Active',
    createdAt: '2024-04-02T10:00:00.000Z',
    updatedAt: '2026-04-01T10:00:00.000Z'
  },
  {
    id: 'std-1007',
    admissionNo: 'ADM-26-2011',
    rollNo: '02',
    name: 'Devansh Singhania',
    fatherName: 'Harish Singhania',
    motherName: 'Geeta Singhania',
    dob: '2016-11-20',
    gender: 'Male',
    classId: 'cls-5',
    className: 'Class 5',
    section: 'A',
    session: '2026-2027',
    mobile: '9876543216',
    parentMobile: '9876543216',
    email: 'harish.singh@example.com',
    address: '12 Malviya Industrial Area',
    city: 'Jaipur',
    state: 'Rajasthan',
    pin: '302017',
    admissionDate: '2024-04-03',
    bloodGroup: 'A-',
    status: 'Active',
    createdAt: '2024-04-03T11:00:00.000Z',
    updatedAt: '2026-04-01T10:00:00.000Z'
  },
  {
    id: 'std-1008',
    admissionNo: 'ADM-26-3001',
    rollNo: '01',
    name: 'Kabir Mehta',
    fatherName: 'Ajay Mehta',
    motherName: 'Rohini Mehta',
    dob: '2011-04-09',
    gender: 'Male',
    classId: 'cls-10',
    className: 'Class 10',
    section: 'A',
    session: '2026-2027',
    mobile: '9876543217',
    parentMobile: '9876543217',
    email: 'ajay.mehta@example.com',
    address: '302 Silver Heights, C-Scheme',
    city: 'Jaipur',
    state: 'Rajasthan',
    pin: '302001',
    admissionDate: '2021-04-05',
    bloodGroup: 'O+',
    status: 'Active',
    createdAt: '2021-04-05T09:00:00.000Z',
    updatedAt: '2026-04-01T10:00:00.000Z'
  },
  {
    id: 'std-1009',
    admissionNo: 'ADM-26-3002',
    rollNo: '02',
    name: 'Zara Sheikh',
    fatherName: 'Farhan Sheikh',
    motherName: 'Rubina Sheikh',
    dob: '2011-07-28',
    gender: 'Female',
    classId: 'cls-10',
    className: 'Class 10',
    section: 'A',
    session: '2026-2027',
    mobile: '9876543218',
    parentMobile: '9876543218',
    email: 'farhan.sheikh@example.com',
    address: '45 Ram Nagar',
    city: 'Jaipur',
    state: 'Rajasthan',
    pin: '302019',
    admissionDate: '2021-04-06',
    bloodGroup: 'B-',
    status: 'Active',
    createdAt: '2021-04-06T10:30:00.000Z',
    updatedAt: '2026-04-01T10:00:00.000Z'
  }
];

export const INITIAL_STAFF: Staff[] = [
  {
    id: 'stf-001',
    employeeId: 'EMP-1001',
    name: 'Mrs. Neha Gupta',
    department: 'Teaching',
    designation: 'Senior Primary Teacher',
    mobile: '9829011223',
    email: 'neha.gupta@scholarsync.edu',
    joiningDate: '2020-06-15',
    basicSalary: 38000,
    status: 'Active',
    assignedClass: 'UKG - A',
    qualification: 'M.A., B.Ed.',
    createdAt: '2020-06-15T09:00:00.000Z'
  },
  {
    id: 'stf-002',
    employeeId: 'EMP-1002',
    name: 'Dr. R. K. Mukherjee',
    department: 'Teaching',
    designation: 'Head of Department (Science)',
    mobile: '9829022334',
    email: 'rk.mukherjee@scholarsync.edu',
    joiningDate: '2016-04-01',
    basicSalary: 65000,
    status: 'Active',
    assignedClass: 'Class 10 - A',
    qualification: 'Ph.D. Physics, M.Sc., B.Ed.',
    createdAt: '2016-04-01T09:00:00.000Z'
  },
  {
    id: 'stf-003',
    employeeId: 'EMP-1003',
    name: 'Mr. Vikram Singh',
    department: 'Teaching',
    designation: 'Mathematics Teacher',
    mobile: '9829033445',
    email: 'vikram.singh@scholarsync.edu',
    joiningDate: '2019-07-10',
    basicSalary: 45000,
    status: 'Active',
    assignedClass: 'Class 5 - A',
    qualification: 'M.Sc. Mathematics, B.Ed.',
    createdAt: '2019-07-10T09:00:00.000Z'
  },
  {
    id: 'stf-004',
    employeeId: 'EMP-1004',
    name: 'Mr. Alok Chhabra',
    department: 'Finance',
    designation: 'Chief Accountant',
    mobile: '9829044556',
    email: 'alok.chhabra@scholarsync.edu',
    joiningDate: '2018-02-15',
    basicSalary: 52000,
    status: 'Active',
    qualification: 'M.Com, CA Inter',
    createdAt: '2018-02-15T09:00:00.000Z'
  },
  {
    id: 'stf-005',
    employeeId: 'EMP-1005',
    name: 'Mrs. Sunita Verma',
    department: 'Teaching',
    designation: 'Early Childhood Educator',
    mobile: '9829055667',
    email: 'sunita.verma@scholarsync.edu',
    joiningDate: '2021-08-01',
    basicSalary: 34000,
    status: 'Active',
    assignedClass: 'Nursery - A',
    qualification: 'B.A., NTT',
    createdAt: '2021-08-01T09:00:00.000Z'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-super',
    email: 'superadmin@scholarsync.edu',
    name: 'Dr. Harsh Vardhan',
    role: 'super_admin',
    phone: '9829000001',
    status: 'Active',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'usr-admin',
    email: 'admin@scholarsync.edu',
    name: 'Mr. Virendra Rathore',
    role: 'admin',
    phone: '9829000002',
    status: 'Active',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'usr-teacher',
    email: 'teacher@scholarsync.edu',
    name: 'Mrs. Neha Gupta',
    role: 'teacher',
    phone: '9829011223',
    teacherId: 'stf-001',
    status: 'Active',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'usr-accountant',
    email: 'accountant@scholarsync.edu',
    name: 'Mr. Alok Chhabra',
    role: 'accountant',
    phone: '9829044556',
    status: 'Active',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'usr-student',
    email: 'rahul.kumar@scholarsync.edu',
    name: 'Rahul Kumar',
    role: 'student',
    studentId: 'std-1001',
    phone: '9876543210',
    status: 'Active',
    createdAt: '2026-04-05T09:30:00.000Z'
  },
  {
    id: 'usr-parent',
    email: 'parent.kumar@scholarsync.edu',
    name: 'Suresh Kumar (Parent)',
    role: 'parent',
    parentId: 'par-1001',
    studentId: 'std-1001',
    phone: '9876543210',
    status: 'Active',
    createdAt: '2026-04-05T09:30:00.000Z'
  }
];

export const INITIAL_SUBJECTS: Subject[] = [
  { id: 'sub-ukg-eng', name: 'English Phonics', code: 'ENG-UKG', classId: 'cls-ukg', className: 'UKG', maxMarks: 50, passMarks: 20 },
  { id: 'sub-ukg-math', name: 'Basic Mathematics', code: 'MATH-UKG', classId: 'cls-ukg', className: 'UKG', maxMarks: 50, passMarks: 20 },
  { id: 'sub-ukg-evs', name: 'Environmental Studies', code: 'EVS-UKG', classId: 'cls-ukg', className: 'UKG', maxMarks: 50, passMarks: 20 },
  { id: 'sub-ukg-art', name: 'Rhymes & Arts', code: 'ART-UKG', classId: 'cls-ukg', className: 'UKG', maxMarks: 50, passMarks: 20 },
  
  { id: 'sub-10-eng', name: 'English Language & Lit', code: 'ENG-10', classId: 'cls-10', className: 'Class 10', maxMarks: 100, passMarks: 33 },
  { id: 'sub-10-math', name: 'Mathematics Standard', code: 'MATH-10', classId: 'cls-10', className: 'Class 10', maxMarks: 100, passMarks: 33 },
  { id: 'sub-10-sci', name: 'Integrated Science', code: 'SCI-10', classId: 'cls-10', className: 'Class 10', maxMarks: 100, passMarks: 33 },
  { id: 'sub-10-soc', name: 'Social Studies', code: 'SST-10', classId: 'cls-10', className: 'Class 10', maxMarks: 100, passMarks: 33 }
];

export const INITIAL_FEE_STRUCTURES: FeeStructure[] = [
  { id: 'fs-ukg-tui', classId: 'cls-ukg', className: 'UKG', feeType: 'Tuition Fee (Quarterly)', amount: 12000, session: '2026-2027', dueDate: '2026-10-10', description: 'Regular classroom instruction & digital curriculum' },
  { id: 'fs-ukg-act', classId: 'cls-ukg', className: 'UKG', feeType: 'Activity & Sports Fee', amount: 3500, session: '2026-2027', dueDate: '2026-10-10', description: 'Early learning kits and play materials' },
  { id: 'fs-5-tui', classId: 'cls-5', className: 'Class 5', feeType: 'Tuition Fee (Quarterly)', amount: 16500, session: '2026-2027', dueDate: '2026-10-10' },
  { id: 'fs-10-tui', classId: 'cls-10', className: 'Class 10', feeType: 'Tuition Fee (Quarterly)', amount: 22000, session: '2026-2027', dueDate: '2026-10-10' },
  { id: 'fs-10-lab', classId: 'cls-10', className: 'Class 10', feeType: 'Science & Computer Lab Fee', amount: 4500, session: '2026-2027', dueDate: '2026-10-10' }
];

export const INITIAL_FEE_PAYMENTS: FeePayment[] = [
  {
    id: 'pay-26-001',
    receiptNo: 'REC-2026-0891',
    studentId: 'std-1001',
    studentName: 'Rahul Kumar',
    admissionNo: 'ADM-26-1001',
    classId: 'cls-ukg',
    className: 'UKG',
    section: 'A',
    feeType: 'Tuition Fee (Quarterly)',
    amount: 12000,
    discount: 500,
    paidAmount: 11500,
    dueAmount: 0,
    paymentDate: '2026-09-12',
    paymentMode: 'UPI',
    transactionId: 'UPI-98213812903',
    collectedBy: 'Mr. Alok Chhabra',
    remarks: 'Early bird payment discount applied',
    createdAt: '2026-09-12T11:20:00.000Z'
  },
  {
    id: 'pay-26-002',
    receiptNo: 'REC-2026-0892',
    studentId: 'std-1002',
    studentName: 'Ravi Kumar',
    admissionNo: 'ADM-26-1023',
    classId: 'cls-ukg',
    className: 'UKG',
    section: 'A',
    feeType: 'Tuition Fee (Quarterly)',
    amount: 12000,
    discount: 0,
    paidAmount: 7000,
    dueAmount: 5000,
    paymentDate: '2026-09-15',
    paymentMode: 'Cash',
    collectedBy: 'Mr. Alok Chhabra',
    remarks: '1st Installment paid',
    createdAt: '2026-09-15T14:10:00.000Z'
  },
  {
    id: 'pay-26-003',
    receiptNo: 'REC-2026-0893',
    studentId: 'std-1008',
    studentName: 'Kabir Mehta',
    admissionNo: 'ADM-26-3001',
    classId: 'cls-10',
    className: 'Class 10',
    section: 'A',
    feeType: 'Tuition Fee (Quarterly)',
    amount: 22000,
    discount: 0,
    paidAmount: 22000,
    dueAmount: 0,
    paymentDate: '2026-09-20',
    paymentMode: 'Bank Transfer',
    transactionId: 'HDFC-NEFT-92813',
    collectedBy: 'Mr. Alok Chhabra',
    remarks: 'Term 2 fee paid in full',
    createdAt: '2026-09-20T10:00:00.000Z'
  }
];

export const INITIAL_EXAMS: Exam[] = [
  { id: 'ex-01', name: 'Quarterly Assessment 2026', session: '2026-2027', startDate: '2026-09-15', endDate: '2026-09-22', status: 'Completed' },
  { id: 'ex-02', name: 'Mid-Term Examination 2026', session: '2026-2027', startDate: '2026-11-10', endDate: '2026-11-20', status: 'Upcoming' },
  { id: 'ex-03', name: 'Final Annual Examination', session: '2026-2027', startDate: '2027-02-25', endDate: '2027-03-10', status: 'Upcoming' }
];

export const INITIAL_MARKS: Mark[] = [
  {
    id: 'mrk-1001-eng',
    examId: 'ex-01',
    examName: 'Quarterly Assessment 2026',
    studentId: 'std-1001',
    studentName: 'Rahul Kumar',
    admissionNo: 'ADM-26-1001',
    classId: 'cls-ukg',
    className: 'UKG',
    section: 'A',
    subjectId: 'sub-ukg-eng',
    subjectName: 'English Phonics',
    maxMarks: 50,
    marksObtained: 46,
    grade: 'A+',
    remarks: 'Excellent phonics recognition',
    updatedAt: '2026-09-24T10:00:00.000Z'
  },
  {
    id: 'mrk-1001-math',
    examId: 'ex-01',
    examName: 'Quarterly Assessment 2026',
    studentId: 'std-1001',
    studentName: 'Rahul Kumar',
    admissionNo: 'ADM-26-1001',
    classId: 'cls-ukg',
    className: 'UKG',
    section: 'A',
    subjectId: 'sub-ukg-math',
    subjectName: 'Basic Mathematics',
    maxMarks: 50,
    marksObtained: 44,
    grade: 'A',
    remarks: 'Very good number counting skills',
    updatedAt: '2026-09-24T10:00:00.000Z'
  },
  {
    id: 'mrk-1002-eng',
    examId: 'ex-01',
    examName: 'Quarterly Assessment 2026',
    studentId: 'std-1002',
    studentName: 'Ravi Kumar',
    admissionNo: 'ADM-26-1023',
    classId: 'cls-ukg',
    className: 'UKG',
    section: 'A',
    subjectId: 'sub-ukg-eng',
    subjectName: 'English Phonics',
    maxMarks: 50,
    marksObtained: 41,
    grade: 'A',
    remarks: 'Good progress',
    updatedAt: '2026-09-24T10:00:00.000Z'
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-01',
    expenseId: 'EXP-2026-0104',
    category: 'Electricity',
    description: 'Main campus electricity bill for August-September 2026',
    amount: 28400,
    date: '2026-09-18',
    paymentMode: 'Bank Transfer',
    addedBy: 'Mr. Alok Chhabra',
    createdAt: '2026-09-18T12:00:00.000Z'
  },
  {
    id: 'exp-02',
    expenseId: 'EXP-2026-0105',
    category: 'Stationery',
    description: 'Exam answer sheets, question papers printing, and art supplies',
    amount: 14250,
    date: '2026-09-14',
    paymentMode: 'Cash',
    addedBy: 'Mr. Alok Chhabra',
    createdAt: '2026-09-14T15:30:00.000Z'
  },
  {
    id: 'exp-03',
    expenseId: 'EXP-2026-0106',
    category: 'Maintenance',
    description: 'Classroom AC servicing, laboratory repairs, and garden upkeep',
    amount: 18700,
    date: '2026-09-22',
    paymentMode: 'UPI',
    addedBy: 'Mr. Virendra Rathore',
    createdAt: '2026-09-22T16:00:00.000Z'
  }
];

export const INITIAL_SALARIES: SalaryRecord[] = [
  {
    id: 'sal-001',
    staffId: 'stf-001',
    staffName: 'Mrs. Neha Gupta',
    employeeId: 'EMP-1001',
    department: 'Teaching',
    month: 'September 2026',
    basicSalary: 38000,
    allowances: 3500,
    deductions: 1200,
    netSalary: 40300,
    paymentStatus: 'Paid',
    paymentDate: '2026-09-28',
    paymentMode: 'Bank Transfer',
    transactionId: 'SAL-NEFT-88123',
    createdAt: '2026-09-28T10:00:00.000Z'
  },
  {
    id: 'sal-002',
    staffId: 'stf-002',
    staffName: 'Dr. R. K. Mukherjee',
    employeeId: 'EMP-1002',
    department: 'Teaching',
    month: 'September 2026',
    basicSalary: 65000,
    allowances: 7000,
    deductions: 2500,
    netSalary: 69500,
    paymentStatus: 'Paid',
    paymentDate: '2026-09-28',
    paymentMode: 'Bank Transfer',
    transactionId: 'SAL-NEFT-88124',
    createdAt: '2026-09-28T10:00:00.000Z'
  }
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'not-01',
    title: 'Gandhi Jayanti Holiday Announcement',
    description: 'The school will remain closed on 2nd October 2026 on the occasion of Mahatma Gandhi Jayanti. Regular classes will resume on 3rd October.',
    date: '2026-09-29',
    audience: 'Everyone',
    priority: 'High',
    authorName: 'Principal Office',
    createdAt: '2026-09-29T10:00:00.000Z'
  },
  {
    id: 'not-02',
    title: 'Mid-Term Examination Syllabus & Schedule Release',
    description: 'The detailed date sheet and syllabus for Mid-Term Exams starting 10th November 2026 has been published in the Academics section.',
    date: '2026-09-28',
    audience: 'Students',
    priority: 'Medium',
    authorName: 'Examination Department',
    createdAt: '2026-09-28T14:30:00.000Z'
  },
  {
    id: 'not-03',
    title: 'Quarterly Parent-Teacher Meeting (PTM)',
    description: 'PTM for Nursery to Class 10 will be conducted on Saturday, 10th October 2026 from 9:00 AM to 1:00 PM. Parents are requested to attend on time.',
    date: '2026-09-27',
    audience: 'Parents',
    priority: 'High',
    authorName: 'Principal Office',
    createdAt: '2026-09-27T09:15:00.000Z'
  }
];

export const INITIAL_SETTINGS: SchoolSettings = {
  schoolName: 'ScholarSync International Academy',
  tagline: 'Excellence in Education, Integrity in Character',
  logoUrl: '',
  phone: '+91 (141) 278-9000',
  email: 'info@scholarsync.edu',
  address: 'Sector 5, Knowledge Park, Mansarovar, Jaipur, Rajasthan 302020',
  affiliationNo: 'CBSE/AFF/1730452',
  principalName: 'Dr. Harsh Vardhan',
  academicSession: '2026-2027',
  currencySymbol: '₹'
};

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-01',
    action: 'System Initialized',
    module: 'System',
    details: 'Database initialized with core classes, students, and academic session 2026-2027',
    performedBy: 'System',
    timestamp: '2026-09-25T08:00:00.000Z'
  },
  {
    id: 'aud-02',
    action: 'Attendance Saved',
    module: 'Attendance',
    details: 'Attendance marked for Class UKG - Section A (5 students recorded)',
    performedBy: 'Mrs. Neha Gupta',
    timestamp: '2026-09-25T09:15:00.000Z'
  }
];

// Initial attendance records for UKG - A on 2026-09-25 and today (2026-09-30)
export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  // 2026-09-25 matching the reference specification
  { id: 'att-25-1', studentId: 'std-1001', studentAdmissionNo: 'ADM-26-1001', studentName: 'Rahul Kumar', classId: 'cls-ukg', className: 'UKG', section: 'A', date: '2026-09-25', status: 'PRESENT', markedBy: 'Mrs. Neha Gupta', createdAt: '2026-09-25T09:15:00.000Z', updatedAt: '2026-09-25T09:15:00.000Z' },
  { id: 'att-25-2', studentId: 'std-1002', studentAdmissionNo: 'ADM-26-1023', studentName: 'Ravi Kumar', classId: 'cls-ukg', className: 'UKG', section: 'A', date: '2026-09-25', status: 'PRESENT', markedBy: 'Mrs. Neha Gupta', createdAt: '2026-09-25T09:15:00.000Z', updatedAt: '2026-09-25T09:15:00.000Z' },
  { id: 'att-25-3', studentId: 'std-1003', studentAdmissionNo: 'ADM-26-1045', studentName: 'Aman Khan', classId: 'cls-ukg', className: 'UKG', section: 'A', date: '2026-09-25', status: 'PRESENT', markedBy: 'Mrs. Neha Gupta', createdAt: '2026-09-25T09:15:00.000Z', updatedAt: '2026-09-25T09:15:00.000Z' },
  { id: 'att-25-4', studentId: 'std-1004', studentAdmissionNo: 'ADM-26-1062', studentName: 'Arman Ali', classId: 'cls-ukg', className: 'UKG', section: 'A', date: '2026-09-25', status: 'ABSENT', markedBy: 'Mrs. Neha Gupta', createdAt: '2026-09-25T09:15:00.000Z', updatedAt: '2026-09-25T09:15:00.000Z' },
  { id: 'att-25-5', studentId: 'std-1005', studentAdmissionNo: 'ADM-26-1080', studentName: 'Priya Sharma', classId: 'cls-ukg', className: 'UKG', section: 'A', date: '2026-09-25', status: 'PRESENT', markedBy: 'Mrs. Neha Gupta', createdAt: '2026-09-25T09:15:00.000Z', updatedAt: '2026-09-25T09:15:00.000Z' },

  // 2026-09-30 (Today)
  { id: 'att-30-1', studentId: 'std-1001', studentAdmissionNo: 'ADM-26-1001', studentName: 'Rahul Kumar', classId: 'cls-ukg', className: 'UKG', section: 'A', date: '2026-09-30', status: 'PRESENT', markedBy: 'Mrs. Neha Gupta', createdAt: '2026-09-30T08:45:00.000Z', updatedAt: '2026-09-30T08:45:00.000Z' },
  { id: 'att-30-2', studentId: 'std-1002', studentAdmissionNo: 'ADM-26-1023', studentName: 'Ravi Kumar', classId: 'cls-ukg', className: 'UKG', section: 'A', date: '2026-09-30', status: 'PRESENT', markedBy: 'Mrs. Neha Gupta', createdAt: '2026-09-30T08:45:00.000Z', updatedAt: '2026-09-30T08:45:00.000Z' },
  { id: 'att-30-3', studentId: 'std-1003', studentAdmissionNo: 'ADM-26-1045', studentName: 'Aman Khan', classId: 'cls-ukg', className: 'UKG', section: 'A', date: '2026-09-30', status: 'LEAVE', remarks: 'Medical leave submitted', markedBy: 'Mrs. Neha Gupta', createdAt: '2026-09-30T08:45:00.000Z', updatedAt: '2026-09-30T08:45:00.000Z' },
  { id: 'att-30-4', studentId: 'std-1004', studentAdmissionNo: 'ADM-26-1062', studentName: 'Arman Ali', classId: 'cls-ukg', className: 'UKG', section: 'A', date: '2026-09-30', status: 'PRESENT', markedBy: 'Mrs. Neha Gupta', createdAt: '2026-09-30T08:45:00.000Z', updatedAt: '2026-09-30T08:45:00.000Z' },
  { id: 'att-30-5', studentId: 'std-1005', studentAdmissionNo: 'ADM-26-1080', studentName: 'Priya Sharma', classId: 'cls-ukg', className: 'UKG', section: 'A', date: '2026-09-30', status: 'PRESENT', markedBy: 'Mrs. Neha Gupta', createdAt: '2026-09-30T08:45:00.000Z', updatedAt: '2026-09-30T08:45:00.000Z' },

  // Class 5 - A for today
  { id: 'att-30-6', studentId: 'std-1006', studentAdmissionNo: 'ADM-26-2010', studentName: 'Ananya Deshmukh', classId: 'cls-5', className: 'Class 5', section: 'A', date: '2026-09-30', status: 'PRESENT', markedBy: 'Mr. Vikram Singh', createdAt: '2026-09-30T08:50:00.000Z', updatedAt: '2026-09-30T08:50:00.000Z' },
  { id: 'att-30-7', studentId: 'std-1007', studentAdmissionNo: 'ADM-26-2011', studentName: 'Devansh Singhania', classId: 'cls-5', className: 'Class 5', section: 'A', date: '2026-09-30', status: 'ABSENT', markedBy: 'Mr. Vikram Singh', createdAt: '2026-09-30T08:50:00.000Z', updatedAt: '2026-09-30T08:50:00.000Z' }
];

// ============================================================================
// 3. STORAGE LAYER (LOCALSTORAGE WITH MEMORY FALLBACK)
// ============================================================================

const STORAGE_KEYS = {
  CLASSES: 'scholarsync_classes',
  STUDENTS: 'scholarsync_students',
  STAFF: 'scholarsync_staff',
  USERS: 'scholarsync_users',
  CURRENT_USER: 'scholarsync_current_user',
  ATTENDANCE: 'scholarsync_attendance',
  SUBJECTS: 'scholarsync_subjects',
  FEE_STRUCTURES: 'scholarsync_fee_structures',
  FEE_PAYMENTS: 'scholarsync_fee_payments',
  FEE_DELETIONS: 'scholarsync_fee_deletions',
  EXAMS: 'scholarsync_exams',
  MARKS: 'scholarsync_marks',
  EXPENSES: 'scholarsync_expenses',
  SALARIES: 'scholarsync_salaries',
  NOTICES: 'scholarsync_notices',
  SETTINGS: 'scholarsync_settings',
  AUDIT_LOGS: 'scholarsync_audit_logs'
};

const memoryStore: Record<string, string> = {};

function getItem<T>(key: string, defaultVal: T): T {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem(key);
      if (stored !== null) {
        return JSON.parse(stored) as T;
      }
    } else if (memoryStore[key]) {
      return JSON.parse(memoryStore[key]) as T;
    }
  } catch (err) {
    console.warn(`Error reading ${key} from storage:`, err);
  }
  return defaultVal;
}

function setItem<T>(key: string, value: T): void {
  try {
    const serialized = JSON.stringify(value);
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, serialized);
    }
    memoryStore[key] = serialized;
  } catch (err) {
    console.warn(`Error writing ${key} to storage:`, err);
  }
}

// Initializer to seed database on first run
export function initializeDatabase(): void {
  if (typeof window === 'undefined') return;

  if (!window.localStorage.getItem(STORAGE_KEYS.CLASSES)) {
    setItem(STORAGE_KEYS.CLASSES, INITIAL_CLASSES);
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
    setItem(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.STAFF)) {
    setItem(STORAGE_KEYS.STAFF, INITIAL_STAFF);
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.USERS)) {
    setItem(STORAGE_KEYS.USERS, INITIAL_USERS);
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    setItem(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]); // default Super Admin
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) {
    setItem(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.SUBJECTS)) {
    setItem(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS);
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.FEE_STRUCTURES)) {
    setItem(STORAGE_KEYS.FEE_STRUCTURES, INITIAL_FEE_STRUCTURES);
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.FEE_PAYMENTS)) {
    setItem(STORAGE_KEYS.FEE_PAYMENTS, INITIAL_FEE_PAYMENTS);
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.FEE_DELETIONS)) {
    setItem(STORAGE_KEYS.FEE_DELETIONS, []);
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.EXAMS)) {
    setItem(STORAGE_KEYS.EXAMS, INITIAL_EXAMS);
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.MARKS)) {
    setItem(STORAGE_KEYS.MARKS, INITIAL_MARKS);
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.EXPENSES)) {
    setItem(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES);
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.SALARIES)) {
    setItem(STORAGE_KEYS.SALARIES, INITIAL_SALARIES);
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.NOTICES)) {
    setItem(STORAGE_KEYS.NOTICES, INITIAL_NOTICES);
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    setItem(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
    setItem(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  }
}

// Auto-run initialization
initializeDatabase();

// Helper delay to mimic Supabase network latency if desired
const delay = (ms = 30) => new Promise(res => setTimeout(res, ms));

// ============================================================================
// 4. HELPER UTILITIES
// ============================================================================

export function calculateGrade(percentage: number): string {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  if (percentage >= 40) return 'D';
  return 'F';
}

export function calculateNetSalary(basic: number, allowances: number, deductions: number): number {
  return Math.max(0, basic + allowances - deductions);
}

export function generateReceiptNo(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `REC-${year}-${randomNum}`;
}

export function generateAdmissionNo(): string {
  const yearShort = new Date().getFullYear().toString().slice(-2);
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `ADM-${yearShort}-${randomNum}`;
}

export function generateEmployeeId(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `EMP-${randomNum}`;
}

export function generateExpenseId(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(100 + Math.random() * 900);
  return `EXP-${year}-${randomNum}`;
}

// ============================================================================
// 5. CRUD SERVICE METHODS (SUPABASE-READY ASYNC CONTRACTS)
// ============================================================================

export const dataService = {
  // --------------------------------------------------------------------------
  // Audit Logging
  // --------------------------------------------------------------------------
  async logAction(action: string, module: string, details: string, performedBy?: string): Promise<AuditLog> {
    await delay(10);
    const logs = getItem<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    const currentUser = getItem<User | null>(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
    
    const newLog: AuditLog = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      action,
      module,
      details,
      performedBy: performedBy || currentUser?.name || 'System',
      timestamp: new Date().toISOString()
    };

    logs.unshift(newLog);
    // Keep max 500 logs to prevent unbounded storage growth
    setItem(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 500));
    return newLog;
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    await delay();
    return getItem<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  },

  // --------------------------------------------------------------------------
  // Authentication & Users
  // --------------------------------------------------------------------------
  async getCurrentUser(): Promise<User> {
    await delay();
    const user = getItem<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (!user) {
      setItem(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
      return INITIAL_USERS[0];
    }
    return user;
  },

  async setCurrentUser(roleOrUser: UserRole | User): Promise<User> {
    await delay();
    let targetUser: User;
    if (typeof roleOrUser === 'string') {
      const users = getItem<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
      targetUser = users.find(u => u.role === roleOrUser) || {
        id: `usr-${roleOrUser}`,
        email: `${roleOrUser}@scholarsync.edu`,
        name: `${roleOrUser.replace('_', ' ').toUpperCase()}`,
        role: roleOrUser,
        status: 'Active',
        createdAt: new Date().toISOString()
      };
    } else {
      targetUser = roleOrUser;
    }
    setItem(STORAGE_KEYS.CURRENT_USER, targetUser);
    await this.logAction('User Switch', 'Authentication', `Switched active user to ${targetUser.name} (${targetUser.role})`, targetUser.name);
    return targetUser;
  },

  async getUsers(): Promise<User[]> {
    await delay();
    return getItem<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  },

  // --------------------------------------------------------------------------
  // Classes & Sections
  // --------------------------------------------------------------------------
  async getClasses(): Promise<SchoolClass[]> {
    await delay();
    return getItem<SchoolClass[]>(STORAGE_KEYS.CLASSES, INITIAL_CLASSES);
  },

  async getClassById(classId: string): Promise<SchoolClass | null> {
    await delay();
    const classes = getItem<SchoolClass[]>(STORAGE_KEYS.CLASSES, INITIAL_CLASSES);
    return classes.find(c => c.id === classId) || null;
  },

  // --------------------------------------------------------------------------
  // Students CRUD
  // --------------------------------------------------------------------------
  async getStudents(filters?: {
    classId?: string;
    section?: string;
    status?: 'Active' | 'Inactive' | 'Archived' | 'Passed Out' | 'All';
    search?: string;
  }): Promise<Student[]> {
    await delay();
    let students = getItem<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);

    if (filters) {
      if (filters.classId && filters.classId !== 'all') {
        students = students.filter(s => s.classId === filters.classId);
      }
      if (filters.section && filters.section !== 'all') {
        students = students.filter(s => s.section.toLowerCase() === filters.section?.toLowerCase());
      }
      if (filters.status && filters.status !== 'All') {
        students = students.filter(s => s.status === filters.status);
      }
      if (filters.search && filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        students = students.filter(s =>
          s.name.toLowerCase().includes(query) ||
          s.admissionNo.toLowerCase().includes(query) ||
          s.rollNo.toLowerCase().includes(query) ||
          s.fatherName.toLowerCase().includes(query) ||
          s.mobile.includes(query) ||
          s.className.toLowerCase().includes(query)
        );
      }
    }

    return students;
  },

  async getStudentById(id: string): Promise<Student | null> {
    await delay();
    const students = getItem<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
    return students.find(s => s.id === id) || null;
  },

  async createStudent(studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt' | 'admissionNo'> & { admissionNo?: string }): Promise<Student> {
    await delay();
    const students = getItem<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
    
    // Auto-generate admission number if missing
    const admissionNo = studentData.admissionNo || generateAdmissionNo();
    const newStudent: Student = {
      ...studentData,
      id: `std-${Date.now()}`,
      admissionNo,
      status: studentData.status || 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    students.unshift(newStudent);
    setItem(STORAGE_KEYS.STUDENTS, students);
    await this.logAction('New Admission', 'Students', `Added new student ${newStudent.name} (${newStudent.admissionNo}) into ${newStudent.className} - ${newStudent.section}`);
    return newStudent;
  },

  async updateStudent(id: string, updates: Partial<Student>): Promise<Student> {
    await delay();
    const students = getItem<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
    const index = students.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error(`Student with id "${id}" not found.`);
    }

    const updatedStudent: Student = {
      ...students[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    students[index] = updatedStudent;
    setItem(STORAGE_KEYS.STUDENTS, students);
    await this.logAction('Update Student', 'Students', `Updated details for ${updatedStudent.name} (${updatedStudent.admissionNo})`);
    return updatedStudent;
  },

  async deleteStudent(id: string): Promise<boolean> {
    await delay();
    const students = getItem<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
    const student = students.find(s => s.id === id);
    if (!student) return false;

    const filtered = students.filter(s => s.id !== id);
    setItem(STORAGE_KEYS.STUDENTS, filtered);
    await this.logAction('Delete Student', 'Students', `Permanently deleted record for ${student.name} (${student.admissionNo})`);
    return true;
  },

  async archiveStudent(id: string, reason = 'Archived'): Promise<Student> {
    return this.updateStudent(id, { status: 'Archived' });
  },

  // --------------------------------------------------------------------------
  // DAILY ATTENDANCE (CORE MODULE)
  // --------------------------------------------------------------------------
  async getAttendance(query: {
    classId: string;
    section: string;
    date: string; // YYYY-MM-DD
  }): Promise<AttendanceRecord[]> {
    await delay();
    const records = getItem<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
    return records.filter(r => 
      r.classId === query.classId &&
      r.section.toLowerCase() === query.section.toLowerCase() &&
      r.date === query.date
    );
  },

  async checkAttendanceExists(classId: string, section: string, date: string): Promise<boolean> {
    const existing = await this.getAttendance({ classId, section, date });
    return existing.length > 0;
  },

  async saveAttendance(params: {
    classId: string;
    className: string;
    section: string;
    date: string;
    markedBy: string;
    records: Array<{
      studentId: string;
      studentAdmissionNo: string;
      studentName: string;
      status: AttendanceStatus;
      remarks?: string;
    }>;
  }): Promise<{ savedCount: number; message: string }> {
    await delay();
    const allRecords = getItem<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);

    // Remove any previous records for the exact class, section and date to prevent duplicates
    const filtered = allRecords.filter(r => 
      !(r.classId === params.classId && r.section.toLowerCase() === params.section.toLowerCase() && r.date === params.date)
    );

    const nowIso = new Date().toISOString();
    const newRecords: AttendanceRecord[] = params.records.map(rec => ({
      id: `att-${Date.now()}-${rec.studentId}`,
      studentId: rec.studentId,
      studentAdmissionNo: rec.studentAdmissionNo,
      studentName: rec.studentName,
      classId: params.classId,
      className: params.className,
      section: params.section,
      date: params.date,
      status: rec.status,
      remarks: rec.remarks,
      markedBy: params.markedBy,
      createdAt: nowIso,
      updatedAt: nowIso
    }));

    filtered.push(...newRecords);
    setItem(STORAGE_KEYS.ATTENDANCE, filtered);

    const presentCount = params.records.filter(r => r.status === 'PRESENT').length;
    const absentCount = params.records.filter(r => r.status === 'ABSENT').length;
    const leaveCount = params.records.filter(r => r.status === 'LEAVE').length;

    await this.logAction(
      'Attendance Saved',
      'Academics',
      `Marked attendance for ${params.className} - ${params.section} on ${params.date} (${presentCount} P, ${absentCount} A, ${leaveCount} L) by ${params.markedBy}`,
      params.markedBy
    );

    return {
      savedCount: newRecords.length,
      message: `Attendance for ${params.className} - ${params.section} on ${params.date} saved successfully.`
    };
  },

  async getAttendanceReport(filters: {
    classId?: string;
    section?: string;
    startDate?: string;
    endDate?: string;
    studentId?: string;
  }): Promise<AttendanceReportRow[]> {
    await delay();
    const students = await this.getStudents({
      classId: filters.classId,
      section: filters.section,
      status: 'Active'
    });

    const allAttendance = getItem<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);

    // Filter attendance by date range if provided
    const relevantAttendance = allAttendance.filter(r => {
      if (filters.classId && filters.classId !== 'all' && r.classId !== filters.classId) return false;
      if (filters.section && filters.section !== 'all' && r.section.toLowerCase() !== filters.section.toLowerCase()) return false;
      if (filters.startDate && r.date < filters.startDate) return false;
      if (filters.endDate && r.date > filters.endDate) return false;
      if (filters.studentId && r.studentId !== filters.studentId) return false;
      return true;
    });

    // Unique working dates in this period
    const uniqueDates = Array.from(new Set(relevantAttendance.map(r => r.date)));
    const totalWorkingDays = Math.max(uniqueDates.length, 1);

    const report: AttendanceReportRow[] = students.map(student => {
      const studentRecords = relevantAttendance.filter(r => r.studentId === student.id);
      const presentDays = studentRecords.filter(r => r.status === 'PRESENT').length;
      const absentDays = studentRecords.filter(r => r.status === 'ABSENT').length;
      const leaveDays = studentRecords.filter(r => r.status === 'LEAVE').length;
      const recordedDays = presentDays + absentDays + leaveDays;
      const effectiveWorkingDays = recordedDays > 0 ? recordedDays : totalWorkingDays;
      const percentage = effectiveWorkingDays > 0 ? Math.round((presentDays / effectiveWorkingDays) * 100) : 100;

      return {
        studentId: student.id,
        admissionNo: student.admissionNo,
        studentName: student.name,
        className: student.className,
        section: student.section,
        totalWorkingDays: effectiveWorkingDays,
        presentDays,
        absentDays,
        leaveDays,
        attendancePercentage: percentage
      };
    });

    return report;
  },

  // --------------------------------------------------------------------------
  // FEES & PAYMENTS
  // --------------------------------------------------------------------------
  async getFeeStructures(classId?: string): Promise<FeeStructure[]> {
    await delay();
    const structures = getItem<FeeStructure[]>(STORAGE_KEYS.FEE_STRUCTURES, INITIAL_FEE_STRUCTURES);
    if (classId && classId !== 'all') {
      return structures.filter(fs => fs.classId === classId);
    }
    return structures;
  },

  async getFeePayments(filters?: {
    studentId?: string;
    classId?: string;
    search?: string;
  }): Promise<FeePayment[]> {
    await delay();
    let payments = getItem<FeePayment[]>(STORAGE_KEYS.FEE_PAYMENTS, INITIAL_FEE_PAYMENTS);

    if (filters) {
      if (filters.studentId) {
        payments = payments.filter(p => p.studentId === filters.studentId);
      }
      if (filters.classId && filters.classId !== 'all') {
        payments = payments.filter(p => p.classId === filters.classId);
      }
      if (filters.search && filters.search.trim()) {
        const q = filters.search.toLowerCase().trim();
        payments = payments.filter(p => 
          p.studentName.toLowerCase().includes(q) ||
          p.receiptNo.toLowerCase().includes(q) ||
          p.admissionNo.toLowerCase().includes(q) ||
          p.feeType.toLowerCase().includes(q)
        );
      }
    }

    return payments.sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
  },

  async createFeePayment(paymentData: Omit<FeePayment, 'id' | 'receiptNo' | 'createdAt'>): Promise<FeePayment> {
    await delay();
    const payments = getItem<FeePayment[]>(STORAGE_KEYS.FEE_PAYMENTS, INITIAL_FEE_PAYMENTS);
    const receiptNo = generateReceiptNo();

    const newPayment: FeePayment = {
      ...paymentData,
      id: `pay-${Date.now()}`,
      receiptNo,
      createdAt: new Date().toISOString()
    };

    payments.unshift(newPayment);
    setItem(STORAGE_KEYS.FEE_PAYMENTS, payments);
    await this.logAction(
      'Fee Collection',
      'Finance',
      `Collected ₹${newPayment.paidAmount} (${newPayment.feeType}) from ${newPayment.studentName} (${newPayment.admissionNo}) via ${newPayment.paymentMode} - Receipt: ${receiptNo}`
    );
    return newPayment;
  },

  async deleteFeePayment(paymentId: string, reason: string, user: string): Promise<boolean> {
    await delay();
    const payments = getItem<FeePayment[]>(STORAGE_KEYS.FEE_PAYMENTS, INITIAL_FEE_PAYMENTS);
    const payment = payments.find(p => p.id === paymentId);
    if (!payment) return false;

    // Log deletion into FeeDeletionLog for audit safety
    const deletions = getItem<FeeDeletionLog[]>(STORAGE_KEYS.FEE_DELETIONS, []);
    deletions.unshift({
      id: `del-${Date.now()}`,
      paymentId: payment.id,
      receiptNo: payment.receiptNo,
      studentName: payment.studentName,
      amount: payment.paidAmount,
      deletedBy: user,
      deletionReason: reason,
      deletedAt: new Date().toISOString()
    });
    setItem(STORAGE_KEYS.FEE_DELETIONS, deletions);

    const filtered = payments.filter(p => p.id !== paymentId);
    setItem(STORAGE_KEYS.FEE_PAYMENTS, filtered);

    await this.logAction('Fee Payment Deleted', 'Finance', `Deleted receipt ${payment.receiptNo} of ₹${payment.paidAmount} for ${payment.studentName}. Reason: ${reason}`, user);
    return true;
  },

  async getFeeDeletionLogs(): Promise<FeeDeletionLog[]> {
    await delay();
    return getItem<FeeDeletionLog[]>(STORAGE_KEYS.FEE_DELETIONS, []);
  },

  async getStudentFeeSummary(studentId: string): Promise<{
    totalFees: number;
    totalPaid: number;
    totalDiscount: number;
    pendingDue: number;
    payments: FeePayment[];
  }> {
    const student = await this.getStudentById(studentId);
    if (!student) {
      return { totalFees: 0, totalPaid: 0, totalDiscount: 0, pendingDue: 0, payments: [] };
    }

    const structures = await this.getFeeStructures(student.classId);
    const payments = await this.getFeePayments({ studentId });

    const totalFees = structures.reduce((sum, fs) => sum + fs.amount, 0);
    const totalPaid = payments.reduce((sum, p) => sum + p.paidAmount, 0);
    const totalDiscount = payments.reduce((sum, p) => sum + p.discount, 0);
    const pendingDue = Math.max(0, totalFees - (totalPaid + totalDiscount));

    return {
      totalFees,
      totalPaid,
      totalDiscount,
      pendingDue,
      payments
    };
  },

  // --------------------------------------------------------------------------
  // EXAMS & MARKS
  // --------------------------------------------------------------------------
  async getExams(): Promise<Exam[]> {
    await delay();
    return getItem<Exam[]>(STORAGE_KEYS.EXAMS, INITIAL_EXAMS);
  },

  async getSubjects(classId?: string): Promise<Subject[]> {
    await delay();
    const subjects = getItem<Subject[]>(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS);
    if (classId && classId !== 'all') {
      return subjects.filter(s => s.classId === classId);
    }
    return subjects;
  },

  async getMarks(filters: {
    examId?: string;
    classId?: string;
    subjectId?: string;
    studentId?: string;
  }): Promise<Mark[]> {
    await delay();
    let marks = getItem<Mark[]>(STORAGE_KEYS.MARKS, INITIAL_MARKS);

    if (filters.examId && filters.examId !== 'all') {
      marks = marks.filter(m => m.examId === filters.examId);
    }
    if (filters.classId && filters.classId !== 'all') {
      marks = marks.filter(m => m.classId === filters.classId);
    }
    if (filters.subjectId && filters.subjectId !== 'all') {
      marks = marks.filter(m => m.subjectId === filters.subjectId);
    }
    if (filters.studentId) {
      marks = marks.filter(m => m.studentId === filters.studentId);
    }

    return marks;
  },

  async saveMarks(marksList: Array<Omit<Mark, 'id' | 'updatedAt' | 'grade'> & { grade?: string }>): Promise<{ savedCount: number }> {
    await delay();
    const allMarks = getItem<Mark[]>(STORAGE_KEYS.MARKS, INITIAL_MARKS);

    const nowIso = new Date().toISOString();
    marksList.forEach(item => {
      const existingIndex = allMarks.findIndex(m => 
        m.examId === item.examId && 
        m.studentId === item.studentId && 
        m.subjectId === item.subjectId
      );

      const percentage = (item.marksObtained / (item.maxMarks || 100)) * 100;
      const grade = calculateGrade(percentage);

      const updatedRecord: Mark = {
        ...item,
        id: existingIndex !== -1 ? allMarks[existingIndex].id : `mrk-${Date.now()}-${item.studentId}`,
        grade,
        updatedAt: nowIso
      };

      if (existingIndex !== -1) {
        allMarks[existingIndex] = updatedRecord;
      } else {
        allMarks.push(updatedRecord);
      }
    });

    setItem(STORAGE_KEYS.MARKS, allMarks);
    await this.logAction('Marks Recorded', 'Academics', `Recorded marks for ${marksList.length} student entries`);
    return { savedCount: marksList.length };
  },

  // --------------------------------------------------------------------------
  // STAFF & PAYROLL
  // --------------------------------------------------------------------------
  async getStaff(filters?: { department?: string; status?: string; search?: string }): Promise<Staff[]> {
    await delay();
    let staff = getItem<Staff[]>(STORAGE_KEYS.STAFF, INITIAL_STAFF);

    if (filters) {
      if (filters.department && filters.department !== 'All') {
        staff = staff.filter(s => s.department === filters.department);
      }
      if (filters.status && filters.status !== 'All') {
        staff = staff.filter(s => s.status === filters.status);
      }
      if (filters.search && filters.search.trim()) {
        const q = filters.search.toLowerCase().trim();
        staff = staff.filter(s => 
          s.name.toLowerCase().includes(q) ||
          s.employeeId.toLowerCase().includes(q) ||
          s.designation.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q)
        );
      }
    }

    return staff;
  },

  async createStaff(staffData: Omit<Staff, 'id' | 'createdAt'>): Promise<Staff> {
    await delay();
    const staff = getItem<Staff[]>(STORAGE_KEYS.STAFF, INITIAL_STAFF);
    const newStaff: Staff = {
      ...staffData,
      id: `stf-${Date.now()}`,
      employeeId: staffData.employeeId || generateEmployeeId(),
      createdAt: new Date().toISOString()
    };

    staff.unshift(newStaff);
    setItem(STORAGE_KEYS.STAFF, staff);
    await this.logAction('Staff Onboarded', 'Staff/Payroll', `Added staff member ${newStaff.name} (${newStaff.employeeId}, ${newStaff.designation})`);
    return newStaff;
  },

  async updateStaff(id: string, updates: Partial<Staff>): Promise<Staff> {
    await delay();
    const staff = getItem<Staff[]>(STORAGE_KEYS.STAFF, INITIAL_STAFF);
    const index = staff.findIndex(s => s.id === id);
    if (index === -1) throw new Error(`Staff with id "${id}" not found.`);

    const updated = { ...staff[index], ...updates };
    staff[index] = updated;
    setItem(STORAGE_KEYS.STAFF, staff);
    await this.logAction('Staff Updated', 'Staff/Payroll', `Updated profile of ${updated.name} (${updated.employeeId})`);
    return updated;
  },

  async deleteStaff(id: string): Promise<boolean> {
    await delay();
    const staff = getItem<Staff[]>(STORAGE_KEYS.STAFF, INITIAL_STAFF);
    const item = staff.find(s => s.id === id);
    if (!item) return false;

    const filtered = staff.filter(s => s.id !== id);
    setItem(STORAGE_KEYS.STAFF, filtered);
    await this.logAction('Staff Deleted', 'Staff/Payroll', `Deleted staff record for ${item.name} (${item.employeeId})`);
    return true;
  },

  async getSalaries(month?: string): Promise<SalaryRecord[]> {
    await delay();
    const salaries = getItem<SalaryRecord[]>(STORAGE_KEYS.SALARIES, INITIAL_SALARIES);
    if (month && month !== 'All') {
      return salaries.filter(s => s.month === month);
    }
    return salaries;
  },

  async createSalaryRecord(record: Omit<SalaryRecord, 'id' | 'createdAt'>): Promise<SalaryRecord> {
    await delay();
    const salaries = getItem<SalaryRecord[]>(STORAGE_KEYS.SALARIES, INITIAL_SALARIES);
    const newRecord: SalaryRecord = {
      ...record,
      id: `sal-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    salaries.unshift(newRecord);
    setItem(STORAGE_KEYS.SALARIES, salaries);
    await this.logAction('Salary Processed', 'Staff/Payroll', `Processed salary of ₹${newRecord.netSalary} for ${newRecord.staffName} (${newRecord.month})`);
    return newRecord;
  },

  // --------------------------------------------------------------------------
  // EXPENSES
  // --------------------------------------------------------------------------
  async getExpenses(filters?: { category?: string; search?: string }): Promise<Expense[]> {
    await delay();
    let expenses = getItem<Expense[]>(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES);

    if (filters) {
      if (filters.category && filters.category !== 'All') {
        expenses = expenses.filter(e => e.category === filters.category);
      }
      if (filters.search && filters.search.trim()) {
        const q = filters.search.toLowerCase().trim();
        expenses = expenses.filter(e => 
          e.description.toLowerCase().includes(q) ||
          e.expenseId.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q)
        );
      }
    }

    return expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async createExpense(expenseData: Omit<Expense, 'id' | 'expenseId' | 'createdAt'>): Promise<Expense> {
    await delay();
    const expenses = getItem<Expense[]>(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES);
    const newExpense: Expense = {
      ...expenseData,
      id: `exp-${Date.now()}`,
      expenseId: generateExpenseId(),
      createdAt: new Date().toISOString()
    };

    expenses.unshift(newExpense);
    setItem(STORAGE_KEYS.EXPENSES, expenses);
    await this.logAction('Expense Logged', 'Finance', `Logged ₹${newExpense.amount} for ${newExpense.category} - ${newExpense.description}`);
    return newExpense;
  },

  async deleteExpense(id: string): Promise<boolean> {
    await delay();
    const expenses = getItem<Expense[]>(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES);
    const item = expenses.find(e => e.id === id);
    if (!item) return false;

    const filtered = expenses.filter(e => e.id !== id);
    setItem(STORAGE_KEYS.EXPENSES, filtered);
    await this.logAction('Expense Deleted', 'Finance', `Removed expense ${item.expenseId} of ₹${item.amount}`);
    return true;
  },

  // --------------------------------------------------------------------------
  // NOTICES
  // --------------------------------------------------------------------------
  async getNotices(audience?: string): Promise<Notice[]> {
    await delay();
    let notices = getItem<Notice[]>(STORAGE_KEYS.NOTICES, INITIAL_NOTICES);
    if (audience && audience !== 'Everyone') {
      notices = notices.filter(n => n.audience === 'Everyone' || n.audience === audience);
    }
    return notices.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async createNotice(noticeData: Omit<Notice, 'id' | 'createdAt'>): Promise<Notice> {
    await delay();
    const notices = getItem<Notice[]>(STORAGE_KEYS.NOTICES, INITIAL_NOTICES);
    const newNotice: Notice = {
      ...noticeData,
      id: `not-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    notices.unshift(newNotice);
    setItem(STORAGE_KEYS.NOTICES, notices);
    await this.logAction('Notice Published', 'Communication', `Published notice "${newNotice.title}" to ${newNotice.audience}`);
    return newNotice;
  },

  async deleteNotice(id: string): Promise<boolean> {
    await delay();
    const notices = getItem<Notice[]>(STORAGE_KEYS.NOTICES, INITIAL_NOTICES);
    const item = notices.find(n => n.id === id);
    if (!item) return false;

    const filtered = notices.filter(n => n.id !== id);
    setItem(STORAGE_KEYS.NOTICES, filtered);
    await this.logAction('Notice Deleted', 'Communication', `Deleted notice "${item.title}"`);
    return true;
  },

  // --------------------------------------------------------------------------
  // SCHOOL SETTINGS
  // --------------------------------------------------------------------------
  async getSettings(): Promise<SchoolSettings> {
    await delay();
    return getItem<SchoolSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  },

  async updateSettings(updates: Partial<SchoolSettings>): Promise<SchoolSettings> {
    await delay();
    const current = getItem<SchoolSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    const updated = { ...current, ...updates };
    setItem(STORAGE_KEYS.SETTINGS, updated);
    await this.logAction('Settings Updated', 'Admin', 'Updated school configuration and contact information');
    return updated;
  },

  // --------------------------------------------------------------------------
  // DASHBOARD AGGREGATE STATS
  // --------------------------------------------------------------------------
  async getDashboardStats(selectedDate = '2026-09-30'): Promise<DashboardStats> {
    await delay();
    const students = getItem<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
    const staff = getItem<Staff[]>(STORAGE_KEYS.STAFF, INITIAL_STAFF);
    const attendance = getItem<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
    const payments = getItem<FeePayment[]>(STORAGE_KEYS.FEE_PAYMENTS, INITIAL_FEE_PAYMENTS);
    const expenses = getItem<Expense[]>(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES);
    const notices = getItem<Notice[]>(STORAGE_KEYS.NOTICES, INITIAL_NOTICES);
    const classes = getItem<SchoolClass[]>(STORAGE_KEYS.CLASSES, INITIAL_CLASSES);

    const activeStudents = students.filter(s => s.status === 'Active');
    const totalStudents = activeStudents.length;
    const totalTeachers = staff.filter(s => s.department === 'Teaching' && s.status === 'Active').length;

    // Attendance stats for selectedDate
    const dateAttendance = attendance.filter(a => a.date === selectedDate);
    const presentToday = dateAttendance.filter(a => a.status === 'PRESENT').length;
    const absentToday = dateAttendance.filter(a => a.status === 'ABSENT').length;
    const onLeaveToday = dateAttendance.filter(a => a.status === 'LEAVE').length;
    const totalMarkedToday = presentToday + absentToday + onLeaveToday;
    const attendancePercentageToday = totalMarkedToday > 0 ? Math.round((presentToday / totalMarkedToday) * 100) : 92;

    // Fees stats
    const feesCollected = payments.reduce((sum, p) => sum + p.paidAmount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    
    // Estimate pending fees
    const totalTuitionExpected = totalStudents * 15000;
    const pendingFees = Math.max(0, totalTuitionExpected - feesCollected);

    // Weekly attendance trend (mocked realistic data)
    const weeklyAttendance = [
      { day: 'Mon', present: 8, absent: 1 },
      { day: 'Tue', present: 9, absent: 0 },
      { day: 'Wed', present: 7, absent: 2 },
      { day: 'Thu', present: 8, absent: 1 },
      { day: 'Fri', present: 9, absent: 0 }
    ];

    const monthlyAttendanceRate = [
      { month: 'May', rate: 94 },
      { month: 'Jun', rate: 91 },
      { month: 'Jul', rate: 95 },
      { month: 'Aug', rate: 92 },
      { month: 'Sep', rate: 94 }
    ];

    const monthlyFeeTrend = [
      { month: 'May', collected: 120000, due: 35000 },
      { month: 'Jun', collected: 95000, due: 40000 },
      { month: 'Jul', collected: 180000, due: 50000 },
      { month: 'Aug', collected: 140000, due: 45000 },
      { month: 'Sep', collected: 165000, due: 30000 }
    ];

    const incomeVsExpense = [
      { month: 'May', income: 120000, expense: 62000 },
      { month: 'Jun', income: 95000, expense: 58000 },
      { month: 'Jul', income: 180000, expense: 71000 },
      { month: 'Aug', income: 140000, expense: 65000 },
      { month: 'Sep', income: 165000, expense: 61350 }
    ];

    // Class strength distribution
    const classStrength = classes.slice(0, 6).map(c => ({
      className: c.name,
      count: students.filter(s => s.classId === c.id && s.status === 'Active').length
    }));

    return {
      totalStudents,
      presentToday,
      absentToday,
      onLeaveToday,
      attendancePercentageToday,
      totalTeachers,
      pendingFees,
      feesCollected,
      totalExpenses,
      activeClassesCount: classes.length,
      weeklyAttendance,
      monthlyAttendanceRate,
      monthlyFeeTrend,
      incomeVsExpense,
      classStrength,
      recentAdmissions: students.slice(0, 5),
      recentPayments: payments.slice(0, 5),
      recentNotices: notices.slice(0, 4),
      recentAttendanceActivity: attendance.slice(-6).reverse()
    };
  },

  // --------------------------------------------------------------------------
  // GLOBAL SEARCH
  // --------------------------------------------------------------------------
  async globalSearch(query: string): Promise<{
    students: Student[];
    staff: Staff[];
    payments: FeePayment[];
    notices: Notice[];
  }> {
    if (!query || !query.trim()) {
      return { students: [], staff: [], payments: [], notices: [] };
    }
    const q = query.toLowerCase().trim();

    const students = await this.getStudents({ search: q });
    const staff = await this.getStaff({ search: q });
    const payments = await this.getFeePayments({ search: q });
    const notices = (await this.getNotices()).filter(n =>
      n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q)
    );

    return {
      students: students.slice(0, 5),
      staff: staff.slice(0, 5),
      payments: payments.slice(0, 5),
      notices: notices.slice(0, 5)
    };
  },

  // --------------------------------------------------------------------------
  // RESET / BACKUP / RESTORE
  // --------------------------------------------------------------------------
  async resetToSeedData(): Promise<void> {
    await delay(50);
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(STORAGE_KEYS.CLASSES);
      window.localStorage.removeItem(STORAGE_KEYS.STUDENTS);
      window.localStorage.removeItem(STORAGE_KEYS.STAFF);
      window.localStorage.removeItem(STORAGE_KEYS.USERS);
      window.localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      window.localStorage.removeItem(STORAGE_KEYS.ATTENDANCE);
      window.localStorage.removeItem(STORAGE_KEYS.SUBJECTS);
      window.localStorage.removeItem(STORAGE_KEYS.FEE_STRUCTURES);
      window.localStorage.removeItem(STORAGE_KEYS.FEE_PAYMENTS);
      window.localStorage.removeItem(STORAGE_KEYS.FEE_DELETIONS);
      window.localStorage.removeItem(STORAGE_KEYS.EXAMS);
      window.localStorage.removeItem(STORAGE_KEYS.MARKS);
      window.localStorage.removeItem(STORAGE_KEYS.EXPENSES);
      window.localStorage.removeItem(STORAGE_KEYS.SALARIES);
      window.localStorage.removeItem(STORAGE_KEYS.NOTICES);
      window.localStorage.removeItem(STORAGE_KEYS.SETTINGS);
      window.localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
    }
    initializeDatabase();
    await this.logAction('Database Reset', 'System', 'Database restored to initial pristine seed data', 'Super Admin');
  },

  async exportDatabaseJson(): Promise<string> {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      classes: getItem(STORAGE_KEYS.CLASSES, INITIAL_CLASSES),
      students: getItem(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS),
      staff: getItem(STORAGE_KEYS.STAFF, INITIAL_STAFF),
      users: getItem(STORAGE_KEYS.USERS, INITIAL_USERS),
      attendance: getItem(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE),
      subjects: getItem(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS),
      feeStructures: getItem(STORAGE_KEYS.FEE_STRUCTURES, INITIAL_FEE_STRUCTURES),
      feePayments: getItem(STORAGE_KEYS.FEE_PAYMENTS, INITIAL_FEE_PAYMENTS),
      feeDeletions: getItem(STORAGE_KEYS.FEE_DELETIONS, []),
      exams: getItem(STORAGE_KEYS.EXAMS, INITIAL_EXAMS),
      marks: getItem(STORAGE_KEYS.MARKS, INITIAL_MARKS),
      expenses: getItem(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES),
      salaries: getItem(STORAGE_KEYS.SALARIES, INITIAL_SALARIES),
      notices: getItem(STORAGE_KEYS.NOTICES, INITIAL_NOTICES),
      settings: getItem(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS),
      auditLogs: getItem(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS)
    };
    return JSON.stringify(backup, null, 2);
  }
};

export default dataService;
