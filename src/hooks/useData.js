import { useState, useCallback } from 'react';
import { storage } from '@/lib/dataStore';
import { STORAGE_KEYS } from '@/lib/constants';
import {seedDataIfNeeded} from "../lib/dataStore.js";

function useDataStore(key, initialData) {
  const [data, setData] = useState(() => storage.get(key, initialData));

  const refresh = useCallback(() => {
    setData(storage.get(key, []));
  }, [key]);

  const add = useCallback((item) => {
    setData(prev => {
      const updated = [item, ...prev];
      storage.set(key, updated);
      return updated;
    });
  }, [key]);

  const update = useCallback((id, updates, idField = 'id') => {
    setData(prev => {
      const updated = prev.map(item => {
        const itemId = item[idField];
        return itemId === id ? { ...item, ...updates } : item;
      });
      storage.set(key, updated);
      return updated;
    });
  }, [key]);

  const remove = useCallback((id, idField = 'id') => {
    setData(prev => {
      const updated = prev.filter(item => item[idField] !== id);
      storage.set(key, updated);
      return updated;
    });
  }, [key]);

  return { data, refresh, add, update, remove, setData };
}

export const usePatients = () => {
  const { data, refresh, add, update, remove, setData } = useDataStore(STORAGE_KEYS.PATIENTS, []);

  const search = useCallback((query) => {
    if (!query) return data;
    const q = query.toLowerCase();
    return data.filter(p =>
        p.patientId.toLowerCase().includes(q) ||
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
        p.phone.includes(q)
    );
  }, [data]);

  const getById = useCallback((id) => data.find(p => p.patientId === id), [data]);

  return {
    patients: data,
    refresh,
    addPatient: add,
    updatePatient: update,
    removePatient: remove,
    searchPatients: search,
    getPatientById: getById,
    setPatients: setData
  };
};

export const useDiagnoses = () => {
  seedDataIfNeeded();

  const { data, refresh, add, update, remove } = useDataStore(STORAGE_KEYS.DIAGNOSES, []);
  const getByPatientId = useCallback((patientId) => data.filter(d => d.patientId === patientId), [data]);
  const getById = useCallback((id) => data.find(d => d.diagnosisId === id), [data]);
  const getByDoctorId = useCallback((doctorId) => data.filter(d => d.doctorId === doctorId), [data]);

  return {
    diagnoses: data,
    refresh,
    addDiagnosis: add,
    updateDiagnosis: update,
    removeDiagnosis: remove,
    getDiagnosesByPatient: getByPatientId,
    getDiagnosisById: getById,
    getDiagnosesByDoctor: getByDoctorId
  };
};

export const useLabTests = () => {
  const { data, refresh, add, update, remove } = useDataStore(STORAGE_KEYS.LAB_TESTS, []);
  const getByDiagnosisId = useCallback((diagnosisId) => data.filter(t => t.diagnosisId === diagnosisId), [data]);
  const getByPatientId = useCallback((patientId) => data.filter(t => t.patientId === patientId), [data]);
  const getPending = useCallback(() => data.filter(t => t.status === 'ordered' || t.status === 'sample-collected' || t.status === 'in-progress'), [data]);

  return {
    labTests: data,
    refresh,
    addLabTest: add,
    updateLabTest: update,
    removeLabTest: remove,
    getLabTestsByDiagnosis: getByDiagnosisId,
    getLabTestsByPatient: getByPatientId,
    getPendingLabTests: getPending
  };
};

export const useDrugs = () => {
  const { data, refresh, add, update, remove } = useDataStore(STORAGE_KEYS.DRUGS, []);
  const getLowStock = useCallback(() => data.filter(d => d.stockQuantity <= d.reorderLevel), [data]);
  const getExpiring = useCallback(() => {
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    return data.filter(d => new Date(d.expiryDate) <= threeMonthsFromNow);
  }, [data]);
  const search = useCallback((query) => {
    if (!query) return data;
    const q = query.toLowerCase();
    return data.filter(d => d.name.toLowerCase().includes(q) || d.genericName.toLowerCase().includes(q));
  }, [data]);

  return {
    drugs: data,
    refresh,
    addDrug: add,
    updateDrug: update,
    removeDrug: remove,
    getLowStockDrugs: getLowStock,
    getExpiringDrugs: getExpiring,
    searchDrugs: search
  };
};

export const useDrugSales = () => {
  const { data, refresh, add, update } = useDataStore(STORAGE_KEYS.SALES, []);
  const getByPatientId = useCallback((patientId) => data.filter(s => s.patientId === patientId), [data]);
  const getByDiagnosisId = useCallback((diagnosisId) => data.filter(s => s.diagnosisId === diagnosisId), [data]);
  const getPending = useCallback(() => data.filter(s => s.paymentStatus === 'pending' || s.paymentStatus === 'partial'), [data]);

  return {
    sales: data,
    refresh,
    addSale: add,
    updateSale: update,
    getSalesByPatient: getByPatientId,
    getSalesByDiagnosis: getByDiagnosisId,
    getPendingSales: getPending
  };
};

