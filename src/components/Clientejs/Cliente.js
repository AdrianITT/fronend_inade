import React, { useState, useCallback, useEffect} from 'react';
import { Checkbox, Tabs, Table, Input, Form, Button, Modal, Select, Row, Col, Spin, Result } from 'antd';
import StickyBox from 'react-sticky-box';
import './Cliente.css';
import { Link, useNavigate} from "react-router-dom";
import { ExclamationCircleOutlined, EditOutlined, CloseOutlined } from "@ant-design/icons";
import {getAllCliente, createCliente, deleteCliente} from '../../apis/ClienteApi';
import {getAllEmpresas,createEmpresas} from '../../apis/EmpresaApi';
import { getAllTitulo } from '../../apis/TituloApi';
import { getAllRegimenFiscal } from '../../apis/Regimenfiscla';
import { getAllTipoMoneda } from '../../apis/Moneda';



const dataTab2 = [
  { key: '1', Cliente: 'John Doe', Empresa: 'Empresa', Correo: 'New York' },
  { key: '2', Cliente: 'John Doe', Empresa: 'Empresa', Correo: 'New York' },
  { key: '3', Cliente: 'John Doe', Empresa: 'Empresa', Correo: 'New York' },
  { key: '4', Cliente: 'John Doe', Empresa: 'Empresa', Correo: 'New York' },
  { key: '5', Cliente: 'John Doe', Empresa: 'Empresa', Correo: 'New York' },
];

const Cliente = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createCompany, setCreateCompany] = useState(false); // Estado para controlar el checkbox
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cliente, setCliente] = useState([]);
  const [form] = Form.useForm();
  const navigate= useNavigate();
  const [titulos, setTitulos] = useState([]);
  const [clienteIdToDelete, setClienteIdToDelete] = useState(null); // Para guardar el ID del cliente a eliminar
  const [regimenfiscal, setRegimenFiscal]=useState([]); 
  const [tipomoneda, setTipoMoneda]=useState([]);
 const [empresas, setEmpresas] = useState([]);
 const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
 const [loading, setLoading] = useState(true); // Estado para controlar la carga

  useEffect(() => {
      const fetchRegimenFiscal= async()=>{
        try{
          setLoading(true);
          const response=await getAllRegimenFiscal();
          setRegimenFiscal(response.data);
        }catch(error){
        console.error('Error al cargar los titulos', error);
        }finally{
          setLoading(false);
        }
      };
      const fetchTipoMoneda= async()=>{
        try{
            const response=await getAllTipoMoneda();
            setTipoMoneda(response.data);
        }catch(error){
        console.error('Error al cargar los titulos', error);
        }finally{
          setLoading(false);
        }
      };
      const fetchEmpresa = async()=>{
        try{
          const response=await getAllEmpresas();
          setEmpresas(response.data);
      }catch(error){
      console.error('Error al cargar los titulos', error);
      }finally{
        setLoading(false);
      }
      };
      fetchTipoMoneda();
      fetchRegimenFiscal();
      fetchEmpresa();
      
    }, []);

  // Función que elimina el cliente
  const handleDeleteCliente = async (id) => {
    try {
      // Llamamos a la API para eliminar el cliente
      await deleteCliente(id);
      
      // Filtramos el cliente eliminado de la lista
      setCliente(cliente.filter((item) => item.key !== id));

      // Cerramos el modal de confirmación
      setIsModalVisible(false);
    } catch (error) {
      console.log('Error al eliminar el cliente', error);
    }
  };



  /*filtro de empresa */

  const loadgetAllEmpresas = useCallback(async () => {
    const res = await getAllEmpresas(); // Suponiendo que esta es la función que obtienes todas las empresas
    const empresasData = res.data ? res.data : res;
    
    const empresaMap = empresasData.reduce((acc, empresa) => {
      acc[empresa.id] = empresa.nombre; // Asumiendo que la empresa tiene un 'id' y 'nombre'
      return acc;
    }, {});
  
    return empresaMap; // Este objeto contendrá las empresas con su id como clave y su nombre como valor
  }, []);
  

  /*Despliege de informacion de la tabla  */
const loadgetAllCliente=useCallback(async ()=>{
  const empresas = await loadgetAllEmpresas();
  const res =await getAllCliente();
  const clientesData = res.data ? res.data : res;

  const formattedData =clientesData.map((cliente)=>({
    key:cliente.id,
    Cliente:`${cliente.nombrePila} ${cliente.apPaterno} ${cliente.apMaterno}`,
    Empresa:empresas[cliente.empresa] || 'Empresa no encontrada',
    Correo: cliente.correo,
  }));
  setCliente(formattedData);
},[loadgetAllEmpresas]);

