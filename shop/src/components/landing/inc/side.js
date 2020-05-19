import React, { useContext, useState } from "react";
import { UserContext } from "../../../routes/routes";
import { Button, Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";
const { Header, Footer, Sider, Content } = Layout;
function Side({ setCategory }) {
  const [collaped, setCollaped] = useState(false);
  const toggle = () => {
    setCollaped(!collaped);
  };
  return [
    <Sider
      key="0"
      className="sider"
      theme={"light"}
      onCollapse={toggle}
      collapsible
      collapsed={collaped}
    >
      <Link key="0" to="/">
        <div className="logo" />
      </Link>
      <Menu
        theme="light"
        mode="inline"
        defaultSelectedKeys={["All Products"]}
        onClick={(item) => {
          setCategory(item.key);
        }}
      >
        <Menu.Item key="All Products">
          <HomeOutlined />
          <span className="nav-text">All Products</span>
        </Menu.Item>
      </Menu>
    </Sider>,
  ];
}

export default Side;
