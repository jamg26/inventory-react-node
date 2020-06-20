import React, { useContext, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { UserContext } from "../../../routes/routes";
import {
  Card,
  Layout,
  Tabs,
  PageHeader,
  Row,
  Col,
  Radio,
  Typography,
  Space,
  Spin,
  Input,
  Modal,
  Button,
  Breadcrumb,
  message,
  Table,
  Empty,
  Descriptions,
  Avatar,
} from "antd";
import numeral from "numeral";
import moment from "moment";
import Side from "../inc/side";
import CustomerChat from "../../global-components/fbMessanger";
import Header from "../inc/header";
import Cart from "../components/Cart";
import { ArrowRightOutlined, CheckCircleTwoTone } from "@ant-design/icons";
import ProductList from "../components/ProductList";
import { checkAuth } from "../../helper/authCheck";
import { withRouter, Link } from "react-router-dom";
import axios from "axios";
import LoadingPage from "../../global-components/loading";
import {
  api_base_url_orders,
  api_base_url,
  sandbox,
  production,
} from "../../../keys/index";
import { SettingContext } from "../../../routes/routes";
import TextArea from "antd/lib/input/TextArea";
import scriptLoader from "react-async-script-loader";
const { Content } = Layout;
const { TabPane } = Tabs;
const { Text, Title } = Typography;

function Dashboard(props) {
  const [lineItem, setlineItem] = useState([]);
  const [loading, setloading] = useState(true);
  const setting_configuration = useContext(SettingContext);
  const [collaped, setCollaped] = useState(false);
  const [showComponent, setShowComponent] = useState(false);
  const [showAddressModal, setshowAddressModal] = useState(false);
  const [paid, setpaid] = useState(false);
  const [showButtons, setshowButtons] = useState(false);
  const [loggedin, setloggedin] = useState(false);
  const [newemail, setnewemail] = useState("");
  const [newaddress, setnewaddress] = useState("");
  const [cart_data, setcart_data] = useState(undefined);
  const [FirstSetup, setFirstSetup] = useState(false);
  useEffect(() => {
    checkAuth();
  }, []);
  const checkAuth = async () => {
    const remember_me = localStorage.getItem("landing_remember_account");

    let account = localStorage.getItem("landing_remembered_account");
    if (account === null || account == "") {
      account = undefined;
    }
    if (account === undefined) {
      localStorage.setItem("landing_remember_account", false);
      localStorage.setItem("landing_remembered_account", "");
      localStorage.setItem("landing_credentials", "");
      localStorage.setItem("landing_customer_id", "");
      localStorage.setItem("landing_customer_login_token", "");
      setloggedin(false);
      const guest_address = localStorage.getItem("guest_address");
      if (guest_address == "" || guest_address == undefined) {
        setFirstSetup(true);
      }
    } else {
      const data = JSON.parse(account);
      const headers = {
        "Content-Type": "application/json",
      };
      const response = await axios.post(
        api_base_url + "/check_auth",
        { _id: data._id, login_token: data.login_token },
        { headers: headers }
      );
      if (response.data.status === "OK") {
        localStorage.setItem(
          "landing_remembered_account",
          JSON.stringify(response.data.data)
        );
        localStorage.setItem(
          "landing_credentials",
          JSON.stringify(response.data.data)
        );
        localStorage.setItem("landing_customer_id", response.data.data._id);
        localStorage.setItem(
          "landing_customer_login_token",
          response.data.data.login_token
        );
        setloggedin(true);
      } else {
        localStorage.setItem("landing_remember_account", false);
        localStorage.setItem("landing_remembered_account", "");
        localStorage.setItem("landing_credentials", "");
        localStorage.setItem("landing_customer_id", "");
        localStorage.setItem("landing_customer_login_token", "");
        setloggedin(false);
        const guest_address = localStorage.getItem("guest_address");
        if (guest_address == "" || guest_address == undefined) {
          setFirstSetup(true);
        }
      }
    }
  };
  useEffect(() => {
    if (props.location && props.location.state && props.location.state.cart) {
      setcart_data(props.location.state.cart);
    }
  }, [props]);
  useEffect(() => {
    console.log("cart_data", cart_data);
  }, [cart_data]);
  if (cart_data) {
    return [
      <Layout key="0">
        {/* <Side setCategory={setCategory} /> */}
        <Layout style={{ height: "100vh" }}>
          <Header loggedin={loggedin} />
          <Content
            style={{
              margin: "0",
              overflow: "initial",
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                margin: "0 auto",
                marginTop: "5%",
                width: "40%",
                padding: "10px 19px",
              }}
            >
              <Row gutter={[16, 16]}>
                <Col span="24">
                  <img
                    src={
                      setting_configuration ? setting_configuration.logo : ""
                    }
                    style={{ maxHeight: "100px" }}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span="24">
                  <Space>
                    <CheckCircleTwoTone
                      // twoToneColor="#52c41a"
                      style={{ fontSize: "64px" }}
                    />
                    <Space direction="vertical">
                      <Text>Order #37</Text>
                      <Title level={4} style={{ marginTop: "0px" }}>
                        Thank you{" "}
                        {cart_data ? cart_data.customer_info.fname : ""}!
                      </Title>
                    </Space>
                  </Space>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span="24">
                  <Card>
                    <Space>
                      <CheckCircleTwoTone twoToneColor="#52c41a" />
                      <Text strong>Your order is confirmed</Text>
                    </Space>
                  </Card>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span="24">
                  <Card>
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <Text strong style={{ fontSize: "20px" }}>
                        Customer Information
                      </Text>
                      <Row>
                        <Col span="12">
                          <Space
                            direction="vertical"
                            size="0"
                            style={{ width: "100%" }}
                          >
                            <Text strong>Contact Information</Text>
                            <Text>
                              {cart_data ? cart_data.customer_info.email : ""}
                            </Text>
                            <Text>
                              {cart_data ? cart_data.customer_info.phone : ""}
                            </Text>
                          </Space>
                        </Col>
                        <Col span="12">
                          <Space direction="vertical" style={{ width: "100%" }}>
                            <Space
                              direction="vertical"
                              style={{ width: "100%" }}
                              size="0"
                            >
                              <Text strong>Payment Method</Text>
                              <Space>
                                <Text>Paypal -</Text>
                                <Text strong>
                                  {`\u20B1` +
                                    numeral(cart_data.payment_total).format(
                                      "0,0.00"
                                    )}
                                </Text>
                              </Space>
                            </Space>
                            <Space
                              direction="vertical"
                              style={{ width: "100%" }}
                              size="0"
                            >
                              <Text strong>Shipping address</Text>
                              <Text>
                                {cart_data
                                  ? cart_data.customer_info.fname +
                                    " " +
                                    cart_data.customer_info.lname
                                  : ""}
                              </Text>
                              <Text>
                                {cart_data
                                  ? cart_data.customer_info.company
                                  : ""}
                              </Text>
                              <Text>
                                {cart_data
                                  ? cart_data.customer_info.address
                                  : ""}
                              </Text>
                            </Space>
                          </Space>
                        </Col>
                      </Row>
                    </Space>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col span="24" style={{ textAlign: "right" }}>
                  <Link to="/">
                    <Button type="primary" size="large">
                      Continue shopping
                    </Button>
                  </Link>
                </Col>
              </Row>
            </div>
          </Content>
        </Layout>
      </Layout>,
    ];
  } else {
    return [<LoadingPage tip="loading page..." />];
  }
}

export default withRouter(Dashboard);
