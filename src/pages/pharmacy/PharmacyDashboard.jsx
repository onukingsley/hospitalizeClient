import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useDrugs, useDrugSales } from '@/hooks/useData';
import { formatCurrency, formatNumber } from '@/lib/formatters';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {Pill, ShoppingCart, AlertTriangle, TrendingUp, ArrowRight, Package, Eye} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {drugStore, paymentStore} from "../../store/store.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import SaleDetailModal from "../../components/modals/DrugSaleModal.jsx";

const PharmacyDashboard = () => {
  const navigate = useNavigate();
  const {  getLowStockDrugs, getExpiringDrugs } = useDrugs();
  const { sales } = useDrugSales();

  const {drugs,outOfStock,lowStock,drugSale,drugRestockRequest,pendingDrugs} = drugStore()
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


      <PageHeader title="Pharmacy Dashboard" subtitle="Drug inventory and dispensing" actions={<Button onClick={() => navigate('/pharmacy/dispense')}><Pill className="w-4 h-4 mr-2" />Dispense Drugs</Button>} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Drugs" value={drugs?.length} icon={<Pill className="w-5 h-5" />} color="bg-blue-500" onClick={() => navigate('/pharmacy/stock')} />
        <StatCard title="Low Stock Alerts" value={lowStock?.length} icon={<AlertTriangle className="w-5 h-5" />} color="bg-red-500" onClick={() => navigate('/pharmacy/stock')} />
        <StatCard title="Out of Stock" value={outOfStock?.length} icon={<AlertTriangle className="w-5 h-5" />} color="bg-red-500" onClick={() => navigate('/pharmacy/stock')} />
        <StatCard title="Today's Sales" value={drugSale.length} icon={<ShoppingCart className="w-5 h-5" />} color="bg-green-500" />
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
            <h3 className="text-lg font-semibold">Out of Stock Drugs</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/pharmacy/stock')}><ArrowRight className="w-4 h-4 ml-1" /></Button>
          </div>
          <div className="space-y-2 max-h-[250px] overflow-y-auto scrollbar-thin">
            {outOfStock?.slice(0, 6).map(drug => (
                <div key={drug.drugId} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{drug.name}</p>
                    <p className="text-xs text-muted-foreground">{drug.generic}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-red-600">{drug.quantity} units</p>
                    <p className="text-xs text-muted-foreground">Min: {drug.reorderLevel}</p>
                  </div>
                </div>
            ))}
            {lowStock?.length === 0 && <p className="text-center text-sm text-muted-foreground py-4">No low stock items</p>}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Low Stock Drugs</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/pharmacy/stock')}><ArrowRight className="w-4 h-4 ml-1" /></Button>
          </div>
          <div className="space-y-2 max-h-[250px] overflow-y-auto scrollbar-thin">
            {lowStock?.slice(0, 6).map(drug => (
                <div key={drug.drugId} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{drug.name}</p>
                    <p className="text-xs text-muted-foreground">{drug.generic}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-red-600">{drug.quantity} units</p>
                    <p className="text-xs text-muted-foreground">Min: {drug.status}</p>
                  </div>
                </div>
            ))}
            {lowStock?.length === 0 && <p className="text-center text-sm text-muted-foreground py-4">No low stock items</p>}
          </div>
        </Card>
      </div>



      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">My Drugs Dispensed</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/pharmacy/stock')}><ArrowRight className="w-4 h-4 ml-1" /></Button>
          </div>
          <div className="space-y-2 max-h-[250px] overflow-y-auto scrollbar-thin">
            {drugSale?.slice(0, 6).map(sale => {

             return  (
                  <div
                      key={sale.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedDrugModal(sale)
                        setShowDrugModal(true)
                      }}
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">Sale #{sale.id}</p>
                      <p className="text-xs text-muted-foreground">
                        {sale.drug_stock?.length || 0} items
                      </p>
                      <p className="text-xs font-semibold mt-1">
                        ₦{parseInt(sale.total_amount).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge
                          status={sale.payment_status || 'pending'}
                          size="sm"
                      />
                      <Button variant="ghost" size="sm" className="hover:bg-green-100">
                        <Eye className="w-4 h-4"/>
                      </Button>
                    </div>
                  </div>
              )
            })}
            {lowStock?.length === 0 && <p className="text-center text-sm text-muted-foreground py-4">No low stock items</p>}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">My Drug Restock</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/pharmacy/stock')}><ArrowRight className="w-4 h-4 ml-1" /></Button>
          </div>
          <div className="space-y-2 max-h-[250px] overflow-y-auto scrollbar-thin">
            {drugRestockRequest?.slice(0, 6).map(drug => (
                <div key={drug.drugId} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{drug.drug_stock?.name}</p>
                    <p className="text-xs text-muted-foreground">{drug.generic}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-red-600">{drug.quantity} units</p>
                    <p className="text-xs text-muted-foreground">Min: {drug.status}</p>
                  </div>
                </div>
            ))}
            {lowStock?.length === 0 && <p className="text-center text-sm text-muted-foreground py-4">No low stock items</p>}
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
          <h3 className="text-lg font-semibold">Pending Drug Request</h3>
          <Button variant="ghost" size="sm" onClick={() => navigate('/pharmacy/stock')}><Package className="w-4 h-4 mr-1" />View Stock</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {pendingDrugs && pendingDrugs?.slice(0, 8).map(drug => (
            <div key={drug.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="text-sm font-medium">{drug.name}</p>
                <p className="text-xs text-muted-foreground">Batch: {drug.generic}</p>
              </div>
              <p className="text-xs font-semibold text-orange-600">{drug.status}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default PharmacyDashboard;
