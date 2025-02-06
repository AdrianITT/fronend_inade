import React, { useState } from 'react';
import { AppstoreOutlined } from '@ant-design/icons';
import { Menu, Button, Drawer } from 'antd';
import { Link } from "react-router-dom";
import Logout_Api from '../apis/LogoutApi';
import '../Header.css';

const items = [
  {
    label: (<Link to="/home" rel="noopener noreferrer">Home</Link>),
    key: 'inade',
  },
  {
    key: 'alipay',
    label: (
      <Link to="/empresa" rel="noopener noreferrer">
        Empresa
      </Link>
    ),
  },
  {
    key: 'alipay',
    label: (
      <Link to="/cliente" rel="noopener noreferrer">
        Cliente
      </Link>
    ),
  },
  {
    key: 'alipay',
    label: (
      <Link to="/servicio" rel="noopener noreferrer">
        Servicios
      </Link>
    ),
  },
  {
    key: 'alipay',
    label: (
      <Link to="/cotizar" rel="noopener noreferrer">
        Cotizar
      </Link>
    ),
  },
  {
    key: 'sub2',
    label: 'Mas',
    icon: <AppstoreOutlined />,
    children: [
      {
        key: '5',
        label: (
          <Link to="/generar_orden" rel="noopener noreferrer">
            Generar Orden de Trabajo
          </Link>
        ),
      },
      {
        key: '6',
        label: (
          <Link to="/usuario" rel="noopener noreferrer">
            Usuarios
          </Link>
        ),
      },
      {
        key: '7',
        label: (
          <Link to="/configuracionorganizacion" rel="noopener noreferrer">
            Configuracion de la organización
          </Link>
        ),
      },
      {
        key: '8',
        label: (
          <Link to="/factura" rel="noopener noreferrer">
            Facturas
          </Link>
        ),
      },
    ],
  },
  {
    key: 'logout',
    label: (
      <div className="logout-button">
        <Button
          color="primary"
          variant="link"
          onClick={async () => {
            try {
              // Usa Logout_Api para realizar la solicitud POST
              await Logout_Api.post("", {}, {
                headers: {
                  Authorization: `Token ${localStorage.getItem('token')}`,
                },
              });
              // Limpia el localStorage
              localStorage.removeItem('token');
              localStorage.removeItem('user_id');
              localStorage.removeItem('username');
              localStorage.removeItem('rol');
              localStorage.removeItem('organizacion');
              localStorage.removeItem('organizacion_id');

              // Redirige al usuario a la página principal (http://localhost:3000/)
              window.location.href = '/';
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
            }
          }}
        >
          Cerrar sesión
        </Button>
      </div>
    ),
  },
];

const getLevelKeys = (items1) => {
  const key = {};
  const func = (items2, level = 1) => {
    items2.forEach((item) => {
      if (item.key) {
        key[item.key] = level;
      }
      if (item.children) {
        func(item.children, level + 1);
      }
    });
  };
  func(items1);
  return key;
};
const levelKeys = getLevelKeys(items);

const Header = () => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const [stateOpenKeys, setStateOpenKeys] = useState(['2', '23']);
  const onOpenChange = (openKeys) => {
    const currentOpenKey = openKeys.find((key) => stateOpenKeys.indexOf(key) === -1);
    // open
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys
        .filter((key) => key !== currentOpenKey)
        .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);
      setStateOpenKeys(
        openKeys
          // remove repeat key
          .filter((_, index) => index !== repeatIndex)
          // remove current level all child
          .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey]),
      );
    } else {
      // close
      setStateOpenKeys(openKeys);
    }
  };
  return (
    <>
      <div className="header-container">
        <Link to="/home">
          <div className='header-logo' ><img src="/img/logo.png" alt="INADE" style={{ height: '40px', marginRight: '8px' }} /> <span></span> </div>
        </Link>

        <div class="header-button">
          <Button color='primary' variant='filled' onClick={showDrawer}>
            Menu
          </Button>
        </div>

        <Drawer title="Menu" onClose={onClose} open={open}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['231']}
            openKeys={stateOpenKeys}
            onOpenChange={onOpenChange}
            style={{
              width: 256,
            }}
            items={items}
          />
        </Drawer>
      </div>
    </>
  );
};

export default Header;