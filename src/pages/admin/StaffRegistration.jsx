import React, { useState, useCallback, useMemo, memo } from 'react';
import { usePatients } from '@/hooks/useData';
import { generatePatientId } from '@/lib/mockData';
import { BLOOD_TYPES, GENDER_OPTIONS, GENOTYPE } from '@/lib/constants';
import PageHeader from '@/components/common/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    UserPlus,
    Save,
    RotateCcw,
    Printer,
    QrCodeIcon,
    CreditCard,
    Wallet,
    Banknote,
    FileText,
    Loader2,
    CheckCircle
} from 'lucide-react';
import axiosClient from "../../service/axiosClient.js";
import { paymentStore } from "../../store/store.jsx";
import { useNavigate } from "react-router-dom";
import {
    ACCOUNTANT_LEVEL,
    DoctorLevel,
    DoctorSpecialization,
    LAB_CATEGORIES,
    NURSE_DEPARTMENT,
    NURSE_LEVEL,
    PHARMASIST_SPECIALIZATION,
    USER_ROLE
} from "../../lib/constants.js";

// ===== MEMOIZED FORM INPUT COMPONENTS =====
const FormInput = memo((({ label, id, value, onChange, type = 'text', required = false, placeholder = '' }) => (
    <div>
        <Label htmlFor={id}>{label} {required && '*'}</Label>
        <Input
            id={id}
            type={type}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
        />
    </div>
)));

const FormSelect = memo(({ label, value, onValueChange, options, placeholder = 'Select an option' }) => (
    <div>
        <Label>{label} *</Label>
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {options.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    </div>
));

const FormTextarea = memo(({ label, id, value, onChange, required = false, placeholder = '' }) => (
    <div className="sm:col-span-2">
        <Label htmlFor={id}>{label} {required && '*'}</Label>
        <Textarea
            id={id}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
        />
    </div>
));

// ===== MEMOIZED FORM COMPONENTS =====
const DoctorForm = memo(({ formData, handleChange, handleSubmit, handleReset }) => {
    // Memoized handlers for each field
    const handleNameChange = useCallback((e) => handleChange('name', e.target.value), [handleChange]);
    const handleDateChange = useCallback((e) => handleChange('dateOfBirth', e.target.value), [handleChange]);
    const handleGenderChange = useCallback((v) => handleChange('gender', v), [handleChange]);
    const handlePhoneChange = useCallback((e) => handleChange('phone_no', e.target.value), [handleChange]);
    const handleEmailChange = useCallback((e) => handleChange('email', e.target.value), [handleChange]);
    const handlePasswordChange = useCallback((e) => handleChange('password', e.target.value), [handleChange]);
    const handleAddressChange = useCallback((e) => handleChange('address', e.target.value), [handleChange]);
    const handleLicenseChange = useCallback((e) => handleChange('license_id', e.target.value), [handleChange]);
    const handleLevelChange = useCallback((v) => handleChange('level', v), [handleChange]);
    const handleSpecializationChange = useCallback((v) => handleChange('specialization', v), [handleChange]);
    const handleLeaveDaysChange = useCallback((e) => handleChange('leave_days', e.target.value), [handleChange]);

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Personal Information */}
                <Card className="p-6 lg:col-span-2">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-primary" />
                        Doctor Form
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormInput
                            label="Name"
                            id="firstName"
                            value={formData.name}
                            onChange={handleNameChange}
                            required
                        />
                        <FormInput
                            label="Date of Birth"
                            id="dob"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={handleDateChange}
                            required
                        />
                        <FormSelect
                            label="Gender"
                            value={formData.gender}
                            onValueChange={handleGenderChange}
                            options={GENDER_OPTIONS}
                        />
                        <FormInput
                            label="Phone Number"
                            id="phone"
                            value={formData.phone_no}
                            onChange={handlePhoneChange}
                            placeholder="+234..."
                            required
                        />
                        <FormInput
                            label="Email"
                            id="email"
                            value={formData.email}
                            onChange={handleEmailChange}
                        />
                        <FormInput
                            label="Password"
                            id="password"
                            value={formData.password}
                            onChange={handlePasswordChange}
                        />
                        <FormTextarea
                            label="Address"
                            id="address"
                            value={formData.address}
                            onChange={handleAddressChange}
                            required
                        />
                    </div>
                </Card>

                {/* Professional Information */}
                <Card className="p-6 lg:col-span-3">
                    <h3 className="text-lg font-semibold mb-4">Professional Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <FormInput
                            label="License ID"
                            id="licenseID"
                            value={formData.license_id}
                            onChange={handleLicenseChange}
                        />
                        <FormSelect
                            label="Level"
                            value={formData.level}
                            onValueChange={handleLevelChange}
                            options={DoctorLevel}
                        />
                        <FormSelect
                            label="Specialization"
                            value={formData.specialization}
                            onValueChange={handleSpecializationChange}
                            options={DoctorSpecialization}
                        />
                        <FormInput
                            label="Leave Days"
                            id="leave_days"
                            value={formData.leave_days}
                            onChange={handleLeaveDaysChange}
                        />
                    </div>
                </Card>
            </div>

            <div className="mt-6 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={handleReset}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                </Button>
                <Button type="submit" size="lg">
                    <Save className="w-4 h-4 mr-2" />
                    Register Staff
                </Button>
            </div>
        </form>
    );
});

