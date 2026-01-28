import { Link } from 'react-router-dom';

const CategoryGrid = () => {
  return (
    <section className="py-24 bg-white px-4">
      <div className="container mx-auto">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-16 text-gray-900">Shop by Category</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[900px]">
           {/* Men's - Large - Left */}
           <div className="md:col-span-6 md:row-span-2 relative group overflow-hidden cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1488161628813-99c974c4ce76?ixlib=rb-4.0.3&w=800&q=80" 
                alt="Men" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
              <div className="absolute bottom-10 left-10 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                 <p className="text-sm font-bold uppercase tracking-widest mb-2">Collection</p>
                 <h3 className="text-4xl md:text-6xl font-display font-bold mb-4">Men</h3>
                 <Link to="/products?category=men" className="inline-block border-b-2 border-white pb-1 hover:text-gray-300 hover:border-gray-300 transition-colors">Explore</Link>
              </div>
           </div>

           {/* Women's - Medium - Right Top */}
           <div className="md:col-span-6 md:row-span-1 relative group overflow-hidden cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&w=800&q=80" 
                alt="Women" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
               <div className="absolute bottom-10 left-10 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                 <h3 className="text-3xl md:text-5xl font-display font-bold mb-2">Women</h3>
                 <Link to="/products?category=women" className="text-sm font-bold uppercase tracking-widest hover:text-gray-300 transition-colors">Shop Now &rarr;</Link>
              </div>
           </div>

           {/* Accessories - Small - Right Bottom Left */}
           <div className="md:col-span-3 md:row-span-1 relative group overflow-hidden cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1523293188086-b5eda2d47079?ixlib=rb-4.0.3&w=800&q=80" 
                alt="Accessories" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
              <div className="absolute bottom-6 left-6 text-white">
                 <h3 className="text-2xl font-display font-bold">Accessories</h3>
              </div>
           </div>

           {/* Footwear - Small - Right Bottom Right */}
           <div className="md:col-span-3 md:row-span-1 relative group overflow-hidden cursor-pointer">
               <img 
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&w=800&q=80" 
                alt="Footwear" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
               <div className="absolute bottom-6 left-6 text-white">
                 <h3 className="text-2xl font-display font-bold">Footwear</h3>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
