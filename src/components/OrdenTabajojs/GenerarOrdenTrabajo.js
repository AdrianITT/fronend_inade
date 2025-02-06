import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, Row, Col,Checkbox, Modal, message, Divider, Card} from "antd";
//import { CloseCircleOutlined  } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import "./cssOrdenTrabajo/GenerarOrdenTrabajo.css";
import { getAllCliente } from "../../apis/ClienteApi";
import { getAllEmpresas } from "../../apis/EmpresaApi";
import { getAllReceptor, createReceptor } from "../../apis/ResectorApi";
import { getServicioById } from "../../apis/ServiciosApi";
import { getCotizacionById } from "../../apis/CotizacionApi";
import { getCotizacionServiciosByCotizacion } from "../../apis/CotizacionServicioApi";
import { createOrdenTrabajo } from "../../apis/OrdenTrabajoApi";
import { createOrdenTrabajoServico } from "../../apis/OrdenTabajoServiciosApi";
const { TextArea } = Input;
const { Option } = Select;

const GenerarOrdenTrabajo = () => {
  const [form] = Form.useForm();
  const [formModal] = Form.useForm(); // Formulario para el moda
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cliente, setCliente] = useState({});
  const [empresas, setEmpresa] = useState({});
  const [receptor, setReceptor] = useState([]);
  const { id } = useParams();
  const [servicios, setServicios] = useState([]);
  const [cotizacionId] = useState(id);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [newOrderId, setNewOrderId] = useState(null);
  const navigate=useNavigate();
  

  //const [selectedServicios, setSelectedServicios] = useState([]); // Servicios seleccionados por el usuario


  useEffect(() => {
    
    const fetchReceptor= async () =>{
      try{
        const response=await getAllReceptor();
        setReceptor(response.data);
      }catch(error){console.error('Error al cargar los receptores', error);}
    };

    const fetchCotizacionServicios = async () => {
      try {
        const cotizacionResponse = await getCotizacionById(cotizacionId);  // Obtener la cotización por ID
        const cotizacionServicios = cotizacionResponse.data.servicios; // Servicios de la cotización
        //const servicioIds = cotizacionServicios.servicios;

         // Paso 2: Obtener los registros de cotizacionServicio para esta cotización
        const cotizacionServicioResponse = await getCotizacionServiciosByCotizacion(cotizacionId);
        const cotizacionServicioRecords = cotizacionServicioResponse.data;
        
        const servicios = await Promise.all(
          cotizacionServicios.map(async (servicioId) => {
            const servicioResponse = await getServicioById(servicioId);  // Obtener servicio por ID
            const record = cotizacionServicioRecords.find(
              (r) => r.servicio === servicioId
            );
            return {
              ...servicioResponse.data,           // Datos del servicio (nombre, precio, etc.)
              cantidad: record ? record.cantidad : 0 // Si no se encuentra, 0 o el valor que prefieras
            };
          })
        );
        setServicios(servicios);
        
      } catch (error) {
        console.error("Error al obtener los servicios de la cotización", error);
      }
    };

    const fetchCliente = async () => {
      try {
        
        console.log("estee es el id",id);
        const response = await getAllCliente(id); // Obtener los datos del cliente por su ID
        
        setCliente(response.data[0]); // Guardar los datos del cliente en el estado
        
        // Revisar si empresa está dentro de un objeto, o si falta información
        const empresaId = response.data[0].empresa;
        console.log("ID de la empresa:", empresaId);
  
        if (empresaId) {
          const empresasResponse = await getAllEmpresas();
          console.log("Empresas:", empresasResponse.data); // Verifica las empresas
  
          const empresaRelacionada = empresasResponse.data.find(emp => emp.id === empresaId);
          console.log("Empresa relacionada:", empresaRelacionada);
  
          if (empresaRelacionada) {
            setEmpresa(empresaRelacionada); // Asegúrate de que empresaRelacionada es un objeto
            // Actualiza los valores del formulario después de obtener los datos
            form.setFieldsValue({
              calle: empresaRelacionada.calle,
              numero: empresaRelacionada.numero,
              colonia: empresaRelacionada.colonia,
              codigoPostal: empresaRelacionada.codigoPostal,
              ciudad: empresaRelacionada.ciudad,
              estado: empresaRelacionada.estado
            });
          } else {
            console.error("Empresa no encontrada.");
          }
        }
      } catch (error) {
        console.error("Error al cargar los datos del cliente", error);
      }
    };
    fetchReceptor();
    fetchCliente();
    fetchCotizacionServicios();
  }, [id, form,cotizacionId]);
  

  const onFinish = async (values) => {
    try {
      // 1. Crear la orden de trabajo  
      // Se asume que el receptor seleccionado está en values.receptor
      const ordenData = {
        receptor: values.receptor,
        cotizacion: cotizacionId,
        estado: 2  // valor por defecto 2
      };
      const ordenResponse = await createOrdenTrabajo(ordenData);
      // Suponemos que el backend retorna el registro creado con su ID (por ejemplo, ordenResponse.data.id)
      const ordenTrabajoId = ordenResponse.data.id;

      // 2. Insertar los conceptos en la tabla cotizacionServicio  
      // Por cada concepto, insertar: cantidad, descripción, ordenTrabajoId, y el id del servicio
      for (const concepto of servicios) {
        const dataServicio = {
          cantidad: concepto.cantidad,
          descripcion: concepto.nota, // Puedes obtener este valor desde el formulario o dejarlo vacío si lo deseas
          ordenTrabajo: ordenTrabajoId, // ID de la orden creada
          servicio: concepto.id   // Suponemos que el id del servicio es el mismo que concepto.id
        };
        await createOrdenTrabajoServico(dataServicio);
      }

      setNewOrderId(ordenTrabajoId);

      message.success("Orden de trabajo y servicios creados correctamente");
      // Opcional: redirigir o limpiar el formulario
      setIsSuccessModalOpen(true);

    } catch (error) {
      console.error("Error al crear la orden de trabajo o los servicios", error);
      message.error("Error al crear la orden de trabajo o los servicios");
    }
  };


  // Función para manejar la selección de servicio
  const handleServicioChange = (conceptoId, value) => {
    setServicios((prevConceptos) =>
      prevConceptos.map((concepto) =>
        concepto.id === conceptoId ? { ...concepto, servicio: value } : concepto
      )
    );
  };

  // Función para manejar el cambio de cantidad o precio
  const handleInputChange = (conceptoId, field, value) => {
    setServicios((prevConceptos) =>
      prevConceptos.map((concepto) =>
        concepto.id === conceptoId ? { ...concepto, [field]: value } : concepto
      )
    );
  };

  // Función para agregar un nuevo concepto
  const handleAddConcepto = () => {
    setServicios((prevConceptos) => [
      ...prevConceptos,
      { id: prevConceptos.length + 1, servicio: null, cantidad: 1, precio: 0 }
    ]);
  };

  // Función para eliminar un concepto
  const handleRemoveConcepto = (conceptoId) => {
    setServicios((prevConceptos) => prevConceptos.filter((concepto) => concepto.id !== conceptoId));
  };


  const handleCreateReceptor = async (values) => {
    try {
      const receptorData = {
        ...values, // Campos del formulario
        organizacion: cliente.empresa, // Agregar el ID de la empresa manualmente
      };

      // Crear el receptor
      const response = await createReceptor(receptorData);
      console.log(response.data);
      message.success("Receptor creado correctamente");

      // Actualiza la lista de receptores
      const updatedReceptors = await getAllReceptor();
      setReceptor(updatedReceptors.data);

      // Cierra el modal
      setIsModalOpen(false);
      formModal.resetFields(); // Limpia el formulario del modal
    } catch (error) {
      console.error("Error al crear el receptor", error);
      message.error("Error al crear el receptor");
    }
  };


  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    formModal.submit(); // Envía el formulario del modal
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    formModal.resetFields(); // Limpia el formulario del modal
  };

  return (
    <div className="orden-trabajo-container">
      <h1 className="orden-trabajo-title">Generar Orden de Trabajo para Cotización 0001</h1>

      <div className="orden-trabajo-info">
        <p>
          <strong>Por favor, complete todos los campos requeridos con la información correcta.</strong> La información para generar esta "Orden de Trabajo" se obtiene de la cotización. Tenga en cuenta que cualquier cambio o actualización también se reflejará en la cotización correspondiente.
        </p>
      </div>

      <div className="orden-trabajo-card">
        <h3>Información del cliente</h3>
        {cliente && Object.keys(cliente).length > 0 ? (
          <div>
            <p><strong>Nombre:</strong> {`${cliente.nombrePila} ${cliente.apPaterno} ${cliente.apMaterno}`}</p>
            <p><strong>Email:</strong> {cliente.correo}</p>
            <p><strong>Teléfono:</strong> {cliente.telefono}</p>
            <p><strong>Celular:</strong> {cliente.celular}</p>
            <p><strong>Fax:</strong> {cliente.fax}</p>
            <p><strong>Dirección:</strong> {empresas ? `${empresas.calle} ${empresas.numero}, ${empresas.colonia}, ${empresas.ciudad}, ${empresas.estado}, C.P. ${empresas.codigoPostal}` : 'No disponible'}</p>
          </div>
        ) : (
          <p>Cargando información del cliente...</p>
        )}
      </div>

      <div className="orden-trabajo-warning">
        <p>Mínimo un Receptor, Dato del proyecto y Dirección!!</p>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="orden-trabajo-form"
        initialValues={{
          receptor: '',  // Aquí podrías colocar un valor inicial si tienes un receptor predeterminado
          calle: empresas ? empresas.calle : '',
          numero: empresas ? empresas.numero : '',
          colonia: empresas ? empresas.colonia : '',
          codigoPostal: empresas ? empresas.codigoPostal : '',
          ciudad: empresas ? empresas.ciudad : '',
          estado: empresas ? empresas.estado : ''
        }}
      >
        <h2 className="section-title">Receptor</h2>
        <Row align="middle" gutter={16}>
          <Col span={20}>
            <Form.Item
              name="receptor"
              label="Seleccione el receptor de la orden"
              rules={[{ required: true, message: "Seleccione un receptor" }]}
            >
              <Select placeholder="Seleccione un receptor" className="form-select">
                {receptor.map((recep)=>(
                  <Option key={recep.id} 
                  value={recep.id}>
                  {recep.nombrePila} {recep.apPaterno} {recep.apMaterno}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
          <Button
            type="primary"
            icon={<i className="fas fa-user-plus"></i>}
            style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
            onClick={showModal}
          >
            Agregar Receptor
          </Button>
          </Col>
        </Row>

        <h2 className="section-title">Dirección</h2>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="calle"
              label="Calle"
              rules={[{ required: true, message: "Ingrese la calle" }]}
            >
              <Input placeholder="Ingrese la calle" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="numero"
              label="Número"
              rules={[{ required: true, message: "Ingrese el número" }]}
            >
              <Input placeholder="Número" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="codigoPostal"
              label="Código Postal"
              rules={[{ required: true, message: "Ingrese el código postal" }]}
            >
              <Input placeholder="Código Postal" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="colonia"
              label="Colonia"
              rules={[{ required: true, message: "Ingrese la colonia" }]}
            >
              <Input placeholder="Colonia" />
            </Form.Item>



          </Col>
          <Col span={6}>
            <Form.Item
              name="ciudad"
              label="Ciudad"
              rules={[{ required: true, message: "Ingrese la ciudad" }]}
            >
              <Input placeholder="Ciudad" />
            </Form.Item>
            
          </Col>
          <Col span={6}>
            <Form.Item
              name="estado"
              label="Estado"
              rules={[{ required: true, message: "Ingrese el estado" }]}
            >
              <Input placeholder="Estado" />
            </Form.Item>
          </Col>
        </Row>
                {/* Servicios */}
        <Divider>Agregar Conceptos</Divider>
        {servicios.map((concepto) => (
          <div key={concepto.id}>
            <Card>
              <h3>Concepto {concepto.id}</h3>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Servicio" rules={[{ required: true, message: 'Por favor ingresa el servicio.' }]}>
                    <Select
                      placeholder="Selecciona un servicio"
                      value={concepto.id}
                      onChange={(value) => handleServicioChange(concepto.id, "nombreServicio",value)}
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
                  <Form.Item label="cantiadad de servicio" rules={[{ required: true, message: 'Por favor ingresa el precio' }]}>
                    <Input
                      type="number"
                      min="0"
                      value={concepto.cantidad}
                      onChange={(e) => handleInputChange(concepto.id, "cantidad", parseFloat(e.target.value))}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Notas">
                  <TextArea
                  rules={[{ required: true, message: 'Por favor ingresa la nota.' }]}
                    placeholder="Escribe aquí la nota para este servicio"
                    value={concepto.nota}
                    onChange={(e) => handleInputChange(concepto.id, "nota", e.target.value)}
                    rows={2}
                  />
                </Form.Item>
              </Col>
            </Row>
              <Checkbox onChange={() => handleRemoveConcepto(concepto.id)}>
              Eliminar
              </Checkbox>
            </Card>
          </div>
        ))}
        <Col span={5}>
        <Button type="primary" onClick={handleAddConcepto} style={{ marginBottom: "16px" }}>
          Añadir Concepto
        </Button></Col>
        <div className="form-buttons">
          <Button type="primary" htmlType="submit" className="register-button">
            Registrar
          </Button>
          <Button type="default" className="cancel-button">
            Cancelar
          </Button>
        </div>
      </Form>


      <div>
      {/* Modal con el formulario reseptor*/}
      <Modal
        title="Agregar Receptor"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="cancelar" onClick={handleCancel}>
            Cancelar
          </Button>,
          <Button key="guardar" type="primary" onClick={handleOk}>
            Guardar
          </Button>,
        ]}
      >
        <Form form={formModal} layout="vertical" onFinish={handleCreateReceptor}>
          <Form.Item
                name="nombrePila"
                label="Nombre"
                rules={[{ required: true, message: 'Por favor ingrese el nombre' }]}
              >
                <Input placeholder="Nombre" />
              </Form.Item>
            <Form.Item
            name="apPaterno"
            label="Apellido Paterno"
            rules={[{ required: true, message: 'Por favor ingrese el apellido paterno' }]}
          >
            <Input placeholder="Apellido Paterno" />
          </Form.Item>
          <Form.Item
              name="apMaterno"
              label="Apellido Materno"
              rules={[{ required: true, message: 'Por favor ingrese el apellido materno' }]}
            >
              <Input placeholder="Apellido Materno" />
            </Form.Item>
            <Form.Item
              name="correo"
              label="Correo Electrónico"
              rules={[{ required: true, type: 'email', message: 'Por favor ingrese un correo válido' }]}
            >
              <Input placeholder="Correo electrónico" />
            </Form.Item>
          <Form.Item
            label="Celular:"
            name="celular"
            rules={[{ required: true, message: "Por favor ingrese el número de celular" }]}
          >
            <Input placeholder="Celular" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal de éxito */}
      <Modal
        title="Orden Creada"
        open={isSuccessModalOpen}
        onOk={() => setIsSuccessModalOpen(false)}
        onCancel={() => setIsSuccessModalOpen(false)}
        footer={[
          <Button
            key="ok"
            type="primary"
            onClick={() => {setIsSuccessModalOpen(false); navigate(`/DetalleOrdenTrabajo/${newOrderId}`);}}
          >
            Cerrar
          </Button>,
        ]}
      >
        <p>¡La orden de trabajo se creó exitosamente!</p>
      </Modal>
    </div>
    </div>
  );
};

export default GenerarOrdenTrabajo;
