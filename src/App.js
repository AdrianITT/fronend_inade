import React, { useEffect, useState } from "react";
import "./index.css";
import { Card, Col, Row,Badge, Space, Progress} from "antd";
import { getAllCotizacion } from "./apis/CotizacionApi";

import {
  ReconciliationOutlined,
  SettingOutlined,
  UserAddOutlined,
  AuditOutlined,
  ClearOutlined,
  ShopFilled,
  UsergroupAddOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const App = () => {

  const [countCotizaciones, setCountCotizaciones] = useState(0);
  // Para progress bar y textos
  const [totalCotizaciones, setTotalCotizaciones] = useState(0);
  const [cotizacionesAceptadas, setCotizacionesAceptadas] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        // Llama a tu API de cotizaciones
        const response = await getAllCotizacion();
        const data = response.data || [];

        // Filtrar por estado = 1
        const estadoUno = data.filter((cot) => cot.estado === 1);
        setCountCotizaciones(estadoUno.length);

        // 1) Total de cotizaciones
        const total = data.length;
        setTotalCotizaciones(total);

        // 2) Cotizaciones con estado >= 2
        const aceptadas = data.filter((cot) => cot.estado >= 2).length;
        setCotizacionesAceptadas(aceptadas);
      } catch (error) {
        console.error("Error al obtener las cotizaciones", error);
      }
    };

    fetchCount();
  }, []);

  // Calcula el porcentaje normal
let porcentaje = 0;
if (totalCotizaciones > 0) {
  porcentaje = (cotizacionesAceptadas / totalCotizaciones) * 100;
}

// Si prefieres que sea un número, haz parseFloat:
const porcentajeFinal = parseFloat(porcentaje.toFixed(2));

  return (
    <div className="App">
      <div className="justi-card">{/* Barra de carga */}
        <Card className="custom-card-bar">
      <div className="progress-bar-container">
          <Progress percent={porcentajeFinal} status="active" />
      </div>
      <div className="text-container">
          <p>Total de cotizaciones: {totalCotizaciones}</p>
          <p>Cotizaciones Aceptadas: {cotizacionesAceptadas}</p>
      </div>
      </Card>
      </div>
      {/* Opciones de body */}
      <div className="contencenter"><br></br>
      <Space>
        <Row gutter={[24, 24]} justify="center">
          <Col xs={24} sm={12} md={8} lg={6} xl={4} className="col-style">
          <div>
            <Link to="/empresa">
              <Card className="card-custom" title="Empresa" bordered={false}>
                <div className="icon-container">
                  <ShopFilled/>
                </div>
              </Card>
            </Link>
          </div>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} xl={4} className="col-style">
          <div>
            <Link to="/cliente">
              <Card className="card-custom" title="Cliente" bordered={false}>
                <div className="icon-container">
                  <UserAddOutlined />
                </div>
              </Card>
            </Link>
          </div>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} xl={4} className="col-style">
          <div>
            <Link to="/servicio">
              <Card className="card-custom" title="Servicio" bordered={false}>
                <div className="icon-container">
                  <ClearOutlined />
                </div>
              </Card>
            </Link>
          </div>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} xl={4} className="col-style">
          <div>
            <Link to="/cotizar">
              <Card className="card-custom" title="Cotizar" bordered={false}>
                <div className="badge-container"><Badge count={countCotizaciones} />
                  </div>
                <div className="icon-container">
                  <EditOutlined />
                </div>
              </Card>
            </Link>
          </div>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} xl={4} className="col-style">
          <div>
            <Link to="/generar_orden">
              <Card className="card-custom" title="Generar Orden de Trabajo" bordered={false}>
                <div className="icon-container">
                  <ReconciliationOutlined />
                </div>
              </Card>
            </Link>
          </div>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} xl={4} className="col-style">
          <div>
            <Link to="/usuario">
              <Card className="card-custom" title="Usuario" bordered={false}>
                <div className="icon-container">
                  <UsergroupAddOutlined />
                </div>
              </Card>
            </Link>
          </div>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} xl={4} className="col-style">
          <div>
            <Link to="/configuracionorganizacion">
              <Card
                className="card-custom"
                title="Configuración de la organización"
                bordered={false}
              >
                <div className="icon-container">
                  <SettingOutlined />
                </div>
              </Card>
            </Link>
          </div>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} xl={4} className="col-style">
          <div>
            <Link to="/factura">
              <Card className="card-custom" title="Facturas" bordered={false}>
                <div className="icon-container">
                  <AuditOutlined />
                </div>
              </Card>
            </Link>
          </div>
          </Col>
        </Row>
      </Space>
      </div>
    </div>
  );
};

export default App;
