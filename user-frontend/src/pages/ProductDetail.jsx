import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../components/common/Loader';
import { useCart } from '../context/CartContext';
import api from '../services/api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${id}`);
      setProduct(response.data.product);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      setAdding(true);
      await addToCart(product._id, quantity);
      // Show success message or redirect to cart
      navigate('/cart');
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <Loader size="large" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error || 'Product not found'}</p>
          <button onClick={() => navigate('/products')} className="btn-primary">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 bg-gray-50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <button
              onClick={() => navigate('/products')}
              className="text-primary-600 hover:text-primary-700 flex items-center gap-2"
            >
              ← Back to Products
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Product Image */}
              <div className="relative">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
                {product.featured && (
                  <span className="absolute top-4 right-4 bg-primary-600 text-white text-sm font-bold px-4 py-2 rounded-full">
                    Featured
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="flex flex-col">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {product.category?.name || 'Uncategorized'}
                  </span>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>

                <div className="mb-6">
                  <p className="text-4xl font-bold text-primary-600">
                    ${product.price}
                  </p>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Seller Information */}
                {product.seller && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Seller Information</h3>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Business Name:</span>
                        <span className="text-sm font-medium text-primary-600">
                          {product.seller.businessName || 'Platform Store'}
                        </span>
                      </div>
                      {product.seller.businessEmail && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Contact:</span>
                          <span className="text-sm text-gray-700">
                            {product.seller.businessEmail}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Stock Status */}
                <div className="mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Availability:</span>
                    {product.stock > 0 ? (
                      <span className="text-sm text-green-600 font-medium">
                        In Stock ({product.stock} available)
                      </span>
                    ) : (
                      <span className="text-sm text-red-600 font-medium">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Selector */}
                {product.stock > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-primary-500 flex items-center justify-center font-semibold"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                        className="w-20 text-center border-2 border-gray-300 rounded-lg py-2 font-semibold"
                        min="1"
                        max={product.stock}
                      />
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-primary-500 flex items-center justify-center font-semibold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {/* Add to Cart Button */}
                <div className="flex gap-4 mt-auto">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0 || adding}
                    className={`flex-1 py-3 rounded-lg font-semibold transition ${
                      product.stock === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    }`}
                  >
                    {adding ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                  <button
                    onClick={() => navigate('/products')}
                    className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:border-primary-500 hover:text-primary-600 transition"
                  >
                    Continue Shopping
                  </button>
                </div>

                {/* Additional Info */}
                <div className="mt-8 pt-8 border-t">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🚚</span>
                      <span className="text-gray-600">Free Shipping</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">↩️</span>
                      <span className="text-gray-600">Easy Returns</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">✅</span>
                      <span className="text-gray-600">Quality Guaranteed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🔒</span>
                      <span className="text-gray-600">Secure Payment</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
  );
};

export default ProductDetail;
