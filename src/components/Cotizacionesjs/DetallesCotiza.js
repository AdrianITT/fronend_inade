import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Input, Tabs, Card, Table, Row, Col, Typography, Button, Menu, Dropdown, Checkbox, Form, Alert, Modal, message } from "antd";
import { MailTwoTone, CopyTwoTone, EditTwoTone, CheckCircleTwoTone, FilePdfTwoTone } from "@ant-design/icons";

import { getAllCotizacion, updateCotizacion} from "../../apis/CotizacionApi";
import { getAllCliente } from "../../apis/ClienteApi";
import { getAllTipoMoneda } from "../../apis/Moneda";
import { getAllEmpresas } from "../../apis/EmpresaApi";
import {getAllServicio} from "../../apis/ServiciosApi";
import {getAllIva} from "../../apis/ivaApi";
import { getAllCotizacionServicio } from "../../apis/CotizacionServicioApi";
//import { PDFCotizacion } from "../../apis/PDFApi";
import { Api_Host } from "../../apis/api";

const { Title, Text } = Typography;

const columnsServicios = [
  { title: "Servicio", dataIndex: "nombreServicio", key: "nombreServicio" },
  { title: "Cantidad", dataIndex: "cantidad", key: "cantidad" },
  { title: "Precio Unitario", dataIndex: "precio", key: "precio" },
  { title: "Subtotal", dataIndex: "subtotal", key: "subtotal" },
];

