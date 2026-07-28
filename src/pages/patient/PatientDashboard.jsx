import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDiagnoses, useLabTests, useBills } from '@/hooks/useData';
import { formatCurrency, formatNumber } from '@/lib/formatters';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stethoscope, FlaskConical, Banknote, Calendar, ArrowRight } from 'lucide-react';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { diagnoses } = useDiagnoses();
  const { labTests } = useLabTests();
  const { bills } = useBills();

  // For demo, show first patient's data
  const patientId = 'HOSP-20250115-1000';
  const myDiagnoses = diagnoses.filter(d => d.patientId === patientId);
  const myLabTests = labTests.filter(t => t.patientId === patientId);
  const myBills = bills.filter(b => b.patientId === patientId);
  const totalOutstanding = myBills.filter(b => b.paymentStatus !== 'paid').reduce((sum, b) => sum + b.balance, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="My Health Portal" subtitle="View your medical records and appointments" actions={<Button onClick={() => navigate('/patient/appointments')}><Calendar className="w-4 h-4 mr-2" />Book Appointment</Button>} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="My Diagnoses" value={formatNumber(myDiagnoses.length)} icon={<Stethoscope className="w-5 h-5" />} color="bg-blue-500" onClick={() => navigate('/patient/diagnosis')} />
        <StatCard title="Lab Tests" value={formatNumber(myLabTests.length)} icon={<FlaskConical className="w-5 h-5" />} color="bg-green-500" onClick={() => navigate('/patient/lab-results')} />
        <StatCard title="Outstanding Bills" value={formatCurrency(totalOutstanding)} icon={<Banknote className="w-5 h-5" />} color="bg-red-500" onClick={() => navigate('/patient/bills')} />
        <StatCard title="Next Appointment" value="Apr 25" icon={<Calendar className="w-5 h-5" />} color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Diagnoses</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/patient/diagnosis')}><ArrowRight className="w-4 h-4 ml-1" /></Button>
          </div>
          <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-thin">
            {myDiagnoses.slice(0, 6).map(dx => (
              <div key={dx.diagnosisId} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
                <div>
                  <p className="text-sm font-medium">{dx.finalDiagnosis}</p>
                  <p className="text-xs text-muted-foreground">{dx.date} • {dx.doctorName}</p>
                </div>
                <StatusBadge status={dx.status} size="sm" />
              </div>
            ))}
            {myDiagnoses.length === 0 && <p className="text-center text-sm text-muted-foreground py-4">No diagnoses found</p>}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">My Bills</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/patient/bills')}><ArrowRight className="w-4 h-4 ml-1" /></Button>
          </div>
          <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-thin">
            {myBills.slice(0, 6).map(bill => (
              <div key={bill.billId} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
                <div>
                  <p className="text-sm font-medium">{bill.billId}</p>
                  <p className="text-xs text-muted-foreground">{bill.billDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatCurrency(bill.totalAmount)}</p>
                  <StatusBadge status={bill.paymentStatus} size="sm" />
                </div>
              </div>
            ))}
            {myBills.length === 0 && <p className="text-center text-sm text-muted-foreground py-4">No bills found</p>}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PatientDashboard;
