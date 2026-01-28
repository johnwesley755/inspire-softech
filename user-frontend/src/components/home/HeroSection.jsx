import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const containerRef = useRef(null);
  const [currentBg, setCurrentBg] = useState(0);

  const heroImages = [
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from(".hero-char", {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.05,
        ease: "power4.out"
      })
      .from(".hero-sub", { opacity: 0, y: 20, duration: 0.8 }, "-=0.5")
      .from(".hero-btn", { opacity: 0, scale: 0.9, duration: 0.8 }, "-=0.6");
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="hero-section relative h-screen w-full overflow-hidden flex flex-col justify-center items-center text-center bg-black">
      {/* Background Carousel */}
      <div className="absolute inset-0 z-0">
        {heroImages.map((img, index) => (
          <div 
             key={index}
             className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentBg === index ? 'opacity-100' : 'opacity-0'}`}
          >
             <img 
               src={img} 
               alt={`Hero ${index}`} 
               className="w-full h-full object-cover object-center grayscale brightness-[0.5]"
             />
          </div>
        ))}
        {/* Gradient Overlay for Depth */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-black/90" />
      </div>
      
      <div className="relative z-10 px-4 max-w-5xl mx-auto text-white">
        <p className="hero-sub font-medium tracking-[0.4em] mb-8 uppercase text-xs md:text-sm text-gray-300 border border-white/20 inline-block px-4 py-1 rounded-full backdrop-blur-sm">
           Noir Collection 2024
        </p>
        <h1 className="text-6xl md:text-9xl font-display font-bold mb-10 tracking-tighter leading-none text-white drop-shadow-2xl">
          {['E', 'L', 'E', 'G', 'A', 'N', 'C', 'E'].map((char, i) => (
            <span key={i} className="inline-block hero-char bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">{char}</span>
          ))}
        </h1>
        <p className="hero-sub text-lg md:text-2xl text-gray-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed tracking-wide">
          Uncompromising luxury. Defined by shadows and light.
        </p>
        <div className="hero-btn flex flex-col sm:flex-row gap-6 justify-center items-center">
           <Link to="/products" className="group px-12 py-5 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all duration-300 uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              Shop Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
           </Link>
           <Link to="/about" className="px-12 py-5 border border-white/30 text-white font-bold rounded-full hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-widest text-sm backdrop-blur-md">
              View Lookbook
           </Link>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
         <ArrowDown className="w-6 h-6" />
      </div>
    </section>
  );
};

export default HeroSection;
