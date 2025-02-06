import React, { useState } from "react";
import { Form, Input, Button, Alert, Card, Checkbox } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Login_Api from "../../apis/LoginApi";
import "./Login.css";

const Login = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      // Usa Login_Api para realizar la solicitud POST
      const response = await Login_Api.post("", {
        username: values.user,
        password: values.password,
      });

      const { token, user_id, username, rol, organizacion, organizacion_id } = response.data;

      // Guardar el token y otros datos en el localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user_id", user_id);
      localStorage.setItem("username", username);
      localStorage.setItem("rol", rol);
      localStorage.setItem("organizacion", organizacion);
      localStorage.setItem("organizacion_id", organizacion_id);  // Guardar el ID de la organización

      setError("");

      // Redirigir según el rol del usuario
      if (rol === "Administrador") {
        navigate("/Homeadmin");
      } else {
        navigate("/home");
      }
    } catch (error) {
      setError("Correo o contraseña incorrectos.");
    }
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
          <Link to="/RegistroUsuarios">
            <Button type="link" htmlType="button">
              Registrate
            </Button>
          </Link>
        </Form>
      </Card>
    </div>
  );
};

export default Login;