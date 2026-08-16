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
import StatusBadge from '@/components/common/StatusBadge';
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
    X,
    Loader2, Edit, Trash2,
} from 'lucide-react';
import { format } from 'date-fns';
import axiosClient from "../../service/axiosClient.js";
import LabTestDetailModal from "../../components/modals/LabTestModal.jsx";
import SaleDetailModal from "../../components/modals/DrugSaleModal.jsx";

const PatientDetailModal = ({ open, onOpenChange, patientRegID }) => {
    const navigate = useNavigate();
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showDrugModal, setShowDrugModal] = useState(false);
    const [showLabTestModal, setShowLabTestModal] = useState(false);
    const [selectedLabTestModal, setSelectedLabTestModal] = useState({});
    const [selectedDrugModal, setSelectedDrugModal] = useState({});

    useEffect(() => {
        if (open && patientRegID) {
            setIsLoading(true);
            axiosClient.get(`/getDoctorPatientByRegNo?regID=${patientRegID}`)
                .then(({ data }) => {
                    setSelectedPatient(data.data);
                    setIsLoading(false);
                })
                .catch((e) => {
                    console.error(e);
                    setIsLoading(false);
                });
        }
    }, [open, patientRegID]);


    const handleSuspension = ()=>{
        if (selectedPatient.user_role == 'admin'){
            alert('you Cannot suspend a fellow administrator')
            return;
        }
        const payload = {
            user_id: selectedPatient.id,
            suspend: selectedPatient.suspend == '0' ? 1 : 0
        }
        console.log(payload)

        axiosClient.post('/updateSuspension',payload)
            .then(({data})=>{
                console.log(data)
                setStaff((prev)=>{
                    return {...prev, suspend: data.data?.suspend}
                })
            })
    }

    const handleDelete = ()=>{
        if (selectedPatient.user_role == 'admin'){
            alert('you Cannot delete a fellow administrator')
            return;
        }
        const payload = {
            user_id: selectedPatient.id,

        }
        console.log(payload)

        axiosClient.post('/deleteUser',payload)
            .then(({data})=>{
                console.log(data)

            })
    }

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return format(new Date(date), 'MMM dd, yyyy');
    };

    const formatDateFull = (date) => {
        if (!date) return 'N/A';
        return format(new Date(date), 'MMM dd, yyyy • h:mm a');
    };

    if (isLoading) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] overflow-hidden p-0">
                    <div className="flex items-center justify-center h-[400px]">
                        <div className="text-center">
                            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                            <p className="text-muted-foreground">Loading patient data...</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    if (!selectedPatient) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] overflow-hidden p-0">
                    <div className="flex items-center justify-center h-[300px]">
                        <div className="text-center">
                            <UserCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <p className="text-lg font-semibold">Patient Not Found</p>
                            <p className="text-sm text-muted-foreground">The patient you're looking for doesn't exist.</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    const patient = selectedPatient;
    const patientDiagnoses = patient?.patient?.diagnosis || [];
    const patientLabTests = patient?.patient?.labtest || [];
    const patientDrugSales = patient?.patient?.sales || [];
    const consultations = patient?.patient?.consultation?.length || 0;
    const labTestsCount = patientLabTests.length;
    const drugsIssued = patientDrugSales.length;
    const diagnosesCount = patientDiagnoses.length;

    const recentDiagnoses = patientDiagnoses.slice(-5).reverse();
    const recentLabTests = patientLabTests.slice(-5).reverse();
    const recentDrugSales = patientDrugSales.slice(-5).reverse();

    // Get patient display name
    const displayName = patient?.name || patient?.patient?.user?.name || 'Unknown Patient';
    const displayRegID = patient?.regID || patient?.patient?.user?.regID || 'N/A';
    const displayEmail = patient?.email || patient?.patient?.user?.email || 'N/A';
    const displayPhone = patient?.phone_no || patient?.patient?.user?.phone_no || 'N/A';

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
                <DialogContent className="!max-w-5xl w-full max-h-[90vh] overflow-hidden p-0 flex flex-col">
                    {/* Header - Fixed */}
                    <DialogHeader className="px-6 py-4 border-b flex-shrink-0 bg-muted/10">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-xl bg-primary/10">
                                    <User className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <DialogTitle className="text-xl font-bold">
                                        Patient Details
                                    </DialogTitle>
                                    <DialogDescription className="text-sm text-muted-foreground mt-1">
                                        {displayName} • {displayRegID}
                                    </DialogDescription>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={()=>{
                                    navigate('/admin/editPatient', { state: { staffData: selectedPatient } })
                                }}>
                                    <Edit className="w-4 h-4 mr-1" />
                                    Edit Details
                                </Button>
                                <Button variant="outline" size="sm" onClick={()=>{handleSuspension()}}>
                                    <Edit className="w-4 h-4 mr-1" />
                                    {selectedPatient?.suspend === '0' ? 'Suspend User' : 'UnSuspend User'}
                                </Button>
                                <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleDelete}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
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

                    {/* Content - Scrollable */}
                    <div className="flex-1 overflow-y-auto px-6 py-4">
                        {/* Patient Profile Card */}
                        <Card className="p-6 mb-6">
                            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                                        {patient?.profile_image ? (
                                            <img
                                                src={patient?.profile_image || patient?.patient?.profile_image}
                                                alt={displayName}
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
                                            <h2 className="text-2xl font-bold">{displayName}</h2>
                                            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                                <User className="w-4 h-4" />
                                                Reg ID: {displayRegID}
                                            </p>
                                            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                                <Mail className="w-4 h-4" />
                                                {displayEmail}
                                            </p>
                                            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                                <Phone className="w-4 h-4" />
                                                {displayPhone}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm flex items-center gap-2">
                                                <span className="font-medium">Blood Group:</span>
                                                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                                                    {patient.patient?.blood_group || 'N/A'}
                                                </span>
                                            </p>
                                            <p className="text-sm flex items-center gap-2 mt-2">
                                                <span className="font-medium">Genotype:</span>
                                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                                    {patient.patient?.genotype || 'N/A'}
                                                </span>
                                            </p>
                                            <p className="text-sm flex items-center gap-2 mt-2">
                                                <span className="font-medium">Insurance:</span>
                                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                                    {patient.patient?.insurance_id || 'None'}
                                                </span>
                                            </p>
                                            <p className="text-sm flex items-center gap-2 mt-2">
                                                <Calendar className="w-4 h-4" />
                                                <span className="font-medium">Joined:</span>
                                                {formatDate(patient.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Emergency Contact */}
                            <div className="mt-4 pt-4 border-t">
                                <h4 className="text-sm font-semibold mb-2">Emergency Contact</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <p><span className="font-medium">Name:</span> {patient.patient?.nos_name || 'N/A'}</p>
                                    <p><span className="font-medium">Phone:</span> {patient.patient?.nos_phone_no || 'N/A'}</p>
                                    <p><span className="font-medium">Address:</span> {patient.patient?.nos_address || 'N/A'}</p>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="mt-4 pt-4 border-t">
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            onOpenChange(false);
                                            navigate(`/doctor/diagnosis/new?patient_regID=${displayRegID}`);
                                        }}
                                    >
                                        <Stethoscope className="w-4 h-4 mr-2" />
                                        New Diagnosis
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            onOpenChange(false);
                                            navigate(`/doctor/diagnosis?patient_id=${displayRegID}`);
                                        }}
                                    >
                                        <FileText className="w-4 h-4 mr-2" />
                                        View All Diagnoses
                                    </Button>
                                </div>
                            </div>
                        </Card>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                            <Card className="p-4 bg-muted/30">
                                <p className="text-xs text-muted-foreground">Diagnoses</p>
                                <p className="text-2xl font-bold">{diagnosesCount}</p>
                            </Card>
                            <Card className="p-4 bg-muted/30">
                                <p className="text-xs text-muted-foreground">Consultations</p>
                                <p className="text-2xl font-bold">{consultations}</p>
                            </Card>
                            <Card className="p-4 bg-muted/30">
                                <p className="text-xs text-muted-foreground">Lab Tests</p>
                                <p className="text-2xl font-bold">{labTestsCount}</p>
                            </Card>
                            <Card className="p-4 bg-muted/30">
                                <p className="text-xs text-muted-foreground">Drugs Issued</p>
                                <p className="text-2xl font-bold">{drugsIssued}</p>
                            </Card>
                        </div>

                        {/* Diagnosis List */}
                        <Card className="p-6 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <FileCheck className="w-5 h-5" />
                                    Diagnosis History
                                </h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        onOpenChange(false);
                                        navigate(`/doctor/diagnosis?patient_id=${displayRegID}`);
                                    }}
                                >
                                    View All <ArrowRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto">
                                {recentDiagnoses.length > 0 ? (
                                    recentDiagnoses.map((diagnosis, index) => (
                                        <div
                                            key={diagnosis.id}
                                            className="flex flex-col p-4 rounded-xl border-2 hover:border-primary/50 bg-card hover:shadow-lg transition-all duration-200 cursor-pointer group"
                                            onClick={() => {
                                                onOpenChange(false);
                                                navigate(`/doctor/diagnosisDetail/${diagnosis.id}`);
                                            }}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                                                        #{index + 1}
                                                    </span>
                                                </div>
                                                <StatusBadge status={diagnosis.ward_status || 'active'} size="sm" />
                                            </div>

                                            <h4 className="font-semibold text-sm line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
                                                {diagnosis.final_diagnosis || diagnosis.initial_diagnosis || 'No diagnosis'}
                                            </h4>

                                            <div className="mt-2 space-y-1 flex-1">
                                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Stethoscope className="w-3 h-3" />
                                                    <span>Dr. {diagnosis.doctor?.user?.name || 'Unknown'}</span>
                                                </p>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDate(diagnosis.created_at)}
                                                </p>
                                            </div>

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
                                                        onOpenChange(false);
                                                        navigate(`/doctor/diagnosisDetail/${diagnosis.id}`);
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
                                        <p className="text-sm text-muted-foreground">No diagnoses found</p>
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
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            onOpenChange(false);
                                            navigate(`/lab/tests?patientId=${patient.id}`);
                                        }}
                                    >
                                        View All <ArrowRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </div>
                                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                                    {recentLabTests.length > 0 ? (
                                        recentLabTests.map(test => (
                                            <div
                                                key={test.id}
                                                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                                                onClick={() => {
                                                    setSelectedLabTestModal(test);
                                                    setShowLabTestModal(true);
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
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            onOpenChange(false);
                                            navigate(`/pharmacy/sales?patientId=${patient.id}`);
                                        }}
                                    >
                                        View All <ArrowRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </div>
                                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                                    {recentDrugSales.length > 0 ? (
                                        recentDrugSales.map(sale => (
                                            <div
                                                key={sale.id}
                                                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                                                onClick={() => {
                                                    setSelectedDrugModal(sale);
                                                    setShowDrugModal(true);
                                                }}
                                            >
                                                <div>
                                                    <p className="text-sm font-medium">Sale #{sale.id}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        ₦{sale.total_amount?.toLocaleString() || 0}
                                                    </p>
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

                    {/* Footer - Fixed */}
                    <div className="px-6 py-3 border-t flex-shrink-0 flex items-center justify-between bg-muted/10">
                        <div className="text-xs text-muted-foreground">
                            <span className="font-medium">Patient ID:</span> {displayRegID}
                            <span className="mx-2">•</span>
                            <span className="font-medium">Joined:</span> {formatDate(patient.created_at)}
                        </div>
                        <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default PatientDetailModal;