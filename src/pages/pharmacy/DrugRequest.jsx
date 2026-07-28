import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatDate } from '@/lib/formatters';
import PageHeader from '@/components/common/PageHeader';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
    Package,
    AlertTriangle,
    Pill,
    Hourglass,
    Plus,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    Calendar,
    User,
    FileText,
    MessageSquare,
    Filter,
    ArrowUpDown,
    Download,
    Printer,
    RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { drugStore } from '../../store/store.jsx';
import axiosClient from '../../service/axiosClient.js';

const DrugRequestPage = () => {
    const navigate = useNavigate();
    const { drugs,pendingDrugs } = drugStore();
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all');
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showDetailDialog, setShowDetailDialog] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state for new request
    const [formData, setFormData] = useState({
        drug_id: '',
        quantity: '',
        reason: '',
        priority: 'normal',
        notes: '',
    });

    // Fetch requests
    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = () => {
        setIsLoading(true);
        axiosClient.get('/api/drug-requests')
            .then(({ data }) => {
                setRequests(data.data || []);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching requests:', error);
                toast.error('Failed to load drug requests');
                setIsLoading(false);
            });
    };

    // Filter requests
    let displayedRequests = pendingDrugs;
  /*  if (filter === 'pending') {
        displayedRequests = requests.filter(r => r.status === 'pending');
    } else if (filter === 'approved') {
        displayedRequests = requests.filter(r => r.status === 'approved');
    } else if (filter === 'rejected') {
        displayedRequests = requests.filter(r => r.status === 'rejected');
    } else if (filter === 'my') {
        // Filter by current user
        displayedRequests = requests.filter(r => r.requested_by === 'current_user_id');
    }
*/
    const filteredRequests = searchQuery
        ? displayedRequests.filter(r =>
            r.name?.toLowerCase().includes(searchQuery.toLowerCase()) /*||
            r.drug?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.id?.toString().includes(searchQuery) ||
            r.requested_by_name?.toLowerCase().includes(searchQuery.toLowerCase())*/
        )
        : displayedRequests;

    // Status configurations
    const getStatusConfig = (status) => {
        const configs = {
            pending: {
                label: 'Pending',
                color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
                icon: <Clock className="w-4 h-4" />,
            },
            approved: {
                label: 'Approved',
                color: 'bg-green-100 text-green-700 border-green-200',
                icon: <CheckCircle className="w-4 h-4" />,
            },
            rejected: {
                label: 'Rejected',
                color: 'bg-red-100 text-red-700 border-red-200',
                icon: <XCircle className="w-4 h-4" />,
            },
        };
        return configs[status] || configs.pending;
    };

    const getPriorityConfig = (priority) => {
        const configs = {
            urgent: { label: 'Urgent', color: 'bg-red-100 text-red-700 border-red-200' },
            high: { label: 'High', color: 'bg-orange-100 text-orange-700 border-orange-200' },
            normal: { label: 'Normal', color: 'bg-blue-100 text-blue-700 border-blue-200' },
            low: { label: 'Low', color: 'bg-gray-100 text-gray-700 border-gray-200' },
        };
        return configs[priority] || configs.normal;
    };

    // Handle form submission
    const handleSubmitRequest = async () => {
        if (!formData.name || !formData.quantity) {
            toast.error('Please select a drug and specify quantity');
            return;
        }




        setIsSubmitting(true);
        try {
            const payload = {
                name: formData.name,
                quantity: parseInt(formData.quantity),
                description: formData.description,
                generic: formData.generic,
                notes: formData.notes,
            };

             axiosClient.post('/addDrugRequest', payload)
                 .then(({data})=>{
                     toast.success('Drug request submitted successfully');
                     setShowAddDialog(false);
                     alert(data.message)
                     resetForm();
                     fetchRequests();
                 })
                 .catch(e=>alert(e))

        } catch (error) {
            console.error('Error submitting request:', error);
            toast.error(error.response?.data?.message || 'Failed to submit request');
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            drug_id: '',
            quantity: '',
            reason: '',
            priority: 'normal',
            notes: '',
        });
    };

    // Handle status update
    const handleStatusUpdate = async (requestId, status) => {
        try {
            await axiosClient.put(`/api/drug-requests/${requestId}/status`, { status });
            toast.success(`Request ${status} successfully`);
            fetchRequests();
            setShowDetailDialog(false);
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    // Handle print
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <PageHeader
                title="Drug Requests"
                subtitle="Manage and track drug stock requests"
                breadcrumb={[
                    { label: 'Dashboard', path: '/pharmacy' },
                    { label: 'Drug Requests' }
                ]}
                actions={
                    <div className="flex items-center gap-2 flex-wrap">
                        <Button variant="outline" size="sm" onClick={fetchRequests}>
                            <RefreshCw className="w-4 h-4 mr-1" />
                            Refresh
                        </Button>
                        <Button variant="outline" size="sm" onClick={handlePrint}>
                            <Printer className="w-4 h-4 mr-1" />
                            Print
                        </Button>
                        <Button size="sm" onClick={() => setShowAddDialog(true)}>
                            <Plus className="w-4 h-4 mr-1" />
                            New Request
                        </Button>
                    </div>
                }
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card
                    className="p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all"
                    onClick={() => setFilter('all')}
                >
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{pendingDrugs.length}</p>
                        <p className="text-sm text-muted-foreground">Pending Requests</p>
                    </div>
                </Card>
               {/* <Card
                    className="p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all"
                    onClick={() => setFilter('pending')}
                >
                    <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                        <Hourglass className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-yellow-600">
                            {requests.filter(r => r.status === 'pending').length}
                        </p>
                        <p className="text-sm text-muted-foreground">Pending</p>
                    </div>
                </Card>
                <Card
                    className="p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all"
                    onClick={() => setFilter('approved')}
                >
                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-green-600">
                            {requests.filter(r => r.status === 'approved').length}
                        </p>
                        <p className="text-sm text-muted-foreground">Approved</p>
                    </div>
                </Card>
                <Card
                    className="p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all"
                    onClick={() => setFilter('rejected')}
                >
                    <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                        <XCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-red-600">
                            {requests.filter(r => r.status === 'rejected').length}
                        </p>
                        <p className="text-sm text-muted-foreground">Rejected</p>
                    </div>
                </Card>*/}
            </div>

            {/* Filters & Search */}
            <Card className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by drug name, ID, or requester..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                   {/* <div className="flex gap-2 overflow-x-auto pb-1">
                        {['all', 'pending', 'approved', 'rejected'].map(f => (
                            <Button
                                key={f}
                                variant={filter === f ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFilter(f)}
                                className="whitespace-nowrap"
                            >
                                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                            </Button>
                        ))}
                    </div>*/}
                </div>
            </Card>

            {/* Requests Table */}
            <Card className="p-4">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-muted-foreground">Loading requests...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted">
                                <tr>
                                    <th className="text-left p-3 font-medium">Request ID</th>
                                    <th className="text-left p-3 font-medium">Drug</th>
                                    <th className="text-left p-3 font-medium">Quantity</th>
                                    <th className="text-left p-3 font-medium">Generic Name</th>

                                    <th className="text-left p-3 font-medium">Date</th>
                                    <th className="text-left p-3 font-medium">Status</th>
                                    <th className="text-left p-3 font-medium">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredRequests.length > 0 ? (
                                    filteredRequests.map((request) => {
                                        console.log(request)
                                        const statusConfig = getStatusConfig(request.status);
                                        const priorityConfig = getPriorityConfig(request.priority);
                                        return (
                                            <tr
                                                key={request.id}
                                                className="border-b hover:bg-muted/50 transition-colors cursor-pointer"
                                                onClick={() => {
                                                    setSelectedRequest(request);
                                                    setShowDetailDialog(true);
                                                }}
                                            >
                                                <td className="p-3 font-mono font-medium">#{request.id}</td>
                                                <td className="p-3 font-medium">
                                                    {request.name || 'N/A'}
                                                </td>
                                                <td className="p-3">{request.quantity}</td>
                                                <td className="p-3">
                                                    <div className="flex items-center gap-2">
                                                      {/*  <User className="w-3 h-3 text-muted-foreground" />*/}
                                                        {request.generic || 'Unknown'}
                                                    </div>
                                                </td>
                                               {/* <td className="p-3">
                                                    <Badge className={`text-xs ${priorityConfig.color}`}>
                                                        {priorityConfig.label}
                                                    </Badge>
                                                </td>*/}
                                                <td className="p-3 text-muted-foreground">
                                                    {formatDate(request.created_at)}
                                                </td>
                                                <td className="p-3">
                                                    <Badge className={`text-xs ${statusConfig.color}`}>
                                                            <span className="flex items-center gap-1">
                                                                {statusConfig.icon}
                                                                {statusConfig.label}
                                                            </span>
                                                    </Badge>
                                                </td>
                                                <td className="p-3">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedRequest(request);
                                                            setShowDetailDialog(true);
                                                        }}
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center py-12">
                                            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                                            <p className="text-muted-foreground">No requests found</p>
                                            <Button
                                                variant="link"
                                                onClick={() => setShowAddDialog(true)}
                                            >
                                                Create a new request
                                            </Button>
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                            <span>Showing {filteredRequests.length} of {displayedRequests.length} requests</span>
                            <span>Last updated: {new Date().toLocaleString()}</span>
                        </div>
                    </>
                )}
            </Card>

            {/* Add Request Dialog */}
            <Dialog open={showAddDialog} onOpenChange={(open) => {
                setShowAddDialog(open);
                if (!open) resetForm();
            }}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Plus className="w-5 h-5 text-primary" />
                            New Drug Request
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

            {/* Request Details Dialog */}
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
                                    <Badge className={`text-xs ${getStatusConfig(selectedRequest.status).color}`}>
                                        <span className="flex items-center gap-1">
                                            {getStatusConfig(selectedRequest.status).icon}
                                            {getStatusConfig(selectedRequest.status).label}
                                        </span>
                                    </Badge>
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
                                                    {selectedRequest.name || selectedRequest.drug_name || 'N/A'}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {selectedRequest.generic || 'N/A'}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-muted-foreground">Requested Quantity</p>
                                                <p className="font-bold text-2xl text-primary">
                                                    {selectedRequest.quantity}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Current Stock: {selectedRequest.drug?.quantity || 'N/A'}
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
                                            <p className="text-sm mt-1">{selectedRequest.description}</p>
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
        </div>
    );
};

export default DrugRequestPage;