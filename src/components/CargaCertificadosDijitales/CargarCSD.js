import React from "react";
import { Button, Input, Upload, Form, Typography, Alert } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "./CargarCSD.css";
import { Link } from "react-router-dom";

const { Title } = Typography;

const CargarCSD = () => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    console.log("Datos enviados:", values);
  };

  return (
    <div className="csd-container">
     <Link to="/">
      <Button type="text" className="back-button">
        ←
      </Button>
      </Link>
      <Title level={3} className="csd-title">
        Cargar Certificado de Sello Digital (CSD)
      </Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="csd-form"
      >
        <Form.Item label="Rfc:" name="rfc" initialValue="1123" required>
          <Input/>
        </Form.Item>

        <Form.Item label="Archivo .cer:" name="cer" valuePropName="file">
          <Upload maxCount={1}>
            <Button icon={<UploadOutlined />}>Elegir archivo</Button>
          </Upload>
        </Form.Item>

        <Form.Item label="Archivo .key:" name="key" valuePropName="file">
          <Upload maxCount={1}>
            <Button icon={<UploadOutlined />}>Elegir archivo</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          label="Contraseña del CSD:"
          name="password"
          rules={[{ required: true, message: "Este campo es requerido" }]}
        >
          <Input.Password />
        </Form.Item>

        <Alert
          message={
            <>
              <strong>Consideraciones</strong>
              <ul>
                <li>Habilitado para facturar (IVA exento, tasa 0% y 16%)</li>
                <li>
                  Habilitado para facturar (IVA exento, tasa 0%, 8% y 16%) Zona
                  Fronteriza Norte
                </li>
                <li>
                  Habilitado para facturar (IVA exento, tasa 0%, 8% y 16%) Zona
                  Fronteriza Sur
                </li>
                <li>
                  Habilitado para facturar (IVA exento, tasa 0%, 8% y 16%) Zona
                  Fronteriza Norte y Sur
                </li>
              </ul>
            </>
          }
          type="warning"
          className="csd-alert"
        />

        <div className="csd-buttons">
          <Button type="primary" htmlType="submit">
            Cargar CSD
          </Button>
          <Button type="danger">Eliminar CSD actuales</Button>
        </div>
      </Form>
    </div>
  );
};

export default CargarCSD;