const NurseForm = memo(({ formData, handleChange, handleSubmit, handleReset }) => {
    const handleNameChange = useCallback((e) => handleChange('name', e.target.value), [handleChange]);
    const handleDateChange = useCallback((e) => handleChange('dateOfBirth', e.target.value), [handleChange]);
    const handleGenderChange = useCallback((v) => handleChange('gender', v), [handleChange]);
    const handlePhoneChange = useCallback((e) => handleChange('phone_no', e.target.value), [handleChange]);
    const handleEmailChange = useCallback((e) => handleChange('email', e.target.value), [handleChange]);
    const handlePasswordChange = useCallback((e) => handleChange('password', e.target.value), [handleChange]);
    const handleAddressChange = useCallback((e) => handleChange('address', e.target.value), [handleChange]);
    const handleLicenseChange = useCallback((e) => handleChange('license_id', e.target.value), [handleChange]);
    const handleLevelChange = useCallback((v) => handleChange('level', v), [handleChange]);
    const handleDepartmentChange = useCallback((v) => handleChange('specialization', v), [handleChange]);
    const handleLeaveDaysChange = useCallback((e) => handleChange('leave_days', e.target.value), [handleChange]);

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="p-6 lg:col-span-2">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-primary" />
                        Nurse Form
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormInput label="Name" id="firstName" value={formData.name} onChange={handleNameChange} required />
                        <FormInput label="Date of Birth" id="dob" type="date" value={formData.dateOfBirth} onChange={handleDateChange} required />
                        <FormSelect label="Gender" value={formData.gender} onValueChange={handleGenderChange} options={GENDER_OPTIONS} />
                        <FormInput label="Phone Number" id="phone" value={formData.phone_no} onChange={handlePhoneChange} placeholder="+234..." required />
                        <FormInput label="Email" id="email"  value={formData.email} onChange={handleEmailChange} />
                        <FormInput label="Password" id="password"  value={formData.password} onChange={handlePasswordChange} />
                        <FormTextarea label="Address" id="address" value={formData.address} onChange={handleAddressChange} required />
                    </div>
                </Card>

                <Card className="p-6 lg:col-span-3">
                    <h3 className="text-lg font-semibold mb-4">Professional Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <FormInput label="License ID" id="licenseID" value={formData.license_id} onChange={handleLicenseChange} />
                        <FormSelect label="Level" value={formData.level} onValueChange={handleLevelChange} options={NURSE_LEVEL} />
                        <FormSelect label="Department" value={formData.specialization} onValueChange={handleDepartmentChange} options={NURSE_DEPARTMENT} />
                        <FormInput label="Leave Days" id="leave_days" value={formData.leave_days} onChange={handleLeaveDaysChange} />
                    </div>
                </Card>
            </div>

            <div className="mt-6 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={handleReset}><RotateCcw className="w-4 h-4 mr-2" />Reset</Button>
                <Button type="submit" size="lg"><Save className="w-4 h-4 mr-2" />Register Staff</Button>
            </div>
        </form>
    );
});

