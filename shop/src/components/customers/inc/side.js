import React, { useContext, useState } from "react";
import { UserContext } from "../../../routes/routes";
import { Button, Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import {
  UserOutlined,
  PercentageOutlined,
  InboxOutlined,
  GoldOutlined,
} from "@ant-design/icons";
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
    >
      <Link to="/">
        <div className="logo" />
      </Link>
      <Menu
        theme="light"
        mode="inline"
        defaultSelectedKeys={[props.no.toString()]}
      >
        <Menu.Item key="1">
          <Link to="/account">
            <UserOutlined />
            <span className="nav-text">My Account</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/account/orders">
            <InboxOutlined />
            <span className="nav-text">My Orders</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to="/account/points">
            <GoldOutlined />
            <span className="nav-text">Points Accumulated</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="4">
          <Link to="/account/discounts">
            <PercentageOutlined />
            <span className="nav-text">Special Discounts</span>
          </Link>
        </Menu.Item>
      </Menu>
    </Sider>,
  ];
}

export default Side;
