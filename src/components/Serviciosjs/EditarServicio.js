import React from "react";
import { Form, Input, Button, Select, Checkbox, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import "./Servicio.css";

const { Option } = Select;

const EditarServicio = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log("Formulario enviado:", values);
    // Aquí puedes manejar los datos del formulario
  };

  const handleCancel = () => {
    navigate(-1); // Navega a la página anterior
  };

  return (
    <div className="editar-servicio-container">
      <h1 className="editar-servicio-title">Editar Servicio</h1>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="editar-servicio-form"
      >
        <h2 className="section-title">Método</h2>
        <Form.Item
          name="metodo"
          label="Método"
          rules={[{ required: true, message: "Seleccione un método" }]}
        >
          <Select placeholder="Seleccione un método" className="form-select">
            <Option value="metodo1">Método 1</Option>
            <Option value="metodo2">Método 2</Option>
          </Select>
        </Form.Item>

        <h2 className="section-title">Servicio</h2>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="codigo"
              label="Código"
              rules={[{ required: true, message: "Ingrese el código" }]}
            >
              <Input placeholder="Ingrese el código" />
            </Form.Item>
            <Form.Item
              name="nombreServicio"
              label="Nombre servicio"
              rules={[{ required: true, message: "Ingrese el nombre del servicio" }]}
            >
              <Input placeholder="Nombre del servicio" />
            </Form.Item>
            <Form.Item
              name="unidad"
              label="Unidad"
              rules={[{ required: true, message: "Ingrese la unidad" }]}
            >
              <Input placeholder="Unidad" />
            </Form.Item>
            <Form.Item
              name="unidadCfdi"
              label="Unidad cfdi"
              rules={[{ required: true, message: "Seleccione una Unidad cfdi" }]}
            >
              <Select placeholder="Seleccione una Unidad cfdi" className="form-select">
                <Option value="H87">H87 - Pieza</Option>
                <Option value="E48">E48 - Unidad de Servicio</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="claveCfdi"
              label="Clave cfdi"
              rules={[{ required: true, message: "Seleccione una Clave cfdi" }]}
            >
              <Select placeholder="Seleccione una Clave cfdi" className="form-select">
                <Option value="77101700">
                  77101700 - Servicios de asesoría ambiental
                </Option>
                <Option value="77101701">
                  77101701 - Servicios de asesoramiento sobre ciencias ambientales
                </Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="descripcion" label="Descripción">
              <Input.TextArea placeholder="Descripción" />
            </Form.Item>
            <Form.Item
              name="precioUnitario"
              label="Precio unitario"
              rules={[{ required: true, message: "Ingrese el precio unitario" }]}
            >
              <Input placeholder="Precio unitario" />
            </Form.Item>
            <Form.Item
              name="objetoImpuesto"
              label="Objeto impuesto"
              rules={[{ required: true, message: "Seleccione un Objeto impuesto" }]}
            >
              <Select placeholder="Seleccione un Objeto impuesto" className="form-select">
                <Option value="si">Sí objeto del impuesto</Option>
                <Option value="no">No objeto del impuesto</Option>
              </Select>
            </Form.Item>
            <Form.Item name="descuento" label="Descuento">
              <Input placeholder="0.00" />
            </Form.Item>
            <Form.Item name="subcontrato" valuePropName="checked">
              <Checkbox>Subcontrato</Checkbox>
            </Form.Item>
            <Form.Item name="acreditado" valuePropName="checked">
              <Checkbox>Acreditado</Checkbox>
            </Form.Item>
          </Col>
        </Row>

        <div className="form-buttons">
          <Button type="primary" htmlType="submit" className="register-button">
            Registrar
          </Button>
          <Button type="default" onClick={handleCancel} className="cancel-button">
            Cancelar
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EditarServicio;
