import React, { useState, useEffect} from "react";
import { Table, Input, Button } from "antd";
import { Link } from "react-router-dom";
import "./cotizar.css";
import { getAllCotizacion } from "../../apis/CotizacionApi";
import { getAllCliente } from "../../apis/ClienteApi";
import { getAllTipoMoneda } from "../../apis/Moneda";
import { getAllEmpresas } from "../../apis/EmpresaApi";


const columnsCotizaciones = [
  {
    title: "Cotización",
    dataIndex: "id",
    key: "id",
    render: (text) => <span className="cotizacion-text">{text}</span>,
  },
  { title: "Empresa", dataIndex: "empresa", key: "empresa" },
  { title: "Contacto", dataIndex: "contacto", key: "contacto" },
  { title: "Solicitud", dataIndex: "fechaSolicitud", key: "fechaSolicitud" },
  { title: "Expiración", dataIndex: "fechaCaducidad", key: "fechaCaducidad" },
  { title: "Moneda", dataIndex: "moneda", key: "moneda" },
  { title: "Estado", dataIndex: "estado", key: "estado" },
  {
    title: "Acción",
    key: "action",
    render: (_, record) => (<Link to={`/detalles_cotizaciones/${record.id}`}>
      <Button type="primary" className="detalles-button">
        Detalles
      </Button></Link>
    ),
  },
];

const Cotizar = () => {
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [cotizaciones, setCotizacion] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [monedas, setMonedas] = useState([]);
  const [empresas, setEmpresas]= useState([]);

  useEffect(()=>{
    const fetchEmpresa=async ()=>{
      try{
        const response=await getAllEmpresas();
        setEmpresas(response.data);
    }catch(error){
      console.error('Error al cargar las cotizaciones', error);
    }
    }
    const fetchCotizacion=async()=>{
      try{
          const response=await getAllCotizacion();
          setCotizacion(response.data);
      }catch(error){
        console.error('Error al cargar las cotizaciones', error);
      }
    };
    const fetchClientes = async () => {
      try {
        const response = await getAllCliente();
        setClientes(response.data);
      } catch (error) {
        console.error("Error al cargar los clientes", error);
      }
    };
    const fetchMonedas = async () => {
      try {
        const response = await getAllTipoMoneda();
        setMonedas(response.data);
      } catch (error) {
        console.error("Error al cargar las monedas", error);
      }
    };
    fetchCotizacion();
    fetchClientes();
    fetchMonedas();
    fetchEmpresa();
  },[]);
  
  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = cotizaciones.filter((item) =>
      Object.values(item).some((field) =>
        String(field).toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  // Asocia las cotizaciones con los clientes y las monedas
  const dataWithDetails = cotizaciones.map((cotizacion) => {
    const cliente = clientes.find((client) => client.id === cotizacion.cliente);
    const empresa = empresas.find((empres) => empres.id === cliente.empresa);
    const moneda = monedas.find((moneda) => moneda.id === empresa.tipoMoneda);
    
    return {
      ...cotizacion,
      empresa: empresa ? empresa.nombre : "",
      contacto:cliente ? `${cliente.nombrePila} ${cliente.apPaterno} ${cliente.apMaterno}` : "",
      moneda:  moneda ? moneda.nombre : "",
    };
  });


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
        <Link to="/CotizacionEstadisticas"><Button className="estadisticas-button">
          Estadísticas
        </Button></Link>
        <Link to="/cliente"><Button className="nueva-cotizacion-button" type="primary">
          Nueva Cotización
        </Button></Link>
        <Link to="/proyectos"><Button className="ver-proyectos-button">
          Ver Proyectos
        </Button></Link>
      </div>

      <Table
        className="cotizar-table"
        dataSource={filteredData.length > 0 ? filteredData : dataWithDetails}
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
        Número de cotizaciones: {filteredData.length > 0 ? filteredData.length : dataWithDetails.length}
        </div>
      </div>
    </div>
  );
};

export default Cotizar;
