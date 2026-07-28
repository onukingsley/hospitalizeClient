import React, { useState } from 'react';
import { useLabTests, usePatients } from '@/hooks/useData';
import { formatDate } from '@/lib/formatters';
import PageHeader from '@/components/common/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Search, FlaskConical, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const TestAndResults = () => {
  const { labTests, updateLabTest } = useLabTests();
  const { getPatientById } = usePatients();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTest, setSelectedTest] = useState(null);
  const [resultValue, setResultValue] = useState('');
  const [resultUnit, setResultUnit] = useState('');
  const [referenceRange, setReferenceRange] = useState('');
  const [isAbnormal, setIsAbnormal] = useState(false);
  const [resultNotes, setResultNotes] = useState('');

  const pendingTests = labTests.filter(t => t.status === 'ordered' || t.status === 'sample-collected' || t.status === 'in-progress');
  const completedTests = labTests.filter(t => t.status === 'completed');

  const filteredPending = searchQuery ? pendingTests.filter(t => t.testId.toLowerCase().includes(searchQuery.toLowerCase()) || t.patientId.toLowerCase().includes(searchQuery.toLowerCase())) : pendingTests;

  const handleSubmitResult = () => {
    if (!selectedTest || !resultValue) {
      toast.error('Please enter a result value');
      return;
    }
    updateLabTest(selectedTest.testId, {
      results: [
        ...(selectedTest.results || []),
        {
          parameter: selectedTest.testName,
          value: resultValue,
          unit: resultUnit || 'units',
          referenceRange: referenceRange || 'N/A',
          isAbnormal,
          flag: isAbnormal ? 'high' : undefined,
        }
      ],
      status: 'completed',
      resultDate: new Date().toISOString().split('T')[0],
      conductedBy: 'Kofi Mensah',
      notes: resultNotes,
    });
    toast.success('Test result submitted successfully');
    setSelectedTest(null);
    setResultValue('');
    setResultUnit('');
    setReferenceRange('');
    setIsAbnormal(false);
    setResultNotes('');
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Tests & Results" subtitle="Process lab tests and enter results" breadcrumb={[{ label: 'Dashboard', path: '/lab' }, { label: 'Tests & Results' }]} />

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by test ID or patient ID..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><FlaskConical className="w-5 h-5 text-yellow-500" />Pending Tests ({filteredPending.length})</h3>
          <div className="space-y-2 max-h-[500px] overflow-y-auto scrollbar-thin">
            {filteredPending.map(test => {
              const patient = getPatientById(test.patientId);
              return (
                <div key={test.testId} className="p-4 border rounded-lg hover:bg-muted transition-colors cursor-pointer" onClick={() => setSelectedTest(test)}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{test.testName}</p>
                        <StatusBadge status={test.priority} size="sm" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{test.patientId} • {patient?.firstName} {patient?.lastName}</p>
                      <p className="text-xs text-muted-foreground">Ordered by {test.orderedBy} • {formatDate(test.orderDate)}</p>
                    </div>
                    <StatusBadge status={test.status} size="sm" />
                  </div>
                </div>
              );
            })}
            {filteredPending.length === 0 && <p className="text-center text-muted-foreground py-4">No pending tests</p>}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" />Recent Results</h3>
          <div className="space-y-2 max-h-[500px] overflow-y-auto scrollbar-thin">
            {completedTests.slice(0, 10).map(test => {
              const patient = getPatientById(test.patientId);
              return (
                <div key={test.testId} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-sm">{test.testName}</p>
                      <p className="text-xs text-muted-foreground">{patient?.firstName} {patient?.lastName}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatDate(test.resultDate)}</span>
                  </div>
                  {test.results.map((r, i) => (
                    <div key={i} className={`mt-2 p-2 rounded text-sm ${r.isAbnormal ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                      {r.parameter}: <strong>{r.value}</strong> {r.unit} (Ref: {r.referenceRange})
                      {r.isAbnormal && <span className="ml-2 font-semibold">⚠ Abnormal</span>}
                    </div>
                  ))}
                </div>
              );
            })}
            {completedTests.length === 0 && <p className="text-center text-muted-foreground py-4">No completed tests</p>}
          </div>
        </Card>
      </div>

      {/* Enter Result Dialog */}
      <Dialog open={!!selectedTest} onOpenChange={() => setSelectedTest(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Enter Test Result</DialogTitle></DialogHeader>
          {selectedTest && (
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">{selectedTest.testName}</p>
                <p className="text-sm text-muted-foreground">{selectedTest.patientId} • {selectedTest.diagnosisId}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Result Value *</Label>
                  <Input value={resultValue} onChange={e => setResultValue(e.target.value)} placeholder="Enter value" />
                </div>
                <div>
                  <Label>Unit</Label>
                  <Input value={resultUnit} onChange={e => setResultUnit(e.target.value)} placeholder="e.g., mg/dL" />
                </div>
                <div>
                  <Label>Reference Range</Label>
                  <Input value={referenceRange} onChange={e => setReferenceRange(e.target.value)} placeholder="e.g., 70-110" />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={isAbnormal ? 'abnormal' : 'normal'} onValueChange={v => setIsAbnormal(v === 'abnormal')}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="abnormal">Abnormal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea value={resultNotes} onChange={e => setResultNotes(e.target.value)} placeholder="Additional notes..." />
              </div>
              <Button className="w-full" onClick={handleSubmitResult}><CheckCircle className="w-4 h-4 mr-2" />Submit Result</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestAndResults;
