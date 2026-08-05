import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
    ChevronRight,
    HeartPulse,
    ClipboardList,
    FilePlus,
    Syringe,
    BadgeDollarSign,
    CalendarDays,
    UserRound,
    Microscope,
    PillBottle,
    ClockArrowUp,
    MessageSquare,
    FileSignature,
    Plus,
    AlertCircle,
    CheckCircle2,
    Clock as ClockIcon,
} from 'lucide-react';
import {
    adminUserManagement,
    diagnosisStore,
    labStore,
    drugStore,
    selectedStore,
} from '../../store/store.jsx';
import axiosClient from "../../service/axiosClient.js";
import SaleDetailModal from "../../components/modals/DrugSaleModal.jsx";
import LabTestDetailModal from "../../components/modals/LabTestModal.jsx";

const DiagnosisDetailsPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
   // const { setSelectedPatient,selectedDiagnosis } = selectedStore();
    const { doctorsDiagnosis } = diagnosisStore();

    // Find the specific diagnosis
    //const diagnosis = doctorsDiagnosis?.find(d => d.id === parseInt(id));


    const [selectedDiagnosis, setSelectedDiagnosis] = useState()
    const [isLoading, setIsLoading] = useState(true)


    useEffect(()=>{
        setIsLoading(true)
        axiosClient.get(`/getDoctorsPatientDiagnosis?diagnosis_id=${id}`)
            .then(({data})=>{
                setSelectedDiagnosis(data.data)
                setIsLoading(false)
            }).catch((e)=>{
            setIsLoading(false)
        })
    },[setSelectedDiagnosis])

    const diagnosis = selectedDiagnosis;
    const [showDrugModal, setShowDrugModal] = useState(false);
    const [showLabTestModal, setShowLabTestModal] = useState(false);
    const [seletedLabTestModal, setSelectedLabTestModal] = useState({});
    const [seletedDrugModal, setSelectedDrugModal] = useState({});


    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <UserCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">Loading Diagnosis Data</h3>
                    <p className="text-sm text-muted-foreground">Please wait while we load Diagnosis Data.</p>

                </div>
            </div>
        );
    }

    // If no diagnosis, redirect
    if (!selectedDiagnosis) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">Diagnosis Not Found</h3>
                    <p className="text-sm text-muted-foreground">The diagnosis you're looking for doesn't exist.</p>
                    <Button className="mt-4" onClick={() => navigate('/doctor/diagnosis')}>
                        Back to Diagnosis
                    </Button>
                </div>
            </div>
        );
    }

    // Get patient data

    const patientData = selectedDiagnosis.patient;

    // Get diagnosis data
    const consultation = diagnosis?.consultation;
    const labTests = diagnosis?.lab_test || [];
    const sales = diagnosis?.sales || [];
    const diagnosisReports = diagnosis?.diagnosis_report || [];
    const doctor = diagnosis?.doctor;

    // Calculate stats
    const consultationCount = consultation ? 1 : 0;
    const diagnosisReportCount = diagnosisReports.length;
    const drugIssuedCount = sales.length;
    const labTestCount = labTests.length;
    const totalDrugItems = sales.reduce((total, sale) => {
        return total + (sale.drug_stock?.length || 0);
    }, 0);

    const body_vitals = JSON.parse(diagnosis?.body_vitals)

    // Get latest report
    const latestReport = diagnosisReports[diagnosisReports.length - 1];

    // Format date
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get report status
    const getReportStatus = (report) => {
        if (!report) return 'draft';
        if (report.diagnosis_report) return 'completed';
        return 'draft';
    };

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
                title="Diagnosis Details"
                subtitle={`${diagnosis.final_diagnosis || diagnosis.initial_diagnosis || 'No diagnosis'} - ${diagnosis.patient?.user.name || 'Unknown Patient'}`}
                actions={
                    <div className="flex gap-2 flex-wrap">
                        <Button variant="outline" onClick={() => navigate('/doctor/diagnosis')}>
                            Back to Diagnosis
                        </Button>
                        <Button onClick={() => navigate(`/doctor/editdiagnosis?patient_regID=${diagnosis.patient?.user?.regID}&diagnosis_id=${diagnosis.id}`)}>
                            <FileText className="w-4 h-4 mr-2" />
                            Edit Diagnosis
                        </Button>
                        <Button variant="outline" onClick={() => navigate(`/doctor/patient/${patient?.id}`)}>
                            <User className="w-4 h-4 mr-2" />
                            View Patient
                        </Button>
                    </div>
                }
            />

            {/* Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Diagnosis Reports"
                    value={diagnosisReportCount}
                    icon={<FileCheck className="w-5 h-5" />}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Consultations"
                    value={consultationCount}
                    icon={<Users className="w-5 h-5" />}
                    color="bg-green-500"
                />
                <StatCard
                    title="Lab Tests"
                    value={labTestCount}
                    icon={<FlaskRound className="w-5 h-5" />}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Drugs Issued"
                    value={totalDrugItems}
                    icon={<Pill className="w-5 h-5" />}
                    color="bg-orange-500"
                />
            </div>

            {/* Main Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Diagnosis Info */}
                <Card className="p-6 lg:col-span-2 border shadow-sm hover:shadow-md transition-shadow duration-300">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <ClipboardList className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Diagnosis Information</h3>
                                <p className="text-sm text-muted-foreground">Clinical assessment and diagnostic details</p>
                            </div>
                        </div>
                        <StatusBadge status={diagnosis.ward_status || 'active'} size="md" />
                    </div>

                    {/* Main Content */}
                    <div className="space-y-5">
                        {/* Diagnosis Row - Compact */}
                        <div className="flex flex-wrap items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                            <div className="flex-1 min-w-[200px]">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Diagnosis:</span>
                                    <span className="text-base font-bold text-foreground">
                        {diagnosis.final_diagnosis || diagnosis.initial_diagnosis || 'N/A'}
                    </span>
                                    {diagnosis.initial_diagnosis && diagnosis.initial_diagnosis !== diagnosis.final_diagnosis && (
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/30 whitespace-nowrap">
                            Initial: {diagnosis.initial_diagnosis}
                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border/50">
                                <span className="text-xs text-muted-foreground">ID:</span>
                                <span className="text-xs font-mono font-semibold">#{diagnosis.id}</span>
                            </div>
                        </div>

                        {/* Description - Takes more space */}
                        <div className="p-4 rounded-lg border border-border/50 hover:border-primary/20 transition-colors">
                            <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-4 h-4 text-muted-foreground" />
                                <h4 className="text-sm font-medium">Clinical Notes & Observations</h4>
                                <span className="text-xs text-muted-foreground ml-auto">Doctor's remarks</span>
                            </div>
                            <div className="min-h-[120px]">
                                <p className="text-sm leading-relaxed text-foreground/80">
                                    {diagnosis.description || 'No clinical notes recorded'}
                                </p>
                            </div>
                        </div>

                        {/* Two Column: Complaints & Vitals */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Patient's Complaints */}
                            <div className="p-4 rounded-lg border border-border/50 hover:border-amber-200/50 transition-colors">
                                <div className="flex items-center gap-2 mb-2">
                                    <MessageSquare className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                    <h4 className="text-sm font-medium">Patient's Complaints</h4>
                                </div>
                                <p className="text-sm leading-relaxed text-foreground/80">
                                    {diagnosis.patients_complain || 'No complaints recorded'}
                                </p>
                            </div>

                            {/* Body Vitals */}
                            <div className="p-4 rounded-lg border border-border/50 hover:border-emerald-200/50 transition-colors">
                                <div className="flex items-center gap-2 mb-3">
                                    <HeartPulse className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                    <h4 className="text-sm font-medium">Body Vitals</h4>
                                    <span className="text-xs text-muted-foreground ml-auto">
                        {diagnosis.created_at && new Date(diagnosis.created_at).toLocaleDateString()}
                    </span>
                                </div>
                                {body_vitals && typeof body_vitals === 'object' ? (
                                    <div className="grid grid-cols-2 gap-2">
                                        {Object.entries(body_vitals).map(([key, value]) => (
                                            <div key={key} className="flex items-center justify-between px-3 py-2 rounded-md bg-muted/30">
                                <span className="text-xs text-muted-foreground capitalize">
                                    {key.replace('_', ' ')}
                                </span>
                                                <span className="text-sm font-semibold">{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-2">No vitals recorded</p>
                                )}
                            </div>
                        </div>

                        {/* Footer - Doctor & Date */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-border/50">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Stethoscope className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{doctor?.user?.name || 'Unknown'}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {doctor?.specialization || 'N/A'}
                                        {doctor?.license_id && ` • License: ${doctor.license_id}`}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {diagnosis.created_at && new Date(diagnosis.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </span>
                                {diagnosis.updated_at !== diagnosis.created_at && (
                                    <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        Updated: {new Date(diagnosis.updated_at).toLocaleDateString()}
                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Quick Actions & Patient Info */}
                <Card className="p-6">
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-3">Patient Information</h4>
                            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    {diagnosis.patient?.user?.profile_image ? (
                                        <img
                                            src={diagnosis.patient?.user.profile_image}
                                            alt={diagnosis.patient?.user.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-6 h-6 text-primary" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold truncate">{diagnosis.patient?.user?.name || 'Unknown'}</p>
                                    <p className="text-xs text-muted-foreground truncate">{diagnosis.patient?.user?.regID || 'N/A'}</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex-shrink-0"
                                    onClick={() => {
                                        const diagnosisPatient = {patient:diagnosis.patient}
                                        //setSelectedPatient(diagnosis)
                                        navigate(`/doctor/patientDetail/${diagnosis.patient.user.regID}`)

                                    }}
                                >
                                    <Eye className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="mt-3 space-y-2 text-sm">
                                <p className="flex items-center gap-2">
                                    <span className="font-medium w-24">Blood Group:</span>
                                    <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                                        {patientData?.blood_group || 'N/A'}
                                    </span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="font-medium w-24">Genotype:</span>
                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                        {patientData?.genotype || 'N/A'}
                                    </span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="font-medium w-24">Insurance:</span>
                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                        {patientData?.insurance_id || 'None'}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <h4 className="text-sm font-medium text-muted-foreground mb-3">Quick Actions</h4>
                            <div className="space-y-2">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => navigate(`/doctor/diagnosisReport/new?diagnosis_id=${diagnosis.id}&regID=${diagnosis.patient.user.regID}`)}
                                >
                                    <FilePlus className="w-4 h-4 mr-2" />
                                    Add Diagnosis Report
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => navigate(`/lab/tests/new?diagnosisId=${diagnosis.id}`)}
                                >
                                    <Microscope className="w-4 h-4 mr-2" />
                                    Request Lab Test
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => navigate(`/pharmacy/dispense?diagnosisId=${diagnosis.id}`)}
                                >
                                    <PillBottle className="w-4 h-4 mr-2" />
                                    Dispense Drugs
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => navigate(`/finance/payments?diagnosisId=${diagnosis.id}`)}
                                >
                                    <BadgeDollarSign className="w-4 h-4 mr-2" />
                                    Process Payment
                                </Button>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <h4 className="text-sm font-medium text-muted-foreground mb-3">Status Summary</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Ward Status</span>
                                    <StatusBadge status={diagnosis.ward_status || 'active'} size="sm" />
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Consultation</span>
                                    <StatusBadge status={consultation?.attendance_status || 'pending'} size="sm" />
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Payment</span>
                                    <StatusBadge status={consultation?.payment_status || 'unpaid'} size="sm" />
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* ✨ DIAGNOSIS REPORTS SECTION ✨ */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <FileSignature className="w-5 h-5" />
                            Diagnosis Reports
                        </h3>
                        <span className="bg-muted px-2 py-0.5 rounded-full text-xs font-medium">
                            {diagnosisReports.length}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/doctor/AlldiagnosisReport?diagnosis_id=${diagnosis.id}`)}
                        >
                            View All <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => navigate(`/doctor/diagnosis/${diagnosis.id}/add-report`)}
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Report
                        </Button>
                    </div>
                </div>

                {diagnosisReports.length > 0 ? (
                    <div className="space-y-4">
                        {diagnosisReports.map((report, index) => {
                            const isLatest = index === diagnosisReports.length - 1;
                            return (
                                <div
                                    key={report.id}
                                    className={`p-4 border rounded-lg transition-colors ${
                                        isLatest ? 'border-primary/50 bg-primary/5' : 'hover:bg-muted'
                                    }`}
                                    onClick={()=>navigate(`/doctor/diagnosisReportDetail?diagnosisReport_id=${report.id}`)}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium">Report #{report.id}</span>
                                                {isLatest && (
                                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
                                                        <CheckCircle2 className="w-3 h-3" />
                                                        Latest
                                                    </span>
                                                )}
                                            </div>
                                            <StatusBadge status="completed" size="sm" />
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <User className="w-3 h-3" />
                                                {report.user?.name || 'Unknown'}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(report.created_at)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-muted/30 rounded-lg p-4">
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                            {report.diagnosis_report}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between mt-3">
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                Created: {formatDate(report.created_at)}
                                            </span>
                                            {report.updated_at !== report.created_at && (
                                                <span className="flex items-center gap-1">
                                                    <ClockArrowUp className="w-3 h-3" />
                                                    Updated: {formatDate(report.updated_at)}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="hover:bg-blue-100"
                                                onClick={() => navigate(`/doctor/reports/${report.id}/edit`)}
                                            >
                                                <FileText className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="hover:bg-blue-100"
                                                onClick={() => {
                                                    // Copy to clipboard
                                                    navigator.clipboard.writeText(report.diagnosis_report);
                                                }}
                                            >
                                                <FileCheck className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <FileSignature className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-sm text-muted-foreground">No diagnosis reports available</p>
                        <p className="text-xs text-muted-foreground mt-1">Add a report to document the diagnosis</p>
                        <Button
                            className="mt-4"
                            onClick={() => navigate(`/doctor/diagnosis/${diagnosis.id}/add-report`)}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add First Report
                        </Button>
                    </div>
                )}
            </Card>

            {/* Lab Tests and Drug Sales */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Lab Tests */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <FlaskRound className="w-5 h-5" />
                            Lab Tests ({labTests.length})
                        </h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/lab/tests?diagnosisId=${diagnosis.id}`)}
                        >
                            View All <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto scrollbar-thin">
                        {labTests.length > 0 ? (
                            labTests.map(test => (
                                <div
                                    key={test.id}
                                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition-colors cursor-pointer"
                                    onClick={() => {

                                        setSelectedLabTestModal(test)
                                        setShowLabTestModal(true)
                                    }}
                                >
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{test.lab_test_name}</p>
                                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                            {test.lab_test_description}
                                        </p>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-xs text-muted-foreground">
                                                ₦{parseInt(test.lab_test_amount).toLocaleString()}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {test.lab_test_result ? 'Results available' : 'Pending'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <StatusBadge
                                            status={test.lab_test_progress_status || 'pending'}
                                            size="sm"
                                        />
                                        <Button variant="ghost" size="sm" className="hover:bg-purple-100">
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-sm text-muted-foreground py-4">No lab tests requested</p>
                        )}
                    </div>
                </Card>

                {/* Drug Sales */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Pill className="w-5 h-5" />
                            Drug Sales ({sales.length})
                        </h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setSelectedDrugModal(sale)
                                setShowDrugModal(true)
                            }}                        >
                            View All <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto scrollbar-thin">
                        {sales.length > 0 ? (
                            sales.map(sale => (
                                <div
                                    key={sale.id}
                                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition-colors cursor-pointer"
                                    onClick={() => {
                                        setSelectedDrugModal(sale)
                                        setShowDrugModal(true)
                                    }}
                                >
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Sale #{sale.id}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {sale.drug_stock?.length || 0} items
                                        </p>
                                        <p className="text-xs font-semibold mt-1">
                                            ₦{parseInt(sale.total_amount).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <StatusBadge
                                            status={sale.payment_status || 'pending'}
                                            size="sm"
                                        />
                                        <Button variant="ghost" size="sm" className="hover:bg-green-100">
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-sm text-muted-foreground py-4">No drugs dispensed</p>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default DiagnosisDetailsPage;