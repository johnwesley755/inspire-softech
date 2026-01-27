import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { User, Mail, Phone, MapPin, Camera, Loader, Save } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(user?.profileImage || null);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || '',
    image: null
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zipCode: user.address?.zipCode || '',
        country: user.address?.country || '',
      }));
      setImagePreview(user.profileImage);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('phone', formData.phone);
      
      const addressObj = {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country
      };
      
      data.append('address', JSON.stringify(addressObj));
      
      if (formData.image) {
        data.append('image', formData.image);
      }

      const response = await authService.updateProfile(data);
      
      // Update context if needed, though authService updates localStorage
      // We might need to refresh the user in context. Ideally updateProfile returns the new user.
      if (response.user) {
         // Force reload or re-fetch me would be better, but for now relies on localStorage update
         // A page reload is a simple way to sync context if context doesn't auto-sync from storage
         window.location.reload(); 
      }
      
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="md:flex">
            {/* Sidebar / Profile Image */}
            <div className="md:w-1/3 bg-gray-50 p-8 border-r border-gray-100 text-center">
              <div className="relative inline-block mb-4 group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200 mx-auto">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <User className="w-12 h-12" />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-primary-700 transition-colors">
                  <Camera className="w-4 h-4" />
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              </div>
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500 mb-6">{user.email}</p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-2">
                 <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold capitalize">{user.role}</span>
              </div>
            </div>

            {/* Main Form */}
            <div className="md:w-2/3 p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h1>
              
              {success && (
                <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-100 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  {success}
                </div>
              )}
              
              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    Address Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                       <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                       <input
                         type="text"
                         name="street"
                         value={formData.street}
                         onChange={handleChange}
                         className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
                       />
                    </div>
                    <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                       <input
                         type="text"
                         name="city"
                         value={formData.city}
                         onChange={handleChange}
                         className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
                       />
                    </div>
                    <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                       <input
                         type="text"
                         name="state"
                         value={formData.state}
                         onChange={handleChange}
                         className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
                       />
                    </div>
                    <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                       <input
                         type="text"
                         name="zipCode"
                         value={formData.zipCode}
                         onChange={handleChange}
                         className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
                       />
                    </div>
                    <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                       <input
                         type="text"
                         name="country"
                         value={formData.country}
                         onChange={handleChange}
                         className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
                       />
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
