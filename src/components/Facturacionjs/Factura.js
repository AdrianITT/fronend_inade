import React, { useState } from "react";
import { Table, Input, Button } from "antd";
import { Link } from "react-router-dom";

const Factura = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const initialData = [
    {
      key: "1",
      factura: "Cx0FloZIjhc_e1LZQzr8zA2",
      fecha: "14/01/25 00:52",
      cliente: "ESCUELA KEMPER URGATE",
      importe: "$ 59,455.80",
      estado: "active",
    },
    {
      key: "2",
      factura: "ARTVASfjCQORF-y5mYCV6g2",
      fecha: "14/01/25 15:10",
      cliente: "ESCUELA KEMPER URGATE",
      importe: "$ 59,455.80",
      estado: "active",
    },
    {
      key: "3",
      factura: "-GaHf0zgIV1Nq0XyG_VDRA2",
      fecha: "15/01/25 21:02",
      cliente: "ESCUELA KEMPER URGATE",
      importe: "$ 46.40",
      estado: "active",
    },
    {
      key: "4",
      factura: "Sp_VEjPZ5ehjewDPfjKxvg2",
      fecha: "16/01/25 20:18",
      cliente: "ESCUELA KEMPER URGATE",
      importe: "$ 46.40",
      estado: "active",
    },
    {
      key: "5",
      factura: "gEIhSGyFsTIVXZWNAD2-A2",
      fecha: "16/01/25 20:21",
      cliente: "ESCUELA KEMPER URGATE",
      importe: "$ 59,455.80",
      estado: "active",
    },
    {
      key: "6",
      factura: "m8va_xlnhQgp2FTOR94tsQ2",
      fecha: "16/01/25 20:22",
      cliente: "ESCUELA KEMPER URGATE",
      importe: "$ 46.40",
      estado: "active",
    },
    {
      key: "7",
      factura: "WF64UAmams5-FrIZyAPQQ2w2",
      fecha: "16/01/25 20:23",
      cliente: "ESCUELA KEMPER URGATE",
      importe: "$ 46.40",
      estado: "active",
    },
  ];

  const [data, setData] = useState(initialData);

  const handleSearch = () => {
    const filteredData = initialData.filter((item) =>
      item.factura.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setData(filteredData);
  };

  const columns = [
    {
      title: "Factura",
      dataIndex: "factura",
      key: "factura",
      render: (text) => (
          <Button type="link" onClick={() => console.log(`Factura: ${text}`)}>
            {text}
          </Button>
        ),
    },
    {
      title: "Fecha",
      dataIndex: "fecha",
      key: "fecha",
    },
    {
      title: "Cliente",
      dataIndex: "cliente",
      key: "cliente",
    },
    {
      title: "Importe",
      dataIndex: "importe",
      key: "importe",
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
    },
    {
      title: "Opciones",
      key: "opciones",
      render: () => (<Link to="/detallesfactura">
        <Button type="primary" size="small">
          Detalles
        </Button></Link>
      ),
    },
  ];

  return (
    
    <div style={{ padding: "20px" }}>
      <center><h1>Facturas</h1></center>
      <div style={{ marginBottom: "16px", display: "flex", gap: "10px",justifyContent: "center",alignItems: "center"}}>
        <Input
          placeholder="Buscar cotizaciones..."
          style={{ maxWidth: "300px" }}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button type="primary" onClick={handleSearch}>
          Buscar
        </Button>
      </div>
      <Table
        dataSource={data}
        columns={columns}
        bordered
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default Factura;
