import React, { useState } from 'react';
import { Card, Input, Button, Row, Col, Form, Divider, Upload, message} from 'antd';
//import { UserAddOutlined, ReconciliationOutlined, SettingOutlined, AuditOutlined } from '@ant-design/icons';
import './RegistroUsuario.css';
import { useNavigate } from 'react-router-dom';


const RegistroUsuarios = () => {
  const [showSecondDiv, setShowSecondDiv] = useState(false);
  const navigate=useNavigate();

  const handleStart = () => {
    setShowSecondDiv(true);
  };
  const handleLogoChange = (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const InserData=()=>{
    navigate("/home");
  };

  return (
    <div className='container-Registeruser'>
      <div id="firstDiv" style={{ display: showSecondDiv ? 'none' : 'flex' }}>
        <div>
          <h1>Bienvenido!</h1>
          <p>Te damos la bienvenida al sistema para laboratorios ambientales.</p>
          <p>Da clic en el siguiente botón para empezar a configurar tu organización.</p>
          <Button type="primary" onClick={handleStart}>
            ¡Empecemos!
          </Button>
        </div>
      </div>

      <div id="secondDiv" style={{ display: showSecondDiv ? 'flex' : 'none', justifyContent: 'center' }}>
        <Card className="custom-card" title="Registro y Configuración Inicial">
          <Form>
            {/* Configuración de Usuario */}
            <h3>Configuración de Usuario</h3>
            <Form.Item label="Username" required
            labelCol={{span:24}} 
            wrapperCol={{span:24}}>
              <Input placeholder="Username" />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Nombre" required 
                labelCol={{span:24}} 
                wrapperCol={{span:24}}>
                  <Input placeholder="Nombre" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Apellidos" required
                labelCol={{span:24}} 
                wrapperCol={{span:24}}>
                  <Input placeholder="Apellidos" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Correo Electrónico" required
            labelCol={{span:24}} 
            wrapperCol={{span:24}}>
              <Input type="email" placeholder="Correo Electrónico" />
            </Form.Item>
            <Form.Item label="Celular"
            labelCol={{span:24}} 
            wrapperCol={{span:24}}>
              <Input placeholder="Celular" maxLength={15} />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Contraseña" required 
                labelCol={{span:24}} 
                wrapperCol={{span:24}}>
                  <Input.Password placeholder="Contraseña" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Confirmación de Contraseña" required 
                labelCol={{span:24}} 
                wrapperCol={{span:24}}>
                  <Input.Password placeholder="Confirmación de Contraseña" />
                </Form.Item>
              </Col>
            </Row>

            {/* Configuración de Organización */}
            <h3>Configuración de Organización</h3>
            <Form.Item label="Nombre de la Organización" required
            labelCol={{span:24}} 
            wrapperCol={{span:24}}>
              <Input placeholder="Nombre de la Organización" />
            </Form.Item>
            <Form.Item label="Slogan" required
            labelCol={{span:24}} 
            wrapperCol={{span:24}}>
              <Input placeholder="Slogan" />
            </Form.Item>
            <Form.Item label="Logo">
              <Upload
                name="logo"
                action="/upload.do"
                onChange={handleLogoChange}
                maxCount={0}
                showUploadList={false}
              >
                <Button>Subir Logo</Button>
              </Upload>
            </Form.Item>
            <Divider />

            {/* Submit Button */}
            <Form.Item>
              <Button type="primary" htmlType="submit" onClick={InserData}>
                Empezemos!
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default RegistroUsuarios;
