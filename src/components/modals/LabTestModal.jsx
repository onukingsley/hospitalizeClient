import React, { useState, useEffect } from 'react';
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
import {
    FlaskConical,
    User,
    Stethoscope,
    Microscope,
    AlertCircle,
    Printer,
    X,
    Receipt,
    FileText,
    Clock,
    DollarSign,
    CheckCircle,
    XCircle,
    Calendar,
    FileCheck,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const LabTestDetailModal = ({ open, onOpenChange, labTestId, selectedLab }) => {
    const [labTest, setLabTest] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Mock data - replace with API call
    useEffect(() => {
        if (open && labTestId) {
            setIsLoading(true);
            setTimeout(() => {
                setLabTest(selectedLab);
                setIsLoading(false);
            }, 800);
        }
    }, [open, labTestId]);

    const getPaymentStatusColor = (status) => {
        return status === 'paid'
            ? 'bg-green-100 text-green-700 border-green-200'
            : 'bg-yellow-100 text-yellow-700 border-yellow-200';
    };

    const getProgressStatusColor = (status) => {
        const colors = {
            completed: 'bg-green-100 text-green-700 border-green-200',
            inProgress: 'bg-blue-100 text-blue-700 border-blue-200',
            undone: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        };
        return colors[status] || 'bg-yellow-100 text-yellow-700 border-yellow-200';
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return format(new Date(date), 'MMM dd, yyyy • h:mm a');
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
                            <p className="text-muted-foreground">Loading lab test details...</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    if (!labTest) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] overflow-hidden p-0">
                    <div className="flex items-center justify-center h-[300px]">
                        <div className="text-center">
                            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <p className="text-lg font-semibold">Lab Test Not Found</p>
                            <p className="text-sm text-muted-foreground">The lab test you're looking for doesn't exist.</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-5xl w-full max-h-[90vh] overflow-hidden p-0 flex flex-col">
                {/* Header - Fixed */}
                <div className="px-6 py-4 border-b flex-shrink-0 bg-muted/10">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-primary/10">
                                <FlaskConical className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Lab Test Details</h2>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {labTest.lab_test_name} • {formatDate(labTest.created_at)}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                                <Printer className="w-4 h-4 mr-1" />
                                Print
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
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                        <Card className="p-4 bg-muted/30">
                            <p className="text-xs text-muted-foreground">Test Name</p>
                            <p className="text-sm font-medium truncate">{labTest.lab_test_name}</p>
                        </Card>
                        <Card className="p-4 bg-muted/30">
                            <p className="text-xs text-muted-foreground">Amount</p>
                            <p className="text-xl font-bold text-primary">{formatCurrency(labTest.lab_test_amount)}</p>
                        </Card>
                        <Card className="p-4 bg-muted/30">
                            <p className="text-xs text-muted-foreground">Payment Status</p>
                            <Badge className={cn("mt-1 text-xs", getPaymentStatusColor(labTest.lab_test_payment_status))}>
                                {labTest.lab_test_payment_status}
                            </Badge>
                        </Card>
                        <Card className="p-4 bg-muted/30">
                            <p className="text-xs text-muted-foreground">Progress Status</p>
                            <Badge className={cn("mt-1 text-xs", getProgressStatusColor(labTest.lab_test_progress_status))}>
                                {labTest.lab_test_progress_status}
                            </Badge>
                        </Card>
                    </div>

                    {/* People Involved */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {/* Lab Scientist */}
                        <Card className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <Microscope className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Lab Scientist</p>
                                    <p className="font-medium">{labTest.lab_scientist?.user?.name || 'N/A'}</p>
                                    <p className="text-xs text-muted-foreground">{labTest.lab_scientist?.user?.regID || 'N/A'}</p>
                                    {labTest.lab_scientist?.specialization && (
                                        <p className="text-xs text-muted-foreground">{labTest.lab_scientist.specialization}</p>
                                    )}
                                </div>
                            </div>
                        </Card>

                        {/* Doctor */}
                        <Card className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                    <Stethoscope className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Referred By</p>
                                    <p className="font-medium">{labTest.doctor?.user?.name || 'N/A'}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {labTest.doctor?.specialization || 'N/A'}
                                    </p>
                                    {labTest.doctor?.license_id && (
                                        <p className="text-xs text-muted-foreground">License: {labTest.doctor.license_id}</p>
                                    )}
                                </div>
                            </div>
                        </Card>

                        {/* Patient */}
                        <Card className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                    <User className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Patient</p>
                                    <p className="font-medium">{labTest.patient?.user?.name || 'N/A'}</p>
                                    <p className="text-xs text-muted-foreground">{labTest.patient?.user?.regID || 'N/A'}</p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {labTest.patient?.blood_group && (
                                            <Badge variant="outline" className="text-[10px] bg-red-50">
                                                Blood: {labTest.patient.blood_group}
                                            </Badge>
                                        )}
                                        {labTest.patient?.genotype && (
                                            <Badge variant="outline" className="text-[10px] bg-blue-50">
                                                Genotype: {labTest.patient.genotype}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Diagnosis */}
                    {labTest.diagnosis && (
                        <Card className="p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Related Diagnosis</p>
                                    <p className="font-medium">
                                        {labTest.diagnosis.final_diagnosis || labTest.diagnosis.initial_diagnosis || 'N/A'}
                                    </p>
                                    {labTest.diagnosis.initial_diagnosis && labTest.diagnosis.initial_diagnosis !== labTest.diagnosis.final_diagnosis && (
                                        <p className="text-xs text-muted-foreground">
                                            Initial: {labTest.diagnosis.initial_diagnosis}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Test Details */}
                    <Card className="p-4 mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <FileCheck className="w-4 h-4 text-primary" />
                            <h4 className="font-medium">Test Details</h4>
                        </div>
                        <div className="space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-muted/30">
                                <div>
                                    <p className="text-xs text-muted-foreground">Test Name</p>
                                    <p className="font-medium">{labTest.lab_test_name}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-muted-foreground">Amount</p>
                                    <p className="font-semibold">{formatCurrency(labTest.lab_test_amount)}</p>
                                </div>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/30">
                                <p className="text-xs text-muted-foreground">Description</p>
                                <p className="text-sm">{labTest.lab_test_description}</p>
                            </div>
                        </div>
                    </Card>

                    {/* Result */}
                    <Card className="p-4 mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <FileText className="w-4 h-4 text-primary" />
                            <h4 className="font-medium">Test Result</h4>
                            {labTest.lab_test_result && (
                                <Badge className="text-xs bg-green-100 text-green-700 border-green-200 ml-auto">
                                    Completed
                                </Badge>
                            )}
                        </div>
                        {labTest.lab_test_result ? (
                            <div className="p-3 rounded-lg bg-muted/30">
                                <p className="text-sm whitespace-pre-wrap">{labTest.lab_test_result}</p>
                                {labTest.lab_test_result_image && (
                                    <div className="mt-3">
                                        <Button variant="outline" size="sm">
                                            <FileText className="w-4 h-4 mr-1" />
                                            View Attached Image
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-700">
                                <p className="text-sm">Result not yet available</p>
                                <p className="text-xs mt-1">Test is currently {labTest.lab_test_progress_status}</p>
                            </div>
                        )}
                    </Card>

                    {/* Rates */}
                    {labTest.rates && labTest.rates.length > 0 && (
                        <Card className="p-4 mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <DollarSign className="w-4 h-4 text-primary" />
                                <h4 className="font-medium">Rate Details</h4>
                            </div>
                            <div className="space-y-2">
                                {labTest.rates.map((rate) => (
                                    <div key={rate.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                        <div>
                                            <p className="font-medium">{rate.title}</p>
                                            {rate.pivot?.remark && (
                                                <p className="text-xs text-muted-foreground">{rate.pivot.remark}</p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold">{formatCurrency(rate.pivot?.amount || rate.amount)}</p>
                                            <Badge className={cn("text-xs", getProgressStatusColor(rate.pivot?.status || 'pending'))}>
                                                {rate.pivot?.status || 'pending'}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    {/* Payment Info */}
                    {labTest.payment && (
                        <Card className="p-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs text-muted-foreground">Payment Information</p>
                                    <p className="font-medium">Invoice: {labTest.payment.invoice_id}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDate(labTest.payment.created_at)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge className={cn("text-xs", getPaymentStatusColor(labTest.lab_test_payment_status))}>
                                        {labTest.lab_test_payment_status}
                                    </Badge>
                                    <p className="text-lg font-bold">{formatCurrency(labTest.payment.amount)}</p>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>

                {/* Footer - Fixed */}
                <div className="px-6 py-3 border-t flex-shrink-0 flex items-center justify-between bg-muted/10">
                    <div className="text-xs text-muted-foreground">
                        <span className="font-medium">Test ID:</span> #{labTest.id}
                        <span className="mx-2">•</span>
                        <span className="font-medium">Created:</span> {formatDate(labTest.created_at)}
                        {labTest.updated_at !== labTest.created_at && (
                            <>
                                <span className="mx-2">•</span>
                                <span className="font-medium">Updated:</span> {formatDate(labTest.updated_at)}
                            </>
                        )}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default LabTestDetailModal;