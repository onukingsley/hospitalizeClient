import React, { useState } from 'react';
import { useBills } from '@/hooks/useData';
import { formatCurrency } from '@/lib/formatters';
import PageHeader from '@/components/common/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PAYMENT_METHODS } from '@/lib/constants';
import { generateReceiptNumber } from '@/lib/mockData';
import { toast } from 'sonner';
import { Banknote, Search, Printer, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const PaymentCollection = () => {
  const { bills, updateBill } = useBills();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBill, setSelectedBill] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [showReceipt, setShowReceipt] = useState(false);

  const pendingBills = bills.filter(b => b.paymentStatus === 'pending' || b.paymentStatus === 'partial');
  const filteredBills = searchQuery
    ? pendingBills.filter(b => b.billId.toLowerCase().includes(searchQuery.toLowerCase()) || b.patientId.toLowerCase().includes(searchQuery.toLowerCase()))
    : pendingBills;

  const handlePayment = () => {
    if (!selectedBill || !paymentAmount) return;
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (amount > selectedBill.balance) {
      toast.error('Payment amount cannot exceed the balance');
      return;
    }

    const newAmountPaid = selectedBill.amountPaid + amount;
    const newBalance = selectedBill.totalAmount - newAmountPaid;
    const isFullyPaid = newBalance <= 0;

    updateBill(selectedBill.billId, {
      amountPaid: newAmountPaid,
      balance: Math.max(0, newBalance),
      paymentStatus: isFullyPaid ? 'paid' : 'partial',
      paymentMethod: isFullyPaid ? paymentMethod : selectedBill.paymentMethod || paymentMethod,
      receiptNumber: isFullyPaid ? generateReceiptNumber() : selectedBill.receiptNumber,
    });

    toast.success(`Payment of ${formatCurrency(amount)} recorded successfully`);
    setShowReceipt(true);
    setSelectedBill(null);
    setPaymentAmount('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment Collection"
        subtitle="Collect payments and issue receipts"
        breadcrumb={[{ label: 'Dashboard', path: '/clerk' }, { label: 'Payment Collection' }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search bills by ID or patient..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
          </Card>

          <div className="space-y-3">
            {filteredBills.map(bill => (
              <Card key={bill.billId} className="p-4 hover:shadow-md transition-all cursor-pointer" onClick={() => { setSelectedBill(bill); setPaymentAmount(String(bill.balance)); }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{bill.billId}</p>
                      <StatusBadge status={bill.paymentStatus} size="sm" />
                    </div>
                    <p className="text-sm text-muted-foreground">{bill.patientId} • {bill.items.length} items</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{formatCurrency(bill.balance)}</p>
                    <p className="text-xs text-muted-foreground">of {formatCurrency(bill.totalAmount)}</p>
                  </div>
                </div>
              </Card>
            ))}
            {filteredBills.length === 0 && <p className="text-center text-muted-foreground py-8">No pending bills found</p>}
          </div>
        </div>

        <Card className="p-6 h-fit">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Banknote className="w-5 h-5 text-primary" />Payment Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="text-sm">Total Pending</span>
              <span className="text-sm font-bold text-yellow-700">{formatCurrency(pendingBills.reduce((s, b) => s + b.balance, 0))}</span>
            </div>
            <div className="flex justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm">Collected Today</span>
              <span className="text-sm font-bold text-green-700">{formatCurrency(bills.filter(b => b.billDate === '2025-04-18' && b.paymentStatus === 'paid').reduce((s, b) => s + b.amountPaid, 0))}</span>
            </div>
            <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm">Total Bills</span>
              <span className="text-sm font-bold text-blue-700">{bills.length}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Payment Dialog */}
      <Dialog open={!!selectedBill} onOpenChange={() => setSelectedBill(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Process Payment</DialogTitle></DialogHeader>
          {selectedBill && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Bill ID: {selectedBill.billId}</p>
                <p className="text-sm text-muted-foreground">Patient: {selectedBill.patientId}</p>
                <div className="flex justify-between mt-2">
                  <span className="font-medium">Total Amount:</span>
                  <span className="font-bold">{formatCurrency(selectedBill.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Paid:</span>
                  <span className="text-green-600">{formatCurrency(selectedBill.amountPaid)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className="font-medium">Balance:</span>
                  <span className="font-bold text-red-600">{formatCurrency(selectedBill.balance)}</span>
                </div>
              </div>
              <div>
                <Label>Payment Amount</Label>
                <Input type="number" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} max={selectedBill.balance} />
              </div>
              <div>
                <Label>Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={handlePayment}><CheckCircle className="w-4 h-4 mr-2" />Process Payment</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent>
          <DialogHeader><DialogTitle>Payment Receipt</DialogTitle></DialogHeader>
          <div className="p-6 border-2 border-dashed border-muted rounded-lg text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
            <h3 className="text-lg font-bold">Payment Successful</h3>
            <p className="text-sm text-muted-foreground">Receipt: {generateReceiptNumber()}</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(parseFloat(paymentAmount) || 0)}</p>
            <p className="text-sm text-muted-foreground">Paid via {PAYMENT_METHODS.find(m => m.value === paymentMethod)?.label}</p>
            <Button variant="outline" className="mt-4" onClick={() => setShowReceipt(false)}><Printer className="w-4 h-4 mr-2" />Print Receipt</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentCollection;
