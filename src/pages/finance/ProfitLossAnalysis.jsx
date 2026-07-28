import React from 'react';
import { useBills, useDrugSales, usePurchases, useStaff } from '@/hooks/useData';
import { formatCurrency } from '@/lib/formatters';
import PageHeader from '@/components/common/PageHeader';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Wallet, Pill } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';

const COLORS = ['#1B6FAE', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const ProfitLossAnalysis = () => {
  const { bills } = useBills();
  const { sales } = useDrugSales();
  const { purchases } = usePurchases();
  const { staff } = useStaff();

  const totalRevenue = bills.filter(b => b.paymentStatus === 'paid').reduce((sum, b) => sum + b.amountPaid, 0);
  const totalDrugSales = sales.filter(s => s.paymentStatus === 'paid').reduce((sum, s) => sum + s.amountPaid, 0);
  const totalPurchases = purchases.reduce((sum, p) => sum + p.totalAmount, 0);
  const monthlySalary = staff.reduce((sum, s) => {
    const allowances = s.allowances.reduce((a, all) => a + all.amount, 0);
    return sum + s.salary + allowances;
  }, 0);
  const netProfit = totalRevenue + totalDrugSales - totalPurchases - monthlySalary;

  const monthlyData = [
    { month: 'Jan', revenue: 1250000, drugSales: 450000, expenses: 980000, payroll: 320000 },
    { month: 'Feb', revenue: 1420000, drugSales: 520000, expenses: 1050000, payroll: 320000 },
    { month: 'Mar', revenue: 1380000, drugSales: 480000, expenses: 1100000, payroll: 350000 },
    { month: 'Apr', revenue: 1650000, drugSales: 610000, expenses: 1200000, payroll: 350000 },
  ];

  const revenueBreakdown = [
    { name: 'Consultations', value: totalRevenue * 0.4 },
    { name: 'Drug Sales', value: totalDrugSales },
    { name: 'Lab Tests', value: totalRevenue * 0.3 },
    { name: 'Procedures', value: totalRevenue * 0.2 },
    { name: 'Room Charges', value: totalRevenue * 0.1 },
  ];

  const expenseBreakdown = [
    { name: 'Stock Purchases', value: totalPurchases },
    { name: 'Payroll', value: monthlySalary },
    { name: 'Utilities', value: 150000 },
    { name: 'Maintenance', value: 80000 },
    { name: 'Other', value: 50000 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Profit & Loss Analysis" subtitle="Financial performance overview" breadcrumb={[{ label: 'Dashboard', path: '/finance' }, { label: 'P&L Analysis' }]} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-4"><div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center"><TrendingUp className="w-6 h-6 text-green-600" /></div><div><p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue + totalDrugSales)}</p><p className="text-sm text-muted-foreground">Total Revenue</p></div></Card>
        <Card className="p-4 flex items-center gap-4"><div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center"><TrendingDown className="w-6 h-6 text-red-600" /></div><div><p className="text-2xl font-bold text-red-600">{formatCurrency(totalPurchases + monthlySalary)}</p><p className="text-sm text-muted-foreground">Total Expenses</p></div></Card>
        <Card className="p-4 flex items-center gap-4"><div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center"><Wallet className="w-6 h-6 text-blue-600" /></div><div><p className="text-2xl font-bold text-blue-600">{formatCurrency(netProfit)}</p><p className="text-sm text-muted-foreground">Net Profit</p></div></Card>
        <Card className="p-4 flex items-center gap-4"><div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center"><Pill className="w-6 h-6 text-purple-600" /></div><div><p className="text-2xl font-bold text-purple-600">{formatCurrency(totalDrugSales)}</p><p className="text-sm text-muted-foreground">Drug Sales</p></div></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly P&L Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `₦${(v/1000000).toFixed(1)}M`} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Area type="monotone" dataKey="revenue" stackId="1" stroke="#1B6FAE" fill="#1B6FAE" fillOpacity={0.3} name="Revenue" />
              <Area type="monotone" dataKey="drugSales" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.3} name="Drug Sales" />
              <Area type="monotone" dataKey="expenses" stackId="2" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} name="Expenses" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={revenueBreakdown} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                {revenueBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Expense Breakdown</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={expenseBreakdown} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis type="number" stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `₦${(v/1000).toFixed(0)}K`} />
            <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={100} />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Bar dataKey="value" fill="#EF4444" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default ProfitLossAnalysis;
