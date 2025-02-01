import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import CustomFooter from "./footerjs/Footer";


const Layout = () => {
  return (
    <div id="layout-container">
      <Header />
      <main id="main-content">
        <Outlet /> {/* Renderiza las rutas hijas aquí */}
      </main>
      <CustomFooter />
    </div>
  );
};

export default Layout;
