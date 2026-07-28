import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDiagnoses, usePatients } from '@/hooks/useData';
import { formatDate, calculateAge } from '@/lib/formatters';
import PageHeader from '@/components/common/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Stethoscope, FileText, Activity, Thermometer, Heart, Gauge } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const PatientDiagnosis  = () => {
  const navigate = useNavigate();
  const { diagnoses } = useDiagnoses();
  const { getPatientById } = usePatients();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);

  const myDiagnoses = diagnoses.filter(d => d.doctorId === 'DOC001');
  const filteredDiagnoses = searchQuery
    ? myDiagnoses.filter(d => {
        const patient = getPatientById(d.patientId);
        return d.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.diagnosisId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          `${patient?.firstName} ${patient?.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
      })
    : myDiagnoses;

  const activeDiagnoses = filteredDiagnoses.filter(d => d.status === 'active');
  const completedDiagnoses = filteredDiagnoses.filter(d => d.status === 'completed' || d.status === 'closed');
  const draftDiagnoses = filteredDiagnoses.filter(d => d.status === 'draft');

  const DiagnosisList = ({ items }) => (
    <div className="space-y-3">
      {items.map(dx => {
        const patient = getPatientById(dx.patientId);
        return (
          <Card key={dx.diagnosisId} className="p-4 hover:shadow-md transition-all cursor-pointer" onClick={() => setSelectedDiagnosis(dx)}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                  {patient?.firstName?.[0]}{patient?.lastName?.[0]}
                </div>
                <div>
                  <p className="font-semibold">{patient?.firstName} {patient?.lastName}</p>
                  <p className="text-xs text-muted-foreground">{dx.diagnosisId} • {formatDate(dx.date)}</p>
                  <p className="text-sm mt-1">{dx.finalDiagnosis || dx.provisionalDiagnosis}</p>
                  <div className="flex gap-2 mt-2">
                    {dx.prescriptions.length > 0 && <Badge variant="outline" className="text-xs">{dx.prescriptions.length} prescriptions</Badge>}
                    {dx.labOrders.length > 0 && <Badge variant="outline" className="text-xs">{dx.labOrders.length} lab orders</Badge>}
                  </div>
                </div>
              </div>
              <StatusBadge status={dx.status} size="sm" />
            </div>
          </Card>
        );
      })}
      {items.length === 0 && <p className="text-center text-muted-foreground py-8">No diagnoses found</p>}
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patient Diagnosis"
        subtitle="View and manage patient diagnoses"
        breadcrumb={[{ label: 'Dashboard', path: '/doctor' }, { label: 'Patient Diagnosis' }]}
        actions={<Button onClick={() => navigate('/doctor/diagnosis/new')}><Stethoscope className="w-4 h-4 mr-2" />New Diagnosis</Button>}
      />

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by patient ID, diagnosis ID, or patient name..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
      </Card>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active ({activeDiagnoses.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedDiagnoses.length})</TabsTrigger>
          <TabsTrigger value="drafts">Drafts ({draftDiagnoses.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="active"><DiagnosisList items={activeDiagnoses} /></TabsContent>
        <TabsContent value="completed"><DiagnosisList items={completedDiagnoses} /></TabsContent>
        <TabsContent value="drafts"><DiagnosisList items={draftDiagnoses} /></TabsContent>
      </Tabs>

      {/* Diagnosis Detail Dialog */}
      <Dialog open={!!selectedDiagnosis} onOpenChange={() => setSelectedDiagnosis(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Diagnosis Details</DialogTitle></DialogHeader>
          {selectedDiagnosis && (() => {
            const patient = getPatientById(selectedDiagnosis.patientId);
            return (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {patient?.firstName?.[0]}{patient?.lastName?.[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold">{patient?.firstName} {patient?.lastName}</h3>
                    <p className="text-sm text-muted-foreground">{selectedDiagnosis.patientId} • {calculateAge(patient?.dateOfBirth || '')}y • {patient?.gender}</p>
                  </div>
                  <StatusBadge status={selectedDiagnosis.status} size="sm" />
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <div className="p-2 bg-muted rounded text-center">
                    <Thermometer className="w-4 h-4 mx-auto text-orange-500" />
                    <p className="text-xs text-muted-foreground">Temp</p>
                    <p className="text-sm font-semibold">{selectedDiagnosis.vitals.temperature}°C</p>
                  </div>
                  <div className="p-2 bg-muted rounded text-center">
                    <Gauge className="w-4 h-4 mx-auto text-red-500" />
                    <p className="text-xs text-muted-foreground">BP</p>
                    <p className="text-sm font-semibold">{selectedDiagnosis.vitals.bloodPressure}</p>
                  </div>
                  <div className="p-2 bg-muted rounded text-center">
                    <Heart className="w-4 h-4 mx-auto text-pink-500" />
                    <p className="text-xs text-muted-foreground">Pulse</p>
                    <p className="text-sm font-semibold">{selectedDiagnosis.vitals.pulse}</p>
                  </div>
                  <div className="p-2 bg-muted rounded text-center">
                    <Activity className="w-4 h-4 mx-auto text-blue-500" />
                    <p className="text-xs text-muted-foreground">SpO2</p>
                    <p className="text-sm font-semibold">{selectedDiagnosis.vitals.spO2}%</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1">Chief Complaints</p>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded">{selectedDiagnosis.chiefComplaints}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Provisional Diagnosis</p>
                    <p className="text-sm text-muted-foreground">{selectedDiagnosis.provisionalDiagnosis}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Final Diagnosis</p>
                    <p className="text-sm text-muted-foreground">{selectedDiagnosis.finalDiagnosis}</p>
                  </div>
                </div>

                {selectedDiagnosis.prescriptions.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Prescriptions</p>
                    <div className="space-y-1">
                      {selectedDiagnosis.prescriptions.map((pres, i) => (
                        <div key={i} className="flex justify-between p-2 bg-muted rounded text-sm">
                          <span>{pres.drugName} {pres.dosage}</span>
                          <span className="text-muted-foreground">{pres.frequency} × {pres.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedDiagnosis.labOrders.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Lab Orders</p>
                    <div className="space-y-1">
                      {selectedDiagnosis.labOrders.map((order, i) => (
                        <div key={i} className="flex justify-between items-center p-2 bg-muted rounded text-sm">
                          <span>{order.testName}</span>
                          <StatusBadge status={order.priority} size="sm" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedDiagnosis.nursingRemarks && (
                  <div>
                    <p className="text-sm font-medium mb-1">Nursing Remarks</p>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded">{selectedDiagnosis.nursingRemarks}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button className="flex-1" onClick={() => { setSelectedDiagnosis(null); navigate('/nurse/diagnosis-update'); }}>
                    <FileText className="w-4 h-4 mr-2" />Update Diagnosis
                  </Button>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientDiagnosis;
