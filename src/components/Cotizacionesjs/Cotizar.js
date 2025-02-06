import React, { useState, useEffect } from "react";
import { Table, Input, Button, Spin, Menu } from "antd"; // Importar Dropdown y Menu
import { Link } from "react-router-dom";
import "./cotizar.css";
import { getAllCotizacion } from "../../apis/CotizacionApi";
import { getAllCliente } from "../../apis/ClienteApi";
import { getAllTipoMoneda } from "../../apis/Moneda";
import { getAllEmpresas } from "../../apis/EmpresaApi";
import { getEstadoById } from "../../apis/EstadoApi";

const columnsCotizaciones = [
  {
    title: "Cotización",
    dataIndex: "id",
    key: "id",
    render: (text) => <span className="cotizacion-text">{text}</span>,
  },
  { title: "Empresa", dataIndex: "empresa", key: "empresa" },
  { title: "Contacto", dataIndex: "contacto", key: "contacto" },
  { title: "Solicitud", dataIndex: "fechaSolicitud", key: "fechaSolicitud",
    sorter: (a, b) => {
      // Convertir las fechas a timestamps para compararlas
      const dateA = new Date(a.fechaCaducidad).getTime();
      const dateB = new Date(b.fechaCaducidad).getTime();
      return dateA - dateB; // Ordenar de menor a mayor
    },
    sortDirections: ["ascend", "descend"], // Habilitar ambos órdenes (ascendente y descendente)
   },
  {
    title: "Expiración",
    dataIndex: "fechaCaducidad",
    key: "fechaCaducidad",
    sorter: (a, b) => {
      // Convertir las fechas a timestamps para compararlas
      const dateA = new Date(a.fechaCaducidad).getTime();
      const dateB = new Date(b.fechaCaducidad).getTime();
      return dateA - dateB; // Ordenar de menor a mayor
    },
    sortDirections: ["ascend", "descend"], // Habilitar ambos órdenes (ascendente y descendente)
  },
  { title: "Moneda", dataIndex: "moneda", key: "moneda" },
  {
    title: "Estado",
    dataIndex: "estado",
    key: "estado",
    // Agregar un filtro personalizado en la columna de estado
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
      <div style={{ padding: 8 }}>
        <Menu
          onClick={({ key }) => {
            setSelectedKeys(key === "all" ? [] : [key]); // "all" para quitar el filtro
            confirm(); // Aplicar el filtro
          }}
          selectedKeys={selectedKeys}
        >
          <Menu.Item key="all">Todos</Menu.Item>
          <Menu.Item key="Pendiente">Pendiente</Menu.Item>
          <Menu.Item key="En proceso">En proceso</Menu.Item>
          <Menu.Item key="Completado">Completado</Menu.Item>
        </Menu>
      </div>
    ),
    onFilter: (value, record) => {
      if (value === "all") return true; // Mostrar todos si se selecciona "Todos"
      return record.estado === value; // Filtrar por estado
    },
  },
  {
    title: "Acción",
    key: "action",
    render: (_, record) => (
      <Link to={`/detalles_cotizaciones/${record.id}`}>
        <Button type="primary" className="detalles-button">
          Detalles
        </Button>
      </Link>
    ),
  },
];

