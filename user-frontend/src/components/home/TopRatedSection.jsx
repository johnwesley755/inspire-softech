import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../services/api';
import { Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const TopRatedSection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
             try {
                 console.log('Fetching products for New Arrivals...');
                 const { data } = await axios.get('/products');
                 console.log('API Response:', data);
                 // Backend returns { products: [...] } not just an array
                 const productList = data.products || data || [];
                 console.log('Products received:', productList);
                 setProducts(productList.slice(0, 4)); 
             } catch (error) {
                 console.error("Error fetching products:", error);
                 console.error("Error details:", error.response?.data || error.message);
             } finally {
                 setLoading(false);
             }
        };
        fetchProducts();
    }, []);

    const handleAddToCart = async (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!user) {
            navigate('/login?redirect=/cart');
            return;
        }

        try {
            await addToCart(product._id, 1);
            // Optional: Show success message
        } catch (error) {
            console.error('Failed to add to cart:', error);
        }
    };

    // Show loading state
    if(loading) {
        return (
            <section className="py-32 bg-white relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="flex justify-between items-end mb-16">
                        <div>
                            <h2 className="text-4xl md:text-6xl font-display font-bold text-black mb-4 tracking-tighter">New Arrivals</h2>
                            <div className="h-1 w-20 bg-black rounded-full" />
                        </div>
                    </div>
                    <div className="text-center text-gray-400 py-20">Loading products...</div>
                </div>
            </section>
        );
    }

    // Show empty state if no products
    if(products.length === 0) {
        return (
            <section className="py-32 bg-white relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="flex justify-between items-end mb-16">
                        <div>
                            <h2 className="text-4xl md:text-6xl font-display font-bold text-black mb-4 tracking-tighter">New Arrivals</h2>
                            <div className="h-1 w-20 bg-black rounded-full" />
                        </div>
                    </div>
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg mb-4">No products available yet.</p>
                        <p className="text-gray-500 text-sm">Check back soon for new arrivals!</p>
                    </div>
                </div>
            </section>
        );
    }

  return (
    <section className="py-32 bg-white relative overflow-hidden">
       {/* Background Decoration */}
       <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gray-100 rounded-full blur-[100px] pointer-events-none" />

       <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
             <div>
                <h2 className="text-4xl md:text-6xl font-display font-bold text-black mb-4 tracking-tighter">New Arrivals</h2>
                <div className="h-1 w-20 bg-black rounded-full" />
             </div>
             <Link to="/products" className="hidden md:inline-flex px-8 py-3 border border-gray-200 rounded-full text-black font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all hover:scale-105">
                View All Collection
             </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             {products.map((product) => (
                 <Link 
                    key={product._id} 
                    to={`/products/${product._id}`}
                    className="group cursor-pointer block"
                  >
                    <div className="relative h-[400px] rounded-[2rem] overflow-hidden bg-gray-100 mb-6">
                        {product.imageUrl ? (
                          <img 
                             src={product.imageUrl} 
                             alt={product.name}
                             className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                             onError={(e) => {
                                e.target.style.display = 'none';
                             }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <p className="text-gray-400 text-sm">No Image</p>
                          </div>
                        )}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                           <Star className="w-3 h-3 text-black fill-current" />
                           <span className="text-xs font-bold text-black">4.9</span>
                        </div>
                    </div>
                    <div>
                       <p className="text-xs text-gray-400 uppercase tracking-widest mb-2 truncate">{product.category?.name || 'Fashion'}</p>
                       <h3 className="text-xl font-display font-bold text-black mb-2 truncate group-hover:underline decoration-1 underline-offset-4">{product.name}</h3>
                       <div className="flex justify-between items-center mt-2">
                          <span className="text-lg font-medium text-black">${product.price}</span>
                          <button 
                            onClick={(e) => handleAddToCart(e, product)}
                            className="text-xs uppercase font-bold tracking-widest border-b border-black pb-1 hover:text-gray-600 transition-colors"
                          >
                             Add to Cart
                          </button>
                       </div>
                    </div>
                  </Link>
             ))}
          </div>
       </div>
    </section>
  );
};

export default TopRatedSection;
