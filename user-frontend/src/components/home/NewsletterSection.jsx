import { ArrowRight } from 'lucide-react';

const NewsletterSection = () => {
  return (
    <section className="py-24 bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-6 text-center max-w-3xl">
         <h2 className="text-3xl md:text-5xl font-display font-bold text-black mb-6 tracking-tight">Join the Inner Circle</h2>
         <p className="text-gray-500 mb-10 text-lg">Subscribe to receive exclusive access to new drops and private sales.</p>
         
         <form className="flex flex-col md:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-1 px-6 py-4 bg-white border border-gray-200 rounded-full focus:border-black focus:ring-0 outline-none transition-all text-black placeholder-gray-400"
            />
            <button 
              type="submit" 
              className="px-8 py-4 bg-black text-white font-bold rounded-full uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              Subscribe <ArrowRight className="w-4 h-4" />
            </button>
         </form>
         <p className="mt-4 text-xs text-gray-400 uppercase tracking-widest">No spam, just style.</p>
      </div>
    </section>
  );
};

export default NewsletterSection;
