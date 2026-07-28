import { format, parseISO } from 'date-fns';

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return format(parseISO(dateString), 'dd/MM/yyyy');
  } catch {
    return dateString;
  }
};

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return format(parseISO(dateString), 'dd/MM/yyyy HH:mm');
  } catch {
    return dateString;
  }
};

export const formatCurrency = (amount, currency = '₦') => {
  return `${currency} ${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatNumber = (num) => {
  return num.toLocaleString('en-NG');
};

export const formatPhone = (phone) => {
  return phone;
};

export const calculateAge = (dateOfBirth) => {
  try {
    const dob = parseISO(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  } catch {
    return 0;
  }
};

export const getInitials = (firstName, lastName) => {
  return `${firstName[0]}${lastName[0]}`.toUpperCase();
};

export const getStatusColor = (status) => {
  const statusMap = {
    active: 'bg-green-100 text-green-700 border-green-200',
    completed: 'bg-blue-100 text-blue-700 border-blue-200',
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    paid: 'bg-green-100 text-green-700 border-green-200',
    unpaid: 'bg-red-100 text-red-700 border-red-200',
    partial: 'bg-orange-100 text-orange-700 border-orange-200',
    draft: 'bg-gray-100 text-gray-700 border-gray-200',
    closed: 'bg-slate-100 text-slate-700 border-slate-200',
    operational: 'bg-green-100 text-green-700 border-green-200',
    maintenance: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'out-of-order': 'bg-red-100 text-red-700 border-red-200',
    approved: 'bg-green-100 text-green-700 border-green-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
    'on-leave': 'bg-purple-100 text-purple-700 border-purple-200',
    suspended: 'bg-red-100 text-red-700 border-red-200',
    administered: 'bg-green-100 text-green-700 border-green-200',
    missed: 'bg-red-100 text-red-700 border-red-200',
    held: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    urgent: 'bg-red-100 text-red-700 border-red-200',
    stat: 'bg-red-100 text-red-700 border-red-200',
    routine: 'bg-blue-100 text-blue-700 border-blue-200',
    received: 'bg-green-100 text-green-700 border-green-200',
    ordered: 'bg-blue-100 text-blue-700 border-blue-200',
    unseen: 'bg-purple-100 text-black-700 border-purple-200',
    seen: 'bg-blue-100 text-blue-700 border-blue-200',
    outPatient: 'bg-green-100 text-green-700 border-green-200',
    inwardPatient: 'bg-blue-100 text-blue-700 border-blue-200',
    undone: 'bg-blue-100 text-blue-700 border-blue-200',
    inProgress: 'bg-blue-100 text-blue-700 border-blue-200',
    'pending-approval': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  };
  return statusMap[status.toLowerCase()] || 'bg-gray-100 text-gray-700 border-gray-200';
};

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};