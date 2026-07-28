import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatients } from '@/hooks/useData';
import { calculateAge, formatDate } from '@/lib/formatters';
import PageHeader from '@/components/common/PageHeader';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Search, User, Phone, Calendar, Droplets, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {adminUserManagement, paymentStore} from "../../store/store.jsx";
import axiosClient from "../../service/axiosClient.js";

const PatientRecords = () => {
  const navigate = useNavigate();
  const {  searchPatients } = usePatients();
  const {patients} = adminUserManagement();
  const {rates} = paymentStore()
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchPatient, setSearchedPatient] = useState([]);
  const [payloadForm, setPayloadForm] = useState({});
  const [isLoading, setIsLoading] = useState(false);
    const [selectedRate, setSelectedRate] = useState({});



    useEffect(()=>{
        if (searchQuery === ''){
            setSearchedPatient([])
        }
    },[searchQuery])

    const bookConsultation = ()=>{
        axiosClient.post('/setConsultation', {patient_id : selectedPatient.id,
            rates_id : selectedRate.id,
            amount : selectedRate.amount
        })
            .then(({data})=>{
                alert(data.message)
            })
    }
    const handleGetDiagnosis = ()=>{
        setIsLoading(true)
        axiosClient.get(`/getPatient?payload=${searchQuery}`)
            .then(({data})=>{
                setIsLoading(false)
                if (data.data.length == 0){
                    alert('No Patient Diagnosis Found. Confirm the Data Input')
                    setSearchQuery('')
                }
                console.log([data.data])
                setSearchedPatient([data.data.patient])
                console.log([data.data.patient])
                /*const filteredDiagnoses = searchQuery
                    ? myDiagnoses.filter(d => {
                        const patient = getPatientById(d.patientId);
                        return d.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            d.diagnosisId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            `${patient?.firstName} ${patient?.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
                    })
                    : doctorsDiagnosis;*/
            }).catch(e=> {
            console.log(e)
            setIsLoading(false)
        })
    }

  const filteredPatients = searchPatient.length > 0 ? searchPatient : patients;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patient Records"
        subtitle="Search and view patient records"
        breadcrumb={[{ label: 'Dashboard', path: '/clerk' }, { label: 'Patient Records' }]}
        actions={<Button onClick={() => navigate('/clerk/registration')}><User className="w-4 h-4 mr-2" />New Patient</Button>}
      />

      <Card className="p-4">
          <div className='flex gap-x-2' >
              <Input placeholder="Search by patient ID, diagnosis ID, or patient name..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
              <Button variant={'ghost'} onClick={handleGetDiagnosis}> <Search className=" w-4 h-4 text-muted-foreground" /></Button>
          </div>

      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.map(patient => (
          <Card
            key={patient.patientId}
            className="p-4 cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5"
            onClick={() => setSelectedPatient(patient)}
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg flex-shrink-0">
                {patient.user.name[0]}{patient.user.name[1]}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold truncate">{patient.user.name}</h4>
                <p className="text-xs text-muted-foreground">{patient.user.regID}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
{/*
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{calculateAge(patient.dateOfBirth)}y</span>
*/}
                  <span className="flex items-center gap-1"><Droplets className="w-3 h-3" />{patient.blood_group}</span>
                  <span className="capitalize">{patient?.gender}</span>
                </div>
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <Phone className="w-3 h-3" />{patient.user.phone_no}
                </div>
                {JSON.parse(patient?.allergies)?.length > 0 || patients.allergies != null && (
                  <div className="flex items-center gap-1 mt-2">
                    <AlertCircle className="w-3 h-3 text-red-500" />
                    <div className="flex gap-1 flex-wrap">
                      {JSON.parse(patient?.allergies)?.map(a => (
                        <Badge key={a} variant="destructive" className="text-[10px] px-1 py-0">{a}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No patients found</p>
        </div>
      )}

      {/* Patient Detail Dialog */}
      <Dialog open={!!selectedPatient} onOpenChange={() => setSelectedPatient(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Patient Details</DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                  {selectedPatient.user.name[0]}{selectedPatient.user.name[1]}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedPatient.user.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedPatient.user.regID}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
{/*
                <div><span className="text-muted-foreground">Age:</span> {calculateAge(selectedPatient.dateOfBirth)} years</div>
*/}
                <div><span className="text-muted-foreground">Gender:</span> {selectedPatient.user.gender}</div>
                <div><span className="text-muted-foreground">Blood Type:</span> {selectedPatient.blood_group}</div>
                <div><span className="text-muted-foreground">Phone:</span> {selectedPatient.user.phone_no}</div>
                <div className="col-span-2"><span className="text-muted-foreground">Address:</span> {selectedPatient.user.address}</div>
                <div className="col-span-2"><span className="text-muted-foreground">Email:</span> {selectedPatient.user.email || 'N/A'}</div>
                <div><span className="text-muted-foreground">Registered:</span> {formatDate(selectedPatient.created_at)}</div>
                <div><span className="text-muted-foreground">Insurance:</span> {selectedPatient.insuranceProvider || 'None'}</div>
              </div>

              {JSON.parse(selectedPatient?.allergies)?.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-1">Allergies</p>
                  <div className="flex gap-1 flex-wrap">
                    {JSON.parse(selectedPatient?.allergies)?.map(a => <Badge key={a} variant="destructive">{a}</Badge>)}
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm font-medium mb-1">Emergency Contact</p>
                <p className="text-sm text-muted-foreground">{selectedPatient.nos_name} {/*({selectedPatient.emergencyContact.relationship})*/}</p>
                <p className="text-sm text-muted-foreground">{selectedPatient.nos_phone_no}</p>
              </div>



                <div>
                    <Label>Consultation Rate *</Label>
                    <Select
                        value={selectedRate?.id?.toString()}
                        onValueChange={(v) => {
                            const rate = rates.find(r => r.id.toString() === v);
                            setSelectedRate(rate);
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a rate" />
                        </SelectTrigger>
                        <SelectContent>
                            {rates?.map((rate) => (
                                <SelectItem key={rate.id} value={rate.id.toString()}>
                                    {rate.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

              <div className="flex gap-2 pt-2">
                <Button className="flex-1" onClick={() => { navigate(`/clerk/patientDetail/${selectedPatient.user.regID}`); setSelectedPatient(null);  }}>
                  view Patient
                </Button>
                <Button variant="outline" className="flex-1" onClick={() =>{ bookConsultation(); setSelectedPatient(null) }}>
                  Book Consultation
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientRecords;