const CotizacionDetalles = () => {
  const { id } = useParams(); // Obtener el id desde la URL
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [cotizacionInfo, setCotizacionInfo] = useState([]);
  const [servicios, setServicios] = useState([]);
  //const [clientes, setClientes] = useState([]);
  //const [monedas, setMonedas] = useState([]);
  //const [empresas, setEmpresas] = useState([]);
  //const [iva, setIva]=useState([]);
  const [loading, setLoading] = useState(false);
  //const [CotizacionServicio, setCotizacionServicio]=useState(null);

  useEffect(() => {
    const fetchCotizacion = async () => {
      try {
        // Obtener la cotización
        const response = await getAllCotizacion();
        const cotizacionData = response.data.find((cot) => cot.id === parseInt(id));
        setCotizacionInfo(cotizacionData); // Setear la información de la cotización
  
        // Si la cotización tiene servicios, obtenemos la relación de los servicios
        if (cotizacionData && cotizacionData.servicios && Array.isArray(cotizacionData.servicios)) {
          // Obtener los servicios asociados a esta cotización
          const serviciosRelacionados = cotizacionData.servicios;  // Array de IDs de servicios
  
          // Obtener todos los servicios
          const serviciosData = await getAllServicio();
  
          // Filtrar solo los servicios que están relacionados con la cotización
          const serviciosFiltrados = serviciosData.data.filter(servicio =>
            serviciosRelacionados.includes(servicio.id) // Filtra los servicios con los IDs de la cotización
          );
  
          setServicios(serviciosFiltrados); // Almacenar los servicios filtrados
        }
  
      } catch (error) {
        console.error("Error al cargar las cotizaciones", error);
      }
    };

    /*const fetchClientes = async () => {
      try {
        const response = await getAllCliente();
        setClientes(response.data);
      } catch (error) {
        console.error("Error al cargar los clientes", error);
      }
    };*/

    /*const fetchMonedas = async () => {
      try {
        const response = await getAllTipoMoneda();
        setMonedas(response.data);
      } catch (error) {
        console.error("Error al cargar las monedas", error);
      }
    };*/

    /*const fetchEmpresas = async () => {
      try {
        const response = await getAllEmpresas();
        setEmpresas(response.data);
      } catch (error) {
        console.error("Error al cargar las empresas", error);
      }
    };*/
    const fetchServicios = async () => {
      try {
        // Obtener todos los servicios
        const serviciosData = await getAllServicio();
        // Obtener la relación entre cotizaciones y servicios (tabla cotizacion_servicio)
        const cotizacionServicioData = await getAllCotizacionServicio();
  
        // Obtener la cotización
        const cotizacionesData = await getAllCotizacion();
        const cotizacionData = cotizacionesData.data.find((cot) => cot.id === parseInt(id));
        setCotizacionInfo(cotizacionData); // Setear la información de la cotización
  
        // Si la cotización tiene servicios, obtenemos la relación de los servicios
        if (cotizacionData && cotizacionData.servicios && Array.isArray(cotizacionData.servicios)) {
          const serviciosRelacionados = cotizacionData.servicios;  // Array de IDs de servicios
  
          // Filtrar solo los servicios que están relacionados con la cotización
          const serviciosFiltrados = serviciosData.data.filter(servicio =>
            serviciosRelacionados.includes(servicio.id) // Filtra los servicios con los IDs de la cotización
          );
  
          // Asociar la cantidad de cotizacion_servicio con los servicios
          const serviciosConCantidad = serviciosFiltrados.map(servicio => {
            // Buscar el cotizacion_servicio que tiene la cantidad
            const cotizacionServicio = cotizacionServicioData.data.find(cotServ => cotServ.servicio === servicio.id && cotServ.cotizacion === cotizacionData.id);
            // Calcular subtotal
            const cantidad = cotizacionServicio ? cotizacionServicio.cantidad : 0;
            const precio = servicio.precio || 0; // Suponiendo que 'precio' es parte de la respuesta del servicio
            const subtotal = cantidad * precio;  // Calculando el subtotal
            return {
              ...servicio,
              cantidad: cotizacionServicio ? cotizacionServicio.cantidad : 0, // Asignar cantidad
              subtotal,
              precio,
            };
            
          });
  
          setServicios(serviciosConCantidad); // Almacenar los servicios con la cantidad
        }
  
      } catch (error) {
        console.error("Error al cargar los servicios o cotizaciones", error);
      }
    };

    /*const fetchIva = async () => {
      try {
        const response = await getAllIva();
        setIva(response.data);
      } catch (error) {
        console.error("Error al cargar los servicios", error);
      }
    };*/

    const fetchData = async () => {
      try {
        // Obtener todos los datos
         // Obtener todos los datos
        const cotizacionesData = await getAllCotizacion();
        const clientesData = await getAllCliente();
        const monedasData = await getAllTipoMoneda();
        const empresasData = await getAllEmpresas();
        const ivaData = await getAllIva();
        //const CotiServicio =await setCotizacionServicio(); 
        /*const [cotizacionesData, clientesData, monedasData, empresasData, ivaData] = await Promise.all([
          getAllCotizacion(),
          getAllCliente(),
          getAllTipoMoneda(),
          getAllEmpresas(),
          getAllIva()
        ]);
        //const CotiServicio =await setCotizacionServicio();*/

        // Relacionar los datos
        const cotizacionData = cotizacionesData.data.find(cot => cot.id === parseInt(id));

        if (cotizacionData) {
          const cliente = clientesData.data.find(cliente => cliente.id === cotizacionData.cliente);
          const empresa = empresasData.data.find(empresa => empresa.id === cliente?.empresa);
          const moneda = monedasData.data.find(moneda => moneda.id === cotizacionData.id);
          const ivaR = ivaData.data.find(ivaItem => ivaItem.id === cotizacionData.iva);
          //const cotiSer= CotiServicio.data.find(CotiServicio=>CotiServicio.id===cotizacionesData.id)

          const cotizacionConDetalles = {
            ...cotizacionData,
            clienteNombre: `${cliente?.nombrePila} ${cliente?.apPaterno} ${cliente?.apMaterno}`,
            empresaNombre: empresa?.nombre,
            monedaNombre: moneda?.nombre,
            direccion: `${empresa?.calle} ${empresa?.numero} ${empresa?.colonia} ${empresa?.ciudad} ${empresa?.estado} ${empresa?.codigoPostal}`,
            tasaIVA: ivaR?.porcentaje,
            fechaSolicitud: cotizacionData?.fechaSolicitud,
            fechaCaducidad: cotizacionData?.fechaCaducidad,
            precio: cotizacionData.precio,
          };

          setCotizacionInfo(cotizacionConDetalles);
        }

      } catch (error) {
        console.error("Error al cargar los datos", error);
      }
    };

    fetchData();

    fetchServicios();
    //fetchIva();
    fetchCotizacion();
    //fetchClientes();
    //fetchMonedas();
    //fetchEmpresas();
  }, [id]);

  const handleDownloadPDF = async () => {
    setLoading(true); // Activar el estado de carga

    try {
      // Abrir el PDF en una nueva pestaña
      window.open(Api_Host.defaults.baseURL+`/cotizacion/${id}/pdf`);

      // Si la respuesta es exitosa, puedes procesarla
      message.success("PDF descargado correctamente");
      setLoading(false); // Desactivar el estado de carga
    } catch (error) {
      console.error("Error al descargar el PDF:", error);
      message.error("Hubo un error al descargar el PDF");
      setLoading(false); // Desactivar el estado de carga
    }
  };


  const mostrarCard = () => {
    setIsVisible(false); // Cambia el estado para hacerlo visible
  };

  const showEmailModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSendEmail = () => {
    console.log("Correo enviado");
    setIsModalVisible(false);
  };

  const updateEstadoCotizacion=async (nuevoEstado)=>{
    try{
      const cotizacionData = {
        ...cotizacionInfo,  // Mantén el resto de los datos intactos
        estado: nuevoEstado,  // Actualiza solo el estado
      };
      const response = await updateCotizacion(cotizacionInfo.id, cotizacionData); // Enviar la actualización al backend
      setCotizacionInfo(response.data);  // Actualiza el estado en el frontend

    }catch(error){
      console.error("Error al actualizar el estado de la cotización", error);
      message.error("Error al actualizar el estado de la cotización");
    }
  }

  // Menú desplegable
  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<MailTwoTone />} onClick={showEmailModal}>
        Enviar por correo
      </Menu.Item>
      <Menu.Item key="2" icon={<CopyTwoTone />}>
        Duplicar
      </Menu.Item>
      <Menu.Item key="3" icon={<EditTwoTone />}>
        Editar
      </Menu.Item>
      <Menu.Item key="4" icon={<CheckCircleTwoTone twoToneColor="#52c41a" />} onClick={() => updateEstadoCotizacion(2)}>
        Actualizar estado
      </Menu.Item>
      <Menu.Item key="5" icon={<FilePdfTwoTone />} 
      onClick={handleDownloadPDF}
      loading={loading}>
        Ver PDF
      </Menu.Item>
    </Menu>
  );


  
  const Csubtotal = servicios.reduce((acc, servicio) => acc + (servicio.subtotal || 0), 0);
  const Civa = Csubtotal * (cotizacionInfo?.tasaIVA || 0);
  const Ctotal = Csubtotal + Civa;

  return (
    <div className="cotizacion-detalles-container">
      <div>
        <h1>Detalles de la Cotización {id} Proyecto</h1>
      </div>
      
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Detalles" key="1">
          <Row gutter={16}>
            <Col span={16}>
              <Card title="Información de la Cotización" bordered>
              <p><Text strong>Atención:</Text> {cotizacionInfo?.clienteNombre || "N/A"}</p>
              <p><Text strong>Empresa:</Text> {cotizacionInfo?.empresaNombre || "N/A"}</p>
              <p><Text strong>Dirección:</Text> {cotizacionInfo?.direccion || "N/A"}</p>
              <p><Text strong>Fecha solicitada:</Text> {cotizacionInfo?.fechaSolicitud || "N/A"}</p>
              <p><Text strong>Fecha de caducidad:</Text> {cotizacionInfo?.fechaCaducidad || "N/A"}</p>
              <p><Text strong>Denominación:</Text> {cotizacionInfo?.monedaNombre || "N/A"}</p>
              <p><Text strong>Tasa IVA:</Text> {cotizacionInfo?.tasaIVA || "N/A"}</p>
              <p><Text strong>Notas:</Text> {cotizacionInfo?.notas || "N/A"}</p>
              <p><Text strong>Correos adicionales:</Text> {cotizacionInfo?.correosAdicionales || "N/A"}</p>
              </Card>
            </Col>
            <Col span={8}>
              {isVisible && (
                <Card
                  title="Ordenes"
                  bordered
                  extra={
                    <Button
                      type="primary"
                      onClick={mostrarCard}
                      style={{ backgroundColor: "#13c2c2", borderColor: "#13c2c2" }}
                    >
                      Nueva Orden de Trabajo
                    </Button>
                  }
                >
                </Card>
              )}

              {cotizacionInfo?.estado > 1 &&(
                <Card
                  title="Ordenes"
                  bordered
                  extra={
                    <Button
                      type="primary"
                      onClick={mostrarCard}
                      style={{ backgroundColor: "#13c2c2", borderColor: "#13c2c2" }}
                    >
                      Nueva Orden de Trabajo
                    </Button>
                  }
                >
                </Card>
              )}

              <Card
                title="Cuenta"
                bordered
                extra={
                  <Dropdown overlay={menu}>
                    <Button type="primary" style={{ marginBottom: "16px" }}>
                      Acciones para cotización
                    </Button>
                  </Dropdown>
                }
              >
                <p><Text strong>Subtotal:</Text>{servicios.reduce((acc, servicio) => acc + (servicio.subtotal || 0), 0).toFixed(2)}</p>
                <p><Text strong>IVA ({cotizacionInfo?.tasaIVA * 100 || 0}%):</Text> {Civa.toFixed(2)} </p>
                <p><Text strong>Importe:</Text> {Ctotal.toFixed(2)} </p>
                {cotizacionInfo?.estado > 1 ? (
                  <div>
                    {/* Mostrar algo cuando el estado es mayor que 1 */}
                    <Text strong>Estado: Aprobado</Text>
                    <p>Este estado muestra detalles específicos para cotizaciones aprobadas.</p>
                  </div>
                ) : (
                  <div>
                    {/* Mostrar algo cuando el estado es 1 o menor */}
                    <Text strong>Estado: Pendiente</Text>
                    <p>Esta cotización está en espera de aprobación.</p>
                  </div>
                )}
              </Card>
            </Col>
          </Row>
          <Table
            dataSource={servicios}
            columns={columnsServicios}
            bordered
            pagination={false}
            style={{ marginTop: "16px" }}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Documentos" key="2">
          <Title level={4}>Documentos relacionados</Title>
          <Text>No hay documentos disponibles.</Text>
        </Tabs.TabPane>
      </Tabs>
      {/* Modal para enviar cotización */}
      <Modal
        title="Enviar Cotización"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cerrar
          </Button>,
          <Button key="send" type="primary" onClick={handleSendEmail}>
            Enviar
          </Button>,
        ]}
      >
        <h4>Selecciona los correos a los que deseas enviar la cotización:</h4>
        <Form layout="vertical">
          <Checkbox>Cliente: adrian@gmail.com</Checkbox>
          <Checkbox>Tu correo: ventas1@inade.mx</Checkbox>
          <Form.Item label="Mensaje Personalizado: (Opcional)">
            <Input.TextArea placeholder="Si no se agrega un mensaje, se utilizará un mensaje predeterminado." />
          </Form.Item>
          <Alert
            message="Si no se agrega un mensaje, se utilizará un mensaje predeterminado."
            type="warning"
            showIcon
          />
        </Form>
      </Modal>
    </div>
  );
};

export default CotizacionDetalles;
