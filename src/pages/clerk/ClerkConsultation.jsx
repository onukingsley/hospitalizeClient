import React, {useEffect, useState} from 'react';
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
import {Search, Stethoscope, FileText, Activity, Thermometer, Heart, Gauge, Check, Trash} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {adminUserManagement, diagnosisStore, userStore} from "../../store/store.jsx";
import axiosClient from "../../service/axiosClient.js";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@radix-ui/react-alert-dialog";
import {AlertDialogFooter, AlertDialogHeader} from "../../components/ui/alert-dialog.js";
import {format} from "date-fns";
import {toast} from "sonner";

const ClerkConsultation  = () => {
    const navigate = useNavigate();
    const { diagnoses } = useDiagnoses();
    const { getPatientById } = usePatients();
    const { patients } = adminUserManagement();
    const { doctor } = userStore();
    const { inwardDiagnosis,outPatientDiagnosis,doctorsDiagnosis,removeAwaitingConsultation,addConsultation,consultations,pendingConsultation,dailyConsultation } = diagnosisStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
    const [searchDiagnosis, setSearchedDiagnosis] = useState([]);
    const [isLoading, setIsLoading] = useState(false);


    const showToast = (title,message) => {
        /*toast.success(message, {
            duration: 2000,
        })*/
        toast.success(title, {
            description: message,
            duration: 10000,
            className: 'z-[1000]',
            position: "top-center"

        })
    }

    /*
        useEffect(()=>{
            if (searchQuery === ''){
                setSearchedDiagnosis([])
            }
        },[searchQuery])
        const handleGetDiagnosis = ()=>{
            setIsLoading(true)
            axiosClient.get(`/getDoctorsPatientDiagnosis?details=${searchQuery}`)
                .then(({data})=>{
                    setIsLoading(false)
                    if (data.data.length == 0){
                        alert('No Patient Diagnosis Found. Confirm the Data Input')
                        setSearchQuery('')
                    }
                    setSearchedDiagnosis(data.data)
                    /!*const filteredDiagnoses = searchQuery
                        ? myDiagnoses.filter(d => {
                            const patient = getPatientById(d.patientId);
                            return d.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                d.diagnosisId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                `${patient?.firstName} ${patient?.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
                        })
                        : doctorsDiagnosis;*!/
                }).catch(e=> {
                console.log(e)
                setIsLoading(false)
            })
        }*/



    // const myDiagnoses = diagnoses.filter(d => d.doctorId === 'DOC001');



    const DiagnosisList = ({ items }) => (

        <div className="space-y-3">
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                        <p className="text-sm text-muted-foreground">Searching for Diagnosis. Please wait...</p>
                    </div>
                </div>
            ) : (
                <>
                    {items?.length > 0 ? (
                        items.map(dx => {
                            console.log(dx);
                            const isOwnConsultation = dx.doctor_id === doctor?.id;

                            return (
                                <Card
                                    key={dx.id}
                                    className={`p-4 hover:shadow-md transition-all cursor-pointer ${
                                        isOwnConsultation ? 'bg-primary/5 border-primary/20' : 'bg-white hover:bg-muted/50'
                                    }`}
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="flex items-start gap-3 flex-1 min-w-0">
                                            {/* Avatar */}
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                                                {dx?.patient?.user?.name?.[0] || '?'}
                                                {dx?.patient?.user?.name?.[1] || ''}
                                            </div>

                                            {/* Patient Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p className="font-semibold truncate">
                                                        {dx?.patient?.user?.name || 'Unknown Patient'}
                                                    </p>
                                                    <span className="text-xs text-muted-foreground font-mono">
                                                {dx?.patient?.user?.regID || 'N/A'}
                                            </span>
                                                </div>

                                                <p className="text-xs text-muted-foreground">
                                                    <span className="font-mono">#{dx.id}</span>
                                                    {' • '}
                                                    {formatDate(dx.created_at)}
                                                    {dx?.doctor?.user?.name && (
                                                        <> {' • '} Dr. {dx.doctor.user.name}</>
                                                    )}
                                                </p>



                                                {/* Badges */}
                                                <div className="flex flex-wrap gap-2 mt-2">

                                                    <Badge variant={'default'} className={`text-xs ${dx.attendance_status == 'cancelled' ? 'bg-red-500' : dx.attendance_status == 'seen' ? 'bg-green-400' : 'bg-blue-500'}`}>
                                                        {dx.attendance_status}
                                                    </Badge>
                                                    <Badge variant={isOwnConsultation ? 'default' : 'outline'} className="text-xs">
                                                        {dx.payment_status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-xs whitespace-nowrap"
                                                onClick={() => navigate(`/clerk/patientDetail/${dx?.patient?.user?.regID}`)}
                                            >
                                                View Patient
                                            </Button>

                                        </div>
                                    </div>
                                </Card>
                            );
                        })
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <p className="text-sm font-medium text-muted-foreground">No diagnoses found</p>
                            <p className="text-xs text-muted-foreground mt-1">No pending consultations to display</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );

    const PendingConsultation = ({
                                     items = [],
                                     isLoading = false,
                                     onAcceptConsultation,
                                     onViewPatient
                                 }) => {
        const navigate = useNavigate();
        const [selectedDiagnosis, setSelectedDiagnosis] = React.useState(null);


        const formatDate = (date) => {
            if (!date) return 'N/A';
            return format(new Date(date), 'MMM dd, yyyy • h:mm a');
        };

        const handleStatusUpdate = (doctorId, consultation_id, consultation, regID) => {


            const payload = {
                consultation_id : consultation_id,
            }
            axiosClient.post('/cancelConsultation',payload)
                .then(({data})=>{
                    showToast('Consultation Update',data.message)
                    alert(data.message)
                   /* removeAwaitingConsultation(consultation)
                    addConsultation(consultation)*/

                    navigate(`/clerk/Consultation`);

                })
                .catch(e=>showToast('error',e))

        };

        const handleViewPatient = (regID) => {
            if (onViewPatient) {
                onViewPatient(regID);
            } else {
                navigate(`/clerk/patientDetail/${regID}`);
            }
        };

        // If items is an object with numeric keys, convert to array
        const itemsArray = Array.isArray(items) ? items : Object.values(items || {});

        return (
            <div className="space-y-3">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                            <p className="text-sm text-muted-foreground">Searching for Consultation. Please wait...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {itemsArray?.length > 0 ? (
                            itemsArray.map((dx, index) => {
                                // Ensure we have a valid object
                                if (!dx || typeof dx !== 'object') return null;

                                const isOwnConsultation = dx.doctor_id === doctor?.id;

                                return (
                                    <Card
                                        key={dx.id || index}
                                        className={`p-4 hover:shadow-md transition-all cursor-pointer ${
                                            isOwnConsultation ? 'bg-primary/5 border-primary/20' : 'bg-white hover:bg-muted/50'
                                        }`}
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                            <div className="flex items-start gap-3 flex-1 min-w-0">
                                                {/* Avatar */}
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                                                    {dx?.patient?.user?.name?.[0] || '?'}
                                                    {dx?.patient?.user?.name?.[1] || ''}
                                                </div>

                                                {/* Patient Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <p className="font-semibold truncate">
                                                            {dx?.patient?.user?.name || 'Unknown Patient'}
                                                        </p>
                                                        <Badge variant="outline" className="text-xs font-mono">
                                                            {dx?.patient?.user?.regID || 'N/A'}
                                                        </Badge>
                                                    </div>

                                                    <p className="text-xs text-muted-foreground">
                                                       {formatDate(dx.created_at)}
                                                        {dx?.doctor?.user?.name && ` • Dr. ${dx.doctor.user.name}`}
                                                    </p>



                                                    {/* Badges */}
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {dx.sales?.length > 0 && (
                                                            <Badge variant="secondary" className="text-xs">
                                                                💊 {dx.sales.length} prescription{dx.sales.length > 1 ? 's' : ''}
                                                            </Badge>
                                                        )}
                                                        {dx.lab_test?.length > 0 && (
                                                            <Badge variant="secondary" className="text-xs">
                                                                🔬 {dx.lab_test.length} lab test{dx.lab_test.length > 1 ? 's' : ''}
                                                            </Badge>
                                                        )}
                                                        {dx.labtest?.length > 0 && (
                                                            <Badge variant="secondary" className="text-xs">
                                                                🔬 {dx.labtest.length} lab test{dx.labtest.length > 1 ? 's' : ''}
                                                            </Badge>
                                                        )}
                                                        <Badge variant={isOwnConsultation ? 'default' : 'outline'} className="text-xs">
                                                            {dx.attendance_status}
                                                        </Badge>
                                                        <Badge variant={isOwnConsultation ? 'default' : 'outline'} className="text-xs">
                                                            {dx.payment_status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            {dx.attendance_status === 'unseen' && (
                                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-shrink-0">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-xs whitespace-nowrap"
                                                        onClick={() => handleViewPatient(dx?.patient?.user?.regID)}
                                                    >
                                                        View Patient
                                                    </Button>

                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button
                                                                size="sm"
                                                                className="text-xs whitespace-nowrap bg-red-600 hover:bg-red-700"
                                                                onClick={() => setSelectedDiagnosis(dx.id)}
                                                            >
                                                                <Trash className="h-3.5 w-3.5 mr-1" />
                                                                Cancel Consultation
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent className="p-2 bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Confirm Consultation</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Cancel Consultation for
                                                                    <span className="font-semibold"> {dx?.patient?.user?.name}</span>?
                                                                    <br />
                                                                    <span className="text-xs text-muted-foreground mt-1 block">
                                                                    This Consultation would be cancelled?
                                                                </span>
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleStatusUpdate(doctor?.id, dx.id, dx, dx?.patient?.user?.regID)}
                                                                    className="bg-red-600 p-2 rounded rounded-lg text-white hover:bg-red-700"
                                                                >
                                                                    Confirm
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                );
                            })
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <p className="text-sm font-medium text-muted-foreground">No diagnoses found</p>
                                <p className="text-xs text-muted-foreground mt-1">There are no pending consultations to display</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    };



    return (
        <div className="space-y-6">
            <PageHeader
                title="Patient Consultation"
                subtitle="View and manage patient diagnoses"
                breadcrumb={[{ label: 'Dashboard', path: '/doctor' }, { label: 'Patient consultation' }]}
                actions={<Button onClick={() => navigate('/doctor/diagnosis/new')}><Stethoscope className="w-4 h-4 mr-2" />New Diagnosis</Button>}
            />

            {/*  <Card className="p-4">
                <div className="relative">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <div className='flex gap-x-2' >
                        <Input placeholder="Search by patient ID, diagnosis ID, or patient name..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
                        <Button variant={'ghost'} > <Search className=" w-4 h-4 text-muted-foreground" /></Button>
                    </div>

                </div>
            </Card>*/}

            <Tabs defaultValue="pending consultation">
                <TabsList>
                    <TabsTrigger value="pending consultation">pending consultation ({pendingConsultation?.length})</TabsTrigger>
                    <TabsTrigger value="daily consultation">daily consultation ({dailyConsultation?.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="pending consultation"><PendingConsultation items={pendingConsultation|| []} /></TabsContent>
                <TabsContent value="daily consultation"><DiagnosisList items={dailyConsultation || []} /></TabsContent>
            </Tabs>

            {/* Diagnosis Detail Dialog */}
            {/*      <Dialog open={!!selectedDiagnosis} onOpenChange={() => setSelectedDiagnosis(null)}>
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

*/}





        </div>
    );
};

export default ClerkConsultation;
