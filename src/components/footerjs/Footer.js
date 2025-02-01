import React from "react";
import { Layout } from "antd";
import "./footer.css";

const { Footer } = Layout;

const CustomFooter = () => {
  return (
    <Footer className="custom-footer">
      <div>
           © 2025 INADE.mx <span style={{ color: "green" }}>Servicios ambientales</span>
      </div>
      <div>Ingeniería y Administración Estratégica, S.A. de C.V.</div>
    </Footer>
  );
};

export default CustomFooter;