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
    const [labTest , setLabTest] = useState(false); //changes to true
    const [labTestDetails , setLabTestDetails] = useState({}); //changes to true


    const [drugStock , setDrugStock] = useState({});
    const [isPrescription , setIsPrescription] = useState(false);
    const [prescriptionsView , setPrescriptionsView] = useState([]);
    const {drugs} = drugStore()
    const {rates} = paymentStore()
    const {doctor} = userStore()



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

    const filteredDrugs = useMemo(() => {
        console.log(drugs)
        if (!drugSearch) return [];
        return drugs.filter(d =>
            d.name.toLowerCase().includes(drugSearch.toLowerCase()) ||
            d.genericName?.toLowerCase().includes(drugSearch.toLowerCase())
        );
    }, [drugSearch, drugs]);

    // Handlers
    const addPrescription = () => {
        if (!newPrescription.drugName || !newPrescription.dosage) {
            toast.error('Please fill in drug name and dosage');
            return;
        }
        /*const prescription = {
          drugId: newPrescription.drugId || `DRUG_${Date.now()}`,
          drugName: newPrescription.drugName || '',
          dosage: newPrescription.dosage || '',
          frequency: newPrescription.frequency || 'TDS',
          duration: newPrescription.duration || '',
          route: newPrescription.route || 'oral',
          instructions: newPrescription.instructions || '',
          quantity: newPrescription.quantity || 0,
        };*/
        const prescription = {
            drug_stock_id: newPrescription.drug_stock_id,
            drugName: newPrescription.drugName || '',
            dosage: newPrescription.dosage || '',
            unit_price: newPrescription.amount,
            duration: newPrescription.duration || '',
            route: newPrescription.route || 'oral',
            quantity: newPrescription.quantity || 0,
            instructions: newPrescription.instructions || 0,
        };
        const prescriptionPayload = {
            drug_stock_id: newPrescription.drug_stock_id,
            dosage: newPrescription.dosage || '',
            unit_price: newPrescription.amount,
            duration: newPrescription.duration || '',
            route: newPrescription.route || 'oral',
            quantity: newPrescription.quantity || 0,
            instruction: newPrescription.instructions || 0,

        };
        setPrescriptionsView([...prescriptionsView, prescription]);
        setPrescriptions([...prescriptions, prescriptionPayload]);
        setNewPrescription({ route: 'oral', frequency: 'TDS' });
        setDrugSearch('');
        if(prescriptions.length > 0){
            setIsPrescription(true)
        }
        toast.success('Prescription added');
        console.log(prescription, 'this is the prescription.......')

    };



    const addLabOrder = (testId, testName,rates) => {
        if (labOrdersView.some(l => l.testId === testId)) {
            toast.info('Test already added');
            return;
        }

        setLabOrdersView([...labOrdersView, { testId:rates.id, testName:rates.title, priority: 'routine', notes: '', status: 'ordered' }]);
        setLabOrders([...labOrders, { rates_id: rates.id , amount : rates.amount, remark: ''}]);
        if (labOrders.length > 0){
            setLabTest(true)
        }
        toast.success('Lab test added');
    };

    const removePrescription = (index) => {
        setPrescriptions(prescriptions.filter((_, i) => i !== index));
        setPrescriptionsView(prescriptionsView.filter((_, i) => i !== index));
    };

    const removeLabOrder = (testId) => {
        setLabOrders(labOrders.filter(l => l.rates_id !== testId));
        setLabOrdersView(labOrdersView.filter(l => l.testId !== testId));
    };

    const calculateBMI = () => {
        const w = parseFloat(vitals.weight);
        const h = parseFloat(vitals.height) / 100;
        if (w && h) {
            setVitals(prev => ({ ...prev, bmi: (w / (h * h)).toFixed(1) }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        /*  if (!selectedPatient) {
            toast.error('Please select a patient');
            return;
          }*/


        const diagnosisData = {
            password  : password,
            patient_id: selectedPatient.patient.id,
            doctor_id: doctor.id,
            consultation_id : searchParams.get('consultation_id') || null,
            diagnosis_report: description,
            /*body_vitals: JSON.stringify( {
                temperature: parseFloat(vitals.temperature) || 0,
                bloodPressure: vitals.bloodPressure || '',
                pulse: parseInt(vitals.pulse) || 0,
                respiration: parseInt(vitals.respiration) || 0,
                weight: parseFloat(vitals.weight) || 0,
                height: parseFloat(vitals.height) || 0,
                bmi: parseFloat(vitals.bmi) || 0,
                spO2: parseInt(vitals.spO2) || 0,
            }),*/
            ward_status : wardStatus,
            lab_test : labTest,
            lab_test_name :  labTestDetails.lab_test_name,
            lab_test_description : labTestDetails.lab_test_description,
            lab_test_amount : labOrders.reduce((total,labtest)=>{
                return total + parseInt(labtest.amount)
            },0) || 0,
            test_list : labOrders,
            prescription : isPrescription,
            drug_amount : prescriptions.reduce((total,prescription)=>{
                return total + parseInt(prescription.unit_price)
            },0) || 0,
            drug_items : prescriptions,
            diagnosis_id: searchParams.get('diagnosis_id')


        }

        console.log(diagnosisData, 'this is diagnosis data')

        axiosClient.post('/addDiagnosisReport', diagnosisData)
            .then(({data})=>{
                console.log(data)
                alert(data.message)
                navigate(`/doctor/patientDetail/${selectedPatient.regID}`)
                navigate(`/doctor/AlldiagnosisReport?diagnosis_id=${searchParams.get('diagnosis_id')}`)
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
                        <TabsTrigger value="prescriptions" className="flex items-center gap-2">
                            <Pill className="w-4 h-4" />
                            Prescriptions
                            {prescriptions.length > 0 && (
                                <Badge variant="secondary" className="ml-1">{prescriptions.length}</Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="lab" className="flex items-center gap-2">
                            <FlaskConical className="w-4 h-4" />
                            Lab Tests
                            {labOrders.length > 0 && (
                                <Badge variant="secondary" className="ml-1">{labOrders.length}</Badge>
                            )}
                        </TabsTrigger>
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
                                    <div>
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
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Doctor's Notes</Label>
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

                    {/* Vitals Tab */}
                   {/* <TabsContent value="vitals">
                        <Card className="p-6">
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                {[
                                    { label: 'Temperature (°C)', key: 'temperature', icon: Thermometer, placeholder: '36.5' },
                                    { label: 'Blood Pressure', key: 'bloodPressure', icon: Activity, placeholder: '120/80' },
                                    { label: 'Pulse (bpm)', key: 'pulse', icon: Heart, placeholder: '72' },
                                    { label: 'Respiration', key: 'respiration', icon: Droplet, placeholder: '16' },
                                    { label: 'Weight (kg)', key: 'weight', icon: Weight, placeholder: '70' },
                                    { label: 'Height (cm)', key: 'height', icon: Ruler, placeholder: '170' },
                                    { label: 'BMI', key: 'bmi', icon: Activity, placeholder: 'Auto' },
                                    { label: 'SpO2 (%)', key: 'spO2', icon: Droplet, placeholder: '98' },
                                ].map(vital => {
                                    const Icon = vital.icon;
                                    return (
                                        <div key={vital.key} className="space-y-1.5">
                                            <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                                                <Icon className="w-3 h-3" />
                                                {vital.label}
                                            </Label>
                                            <Input
                                                value={vitals[vital.key]}
                                                onChange={e => {
                                                    setVitals(prev => ({ ...prev, [vital.key]: e.target.value }));
                                                    if (vital.key === 'weight' || vital.key === 'height') {
                                                        setTimeout(calculateBMI, 100);
                                                    }
                                                }}
                                                placeholder={vital.placeholder}
                                                className="h-9"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                            {vitals.bmi && (
                                <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
                                    <p className="text-sm">
                                        <span className="font-medium">BMI:</span> {vitals.bmi}
                                        <span className="text-muted-foreground ml-2">
                                            ({parseFloat(vitals.bmi) < 18.5 ? 'Underweight' :
                                            parseFloat(vitals.bmi) < 25 ? 'Normal' :
                                                parseFloat(vitals.bmi) < 30 ? 'Overweight' : 'Obese'})
                                        </span>
                                    </p>
                                </div>
                            )}
                        </Card>
                    </TabsContent>
*/}
                    {/* Prescriptions Tab */}
                    <TabsContent value="prescriptions">
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h4 className="font-semibold">Prescriptions</h4>
                                    <p className="text-sm text-muted-foreground">Add medications to prescribe</p>
                                </div>
                                <Badge variant="secondary" className="text-sm">
                                    {prescriptions.length} prescribed
                                </Badge>
                            </div>

                            {prescriptionsView.length > 0 && (
                                <div className="space-y-2 mb-4 max-h-[300px] overflow-y-auto">
                                    {prescriptionsView.map((pres, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors group">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium text-sm">{pres.drugName}</p>
                                                    <Badge variant="outline" className="text-[10px]">{pres.dosage}</Badge>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1">
                                                    <span>{pres.frequency}</span>
                                                    {pres.duration && <span>× {pres.duration}</span>}
                                                    <span>• {pres.route}</span>
                                                    {pres.quantity > 0 && <span>• Qty: {pres.quantity}</span>}
                                                </div>
                                                {pres.instructions && (
                                                    <p className="text-xs text-muted-foreground mt-1">{pres.instructions}</p>
                                                )}
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removePrescription(i)}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <Separator className="my-4" />

                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                <div className="col-span-2">
                                    <Label className="text-xs">Drug Name</Label>
                                    <div className="relative">
                                        <Input
                                            value={drugSearch}
                                            onChange={e => {
                                                setDrugSearch(e.target.value)
                                                setDrugSearchOpen(true)
                                            }}
                                            placeholder="Search for drug..."
                                            className="h-9"
                                        />
                                        {filteredDrugs.length > 0 && drugSearchOpen && drugSearch && (
                                            <div className="absolute z-10 w-full bg-popover border rounded-md shadow-lg mt-1 max-h-40 overflow-y-auto">
                                                {filteredDrugs.slice(0, 6).map(drug => (
                                                    <button
                                                        key={drug.id}
                                                        type="button"
                                                        className="w-full text-left px-3 py-2 hover:bg-muted text-sm transition-colors"
                                                        onClick={() => {
                                                            console.log(drug)
                                                            setNewPrescription(prev => ({
                                                                ...prev,
                                                                drug_stock_id: drug.id,
                                                                drugName: drug.name,
                                                                amount: drug.amount
                                                            }));
                                                            setDrugSearch(drug.name);
                                                            setDrugSearchOpen(false);
                                                        }}
                                                    >
                                                        <p className="font-medium">{drug.name}</p>
                                                        {drug.genericName && (
                                                            <p className="text-xs text-muted-foreground">{drug.genericName}</p>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-xs">Dosage</Label>
                                    <Input
                                        value={newPrescription.dosage || ''}
                                        onChange={e => setNewPrescription(prev => ({ ...prev, dosage: e.target.value }))}
                                        placeholder="500mg"
                                        className="h-9"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs">Frequency</Label>
                                    <Select
                                        value={newPrescription.frequency}
                                        onValueChange={v => setNewPrescription(prev => ({ ...prev, frequency: v }))}
                                    >
                                        <SelectTrigger className="h-9">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {['OD', 'BD', 'TDS', 'QDS', 'PRN', 'STAT'].map(f => (
                                                <SelectItem key={f} value={f}>{f}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="text-xs">Duration</Label>
                                    <Input
                                        value={newPrescription.duration || ''}
                                        onChange={e => setNewPrescription(prev => ({ ...prev, duration: e.target.value }))}
                                        placeholder="5 days"
                                        className="h-9"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs">Route</Label>
                                    <Select
                                        value={newPrescription.route}
                                        onValueChange={v => setNewPrescription(prev => ({ ...prev, route: v }))}
                                    >
                                        <SelectTrigger className="h-9">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {['oral', 'intravenous', 'intramuscular', 'subcutaneous', 'topical', 'inhalation'].map(r => (
                                                <SelectItem key={r} value={r}>{r}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="text-xs">Quantity</Label>
                                    <Input
                                        type="number"
                                        value={newPrescription.quantity || ''}
                                        onChange={e => setNewPrescription(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                                        placeholder="10"
                                        className="h-9"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Label className="text-xs">Instructions</Label>
                                    <Input
                                        value={newPrescription.instructions || ''}
                                        onChange={e => setNewPrescription(prev => ({ ...prev, instructions: e.target.value }))}
                                        placeholder="Take after meals"
                                        className="h-9"
                                    />
                                </div>
                                <div className="col-span-4 flex justify-end">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addPrescription}
                                    >
                                        <Plus className="w-4 h-4 mr-1" />
                                        Add Prescription
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </TabsContent>

                    {/* Lab Tab */}
                    <TabsContent value="lab">
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h4 className="font-semibold">Lab Orders</h4>
                                    <p className="text-sm text-muted-foreground">Select tests to Recommend</p>
                                </div>
                                <Badge variant="secondary" className="text-sm">
                                    {labOrdersView.length} tests
                                </Badge>
                            </div>

                            {labOrdersView.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {labOrdersView.map(order => (
                                        <Badge
                                            key={order.testId}
                                            variant="secondary"
                                            className="px-3 py-1.5 text-sm gap-1.5"
                                        >
                                            {order.testName}
                                            <button
                                                type="button"
                                                onClick={() => removeLabOrder(order.testId)}
                                                className="ml-1 hover:text-red-500"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                            <div className='flex w-full space-x-10'>
                                <div className='w-[40%]'>
                                    <Label className="text-sm font-medium">lab Title</Label>
                                    <Input
                                        value={labTestDetails.lab_test_name}
                                        onChange={e => setLabTestDetails({...labTestDetails, lab_test_name: e.target.value})}
                                        placeholder="e.g., Malaria, Hypertension..."
                                        className="mt-1.5"
                                        required
                                    />
                                </div>
                                <div className='w-[60%]'>
                                    <Label className="text-sm font-medium">Lab Test Remark</Label>
                                    <Textarea
                                        value={labTestDetails.lab_test_description}
                                        onChange={e => setLabTestDetails({...labTestDetails, lab_test_description: e.target.value})}
                                        placeholder="Physical examination findings, observations..."
                                        className="mt-1.5 min-h-[80px]"
                                    />
                                </div>
                            </div>

                            <Separator className="my-4" />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
                                {rates.map(test => {
                                    const isAdded = labOrdersView.some(l => l.id === test.id);
                                    return (
                                        <button
                                            key={test.id}
                                            type="button"
                                            onClick={() => addLabOrder(test.id, test.title,test)}
                                            className={`flex items-center justify-between p-3 rounded-lg text-sm transition-all ${
                                                isAdded
                                                    ? 'bg-primary/10 text-primary border border-primary/20 cursor-default'
                                                    : 'hover:bg-muted border border-transparent hover:border-border'
                                            }`}
                                            disabled={isAdded}
                                        >
                                            <span>{test.title}</span>
                                            {isAdded ? (
                                                <CheckCircle className="w-4 h-4 text-primary" />
                                            ) : (
                                                <Plus className="w-4 h-4 text-muted-foreground" />
                                            )}
                                        </button>
                                    );
                                })}
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