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
    Building2, Eye,
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

const DrugDispensing = () => {
    const navigate = useNavigate();
    const { drugs } = drugStore();
    const { getPatientById } = usePatients();
    const { updateDrug } = useDrugs();
    const { addSale } = useDrugSales();

    const [searchSale, setSearchSale] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedSale, setSelectedSale] = useState(null);
    const [sales, setSales] = useState([]);
    const [cart, setCart] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [showPayment, setShowPayment] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [apiMessage, setApiMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [searchParams] = useSearchParams();

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

    // Fetch sales by regID
    const handleGetSales = () => {
        if (!searchSale.trim()) {
            toast.warning('Please enter a patient ID');
            return;
        }

        setIsLoading(true);
        axiosClient.get(`/getPatientPrescriptionByRegID?regID=${searchSale}`)
            .then(({ data }) => {
                if (data.message?.includes('No Record found')) {
                    setApiMessage(data.message);
                    setShowMessage(true);
                    setSales([]);
                    setSelectedUser(null);
                } else {
                    setSales(data.data?.patient?.sales || []);
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
    useEffect(() => {
        const regID = searchParams.get('regID');
        if (regID) {
            setSearchSale(regID);
            handleGetSales();
        }
    }, [searchParams]);

    // Add to cart
    const addToCart = (drug) => {
        const existing = cart.find(c => c.id === drug.id);
        if (existing) {
            toast.info(`${drug.name} is already in the cart`);
        } else {
            setCart([...cart, { ...drug, pivot: { ...drug.pivot, quantity:( parseInt(drug.pivot?.quantity)).toString() || 1 } }]);
            toast.success(`${drug.name} added to cart`);
        }
    };

    // Update cart quantity
    const updateCartQty = (drugId, delta) => {
        setCart(cart.map(c => {
            if (c.id === drugId) {
                const newQty = Math.max(1, (parseInt(c.pivot?.quantity) || 0) + delta);
                return { ...c, pivot: { ...c.pivot, quantity: newQty.toString() } };
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

        console.log(isSame)
        console.log(cart, selectedSale.drug_stock)

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
                title="Drug Dispensing"
                subtitle="Dispense drugs based on doctor's prescription"
                breadcrumb={[
                    { label: 'Dashboard', path: '/pharmacy' },
                    { label: 'Drug Dispensing' }
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
                                    const isDelivered = sale.delivery_status === 'delivered';
                                    const isPaid = sale.payment_status === 'paid';
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
                                                setSelectedSale(sale);
                                                setCart([]);
                                            }}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-semibold">Sale #{sale.id}</span>
                                                        <StatusBadge status={sale.delivery_status} size="sm" />
                                                    </div>
                                                    <p className="text-sm text-muted-foreground truncate">
                                                        <span className="font-medium">Doctor:</span> {sale.doctor?.user?.name || 'N/A'}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        <span className="font-medium">Items:</span> {sale.drug_stock?.length || 0}
                                                    </p>
                                                    <p className="text-sm font-medium text-primary mt-1">
                                                        {formatCurrency(sale.total_amount)}
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
                                                {!isDelivered && (
                                                    <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
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
                                                Prescribed by Dr. {selectedSale.doctor?.user?.name || 'Unknown'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-xs">
                                            {selectedSale.drug_stock?.length || 0} items
                                        </Badge>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => { setSelectedDiagnosisId(selectedSale.diagnosis_id);
                                                setShowDiagnosisModal(true)}}
                                            className="text-muted-foreground hover:text-foreground"
                                        >
                                            <Eye className="w-4 h-4 mr-1" />
                                            View Diagnosis
                                        </Button><Button
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
                                        <div className="space-y-3">
                                            {selectedSale?.drug_stock?.map((pres, index) => {
                                                const inCart = cart.find(c => c.id === pres.id);
                                                const drug = drugs.find(d => d.id === pres.id);
                                                const isInStock = drug && parseInt(drug.quantity) > 0;

                                                return (
                                                    <Card
                                                        key={index}
                                                        className={`p-4 transition-all duration-200 ${
                                                            inCart ? 'border-primary/30 bg-primary/5' : 'hover:border-border/80'
                                                        } ${!isInStock ? 'opacity-60' : ''}`}
                                                    >
                                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2">
                                                                    <Pill className="w-4 h-4 text-muted-foreground" />
                                                                    <p className="font-medium">{pres.name}</p>
                                                                    <Badge variant="outline" className="text-xs">
                                                                        {pres.pivot?.dosage || 'N/A'}
                                                                    </Badge>
                                                                </div>
                                                                <div className="flex flex-wrap gap-3 mt-1 text-sm text-muted-foreground">
                                                                    <span>Qty: {pres.pivot?.quantity || 0}</span>
                                                                    <span>•</span>
                                                                    <span>Route: {pres.pivot?.route || 'N/A'}</span>
                                                                    <span>•</span>
                                                                    <span>Duration: {pres.pivot?.duration || 'N/A'}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <span className="text-xs text-muted-foreground">
                                                                        Unit Price: {formatCurrency(pres.amount || 0)}
                                                                    </span>
                                                                    <Badge variant={isInStock ? 'default' : 'destructive'} className="text-[10px]">
                                                                        {isInStock ? `In Stock: ${drug?.quantity}` : 'Out of Stock'}
                                                                    </Badge>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                                {inCart ? (
                                                                    <>
                                                                        <Button
                                                                            variant="outline"
                                                                            size="icon"
                                                                            className="h-8 w-8"
                                                                            onClick={() => updateCartQty(pres.id, -1)}
                                                                            disabled={inCart.pivot?.quantity <= 1}
                                                                        >
                                                                            <Minus className="w-3 h-3" />
                                                                        </Button>
                                                                        <span className="w-8 text-center font-semibold">
                                                                            {inCart.pivot?.quantity || 0}
                                                                        </span>
                                                                        <Button
                                                                            variant="outline"
                                                                            size="icon"
                                                                            className="h-8 w-8"
                                                                            onClick={() => updateCartQty(pres.id, 1)}
                                                                            disabled={!isInStock}
                                                                        >
                                                                            <Plus className="w-3 h-3" />
                                                                        </Button>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                                            onClick={() => removeFromCart(pres.id)}
                                                                        >
                                                                            <X className="w-4 h-4" />
                                                                        </Button>
                                                                    </>
                                                                ) : (
                                                                    <div>
                                                                        {
                                                                            selectedSale.delivery_status != 'delivered' && <Button
                                                                                size="sm"
                                                                                onClick={() => addToCart(pres)}
                                                                                disabled={!isInStock}
                                                                                className="whitespace-nowrap"
                                                                            >
                                                                                <ShoppingCart className="w-4 h-4 mr-1" />
                                                                                Add
                                                                            </Button>
                                                                        }
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </Card>
                                                );
                                            })}
                                        </div>
                                    </ScrollArea>
                                </div>

                                {/* Cart Summary */}
                                {
                                   selectedSale.delivery_status != 'delivered' && (
                                        <div>
                                            <Card className="p-6 sticky top-24">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                                        <ShoppingCart className="w-5 h-5 text-primary" />
                                                        Cart
                                                    </h3>
                                                    {cart.length > 0 && (
                                                        <Badge variant="secondary" className="text-sm">
                                                            {cartCount} items
                                                        </Badge>
                                                    )}
                                                </div>

                                                {cart.length === 0 ? (
                                                    <div className="text-center py-8">
                                                        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                                                            <ShoppingCart className="w-8 h-8 text-muted-foreground/50" />
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">Cart is empty</p>
                                                        <p className="text-xs text-muted-foreground">Add items from the prescription</p>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <ScrollArea className="max-h-[300px] pr-2">
                                                            <div className="space-y-2">
                                                                {cart.map(item => (
                                                                    <div key={item.id} className="flex justify-between text-sm py-1 border-b border-border/30">
                                                                        <div className="flex-1 min-w-0">
                                                                            <p className="font-medium truncate">{item.name}</p>
                                                                            <p className="text-xs text-muted-foreground">
                                                                                × {item.pivot?.quantity || 0} • {formatCurrency(item.amount || 0)} each
                                                                            </p>
                                                                        </div>
                                                                        <span className="font-semibold ml-3">
                                                                    {formatCurrency((parseFloat(item.amount) || 0) * (parseInt(item.pivot?.quantity) || 0))}
                                                                </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </ScrollArea>

                                                        <Separator className="my-4" />

                                                        <div className="space-y-2">
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-muted-foreground">Subtotal</span>
                                                                <span>{formatCurrency(cartTotal)}</span>
                                                            </div>
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-muted-foreground">Discount</span>
                                                                <span className="text-green-600">₦0</span>
                                                            </div>
                                                            <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                                                <span>Total</span>
                                                                <span className="text-primary">{formatCurrency(cartTotal)}</span>
                                                            </div>
                                                        </div>

                                                        <Separator className="my-4" />

                                                        <div className="space-y-3">
                                                            <div>
                                                                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                                                                    Payment Method
                                                                </label>
                                                                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                                                    <SelectTrigger className="w-full">
                                                                        <SelectValue placeholder="Select payment method" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {PAYMENT_METHODS.map(m => (
                                                                            <SelectItem key={m.value} value={m.value}>
                                                                                <div className="flex items-center gap-2">
                                                                                    {m.value === 'cash' && <Wallet className="w-4 h-4" />}
                                                                                    {m.value === 'card' && <CreditCard className="w-4 h-4" />}
                                                                                    {m.value === 'insurance' && <Building2 className="w-4 h-4" />}
                                                                                    {m.label}
                                                                                </div>
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>

                                                            <div className="flex gap-2">
                                                                <Button
                                                                    variant="outline"
                                                                    className="flex-1"
                                                                    onClick={clearCart}
                                                                >
                                                                    Clear
                                                                </Button>
                                                                <Button
                                                                    className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                                                                    size="lg"
                                                                    disabled={cart.length === 0 || isProcessing}
                                                                    onClick={() => setShowPayment(true)}
                                                                >
                                                                    {isProcessing ? (
                                                                        <>
                                                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                                                            Processing...
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <CheckCircle className="w-4 h-4 mr-2" />
                                                                            Dispense
                                                                        </>
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </Card>
                                        </div>
                                    )
                                }
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


                <DiagnosisDetailModal
                    open={showDiagnosisModal}
                    onOpenChange={setShowDiagnosisModal}
                    diagnosisId={selectedDiagnosisId}
                />


        </div>
    );
};

export default DrugDispensing;