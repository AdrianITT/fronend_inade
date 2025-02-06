import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Table, Input, Button, Spin } from "antd"; // Importar Spin
import { Link } from "react-router-dom";
import "./cssOrdenTrabajo/Generarorden.css";
import { getAllOrdenesTrabajo } from "../../apis/OrdenTrabajoApi";
import { getCotizacionById } from "../../apis/CotizacionApi";
import { getClienteById } from "../../apis/ClienteApi";
import { getEstadoById } from "../../apis/EstadoApi";
import { getReceptorByI } from "../../apis/ResectorApi";

const Generarorden = () => {
  const [ordentrabajo, setOrdenTrabajo] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Estado de carga

  useEffect(() => {
    const fetchOrdenTrabajo = async () => {
      try {
        setIsLoading(true); // Activar el estado de carga
        const response = await getAllOrdenesTrabajo();
        const ordenes = response.data;

        const ordenesConCotizacion = await Promise.all(
          ordenes.map(async (orden) => {
            const [cotizacionResponse, receptorResponse, estadoResponse] = await Promise.all([
              getCotizacionById(orden.cotizacion),
              getReceptorByI(orden.receptor),
              getEstadoById(orden.estado),
            ]);

            const clienteResponse = await getClienteById(cotizacionResponse.data.cliente);

            return {
              ...orden,
              cotizacionData: { ...cotizacionResponse.data, clienteData: clienteResponse.data },
              receptorData: receptorResponse.data,
              estadoData: estadoResponse.data,
            };
          })
        );

        setOrdenTrabajo(ordenesConCotizacion);
        setFilteredData(ordenesConCotizacion);
      } catch (error) {
        console.error('Error al cargar las ordenes: ', error);
      } finally {
        setIsLoading(false); // Desactivar el estado de carga
      }
    };

    fetchOrdenTrabajo();
  }, []);

  const handleSearch = useCallback((value) => {
    setSearchText(value);
    const filtered = ordentrabajo.filter((item) =>
      Object.values(item).some((field) =>
        String(field).toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredData(filtered);
  }, [ordentrabajo]);

  const columns = useMemo(() => [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Cotización", dataIndex: "codigo", key: "codigo" },
    {
      title: "Cliente",
      key: "cliente",
      render: (_, record) => {
        if (record.cotizacionData && record.cotizacionData.clienteData) {
          const { nombrePila, apPaterno, apMaterno } = record.cotizacionData.clienteData;
          return `${nombrePila} ${apPaterno} ${apMaterno}`;
        }
        return "";
      }
    },
    {
      title: "Recibe",
      key: "receptor",
      render: (_, record) => {
        if (record.receptorData) {
          const { nombrePila, apPaterno, apMaterno } = record.receptorData;
          return `${nombrePila} ${apPaterno} ${apMaterno}`;
        }
        return "";
      }
    },
    {
      title: "Estado",
      key: "estado",
      render: (_, record) => record.estadoData ? record.estadoData.nombre : ""
    },
    {
      title: "Vigencia",
      key: "vigencia",
      render: (_, record) => record.cotizacionData ? record.cotizacionData.fechaCaducidad : ""
    },
    {
      title: "Opciones",
      key: "opciones",
      render: (_, record) => (
        <Link to={`/DetalleOrdenTrabajo/${record.id}`}>
          <Button className="detalles-button">Detalles</Button>
        </Link>
      ),
    },
  ], []);

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
      {isLoading ? ( // Mostrar spinner si isLoading es true
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Spin size="large" tip="Cargando órdenes de trabajo..." />
        </div>
      ) : (
        <>
          <Table
            rowKey="id"
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
        </>
      )}
    </div>
  );
};

export default React.memo(Generarorden);