import React, { useState } from 'react';
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
import {QRCodeSVG} from 'qrcode.react'
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
  Loader2, CheckCircle
} from 'lucide-react';
import axiosClient from "../../service/axiosClient.js";
import {paymentStore} from "../../store/store.jsx";
import {useNavigate} from "react-router-dom";

const PatientRegistration = () => {
  
  const { addPatient } = usePatients();
 /* const [formData, setFormData] = useState({
    patientId: generatePatientId(),
    gender: 'male',
    bloodType: 'O+',
    allergies: [],
    registrationDate: new Date().toISOString().split('T')[0],
    registeredBy: 'CLR001',
    emergencyContact: { name: '', phone: '', relationship: '' },
  });*/
  const [formData, setFormData] = useState({});
  const [allergyInput, setAllergyInput] = useState('');
  const [selectedRate, setSelectedRate] = useState({});
  const [selectedToken, setSelectedToken] = useState('');
  const [selectedURL, setSelectedURL] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const {rates} = paymentStore();

  const navigate = useNavigate()

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEmergencyChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      emergencyContact: { ...prev.emergencyContact, [field]: value },
    }));
  };

  const addAllergy = () => {
    if (allergyInput.trim() && !formData.allergies?.includes(allergyInput.trim())) {
      setFormData(prev => ({ ...prev, allergies: [...(prev.allergies || []), allergyInput.trim()] }));
      setAllergyInput('');
    }
  };

  const removeAllergy = (allergy) => {
    setFormData(prev => ({ ...prev, allergies: prev.allergies?.filter(a => a !== allergy) || [] }));
  };

  const handleGenerateToken = ()=>{
    setIsProcessing(true)
    axiosClient.post('/generateQrToken')
        .then(({data})=>{
          setSelectedToken(data.data.token)
          setSelectedURL(data.data.url)
          setIsProcessing(false)
        })
        .catch((e)=>{
          console.log(e)
          setIsProcessing(false)
        })
  }

  const handleSubmit = (e) => {

    e.preventDefault();

    handleChange('amount' , selectedRate.amount)
    handleChange('rates_id' , selectedRate.id)

    console.log(formData)

    const payload = {
      address : formData.address,
      amount : selectedRate.amount,
      blood_group : formData.blood_group,
      dateOfBirth : formData.dateOfBirth,
      gender : formData.gender,
      genotype : formData.genotype,
      insurance_id : formData.insurance_id,
      insurance_provider : formData.insurance_provider,
      name : formData.name,
      email : formData.email,
      nos_address : formData.nos_address,
      nos_name : formData.nos_name,
      nos_phone_no : formData.nos_phone_no,
      nos_relationship : formData.nos_relationship,
      phone_no : formData.phone_no,
      rates_id : formData.rates_id,

    }

    if (formData?.allergies && formData?.allergies?.length >0){
      payload['allergies'] = JSON.stringify(formData.allergies)
    }


    axiosClient.post('/registerPatient',payload)
        .then(({data})=>{
          console.log(data)
          if (data.message.includes('Successfully')){
           alert(data.message)
            navigate('/clerk')
          }else {
           /* setFormData({})*/
            alert(data.message)
          }

        }).catch(e=>console.log(e))

    const newPatient = formData
    addPatient(newPatient);
    toast.success(`Patient ${newPatient.firstName} ${newPatient.lastName} registered successfully`);
   /* setFormData({
      patientId: generatePatientId(),
      gender: 'male',
      bloodType: 'O+',
      allergies: [],
      registrationDate: new Date().toISOString().split('T')[0],
      registeredBy: 'CLR001',
      emergencyContact: { name: '', phone: '', relationship: '' },
    });*/
  };

  const handleReset = () => {
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
  };

  const handleEnrollment = ()=>{

  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patient Registration"
        subtitle="Register a new patient"
        breadcrumb={[{ label: 'Dashboard', path: '/clerk' }, { label: 'Patient Registration' }]}
        actions={
          <>
            <Button variant="outline" onClick={handleReset}><RotateCcw className="w-4 h-4 mr-2" />Reset</Button>
            <Button variant="outline" onClick={window.print}><Printer className="w-4 h-4 mr-2" />Print</Button>
            <Button variant="outline" onClick={()=>{setShowQrModal(true); }} ><QrCodeIcon className="w-4 h-4 mr-2" />QR Enrollment</Button>
          </>
        }
      />

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <Card className="p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              Patient Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             {/* <div>
                <Label htmlFor="patientId">Patient ID</Label>
                <Input id="patientId" value={formData.name}  className="bg-muted" />
              </div>
              <div>
                <Label htmlFor="regDate">Registration Date</Label>
                <Input id="regDate" value={formData.registrationDate} disabled className="bg-muted" />
              </div>*/}
              <div>
                <Label htmlFor="firstName"> Name *</Label>
                <Input id="firstName" value={formData.name || ''} onChange={e => handleChange('name', e.target.value)} required />
              </div>
             {/* <div>
                <Label htmlFor="lastName">Email *</Label>
                <Input id="lastName" value={formData.email || ''} onChange={e => handleChange('email', e.target.value)} type={'email'} required />
              </div>*/}
              <div>
                <Label htmlFor="dob">Date of Birth *</Label>
                <Input id="dob" type="date" value={formData.dateOfBirth || ''} onChange={e => handleChange('dateOfBirth', e.target.value)} required />
              </div>
              <div>
                <Label>Gender *</Label>
                <Select value={formData.gender} onValueChange={v => handleChange('gender', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {GENDER_OPTIONS.map(g => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" value={formData.phone_no || ''} onChange={e => handleChange('phone_no', e.target.value)} placeholder="+234..." required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={formData.email || ''} onChange={e => handleChange('email', e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea id="address" value={formData.address || ''} onChange={e => handleChange('address', e.target.value)} required />
              </div>
            </div>
          </Card>

          {/* Medical Information */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Medical Information</h3>
            <div className="space-y-4">
              <div>
                <Label>Blood Type</Label>
                <Select value={formData.blood_group} onValueChange={v => handleChange('blood_group', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {BLOOD_TYPES.map(bt => <SelectItem key={bt} value={bt}>{bt}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Genotype</Label>
                <Select value={formData.genotype} onValueChange={v => handleChange('genotype', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {GENOTYPE.map(bt => <SelectItem key={bt} value={bt}>{bt}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Allergies</Label>
                <div className="flex gap-2 mb-2">
                  <Input value={allergyInput} onChange={e => setAllergyInput(e.target.value)} placeholder="Add allergy" onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addAllergy())} />
                  <Button type="button" variant="outline" size="sm" onClick={addAllergy}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {formData.allergies?.map(allergy => (
                    <span key={allergy} className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                      {allergy}
                      <button type="button" onClick={() => removeAllergy(allergy)} className="hover:text-red-900">&times;</button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="insurance">Insurance Provider</Label>
                <Input id="insurance" value={formData.insurance_provider || ''} onChange={e => handleChange('insurance_provider', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="insuranceNo">Insurance Number</Label>
                <Input id="insuranceNo" value={formData.insurance_id || ''} onChange={e => handleChange('insurance_id', e.target.value)} />
              </div>
              <div>
                <Label>Gender *</Label>
                <Select
                    value={selectedRate?.id?.toString()}
                    onValueChange={(v) => {
                      const rate = rates.find(r => r.id.toString() === v);
                      setSelectedRate(rate);
                    }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a rate" />
                  </SelectTrigger>
                  <SelectContent>
                    {rates?.map((rate) => (
                        <SelectItem key={rate.id} value={rate.id.toString()}>
                          {rate.title}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Emergency Contact */}
          <Card className="p-6 lg:col-span-3">
            <h3 className="text-lg font-semibold mb-4">Emergency Contact/ Next of Kin</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="emName">Contact Name</Label>
                <Input id="emName" value={formData.nos_name|| ''} onChange={e => handleChange('nos_name', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="emPhone">Contact Phone</Label>
                <Input id="emPhone" value={formData.nos_phone_no || ''} onChange={e => handleChange('nos_phone_no', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="emRelationship">Relationship</Label>
                <Input id="emRelationship" value={formData.nos_relationship || ''} onChange={e => handleChange('nos_relationship', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="emRelationship">Address</Label>
                <Input id="emRelationship" value={formData.nos_address || ''} onChange={e => handleChange('nos_address', e.target.value)} />
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={handleReset}><RotateCcw className="w-4 h-4 mr-2" />Reset</Button>
          <Button type="submit" size="lg"><Save className="w-4 h-4 mr-2" />Register Patient</Button>
        </div>
      </form>

      <Dialog open={showQrModal} onOpenChange={setShowQrModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Generate Registration Qr Code
            </DialogTitle>
            <DialogDescription>
              {`${selectedURL != '' ? 'Patient should Scan and fill the registration form': 'Click Generate to View QR Code'}`}
            </DialogDescription>
          </DialogHeader>

          {selectedURL != '' && (
              <div className="space-y-4">

                <QRCodeSVG
                    value={selectedURL}
                    size={256}
                    bgColor="#ffffff"
                    fgColor='#000000'
                    level= "H"

                />




              </div>

          )}
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => {
                  setShowQrModal(false)
                }}
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
                    Generate Qr
                  </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default PatientRegistration;
