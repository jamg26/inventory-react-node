import React, { useState, useEffect } from "react";
import {
  Layout,
  Button,
  Dropdown,
  Menu,
  Badge,
  notification,
  Row,
  Col,
  Typography,
  Avatar,
} from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  NotificationOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
const { Header } = Layout;
const { Text } = Typography;
function Head() {
  const [username, setUserName] = useState("");
  const [position, setposition] = useState("");
  const openNotification = () => {
    notification.open({
      message: "Sample Notification Title",
      description:
        "This is the sample content of the notification. This is the sample content of the notification. This is the sample content of the notification.",
      onClick: () => {
        console.log("Notification Clicked!");
      },
      icon: <NotificationOutlined style={{ color: "#108ee9" }} />,
    });
  };
  useEffect(() => {
    let account = localStorage.getItem("remembered_account");
    if (account === null || account == "") {
      account = undefined;
    }
    if (account === undefined) {
    } else {
      const data = JSON.parse(account);

      setUserName(data.username);
      setposition(data.position);
    }
  }, []);
  const menu = (
    <Menu>
      <Menu.Item key="user_info_menu">
        <Link style={{ fontSize: "inherit" }} to={""}>
          <UserOutlined /> Profile
        </Link>
      </Menu.Item>
      <Menu.Item key="logout_menu">
        <Link
          to="/web-admin/"
          onClick={() => {
            localStorage.setItem("remember_account", false);
            localStorage.setItem("remembered_account", "");
            localStorage.setItem("credentials", "");
          }}
          style={{ fontSize: "inherit" }}
        >
          <LogoutOutlined /> Logout
        </Link>
      </Menu.Item>
    </Menu>
  );
  const notif = (
    <Menu>
      <Menu.Item key={0}>
        <Link
          to={""}
          style={{ fontSize: "inherit" }}
          onClick={() => openNotification()}
        >
          Sample Notification 1
        </Link>
      </Menu.Item>

      <Menu.Item key={1}>
        <Link
          to={""}
          style={{ fontSize: "inherit" }}
          onClick={() => openNotification()}
        >
          Sample Notification 2
        </Link>
      </Menu.Item>
    </Menu>
  );
  return [
    <Header
      className="site-layout-background"
      style={{ paddingRight: "10px", paddingLeft: "10px" }}
      key="0"
    >
      <Dropdown overlay={menu} trigger={["click"]}>
        <Button
          type="link"
          style={{
            textAlign: "left",
            float: "right",
            height: "100%",
            color: "black",
          }}
        >
          <Row gutter="20">
            <Col span="6" align="middle" justify="center">
              <UserOutlined style={{ height: "100%" }} className="center-svg" />
            </Col>

            <Col span="18">
              {username}
              <br></br> <Text type="secondary">{position}</Text>
            </Col>
          </Row>
        </Button>
      </Dropdown>
      <Dropdown overlay={notif} trigger={["click"]}>
        <Button
          type="link"
          style={{ float: "right", height: "100%", color: "black" }}
        >
          <Badge count={99} dot>
            <BellOutlined />
          </Badge>
        </Button>
      </Dropdown>
    </Header>,
  ];
}

export default Head;
