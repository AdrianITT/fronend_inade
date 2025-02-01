import React, { useState } from "react";
import { Table, Input, Button } from "antd";
import { Link } from "react-router-dom";
import "./cssOrdenTrabajo/Generarorden.css";

const Generarorden = () => {
  const initialData = [
    {
      key: "1",
      id: "250114-02",
      cotizacion: "0002",
      cliente: "ESCUELA KEMPER URGATE",
      recibe: "Daniela Alvarez Zacarias",
      estado: "Pendiente",
      vigencia: "14 de Febrero de 2025",
    },
    {
      key: "2",
      id: "250114-01",
      cotizacion: "0001",
      cliente: "ESCUELA KEMPER URGATE",
      recibe: "Daniela Alvarez Zacarias",
      estado: "Pendiente",
      vigencia: "13 de Febrero de 2025",
    },
  ];

  const [filteredData, setFilteredData] = useState(initialData); // Estado para filtrar la tabla
  const [searchText, setSearchText] = useState(""); // Texto de búsqueda

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Cotización", dataIndex: "cotizacion", key: "cotizacion" },
    { title: "Cliente", dataIndex: "cliente", key: "cliente" },
    { title: "Recibe", dataIndex: "recibe", key: "recibe" },
    { title: "Estado", dataIndex: "estado", key: "estado" },
    { title: "Vigencia", dataIndex: "vigencia", key: "vigencia" },
    {
      title: "Opciones",
      key: "opciones",
      render: (_, record) => (
        <Link to="/DetalleOrdenTrabajo">
          <Button className="detalles-button">
            Detalles
          </Button>
        </Link>
      ),
    },
  ];

  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = initialData.filter((item) =>
      Object.values(item).some((field) =>
        String(field).toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };



  return (
    <div className="generarorden-container">
      <h1 className="generarorden-title">Órdenes de Trabajo</h1>
      <center>
        <Input.Search
          className="generarorden-search"
          placeholder="Buscar órdenes de trabajo..."
          enterButton="Buscar"
          value={searchText}
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </center>
      <div className="generarorden-buttons">
        <Link to="/proyectos">
          <Button className="nueva-orden-button">Nueva Orden de Trabajo</Button>
        </Link>
      </div>
      <Table
        className="generarorden-table"
        dataSource={filteredData}
        columns={columns}
        bordered
        pagination={{
          pageSize: 5,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20"],
        }}
      />
      <div className="generarorden-summary">
        <div className="summary-container">
          Número de órdenes de trabajo: {filteredData.length}
        </div>
      </div>
    </div>
  );
};

export default Generarorden;
