import React, { useState } from "react";
import { Form, Input, Button, Alert, Card, Checkbox } from "antd";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook para redirigir


  //funcion que evalua el usuario y contraseña
  const onFinish = (values) => {
    console.log("Datos enviados:", values);

    // Simula un error
    if (values.user !== "noe" || values.password !== "123456") {
      setError("Correo o contraseña incorrectos.");
      return;
    }
    if(values.user==="noe"&& values.password==="123456" && values.admin===true){
      navigate("/Homeadmin");
      return;
    }

    setError("");
    console.log("Autenticación exitosa");

    // Redirigir al usuario
    navigate("/home");
  };

  return (
    
    <div className="center-card">
      <Card className="login-card">
      <h1>Iniciar Sesión</h1>
      {error && <Alert message={error} type="error" showIcon />}
      <Form
        name="login"
        onFinish={onFinish}
        style={{ marginTop: "20px" }}
        layout="vertical"
      >
        <Form.Item
          label="Usuario"
          name="user"
          rules={[{ required: true, message: "Por favor, ingrese su correo" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Contraseña"
          name="password"
          rules={[{ required: true, message: "Por favor, ingrese su contraseña" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item name="admin" valuePropName="checked" label={null}>
          <Checkbox>admin</Checkbox>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Iniciar Sesión
          </Button>
        </Form.Item>
        <Link to="/RegistroUsuarios"><Button type="link" htmlType="button">
             Registrate
          </Button></Link>
      </Form>
      </Card>
    </div>
  );
};

export default Login;
