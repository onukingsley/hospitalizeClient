import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatients, useDiagnoses, useBills, useStaff, useDrugs, useEquipment, useLabTests } from '@/hooks/useData';
import { formatCurrency, formatNumber } from '@/lib/formatters';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users, Stethoscope, Banknote, Pill, FlaskConical,
  Wrench, UserPlus, ArrowRight,
  AlertTriangle, CheckCircle, Clock
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#1B6FAE', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { patients } = usePatients();
  const { diagnoses } = useDiagnoses();
  const { bills } = useBills();
  const { staff } = useStaff();
  const { drugs } = useDrugs();
  const { equipment } = useEquipment();
  const { labTests } = useLabTests();

  const totalRevenue = bills.filter(b => b.paymentStatus === 'paid').reduce((sum, b) => sum + b.amountPaid, 0);
  const activeDiagnoses = diagnoses.filter(d => d.status === 'active').length;
  const pendingLabTests = labTests.filter(t => t.status === 'ordered').length;
  const lowStockDrugs = drugs.filter(d => d.stockQuantity <= d.reorderLevel).length;
  const equipmentIssues = equipment.filter(e => e.status !== 'operational').length;

  const monthlyRevenue = [
    { month: 'Jan', revenue: 1250000, expenses: 980000 },
    { month: 'Feb', revenue: 1420000, expenses: 1050000 },
    { month: 'Mar', revenue: 1380000, expenses: 1100000 },
    { month: 'Apr', revenue: 1650000, expenses: 1200000 },
  ];

  const departmentDistribution = [
    { name: 'General Medicine', value: 35 },
    { name: 'Pediatrics', value: 20 },
    { name: 'Surgery', value: 15 },
    { name: 'Obstetrics', value: 15 },
    { name: 'Emergency', value: 10 },
    { name: 'Other', value: 5 },
  ];

  const patientStats = {
    total: patients.length,
    newThisMonth: patients.filter(p => p.registrationDate.startsWith('2025-04')).length,
    male: patients.filter(p => p.gender === 'male').length,
    female: patients.filter(p => p.gender === 'female').length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        subtitle="System overview and key metrics"
        actions={
          <Button onClick={() => navigate('/admin/staff')}>
            <UserPlus className="w-4 h-4 mr-2" />
            Manage Staff
          </Button>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Patients"
          value={formatNumber(patientStats.total)}
          change={12}
          changeLabel="vs last month"
          icon={<Users className="w-5 h-5" />}
          color="bg-blue-500"
          onClick={() => navigate('/clerk/patients')}
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          change={8.5}
          changeLabel="vs last month"
          icon={<Banknote className="w-5 h-5" />}
          color="bg-green-500"
          onClick={() => navigate('/finance/payments')}
        />
        <StatCard
          title="Active Diagnoses"
          value={formatNumber(activeDiagnoses)}
          change={-2}
          changeLabel="vs last month"
          icon={<Stethoscope className="w-5 h-5" />}
          color="bg-purple-500"
          onClick={() => navigate('/doctor/diagnosis')}
        />
        <StatCard
          title="Staff Members"
          value={formatNumber(staff.length)}
          icon={<Users className="w-5 h-5" />}
          color="bg-orange-500"
          onClick={() => navigate('/admin/staff')}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{pendingLabTests}</p>
            <p className="text-sm text-muted-foreground">Pending Lab Tests</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
            <Pill className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{lowStockDrugs}</p>
            <p className="text-sm text-muted-foreground">Low Stock Drugs</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
            <Wrench className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{equipmentIssues}</p>
            <p className="text-sm text-muted-foreground">Equipment Issues</p>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Revenue vs Expenses</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/finance/pl-analysis')}>
              View Details <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `₦${(v/1000000).toFixed(1)}M`} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Area type="monotone" dataKey="revenue" stroke="#1B6FAE" fill="#1B6FAE" fillOpacity={0.1} strokeWidth={2} name="Revenue" />
              <Area type="monotone" dataKey="expenses" stroke="#EF4444" fill="#EF4444" fillOpacity={0.1} strokeWidth={2} name="Expenses" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Department Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Department Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={departmentDistribution}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {departmentDistribution.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2 justify-center">
            {departmentDistribution.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1 text-xs">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-muted-foreground">{d.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Bills */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Pending Bills</h3>
          <div className="space-y-3">
            {bills.filter(b => b.paymentStatus === 'pending').slice(0, 5).map(bill => (
              <div key={bill.billId} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">{bill.billId}</p>
                  <p className="text-xs text-muted-foreground">{bill.patientId}</p>
                </div>
                <p className="text-sm font-semibold text-red-600">{formatCurrency(bill.balance)}</p>
              </div>
            ))}
            {bills.filter(b => b.paymentStatus === 'pending').length === 0 && (
              <div className="text-center text-sm text-muted-foreground py-4">No pending bills</div>
            )}
          </div>
          <Button variant="ghost" className="w-full mt-3" size="sm" onClick={() => navigate('/finance/payments')}>
            View All Bills <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Card>

        {/* System Alerts */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">System Alerts</h3>
          <div className="space-y-3">
            {lowStockDrugs > 0 && (
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Low Stock Alert</p>
                  <p className="text-xs text-red-600">{lowStockDrugs} drugs below reorder level</p>
                </div>
              </div>
            )}
            {equipmentIssues > 0 && (
              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                <Wrench className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Equipment Maintenance</p>
                  <p className="text-xs text-yellow-600">{equipmentIssues} equipment items need attention</p>
                </div>
              </div>
            )}
            {pendingLabTests > 0 && (
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <FlaskConical className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Pending Lab Tests</p>
                  <p className="text-xs text-blue-600">{pendingLabTests} tests awaiting processing</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800">System Status</p>
                <p className="text-xs text-green-600">All systems operational</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label: 'Register New Patient', path: '/clerk/registration', icon: <UserPlus className="w-4 h-4" /> },
              { label: 'Create Diagnosis', path: '/doctor/diagnosis/new', icon: <Stethoscope className="w-4 h-4" /> },
              { label: 'Process Lab Results', path: '/lab/tests', icon: <FlaskConical className="w-4 h-4" /> },
              { label: 'Dispense Drugs', path: '/pharmacy/dispense', icon: <Pill className="w-4 h-4" /> },
              { label: 'Process Payments', path: '/finance/payments', icon: <Banknote className="w-4 h-4" /> },
            ].map(action => (
              <button
                key={action.path}
                onClick={() => navigate(action.path)}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
              >
                <div className="text-primary">{action.icon}</div>
                <span className="text-sm font-medium">{action.label}</span>
                <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground" />
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
