import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Login from "./components/Loginjs/Login";
import Home from "./App";
import Empresa from "./components/Empresasjs/Empresa";
import Cliente from "./components/Clientejs/Cliente";
import Servicio from "./components/Serviciosjs/Servicio";
import Cotizar from "./components/Cotizacionesjs/Cotizar";
import GenerarOrden from "./components/OrdenTabajojs/OrdenTrabajo";
import Usuario from "./components/Userjs/Usuario";
import ConfiguracionOrganizacion from "./components/Configuracion/ConfiguracionOrganizacion";
import Factura from "./components/Facturacionjs/Factura";
import Layout from "./components/Layout";
import CrearCotizacion from "./components/Cotizacionesjs/CrearCotizacion";
import DetallesCotizacion from "./components/Cotizacionesjs/DetallesCotiza";
import DetallesOrden from "./components/OrdenTabajojs/DetallesOrdenTrabajo";
import Proyectos from "./components/OrdenTabajojs/ProyectosOrdenTrabajando";
import DetalleOrdenTrabajo from "./components/OrdenTabajojs/DetallesOrdenTrabajo";
import DetallesFactura from "./components/Facturacionjs/DetallesFactura";
import CotizacionEstadistica from "./components/Estadisticas/CotizacionEstadisticas";
import GenerarOrdenTrabajo from "./components/OrdenTabajojs/GenerarOrdenTrabajo";
import EditarCliente from "./components/Clientejs/EditarCliente";
import EditarServicio from "./components/Serviciosjs/EditarServicio";
import EditarUsuario from "./components/Userjs/EditarUsuario";
import CrearFactura from "./components/Facturacionjs/CrearFactura";
import CargarCSD from "./components/CargaCertificadosDijitales/CargarCSD";
import HomeAdmin from "./components/VentanasAdmin/AdminHome";
import RegistroUsuarios from "./components/RegistroUsuario/RegistroUsuarios";

// Hook para cambiar el título de la pestaña
const usePageTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const { pathname } = location;
    let pageTitle = "INADE"; // Título por defecto

    switch (pathname) {
      case "/home":
        pageTitle = "Inicio | INADE";
        break;
      case "/empresa":
        pageTitle = "Empresas | INADE";
        break;
      case "/cliente":
        pageTitle = "Clientes | INADE";
        break;
      case "/servicio":
        pageTitle = "Servicios | INADE";
        break;
      case "/cotizar":
        pageTitle = "Cotizar | INADE";
        break;
      case "/usuario":
        pageTitle = "Usuarios | INADE";
        break;
      case "/configuracionorganizacion":
        pageTitle = "Configuración | INADE";
        break;
      // Agrega más rutas según sea necesario
      default:
        pageTitle = "INADE";
    }

    document.title = pageTitle; // Cambia el título
  }, [location]);
};

// Componente con lógica para cambiar el título
const PageWrapper = ({ children }) => {
  usePageTitle(); // Llama al hook para actualizar el título dinámicamente
  return children;
};

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta para el login sin el Layout */}
        <Route path="/" element={<Login />} />
        <Route path="/RegistroUsuarios" element={<RegistroUsuarios /> }/>
        
        {/* Rutas envueltas con Layout */}
        <Route path="/" element={
            <PageWrapper>
              <Layout />
            </PageWrapper>
          }
        >
          <Route path="/Homeadmin" element={<HomeAdmin/>}/>
          <Route path="/home" element={<Home />} />
          <Route path="/empresa" element={<Empresa />} />
          <Route path="/cliente" element={<Cliente />} />
          <Route path="/servicio" element={<Servicio />} />
          <Route path="/cotizar" element={<Cotizar />} />
          <Route path="/generar_orden" element={<GenerarOrden />} />
          <Route path="/usuario" element={<Usuario />} />
          <Route path="/configuracionorganizacion" element={<ConfiguracionOrganizacion />} />
          <Route path="/factura" element={<Factura />} />
          <Route path="/crear_cotizacion/:clienteId" element={<CrearCotizacion />} />
          <Route path="/detalles_cotizaciones/:id" element={<DetallesCotizacion />} />
          <Route path="/detalles_orden" element={<DetallesOrden />} />
          <Route path="/proyectos" element={<Proyectos />} />
          <Route path="/DetalleOrdenTrabajo/:orderId" element={<DetalleOrdenTrabajo />} />
          <Route path="/detallesfactura" element={<DetallesFactura />} />
          <Route path="/CotizacionEstadisticas" element={<CotizacionEstadistica />} />
          <Route path="/GenerarOrdenTrabajo/:id" element={<GenerarOrdenTrabajo />} />
          <Route path="/EditarCliente/:clienteId" element={<EditarCliente />} />
          <Route path="/EditarServicio" element={<EditarServicio />} />
          <Route path="/EditarUsuario/:id" element={<EditarUsuario />} />
          <Route path="/CrearFactura/:id" element={<CrearFactura/>}/>
          <Route path="/CargaCSD" element={<CargarCSD/>}/>
        </Route>
      </Routes>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);

reportWebVitals();
