// Remove the import type line entirely
// import type { Patient, Staff, Diagnosis, LabTest, Drug, DrugSale, Bill, LabEquipment, LeaveApplication, PurchaseOrder, StockItem, DrugAdministration, NursingRemark } from '@/types';

export const generatePatientId = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `HOSP-${date}-${random}`;
};

export const generateDiagnosisId = () => {
  const random = Math.floor(10000 + Math.random() * 90000);
  return `DX-${random}`;
};

export const generateBillId = () => {
  const random = Math.floor(10000 + Math.random() * 90000);
  return `BILL-${random}`;
};

export const generateReceiptNumber = () => {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `RCP-${random}`;
};

const firstNames = ['Adebayo', 'Chioma', 'Emmanuel', 'Fatima', 'Grace', 'Hassan', 'Ibrahim', 'Janet', 'Kabir', 'Linda', 'Moses', 'Ngozi', 'Peter', 'Queen', 'Robert', 'Sarah', 'Tunde', 'Uche', 'Victor', 'Yetunde', 'James', 'Mary', 'John', 'Patience', 'Daniel', 'Blessing', 'Samuel', 'Elizabeth', 'David', 'Ruth', 'Michael', 'Joy', 'Joseph', ' Peace', 'Stephen', 'Mercy', 'Andrew', 'Faith', 'Christopher', 'Hope'];
const lastNames = ['Adeyemi', 'Okafor', 'Nwosu', 'Abubakar', 'Ojo', 'Ibrahim', 'Eze', 'Ajayi', 'Mohammed', 'Obi', 'Balogun', 'Kalu', 'Adeleke', 'Onyeka', 'Yusuf', 'Okonkwo', 'Balogun', 'Adebayo', 'Ogunleye', 'Nnamdi', 'Chukwu', 'Osei', 'Mensah', 'Addo', 'Botwe', 'Asante', 'Darko', 'Tawiah', 'Afful', 'Dwamena'];

export const mockStaff = [
  { staffId: 'ADM001', firstName: 'Admin', lastName: 'User', role: 'admin', department: 'Administration', email: 'admin@hospitalise.com', phone: '+234 801 000 0001', hireDate: '2020-01-15', salary: 500000, allowances: [{ name: 'Housing', amount: 100000 }, { name: 'Transport', amount: 50000 }], deductions: [{ name: 'Tax', amount: 75000 }, { name: 'Pension', amount: 25000 }], leaveBalance: { annual: 21, sick: 14, maternity: 0, other: 5 }, status: 'active', avatar: '' },
  { staffId: 'CLR001', firstName: 'Amaka', lastName: 'Okoro', role: 'clerk', department: 'Administration', email: 'a.okoro@hospitalise.com', phone: '+234 801 000 0002', hireDate: '2021-03-10', salary: 180000, allowances: [{ name: 'Housing', amount: 40000 }, { name: 'Transport', amount: 20000 }], deductions: [{ name: 'Tax', amount: 27000 }, { name: 'Pension', amount: 9000 }], leaveBalance: { annual: 18, sick: 10, maternity: 0, other: 3 }, status: 'active', avatar: '' },
  { staffId: 'DOC001', firstName: 'Dr. James', lastName: 'Osei', role: 'doctor', department: 'General Medicine', email: 'j.osei@hospitalise.com', phone: '+234 801 000 0003', hireDate: '2019-06-01', salary: 600000, allowances: [{ name: 'Housing', amount: 150000 }, { name: 'Transport', amount: 75000 }, { name: 'Call Duty', amount: 100000 }], deductions: [{ name: 'Tax', amount: 90000 }, { name: 'Pension', amount: 30000 }], leaveBalance: { annual: 25, sick: 14, maternity: 0, other: 5 }, status: 'active', avatar: '' },
  { staffId: 'DOC002', firstName: 'Dr. Amina', lastName: 'Bello', role: 'doctor', department: 'Pediatrics', email: 'a.bello@hospitalise.com', phone: '+234 801 000 0004', hireDate: '2020-02-15', salary: 550000, allowances: [{ name: 'Housing', amount: 130000 }, { name: 'Transport', amount: 65000 }, { name: 'Call Duty', amount: 90000 }], deductions: [{ name: 'Tax', amount: 82500 }, { name: 'Pension', amount: 27500 }], leaveBalance: { annual: 25, sick: 14, maternity: 0, other: 5 }, status: 'active', avatar: '' },
  { staffId: 'LAB001', firstName: 'Kofi', lastName: 'Mensah', role: 'lab', department: 'Laboratory', email: 'k.mensah@hospitalise.com', phone: '+234 801 000 0005', hireDate: '2021-01-20', salary: 220000, allowances: [{ name: 'Housing', amount: 50000 }, { name: 'Transport', amount: 25000 }], deductions: [{ name: 'Tax', amount: 33000 }, { name: 'Pension', amount: 11000 }], leaveBalance: { annual: 18, sick: 10, maternity: 0, other: 3 }, status: 'active', avatar: '' },
  { staffId: 'PHR001', firstName: 'Nana', lastName: 'Yaa', role: 'pharmacy', department: 'Pharmacy', email: 'n.yaa@hospitalise.com', phone: '+234 801 000 0006', hireDate: '2020-08-12', salary: 250000, allowances: [{ name: 'Housing', amount: 60000 }, { name: 'Transport', amount: 30000 }], deductions: [{ name: 'Tax', amount: 37500 }, { name: 'Pension', amount: 12500 }], leaveBalance: { annual: 18, sick: 10, maternity: 0, other: 3 }, status: 'active', avatar: '' },
  { staffId: 'NUR001', firstName: 'Grace', lastName: 'Adebayo', role: 'nurse', department: 'Nursing', email: 'g.adebayo@hospitalise.com', phone: '+234 801 000 0007', hireDate: '2019-04-05', salary: 200000, allowances: [{ name: 'Housing', amount: 45000 }, { name: 'Transport', amount: 22000 }, { name: 'Shift Allowance', amount: 30000 }], deductions: [{ name: 'Tax', amount: 30000 }, { name: 'Pension', amount: 10000 }], leaveBalance: { annual: 18, sick: 12, maternity: 0, other: 3 }, status: 'active', avatar: '' },
  { staffId: 'FIN001', firstName: 'Robert', lastName: 'Kojo', role: 'finance', department: 'Finance', email: 'r.kojo@hospitalise.com', phone: '+234 801 000 0008', hireDate: '2020-11-01', salary: 350000, allowances: [{ name: 'Housing', amount: 80000 }, { name: 'Transport', amount: 40000 }], deductions: [{ name: 'Tax', amount: 52500 }, { name: 'Pension', amount: 17500 }], leaveBalance: { annual: 21, sick: 14, maternity: 0, other: 5 }, status: 'active', avatar: '' },
  { staffId: 'SEC001', firstName: 'Patience', lastName: 'Obi', role: 'secretary', department: 'Administration', email: 'p.obi@hospitalise.com', phone: '+234 801 000 0009', hireDate: '2021-05-15', salary: 150000, allowances: [{ name: 'Housing', amount: 35000 }, { name: 'Transport', amount: 18000 }], deductions: [{ name: 'Tax', amount: 22500 }, { name: 'Pension', amount: 7500 }], leaveBalance: { annual: 18, sick: 10, maternity: 0, other: 3 }, status: 'active', avatar: '' },
];

