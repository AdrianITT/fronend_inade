import React from "react";
import { Card, Table, Typography, Row, Col } from "antd";

const { Title, Text } = Typography;

const summaryData = [
  {
    key: "1",
    cliente: "Daniela",
    valorTotal: "$392.08",
    cotizacionesEmitidas: 4,
  },
];

const temporalData = [
  {
    key: "1",
    mes: "1/2025",
    cotizacionesEmitidas: 4,
  },
];

const columnsClientes = [
  {
    title: "Cliente",
    dataIndex: "cliente",
    key: "cliente",
  },
  {
    title: "Valor Total de Cotizaciones",
    dataIndex: "valorTotal",
    key: "valorTotal",
  },
  {
    title: "Número de Cotizaciones Emitidas",
    dataIndex: "cotizacionesEmitidas",
    key: "cotizacionesEmitidas",
  },
];

const columnsTemporales = [
  {
    title: "Mes/Año",
    dataIndex: "mes",
    key: "mes",
  },
  {
    title: "Número de Cotizaciones Emitidas",
    dataIndex: "cotizacionesEmitidas",
    key: "cotizacionesEmitidas",
  },
];

const CotizacionEstadistica = () => {
  return (
    <div>
      <Row gutter={16} style={{ marginBottom: "20px" }}>
        <Col xs={24} sm={12}>
          <Card title="Resumen General" bordered style={{ background: "#e6f7ff" }}>
            <Text>
              <b>Número Total de Cotizaciones Emitidas:</b> 4
            </Text>
            <br />
            <Text>
              <b>Valor Total de las Cotizaciones Emitidas:</b> $392.08
            </Text>
            <br />
            <Text>
              <b>Promedio de Valor por Cotización:</b> $98.02
            </Text>
            <br />
            <Text>
              <b>Tiempo Promedio de Respuesta a una Cotización:</b> 31 días
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card title="Estadísticas de Éxito" bordered style={{ background: "#f6ffed" }}>
            <Text>
              <b>Tasa de Aceptación de Cotizaciones:</b> 100.0%
            </Text>
            <br />
            <Text>
              <b>Tasa de Rechazo de Cotizaciones:</b> 0.0%
            </Text>
            <br />
            <Text>
              <b>Tiempo Promedio para Cerrar una Cotización:</b> 31 días
            </Text>
          </Card>
        </Col>
      </Row>

      <Title level={3} style={{ textAlign: "center", marginTop: "20px" }}>
        Estadísticas por Cliente
      </Title>
      <Table
        columns={columnsClientes}
        dataSource={summaryData}
        pagination={false}
        bordered
        style={{ marginBottom: "40px" }}
      />

      <Title level={3} style={{ textAlign: "center", marginTop: "20px" }}>
        Estadísticas Temporales
      </Title>
      <Table
        columns={columnsTemporales}
        dataSource={temporalData}
        pagination={false}
        bordered
      />
    </div>
  );
};

export default CotizacionEstadistica;
