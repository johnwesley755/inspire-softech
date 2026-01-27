import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Truck, Zap } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const heroRef = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef(null);
  const featureRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Animation
      const tl = gsap.timeline();

      tl.from(textRef.current.querySelectorAll('.hero-text'), {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power4.out',
      })
      .from(imageRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
      }, '-=0.8');

      // Parallax Effect on Hero Image
      gsap.to(imageRef.current, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Features Stagger Animation
      gsap.from(featureRef.current.children, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: featureRef.current,
          start: 'top 80%',
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[95vh] flex items-center overflow-hidden bg-slate-50">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-200/30 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-200/30 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div ref={textRef} className="space-y-8">
              <div className="hero-text inline-flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 rounded-full shadow-sm">
                <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                <span className="text-xs font-semibold text-gray-900 tracking-wide uppercase">New Collection 2024</span>
              </div>
              
              <h1 className="hero-text text-6xl md:text-8xl font-display font-bold text-gray-900 leading-[0.9] tracking-tight">
                Redefine <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">
                  Your Style.
                </span>
              </h1>
              
              <p className="hero-text text-xl text-gray-500 max-w-lg leading-relaxed">
                Experience the perfect blend of premium quality and modern aesthetics. curated for those who dare to stand out.
              </p>
              
              <div className="hero-text flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="group px-8 py-4 bg-gray-900 text-white rounded-full font-bold transition-all hover:bg-primary-600 hover:scale-105 flex items-center gap-2"
                >
                  Shop Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/products?featured=true"
                  className="px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-full font-bold hover:bg-gray-50 transition-all flex items-center gap-2"
                >
                  View Featured
                </Link>
              </div>

              <div className="hero-text flex items-center gap-8 pt-8 border-t border-gray-200">
                <div>
                  <p className="text-3xl font-bold text-gray-900">15k+</p>
                  <p className="text-sm text-gray-500">Active Users</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">4.9</p>
                  <p className="text-sm text-gray-500">Customer Rating</p>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block h-[800px]">
              <div ref={imageRef} className="relative z-10 w-full h-full">
                 <div className="absolute inset-0 bg-gradient-to-tr from-primary-100 to-transparent rounded-[3rem] transform rotate-3 scale-95 opacity-50 translate-y-4" />
                 <img 
                   src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                   alt="Fashion Model" 
                   className="w-full h-full object-cover rounded-[3rem] shadow-2xl relative z-10"
                 />
                 
                 {/* Floating Card */}
                 <div className="absolute bottom-20 -left-12 z-20 bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/40 max-w-xs">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">Trending Now</p>
                        <p className="text-xs text-gray-500">Fast Selling Items</p>
                      </div>
                    </div>
                    <div className="flex -space-x-3">
                      {[1,2,3].map(i => (
                         <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white" /> 
                      ))}
                      <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs border-2 border-white">+2k</div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Section (Improvised) */}
      <section className="py-12 border-y border-gray-100 bg-white overflow-hidden">
        <div className="flex gap-16 animate-marquee whitespace-nowrap opacity-40">
           {Array(10).fill("PREMIUM QUALITY • FREE SHIPPING • SECURE PAYMENT • ").map((text, i) => (
             <span key={i} className="text-4xl font-display font-bold text-gray-900">{text}</span>
           ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-sm font-bold text-primary-600 tracking-widest uppercase mb-3">Why Choose Us</h2>
            <h3 className="text-4xl font-display font-bold text-gray-900">Elevating the standard of <br />online shopping.</h3>
          </div>

          <div ref={featureRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: Truck, 
                title: 'Global Shipping', 
                desc: 'Fast and reliable delivery to over 100 countries worldwide.' 
              },
              { 
                icon: Shield, 
                title: 'Secure Payments', 
                desc: 'Your security is our priority. Encrypted transactions every time.' 
              },
              { 
                icon: Star, 
                title: 'Premium Quality', 
                desc: 'Handpicked items that meet our rigorous quality standards.' 
              }
            ].map((feature, idx) => (
              <div key={idx} className="group p-10 rounded-3xl bg-gray-50 hover:bg-gray-900 transition-colors duration-500">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-gray-800 transition-colors">
                  <feature.icon className="w-7 h-7 text-gray-900 group-hover:text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-white">{feature.title}</h4>
                <p className="text-gray-500 group-hover:text-gray-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories / Visual Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[600px]">
              <div className="relative group overflow-hidden rounded-[2rem]">
                 <img 
                   src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                   alt="Collection 1" 
                   className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                 />
                 <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                 <div className="absolute bottom-10 left-10 text-white">
                    <p className="text-sm font-bold uppercase tracking-widest mb-2">New Season</p>
                    <h3 className="text-4xl font-display font-bold">Accessories</h3>
                 </div>
              </div>
              <div className="grid grid-rows-2 gap-8">
                <div className="relative group overflow-hidden rounded-[2rem]">
                   <img 
                     src="https://images.unsplash.com/photo-1485230947976-51e27e3de1da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                     alt="Collection 2" 
                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                   />
                   <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                   <div className="absolute bottom-8 left-8 text-white">
                      <h3 className="text-2xl font-display font-bold">Footwear</h3>
                   </div>
                </div>
                <div className="relative group overflow-hidden rounded-[2rem]">
                   <img 
                     src="https://images.unsplash.com/photo-1529139574466-a302d27f60d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                     alt="Collection 3" 
                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                   />
                   <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                   <div className="absolute bottom-8 left-8 text-white">
                      <h3 className="text-2xl font-display font-bold">Electronics</h3>
                   </div>
                </div>
              </div>
           </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-display font-bold text-white mb-8 tracking-tight">Ready to start?</h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Join thousands of satisfied shoppers. Sign up today and get exclusive access to our newest collections.
          </p>
          <Link
             to="/register"
             className="inline-flex h-16 items-center justify-center px-10 font-bold text-gray-900 transition-all duration-200 bg-white rounded-full hover:bg-gray-100 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
          >
             Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
