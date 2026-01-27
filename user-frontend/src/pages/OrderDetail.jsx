import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Loader from '../components/common/Loader';
import { orderService } from '../services/orderService';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const orderPlaced = location.state?.orderPlaced;

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

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      setCancelling(true);
      await orderService.cancelOrder(id);
      setOrder({ ...order, status: 'Cancelled' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
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
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader size="large" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 text-lg mb-4">{error || 'Order not found'}</p>
            <button onClick={() => navigate('/orders')} className="btn-primary">
              Back to Orders
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Success Message */}
          {orderPlaced && (
            <div className="mb-6 p-6 bg-green-100 border-2 border-green-300 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-3xl">✅</span>
                <div>
                  <h3 className="text-lg font-semibold text-green-900">Order Placed Successfully!</h3>
                  <p className="text-green-700">Thank you for your order. We'll send you updates via email.</p>
                </div>
              </div>
            </div>
          )}

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
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
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
              <div className="bg-white rounded-lg shadow-sm p-6">
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
              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
                <div className="text-sm text-gray-900">
                  <p>{order.shippingAddress?.street}</p>
                  <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                  <p>{order.shippingAddress?.zipCode}</p>
                  <p>{order.shippingAddress?.country}</p>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Payment Information</h2>
                <p className="text-sm">
                  <span className="font-medium text-gray-700">Method:</span>{' '}
                  <span className="text-gray-900 capitalize">{order.paymentMethod?.replace('_', ' ')}</span>
                </p>
              </div>

              {/* Cancel Order */}
              {order.status === 'Pending' && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <button
                    onClick={handleCancelOrder}
                    disabled={cancelling}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50"
                  >
                    {cancelling ? 'Cancelling...' : 'Cancel Order'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderDetail;
