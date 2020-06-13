import React, { useContext, useState } from "react";
import { UserContext } from "../../../routes/routes";
import { Button, Layout, Menu, Typography } from "antd";
import {
  HomeOutlined,
  BarChartOutlined,
  InboxOutlined,
  TagOutlined,
  PercentageOutlined,
  WalletOutlined,
  UserAddOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { SettingContext } from "../../../routes/routes";
const { Header, Footer, Sider, Content } = Layout;
function Side(props) {
  var settings = useContext(SettingContext);
  const [collaped, setCollaped] = useState(false);
  const toggle = () => {
    setCollaped(!collaped);
  };
  return [
    <Sider
      className="sider"
      theme={"dark"}
      onCollapse={toggle}
      collapsible
      collapsed={collaped}
      key="0"
    >
      <div className="logo" />
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={[props.no.toString()]}
      >
        <Menu.ItemGroup key="g1" title="Settings">
          <Menu.Item key="9">
            <Link to="/web-admin/settings/" key="9">
              <BankOutlined />
              <span className="nav-text">Organization Profile</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="10">
            <Link to="/web-admin/settings/taxes" key="10">
              <WalletOutlined />
              <span className="nav-text">Taxes</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="11">
            <Link to="/web-admin/settings/prices" key="11">
              <PercentageOutlined />
              <span className="nav-text">Price List</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="7">
            <Link to="/web-admin/users" key="5">
              <UserAddOutlined />
              <span className="nav-text">Staff</span>
            </Link>
          </Menu.Item>
        </Menu.ItemGroup>
      </Menu>
    </Sider>,
  ];
}

export default withRouter(Side);
