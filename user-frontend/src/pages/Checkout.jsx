import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/orderService';
import api from '../services/api';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  
  const [formData, setFormData] = useState({
    // Shipping Address
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    // Payment
    paymentMethod: 'credit_card',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateSubtotal = () => {
    return cart?.items?.reduce((sum, item) => sum + (item.product?.price * item.quantity), 0) || 0;
  };

  const calculateShipping = () => {
    return calculateSubtotal() > 50 ? 0 : 10;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Process payment first (mock)
      if (formData.paymentMethod !== 'cash_on_delivery') {
        const paymentResponse = await api.post('/payment/process', {
          amount: calculateTotal(),
          paymentMethod: formData.paymentMethod,
          cardDetails: {
            cardNumber: formData.cardNumber,
            cvv: formData.cvv,
            expiryDate: formData.expiryDate,
          },
        });

        if (!paymentResponse.data.success) {
          throw new Error('Payment failed');
        }
      }

      // Map payment method to allowed enum values
      const paymentMethodMap = {
        'credit_card': 'Credit Card',
        'debit_card': 'Debit Card',
        'cash_on_delivery': 'Cash on Delivery'
      };

      // Create order
      const orderData = {
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        paymentMethod: paymentMethodMap[formData.paymentMethod] || formData.paymentMethod,
      };

      const orderResponse = await orderService.createOrder(orderData);
      
      // Clear cart locally (backend handles DB clearing)
      await clearCart(); // Context clearCart now syncs or just clears state

      // Redirect to order confirmation
      navigate(`/orders/${orderResponse.order._id}`, {
        state: { orderPlaced: true }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
            <button onClick={() => navigate('/products')} className="btn-primary">
              Continue Shopping
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
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Shipping Address */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder="123 Main St"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          className="input-field"
                          placeholder="New York"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          required
                          className="input-field"
                          placeholder="NY"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          required
                          className="input-field"
                          placeholder="10001"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country *
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          required
                          className="input-field"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                  
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="credit_card"
                          checked={formData.paymentMethod === 'credit_card'}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        <span>Credit Card</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="debit_card"
                          checked={formData.paymentMethod === 'debit_card'}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        <span>Debit Card</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cash_on_delivery"
                          checked={formData.paymentMethod === 'cash_on_delivery'}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        <span>Cash on Delivery</span>
                      </label>
                    </div>

                    {formData.paymentMethod !== 'cash_on_delivery' && (
                      <div className="space-y-4 pt-4 border-t">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Card Number *
                          </label>
                          <input
                            type="text"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            required={formData.paymentMethod !== 'cash_on_delivery'}
                            className="input-field"
                            placeholder="1234 5678 9012 3456"
                            maxLength="19"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cardholder Name *
                          </label>
                          <input
                            type="text"
                            name="cardName"
                            value={formData.cardName}
                            onChange={handleChange}
                            required={formData.paymentMethod !== 'cash_on_delivery'}
                            className="input-field"
                            placeholder="John Doe"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Expiry Date *
                            </label>
                            <input
                              type="text"
                              name="expiryDate"
                              value={formData.expiryDate}
                              onChange={handleChange}
                              required={formData.paymentMethod !== 'cash_on_delivery'}
                              className="input-field"
                              placeholder="MM/YY"
                              maxLength="5"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              CVV *
                            </label>
                            <input
                              type="text"
                              name="cvv"
                              value={formData.cvv}
                              onChange={handleChange}
                              required={formData.paymentMethod !== 'cash_on_delivery'}
                              className="input-field"
                              placeholder="123"
                              maxLength="4"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 mb-4">
                    {cart.items.map((item) => (
                      <div key={item._id} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.product?.name} x {item.quantity}
                        </span>
                        <span className="font-medium">
                          ${(item.product?.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-3 space-y-2 mb-4">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span>
                        {calculateShipping() === 0 ? (
                          <span className="text-green-600 font-medium">FREE</span>
                        ) : (
                          `$${calculateShipping().toFixed(2)}`
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary-600">${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Place Order'}
                  </button>

                  <div className="mt-4 text-center text-sm text-gray-500">
                    <p>🔒 Your payment information is secure</p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
