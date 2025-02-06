
import React, { useState, useEffect,} from "react";
import "./Crearcotizacion.css";
import { Form, Input, Button, Row, Col, Select, Checkbox, Divider, message, DatePicker,Card, Modal } from "antd";
import dayjs from "dayjs";
import { useParams,useNavigate} from "react-router-dom";
import { getClienteById   } from "../../apis/ClienteApi";
import {getEmpresaById} from '../../apis/EmpresaApi';
import { getAllTipoMoneda } from "../../apis/Moneda";
import { getAllIva } from "../../apis/ivaApi";
import { getAllServicio } from "../../apis/ServiciosApi";
import { createCotizacion } from "../../apis/CotizacionApi";
import { createCotizacionServicio } from "../../apis/CotizacionServicioApi";



const { TextArea } = Input;

const RegistroCotizacion = () => {
  const navigate = useNavigate();
  const [servicios, setServicios] = useState([]);
  const { clienteId } = useParams();
  const [clienteData, setClienteData] = useState(null);  // Guardar los datos del cliente
  const [fechaSolicitada, setFechaSolicitada] = useState(null);
  const [empresas, setEmpresaData] = useState([]);
  const [tipomoneda, setTipoMoneda]=useState([]);
  const [ivaApi, setIva]= useState([]);
  const [fechaCaducidad, setFechaCaducidad] = useState(null);
  const [nota, setNota] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);


  const handleFechaSolicitadaChange = (date) => {
    setFechaSolicitada(date);
    if (date) {
      setFechaCaducidad(dayjs(date).add(1, "month")); // Calcula la fecha de caducidad (+1 mes)
    } else {
      setFechaCaducidad(null); // Si la fecha solicitada se elimina, también se elimina la fecha de caducidad
    }
  };

  // Obtén los datos del cliente cuando el componente se monta
    useEffect(() => {
      const fetchCliente = async () => {
        try {
          const response = await getClienteById(clienteId);  // Realiza la llamada a la API para obtener los datos
          setClienteData(response.data);  // Establece los datos del cliente
          // Una vez obtenidos los datos del cliente, obtenemos los datos de la empresa
        if (response.data && response.data.empresa) {
          const empresaId = response.data.empresa;
          const empresaResponse = await getEmpresaById(empresaId);
          setEmpresaData(empresaResponse.data); // Establece los datos de la empresa
        }

        } catch (error) {
          console.error("Error al obtener los datos del cliente", error);

          message.error("Error al cargar los datos del cliente");
        }
      };
      
      fetchCliente();
    }, [clienteId]);

    useEffect(()=>{
      const fetchTipoMoneda= async()=>{
        try{
            const response=await getAllTipoMoneda();
            setTipoMoneda(response.data);
        }catch(error){
        console.error('Error al cargar los titulos', error);
        }
      };
      const fetchIva= async()=>{
        try{
            const response=await getAllIva();
            setIva(response.data);
        }catch(error){
        console.error('Error al cargar los titulos', error);
        }
      };
      const fetchServicios = async () => {
        try {
          const response = await getAllServicio();
          setServicios(response.data); // Asume que la respuesta tiene una lista de servicios
        } catch (error) {
          console.error("Error al cargar los servicios", error);
        }
      };
      fetchIva();
      fetchTipoMoneda();
      fetchServicios();
    },[clienteId]);
    

  const [conceptos, setConceptos] = useState([
    { id: 1, servicio: "", cantidad: 1, precio: 0, notas: "" },
  ]);

  // Verifica si los datos del cliente y empresa están disponibles
  if (!clienteData || !empresas) {
    return <div>Loading...</div>; // Mostrar mensaje de carga si no hay datos
  }

  const handleAddConcepto = () => {
    setConceptos([...conceptos, { id: conceptos.length + 1, servicio: "", cantidad: 1, precio: 0, notas: "" }]);
  };

  const handleRemoveConcepto = (id) => {
    if (conceptos.length > 1) {
      setConceptos(conceptos.filter((concepto) => concepto.id !== id));
    } else {
      message.warning("Debe haber al menos un concepto.");
    }
  };

  const handleInputChange = (id, field, value) => {
    const updatedConceptos = conceptos.map((concepto) =>
      concepto.id === id ? { ...concepto, [field]: value } : concepto
    );
    setConceptos(updatedConceptos);
  };

  const calcularTotales = () => {
    const subtotal = conceptos.reduce((acc, curr) => acc + curr.cantidad * curr.precio, 0);
    const iva = subtotal * 0.08; // Tasa de IVA actual 8%
    return { subtotal, iva, total: subtotal + iva };
  };

  const handleServicioChange = (conceptoId, servicioId) => {
    // Encontrar el servicio seleccionado
    const servicioSeleccionado = servicios.find(servicio => servicio.id === servicioId);
    if (servicioSeleccionado) {
      // Actualiza los valores de precio y cantidad
      const updatedConceptos = conceptos.map((concepto) =>
        concepto.id === conceptoId ? {
          ...concepto,
          servicio: servicioSeleccionado.id,
          precio: servicioSeleccionado.precio || 0, // Ajusta según tu estructura de servicio
        } : concepto
      );
      setConceptos(updatedConceptos);
    }
  };

  const { subtotal, iva, total } = calcularTotales();

  const handleSubmit = async () => {
    try {
      
      // Primero, creamos la cotización
      console.log(tipomoneda, ivaApi, tipomoneda)
      
      const cotizacionData = {
        fechaSolicitud: dayjs(fechaSolicitada).format("YYYY-MM-DD"),  // Formato sin hora
        fechaCaducidad: dayjs(fechaCaducidad).format("YYYY-MM-DD"),  // Formato sin hora
        denominacion: String(tipomoneda),  // Asumiendo que tipomoneda es un solo objeto y no un array
        iva: ivaApi,  // Asumiendo que ivaApi es un solo objeto y no un array
        cliente: clienteData.id,
        estado: 1, // Suponiendo que el estado se marca como 1 (activo)
        notas: nota,
      };
      
      const cotizacionResponse = await createCotizacion(cotizacionData); // API para crear cotización
      setIsModalVisible(true); // <-- Abre el modal
      
      const cotizacionId = cotizacionResponse.data.id;
        // Ahora, enviamos los conceptos
        const conceptosPromises = conceptos.map((concepto) => {
        const conceptoData = {
          cantidad: concepto.cantidad,
          cotizacion: cotizacionId,
          servicio: concepto.servicio,
        };
        return createCotizacionServicio(conceptoData); // API para crear conceptos
      });
      // Redirige a la lista de cotizaciones
      // Esperamos a que todos los conceptos se creen
      await Promise.all(conceptosPromises);
      //message.success("Cotización creada correctamente");
      //navigate("/home"); // Redirige a la lista de cotizaciones
    } catch (error) {
      console.error("Error al crear la cotización", error);
      message.error("Error al crear la cotización");
    }
  };

  return (
    <div className="cotizacion-container">
      <h1 className="cotizacion-title">Registro de Cotización</h1>
      <Form layout="vertical">
        <div className="cotizacion-info-message">
          <strong>Por favor, complete todos los campos requeridos con la información correcta.</strong>
        </div>
        <div className="cotizacion-info-card">
          <p>

          </p>
          <p>
            <strong>RFC:</strong> {empresas.rfc}
          </p>
          <p>
            <strong>Representante:</strong> {clienteData.nombrePila} {clienteData.apPaterno} {clienteData.apMaterno}
          </p>
          <p>
            <strong>Contacto:</strong> {clienteData.correo} - {clienteData.telefono} | {clienteData.celular}
          </p>
        </div>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Fecha Solicitada"
            rules={[{ required: true, message: 'Por favor ingresa la fecha.' }]}>
              <DatePicker
                value={fechaSolicitada}
                onChange={handleFechaSolicitadaChange}
                format="DD/MM/YYYY"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Fecha Caducidad"
            rules={[{ required: true, message: 'Por favor ingresa la fecha.' }]}>
              <DatePicker
                value={fechaCaducidad}
                format="DD/MM/YYYY"
                style={{ width: "100%" }}
                placeholder="Calculada automáticamente"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Denominación" required
            rules={[{ required: true, message: 'Por favor ingresa Denominacion.' }]}>
              <Select onChange={(value) => setTipoMoneda(value)}>
                {Array.isArray(tipomoneda) && tipomoneda.map((moneda) =>(
                  <Select.Option key={moneda.id}
                  value={moneda.id}>
                    {moneda.nombre}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Tasa del IVA actual"
            rules={[{ required: true, message: 'Por favor ingresa los IVA.' }]}>
              <Select onChange={(value) => setIva(value)}>
              {Array.isArray(ivaApi) && ivaApi.map((ivas)=>(
                  <Select.Option key={ivas.id}
                  value={ivas.id}>
                    {ivas.porcentaje}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="notas" name="nota">
          <TextArea rows={2} value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder="Notas que aparecerán al final de la cotización (Opcional)"/>
        </Form.Item>
        <Form.Item label="Correos Adicionales">
          <Input placeholder="Ingresa correos adicionales, separados por comas (Opcional)" />
        </Form.Item>

        <Divider>Agregar Conceptos</Divider>
        {conceptos.map((concepto) => (
          <div key={concepto.id} ><Card>
            <h3>Concepto {concepto.id}</h3>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Servicio"
                rules={[{ required: true, message: 'Por favor ingresa el servicio.' }]}>
                <Select
                      placeholder="Selecciona un servicio"
                      onChange={(value) => handleServicioChange(concepto.id, value)}
                    >
                      {servicios.map((servicio) => (
                        <Select.Option key={servicio.id} value={servicio.id}>
                          {servicio.nombreServicio}
                        </Select.Option>
                      ))}
                    </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Cantidad de servicios"
                rules={[{ required: true, message: 'Por favor ingresa la cantidad.' }]}>
                  <Input
                    type="number"
                    min="1"
                    value={concepto.cantidad}
                    onChange={(e) => handleInputChange(concepto.id, "cantidad", parseInt(e.target.value))}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Precio de servicio"
                rules={[{ required: true, message: 'Por favor ingresa el precio' }]}>
                  <Input
                    type="number"
                    min="0"
                    value={concepto.precio}
                    onChange={(e) => handleInputChange(concepto.id, "precio", parseFloat(e.target.value))}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Checkbox onChange={() => handleRemoveConcepto(concepto.id)}>
              Eliminar
            </Checkbox>
          </Card></div>
        ))}
        <Button type="primary" onClick={handleAddConcepto} style={{ marginBottom: "16px" }}>
          Añadir Concepto
        </Button>

        <div className="cotizacion-totals-buttons">
          <div className="cotizacion-totals">
            <p>Subtotal: {subtotal.toFixed(2)} MXN</p>
            <p>IVA: {iva.toFixed(2)} MXN</p>
            <p>Total: {total.toFixed(2)} MXN</p>
          </div>
          <div className="cotizacion-action-buttons">
            <div className="margin-button" ><Button type="default" danger>Cancelar</Button></div>
            <div className="margin-button" >
              <Button type="primary" onClick={handleSubmit}>Crear</Button></div>
          </div>
        </div>
      </Form>

      <Modal
      title="Información"
      open={isModalVisible}
      onOk={() => {
        setIsModalVisible(false);
         navigate("/cotizar"); // si deseas redirigir
      }}
      onCancel={() =>{setIsModalVisible(false); navigate("/cotizar");} }
      okText="Cerrar"
    >
      <p>¡Se creó exitosamente!</p>
    </Modal>
    </div>
  );
};

export default RegistroCotizacion;
