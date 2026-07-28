
export const ROLE_LABELS = {
  admin: 'Administrator',
  clerk: 'Clerk',
  doctor: 'Doctor',
  lab: 'Lab Attendant',
  pharmasist: 'Pharmacist',
  nurse: 'Nurse',
  finance: 'Financial Accountant',
  secretary: 'Secretary',
  patient: 'Patient',
};

export const ROLE_COLORS = {
  admin: '#7c3aed',
  clerk: '#2563eb',
  doctor: '#059669',
  lab: '#0891b2',
  pharmacy: '#d97706',
  nurse: '#db2777',
  finance: '#4338ca',
  secretary: '#475569',
  patient: '#1b6fae',
};

export const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
export const GENOTYPE = ['AA','AS','SS'];

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

export const DOSAGE_FORMS = [
  { value: 'tablet', label: 'Tablet' },
  { value: 'capsule', label: 'Capsule' },
  { value: 'syrup', label: 'Syrup' },
  { value: 'injection', label: 'Injection' },
  { value: 'cream', label: 'Cream' },
  { value: 'ointment', label: 'Ointment' },
  { value: 'drops', label: 'Drops' },
  { value: 'inhaler', label: 'Inhaler' },
  { value: 'other', label: 'Other' },
];

export const ROUTES = [
  { value: 'oral', label: 'Oral' },
  { value: 'iv', label: 'IV' },
  { value: 'im', label: 'IM' },
  { value: 'sc', label: 'SC' },
  { value: 'topical', label: 'Topical' },
  { value: 'inhalation', label: 'Inhalation' },
];

export const LAB_CATEGORIES = [
  { value: 'hematology', label: 'Hematology' },
  { value: 'biochemistry', label: 'Biochemistry' },
  { value: 'microbiology', label: 'Microbiology' },
  { value: 'immunology', label: 'Immunology' },
  { value: 'pathology', label: 'Pathology' },
  { value: 'radiology', label: 'Radiology' },
  { value: 'other', label: 'Other' },
];

export const LEAVE_TYPES = [
  { value: 'annual', label: 'Annual Leave' },
  { value: 'sick', label: 'Sick Leave' },
  { value: 'maternity', label: 'Maternity Leave' },
  { value: 'paternity', label: 'Paternity Leave' },
  { value: 'compassionate', label: 'Compassionate Leave' },
  { value: 'other', label: 'Other' },
];

export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Card' },
  { value: 'transfer', label: 'Bank Transfer' },
  { value: 'insurance', label: 'Insurance' },
];

export const DEPARTMENTS = [
  'Emergency',
  'General Medicine',
  'Pediatrics',
  'Obstetrics & Gynecology',
  'Surgery',
  'Orthopedics',
  'Cardiology',
  'Neurology',
  'Laboratory',
  'Pharmacy',
  'Radiology',
  'Administration',
  'Finance',
  'Nursing',
  'Human Resources',
];

export const DRUG_CATEGORIES = [
  'Antibiotics',
  'Analgesics',
  'Antimalarials',
  'Antihypertensives',
  'Antidiabetics',
  'Vitamins & Supplements',
  'Antihistamines',
  'Gastrointestinal',
  'Respiratory',
  'Dermatological',
  'Antivirals',
  'Antifungals',
  'Hormones',
  'Anesthetics',
  'Other',
];

export const TEST_CATALOG = [
  { testId: 'T001', testName: 'Complete Blood Count (CBC)', category: 'hematology', price: 3500 },
  { testId: 'T002', testName: 'Blood Sugar (Fasting)', category: 'biochemistry', price: 2000 },
  { testId: 'T003', testName: 'Blood Sugar (Random)', category: 'biochemistry', price: 1500 },
  { testId: 'T004', testName: 'HbA1c', category: 'biochemistry', price: 4500 },
  { testId: 'T005', testName: 'Liver Function Test', category: 'biochemistry', price: 5500 },
  { testId: 'T006', testName: 'Kidney Function Test', category: 'biochemistry', price: 5500 },
  { testId: 'T007', testName: 'Lipid Profile', category: 'biochemistry', price: 4500 },
  { testId: 'T008', testName: 'Thyroid Function Test', category: 'biochemistry', price: 6000 },
  { testId: 'T009', testName: 'Urine Analysis', category: 'biochemistry', price: 1800 },
  { testId: 'T010', testName: 'Stool Analysis', category: 'microbiology', price: 2200 },
  { testId: 'T011', testName: 'Malaria Parasite', category: 'microbiology', price: 1500 },
  { testId: 'T012', testName: 'Typhoid Test (Widal)', category: 'microbiology', price: 2500 },
  { testId: 'T013', testName: 'HIV Screening', category: 'immunology', price: 2000 },
  { testId: 'T014', testName: 'Hepatitis B Surface Antigen', category: 'immunology', price: 3000 },
  { testId: 'T015', testName: 'Blood Group & Rh Factor', category: 'hematology', price: 1200 },
  { testId: 'T016', testName: 'Genotype', category: 'hematology', price: 1500 },
  { testId: 'T017', testName: 'Chest X-Ray', category: 'radiology', price: 8000 },
  { testId: 'T018', testName: 'Abdominal Ultrasound', category: 'radiology', price: 10000 },
  { testId: 'T019', testName: 'ECG', category: 'radiology', price: 5000 },
  { testId: 'T020', testName: 'Urinalysis', category: 'biochemistry', price: 1500 },
];

export const TARIFFS = [
  { category: 'registration', description: 'Patient Registration', price: 2000 },
  { category: 'consultation', description: 'General Consultation', price: 5000 },
  { category: 'consultation', description: 'Specialist Consultation', price: 10000 },
  { category: 'consultation', description: 'Emergency Consultation', price: 7500 },
  { category: 'procedure', description: 'Wound Dressing', price: 3000 },
  { category: 'procedure', description: 'Injection Administration', price: 1500 },
  { category: 'procedure', description: 'IV Cannulation', price: 3500 },
  { category: 'room', description: 'General Ward (Daily)', price: 8000 },
  { category: 'room', description: 'Private Room (Daily)', price: 25000 },
  { category: 'room', description: 'ICU (Daily)', price: 50000 },
];

export const STORAGE_KEYS = {
  AUTH: 'hospitalise_auth',
  PATIENTS: 'hospitalise_patients',
  STAFF: 'hospitalise_staff',
  DIAGNOSES: 'hospitalise_diagnoses',
  LAB_TESTS: 'hospitalise_labTests',
  DRUGS: 'hospitalise_drugs',
  SALES: 'hospitalise_sales',
  BILLS: 'hospitalise_bills',
  EQUIPMENT: 'hospitalise_equipment',
  LEAVE: 'hospitalise_leaveApps',
  PURCHASES: 'hospitalise_purchases',
  STOCK: 'hospitalise_stock',
  SETTINGS: 'hospitalise_settings',
  NOTIFICATIONS: 'hospitalise_notifications',
  SEEDED: 'hospitalise_seeded',
};

export const DEFAULT_SETTINGS = {
  theme: 'light' ,
  language: 'en',
  currency: '₦',
  dateFormat: 'dd/MM/yyyy',
  hospitalName: 'Hospitalise Medical Center',
  hospitalAddress: '123 Healthcare Avenue, Lagos, Nigeria',
  hospitalPhone: '+234 800 123 4567',
  hospitalEmail: 'info@hospitalise.com',
};
