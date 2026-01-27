import { Outlet, useLocation } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';

const Layout = () => {
  const location = useLocation();
  
  // Routes where Header and Footer should NOT appear
  const excludeRoutes = ['/login', '/register'];
  const shouldExclude = excludeRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {!shouldExclude && <Header />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!shouldExclude && <Footer />}
    </div>
  );
};

export default Layout;
