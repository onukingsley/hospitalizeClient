import React, {useEffect, useState} from 'react';
import { useStaff } from '@/hooks/useData';
import {useNavigate} from 'react-router-dom'
import { formatCurrency } from '@/lib/formatters';
import PageHeader from '@/components/common/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Users, UserPlus, Mail, Phone } from 'lucide-react';
import {adminUserManagement, diagnosisStore} from "../../store/store.jsx";
import StaffDetailModal from "../../components/modals/StaffDetailModal.jsx";
import PatientDetailModal from "../../components/modals/PatientDetailsModal.jsx";

const PatientManagement = () => {
    const { staff, searchStaff } = useStaff();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredStaff, setFilteredStaff] = useState(null);
    const navigate = useNavigate()

    const [showStaffModal, setShowStaffModal] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);

    const {inwardDiagnosis, outPatientDiagnosis} = diagnosisStore()
    const {totalPatients, accountants,totalAccountants,doctors,totalDoctors,clerks,totalClerks,nurses,totalNurses,pharmasists,totalPharmasists,labScientists,totalLabScientists,patients, staffs,noOfStaffs} = adminUserManagement()

    const [showPatientModal, setShowPatientModal] = useState(false);
    const [selectedPatientRegID, setSelectedPatientRegID] = useState(null);


    useEffect(()=>{
        if(searchQuery){
            const filter =  patients.filter((items)=> {
                return items.regID.toLowerCase().includes(searchQuery.toLowerCase()) || items.name.toLowerCase().includes(searchQuery.toLowerCase())
            })
            setFilteredStaff(filter)
        }else {setFilteredStaff(patients)}

    },[searchQuery,staffs])
    /*  const filteredStaff = (staffList)=>{
          if(searchQuery){
              return staffList.filter((items)=>items.regID.toLowerCase().includes(searchQuery.toLowerCase()))
          }else {return staffList}
      }*/


    const handleViewStaff = (staff) => {
        console.log(staff)
        setSelectedPatientRegID(staff);
        setShowPatientModal(true);
    };



    return (
        <div className="space-y-6">
            <PageHeader title="Staff Management" subtitle="Manage hospital staff and roles" breadcrumb={[{ label: 'Dashboard', path: '/admin' }, { label: 'Staff Management' }]} actions={<Button onClick={()=>{navigate('/admin/staffEnrollment')}}><UserPlus className="w-4 h-4 mr-2" />Add Staff</Button>} />

            {/*<div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {['admin', 'doctor', 'nurse', 'clerk', 'lab', 'pharmacy', 'finance', 'secretary'].map(role => {
          const count = staff.filter(s => s.role === role).length;
          return (
            <Card key={role} className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Users className="w-5 h-5 text-primary" /></div>
              <div><p className="text-xl font-bold">{count}</p><p className="text-xs text-muted-foreground capitalize">{role}s</p></div>
            </Card>
          );
        })}
      </div>*/}

            <PatientDetailModal
                open={showPatientModal}
                onOpenChange={setShowPatientModal}
                patientRegID={selectedPatientRegID}
            />



            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <Card className="p-4 flex items-center gap-3" onClick={()=>{setFilteredStaff(staffs)}}>
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Users className="w-5 h-5 text-primary" /></div>
                    <div><p className="text-xl font-bold">{totalPatients}</p><p className="text-xs text-muted-foreground capitalize">{'Total Patient'}s</p></div>
                </Card>{/*<Card className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Users className="w-5 h-5 text-primary" /></div>
                <div><p className="text-xl font-bold">{totalPatients}</p><p className="text-xs text-muted-foreground capitalize">{'Patient'}s</p></div>
            </Card>*/}
                <Card className="p-4 flex items-center gap-3" onClick={()=>{setFilteredStaff(pharmasists)}}>
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Users className="w-5 h-5 text-primary" /></div>
                    <div><p className="text-xl font-bold">{inwardDiagnosis.length}</p><p className="text-xs text-muted-foreground capitalize">{'InPatient'}s</p></div>
                </Card>
                <Card className="p-4 flex items-center gap-3" onClick={()=>{setFilteredStaff(pharmasists)}}>
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Users className="w-5 h-5 text-primary" /></div>
                    <div><p className="text-xl font-bold">{outPatientDiagnosis.length}</p><p className="text-xs text-muted-foreground capitalize">{'OutPatient'}s</p></div>
                </Card>

            </div>

            <Card className="p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search staff by name or ID..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStaff?.map(s => {
                    /* const allowances = s.allowances.reduce((a, all) => a + all.amount, 0);
                     const netPay = s.salary + allowances;*/
                    return (
                        <Card key={s.id} className="p-5 hover:shadow-md transition-all" onClick={()=>{handleViewStaff(s?.user?.regID)}}>
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg flex-shrink-0">
                                    {s?.user?.name[0]}{s?.user?.name[1]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold truncate">{s?.user?.name}</h4>
                                    <p className="text-xs text-muted-foreground">{s?.user?.regID}</p>
                                    <div className="flex gap-2 mt-2">
                                        <Badge variant="outline" className="text-xs capitalize">{s?.user?.user_role}</Badge>
                                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${s?.user?.suspended === '0' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{s?.user?.suspended}</span>
                                    </div>
                                    <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                                        <p className="flex items-center gap-1"><Mail className="w-3 h-3" />{s?.user?.email}</p>
                                        <p className="flex items-center gap-1"><Phone className="w-3 h-3" />{s?.user?.phone_no}</p>
                                        <p>Dept: {s?.user?.user_role}</p>
                                        {/* <p>Salary: {formatCurrency(s.salary)}</p>
                    <p>Net Pay: {formatCurrency(netPay)}</p>*/}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default PatientManagement;
