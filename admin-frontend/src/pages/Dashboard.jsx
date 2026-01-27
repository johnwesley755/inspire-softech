import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { sellerService } from '../services/sellerServices';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Package, ShoppingCart, DollarSign, Clock, Plus, BarChart2 } from 'lucide-react';
import { cn } from '../utils/cn';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    commission: 0,
    status: 'pending'
  });
  const [loading, setLoading] = useState(true);

  // Mock data for the chart (replace with real data if available later)
  const data = [
    { name: 'Mon', revenue: 400 },
    { name: 'Tue', revenue: 300 },
    { name: 'Wed', revenue: 600 },
    { name: 'Thu', revenue: 800 },
    { name: 'Fri', revenue: 500 },
    { name: 'Sat', revenue: 900 },
    { name: 'Sun', revenue: 1000 },
  ];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await sellerService.getMyStats();
      setStats(response.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <main className="p-8">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-display font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500 mt-1">Welcome back, {user?.name}</p>

              {stats.status === 'pending' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-3"
                >
                  <Clock className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800">Pending Approval</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Your seller account is currently under review. You will be able to add products once approved.
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
            
            {/* Stats Grid */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              {[
                { label: 'Total Products', value: stats.totalProducts, icon: Package, color: 'blue' },
                { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'green' },
                { label: 'Total Revenue', value: `$${(stats.totalRevenue || 0).toFixed(2)}`, icon: DollarSign, color: 'purple' },
                { label: 'Pending Orders', value: stats.pendingOrders, icon: Clock, color: 'orange' },
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn("p-3 rounded-xl", `bg-${stat.color}-50 text-${stat.color}-600`)}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <span className={cn("text-xs font-bold px-2 py-1 rounded-full", `bg-${stat.color}-50 text-${stat.color}-600`)}>
                      +12%
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">{loading ? '...' : stat.value}</h3>
                  <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
               {/* Chart Section */}
               <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Revenue Overview</h2>
                  <select className="text-sm border-gray-200 rounded-lg text-gray-500 bg-gray-50">
                    <option>This Week</option>
                    <option>This Month</option>
                  </select>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} prefix="$" />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#6366f1" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              >
                <h2 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h2>
                <div className="space-y-4">
                  <Link
                    to="/products/new"
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 hover:shadow-sm transition-all group"
                  >
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 group-hover:scale-110 transition-transform">
                      <Plus className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary-700">Add New Product</h3>
                      <p className="text-xs text-gray-500">Create a listing</p>
                    </div>
                  </Link>
                  
                  <Link
                    to="/orders"
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 hover:shadow-sm transition-all group"
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                      <ShoppingCart className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-green-700">Process Orders</h3>
                      <p className="text-xs text-gray-500">Manage shipments</p>
                    </div>
                  </Link>

                  <Link
                    to="/products"
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 hover:shadow-sm transition-all group"
                  >
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-purple-700">Inventory</h3>
                      <p className="text-xs text-gray-500">Update stock levels</p>
                    </div>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
