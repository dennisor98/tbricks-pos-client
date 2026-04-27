import React, { useState } from 'react';
import { Search, Filter, Download, Eye, Receipt, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { Sale } from '../types';

const Sales: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('today');

  const sales: Sale[] = [
    {
      id: '001',
      items: [
        { product: { id: '1', name: 'Wireless Mouse', price: 29.99, cost: 15.50, stock: 45, category: 'Electronics', sku: 'WM-001' }, quantity: 2, subtotal: 59.98 },
        { product: { id: '2', name: 'USB-C Cable', price: 12.99, cost: 6.25, stock: 120, category: 'Electronics', sku: 'UC-002' }, quantity: 1, subtotal: 12.99 }
      ],
      total: 72.97,
      tax: 5.84,
      discount: 0,
      paymentMethod: 'card',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      customerInfo: { name: 'John Smith', email: 'john@example.com', phone: '555-0123' }
    },
    {
      id: '002',
      items: [
        { product: { id: '3', name: 'Laptop Stand', price: 49.99, cost: 28.75, stock: 23, category: 'Accessories', sku: 'LS-003' }, quantity: 1, subtotal: 49.99 }
      ],
      total: 49.99,
      tax: 4.00,
      discount: 5.00,
      paymentMethod: 'cash',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      customerInfo: { name: 'Sarah Johnson', email: 'sarah@example.com', phone: '555-0124' }
    },
    {
      id: '003',
      items: [
        { product: { id: '4', name: 'Mechanical Keyboard', price: 89.99, cost: 52.30, stock: 15, category: 'Electronics', sku: 'MK-004' }, quantity: 1, subtotal: 89.99 },
        { product: { id: '5', name: 'Desk Lamp', price: 34.99, cost: 18.90, stock: 67, category: 'Accessories', sku: 'DL-005' }, quantity: 1, subtotal: 34.99 }
      ],
      total: 124.98,
      tax: 10.00,
      discount: 0,
      paymentMethod: 'digital',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      customerInfo: { name: 'Mike Davis', email: 'mike@example.com', phone: '555-0125' }
    },
    {
      id: '004',
      items: [
        { product: { id: '6', name: 'Webcam HD', price: 59.99, cost: 35.60, stock: 31, category: 'Electronics', sku: 'WC-006' }, quantity: 1, subtotal: 59.99 }
      ],
      total: 59.99,
      tax: 4.80,
      discount: 0,
      paymentMethod: 'card',
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
      customerInfo: { name: 'Emma Wilson', email: 'emma@example.com', phone: '555-0126' }
    },
  ];

  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.id.includes(searchTerm.toLowerCase()) ||
                         sale.customerInfo?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.items.some(item => item.product.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalTax = sales.reduce((sum, sale) => sum + sale.tax, 0);
  const totalDiscounts = sales.reduce((sum, sale) => sum + sale.discount, 0);
  const averageOrderValue = totalRevenue / sales.length;

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'cash': return 'bg-green-100 text-green-800';
      case 'card': return 'bg-blue-100 text-blue-800';
      case 'digital': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Management</h1>
          <p className="text-gray-600 mt-2">View and manage all your sales transactions</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-5 h-5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">${totalRevenue.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{sales.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Receipt className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">${averageOrderValue.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tax</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">${totalTax.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by order ID, customer, or product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSales.map(sale => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">#{sale.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{sale.customerInfo?.name}</div>
                      <div className="text-sm text-gray-500">{sale.customerInfo?.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {sale.items.length} item{sale.items.length > 1 ? 's' : ''}
                    </div>
                    <div className="text-xs text-gray-500">
                      {sale.items.map(item => item.product.name).join(', ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${sale.total.toFixed(2)}</div>
                    {sale.discount > 0 && (
                      <div className="text-xs text-green-600">-${sale.discount.toFixed(2)} discount</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentMethodColor(sale.paymentMethod)}`}>
                      {sale.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(sale.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Receipt className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Sales;
