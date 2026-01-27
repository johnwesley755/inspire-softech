import LoginForm from '../components/auth/LoginForm';
import { ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 to-indigo-900/90 mix-blend-multiply z-10" />
        <img 
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop" 
          alt="Login Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-between p-12 text-white">
          <div>
            <div className="w-12 h-12 bg-white/10 backdrop-blur-lg rounded-xl flex items-center justify-center border border-white/20 shadow-xl">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="max-w-md">
            <h1 className="text-5xl font-display font-bold mb-6 leading-tight">
              Discover the <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-indigo-200">Extraordinary</span>
            </h1>
            <p className="text-lg text-purple-100/80 leading-relaxed font-light">
              Join our global community of shoppers and sellers. Experience the future of commerce with seamless transactions and premium discovery.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white relative">
        <div className="w-full max-w-md">
           <div className="lg:hidden mb-12 flex justify-center">
             <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
                <ShoppingBag className="w-6 h-6" />
             </div>
           </div>
           <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
