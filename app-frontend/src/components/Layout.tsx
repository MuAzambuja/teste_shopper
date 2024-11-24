import Header from './Header';
import Footer from './Footer';
import '../styles/Layout.css';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="layout-container">
      <Header />
      <div className="content">
        <Outlet /> {/* O conteúdo da página será renderizado aqui */}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
