import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useBills, useDrugSales, usePurchases, useStaff } from '@/hooks/useData';
import { formatCurrency } from '@/lib/formatters';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {Banknote, TrendingUp, TrendingDown, Wallet, ArrowRight, AlertCircle, Calendar} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import {
    diagnosisStore,
    drugStore,
    labStore,
    paymentStore,
    salaryLeaveStore,
    UnitReportStore
} from "../../store/store.jsx";
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { format } from 'date-fns';
import axiosClient from "../../service/axiosClient.js";

const AdminOverview = () => {
    const navigate = useNavigate();

    const {totalRevenue,totalConsultation,deptChart,totalDrugSale,totalExpenses,totalLabTest,totalSalary,pnlChart, payments,
        setPayment,setCreditPayment,setDebitPayment,setRate,setTotalRevenue,setTotalExpenses,setTotalSalary,setTotalConsultation,setTotalDrugSale,setTotalLabTest,setDeptChart,setPnlChart,netProfit,setPendingPayment,pendingPayment
    } = paymentStore()

    const {setDrugRestockRequest,setDrugSale} = drugStore()
    const {setConsultations} = diagnosisStore()
    const {setLabTest} = labStore()
    const {setsalaryallowance} = salaryLeaveStore()
    const {setReport} = UnitReportStore()
    const [dateRange, setDateRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    });



    const { bills } = useBills();
    const { sales } = useDrugSales();
    const { purchases } = usePurchases();
    const { staff } = useStaff();

    //const totalRevenue = bills.filter(b => b.paymentStatus === 'paid').reduce((sum, b) => sum + b.amountPaid, 0);
    //const pendingRevenue = bills.filter(b => b.paymentStatus === 'pending').reduce((sum, b) => sum + b.balance, 0);
    const pendingRevenue = pendingPayment?.filter(b => b?.completion_status == 'pending').reduce((sum, b) => sum + parseInt(b.outStanding_balance), 0);
    const totalDrugSales = sales.filter(s => s.paymentStatus === 'paid').reduce((sum, s) => sum + s.amountPaid, 0);
    const totalPurchases = purchases.reduce((sum, p) => sum + p.totalAmount, 0);
    const monthlySalary = staff.reduce((sum, s) => {
        const allowances = s.allowances.reduce((a, all) => a + all.amount, 0);
        return sum + s.salary + allowances;
    }, 0);

    const revenueData = [
        { month: 'Jan', revenue: 1250000, expenses: 980000 },
        { month: 'Feb', revenue: 1420000, expenses: 1050000 },
        { month: 'Mar', revenue: 1380000, expenses: 1100000 },
        { month: 'Apr', revenue: 1650000, expenses: 1200000 },
    ];

    const departmentRevenue = [
        { dept: 'Consultation', amount: totalConsultation || 0 },
        { dept: 'Laboratory', amount: totalLabTest || 0 },
        { dept: 'Pharmacy', amount: totalDrugSale || 0 },
        //{ dept: 'Procedures', amount: 180000 },
        //{ dept: 'Room', amount: 120000 },
    ];


    const [isOpen, setIsOpen] = useState(false);

    const handleApply = () => {
        const payload = {
            start_date: format(dateRange.startDate, 'yyyy-MM-dd'),
            end_date: format(dateRange.endDate, 'yyyy-MM-dd'),
        };

        console.log(payload)

        axiosClient.get(`/getAccountantOverview?start_date=${payload.start_date}&end_date=${payload.end_date}`
        )
            .then(({data})=>{
                setRate(data.data.hospitalRates)
                setsalaryallowance(data.data.salary)
                setPayment(data.data.payments)
                setDrugSale(data.data.drugSales)
                setLabTest(data.data.labTests)
                setCreditPayment(data.data.revenue)
                setDebitPayment(data.data.expenses)
                setReport(data.data.unitReport)
                setTotalRevenue(data.data.totalRevenue)
                setTotalExpenses(data.data.totalExpenses)
                setDrugRestockRequest(data.data.stockRequest)
                setPnlChart(data.data.pnlChart)
                setDeptChart(data.data.deptChart)
                setConsultations(data.data.consultations)
                setTotalLabTest(data.data.totalLabTest)
                setTotalDrugSale(data.data.totalDrugSale)
                setTotalConsultation(data.data.totalConsultation)
                setTotalSalary(data.data.totalSalary)
            })

            .catch(e=>console.log(e))

        setIsOpen(false);
    };

    const handleClear = () => {
        setDateRange({
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        });
        axiosClient.get(`/getAccountantOverview`
        )
            .then(({data})=>{
                setRate(data.data.hospitalRates)
                setsalaryallowance(data.data.salary)
                setPayment(data.data.payments)
                setDrugSale(data.data.drugSales)
                setLabTest(data.data.labTests)
                setCreditPayment(data.data.revenue)
                setDebitPayment(data.data.expenses)
                setReport(data.data.unitReport)
                setTotalRevenue(data.data.totalRevenue)
                setTotalExpenses(data.data.totalExpenses)
                setDrugRestockRequest(data.data.stockRequest)
                setPnlChart(data.data.pnlChart)
                setDeptChart(data.data.deptChart)
                setConsultations(data.data.consultations)
                setTotalLabTest(data.data.totalLabTest)
                setTotalDrugSale(data.data.totalDrugSale)
                setTotalConsultation(data.data.totalConsultation)
                setTotalSalary(data.data.totalSalary)
            })

            .catch(e=>console.log(e))

        setIsOpen(false);
    };

    const getDisplayText = () => {
        if (!dateRange) return 'Select date range';
        const start = format(dateRange.startDate, 'MMM dd, yyyy');
        const end = format(dateRange.endDate, 'MMM dd, yyyy');
        if (start === end) return start;
        return `${start} - ${end}`;
    };




    return (
        <div className="space-y-6">
            {/*<PageHeader title="Financial Dashboard" subtitle="Revenue, expenses and financial analytics" actions={<Button onClick={() => navigate('/finance/pl-analysis')}><TrendingUp className="w-4 h-4 mr-2" />P&L Analysis</Button>} />*/}
            <PageHeader title="Financial Dashboard" subtitle="Revenue, expenses and financial analytics" actions={
                <>
                    <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>{getDisplayText()}</span>
                    </Button>

                    {isOpen && (
                        <div className="absolute right-0 top-0 z-50 mt-2 bg-white rounded-lg shadow-2xl border p-4">
                            <DateRangePicker
                                ranges={[dateRange]}
                                onChange={(item) => {
                                    console.log(item)
                                    setDateRange(item.selection)
                                }}
                                moveRangeOnFirstSelection={false}
                                months={1}
                                direction="horizontal"
                                className="date-range-custom"
                            />
                            <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                                <Button variant="ghost" size="sm" onClick={handleClear}>
                                    Clear
                                </Button>
                                <Button size="sm" onClick={handleApply}>
                                    Apply
                                </Button>
                            </div>
                        </div>
                    )}
                </>

            } />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Revenue" value={parseInt(totalRevenue).toLocaleString()} change={12.5} changeLabel="vs last month" icon={<Banknote className="w-5 h-5" />} color="bg-green-500" />
                <StatCard title="Total Expenses" value={parseInt(totalExpenses).toLocaleString()} change={12.5} changeLabel="vs last month" icon={<Banknote className="w-5 h-5" />} color="bg-red-500" />
                <StatCard title="Pending Payments" value={'₦'+pendingRevenue?.toLocaleString()} icon={<AlertCircle className="w-5 h-5" />} color="bg-yellow-500" />
                <StatCard title="No of pending Payment" value={pendingPayment?.length} icon={<AlertCircle className="w-5 h-5" />} color="bg-yellow-500" />
                <StatCard title="Lab Tests" value={parseInt(totalLabTest).toLocaleString()} icon={<AlertCircle className="w-5 h-5" />} color="bg-yellow-500" />
                <StatCard title="Drug Sales" value={parseInt(totalDrugSale).toLocaleString()} change={8.2} changeLabel="vs last month" icon={<TrendingUp className="w-5 h-5" />} color="bg-blue-500" />
                <StatCard title="Consultation" value={parseInt(totalConsultation).toLocaleString()} change={8.2} changeLabel="vs last month" icon={<TrendingUp className="w-5 h-5" />} color="bg-blue-500" />
                <StatCard title="Monthly Payroll" value={totalSalary} icon={<Wallet className="w-5 h-5" />} color="bg-purple-500" />
                <StatCard title="Payment Count" value={payments.length} icon={<Wallet className="w-5 h-5" />} color="bg-purple-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Revenue vs Expenses Trend</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={pnlChart }>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `₦${(v/1000000).toFixed(1)}M`} />
                            <Tooltip formatter={(value) => value} />
                            <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="#10B981" fillOpacity={0.1} strokeWidth={2} name="Revenue" />
                            <Area type="monotone" dataKey="expenses" stroke="#EF4444" fill="#EF4444" fillOpacity={0.1} strokeWidth={2} name="Expenses" />
                        </AreaChart>
                    </ResponsiveContainer>
                </Card>

                <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Revenue by Department</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={deptChart}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="dept" stroke="#94a3b8" fontSize={11} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `₦${(v/1000).toFixed(0)}K`} />
                            <Tooltip formatter={(value) => value} />
                            <Bar dataKey="amount" fill="#1B6FAE" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Pending Bills</h3>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/finance/payments')}><ArrowRight className="w-4 h-4 ml-1" /></Button>
                    </div>
                    <div className="space-y-2 max-h-[250px] overflow-y-auto scrollbar-thin">
                        {bills.filter(b => b.paymentStatus === 'pending').slice(0, 5).map(bill => (
                            <div key={bill.billId} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
                                <div>
                                    <p className="text-sm font-medium">{bill.billId}</p>
                                    <p className="text-xs text-muted-foreground">{bill.patientId}</p>
                                </div>
                                <p className="text-sm font-semibold text-red-600">{formatCurrency(bill.balance)}</p>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Financial Summary</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                            <span className="text-sm font-medium">Total Revenue</span>
                            <span className="text-sm font-bold text-green-600">{totalRevenue}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                            <span className="text-sm font-medium">Total Expenses</span>
                            <span className="text-sm font-bold text-red-600">{totalExpenses}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                            <span className="text-sm font-medium">Net Profit</span>
                            <span className="text-sm font-bold text-blue-600">{netProfit}</span>
                        </div>

                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                        {[
                            { label: 'Process Payments', path: '/finance/payments', icon: <Banknote className="w-4 h-4" /> },
                            { label: 'P&L Analysis', path: '/finance/pl-analysis', icon: <TrendingUp className="w-4 h-4" /> },
                            { label: 'Salary Processing', path: '/finance/salary', icon: <Wallet className="w-4 h-4" /> },
                            { label: 'Stock Purchases', path: '/finance/purchases', icon: <TrendingDown className="w-4 h-4" /> },
                        ].map(action => (
                            <button key={action.path} onClick={() => navigate(action.path)} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left">
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

export default AdminOverview;
