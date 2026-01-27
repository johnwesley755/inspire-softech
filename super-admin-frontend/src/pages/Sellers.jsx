import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { superAdminService } from '../services/superAdminServices';

const Sellers = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(searchParams.get('status') || 'all');
  const [editingCommission, setEditingCommission] = useState(null);
  const [commissionValue, setCommissionValue] = useState('');

  useEffect(() => {
    fetchSellers();
  }, [filter]);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const status = filter === 'all' ? null : filter;
      const response = await superAdminService.getAllSellers(status);
      setSellers(response.sellers);
    } catch (error) {
      console.error('Failed to fetch sellers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await superAdminService.approveSeller(id);
      fetchSellers();
    } catch (error) {
      console.error('Failed to approve seller:', error);
      alert('Failed to approve seller');
    }
  };

  const handleReject = async (id) => {
    if (confirm('Are you sure you want to reject this seller?')) {
      try {
        await superAdminService.rejectSeller(id);
        fetchSellers();
      } catch (error) {
        console.error('Failed to reject seller:', error);
        alert('Failed to reject seller');
      }
    }
  };

  const handleSuspend = async (id) => {
    if (confirm('Are you sure you want to suspend this seller?')) {
      try {
        await superAdminService.suspendSeller(id);
        fetchSellers();
      } catch (error) {
        console.error('Failed to suspend seller:', error);
        alert('Failed to suspend seller');
      }
    }
  };

  const handleUpdateCommission = async (id) => {
    try {
      await superAdminService.updateCommission(id, parseFloat(commissionValue));
      setEditingCommission(null);
      setCommissionValue('');
      fetchSellers();
    } catch (error) {
      console.error('Failed to update commission:', error);
      alert('Failed to update commission');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      suspended: 'bg-gray-100 text-gray-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <div className="p-8 bg-gray-50 min-h-screen">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Seller Management</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg ${filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-white text-gray-700'}`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter('approved')}
                className={`px-4 py-2 rounded-lg ${filter === 'approved' ? 'bg-green-600 text-white' : 'bg-white text-gray-700'}`}
              >
                Approved
              </button>
              <button
                onClick={() => setFilter('suspended')}
                className={`px-4 py-2 rounded-lg ${filter === 'suspended' ? 'bg-gray-600 text-white' : 'bg-white text-gray-700'}`}
              >
                Suspended
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : sellers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No sellers found</div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sellers.map((seller) => (
                    <tr key={seller._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{seller.businessName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {seller.businessEmail}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(seller.status)}`}>
                          {seller.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {editingCommission === seller._id ? (
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={commissionValue}
                              onChange={(e) => setCommissionValue(e.target.value)}
                              className="w-20 px-2 py-1 border rounded"
                              min="0"
                              max="100"
                            />
                            <button
                              onClick={() => handleUpdateCommission(seller._id)}
                              className="text-green-600 hover:text-green-800"
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => setEditingCommission(null)}
                              className="text-red-600 hover:text-red-800"
                            >
                              ✗
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span>{seller.commission}%</span>
                            <button
                              onClick={() => {
                                setEditingCommission(seller._id);
                                setCommissionValue(seller.commission);
                              }}
                              className="text-blue-600 hover:text-blue-800 text-xs"
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${(seller.totalRevenue || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {seller.totalOrders || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          {seller.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(seller._id)}
                                className="text-green-600 hover:text-green-800 font-medium"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(seller._id)}
                                className="text-red-600 hover:text-red-800 font-medium"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {seller.status === 'approved' && (
                            <button
                              onClick={() => handleSuspend(seller._id)}
                              className="text-orange-600 hover:text-orange-800 font-medium"
                            >
                              Suspend
                            </button>
                          )}
                          {seller.status === 'suspended' && (
                            <button
                              onClick={() => handleApprove(seller._id)}
                              className="text-green-600 hover:text-green-800 font-medium"
                            >
                              Reactivate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sellers;
