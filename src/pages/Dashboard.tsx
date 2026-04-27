import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingCart, Package, Users, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard: React.FC = () => {
  // Real-time today's sales trend state
  const [todaySalesData, setTodaySalesData] = useState([
    { time: '08:00', sales: 0, orders: 0 },
    { time: '08:05', sales: 45, orders: 2 },
    { time: '08:10', sales: 89, orders: 4 },
    { time: '08:15', sales: 134, orders: 6 },
    { time: '08:20', sales: 178, orders: 8 },
    { time: '08:25', sales: 223, orders: 10 },
    { time: '08:30', sales: 267, orders: 12 },
    { time: '08:35', sales: 312, orders: 14 },
    { time: '08:40', sales: 356, orders: 16 },
    { time: '08:45', sales: 401, orders: 18 },
    { time: '08:50', sales: 445, orders: 20 },
    { time: '08:55', sales: 490, orders: 22 },
    { time: '09:00', sales: 534, orders: 24 },
    { time: '09:05', sales: 579, orders: 26 },
    { time: '09:10', sales: 623, orders: 28 },
    { time: '09:15', sales: 668, orders: 30 },
  ]);

  // Generate random sales data for simulation with 5-minute intervals
  const generateTodaySalesData = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const data = [];
    
    // Start from 8:00 AM and generate data every 5 minutes
    const startHour = 8;
    const totalMinutes = (currentHour - startHour) * 60 + currentMinute;
    const intervals = Math.min(Math.floor(totalMinutes / 5), 72); // Max 72 intervals for 6 hours
    
    for (let i = 0; i <= intervals; i++) {
      const totalMinutesPassed = i * 5;
      const hour = Math.floor(totalMinutesPassed / 60) + startHour;
      const minute = totalMinutesPassed % 60;
      
      // Generate realistic sales progression
      const baseSales = i * 35 + Math.floor(Math.random() * 20);
      const baseOrders = i * 1.5 + Math.floor(Math.random() * 2);
      
      data.push({
        time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
        sales: baseSales,
        orders: Math.floor(baseOrders)
      });
    }
    
    // Add current time with latest data
    const currentSales = intervals * 35 + Math.floor(Math.random() * 50) + 800;
    const currentOrders = intervals * 1.5 + Math.floor(Math.random() * 5) + 30;
    data.push({
      time: `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`,
      sales: currentSales,
      orders: Math.floor(currentOrders)
    });
    
    // Keep only last 20 data points for better visualization
    return data.slice(-20);
  };

  // Refresh data every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTodaySalesData(generateTodaySalesData());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // 30-day sales trend data
  const salesTrendData = [
    { date: 'Mar 15', sales: 2456, orders: 42 },
    { date: 'Mar 16', sales: 2890, orders: 48 },
    { date: 'Mar 17', sales: 3123, orders: 51 },
    { date: 'Mar 18', sales: 2789, orders: 46 },
    { date: 'Mar 19', sales: 3456, orders: 58 },
    { date: 'Mar 20', sales: 3890, orders: 63 },
    { date: 'Mar 21', sales: 4234, orders: 71 },
    { date: 'Mar 22', sales: 3678, orders: 59 },
    { date: 'Mar 23', sales: 4123, orders: 68 },
    { date: 'Mar 24', sales: 4567, orders: 74 },
    { date: 'Mar 25', sales: 4890, orders: 82 },
    { date: 'Mar 26', sales: 5234, orders: 87 },
    { date: 'Mar 27', sales: 4678, orders: 76 },
    { date: 'Mar 28', sales: 5012, orders: 83 },
    { date: 'Mar 29', sales: 5345, orders: 89 },
    { date: 'Mar 30', sales: 5678, orders: 94 },
    { date: 'Mar 31', sales: 6012, orders: 98 },
    { date: 'Apr 1', sales: 5234, orders: 86 },
    { date: 'Apr 2', sales: 4890, orders: 79 },
    { date: 'Apr 3', sales: 5123, orders: 84 },
    { date: 'Apr 4', sales: 5456, orders: 88 },
    { date: 'Apr 5', sales: 5789, orders: 91 },
    { date: 'Apr 6', sales: 6123, orders: 96 },
    { date: 'Apr 7', sales: 6456, orders: 102 },
    { date: 'Apr 8', sales: 6789, orders: 107 },
    { date: 'Apr 9', sales: 7123, orders: 113 },
    { date: 'Apr 10', sales: 7456, orders: 119 },
    { date: 'Apr 11', sales: 7789, orders: 125 },
    { date: 'Apr 12', sales: 8123, orders: 131 },
    { date: 'Apr 13', sales: 8456, orders: 137 },
    { date: 'Apr 14', sales: 8789, orders: 143 },
  ];

  const stats = [
    {
      title: 'Today\'s Sales',
      value: '$8,789',
      change: '+12.5%',
      icon: DollarSign,
      color: 'bg-blue-500'
    },
    {
      title: 'Orders',
      value: '143',
      change: '+8.2%',
      icon: ShoppingCart,
      color: 'bg-green-500'
    },
    {
      title: 'Products',
      value: '1,234',
      change: '+2.1%',
      icon: Package,
      color: 'bg-purple-500'
    },
    {
      title: 'Customers',
      value: '892',
      change: '+15.3%',
      icon: Users,
      color: 'bg-orange-500'
    }
  ];

  const recentSales = [
    { id: '001', customer: 'John Smith', amount: '$125.50', time: '2 min ago', status: 'completed' },
    { id: '002', customer: 'Sarah Johnson', amount: '$89.99', time: '5 min ago', status: 'completed' },
    { id: '003', customer: 'Mike Davis', amount: '$234.75', time: '12 min ago', status: 'pending' },
    { id: '004', customer: 'Emma Wilson', amount: '$67.25', time: '18 min ago', status: 'completed' },
  ];

  const lowStockItems = [
    { name: 'Wireless Mouse', stock: 3, reorderPoint: 10 },
    { name: 'USB-C Cable', stock: 5, reorderPoint: 15 },
    { name: 'Laptop Stand', stock: 2, reorderPoint: 8 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-sm text-green-600 mt-2">{stat.change}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Real-time Today's Sales Trend */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Today's Sales Trend</h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-500">Live - Refreshing every 5s</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={todaySalesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Line 
              yAxisId="left" 
              type="monotone" 
              dataKey="sales" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={{ fill: '#3B82F6', r: 4 }}
              animationDuration={500}
            />
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="orders" 
              stroke="#10B981" 
              strokeWidth={2}
              dot={{ fill: '#10B981', r: 4 }}
              animationDuration={500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 30-Day Sales Trend */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">30-Day Sales Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={2} />
            <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#10B981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Sales */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Sales</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Order #{sale.id}</p>
                      <p className="text-sm text-gray-500">{sale.customer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{sale.amount}</p>
                    <p className="text-sm text-gray-500">{sale.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-semibold text-gray-900">Low Stock Alerts</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {lowStockItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">Reorder at {item.reorderPoint}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    item.stock <= 2 ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {item.stock} left
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
