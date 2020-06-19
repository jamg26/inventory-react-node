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
} from "antd";
import numeral from "numeral";
import moment from "moment";
import Side from "../inc/side";
import CustomerChat from "../../global-components/fbMessanger";
import Header from "../inc/header";
import Cart from "../components/Cart";
import { ArrowRightOutlined } from "@ant-design/icons";
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
const CLIENT = {
  sandbox: sandbox,
  production: production,
};

const CLIENT_ID = CLIENT.sandbox;
let PayPalButton = null;
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
  const toggle = () => {
    setCollaped(!collaped);
  };
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
  const line_item_column = [
    {
      title: "Image",
      dataIndex: "image",
      width: "15%",
      render: (value, row, index) => {
        return [
          value != null ? (
            <img
              style={{
                width: "100%",
                cursor: "pointer",
                margin: "0 auto",
              }}
              src={value}
            />
          ) : (
            <Empty description={false} image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ),
        ];
      },
    },
    {
      title: "Item",
      dataIndex: "product",
      sorter: (a, b) => a.product.length - b.product.length,
      sortDirections: ["descend", "ascend"],
    },

    {
      title: "Total",
      dataIndex: "total",
      sorter: (a, b) => a.total.length - b.total.length,
      sortDirections: ["descend", "ascend"],
      align: "right",
    },
  ];
  useEffect(() => {
    console.log("paypal", props.isScriptLoaded, props.isScriptLoadSucceed);
    if (props.isScriptLoaded && props.isScriptLoadSucceed) {
      PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });
      setloading(false);
    }
  }, [props]);
  useEffect(() => {
    if (props.location && props.location.state && props.location.state.cart) {
      setcart_data(props.location.state.cart);
      var line_items = [];
      for (var c = 0; c < props.location.state.cart.line_item.length; c++) {
        var row = props.location.state.cart.line_item[c];
        let image = "";
        if (row.product_type == "Product" || row.product_type == undefined) {
          image =
            row && row.product && row.product[0].length != 0
              ? row.product[0].variants &&
                row.product[0].variants[0].length != 0
                ? row.product[0].variants[0]
                  ? row.product[0].variants[0].images != "" &&
                    row.product[0].variants[0].images != undefined &&
                    row.product[0].variants[0].images != null
                    ? row.product[0].variants[0].images
                    : null
                  : null
                : null
              : null;
        } else {
          console.log(row.bundle);
          image =
            row && row.bundle && row.bundle[0].length != 0
              ? row.bundle[0].variants && row.bundle[0].variants[0].length != 0
                ? row.bundle[0].variants[0]
                  ? row.bundle[0].variants[0].images != "" &&
                    row.bundle[0].variants[0].images != undefined &&
                    row.bundle[0].variants[0].images != null
                    ? row.bundle[0].variants[0].images
                    : null
                  : null
                : null
              : null;
        }

        line_items.push({
          image: image,
          product:
            row.product_type == "Product"
              ? row.product.length != 0
                ? row.product[0].product_name
                : ""
              : row.bundle.length != 0
              ? row.bundle[0].name
              : "",
          order_date: moment(row.order_date).format("MM-DD-YYYY"),
          price: numeral(row.price).format("0,0.00"),
          original_price: numeral(row.original_price).format("0,0.00"),
          quantity: row.quantity,
          total: numeral(row.total).format("0,0.00"),
        });
      }
      setlineItem(line_items);
      console.log(props.location.state.cart);
    }
  }, [props]);
  let amou = 0;
  let subamount = 0;
  if (cart_data) {
    for (let c = 0; c < cart_data.line_item.length; c++) {
      subamount =
        parseFloat(subamount) + parseFloat(cart_data.line_item[c].total);
      amou = parseFloat(amou) + parseFloat(cart_data.line_item[c].total);
    }
    amou =
      parseFloat(amou) +
      parseFloat(
        cart_data.delivery_method == "Standard Delivery"
          ? 350
          : cart_data.delivery_method == "Exclusive Delivery"
          ? 500
          : 0
      );
    // setamount(amou);
  }
  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          description: +"Mercedes G-Wagon",
          amount: {
            currency_code: "PHP",
            // value: amou.toFixed(2),
            value: amou.toFixed(2),
          },
        },
      ],
    });
  };
  const handleApproveOrder = async (details) => {
    const headers = {
      "Content-Type": "application/json",
    };
    let landing_customer_login_token = localStorage.getItem(
      "landing_customer_login_token"
    );
    const response = await axios
      .post(
        api_base_url_orders + "/add_cart_to_order",
        {
          order_id: cart_data._id,
          details: details,
          amou: amou,
          login_token: landing_customer_login_token,
        },
        { headers: headers }
      )
      .then((response) => {
        props.history.push({
          pathname: "/ty",
          state: { cart: response.data.cart },
        });
      })
      .catch((err) => {
        message.error(err.message);
      });

    // get_cart();
    // window.location.reload();
  };
  const onApprove = (data, actions) => {
    actions.order.capture().then((details) => {
      const paymentData = {
        payerID: data.payerID,
        orderID: data.orderID,
      };
      if (details.status === "COMPLETED") {
        handleApproveOrder(details);
      }

      setpaid(true);
    });
  };
  if (cart_data) {
    const submitNewEmail = async () => {
      console.log(newemail, cart_data.customer_info.email);
      if (newemail != "" && newemail != undefined && newemail != null) {
        if (newemail == cart_data.customer_info.email) {
        } else {
          if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(newemail)) {
            const headers = {
              "Content-Type": "application/json",
            };
            const response = await axios
              .post(
                api_base_url_orders + "/update_order_email",
                {
                  order_id: cart_data._id,
                  email: newemail,
                },
                { headers: headers }
              )
              .then((response) => {
                setcart_data(response.data.cart);

                // history.push({
                //   pathname: "/payment",
                //   state: { cart: response.data.cart },
                // });
                // setshowButtons(true);
              })
              .catch((err) => {
                message.err("something went wrong please try again later..");
              });
          } else {
            message.error("Please Provide a valid email");
          }
        }
      }
    };
    const submitNewAddress = async () => {
      if (newaddress != "" && newaddress != undefined && newaddress != null) {
        if (newaddress == cart_data.customer_info.address) {
        } else {
          const headers = {
            "Content-Type": "application/json",
          };
          const response = await axios
            .post(
              api_base_url_orders + "/update_order_address",
              {
                order_id: cart_data._id,
                address: newaddress,
              },
              { headers: headers }
            )
            .then((response) => {
              setcart_data(response.data.cart);

              // history.push({
              //   pathname: "/payment",
              //   state: { cart: response.data.cart },
              // });
              // setshowButtons(true);
            })
            .catch((err) => {
              message.err("something went wrong please try again later..");
            });
        }
      }
    };
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
            <Modal
              title="Change Contact"
              visible={showComponent}
              onCancel={() => {
                setShowComponent(false);
                setnewemail(cart_data.customer_info.email);
              }}
              onOk={() => {
                submitNewEmail();
              }}
              okText="Submit"
            >
              <Input
                value={newemail}
                onChange={(e) => {
                  setnewemail(e.target.value);
                }}
              />
            </Modal>
            <Modal
              title="Change Address"
              visible={showAddressModal}
              onCancel={() => {
                setshowAddressModal(false);
                setnewaddress(cart_data.customer_info.address);
              }}
              onOk={() => {
                submitNewAddress();
              }}
              okText="Submit"
            >
              <TextArea
                value={newaddress}
                onChange={(e) => {
                  setnewaddress(e.target.value);
                }}
              />
            </Modal>
            <Card
              style={{ margin: "0px", height: "100%" }}
              bodyStyle={{ padding: "0", height: "100%" }}
            >
              <div className="dyn-height-no-padding">
                <Row style={{ height: "100%" }}>
                  <Col span="14" style={{ padding: "10px 16px" }}>
                    <Space
                      direction="vertical"
                      style={{ width: "100%", marginBottom: "24px" }}
                    >
                      <Title level={4} style={{ margin: 0 }}>
                        Payment Page
                      </Title>
                      <Breadcrumb separator=">">
                        <Breadcrumb.Item>
                          <Link to="/" className="btn-link">
                            Home
                          </Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>Payment</Breadcrumb.Item>
                      </Breadcrumb>
                    </Space>
                    <Card
                      style={{ marginBottom: "24px" }}
                      bodyStyle={{ padding: "0px 10px" }}
                    >
                      <table style={{ width: "100%" }}>
                        <tbody>
                          <tr>
                            <td
                              width="10%"
                              style={{
                                verticalAlign: "middle",
                                padding: "12px 0px",
                                color: "#979797",
                              }}
                            >
                              Contact
                            </td>
                            <td
                              width="80%"
                              style={{
                                verticalAlign: "middle",
                                padding: "12px 0px",
                              }}
                            >
                              <Text strong>
                                {cart_data.customer_info.email}
                              </Text>
                            </td>
                            <td
                              width="10%"
                              style={{
                                verticalAlign: "middle",
                                padding: "12px 0px",
                                textAlign: "right",
                              }}
                            >
                              <Button
                                type="link"
                                onClick={() => {
                                  setShowComponent(true);
                                  setnewemail(cart_data.customer_info.email);
                                }}
                              >
                                Change
                              </Button>
                            </td>
                          </tr>
                          <tr
                            style={{
                              borderTop: "1px solid #f3f3f3",
                              borderBottom: "1px solid #f3f3f3",
                            }}
                          >
                            <td
                              style={{
                                verticalAlign: "middle",
                                padding: "12px 0px",
                                color: "#979797",
                              }}
                            >
                              Address
                            </td>
                            <td
                              style={{
                                verticalAlign: "middle",
                                padding: "12px 0px",
                              }}
                            >
                              <Text strong>
                                {cart_data.customer_info.address}
                              </Text>
                            </td>
                            <td
                              style={{
                                verticalAlign: "middle",
                                padding: "12px 0px",
                                textAlign: "right",
                              }}
                            >
                              <Button
                                type="link"
                                onClick={() => {
                                  setshowAddressModal(true);
                                  setnewaddress(
                                    cart_data.customer_info.address
                                  );
                                }}
                              >
                                Change
                              </Button>
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                verticalAlign: "middle",
                                padding: "12px 0px",
                              }}
                            >
                              Method
                            </td>
                            <td
                              style={{
                                verticalAlign: "middle",
                                padding: "12px 0px",
                                color: "#979797",
                              }}
                            >
                              <Text strong>{cart_data.delivery_method}</Text>
                            </td>
                            <td
                              style={{
                                verticalAlign: "middle",
                                padding: "12px 0px",
                                textAlign: "right",
                              }}
                            ></td>
                          </tr>
                        </tbody>
                      </table>
                    </Card>
                    <Text strong>Payment</Text>
                    <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
                      <Col span="24" style={{ textAlign: "left" }}>
                        {!loading ? (
                          <PayPalButton
                            style={{
                              color: "gold",
                              label: "checkout",
                              maxWidth: "100%",
                              width: "100%",
                            }}
                            createOrder={(data, actions) =>
                              createOrder(data, actions)
                            }
                            onApprove={(data, actions) =>
                              onApprove(data, actions)
                            }
                            onError={(err) => {
                              message.error(err.message);
                            }}
                          />
                        ) : null}
                      </Col>
                    </Row>
                  </Col>
                  <Col
                    span="10"
                    style={{ backgroundColor: "#e6f2f5", padding: "10px 16px" }}
                  >
                    <Table
                      columns={line_item_column}
                      dataSource={lineItem}
                      pagination={false}
                    />
                    <Descriptions
                      bordered
                      column={2}
                      size="small"
                      style={{
                        borderTop: "1px solid #ccc",
                        borderBottom: "1px solid #ccc",
                        marginTop: "16px",
                      }}
                      className="CartDescriptions"
                    >
                      <Descriptions.Item style={{ textAlign: "left" }}>
                        SUBTOTAL
                      </Descriptions.Item>
                      <Descriptions.Item style={{ fontWeight: "bold" }}>
                        {"\u20B1" + numeral(subamount).format("0,0.00")}
                      </Descriptions.Item>
                      <Descriptions.Item style={{ textAlign: "left" }}>
                        DELIVERY CHARGE
                      </Descriptions.Item>
                      <Descriptions.Item style={{ fontWeight: "bold" }}>
                        {cart_data == null
                          ? `\u20B1` + numeral(0).format("0,0.00")
                          : cart_data.delivery_method == "Standard Delivery"
                          ? "\u20B1" + numeral(350).format("0,0.00")
                          : cart_data.delivery_method == "Exclusive Delivery"
                          ? "\u20B1" + numeral(500).format("0,0.00")
                          : "\u20B1" + numeral(0).format("0,0.00")}
                      </Descriptions.Item>
                    </Descriptions>
                    <Descriptions
                      bordered
                      column={2}
                      size="small"
                      style={{}}
                      className="CartDescriptions"
                    >
                      <Descriptions.Item
                        style={{ fontWeight: "bold", textAlign: "left" }}
                      >
                        TOTAL
                      </Descriptions.Item>
                      <Descriptions.Item
                        style={{ fontWeight: "bold", fontSize: "18px" }}
                      >
                        {"\u20B1" +
                          numeral(
                            parseFloat(
                              cart_data == null
                                ? 0
                                : cart_data.delivery_method ==
                                  "Standard Delivery"
                                ? 350
                                : cart_data.delivery_method ==
                                  "Exclusive Delivery"
                                ? 500
                                : 0
                            ) + parseFloat(subamount)
                          ).format("0,0.00")}
                      </Descriptions.Item>
                    </Descriptions>
                  </Col>
                </Row>
              </div>
            </Card>
          </Content>
        </Layout>
      </Layout>,
    ];
  } else {
    return [<LoadingPage tip="loading page..." />];
  }
}

export default scriptLoader(
  `https://www.paypal.com/sdk/js?currency=PHP&client-id=${CLIENT_ID}`
  // `https://www.paypal.com/sdk/js?client-id=${CLIENT_ID}`
)(withRouter(Dashboard));
