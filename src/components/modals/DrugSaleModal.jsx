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
    Pill,
    User,
    Stethoscope,
    Package,
    AlertCircle,
    Printer,
    X,
    Receipt,
    FileText,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const SaleDetailModal = ({ open, onOpenChange, saleId, saleSelect }) => {
    const [sale, setSale] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Mock data - replace with API call
    useEffect(() => {
        if (open && saleId) {
            setIsLoading(true);
            setTimeout(() => {
                setSale(saleSelect);
              /*  setSale({
                    id: saleId,
                    total_amount: '15000',
                    payment_status: 'paid',
                    delivery_status: 'delivered',
                    created_at: '2026-06-14T11:06:47.000000Z',
                    pharmasist: {
                        id: 1,
                        user: {
                            name: 'Dr. James Wilson',
                            regID: 'PHA001',
                        }
                    },
                    doctor: {
                        id: 1,
                        user: {
                            name: 'Dr. Sarah Johnson',
                            regID: 'DOC001',
                        },
                        specialization: 'Cardiology'
                    },
                    patient: {
                        id: 1,
                        user: {
                            name: 'John Doe',
                            regID: 'PAT001',
                        }
                    },
                    drug_stock: [
                        {
                            id: 1,
                            name: 'Amoxicillin',
                            generic: 'Amoxicillin Trihydrate',
                            pivot: {
                                quantity: '2',
                                dosage: '500mg',
                                duration: '5 days',
                                route: 'oral',
                                instruction: 'Take after meals',
                                unit_price: '1500',
                            }
                        },
                        {
                            id: 2,
                            name: 'Paracetamol',
                            generic: 'Acetaminophen',
                            pivot: {
                                quantity: '4',
                                dosage: '500mg',
                                duration: '3 days',
                                route: 'oral',
                                instruction: 'Take when needed',
                                unit_price: '500',
                            }
                        },
                        {
                            id: 3,
                            name: 'Vitamin C',
                            generic: 'Ascorbic Acid',
                            pivot: {
                                quantity: '2',
                                dosage: '1000mg',
                                duration: '7 days',
                                route: 'oral',
                                instruction: 'Take once daily',
                                unit_price: '800',
                            }
                        }
                    ],
                    diagnosis: {
                        id: 1,
                        final_diagnosis: 'Stable angina',
                    },
                    payment: {
                        id: 1,
                        invoice_id: 'INV-2026-001',
                        amount: '15000',
                        created_at: '2026-06-14T11:30:00.000000Z',
                    }
                });*/
                setIsLoading(false);
            }, 800);
        }
    }, [open, saleId]);

    const getPaymentStatusColor = (status) => {
        return status === 'paid'
            ? 'bg-green-100 text-green-700 border-green-200'
            : 'bg-yellow-100 text-yellow-700 border-yellow-200';
    };

    const getDeliveryStatusColor = (status) => {
        const colors = {
            delivered: 'bg-green-100 text-green-700 border-green-200',
            issued: 'bg-blue-100 text-blue-700 border-blue-200',
            unissued: 'bg-yellow-100 text-yellow-700 border-yellow-200',
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
                            <p className="text-muted-foreground">Loading sale details...</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    if (!sale) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] overflow-hidden p-0">
                    <div className="flex items-center justify-center h-[300px]">
                        <div className="text-center">
                            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <p className="text-lg font-semibold">Sale Not Found</p>
                            <p className="text-sm text-muted-foreground">The sale you're looking for doesn't exist.</p>
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
                                <Receipt className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Sale Details</h2>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Sale #{sale.id} • {formatDate(sale.created_at)}
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
                            <p className="text-xs text-muted-foreground">Total Amount</p>
                            <p className="text-xl font-bold text-primary">{formatCurrency(sale.total_amount)}</p>
                        </Card>
                        <Card className="p-4 bg-muted/30">
                            <p className="text-xs text-muted-foreground">Payment Status</p>
                            <Badge className={cn("mt-1 text-xs", getPaymentStatusColor(sale.payment_status))}>
                                {sale.payment_status}
                            </Badge>
                        </Card>
                        <Card className="p-4 bg-muted/30">
                            <p className="text-xs text-muted-foreground">Delivery Status</p>
                            <Badge className={cn("mt-1 text-xs", getDeliveryStatusColor(sale.delivery_status))}>
                                {sale.delivery_status}
                            </Badge>
                        </Card>
                        <Card className="p-4 bg-muted/30">
                            <p className="text-xs text-muted-foreground">Items</p>
                            <p className="text-xl font-bold">{sale.drug_stock?.length || 0}</p>
                        </Card>
                    </div>

                    {/* People Involved */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {/* Pharmacist */}
                        <Card className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <Pill className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Dispensed By</p>
                                    <p className="font-medium">{sale.pharmasist?.user?.name || 'N/A'}</p>
                                    <p className="text-xs text-muted-foreground">{sale.pharmasist?.user?.regID || 'N/A'}</p>
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
                                    <p className="text-xs text-muted-foreground">Prescribed By</p>
                                    <p className="font-medium">{sale.doctor?.user?.name || 'N/A'}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {sale.doctor?.specialization || 'N/A'}
                                    </p>
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
                                    <p className="font-medium">{sale.patient?.user?.name || 'N/A'}</p>
                                    <p className="text-xs text-muted-foreground">{sale.patient?.user?.regID || 'N/A'}</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Diagnosis */}
                    {sale.diagnosis && (
                        <Card className="p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Diagnosis</p>
                                    <p className="font-medium">
                                        {sale.diagnosis.final_diagnosis || sale.diagnosis.initial_diagnosis || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Drugs List */}
                    <Card className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium flex items-center gap-2">
                                <Package className="w-4 h-4" />
                                Prescribed Drugs
                            </h4>
                            <span className="text-sm text-muted-foreground">
                                {sale.drug_stock?.length || 0} item{sale.drug_stock?.length > 1 ? 's' : ''}
                            </span>
                        </div>

                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                            {sale.drug_stock?.map((drug) => (
                                <div key={drug.id} className="p-3 rounded-lg bg-muted/30">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <Pill className="w-4 h-4 text-muted-foreground" />
                                                <p className="font-medium">{drug.name}</p>
                                                <Badge variant="outline" className="text-xs">
                                                    {drug.pivot?.dosage || 'N/A'}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">{drug.generic}</p>
                                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                                                <span><span className="font-medium">Qty:</span> {drug.pivot?.quantity || 0}</span>
                                                <span><span className="font-medium">Duration:</span> {drug.pivot?.duration || 'N/A'}</span>
                                                <span><span className="font-medium">Route:</span> {drug.pivot?.route || 'N/A'}</span>
                                            </div>
                                            {drug.pivot?.instruction && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    <span className="font-medium">Instruction:</span> {drug.pivot.instruction}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold">
                                                {formatCurrency(drug.pivot?.unit_price || 0)}
                                            </p>
                                            <p className="text-xs text-muted-foreground">per unit</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Separator className="my-4" />
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">Total</p>
                            <p className="text-xl font-bold text-primary">
                                {formatCurrency(sale.total_amount)}
                            </p>
                        </div>
                    </Card>

                    {/* Payment Info */}
                    {sale.payment && (
                        <Card className="p-4 mt-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs text-muted-foreground">Payment Information</p>
                                    <p className="font-medium">Invoice: {sale.payment.invoice_id}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDate(sale.payment.created_at)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge className={cn("text-xs", getPaymentStatusColor(sale.payment_status))}>
                                        {sale.payment_status}
                                    </Badge>
                                    <p className="text-lg font-bold">{formatCurrency(sale.payment.amount)}</p>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>

                {/* Footer - Fixed */}
                <div className="px-6 py-3 border-t flex-shrink-0 flex items-center justify-between bg-muted/10">
                    <div className="text-xs text-muted-foreground">
                        <span className="font-medium">Sale ID:</span> #{sale.id}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SaleDetailModal;