useEffect(() => {
  const fetchTitulos = async () => {
    try {
      const response = await getAllTitulo();
      setTitulos(response.data);  // Guardar los títulos en el estado
    } catch (error) {
      console.error('Error al cargar los títulos:', error);
    }
  };
  fetchTitulos();
    loadgetAllCliente();
  }, [loadgetAllCliente]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  // 1. Función auxiliar que crea la empresa (si es necesario) y luego el cliente:
const createClientAndReturnId = async (formValues, createCompany) => {
  // Primero, si 'createCompany' está marcado, creamos la empresa
  if (createCompany) {
    const empresaData = {
      nombre: formValues.nombre,
      rfc: formValues.rfc,
      regimenFiscal: parseInt(formValues.regimenFiscal),
      tipoMoneda: parseInt(formValues.tipoMoneda),
      condicionPago: formValues.condicionPago,
      calle: formValues.calle,
      numero: formValues.numero,
      colonia: formValues.colonia,
      ciudad: formValues.ciudad,
      codigoPostal: formValues.codigoPostal,
      estado: formValues.estado,
      organizacion: parseInt(formValues.organizacion),
    };
    const createEmpresaResponse = await createEmpresas(empresaData);
    if (createEmpresaResponse && createEmpresaResponse.data) {
      // Asignamos la empresa recién creada al formValues
      formValues.empresa = createEmpresaResponse.data.id;
    }
  }

  // Ahora creamos el cliente
  const createClienteResponse = await createCliente(formValues);
  if (createClienteResponse && createClienteResponse.data) {
    // Retornamos el ID del cliente recién creado
    return createClienteResponse.data.id;
  }
  // En caso de error o sin data, retornamos null
  return null;
};

// 2. handleOk (Crear Cliente) sin repetir la lógica
const handleOk = async () => {
  try {
    const formValues = await form.validateFields();
    const newClientId = await createClientAndReturnId(formValues, createCompany);

    if (newClientId) {
      loadgetAllCliente(); // Recargar la tabla
      setIsModalOpen(false); // Cerrar el modal
    }
  } catch (error) {
    console.log("Error al crear cliente", error);
  }
};

// 3. handleCreateAndCotizar (Crear y Cotizar) también llama a la función auxiliar
const handleCreateAndCotizar = async () => {
  try {
    const formValues = await form.validateFields();
    const newClientId = await createClientAndReturnId(formValues, createCompany);

    if (newClientId) {
      loadgetAllCliente();
      setIsModalOpen(false);
      navigate(`/crear_cotizacion/${newClientId}`); // Redirigir a la ruta que desees
    }
  } catch (error) {
    console.log("Error al crear y cotizar", error);
  }
};

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleCheckboxChange = (e) => {
    setCreateCompany(e.target.checked);
  };

  const showModalAlert = (id) => {
    setClienteIdToDelete(id);
    setIsModalVisible(true);
  };

  const handleOkAlert = () => {
    if (clienteIdToDelete) {
      handleDeleteCliente(clienteIdToDelete);}
    console.log("Eliminado");
    setIsModalVisible(false);
  };

  const handleCancelAlert = () => {
    console.log("Cancelado");
    setIsModalVisible(false);
  };

  const columnsTab1 = [
    { title: '#', dataIndex: 'key', key: 'key' },
    { title: 'Cliente', dataIndex: 'Cliente', key: 'Cliente' },
    { title: 'Empresa', dataIndex: 'Empresa', key: 'Empresa' },
    { title: 'Correo', dataIndex: 'Correo', key: 'Correo' },
    {
      title: 'Acción',
      key: 'action',
      render: (_, record) => (
        <div className="action-buttons">
          <Link to={`/crear_cotizacion/${record.key}`}>
            <Button className="action-button-cotizar">Cotizar</Button>
          </Link>
          <Link to={`/EditarCliente/${record.key}`}>
            <Button className="action-button-edit">
              <EditOutlined />
            </Button>
          </Link>
          <Button className="action-button-delete" onClick={() => showModalAlert(record.key)}>
            <CloseOutlined />
          </Button>
        </div>
      ),
    },
  ];

  const columnsTab2 = [
    { title: '#', dataIndex: 'key', key: 'key' },
    { title: 'Cliente', dataIndex: 'Cliente', key: 'Cliente' },
    { title: 'Empresa', dataIndex: 'Empresa', key: 'Empresa' },
    { title: 'Correo', dataIndex: 'Correo', key: 'Correo' },
  ];

  const renderTabBar = (props, DefaultTabBar) => (
    <StickyBox
      offsetTop={64}
      offsetBottom={20}
      style={{
        zIndex: 1,
      }}
    >
      <DefaultTabBar {...props} />
    </StickyBox>
  );

  return (
    <div className="container-center">
      
      <h1 className="title-center">Clientes</h1>
      {loading ? ( // Mostrar Spin si loading es true
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Spin size="large" tip="Cargando clientes..." />
        </div>
      ) : (
        <>
      <div className="search-bar">
        <Input.Search
          placeholder="Buscar proyectos..."
          enterButton="Buscar"
          style={{ width: "300px" }}
        />
      </div>
      <div className="button-top-container">
        <Button type="primary" onClick={showModal}>
          Añadir Cliente
        </Button>
      </div>
      <div className="tab-center">
        <Tabs
          defaultActiveKey="1"
          renderTabBar={renderTabBar}
          items={[
            {
              label: 'Clientes Activos',
              key: '1',
              children: (
                
                <Table columns={columnsTab1} dataSource={cliente}/>
              ),
            },
            {
              label: 'Clientes Inactivos',
              key: '2',
              children: (
                <Table
                  dataSource={dataTab2}
                  columns={columnsTab2}
                  bordered
                  pagination={{
                    pageSize: 5,
                    showSizeChanger: true,
                    pageSizeOptions: ['3', '5', '10'],
                  }}
                />
              ),
            },
          ]}
        />
      </div>
      </>
    )}

      <Modal
        title="Añadir Cliente"
        open={isModalOpen}
        onCancel={handleCancel}
        width={800}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancelar
          </Button>,
          <Button key="create" type="primary" onClick={handleOk}>
            Crear Cliente
          </Button>,
          <Button key="create-quote" type="primary" style={{ backgroundColor: '#1890ff' }} onClick={handleCreateAndCotizar}>
            Crear y Cotizar
          </Button>,
        ]}
      >
        <Form
          name="clienteForm"
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Nombre:"
                name="nombrePila"
                rules={[{ required: true, message: 'Por favor ingresa el nombre.' }]}
              >
                <Input placeholder="Ingresa Nombre del cliente" />
              </Form.Item>
              <Form.Item
                label="Apellidos paterno:"
                name="apPaterno"
                rules={[{ required: true, message: 'Por favor ingresa los apellidos.' }]}
              >
                <Input placeholder="Ingresa Ambos apellidos del cliente" />
              </Form.Item>
              <Form.Item
                label="Apellidos materno:"
                name="apMaterno"
                rules={[{ required: true, message: 'Por favor ingresa los apellidos.' }]}
              >
                <Input placeholder="Ingresa Ambos apellidos del cliente" />
              </Form.Item>
              <Form.Item label="Título:" name="titulo">
              <Select>
                {titulos.map((titulo)=>(
                  <Select.Option key={titulo.id} 
                  value={titulo.id}>
                  {titulo.titulo} - {titulo.abreviatura}
                  </Select.Option>
                ))}
                </Select>
              </Form.Item>  
            </Col>
            <Col span={12}>
              <Form.Item
                label="Correo Electrónico:"
                name="correo"
                rules={[{ required: true, message: 'Por favor ingresa un correo electrónico.' }]}
              >
                <Input placeholder="Correo electrónico" />
              </Form.Item>
              <Form.Item label="Teléfono:" name="telefono">
                <Input placeholder="teléfono" />
              </Form.Item>
              <Form.Item
                label="Celular:"
                name="celular"
                rules={[{ required: true, message: 'Por favor ingresa un número de celular.' }]}
              >
                <Input placeholder="Celular" />
              </Form.Item>
              <Form.Item label="Fax:" name="fax">
                <Input placeholder="Fax" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="createCompany" valuePropName="checked">
            <Checkbox onChange={handleCheckboxChange}>Crear empresa</Checkbox>
          </Form.Item>
          {createCompany ? (
            <div>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Nombre empresa:"
                    name="nombre"
                    rules={[
                      { required: true, message: 'Por favor ingresa el nombre de la empresa.' },
                    ]}
                  >
                    <Input placeholder="Ingresa el Nombre de la Empresa" />
                  </Form.Item>
                  <Form.Item label="Régimen fiscal:" name="regimenFiscal">
                    <Select>
                        {regimenfiscal.map((regimen)=>(
                          <Select.Option key={regimen.id}
                          value={regimen.id}>
                            {regimen.codigo}-{regimen.nombre}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="RFC:"
                    name="rfc"
                    rules={[{ required: true, message: 'Por favor ingresa el RFC.' }]}
                  >
                    <Input placeholder="Ingrese RFC" />
                  </Form.Item>
                  <Form.Item label="Moneda:" name="tipoMoneda">
                    <Select>
                    {tipomoneda.map((moneda)=>(
                            <Select.Option key={moneda.id}
                            value={moneda.id}>
                              {moneda.nombre}
                            </Select.Option>
                          ))}
                    </Select>
                    </Form.Item>
     
                    <Form.Item
                         label="Condiciones pago:"
                         name="condicionPago"
                         rules={[
                         {
                              required: true,
                         },
                         ]}>
                    <Input />
     
                    </Form.Item>
                    <Form.Item label="organizacion" name="organizacion">
                    <Select>
                        <Select.Option id="1" value={1}>organizacion</Select.Option>
                    </Select>
                    </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Calle:"
                    name="calle"
                    rules={[{ required: true, message: 'Por favor ingresa la calle.' }]}
                  >
                    <Input placeholder="Calle" />
                  </Form.Item>
                  <Form.Item
                    label="Número:"
                    name="numero"
                    rules={[{ required: true, message: 'Por favor ingresa el número.' }]}
                  >
                    <Input placeholder="Número" />
                  </Form.Item>
                  <Form.Item
                    label="Colonia:"
                    name="colonia"
                    rules={[{ required: true, message: 'Por favor ingresa la colonia.' }]}
                  >
                    <Input placeholder="Colonia" />
                  </Form.Item>
                  <Form.Item
                    label="Ciudad:"
                    name="ciudad"
                    rules={[
                    {
                         required: true,
                    },
                    ]}>
               <Input />
               </Form.Item>
               <Form.Item
                    label="Codigo Postal:"
                    name="codigoPostal"
                    rules={[
                    {
                         required: true,
                    },
                    ]}>
               <Input />
               </Form.Item>
               <Form.Item
                    label="Estado:"
                    name="estado"
                    rules={[
                    {
                         required: true,
                    },
                    ]}>
               <Input />
               </Form.Item>
                </Col>
              </Row>
            </div>
          ) : (
            <Form.Item
              label="Empresa:"
              name="empresa"
              rules={[
                { required: true, message: 'Por favor selecciona una empresa o crea una nueva.' },
              ]}
            >
              <Select placeholder="Selecciona una empresa o crea una nueva">
                {empresas.map((empresa)=>(
                  <Select.Option key={empresa.id}
                  value={empresa.id}>
                    {empresa.nombre}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
      {/* en este modal se muestra la alerta al borrar un usuario*/}
      <Modal
        title={
          <div style={{ textAlign: "center" }}>
            <ExclamationCircleOutlined style={{ fontSize: "42px", color: "#faad14" }} />
            <p style={{ marginTop: "8px" }}>¿Estás seguro?</p>
          </div>
        }
        visible={isModalVisible}
        onOk={handleOkAlert}
        onCancel={handleCancelAlert}
        okText="Sí, eliminar"
        cancelText="No, cancelar"
        centered
        footer={[
          <Button key="cancel" onClick={handleCancelAlert} style={{ backgroundColor: "#f5222d", color: "#fff" }}>
            No, cancelar
          </Button>,
          <Button key="submit" type="primary" onClick={handleOkAlert}>
            Sí, eliminar
          </Button>,
        ]}
      >
        <p style={{ textAlign: "center", marginBottom: 0 }}>
          ¡No podrás revertir esto!
        </p>
      </Modal>
        
        {/* Modal de Éxito */}
      <Modal
        title="Cliente Creado con Éxito"
        open={isSuccessModalOpen}
        onOk={() => setIsSuccessModalOpen(false)}
        onCancel={() => setIsSuccessModalOpen(false)}
        footer={[
          <Button key="ok" type="primary" onClick={() => setIsSuccessModalOpen(false)}>
            Cerrar
          </Button>
        ]}
      >
        <Result status="success"
          title="¡El cliente ha sido creado correctamente!"></Result>
      </Modal>

    </div>
  );
};

export default Cliente;
