import React, {useState, useMemo, useEffect} from 'react';
import { useNavigate,useSearchParams } from 'react-router-dom';
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

const NurseDiagnosisReportEdit = () => {
    const navigate = useNavigate();
    const {nurse} = userStore()


    const [searchParams] = useSearchParams();

    let totalprescribedlenght = 0;



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

    const [selectedDiagnosis, setSelectedDiagnosis] = useState()
    const [selectedVitals, setSelectedVitals] = useState()
    const [selectedSales, setSelectedSales] = useState([])







    useEffect(()=>{
        if (searchQuery === ''){
            setSearchedPatient([])
        }
        if (searchParams.get('patient_regID')){
            setIsLoading(true)
            axiosClient.get(`/getDoctorPatientByRegNo?regID=${searchParams.get('patient_regID')}`)
                .then(({data})=>{
                    setIsLoading(false)
                    const res = data.data
                    //console.log(res)
                    if (!res){
                        alert('No Patient Diagnosis Found. Confirm the Data Input')
                        setSearchedPatient([])
                        setSearchQuery('')

                    }else {
                        // console.log([data.data])
                        setSearchedPatient([data.data])
                        setSelectedPatient(data.data)

                    }

                }).catch(e=> {
                console.log(e)
                setIsLoading(false)
            })
        }
        axiosClient.get(`/getDoctorsPatientDiagnosisReport?diagnosisReport_id=${searchParams.get('diagnosisReport_id')}`)
            .then(({data})=>{
                setSelectedDiagnosis(data.data)






                console.log(data.data,'this is the selected diagnosis')
                setIsLoading(false)
            }).catch((e)=>{
            setIsLoading(false)
        })

    },[searchQuery])
    const handleGetDiagnosis = ()=>{
        setIsLoading(true)

        axiosClient.get(`/getDoctorPatientByRegNo?regID=${searchQuery}`)
            .then(({data})=>{
                setIsLoading(false)
                const res = data.data
                //console.log(res)
                if (!res){

                    alert('No Patient Diagnosis Found. Confirm the Data Input')
                    setSearchedPatient([])
                    //setSearchQuery('')
                    return;
                }else {
                    // console.log([data.data])
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

    // Computed filteredPatients is not needed

    const filteredDrugs = useMemo(() => {
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
            sales_id: newPrescription.sales_id || 0,

        };
        const prescriptionPayload = {
            drug_stock_id: newPrescription.drug_stock_id,
            dosage: newPrescription.dosage || '',
            unit_price: newPrescription.amount,
            duration: newPrescription.duration || '',
            route: newPrescription.route || 'oral',
            quantity: newPrescription.quantity || 0,
            sales_id: newPrescription.sales_id || 0,
        };
        const newPayload = {
            drug_item:prescriptionPayload,
            sales_id: newPrescription.sales_id
        }

        axiosClient.post('/addPrescription', newPayload)
            .then(({data})=>{
                setSelectedDiagnosis((prev)=>{
                    const newArray = prev.sales.map((item)=>{
                        if (item.id == newPrescription?.sales_id){
                            return{...item, drug_stock: [...item.drug_stock, {name:prescription.drugName,pivot:{duration:prescription.duration,route:prescription.route,quantity:prescription.quantity,instruction:prescription.instructions}}] }
                        }
                        return item
                    })
                    return {...prev, sales:newArray}
                })


                alert(data.message)
            }).catch(e=>console.log(e));


        /* setPrescriptionsView([...prescriptionsView, prescription]);
         setPrescriptions([...prescriptions, prescriptionPayload]);*/
        /* setNewPrescription((prev)=>{
             return {...prev, dosage:'',quantity:'',duration:'', route: 'oral', frequency: 'TDS' }
         });*/
        setDrugSearch('');

        toast.success('Prescription added');

    };





    const addLabOrder = (testId, testName,rates) => {
        /* if (selectedDiagnosis.lab_test.some(l => l.id === testId)) {
             toast.info('Test already added');
             alert('already added')
             return;
         }*/

        const payload = {
            lab_item : {rates_id: rates.id , amount : rates.amount, remark: ''},
            labTest_id : newPrescription.labTest_id
        }



        /* const isAdded = selectedDiagnosis.lab_test.map((item)=>{
             return item.rates.some(res=>res.id === testId)
         })*/

        const isAdded = selectedDiagnosis.lab_test.find((item)=>item.id == newPrescription?.labTest_id)?.rates.some(res=>res.id === testId)

        console.log(isAdded)

        if (!isAdded){
            axiosClient.post('/addLabtest',payload)
                .then(({data})=>{
                    setSelectedDiagnosis((prev)=>{
                        const newArray = prev.lab_test.map((item)=>{
                            if (item.id == newPrescription?.labTest_id){
                                return{...item, rates: [...item.rates, {title:rates.title,id:rates.id}] }
                            }
                            return item
                        })
                        return {...prev, lab_test:newArray}
                    })
                    alert(data.message)
                }).catch(e=>alert(e))

        }else{ alert('test already exist ')}


        setLabOrdersView([...labOrdersView, { testId:rates.id, testName:rates.title, priority: 'routine', notes: '', status: 'ordered' }]);
        setLabOrders([...labOrders, { rates_id: rates.id , amount : rates.amount, remark: ''}]);
        if (labOrders.length > 0){
            setLabTest(true)
        }
        toast.success('Lab test added');
    };

    const removePrescription = (sales, presId) => {

        const removePayload = {
            sales_id: sales.id,
            drug_stock_id: presId
        }
        axiosClient.post('/removePrescription',removePayload)
            .then(({data})=>{

                setSelectedDiagnosis((prev)=>{
                    const index = prev.sales.findIndex(item => item.id == sales.id);

                    let filteredSales =   prev.sales[index]

                    const updatedPres = filteredSales.drug_stock.filter(drug=> drug.id != presId)

                    const updatedArray = [...prev.sales]
                    updatedArray[index] = {
                        ...filteredSales,
                        drug_stock: updatedPres
                    }


                    const alternativeArray = prev.sales.map((item)=>{
                        if (item.id === sales.id){
                            return {
                                ...item, drug_stock : item.drug_stock.filter(item => item.id !== presId)
                            }
                        }
                        return item
                    })


                    return ({...prev, sales: alternativeArray })
                })
                alert(data.message)
            }).catch(e=>console.log(e))


        /* setPrescriptions(prescriptions.filter((_, i) => i !== index));
         setPrescriptionsView(prescriptionsView.filter((_, i) => i !== index));*/
    };

    const removeLabOrder = (order,testId) => {

        const removePayload = {
            labTest_id : order.id,
            rates_id : testId
        }

        axiosClient.post('/removeLabtest',removePayload)
            .then(({data})=>{
                setSelectedDiagnosis((prev)=>{

                    console.log(prev.lab_test, 'THis is the previous lab ')
                    const alternativeArray = prev.lab_test.map((item)=>{
                        if (item.id === order.id){
                            return {
                                ...item, rates : item.rates.filter(res => res.id !== testId)
                            }
                        }
                        return item
                    })
                    console.log(alternativeArray, 'THis is the alternate Array')



                    return ({...prev, lab_test: alternativeArray })
                })
                alert(data.message)
            })
            .catch(e => alert(e))




        /*  setLabOrders(labOrders.filter(l => l.rates_id !== testId));
          setLabOrdersView(labOrdersView.filter(l => l.testId !== testId));*/
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
        /* if (!chiefComplaints || !provisionalDiagnosis) {
             toast.error('Please fill in required fields');
             return;
         }*/
        console.log('yeeeee')
        console.log(selectedDiagnosis?.body_vitals)

        const diagnosisData = {
            password  : password,
            patient_id: selectedPatient.patient.id,
            user_id: nurse.id,
            diagnosisReport_id: selectedDiagnosis?.id,
            consultation_id : searchParams.get('consultation_id') || null,
            rate_id : '',
            editPayload: {
                diagnosis_report: selectedDiagnosis?.diagnosis_report,

            },
            ward_status : selectedDiagnosis?.ward_status,


        }



        axiosClient.post('/updateNurseDiagnosisReport', diagnosisData)
            .then(({data})=>{
                alert(data.message)
                console.log(data)
                navigate(`/nurse/patientDetail/${selectedPatient.regID}`)
            }).catch(e=>alert(e.message()))


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
                            onClick={(e) => {
                                handleSubmit(e)
                                console.log('hello')
                            }}
                            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Save Diagnosis
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>







            <PageHeader
                title="Edit Diagnosis Report"
                subtitle="Edit a Diagnosis Report"
                breadcrumb={[
                    { label: 'Dashboard', path: '/doctor' },
                    { label: 'Patient Diagnosis', path: '/doctor/diagnosis' },
                    { label: 'Edit Diagnosis Report' }
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
                            onClick={handleSubmit}
                            className="bg-primary hover:bg-primary/90"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Save Diagnosis
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
                        {patientSearch && searchPatient.length === 0 && (
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
                        {/* <TabsTrigger value="vitals" className="flex items-center gap-2">
                            <Heart className="w-4 h-4" />
                            Vitals
                        </TabsTrigger>*/}
                       {/* <TabsTrigger value="prescriptions" className="flex items-center gap-2">
                            <Pill className="w-4 h-4" />
                            Prescriptions
                             {selectedDiagnosis?.sales?.length > 0 && (
                                <Badge variant="secondary" className="ml-1">{prescriptions.length}</Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="lab" className="flex items-center gap-2">
                            <FlaskConical className="w-4 h-4" />
                            Lab Tests
                            {labOrders.length > 0 && (
                                <Badge variant="secondary" className="ml-1">{labOrders.length}</Badge>
                            )}
                        </TabsTrigger>*/}
                    </TabsList>

                    {/* Clinical Tab */}
                    <TabsContent value="clinical" className="space-y-4">
                        <Card className="p-6">
                            <div className="space-y-4">


                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    <div>
                                        <Label className="text-xs">patient Ward_status</Label>
                                        <Select
                                            value={selectedDiagnosis?.diagnosis?.ward_status}
                                            onValueChange={v => setSelectedDiagnosis({...selectedDiagnosis, diagnosis:{...selectedDiagnosis?.diagnosis, ward_status: v} })}
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
                                        value={selectedDiagnosis?.diagnosis_report}
                                        onChange={e => setSelectedDiagnosis({...selectedDiagnosis, diagnosis_report: e.target.value})}
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
                                                value={selectedVitals? selectedVitals[vital.key] : ''}
                                                onChange={e => {
                                                    setSelectedVitals(prev => ({ ...prev, [vital.key]: e.target.value }));
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
                    </TabsContent>*/}


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
                                Save Diagnosis
                            </Button>
                        </div>
                    </div>
                </div>
            </div>






        </div>
    );
};

export default NurseDiagnosisReportEdit;