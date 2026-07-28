import React, {useEffect, useState} from 'react';
import { useDiagnoses, usePatients, useNursingRemarks } from '@/hooks/useData';
import { formatDate } from '@/lib/formatters';
import PageHeader from '@/components/common/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {FileEdit, Search, Save, Stethoscope} from 'lucide-react';
import axiosClient from "../../service/axiosClient.js";
import {useSearchParams, useNavigate} from "react-router-dom";

const DiagnosisUpdate = () => {
  const { diagnoses, updateDiagnosis } = useDiagnoses();
  const { getPatientById } = usePatients();
  const { addRemark } = useNursingRemarks();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  const [filteredDiagnosis, setFilteredDiagnosis] = useState(null);
  const [nursingRemark, setNursingRemark] = useState('');
  const [careGiven, setCareGiven] = useState('');
  const [patientResponse, setPatientResponse] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [shift, setShift] = useState('morning');


  const [showMessage, setShowMessage] = useState(false);
  const [apiMessage, setApiMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();





  const activeDiagnoses = diagnoses.filter(d => d.status === 'active');
  const filteredDiagnoses = searchQuery
    ? activeDiagnoses.filter(d => {
        const patient = getPatientById(d.patientId);
        return d.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.diagnosisId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          `${patient?.firstName} ${patient?.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
      })
    : activeDiagnoses;


  const handleGetSales = () => {
    if (!searchQuery.trim()) {
      toast.warning('Please enter a patient ID');
      return;
    }

    setIsLoading(true);
    axiosClient.get(`/getNursePatientByRegNo?regID=${searchQuery}`)
        .then(({ data }) => {
          if (data.message?.includes('No Record found')) {
            setApiMessage(data.message);
            setShowMessage(true);
            setFilteredDiagnosis([]);
            setSelectedUser(null);
          } else {
            setFilteredDiagnosis(data.data?.patient?.diagnosis || []);
            console.log(data.data?.patient?.diagnosis )
            setSelectedUser(data.data);
          }
          setIsLoading(false);
        })
        .catch((e) => {
          console.error(e);
          toast.error('Failed to fetch patient data');
          setIsLoading(false);
        });
  };

  useEffect(() => {
    const regID = searchParams.get('regID');
    if (regID) {
      setSearchQuery(regID);
      handleGetSales();
    }
  }, [searchParams]);



  const handleSubmitRemark = () => {
    if (!selectedDiagnosis || !nursingRemark) {
      toast.error('Please enter a remark');
      return;
    }

    addRemark({
      remarkId: `NR_${Date.now()}`,
      diagnosisId: selectedDiagnosis.diagnosisId,
      patientId: selectedDiagnosis.patientId,
      nurseId: 'NUR001',
      nurseName: 'Grace Adebayo',
      date: new Date().toISOString().split('T')[0],
      careGiven,
      patientResponse,
      vitalsSnapshot: selectedDiagnosis.vitals,
      recommendations,
      shift,
    });

    updateDiagnosis(selectedDiagnosis.diagnosisId, { nursingRemarks: nursingRemark });
    toast.success('Diagnosis updated with nursing remarks');
    setSelectedDiagnosis(null);
    setNursingRemark('');
    setCareGiven('');
    setPatientResponse('');
    setRecommendations('');
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Diagnosis Update" subtitle="Update diagnoses with nursing remarks" breadcrumb={[{ label: 'Dashboard', path: '/nurse' }, { label: 'Diagnosis Update' }]} />

      {!selectedDiagnosis ? (
        <>
          {!selectedUser ? (
              <Card className="p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search active diagnoses..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10"  onKeyDown={e => e.key === 'Enter' && handleGetSales()}/>
                  </div>
                  <Button
                      onClick={handleGetSales}
                      disabled={isLoading}
                      className="h-12 px-8"
                  >
                    {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Searching...
                        </>
                    ) : (
                        <>
                          <Search className="w-4 h-4 mr-2" />
                          Search
                        </>
                    )}
                  </Button>
                </div>

              </Card>
          ) : (
              <>
                <Card className="p-4 mb-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                        {selectedUser.name?.[0]}{selectedUser.name?.[1]}
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{selectedUser.name} </p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="font-mono">{selectedUser.regID}</span>
                          <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                          <span>{selectedUser.gender}</span>
                          <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                          <span>{selectedUser.patient?.diagnosis?.length || 'N/A'} Diagnosis</span>
                          {selectedUser.patient?.blood_group && (
                              <>
                                <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                <span className="font-semibold text-primary">Blood: {selectedUser.patient?.blood_group}</span>
                              </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/nurse/patientDetail/${selectedUser.regID}`)}
                      >
                        View Profile
                      </Button>
                      <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(null);
                            setSearchQuery('');
                          }}
                      >
                        Change
                      </Button>
                    </div>
                  </div>
                </Card>
                <div className="space-y-3">
                  {filteredDiagnosis?.map(dx => {
                    const patient = getPatientById(dx.patientId);
                    return (
                        <Card key={dx.id} className="p-4 hover:shadow-md transition-all cursor-pointer">
                          {/*<Card key={dx.id} className="p-4 hover:shadow-md transition-all cursor-pointer" onClick={() => setSelectedDiagnosis(dx)}>*/}
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">{patient?.firstName?.[0]}{patient?.lastName?.[0]}</div>
                              <div>
                                <p className="font-semibold">{dx.final_diagnosis}</p>
                                <p className="text-xs text-muted-foreground">{dx.diagnosisId} • {dx.doctorName}</p>
                                <p className="text-sm mt-1">{selectedUser?.name} </p>
                                {/*  <div className="flex gap-2 mt-2">
                          {dx.prescriptions.length > 0 && <Badge variant="outline" className="text-xs">{dx.prescriptions.length} prescriptions</Badge>}
                        </div>*/}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline"  onClick={() => navigate(`/nurse/diagnosisDetail/${dx.id}`)}>
                                view Diagnosis
                              </Button>
                              <Button
                                  onClick={() => navigate(`/nurse/diagnosisReport/new?regID=${selectedUser?.regID}&diagnosis_id=${dx.id}`)}>                            <Stethoscope className="w-4 h-4 mr-2" />
                                add Report
                              </Button>

                            </div>
                            {/*<StatusBadge status={dx.status} size="sm" />*/}
                          </div>
                        </Card>
                    );
                  })}
                  {filteredDiagnosis?.length === 0 && <p className="text-center text-muted-foreground py-8">No active diagnoses</p>}
                </div>
              </>
          ) }



        </>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><FileEdit className="w-5 h-5 text-primary" />Nursing Assessment</h3>
              <div className="space-y-4">
                <div>
                  <Label>Care Given *</Label>
                  <Textarea value={careGiven} onChange={e => setCareGiven(e.target.value)} placeholder="Describe care provided..." />
                </div>
                <div>
                  <Label>Patient Response</Label>
                  <Textarea value={patientResponse} onChange={e => setPatientResponse(e.target.value)} placeholder="How did the patient respond?" />
                </div>
                <div>
                  <Label>Nursing Remarks *</Label>
                  <Textarea value={nursingRemark} onChange={e => setNursingRemark(e.target.value)} placeholder="Enter nursing observations and remarks..." required />
                </div>
                <div>
                  <Label>Recommendations</Label>
                  <Textarea value={recommendations} onChange={e => setRecommendations(e.target.value)} placeholder="Any recommendations for the doctor..." />
                </div>
                <div>
                  <Label>Shift</Label>
                  <Select value={shift} onValueChange={(v) => setShift(v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning</SelectItem>
                      <SelectItem value="afternoon">Afternoon</SelectItem>
                      <SelectItem value="night">Night</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setSelectedDiagnosis(null)}>Cancel</Button>
                  <Button onClick={handleSubmitRemark}><Save className="w-4 h-4 mr-2" />Submit Remarks</Button>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-2">Patient Info</h4>
              <p className="text-sm">{getPatientById(selectedDiagnosis.patientId)?.firstName} {getPatientById(selectedDiagnosis.patientId)?.lastName}</p>
              <p className="text-xs text-muted-foreground">{selectedDiagnosis.patientId}</p>
            </Card>
            <Card className="p-4">
              <h4 className="font-semibold mb-2">Diagnosis</h4>
              <p className="text-sm">{selectedDiagnosis.finalDiagnosis}</p>
              <p className="text-xs text-muted-foreground mt-1">{selectedDiagnosis.doctorName} • {formatDate(selectedDiagnosis.date)}</p>
            </Card>
            <Card className="p-4">
              <h4 className="font-semibold mb-2">Prescriptions</h4>
              {selectedDiagnosis.prescriptions.map((pres, i) => (
                <div key={i} className="text-sm py-1 border-b last:border-0">
                  <p className="font-medium">{pres.drugName}</p>
                  <p className="text-xs text-muted-foreground">{pres.dosage} • {pres.frequency}</p>
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosisUpdate;
