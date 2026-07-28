
export const navigationConfig = [
  // Admin
  { label: 'Dashboard', path: '/admin', icon: 'LayoutDashboard', roles: ['admin'] },
  { label: 'Staff Management', path: '/admin/staff', icon: 'Users', roles: ['admin'] },
  { label: 'Departments', path: '/admin/departments', icon: 'Building2', roles: ['admin'] },
  { label: 'System Reports', path: '/admin/reports', icon: 'BarChart3', roles: ['admin'] },
  { label: 'Configuration', path: '/admin/config', icon: 'Settings2', roles: ['admin'] },

  // Clerk
  { label: 'Dashboard', path: '/clerk', icon: 'LayoutDashboard', roles: ['clerk'] },
  { label: 'Patient Registration', path: '/clerk/registration', icon: 'UserPlus', roles: ['clerk'] },
  { label: 'Patient Records', path: '/clerk/patients', icon: 'Users', roles: ['clerk'] },
  { label: 'Payment Collection', path: '/clerk/payments', icon: 'Banknote', roles: ['clerk'] },
  { label: 'Queue Management', path: '/clerk/queue', icon: 'ListOrdered', roles: ['clerk'] },

  // Doctor
  { label: 'Dashboard', path: '/doctor', icon: 'LayoutDashboard', roles: ['doctor'] },
  { label: 'Patient Diagnosis', path: '/doctor/diagnosis', icon: 'Stethoscope', roles: ['doctor'] },
  { label: 'New Diagnosis', path: '/doctor/diagnosis/new', icon: 'FilePlus', roles: ['doctor'] },
  { label: 'Patient History', path: '/doctor/history', icon: 'Clock', roles: ['doctor'] },
  { label: 'My Patients', path: '/doctor/patients', icon: 'Users', roles: ['doctor'] },

  // Lab
  { label: 'Dashboard', path: '/labScientist', icon: 'LayoutDashboard', roles: ['labScientist'] },
  { label: 'Tests & Results', path: '/lab/tests', icon: 'FlaskConical', roles: ['labScientist'] },
  { label: 'Lab Reports', path: '/lab/reports', icon: 'FileText', roles: ['labScientist'] },
  { label: 'Equipment', path: '/lab/equipment', icon: 'Wrench', roles: ['labScientist'] },
  { label: 'Upload Results', path: '/lab/upload', icon: 'Upload', roles: ['labScientist'] },

  // Pharmacy
  { label: 'Dashboard', path: '/pharmasist', icon: 'LayoutDashboard', roles: ['pharmasist'] },
  { label: 'Drug Dispensing', path: '/pharmacy/dispense', icon: 'Pill', roles: ['pharmasist'] },
  { label: 'Drug Stock', path: '/pharmacy/stock', icon: 'Package', roles: ['pharmasist'] },
  { label: 'Drug Requests', path: '/pharmacy/requests', icon: 'ShoppingCart', roles: ['pharmasist'] },
  { label: 'Patient Drug Sales', path: '/pharmacy/sales', icon: 'CreditCard', roles: ['pharmasist'] },
  { label: 'All Drug Sales', path: '/pharmacy/all-sales', icon: 'Receipt', roles: ['pharmasist'] },

  // Nurse
  { label: 'Dashboard', path: '/nurse', icon: 'LayoutDashboard', roles: ['nurse'] },
  { label: 'Diagnosis Update', path: '/nurse/diagnosis-update', icon: 'FileEdit', roles: ['nurse'] },
  { label: 'Drug Administration', path: '/nurse/drug-admin', icon: 'Syringe', roles: ['nurse'] },
  { label: 'Patient Remarks', path: '/nurse/remarks', icon: 'MessageSquare', roles: ['nurse'] },
  { label: 'Ward Management', path: '/nurse/wards', icon: 'Bed', roles: ['nurse'] },

  // Finance
  { label: 'Dashboard', path: '/accountant', icon: 'LayoutDashboard', roles: ['accountant'] },
  { label: 'Payment Management', path: '/finance/payments', icon: 'Banknote', roles: ['accountant'] },
  { label: 'P&L Analysis', path: '/finance/pl-analysis', icon: 'TrendingUp', roles: ['accountant'] },
  { label: 'Salary & Allowances', path: '/finance/salary', icon: 'Wallet', roles: ['accountant'] },
  { label: 'Stock Purchases', path: '/finance/purchases', icon: 'ShoppingBag', roles: ['accountant'] },
  { label: 'General Reports', path: '/finance/reports', icon: 'BarChart3', roles: ['accountant'] },
  { label: 'Billing', path: '/finance/billing', icon: 'FileText', roles: ['accountant'] },

  // Secretary
  { label: 'Dashboard', path: '/secretary', icon: 'LayoutDashboard', roles: ['secretary'] },
  { label: 'Leave Application', path: '/secretary/leave', icon: 'Calendar', roles: ['secretary'] },
  { label: 'Appointments', path: '/secretary/appointments', icon: 'CalendarDays', roles: ['secretary'] },
  { label: 'Correspondence', path: '/secretary/mail', icon: 'Mail', roles: ['secretary'] },
  { label: 'Reports', path: '/secretary/reports', icon: 'BarChart3', roles: ['secretary'] },

  // Patient
  { label: 'Dashboard', path: '/patient', icon: 'LayoutDashboard', roles: ['patient'] },
  { label: 'My Diagnosis', path: '/patient/diagnosis', icon: 'Stethoscope', roles: ['patient'] },
  { label: 'My Lab Results', path: '/patient/lab-results', icon: 'FlaskConical', roles: ['patient'] },
  { label: 'My Bills', path: '/patient/bills', icon: 'Banknote', roles: ['patient'] },
  { label: 'My Appointments', path: '/patient/appointments', icon: 'CalendarDays', roles: ['patient'] },
  { label: 'Complaints', path: '/patient/complaints', icon: 'MessageSquare', roles: ['patient'] },
];

export const getNavigationForRole = (role) => {
  if (role === 'admin') {
    return [
      { label: 'Dashboard', path: '/admin', icon: 'LayoutDashboard', roles: ['admin'] },
      { label: 'Staff', path: '/admin/staff', icon: 'Users', roles: ['admin'] },
      { label: 'Departments', path: '/admin/departments', icon: 'Building2', roles: ['admin'] },
      { label: 'Reports', path: '/admin/reports', icon: 'BarChart3', roles: ['admin'] },
      { label: 'Configuration', path: '/admin/config', icon: 'Settings2', roles: ['admin'] },
      { label: 'Patient Registration', path: '/clerk/registration', icon: 'UserPlus', roles: ['clerk'] },
      { label: 'Diagnosis', path: '/doctor/diagnosis', icon: 'Stethoscope', roles: ['doctor'] },
      { label: 'Lab Tests', path: '/lab/tests', icon: 'FlaskConical', roles: ['lab'] },
      { label: 'Drug Stock', path: '/pharmacy/stock', icon: 'Package', roles: ['pharmasist'] },
      { label: 'Payments', path: '/finance/payments', icon: 'Banknote', roles: ['finance'] },
    ];
  }
  return navigationConfig.filter(item => item.roles.includes(role));
};

export const getDashboardPath = (role) => {
  return `/${role}`;
};
