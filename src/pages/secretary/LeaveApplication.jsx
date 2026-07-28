import React, { useState } from 'react';
import { useLeaveApplications } from '@/hooks/useData';

import { formatDate } from '@/lib/formatters';
import PageHeader from '@/components/common/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LEAVE_TYPES } from '@/lib/constants';
import { toast } from 'sonner';
import { Calendar, Plus, Save, Clock, CheckCircle, XCircle } from 'lucide-react';

const LeaveApplicationPage= () => {
  const { leaveApps, addLeave, updateLeave } = useLeaveApplications();
  const [showForm, setShowForm] = useState(false);
  const [leaveType, setLeaveType] = useState('annual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const myLeave = leaveApps.filter(l => l.staffId === 'SEC001');
  const pendingLeave = leaveApps.filter(l => l.status === 'pending');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason) {
      toast.error('Please fill in all fields');
      return;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const newLeave = {
      leaveId: `LV_${Date.now()}`,
      staffId: 'SEC001',
      staffName: 'Patience Obi',
      leaveType: leaveType ,
      startDate,
      endDate,
      daysRequested: days,
      reason,
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0],
    };
    addLeave(newLeave);
    toast.success('Leave application submitted');
    setShowForm(false);
    setLeaveType('annual');
    setStartDate('');
    setEndDate('');
    setReason('');
  };

  const handleApprove = (leaveId) => {
    updateLeave(leaveId, { status: 'approved', approvedBy: 'ADM001', approvalDate: new Date().toISOString().split('T')[0] });
    toast.success('Leave approved');
  };

  const handleReject = (leaveId) => {
    updateLeave(leaveId, { status: 'rejected' });
    toast.info('Leave rejected');
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Leave Application" subtitle="Apply for leave and track status" breadcrumb={[{ label: 'Dashboard', path: '/secretary' }, { label: 'Leave Application' }]} actions={<Button onClick={() => setShowForm(!showForm)}><Plus className="w-4 h-4 mr-2" />Apply Leave</Button>} />

      {showForm && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">New Leave Application</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label>Leave Type</Label>
              <Select value={leaveType} onValueChange={setLeaveType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {LEAVE_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Start Date</Label>
              <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
            </div>
            <div>
              <Label>End Date</Label>
              <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
            </div>
            <div className="sm:col-span-2 lg:col-span-4">
              <Label>Reason</Label>
              <Textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Reason for leave..." required />
            </div>
            <div className="sm:col-span-2 lg:col-span-4 flex gap-3">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit"><Save className="w-4 h-4 mr-2" />Submit</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-yellow-500" />My Leave Applications</h3>
          <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin">
            {myLeave.map(leave => (
              <div key={leave.leaveId} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{LEAVE_TYPES.find(t => t.value === leave.leaveType)?.label}</p>
                      <StatusBadge status={leave.status} size="sm" />
                    </div>
                    <p className="text-xs text-muted-foreground">{formatDate(leave.startDate)} to {formatDate(leave.endDate)} • {leave.daysRequested} days</p>
                    <p className="text-sm mt-1">{leave.reason}</p>
                  </div>
                </div>
              </div>
            ))}
            {myLeave.length === 0 && <p className="text-center text-muted-foreground py-4">No leave applications</p>}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-primary" />Pending Approvals</h3>
          <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin">
            {pendingLeave.map(leave => (
              <div key={leave.leaveId} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{leave.staffName}</p>
                    <p className="text-xs text-muted-foreground">{LEAVE_TYPES.find(t => t.value === leave.leaveType)?.label} • {leave.daysRequested} days</p>
                    <p className="text-sm mt-1">{leave.reason}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-green-600" onClick={() => handleApprove(leave.leaveId)}><CheckCircle className="w-4 h-4" /></Button>
                    <Button size="sm" variant="outline" className="text-red-600" onClick={() => handleReject(leave.leaveId)}><XCircle className="w-4 h-4" /></Button>
                  </div>
                </div>
              </div>
            ))}
            {pendingLeave.length === 0 && <p className="text-center text-muted-foreground py-4">No pending approvals</p>}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LeaveApplicationPage;
