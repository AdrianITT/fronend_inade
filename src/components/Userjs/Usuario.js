import React, { useState } from "react";
import { ExclamationCircleOutlined, CloseOutlined, EditOutlined} from "@ant-design/icons";
import { Table, Input, Button, Modal, Form, Row, Col, Select } from "antd";
import { Link } from "react-router-dom";
import "../Empresasjs/Empresa.css"
const { Option } = Select;



const initialUsers = [
  {
    id: "1",
    username: "developer",
    email: "ventas1@inade.mx",
    firstName: "Daniela",
    lastName: "Mota",
    phone: "6642131943",
    role: "admin",
  },
  {
    id: "2",
    username: "developer1",
    email: "ventas1@inade.mx",
    firstName: "Daniela",
    lastName: "Alvarez Zacarias",
    phone: "6642131943",
    role: "muestras",
  },
];

const Usuario=()=>{
     const [dataSource, setDataSource] = useState(initialUsers);
     const [isModalOpen, setIsModalOpen] = useState(false);
     const [isModalVisible, setIsModalVisible] = useState(false);
     const [form] = Form.useForm();

     const showModalAlert = () => {
      setIsModalVisible(true);
    };
  
    const handleOkAlert = () => {
      console.log("Eliminado");
      setIsModalVisible(false);
    };
  
    const handleCancelAlert = () => {
      console.log("Cancelado");
      setIsModalVisible(false);
    };
   
     const columns = [
       { title: "Id", dataIndex: "id", key: "id" },
       { title: "Username", dataIndex: "username", key: "username" },
       { title: "Correo", dataIndex: "email", key: "email" },
       { title: "Nombre", dataIndex: "firstName", key: "firstName" },
       { title: "Apellidos", dataIndex: "lastName", key: "lastName" },
       { title: "Rol", dataIndex: "role", key: "role" },
       {
         title: "Opciones",
         key: "actions",
         render: (_, record) => (
           <>
           <Link to="/EditarUsuario">
             <Button type="primary" style={{ marginRight: "8px" }} className="action-button-edit">
                <EditOutlined />
             </Button></Link>
             <Button type="danger" onClick={showModalAlert} className="action-button-delete"><CloseOutlined /></Button>
           </>
         ),
       },
     ];
   
     const showAddUserModal = () => {
       setIsModalOpen(true);
     };
   
     const handleCancel = () => {
       setIsModalOpen(false);
     };
   
     const handleFinish = (values) => {
       const newUser = {
         id: String(dataSource.length + 1),
         ...values,
       };
       setDataSource([...dataSource, newUser]);
       setIsModalOpen(false);
       form.resetFields();
     };
   
     return(
          <div className="table-container">
          <h1 className="table-title">Usuarios del Sistema</h1>
          <center><Input.Search
              placeholder="Buscar usuario..."
              enterButton="Buscar"
              style={{ maxWidth: "300px" }}
            /></center>
          <div className="button-end" >
            
            <Button type="primary" onClick={showAddUserModal}>
              Añadir Usuario
            </Button>
          </div>
          <div className="table-wrapper">
          <Table
            dataSource={dataSource}
            columns={columns}
            rowKey="id"
            pagination={{
              pageSize: 5,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20"],
            }}
          /></div>
          <Modal
            title="Crear Nuevo Usuario"
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
          >
            <Form form={form} layout="vertical" onFinish={handleFinish}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: "Por favor ingresa un nombre de usuario" }]}
                  >
                    <Input placeholder="Nombre de usuario" />
                  </Form.Item>
                  <Form.Item
                    label="Nombre"
                    name="firstName"
                    rules={[{ required: true, message: "Por favor ingresa el nombre" }]}
                  >
                    <Input placeholder="Nombre" />
                  </Form.Item>
                  <Form.Item
                    label="Apellidos"
                    name="lastName"
                    rules={[{ required: true, message: "Por favor ingresa los apellidos" }]}
                  >
                    <Input placeholder="Apellidos" />
                  </Form.Item>
                  <Form.Item
                    label="Correo electronico"
                    name="email"
                    rules={[
                      { required: true, message: "Por favor ingresa un correo electrónico" },
                      { type: "email", message: "Por favor ingresa un correo válido" },
                    ]}
                  >
                    <Input placeholder="Correo electrónico" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Celular" name="phone">
                    <Input placeholder="Celular" />
                  </Form.Item>
                  <Form.Item
                    label="Rol"
                    name="role"
                    rules={[{ required: true, message: "Por favor selecciona un rol" }]}
                  >
                    <Select placeholder="Selecciona un rol">
                      <Option value="admin">Administrador</Option>
                      <Option value="coordinator">Coordinador</Option>
                      <Option value="samples">Muestras</Option>
                      <Option value="reports">Informes</Option>
                      <Option value="lab">Laboratorio</Option>
                      <Option value="quality">Calidad</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="Contraseña"
                    name="password"
                    rules={[{ required: true, message: "Por favor ingresa una contraseña" }]}
                  >
                    <Input.Password />
                  </Form.Item>
                  <Form.Item
                    label="Confirmación de contraseña"
                    name="confirmPassword"
                    dependencies={['password']}
                    rules={[
                      { required: true, message: "Por favor confirma la contraseña" },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error("Las contraseñas no coinciden"));
                        },
                      }),
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                </Col>
              </Row>
              <div style={{ textAlign: "right" }}>
                <Button onClick={handleCancel} style={{ marginRight: "8px" }}>
                  Cancelar
                </Button>
                <Button type="primary" htmlType="submit">
                  Crear Cliente
                </Button>
              </div>
            </Form>
          </Modal>

                {/* Modal de alerta */}
                <Modal
                  title={
                    <div style={{ textAlign: "center" }}>
                      <ExclamationCircleOutlined style={{ fontSize: "24px", color: "#faad14" }} />
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
                    <Button
                      key="cancel"
                      onClick={handleCancelAlert}
                      style={{ backgroundColor: "#f5222d", color: "#fff" }}
                    >
                      No, cancelar
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOkAlert}>
                      Sí, eliminar
                    </Button>,
                  ]}
                >
                  <p style={{ textAlign: "center", marginBottom: 0 }}>¡No podrás revertir esto!</p>
                </Modal>
        </div>
      );
};
export default Usuario;