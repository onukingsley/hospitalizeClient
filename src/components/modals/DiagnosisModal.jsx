import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
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
    X,
    Printer,
    Download,
} from 'lucide-react';
import StatusBadge from '@/components/common/StatusBadge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import axiosClient from "../../service/axiosClient.js";
import SaleDetailModal from "../../components/modals/DrugSaleModal.jsx";
import LabTestDetailModal from "../../components/modals/LabTestModal.jsx";

const DiagnosisDetailModal = ({ open, onOpenChange, diagnosisId }) => {
    const navigate = useNavigate();
    const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showDrugModal, setShowDrugModal] = useState(false);
    const [showLabTestModal, setShowLabTestModal] = useState(false);
    const [selectedLabTestModal, setSelectedLabTestModal] = useState({});
    const [selectedDrugModal, setSelectedDrugModal] = useState({});

    useEffect(() => {
        if (open && diagnosisId) {
            setIsLoading(true);
            axiosClient.get(`/getDoctorsPatientDiagnosis?diagnosis_id=${diagnosisId}`)
                .then(({ data }) => {
                    setSelectedDiagnosis(data.data);
                    setIsLoading(false);
                })
                .catch((e) => {
                    console.error(e);
                    setIsLoading(false);
                });
        }
    }, [open, diagnosisId]);

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return format(new Date(date), 'MMM dd, yyyy • h:mm a');
    };

    const formatDateShort = (date) => {
        if (!date) return 'N/A';
        return format(new Date(date), 'MMM dd, yyyy');
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    if (isLoading) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] overflow-hidden p-0">
                    <div className="flex items-center justify-center h-[400px]">
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-muted-foreground">Loading diagnosis details...</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    if (!selectedDiagnosis) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] overflow-hidden p-0">
                    <div className="flex items-center justify-center h-[300px]">
                        <div className="text-center">
                            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <p className="text-lg font-semibold">Diagnosis Not Found</p>
                            <p className="text-sm text-muted-foreground">The diagnosis you're looking for doesn't exist.</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    const diagnosis = selectedDiagnosis;
    const patientData = diagnosis.patient;
    const consultation = diagnosis?.consultation;
    const labTests = diagnosis?.lab_test || [];
    const sales = diagnosis?.sales || [];
    const diagnosisReports = diagnosis?.diagnosis_report || [];
    const doctor = diagnosis?.doctor;

    const consultationCount = consultation ? 1 : 0;
    const diagnosisReportCount = diagnosisReports.length;
    const labTestCount = labTests.length;
    const totalDrugItems = sales.reduce((total, sale) => {
        return total + (sale.drug_stock?.length || 0);
    }, 0);

    const body_vitals = diagnosis?.body_vitals ? JSON.parse(diagnosis.body_vitals) : null;

    return (
        <>
            <SaleDetailModal
                open={showDrugModal}
                onOpenChange={setShowDrugModal}
                saleId={selectedDrugModal?.id}
                saleSelect={selectedDrugModal}
            />

            <LabTestDetailModal
                open={showLabTestModal}
                onOpenChange={setShowLabTestModal}
                labTestId={selectedLabTestModal?.id}
                selectedLab={selectedLabTestModal}
            />

            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="!max-w-6xl w-full max-h-[90vh] overflow-y-scroll p-0 flex flex-col">
                    {/* Header */}
                    <DialogHeader className="px-6 py-4 border-b flex-shrink-0 bg-muted/10">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-xl bg-primary/10">
                                    <ClipboardList className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <DialogTitle className="text-xl font-bold">
                                        Diagnosis Details
                                    </DialogTitle>
                                    <DialogDescription className="text-sm text-muted-foreground mt-1">
                                        {diagnosis.final_diagnosis || diagnosis.initial_diagnosis || 'No diagnosis'} •
                                        {diagnosis.patient?.user?.name || 'Unknown Patient'}
                                    </DialogDescription>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onOpenChange(false)}
                                    className="h-8 w-8 p-0"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </DialogHeader>

                    {/* Content */}
                    <ScrollArea className="flex-1 px-6 py-4">
                        {/* Overview Cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                            <Card className="p-4 bg-muted/30">
                                <p className="text-xs text-muted-foreground">Diagnosis Reports</p>
                                <p className="text-xl font-bold">{diagnosisReportCount}</p>
                            </Card>
                            <Card className="p-4 bg-muted/30">
                                <p className="text-xs text-muted-foreground">Consultations</p>
                                <p className="text-xl font-bold">{consultationCount}</p>
                            </Card>
                            <Card className="p-4 bg-muted/30">
                                <p className="text-xs text-muted-foreground">Lab Tests</p>
                                <p className="text-xl font-bold">{labTestCount}</p>
                            </Card>
                            <Card className="p-4 bg-muted/30">
                                <p className="text-xs text-muted-foreground">Drugs Issued</p>
                                <p className="text-xl font-bold">{totalDrugItems}</p>
                            </Card>
                        </div>

                        {/* Main Info */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Diagnosis Info */}
                            <Card className="p-6 lg:col-span-2 border shadow-sm">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <ClipboardList className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">Diagnosis Information</h4>
                                            <p className="text-xs text-muted-foreground">Clinical assessment</p>
                                        </div>
                                    </div>
                                    <StatusBadge status={diagnosis.ward_status || 'active'} size="md" />
                                </div>

                                <div className="space-y-4">
                                    <div className="flex flex-wrap items-center gap-3 p-3 rounded-lg bg-muted/30">
                                        <div className="flex-1 min-w-[200px]">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Diagnosis:</span>
                                                <span className="text-base font-bold">
                                                    {diagnosis.final_diagnosis || diagnosis.initial_diagnosis || 'N/A'}
                                                </span>
                                                {diagnosis.initial_diagnosis && diagnosis.initial_diagnosis !== diagnosis.final_diagnosis && (
                                                    <Badge variant="outline" className="text-[10px] bg-amber-50">
                                                        Initial: {diagnosis.initial_diagnosis}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50">
                                            <span className="text-xs text-muted-foreground">ID:</span>
                                            <span className="text-xs font-mono font-semibold">#{diagnosis.id}</span>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-lg border">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FileText className="w-4 h-4 text-muted-foreground" />
                                            <h5 className="text-sm font-medium">Clinical Notes</h5>
                                            <span className="text-xs text-muted-foreground ml-auto">Doctor's remarks</span>
                                        </div>
                                        <p className="text-sm leading-relaxed text-foreground/80">
                                            {diagnosis.description || 'No clinical notes recorded'}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 rounded-lg border">
                                            <div className="flex items-center gap-2 mb-2">
                                                <MessageSquare className="w-4 h-4 text-amber-600" />
                                                <h5 className="text-sm font-medium">Patient's Complaints</h5>
                                            </div>
                                            <p className="text-sm leading-relaxed text-foreground/80">
                                                {diagnosis.patients_complain || 'No complaints recorded'}
                                            </p>
                                        </div>

                                        <div className="p-4 rounded-lg border">
                                            <div className="flex items-center gap-2 mb-3">
                                                <HeartPulse className="w-4 h-4 text-emerald-600" />
                                                <h5 className="text-sm font-medium">Body Vitals</h5>
                                                <span className="text-xs text-muted-foreground ml-auto">
                                                    {diagnosis.created_at && formatDateShort(diagnosis.created_at)}
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

                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t">
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
                                                {diagnosis.created_at && formatDate(diagnosis.created_at)}
                                            </span>
                                            {diagnosis.updated_at !== diagnosis.created_at && (
                                                <span className="flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    Updated: {formatDateShort(diagnosis.updated_at)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Patient & Actions */}
                            <Card className="p-6">
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground mb-3">Patient Information</h4>
                                        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                {diagnosis.patient?.user?.profile_image ? (
                                                    <img
                                                        src={diagnosis.patient.user.profile_image}
                                                        alt={diagnosis.patient.user.name}
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
                                            {/*<Button
                                                variant="ghost"
                                                size="sm"
                                                className="flex-shrink-0"
                                                onClick={() => {
                                                    onOpenChange(false);
                                                    navigate(`/doctor/patientDetail/${diagnosis.patient.user.regID}`);
                                                }}
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>*/}
                                        </div>
                                        <div className="mt-3 space-y-2 text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium w-24">Blood Group:</span>
                                                <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                                                    {patientData?.blood_group || 'N/A'}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium w-24">Genotype:</span>
                                                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                                    {patientData?.genotype || 'N/A'}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium w-24">Insurance:</span>
                                                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                                    {patientData?.insurance_id || 'None'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t pt-4">
                                        <h4 className="text-sm font-medium text-muted-foreground mb-3">Quick Actions</h4>
                                        <div className="space-y-2">
                                          {/*  <Button
                                                variant="outline"
                                                className="w-full justify-start text-sm"
                                                onClick={() => {
                                                    onOpenChange(false);
                                                    navigate(`/doctor/diagnosisReport/new?diagnosis_id=${diagnosis.id}&regID=${diagnosis.patient.user.regID}`);
                                                }}
                                            >
                                                <FilePlus className="w-4 h-4 mr-2" />
                                                Add Report
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start text-sm"
                                                onClick={() => {
                                                    onOpenChange(false);
                                                    navigate(`/lab/tests/new?diagnosisId=${diagnosis.id}`);
                                                }}
                                            >
                                                <Microscope className="w-4 h-4 mr-2" />
                                                Request Lab Test
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start text-sm"
                                                onClick={() => {
                                                    onOpenChange(false);
                                                    navigate(`/pharmacy/dispense?diagnosisId=${diagnosis.id}`);
                                                }}
                                            >
                                                <PillBottle className="w-4 h-4 mr-2" />
                                                Dispense Drugs
                                            </Button>*/}
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

                        {/* Diagnosis Reports */}
                        <Card className="p-6 mt-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-semibold flex items-center gap-2">
                                        <FileSignature className="w-4 h-4" />
                                        Diagnosis Reports
                                    </h4>
                                    <Badge variant="secondary" className="text-xs">
                                        {diagnosisReports.length}
                                    </Badge>
                                </div>
                                <div className="flex gap-2">
                                   {/* <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            onOpenChange(false);
                                            navigate(`/doctor/AlldiagnosisReport?diagnosis_id=${diagnosis.id}`);
                                        }}
                                    >
                                        View All <ArrowRight className="w-4 h-4 ml-1" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            onOpenChange(false);
                                            navigate(`/doctor/diagnosis/${diagnosis.id}/add-report`);
                                        }}
                                    >
                                        <Plus className="w-4 h-4 mr-1" />
                                        Add
                                    </Button>*/}
                                </div>
                            </div>

                            {diagnosisReports.length > 0 ? (
                                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
                                    {diagnosisReports.slice(-3).reverse().map((report) => (
                                        <div
                                            key={report.id}
                                            className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                                            onClick={() => {
                                                onOpenChange(false);
                                                navigate(`/doctor/diagnosisReportDetail?diagnosisReport_id=${report.id}`);
                                            }}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium">Report #{report.id}</span>
                                                    <StatusBadge status="completed" size="sm" />
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <User className="w-3 h-3" />
                                                        {report.user?.name || 'Unknown'}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {formatDateShort(report.created_at)}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {report.diagnosis_report}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <FileSignature className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                                    <p className="text-sm text-muted-foreground">No reports available</p>
                                </div>
                            )}
                        </Card>

                        {/* Lab Tests & Drug Sales */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <Card className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-semibold flex items-center gap-2">
                                        <FlaskRound className="w-4 h-4" />
                                        Lab Tests
                                    </h4>
                                    <Badge variant="secondary" className="text-xs">{labTests.length}</Badge>
                                </div>
                                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                                    {labTests.length > 0 ? (
                                        labTests.slice(0, 3).map(test => (
                                            <div
                                                key={test.id}
                                                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                                                onClick={() => {
                                                    setSelectedLabTestModal(test);
                                                    setShowLabTestModal(true);
                                                }}
                                            >
                                                <div>
                                                    <p className="text-sm font-medium">{test.lab_test_name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {test.lab_test_result ? '✅ Results available' : '⏳ Pending'}
                                                    </p>
                                                </div>
                                                <StatusBadge status={test.lab_test_progress_status || 'pending'} size="sm" />
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-sm text-muted-foreground py-4">No lab tests</p>
                                    )}
                                </div>
                            </Card>

                            <Card className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-semibold flex items-center gap-2">
                                        <Pill className="w-4 h-4" />
                                        Drug Sales
                                    </h4>
                                    <Badge variant="secondary" className="text-xs">{sales.length}</Badge>
                                </div>
                                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                                    {sales.length > 0 ? (
                                        sales.slice(0, 3).map(sale => (
                                            <div
                                                key={sale.id}
                                                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                                                onClick={() => {
                                                    setSelectedDrugModal(sale);
                                                    setShowDrugModal(true);
                                                }}
                                            >
                                                <div>
                                                    <p className="text-sm font-medium">Sale #{sale.id}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {sale.drug_stock?.length || 0} items • {formatCurrency(sale.total_amount)}
                                                    </p>
                                                </div>
                                                <StatusBadge status={sale.payment_status || 'pending'} size="sm" />
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-sm text-muted-foreground py-4">No drug sales</p>
                                    )}
                                </div>
                            </Card>
                        </div>
                    </ScrollArea>

                    {/* Footer */}
                    <div className="px-6 py-3 border-t flex-shrink-0 flex items-center justify-between bg-muted/10">
                        <div className="text-xs text-muted-foreground">
                            <span className="font-medium">Diagnosis ID:</span> #{diagnosis.id}
                            <span className="mx-2">•</span>
                            <span className="font-medium">Created:</span> {formatDateShort(diagnosis.created_at)}
                        </div>
                        <div className="flex items-center gap-2">
                            {/*<Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    onOpenChange(false);
                                    navigate(`/doctor/editdiagnosis?patient_regID=${diagnosis.patient?.user?.regID}&diagnosis_id=${diagnosis.id}`);
                                }}
                            >
                                <FileText className="w-4 h-4 mr-1" />
                                Edit
                            </Button>*/}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onOpenChange(false)}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default DiagnosisDetailModal;