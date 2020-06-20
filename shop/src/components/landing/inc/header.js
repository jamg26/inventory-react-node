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
  Typography,
  Avatar,
  AutoComplete,
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
const { Text } = Typography;
function Head({
  loggedin,
  itemCount = 0,
  subtotal = 0,
  openSideDrawer = () => {},
  searchFilterProducts = undefined,
  setSearchFilterProducts = () => {},
  setsearchEntered = () => {},
  searchEntered = undefined,
  autocompletefilter = [],
  set_autocompletefilter = () => {},
  clean_autofilter = [],
  setclear_autofilter = () => {},
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
        <Col span="8" style={{ textAlign: "right", paddingRight: "20px" }}>
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
            <AutoComplete
              className="searchbar-header"
              options={clean_autofilter}
              style={{
                width: "100%",
              }}
              dropdownMatchSelectWidth={100}
              filterOption={(inputValue, option) =>
                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
                -1
              }
              placeholder="search for  products, brands, categories, etc"
              value={searchFilterProducts}
              onChange={(e) => setSearchFilterProducts(e)}
            >
              <Search
                className="searchbar-header"
                enterButton={
                  <Space
                    onClick={() => {
                      if (document.getElementById("Product_list_Card")) {
                        document
                          .getElementById("Product_list_Card")
                          .scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                  >
                    <SearchOutlined />
                    Search
                  </Space>
                }
                onPressEnter={() => {
                  if (document.getElementById("Product_list_Card")) {
                    document
                      .getElementById("Product_list_Card")
                      .scrollIntoView({ behavior: "smooth" });
                  }
                }}
                suffix={
                  <CloseCircleOutlined
                    style={{ opacity: "0.5" }}
                    onClick={() => {
                      setSearchFilterProducts("");
                      setsearchEntered(!searchEntered);
                    }}
                  />
                }
              />
            </AutoComplete>
          ) : null}
        </Col>
        <Col span="8">
          {loggedin ? (
            <Space style={{ float: "right", marginRight: "70px" }}>
              <Dropdown overlay={menu} trigger={["click"]}>
                <Button
                  type="link"
                  style={{ float: "right", height: "100%", color: "black" }}
                >
                  <UserOutlined />
                </Button>
              </Dropdown>
              <Space size={15}>
                <Badge count={itemCount} style={{}}>
                  <Avatar
                    onClick={() => {
                      openSideDrawer();
                    }}
                    style={{ backgroundColor: "unset", cursor: "pointer" }}
                    icon={<ShoppingCartOutlined style={{ fontSize: "2rem" }} />}
                  />
                </Badge>
                <Text
                  strong
                  onClick={() => {
                    openSideDrawer();
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {"\u20B1" + numeral(subtotal).format("0,0.00")}
                </Text>
              </Space>
            </Space>
          ) : (
            <Space
              style={{ float: "right", marginRight: "70px" }}
              align="center"
            >
              {" "}
              <Link
                style={{ fontWeight: "bold" }}
                to="/login"
                className="ant-btn ant-btn-link"
              >
                <Space align="center">Login</Space>
              </Link>
              |
              <Link
                style={{ fontWeight: "bold" }}
                to="/signup"
                className="ant-btn ant-btn-link"
              >
                <Space align="center">Signup</Space>
              </Link>
              {/* <Button
                type="link"
               
              >
                
              </Button> */}
              <Space size={15}>
                <Badge count={itemCount} style={{}}>
                  <Avatar
                    onClick={() => {
                      openSideDrawer();
                    }}
                    style={{ backgroundColor: "unset", cursor: "pointer" }}
                    icon={<ShoppingCartOutlined style={{ fontSize: "2rem" }} />}
                  />
                </Badge>
                <Text
                  strong
                  onClick={() => {
                    openSideDrawer();
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {"\u20B1" + numeral(subtotal).format("0,0.00")}
                </Text>
              </Space>
            </Space>
          )}
        </Col>
      </Row>
    </Header>,
  ];
}

export default Head;
