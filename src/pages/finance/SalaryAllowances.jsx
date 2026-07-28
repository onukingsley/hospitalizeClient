import React, { useState } from 'react';
import { useStaff } from '@/hooks/useData';
import { formatCurrency } from '@/lib/formatters';
import PageHeader from '@/components/common/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Wallet, Printer, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const SalaryAllowances = () => {
  const { staff } = useStaff();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(null);

  const filteredStaff = searchQuery
    ? staff.filter(s => `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) || s.staffId.toLowerCase().includes(searchQuery.toLowerCase()))
    : staff;

  const totalPayroll = filteredStaff.reduce((sum, s) => {
    const allowances = s.allowances.reduce((a, all) => a + all.amount, 0);
    const deductions = s.deductions.reduce((d, ded) => d + ded.amount, 0);
    return sum + s.salary + allowances - deductions;
  }, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Salary & Allowances" subtitle="Staff salary processing and payslips" breadcrumb={[{ label: 'Dashboard', path: '/finance' }, { label: 'Salary & Allowances' }]} actions={<Button><Printer className="w-4 h-4 mr-2" />Print All</Button>} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-4"><div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center"><Wallet className="w-6 h-6 text-blue-600" /></div><div><p className="text-2xl font-bold">{formatCurrency(totalPayroll)}</p><p className="text-sm text-muted-foreground">Monthly Payroll</p></div></Card>
        <Card className="p-4 flex items-center gap-4"><div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center"><Wallet className="w-6 h-6 text-green-600" /></div><div><p className="text-2xl font-bold">{staff.length}</p><p className="text-sm text-muted-foreground">Total Staff</p></div></Card>
        <Card className="p-4 flex items-center gap-4"><div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center"><Wallet className="w-6 h-6 text-yellow-600" /></div><div><p className="text-2xl font-bold">{staff.filter(s => s.status === 'active').length}</p><p className="text-sm text-muted-foreground">Active Staff</p></div></Card>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search staff..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
      </Card>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3 font-medium">Staff ID</th>
              <th className="text-left p-3 font-medium">Name</th>
              <th className="text-left p-3 font-medium">Role</th>
              <th className="text-left p-3 font-medium">Department</th>
              <th className="text-left p-3 font-medium">Basic Salary</th>
              <th className="text-left p-3 font-medium">Net Pay</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-left p-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map(s => {
              const allowances = s.allowances.reduce((a, all) => a + all.amount, 0);
              const deductions = s.deductions.reduce((d, ded) => d + ded.amount, 0);
              const netPay = s.salary + allowances - deductions;
              return (
                <tr key={s.staffId} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="p-3 font-medium">{s.staffId}</td>
                  <td className="p-3">{s.firstName} {s.lastName}</td>
                  <td className="p-3"><Badge variant="outline" className="text-xs capitalize">{s.role}</Badge></td>
                  <td className="p-3 text-muted-foreground">{s.department}</td>
                  <td className="p-3">{formatCurrency(s.salary)}</td>
                  <td className="p-3 font-semibold">{formatCurrency(netPay)}</td>
                  <td className="p-3"><span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${s.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{s.status}</span></td>
                  <td className="p-3"><Button variant="ghost" size="sm" onClick={() => setSelectedStaff(s)}><Eye className="w-4 h-4" /></Button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Payslip Dialog */}
      <Dialog open={!!selectedStaff} onOpenChange={() => setSelectedStaff(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Payslip</DialogTitle></DialogHeader>
          {selectedStaff && (
            <div className="space-y-4">
              <div className="text-center border-b pb-4">
                <h3 className="text-xl font-bold">Hospitalise Medical Center</h3>
                <p className="text-sm text-muted-foreground">Payslip for April 2025</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p className="text-muted-foreground">Name:</p><p className="font-medium">{selectedStaff.firstName} {selectedStaff.lastName}</p>
                <p className="text-muted-foreground">Staff ID:</p><p className="font-medium">{selectedStaff.staffId}</p>
                <p className="text-muted-foreground">Department:</p><p className="font-medium">{selectedStaff.department}</p>
                <p className="text-muted-foreground">Role:</p><p className="font-medium capitalize">{selectedStaff.role}</p>
              </div>
              <div className="border-t pt-3">
                <p className="font-semibold mb-2">Earnings</p>
                <div className="flex justify-between text-sm"><span>Basic Salary</span><span>{formatCurrency(selectedStaff.salary)}</span></div>
                {selectedStaff.allowances.map((all, i) => (
                  <div key={i} className="flex justify-between text-sm"><span>{all.name}</span><span className="text-green-600">+{formatCurrency(all.amount)}</span></div>
                ))}
              </div>
              <div className="border-t pt-3">
                <p className="font-semibold mb-2">Deductions</p>
                {selectedStaff.deductions.map((ded, i) => (
                  <div key={i} className="flex justify-between text-sm"><span>{ded.name}</span><span className="text-red-600">-{formatCurrency(ded.amount)}</span></div>
                ))}
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Net Pay</span>
                <span>{formatCurrency(selectedStaff.salary + selectedStaff.allowances.reduce((a, all) => a + all.amount, 0) - selectedStaff.deductions.reduce((d, ded) => d + ded.amount, 0))}</span>
              </div>
              <Button className="w-full"><Printer className="w-4 h-4 mr-2" />Print Payslip</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SalaryAllowances;
