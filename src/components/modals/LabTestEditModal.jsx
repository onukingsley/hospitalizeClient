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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
    Save,
    Edit,
    Upload,
    Image,
    Trash2,
    Plus,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const LabTestEditModal = ({ open, onOpenChange, labTestId, selectedLab, onSave }) => {
    const [labTest, setLabTest] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        lab_test_name: '',
        lab_test_description: '',
        lab_test_amount: '',
        lab_test_payment_status: 'unpaid',
        lab_test_progress_status: 'undone',
        lab_test_result: '',
        lab_scientist_id: '',
        doctor_id: '',
        patient_id: '',
        diagnosis_id: '',
        rates: [],
    });

    // Mock data - replace with API call
    useEffect(() => {
        if (open && labTestId) {
            setIsLoading(true);
            setTimeout(() => {
                const data = selectedLab || {
                    id: labTestId,
                    lab_test_name: 'Complete Blood Count',
                    lab_test_description: 'Full blood analysis including WBC, RBC, Hemoglobin, Platelets, and Differential',
                    lab_test_amount: '5000',
                    lab_test_payment_status: 'paid',
                    lab_test_progress_status: 'completed',
                    lab_test_result: 'Hemoglobin: 13.2 g/dL, WBC: 7,500/µL, Platelets: 250,000/µL, RBC: 4.8M/µL. All parameters within normal range.',
                    lab_scientist_id: 1,
                    doctor_id: 1,
                    patient_id: 1,
                    diagnosis_id: 1,
                    rates: [
                        {
                            id: 1,
                            title: 'CBC - Complete Blood Count',
                            amount: '5000',
                            pivot: {
                                remark: 'Results pending',
                                amount: '5000',
                                status: 'completed',
                            }
                        }
                    ],
                    payment: {
                        id: 1,
                        invoice_id: 'INV-2026-001',
                        amount: '5000',
                        status: 'credit',
                        created_at: '2026-06-14T11:30:00.000000Z',
                    }
                };
                setLabTest(data);
                setFormData({
                    lab_test_name: data.lab_test_name || '',
                    lab_test_description: data.lab_test_description || '',
                    lab_test_amount: data.lab_test_amount || '',
                    lab_test_payment_status: data.lab_test_payment_status || 'unpaid',
                    lab_test_progress_status: data.lab_test_progress_status || 'undone',
                    lab_test_result: data.lab_test_result || '',
                    lab_scientist_id: data.lab_scientist_id || '',
                    doctor_id: data.doctor_id || '',
                    patient_id: data.patient_id || '',
                    diagnosis_id: data.diagnosis_id || '',
                    rates: data.rates || [],
                });
                setIsLoading(false);
            }, 600);
        }
    }, [open, labTestId, selectedLab]);

    const getProgressStatusColor = (status) => {
        const colors = {
            completed: 'bg-green-100 text-green-700 border-green-200',
            inProgress: 'bg-blue-100 text-blue-700 border-blue-200',
            undone: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        };
        return colors[status] || 'bg-yellow-100 text-yellow-700 border-yellow-200';
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleRateChange = (index, field, value) => {
        const updatedRates = [...formData.rates];
        updatedRates[index] = {
            ...updatedRates[index],
            [field]: value,
        };
        setFormData(prev => ({ ...prev, rates: updatedRates }));
    };

    const handlePivotChange = (index, field, value) => {
        const updatedRates = [...formData.rates];
        updatedRates[index] = {
            ...updatedRates[index], ['pivot']: {...updatedRates[index]['pivot'], [field]:value}
        };
        setFormData(prev => ({ ...prev, rates: updatedRates }));
    };

    const handleAddRate = () => {
        setFormData(prev => ({
            ...prev,
            rates: [
                ...prev.rates,
                {
                    id: Date.now(),
                    title: '',
                    amount: '',
                    pivot: {
                        remark: '',
                        amount: '',
                        status: 'pending',
                    }
                }
            ]
        }));
    };

    const handleRemoveRate = (index) => {
        const updatedRates = formData.rates.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, rates: updatedRates }));
    };

    const handleSave = () => {
        // Validate required fields
        if (!formData.lab_test_name) {
            toast.error('Please enter a test name');
            return;
        }
        if (!formData.lab_test_amount) {
            toast.error('Please enter the test amount');
            return;
        }

        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            const updatedData = {
                ...labTest,
                ...formData,
                updated_at: new Date().toISOString(),
            };
            const payload = {
                ...formData,
                lab_test_id: labTest.id,

            }
            console.log([payload])
            if (onSave) {
                onSave(payload);
            }


            toast.success('Lab test updated successfully');
            setIsSaving(false);
            onOpenChange(false);
        }, 1000);
    };

    if (isLoading) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-hidden p-0">
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
                <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-hidden p-0">
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
            <DialogContent className="!max-w-4xl w-full max-h-[90vh] overflow-hidden p-0 flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b flex-shrink-0 bg-muted/10">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-primary/10">
                                <Edit className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Edit Lab Test</h2>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {labTest.lab_test_name} • ID: #{labTest.id}
                                </p>
                            </div>
                        </div>
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

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                            <Card className="p-4">
                                <h4 className="font-medium mb-4">Basic Information</h4>
                                <div className="space-y-3">
                                    <div>
                                        <Label className="text-sm font-medium">Test Name *</Label>
                                        <Input
                                            value={formData.lab_test_name}
                                            onChange={(e) => handleInputChange('lab_test_name', e.target.value)}
                                            placeholder="Enter test name"
                                            className="mt-1.5"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium">Description</Label>
                                        <Textarea
                                            value={formData.lab_test_description}
                                            onChange={(e) => handleInputChange('lab_test_description', e.target.value)}
                                            placeholder="Enter test description"
                                            className="mt-1.5 min-h-[80px]"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium">Amount *</Label>
                                        <Input
                                            type="number"
                                            value={formData.lab_test_amount}
                                            onChange={(e) => handleInputChange('lab_test_amount', e.target.value)}
                                            placeholder="Enter amount"
                                            className="mt-1.5"
                                        />
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-4">
                                <h4 className="font-medium mb-4">Status Information</h4>
                                <div className="space-y-3">
                                    <div>
                                        <Label className="text-sm font-medium">Payment Status</Label>
                                        <Select
                                            value={formData.lab_test_payment_status}
                                            onValueChange={(value) => handleInputChange('lab_test_payment_status', value)}
                                        >
                                            <SelectTrigger className="mt-1.5">
                                                <SelectValue placeholder="Select payment status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="paid">Paid</SelectItem>
                                                <SelectItem value="unpaid">Unpaid</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium">Progress Status</Label>
                                        <Select
                                            value={formData.lab_test_progress_status}
                                            onValueChange={(value) => handleInputChange('lab_test_progress_status', value)}
                                        >
                                            <SelectTrigger className="mt-1.5">
                                                <SelectValue placeholder="Select progress status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="undone">Undone</SelectItem>
                                                <SelectItem value="inProgress">In Progress</SelectItem>
                                                <SelectItem value="completed">Completed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                            <Card className="p-4">
                                <h4 className="font-medium mb-4">Result</h4>
                                <div>
                                    <Label className="text-sm font-medium">Test Result</Label>
                                    <Textarea
                                        value={formData.lab_test_result}
                                        onChange={(e) => handleInputChange('lab_test_result', e.target.value)}
                                        placeholder="Enter test result..."
                                        className="mt-1.5 min-h-[150px]"
                                    />
                                </div>
                                <div className="mt-3">
                                    <Button variant="outline" size="sm" className="w-full">
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload Result Image
                                    </Button>
                                    <p className="text-xs text-muted-foreground mt-1">Supported: JPG, PNG, PDF (max 5MB)</p>
                                </div>
                            </Card>

                            <Card className="p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-medium">Rates</h4>
                                    <Button variant="outline" size="sm" onClick={handleAddRate}>
                                        <Plus className="w-4 h-4 mr-1" />
                                        Add Rate
                                    </Button>
                                </div>
                                <div className="space-y-3 max-h-[200px] overflow-y-auto">
                                    {formData.rates.map((rate, index) => (
                                        <div key={index} className="p-3 rounded-lg bg-muted/30 border">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 space-y-2">
                                                    <Input
                                                        value={rate.title || ''}
                                                        onChange={(e) => handleRateChange(index, 'title', e.target.value)}
                                                        disabled={true}
                                                        placeholder="Rate title"
                                                        className="h-8 text-sm"
                                                    />
                                                    <div className="flex gap-2">
                                                        <Input
                                                            type="number"
                                                            value={rate.pivot?.amount || rate.amount || ''}
                                                            onChange={(e) => handlePivotChange(index, 'amount', e.target.value)}
                                                            disabled={true}
                                                            placeholder="Amount"
                                                            className="h-8 text-sm flex-1"
                                                        />
                                                        <Select
                                                            value={rate.pivot?.status || 'pending'}
                                                            onValueChange={(value) => handlePivotChange(index, 'status', value)}
                                                        >
                                                            <SelectTrigger className="h-8 text-sm w-[120px]">
                                                                <SelectValue placeholder="Status" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="undone">Undone</SelectItem>
                                                                <SelectItem value="inProgress">In Progress</SelectItem>
                                                                <SelectItem value="completed">Completed</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <Input
                                                        value={rate.pivot?.remark || ''}
                                                        onChange={(e) => handlePivotChange(index, 'remark', e.target.value)}
                                                        placeholder="Remark"
                                                        className="h-8 text-sm"
                                                    />
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-500 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
                                                    onClick={() => handleRemoveRate(index)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    {formData.rates.length === 0 && (
                                        <p className="text-center text-sm text-muted-foreground py-4">No rates added</p>
                                    )}
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-3 border-t flex-shrink-0 flex items-center justify-between bg-muted/10">
                    <div className="text-xs text-muted-foreground">
                        <span className="font-medium">Last updated:</span> {format(new Date(), 'MMM dd, yyyy • h:mm a')}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                        >
                            {isSaving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default LabTestEditModal;