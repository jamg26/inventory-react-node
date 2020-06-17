import React, { useContext, useState, useEffect } from "react";
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
  message,
} from "antd";
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
import { api_base_url_orders, api_base_url } from "../../../keys/index";
import { SettingContext } from "../../../routes/routes";
const { Content } = Layout;
const { TabPane } = Tabs;
const { Text } = Typography;
function Dashboard(props) {
  const setting_configuration = useContext(SettingContext);
  const [collaped, setCollaped] = useState(false);
  const [active, setActive] = useState("0");
  const [category, setCategory] = useState("All Products");
  const [showComponent, setShowComponent] = useState(true);
  const [refreshCart, SetRefreshCart] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [bundle, setBundle] = useState([]);
  const [category_list, setcategory_list] = useState([]);
  const [cart, setCart] = useState(null);
  const [loggedin, setloggedin] = useState(false);
  const [FirstSetup, setFirstSetup] = useState(false);

  const toggle = () => {
    setCollaped(!collaped);
  };
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
    checkAuth();
    get_cart();
    get_products();
    get_bundles();
    get_products_type_list();
  }, []);
  useEffect(() => {}, [products]);
  useEffect(() => {
    get_products();
  }, [cart]);
  const get_products = async () => {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.get(
      api_base_url_orders + "/products",
      {},
      { headers: headers }
    );
    setProducts(response.data);
  };
  const get_bundles = async () => {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.get(
      api_base_url_orders + "/bundles",
      {},
      { headers: headers }
    );
    setBundle(response.data);
  };
  const get_products_type_list = async () => {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.get(
      api_base_url_orders + "/get_categories",
      {},
      { headers: headers }
    );
    setcategory_list(response.data.product_types_list);
  };
  const get_cart = async () => {
    let customer_id = localStorage.getItem("landing_customer_id");
    let guest_id = localStorage.getItem("guest_id");
    console.log("customer_cart", customer_id == "" ? guest_id : customer_id);
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.get(
      api_base_url_orders +
        "/customer_cart/" +
        (customer_id == "" ? guest_id : customer_id),
      {},
      { headers: headers }
    );
    setCart(response.data.cart);
    setShowCart(
      response.data.cart != null && response.data.cart.line_item.length != 0
        ? true
        : false
    );
    setItemCount(
      response.data.cart != null ? response.data.cart.line_item.length : 0
    );
  };
  const [guest_address, setguest_address] = useState("");
  const submit_address = () => {
    if (guest_address == "") {
      message.error("please enter a Delivery Address");
    } else {
      localStorage.setItem("guest_address", guest_address);
      setFirstSetup(false);
    }
  };
  if (showComponent) {
    return [
      <Layout key="0">
        {/* <Side setCategory={setCategory} /> */}
        <Layout style={{ height: "100vh" }}>
          <Header loggedin={loggedin} />
          <Content
            style={{
              margin: "24px 16px 24px 16px",
              overflow: "initial",
            }}
          >
            <CustomerChat
              page_id={
                setting_configuration ? setting_configuration.fb_page_id : ""
              }
              app_id={
                setting_configuration ? setting_configuration.fb_app_id : ""
              }
            />

            <Modal
              visible={FirstSetup}
              closable={false}
              onCancel={() => {}}
              footer={null}
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                <Text>Enter Delivery Address</Text>
                <Input
                  placeholder="Delivery Address"
                  onPressEnter={() => {
                    submit_address();
                  }}
                  value={guest_address}
                  onChange={(e) => {
                    setguest_address(e.target.value);
                  }}
                />
                <Button
                  type="primary"
                  onClick={() => {
                    submit_address();
                  }}
                >
                  Submit
                </Button>
              </Space>
            </Modal>
            <div className=" dyn-height">
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <img
                    src={process.env.PUBLIC_URL + "/images/banner.png"}
                    width="100%"
                  />
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Card size="small">
                    <Space direction={"vertical"}>
                      <Text strong style={{ marginBottom: "3%" }}>
                        Choose a Category
                      </Text>

                      <Radio.Group
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                        className="category-radio"
                        buttonStyle="solid"
                      >
                        <Radio.Button value="All Products">
                          All Products
                        </Radio.Button>
                        {category_list.length != 0
                          ? category_list.map((row, index) => {
                              return [
                                <Radio.Button value={row.product_type_name}>
                                  {row.product_type_name}
                                </Radio.Button>,
                              ];
                            })
                          : null}
                      </Radio.Group>
                    </Space>
                  </Card>
                </Col>
              </Row>

              <PageHeader className="site-page-header" title={category} />
              <Tabs
                onChange={(ev) => {
                  setActive(ev);
                }}
                defaultActiveKey="0"
                activeKey={active}
                type="card"
                tabBarStyle={{ paddingLeft: "20px", paddingRight: "20px" }}
              >
                <TabPane tab="Order Grocery Items" key="0">
                  <ProductList
                    category={category}
                    products={products}
                    bundle={bundle}
                    cart={cart}
                    refresh={() => get_cart()}
                    showCart={showCart}
                    show={() => {
                      setShowCart(!showCart);
                    }}
                  />
                </TabPane>
              </Tabs>
              {showCart ? (
                <Cart
                  setCart={setCart}
                  cart={cart}
                  get_cart={() => get_cart()}
                  refreshCart={refreshCart}
                  show={(ev) => setShowCart(ev)}
                />
              ) : null}
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
