// Shared mock data for secondary modules (Subscriptions, Quotations, Invoices, Users)
// seamlessly connected to the live Catalog APIs.

export const initialCustomers = [
  { id: 1, name: 'Acme Corp', email: 'billing@acme.com', company: 'Acme Corp', phone: '+91 98765 43210' },
  { id: 2, name: 'Globex Systems', email: 'accounts@globex.io', company: 'Globex Systems', phone: '+91 91234 56789' },
  { id: 3, name: 'Initech Software', email: 'finance@initech.com', company: 'Initech Software', phone: '+91 99887 76655' },
  { id: 4, name: 'Soylent Health', email: 'procurement@soylent.com', company: 'Soylent Health', phone: '+91 98112 23344' },
];

export const initialQuotations = [
  {
    id: 'QT-2025-001',
    customerName: 'Acme Corp',
    customerEmail: 'billing@acme.com',
    items: [
      { productName: 'Odoo Software', variantName: 'Odoo Brand', quantity: 1, unitPrice: 5560 },
      { productName: 'Microsoft 365', variantName: null, quantity: 1, unitPrice: 4000 },
    ],
    subtotal: 9560,
    taxRate: 18,
    taxAmount: 1721.2,
    total: 11281.2,
    status: 'Draft',
    date: '2025-01-15',
  },
  {
    id: 'QT-2025-002',
    customerName: 'Globex Systems',
    customerEmail: 'accounts@globex.io',
    items: [
      { productName: 'Enterprise Cloud Backup', variantName: '500GB Vault', quantity: 2, unitPrice: 2400 },
    ],
    subtotal: 4800,
    taxRate: 18,
    taxAmount: 864,
    total: 5664,
    status: 'Sent',
    date: '2025-01-20',
  },
];

export const initialSubscriptions = [
  {
    id: 'SUB-101',
    planName: 'Pro Plan',
    productName: 'Brightloop Business Suite',
    price: 2000,
    billingFrequency: 'Monthly',
    customerName: 'Acme Corp',
    startDate: 'Jan 1, 2025',
    nextBillingDate: 'Feb 1, 2025',
    status: 'Active',
    usersCount: 5,
  },
  {
    id: 'SUB-102',
    planName: 'Enterprise Plan',
    productName: 'Cloud ERP System',
    price: 5000,
    billingFrequency: 'Yearly',
    customerName: 'Globex Systems',
    startDate: 'Jan 1, 2025',
    nextBillingDate: 'Dec 31, 2025',
    status: 'Active',
    usersCount: 10,
  },
  {
    id: 'SUB-103',
    planName: 'Basic Plan',
    productName: 'Starter Collaboration',
    price: 1000,
    billingFrequency: 'Monthly',
    customerName: 'Initech Software',
    startDate: 'Jan 1, 2025',
    nextBillingDate: 'Feb 1, 2025',
    status: 'Paused',
    usersCount: 1,
  },
];

export const initialInvoices = [
  {
    id: 'INV-1001',
    subscriptionId: 'SUB-101',
    customerName: 'Acme Corp',
    planName: 'Pro Plan (Jan 2025)',
    amount: 2360,
    date: 'Jan 1, 2025',
    dueDate: 'Jan 15, 2025',
    status: 'Paid',
  },
  {
    id: 'INV-1002',
    subscriptionId: 'SUB-102',
    customerName: 'Globex Systems',
    planName: 'Enterprise Plan (Annual)',
    amount: 5900,
    date: 'Jan 1, 2025',
    dueDate: 'Jan 15, 2025',
    status: 'Paid',
  },
  {
    id: 'INV-1003',
    subscriptionId: 'SUB-103',
    customerName: 'Initech Software',
    planName: 'Basic Plan (Monthly)',
    amount: 1180,
    date: 'Jan 1, 2025',
    dueDate: 'Jan 15, 2025',
    status: 'Overdue',
  },
];

export const initialUsers = [
  { id: 1, name: 'Admin User', email: 'admin@brightloop.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Support Staff', email: 'staff@brightloop.com', role: 'Staff', status: 'Active' },
  { id: 3, name: 'John Doe', email: 'john@acme.com', role: 'Customer', status: 'Active' },
];

export const initialActivities = [
  {
    id: 1,
    title: 'New subscription',
    subtitle: 'Acme Corp • 2h ago',
    type: 'subscription',
    iconColor: '#5e4cfc',
  },
  {
    id: 2,
    title: 'Invoice paid',
    subtitle: '#INV-1001 • 3h ago',
    type: 'invoice',
    iconColor: '#10b981',
  },
  {
    id: 3,
    title: 'New customer',
    subtitle: 'john@example.com • 4h ago',
    type: 'customer',
    iconColor: '#f59e0b',
  },
];

