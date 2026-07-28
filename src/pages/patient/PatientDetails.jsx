import React, {useEffect, useState} from 'react';
import {Navigate, useNavigate, useParams, useSearchParams} from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    User,
    Users,
    FileText,
    Clock,
    ArrowRight,
    Activity,
    Phone,
    Mail,
    Calendar,
    UserCircle,
    Stethoscope,
    FlaskRound,
    Pill,
    FileCheck,
    Eye,
    ChevronRight
} from 'lucide-react';
import {
    adminUserManagement,
    diagnosisStore,
    labStore,
    drugStore,
    selectedStore, userStore
} from '../../store/store.jsx';
import axiosClient from "../../service/axiosClient.js";
import LabTestDetailModal from "../../components/modals/LabTestModal.jsx";
import SaleDetailModal from "../../components/modals/DrugSaleModal.jsx";

const PatientDetailsPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const { patients } = adminUserManagement();
    const { user } = userStore();
    //const { selectedPatient,setSelectedPatient } = selectedStore();

    const [selectedPatient, setSelectedPatient] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [showDrugModal, setShowDrugModal] = useState(false);
    const [showLabTestModal, setShowLabTestModal] = useState(false);
    const [seletedLabTestModal, setSelectedLabTestModal] = useState({});
    const [seletedDrugModal, setSelectedDrugModal] = useState({});


    // Find the patient

    const patient = selectedPatient

    useEffect(()=>{
        setIsLoading(true)
        axiosClient.get(`/getDoctorPatientByRegNo?regID=${id}`)
            .then(({data})=>{
                setSelectedPatient(data.data)
                setIsLoading(false)
            }).catch((e)=>{
                setIsLoading(false)
        })
    },[setSelectedPatient])




    // if no seleted Patient, return to dashboard


        const patientDiagnoses = selectedPatient?.patient?.diagnosis
        const patientLabTests = selectedPatient?.patient?.labtest
    console.log(patientLabTests)
        const patientDrugSales = selectedPatient?.patient?.sales


        // Calculate stats
        const consultations = selectedPatient?.patient?.consultation.length;
        const labTestsCount = patientLabTests?.length;
        const drugsIssued = patientDrugSales?.length;
        const diagnosesCount = patientDiagnoses?.length ;

        // Get recent items (last 5)
        const recentDiagnoses = patientDiagnoses?.slice(-5).reverse();
        const recentLabTests = patientLabTests?.slice(-5).reverse();
        const recentDrugSales = patientDrugSales?.slice(-5).reverse();



    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <UserCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">Loading Patient Data</h3>
                    <p className="text-sm text-muted-foreground">Please wait while we load patient Data.</p>

                </div>
            </div>
        );
    }

    else if (!selectedPatient) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <UserCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">Patient Not Found</h3>
                    <p className="text-sm text-muted-foreground">The patient you're looking for doesn't exist.</p>
                    <Button className="mt-4" onClick={() => navigate('/doctor/patients')}>
                        Back to Patients
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className='w-[100%]'>
                <SaleDetailModal
                    open={showDrugModal}
                    onOpenChange={setShowDrugModal}
                    saleId={1}
                    saleSelect={seletedDrugModal}
                />
            </div>

            <LabTestDetailModal
                open={showLabTestModal}
                onOpenChange={setShowLabTestModal}
                labTestId={2}
                selectedLab={seletedLabTestModal}
            />

            {/* Page Header */}
            <PageHeader
                title="Patient Details"
                subtitle={`${patient?.name ?? patient?.patient?.user?.name} - ${patient?.regID ?? patient?.patient?.user?.regID}`}
                actions={
                    <div>
                        {user?.user_role == 'doctor' && (
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => navigate('/doctor/patients')}>
                                    Back to Patients
                                </Button>
                                <Button onClick={() => navigate(`/doctor/diagnosis/new?patient_regID=${patient?.regID ?? patient?.patient?.user?.regID}${searchParams.get('consultation_id') ? `&consultation_id=${searchParams.get('consultation_id')}` : ''}`)}>                            <Stethoscope className="w-4 h-4 mr-2" />
                                    New Diagnosis
                                </Button>

                            </div>
                        )}
                    </div>

                }
            />

            {/* Patient Profile Card */}
            <Card className="p-6">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    <div className="flex-shrink-0">
                        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                            {patient?.profile_image ? (
                                <img
                                    src={patient?.profile_image ?? patient?.patient?.profile_image}
                                    alt={patient?.name ?? patient?.patient?.user?.name}
                                    className="w-24 h-24 rounded-full object-cover"
                                />
                            ) : (
                                <User className="w-12 h-12 text-primary" />
                            )}
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h2 className="text-2xl font-bold">{patient?.name ?? patient?.patient?.user?.name}</h2>
                                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                    <User className="w-4 h-4" />
                                    Reg ID: {patient?.regID ?? patient?.patient?.user?.regID}
                                </p>
                                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                    <Mail className="w-4 h-4" />
                                    {patient?.email ?? patient?.patient?.user?.email}
                                </p>
                                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                    <Phone className="w-4 h-4" />
                                    {patient?.phone_no ?? patient?.patient?.user?.phone_no}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm flex items-center gap-2">
                                    <span className="font-medium">Blood Group:</span>
                                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">{patient.patient?.blood_group}</span>
                                </p>
                                <p className="text-sm flex items-center gap-2 mt-2">
                                    <span className="font-medium">Genotype:</span>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">{patient.patient?.genotype}</span>
                                </p>
                                <p className="text-sm flex items-center gap-2 mt-2">
                                    <span className="font-medium">Insurance:</span>
                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">{patient.patient?.insurance_id || 'None'}</span>
                                </p>
                                <p className="text-sm flex items-center gap-2 mt-2">
                                    <Calendar className="w-4 h-4" />
                                    <span className="font-medium">Joined:</span>
                                    {new Date(patient.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Emergency Contact */}
                <div className="mt-4 pt-4 border-t">
                    <h4 className="text-sm font-semibold mb-2">Emergency Contact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <p><span className="font-medium">Name:</span> {patient.patient?.nos_name}</p>
                        <p><span className="font-medium">Phone:</span> {patient.patient?.nos_phone_no}</p>
                        <p><span className="font-medium">Address:</span> {patient.patient?.nos_address}</p>
                    </div>
                </div>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Diagnoses"
                    value={diagnosesCount}
                    icon={<FileText className="w-5 h-5" />}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Total Consultations"
                    value={consultations}
                    icon={<Users className="w-5 h-5" />}
                    color="bg-green-500"
                />
                <StatCard
                    title="Lab Tests"
                    value={labTestsCount}
                    icon={<FlaskRound className="w-5 h-5" />}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Drugs Issued"
                    value={drugsIssued}
                    icon={<Pill className="w-5 h-5" />}
                    color="bg-orange-500"
                />
            </div>

            {/* Diagnosis List */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <FileCheck className="w-5 h-5" />
                        Diagnosis History
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/doctor/diagnosis?patient_id=${patient.regID}`)}>
                        View All <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto scrollbar-thin p-1">
                    {patientDiagnoses?.length > 0 ? (
                        patientDiagnoses.map((diagnosis, index) => (
                            <div
                                key={diagnosis.id}
                                className="flex flex-col p-4 rounded-xl border-2 hover:border-primary/50 bg-card hover:shadow-lg transition-all duration-200 cursor-pointer group"
                                onClick={() => {
                                    console.log(user.user_role)
                                    if (user?.user_role === 'nurse'){
                                        navigate(`/nurse/diagnosisDetail/${diagnosis.id}`)
                                    }else {
                                        navigate(`/doctor/diagnosisDetail/${diagnosis.id}`)

                                    }
                                }}
                            >
                                {/* Header with number and status */}
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                                #{index + 1}
                            </span>
                                    </div>
                                    <StatusBadge status={diagnosis.ward_status || 'active'} size="sm" />
                                </div>

                                {/* Diagnosis Name */}
                                <h4 className="font-semibold text-sm line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
                                    {diagnosis.final_diagnosis || diagnosis.initial_diagnosis || 'No diagnosis'}
                                </h4>

                                {/* Doctor and Date */}
                                <div className="mt-2 space-y-1 flex-1">
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Stethoscope className="w-3 h-3" />
                                        <span>Dr. {diagnosis.doctor?.user?.name || 'Unknown'}</span>
                                    </p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(diagnosis.created_at).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>

                                {/* Footer with reports and action */}
                                <div className="mt-3 pt-3 border-t flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                                        <span className="text-sm font-semibold">{diagnosis.diagnosis_report?.length || 0}</span>
                                        <span className="text-xs text-muted-foreground">reports</span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 px-3 text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/doctor/diagnosisDetail/${diagnosis.id}`)
                                        }}
                                    >
                                        View <ChevronRight className="w-3 h-3 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-12">
                            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <p className="text-sm text-muted-foreground">No diagnoses found for this patient</p>
                        </div>
                    )}
                </div>
            </Card>

            {/* Recent Lab Tests and Drug Sales */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Lab Tests */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <FlaskRound className="w-5 h-5" />
                            Recent Lab Tests
                        </h3>
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/lab/tests?patientId=${patient.id}`)}>
                            View All <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-thin">
                        {recentLabTests?.length > 0 ? (
                            recentLabTests.map(test => (
                                <div
                                    key={test.id}
                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                                    onClick={() => {

                                        setSelectedLabTestModal(test)
                                        setShowLabTestModal(true)
                                    }}
                                >
                                    <div>
                                        <p className="text-sm font-medium">{test.lab_test_name}</p>
                                        <p className="text-xs text-muted-foreground">{test.lab_test_description}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <StatusBadge status={test.lab_test_progress_status || 'pending'} size="sm" />
                                        <Button variant="ghost" size="sm" className="hover:bg-purple-100">
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-sm text-muted-foreground py-4">No lab tests found</p>
                        )}
                    </div>
                </Card>

                {/* Recent Drug Sales */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Pill className="w-5 h-5" />
                            Recent Drug Sales
                        </h3>
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/pharmacy/sales?patientId=${patient.id}`)}>
                            View All <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-thin">
                        {recentDrugSales?.length > 0 ? (
                            recentDrugSales.map(sale => (
                                <div
                                    key={sale.id}
                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                                    onClick={() => {
                                        setSelectedDrugModal(sale)
                                        setShowDrugModal(true)
                                    }}
                                >
                                    <div>
                                        <p className="text-sm font-medium">Sale #{sale.id}</p>
                                        <p className="text-xs text-muted-foreground">₦{sale.total_amount?.toLocaleString() || 0}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <StatusBadge status={sale.payment_status || 'pending'} size="sm" />
                                        <Button variant="ghost" size="sm" className="hover:bg-green-100">
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-sm text-muted-foreground py-4">No drug sales found</p>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default PatientDetailsPage;