export const useBills = () => {
  const { data, refresh, add, update } = useDataStore(STORAGE_KEYS.BILLS, []);
  const getByPatientId = useCallback((patientId) => data.filter(b => b.patientId === patientId), [data]);
  const getPending = useCallback(() => data.filter(b => b.paymentStatus === 'pending' || b.paymentStatus === 'partial'), [data]);

  return {
    bills: data,
    refresh,
    addBill: add,
    updateBill: update,
    getBillsByPatient: getByPatientId,
    getPendingBills: getPending
  };
};

export const useEquipment = () => {
  const { data, refresh, add, update, remove } = useDataStore(STORAGE_KEYS.EQUIPMENT, []);
  const getByStatus = useCallback((status) => data.filter(e => e.status === status), [data]);
  const getMaintenanceDue = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return data.filter(e => e.nextMaintenance <= today);
  }, [data]);

  return {
    equipment: data,
    refresh,
    addEquipment: add,
    updateEquipment: update,
    removeEquipment: remove,
    getEquipmentByStatus: getByStatus,
    getMaintenanceDue
  };
};

export const useStaff = () => {
  const { data, refresh, add, update, remove } = useDataStore(STORAGE_KEYS.STAFF, []);
  const getByDepartment = useCallback((dept) => data.filter(s => s.department === dept), [data]);
  const search = useCallback((query) => {
    if (!query) return data;
    const q = query.toLowerCase();
    return data.filter(s =>
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
        s.staffId.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
    );
  }, [data]);

  return {
    staff: data,
    refresh,
    addStaff: add,
    updateStaff: update,
    removeStaff: remove,
    getStaffByDepartment: getByDepartment,
    searchStaff: search
  };
};

export const useLeaveApplications = () => {
  const { data, refresh, add, update, remove } = useDataStore(STORAGE_KEYS.LEAVE, []);
  const getByStaffId = useCallback((staffId) => data.filter(l => l.staffId === staffId), [data]);
  const getPending = useCallback(() => data.filter(l => l.status === 'pending'), [data]);

  return {
    leaveApps: data,
    refresh,
    addLeave: add,
    updateLeave: update,
    removeLeave: remove,
    getLeaveByStaff: getByStaffId,
    getPendingLeave: getPending
  };
};

export const usePurchases = () => {
  const { data, refresh, add, update } = useDataStore(STORAGE_KEYS.PURCHASES, []);
  const getPending = useCallback(() => data.filter(p => p.status === 'pending-approval'), [data]);

  return {
    purchases: data,
    refresh,
    addPurchase: add,
    updatePurchase: update,
    getPendingPurchases: getPending
  };
};

export const useStockItems = () => {
  const { data, refresh, add, update, remove } = useDataStore(STORAGE_KEYS.STOCK, []);
  const getLowStock = useCallback(() => data.filter(s => s.currentStock <= s.reorderLevel), [data]);

  return {
    stockItems: data,
    refresh,
    addStockItem: add,
    updateStockItem: update,
    removeStockItem: remove,
    getLowStockItems: getLowStock
  };
};

export const useDrugAdministrations = () => {
  const { data, refresh, add, update } = useDataStore('hospitalise_administrations', []);
  const getByPatientId = useCallback((patientId) => data.filter(a => a.patientId === patientId), [data]);
  const getByDiagnosisId = useCallback((diagnosisId) => data.filter(a => a.diagnosisId === diagnosisId), [data]);
  const getPending = useCallback(() => data.filter(a => a.status === 'pending'), [data]);

  return {
    administrations: data,
    refresh,
    addAdmin: add,
    updateAdmin: update,
    getAdminByPatient: getByPatientId,
    getAdminByDiagnosis: getByDiagnosisId,
    getPendingAdmins: getPending
  };
};

export const useNursingRemarks = () => {
  const { data, refresh, add, update, remove } = useDataStore('hospitalise_nursing_remarks', []);
  const getByPatientId = useCallback((patientId) => data.filter(r => r.patientId === patientId), [data]);
  const getByDiagnosisId = useCallback((diagnosisId) => data.filter(r => r.diagnosisId === diagnosisId), [data]);

  return {
    remarks: data,
    refresh,
    addRemark: add,
    updateRemark: update,
    removeRemark: remove,
    getRemarksByPatient: getByPatientId,
    getRemarksByDiagnosis: getByDiagnosisId
  };
};