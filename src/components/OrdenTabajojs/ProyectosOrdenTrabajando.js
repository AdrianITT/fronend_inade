import React, { useState, useEffect } from "react";
import { Table, Input, Button} from "antd";
import { Link } from "react-router-dom";
import "./Proyecto.css";

import { getAllCotizacion } from "../../apis/CotizacionApi";
import {getAllCliente} from "../../apis/ClienteApi";
import {getAllEmpresas } from "../../apis/EmpresaApi";
import { getAllOrdenesTrabajo } from "../../apis/OrdenTrabajoApi";

const Proyectos = () => {
  //const [empresas, setEmpresas] = useState([]);
  //const [clientes, setClientes] = useState([]);
  const [cotizacion, setCotizacionInfo]=useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [ordenesTrabajo, setOrdenesTrabajo] = useState([]);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener todas las cotizaciones, empresas y clientes
        const [cotizacionesResponse, empresasResponse, clientesResponse, ordenesResponse] = await Promise.all([
          getAllCotizacion(),
          getAllEmpresas(),
          getAllCliente(),
          getAllOrdenesTrabajo(),
        ]);

        // Filtrar cotizaciones con estado >= 2
        const cotizacionesFiltradas = cotizacionesResponse.data.filter(cotizacion => cotizacion.estado >= 2);

        setOrdenesTrabajo(ordenesResponse.data);
        

        // Transformar los datos para que coincidan con la estructura de la tabla
        const formattedData = cotizacionesFiltradas.map((cotizacion) => {
          
          // Buscar el cliente correspondiente
          const cliente = clientesResponse.data.find(cli => cli.id === cotizacion.cliente);

          // Buscar la empresa correspondiente
          const empresa = empresasResponse.data.find(emp => emp.id === cliente?.empresa);

          return {
            key: cotizacion.id,
            cotizacion: `000${cotizacion.id}`, // Formato de número de cotización
            empresa: empresa ? empresa.nombre : "N/A", // Nombre de la empresa
            contacto: cliente ? `${cliente.nombrePila} ${cliente.apPaterno} ${cliente.apMaterno}` : "N/A", // Nombre completo del cliente
            solicitud: cotizacion.fechaSolicitud || "N/A", // Fecha de solicitud
            ordenes: [], // Datos de ejemplo para las órdenes
          };
        });

        // 2. Combinar ordenes. 
        //    ordenesResponse.data es un arreglo de órdenes con {id, estado, cotizacion, ... }
        const dataWithOrdenes = formattedData.map((row) => {
          const ordenesAsociadas = ordenesResponse.data.filter(
            (ord) => ord.cotizacion === row.key
          );
          return {
            ...row,
            ordenes: ordenesAsociadas
          };
        });
        // 3. Asignar a estado
        setCotizacionInfo(dataWithOrdenes);
        setFilteredData(dataWithOrdenes);
        
        //setCotizacionInfo(formattedData);
        //setFilteredData(formattedData); // Inicialmente, los datos filtrados son los mismos que los datos originales
      } catch (error) {
        console.error("Error al cargar los datos", error);
      }
    };

    fetchData();
  }, []);

/*
  const initialData = [
    {
      key: "1",
      cotizacion: "0001",
      empresa: "ESCUELA KEMPER URGATE",
      contacto: "Daniela Alvarez Zacarias",
      solicitud: "13/01/2025",
      ordenes: [{ id: "250114-01", estado: "OFF" }],
    },
    {
      key: "2",
      cotizacion: "0002",
      empresa: "ESCUELA KEMPER URGATE",
      contacto: "Daniela Alvarez Zacarias",
      solicitud: "14/01/2025",
      ordenes: [{ id: "250114-02", estado: "OFF" }],
    },
  ];*/
  

  const columns = [
    {
      title: "Cotización",
      dataIndex: "cotizacion",
      key: "cotizacion",
      render: (text) => <span style={{ color: "green", cursor: "pointer" }}>{text}</span>,
    },
    { title: "Empresa", dataIndex: "empresa", key: "empresa" },
    { title: "Contacto", dataIndex: "contacto", key: "contacto" },
    { title: "Solicitud", dataIndex: "solicitud", key: "solicitud" },
    {
      title: "Ordenes",
      dataIndex: "ordenes",
      key: "ordenes",
      render: (ordenesTrabajo) => {
        if (!ordenesTrabajo || ordenesTrabajo.length === 0) {
          // Si no hay órdenes
          return <span>No hay órdenes de trabajo asociadas.</span>;
        }
        // Si hay al menos 1 orden
        return ordenesTrabajo.map((orden) => (
          <div key={orden.id}>
            <Link to={`/DetalleOrdenTrabajo/${orden.id}`}>
              • <span style={{ color: "green" }}>
                ID:{orden.id} Estado:{orden.estado}
              </span>
            </Link>
          </div>
        ));
      },
    },
    {
      title: "Opciones",
      key: "opciones",
      render: (_, record) =>
       (<Link to={`/GenerarOrdenTrabajo/${record.key}`}>
        <Button type="primary" shape="circle" icon="+" style={{ backgroundColor: "#1890ff" }} /></Link>
      ),
    },
  ];

  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = cotizacion.filter((item) =>
      Object.values(item).some((field) =>
        String(field).toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  return (
    <div className="table-container">
      <div style={{ marginBottom: "16px", textAlign: "center" }}>
        <h1 style={{ marginBottom: "24px" }}>Gestión de Proyecto</h1>
        <p>Visualiza, organiza y administra los proyectos de manera eficiente.</p>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px" }}>
          <Input.Search
            placeholder="Buscar proyectos..."
            enterButton="Buscar"
            style={{ width: "300px" }}
            value={searchText}
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
          />
          
        </div>
      </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
            <Button
              type="primary"
              style={{
                backgroundColor: "#13c2c2",
                borderColor: "#13c2c2",
              }}>
              <Link to="/cotizar" style={{ color: "white", textDecoration: "none" }}>
                Ver Cotizaciones
              </Link>
            </Button>
        </div>
      <Table
        dataSource={filteredData}
        columns={columns}
        bordered
        pagination={{
          pageSize: 5,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20"],
        }}
      />
      <div style={{ marginTop: "16px", textAlign: "left" }}>
        <div
          style={{
            backgroundColor: "#e6f7ff",
            padding: "8px",
            borderRadius: "4px",
            display: "inline-block",
          }}
        >
          Número de proyectos: {filteredData.length}
        </div>
      </div>
    </div>
  );
};

export default Proyectos;
