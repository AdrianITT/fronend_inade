import React from "react";
import { Form, Input, Button, Select } from "antd";
import { useNavigate } from "react-router-dom"; // <-- Importar useNavigate
import "./user.css"

const EditarUsuario = () => {
  const { Option } = Select;

  // 1. Obtén la función navigate
  const navigate = useNavigate();

  const handleGuardar = (values) => {
    console.log("Datos guardados:", values);
    
  };

  const handleCancelar = () => {
    console.log("Edición cancelada");navigate(-1);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Editar Usuario</h1>
      <Form
        layout="vertical"
        onFinish={handleGuardar}
        initialValues={{
          nombre: "Daniela",
          apellidos: "Mota",
          email: "ventas1@inade.mx",
          celular: "6642131943",
          rol: "Administrador",
        }}
      >
        <Form.Item
          label="Nombre:"
          name="nombre"
          rules={[{ required: true, message: "Por favor ingresa el nombre" }]}
        >
          <Input placeholder="Nombre" />
        </Form.Item>
        <Form.Item
          label="Apellidos:"
          name="apellidos"
          rules={[{ required: true, message: "Por favor ingresa los apellidos" }]}
        >
          <Input placeholder="Apellidos" />
        </Form.Item>
        <Form.Item
          label="Dirección de correo electrónico:"
          name="email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Por favor ingresa un correo electrónico válido",
            },
          ]}
        >
          <Input placeholder="Correo electrónico" />
        </Form.Item>
        <Form.Item
          label="Celular:"
          name="celular"
          rules={[{ required: true, message: "Por favor ingresa el número de celular" }]}
        >
          <Input placeholder="Celular" />
        </Form.Item>
        <Form.Item
          label="Rol:"
          name="rol"
          rules={[{ required: true, message: "Por favor selecciona un rol" }]}
        >
          <Select placeholder="Selecciona un rol">
            <Option value="Administrador">Administrador</Option>
            <Option value="Usuario">Usuario</Option>
          </Select>
        </Form.Item>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
          <Button type="primary" htmlType="submit" style={{ backgroundColor: "#1890ff" }}>
            Guardar cambios
          </Button>
          <Button type="default" onClick={handleCancelar} style={{ backgroundColor: "#8c8c8c", color: "white" }}>
            Cancelar
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EditarUsuario;
