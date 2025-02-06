import React, { useState, useEffect } from "react";
import { Tabs, Form, Input, Select, Button, Modal,Upload,Card, message} from "antd";

import "./configuracion.css"
import {  UploadOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { getAllOrganizacion, updateOrganizacion } from "../../apis/organizacionapi";
import { getAllRegimenFiscal } from "../../apis/Regimenfiscla";
import { updateInfoOrdenTrabajo,getInfoOrdenTrabajoById, crearInfoOrdenTrabajo } from "../../apis/infoordentrabajoApi";
import { updateMacaAgua } from "../../apis/MarcaDeAguaApi";

const { TextArea } = Input;



const ConfiguraciónOrganizacion=()=>{
  const [fromOrdenTrabajo] = Form.useForm();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [organizaciones, setOrganizaciones] = useState(null);
  const [regimenfiscal, setRegimenFiscal]=useState([]); 
  const [loading, setLoading] = useState(false); // Para el loading de la actualización
  const [, setinfOrdenTrabajo]=useState([]);

  useEffect(() => {
    
    const fetchOrganizacion = async () => {
      try {
        const response = await getAllOrganizacion();
        console.log("Organización cargada:", response.data);
        const org = response.data.find(item => item.id === 5); // Usamos el id 5 por defecto
        setOrganizaciones(org);  // Almacenamos los datos de la organización
        form.setFieldsValue(org);
        
        
        console.log(org.infoOrdenTrabajo);
        if (org?.infoOrdenTrabajo) {
          console.log(org.infoOrdenTrabajo);
          fetchInfOrdenTrabajo(org.infoOrdenTrabajo); // Obtener infoOrdenTrabajo con el ID
        }
      } catch (error) {
        console.error("Error al obtener las organizaciones", error);
        message.error("Error al obtener la organización.");
      }
    };

    const fetchRegimenFiscal = async () => {
      try {
        const response = await getAllRegimenFiscal();
        setRegimenFiscal(response.data);
      } catch (error) {
        console.error('Error al cargar los regímenes fiscales', error);
      }
    };

    const fetchInfOrdenTrabajo = async (id) => {
      try {
        const response = await getInfoOrdenTrabajoById(id);
        const ordenTrabajo = response.data;

        if (ordenTrabajo) {
   
          setinfOrdenTrabajo(response.data);
          fromOrdenTrabajo.setFieldsValue(response.data); // Carga los datos en el formulario
        }
      } catch (error) {
        console.error("Error al obtener la información de órdenes de trabajo", error);
        message.error("Error al obtener la información.");
      }
    };
    
    fetchRegimenFiscal();
    fetchOrganizacion(); // Llamamos a la función para obtener la organización
    setIsModalVisible(true); // Mostrar el modal
  }, [form,fromOrdenTrabajo]);

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = async (values) => {
    console.log("Datos enviados:", values);

    
    
    setLoading(true);
  try {
    await updateOrganizacion(5, {
      nombre: values.nombre,
      slogan: values.slogan,
      regimenFiscal: values.regimenFiscal, // Asegúrate de que el nombre sea correcto
      telefono: values.telefono,
      pagina: values.pagina,
      calle: values.calle,
      numero: values.numero,
      colonia: values.colonia,
      ciudad: values.ciudad,
      codigoPostal: values.codigoPostal,
      estado: values.estado,
      logo: values.logo,
    });
    setLoading(false);
    message.success("Datos de organización actualizados correctamente");
  } catch (error) {
    setLoading(false);
    message.error("Error al actualizar los datos");
  }
  };

  const handleGuardarOrdenTrabajo = async (values) => {
    try {
      setLoading(true);
  
      let marcaDeAguaId = values.marcaDeAgua; // Si ya hay un ID de marca de agua
  
      // Si el usuario subió una nueva marca de agua, primero la subimos y obtenemos su ID
      if (values.marcaDeAgua instanceof File) {
        const formData = new FormData();
        formData.append("file", values.marcaDeAgua);
  
        const response = await updateMacaAgua(formData); // Llamada a la API para subir la imagen
        marcaDeAguaId = response.data.id; // Obtener el ID de la imagen guardada
      }
  
      // Si la organización no tiene una infoOrdenTrabajo, la creamos
      if (!organizaciones?.infoOrdenTrabajo) {
        const nuevaOrdenTrabajo = await crearInfoOrdenTrabajo({
          ...values,
          marcaDeAgua: marcaDeAguaId,
        });
  
        // Asociamos la nueva orden de trabajo a la organización
        await updateOrganizacion(organizaciones.id, {
          ...organizaciones,
          infoOrdenTrabajo: nuevaOrdenTrabajo.id,
        });
  
        // Actualizamos el estado de la organización con la nueva orden de trabajo
        setOrganizaciones({
          ...organizaciones,
          infoOrdenTrabajo: nuevaOrdenTrabajo.id,
        });
  
        message.success("Orden de trabajo creada y asociada correctamente");
      } else {
        console.log("updateInfoOrdenTrabajo:", updateInfoOrdenTrabajo);
        console.log(organizaciones.infoOrdenTrabajo);
        // Si ya existe una infoOrdenTrabajo, la actualizamos
        await updateInfoOrdenTrabajo(organizaciones.infoOrdenTrabajo, {
          ...values,
          imagenMarcaAgua: values.imagenMarcaAgua,
        });

  
        message.success("Orden de trabajo actualizada correctamente");
      }
  
      // Recargamos la información actualizada
      const responseOrden = await getInfoOrdenTrabajoById(organizaciones.infoOrdenTrabajo);
      setinfOrdenTrabajo(responseOrden.data);
      fromOrdenTrabajo.setFieldsValue(responseOrden.data);
    } catch (error) {
      console.error("Error al actualizar la orden de trabajo", error);
      message.error("Error al actualizar la orden de trabajo.");
    } finally {
      setLoading(false);
    }
  };

  const renderOrganizacion = () => (
     <Form layout="vertical"
     form={form}
      className="form-container"
      onFinish={onFinish}
      initialValues={organizaciones|| {}}>
       <div>
         <Form.Item label="Nombre:" name="nombre" required>
           <Input placeholder="Ingrese el nombre de la organización." />
         </Form.Item>
         <div className="note">
            <p>El nombre del emisor ahora se debe registrar en mayusculas y sin el régimen societario.</p>
            <p>Debe registrarse tal y como se encuentra en la Cédula de Identificación Fiscal y Constancia de Situación Fiscal, respetando números, espacios y signos de puntuación.</p>
            <p>
                  Ejemplo: <br></br>
                  <code>
                  Nombre o Razón Social: Empresa Importante S.A. DE C.V <br></br>
                  Debe colocarse: EMPRESA IMPORTANTE <br></br>
                  Estos datos los puedes obtener en la CIF <br></br>
                  Nota: Esto aplica tanto para personas físicas como morales</code>
            </p><p>
            Clave del Registro Federal de Contribuyentes del Emisor (recuerda que debes tener los CSD del RFC cargados) </p>
         </div>
         <Form.Item label="Slogan:" name="slogan">
           <Input placeholder="Ingrese el slogan de la organización." />
         </Form.Item>
         <Form.Item label="Régimen Fiscal:" name="regimenFiscal" required>
           <Select placeholder="Seleccione el régimen fiscal de la organización.">
             {regimenfiscal.map((regimen)=>(
                <Select.Option key={regimen.id}
                value={regimen.id}>
                  {regimen.codigo}-{regimen.nombre}
                </Select.Option>
              ))}
           </Select>
         </Form.Item>
         <Form.Item label="Teléfono:" name="telefono">
           <Input placeholder="Ingrese el teléfono de contacto de la organización." />
         </Form.Item>
         <Form.Item label="Página web:" name="pagina">
           <Input placeholder="Ingrese la URL de la página web de la organización." />
         </Form.Item>
       </div>
   
       <div>
        <div className="button-container">
          <Link to="/CargaCSD">
         <Button type="primary">Cargar Certificado de Sellos Dijitales</Button>
       </Link>
       </div>
         <Form.Item label="Calle:" name="calle" required>
           <Input placeholder="Ingrese la calle de la dirección de la organización." />
         </Form.Item>
         <Form.Item label="Número:" name="numero" required>
           <Input placeholder="Ingrese el número de la dirección de la organización." />
         </Form.Item>
         <Form.Item label="Colonia:" name="colonia" required>
           <Input placeholder="Ingrese la colonia de la dirección de la organización." />
         </Form.Item>
         <Form.Item label="Ciudad:" name="ciudad" required>
           <Input placeholder="Ingrese la ciudad de la dirección de la organización." />
         </Form.Item>
         <Form.Item label="Código Postal:" name="codigoPostal" required>
           <Input placeholder="Ingrese el código postal de la organización." />
         </Form.Item>
         <Form.Item label="Estado:" name="estado" required>
         <Input placeholder="Ingrese el estado." />
         </Form.Item>
       </div>
   
       <div className="left-column">
         <Form.Item label="Logo Actual:" name="logo">
          <Upload>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload></Form.Item>
       </div>
   
       <div className="button-container">
         <Button type="primary" htmlType="submit" loading={loading}>Guardar configuración</Button>
       </div>
     </Form>
   );
   
   

   const renderCotizaciones = () => (
     <div>
       <div>
         <h3>Guía rápida de etiquetas HTML</h3>
         <p style={{ color: "red" }}>
           No se ha subido ninguna imagen de marca de agua.
         </p>
         <div className="html-guide">
           <p>
             En HTML, puedes aplicar varios tipos de formato a tu texto usando
             etiquetas especiales. Aquí te mostramos las más comunes:
           </p>
           <ul>
             <li>
               <strong>&lt;strong&gt;</strong>: Se utiliza para poner el texto en{" "}
               <strong>negritas</strong>.
             </li>
             <li>
               <em>&lt;em&gt;</em>: Se usa para poner el texto en <em>cursiva</em>.
             </li>
             <li>
               <code>&lt;code&gt;</code>: Para marcar el <code>código</code> dentro
               del texto.
             </li>
             <li>
               <p>&lt;p&gt;: Para crear un párrafo separado dentro de tu
               documento.</p>
             </li>
             <li>
               <ul>
                 <li>
                   &lt;ul&gt; y &lt;li&gt;: Para crear listas con viñetas.
                 </li>
               </ul>
             </li>
           </ul>
           <p>Aquí tienes un ejemplo práctico:</p>
           <Card>
           <code>
              &lt;p&gt;Este es un texto normal con &lt;strong&gt;negritas&lt;/strong&gt;, &lt;em&gt;cursivas&lt;/em&gt; y &lt;code&gt;código&lt;/code&gt; en línea.&lt;/p&gt;</code><br></br>
              <code>
              &lt;ul&gt;<br></br>
              &lt;li&gt;Primer ítem&lt;/li&gt;<br></br>
              &lt;li&gt;Segundo ítem&lt;/li&gt;<br></br>
              &lt;li&gt;Tercer ítem&lt;/li&gt;<br></br>
              &lt;/ul&gt;           
          </code>
          </Card>
           <p>Este código se renderiza de la siguiente forma:</p>
           <ul>
             <li>Primer ítem</li>
             <li>Segundo ítem</li>
             <li>Tercer ítem</li>
           </ul>
         </div>
       </div>
   
       <div>
         <Form layout="vertical" 
         className="form-container">
           <Form.Item label="Nombre formato:" name="nombreFormato" required>
             <Input placeholder="Ingrese el nombre del formato." />
           </Form.Item>
           <Form.Item label="Versión:" name="version">
             <Input placeholder="Ingrese la versión del formato." />
           </Form.Item>
           <Form.Item label="Emisión:" name="emision">
             <Input placeholder="Ingrese la fecha de emisión." />
           </Form.Item>
           <Form.Item label="Título documento:" name="tituloDocumento">
             <Input placeholder="Ingrese el título del documento." />
           </Form.Item>
           <Form.Item label="Mensaje propuesta:" name="mensajePropuesta">
             <TextArea
               rows={4}
               placeholder="Ingrese el mensaje propuesto para la cotización."
             />
           </Form.Item>
           <Form.Item label="Términos:" name="terminos">
             <TextArea rows={4} placeholder="Ingrese los términos del documento." />
           </Form.Item>
           <Form.Item label="Avisos:" name="avisos">
             <TextArea rows={4} placeholder="Ingrese los avisos necesarios." />
           </Form.Item>
           <Form.Item label="Imagen marca de agua:" name="marcaDeAgua">
             <Input type="file" />
           </Form.Item>
           <div className="button-container">
             <Button type="primary" style={{ marginRight: "8px" }}>
               Guardar Cotización
             </Button>
             <Button type="default">Generar Cotización de Prueba Formato Actual</Button>
           </div>
         </Form>
       </div>
     </div>
   );
   

   const renderOrdenesTrabajo = () => (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h1>Órdenes de Trabajo</h1>
      <p style={{ color: "red", fontWeight: "bold" }}>
        No se ha subido ninguna imagen de marca de agua.
      </p>
      <Form
        form={fromOrdenTrabajo} // Vincula el formulario con fromOrdenTrabajo
        layout="vertical"
        onFinish={handleGuardarOrdenTrabajo}
      >
        <Form.Item label="Nombre formato:" name="nombreFormato" required>
          <Input placeholder="Ingrese el nombre del formato de orden de trabajo." />
        </Form.Item>
        <Form.Item label="Versión:" name="version">
          <Input placeholder="Ingrese la versión del formato." />
        </Form.Item>
        <Form.Item label="Emisión:" name="fechaEmision">
          <Input placeholder="Ingrese la fecha de emisión." />
        </Form.Item>
        <Form.Item label="Título documento:" name="tituloDocumento">
          <Input placeholder="Ingrese el título del documento." />
        </Form.Item>
        <Form.Item label="Imagen marca de agua:" name="imagenMarcaAgua">
          <Upload beforeUpload={() => false}>
            <Button icon={<UploadOutlined />}>Seleccionar archivo</Button>
          </Upload>
        </Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
          Guardar Orden
        </Button>
      </Form>
    </div>
  );
   

   const renderConfiguracionSistema = () => (
     <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h1>Configuración del Sistema</h1>
       <Form layout="vertical">
         <Form.Item label="Moneda Predeterminada:" name="moneda" required>
           <Select placeholder="Seleccione la moneda predeterminada.">
             <Select.Option value="mxn">MXN - Moneda Nacional Mexicana</Select.Option>
             <Select.Option value="usd">USD - Dólar Estadounidense</Select.Option>
           </Select>
         </Form.Item>
         <Form.Item label="Tasa de IVA Predeterminada:" name="iva" required>
           <Select placeholder="Seleccione la tasa de IVA predeterminada.">
             <Select.Option value="8">8%</Select.Option>
             <Select.Option value="16">16%</Select.Option>
           </Select>
         </Form.Item>
         <Form.Item label="Formato de Número de Cotización:" name="formatoCotizacion">
         <Select placeholder="Seleccione la tasa de IVA predeterminada.">
             <Select.Option value="8">8%</Select.Option>
             <Select.Option value="16">16%</Select.Option>
          </Select>
         </Form.Item>
         <Form.Item label="Tipo de cambio dólar:" name="tipoCambio">
           <Input placeholder="Ingrese el tipo de cambio del dólar." />
         </Form.Item>
         <Button type="primary" loading={loading} style={{ width: "100%" }}>
           Guardar configuración de sistema
         </Button>
       </Form>
     </div>
   );
   
     return(
          <div className="main-container">
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="Organización" key="1">
              {renderOrganizacion()}
            </Tabs.TabPane>
            <Tabs.TabPane tab="Cotizaciones" key="2">
              {renderCotizaciones()}
            </Tabs.TabPane>
            <Tabs.TabPane tab="Órdenes de Trabajo" key="3">
              {renderOrdenesTrabajo()}
            </Tabs.TabPane>
            <Tabs.TabPane tab="Configuración del sistema" key="4">
              {renderConfiguracionSistema()}
            </Tabs.TabPane>
          </Tabs>
    
          {/* Modal de alerta */}
          <Modal
            title="¡Alerta!"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Sí, seguro"
            cancelText="No, cancelar"
          >
            <p>¿Estás seguro? No podrás revertir los cambios.</p>
          </Modal>
        </div>
      );
};
export default ConfiguraciónOrganizacion;