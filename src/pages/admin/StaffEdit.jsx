import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import PageHeader from '@/components/common/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
    Save,
    RotateCcw,
    Printer,
    User,
    Shield,
    Loader2,
    Stethoscope,
    Pill,
    FlaskConical,
    Wallet,
} from 'lucide-react';
import axiosClient from "../../service/axiosClient.js";
import {
    ACCOUNTANT_LEVEL,
    DoctorLevel,
    DoctorSpecialization,
    LAB_CATEGORIES,
    NURSE_DEPARTMENT,
    NURSE_LEVEL,
    PHARMASIST_SPECIALIZATION,
} from "../../lib/constants.js";

const StaffEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [staff, setStaff] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    // Get staff data from location state or fetch by ID
    useEffect(() => {
        const stateData = location.state?.staffData || location.state?.user;

        if (stateData) {
            setStaff({...stateData,user_id:stateData.id});
            setIsLoading(false);
        } else {
            const searchParams = new URLSearchParams(location.search);
            const staffId = searchParams.get('id');
            if (staffId) {
                fetchStaffData(staffId);
            } else {
                toast.error('No staff data provided');
                navigate('/admin/staff');
            }
        }
    }, [location]);

    const fetchStaffData = async (staffId) => {
        setIsFetching(true);
        try {
            const response = await axiosClient.get(`/api/staff/${staffId}`);
            if (response.data.success) {
                setStaff(response.data.data);
            } else {
                toast.error('Failed to fetch staff data');
                navigate('/admin/staff');
            }
        } catch (error) {
            console.error('Error fetching staff:', error);
            toast.error('Failed to fetch staff data');
            navigate('/admin/staff');
        } finally {
            setIsFetching(false);
            setIsLoading(false);
        }
    };

    // Handle form field changes
    const handleChange = (field, value) => {
        setStaff(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handle nested role data changes
    const handleRoleChange = (field, value) => {
        const role = staff?.user_role;
        if (!role) return;

        if (role == 'labScientist'){
            setStaff(prev => {
                const roleData = prev['lab_scientist'] || [];
                const existingData = roleData.length > 0 ? roleData[0] : {};

                return {
                    ...prev,
                    ['lab_scientist']: [{ ...existingData, [field]: value }]
                };
            });
        }

        setStaff(prev => {
            const roleData = prev[role] || [];
            const existingData = roleData.length > 0 ? roleData[0] : {};

            return {
                ...prev,
                [role]: [{ ...existingData, [field]: value }]
            };
        });
    };

    // Helper to get role data value - FIXED for your data structure
    const getRoleValue = (field, defaultValue = '') => {
        const role = staff?.user_role;
        if (!role) return defaultValue;

        if (role == 'labScientist'){
            const roleData = staff['lab_scientist'] || [];
            if (roleData.length === 0) return defaultValue;

            return roleData[0][field] || staff[field] || defaultValue;
        }

        const roleData = staff[role] || [];
        if (roleData.length === 0) return defaultValue;

        return roleData[0][field] || staff[field] || defaultValue;
    };

    // Handle form reset
    const handleReset = () => {
        const stateData = location.state?.staffData || location.state?.user;
        if (stateData) {
            setStaff(stateData);
        } else {
            const searchParams = new URLSearchParams(location.search);
            const staffId = searchParams.get('id');
            if (staffId) {
                fetchStaffData(staffId);
            }
        }
        toast.info('Form has been reset');
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!staff) {
            toast.error('No staff data to save');
            return;
        }

        setIsSubmitting(true);

        try {
            const role = staff.user_role;
            const roleData = staff[role] || [];
            const existingData = roleData.length > 0 ? roleData[0] : {};

            const payload = {
                id: staff.id,
                name: staff.name,
                email: staff.email,
                phone_no: staff.phone_no,
                address: staff.address,
                gender: staff.gender,
                date_of_birth: staff.date_of_birth || staff.dateOfBirth,
                user_role: staff.user_role,
                license_id: existingData.license_id || staff.license_id,
                level: existingData.level || staff.level,
                specialization: existingData.specialization || staff.specialization,
                department: existingData.department || staff.department,
                leave_days: existingData.leave_days || staff.leave_days,
                suspend: staff.suspend || '0',
            };

            if (role == 'labScientist'){
                delete staff['lab_scientist'][0].created_at
                delete staff['lab_scientist'][0].updated_at
            }

            delete existingData.created_at
            delete existingData.updated_at
            delete staff.created_at
            delete staff.updated_at

            console.log(staff)


            axiosClient.post('/updateUser',staff)
                .then(({data})=>{
                    console.log(data)
                    console.log(data.data)
                    setStaff({...data.data, user_id:data.data.id})

                })


        } catch (error) {
            console.error('Error updating staff:', error);
            toast.error(error.response?.data?.message || 'Failed to update staff');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading || isFetching) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading staff data...</p>
                </div>
            </div>
        );
    }

    if (!staff) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">Staff Not Found</h3>
                    <p className="text-sm text-muted-foreground">No staff data available to edit.</p>
                    <Button className="mt-4" onClick={() => navigate('/admin/staff')}>
                        Back to Staff
                    </Button>
                </div>
            </div>
        );
    }

    const role = staff.user_role;
    const roleData = staff[role] || [];
    const roleDataItem = roleData.length > 0 ? roleData[0] : {};

    return (
        <div className="space-y-6">
            <PageHeader
                title="Edit Staff"
                subtitle={`Editing ${staff.name || 'Staff Member'}`}
                breadcrumb={[
                    { label: 'Dashboard', path: '/admin/dashboard' },
                    { label: 'Staff Management', path: '/admin/staff' },
                    { label: 'Edit Staff' }
                ]}
                actions={
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleReset} disabled={isSubmitting}>
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Reset
                        </Button>
                        <Button variant="outline" onClick={() => window.print()}>
                            <Printer className="w-4 h-4 mr-2" />
                            Print
                        </Button>
                    </div>
                }
            />

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Personal Information */}
                    <Card className="p-6 lg:col-span-2">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" />
                            Personal Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Full Name *</Label>
                                <Input
                                    id="name"
                                    value={staff.name || ''}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="dob">Date of Birth</Label>
                                <Input
                                    id="dob"
                                    type="date"
                                    value={staff.date_of_birth || staff.dateOfBirth || ''}
                                    onChange={(e) => handleChange('date_of_birth', e.target.value)}
                                />
                            </div>

                            <div>
                                <Label>Gender *</Label>
                                <Select
                                    value={staff.gender }
                                    onValueChange={(v) => handleChange('gender', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="phone">Phone Number *</Label>
                                <Input
                                    id="phone"
                                    value={staff.phone_no || ''}
                                    onChange={(e) => handleChange('phone_no', e.target.value)}
                                    placeholder="+234..."
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={staff.email || ''}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <Label htmlFor="address">Address</Label>
                                <Textarea
                                    id="address"
                                    value={staff.address || ''}
                                    onChange={(e) => handleChange('address', e.target.value)}
                                    rows={3}
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Role & Status */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary" />
                            Role & Status
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <Label>Role</Label>
                                <div className="p-3 bg-muted/30 rounded-lg font-medium capitalize">
                                    {role || 'N/A'}
                                </div>
                            </div>


                            <div>
                                <Label>Status</Label>
                                <Select
                                    value={staff.suspend || '0'}
                                    onValueChange={(v) => handleChange('suspend', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">Active</SelectItem>
                                        <SelectItem value="1">Suspended</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="leaveDays">Leave Days</Label>
                                <Input
                                    id="leaveDays"
                                    type="number"
                                    value={getRoleValue('leave_days', '')}
                                    onChange={(e) => handleRoleChange('leave_days', e.target.value)}
                                    min="0"
                                />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Role-Specific Information */}
                {(role === 'doctor' || role === 'nurse' || role === 'labScientist' || role === 'pharmasist' || role === 'accountant') && (
                    <Card className="p-6 mt-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            {role === 'doctor' && <Stethoscope className="w-5 h-5 text-primary" />}
                            {role === 'nurse' && <Stethoscope className="w-5 h-5 text-primary" />}
                            {role === 'labScientist' && <FlaskConical className="w-5 h-5 text-primary" />}
                            {role === 'pharmasist' && <Pill className="w-5 h-5 text-primary" />}
                            {role === 'accountant' && <Wallet className="w-5 h-5 text-primary" />}
                            Professional Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {/* License ID */}
                            {(role === 'doctor' || role === 'nurse' || role === 'labScientist' || role === 'pharmasist') && (
                                <div>
                                    <Label htmlFor="licenseId">License ID</Label>
                                    <Input
                                        id="licenseId"
                                        value={getRoleValue('license_id', '')}
                                        onChange={(e) => handleRoleChange('license_id', e.target.value)}
                                    />
                                </div>
                            )}

                            {/* Level */}
                            {(role === 'doctor' || role === 'nurse' || role === 'accountant') && (
                                <div>
                                    <Label>Level</Label>
                                    <Select
                                        value={getRoleValue('level', undefined)}
                                        onValueChange={(v) => handleRoleChange('level', v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {role === 'doctor' && DoctorLevel.map(opt => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                            {role === 'nurse' && NURSE_LEVEL.map(opt => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                            {role === 'accountant' && ACCOUNTANT_LEVEL.map(opt => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p>
                                      current:  {getRoleValue('level')}
                                    </p>
                                </div>

                            )}

                            {/* Specialization/Department */}
                            {role === 'doctor' && (
                                <div>
                                    <Label>Specialization</Label>
                                    <Select
                                        value={getRoleValue('specialization', undefined)}
                                        onValueChange={(v) => handleRoleChange('specialization', v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select specialization" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {DoctorSpecialization.map(opt => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p>
                                        current:  {getRoleValue('specialization')}
                                    </p>
                                </div>
                            )}

                            {role === 'nurse' && (
                                <div>
                                    <Label>Department</Label>
                                    <Select
                                        value={getRoleValue('department') || getRoleValue('specialization', undefined)}
                                        onValueChange={(v) => handleRoleChange('department', v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {NURSE_DEPARTMENT.map(opt => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p>
                                        current:  {getRoleValue('department')}
                                    </p>
                                </div>
                            )}

                            {role === 'pharmasist' && (
                                <div>
                                    <Label>Specialization</Label>
                                    <Select
                                        value={getRoleValue('specialization', undefined)}
                                        onValueChange={(v) => handleRoleChange('specialization', v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select specialization" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PHARMASIST_SPECIALIZATION.map(opt => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p>
                                        current:  {getRoleValue('specialization')}
                                    </p>
                                </div>
                            )}

                            {role === 'labScientist' && (
                                <div>
                                    <Label>Specialization</Label>
                                    <Select
                                        value={getRoleValue('specialization', undefined)}
                                        onValueChange={(v) => handleRoleChange('specialization', v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select specialization" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {LAB_CATEGORIES.map(opt => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p>
                                        current:  {getRoleValue('specialization')}
                                    </p>
                                </div>
                            )}
                        </div>
                    </Card>
                )}

                {/* Submit Buttons */}
                <div className="mt-6 flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/admin/staff')}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Update Staff
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default StaffEdit;