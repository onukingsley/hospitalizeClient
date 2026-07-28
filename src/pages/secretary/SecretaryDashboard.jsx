import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeaveApplications, useStaff } from '@/hooks/useData';
import { formatNumber } from '@/lib/formatters';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Clock, ArrowRight, CheckCircle } from 'lucide-react';

const SecretaryDashboard = () => {
  const navigate = useNavigate();
  const { leaveApps, getPendingLeave } = useLeaveApplications();
  const { staff } = useStaff();

  const pendingLeave = getPendingLeave();
  const approvedLeave = leaveApps.filter(l => l.status === 'approved');
  const onLeaveStaff = staff.filter(s => s.status === 'on-leave');

  return (
    <div className="space-y-6">
      <PageHeader title="Secretary Dashboard" subtitle="Appointments, leave and correspondence" actions={<Button onClick={() => navigate('/secretary/leave')}><Calendar className="w-4 h-4 mr-2" />Apply Leave</Button>} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Staff" value={formatNumber(staff.length)} icon={<Users className="w-5 h-5" />} color="bg-blue-500" />
        <StatCard title="Pending Leave" value={formatNumber(pendingLeave.length)} icon={<Clock className="w-5 h-5" />} color="bg-yellow-500" />
        <StatCard title="Approved Leave" value={formatNumber(approvedLeave.length)} icon={<CheckCircle className="w-5 h-5" />} color="bg-green-500" />
        <StatCard title="Staff on Leave" value={formatNumber(onLeaveStaff.length)} icon={<Users className="w-5 h-5" />} color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Pending Leave Applications</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/secretary/leave')}><ArrowRight className="w-4 h-4 ml-1" /></Button>
          </div>
          <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-thin">
            {pendingLeave.map(leave => (
              <div key={leave.leaveId} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
                <div>
                  <p className="text-sm font-medium">{leave.staffName}</p>
                  <p className="text-xs text-muted-foreground">{leave.leaveType} • {leave.daysRequested} days</p>
                </div>
                <StatusBadge status={leave.status} size="sm" />
              </div>
            ))}
            {pendingLeave.length === 0 && <p className="text-center text-sm text-muted-foreground py-4">No pending leave applications</p>}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Staff on Leave</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/secretary/leave')}><ArrowRight className="w-4 h-4 ml-1" /></Button>
          </div>
          <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-thin">
            {approvedLeave.slice(0, 6).map(leave => (
              <div key={leave.leaveId} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
                <div>
                  <p className="text-sm font-medium">{leave.staffName}</p>
                  <p className="text-xs text-muted-foreground">{leave.startDate} to {leave.endDate}</p>
                </div>
                <span className="text-xs text-green-600 font-medium">{leave.daysRequested} days</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SecretaryDashboard;
