import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { orderService } from '../services/adminServices';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrder(id);
      setOrder(data.order);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch order');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdating(true);
      await orderService.updateOrderStatus(id, newStatus);
      setOrder({ ...order, status: newStatus });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Processing': 'bg-blue-100 text-blue-800 border-blue-300',
      'Shipped': 'bg-purple-100 text-purple-800 border-purple-300',
      'Delivered': 'bg-green-100 text-green-800 border-green-300',
      'Cancelled': 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusSteps = () => {
    const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    const currentIndex = steps.indexOf(order?.status);
    return steps.map((step, index) => ({
      name: step,
      completed: index <= currentIndex,
      current: step === order?.status
    }));
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Header />
          <div className="p-8 flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Header />
          <div className="p-8">
            <div className="bg-red-100 text-red-700 p-4 rounded-lg">
              {error || 'Order not found'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <div className="p-8 bg-gray-50 min-h-screen">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => navigate('/orders')}
              className="text-primary-600 hover:text-primary-800 mb-4 flex items-center gap-2"
            >
              ← Back to Orders
            </button>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Order #{order._id.slice(-8).toUpperCase()}
                </h1>
                <p className="text-gray-600">Placed on {formatDate(order.createdAt)}</p>
              </div>
              <span className={`px-4 py-2 text-sm font-semibold rounded-lg border-2 ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
          </div>

          {/* Order Timeline */}
          {order.status !== 'Cancelled' && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Order Progress</h2>
              <div className="flex items-center justify-between">
                {getStatusSteps().map((step, index) => (
                  <div key={step.name} className="flex-1 flex items-center">
                    <div className="flex flex-col items-center flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        step.completed
                          ? 'bg-primary-600 border-primary-600 text-white'
                          : 'bg-white border-gray-300 text-gray-400'
                      }`}>
                        {step.completed ? '✓' : index + 1}
                      </div>
                      <p className={`mt-2 text-sm font-medium ${
                        step.current ? 'text-primary-600' : step.completed ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {step.name}
                      </p>
                    </div>
                    {index < getStatusSteps().length - 1 && (
                      <div className={`flex-1 h-1 ${
                        step.completed ? 'bg-primary-600' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Order Items</h2>
                <div className="space-y-4">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 pb-4 border-b last:border-b-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">${item.price}</p>
                        <p className="text-sm text-gray-600">
                          Total: ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-primary-600">${order.totalPrice?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Details Sidebar */}
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">Name:</span>{' '}
                    <span className="text-gray-900">{order.user?.name}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">Email:</span>{' '}
                    <span className="text-gray-900">{order.user?.email}</span>
                  </p>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
                <div className="text-sm text-gray-900">
                  <p>{order.shippingAddress?.street}</p>
                  <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                  <p>{order.shippingAddress?.zipCode}</p>
                  <p>{order.shippingAddress?.country}</p>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Payment Information</h2>
                <p className="text-sm">
                  <span className="font-medium text-gray-700">Method:</span>{' '}
                  <span className="text-gray-900 capitalize">{order.paymentMethod?.replace('_', ' ')}</span>
                </p>
              </div>

              {/* Update Status */}
              {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4">Update Order Status</h2>
                  <div className="space-y-2">
                    {['Pending', 'Processing', 'Shipped', 'Delivered'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusUpdate(status)}
                        disabled={updating || order.status === status}
                        className={`w-full px-4 py-2 rounded-lg font-medium transition ${
                          order.status === status
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-primary-600 text-white hover:bg-primary-700'
                        }`}
                      >
                        {updating ? 'Updating...' : `Mark as ${status}`}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
