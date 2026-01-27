import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Star } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      setAdding(true);
      await addToCart(product._id, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setAdding(false);
    }
  };

  return (
    <Link to={`/products/${product._id}`} className="block">
      <motion.div 
        whileHover={{ y: -8 }}
        className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative"
      >
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          
          {/* Overlays */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.featured && (
              <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm border border-white/50">
                Featured
              </span>
            )}
            {product.stock === 0 && (
              <span className="bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                Out of Stock
              </span>
            )}
          </div>

          {/* Quick Actions (Slide Up) */}
          <div className="absolute inset-x-4 bottom-4 translate-y-[120%] group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || adding}
              className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg ${
                product.stock === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-900 hover:bg-primary-600 hover:text-white transition-colors'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              {adding ? 'Adding...' : product.stock === 0 ? 'Unavailable' : 'Add to Cart'}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Seller / Subtitle */}
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {product.seller?.businessName || 'ShopHub Store'}
            </p>
            {product.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-bold text-gray-700">{product.rating}</span>
              </div>
            )}
          </div>

          <h3 className="font-display font-bold text-gray-900 text-lg mb-2 leading-tight group-hover:text-primary-600 transition-colors line-clamp-1">
            {product.name}
          </h3>

          <div className="flex items-center justify-between mt-4">
            <span className="text-xl font-bold text-gray-900">
              ${parseFloat(product.price).toFixed(2)}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;