export const mockPatients = Array.from({ length: 40 }, (_, i) => {
  const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
  const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
  const gender = Math.random() > 0.5 ? 'male' : 'female';
  return {
    patientId: `HOSP-2025${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}-${String(1000 + i).padStart(4, '0')}`,
    firstName: fn,
    lastName: ln,
    dateOfBirth: `19${String(Math.floor(Math.random() * 40) + 60)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    gender: gender,
    phone: `+234 ${String(Math.floor(Math.random() * 900) + 100)} ${String(Math.floor(Math.random() * 900) + 100)} ${String(Math.floor(Math.random() * 9000) + 1000)}`,
    email: `${fn.toLowerCase()}.${ln.toLowerCase()}@email.com`,
    address: `${Math.floor(Math.random() * 200) + 1} ${['Street', 'Avenue', 'Road', 'Close'][Math.floor(Math.random() * 4)]}, ${['Lagos', 'Abuja', 'Ibadan', 'Kano', 'Port Harcourt', 'Enugu'][Math.floor(Math.random() * 6)]}`,
    emergencyContact: { name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`, phone: `+234 ${String(Math.floor(Math.random() * 900) + 100)} ${String(Math.floor(Math.random() * 900) + 100)} ${String(Math.floor(Math.random() * 9000) + 1000)}`, relationship: ['Spouse', 'Parent', 'Sibling', 'Friend'][Math.floor(Math.random() * 4)] },
    bloodType: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'][Math.floor(Math.random() * 8)],
    allergies: Math.random() > 0.7 ? ['Penicillin', 'Sulfa drugs', 'Latex'][Math.floor(Math.random() * 3)].split(',') : [],
    insuranceProvider: Math.random() > 0.5 ? ['Hygeia HMO', 'Reliance HMO', 'AIICO Multishield', 'Leadway Health', 'AXA Mansard'][Math.floor(Math.random() * 5)] : undefined,
    insuranceNumber: Math.random() > 0.5 ? `INS-${String(Math.floor(Math.random() * 900000) + 100000)}` : undefined,
    registrationDate: `2025-${String(Math.floor(Math.random() * 4) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    registeredBy: 'CLR001',
    lastVisit: Math.random() > 0.3 ? `2025-${String(Math.floor(Math.random() * 4) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}` : undefined,
  };
});

export const mockDiagnoses = Array.from({ length: 50 }, (_, i) => {
  const patient = mockPatients[i % mockPatients.length];
  const doctors = ['DOC001', 'DOC002'];
  const doctorId = doctors[i % 2];
  const doctorName = doctorId === 'DOC001' ? 'Dr. James Osei' : 'Dr. Amina Bello';
  const conditions = [
    { prov: 'Malaria', final: 'Uncomplicated Malaria', icd: 'B50.9' },
    { prov: 'Typhoid fever', final: 'Typhoid Fever', icd: 'A01.0' },
    { prov: 'Upper respiratory infection', final: 'Acute Upper Respiratory Tract Infection', icd: 'J06.9' },
    { prov: 'Hypertension', final: 'Essential Hypertension', icd: 'I10' },
    { prov: 'Type 2 Diabetes', final: 'Type 2 Diabetes Mellitus', icd: 'E11.9' },
    { prov: 'Gastritis', final: 'Chronic Gastritis', icd: 'K29.3' },
    { prov: 'Musculoskeletal pain', final: 'Low Back Pain', icd: 'M54.5' },
    { prov: 'UTI', final: 'Urinary Tract Infection', icd: 'N39.0' },
    { prov: 'Peptic ulcer', final: 'Peptic Ulcer Disease', icd: 'K27.9' },
    { prov: 'Anemia', final: 'Iron Deficiency Anemia', icd: 'D50.9' },
  ];
  const condition = conditions[i % conditions.length];
  const month = String(Math.floor(Math.random() * 4) + 1).padStart(2, '0');
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');

  return {
    diagnosisId: `DX-${String(10000 + i)}`,
    patientId: patient.patientId,
    doctorId,
    doctorName,
    date: `2025-${month}-${day}`,
    vitals: {
      temperature: +(36 + Math.random() * 3).toFixed(1),
      bloodPressure: `${Math.floor(100 + Math.random() * 40)}/${Math.floor(60 + Math.random() * 30)}`,
      pulse: Math.floor(60 + Math.random() * 40),
      respiration: Math.floor(12 + Math.random() * 12),
      weight: Math.floor(50 + Math.random() * 50),
      height: Math.floor(150 + Math.random() * 40),
      bmi: +(18 + Math.random() * 15).toFixed(1),
      spO2: Math.floor(94 + Math.random() * 6),
    },
    chiefComplaints: ['Fever and headache', 'Body weakness', 'Cough and catarrh', 'Chest pain', 'Abdominal pain', 'Joint pain', 'Dizziness', 'Nausea and vomiting'][Math.floor(Math.random() * 8)],
    historyOfPresentIllness: `Patient presented with ${condition.prov.toLowerCase()} symptoms for ${Math.floor(Math.random() * 7) + 1} days. Associated symptoms include ${['fever', 'headache', 'body ache', 'loss of appetite', 'fatigue'][Math.floor(Math.random() * 5)]}. No known drug allergies.`,
    examinationFindings: `Patient is ${['well', 'fairly', 'poorly'][Math.floor(Math.random() * 3)]} nourished. Vital signs are ${['stable', 'within normal limits', 'slightly elevated'][Math.floor(Math.random() * 3)]}. Physical examination reveals ${['no significant findings', 'mild tenderness', 'slight pallor', 'mild dehydration'][Math.floor(Math.random() * 4)]}.`,
    provisionalDiagnosis: condition.prov,
    finalDiagnosis: condition.final,
    icd10Code: condition.icd,
    prescriptions: [
      { drugId: `DRUG${Math.floor(Math.random() * 20) + 1}`, drugName: ['Artemether-Lumefantrine', 'Amoxicillin', 'Paracetamol', 'Ibuprofen', 'Omeprazole', 'Metformin', 'Amlodipine', 'Ciprofloxacin', 'Cetirizine', 'Metronidazole'][Math.floor(Math.random() * 10)], dosage: `${Math.floor(Math.random() * 500) + 100}mg`, frequency: ['TDS', 'BD', 'OD', 'QDS'][Math.floor(Math.random() * 4)], duration: `${Math.floor(Math.random() * 7) + 3} days`, route: 'oral', instructions: 'Take after meals', quantity: Math.floor(Math.random() * 20) + 10 },
    ].filter(() => Math.random() > 0.3),
    labOrders: [
      { testId: `T${String(Math.floor(Math.random() * 20) + 1).padStart(3, '0')}`, testName: ['CBC', 'Malaria Parasite', 'Blood Sugar', 'Liver Function Test', 'Urinalysis', 'Typhoid Test'][Math.floor(Math.random() * 6)], priority: ['routine', 'urgent', 'stat'][Math.floor(Math.random() * 3)], notes: '', status: 'ordered' },
    ].filter(() => Math.random() > 0.2),
    notes: `Patient advised to ${['rest', 'hydrate well', 'return in 3 days', 'complete full course of medication', 'monitor blood pressure'][Math.floor(Math.random() * 5)]}.`,
    status: ['draft', 'active', 'completed', 'closed'][Math.floor(Math.random() * 4)],
    nursingRemarks: Math.random() > 0.5 ? `Patient ${['cooperative', 'stable', 'responding well', 'requires monitoring'][Math.floor(Math.random() * 4)]} during care.` : undefined,
  };
});

export const mockLabTests = mockDiagnoses.flatMap((dx, i) =>
    dx.labOrders.map((order, j) => ({
      testId: `LT-${String(1000 + i * 10 + j).padStart(4, '0')}`,
      diagnosisId: dx.diagnosisId,
      patientId: dx.patientId,
      testName: order.testName,
      category: ['hematology', 'biochemistry', 'microbiology', 'immunology', 'pathology', 'radiology', 'other'][Math.floor(Math.random() * 7)],
      orderedBy: dx.doctorName,
      orderDate: dx.date,
      priority: order.priority,
      status: ['ordered', 'sample-collected', 'in-progress', 'completed', 'cancelled'][Math.floor(Math.random() * 5)],
      results: order.status === 'completed' ? [
        { parameter: 'Result', value: String(Math.floor(Math.random() * 100)), unit: 'units', referenceRange: '0-100', isAbnormal: Math.random() > 0.7 },
      ] : [],
      resultDate: order.status === 'completed' ? dx.date : undefined,
      conductedBy: order.status === 'completed' ? 'Kofi Mensah' : undefined,
      notes: '',
      attachments: [],
      isPaid: Math.random() > 0.3,
    }))
);

export const mockDrugs = [
  { drugId: 'DRUG1', name: 'Artemether-Lumefantrine 20/120mg', genericName: 'Artemether-Lumefantrine', category: 'Antimalarials', dosageForm: 'tablet', strength: '20/120mg', stockQuantity: 500, reorderLevel: 100, unitPrice: 1500, batchNumber: 'BATCH001', expiryDate: '2027-06-30', supplier: 'Emzor Pharmaceuticals', location: 'Shelf A1' },
  { drugId: 'DRUG2', name: 'Amoxicillin 500mg Capsules', genericName: 'Amoxicillin', category: 'Antibiotics', dosageForm: 'capsule', strength: '500mg', stockQuantity: 350, reorderLevel: 80, unitPrice: 800, batchNumber: 'BATCH002', expiryDate: '2026-12-31', supplier: 'Swiss Pharma Nigeria', location: 'Shelf A2' },
  { drugId: 'DRUG3', name: 'Paracetamol 500mg Tablets', genericName: 'Paracetamol', category: 'Analgesics', dosageForm: 'tablet', strength: '500mg', stockQuantity: 1000, reorderLevel: 200, unitPrice: 300, batchNumber: 'BATCH003', expiryDate: '2027-03-31', supplier: 'May & Baker', location: 'Shelf B1' },
  { drugId: 'DRUG4', name: 'Ibuprofen 400mg Tablets', genericName: 'Ibuprofen', category: 'Analgesics', dosageForm: 'tablet', strength: '400mg', stockQuantity: 420, reorderLevel: 100, unitPrice: 450, batchNumber: 'BATCH004', expiryDate: '2026-09-30', supplier: 'Fidson Healthcare', location: 'Shelf B2' },
  { drugId: 'DRUG5', name: 'Omeprazole 20mg Capsules', genericName: 'Omeprazole', category: 'Gastrointestinal', dosageForm: 'capsule', strength: '20mg', stockQuantity: 280, reorderLevel: 60, unitPrice: 1200, batchNumber: 'BATCH005', expiryDate: '2027-01-31', supplier: 'Emzor Pharmaceuticals', location: 'Shelf C1' },
  { drugId: 'DRUG6', name: 'Metformin 500mg Tablets', genericName: 'Metformin', category: 'Antidiabetics', dosageForm: 'tablet', strength: '500mg', stockQuantity: 310, reorderLevel: 70, unitPrice: 900, batchNumber: 'BATCH006', expiryDate: '2027-04-30', supplier: 'Swiss Pharma Nigeria', location: 'Shelf C2' },
  { drugId: 'DRUG7', name: 'Amlodipine 5mg Tablets', genericName: 'Amlodipine', category: 'Antihypertensives', dosageForm: 'tablet', strength: '5mg', stockQuantity: 450, reorderLevel: 90, unitPrice: 750, batchNumber: 'BATCH007', expiryDate: '2026-11-30', supplier: 'May & Baker', location: 'Shelf D1' },
  { drugId: 'DRUG8', name: 'Ciprofloxacin 500mg Tablets', genericName: 'Ciprofloxacin', category: 'Antibiotics', dosageForm: 'tablet', strength: '500mg', stockQuantity: 220, reorderLevel: 50, unitPrice: 1100, batchNumber: 'BATCH008', expiryDate: '2026-08-31', supplier: 'Fidson Healthcare', location: 'Shelf A3' },
  { drugId: 'DRUG9', name: 'Cetirizine 10mg Tablets', genericName: 'Cetirizine', category: 'Antihistamines', dosageForm: 'tablet', strength: '10mg', stockQuantity: 380, reorderLevel: 80, unitPrice: 350, batchNumber: 'BATCH009', expiryDate: '2027-02-28', supplier: 'Emzor Pharmaceuticals', location: 'Shelf E1' },
  { drugId: 'DRUG10', name: 'Metronidazole 400mg Tablets', genericName: 'Metronidazole', category: 'Antibiotics', dosageForm: 'tablet', strength: '400mg', stockQuantity: 260, reorderLevel: 60, unitPrice: 600, batchNumber: 'BATCH010', expiryDate: '2026-10-31', supplier: 'Swiss Pharma Nigeria', location: 'Shelf A4' },
  { drugId: 'DRUG11', name: 'Vitamin C 500mg Tablets', genericName: 'Ascorbic Acid', category: 'Vitamins & Supplements', dosageForm: 'tablet', strength: '500mg', stockQuantity: 600, reorderLevel: 120, unitPrice: 250, batchNumber: 'BATCH011', expiryDate: '2027-05-31', supplier: 'May & Baker', location: 'Shelf F1' },
  { drugId: 'DRUG12', name: 'Multivitamin Syrup', genericName: 'Multivitamin', category: 'Vitamins & Supplements', dosageForm: 'syrup', strength: '200ml', stockQuantity: 180, reorderLevel: 40, unitPrice: 1500, batchNumber: 'BATCH012', expiryDate: '2026-07-31', supplier: 'Fidson Healthcare', location: 'Shelf F2' },
  { drugId: 'DRUG13', name: 'Artesunate Injection 60mg', genericName: 'Artesunate', category: 'Antimalarials', dosageForm: 'injection', strength: '60mg', stockQuantity: 90, reorderLevel: 25, unitPrice: 3500, batchNumber: 'BATCH013', expiryDate: '2026-06-30', supplier: 'Emzor Pharmaceuticals', location: 'Refrigerator A' },
  { drugId: 'DRUG14', name: 'Ceftriaxone Injection 1g', genericName: 'Ceftriaxone', category: 'Antibiotics', dosageForm: 'injection', strength: '1g', stockQuantity: 75, reorderLevel: 20, unitPrice: 2800, batchNumber: 'BATCH014', expiryDate: '2026-05-31', supplier: 'Swiss Pharma Nigeria', location: 'Refrigerator A' },
  { drugId: 'DRUG15', name: 'Diclofenac Injection 75mg', genericName: 'Diclofenac', category: 'Analgesics', dosageForm: 'injection', strength: '75mg', stockQuantity: 120, reorderLevel: 30, unitPrice: 1800, batchNumber: 'BATCH015', expiryDate: '2026-08-31', supplier: 'May & Baker', location: 'Shelf G1' },
  { drugId: 'DRUG16', name: 'Chlorpheniramine 4mg Tablets', genericName: 'Chlorpheniramine', category: 'Antihistamines', dosageForm: 'tablet', strength: '4mg', stockQuantity: 340, reorderLevel: 70, unitPrice: 200, batchNumber: 'BATCH016', expiryDate: '2027-01-31', supplier: 'Fidson Healthcare', location: 'Shelf E2' },
  { drugId: 'DRUG17', name: 'ORS Sachets', genericName: 'Oral Rehydration Salts', category: 'Gastrointestinal', dosageForm: 'other', strength: 'N/A', stockQuantity: 800, reorderLevel: 150, unitPrice: 150, batchNumber: 'BATCH017', expiryDate: '2027-08-31', supplier: 'Emzor Pharmaceuticals', location: 'Shelf H1' },
  { drugId: 'DRUG18', name: 'Insulin Glargine 100IU/ml', genericName: 'Insulin Glargine', category: 'Antidiabetics', dosageForm: 'injection', strength: '100IU/ml', stockQuantity: 45, reorderLevel: 15, unitPrice: 8500, batchNumber: 'BATCH018', expiryDate: '2026-04-30', supplier: 'Swiss Pharma Nigeria', location: 'Refrigerator B' },
  { drugId: 'DRUG19', name: 'Losartan 50mg Tablets', genericName: 'Losartan', category: 'Antihypertensives', dosageForm: 'tablet', strength: '50mg', stockQuantity: 290, reorderLevel: 60, unitPrice: 950, batchNumber: 'BATCH019', expiryDate: '2026-12-31', supplier: 'May & Baker', location: 'Shelf D2' },
  { drugId: 'DRUG20', name: 'Aspirin 75mg Tablets', genericName: 'Aspirin', category: 'Analgesics', dosageForm: 'tablet', strength: '75mg', stockQuantity: 520, reorderLevel: 100, unitPrice: 180, batchNumber: 'BATCH020', expiryDate: '2027-03-31', supplier: 'Fidson Healthcare', location: 'Shelf B3' },
];

export const mockDrugSales = Array.from({ length: 60 }, (_, i) => {
  const patient = mockPatients[i % mockPatients.length];
  const diagnosis = mockDiagnoses[i % mockDiagnoses.length];
  const numItems = Math.floor(Math.random() * 3) + 1;
  const items = Array.from({ length: numItems }, () => {
    const drug = mockDrugs[Math.floor(Math.random() * mockDrugs.length)];
    const qty = Math.floor(Math.random() * 3) + 1;
    return { drugId: drug.drugId, drugName: drug.name, quantity: qty, unitPrice: drug.unitPrice, total: drug.unitPrice * qty };
  });
  const totalAmount = items.reduce((sum, item) => sum + item.total, 0);
  const discount = Math.random() > 0.8 ? Math.floor(totalAmount * 0.1) : 0;
  const netAmount = totalAmount - discount;
  const isPaid = Math.random() > 0.2;
  const amountPaid = isPaid ? netAmount : Math.floor(Math.random() * netAmount);

  return {
    saleId: `SALE-${String(1000 + i)}`,
    patientId: patient.patientId,
    diagnosisId: diagnosis.diagnosisId,
    items,
    totalAmount,
    discount,
    netAmount,
    amountPaid,
    paymentMethod: ['cash', 'card', 'transfer', 'insurance'][Math.floor(Math.random() * 4)],
    paymentStatus: amountPaid >= netAmount ? 'paid' : amountPaid > 0 ? 'partial' : 'pending',
    soldBy: 'PHR001',
    saleDate: `2025-${String(Math.floor(Math.random() * 4) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    receiptNumber: `RCP-${String(100000 + i)}`,
  };
});

export const mockBills = Array.from({ length: 50 }, (_, i) => {
  const patient = mockPatients[i % mockPatients.length];
  const diagnosis = mockDiagnoses[i % mockDiagnoses.length];
  const items = [
    { itemId: `BI-${i}-1`, description: 'Consultation Fee', category: 'consultation', quantity: 1, unitPrice: 5000, total: 5000 },
    ...(diagnosis.labOrders.length > 0 ? [{ itemId: `BI-${i}-2`, description: `Lab: ${diagnosis.labOrders[0].testName}`, category: 'lab', quantity: 1, unitPrice: 3000, total: 3000 }] : []),
    ...(diagnosis.prescriptions.length > 0 ? [{ itemId: `BI-${i}-3`, description: `Drugs: ${diagnosis.prescriptions[0].drugName}`, category: 'pharmacy', quantity: diagnosis.prescriptions[0].quantity, unitPrice: 500, total: diagnosis.prescriptions[0].quantity * 500 }] : []),
  ];
  const subTotal = items.reduce((sum, item) => sum + item.total, 0);
  const discount = Math.random() > 0.8 ? Math.floor(subTotal * 0.05) : 0;
  const tax = Math.floor(subTotal * 0.05);
  const totalAmount = subTotal - discount + tax;
  const isPaid = Math.random() > 0.3;
  const amountPaid = isPaid ? totalAmount : Math.floor(Math.random() * totalAmount);

  return {
    billId: generateBillId(),
    patientId: patient.patientId,
    diagnosisId: diagnosis.diagnosisId,
    billDate: diagnosis.date,
    items,
    subTotal,
    discount,
    tax,
    totalAmount,
    amountPaid,
    balance: totalAmount - amountPaid,
    paymentStatus: amountPaid >= totalAmount ? 'paid' : amountPaid > 0 ? 'partial' : 'pending',
    paymentMethod: isPaid ? ['cash', 'card', 'transfer', 'insurance'][Math.floor(Math.random() * 4)] : undefined,
    receiptNumber: isPaid ? generateReceiptNumber() : undefined,
    createdBy: 'CLR001',
  };
});

export const mockEquipment = [
  { equipmentId: 'EQ001', name: 'Hematology Analyzer', model: 'Sysmex XN-350', serialNumber: 'SN123456', manufacturer: 'Sysmex', purchaseDate: '2022-03-15', lastMaintenance: '2025-01-10', nextMaintenance: '2025-04-10', status: 'operational', location: 'Lab Room 1', notes: 'Fully operational' },
  { equipmentId: 'EQ002', name: 'Biochemistry Analyzer', model: 'Roche Cobas c111', serialNumber: 'SN789012', manufacturer: 'Roche', purchaseDate: '2021-08-20', lastMaintenance: '2025-02-05', nextMaintenance: '2025-05-05', status: 'operational', location: 'Lab Room 1', notes: '' },
  { equipmentId: 'EQ003', name: 'Microscope', model: 'Olympus CX23', serialNumber: 'SN345678', manufacturer: 'Olympus', purchaseDate: '2023-01-10', lastMaintenance: '2025-01-20', nextMaintenance: '2025-07-20', status: 'operational', location: 'Lab Room 2', notes: '' },
  { equipmentId: 'EQ004', name: 'Centrifuge', model: 'Eppendorf 5804', serialNumber: 'SN901234', manufacturer: 'Eppendorf', purchaseDate: '2022-06-01', lastMaintenance: '2024-12-15', nextMaintenance: '2025-03-15', status: 'maintenance', location: 'Lab Room 1', notes: 'Routine calibration in progress' },
  { equipmentId: 'EQ005', name: 'X-Ray Machine', model: 'Siemens Multix', serialNumber: 'SN567890', manufacturer: 'Siemens', purchaseDate: '2020-11-15', lastMaintenance: '2025-01-25', nextMaintenance: '2025-04-25', status: 'operational', location: 'Radiology Room', notes: '' },
  { equipmentId: 'EQ006', name: 'Ultrasound Machine', model: 'GE Logiq E9', serialNumber: 'SN234567', manufacturer: 'GE Healthcare', purchaseDate: '2021-04-20', lastMaintenance: '2025-02-10', nextMaintenance: '2025-05-10', status: 'operational', location: 'Radiology Room', notes: '' },
  { equipmentId: 'EQ007', name: 'ECG Machine', model: 'Schiller AT-102', serialNumber: 'SN890123', manufacturer: 'Schiller', purchaseDate: '2023-03-01', lastMaintenance: '2025-01-15', nextMaintenance: '2025-07-15', status: 'operational', location: 'Cardiology Room', notes: '' },
  { equipmentId: 'EQ008', name: 'Autoclave', model: 'Tomy SX-500', serialNumber: 'SN456789', manufacturer: 'Tomy', purchaseDate: '2022-09-10', lastMaintenance: '2024-11-20', nextMaintenance: '2025-02-20', status: 'out-of-order', location: 'Sterilization Room', notes: 'Pressure valve needs replacement' },
  { equipmentId: 'EQ009', name: 'Incubator', model: 'Memmert IN55', serialNumber: 'SN012345', manufacturer: 'Memmert', purchaseDate: '2023-06-15', lastMaintenance: '2025-01-30', nextMaintenance: '2025-04-30', status: 'operational', location: 'Microbiology Lab', notes: '' },
  { equipmentId: 'EQ010', name: 'Spectrophotometer', model: 'BioTek Epoch2', serialNumber: 'SN678901', manufacturer: 'BioTek', purchaseDate: '2021-12-01', lastMaintenance: '2025-02-01', nextMaintenance: '2025-05-01', status: 'operational', location: 'Lab Room 2', notes: '' },
  { equipmentId: 'EQ011', name: 'Blood Gas Analyzer', model: 'Radiometer ABL90', serialNumber: 'SN112233', manufacturer: 'Radiometer', purchaseDate: '2022-07-20', lastMaintenance: '2025-02-15', nextMaintenance: '2025-05-15', status: 'operational', location: 'Emergency Lab', notes: '' },
  { equipmentId: 'EQ012', name: 'ELISA Reader', model: 'BioTek ELx800', serialNumber: 'SN445566', manufacturer: 'BioTek', purchaseDate: '2023-02-10', lastMaintenance: '2025-01-05', nextMaintenance: '2025-07-05', status: 'operational', location: 'Immunology Lab', notes: '' },
  { equipmentId: 'EQ013', name: 'Refrigerator', model: 'LG GR-B202', serialNumber: 'SN778899', manufacturer: 'LG', purchaseDate: '2021-05-15', lastMaintenance: '2024-12-10', nextMaintenance: '2025-03-10', status: 'operational', location: 'Lab Storage', notes: 'For reagent storage' },
  { equipmentId: 'EQ014', name: 'Water Bath', model: 'Memmert WNB14', serialNumber: 'SN001122', manufacturer: 'Memmert', purchaseDate: '2022-04-01', lastMaintenance: '2025-01-20', nextMaintenance: '2025-04-20', status: 'operational', location: 'Lab Room 2', notes: '' },
  { equipmentId: 'EQ015', name: 'Hot Air Oven', model: 'Yamato DKN402', serialNumber: 'SN334455', manufacturer: 'Yamato', purchaseDate: '2023-08-01', lastMaintenance: '2025-02-20', nextMaintenance: '2025-08-20', status: 'operational', location: 'Sterilization Room', notes: '' },
  { equipmentId: 'EQ016', name: 'pH Meter', model: 'Hanna HI2210', serialNumber: 'SN667788', manufacturer: 'Hanna', purchaseDate: '2022-10-15', lastMaintenance: '2024-11-01', nextMaintenance: '2025-02-01', status: 'maintenance', location: 'Lab Room 1', notes: 'Electrode replacement needed' },
  { equipmentId: 'EQ017', name: 'Vortex Mixer', model: 'Scilogex MX-S', serialNumber: 'SN990011', manufacturer: 'Scilogex', purchaseDate: '2023-04-10', lastMaintenance: '2025-01-15', nextMaintenance: '2025-07-15', status: 'operational', location: 'Lab Room 1', notes: '' },
  { equipmentId: 'EQ018', name: 'Analytical Balance', model: 'Ohaus PX224', serialNumber: 'SN223344', manufacturer: 'Ohaus', purchaseDate: '2021-09-20', lastMaintenance: '2025-02-05', nextMaintenance: '2025-05-05', status: 'operational', location: 'Lab Room 2', notes: '' },
  { equipmentId: 'EQ019', name: 'Micropipette Set', model: 'Eppendorf Research', serialNumber: 'SN556677', manufacturer: 'Eppendorf', purchaseDate: '2023-01-15', lastMaintenance: '2025-01-10', nextMaintenance: '2025-07-10', status: 'operational', location: 'Lab Room 1', notes: '' },
  { equipmentId: 'EQ020', name: 'Laminar Flow Hood', model: 'Esco Airstream', serialNumber: 'SN889900', manufacturer: 'Esco', purchaseDate: '2022-02-20', lastMaintenance: '2024-12-20', nextMaintenance: '2025-03-20', status: 'operational', location: 'Microbiology Lab', notes: '' },
];

export const mockLeaveApplications = [
  { leaveId: 'LV001', staffId: 'DOC001', staffName: 'Dr. James Osei', leaveType: 'annual', startDate: '2025-04-01', endDate: '2025-04-14', daysRequested: 14, reason: 'Family vacation and personal rest', status: 'approved', appliedDate: '2025-03-01', approvedBy: 'ADM001', approvalDate: '2025-03-05', comments: 'Approved. Dr. Amina to cover shifts.' },
  { leaveId: 'LV002', staffId: 'NUR001', staffName: 'Grace Adebayo', leaveType: 'sick', startDate: '2025-03-15', endDate: '2025-03-18', daysRequested: 4, reason: 'Medical treatment', status: 'approved', appliedDate: '2025-03-10', approvedBy: 'ADM001', approvalDate: '2025-03-11', comments: 'Get well soon' },
  { leaveId: 'LV003', staffId: 'LAB001', staffName: 'Kofi Mensah', leaveType: 'annual', startDate: '2025-05-01', endDate: '2025-05-10', daysRequested: 10, reason: 'Personal matters', status: 'pending', appliedDate: '2025-03-20', comments: '' },
  { leaveId: 'LV004', staffId: 'CLR001', staffName: 'Amaka Okoro', leaveType: 'compassionate', startDate: '2025-03-25', endDate: '2025-03-28', daysRequested: 4, reason: 'Family bereavement', status: 'approved', appliedDate: '2025-03-22', approvedBy: 'ADM001', approvalDate: '2025-03-23', comments: 'Our condolences' },
  { leaveId: 'LV005', staffId: 'PHR001', staffName: 'Nana Yaa', leaveType: 'sick', startDate: '2025-04-05', endDate: '2025-04-08', daysRequested: 4, reason: 'Dental surgery', status: 'pending', appliedDate: '2025-03-25', comments: '' },
  { leaveId: 'LV006', staffId: 'SEC001', staffName: 'Patience Obi', leaveType: 'annual', startDate: '2025-06-01', endDate: '2025-06-14', daysRequested: 14, reason: 'Vacation', status: 'pending', appliedDate: '2025-03-28', comments: '' },
  { leaveId: 'LV007', staffId: 'FIN001', staffName: 'Robert Kojo', leaveType: 'annual', startDate: '2025-04-15', endDate: '2025-04-22', daysRequested: 8, reason: 'Personal rest', status: 'approved', appliedDate: '2025-03-15', approvedBy: 'ADM001', approvalDate: '2025-03-18', comments: 'Approved' },
  { leaveId: 'LV008', staffId: 'NUR001', staffName: 'Grace Adebayo', leaveType: 'annual', startDate: '2025-08-01', endDate: '2025-08-14', daysRequested: 14, reason: 'Summer holiday with family', status: 'pending', appliedDate: '2025-03-30', comments: '' },
  { leaveId: 'LV009', staffId: 'DOC002', staffName: 'Dr. Amina Bello', leaveType: 'maternity', startDate: '2025-05-15', endDate: '2025-08-15', daysRequested: 93, reason: 'Maternity leave', status: 'approved', appliedDate: '2025-02-15', approvedBy: 'ADM001', approvalDate: '2025-02-20', comments: 'Approved. Temporary replacement arranged.' },
  { leaveId: 'LV010', staffId: 'LAB001', staffName: 'Kofi Mensah', leaveType: 'sick', startDate: '2025-02-10', endDate: '2025-02-12', daysRequested: 3, reason: 'Flu symptoms', status: 'approved', appliedDate: '2025-02-09', approvedBy: 'ADM001', approvalDate: '2025-02-09', comments: 'Rest well' },
];

export const mockPurchaseOrders = [
  { poId: 'PO001', supplier: 'Emzor Pharmaceuticals', orderDate: '2025-03-01', items: [{ itemId: 'DRUG1', name: 'Artemether-Lumefantrine 20/120mg', quantity: 200, unitPrice: 1200, total: 240000 }, { itemId: 'DRUG13', name: 'Artesunate Injection 60mg', quantity: 50, unitPrice: 3000, total: 150000 }], totalAmount: 390000, status: 'received', approvedBy: 'FIN001', receivedDate: '2025-03-08', notes: 'Delivered in good condition' },
  { poId: 'PO002', supplier: 'Swiss Pharma Nigeria', orderDate: '2025-03-05', items: [{ itemId: 'DRUG2', name: 'Amoxicillin 500mg Capsules', quantity: 150, unitPrice: 600, total: 90000 }, { itemId: 'DRUG14', name: 'Ceftriaxone Injection 1g', quantity: 40, unitPrice: 2500, total: 100000 }], totalAmount: 190000, status: 'ordered', notes: '' },
  { poId: 'PO003', supplier: 'May & Baker', orderDate: '2025-03-10', items: [{ itemId: 'DRUG3', name: 'Paracetamol 500mg Tablets', quantity: 500, unitPrice: 200, total: 100000 }, { itemId: 'DRUG7', name: 'Amlodipine 5mg Tablets', quantity: 100, unitPrice: 550, total: 55000 }], totalAmount: 155000, status: 'approved', notes: '' },
  { poId: 'PO004', supplier: 'Fidson Healthcare', orderDate: '2025-03-12', items: [{ itemId: 'DRUG4', name: 'Ibuprofen 400mg Tablets', quantity: 200, unitPrice: 350, total: 70000 }, { itemId: 'DRUG8', name: 'Ciprofloxacin 500mg Tablets', quantity: 100, unitPrice: 850, total: 85000 }], totalAmount: 155000, status: 'pending-approval', notes: '' },
  { poId: 'PO005', supplier: 'Emzor Pharmaceuticals', orderDate: '2025-03-15', items: [{ itemId: 'DRUG5', name: 'Omeprazole 20mg Capsules', quantity: 120, unitPrice: 950, total: 114000 }], totalAmount: 114000, status: 'draft', notes: 'Urgent restock needed' },
  { poId: 'PO006', supplier: 'Swiss Pharma Nigeria', orderDate: '2025-02-20', items: [{ itemId: 'DRUG6', name: 'Metformin 500mg Tablets', quantity: 100, unitPrice: 700, total: 70000 }, { itemId: 'DRUG18', name: 'Insulin Glargine 100IU/ml', quantity: 20, unitPrice: 7200, total: 144000 }], totalAmount: 214000, status: 'received', approvedBy: 'FIN001', receivedDate: '2025-02-28', notes: '' },
  { poId: 'PO007', supplier: 'MedSupply Co.', orderDate: '2025-03-18', items: [{ itemId: 'SUP001', name: 'Surgical Gloves (Box)', quantity: 50, unitPrice: 2500, total: 125000 }, { itemId: 'SUP002', name: 'Syringes 5ml (Pack)', quantity: 100, unitPrice: 1500, total: 150000 }], totalAmount: 275000, status: 'pending-approval', notes: 'Medical supplies' },
  { poId: 'PO008', supplier: 'LabTech Supplies', orderDate: '2025-03-20', items: [{ itemId: 'LR001', name: 'CBC Reagent Kit', quantity: 10, unitPrice: 45000, total: 450000 }, { itemId: 'LR002', name: 'Blood Culture Media', quantity: 20, unitPrice: 8000, total: 160000 }], totalAmount: 610000, status: 'draft', notes: 'Lab reagents quarterly order' },
];

export const mockStockItems = [
  { itemId: 'SUP001', name: 'Surgical Gloves (Box)', category: 'medical-supply', currentStock: 45, unitOfMeasure: 'box', reorderLevel: 20, maxStock: 100, unitCost: 2500, supplier: 'MedSupply Co.', location: 'Store A' },
  { itemId: 'SUP002', name: 'Syringes 5ml (Pack)', category: 'medical-supply', currentStock: 85, unitOfMeasure: 'pack', reorderLevel: 30, maxStock: 150, unitCost: 1500, supplier: 'MedSupply Co.', location: 'Store A' },
  { itemId: 'SUP003', name: 'Cotton Wool (Pack)', category: 'medical-supply', currentStock: 60, unitOfMeasure: 'pack', reorderLevel: 25, maxStock: 120, unitCost: 800, supplier: 'MedSupply Co.', location: 'Store A' },
  { itemId: 'SUP004', name: 'Bandages (Roll)', category: 'medical-supply', currentStock: 40, unitOfMeasure: 'roll', reorderLevel: 20, maxStock: 80, unitCost: 500, supplier: 'MedSupply Co.', location: 'Store A' },
  { itemId: 'SUP005', name: 'Face Masks (Box)', category: 'medical-supply', currentStock: 30, unitOfMeasure: 'box', reorderLevel: 15, maxStock: 60, unitCost: 3000, supplier: 'MedSupply Co.', location: 'Store A' },
  { itemId: 'LR001', name: 'CBC Reagent Kit', category: 'lab-reagent', currentStock: 8, unitOfMeasure: 'kit', reorderLevel: 5, maxStock: 15, unitCost: 45000, supplier: 'LabTech Supplies', location: 'Lab Store' },
  { itemId: 'LR002', name: 'Blood Culture Media', category: 'lab-reagent', currentStock: 15, unitOfMeasure: 'bottle', reorderLevel: 10, maxStock: 30, unitCost: 8000, supplier: 'LabTech Supplies', location: 'Lab Store' },
  { itemId: 'LR003', name: 'Urine Test Strips', category: 'lab-reagent', currentStock: 25, unitOfMeasure: 'bottle', reorderLevel: 10, maxStock: 50, unitCost: 12000, supplier: 'LabTech Supplies', location: 'Lab Store' },
  { itemId: 'LR004', name: 'Glucose Test Strips', category: 'lab-reagent', currentStock: 12, unitOfMeasure: 'pack', reorderLevel: 8, maxStock: 25, unitCost: 8000, supplier: 'LabTech Supplies', location: 'Lab Store' },
  { itemId: 'EQ001', name: 'Thermometer (Digital)', category: 'equipment', currentStock: 20, unitOfMeasure: 'unit', reorderLevel: 10, maxStock: 40, unitCost: 5000, supplier: 'MedSupply Co.', location: 'Equipment Store' },
];

export const mockDrugAdministrations = mockDiagnoses.slice(0, 20).flatMap((dx, i) =>
    dx.prescriptions.map((pres, j) => ({
      adminId: `ADM-${String(1000 + i * 10 + j)}`,
      diagnosisId: dx.diagnosisId,
      patientId: dx.patientId,
      drugId: pres.drugId,
      drugName: pres.drugName,
      dosage: pres.dosage,
      route: pres.route,
      scheduledTime: `${dx.date}T0${Math.floor(Math.random() * 2) + 8}:00:00`,
      administeredTime: Math.random() > 0.3 ? `${dx.date}T0${Math.floor(Math.random() * 2) + 8}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00` : undefined,
      administeredBy: Math.random() > 0.3 ? 'NUR001' : undefined,
      status: ['pending', 'administered', 'missed', 'held'][Math.floor(Math.random() * 4)],
      notes: '',
      patientResponse: Math.random() > 0.5 ? ['Good', 'Mild nausea', 'No reaction', 'Slight drowsiness'][Math.floor(Math.random() * 4)] : undefined,
    }))
);

export const mockNursingRemarks = mockDiagnoses.slice(0, 15).map((dx, i) => ({
  remarkId: `NR-${String(1000 + i)}`,
  diagnosisId: dx.diagnosisId,
  patientId: dx.patientId,
  nurseId: 'NUR001',
  nurseName: 'Grace Adebayo',
  date: dx.date,
  careGiven: ['Administered prescribed medications', 'Monitored vital signs', 'Assisted with mobility', 'Provided wound care', 'Patient education'][Math.floor(Math.random() * 5)],
  patientResponse: ['Cooperative and responsive', 'Slight discomfort reported', 'Stable condition', 'Improved appetite'][Math.floor(Math.random() * 4)],
  vitalsSnapshot: { temperature: dx.vitals.temperature, bloodPressure: dx.vitals.bloodPressure, pulse: dx.vitals.pulse },
  recommendations: ['Continue monitoring', 'Encourage oral intake', 'Mobilize as tolerated', 'Follow-up in 24 hours'][Math.floor(Math.random() * 4)],
  shift: ['morning', 'afternoon', 'night'][Math.floor(Math.random() * 3)],
}));