const ClerkForm = memo(({ formData, handleChange, handleSubmit, handleReset }) => {
    const handleNameChange = useCallback((e) => handleChange('name', e.target.value), [handleChange]);
    const handleDateChange = useCallback((e) => handleChange('dateOfBirth', e.target.value), [handleChange]);
    const handleGenderChange = useCallback((v) => handleChange('gender', v), [handleChange]);
    const handlePhoneChange = useCallback((e) => handleChange('phone_no', e.target.value), [handleChange]);
    const handleEmailChange = useCallback((e) => handleChange('email', e.target.value), [handleChange]);
    const handlePasswordChange = useCallback((e) => handleChange('password', e.target.value), [handleChange]);
    const handleAddressChange = useCallback((e) => handleChange('address', e.target.value), [handleChange]);

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="p-6 lg:col-span-2">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-primary" />
                        Clerk Form
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormInput label="Name" id="firstName" value={formData.name} onChange={handleNameChange} required />
                        <FormInput label="Date of Birth" id="dob" type="date" value={formData.dateOfBirth} onChange={handleDateChange} required />
                        <FormSelect label="Gender" value={formData.gender} onValueChange={handleGenderChange} options={GENDER_OPTIONS} />
                        <FormInput label="Phone Number" id="phone" value={formData.phone_no} onChange={handlePhoneChange} placeholder="+234..." required />
                        <FormInput label="Email" id="email"  value={formData.email} onChange={handleEmailChange} />
                        <FormInput label="Password" id="password"  value={formData.password} onChange={handlePasswordChange} />
                        <FormTextarea label="Address" id="address" value={formData.address} onChange={handleAddressChange} required />
                    </div>
                </Card>
            </div>

            <div className="mt-6 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={handleReset}><RotateCcw className="w-4 h-4 mr-2" />Reset</Button>
                <Button type="submit" size="lg"><Save className="w-4 h-4 mr-2" />Register Staff</Button>
            </div>
        </form>
    );
});

const PharmacistForm = memo(({ formData, handleChange, handleSubmit, handleReset }) => {
    const handleNameChange = useCallback((e) => handleChange('name', e.target.value), [handleChange]);
    const handleDateChange = useCallback((e) => handleChange('dateOfBirth', e.target.value), [handleChange]);
    const handleGenderChange = useCallback((v) => handleChange('gender', v), [handleChange]);
    const handlePhoneChange = useCallback((e) => handleChange('phone_no', e.target.value), [handleChange]);
    const handleEmailChange = useCallback((e) => handleChange('email', e.target.value), [handleChange]);
    const handlePasswordChange = useCallback((e) => handleChange('password', e.target.value), [handleChange]);
    const handleAddressChange = useCallback((e) => handleChange('address', e.target.value), [handleChange]);
    const handleLicenseChange = useCallback((e) => handleChange('license_id', e.target.value), [handleChange]);
    const handleSpecializationChange = useCallback((v) => handleChange('specialization', v), [handleChange]);
    const handleLeaveDaysChange = useCallback((e) => handleChange('leave_days', e.target.value), [handleChange]);

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="p-6 lg:col-span-2">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-primary" />
                        Pharmacist Form
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormInput label="Name" id="firstName" value={formData.name} onChange={handleNameChange} required />
                        <FormInput label="Date of Birth" id="dob" type="date" value={formData.dateOfBirth} onChange={handleDateChange} required />
                        <FormSelect label="Gender" value={formData.gender} onValueChange={handleGenderChange} options={GENDER_OPTIONS} />
                        <FormInput label="Phone Number" id="phone" value={formData.phone_no} onChange={handlePhoneChange} placeholder="+234..." required />
                        <FormInput label="Email" id="email"  value={formData.email} onChange={handleEmailChange} />
                        <FormInput label="Password" id="password"  value={formData.password} onChange={handlePasswordChange} />
                        <FormTextarea label="Address" id="address" value={formData.address} onChange={handleAddressChange} required />
                    </div>
                </Card>

                <Card className="p-6 lg:col-span-3">
                    <h3 className="text-lg font-semibold mb-4">Professional Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <FormInput label="License ID" id="licenseID" value={formData.license_id} onChange={handleLicenseChange} />
                        <FormSelect label="Specialization" value={formData.specialization} onValueChange={handleSpecializationChange} options={PHARMASIST_SPECIALIZATION} />
                        <FormInput label="Leave Days" id="leave_days" value={formData.leave_days} onChange={handleLeaveDaysChange} />
                    </div>
                </Card>
            </div>

            <div className="mt-6 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={handleReset}><RotateCcw className="w-4 h-4 mr-2" />Reset</Button>
                <Button type="submit" size="lg"><Save className="w-4 h-4 mr-2" />Register Staff</Button>
            </div>
        </form>
    );
});

