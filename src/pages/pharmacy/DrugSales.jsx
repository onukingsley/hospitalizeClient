import React, { useState } from 'react';
import { useDrugs } from '@/hooks/useData';
import { formatCurrency, formatDate } from '@/lib/formatters';
import PageHeader from '@/components/common/PageHeader';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {Search, Package, AlertTriangle, Pill, Hourglass, MedalIcon} from 'lucide-react';
import {drugStore} from "../../store/store.jsx";
import {useNavigate} from "react-router-dom";

const DrugSales = () => {
    const {  getLowStockDrugs, getExpiringDrugs } = useDrugs();
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all');

    const {drugSale,allDrugSale} = drugStore()

    const navigate = useNavigate()

    /*const lowStock = getLowStockDrugs();*/
    const expiring = getExpiringDrugs();

    let displayedDrugs = drugSale;
    if (filter === 'My Sales') displayedDrugs = drugSale;
    else if (filter === 'Daily Sales') displayedDrugs = allDrugSale;
    /*else if (filter === 'pending') displayedDrugs = pendingDrugs;*/

    const filteredDrugs = searchQuery
        ? displayedDrugs.filter(d => d.patient.user.regID.toLowerCase().includes(searchQuery.toLowerCase()) || d.patient.user.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : displayedDrugs;

    const getStockStatus =  {
        'outOfStock': {color: 'bg-red-100 text-red-700 border-red-200'},
        'paid': {color: 'bg-yellow-100 text-yellow-700 border-yellow-200'} ,
        'unpaid': {color: 'bg-yellow-100 text-yellow-700 border-yellow-200'} ,
        'delivered' : {color: 'bg-green-100 text-green-700 border-green-200'},
        'pending' : {color: 'bg-blue-100 text-blue-700 border-blue-200'}
    };

    return (
        <div className="space-y-6">
            <PageHeader title="My Dispensed Drugs" subtitle="Drugs dispensed by the pharmacist" breadcrumb={[{ label: 'Dashboard', path: '/pharmacy' }, { label: 'Drug Stock' }]} actions={<Button>Request Stock</Button>} />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all" onClick={() => setFilter('all')}>
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center"><Package className="w-6 h-6 text-blue-600" /></div>
                    <div><p className="text-2xl font-bold">{drugSale.length}</p><p className="text-sm text-muted-foreground">My Drugs Dispensed</p></div>
                </Card>
                <Card className="p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all" onClick={() => setFilter('all')}>
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center"><MedalIcon className="w-6 h-6 text-blue-600" /></div>
                    <div><p className="text-2xl font-bold">{allDrugSale.length}</p><p className="text-sm text-muted-foreground">Daily Drugs Dispensed</p></div>
                </Card>

            </div>

            <Card className="p-4">
                <div className="flex gap-2 mb-4">
                    {[ 'My Sales','Daily Sales'].map(f => (
                        <Button key={f} variant={filter === f ? 'default' : 'outline'} size="sm" onClick={() => setFilter(f)}>
                            {f === 'My Sales' ? 'My Sales' : 'Daily Sales'}
                        </Button>
                    ))}
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search drugs..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
                </div>
            </Card>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-muted">
                    <tr>
                        <th className="text-left p-3 font-medium">Sales_id</th>
                        <th className="text-left p-3 font-medium">Patient</th>
                        <th className="text-left p-3 font-medium">amount</th>
                        <th className="text-left p-3 font-medium">date</th>
                        <th className="text-left p-3 font-medium">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredDrugs.map(sale => {
                        const status = getStockStatus[sale.payment_status];
                        return (
                            <tr key={sale?.drugId} onClick={()=>navigate(`/pharmacy/saleDetails?sales_id=${sale.id}`)} className="border-b hover:bg-muted/50 transition-colors">
                                <td className="p-3 font-medium">{sale?.id}</td>
                                <td className="p-3 text-muted-foreground">{sale?.patient?.user?.name}- {sale?.patient?.user?.regID}</td>
                                <td className="p-3">{sale?.total_amount.toLocaleString()}</td>
                                <td className="p-3">{formatDate(sale?.expiry_date_range)}</td>
                                <td className="p-3"><span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${status.color}`}>{sale?.payment_status}</span></td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
                {filteredDrugs.length === 0 && <p className="text-center text-muted-foreground py-8">No drugs found</p>}
            </div>
        </div>
    );
};

export default DrugSales;