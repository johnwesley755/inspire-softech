import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Loader from '../components/common/Loader';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateCartItem, removeFromCart, clearCart, loading } = useCart();
  const [updating, setUpdating] = useState({});

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      setUpdating({ ...updating, [itemId]: true });
      await updateCartItem(itemId, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setUpdating({ ...updating, [itemId]: false });
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeFromCart(itemId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await clearCart();
      } catch (error) {
        console.error('Failed to clear cart:', error);
      }
    }
  };

  const calculateSubtotal = () => {
    return cart?.items?.reduce((sum, item) => sum + (item.product?.price * item.quantity), 0) || 0;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = subtotal > 50 ? 0 : 10;
    return subtotal + shipping;
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

          {!cart?.items || cart.items.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Add some products to get started!</p>
              <Link to="/products" className="btn-primary">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="p-6 border-b">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold">
                        Cart Items ({cart.items.length})
                      </h2>
                      <button
                        onClick={handleClearCart}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Clear Cart
                      </button>
                    </div>
                  </div>

                  <div className="divide-y">
                    {cart.items.map((item) => (
                      <div key={item._id} className="p-6 flex gap-4">
                        {/* Product Image */}
                        <Link to={`/products/${item.product?._id}`}>
                          <img
                            src={item.product?.imageUrl}
                            alt={item.product?.name}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        </Link>

                        {/* Product Info */}
                        <div className="flex-1">
                          <Link
                            to={`/products/${item.product?._id}`}
                            className="text-lg font-semibold text-gray-900 hover:text-primary-600"
                          >
                            {item.product?.name}
                          </Link>
                          <p className="text-sm text-gray-600 mt-1">
                            ${item.product?.price} each
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3 mt-4">
                            <button
                              onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                              disabled={updating[item._id]}
                              className="w-8 h-8 rounded border-2 border-gray-300 hover:border-primary-500 flex items-center justify-center font-semibold"
                            >
                              -
                            </button>
                            <span className="w-12 text-center font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                              disabled={updating[item._id] || item.quantity >= (item.product?.stock || 0)}
                              className="w-8 h-8 rounded border-2 border-gray-300 hover:border-primary-500 flex items-center justify-center font-semibold disabled:opacity-50"
                            >
                              +
                            </button>
                            <button
                              onClick={() => handleRemove(item._id)}
                              className="ml-4 text-sm text-red-600 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            ${(item.product?.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  to="/products"
                  className="inline-block mt-4 text-primary-600 hover:text-primary-700 font-medium"
                >
                  ← Continue Shopping
                </Link>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span>
                        {calculateSubtotal() > 50 ? (
                          <span className="text-green-600 font-medium">FREE</span>
                        ) : (
                          '$10.00'
                        )}
                      </span>
                    </div>
                    {calculateSubtotal() <= 50 && (
                      <p className="text-sm text-gray-500">
                        Add ${(50 - calculateSubtotal()).toFixed(2)} more for free shipping!
                      </p>
                    )}
                  </div>

                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary-600">${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/checkout')}
                    className="w-full btn-primary mb-3"
                  >
                    Proceed to Checkout
                  </button>

                  <div className="text-center text-sm text-gray-500">
                    <p>🔒 Secure Checkout</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