const LabScientistForm = memo(({ formData, handleChange, handleSubmit, handleReset }) => {
    const handleNameChange = useCallback((e) => handleChange('name', e.target.value), [handleChange]);
    const handleDateChange = useCallback((e) => handleChange('dateOfBirth', e.target.value), [handleChange]);
    const handleGenderChange = useCallback((v) => handleChange('gender', v), [handleChange]);
    const handlePhoneChange = useCallback((e) => handleChange('phone_no', e.target.value), [handleChange]);
    const handleEmailChange = useCallback((e) => handleChange('email', e.target.value), [handleChange]);
    const handlePasswordChange = useCallback((e) => handleChange('password', e.target.value), [handleChange]);
    const handleAddressChange = useCallback((e) => handleChange('address', e.target.value), [handleChange]);
    const handleLicenseChange = useCallback((e) => handleChange('license_id', e.target.value), [handleChange]);
    const handleSpecializationChange = useCallback((v) => handleChange('specialization', v), [handleChange]);
    const handleLeaveDaysChange = useCallback((e) => handleChange('leave_days', e.target.value), [handleChange]);

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="p-6 lg:col-span-2">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-primary" />
                        Lab Scientist Form
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormInput label="Name" id="firstName" value={formData.name} onChange={handleNameChange} required />
                        <FormInput label="Date of Birth" id="dob" type="date" value={formData.dateOfBirth} onChange={handleDateChange} required />
                        <FormSelect label="Gender" value={formData.gender} onValueChange={handleGenderChange} options={GENDER_OPTIONS} />
                        <FormInput label="Phone Number" id="phone" value={formData.phone_no} onChange={handlePhoneChange} placeholder="+234..." required />
                        <FormInput label="Email" id="email"  value={formData.email} onChange={handleEmailChange} />
                        <FormInput label="Password" id="password"  value={formData.password} onChange={handlePasswordChange} />
                        <FormTextarea label="Address" id="address" value={formData.address} onChange={handleAddressChange} required />
                    </div>
                </Card>

                <Card className="p-6 lg:col-span-3">
                    <h3 className="text-lg font-semibold mb-4">Professional Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <FormInput label="License ID" id="licenseID" value={formData.license_id} onChange={handleLicenseChange} />
                        <FormSelect label="Specialization" value={formData.specialization} onValueChange={handleSpecializationChange} options={LAB_CATEGORIES} />
                        <FormInput label="Leave Days" id="leave_days" value={formData.leave_days} onChange={handleLeaveDaysChange} />
                    </div>
                </Card>
            </div>

            <div className="mt-6 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={handleReset}><RotateCcw className="w-4 h-4 mr-2" />Reset</Button>
                <Button type="submit" size="lg"><Save className="w-4 h-4 mr-2" />Register Staff</Button>
            </div>
        </form>
    );
});

