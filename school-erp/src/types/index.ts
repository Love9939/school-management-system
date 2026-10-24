export type UserRole = 'OWNER' | 'PRINCIPAL' | 'ACCOUNTANT' | 'EXAM_HEAD' | 'TRANSPORT_HEAD';

export type AcademicStage = 'FOUNDATIONAL' | 'PREPARATORY' | 'MIDDLE' | 'SECONDARY';

export interface SchoolCampus {
  id: string;
  name: string;
  code: string;
  affiliationNumber: string;
  udiseSchoolCode: string;
  board: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  totalStudents: number;
  totalTeachers: number;
  academicYear: string;
}

export interface Student {
  id: string;
  admissionNumber: string;
  penNumber: string; // Permanent Education Number from UDISE+
  apaarId: string | null; // One Nation One Student ID (12 digits)
  apaarConsentStatus: 'CONSENT_GRANTED' | 'CONSENT_PENDING' | 'REJECTED' | 'AADHAAR_MISMATCH';
  aadhaarName: string;
  schoolName: string;
  aadhaarDob: string;
  schoolDob: string;
  demographicMatchScore: number; // 0-100%
  fatherName: string;
  motherName: string;
  guardianPhone: string;
  currentClass: string;
  section: string;
  stage: AcademicStage;
  stream?: 'PCM' | 'PCB' | 'COMMERCE' | 'HUMANITIES';
  cbseSubjects: string[];
  attendancePercentage: number;
  rteStudent: boolean; // 25% RTE Quota
  siblingGroupId?: string;
  siblingDiscountPercent: number;
  busRouteId?: string;
  busStopName?: string;
  photoUrl: string;
}

export interface FeeHead {
  id: string;
  name: string;
  code: string;
  category: 'TUITION' | 'ANNUAL' | 'TRANSPORT' | 'LAB' | 'EXAM' | 'SECURITY';
  settlementAccount: 'TRUST_ACCOUNT' | 'FLEET_ACCOUNT' | 'LAB_VENDOR' | 'SPORTS_COUNCIL';
  amountQuarterly: number;
}

export interface FeeDefaulterRecord {
  id: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  className: string;
  section: string;
  parentName: string;
  parentPhone: string;
  quarter: string;
  totalDue: number;
  tuitionFeeDue: number;
  transportFeeDue: number;
  lateFine: number;
  daysOverdue: number;
  escalationTier: 'GENTLE' | 'REMINDER_2' | 'FORMAL_NOTICE' | 'PORTAL_LOCK_WARNING';
  upiLink: string;
  lastReminderSentAt?: string;
  status: 'PENDING' | 'PAID' | 'PAYMENT_VERIFYING' | 'CONCESSION_REQUESTED';
}

export interface FeeTransaction {
  id: string;
  receiptNumber: string;
  studentId: string;
  studentName: string;
  amount: number;
  paymentMode: 'UPI_DIRECT' | 'NET_BANKING' | 'DEBIT_CARD' | 'CHEQUE' | 'CASH';
  referenceNumber: string;
  trustAccountAmount: number;
  fleetAccountAmount: number;
  settlementStatus: 'SETTLED_T1' | 'ESCROW_PENDING' | 'FAILED';
  timestamp: string;
  verifiedBy: string;
}

export interface BoardLocCandidate {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  className: '10' | '12';
  stream?: string;
  subjects: { code: string; name: string; isSkillSubject?: boolean }[];
  attendancePercent: number;
  aadhaarStatus: 'VERIFIED' | 'MISMATCH_DOB' | 'NAME_SPELLING_DIFF' | 'PENDING';
  validationErrors: string[];
  locReady: boolean;
  registrationFeePaid: boolean;
}

export interface TeacherBiometricRecord {
  id: string;
  teacherId: string;
  teacherName: string;
  subjectSpecialization: string[];
  stageSpecialization: AcademicStage[];
  checkInTime: string | null;
  status: 'PRESENT' | 'UNANNOUNCED_ABSENT' | 'APPROVED_LEAVE' | 'LATE';
  weeklySubstitutionsDone: number;
  weeklySubstitutionCap: number; // max 3 to prevent burnout
  assignedClassToday: string;
  phone: string;
}

export interface TimetablePeriod {
  periodNumber: number;
  timeSlot: string;
  className: string;
  section: string;
  subject: string;
  defaultTeacherId: string;
  defaultTeacherName: string;
  isAbsent: boolean;
  substituteTeacherId?: string;
  substituteTeacherName?: string;
  status: 'PENDING_ASSIGNMENT' | 'AUTO_ASSIGNED' | 'NOTIFIED_SMARTBOARD' | 'COMPLETED';
}

export interface BusTelemetry {
  busId: string;
  busNumber: string;
  driverName: string;
  driverPhone: string;
  routeNumber: string;
  routeName: string;
  currentSpeedKmH: number;
  nextStop: string;
  etaNextStopMins: number;
  status: 'ON_SCHEDULE' | 'DELAYED_TRAFFIC' | 'HALTED' | 'TRIP_COMPLETED';
  totalCapacity: number;
  currentBoardedCount: number;
  lastGpsUpdate: string;
  currentLat: number;
  currentLng: number;
}

export interface RfidTapLog {
  id: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  busNumber: string;
  tapType: 'BOARDING' | 'DEBOARDING';
  stopName: string;
  tapTime: string;
  whatsappDelivered: boolean;
}

export interface HolisticProgressCardData {
  studentId: string;
  studentName: string;
  admissionNo: string;
  className: string;
  apaarId: string;
  academicYear: string;
  domains: {
    domainName: string; // e.g. "Physical & Motor", "Socio-Emotional", "Cognitive & Numeracy", "Language & Literacy", "Aesthetic & Cultural"
    score: number; // 1 to 4 (Beginning, Developing, Proficient, Exemplary)
    descriptors: string[];
    teacherNotes: string;
  }[];
  peerReview: {
    peerName: string;
    comment: string;
    rating: string;
  };
  parentReflection: {
    parentNotes: string;
    strengthsObservedAtHome: string;
    signatureDate: string;
  };
  studentSelfEvaluation: {
    iAmProudOf: string;
    iWantToImprove: string;
    favouriteActivity: string;
  };
  notionalLearningHours: number; // NCrF standard: 1200 hrs/year
  parakhCreditPoints: number; // NCrF credit points earned
}
