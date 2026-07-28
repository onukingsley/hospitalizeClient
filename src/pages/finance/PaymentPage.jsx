import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/lib/formatters';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Search,
    User,
    Pill,
    FlaskConical,
    Stethoscope,
    CreditCard,
    Banknote,
    Wallet,
    CheckCircle,
    XCircle,
    Clock,
    Calendar,
    FileText,
    Receipt,
    Printer,
    ArrowRight,
    AlertCircle,
    TrendingUp,
    TrendingDown,
    Loader2,
    Eye,
    Plus,
    Minus,
} from 'lucide-react';
import { toast } from 'sonner';
import axiosClient from '../../service/axiosClient.js';
import { paymentStore, diagnosisStore, labStore, drugStore } from '../../store/store.jsx';

const PaymentPage = () => {
    const navigate = useNavigate();
    const [searchRegID, setSearchRegID] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [labTest, setLabTest] = useState([]);
    const [drugSales, setDrugSale] = useState([]);
    const [consultation, setConsultaion] = useState([]);
    const [patientDiagnoses, setPatientDiagnoses] = useState([]);
    const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeTab, setActiveTab] = useState('unpaid');

    // Payment modal states
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [paymentType, setPaymentType] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [paymentAmount, setPaymentAmount] = useState(0);

    // Fetch patient data
    const handleSearchPatient = async () => {
        if (!searchRegID.trim()) {
            toast.warning('Please enter a patient RegID');
            return;
        }


        setIsLoading(true);
        try {
            const response = await axiosClient.get(`/paymentInvoice?details=${searchRegID}`);
            if (response.data.data) {
                setSelectedPatient(response.data.data.patient);
                setDrugSale(response.data.data.sales)
                setConsultaion(response.data.data.consultation)
                setLabTest(response.data.data.labTest)
               // await fetchPatientDiagnoses(searchRegID);
                toast.success('Patient found successfully');

            } else {
                toast.error('Patient not found');
                setSelectedPatient(null);
                setPatientDiagnoses([]);
            }
        } catch (error) {
            console.error('Error fetching patient:', error);
            toast.error('Failed to fetch patient data');
            setSelectedPatient(null);
            setPatientDiagnoses([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch patient diagnoses with unpaid items
    const fetchPatientDiagnoses = async (regID) => {
        try {
            const response = await axiosClient.get(`/getDoctorsPatientDiagnosis?details=${regID}`);
            const data = response.data.data;

            if (data) {
                setPatientDiagnoses(data);
                console.log(data)
            } else {
                setPatientDiagnoses([]);
            }
        } catch (error) {
            console.error('Error fetching diagnoses:', error);
            setPatientDiagnoses([]);
        }
    };

    // Get all unpaid items from diagnoses
    const getUnpaidItems = () => {
        const unpaidDrugSales = [];
        const unpaidLabTests = [];
        const unpaidConsultations = [];

        patientDiagnoses.forEach(diagnosis => {
            console.log(diagnosis.sales)
            // Unpaid drug sales
            diagnosis.sales?.forEach(sale => {
                if (sale.payment_status === 'unpaid' || sale.payment?.completion_status === 'pending') {
                    unpaidDrugSales.push({
                        ...sale,
                        diagnosis_id: diagnosis.id,
                        patient_name: selectedPatient?.name,
                        patient_regID: selectedPatient?.regID,
                    });
                }
            });

            // Unpaid lab tests
            diagnosis.lab_test?.forEach(test => {
                if (test.lab_test_payment_status === 'unpaid' || test.payment?.completion_status === 'pending') {
                    unpaidLabTests.push({
                        ...test,
                        diagnosis_id: diagnosis.id,
                        patient_name: selectedPatient?.name,
                        patient_regID: selectedPatient?.regID,
                    });
                }
            });

            // Unpaid consultations
            diagnosis.consultation?.forEach(consult => {
                if (consult.payment_status === 'unpaid' || consult.payment?.completion_status === 'pending') {
                    unpaidConsultations.push({
                        ...consult,
                        diagnosis_id: diagnosis.id,
                        patient_name: selectedPatient?.name,
                        patient_regID: selectedPatient?.regID,
                    });
                }
            });
        });

        return { unpaidDrugSales, unpaidLabTests, unpaidConsultations };
    };

    const { unpaidDrugSales, unpaidLabTests, unpaidConsultations } = getUnpaidItems();

    // Handle payment confirmation
    const handlePayment = async () => {
        if (!selectedPayment) return;

        if (paymentType == 'lab'){
            const payload  = {
                labTest_id : selectedPayment.id,
                patientUser_id: selectedPatient.id,
                title : selectedPayment.lab_test_name
            }

            axiosClient.post('/updateLabPayment', payload)
                .then(({data})=>{
                    alert(data.message)
                }).catch(e=> alert(e))


        }
        else if (paymentType == 'drug'){
            const payload  = {
                sales_id : selectedPayment.id,
                patientUser_id: selectedPatient.id,
                title : `Drug Sale ID: ${selectedPayment.id}`
            }

            axiosClient.post('/updateDrugSales', payload)
                .then(({data})=>{
                    alert(data.message)
                }).catch(e=> alert(e))


        }else if (paymentType == 'consultation'){

            const payload  = {
                consultation_id : selectedPayment.id,
                patientUser_id: selectedPatient.id,
                title : `Consultation ID: ${selectedPayment.id}`
            }

            axiosClient.post('/updateConsultation', payload)
                .then(({data})=>{
                    alert(data.message)
                }).catch(e=> alert(e))


        }


        setIsProcessing(true);
        try {
            const payload = {
                payment_type: paymentType,
                item_id: selectedPayment.id,
                patient_user_id: selectedPatient?.id,
                amount: paymentAmount,
                payment_method: paymentMethod,
                diagnosis_id: selectedPayment.diagnosis_id,
            };

            const response = await axiosClient.post('/api/process-payment', payload);

            if (response.data.success) {
                toast.success('Payment processed successfully');
                setShowPaymentModal(false);
                setSelectedPayment(null);
                // Refresh data
                await fetchPatientDiagnoses(searchRegID);
            } else {
                toast.error(response.data.message || 'Payment failed');
            }
        } catch (error) {
            console.error('Payment error:', error);
            toast.error(error.response?.data?.message || 'Failed to process payment');
        } finally {
            setIsProcessing(false);
        }
    };

    // Open payment modal
    const openPaymentModal = (item, type) => {
        setSelectedPayment(item);
        setPaymentType(type);
        setPaymentAmount(parseFloat(item.total_amount || item.lab_test_amount || item.amount || 0));
        setPaymentMethod('cash');
        setShowPaymentModal(true);
    };


    const DiagnosisList = ({ items }) => (

        <div className="space-y-3">
            {isLoading ? <p className="text-center text-muted-foreground py-8">Searching for Diagnosis. please wait</p>
                : (
                    <>
                        {items?.map(dx => {

                            return (
                                <Card key={dx?.id} className={`p-4 hover:shadow-md transition-all cursor-pointer bg-gray-100`} onClick={() =>  setSelectedDiagnosis(dx)}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                                                {dx?.patient?.user?.name?.[0]}{dx?.patient?.user?.name?.[1]}
                                            </div>
                                            <div>
                                                <p className="font-semibold">{dx?.patient?.user?.name} </p>
                                                {/*<p className="text-xs text-muted-foreground">{dx.id} • {formatDate(dx.created_at)} . {dx?.doctor?.user?.name}</p>*/}
                                                <p className="text-sm mt-1">{dx.final_diagnosis || dx.intial_diagnosis}</p>
                                                <div className="flex gap-2 mt-2">
                                                    {dx.sales?.length > 0 && <Badge variant="outline" className="text-xs">{dx.sales?.length} prescriptions</Badge>}
                                                    {dx.lab_test?.length > 0 && <Badge variant="outline" className="text-xs">{dx.lab_test?.length} lab Tests</Badge>}
                                                    {dx.labtest?.length > 0 && <Badge variant="outline" className="text-xs">{dx.labtest?.length} lab Tests</Badge>}
                                                </div>
                                            </div>
                                        </div>
                                        <StatusBadge status={dx.ward_status} size="sm" />
                                    </div>
                                </Card>
                            );
                        })}
                    </>
                )

            }


            {items.length === 0 && <p className="text-center text-muted-foreground py-8">No diagnoses found</p>}
        </div>
    );
    // Render payment item card
    const renderPaymentItem = (item, type, icon, label) => {
        const getStatusColor = (status) => {
            return status === 'paid' || status === 'completed'
                ? 'bg-green-100 text-green-700 border-green-200'
                : 'bg-yellow-100 text-yellow-700 border-yellow-200';
        };

        const getStatusLabel = (status) => {
            if (status === 'paid' || status === 'completed') return 'Paid';
            if (status === 'pending') return 'Pending';
            return 'Unpaid';
        };

        const amount = item.total_amount || item.lab_test_amount || item.amount || 0;
        const status = item.payment_status || item.lab_test_payment_status || item.payment?.completion_status || 'unpaid';
        const date = item.created_at;

        return (
            <div
                className="flex items-center justify-between p-4 rounded-lg border hover:shadow-md transition-all cursor-pointer hover:border-primary/30"
                onClick={() => openPaymentModal(item, type)}
            >
                <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                        {icon}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <p className="font-medium">{label}</p>
                            <StatusBadge status={status} size="sm" />
                            {/*<StatusBadge status={item?.payment?.completion_status} size="sm" />*/}
                            <Badge variant="outline" className="text-sm">
                                {item?.payment?.completion_status}
                            </Badge>

                        </div>
                        <p className="text-sm text-muted-foreground">ID: #{item.id}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-lg font-bold text-primary">{formatCurrency(amount)}</p>
                    <Button
                        size="sm"
                        variant="outline"
                        className="mt-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            openPaymentModal(item, type);
                        }}
                    >
                        <CreditCard className="w-4 h-4 mr-1" />
                        Pay Now
                    </Button>
                </div>
            </div>
        );
    };

    // Empty state
    const EmptyState = ({ message, icon }) => (
        <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                {icon || <CheckCircle className="w-8 h-8 text-muted-foreground/50" />}
            </div>
            <p className="text-lg font-medium text-muted-foreground">{message}</p>
            <p className="text-sm text-muted-foreground mt-1">All items have been paid for</p>
        </div>
    );

    // Count unpaid items
    const totalUnpaid = unpaidDrugSales.length + unpaidLabTests.length + unpaidConsultations.length;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <PageHeader
                title="Payment Collection"
                subtitle="Collect payments for consultations, lab tests, and drug sales"
                actions={
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={() => window.print()}>
                            <Printer className="w-4 h-4 mr-2" />
                            Print
                        </Button>
                    </div>
                }
            />

            {/* Search Patient */}
            {!selectedPatient && (
                <Card className="p-6 border-dashed border-2 hover:border-primary/50 transition-colors">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Enter Patient RegID (e.g., PAT001)"
                                value={searchRegID}
                                onChange={(e) => setSearchRegID(e.target.value)}
                                className="pl-10 h-12"
                                onKeyDown={(e) => e.key === 'Enter' && handleSearchPatient()}
                            />
                        </div>
                        <Button
                            onClick={handleSearchPatient}
                            disabled={isLoading}
                            className="h-12 px-8"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Searching...
                                </>
                            ) : (
                                <>
                                    <Search className="w-4 h-4 mr-2" />
                                    Search Patient
                                </>
                            )}
                        </Button>
                    </div>
                </Card>
            )}

            {/* Patient Info */}
            {selectedPatient && (
                <>
                    <Card className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                                    {selectedPatient?.name?.[0] || 'P'}
                                </div>
                                <div>
                                    <p className="font-semibold text-lg">{selectedPatient?.name}</p>
                                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                        <span className="font-mono">{selectedPatient?.regID}</span>
                                        <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                        <span>{selectedPatient?.email}</span>
                                        <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                        <span>{selectedPatient?.phone_no}</span>
                                    </div>
                                </div>
                            </div>
                            {/*<div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-sm">
                                    Total Unpaid: pending
                                </Badge>
                            </div>*/}
                        </div>
                    </Card>
                 {/*   <DiagnosisList items={patientDiagnoses?.length>0 ? patientDiagnoses : [] } />*/}
                    <>
                        {/* Unpaid Items Summary */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Card className="p-4 cursor-pointer hover:shadow-md transition-all" onClick={() => setActiveTab('drugs')}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Drug Sales</p>
                                        <p className="text-2xl font-bold">{drugSales?.length}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                                        <Pill className="w-5 h-5 text-orange-600" />
                                    </div>
                                </div>
                            </Card>
                            <Card className="p-4 cursor-pointer hover:shadow-md transition-all" onClick={() => setActiveTab('lab')}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Lab Tests</p>
                                        <p className="text-2xl font-bold">{labTest?.length}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                        <FlaskConical className="w-5 h-5 text-purple-600" />
                                    </div>
                                </div>
                            </Card>
                            <Card className="p-4 cursor-pointer hover:shadow-md transition-all" onClick={() => setActiveTab('consultation')}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Consultations</p>
                                        <p className="text-2xl font-bold">{consultation?.length}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                        <Stethoscope className="w-5 h-5 text-blue-600" />
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Unpaid Items Tabs */}
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="drugs" className="flex items-center gap-2">
                                    <Pill className="w-4 h-4" />
                                    Drug Sales
                                    {drugSales?.length > 0 && (
                                        <span className="ml-1 px-2 py-0.5 rounded-full bg-primary/10 text-xs">
                                        {drugSales?.length}
                                    </span>
                                    )}
                                </TabsTrigger>
                                <TabsTrigger value="lab" className="flex items-center gap-2">
                                    <FlaskConical className="w-4 h-4" />
                                    Lab Tests
                                    {labTest?.length > 0 && (
                                        <span className="ml-1 px-2 py-0.5 rounded-full bg-primary/10 text-xs">
                                        {labTest?.length}
                                    </span>
                                    )}
                                </TabsTrigger>
                                <TabsTrigger value="consultation" className="flex items-center gap-2">
                                    <Stethoscope className="w-4 h-4" />
                                    Consultations
                                    {consultation?.length > 0 && (
                                        <span className="ml-1 px-2 py-0.5 rounded-full bg-primary/10 text-xs">
                                        {consultation?.length}
                                    </span>
                                    )}
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="drugs">
                                <Card className="p-4">
                                    <ScrollArea >
                                        {drugSales.length > 0 ? (
                                            <div className="space-y-3 pr-4">
                                                {drugSales.map(sale => (
                                                    renderPaymentItem(
                                                        sale,
                                                        'drug',
                                                        <Pill className="w-5 h-5 text-orange-600" />,
                                                        `Drug Sale #${sale.id}`
                                                    )
                                                ))}
                                            </div>
                                        ) : (
                                            <EmptyState
                                                message="No unpaid drug sales"
                                                icon={<Pill className="w-8 h-8 text-muted-foreground/50" />}
                                            />
                                        )}
                                    </ScrollArea>
                                </Card>
                            </TabsContent>

                            <TabsContent value="lab">
                                <Card className="p-4">
                                    <ScrollArea>
                                        {labTest.length > 0 ? (
                                            <div className="space-y-3 pr-4">
                                                {labTest.map(test => (
                                                    renderPaymentItem(
                                                        test,
                                                        'lab',
                                                        <FlaskConical className="w-5 h-5 text-purple-600" />,
                                                        `Lab Test: ${test.lab_test_name}`
                                                    )
                                                ))}
                                            </div>
                                        ) : (
                                            <EmptyState
                                                message="No unpaid lab tests"
                                                icon={<FlaskConical className="w-8 h-8 text-muted-foreground/50" />}
                                            />
                                        )}
                                    </ScrollArea>
                                </Card>
                            </TabsContent>

                            <TabsContent value="consultation">
                                <Card className="p-4">
                                    <ScrollArea >
                                        {consultation.length > 0 ? (
                                            <div className="space-y-3 pr-4">
                                                {consultation.map(consult => (
                                                    renderPaymentItem(
                                                        consult,
                                                        'consultation',
                                                        <Stethoscope className="w-5 h-5 text-blue-600" />,
                                                        `Consultation #${consult.id}`
                                                    )
                                                ))}
                                            </div>
                                        ) : (
                                            <EmptyState
                                                message="No unpaid consultations"
                                                icon={<Stethoscope className="w-8 h-8 text-muted-foreground/50" />}
                                            />
                                        )}
                                    </ScrollArea>
                                </Card>
                            </TabsContent>
                        </Tabs>

                    </>
                   {/* {selectedDiagnosis &&

                    }*/}
                    {/* Payment Modal */}
                    <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-primary" />
                                    Confirm Payment
                                </DialogTitle>
                                <DialogDescription>
                                    Review payment details before confirming
                                </DialogDescription>
                            </DialogHeader>

                            {selectedPayment && (
                                <div className="space-y-4">
                                    <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Item</span>
                                            <span className="font-medium">
                                                {paymentType === 'drug' && `Drug Sale #${selectedPayment.id}`}
                                                {paymentType === 'lab' && `Lab Test: ${selectedPayment.lab_test_name}`}
                                                {paymentType === 'consultation' && `Consultation #${selectedPayment.id}`}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Patient</span>
                                            <span className="font-medium">{selectedPayment.patient_name || selectedPatient?.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Amount</span>
                                            <span className="text-xl font-bold text-primary">
                                                {formatCurrency(paymentAmount)}

                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-sm font-medium">Payment Method</Label>
                                        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                            <SelectTrigger className="mt-1.5">
                                                <SelectValue placeholder="Select payment method" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="cash">
                                                    <div className="flex items-center gap-2">
                                                        <Wallet className="w-4 h-4" />
                                                        Cash
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="card">
                                                    <div className="flex items-center gap-2">
                                                        <CreditCard className="w-4 h-4" />
                                                        Card
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="transfer">
                                                    <div className="flex items-center gap-2">
                                                        <Banknote className="w-4 h-4" />
                                                        Bank Transfer
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="insurance">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="w-4 h-4" />
                                                        Insurance
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <DialogFooter className="flex flex-col sm:flex-row gap-2">
                                        <Button
                                            variant="outline"
                                            className="w-full sm:w-auto"
                                            onClick={() => {
                                                setShowPaymentModal(false);
                                                setSelectedPayment(null);
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80"
                                            onClick={handlePayment}
                                            disabled={isProcessing}
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                    Confirm Payment
                                                </>
                                            )}
                                        </Button>
                                    </DialogFooter>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                </>
            )}

            {/* No Patient Selected */}
            {!selectedPatient && (
                <div className="text-center py-12">
                    <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                        <Search className="w-12 h-12 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-lg font-semibold">Search for a Patient</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Enter a patient RegID to view and process unpaid payments
                    </p>
                </div>
            )}
        </div>
    );
};

export default PaymentPage;