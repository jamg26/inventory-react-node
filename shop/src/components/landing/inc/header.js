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
  Drawer,
  Steps,
  Card,
  message,
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
  CheckOutlined,
} from "@ant-design/icons";
import numeral from "numeral";
import { Link } from "react-router-dom";
import { SettingContext } from "../../../routes/routes";
import axios from "axios";
import { api_base_url } from "../../../keys";
const { Header } = Layout;
const { Search } = Input;
const { Text } = Typography;
const { Step } = Steps;
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
  const [verification_drawer, set_verification_drawer] = useState(false);
  const [customer_data, set_customer_data] = useState(undefined);
  const [verification_code_input, set_verification_code_input] = useState("");
  const [step_steps, set_step_steps] = useState(0);
  useEffect(() => {
    check_authentication();
  }, []);
  const check_authentication = () => {
    console.log("refreshing customer data");
    let account = localStorage.getItem("landing_remembered_account");
    if (account === null || account == "") {
      account = undefined;
    }
    console.log("account", account);
    if (account === undefined) {
    } else {
      const data = JSON.parse(account);
      set_customer_data(data);
      setUserName(data.username);
      if (!data.verification_status) {
        set_verification_drawer(true);
      } else {
        set_verification_drawer(false);
      }
    }
  };
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
  const steps = [
    {
      title: "Verify Phone No.",
      content: "First-content",
    },

    {
      title: "Done",
      content: "Last-content",
      icon: <CheckOutlined />,
    },
  ];

  const verify_code = async () => {
    if (customer_data) {
      const headers = {
        "Content-Type": "application/json",
      };
      const response = await axios
        .post(
          api_base_url + "/verify_code",
          { _id: customer_data._id, code: verification_code_input },
          { headers: headers }
        )
        .then((result) => {
          if (result.data.message == "OK") {
            const user_data = result.data.user;
            localStorage.setItem(
              "landing_remembered_account",
              JSON.stringify(user_data)
            );
            localStorage.setItem(
              "landing_credentials",
              JSON.stringify(user_data)
            );
            set_step_steps(1);
            setTimeout(() => {
              check_authentication();
            }, 2000);
          } else {
            message.error(result.data.message);
          }
        })
        .catch((err) => {
          console.log("err resend code", err);
        });
    }
  };
  const resend_code = async () => {
    if (customer_data) {
      const headers = {
        "Content-Type": "application/json",
      };
      const response = await axios
        .post(
          api_base_url + "/resend_code",
          { _id: customer_data._id },
          { headers: headers }
        )
        .then((result) => {
          const user_data = result.data.user;
          localStorage.setItem(
            "landing_remembered_account",
            JSON.stringify(user_data)
          );
          localStorage.setItem(
            "landing_credentials",
            JSON.stringify(user_data)
          );
        })
        .catch((err) => {
          console.log("err resend code", err);
        });
    }
  };
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
      <Drawer
        placement="left"
        width="100%"
        closable={false}
        visible={verification_drawer}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col span="8"></Col>
          <Col span="8">
            <Space direction="vertical" style={{ width: "100%" }} size={40}>
              <Steps current={step_steps} className="CustomSteps">
                {steps.map((item) => (
                  <Step key={item.title} title={item.title} icon={item.icon} />
                ))}
              </Steps>
              <Card>
                <Row gutter={[16, 16]}>
                  <Col span="24" style={{ textAlign: "center" }}>
                    <Text strong>Enter Verification Code</Text>
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col span="24" style={{ textAlign: "center" }}>
                    <Space
                      direction="vertical"
                      size={12}
                      style={{ width: "100%" }}
                    >
                      <Space
                        direction="vertical"
                        size={2}
                        style={{ width: "100%" }}
                      >
                        <Text>Your verification code is sent by SMS to</Text>
                        <Text strong>
                          {customer_data ? customer_data.phone : ""}
                        </Text>
                      </Space>
                      <Input
                        size="large"
                        placeholder="verification code( XXXXX )"
                        value={verification_code_input}
                        onChange={(e) =>
                          set_verification_code_input(e.target.value)
                        }
                        onPressEnter={() => {
                          verify_code();
                        }}
                      />
                      <Button
                        className="ant-btn-verify"
                        size="large"
                        block
                        onClick={() => {
                          verify_code();
                        }}
                      >
                        VERIFY
                      </Button>
                      <Space size="0">
                        <Text>didn't receive verification code?</Text>
                        <Button type="link" onClick={() => resend_code()}>
                          resend code
                        </Button>
                      </Space>
                    </Space>
                  </Col>
                </Row>
              </Card>
            </Space>
          </Col>
          <Col span="8"></Col>
        </Row>
      </Drawer>
      <Row align="middle">
        <Col
          span="8"
          style={{
            textAlign: searchFilterProducts != undefined ? "right" : "left",
            paddingRight: "20px",
          }}
        >
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
                float: "left",
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
            <Space style={{ float: "right", marginRight: "100px" }}>
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
                  className="header_amount"
                  strong
                  style={{ fontSize: "16px !important" }}
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
              style={{ float: "right", marginRight: "100px" }}
              align="center"
            >
              {" "}
              <Link
                style={{ fontWeight: "bold", paddingRight: 0 }}
                to="/login"
                className="ant-btn ant-btn-link"
              >
                <Space align="center">Login</Space>
              </Link>
              |
              <Link
                style={{ fontWeight: "bold", paddingLeft: 0 }}
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
                  className="header_amount"
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
