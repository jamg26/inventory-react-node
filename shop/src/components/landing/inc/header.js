import React, { useState, useEffect, useContext } from "react";
import {
  Layout,
  Button,
  Dropdown,
  Menu,
  Badge,
  notification,
  Space,
  Row,
  Col,
  Input,
} from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  NotificationOutlined,
  BellOutlined,
  CarryOutTwoTone,
  ShopOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  SearchOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import numeral from "numeral";
import { Link } from "react-router-dom";
import { SettingContext } from "../../../routes/routes";
const { Header } = Layout;
const { Search } = Input;
function Head({
  loggedin,
  itemCount = 0,
  subtotal = 0,
  openSideDrawer = () => {},
  searchFilterProducts = undefined,
  setSearchFilterProducts = () => {},
  setsearchEntered = () => {},
  searchEntered = undefined,
}) {
  const setting_configuration = useContext(SettingContext);
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
      <Row align="middle">
        <Col span="8">
          <Link to="/" key="0">
            {setting_configuration &&
            setting_configuration.logo != "" &&
            setting_configuration.logo ? (
              <img
                src={setting_configuration.logo}
                style={{ height: "32px" }}
              />
            ) : null}
          </Link>
        </Col>
        <Col span="8">
          {searchFilterProducts != undefined ? (
            <Search
              className="searchbar-header"
              enterButton={
                <Space>
                  <SearchOutlined />
                  Search
                </Space>
              }
              placeholder="search for  products, brands, categories, etc"
              value={searchFilterProducts}
              onChange={(e) => setSearchFilterProducts(e.target.value)}
              onSearch={() => setsearchEntered(!searchEntered)}
              style={{ width: "100%", float: "right" }}
              suffix={
                <CloseCircleOutlined
                  className="header-search-icon"
                  style={{ opacity: "0.5" }}
                  onClick={() => {
                    setSearchFilterProducts("");
                    setsearchEntered(!searchEntered);
                  }}
                />
              }
            />
          ) : null}
        </Col>
        <Col span="8">
          {loggedin ? (
            <Space style={{ float: "right", marginRight: "15px" }}>
              <Dropdown overlay={menu} trigger={["click"]}>
                <Button
                  type="link"
                  style={{ float: "right", height: "100%", color: "black" }}
                >
                  <UserOutlined />
                </Button>
              </Dropdown>
              <Button
                type="link"
                onClick={() => {
                  openSideDrawer();
                }}
              >
                <Space>
                  <Badge count={itemCount}>
                    <ShoppingCartOutlined style={{ fontSize: "1.7rem" }} />
                  </Badge>
                  {"\u20B1" + numeral(subtotal).format("0,0.00")}
                </Space>
              </Button>
            </Space>
          ) : (
            <Space style={{ float: "right", marginRight: "35px" }}>
              <Link style={{ fontWeight: "bold" }} to="/login">
                Login
              </Link>
              |
              <Link style={{ fontWeight: "bold" }} to="/signup">
                Signup
              </Link>
              <Button
                type="link"
                onClick={() => {
                  openSideDrawer();
                }}
              >
                <Space>
                  <Badge count={itemCount}>
                    <ShoppingCartOutlined style={{ fontSize: "1.7rem" }} />
                  </Badge>
                  {"\u20B1" + numeral(subtotal).format("0,0.00")}
                </Space>
              </Button>
            </Space>
          )}
        </Col>
      </Row>
    </Header>,
  ];
}

export default Head;