const AccountantForm = memo(({ formData, handleChange, handleSubmit, handleReset }) => {
    const handleNameChange = useCallback((e) => handleChange('name', e.target.value), [handleChange]);
    const handleDateChange = useCallback((e) => handleChange('dateOfBirth', e.target.value), [handleChange]);
    const handleGenderChange = useCallback((v) => handleChange('gender', v), [handleChange]);
    const handlePhoneChange = useCallback((e) => handleChange('phone_no', e.target.value), [handleChange]);
    const handleEmailChange = useCallback((e) => handleChange('email', e.target.value), [handleChange]);
    const handlePasswordChange = useCallback((e) => handleChange('password', e.target.value), [handleChange]);
    const handleAddressChange = useCallback((e) => handleChange('address', e.target.value), [handleChange]);
    const handleLevelChange = useCallback((v) => handleChange('level', v), [handleChange]);
    const handleLeaveDaysChange = useCallback((e) => handleChange('leave_days', e.target.value), [handleChange]);

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="p-6 lg:col-span-2">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-primary" />
                        Accountant Form
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormInput label="Name" id="firstName" value={formData.name} onChange={handleNameChange} required />
                        <FormInput label="Date of Birth" id="dob" type="date" value={formData.dateOfBirth} onChange={handleDateChange} required />
                        <FormSelect label="Gender" value={formData.gender} onValueChange={handleGenderChange} options={GENDER_OPTIONS} />
                        <FormInput label="Phone Number" id="phone" value={formData.phone_no} onChange={handlePhoneChange} placeholder="+234..." required />
                        <FormInput label="Email" id="email"  value={formData.email} onChange={handleEmailChange} />
                        <FormInput label="Password" id="password"  value={formData.password} onChange={handlePasswordChange} />
                        <FormTextarea label="Address" id="address" value={formData.address} onChange={handleAddressChange} required />
                    </div>
                </Card>

                <Card className="p-6 lg:col-span-3">
                    <h3 className="text-lg font-semibold mb-4">Professional Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <FormSelect label="Level" value={formData.level} onValueChange={handleLevelChange} options={ACCOUNTANT_LEVEL} />
                        <FormInput label="Leave Days" id="leave_days" value={formData.leave_days} onChange={handleLeaveDaysChange} />
                    </div>
                </Card>
            </div>

            <div className="mt-6 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={handleReset}><RotateCcw className="w-4 h-4 mr-2" />Reset</Button>
                <Button type="submit" size="lg"><Save className="w-4 h-4 mr-2" />Register Staff</Button>
            </div>
        </form>
    );
});

