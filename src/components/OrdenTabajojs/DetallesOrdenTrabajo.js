import React from "react";
import { Table, Button, Card, Dropdown, Menu } from "antd";
import {RightCircleTwoTone, FileTextTwoTone, FilePdfTwoTone, MailTwoTone } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./cssOrdenTrabajo/DetallesOrdenTrabajo.css"; // Asegúrate de importar el archivo CSS

const DetalleOrdenTrabajo = () => {
  const datosInformacion = {
    cliente: "ESCUELA KEMPER URGATE",
    receptor: "Daniela Alvarez Zacarias | developer1",
    direccion: "de las ballestas, No.42501, Col. Centro industrial Florido, Tijuana, Baja California, C.P. 42501",
    estado: "Pendiente",
    comentarios: "",
  };

  const datosServicios = [
    {
      key: "1",
      servicio: "A futuro a disposi",
      metodo: "NOM-015-STPS-2001",
      cantidad: 2,
      precio: 20.0,
      notas: "",
    },
  ];

  const columnasServicios = [
    {
      title: "Nombre del servicio",
      dataIndex: "servicio",
      key: "servicio",
    },
    {
      title: "Método",
      dataIndex: "metodo",
      key: "metodo",
    },
    {
      title: "Cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
    },
    {
      title: "Precio",
      dataIndex: "precio",
      key: "precio",
    },
    {
      title: "Notas",
      dataIndex: "notas",
      key: "notas",
    },
  ];

  const menu = (
    <Menu>
      <Link to="/detalles_cotizaciones">
        <Menu.Item key="1" icon={<span><RightCircleTwoTone /></span>}>
          Ir a cotización
        </Menu.Item>
      </Link>
      <Link to="/CrearFactura">
        <Menu.Item key="2" icon={<span><FileTextTwoTone /></span>}>
          detalles de Facturar
        </Menu.Item>
      </Link>
      <Menu.Item key="3" icon={<span><FilePdfTwoTone /></span>}>
        Ver PDF
      </Menu.Item>
      <Menu.Item key="4" icon={<span><MailTwoTone /></span>}>
        Enviar Orden de Trabajo
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="container">
      <h1 className="page-title">Detalles de la Orden de Trabajo: 250114-02</h1>
      <div className="button-container">
        <Dropdown overlay={menu} placement="bottomRight" arrow>
          <Button type="primary" className="action-button">
            Acciones para orden de trabajo
          </Button>
        </Dropdown>
      </div>
      <Card className="info-card" title="Información" bordered={false}>
        <p><strong>Cliente:</strong> {datosInformacion.cliente}</p>
        <p><strong>Receptor:</strong> {datosInformacion.receptor}</p>
        <p><strong>Dirección:</strong> {datosInformacion.direccion}</p>
        <p><strong>Estado:</strong> {datosInformacion.estado}</p>
        <p><strong>Comentarios:</strong> {datosInformacion.comentarios}</p>
      </Card>
      <h2 className="concepts-title">Conceptos Asociados</h2>
      <Table
        className="services-table"
        dataSource={datosServicios}
        columns={columnasServicios}
        bordered
        pagination={false}
      />
    </div>
  );
};

export default DetalleOrdenTrabajo;
