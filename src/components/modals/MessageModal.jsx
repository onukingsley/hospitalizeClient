import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Pill,
    User,
    Stethoscope,
    Package,
    AlertCircle,
    Printer,
    X,
    Receipt,
    FileText,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const MessageModal = ({ message, setMessage, showMessage, setShowMessage}) => {



    return (
        <Dialog open={showMessage} onOpenChange={setShowMessage}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-blue-500" />
                        Information
                    </DialogTitle>
                </DialogHeader>
                <div className="p-6 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                        <AlertCircle className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-lg font-medium">{message}</p>
                    <Button className="mt-2" onClick={() => { setShowMessage(false); setMessage(''); }}>
                        OK
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default MessageModal;