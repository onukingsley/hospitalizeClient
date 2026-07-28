/*
export type UserRole = 'admin' | 'clerk' | 'doctor' | 'lab' | 'pharmacy' | 'nurse' | 'finance' | 'secretary' | 'patient';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  department?: string;
  email: string;
  avatar: string;
  phone?: string;
}

export interface Patient {
  patientId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email?: string;
  address: string;
  emergencyContact: { name: string; phone: string; relationship: string };
  bloodType: string;
  allergies: string[];
  insuranceProvider?: string;
  insuranceNumber?: string;
  registrationDate: string;
  registeredBy: string;
  lastVisit?: string;
}

export interface Vitals {
  temperature: number;
  bloodPressure: string;
  pulse: number;
  respiration: number;
  weight: number;
  height: number;
  bmi: number;
  spO2: number;
}

export interface PrescriptionItem {
  drugId: string;
  drugName: string;
  dosage: string;
  frequency: string;
  duration: string;
  route: 'oral' | 'iv' | 'im' | 'sc' | 'topical' | 'inhalation';
  instructions: string;
  quantity: number;
}

export interface LabOrderItem {
  testId: string;
  testName: string;
  priority: 'routine' | 'urgent' | 'stat';
  notes: string;
  status: 'ordered' | 'in-progress' | 'completed';
}

export interface Diagnosis {
  diagnosisId: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  date: string;
  vitals: Vitals;
  chiefComplaints: string;
  historyOfPresentIllness: string;
  examinationFindings: string;
  provisionalDiagnosis: string;
  finalDiagnosis: string;
  icd10Code?: string;
  prescriptions: PrescriptionItem[];
  labOrders: LabOrderItem[];
  notes: string;
  followUpDate?: string;
  status: 'draft' | 'active' | 'completed' | 'closed';
  nursingRemarks?: string;
}

export interface TestResultItem {
  parameter: string;
  value: string;
  unit: string;
  referenceRange: string;
  isAbnormal: boolean;
  flag?: 'high' | 'low' | 'critical';
}

export interface LabTest {
  testId: string;
  diagnosisId: string;
  patientId: string;
  testName: string;
  category: 'hematology' | 'biochemistry' | 'microbiology' | 'immunology' | 'pathology' | 'radiology' | 'other';
  orderedBy: string;
  orderDate: string;
  priority: string;
  status: 'ordered' | 'sample-collected' | 'in-progress' | 'completed' | 'cancelled';
  results: TestResultItem[];
  resultDate?: string;
  conductedBy?: string;
  notes: string;
  attachments: string[];
  isPaid: boolean;
}

export interface LabEquipment {
  equipmentId: string;
  name: string;
  model: string;
  serialNumber: string;
  manufacturer: string;
  purchaseDate: string;
  lastMaintenance: string;
  nextMaintenance: string;
  status: 'operational' | 'maintenance' | 'out-of-order';
  location: string;
  notes: string;
}

export interface Drug {
  drugId: string;
  name: string;
  genericName: string;
  category: string;
  dosageForm: 'tablet' | 'capsule' | 'syrup' | 'injection' | 'cream' | 'ointment' | 'drops' | 'inhaler' | 'other';
  strength: string;
  stockQuantity: number;
  reorderLevel: number;
  unitPrice: number;
  batchNumber: string;
  expiryDate: string;
  supplier: string;
  location: string;
}

export interface DrugSale {
  saleId: string;
  patientId: string;
  diagnosisId: string;
  items: { drugId: string; drugName: string; quantity: number; unitPrice: number; total: number }[];
  totalAmount: number;
  discount: number;
  netAmount: number;
  amountPaid: number;
  paymentMethod: 'cash' | 'card' | 'transfer' | 'insurance';
  paymentStatus: 'pending' | 'partial' | 'paid';
  soldBy: string;
  saleDate: string;
  receiptNumber: string;
}

export interface DrugRequest {
  requestId: string;
  drugId: string;
  drugName: string;
  quantityRequested: number;
  requestDate: string;
  requestedBy: string;
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled';
  approvedBy?: string;
  notes: string;
}

export interface BillItem {
  itemId: string;
  description: string;
  category: 'registration' | 'consultation' | 'lab' | 'pharmacy' | 'procedure' | 'room' | 'other';
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Bill {
  billId: string;
  patientId: string;
  diagnosisId?: string;
  billDate: string;
  items: BillItem[];
  subTotal: number;
  discount: number;
  tax: number;
  totalAmount: number;
  amountPaid: number;
  balance: number;
  paymentStatus: 'pending' | 'partial' | 'paid';
  paymentMethod?: string;
  receiptNumber?: string;
  createdBy: string;
}

export interface Staff {
  staffId: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department: string;
  email: string;
  phone: string;
  hireDate: string;
  salary: number;
  allowances: { name: string; amount: number }[];
  deductions: { name: string; amount: number }[];
  leaveBalance: { annual: number; sick: number; maternity: number; other: number };
  status: 'active' | 'on-leave' | 'suspended';
  avatar: string;
}

export interface LeaveApplication {
  leaveId: string;
  staffId: string;
  staffName: string;
  leaveType: 'annual' | 'sick' | 'maternity' | 'paternity' | 'compassionate' | 'other';
  startDate: string;
  endDate: string;
  daysRequested: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  approvedBy?: string;
  approvalDate?: string;
  comments?: string;
}

export interface StockItem {
  itemId: string;
  name: string;
  category: 'drug' | 'medical-supply' | 'lab-reagent' | 'equipment' | 'other';
  currentStock: number;
  unitOfMeasure: string;
  reorderLevel: number;
  maxStock: number;
  unitCost: number;
  supplier: string;
  batchNumber?: string;
  expiryDate?: string;
  location: string;
}

export interface PurchaseOrder {
  poId: string;
  supplier: string;
  orderDate: string;
  items: { itemId: string; name: string; quantity: number; unitPrice: number; total: number }[];
  totalAmount: number;
  status: 'draft' | 'pending-approval' | 'approved' | 'ordered' | 'partially-received' | 'received';
  approvedBy?: string;
  receivedDate?: string;
  notes: string;
}

export interface DrugAdministration {
  adminId: string;
  diagnosisId: string;
  patientId: string;
  drugId: string;
  drugName: string;
  dosage: string;
  route: string;
  scheduledTime: string;
  administeredTime?: string;
  administeredBy?: string;
  status: 'pending' | 'administered' | 'missed' | 'held';
  notes: string;
  patientResponse?: string;
}

export interface NursingRemark {
  remarkId: string;
  diagnosisId: string;
  patientId: string;
  nurseId: string;
  nurseName: string;
  date: string;
  careGiven: string;
  patientResponse: string;
  vitalsSnapshot: Partial<Vitals>;
  recommendations: string;
  shift: 'morning' | 'afternoon' | 'night';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  language: string;
  currency: string;
  dateFormat: string;
  hospitalName: string;
  hospitalAddress: string;
  hospitalPhone: string;
  hospitalEmail: string;
}

export interface NavItem {
  label: string;
  path: string;
  icon: string;
  roles: UserRole[];
}
*/
