import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatients, useBills } from '@/hooks/useData';
import { formatCurrency, formatNumber } from '@/lib/formatters';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Users, Banknote, UserPlus, ArrowRight,
    AlertCircle, Bed, DoorOpen, Hourglass, Eye, Clock, CheckCircle, ArrowDown
} from 'lucide-react';
import {adminUserManagement, diagnosisStore, userStore} from "../../store/store.jsx";

const ClerkDashboard = () => {
  const navigate = useNavigate();
 // const { patients } = usePatients();
  const { bills } = useBills();
  const {totalPatient,dailyPatient,patients} = adminUserManagement()
  const {clerk} = userStore()
  const {pendingConsultation,dailyConsultation,totalPendingConsultation,totalDailyConsultation,inwardDiagnosis,outPatientDiagnosis} = diagnosisStore()



console.log(patients)
  const todayPatients = patients.filter(p => p.registrationDate === '2025-04-18').length;
  const pendingBills = bills.filter(b => b.paymentStatus === 'pending');
  const todayRevenue = bills
    .filter(b => b.billDate === '2025-04-18' && b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + b.amountPaid, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clerk Dashboard"
        subtitle="Patient registration and payment management"
        actions={
          <Button onClick={() => navigate('/clerk/registration')}>
            <UserPlus className="w-4 h-4 mr-2" />
            New Registration
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Patients" value={totalPatient} icon={<Users className="w-5 h-5" />} color="bg-blue-500" />
        <StatCard title="Daily Patient Enrolled" value={dailyPatient.length} icon={<UserPlus className="w-5 h-5" />} color="bg-green-500" />
        <StatCard title="Daily Consultation" value={totalDailyConsultation} icon={<AlertCircle className="w-5 h-5" />} color="bg-red-500" />
        <StatCard title="Pending Consultation" value={totalPendingConsultation} icon={<Hourglass className="w-5 h-5" />} color="bg-purple-500" />
        <StatCard title="Inward Patients" value={inwardDiagnosis.length} icon={<Bed className="w-5 h-5" />} color="bg-purple-500" />
        <StatCard title="Out Patients" value={outPatientDiagnosis.length} icon={<DoorOpen className="w-5 h-5" />} color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Patients</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/clerk/patients')}>
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="space-y-2">
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
                      {dx?.user?.name?.charAt(0) || 'P'}
                    </span>
                          </div>
                          <div className="min-w-0">
                              <p className="text-sm font-medium truncate">{dx?.user.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{dx?.user.regID}</p>
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
          </div>
        </Card>

          <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Daily enrolled Patients</h3>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/clerk/patients')}>
                      View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
              </div>
              <div className="space-y-2">
                  {dailyPatient?.slice(0, 4).map(dx => (
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
                      {dx?.user.name?.charAt(0) || 'P'}
                    </span>
                              </div>
                              <div className="min-w-0">
                                  <p className="text-sm font-medium truncate">{dx?.user.name}</p>
                                  <p className="text-xs text-muted-foreground truncate">{dx?.user.regID}</p>
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
              </div>
          </Card>

      {/*  <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Pending Payments</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/clerk/payments')}>
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="space-y-2">
            {pendingBills.slice(0, 8).map(bill => (
              <div key={bill.billId} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
                <div>
                  <p className="text-sm font-medium">{bill.billId}</p>
                  <p className="text-xs text-muted-foreground">{bill.patientId}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-red-600">{formatCurrency(bill.balance)}</p>
                  <StatusBadge status={bill.paymentStatus} size="sm" />
                </div>
              </div>
            ))}
            {pendingBills.length === 0 && <p className="text-center text-sm text-muted-foreground py-4">No pending payments</p>}
          </div>
        </Card>*/}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                      <div className="p-2 bg-amber-100 rounded-lg">
                          <Clock className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                          <h3 className="text-lg font-semibold">Pending Consultations</h3>
                          <p className="text-sm text-muted-foreground">{totalPendingConsultation} patients waiting</p>
                      </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/clerk/consultation')}>
                      View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
              </div>
              <div className="space-y-3 max-h-[320px] overflow-y-auto scrollbar-thin pr-1">
                  {pendingConsultation?.slice(0, 6).map(dx => (
                      <div
                          key={dx.patient_id}
                          className="flex items-center justify-between p-3 rounded-xl border hover:bg-muted transition-all cursor-pointer group hover:border-primary/50 hover:shadow-sm"
                          onClick={() => navigate('/clerk/consultation')}
                      >
                          <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-primary">
                      {dx.patient?.user?.name?.charAt(0) || 'P'}
                    </span>
                              </div>
                              <div>
                                  <p className="text-sm font-medium">{dx.patient?.user?.name}</p>
                                  <p className="text-xs text-muted-foreground">{dx.patient?.user?.regID}</p>
                              </div>
                          </div>
                          <div className="flex items-center gap-2">
                              <StatusBadge status={dx.attendance_status} size="sm" />
                              <Button
                                  variant="ghost"
                                  size="sm"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                  <Eye className="w-4 h-4" />
                              </Button>
                          </div>
                      </div>
                  ))}
                  {(!pendingConsultation || pendingConsultation.length === 0) && (
                      <div className="text-center py-8">
                          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                          <p className="text-sm text-muted-foreground">No pending consultations</p>
                          <p className="text-xs text-muted-foreground">All caught up! 🎉</p>
                      </div>
                  )}
              </div>
          </Card>

          <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                      <div className="p-2 bg-amber-100 rounded-lg">
                          <ArrowDown className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                          <h3 className="text-lg font-semibold">Daily Consultations</h3>
                          <p className="text-sm text-muted-foreground">{totalDailyConsultation} patients waiting</p>
                      </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/clerk/consultation')}>
                      View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
              </div>
              <div className="space-y-3 max-h-[320px] overflow-y-auto scrollbar-thin pr-1">
                  {dailyConsultation?.slice(0, 6).map(dx => (
                      <div
                          key={dx.patient_id}
                          className="flex items-center justify-between p-3 rounded-xl border hover:bg-muted transition-all cursor-pointer group hover:border-primary/50 hover:shadow-sm"
                          onClick={() => navigate('/clerk/consultation')}
                      >
                          <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-primary">
                      {dx.patient?.user?.name?.charAt(0) || 'P'}
                    </span>
                              </div>
                              <div>
                                  <p className="text-sm font-medium">{dx.patient?.user?.name}</p>
                                  <p className="text-xs text-muted-foreground">{dx.patient?.user?.regID}</p>
                              </div>
                          </div>
                          <div className="flex items-center gap-2">
                              <StatusBadge status={dx.attendance_status} size="sm" />
                              <Button
                                  variant="ghost"
                                  size="sm"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                  <Eye className="w-4 h-4" />
                              </Button>
                          </div>
                      </div>
                  ))}
                  {(!pendingConsultation || pendingConsultation.length === 0) && (
                      <div className="text-center py-8">
                          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                          <p className="text-sm text-muted-foreground">No pending consultations</p>
                          <p className="text-xs text-muted-foreground">All caught up! 🎉</p>
                      </div>
                  )}
              </div>
          </Card>


      </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


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
                    {inwardDiagnosis?.length === 0 && <p className="text-center text-sm text-muted-foreground py-4">No low stock items</p>}
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
                    {inwardDiagnosis?.length === 0 && <p className="text-center text-sm text-muted-foreground py-4">No low stock items</p>}
                </div>
            </Card>
        </div>
    </div>
  );
};

export default ClerkDashboard;
