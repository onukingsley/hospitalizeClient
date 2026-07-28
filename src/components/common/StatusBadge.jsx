import React from 'react';
import { cn } from '@/lib/utils';
import { getStatusColor } from '@/lib/formatters';

const StatusBadge = ({ status, size = 'sm', className }) => {
  return (
      <span
          className={cn(
              "inline-flex items-center font-medium border rounded-full capitalize",
              size === 'sm' ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
              getStatusColor(status),
              className
          )}
      >
      {status === 'on-leave' ? 'On Leave' : status === 'out-of-order' ? 'Out of Order' : status === 'pending-approval' ? 'Pending Approval' : status.replace(/-/g, ' ')}
    </span>
  );
};

export default StatusBadge;