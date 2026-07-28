import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { formatCurrency } from '@/lib/formatters';
import PageHeader from '@/components/common/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Printer,
    Download,
    ArrowLeft,
    Receipt,
    User,
    Stethoscope,
    Pill,
    FlaskConical,
    Calendar,
    Clock,
    CheckCircle,
    CreditCard,
    Banknote,
    FileText,
    Building2,
    Phone,
    Mail,
    MapPin,
    Globe,
    Scissors,
} from 'lucide-react';
import { toast } from 'sonner';
import axiosClient from '../../service/axiosClient.js';

const DetailedInvoicePage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const printRef = useRef();
    const [invoice, setInvoice] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPrinting, setIsPrinting] = useState(false);

    const location = useLocation()
    const data = location.state

    console.log(data)


    const fetchInvoice =  () => {


        setInvoice(data.invoice)
        console.log(data.invoice)
        setSelectedPatient(data.patient)
        setIsLoading(false)

        /*setIsLoading(true);
        try {
            const response = await axiosClient.get(`/api/invoice/${invoiceId}`);
            if (response.data.success) {
                setInvoice(response.data.data);
            } else {
                toast.error('Invoice not found');
                navigate('/finance/payments');
            }
        } catch (error) {
            console.error('Error fetching invoice:', error);
            toast.error('Failed to load invoice');
        } finally {
            setIsLoading(false);
        }*/
    };
    // Fetch invoice data
    useEffect(() => {
        fetchInvoice();
    }, []);

    // Print invoice
    const handlePrint = () => {
        setIsPrinting(true);
        setTimeout(() => {
            window.print();
            setIsPrinting(false);
        }, 500);
    };

    // Format date
    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Generate invoice number
    const getInvoiceNumber = () => {
        if (!invoice) return 'N/A';
        return invoice.invoice_number || `INV-${String(invoice.id).padStart(6, '0')}`;
    };

    // Get status badge color
    const getStatusColor = (status) => {
        if (status === 'paid' || status === 'completed') {
            return 'bg-green-100 text-green-700 border-green-200';
        }
        if (status === 'pending') {
            return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        }
        return 'bg-red-100 text-red-700 border-red-200';
    };

    // Calculate totals
    const calculateTotals = () => {
        if (!invoice) return { subtotal: 0, tax: 0, discount: 0, total: 0 };

        const items = invoice.items || invoice.drugSales || invoice.labTests || invoice.consultations || [];
        const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
        const tax = subtotal * 0.075; // 7.5% VAT
        const discount = invoice.discount || 0;
        const total = subtotal + tax - discount;

        return { subtotal, tax, discount, total };
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading invoice...</p>
                </div>
            </div>
        );
    }

    if (!invoice) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Receipt className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">Invoice Not Found</h3>
                    <p className="text-sm text-muted-foreground">The invoice you're looking for doesn't exist.</p>
                    <Button className="mt-4" onClick={() => navigate('/finance/payments')}>
                        Back to Payments
                    </Button>
                </div>
            </div>
        );
    }

    const { subtotal, tax, discount, total } = calculateTotals();
    const items = invoice.items || invoice.drugSales || invoice.labTests || invoice.consultations || [];

    return (
        <div className="space-y-6 print:space-y-0">
            {/* Page Header - Hidden in print */}
            <div className="print:hidden">
                <PageHeader
                    title="Invoice Details"
                    subtitle={`Invoice #${getInvoiceNumber()}`}
                    onBack={() => navigate('/finance/payments')}
                    actions={
                        <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={handlePrint} disabled={isPrinting}>
                                <Printer className="w-4 h-4 mr-2" />
                                {isPrinting ? 'Printing...' : 'Print'}
                            </Button>
                            <Button variant="outline">
                                <Download className="w-4 h-4 mr-2" />
                                Download PDF
                            </Button>
                        </div>
                    }
                />
            </div>

            {/* Invoice Content */}
            <div ref={printRef} className="bg-white rounded-lg shadow-lg overflow-hidden print:shadow-none print:rounded-none">
                {/* Invoice Container */}
                <div className="p-8 print:p-6 max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-gray-200 pb-6 mb-6">
                        <div className="flex items-center gap-4">
                            {/* Hospital Logo */}
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Building2 className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-primary">Hospitalise</h1>
                                <p className="text-sm text-muted-foreground">Healthcare Management System</p>
                                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1">
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        123 Healthcare Avenue, Lagos
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Phone className="w-3 h-3" />
                                        +234 800 1234 567
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Mail className="w-3 h-3" />
                                        info@hospitalise.com
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right mt-4 md:mt-0">
                            <div className="flex items-center gap-2 justify-end">
                                <span className="text-xs font-medium text-muted-foreground uppercase">Invoice</span>
                                <Badge className={getStatusColor(invoice.status || 'paid')}>
                                    {invoice[0].payment.completion_status || 'Paid'}
                                </Badge>
                            </div>
                            <p className="text-sm font-mono font-bold">#{getInvoiceNumber()}</p>
                            <p className="text-xs text-muted-foreground">
                                Date: {formatDate(invoice[0].payment.created_at)}
                            </p>
                        </div>
                    </div>

                    {/* Patient & Hospital Info */}
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Bill To</h3>
                            <div className="p-4 bg-muted/30 rounded-lg">
                                <p className="font-semibold">{selectedPatient?.name || invoice.patient_name || 'N/A'}</p>
                                <p className="text-sm text-muted-foreground">Reg ID: {selectedPatient?.regID || invoice.patient_regID || 'N/A'}</p>
                                <p className="text-sm text-muted-foreground">{selectedPatient?.email || 'N/A'}</p>
                                <p className="text-sm text-muted-foreground">{selectedPatient?.phone_no || 'N/A'}</p>
                                {selectedPatient?.address && (
                                    <p className="text-sm text-muted-foreground">{selectedPatient.address}</p>
                                )}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Hospital Details</h3>
                            <div className="p-4 bg-muted/30 rounded-lg">
                                <p className="font-semibold">Hospitalise Medical Center</p>
                                <p className="text-sm text-muted-foreground">Licensed & Accredited</p>
                                <p className="text-sm text-muted-foreground">Reg No: HMC-2024-001</p>
                                <p className="text-sm text-muted-foreground">VAT No: NG-12345678</p>
                            </div>
                        </div>
                    </div>

                    {/* Invoice Items */}
                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Invoice Items</h3>
                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50">
                                <tr>
                                    <th className="text-left p-3 font-medium text-xs uppercase tracking-wider">#</th>
                                    <th className="text-left p-3 font-medium text-xs uppercase tracking-wider">Description</th>
                                    <th className="text-left p-3 font-medium text-xs uppercase tracking-wider">Type</th>
                                    <th className="text-right p-3 font-medium text-xs uppercase tracking-wider">Quantity</th>

                                    <th className="text-right p-3 font-medium text-xs uppercase tracking-wider">Amount</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                {invoice?.length > 0 ? (
                                    invoice?.map((item, index) => (
                                        <tr key={index} className="hover:bg-muted/30 transition-colors">
                                            <td className="p-3">{index + 1}</td>
                                            <td className="p-3">
                                                <p className="font-medium">{item.payment.title || item.lab_test_name || `Item ${index + 1}`}</p>
                                                {item.description && (
                                                    <p className="text-xs text-muted-foreground">{item.description}</p>
                                                )}
                                            </td>
                                            <td className="p-3">
                                                <Badge variant="outline" className="text-xs">
                                                    {item.payment.payment_type || 'Service'}
                                                </Badge>
                                            </td>
                                            <td className="p-3 text-right">{item.payment.invoice_id || 1}</td>
                                            <td className="p-3 text-right">{formatCurrency( item.payment.amount || 0)}</td>
                                           {/* <td className="p-3 text-right font-semibold">
                                                {formatCurrency((item.quantity || 1) * (item.unit_price || item.amount || 0))}
                                            </td>*/}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-6 text-muted-foreground">
                                            No items found
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="flex flex-col items-end">
                        <div className="w-full md:w-80 space-y-2">
                          {/*  <div className="flex justify-between py-2">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-muted-foreground">VAT (7.5%)</span>
                                <span>{formatCurrency(tax)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between py-2">
                                    <span className="text-muted-foreground">Discount</span>
                                    <span className="text-green-600">-{formatCurrency(discount)}</span>
                                </div>
                            )}*/}
                            <Separator />
                            <div className="flex justify-between py-2 text-lg font-bold">
                                <span>Total</span>
                                <span className="text-primary">{formatCurrency(data.total)}</span>
                            </div>
                            <div className="flex justify-between py-2 text-sm">
                                <span className="text-muted-foreground">Payment Status</span>
                                <Badge className={getStatusColor(invoice.status || 'paid')}>
                                    {invoice.status || 'Paid'}
                                </Badge>
                            </div>
                            {invoice.payment_method && (
                                <div className="flex justify-between py-2 text-sm">
                                    <span className="text-muted-foreground">Payment Method</span>
                                    <span className="font-medium">{invoice.payment_method}</span>
                                </div>
                            )}
                            {invoice.payment_date && (
                                <div className="flex justify-between py-2 text-sm">
                                    <span className="text-muted-foreground">Payment Date</span>
                                    <span className="font-medium">{formatDate(invoice.payment_date)}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted-foreground">
                            <div>
                                <p className="font-medium text-foreground mb-1">Payment Terms</p>
                                <p>Payment is due immediately upon receipt.</p>
                                <p>Late payments may incur additional charges.</p>
                            </div>
                            <div>
                                <p className="font-medium text-foreground mb-1">Bank Details</p>
                                <p>Bank: First Bank Nigeria</p>
                                <p>Account: 1234567890</p>
                                <p>Name: Hospitalise Medical Center</p>
                            </div>
                            <div className="text-right md:text-left">
                                <p className="font-medium text-foreground mb-1">Thank You</p>
                                <p>We appreciate your patronage.</p>
                                <p className="text-primary font-medium mt-1">For inquiries, contact us.</p>
                            </div>
                        </div>
                       {/* <div className="mt-6 pt-4 border-t border-gray-200 text-center text-xs text-muted-foreground">
                            <p>This is a computer-generated receipt. No signature required.</p>
                            <p className="mt-1">© {new Date().getFullYear()} Hospitalise. All rights reserved.</p>
                        </div>*/}
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style jsx global>{`
                @media print {
                    body {
                        background: white !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    .print\\:shadow-none {
                        box-shadow: none !important;
                    }
                    .print\\:rounded-none {
                        border-radius: 0 !important;
                    }
                    .print\\:space-y-0 > * + * {
                        margin-top: 0 !important;
                    }
                    .print\\:p-6 {
                        padding: 1.5rem !important;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                    @page {
                        margin: 0.5cm;
                        size: A4;
                    }
                }
            `}</style>
        </div>
    );
};

export default DetailedInvoicePage;