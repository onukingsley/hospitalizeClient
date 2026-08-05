import React, { useState } from 'react';
import { useStaff } from '@/hooks/useData';
import { formatCurrency } from '@/lib/formatters';
import PageHeader from '@/components/common/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Users, UserPlus, Mail, Phone } from 'lucide-react';
import {adminUserManagement} from "../../store/store.jsx";

const StaffManagement = () => {
  const { staff, searchStaff } = useStaff();
  const [searchQuery, setSearchQuery] = useState('');

  const {accountants,totalAccountants,doctors,totalDoctors,clerks,totalClerks,nurses,totalNurses,pharmasists,totalPharmasists,labScientists,totalLabScientists,patients,totalPatients} = adminUserManagement()

  const filteredStaff = searchQuery ? searchStaff(searchQuery) : staff;

  const handleSearch = ()=>{

  }

  return (
    <div className="space-y-6">
      <PageHeader title="Staff Management" subtitle="Manage hospital staff and roles" breadcrumb={[{ label: 'Dashboard', path: '/admin' }, { label: 'Staff Management' }]} actions={<Button><UserPlus className="w-4 h-4 mr-2" />Add Staff</Button>} />

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

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Card className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Users className="w-5 h-5 text-primary" /></div>
                <div><p className="text-xl font-bold">{totalPatients}</p><p className="text-xs text-muted-foreground capitalize">{'Patients'}s</p></div>
            </Card>
            <Card className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Users className="w-5 h-5 text-primary" /></div>
                <div><p className="text-xl font-bold">{totalPharmasists}</p><p className="text-xs text-muted-foreground capitalize">{'pharmasists'}s</p></div>
            </Card>
            <Card className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Users className="w-5 h-5 text-primary" /></div>
                <div><p className="text-xl font-bold">{totalDoctors}</p><p className="text-xs text-muted-foreground capitalize">{'Patients'}s</p></div>
            </Card>
            <Card className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Users className="w-5 h-5 text-primary" /></div>
                <div><p className="text-xl font-bold">{totalNurses}</p><p className="text-xs text-muted-foreground capitalize">{'Nurses'}s</p></div>
            </Card>
            <Card className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Users className="w-5 h-5 text-primary" /></div>
                <div><p className="text-xl font-bold">{totalLabScientists}</p><p className="text-xs text-muted-foreground capitalize">{'LabScientists'}s</p></div>
            </Card>
            <Card className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Users className="w-5 h-5 text-primary" /></div>
                <div><p className="text-xl font-bold">{totalClerks}</p><p className="text-xs text-muted-foreground capitalize">{'Clerk'}s</p></div>
            </Card>
            <Card className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Users className="w-5 h-5 text-primary" /></div>
                <div><p className="text-xl font-bold">{totalAccountants}</p><p className="text-xs text-muted-foreground capitalize">{'Accountant'}s</p></div>
            </Card>
        </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search staff by name, ID, or email..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map(s => {
          const allowances = s.allowances.reduce((a, all) => a + all.amount, 0);
          const netPay = s.salary + allowances;
          return (
            <Card key={s.staffId} className="p-5 hover:shadow-md transition-all">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg flex-shrink-0">
                  {s.firstName[0]}{s.lastName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold truncate">{s.firstName} {s.lastName}</h4>
                  <p className="text-xs text-muted-foreground">{s.staffId}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="text-xs capitalize">{s.role}</Badge>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${s.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{s.status}</span>
                  </div>
                  <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                    <p className="flex items-center gap-1"><Mail className="w-3 h-3" />{s.email}</p>
                    <p className="flex items-center gap-1"><Phone className="w-3 h-3" />{s.phone}</p>
                    <p>Dept: {s.department}</p>
                    <p>Salary: {formatCurrency(s.salary)}</p>
                    <p>Net Pay: {formatCurrency(netPay)}</p>
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

export default StaffManagement;
