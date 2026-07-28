import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useDrugs, useDrugSales } from '@/hooks/useData';
import { formatCurrency, formatNumber } from '@/lib/formatters';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {Pill, ShoppingCart, AlertTriangle, TrendingUp, ArrowRight, Package, Eye, TestTube2} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {drugStore, labStore, paymentStore} from "../../store/store.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import SaleDetailModal from "../../components/modals/DrugSaleModal.jsx";

const LabOverview = () => {
    const navigate = useNavigate();
    const {  getLowStockDrugs, getExpiringDrugs } = useDrugs();
    const { sales } = useDrugSales();

    const {drugs,outOfStock,lowStock,drugSale,drugRestockRequest,pendingDrugs} = drugStore()
    const {labStock,labLowStock,labOutOfStock,labTest,allLabTest,labRestockRequest,pendingLabRestockRequest,labPendingStock,myLabRestockRequest} = labStore()
    const {totalRevenue} = paymentStore()
    const [showDrugModal, setShowDrugModal] = useState(false);
    const [seletedDrugModal, setSelectedDrugModal] = useState({});


    //const lowStock = getLowStockDrugs();
    const expiring = getExpiringDrugs();
    const todaySales = sales.filter(s => s.saleDate === '2025-04-18');
    /*const todayRevenue = todaySales.reduce((sum, s) => sum + s.amountPaid, 0);*/

    const topDrugs = [...sales.flatMap(s => s.items)]
        .reduce((acc, item) => {
            acc[item.drugName] = (acc[item.drugName] || 0) + item.quantity;
            return acc;
        }, {} );

    const topDrugsChart = Object.entries(topDrugs)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 6)
        .map(([name, count]) => ({ name: name.split(' ').slice(0, 2).join(' '), count }));

    return (
        <div className="space-y-6">
            <div className='w-[100%]'>
                <SaleDetailModal
                    open={showDrugModal}
                    onOpenChange={setShowDrugModal}
                    saleId={1}
                    saleSelect={seletedDrugModal}
                />
            </div>


            <PageHeader title="Laboratory Dashboard" subtitle="Drug inventory and dispensing" actions={<Button onClick={() => navigate('/pharmacy/dispense')}><Pill className="w-4 h-4 mr-2" />Dispense Drugs</Button>} />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total labStock" value={labStock?.length} icon={<Pill className="w-5 h-5" />} color="bg-blue-500" onClick={() => navigate('/pharmacy/stock')} />
                <StatCard title="Total labTests" value={labTest?.length} icon={<TestTube2 className="w-5 h-5" />} color="bg-blue-500" onClick={() => navigate('/pharmacy/stock')} />
                <StatCard title="Low Stock Alerts" value={labLowStock?.length} icon={<AlertTriangle className="w-5 h-5" />} color="bg-red-500" onClick={() => navigate('/pharmacy/stock')} />
                <StatCard title="Out of Stock" value={labOutOfStock?.length} icon={<AlertTriangle className="w-5 h-5" />} color="bg-red-500" onClick={() => navigate('/pharmacy/stock')} />
                <StatCard title="Today's Sales" value={labTest.length} icon={<ShoppingCart className="w-5 h-5" />} color="bg-green-500" />
                <StatCard title="month's Revenue" value={totalRevenue?.toLocaleString()} icon={<TrendingUp className="w-5 h-5" />} color="bg-purple-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Selling Drugs</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topDrugsChart} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#94a3b8" fontSize={11} />
              <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={80} />
              <Tooltip />
              <Bar dataKey="count" fill="#1B6FAE" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>*/}

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Out of Stock Equipment</h3>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/pharmacy/stock')}><ArrowRight className="w-4 h-4 ml-1" /></Button>
                    </div>
                    <div className="space-y-2 max-h-[250px] overflow-y-auto scrollbar-thin">
                        {labOutOfStock?.slice(0, 6).map(item => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                <div>
                                    <p className="text-sm font-medium">{item.name}</p>
                                    <p className="text-xs text-muted-foreground"> ₦{parseInt(item.amount).toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-red-600">{item.quantity} units</p>
                                    <p className="text-xs text-muted-foreground">Min: {item?.reorderLevel}</p>
                                </div>
                            </div>
                        ))}
                        {labOutOfStock?.length === 0 && <p className="text-center text-sm text-muted-foreground py-4">No low stock items</p>}
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Low Stock Drugs</h3>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/pharmacy/stock')}><ArrowRight className="w-4 h-4 ml-1" /></Button>
                    </div>
                    <div className="space-y-2 max-h-[250px] overflow-y-auto scrollbar-thin">
                        {labLowStock?.slice(0, 6).map(item => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                <div>
                                    <p className="text-sm font-medium">{item.name}</p>
                                    <p className="text-xs text-muted-foreground"> ₦{parseInt(item.amount).toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-red-600">{item.quantity} units</p>
                                    <p className="text-xs text-muted-foreground">Min: {item?.reorderLevel}</p>
                                </div>
                            </div>
                        ))}
                        {labLowStock?.length === 0 && <p className="text-center text-sm text-muted-foreground py-4">No low stock items</p>}
                    </div>
                </Card>
            </div>



            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">My Lab Tests</h3>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/pharmacy/stock')}><ArrowRight className="w-4 h-4 ml-1" /></Button>
                    </div>
                    <div className="space-y-2 max-h-[250px] overflow-y-auto scrollbar-thin">
                        {labTest?.slice(0, 6).map(test => {

                            return  (
                                <div
                                    key={test.id}
                                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition-colors cursor-pointer"
                                    onClick={() => {
                                        setSelectedDrugModal(test)
                                        setShowDrugModal(true)
                                    }}
                                >
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Test Name: {test.lab_test_name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {test.rates?.length || 0} items
                                        </p>
                                        <p className="text-xs font-semibold mt-1">
                                            ₦{parseInt(test.lab_test_amount).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <StatusBadge
                                            status={test.lab_test_payment_status || 'pending'}
                                            size="sm"
                                        />
                                        <Button variant="ghost" size="sm" className="hover:bg-green-100">
                                            <Eye className="w-4 h-4"/>
                                        </Button>
                                    </div>
                                </div>
                            )
                        })}
                        {labTest?.length === 0 && <p className="text-center text-sm text-muted-foreground py-4">No labTest records</p>}
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">My lab Restock</h3>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/pharmacy/stock')}><ArrowRight className="w-4 h-4 ml-1" /></Button>
                    </div>
                    <div className="space-y-2 max-h-[250px] overflow-y-auto scrollbar-thin">
                        {labRestockRequest?.slice(0, 6).map(labRequest => (
                            <div key={labRequest.id} className={`flex items-center justify-between p-3 ${labRequest.status == 'rejected'? 'bg-red-50' : labRequest.status == 'approved'? 'bg-green-50' : 'bg-blue-50' }  rounded-lg`}>
                                <div>
                                    <p className="text-sm font-medium">{labRequest.lab_stock?.name}</p>
                                    <p className="text-xs text-muted-foreground">Requested By: {labRequest.user.name}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-red-600">{labRequest.quantity} units</p>
                                    <p className="text-xs text-muted-foreground">status: {labRequest.status}</p>
                                </div>
                            </div>
                        ))}
                        {labRestockRequest?.length === 0 && <p className="text-center text-sm text-muted-foreground py-4">No reStock request record</p>}
                    </div>
                </Card>
            </div>







            {/* <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Expiring Soon</h3>
          <Button variant="ghost" size="sm" onClick={() => navigate('/pharmacy/stock')}><Package className="w-4 h-4 mr-1" />View Stock</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {expiring.slice(0, 8).map(drug => (
            <div key={drug.drugId} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="text-sm font-medium">{drug.name}</p>
                <p className="text-xs text-muted-foreground">Batch: {drug.batchNumber}</p>
              </div>
              <p className="text-xs font-semibold text-orange-600">{drug.expiryDate}</p>
            </div>
          ))}
        </div>
      </Card>*/}

            <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Pending New LabStock Request</h3>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/pharmacy/stock')}><Package className="w-4 h-4 mr-1" />View Stock</Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {labPendingStock?.slice(0, 8).map(item => (
                        <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                                <p className="text-sm font-medium">{item.name}</p>
                                <p className="text-xs text-muted-foreground">Description: {item.description}</p>
                            </div>
                            <p className="text-xs font-semibold text-orange-600">{item.status}</p>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default LabOverview;
