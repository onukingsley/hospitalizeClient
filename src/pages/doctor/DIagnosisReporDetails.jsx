import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
    User,
    FileText,
    Calendar,
    UserCircle,
    Stethoscope,
    FileCheck,
    Eye,
    ArrowRight,
    HeartPulse,
    ClipboardList,
    FilePlus,
    MessageSquare,
    FileSignature,
    Plus,
    AlertCircle,
    CheckCircle2,
    Clock as ClockIcon,
    Save,
    X,
    Printer,
    Download,
    Trash2, FlaskRound, Pill,
} from 'lucide-react';
import axiosClient from '../../service/axiosClient.js';
import { selectedStore } from '../../store/store.jsx';
import DrugDetailModal from "../../components/modals/DrugSaleModal.jsx";
import SaleDetailModal from "../../components/modals/DrugSaleModal.jsx";
import LabTestDetailModal from "../../components/modals/LabTestModal.jsx";

const DiagnosisReportPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const { setSelectedPatient } = selectedStore();

    const [diagnosis, setDiagnosis] = useState(null);
    const [report, setReports] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingReport, setEditingReport] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showDrugModal, setShowDrugModal] = useState(false);
    const [showLabTestModal, setShowLabTestModal] = useState(false);
    const [seletedLabTestModal, setSelectedLabTestModal] = useState({});
    const [seletedDrugModal, setSelectedDrugModal] = useState({});


    // Form state
    const [formData, setFormData] = useState({
        diagnosis_id: id || searchParams.get('diagnosis_id'),
        diagnosis_report: '',
        user_id: '',
    });

    // Fetch diagnosis data
    useEffect(() => {
        const diagnosisId = id || searchParams.get('diagnosisReport_id');
        if (!diagnosisId) {
            toast.error('No diagnosis ID provided');
            navigate('/doctor/diagnosis');
            return;
        }

        setIsLoading(true);
        axiosClient
            .get(`/getDoctorsPatientDiagnosisReport?diagnosisReport_id=${diagnosisId}`)
            .then(({ data }) => {
                setDiagnosis(data.data['diagnosis']);
                setReports(data.data );
                console.log(data.data)
                setFormData(prev => ({
                    ...prev,
                    diagnosis_id: diagnosisId,
                    user_id: data.data.doctor?.user_id || ''
                }));
                setIsLoading(false);
            })
            .catch((e) => {
                console.error('Error fetching diagnosis:', e);
                toast.error('Failed to load diagnosis data');
                setIsLoading(false);
            });
    }, [id, searchParams, navigate]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle add/edit report
    const handleSubmitReport = async () => {
        if (!formData.diagnosis_report.trim()) {
            toast.error('Please enter a diagnosis report');
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                diagnosis_id: formData.diagnosis_id,
                diagnosis_report: formData.diagnosis_report,
                user_id: formData.user_id,
            };

            let response;
            if (isEditing && editingReport) {
                // Update existing report
                response = await axiosClient.put(
                    `/update-diagnosis-report/${editingReport.id}`,
                    payload
                );
                toast.success('Diagnosis report updated successfully');
            } else {
                // Create new report
                response = await axiosClient.post('/add-diagnosis-report', payload);
                toast.success('Diagnosis report added successfully');
            }

            // Refresh reports
            const updatedDiagnosis = await axiosClient.get(
                `/getDoctorsPatientDiagnosis?diagnosis_id=${formData.diagnosis_id}`
            );
            setReports(updatedDiagnosis.data.data.diagnosis_report || []);

            // Reset form
            setFormData(prev => ({
                ...prev,
                diagnosis_report: ''
            }));
            setIsEditing(false);
            setEditingReport(null);
            setShowAddForm(false);
        } catch (error) {
            console.error('Error saving report:', error);
            toast.error(error.response?.data?.message || 'Failed to save report');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle edit button click
    const handleEditReport = (report) => {
        setEditingReport(report);
        setFormData(prev => ({
            ...prev,
            diagnosis_report: report.diagnosis_report,
        }));
        setIsEditing(true);
        setShowAddForm(true);
    };

    // Handle delete report
    const handleDeleteReport = async (reportId) => {
        if (!window.confirm('Are you sure you want to delete this report?')) return;

        try {
            await axiosClient.delete(`/delete-diagnosis-report/${reportId}`);
            toast.success('Report deleted successfully');
            setReports(reports.filter(r => r.id !== reportId));
        } catch (error) {
            console.error('Error deleting report:', error);
            toast.error('Failed to delete report');
        }
    };

    // Handle cancel edit
    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditingReport(null);
        setFormData(prev => ({
            ...prev,
            diagnosis_report: ''
        }));
        setShowAddForm(false);
    };

    // Format date
    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Handle print
    const handlePrint = () => {
        window.print();
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">Loading Diagnosis Data</h3>
                    <p className="text-sm text-muted-foreground">Please wait while we load the diagnosis reports...</p>
                </div>
            </div>
        );
    }

    // No diagnosis found
    if (!diagnosis) {
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

    return (
        <div className="space-y-6">
            {/* Page Header */}

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

            <PageHeader
                title="Detailed Diagnosis Reports"
                subtitle={`${diagnosis.final_diagnosis || diagnosis.initial_diagnosis || 'No diagnosis'} - ${diagnosis.patient?.user?.name || 'Unknown Patient'}`}
                actions={
                    <div className="flex gap-2 flex-wrap">
                     {/*   <Button variant="outline" onClick={handlePrint}>
                            <Printer className="w-4 h-4 mr-2" />
                            Print
                        </Button>*/}
                        <Button variant="outline" onClick={() => navigate(`/doctor/diagnosisDetail/${diagnosis.id}`)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Diagnosis
                        </Button>
                        {!showAddForm && (
                           /* <Button onClick={() => setShowAddForm(true)}>*/
                            <Button
                                onClick={() => navigate(`/doctor/editdiagnosisReport?patient_regID=${diagnosis?.patient?.user?.regID}&diagnosisReport_id=${ searchParams.get('diagnosisReport_id')}`)}
                            >
                                <FilePlus className="w-4 h-4 mr-2" />
                                Edit Report
                            </Button>
                        )}
                    </div>
                }
            />

            {/* Patient Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
               {/* <StatCard
                    title="Total Reports"
                    value={reports.length}
                    icon={<FileSignature className="w-5 h-5" />}
                    color="bg-blue-500"
                />*/}
                <StatCard
                    title="Patient"
                    value={diagnosis.patient?.user?.name || 'N/A'}
                    icon={<User className="w-5 h-5" />}
                    color="bg-green-500"
                />
                <StatCard
                    title="Diagnosis"
                    value={diagnosis.final_diagnosis || diagnosis.initial_diagnosis || 'N/A'}
                    icon={<Stethoscope className="w-5 h-5" />}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Doctor"
                    value={report?.user?.name || 'N/A'}
                    icon={<UserCircle className="w-5 h-5" />}
                    color="bg-orange-500"
                />
            </div>

            {/* Add/Edit Report Form */}
            {showAddForm && (
                <Card className="p-6 border-2 border-primary/20 bg-primary/5">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <FilePlus className="w-5 h-5 text-primary" />
                                {isEditing ? 'Edit Diagnosis Report' : 'Add New Diagnosis Report'}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {isEditing
                                    ? 'Update the diagnosis report content below'
                                    : 'Document your clinical findings and observations'}
                            </p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                            <X className="w-4 h-4 mr-1" />
                            Cancel
                        </Button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <Label className="text-sm font-medium flex items-center gap-2">
                                Diagnosis Report <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                name="diagnosis_report"
                                value={formData.diagnosis_report}
                                onChange={handleInputChange}
                                placeholder="Enter your diagnosis report, clinical findings, observations, and recommendations..."
                                className="mt-1.5 min-h-[200px]"
                                required
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                {formData.diagnosis_report.length} characters
                            </p>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={handleCancelEdit}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmitReport}
                                disabled={isSubmitting || !formData.diagnosis_report.trim()}
                                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                        {isEditing ? 'Updating...' : 'Saving...'}
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        {isEditing ? 'Update Report' : 'Save Report'}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {/* Reports List */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <FileSignature className="w-5 h-5" />
                             Diagnosis Reports Detail
                        </h3>

                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/doctor/diagnosis/${diagnosis.id}`)}
                        >
                            <ArrowRight className="w-4 h-4 ml-1" />
                            Back to Diagnosis
                        </Button>
                    </div>
                </div>

                {report ? (
                    <div className="space-y-4">
                        <div
                            key={report.id}
                            className={`p-4 border rounded-lg transition-colors border-primary/50 bg-primary/5`
                            }
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium">Report #{report.id}</span>

                                    </div>
                                   {/* <StatusBadge status="completed" size="sm" />*/}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
                            <Card className="p-6">
                                Diagnosis Report
                            <div className="bg-muted/30 rounded-lg p-4">
                                <p className="text-md leading-relaxed whitespace-pre-wrap">
                                    {report.diagnosis_report}
                                </p>
                            </div>
                                </Card>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Lab Tests */}
                                <Card className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                            <FlaskRound className="w-5 h-5" />
                                            Lab Tests ({report?.lab_test?.length})
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
                                        {report?.lab_test?.length > 0 ? (
                                            report?.lab_test?.map(test => (
                                                <div
                                                    key={test.id}
                                                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition-colors cursor-pointer"
                                                    //onClick={() => navigate(`/lab/tests/${test.id}`)}
                                                    onClick={() => {
                                                        console.log(test)
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
                                            Drug Sales ({report?.sales?.length})
                                        </h3>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => navigate(`/pharmacy/sales?diagnosisId=${diagnosis.id}`)}
                                        >
                                            View All <ArrowRight className="w-4 h-4 ml-1" />
                                        </Button>
                                    </div>
                                    <div className="space-y-3 max-h-[300px] overflow-y-auto scrollbar-thin">
                                        {report?.sales?.length > 0 ? (
                                            report?.sales?.map(sale => (
                                                <div
                                                    key={sale.id}
                                                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition-colors cursor-pointer"
                                                    //onClick={() => navigate(`/pharmacy/sales/${sale.id}`)}
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

                            <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <ClockIcon className="w-3 h-3" />
                                                Created: {formatDate(report.created_at)}
                                            </span>
                                    {report.updated_at !== report.created_at && (
                                        <span className="flex items-center gap-1">
                                                    <ClockIcon className="w-3 h-3" />
                                                    Updated: {formatDate(report.updated_at)}
                                                </span>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="hover:bg-blue-100"
                                        // onClick={() => handleEditReport(report)}
                                        onClick={() => navigate(`/doctor/editdiagnosisReport?patient_regID=${diagnosis?.patient?.user?.regID}&diagnosisReport_id=${report.id}`)}
                                    >
                                        <FileText className="w-4 h-4" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="hover:bg-blue-100"
                                        onClick={() => {
                                            navigator.clipboard.writeText(report.diagnosis_report);
                                            toast.success('Report copied to clipboard');
                                        }}
                                    >
                                        <FileCheck className="w-4 h-4" />
                                        Copy
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="hover:bg-red-100 text-red-500 hover:text-red-600"
                                        onClick={() => handleDeleteReport(report.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <FileSignature className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-sm font-medium text-muted-foreground">No diagnosis reports available</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Add a report to document the diagnosis
                        </p>
                        <Button
                            className="mt-4"
                            onClick={() => setShowAddForm(true)}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add First Report
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default DiagnosisReportPage;