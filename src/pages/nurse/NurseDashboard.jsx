import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDiagnoses, usePatients, useDrugAdministrations, useNursingRemarks } from '@/hooks/useData';
import { formatNumber } from '@/lib/formatters';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Syringe, HeartPulse, FileText, ArrowRight, Activity, Bed } from 'lucide-react';

const NurseDashboard = () => {
  const navigate = useNavigate();
  const { diagnoses } = useDiagnoses();
  const { patients } = usePatients();
  const { getPendingAdmins } = useDrugAdministrations();
  const { remarks } = useNursingRemarks();

  const activeDiagnoses = diagnoses.filter(d => d.status === 'active');
  const pendingAdmins = getPendingAdmins();
  const todayRemarks = remarks.filter(r => r.date === '2025-04-18');

  return (
    <div className="space-y-6">
      <PageHeader title="Nurse Dashboard" subtitle="Patient care and drug administration" actions={<Button onClick={() => navigate('/nurse/drug-admin')}><Syringe className="w-4 h-4 mr-2" />Drug Administration</Button>} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Patients" value={formatNumber(activeDiagnoses.length)} icon={<HeartPulse className="w-5 h-5" />} color="bg-red-500" />
        <StatCard title="Pending Admin" value={formatNumber(pendingAdmins.length)} icon={<Syringe className="w-5 h-5" />} color="bg-yellow-500" />
        <StatCard title="Today's Remarks" value={formatNumber(todayRemarks.length)} icon={<FileText className="w-5 h-5" />} color="bg-blue-500" />
        <StatCard title="Ward Capacity" value="85%" icon={<Bed className="w-5 h-5" />} color="bg-green-500" onClick={() => navigate('/nurse/wards')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Pending Drug Administration</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/nurse/drug-admin')}><ArrowRight className="w-4 h-4 ml-1" /></Button>
          </div>
          <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-thin">
            {pendingAdmins.slice(0, 8).map(admin => {
              const patient = patients.find(p => p.patientId === admin.patientId);
              return (
                <div key={admin.adminId} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer" onClick={() => navigate('/nurse/drug-admin')}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Syringe className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{admin.drugName}</p>
                      <p className="text-xs text-muted-foreground">{patient?.firstName} {patient?.lastName} • {admin.dosage}</p>
                    </div>
                  </div>
                  <StatusBadge status={admin.status} size="sm" />
                </div>
              );
            })}
            {pendingAdmins.length === 0 && <p className="text-center text-sm text-muted-foreground py-4">No pending administrations</p>}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Active Patients</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/nurse/diagnosis-update')}><ArrowRight className="w-4 h-4 ml-1" /></Button>
          </div>
          <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-thin">
            {activeDiagnoses.slice(0, 8).map(dx => {
              const patient = patients.find(p => p.patientId === dx.patientId);
              return (
                <div key={dx.diagnosisId} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer" onClick={() => navigate('/nurse/diagnosis-update')}>
                  <div>
                    <p className="text-sm font-medium">{patient?.firstName} {patient?.lastName}</p>
                    <p className="text-xs text-muted-foreground">{dx.finalDiagnosis}</p>
                  </div>
                  <Activity className="w-4 h-4 text-green-500" />
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NurseDashboard;
