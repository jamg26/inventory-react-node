import React, { useContext, useState } from "react";
import { UserContext } from "../../../routes/routes";
import { Button, Layout, Menu } from "antd";
import {
  HomeOutlined,
  BarChartOutlined,
  InboxOutlined,
  TagOutlined,
  UserOutlined,
  UserAddOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
const { Header, Footer, Sider, Content } = Layout;
function Side(props) {
  const [collaped, setCollaped] = useState(false);
  const toggle = () => {
    setCollaped(!collaped);
  };
  return [
    <Sider
      className="sider"
      theme={"light"}
      onCollapse={toggle}
      collapsible
      collapsed={collaped}
      key="0"
    >
      <div className="logo" />
      <Menu
        theme="light"
        mode="inline"
        defaultSelectedKeys={[props.no.toString()]}
      >
        <Menu.Item key="1">
          <Link to="/web-admin/home" key="0">
            <HomeOutlined />
            <span className="nav-text">Home</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/web-admin/stock_control" key="6">
            <InboxOutlined />
            <span className="nav-text">Stock Control</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to="/web-admin/orders" key="1">
            <InboxOutlined />
            <span className="nav-text">Orders</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="4">
          <Link to="/web-admin/products" key="2">
            <TagOutlined />
            <span className="nav-text">Inventory</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="8">
          <Link to="/web-admin/suppliers" key="8">
            <TeamOutlined />
            <span className="nav-text">Suppliers</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="5">
          <Link to="/web-admin/customers" key="3">
            <UserOutlined />
            <span className="nav-text">Customers</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="6">
          <Link to="/web-admin/analytics" key="4">
            <BarChartOutlined />
            <span className="nav-text">Analytics</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="7">
          <Link to="/web-admin/users" key="5">
            <UserAddOutlined />
            <span className="nav-text">Staff</span>
          </Link>
        </Menu.Item>
      </Menu>
    </Sider>,
  ];
}

export default Side;
