import React, { useState } from 'react';
import { useDrugs } from '@/hooks/useData';
import { formatCurrency, formatDate } from '@/lib/formatters';
import PageHeader from '@/components/common/PageHeader';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

import {
    Search,
    Package,
    AlertTriangle,
    Pill,
    Hourglass,
    Eye,
    HandGrab,
    HandHeart,
    Plus,
    MessageSquare, FileText, Clock, CheckCircle, XCircle, Vegan, NotebookPen
} from 'lucide-react';
import {adminUserManagement, drugStore} from "../../store/store.jsx";
import {toast} from "sonner";
import axiosClient from "../../service/axiosClient.js";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';



const AdminDrugStock = () => {
    const {  getLowStockDrugs, getExpiringDrugs } = useDrugs();
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all');

    const {drugs,lowStock,outOfStock,pendingDrugs, drugRestockRequest,myDrugRestockRequest,pendingDrugRestockRequest,updateDrugRestockRequest} = drugStore()
    const {pendingDrugStock,pendingStockRequest,approvedStockRequest} = adminUserManagement()
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showDetailDialog, setShowDetailDialog] = useState(false);
    const [showRestockDialog, setShowRestockDialog] = useState(false);
    const [showApprovalDialog, setShowApprovalDialog] = useState(false);
    const [showEditDrug, setShowEditDrug] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        drug_id: '',
        quantity: '',
        reason: '',
        priority: 'normal',
        notes: '',
    });


    /*const lowStock = getLowStockDrugs();*/
    const expiring = getExpiringDrugs();

    let displayedDrugs = drugs;
    if (filter === 'low') displayedDrugs = lowStock;
    else if (filter === 'outOfStock') displayedDrugs = outOfStock;
    else if (filter === 'pending') displayedDrugs = pendingDrugStock;
    else if (filter === 'restockRequest') displayedDrugs = approvedStockRequest;
    else if (filter === 'myRequest') displayedDrugs = pendingStockRequest;
    else if (filter === 'pendingRequest') displayedDrugs = pendingStockRequest;

    console.log(approvedStockRequest)
    console.log(pendingStockRequest)

    const filteredDrugs = searchQuery
        ? displayedDrugs.filter(d => d?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || d?.generic?.toLowerCase().includes(searchQuery.toLowerCase())|| d?.drug_stock?.generic?.toLowerCase().includes(searchQuery.toLowerCase())|| d?.drug_stock?.name?.toLowerCase().includes(searchQuery.toLowerCase()))
        : displayedDrugs;

    const getStockStatus =  {
        'outOfStock': {color: 'bg-red-100 text-red-700 border-red-200'},
        'lowStock': {color: 'bg-yellow-100 text-yellow-700 border-yellow-200'} ,
        'inStock' : {color: 'bg-green-100 text-green-700 border-green-200'},
        'pending' : {color: 'bg-blue-100 text-blue-700 border-blue-200'},
        'approved' : {color: 'bg-green-100 text-green-700 border-green-200'},
        'rejected' : {color: 'bg-red-100 text-red-700 border-red-200'},
    };
    console.log(drugRestockRequest)

    const handleDrugEdit = ()=>{

        setIsSubmitting(true);
        try {
            const payload = {
                drugStock_id: selectedRequest.id,
                quantity: parseInt(formData.quantity),
                notes: formData.notes,
                title: formData.title,

            };




            axiosClient.post('/updateDrugStock', formData)
                .then(({data})=>{
                    toast.success('Drug successfully was Updated successfully');
                    setShowAddDialog(false);
                    //updateDrugRestockRequest(data.data)
                    alert(data.message)
                    setFormData({})
                    setShowEditDrug(false)
                })
                .catch(e=> {
                    alert(e)
                    setFormData({})
                })

        } catch (error) {
            console.error('Error submitting request:', error);
            toast.error(error.response?.data?.message || 'Failed to submit request');
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleDrugApproval = ()=>{
        setIsSubmitting(true);
        try {





            axiosClient.post('/approveDrugStock', formData)
                .then(({data})=>{
                    toast.success('Drug successfully was Updated successfully');
                    setShowAddDialog(false);
                    //updateDrugRestockRequest(data.data)
                    alert(data.message)
                    setShowRestockDialog(false)
                    setFormData({})
                })
                .catch(e=> {
                    alert(e)
                    setFormData({})
                })

        } catch (error) {
            console.error('Error submitting request:', error);
            toast.error(error.response?.data?.message || 'Failed to submit request');
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleSubmitRequest = async () => {
        if (!formData.quantity) {
            toast.error('Please select a drug and specify quantity');
            return;
        }




        setIsSubmitting(true);
        try {
            const payload = {
                drugStock_id: selectedRequest.id,
                quantity: parseInt(formData.quantity),
                notes: formData.notes,
                title: formData.title,

            };
            console.log(formData)


            axiosClient.post('/updateRestockRequest', formData)
                .then(({data})=>{
                    toast.success('Drug restock submitted successfully');
                    setShowAddDialog(false);
                    updateDrugRestockRequest(data.data)
                    alert(data.message)
                    setShowRestockDialog(false)
                    setFormData({})
                })
                .catch(e=> {
                    alert(e)
                    setFormData({})
                })

        } catch (error) {
            console.error('Error submitting request:', error);
            toast.error(error.response?.data?.message || 'Failed to submit request');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader title="Drug Stock" subtitle="Inventory management and stock levels" breadcrumb={[{ label: 'Dashboard', path: '/pharmacy' }, { label: 'Drug Stock' }]} actions={<Button>Request Stock</Button>} />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all" onClick={() => setFilter('all')}>
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center"><Package className="w-6 h-6 text-blue-600" /></div>
                    <div className={'flex justify-center items-center flex-col'}><p className="text-2xl font-bold">{drugs.length}</p><p className="text-sm text-muted-foreground">Total Drugs</p></div>
                </Card>
                <Card className="p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all" onClick={() => setFilter('low')}>
                    <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center"><AlertTriangle className="w-6 h-6 text-red-600" /></div>
                    <div className={'flex justify-center items-center flex-col'}><p className="text-2xl font-bold text-red-600">{lowStock.length}</p><p className="text-sm text-muted-foreground">Low Stock</p></div>
                </Card>
                <Card className="p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all" onClick={() => setFilter('outOfStock')}>
                    <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center"><Pill className="w-6 h-6 text-yellow-600" /></div>
                    <div className={'flex justify-center items-center flex-col'}><p className="text-2xl font-bold text-yellow-600">{outOfStock.length}</p><p className="text-sm text-muted-foreground">Out Of Stock</p></div>
                </Card>
                <Card className="p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all" onClick={() => setFilter('pending')}>
                    <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center"><Hourglass className="w-6 h-6 text-yellow-600" /></div>
                    <div className={'flex justify-center items-center flex-col'}><p className="text-2xl font-bold text-yellow-600">{pendingDrugStock.length}</p><p className="text-sm text-center text-muted-foreground">Pending New Drug Approval</p></div>
                </Card>
                <Card className="p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all" onClick={() => setFilter('pendingRequest')}>
                    <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center"><Vegan className="w-6 h-6 text-yellow-600" /></div>
                    <div className={'flex justify-center items-center flex-col'}><p className="text-2xl font-bold text-yellow-600">{pendingStockRequest.length}</p><p className="text-sm text-muted-foreground">Pending Restock Request</p></div>
                </Card>
            </div>

            <Card className="p-4">
                <div className="flex gap-2 mb-4">
                    {['all', 'low', 'outOfStock','pending','restockRequest','pendingRequest'].map(f => (
                        <Button key={f} variant={filter === f ? 'default' : 'outline'} size="sm" onClick={() => setFilter(f)}>
                            {f === 'all' ? 'All' : f === 'low' ? 'Low Stock' : f === 'outOfStock' ? 'outOfStock' : f === 'restockRequest' ? 'restockRequest'  : f=== 'pendingRequest' ? 'pendingRequest'  : 'New Pending Drug'}
                        </Button>
                    ))}
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search drugs..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
                </div>
            </Card>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-muted">
                    {(filter == 'restockRequest' || filter == 'myRequest' || filter == 'pendingRequest') ? (
                        <tr>
                            <th className="text-left p-3 font-medium">Drug Name</th>
                            <th className="text-left p-3 font-medium">Generic</th>
                            <th className="text-left p-3 font-medium">User</th>
                            <th className="text-left p-3 font-medium">Stock</th>
                            <th className="text-left p-3 font-medium">Price</th>
                            <th className="text-left p-3 font-medium">Expiry</th>
                            <th className="text-left p-3 font-medium">Status</th>
                            {(filter == 'low' || filter == 'outOfStock') && (
                                <th className="text-left p-3 font-medium">Restock</th>
                            )}
                        </tr>
                    ) : (
                        <tr>
                            <th className="text-left p-3 font-medium">Drug Name</th>
                            <th className="text-left p-3 font-medium">Generic</th>
                            <th className="text-left p-3 font-medium">Category</th>
                            <th className="text-left p-3 font-medium">Stock</th>
                            <th className="text-left p-3 font-medium">Price</th>
                            <th className="text-left p-3 font-medium">Expiry</th>
                            <th className="text-left p-3 font-medium">Status</th>
                            {(filter == 'pending' || filter == 'outOfStock') && (
                                <th className="text-left p-3 font-medium">Restock</th>
                            )}
                        </tr>
                    )}

                    </thead>

                    {(filter == 'restockRequest' || filter == 'myRequest' || filter == 'pendingRequest') ? (
                        <tbody>
                        {filteredDrugs.length > 0 && filteredDrugs?.map(drug => {
                            const status = getStockStatus[drug?.status];
                            return (
                                <tr key={drug.drugId} className="border-b hover:bg-muted/50 transition-colors">
                                    <td onClick={(e)=>{
                                        e.stopPropagation();
                                        setSelectedRequest(drug);
                                        setShowDetailDialog(true);
                                    }} className="p-3 font-medium">{drug.drug_stock.name}</td>
                                    <td className="p-3 text-muted-foreground">{drug.drug_stock.generic}</td>
                                    <td className="p-3"><Badge variant="outline" className="text-xs">{drug.user.name}</Badge></td>
                                    <td className="p-3">{drug.quantity} units</td>
                                    <td className="p-3">{drug?.drug_stock.amount ? drug.drug_stock.amount.toLocaleString() : 0}</td>
                                    <td className="p-3">{formatDate(drug.expiry_date_range)}</td>
                                    <td className="p-3"><span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${status.color}`}>{drug.status}</span></td>
                                    {(drug.status == 'pending' ) && (
                                        <td className="p-3">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedRequest(drug);
                                                    setShowRestockDialog(true)
                                                    setFormData(drug)
                                                }}
                                            >
                                                Edit <HandHeart className="w-4 h-4" />
                                            </Button>
                                        </td>

                                    )}
                                </tr>
                            );
                        })}
                        </tbody>
                    ) : (
                        <tbody>
                        {filteredDrugs?.map(drug => {
                            const status = getStockStatus[drug?.status];
                            return (
                                <tr key={drug.drugId} className="border-b hover:bg-muted/50 transition-colors">
                                    <td onClick={(e)=>{
                                        e.stopPropagation();
                                        setSelectedRequest(drug);
                                        setShowDetailDialog(true);
                                    }} className="p-3 font-medium">{drug.name}</td>
                                    <td className="p-3 text-muted-foreground">{drug.generic}</td>
                                    <td className="p-3"><Badge variant="outline" className="text-xs">{drug.category}</Badge></td>
                                    <td className="p-3">{drug.quantity} units</td>
                                    <td className="p-3">{drug?.amount ? drug.amount.toLocaleString() : 0}</td>
                                    <td className="p-3">{formatDate(drug.expiry_date_range)}</td>
                                    <td className="p-3"><span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${status.color}`}>{drug.status}</span></td>
                                    {(drug.status == 'pending' )&& (
                                        <td className="p-3">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedRequest(drug);
                                                    setShowRestockDialog(true)
                                                    setFormData(drug)
                                                }}
                                            >Approve
                                                <HandHeart className="w-4 h-4" />
                                            </Button>
                                        </td>

                                    )}
                                    {(drug.status == 'inStock' || drug.status == 'lowStock' || drug.status == 'outOfStock') && (
                                        <td className="p-3">
                                            <Button
                                                variant="default"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedRequest(drug);
                                                    setShowEditDrug(true)
                                                    setFormData(drug)
                                                }}
                                            >
                                                Edit
                                                <HandHeart className="w-4 h-4" />
                                            </Button>
                                        </td>

                                    )}
                                </tr>
                            );
                        })}
                        </tbody>

                    )}


                </table>
                {filteredDrugs.length === 0 && <p className="text-center text-muted-foreground py-8">No drugs found</p>}
            </div>


            <Dialog open={showAddDialog} onOpenChange={(open) => {
                setShowAddDialog(open);
                if (!open) resetForm();
            }}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Plus className="w-5 h-5 text-primary" />
                            Restock {selectedRequest?.name}
                        </DialogTitle>
                        <DialogDescription>
                            Request additional stock for a drug
                        </DialogDescription>
                    </DialogHeader>

                    <ScrollArea className="flex-1 pr-4">
                        <div className="space-y-4 py-4">
                            {/* <div>
                                <Label className="text-sm font-medium">Select Drug *</Label>
                                <Select
                                    value={formData.drug_id}
                                    onValueChange={(value) => setFormData({ ...formData, drug_id: value })}
                                >
                                    <SelectTrigger className="mt-1.5">
                                        <SelectValue placeholder="Search and select a drug..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {drugs.map((drug) => (
                                            <SelectItem key={drug.id} value={drug.id.toString()}>
                                                <div className="flex items-center gap-2">
                                                    <span>{drug.name}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        (Stock: {drug.quantity})
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>*/}

                            <div>
                                <Label className="text-sm font-medium">Drug Name </Label>
                                <Input

                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter Drug Name"
                                    className="mt-1.5"
                                />
                            </div>
                            <div>
                                <Label className="text-sm font-medium">Generic Name </Label>
                                <Input

                                    value={formData.generic}
                                    onChange={(e) => setFormData({ ...formData, generic: e.target.value })}
                                    placeholder="Enter Drug Name"
                                    className="mt-1.5"
                                />
                            </div>

                            <div>
                                <Label className="text-sm font-medium">Quantity *</Label>
                                <Input
                                    type="number"
                                    min="1"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    placeholder="Enter quantity needed"
                                    className="mt-1.5"
                                />
                            </div>

                            {/* <div>
                                <Label className="text-sm font-medium">Priority</Label>
                                <Select
                                    value={formData.priority}
                                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                                >
                                    <SelectTrigger className="mt-1.5">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="urgent">
                                            <span className="text-red-600">🔴 Urgent</span>
                                        </SelectItem>
                                        <SelectItem value="high">
                                            <span className="text-orange-600">🟠 High</span>
                                        </SelectItem>
                                        <SelectItem value="normal">
                                            <span className="text-blue-600">🔵 Normal</span>
                                        </SelectItem>
                                        <SelectItem value="low">
                                            <span className="text-gray-600">⚪ Low</span>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
*/}
                            <div>
                                <Label className="text-sm font-medium">Description</Label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Why is this request needed?"
                                    className="mt-1.5 min-h-[80px]"
                                />
                            </div>

                            {/*<div>
                                <Label className="text-sm font-medium">Additional Notes</Label>
                                <Textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    placeholder="Any additional information..."
                                    className="mt-1.5 min-h-[80px]"
                                />
                            </div>*/}
                        </div>
                    </ScrollArea>

                    <DialogFooter className="border-t pt-4 flex-shrink-0">
                        <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmitRequest}
                            disabled={isSubmitting || !formData.name || !formData.quantity}
                            className="bg-gradient-to-r from-primary to-primary/80"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                    Submitting...
                                </>
                            ) : (
                                'Submit Request'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                    {selectedRequest && (
                        <>
                            <DialogHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <DialogTitle className="flex items-center gap-2">
                                            <Package className="w-5 h-5 text-primary" />
                                            Request Details
                                        </DialogTitle>
                                        <DialogDescription>
                                            Request #{selectedRequest.id} • {formatDate(selectedRequest.created_at)}
                                        </DialogDescription>
                                    </div>
                                    {/* <Badge className={`text-xs ${getStatusConfig(selectedRequest.status).color}`}>
                                        <span className="flex items-center gap-1">
                                            {getStatusConfig(selectedRequest.status).icon}
                                          {getStatusConfig(selectedRequest.status).label}
                                        </span>
                      </Badge>*/}
                                </div>
                            </DialogHeader>

                            <ScrollArea className="flex-1 pr-4">
                                <div className="space-y-6 py-4">
                                    {/* Drug Info */}
                                    <Card className="p-4 bg-muted/30">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-muted-foreground">Drug Name</p>
                                                <p className="font-semibold text-lg">
                                                    {selectedRequest.name ?? selectedRequest.drug_stock.name ?? 'N/A'}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {selectedRequest.generic ?? selectedRequest.drug_stock.generic ??'N/A'}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-muted-foreground">Requested Quantity</p>
                                                <p className="font-bold text-2xl text-primary">
                                                    {selectedRequest.quantity}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Current Stock: {selectedRequest.drug_stock?.quantity || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </Card>

                                    {/* Request Details */}
                                    {/*<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Card className="p-4">
                                            <p className="text-xs text-muted-foreground">Requested By</p>
                                            <p className="font-medium flex items-center gap-2">
                                                <User className="w-4 h-4 text-muted-foreground" />
                                                {selectedRequest.requested_by_name || 'Unknown'}
                                            </p>
                                        </Card>
                                        <Card className="p-4">
                                            <p className="text-xs text-muted-foreground">Priority</p>
                                            <Badge className={`mt-1 ${getPriorityConfig(selectedRequest.priority).color}`}>
                                                {getPriorityConfig(selectedRequest.priority).label}
                                            </Badge>
                                        </Card>
                                    </div>*/}

                                    {/* Reason & Notes */}

                                    <Card className="p-4">
                                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4" />
                                            Description
                                        </p>
                                        <p className="text-sm mt-1">{selectedRequest.description ?? selectedRequest.drug_stock.description}</p>
                                    </Card>


                                    {selectedRequest.notes && (
                                        <Card className="p-4">
                                            <p className="text-xs text-muted-foreground flex items-center gap-2">
                                                <FileText className="w-4 h-4" />
                                                Additional Notes
                                            </p>
                                            <p className="text-sm mt-1">{selectedRequest.notes}</p>
                                        </Card>
                                    )}

                                    {/* Timeline */}
                                    <Card className="p-4">
                                        <p className="text-xs text-muted-foreground mb-3">Timeline</p>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <Clock className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">Request Created</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatDate(selectedRequest.created_at)}
                                                    </p>
                                                </div>
                                            </div>
                                            {selectedRequest.updated_at !== selectedRequest.created_at && (
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                        selectedRequest.status === 'approved'
                                                            ? 'bg-green-100'
                                                            : selectedRequest.status === 'rejected'
                                                                ? 'bg-red-100'
                                                                : 'bg-yellow-100'
                                                    }`}>
                                                        {selectedRequest.status === 'approved' && (
                                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                                        )}
                                                        {selectedRequest.status === 'rejected' && (
                                                            <XCircle className="w-4 h-4 text-red-600" />
                                                        )}
                                                        {selectedRequest.status === 'pending' && (
                                                            <Clock className="w-4 h-4 text-yellow-600" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium">Status Updated</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {formatDate(selectedRequest.updated_at)}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                </div>
                            </ScrollArea>

                            {/* Actions */}
                            <DialogFooter className="border-t pt-4 flex-shrink-0 flex-wrap gap-2">
                                {/* {selectedRequest.status === 'pending' && (
                                    <>
                                        <Button
                                            variant="outline"
                                            className="border-red-200 text-red-600 hover:bg-red-50"
                                            onClick={() => handleStatusUpdate(selectedRequest.id, 'rejected')}
                                        >
                                            <XCircle className="w-4 h-4 mr-1" />
                                            Reject
                                        </Button>
                                        <Button
                                            className="bg-green-600 hover:bg-green-700"
                                            onClick={() => handleStatusUpdate(selectedRequest.id, 'approved')}
                                        >
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            Approve
                                        </Button>
                                    </>
                                )}*/}
                                <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
                                    Close
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>






            <Dialog open={showApprovalDialog} onOpenChange={()=>{ setShowApprovalDialog(false); setFormData({})}}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                    {selectedRequest && (
                        <>
                            <DialogHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <DialogTitle className="flex items-center gap-2">
                                            <Package className="w-5 h-5 text-primary" />
                                            {selectedRequest.name} Details
                                        </DialogTitle>
                                        <DialogDescription>
                                            Request #{selectedRequest.id} • {formatDate(selectedRequest.created_at)}
                                        </DialogDescription>
                                    </div>
                                    {/* <Badge className={`text-xs ${getStatusConfig(selectedRequest.status).color}`}>
                                        <span className="flex items-center gap-1">
                                            {getStatusConfig(selectedRequest.status).icon}
                                          {getStatusConfig(selectedRequest.status).label}
                                        </span>
                      </Badge>*/}
                                </div>
                            </DialogHeader>

                            <ScrollArea className="flex-1 pr-4">
                                <div className="space-y-6 py-4">
                                    {/* Drug Info */}
                                    <Card className="p-4 bg-muted/30">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-muted-foreground">Drug Name</p>
                                                <p className="font-semibold text-lg">
                                                    {selectedRequest.name ?? selectedRequest.drug_stock.name ?? 'N/A'}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {selectedRequest.generic ?? selectedRequest.drug_stock.generic ??'N/A'}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-muted-foreground"> Quantity</p>
                                                {/*<p className="font-bold text-2xl text-primary">
                              {selectedRequest.quantity}
                            </p>*/}
                                                <p className="text-xs text-muted-foreground">
                                                    Requested Stock: {selectedRequest.quantity || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </Card>

                                    {/* Request Details */}
                                    {/*<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Card className="p-4">
                                            <p className="text-xs text-muted-foreground">Requested By</p>
                                            <p className="font-medium flex items-center gap-2">
                                                <User className="w-4 h-4 text-muted-foreground" />
                                                {selectedRequest.requested_by_name || 'Unknown'}
                                            </p>
                                        </Card>
                                        <Card className="p-4">
                                            <p className="text-xs text-muted-foreground">Priority</p>
                                            <Badge className={`mt-1 ${getPriorityConfig(selectedRequest.priority).color}`}>
                                                {getPriorityConfig(selectedRequest.priority).label}
                                            </Badge>
                                        </Card>
                                    </div>*/}

                                    {/* Reason & Notes */}


                                    <Card className="p-4">
                                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                                            <NotebookPen className="w-4 h-4" />
                                            Drug Description
                                        </p>
                                        <p className="text-sm mt-1">{selectedRequest.description ?? selectedRequest.drug_stock.description}</p>
                                    </Card>


                                    <div>
                                        <Label className="text-sm font-medium"> Requested Quantity *</Label>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={formData.quantity}
                                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                            placeholder="Enter quantity needed"
                                            className="mt-1.5"
                                        />
                                    </div>

                                    {/*<div>
                                        <Label className="text-sm font-medium">Title *</Label>
                                        <Input

                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="Enter quantity needed"
                                            className="mt-1.5"
                                        />
                                    </div>*/}

                                    <div>
                                        <Label className="text-sm font-medium">Amount *</Label>
                                        <Input

                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                            placeholder="Enter unit price"
                                            className="mt-1.5"
                                        />
                                    </div>


                                </div>
                            </ScrollArea>

                            {/* Actions */}
                            <DialogFooter className="border-t pt-4 flex-shrink-0 flex-wrap gap-2">
                                {/* {selectedRequest.status === 'pending' && (
                                    <>
                                        <Button
                                            variant="outline"
                                            className="border-red-200 text-red-600 hover:bg-red-50"
                                            onClick={() => handleStatusUpdate(selectedRequest.id, 'rejected')}
                                        >
                                            <XCircle className="w-4 h-4 mr-1" />
                                            Reject
                                        </Button>
                                        <Button
                                            className="bg-green-600 hover:bg-green-700"
                                            onClick={() => handleStatusUpdate(selectedRequest.id, 'approved')}
                                        >
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            Approve
                                        </Button>
                                    </>
                                )}*/}
                                <Button variant="primary" onClick={() => {
                                    setShowRestockDialog(false)
                                    setFormData({})
                                }}>
                                    cancel
                                </Button>
                                <Button variant="secondary" onClick={() => handleDrugApproval()}>
                                    Approve
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>


            <Dialog open={showRestockDialog} onOpenChange={()=>{ setShowRestockDialog(false); setFormData({})}}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                    {selectedRequest && (
                        <>
                            <DialogHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <DialogTitle className="flex items-center gap-2">
                                            <Package className="w-5 h-5 text-primary" />
                                            {selectedRequest.name} Details
                                        </DialogTitle>
                                        <DialogDescription>
                                            Request #{selectedRequest.id} • {formatDate(selectedRequest.created_at)}
                                        </DialogDescription>
                                    </div>
                                    {/* <Badge className={`text-xs ${getStatusConfig(selectedRequest.status).color}`}>
                                        <span className="flex items-center gap-1">
                                            {getStatusConfig(selectedRequest.status).icon}
                                          {getStatusConfig(selectedRequest.status).label}
                                        </span>
                      </Badge>*/}
                                </div>
                            </DialogHeader>

                            <ScrollArea className="flex-1 pr-4">
                                <div className="space-y-6 py-4">
                                    {/* Drug Info */}
                                    <Card className="p-4 bg-muted/30">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-muted-foreground">Drug Name</p>
                                                <p className="font-semibold text-lg">
                                                    {selectedRequest.name ?? selectedRequest.drug_stock.name ?? 'N/A'}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {selectedRequest.generic ?? selectedRequest.drug_stock.generic ??'N/A'}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-muted-foreground"> Quantity</p>
                                                {/*<p className="font-bold text-2xl text-primary">
                              {selectedRequest.quantity}
                            </p>*/}
                                                <p className="text-xs text-black">
                                                    Current Stock: {selectedRequest.drug_stock.quantity || 'N/A'}
                                                </p>
                                                <p className="text-xs  text-primary">
                                                    Requested Stock: {selectedRequest.quantity || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </Card>

                                    {/* Request Details */}
                                    {/*<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Card className="p-4">
                                            <p className="text-xs text-muted-foreground">Requested By</p>
                                            <p className="font-medium flex items-center gap-2">
                                                <User className="w-4 h-4 text-muted-foreground" />
                                                {selectedRequest.requested_by_name || 'Unknown'}
                                            </p>
                                        </Card>
                                        <Card className="p-4">
                                            <p className="text-xs text-muted-foreground">Priority</p>
                                            <Badge className={`mt-1 ${getPriorityConfig(selectedRequest.priority).color}`}>
                                                {getPriorityConfig(selectedRequest.priority).label}
                                            </Badge>
                                        </Card>
                                    </div>*/}

                                    {/* Reason & Notes */}


                                    <Card className="p-4">
                                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                                            <NotebookPen className="w-4 h-4" />
                                            Drug Description
                                        </p>
                                        <p className="text-sm mt-1">{selectedRequest.description ?? selectedRequest.drug_stock.description}</p>
                                    </Card>


                                    <div>
                                        <Label className="text-sm font-medium"> Requested Quantity *</Label>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={formData.quantity}
                                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                            placeholder="Enter quantity needed"
                                            className="mt-1.5"
                                        />
                                    </div>

                                    {/*<div>
                                        <Label className="text-sm font-medium">Title *</Label>
                                        <Input

                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="Enter quantity needed"
                                            className="mt-1.5"
                                        />
                                    </div>*/}

                                    <div>
                                        <Label className="text-sm font-medium">Amount *</Label>
                                        <Input

                                            value={formData?.drug_stock?.amount}
                                            onChange={(e) => setFormData({ ...formData, drug_stock:{...formData.drug_stock, amount: e.target.value }})}
                                            placeholder="Enter unit price"
                                            className="mt-1.5"
                                        />
                                    </div>


                                </div>
                            </ScrollArea>

                            {/* Actions */}
                            <DialogFooter className="border-t pt-4 flex-shrink-0 flex-wrap gap-2">
                                {/* {selectedRequest.status === 'pending' && (
                                    <>
                                        <Button
                                            variant="outline"
                                            className="border-red-200 text-red-600 hover:bg-red-50"
                                            onClick={() => handleStatusUpdate(selectedRequest.id, 'rejected')}
                                        >
                                            <XCircle className="w-4 h-4 mr-1" />
                                            Reject
                                        </Button>
                                        <Button
                                            className="bg-green-600 hover:bg-green-700"
                                            onClick={() => handleStatusUpdate(selectedRequest.id, 'approved')}
                                        >
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            Approve
                                        </Button>
                                    </>
                                )}*/}
                                <Button variant="primary" onClick={() => {
                                    setShowRestockDialog(false)
                                    setFormData({})
                                }}>
                                    cancel
                                </Button>
                                <Button variant="secondary" onClick={() => handleSubmitRequest()}>
                                    Approve
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={showEditDrug} onOpenChange={()=>{ setShowEditDrug(false); }}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                    {selectedRequest && (
                        <>
                            <DialogHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <DialogTitle className="flex items-center gap-2">
                                            <Package className="w-5 h-5 text-primary" />
                                            {selectedRequest.name} Details
                                        </DialogTitle>
                                        <DialogDescription>
                                            Request #{selectedRequest.id} • {formatDate(selectedRequest.created_at)}
                                        </DialogDescription>
                                    </div>
                                    {/* <Badge className={`text-xs ${getStatusConfig(selectedRequest.status).color}`}>
                                        <span className="flex items-center gap-1">
                                            {getStatusConfig(selectedRequest.status).icon}
                                          {getStatusConfig(selectedRequest.status).label}
                                        </span>
                      </Badge>*/}
                                </div>
                            </DialogHeader>

                            <ScrollArea className="flex-1 pr-4">
                                <div className="space-y-6 py-4">
                                    {/* Drug Info */}
                                    <Card className="p-4 bg-muted/30">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-muted-foreground">Drug Name</p>
                                                {/*<p className="font-semibold text-lg">
                                                    {selectedRequest.name ?? selectedRequest.drug_stock.name ?? 'N/A'}
                                                </p>*/}
                                                <Input

                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    placeholder="Enter quantity needed"
                                                    className="mt-1.5"
                                                />
                                                <Input

                                                    value={formData.generic}
                                                    onChange={(e) => setFormData({ ...formData, generic: e.target.value })}
                                                    placeholder="Enter generic Name"
                                                    className="mt-1.5"
                                                />
                                               {/* <p className="text-sm text-muted-foreground">
                                                    {selectedRequest.generic ?? selectedRequest.drug_stock.generic ??'N/A'}
                                                </p>*/}
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-muted-foreground"> Quantity</p>
                                                {/*<p className="font-bold text-2xl text-primary">
                              {selectedRequest.quantity}
                            </p>*/}
                                                <p className="text-xs text-muted-foreground">
                                                    Requested Stock: {selectedRequest.quantity || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </Card>

                                    {/* Request Details */}
                                    {/*<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Card className="p-4">
                                            <p className="text-xs text-muted-foreground">Requested By</p>
                                            <p className="font-medium flex items-center gap-2">
                                                <User className="w-4 h-4 text-muted-foreground" />
                                                {selectedRequest.requested_by_name || 'Unknown'}
                                            </p>
                                        </Card>
                                        <Card className="p-4">
                                            <p className="text-xs text-muted-foreground">Priority</p>
                                            <Badge className={`mt-1 ${getPriorityConfig(selectedRequest.priority).color}`}>
                                                {getPriorityConfig(selectedRequest.priority).label}
                                            </Badge>
                                        </Card>
                                    </div>*/}

                                    {/* Reason & Notes */}


                                    <Card className="p-4">
                                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                                            <NotebookPen className="w-4 h-4" />
                                            Drug Description
                                        </p>
                                        <Input

                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Enter quantity needed"
                                            className="mt-1.5"
                                        />
                                        {/*<p className="text-sm mt-1">{selectedRequest.description ?? selectedRequest.drug_stock.description}</p>*/}
                                    </Card>


                                    <div>
                                        <Label className="text-sm font-medium">Quantity *</Label>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={formData.quantity }
                                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                            placeholder={`Requested Quantity : ${selectedRequest.quantity}`}
                                            className="mt-1.5"
                                        />
                                    </div>

                                   {/* <div>
                                        <Label className="text-sm font-medium">Title *</Label>
                                        <Input

                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="Enter quantity needed"
                                            className="mt-1.5"
                                        />
                                    </div>*/}

                                    <div>
                                        <Label className="text-sm font-medium">Price *</Label>
                                        <Input

                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                            placeholder="Enter quantity needed"
                                            className="mt-1.5"
                                        />
                                    </div>


                                </div>
                            </ScrollArea>

                            {/* Actions */}
                            <DialogFooter className="border-t pt-4 flex-shrink-0 flex-wrap gap-2">
                                {/* {selectedRequest.status === 'pending' && (
                                    <>
                                        <Button
                                            variant="outline"
                                            className="border-red-200 text-red-600 hover:bg-red-50"
                                            onClick={() => handleStatusUpdate(selectedRequest.id, 'rejected')}
                                        >
                                            <XCircle className="w-4 h-4 mr-1" />
                                            Reject
                                        </Button>
                                        <Button
                                            className="bg-green-600 hover:bg-green-700"
                                            onClick={() => handleStatusUpdate(selectedRequest.id, 'approved')}
                                        >
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            Approve
                                        </Button>
                                    </>
                                )}*/}
                                <Button variant="primary" onClick={() => {
                                    setShowEditDrug(false)
                                    setFormData({})
                                }}>
                                    cancel
                                </Button>
                                <Button variant="outline" onClick={() => handleDrugEdit()}>
                                    Update Drug
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>


        </div>
    );
};

export default AdminDrugStock;