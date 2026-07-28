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
import {adminUserManagement, diagnosisStore, drugStore, labStore, paymentStore} from "../../store/store.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import SaleDetailModal from "../../components/modals/DrugSaleModal.jsx";

const NurseOverview = () => {
    const navigate = useNavigate();
    const {  getLowStockDrugs, getExpiringDrugs } = useDrugs();
    const { sales } = useDrugSales();

    const {labStock,labLowStock,labOutOfStock,labTest,allLabTest,labRestockRequest,pendingLabRestockRequest,labPendingStock,myLabRestockRequest} = labStore()
    const {diagnosisReport,outPatientDiagnosis,inwardDiagnosis} = diagnosisStore()
    const {totalRevenue} = paymentStore()
    const {patients} = adminUserManagement()
    const [showDrugModal, setShowDrugModal] = useState(false);
    const [seletedDrugModal, setSelectedDrugModal] = useState({});



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


            <PageHeader title="Nurse Dashboard" subtitle="Drug inventory and dispensing" actions={<Button onClick={() => navigate('/pharmacy/dispense')}><Pill className="w-4 h-4 mr-2" />Dispense Drugs</Button>} />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Diagnosis Report" value={diagnosisReport?.length} icon={<Pill className="w-5 h-5" />} color="bg-blue-500" onClick={() => navigate('/pharmacy/stock')} />
                <StatCard title="Total OutPatient" value={outPatientDiagnosis?.length} icon={<TestTube2 className="w-5 h-5" />} color="bg-blue-500" onClick={() => navigate('/pharmacy/stock')} />
                <StatCard title="Total Inward Patient" value={inwardDiagnosis?.length} icon={<AlertTriangle className="w-5 h-5" />} color="bg-red-500" onClick={() => navigate('/pharmacy/stock')} />
                <StatCard title="My Patients" value={patients?.length} icon={<AlertTriangle className="w-5 h-5" />} color="bg-red-500" onClick={() => navigate('/pharmacy/stock')} />
                {/*<StatCard title="Today's Sales" value={labTest.length} icon={<ShoppingCart className="w-5 h-5" />} color="bg-green-500" />
                <StatCard title="month's Revenue" value={totalRevenue?.toLocaleString()} icon={<TrendingUp className="w-5 h-5" />} color="bg-purple-500" />*/}
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
                        <h3 className="text-lg font-semibold">Inward Patient/Diagnosis</h3>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/pharmacy/stock')}><ArrowRight className="w-4 h-4 ml-1" /></Button>
                    </div>
                    <div className="space-y-2 max-h-[250px] overflow-y-auto scrollbar-thin">
                        {inwardDiagnosis?.slice(0, 6).map(item => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="text-sm font-medium">{item.patient.user.name}</p>
                                    <p className="text-xs text-muted-foreground"> {item.final_diagnosis || item.initial_diagnosis}</p>
                                    <p className="text-xs text-muted-foreground">{item.doctor.user.name}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-red-600">{item.lab_test.length} tests </p>
                                    <p className="text-xs text-muted-foreground">{item?.sales.length} prescriptions</p>
                                </div>
                            </div>
                        ))}
                        {labOutOfStock?.length === 0 && <p className="text-center text-sm text-muted-foreground py-4">No low stock items</p>}
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">OutPatient </h3>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/pharmacy/stock')}><ArrowRight className="w-4 h-4 ml-1" /></Button>
                    </div>
                    <div className="space-y-2 max-h-[250px] overflow-y-auto scrollbar-thin">
                        {outPatientDiagnosis?.slice(0, 6).map(item => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="text-sm font-medium">{item.patient.user.name}</p>
                                    <p className="text-xs text-muted-foreground"> {item.final_diagnosis || item.initial_diagnosis}</p>
                                    <p className="text-xs text-muted-foreground">{item.doctor.user.name}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-red-600">{item.lab_test.length} tests </p>
                                    <p className="text-xs text-muted-foreground">{item?.sales.length} prescriptions</p>
                                </div>
                            </div>
                        ))}
                        {labOutOfStock?.length === 0 && <p className="text-center text-sm text-muted-foreground py-4">No low stock items</p>}
                    </div>
                </Card>
            </div>



            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">My DiagnosisReport</h3>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/pharmacy/stock')}><ArrowRight className="w-4 h-4 ml-1" /></Button>
                    </div>
                    <div className="space-y-2 max-h-[250px] overflow-y-auto scrollbar-thin">
                        {diagnosisReport?.slice(0, 6).map(report => {

                            return  (
                                <div
                                    key={report.id}
                                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition-colors cursor-pointer"
                                    onClick={() => {
                                        setSelectedDrugModal(test)
                                        setShowDrugModal(true)
                                    }}
                                >
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Diagnosis: {report.diagnosis.final_diagnosis} || {report.diagnosis.final_diagnosis}</p>
                                       <div className={'flex gap-x-3'}>
                                           <p className="text-xs text-muted-foreground">
                                               {report.diagnosis.lab_test.length || 0} Sales
                                           </p>
                                           <p className="text-xs text-muted-foreground">
                                               {report.diagnosis.sales.length || 0} Prescription
                                           </p>
                                           <p className="text-xs text-muted-foreground">
                                               {report.diagnosis.diagnosis_report.length || 0} Reports
                                           </p>
                                       </div>
                                        <div className={'flex gap-x-3'}>
                                            <p className="text-xs font-semibold mt-1">
                                                {report.diagnosis.patient.user.name}
                                            </p>
                                            <p className="text-xs font-semibold mt-1">
                                                {report.diagnosis.patient.user.regID}
                                            </p>
                                        </div>

                                    </div>
                                    <div className="flex items-center gap-2">
                                        <StatusBadge
                                            status={report.diagnosis.ward_status|| 'pending'}
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
                        <h3 className="text-lg font-semibold">My Patient</h3>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/pharmacy/stock')}><ArrowRight className="w-4 h-4 ml-1" /></Button>
                    </div>
                    <div className="space-y-2 max-h-[250px] overflow-y-auto scrollbar-thin">
                        {patients?.slice(0, 4).map(dx => (
                            <div
                                key={dx.id}
                                className="flex items-center justify-between p-3 rounded-xl border hover:bg-muted transition-all cursor-pointer group hover:border-primary/50"
                                onClick={() => {
                                    /*setSelectedPatient(dx);*/
                                    navigate(`/doctor/patientDetail/${dx.regID}`);
                                }}
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-primary">
                      {dx?.name?.charAt(0) || 'P'}
                    </span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium truncate">{dx?.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">{dx?.regID}</p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Eye className="w-4 h-4" />
                                </Button>
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

           {/* <Card className="p-6">
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
            </Card>*/}
        </div>
    );
};

export default NurseOverview;
