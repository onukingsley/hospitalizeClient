import { STORAGE_KEYS } from './constants';

export const storage = {
  get: (key, defaultValue) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  },
  remove: (key) => {
    localStorage.removeItem(key);
  },
  clear: () => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  },
};

export const seedDataIfNeeded = () => {
  const isSeeded = storage.get(STORAGE_KEYS.SEEDED, false);

  if (!isSeeded) {
    import('./mockData').then((module) => {
      const { mockPatients, mockStaff, mockDiagnoses, mockLabTests, mockDrugs, mockDrugSales, mockBills, mockEquipment, mockLeaveApplications, mockPurchaseOrders, mockStockItems, mockDrugAdministrations, mockNursingRemarks } = module;
      storage.set(STORAGE_KEYS.PATIENTS, mockPatients);
      storage.set(STORAGE_KEYS.STAFF, mockStaff);
      storage.set(STORAGE_KEYS.DIAGNOSES, mockDiagnoses);
      storage.set(STORAGE_KEYS.LAB_TESTS, mockLabTests);
      storage.set(STORAGE_KEYS.DRUGS, mockDrugs);
      storage.set(STORAGE_KEYS.SALES, mockDrugSales);
      storage.set(STORAGE_KEYS.BILLS, mockBills);
      storage.set(STORAGE_KEYS.EQUIPMENT, mockEquipment);
      storage.set(STORAGE_KEYS.LEAVE, mockLeaveApplications);
      storage.set(STORAGE_KEYS.PURCHASES, mockPurchaseOrders);
      storage.set(STORAGE_KEYS.STOCK, mockStockItems);
      storage.set('hospitalise_administrations', mockDrugAdministrations);
      storage.set('hospitalise_nursing_remarks', mockNursingRemarks);
      storage.set(STORAGE_KEYS.NOTIFICATIONS, [
        { id: '1', title: 'Welcome to Hospitalise', message: 'Your hospital management system is ready to use.', type: 'info', timestamp: new Date().toISOString(), read: false },
        { id: '2', title: 'Low Stock Alert', message: 'Artesunate Injection is running low. Current stock: 90 units.', type: 'warning', timestamp: new Date().toISOString(), read: false },
        { id: '3', title: 'Maintenance Due', message: 'Autoclave (EQ008) maintenance is overdue.', type: 'warning', timestamp: new Date().toISOString(), read: false },
        { id: '4', title: 'Leave Approved', message: 'Your leave application has been approved.', type: 'success', timestamp: new Date().toISOString(), read: true },
      ]);
      storage.set(STORAGE_KEYS.SEEDED, true);
      window.location.reload();
    });
  }
};

export const resetAllData = () => {
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  localStorage.removeItem('hospitalise_administrations');
  localStorage.removeItem('hospitalise_nursing_remarks');
  window.location.reload();
};