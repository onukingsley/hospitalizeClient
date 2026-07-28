import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLabTests, useEquipment } from '@/hooks/useData';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FlaskConical, Clock, CheckCircle, AlertTriangle, ArrowRight, Wrench } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#F59E0B', '#1B6FAE', '#10B981', '#EF4444'];

const LabDashboard = () => {
  const navigate = useNavigate();
  const { labTests } = useLabTests();
  const { equipment } = useEquipment();

  const pending = labTests.filter(t => t.status === 'ordered');
  const inProgress = labTests.filter(t => t.status === 'in-progress');
  const completed = labTests.filter(t => t.status === 'completed');
  const equipmentIssues = equipment.filter(e => e.status !== 'operational');

  const statusData = [
    { name: 'Pending', value: pending.length },
    { name: 'In Progress', value: inProgress.length },
    { name: 'Completed', value: completed.length },
    { name: 'Cancelled', value: labTests.filter(t => t.status === 'cancelled').length },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Laboratory Dashboard" subtitle="Test management and results" actions={<Button onClick={() => navigate('/lab/tests')}><FlaskConical className="w-4 h-4 mr-2" />Process Tests</Button>} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Pending Tests" value={pending.length} icon={<Clock className="w-5 h-5" />} color="bg-yellow-500" />
        <StatCard title="In Progress" value={inProgress.length} icon={<FlaskConical className="w-5 h-5" />} color="bg-blue-500" />
        <StatCard title="Completed Today" value={completed.length} icon={<CheckCircle className="w-5 h-5" />} color="bg-green-500" />
        <StatCard title="Equipment Issues" value={equipmentIssues.length} icon={<AlertTriangle className="w-5 h-5" />} color="bg-red-500" onClick={() => navigate('/lab/equipment')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Test Status Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {statusData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Pending Tests</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/lab/tests')}><ArrowRight className="w-4 h-4 ml-1" /></Button>
          </div>
          <div className="space-y-2 max-h-[220px] overflow-y-auto scrollbar-thin">
            {pending.slice(0, 6).map(test => (
              <div key={test.testId} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer" onClick={() => navigate('/lab/tests')}>
                <div>
                  <p className="text-sm font-medium">{test.testName}</p>
                  <p className="text-xs text-muted-foreground">{test.patientId} • Ordered by {test.orderedBy}</p>
                </div>
                <StatusBadge status={test.priority} size="sm" />
              </div>
            ))}
            {pending.length === 0 && <p className="text-center text-sm text-muted-foreground py-4">No pending tests</p>}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Equipment Status</h3>
          <Button variant="ghost" size="sm" onClick={() => navigate('/lab/equipment')}><Wrench className="w-4 h-4 mr-1" />Manage</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {equipment.slice(0, 6).map(eq => (
            <div key={eq.equipmentId} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="text-sm font-medium">{eq.name}</p>
                <p className="text-xs text-muted-foreground">{eq.model}</p>
              </div>
              <StatusBadge status={eq.status} size="sm" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default LabDashboard;
