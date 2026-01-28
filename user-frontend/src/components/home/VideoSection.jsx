import { useRef, useEffect } from 'react';
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const VideoSection = () => {
    const videoRef = useRef(null);

    useEffect(() => {
        if(videoRef.current) {
            videoRef.current.playbackRate = 0.8; // Slow motion effect
        }
    }, []);

  return (
    <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-black">
      <video 
        ref={videoRef}
        autoPlay 
        loop 
        muted 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      >
        <source src="https://assets.mixkit.co/videos/preview/mixkit-fashion-model-posing-in-neon-lights-39893-large.mp4" type="video/mp4" />
      </video>
      
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
         <div className="mb-8 scale-0 animate-fade-in flex justify-center">
             <button className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 hover:bg-white/20 transition-all hover:scale-110">
                <Play className="w-8 h-8 fill-white ml-1" />
             </button>
         </div>
         <h2 className="text-5xl md:text-8xl font-display font-bold mb-6 tracking-tighter">
            Behind the Scenes
         </h2>
         <p className="text-xl md:text-2xl text-gray-200 mb-10 font-light">
            Witness the craftsmanship and passion that goes into every piece.
         </p>
         <Link to="/about" className="inline-block px-8 py-3 bg-white text-black font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors">
            Watch Full Film
         </Link>
      </div>
    </section>
  );
};

export default VideoSection;
