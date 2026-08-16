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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {useNavigate} from 'react-router-dom'
import {
    User,
    Users,
    Mail,
    Phone,
    Calendar,
    UserCircle,
    Stethoscope,
    Pill,
    FlaskConical,
    FileText,
    Clock,
    MapPin,
    Building2,
    Briefcase,
    Award,
    Shield,
    CreditCard,
    Wallet,
    FileCheck,
    Eye,
    Edit,
    Trash2,
    X,
    Printer,
    Download,
    ChevronRight,
    AlertCircle,
    CheckCircle2,
    Clock as ClockIcon,
    CalendarDays,
    UserRound,
    MessageSquare,
    FileSignature,
    Plus,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import StatusBadge from '@/components/common/StatusBadge';
import { toast } from 'sonner';
import axiosClient from "../../service/axiosClient.js";

const StaffDetailModal = ({ open, onOpenChange, staffId, staffData }) => {
    const [staff, setStaff] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const navigate = useNavigate()

    // Mock data - replace with API call
    useEffect(() => {
        if (open && staffId) {
            setIsLoading(true);
            // Simulate API call
            setTimeout(() => {
                const data = staffData || {
                    id: staffId,
                    user_id: 1,
                    user: {
                        id: 1,
                        name: 'Dr. Sarah Johnson',
                        email: 'sarah.johnson@hospital.com',
                        phone_no: '08023456789',
                        regID: 'DOC001',
                        profile_image: 'doctor1.png',
                        user_role: 'doctor',
                        suspend: '0',
                        email_verified_at: '2026-01-15T10:30:00.000000Z',
                        created_at: '2025-06-14T11:06:45.000000Z',
                    },
                    role_data: {
                        license_id: 'LIC001',
                        level: 'Senior Consultant',
                        specialization: 'Cardiology',
                        leave_days: '20',
                    },
                    role_type: 'doctor',
                    statistics: {
                        total_patients: 156,
                        total_consultations: 423,
                        total_diagnoses: 389,
                        total_prescriptions: 215,
                        pending_tasks: 8,
                        completed_tasks: 412,
                        average_rating: 4.8,
                    },
                    recent_activities: [
                        {
                            id: 1,
                            type: 'consultation',
                            description: 'Consulted with patient John Doe',
                            date: '2026-07-15T10:30:00.000000Z',
                            status: 'completed',
                        },
                        {
                            id: 2,
                            type: 'diagnosis',
                            description: 'Diagnosed patient Jane Smith with Hypertension',
                            date: '2026-07-15T09:15:00.000000Z',
                            status: 'completed',
                        },
                        {
                            id: 3,
                            type: 'prescription',
                            description: 'Prescribed medication for patient Robert Brown',
                            date: '2026-07-14T16:45:00.000000Z',
                            status: 'pending',
                        },
                    ],
                    leave_applications: [
                        {
                            id: 1,
                            days_requested: '5',
                            resumption_date: '2026-08-20',
                            remark: 'Family vacation',
                            status: 'approved',
                            created_at: '2026-07-10T14:20:00.000000Z',
                        },
                        {
                            id: 2,
                            days_requested: '2',
                            resumption_date: '2026-08-25',
                            remark: 'Personal appointment',
                            status: 'pending',
                            created_at: '2026-07-18T09:00:00.000000Z',
                        },
                    ],
                    salary: {
                        amount: 250000,
                        allowances: [
                            { name: 'Housing Allowance', amount: 50000 },
                            { name: 'Transport Allowance', amount: 20000 },
                            { name: 'Medical Allowance', amount: 15000 },
                        ],
                        total: 335000,
                    },
                    attendance: {
                        present: 18,
                        absent: 2,
                        leave: 1,
                        total_days: 21,
                    },
                };
                setStaff(data);
                setIsLoading(false);
            }, 800);
        }
    }, [open, staffId, staffData]);

    const getRoleIcon = (role) => {
        const icons = {
            doctor: <Stethoscope className="w-5 h-5" />,
            nurse: <User className="w-5 h-5" />,
            labScientist: <FlaskConical className="w-5 h-5" />,
            pharmasist: <Pill className="w-5 h-5" />,
            clerk: <FileText className="w-5 h-5" />,
            accountant: <Wallet className="w-5 h-5" />,
            admin: <Shield className="w-5 h-5" />,
        };
        return icons[role] || <User className="w-5 h-5" />;
    };

    const getRoleColor = (role) => {
        const colors = {
            doctor: 'bg-blue-100 text-blue-700 border-blue-200',
            nurse: 'bg-green-100 text-green-700 border-green-200',
            labScientist: 'bg-purple-100 text-purple-700 border-purple-200',
            pharmasist: 'bg-orange-100 text-orange-700 border-orange-200',
            clerk: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            accountant: 'bg-red-100 text-red-700 border-red-200',
            admin: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        };
        return colors[role] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    const getStatusColor = (status) => {
        const colors = {
            approved: 'bg-green-100 text-green-700 border-green-200',
            pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            rejected: 'bg-red-100 text-red-700 border-red-200',
            completed: 'bg-green-100 text-green-700 border-green-200',
            active: 'bg-blue-100 text-blue-700 border-blue-200',
            inactive: 'bg-gray-100 text-gray-700 border-gray-200',
        };
        return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
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

    const handleSuspension = ()=>{
        if (staff.user_role == 'admin'){
            alert('you Cannot suspend a fellow administrator')
            return;
        }
        const payload = {
           user_id: staff.id,
           suspend: staff.suspend == '0' ? 1 : 0
        }
        console.log(payload)

        axiosClient.post('/updateSuspension',payload)
            .then(({data})=>{
                console.log(data)
                setStaff((prev)=>{
                    return {...prev, suspend: data.data?.suspend}
                })
            })
    }

    const handleDelete = ()=>{
        if (staff.user_role == 'admin'){
            alert('you Cannot delete a fellow administrator')
            return;
        }
        const payload = {
            user_id: staff.id,

        }
        console.log(payload)

        axiosClient.post('/deleteUser',payload)
            .then(({data})=>{
                console.log(data)

            })
    }

    if (isLoading) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] overflow-hidden p-0">
                    <div className="flex items-center justify-center h-[400px]">
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-muted-foreground">Loading staff details...</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    if (!staff) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] overflow-hidden p-0">
                    <div className="flex items-center justify-center h-[300px]">
                        <div className="text-center">
                            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <p className="text-lg font-semibold">Staff Not Found</p>
                            <p className="text-sm text-muted-foreground">The staff member you're looking for doesn't exist.</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    const roleType = staff.role_type || staff.user?.user_role || 'staff';

    console.log(staff)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-5xl w-full max-h-[90vh] overflow-hidden p-0 flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b flex-shrink-0 bg-muted/10">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-primary/10">
                                <UserCircle className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold flex items-center gap-3">
                                    {staff.name || 'Staff Member'}
                                    <Badge className={cn("text-xs font-medium", getRoleColor(roleType))}>
                                        {roleType.charAt(0).toUpperCase() + roleType.slice(1)}
                                    </Badge>
                                    {staff.suspend === '1' && (
                                        <Badge variant="destructive" className="text-xs">
                                            Suspended
                                        </Badge>
                                    )}
                                </DialogTitle>
                                <DialogDescription className="text-sm text-muted-foreground mt-1">
                                    Staff ID: {staff.regID || 'N/A'} •
                                    {staff.role_data?.specialization || staff.role_data?.level || 'Staff Member'}
                                </DialogDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={()=>{
                                navigate('/admin/editStaff', { state: { staffData: staff } })
                            }}>
                                <Edit className="w-4 h-4 mr-1" />
                                Edit Details
                            </Button>
                            <Button variant="outline" size="sm" onClick={()=>{handleSuspension()}}>
                                <Edit className="w-4 h-4 mr-1" />
                                {staff?.suspend === '0' ? 'Suspend User' : 'UnSuspend User'}
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleDelete}>
                                <Trash2 className="w-4 h-4" />
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

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 overflow-hidden">
                    <div className="px-6 pt-4 flex-shrink-0">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="overview" className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Overview
                            </TabsTrigger>
                            <TabsTrigger value="activities" className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Activities
                            </TabsTrigger>
                            <TabsTrigger value="leave" className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Leave
                            </TabsTrigger>
                            <TabsTrigger value="salary" className="flex items-center gap-2">
                                <Wallet className="w-4 h-4" />
                                Salary
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <ScrollArea className="flex-1 px-6 py-4">
                        {/* Overview Tab */}
                        <TabsContent value="overview" className="mt-0 space-y-6">
                            {/* Quick Stats */}
                           {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <Card className="p-4 bg-muted/30">
                                    <p className="text-xs text-muted-foreground">Total Patients</p>
                                    <p className="text-2xl font-bold">{staff.statistics?.total_patients || 0}</p>
                                </Card>
                                <Card className="p-4 bg-muted/30">
                                    <p className="text-xs text-muted-foreground">Consultations</p>
                                    <p className="text-2xl font-bold">{staff.statistics?.total_consultations || 0}</p>
                                </Card>
                                <Card className="p-4 bg-muted/30">
                                    <p className="text-xs text-muted-foreground">Diagnoses</p>
                                    <p className="text-2xl font-bold">{staff.statistics?.total_diagnoses || 0}</p>
                                </Card>
                                <Card className="p-4 bg-muted/30">
                                    <p className="text-xs text-muted-foreground">Average Rating</p>
                                    <p className="text-2xl font-bold text-primary">{staff.statistics?.average_rating || 0}★</p>
                                </Card>
                            </div>*/}

                            {/* Staff Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Personal Information */}
                                <Card className="p-4">
                                    <h4 className="font-medium mb-3 flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        Personal Information
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Full Name</span>
                                            <span className="font-medium">{staff.name || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Email</span>
                                            <span className="font-medium">{staff.email || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Phone</span>
                                            <span className="font-medium">{staff.phone_no || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Reg ID</span>
                                            <span className="font-mono font-medium">{staff.regID || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Joined</span>
                                            <span className="font-medium">{formatDate(staff.created_at)}</span>
                                        </div>
                                    </div>
                                </Card>

                                {/* Professional Information */}
                                <Card className="p-4">
                                    <h4 className="font-medium mb-3 flex items-center gap-2">
                                        <Briefcase className="w-4 h-4" />
                                        Professional Information
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Role</span>
                                            <span className="font-medium capitalize">{staff.user_role}</span>
                                        </div>

                                        {staff.user_role == 'labScientist'? (
                                            <>
                                                {(staff['lab_scientist'][0]?.license_id )  && (
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-muted-foreground">License ID</span>
                                                        <span className="font-mono font-medium">{staff['lab_scientist'][0]?.license_id || staff['lab_scientist'][0]?.license_id}</span>
                                                    </div>
                                                )}
                                            </>
                                        ):(
                                            <>
                                                {(staff[staff.user_role][0]?.licence_id || staff[staff.user_role][0]?.license_id)  && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">License ID</span>
                                                    <span className="font-mono font-medium">{staff[staff.user_role][0]?.licence_id || staff[staff.user_role][0]?.license_id}</span>
                                                </div>
                                            )}
                                            </>
                                        )}


                                        {staff.role_data?.level && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Level</span>
                                                <span className="font-medium">{staff.role_data.level}</span>
                                            </div>
                                        )}
                                        {staff.role_data?.specialization && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Specialization</span>
                                                <span className="font-medium">{staff.role_data.specialization}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Leave Days</span>
                                            <span className="font-medium">{staff.role_data?.leave_days || 0} days</span>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Attendance Summary */}
                            <Card className="p-4">
                                <h4 className="font-medium mb-3 flex items-center gap-2">
                                    <CalendarDays className="w-4 h-4" />
                                    Attendance Summary (This Month)
                                </h4>
                                <div className="grid grid-cols-4 gap-4">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-green-600">{staff.attendance?.present || 0}</p>
                                        <p className="text-xs text-muted-foreground">Present</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-red-600">{staff.attendance?.absent || 0}</p>
                                        <p className="text-xs text-muted-foreground">Absent</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-yellow-600">{staff.attendance?.leave || 0}</p>
                                        <p className="text-xs text-muted-foreground">On Leave</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-blue-600">{staff.attendance?.total_days || 0}</p>
                                        <p className="text-xs text-muted-foreground">Total Days</p>
                                    </div>
                                </div>
                            </Card>
                        </TabsContent>

                        {/* Activities Tab */}
                        <TabsContent value="activities" className="mt-0">
                            <Card className="p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-medium flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        Recent Activities
                                    </h4>
                                    <Badge variant="secondary" className="text-xs">
                                        {staff.recent_activities?.length || 0} activities
                                    </Badge>
                                </div>
                                <div className="space-y-3">
                                    {staff.recent_activities?.length > 0 ? (
                                        staff.recent_activities.map((activity) => (
                                            <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                                                <div className="w-2 h-2 mt-2 rounded-full bg-primary/50" />
                                                <div className="flex-1">
                                                    <p className="text-sm">{activity.description}</p>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <Badge variant="outline" className="text-xs">
                                                            {activity.type}
                                                        </Badge>
                                                        <Badge className={cn("text-xs", getStatusColor(activity.status))}>
                                                            {activity.status}
                                                        </Badge>
                                                        <span className="text-xs text-muted-foreground">
                                                            {formatDate(activity.date)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="sm">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-muted-foreground py-4">No recent activities</p>
                                    )}
                                </div>
                            </Card>
                        </TabsContent>

                        {/* Leave Tab */}
                        <TabsContent value="leave" className="mt-0">
                            <Card className="p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-medium flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Leave Applications
                                    </h4>
                                    <Button size="sm">
                                        <Plus className="w-4 h-4 mr-1" />
                                        Apply Leave
                                    </Button>
                                </div>
                                <div className="space-y-3">
                                    {staff.leave_applications?.length > 0 ? (
                                        staff.leave_applications.map((leave) => (
                                            <div key={leave.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                                                <div>
                                                    <p className="font-medium">{leave.days_requested} days</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Resumes: {formatDate(leave.resumption_date)}
                                                    </p>
                                                    {leave.remark && (
                                                        <p className="text-xs text-muted-foreground">{leave.remark}</p>
                                                    )}
                                                    <p className="text-xs text-muted-foreground">
                                                        Applied: {formatDate(leave.created_at)}
                                                    </p>
                                                </div>
                                                <Badge className={cn("text-xs", getStatusColor(leave.status))}>
                                                    {leave.status}
                                                </Badge>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-muted-foreground py-4">No leave applications</p>
                                    )}
                                </div>
                            </Card>
                        </TabsContent>

                        {/* Salary Tab */}
                        <TabsContent value="salary" className="mt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="p-4">
                                    <h4 className="font-medium mb-4 flex items-center gap-2">
                                        <Wallet className="w-4 h-4" />
                                        Salary Breakdown
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Base Salary</span>
                                            <span className="font-medium">{formatCurrency(staff.salary?.amount || 0)}</span>
                                        </div>
                                        {staff.salary?.allowances?.map((allowance, index) => (
                                            <div key={index} className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">{allowance.name}</span>
                                                <span className="font-medium">{formatCurrency(allowance.amount || 0)}</span>
                                            </div>
                                        ))}
                                        <Separator />
                                        <div className="flex justify-between text-sm font-bold">
                                            <span>Total</span>
                                            <span className="text-primary">{formatCurrency(staff.salary?.total || 0)}</span>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="p-4">
                                    <h4 className="font-medium mb-4 flex items-center gap-2">
                                        <CreditCard className="w-4 h-4" />
                                        Payment History
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="p-3 rounded-lg bg-muted/30">
                                            <div className="flex justify-between">
                                                <span className="text-sm">Salary - June 2026</span>
                                                <span className="font-semibold text-green-600">{formatCurrency(335000)}</span>
                                            </div>
                                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                                <span>Paid on June 25, 2026</span>
                                                <Badge className="text-xs bg-green-100 text-green-700 border-green-200">Paid</Badge>
                                            </div>
                                        </div>
                                        <div className="p-3 rounded-lg bg-muted/30">
                                            <div className="flex justify-between">
                                                <span className="text-sm">Salary - May 2026</span>
                                                <span className="font-semibold text-green-600">{formatCurrency(335000)}</span>
                                            </div>
                                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                                <span>Paid on May 25, 2026</span>
                                                <Badge className="text-xs bg-green-100 text-green-700 border-green-200">Paid</Badge>
                                            </div>
                                        </div>
                                        <div className="p-3 rounded-lg bg-muted/30">
                                            <div className="flex justify-between">
                                                <span className="text-sm">Salary - April 2026</span>
                                                <span className="font-semibold text-green-600">{formatCurrency(335000)}</span>
                                            </div>
                                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                                <span>Paid on April 25, 2026</span>
                                                <Badge className="text-xs bg-green-100 text-green-700 border-green-200">Paid</Badge>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </TabsContent>
                    </ScrollArea>
                </Tabs>

                {/* Footer */}
                <div className="px-6 py-3 border-t flex-shrink-0 flex items-center justify-between bg-muted/10">
                    <div className="text-xs text-muted-foreground">
                        <span className="font-medium">Staff ID:</span> {staff.user?.regID || 'N/A'}
                        <span className="mx-2">•</span>
                        <span className="font-medium">Role:</span> {roleType.charAt(0).toUpperCase() + roleType.slice(1)}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                            <Printer className="w-4 h-4 mr-1" />
                            Print
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                            Close
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default StaffDetailModal;