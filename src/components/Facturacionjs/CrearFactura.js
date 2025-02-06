import React from "react";
import { Form, Input, Button, Select, Row, Col } from "antd";
import { useParams } from "react-router-dom";
import "./crearfactura.css";

const { TextArea } = Input;

const CrearFactura = () => {
    const [form] = Form.useForm();
    const { id } = useParams();

    console.log(id);
  return (
    <div className="factura-container">
      <div className="factura-header">
        <h1>Facturar 250117-04</h1>
      </div>

      <div className="factura-emisor-receptor">
        <div className="emisor">
          <h3>Emisor</h3>
          <p><strong>BERENICE XIMO QUEZADA</strong></p>
          <p>RFC: Telefono: (664) 104 51 44</p>
          <p>Dirección: Lilas, No.36257, Col. Centro industrial Florida, Tijuana, Baja California, C.P. 36257</p>
        </div>
        <div className="receptor">
          <h3>Receptor</h3>
          <p>Nombre Receptor: <strong>ESCUELA KEMPER URGATE</strong></p>
          <p>RFC: EKU9003173C9</p>
          <p>Régimen Fiscal: 601</p>
        </div>
      </div>

      <Form layout="vertical" className="my-factura-form"
      form={form} // Conecta el formulario con la instancia
      initialValues={{
        tipoMoneda: "mxn", // Establece el valor inicial para tipoMoneda
        orderNumber: "hola", // Establece el valor inicial para orderNumber
        tasaIva:"8", //Estableser el valor iniciar de tasa de iva
      }}>
        <div className="factura-details">
          <div className="horizontal-group">
            <Form.Item label="Tipo moneda:" name="tipoMoneda" rules={[{ required: true }]}>
              <Select placeholder="Selecciona una moneda" initialValue="mxn">
                <Select.Option value="mxn">MXN - Moneda Nacional</Select.Option>
                <Select.Option value="usd">USD - Dólar Estadounidense</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="OrderNumber:" name="orderNumber">
              <Input placeholder="Ingrese el número de orden" disabled/>
            </Form.Item>
          </div>
          <div className="horizontal-group">
            <Form.Item label="Uso cfdi:" name="usoCfdi" required>
              <Select placeholder="Selecciona uso cfdi">
                <Select.Option value="gastos">Gastos en general</Select.Option>
                <Select.Option value="adquisiciones">Adquisiciones</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Forma pago:" name="formaPago" required>
              <Select placeholder="Selecciona forma de pago">
                <Select.Option value="definir">Por definir</Select.Option>
                <Select.Option value="transferencia">Transferencia electrónica</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Metodo pago:" name="metodoPago" required>
              <Select placeholder="Selecciona método de pago">
                <Select.Option value="pago_unico">Pago en una sola exhibición</Select.Option>
                <Select.Option value="diferido">Pago diferido</Select.Option>
              </Select>
            </Form.Item>
          </div>
        </div>

        <table className="service-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre del servicio</th>
              <th>Método</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Importe</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><Input value="40506" readOnly /></td>
              <td><Input value="extra cajas" readOnly /></td>
              <td><Input value="None" readOnly /></td>
              <td><Input value="12" readOnly /></td>
              <td><Input value="13.00" readOnly /></td>
              <td><Input value="156.00" readOnly /></td>
            </tr>
          </tbody>
        </table>

        <Row gutter={16}>
          <Col span={14}>
          <div className="form-additional">
          <Form.Item label="Dirección Fiscal:" name="direccionFiscal" required>
            <Input value="de las ballestas, No.42501, Col. Centro industrial Florida, Tijuana, Baja California, C.P. 42501" disabled />
          </Form.Item>
          <Form.Item label="Comentarios:" name="comentarios">
            <TextArea rows={5} placeholder="Agrega comentarios adicionales" />
          </Form.Item>
        </div>
          </Col>
          <Col span={10}>
            <div className="factura-summary">
            <Form.Item label="Subtotal:" name="subtotal">
              <Input value="156.00" disabled />
            </Form.Item>
            <Form.Item label="Tasa iva:" name="tasaIva" required>
              <Select>
                <Select.Option value="8">8%</Select.Option>
                <Select.Option value="16">16%</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="IVA:" name="iva">
              <Input value="12.48" disabled />
            </Form.Item>
            <Form.Item label="Total:" name="total">
              <Input value="168.48" disabled />
            </Form.Item>
          </div>
          </Col>
        </Row>
        <div className="factura-buttons">
          <Button type="primary" style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}>
            Confirmar datos
          </Button>
          <Button type="danger" style={{ backgroundColor: "#f5222d", borderColor: "#f5222d" }}>
            Cancelar
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CrearFactura;