const Cotizar = () => {
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [cotizaciones, setCotizacion] = useState([]);
  const [, setClientes] = useState([]);
  const [, setMonedas] = useState([]);
  const [, setEmpresas] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); // Activar el estado de carga

        // Realizar todas las llamadas a la API en paralelo
        const [cotizacionesResponse, clientesResponse, monedasResponse, empresasResponse] =
          await Promise.all([
            getAllCotizacion(),
            getAllCliente(),
            getAllTipoMoneda(),
            getAllEmpresas(),
          ]);

        setCotizacion(cotizacionesResponse.data);
        setClientes(clientesResponse.data);
        setMonedas(monedasResponse.data);
        setEmpresas(empresasResponse.data);
        await fetchCotizacionesYEstados();
      } catch (error) {
        console.error("Error al cargar los datos", error);
      } finally {
        setIsLoading(false); // Desactivar el estado de carga
      }
    };

    fetchData();
  }, []);

  const fetchCotizacionesYEstados = async () => {
    try {
      const cotResponse = await getAllCotizacion();
      const cotizaciones = cotResponse.data;

      // Obtener todos los estados una sola vez
      const estadosMap = {};
      await Promise.all(
        cotizaciones.map(async (cot) => {
          try {
            const estadoResp = await getEstadoById(cot.estado);
            estadosMap[cot.estado] = estadoResp.data.nombre;
          } catch (error) {
            console.error(`Error obteniendo estado ${cot.estado}:`, error);
            estadosMap[cot.estado] = "Desconocido";
          }
        })
      );

      // Obtener clientes, empresas y monedas en paralelo
      const [clientesResp, empresasResp, monedasResp] = await Promise.all([
        getAllCliente(),
        getAllEmpresas(),
        getAllTipoMoneda(),
      ]);

      const clientes = clientesResp.data;
      const empresas = empresasResp.data;
      const monedas = monedasResp.data;

      // Crear diccionarios para acceso rápido
      const clientesMap = clientes.reduce((acc, cli) => {
        acc[cli.id] = cli;
        return acc;
      }, {});

      const empresasMap = empresas.reduce((acc, emp) => {
        acc[emp.id] = emp;
        return acc;
      }, {});

      const monedasMap = monedas.reduce((acc, mon) => {
        acc[mon.id] = mon;
        return acc;
      }, {});

      // Aplicar la transformación completa
      const cotizacionesConDetalles = cotizaciones.map((cot) => {
        const cliente = clientesMap[cot.cliente] || {};
        const empresa = empresasMap[cliente.empresa] || {};
        const moneda = monedasMap[empresa.tipoMoneda] || {};

        return {
          ...cot,
          empresa: empresa.nombre || "",
          contacto: `${cliente.nombrePila || ""} ${cliente.apPaterno || ""} ${cliente.apMaterno || ""}`.trim(),
          moneda: moneda.nombre || "",
          estado: estadosMap[cot.estado] || "Desconocido",
        };
      });

      setCotizacion(cotizacionesConDetalles);
    } catch (error) {
      console.error("Error al obtener cotizaciones y detalles:", error);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    if (!value) {
      setFilteredData([]);
      return;
    }

    const filtered = cotizaciones.filter((item) =>
      Object.values(item).some((field) =>
        field !== null && field !== undefined && String(field).toLowerCase().includes(value.toLowerCase())
      )
    );

    setFilteredData(filtered);
  };

  return (
    <div className="cotizar-container">
      <center>
        <h1 className="cotizar-title">Cotizaciones</h1>
        <Input.Search
          className="cotizar-search"
          placeholder="Buscar cotizaciones..."
          enterButton="Buscar"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          onSearch={handleSearch}
        />
      </center>

      <div className="cotizar-buttons">
        <Link to="/CotizacionEstadisticas">
          <Button className="estadisticas-button">Estadísticas</Button>
        </Link>
        <Link to="/cliente">
          <Button className="nueva-cotizacion-button" type="primary">
            Nueva Cotización
          </Button>
        </Link>
        <Link to="/proyectos">
          <Button className="ver-proyectos-button">Ver Proyectos</Button>
        </Link>
      </div>

      {isLoading ? ( // Mostrar spinner si isLoading es true
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Spin size="large" tip="Cargando cotizaciones..." />
        </div>
      ) : (
        <>
          <Table
            className="cotizar-table"
            dataSource={filteredData.length > 0 ? filteredData : cotizaciones}
            columns={columnsCotizaciones}
            bordered
            pagination={{
              pageSize: 5,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20"],
            }}
          />

          <div className="cotizar-summary">
            <div className="summary-container">
              Número de cotizaciones:{" "}
              {filteredData.length > 0 ? filteredData.length : cotizaciones.length}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cotizar;