// ===== MAIN COMPONENT =====
const StaffRegistration = () => {
    const { addPatient } = usePatients();
    const [formData, setFormData] = useState({});
    const [selectedUserRole, setSelectedUserRole] = useState('');
    const [allergyInput, setAllergyInput] = useState('');
    const [selectedRate, setSelectedRate] = useState(null);
    const [selectedToken, setSelectedToken] = useState('');
    const [selectedURL, setSelectedURL] = useState('');
    const [showQrModal, setShowQrModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const { rates } = paymentStore();
    const navigate = useNavigate();

    // Memoized handlers
    const handleChange = useCallback((field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleEmergencyChange = useCallback((field, value) => {
        setFormData(prev => ({
            ...prev,
            emergencyContact: { ...prev.emergencyContact, [field]: value },
        }));
    }, []);

    const handleReset = useCallback(() => {
        setFormData({
            patientId: generatePatientId(),
            gender: 'male',
            bloodType: 'O+',
            allergies: [],
            registrationDate: new Date().toISOString().split('T')[0],
            registeredBy: 'CLR001',
            emergencyContact: { name: '', phone: '', relationship: '' },
        });
        toast.info('Form reset');
    }, []);

    const handleGenerateToken = useCallback(() => {
        setIsProcessing(true);
        axiosClient.post('/generateQrToken')
            .then(({ data }) => {
                setSelectedToken(data.data.token);
                setSelectedURL(data.data.url);
                setIsProcessing(false);
            })
            .catch((e) => {
                console.log(e);
                setIsProcessing(false);
            });
    }, []);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        console.log(formData);

        const payload = {
            address: formData.address,
            dateOfBirth: formData.dateOfBirth,
            gender: formData.gender,
            name: formData.name,
            email: formData.email,
            specialization: formData.specialization || '',
            department: formData.specialization || '',
            level: formData.level || '',
            leave_days: formData.leave_days,
            license_id: formData.license_id || '',
            phone_no: formData.phone_no,
            user_role: selectedUserRole,
            password: formData.password
        };

        console.log(payload);

        axiosClient.post('/adminRegister', payload)
            .then(({ data }) => {
                console.log(data);
                if (data.message.includes('Successfully')) {
                    alert(data.message);
                    navigate('/clerk');
                } else {
                    alert(data.message);
                }
            })
            .catch(e => console.log(e));

        const newPatient = formData;
        addPatient(newPatient);
        toast.success(`Patient registered successfully`);
    }, [formData, selectedUserRole, addPatient, navigate]);

    // Memoize the role change handler
    const handleRoleChange = useCallback((v) => {
        setSelectedUserRole(v);
        setFormData({});
    }, []);

    // Memoize the form rendering based on selected role
    const renderForm = useMemo(() => {
        const commonProps = {
            formData,
            handleChange,
            handleSubmit,
            handleReset,
        };

        switch (selectedUserRole) {
            case 'doctor':
                return <DoctorForm {...commonProps} />;
            case 'nurse':
                return <NurseForm {...commonProps} />;
            case 'clerk':
                return <ClerkForm {...commonProps} />;
            case 'accountant':
                return <AccountantForm {...commonProps} />;
            case 'pharmasist':
                return <PharmacistForm {...commonProps} />;
            case 'labScientist':
                return <LabScientistForm {...commonProps} />;
            default:
                return null;
        }
    }, [selectedUserRole, formData, handleChange, handleSubmit, handleReset]);

    return (
        <div className="space-y-6">
            <PageHeader
                title="Staff Registration"
                subtitle="Register a new Staff"
                breadcrumb={[
                    { label: 'Dashboard', path: '/admin/staff' },
                    { label: 'Staff Registration' }
                ]}
                actions={
                    <>
                        <Button variant="outline" onClick={handleReset}>
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Reset
                        </Button>
                        <Button variant="outline" onClick={window.print}>
                            <Printer className="w-4 h-4 mr-2" />
                            Print
                        </Button>
                        <Button variant="outline" onClick={() => setShowQrModal(true)}>
                            <QrCodeIcon className="w-4 h-4 mr-2" />
                            QR Enrollment
                        </Button>
                    </>
                }
            />

            <div>
                <Label>Please select a Staff Role</Label>
                <Select value={selectedUserRole} onValueChange={handleRoleChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a role..." />
                    </SelectTrigger>
                    <SelectContent>
                        {USER_ROLE.map(g => (
                            <SelectItem key={g.value} value={g.value}>
                                {g.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {renderForm}

            {/* QR Modal */}
            <Dialog open={showQrModal} onOpenChange={setShowQrModal}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-primary" />
                            Generate Registration QR Code
                        </DialogTitle>
                        <DialogDescription>
                            {selectedURL !== ''
                                ? 'Patient should Scan and fill the registration form'
                                : 'Click Generate to View QR Code'}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedURL !== '' && (
                        <div className="space-y-4 flex justify-center">
                            <QRCodeSVG
                                value={selectedURL}
                                size={256}
                                bgColor="#ffffff"
                                fgColor="#000000"
                                level="H"
                            />
                        </div>
                    )}

                    <DialogFooter className="flex flex-col sm:flex-row gap-2">
                        <Button
                            variant="outline"
                            className="w-full sm:w-auto"
                            onClick={() => setShowQrModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80"
                            onClick={handleGenerateToken}
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
                                    Generate QR
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default StaffRegistration;