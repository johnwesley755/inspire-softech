import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import axios from '../../services/api';

gsap.registerPlugin(ScrollTrigger);

const TrendingSection = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        console.log('Fetching trending products...');
        // Changed to /products to get all products, not just featured ones
        const { data } = await axios.get('/products');
        console.log('Trending API Response:', data);
        // Handle both array and object responses
        const productList = data.products || data || [];
        console.log('Trending products received:', productList);
        if (productList && productList.length > 0) {
           // Show 12 products instead of default
           setProducts(productList.slice(0, 12));
        }
      } catch (error) {
        console.error("Error fetching trending products:", error);
        console.error("Error details:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  useEffect(() => {
    if (!loading && products.length > 0) {
      ScrollTrigger.refresh();
      
      let ctx = gsap.context(() => {
        const section = sectionRef.current;
        const track = trackRef.current;
        const items = gsap.utils.toArray('.trending-item');
        
        if (items.length > 1) {
          // Calculate exact scroll distance
          const scrollWidth = track.scrollWidth;
          const viewportWidth = window.innerWidth;
          const scrollDistance = scrollWidth - viewportWidth;
          
          gsap.to(track, {
            x: -scrollDistance,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              pin: true,
              scrub: 0.5,
              end: () => `+=${scrollDistance}`,
              invalidateOnRefresh: true,
            }
          });
        }
      }, sectionRef);
      
      return () => ctx.revert();
    }
  }, [loading, products]);
  
  // Strict: No products = No section
  if (loading) return null;
  if (products.length === 0) return null; 

  return (
    <section ref={sectionRef} className="bg-black text-white overflow-hidden h-screen flex flex-col justify-center relative">
      {/* Background Gradient & Noise */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black z-0" />
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      <div className="container mx-auto px-6 mb-8 relative z-10">
         <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-6">
            <div>
               <h2 className="text-5xl md:text-8xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-GOLD via-white to-accent-GOLD bg-[length:200%_auto] animate-gradient">
                  TRENDING
               </h2>
               <p className="text-gray-400 mt-2 tracking-[0.2em] uppercase text-sm">Curated favorites of the season</p>
            </div>
            <div className="hidden md:block text-xs text-accent-GOLD uppercase tracking-[0.3em] font-bold animate-pulse">
               Scroll to explore &rarr;
            </div>
         </div>
      </div>

      <div ref={trackRef} className="flex gap-12 px-6 md:px-20 w-fit relative z-10">
        {products.map((product, i) => (
          <div key={product._id} className="trending-item min-w-[320px] md:min-w-[480px] relative group cursor-pointer perspective-1000">
            <div className="h-[450px] md:h-[650px] overflow-hidden relative rounded-[3rem] border border-white/10 shadow-2xl transition-transform duration-500 group-hover:-translate-y-4">
               {/* Badge */}
              <span className="absolute top-6 left-6 z-20 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">
                Featured
              </span>
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <p className="text-gray-500 text-sm">No Image</p>
                </div>
              )}
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary-950/90 via-primary-950/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
              
              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-3xl font-display font-bold text-white mb-2">{product.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-light text-accent-GOLD">${product.price}</span>
                    <Link 
                      to={`/products/${product._id}`}
                      className="w-12 h-12 rounded-full bg-white text-primary-950 flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300 hover:bg-accent-GOLD hover:text-white"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </Link>
                  </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendingSection;
