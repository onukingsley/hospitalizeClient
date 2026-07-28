import React, {useState, useMemo, useEffect} from 'react';
import { useNavigate,useSearchParams } from 'react-router-dom';
import { useDiagnoses, usePatients, useDrugs } from '@/hooks/useData';
import { generateDiagnosisId } from '@/lib/mockData';
import { ROUTES, TEST_CATALOG } from '@/lib/constants';
import PageHeader from '@/components/common/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
    Search,
    Plus,
    Trash2,
    Save,
    Stethoscope,
    FilePlus,
    User,
    Activity,
    Heart,
    Thermometer,
    Weight,
    Ruler,
    Droplet,
    Clock,
    Pill,
    FlaskConical,
    FileText,
    X,
    ChevronDown,
    CheckCircle,
    AlertCircle,
} from 'lucide-react';
import {drugStore, paymentStore, userStore} from "../../store/store.jsx";
import axiosClient from "../../service/axiosClient.js";
import {Dialog, DialogContent, DialogTitle} from "@radix-ui/react-dialog";
import {DialogHeader} from "../../components/ui/dialog.js";
import DiagnosisModal from "../../components/modals/DiagnosisModal.jsx";

const AddDiagnosisReport = () => {
    const navigate = useNavigate();
    const { addDiagnosis } = useDiagnoses();
    const { patients, searchPatients } = usePatients();

    const [searchParams] = useSearchParams();


    // State
    const [openDialog, setopenDialog] = useState(false);
    const [patientSearch, setPatientSearch] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [activeTab, setActiveTab] = useState('clinical');

    const [vitals, setVitals] = useState({
        temperature: '',
        bloodPressure: '',
        pulse: '',
        respiration: '',
        weight: '',
        height: '',
        bmi: '',
        spO2: ''
    });
    const [chiefComplaints, setChiefComplaints] = useState('');
    const [examinationFindings, setExaminationFindings] = useState('');
    const [provisionalDiagnosis, setProvisionalDiagnosis] = useState('');
    const [finalDiagnosis, setFinalDiagnosis] = useState('');
    const [notes, setNotes] = useState('');

    const [prescriptions, setPrescriptions] = useState([]);
    const [labOrders, setLabOrders] = useState([]);
    const [labOrdersView, setLabOrdersView] = useState([]);
    const [newPrescription, setNewPrescription] = useState({ route: 'oral', frequency: 'TDS' });
    const [drugSearch, setDrugSearch] = useState('');
    const [drugSearchOpen, setDrugSearchOpen] = useState(false);


    const [password, setPassword] = useState('');
    const [description , setDescription] = useState('');
    const [wardStatus , setWardStatus] = useState('outPatient');
    const [openDiagnosis , setOpenDiagnosis] = useState(false); //changes to true
    const [labTestDetails , setLabTestDetails] = useState({}); //changes to true


    const [drugStock , setDrugStock] = useState({});
    const [isPrescription , setIsPrescription] = useState(false);
    const [prescriptionsView , setPrescriptionsView] = useState([]);
    const {drugs} = drugStore()
    const {rates} = paymentStore()
    const {nurse} = userStore()



    const [searchPatient, setSearchedPatient] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);







    useEffect(()=>{
        if (searchQuery === ''){
            setSearchedPatient([])
        }
        if (searchParams.get('regID')){
            setIsLoading(true)
            axiosClient.get(`/getDoctorPatientByRegNo?regID=${searchParams.get('regID')}`)
                .then(({data})=>{
                    setIsLoading(false)
                    const res = data.data
                    console.log(res)
                    if (!res){
                        alert('No Patient Diagnosis Found. Confirm the Data Input')
                        setSearchedPatient([])
                        setSearchQuery('')

                    }else {
                        console.log([data.data])
                        setSearchedPatient([data.data])
                        setSelectedPatient(data.data)
                    }

                }).catch(e=> {
                console.log(e)
                setIsLoading(false)
            })

        }

    },[searchQuery])
    const handleGetDiagnosis = ()=>{
        setIsLoading(true)
        axiosClient.get(`/getDoctorPatientByRegNo?regID=${searchQuery}`)
            .then(({data})=>{
                setIsLoading(false)
                const res = data.data
                console.log(res)
                if (!res){

                    alert('No Patient Diagnosis Found. Confirm the Data Input')
                    setSearchedPatient([])
                    //setSearchQuery('')
                    return;
                }else {
                    console.log([data.data])
                    setSearchedPatient([data.data])
                }

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

    // Computed
    const filteredPatients = useMemo(() => {
        if (!patientSearch) return [];
        return searchPatients(patientSearch) || [];
    }, [patientSearch, searchPatients]);


    const handleSubmit = (e) => {
        e.preventDefault();
        /*  if (!selectedPatient) {
            toast.error('Please select a patient');
            return;
          }*/


        const diagnosisData = {
            password  : password,
            patient_id: selectedPatient.patient.id,
            user_id: nurse.id,
            consultation_id : searchParams.get('consultation_id') || null,
            diagnosis_report: description,

            diagnosis_id: searchParams.get('diagnosis_id')


        }

        console.log(diagnosisData.diagnosis_id, 'this is diagnosis data')

        axiosClient.post('/addNurseDiagnosisReport', diagnosisData)
            .then(({data})=>{
                console.log(data)
                alert(data.message)
                navigate(`/nurse/patientDetail/${selectedPatient.regID}`)
                navigate(`/nurse/AlldiagnosisReport?diagnosis_id=${searchParams.get('diagnosis_id')}`)
            }).catch(e=>console.log(e))


        /*  const diagnosis = {
            diagnosisId: generateDiagnosisId(),
            patientId: selectedPatient.patientId,
            doctorId: 'DOC001',
            doctorName: 'Dr. James Osei',
            date: new Date().toISOString().split('T')[0],
            vitals: {
              temperature: parseFloat(vitals.temperature) || 0,
              bloodPressure: vitals.bloodPressure || '',
              pulse: parseInt(vitals.pulse) || 0,
              respiration: parseInt(vitals.respiration) || 0,
              weight: parseFloat(vitals.weight) || 0,
              height: parseFloat(vitals.height) || 0,
              bmi: parseFloat(vitals.bmi) || 0,
              spO2: parseInt(vitals.spO2) || 0,
            },
            chiefComplaints,
            historyOfPresentIllness: '',
            examinationFindings,
            provisionalDiagnosis,
            finalDiagnosis,
            prescriptions,
            labOrders,
            notes,
            status: 'active',
          };

          addDiagnosis(diagnosis);*/
        /*    toast.success('Diagnosis created successfully');
            navigate('/doctor/diagnosis');*/
    };

    const showDialogBox = ()=>{
        setopenDialog(true)
    }

    return (
        <div className="space-y-6">

            <DiagnosisModal
                open={openDiagnosis}
                onOpenChange={setOpenDiagnosis}
                diagnosisId={searchParams.get('diagnosis_id')}
            />


            <Dialog open={openDialog} onOpenChange={(open) => {
                setopenDialog(open)
            }}>
                <DialogContent className=" p-6 bg-gray-100 w-[95vw] max-w-lg sm:max-w-xl mx-auto max-h-[92vh] overflow-hidden  flex flex-col rounded-2xl fixed top-[20%] left-1/2 -translate-x-1/2 -translate-y-1/2">
                    {/* Header */}
                    <DialogHeader className="px-6 py-4 border-b border-nude-100 flex-shrink-0">
                        <DialogTitle className="text-lg font-semibold">Doctor Authentication</DialogTitle>
                    </DialogHeader>

                    {/* Scrollable Content */}
                    <div className="px-6 py-4">
                        <Label className="text-sm font-medium"> Password</Label>
                        <Textarea
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Enter you password for authentication"
                            className="mt-1.5 min-h-[80px]"
                        />
                    </div>

                    <div className="px-6 py-4 border-t border-gray-100">
                        <Button
                            onClick={handleSubmit}
                            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Save Report
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>







            <PageHeader
                title="New Diagnosis Report"
                subtitle="Create a comprehensive patient diagnosis Report"
                breadcrumb={[
                    { label: 'Dashboard', path: '/doctor' },
                    { label: 'Patient Diagnosis', path: '/doctor/diagnosis' },
                    { label: 'New Diagnosis report' }
                ]}
                onBack={() => navigate('/doctor/diagnosis')}
                actions={
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate('/doctor/diagnosis')}
                        >
                            Cancel
                        </Button>
                        <Button
                            size="sm"
                            onClick={showDialogBox}
                            className="bg-primary hover:bg-primary/90"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Save Report
                        </Button>
                    </div>
                }
            />

            <div >
                {/* Patient Selection */}
                {!selectedPatient ? (
                    <Card className="p-6 mb-6 border-dashed border-2 hover:border-primary/50 transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <User className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Select Patient</h3>
                                <p className="text-sm text-muted-foreground">Search for a patient by name or ID</p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className='flex'>
                                <Input
                                    placeholder="Search patient by name, ID, or phone..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="pl-10 h-12 text-base"
                                />
                                <Button variant={'ghost'} onClick={handleGetDiagnosis}> <Search className=" w-4 h-4 text-muted-foreground" /></Button>

                            </div>
                            {isLoading && <p className="text-center text-muted-foreground py-8">Searching for Patient. please wait</p>}


                            {/*{searchPatient && (
                      <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                          onClick={() => setSearchedPatient('')}
                      >
                        <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                      </button>
                  )}*/}
                        </div>
                        {searchPatient && searchPatient.length > 0 && (
                            <div className="mt-3 max-h-64 overflow-y-auto space-y-2">
                                {searchPatient?.map(p => (
                                    <div
                                        key={p?.patient.id}
                                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer group"
                                        onClick={() => {
                                            setSelectedPatient(p);
                                            setSearchQuery('');
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                                {p?.name?.[0]}{p?.name?.[1]}
                                            </div>
                                            <div>
                                                <p className="font-medium">{p?.name} </p>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <span>{p?.regID}</span>
                                                    <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />

                                                    <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                                    <span>{p?.patient?.diagnosis?.length || 'N/A'} Diagnosis</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            Select
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                        {patientSearch && filteredPatients.length === 0 && (
                            <p className="text-sm text-muted-foreground mt-3 text-center py-4">
                                No patients found. Try a different search term.
                            </p>
                        )}
                    </Card>
                ) : (
                    <Card className="p-4 mb-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                                    {selectedPatient.name?.[0]}{selectedPatient.name?.[0]}
                                </div>
                                <div>
                                    <p className="font-semibold text-lg">{selectedPatient.name} </p>
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <span className="font-mono">{selectedPatient.regID}</span>
                                        <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                        <span>{selectedPatient.gender}</span>
                                        <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                        <span>{selectedPatient.patient?.diagnosis?.length || 'N/A'} Diagnosis</span>
                                        {selectedPatient.patient?.blood_group && (
                                            <>
                                                <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                                <span className="font-semibold text-primary">Blood: {selectedPatient.patient?.blood_group}</span>
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
                                    onClick={() => navigate(`/doctor/patientDetail/${selectedPatient.regID}`)}
                                >
                                    View Profile
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setSelectedPatient(null);
                                        setPatientSearch('');
                                    }}
                                >
                                    Change
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setOpenDiagnosis(true)
                                    }}
                                >
                                    view Diagnosis
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Main Content with Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3 lg:grid-cols-3">
                        <TabsTrigger value="clinical" className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Clinical
                        </TabsTrigger>
                        {/*  <TabsTrigger value="vitals" className="flex items-center gap-2">
                            <Heart className="w-4 h-4" />
                            Vitals
                        </TabsTrigger>*/}

                    </TabsList>

                    {/* Clinical Tab */}
                    <TabsContent value="clinical" className="space-y-4">
                        <Card className="p-6">
                            <div className="space-y-4">
                                {/*  <div>
                                    <Label className="text-sm font-medium flex items-center gap-2">
                                        Chief Complaints <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        value={chiefComplaints}
                                        onChange={e => setChiefComplaints(e.target.value)}
                                        placeholder="Patient's presenting complaints in their own words..."
                                        className="mt-1.5 min-h-[120px]"
                                        required
                                    />
                                </div>*/}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/*<div>
                                        <Label className="text-sm font-medium flex items-center gap-2">
                                            Provisional Diagnosis <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            value={provisionalDiagnosis}
                                            onChange={e => setProvisionalDiagnosis(e.target.value)}
                                            placeholder="e.g., Malaria, Hypertension..."
                                            className="mt-1.5"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium">Final Diagnosis</Label>
                                        <Input
                                            value={finalDiagnosis}
                                            onChange={e => setFinalDiagnosis(e.target.value)}
                                            placeholder="Confirmed diagnosis (if available)"
                                            className="mt-1.5"
                                        />
                                    </div>*/}
                                   {/* <div>
                                        <Label className="text-xs">Ward Status</Label>
                                        <Select
                                            value={wardStatus}
                                            onValueChange={v => setWardStatus(v)}
                                        >
                                            <SelectTrigger className="h-9">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {['inPatient', 'outPatient'].map(f => (
                                                    <SelectItem key={f} value={f}>{f}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>*/}
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Nurse's Notes</Label>
                                    <Textarea
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        placeholder="Additional notes, recommendations, treatment plan..."
                                        className="mt-1.5 min-h-[200px]"
                                    />
                                </div>
                            </div>
                        </Card>
                    </TabsContent>


                </Tabs>

                {/* Fixed Action Bar */}
                <div className="sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border/50 p-4 mt-6 -mx-4 px-4">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <AlertCircle className="w-4 h-4" />
                            <span>Fields with <span className="text-red-500">*</span> are required</span>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('/doctor/diagnosis')}
                                className="flex-1 sm:flex-none"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={showDialogBox}
                                className="flex-1 sm:flex-none bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Save Report
                            </Button>
                        </div>
                    </div>
                </div>
            </div>






        </div>
    );
};

export default AddDiagnosisReport;