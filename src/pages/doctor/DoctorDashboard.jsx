import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Stethoscope,
  Users,
  FileText,
  Clock,
  ArrowRight,
  Activity,
  TrendingUp,
  TrendingDown,
  Calendar,
  UserPlus,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Eye,
  MoreVertical,
  Search,
  Filter,
  RefreshCw,
  BarChart3,
  PieChart,
  Download,
  Printer
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { adminUserManagement, diagnosisStore, selectedStore } from "../../store/store.jsx";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  const {
    doctorsDiagnosis,
    pendingConsultation,
    consultations,
    dailyConsultation
  } = diagnosisStore();

  const { patients } = adminUserManagement();
  const { setSelectedPatient, setSelectedDiagnosis } = selectedStore();

  // Calculate stats
  const totalPatients = patients?.length || 0;
  const totalConsultations = consultations?.length || 0;
  const totalPending = pendingConsultation?.length || 0;
  const todayConsultations = dailyConsultation?.length || 0;

  // Calculate percentages for trends
  const consultationGrowth = totalConsultations > 0 ? 15 : 0;
  const patientGrowth = totalPatients > 0 ? 8 : 0;
  const pendingGrowth = totalPending > 0 ? -5 : 0;

  // Chart data
  const conditionsChart = [
    { condition: 'Malaria', count: doctorsDiagnosis?.filter(d => d.final_diagnosis?.includes('Malaria')).length || 0 },
    { condition: 'Typhoid', count: doctorsDiagnosis?.filter(d => d.final_diagnosis?.includes('Typhoid')).length || 0 },
    { condition: 'Hypertension', count: doctorsDiagnosis?.filter(d => d.final_diagnosis?.includes('Hypertension')).length || 0 },
    { condition: 'Diabetes', count: doctorsDiagnosis?.filter(d => d.final_diagnosis?.includes('Diabetes')).length || 0 },
    { condition: 'Respiratory', count: doctorsDiagnosis?.filter(d => d.final_diagnosis?.includes('Respiratory') || d.final_diagnosis?.includes('Infection')).length || 0 },
    { condition: 'Other', count: doctorsDiagnosis?.filter(d => {
        const conditions = ['Malaria', 'Typhoid', 'Hypertension', 'Diabetes', 'Respiratory', 'Infection'];
        return !conditions.some(c => d.final_diagnosis?.includes(c));
      }).length || 0 },
  ];

  // Weekly consultation data
  const weeklyData = [
    { day: 'Mon', consultations: 12 },
    { day: 'Tue', consultations: 19 },
    { day: 'Wed', consultations: 15 },
    { day: 'Thu', consultations: 22 },
    { day: 'Fri', consultations: 18 },
    { day: 'Sat', consultations: 8 },
    { day: 'Sun', consultations: 5 },
  ];

  const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#6B7280'];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
      <div className="space-y-6">
        {/* Page Header with Actions */}
        <PageHeader
            title="Doctor Dashboard"
            subtitle="Patient care and diagnosis management"
            actions={
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                  <Button
                      variant={selectedPeriod === 'today' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setSelectedPeriod('today')}
                      className="h-8 px-3 text-xs"
                  >
                    Today
                  </Button>
                  <Button
                      variant={selectedPeriod === 'week' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setSelectedPeriod('week')}
                      className="h-8 px-3 text-xs"
                  >
                    Week
                  </Button>
                  <Button
                      variant={selectedPeriod === 'month' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setSelectedPeriod('month')}
                      className="h-8 px-3 text-xs"
                  >
                    Month
                  </Button>
                </div>
                <Button variant="outline" size="sm" onClick={handleRefresh}>
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
                <Button onClick={() => navigate('/doctor/diagnosis/new')}>
                  <Stethoscope className="w-4 h-4 mr-2" />
                  New Diagnosis
                </Button>
              </div>
            }
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
              title="Total Patients"
              value={totalPatients}
              icon={<Users className="w-5 h-5" />}
              color="bg-blue-500"
              trend={{ value: patientGrowth, isPositive: true }}
              onClick={() => navigate('/doctor/patients')}
          />
          <StatCard
              title="Total Consultations"
              value={totalConsultations}
              icon={<Activity className="w-5 h-5" />}
              color="bg-green-500"
              trend={{ value: consultationGrowth, isPositive: true }}
          />
          <StatCard
              title="Pending Consultations"
              value={totalPending}
              icon={<Clock className="w-5 h-5" />}
              color="bg-amber-500"
              trend={{ value: pendingGrowth, isPositive: false }}
          />
          <StatCard
              title="Today's Consultations"
              value={todayConsultations}
              icon={<Calendar className="w-5 h-5" />}
              color="bg-purple-500"
          />
        </div>

        {/* Main Charts Row */}
        {/*<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           Weekly Trend
          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Consultation Trend</h3>
                <p className="text-sm text-muted-foreground">Weekly consultation statistics</p>
              </div>
              <Button variant="ghost" size="sm">
                <BarChart3 className="w-4 h-4 mr-1" />
                Details
              </Button>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                />
                <Line
                    type="monotone"
                    dataKey="consultations"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', r: 4 }}
                    activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

           Conditions Distribution
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Conditions</h3>
                <p className="text-sm text-muted-foreground">Diagnosis distribution</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <RePieChart>
                <Pie
                    data={conditionsChart.filter(d => d.count > 0)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {conditionsChart.filter(d => d.count > 0).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </Card>
        </div>*/}

        {/* Pending & Recent Consultations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Consultation */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Pending Consultations</h3>
                  <p className="text-sm text-muted-foreground">{totalPending} patients waiting</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/doctor/consultation')}>
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="space-y-3 max-h-[320px] overflow-y-auto scrollbar-thin pr-1">
              {pendingConsultation?.slice(0, 6).map((dx,index) => (
                  <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-xl border hover:bg-muted transition-all cursor-pointer group hover:border-primary/50 hover:shadow-sm"
                      onClick={() => navigate('/doctor/consultation')}
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

          {/* Recent Diagnosis */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Recent Diagnoses</h3>
                  <p className="text-sm text-muted-foreground">Latest patient cases</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/doctor/diagnosis')}>
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="space-y-3 max-h-[320px] overflow-y-auto scrollbar-thin pr-1">
              {doctorsDiagnosis?.slice(0, 6).map(dx => (
                  <div
                      key={dx.id}
                      className="flex items-center justify-between p-3 rounded-xl border hover:bg-muted transition-all cursor-pointer group hover:border-primary/50 hover:shadow-sm"
                      onClick={() => {
                        /*setSelectedDiagnosis(dx);*/
                        navigate(`/doctor/diagnosisDetail/${dx.id}`);
                      }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">{dx.patient?.user?.name}</span>
                        <span className="text-xs text-muted-foreground">• {dx.patient?.user?.regID}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                      {dx.initial_diagnosis || 'No diagnosis'}
                    </span>
                        <StatusBadge status={dx.ward_status} size="sm" />
                      </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
              ))}
              {(!doctorsDiagnosis || doctorsDiagnosis.length === 0) && (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">No diagnoses recorded</p>
                  </div>
              )}
            </div>
          </Card>
        </div>

        {/* My Patients & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* My Patients */}
          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">My Patients</h3>
                  <p className="text-sm text-muted-foreground">{totalPatients} patients under care</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => navigate('/doctor/patients')}>
                  <Search className="w-4 h-4 mr-1" />
                  Search
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate('/doctor/patients')}>
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Activity className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold">Quick Actions</h3>
            </div>
            <div className="space-y-3">
              <Button
                  className="w-full justify-start bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                  onClick={() => navigate('/doctor/diagnosis/new')}
              >
                <Stethoscope className="w-4 h-4 mr-2" />
                New Diagnosis
              </Button>
              <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/doctor/patients')}
              >
                <Users className="w-4 h-4 mr-2" />
                View All Patients
              </Button>
              <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/doctor/pendingConsultation')}
              >
                <Clock className="w-4 h-4 mr-2" />
                Pending Consultations
                {totalPending > 0 && (
                    <span className="ml-auto bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                  {totalPending}
                </span>
                )}
              </Button>
              <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/doctor/diagnosis')}
              >
                <FileText className="w-4 h-4 mr-2" />
                View All Diagnoses
              </Button>
            </div>
          </Card>
        </div>
      </div>
  );
};

export default DoctorDashboard;