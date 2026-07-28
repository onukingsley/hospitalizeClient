import React, { useState } from 'react';
import { useDrugAdministrations, usePatients } from '@/hooks/useData';
import { formatDate } from '@/lib/formatters';
import PageHeader from '@/components/common/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Syringe, CheckCircle, Clock } from 'lucide-react';

const DrugAdministration = () => {
  const { administrations, updateAdmin } = useDrugAdministrations();
  const { getPatientById } = usePatients();
  // useDiagnoses hook available if needed
  const [notes, setNotes] = useState({});

  const pendingAdmins = administrations.filter(a => a.status === 'pending');
  const administeredToday = administrations.filter(a => a.status === 'administered');

  const handleAdminister = (adminId) => {
    updateAdmin(adminId, {
      status: 'administered',
      administeredTime: new Date().toISOString(),
      administeredBy: 'NUR001',
      notes: notes[adminId] || '',
    });
    toast.success('Drug marked as administered');
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Drug Administration" subtitle="Administer prescribed drugs and record patient response" breadcrumb={[{ label: 'Dashboard', path: '/nurse' }, { label: 'Drug Administration' }]} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-yellow-500" />Pending ({pendingAdmins.length})</h3>
          <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-thin">
            {pendingAdmins.map(admin => {
              const patient = getPatientById(admin.patientId);
              return (
                <Card key={admin.adminId} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center"><Syringe className="w-5 h-5 text-yellow-600" /></div>
                      <div>
                        <p className="font-medium">{admin.drugName}</p>
                        <p className="text-xs text-muted-foreground">{admin.dosage} • {admin.route}</p>
                        <p className="text-xs text-muted-foreground">{patient?.firstName} {patient?.lastName}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(admin.scheduledTime)}</p>
                      </div>
                    </div>
                    <StatusBadge status={admin.status} size="sm" />
                  </div>
                  <div className="mt-3">
                    <Textarea
                      placeholder="Notes..."
                      value={notes[admin.adminId] || ''}
                      onChange={e => setNotes(prev => ({ ...prev, [admin.adminId]: e.target.value }))}
                      className="text-sm"
                    />
                  </div>
                  <Button className="w-full mt-2" size="sm" onClick={() => handleAdminister(admin.adminId)}>
                    <CheckCircle className="w-4 h-4 mr-2" />Mark as Administered
                  </Button>
                </Card>
              );
            })}
            {pendingAdmins.length === 0 && <p className="text-center text-muted-foreground py-4">No pending administrations</p>}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" />Administered Today</h3>
          <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-thin">
            {administeredToday.slice(0, 15).map(admin => {
              const patient = getPatientById(admin.patientId);
              return (
                <div key={admin.adminId} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center"><CheckCircle className="w-4 h-4 text-green-600" /></div>
                    <div>
                      <p className="text-sm font-medium">{admin.drugName}</p>
                      <p className="text-xs text-muted-foreground">{patient?.firstName} {patient?.lastName}</p>
                    </div>
                  </div>
                  <span className="text-xs text-green-600">{formatDate(admin.administeredTime || '')}</span>
                </div>
              );
            })}
            {administeredToday.length === 0 && <p className="text-center text-muted-foreground py-4">No drugs administered today</p>}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DrugAdministration;
