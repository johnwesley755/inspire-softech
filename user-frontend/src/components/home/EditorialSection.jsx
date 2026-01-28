import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const EditorialSection = () => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
       // Parallax for the images
       gsap.to(".editorial-img-1", {
          yPercent: -20,
          ease: "none",
          scrollTrigger: {
             trigger: containerRef.current,
             start: "top bottom",
             end: "bottom top",
             scrub: 1
          }
       });
       
       // Text Reveal
       gsap.from(".editorial-content > *", {
          y: 50,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          scrollTrigger: {
             trigger: ".editorial-content",
             start: "top 70%"
          }
       });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="py-32 bg-black text-white relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
           <div className="w-full lg:w-1/2">
              <div ref={imageRef} className="relative h-[600px] md:h-[800px] w-full overflow-hidden rounded-[2rem]">
                 <img 
                   src="https://images.unsplash.com/photo-1509631179647-0177f4547d4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                   alt="Editorial" 
                   className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                 />
                 <div className="absolute inset-0 bg-black/20" />
              </div>
           </div>
           
           <div ref={textRef} className="w-full lg:w-1/2 lg:pl-16">
              <p className="text-sm font-bold tracking-[0.3em] uppercase text-gray-400 mb-6">The Philosophy</p>
              <h2 className="text-5xl md:text-7xl font-display font-bold mb-8 leading-tight">
                 Beauty in <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-white">Monochrome.</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-xl">
                 We believe in the power of simplicity. Stripping away the unnecessary to reveal the essential. Our collection is a tribute to the timeless elegance of black and white.
              </p>
              <Link to="/about" className="inline-block px-12 py-4 border border-white rounded-full font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300">
                 Read Our Story
              </Link>
           </div>
        </div>
      </div>
    </section>
  );
};

export default EditorialSection;
