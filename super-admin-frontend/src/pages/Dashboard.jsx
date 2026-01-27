import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { superAdminService } from '../services/superAdminServices';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, ShoppingCart, Package, DollarSign, Clock, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { cn } from '../utils/cn';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    sellers: { total: 0, pending: 0, approved: 0, suspended: 0 },
    totalOrders: 0,
    totalProducts: 0,
    revenue: { total: 0, commission: 0 }
  });
  const [loading, setLoading] = useState(true);

  // Mock data for platform growth
  const data = [
    { name: 'Jan', revenue: 4000, sellers: 24 },
    { name: 'Feb', revenue: 3000, sellers: 28 },
    { name: 'Mar', revenue: 6000, sellers: 35 },
    { name: 'Apr', revenue: 8000, sellers: 42 },
    { name: 'May', revenue: 5000, sellers: 48 },
    { name: 'Jun', revenue: 9000, sellers: 55 },
    { name: 'Jul', revenue: 11000, sellers: 64 },
  ];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await superAdminService.getPlatformStats();
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
              <h1 className="text-3xl font-display font-bold text-gray-900">Platform Overview</h1>
              <p className="text-gray-500 mt-1">Super Admin Dashboard</p>
            </motion.div>
            
            {/* Stats Grid */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              {[
                { label: 'Total Revenue', value: `$${(stats.revenue?.total || 0).toFixed(2)}`, icon: DollarSign, color: 'green', trend: '+18%' },
                { label: 'Active Sellers', value: stats.sellers?.approved || 0, icon: Users, color: 'purple', trend: '+12%' },
                { label: 'Pending Sellers', value: stats.sellers?.pending || 0, icon: Clock, color: 'yellow', trend: 'Action Needed' },
                { label: 'Total Orders', value: stats.totalOrders || 0, icon: ShoppingCart, color: 'blue', trend: '+24%' },
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn("p-3 rounded-xl", `bg-${stat.color}-50 text-${stat.color}-600`)}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    {stat.trend !== 'Action Needed' ? (
                      <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                        {stat.trend}
                      </span>
                    ) : (
                      <span className="flex items-center text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                        {stat.trend}
                      </span>
                    )}
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
                  <h2 className="text-lg font-bold text-gray-900">Platform Growth</h2>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-primary-50 text-primary-600 text-xs font-semibold rounded-lg">Revenue</span>
                    <span className="px-3 py-1 text-gray-400 text-xs font-semibold rounded-lg">Sellers</span>
                  </div>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
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
                        stroke="#8b5cf6" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorGrowth)" 
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
                <h2 className="text-lg font-bold text-gray-900 mb-6">Management</h2>
                <div className="space-y-4">
                  <Link
                    to="/sellers"
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 hover:shadow-sm transition-all group"
                  >
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-purple-700">Verify Sellers</h3>
                      <p className="text-xs text-gray-500">{stats.sellers?.pending || 0} pending approvals</p>
                    </div>
                  </Link>
                  
                  <Link
                    to="/categories"
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 hover:shadow-sm transition-all group"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-700">Manage Categories</h3>
                      <p className="text-xs text-gray-500">Update product structures</p>
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
