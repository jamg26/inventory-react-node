import React, { useState, useEffect } from "react";
import { Layout, Button, Dropdown, Menu, Badge, notification } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  NotificationOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
const { Header } = Layout;
function Head({ loggedin }) {
  const [username, setUserName] = useState("");
  useEffect(() => {
    let account = localStorage.getItem("landing_remembered_account");
    if (account === null || account == "") {
      account = undefined;
    }
    if (account === undefined) {
    } else {
      const data = JSON.parse(account);

      setUserName(data.username);
    }
  }, []);
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
  const menu = (
    <Menu>
      <Menu.Item key="user_info_menu">
        <Link to="/account" key="0" style={{ fontSize: "inherit" }}>
          <UserOutlined /> {username}
        </Link>
      </Menu.Item>
      <Menu.Item key="logout_menu">
        <Link
          key="1"
          to="/login"
          onClick={() => {
            localStorage.setItem("landing_remember_account", false);
            localStorage.setItem("landing_remembered_account", "");
            localStorage.setItem("landing_credentials", "");
          }}
          style={{ fontSize: "inherit" }}
        >
          <LogoutOutlined /> Logout
        </Link>
      </Menu.Item>
    </Menu>
  );

  return [
    <Header
      className="site-layout-background-store-front"
      style={{
        paddingRight: "10px",
        paddingLeft: "10px",
        borderBottom: "1px solid rgba(0,0,0,0.1)",
      }}
      key="0"
    >
      {loggedin ? (
        <Dropdown overlay={menu} trigger={["click"]}>
          <Button
            type="link"
            style={{ float: "right", height: "100%", color: "black" }}
          >
            <UserOutlined />
          </Button>
        </Dropdown>
      ) : (
        <Link to="/login" style={{ float: "right" }}>
          Signin/Signup
        </Link>
      )}
    </Header>,
  ];
}

export default Head;
