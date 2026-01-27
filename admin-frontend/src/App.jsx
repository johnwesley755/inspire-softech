import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ProductForm from './pages/ProductForm';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import SellerRegistration from './pages/SellerRegistration';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/seller-registration" element={
              <ProtectedRoute>
                <SellerRegistration />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute requireSeller={true}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/products" element={
              <ProtectedRoute requireSeller={true}>
                <Products />
              </ProtectedRoute>
            } />
            <Route path="/products/new" element={
              <ProtectedRoute requireSeller={true}>
                <ProductForm />
              </ProtectedRoute>
            } />
            <Route path="/products/edit/:id" element={
              <ProtectedRoute requireSeller={true}>
                <ProductForm />
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute requireSeller={true}>
                <Orders />
              </ProtectedRoute>
            } />
            <Route path="/orders/:id" element={
              <ProtectedRoute requireSeller={true}>
                <OrderDetail />
              </ProtectedRoute>
            } />
            <Route path="/" element={
              <ProtectedRoute requireSeller={true}>
                <Dashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
