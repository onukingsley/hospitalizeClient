import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDiagnoses, usePatients, useDrugs, useDrugSales } from '/src/hooks/useData.js';
import { formatCurrency } from '@/lib/formatters';
import { PAYMENT_METHODS } from '@/lib/constants';
import { generateReceiptNumber } from '@/lib/mockData';
import PageHeader from '@/components/common/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import _ from 'underscore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import {
    Pill,
    Search,
    ShoppingCart,
    CheckCircle,
    Minus,
    Plus,
    Calendar,
    User,
    Stethoscope,
    Receipt,
    X,
    Package,
    Clock,
    AlertCircle,
    Printer,
    Download,
    ChevronRight,
    ArrowLeft,
    CreditCard,
    Wallet,
    Building2, Eye, FlaskConical, DollarSign, NotebookPen,
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import axiosClient from "../../service/axiosClient.js";
import { drugStore } from "../../store/store.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import DiagnosisDetailModal from "../../components/modals/DiagnosisModal.jsx";
import {formatDate} from "date-fns";
import {cn} from "../../lib/utils.js";
import LabTestEditModal from "../../components/modals/LabTestEditModal.jsx";
import LabTestModal from "../../components/modals/LabTestModal.jsx";

const DrugDispensing = () => {
    const navigate = useNavigate();
    const { drugs } = drugStore();
    const { getPatientById } = usePatients();
    const { updateDrug } = useDrugs();
    const { addSale } = useDrugSales();

    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedLabTest, setSelectedLabTest] = useState(null);

    const [searchSale, setSearchSale] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedSale, setSelectedSale] = useState(null);
    const [unpaidSelectedSale, setUnpaidSelectedSale] = useState(null);
    const [selectedRates, setSelectedRates] = useState(null);

    const [sales, setSales] = useState([]);
    const [cart, setCart] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [showPayment, setShowPayment] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showLabDetail, setShowLabDetail] = useState(false);
    const [apiMessage, setApiMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [searchParams] = useSearchParams();


    const [test, setTest] = useState([]);

    const [showDiagnosisModal, setShowDiagnosisModal] = useState(false);
    const [selectedDiagnosisId, setSelectedDiagnosisId] = useState(null);

    // Memoized cart total
    const cartTotal = useMemo(() => {
        return cart.reduce((sum, c) => sum + (parseFloat(c.amount) || 0) * (parseInt(c.pivot?.quantity) || 0), 0);
    }, [cart]);

    // Memoized cart count
    const cartCount = useMemo(() => {
        return cart.reduce((sum, c) => sum + (parseInt(c.pivot?.quantity) || 0), 0);
    }, [cart]);


    const getProgressStatusColor = (status) => {
        const colors = {
            completed: 'bg-green-100 text-green-700 border-green-200',
            inProgress: 'bg-blue-100 text-blue-700 border-blue-200',
            undone: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        };
        return colors[status] || 'bg-yellow-100 text-yellow-700 border-yellow-200';
    };



    useEffect(() => {
        const regID = searchParams.get('regID');
        if (regID) {
            setIsLoading(true);
            setSearchSale(regID)
            axiosClient.get(`/getPatientLabTest?regID=${regID}`)
                .then(({ data }) => {
                    if (data.message?.includes('No Record found')) {
                        setApiMessage(data.message);
                        setShowMessage(true);
                        setSales([]);
                        setSelectedUser(null);
                    } else {
                        console.log(data.data.patient.labtest)
                        setSales(data.data?.patient?.labtest || []);
                        setSelectedUser(data.data);
                    }
                    setIsLoading(false);
                })
                .catch((e) => {
                    console.error(e);
                    toast.error('Failed to fetch patient data');
                    setIsLoading(false);
                });
        }
    }, []);

    // Fetch sales by regID
    const handleGetSales = () => {
        if (!searchSale.trim()) {
            toast.warning('Please enter a patient ID');
            return;
        }

        setIsLoading(true);
        axiosClient.get(`/getPatientLabTest?regID=${searchSale}`)
            .then(({ data }) => {
                if (data.message?.includes('No Record found')) {
                    setApiMessage(data.message);
                    setShowMessage(true);
                    setSales([]);
                    setSelectedUser(null);
                } else {
                    setSales(data.data?.patient?.labtest || []);
                    setSelectedUser(data.data);
                }
                setIsLoading(false);
            })
            .catch((e) => {
                console.error(e);
                toast.error('Failed to fetch patient data');
                setIsLoading(false);
            });
    };

    // Auto-fetch from URL params


    const handleSave = (payload)=>{



        axiosClient.post('/updateLabTest',payload)
            .then(({data})=>{
                console.log(data)
                setSelectedSale(data.data)
            })
            /*.catch(e=>alert(e))*/
    }


    const handleAcceptConfirmation = ()=>{

        const payload = {
            labtest_id : unpaidSelectedSale.id
        }
        console.log(payload)
        axiosClient.post('/updateLabStatus',payload)
            .then(({data})=>{
                console.log(data)
                handleGetSales()

                setSelectedSale(data.data)

            })
        .catch(e=>alert(e))
    }

    // Add to cart
    const addToCart = (drug) => {
        const existing = cart.find(c => c.id === drug.id);
        if (existing) {
            toast.info(`${drug.name} is already in the cart`);
        } else {
            setCart([...cart, { ...drug, pivot: { ...drug.pivot, quantity: parseInt(drug.pivot?.quantity) || 1 } }]);
            toast.success(`${drug.name} added to cart`);
        }
    };

    // Update cart quantity
    const updateCartQty = (drugId, delta) => {
        setCart(cart.map(c => {
            if (c.id === drugId) {
                const newQty = Math.max(1, (parseInt(c.pivot?.quantity) || 0) + delta);
                return { ...c, pivot: { ...c.pivot, quantity: newQty } };
            }
            return c;
        }));
    };

    // Remove from cart
    const removeFromCart = (drugId) => {
        const item = cart.find(c => c.id === drugId);
        setCart(cart.filter(c => c.id !== drugId));
        toast.info(`${item?.name || 'Item'} removed from cart`);
    };

    // Clear cart
    const clearCart = () => {
        setCart([]);
    };

    // Handle dispense
    const handleDispense = () => {
        if (!selectedSale || cart.length === 0) {
            toast.warning('No items in cart to dispense');
            return;
        }

        setIsProcessing(true);
        const isSame = _.isEqual(cart, selectedSale.drug_stock);
        const totalAmount = cart.reduce((sum, c) => sum + (parseFloat(c.amount) || 0) * (parseInt(c.pivot?.quantity) || 0), 0);

        const payload = {
            isSame: isSame,
            cart: cart,
            total_amount: totalAmount,
            sales_id: selectedSale.id,
        };

        axiosClient.post('/updateDelieveryStatus',payload)
            .then((data)=>{
                console.log(data.data);
                if (data.status == 201){
                    setApiMessage(data.data.message)
                    setShowPayment(false)
                    setShowMessage(true)
                    handleGetSales()
                    setTimeout(()=>{
                        /*setShowMessage(false)*/
                        setSelectedSale(null)
                    },3000)
                    setIsProcessing(false)
                    return;

                }
                handleGetSales()
                setShowPayment(false);
                setShowReceipt(true);
                setIsProcessing(false)
                setTimeout(()=>{
                    setShowReceipt(false)
                    setSelectedSale(null)
                },3000)

                //toast.success('Drugs dispensed successfully');
            })
            .catch(e=> {
                toast.error(e.message)
                setIsProcessing(false)
            })

    };

    // Reset selection
    const handleResetSelection = () => {
        setSelectedUser(null);
        setSelectedSale(null);
        setCart([]);
        setSales([]);
        setSearchSale('');
    };

    // Print receipt
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Patient Lab workspace"
                subtitle="Conduct test based on doctor's recommendation"
                breadcrumb={[
                    { label: 'Dashboard', path: '/lab' },
                    { label: 'lab Test' }
                ]}
                actions={
                    <div className="flex items-center gap-2">
                        {selectedSale && (
                            <Button variant="outline" size="sm" onClick={() => { setSelectedSale(null); setCart([]); }}>
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                Back to Prescriptions
                            </Button>
                        )}
                    </div>
                }
            />

            {!selectedUser ? (
                // Patient Search Section
                <Card className="p-6 border-dashed border-2 hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Find Patient</h3>
                            <p className="text-sm text-muted-foreground">Search by Patient RegID to view prescriptions</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Enter Patient RegID (e.g., PAT001)"
                                value={searchSale}
                                onChange={e => setSearchSale(e.target.value)}
                                className="pl-10 h-12"
                                onKeyDown={e => e.key === 'Enter' && handleGetSales()}
                            />
                        </div>
                        <Button
                            onClick={handleGetSales}
                            disabled={isLoading}
                            className="h-12 px-8"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                    Searching...
                                </>
                            ) : (
                                <>
                                    <Search className="w-4 h-4 mr-2" />
                                    Search
                                </>
                            )}
                        </Button>
                    </div>

                    {!isLoading && sales.length === 0 && searchSale && (
                        <div className="mt-4 text-center py-8">
                            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                            <p className="text-sm text-muted-foreground">No prescriptions found for this patient</p>
                        </div>
                    )}
                </Card>
            ) : (
                // Patient Info & Prescriptions
                <>
                    {/* Patient Info Card */}
                    <Card className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                                    {selectedUser?.name?.[0] || 'U'}
                                </div>
                                <div>
                                    <p className="font-semibold text-lg">{selectedUser?.name}</p>
                                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                        <span className="font-mono">{selectedUser?.regID}</span>
                                        <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                        <span>{selectedUser?.email}</span>
                                        <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                        <span>{selectedUser?.phone_no}</span>
                                    </div>
                                </div>
                            </div>
                            <div className='flex gap-x-2'>
                                <Button variant="outline" size="sm" onClick={handleResetSelection}>
                                    <X className="w-4 h-4 mr-1" />
                                    Change Patient
                                </Button>
                                <Button variant="outline" size="sm" onClick= {()=>{
                                    navigate(`/pharmacy/patientDetails?regID=${selectedUser?.regID}`)
                                }}>
                                    <X className="w-4 h-4 mr-1" />
                                    View Patient
                                </Button>
                            </div>

                        </div>
                    </Card>

                    {/* Prescriptions Grid */}
                    {!selectedSale ? (
                        <>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold">Prescriptions</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {sales?.length || 0} prescription{sales?.length > 1 ? 's' : ''} found
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {sales?.map((sale) => {
                                    const isDelivered = sale?.lab_test_progress_status === 'delivered';
                                    const isPaid = sale?.lab_test_payment_status === 'paid';
                                    const isPending = sale.payment?.completion_status == 'pending';

                                    return (
                                        <Card
                                            key={sale.id}
                                            className={`p-5 cursor-pointer hover:shadow-lg transition-all duration-200 group ${
                                                isDelivered ? 'opacity-60 hover:opacity-100' : 'hover:border-primary/30'
                                            }`}
                                            onClick={() => {
                                                /*if (isDelivered) {
                                                    toast.info('This prescription has already been delivered');
                                                    return;
                                                }*/
                                                if (sale.lab_test_payment_status == 'paid' && sale.lab_test_progress_status == 'undone'){
                                                    setUnpaidSelectedSale(sale)
                                                    setShowConfirmation(true)
                                                }else if (sale.lab_test_payment_status == 'unpaid') {
                                                        setApiMessage('Payment hasnt Been Done. Please Refer Patient to the accounting Department')
                                                    setShowMessage(true)
                                                }

                                                else  {
                                                    setSelectedSale(sale);
                                                }



                                            }}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-semibold">Test: {sale.lab_test_name}</span>
                                                        <StatusBadge status={sale?.lab_test_progress_status} size="sm" />
                                                    </div>
                                                    <p className="text-sm text-muted-foreground truncate">
                                                        <span className="font-medium">Doctor:</span> {sale.doctor?.user?.name || 'N/A'}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        <span className="font-medium">Items:</span> {sale.rates?.length || 0}
                                                    </p>
                                                    <p className="text-sm font-medium text-primary mt-1">
                                                        {formatCurrency(sale.lab_test_amount)}
                                                    </p>
                                                    <div className="flex flex-wrap items-center gap-3 mt-2">
                                                        <Badge variant={isPaid ? 'default' : 'destructive'} className="text-xs">
                                                            {isPaid ? 'Paid' : 'Unpaid'}
                                                        </Badge>
                                                        {isPending && (
                                                            <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                                                                Payment Pending
                                                            </Badge>
                                                        )}
                                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {new Date(sale.created_at).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                                {sale.lab_test_progress_status == 'completed' && (
                                                    <ChevronRight className="w-5 h-5 text-muted-foreground  group-hover:opacity-100 transition-opacity" />
                                                )}
                                            </div>
                                        </Card>
                                    );
                                })}
                            </div>

                            {sales?.length === 0 && (
                                <div className="text-center py-12">
                                    <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
                                    <p className="text-lg font-medium text-muted-foreground">No prescriptions available</p>
                                    <p className="text-sm text-muted-foreground">This patient has no active prescriptions</p>
                                </div>
                            )}
                        </>
                    ) : (
                        // Dispensing Interface
                        <>
                            {/* Selected Sale Info */}
                            <Card className="p-4 bg-muted/30 border-border/50">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <Receipt className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">Sale #{selectedSale.id}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Testing done by Dr. {selectedSale.lab_scientist?.user?.name || 'Unknown'}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Prescribed by Dr. {selectedSale.doctor?.user?.name || 'Unknown'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {/*<Badge variant="outline" className="text-xs">
                                            {selectedSale.drug_stock?.length || 0} items
                                        </Badge>*/}
                                        {selectedSale.lab_test_progress_status != 'completed' &&  <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                setShowEditModal(true)}
                                            className="text-muted-foreground hover:text-foreground"
                                        >
                                            <NotebookPen className="w-4 h-4 mr-1" />
                                            Edit
                                        </Button>}


                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => { setSelectedDiagnosisId(selectedSale.diagnosis_id);
                                                setShowDiagnosisModal(true)}}
                                            className="text-muted-foreground hover:text-foreground"
                                        >
                                            <Eye className="w-4 h-4 mr-1" />
                                            View Diagnosis
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setShowLabDetail(true)}}
                                            className="text-muted-foreground hover:text-foreground"
                                        >
                                            <Eye className="w-4 h-4 mr-1" />
                                            View Lab Details
                                        </Button>
                                        <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => { setSelectedSale(null); setCart([]); }}
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        <X className="w-4 h-4 mr-1" />
                                        Close
                                    </Button>
                                    </div>
                                </div>
                            </Card>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Drug List */}
                                <div className="lg:col-span-2 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                                <Pill className="w-5 h-5 text-primary" />
                                                Prescribed Drugs
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {selectedSale.drug_stock?.length || 0} medications prescribed
                                            </p>
                                        </div>
                                    </div>

                                    <ScrollArea className="max-h-[500px] pr-4">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <Card className="p-6">
                                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><FlaskConical className="w-5 h-5 text-yellow-500" />Pending Tests ({selectedSale?.rates.length})</h3>
                                                <div className="space-y-2 max-h-[500px] overflow-y-auto scrollbar-thin">
                                                    {selectedSale?.rates?.map(test => {
                                                        return (
                                                            <div key={test.id} className="p-4 border rounded-lg hover:bg-muted transition-colors cursor-pointer" onClick={() => setSelectedRates(test)}>
                                                                <div className="flex items-start justify-between">
                                                                    <div>
                                                                        <div className="flex items-center gap-2">
                                                                            <p className="font-medium text-sm">{test.title}</p>
                                                                           {/* <StatusBadge status={test?.status} size="sm" />*/}
                                                                        </div>
                                                                        <p className="text-xs text-muted-foreground mt-1">{test.id} </p>
                                                                        <p className="text-xs text-muted-foreground"> {new Date(test.updated_at).toLocaleDateString('en-US', {
                                                                            month: 'short',
                                                                            day: 'numeric',
                                                                            year: 'numeric'
                                                                        })}</p>
                                                                    </div>
                                                                    <StatusBadge status={test?.pivot?.status } size="sm" />
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                    {selectedSale?.rates?.length === 0 && <p className="text-center text-muted-foreground py-4">No pending tests</p>}
                                                </div>
                                            </Card>

                                        </div>
                                    </ScrollArea>
                                </div>

                                {/* Cart Summary */}
                                <div>

                                      <Card className="p-6">
                                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" />Recent Results</h3>
                                          {
                                              selectedRates != null ? (
                                                  <div className="space-y-2 max-h-[500px] overflow-y-auto scrollbar-thin">
                                                      <Card className="p-4 mb-6">
                                                          <div className="flex items-center gap-2 mb-3">
                                                              <DollarSign className="w-4 h-4 text-primary" />
                                                              <h4 className="font-medium">Rate Details</h4>
                                                          </div>
                                                          <div className="space-y-2">

                                                              <div key={selectedRates.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                                                  <div>
                                                                      <p className="font-medium">{selectedRates.title}</p>

                                                                  </div>
                                                                  <div className="text-right">
                                                                      <p className="font-semibold">{formatCurrency(selectedRates.pivot?.amount || selectedRates.amount)}</p>
                                                                      <Badge className={cn("text-xs", getProgressStatusColor(selectedRates.pivot?.status || 'pending'))}>
                                                                          {selectedRates.pivot?.status || 'pending'}
                                                                      </Badge>
                                                                  </div>
                                                              </div>
                                                             <div>
                                                                 <p className="font-medium">Remark</p>
                                                                 <Card>
                                                                     {selectedRates.pivot?.remark && (
                                                                         <p className="text-xs text-muted-foreground">{selectedRates.pivot.remark}</p>
                                                                     )}
                                                                 </Card>
                                                             </div>

                                                          </div>
                                                      </Card> </div>
                                              ):(
                                                  <p className="text-center text-muted-foreground py-4">No selected Test</p>
                                              )
                                          }
                                            </Card>
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}

            {/* Payment Confirmation Dialog */}
            <Dialog open={showPayment} onOpenChange={setShowPayment}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-primary" />
                            Confirm Dispensing
                        </DialogTitle>
                        <DialogDescription>
                            Please review the order before confirming
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Items</span>
                                <span className="font-medium">{cartCount} items</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Total Amount</span>
                                <span className="text-xl font-bold text-primary">{formatCurrency(cartTotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Payment Method</span>
                                <span className="font-medium">{PAYMENT_METHODS.find(m => m.value === paymentMethod)?.label}</span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" className="flex-1" onClick={() => setShowPayment(false)}>
                                Cancel
                            </Button>
                            <Button className="flex-1" onClick={handleDispense} disabled={isProcessing}>
                                {isProcessing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Confirm
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Receipt Dialog */}
            <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Receipt className="w-5 h-5 text-green-500" />
                            Dispensing Receipt
                        </DialogTitle>
                    </DialogHeader>
                    <div className="p-6 border-2 border-dashed border-green-200 rounded-lg text-center space-y-4 bg-green-50/30">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-green-700">Dispensing Successful!</h3>
                            <p className="text-sm text-muted-foreground">Prescription has been dispensed</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Total Amount</span>
                                <span className="text-xl font-bold text-primary">{formatCurrency(cartTotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Payment Method</span>
                                <span>{PAYMENT_METHODS.find(m => m.value === paymentMethod)?.label}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Patient</span>
                                <span>{selectedUser?.name}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Sale ID</span>
                                <span className="font-mono">#{selectedSale?.id}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="flex-1" onClick={handlePrint}>
                                <Printer className="w-4 h-4 mr-2" />
                                Print
                            </Button>
                            <Button className="flex-1" onClick={() => {
                                setShowReceipt(false);
                                setSelectedSale(null);
                                setCart([]);
                                setSales([]);
                            }}>
                                Done
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Message Dialog */}
            <Dialog open={showMessage} onOpenChange={setShowMessage}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-blue-500" />
                            Information
                        </DialogTitle>
                    </DialogHeader>
                    <div className="p-6 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                            <AlertCircle className="w-8 h-8 text-blue-600" />
                        </div>
                        <p className="text-lg font-medium">{apiMessage}</p>
                        <Button className="mt-2" onClick={() => { setShowMessage(false); setApiMessage(''); }}>
                            OK
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>


            <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-blue-500" />
                            Confirmation
                        </DialogTitle>
                    </DialogHeader>
                    <div className="p-6 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                            <AlertCircle className="w-8 h-8 text-blue-600" />
                        </div>
                        <p className="text-lg font-medium">Do you accept to conduct this Lab Test</p>
                        <Button className="mt-2" onClick={() => { handleAcceptConfirmation(); setShowConfirmation(false) }}>
                            OK
                        </Button>
                        <Button className="mt-2" onClick={() => { setShowConfirmation(false) }}>
                            cancel
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>


            <DiagnosisDetailModal
                open={showDiagnosisModal}
                onOpenChange={setShowDiagnosisModal}
                diagnosisId={selectedDiagnosisId}
            />

            <LabTestEditModal
                open={showEditModal}
                onOpenChange={setShowEditModal}
                labTestId={selectedSale?.id}
                selectedLab={selectedSale}
                onSave={handleSave}
            />

            <LabTestModal
            labTestId={selectedSale?.id}
            selectedLab={selectedSale}
            onOpenChange={setShowLabDetail}
            open={showLabDetail}


            />


        </div>
    );
};

export default DrugDispensing;