import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sellerService } from '../services/sellerServices';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Building2, ArrowRight } from 'lucide-react';

const SellerRegistration = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({
    businessName: '',
    businessEmail: '',
    businessPhone: '',
    businessAddress: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await sellerService.register(formData);
      
      if (response.token) {
        localStorage.setItem('sellerToken', response.token);
        localStorage.setItem('sellerUser', JSON.stringify(response.user));
        setUser(response.user);
      }

      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-purple-900/90 mix-blend-multiply z-10" />
        <img 
          src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2664&auto=format&fit=crop" 
          alt="Business Partnership" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-between p-12 text-white">
          <div>
            <div className="w-12 h-12 bg-white/10 backdrop-blur-lg rounded-xl flex items-center justify-center border border-white/20 shadow-xl">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="max-w-md">
            <h1 className="text-4xl font-display font-bold mb-6 leading-tight">
              Establish your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">Brand Identity</span>
            </h1>
            <p className="text-lg text-blue-100/80 leading-relaxed font-light">
              Complete your business profile to start selling. Your brand's journey begins here.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold font-display text-gray-900">Business Details</h2>
            <p className="mt-2 text-sm text-gray-600">Tell us about your business</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                placeholder="My Store LLC"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Email</label>
              <input
                type="email"
                name="businessEmail"
                value={formData.businessEmail}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                placeholder="contact@mystore.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Phone</label>
              <input
                type="tel"
                name="businessPhone"
                value={formData.businessPhone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Address</label>
              <textarea
                name="businessAddress"
                rows="3"
                value={formData.businessAddress}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                placeholder="123 Commerce St, City, Country"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/30 group"
            >
              {loading ? 'Submitting...' : 'Register Business'}
              {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default SellerRegistration;
