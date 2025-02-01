import React,{useState} from "react";
import { Card, Row, Col, Button, Table, Tabs, Dropdown, Menu,  Modal, Select, Input, Form, DatePicker, Flex, Alert,Checkbox} from "antd";

const dataConceptos = [
  {
    key: "1",
    codigo: "A futuro a dispositi",
    descripcion: "N/A",
    cantidad: 765.0,
    precioUnitario: 67.0,
    total: 51255.0,
  },
];

const columnsConceptos = [
  {
    title: "Código",
    dataIndex: "codigo",
    key: "codigo",
  },
  {
    title: "Descripción",
    dataIndex: "descripcion",
    key: "descripcion",
  },
  {
    title: "Cantidad",
    dataIndex: "cantidad",
    key: "cantidad",
  },
  {
    title: "Precio U.",
    dataIndex: "precioUnitario",
    key: "precioUnitario",
    render: (text) => `$${text}`,
  },
  {
    title: "Total",
    dataIndex: "total",
    key: "total",
    render: (text) => `$${text}`,
  },
];

const { Option } = Select;




const DetallesFactura = () => {
  //const [visible, setVisible] = useState(false); // Controla la visibilidad del modal
  const [motivo, setMotivo] = useState("01");
  const [showUuid, setShowUuid] = useState(true);
  const [visibleCancelModal, setVisibleCancelModal] = useState(false); // Controla el modal de cancelación
  const [visiblePaymentModal, setVisiblePaymentModal] = useState(false); // Controla el modal de comprobante de pago
  const [isFirstButtonVisible, setIsFirstButtonVisible] = useState(true); // Alternar botones
  const [isModalVisibleCorreo, setIsModalVisibleCorreo] = useState(false);//Modl Correo Electronico
  
  const [form] = Form.useForm();

  // Función para mostrar el modal correo
  const showModalCorreo = () => {
    setIsModalVisibleCorreo(true);
  };

  // Función para cerrar el modal correo
  const handleCancelCorreo = () => {
    setIsModalVisibleCorreo(false);
  };

  // Función para enviar el formulario correo
  const handleOkCorreo = () => {
    // Aquí puedes manejar lo que sucede al hacer clic en "Enviar"
    console.log("Enviando factura...");
    setIsModalVisibleCorreo(false);
  };

  const handleOkPayment = () => {
    form.validateFields()
      .then((values) => {
        console.log("Valores del comprobante de pago:", values);
        setVisiblePaymentModal(false); // Cierra el modal de comprobante
      })
      .catch((error) => {
        console.error("Error en el formulario:", error);
      });
  };

  const handleMotivoChange = (value) => {
    setMotivo(value);
    setShowUuid(value === "01");
  };

  const handleOk = () => {
    console.log("Motivo seleccionado:", motivo);
    if (showUuid) {
      console.log("UUID ingresado:", document.getElementById("uuidInput").value);
    }
    setVisibleCancelModal(false); // Cierra el modal
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={() => showModalCorreo(true)}>📧 Enviar por correo</Menu.Item>
      <Menu.Item key="2" onClick={() => setVisibleCancelModal(true)}>❌ Cancelar factura</Menu.Item>
      <Menu.Item key="3" onClick={() => setVisiblePaymentModal(true)}>➕ Generar comprobante de pago</Menu.Item>
      <Menu.Item key="4">⬇ Descargar PDF</Menu.Item>
      <Menu.Item key="5">⬇ Descargar XML</Menu.Item>
    </Menu>
  );

  const toggleButtons = () => {
    setIsFirstButtonVisible(!isFirstButtonVisible);
  };
  
  return (
    <div style={{ padding: "20px" }}>
      <h2>Factura 1000</h2>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Información" key="1">
          <Row gutter={16}>
            <Col span={16}>
              <Card title="Información" bordered>
                <Row>
                  <Col span={12}>
                    <p><strong>Factura</strong></p>
                    <p>Fecha: 2025-01-13T18:42:50</p>
                    <p>Estatus: active</p>
                    <p>Forma de pago: 01 - Efectivo</p>
                    <p>Método de pago: PUE - Pago en una sola exhibición</p>
                    <p>Moneda: MXN - Peso Mexicano</p>
                    <p>Tipo de cambio: 0.0</p>
                    <p>Comentarios:</p>
                  </Col>
                  <Col span={12}>
                    <p><strong>Cliente</strong></p>
                    <p>Empresa: ESCUELA KEMPER URGATE</p>
                    <p>RFC: EKU9003173C9</p>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={8}>
            {isFirstButtonVisible ? (
              <Flex gap="small" wrap>
                <Alert
                  message="Informational Notes"
                  description="Tiene un plazo de 72 hora para crear la Factura."
                  type="info"
                  showIcon
                />
                <Button color="danger" variant="solid"
                  onClick={toggleButtons}
                  style={{ marginTop: "20px" }}
                >
                  Crear Factura
                </Button></Flex>
              ) : (
                <div>
                  <Dropdown overlay={menu} trigger={["click"]}>
                    <Button type="primary" style={{ marginTop: "20px" }}>
                      Acciones para factura
                    </Button>
                  </Dropdown>
                  
                </div>
              )}  
              <Card title="Cuenta" bordered>
                <p>Subtotal: $51255.0</p>
                <p>IVA (16.0%): $8200.8</p>
                <p>Importe: $59455.8</p>
              </Card>
              
            </Col>
          </Row>
          <h3 style={{ marginTop: "20px" }}>Conceptos</h3>
          <Table
            dataSource={dataConceptos}
            columns={columnsConceptos}
            pagination={false}
            bordered
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Pagos" key="2">
          <p>No hay pagos registrados.</p>
        </Tabs.TabPane>
      </Tabs>

      <Modal
      title="Cancelando Factura"
      visible={visibleCancelModal}
      onCancel={() => setVisibleCancelModal(false)}
      footer={[
        <Button key="cancelar" onClick={() => () => setVisibleCancelModal(false)}>
          Cerrar
        </Button>,
        <Button key="ok" type="primary" onClick={handleOk}>
          Cancelar
        </Button>,
      ]}
    >
      <Form layout="vertical">
        <Form.Item label="Selecciona el motivo por la que se realizará la cancelación.">
          <Select defaultValue="01" onChange={handleMotivoChange}>
            <Option value="01">01 - Comprobante emitido con errores con relación.</Option>
            <Option value="02">02 - Comprobante emitido con errores sin relación.</Option>
            <Option value="03">03 - No se llevó a cabo la operación.</Option>
            <Option value="04">04 - Operación nominativa relacionada en una global.</Option>
          </Select>
        </Form.Item>
        {showUuid && (
          <Form.Item label="UUID que va a reemplazar">
            <Input id="uuidInput" placeholder="Ingrese el UUID a reemplazar" />
          </Form.Item>
        )}
      </Form>
    </Modal>

        {/* Modal de Comprobante de Pago */}
      <Modal
        title="Comprobante de pago"
        visible={visiblePaymentModal}
        onCancel={() => setVisiblePaymentModal(false)}
        footer={[
          <Button key="cancelar" onClick={() => setVisiblePaymentModal(false)}>
            Cerrar
          </Button>,
          <Button key="ok" type="primary" onClick={handleOkPayment}>
            Generar Comprobante
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Fecha de Pago:"
            name="fechaPago"
            rules={[{ required: true, message: "Por favor selecciona la fecha de pago" }]}
          >
            <DatePicker
              showTime={{ format: "HH:mm" }}
              format="DD/MM/YYYY HH:mm"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            label="Método de pago:"
            name="metodoPago"
            rules={[{ required: true, message: "Por favor selecciona un método de pago" }]}
          >
            <Select placeholder="Selecciona un método">
              <Option value="01">01 - Efectivo</Option>
              <Option value="02">02 - Cheque nominativo</Option>
              <Option value="03">03 - Transferencia electrónica de fondos</Option>
              <Option value="99">99 - Por definir</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Monto:"
            name="monto"
            rules={[{ required: true, message: "Por favor ingresa el monto" }]}
          >
            <Input type="number" placeholder="Ingresa el monto" />
          </Form.Item>

          <Form.Item
            label="Referencia:"
            name="referencia"
            rules={[{ required: true, message: "Por favor ingresa la referencia" }]}
          >
            <Input placeholder="Ingresa la referencia" />
          </Form.Item>
        </Form>
      </Modal>
      {/*Modal de Correo */}

      <Modal
        title="Enviando Factura"
        visible={isModalVisibleCorreo}
        onOk={handleOk}
        onCancel={handleCancelCorreo}
        footer={[
          <Button key="close" onClick={handleCancelCorreo}>
            Cerrar
          </Button>,
          <Button key="submit" type="primary" onClick={handleOkCorreo}>
            Enviar
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item
            label="Correos destinatarios (separados por comas):"
            name="correosDestinatarios"
            rules={[{ required: true, message: "Por favor ingresa los correos." }]}
          >
            <Input placeholder="correo1@example.com, correo2@example.com" />
          </Form.Item>

          <Form.Item label="Correos CCO (opcional):" name="correosCCO">
            <Input placeholder="correo3@example.com, correo4@example.com" />
          </Form.Item>

          <Form.Item name="factura" valuePropName="checked">
            <Checkbox>Necesito Factura</Checkbox>
          </Form.Item>

          <Form.Item name="comprobante" valuePropName="checked">
            <Checkbox>Necesito Comprobante</Checkbox>
          </Form.Item>

          <Form.Item label="Mensaje" name="mensaje">
            <Input.TextArea placeholder="Escribe tu mensaje aquí..." rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DetallesFactura;
