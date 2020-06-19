import React, { useContext, useState, useEffect, useRef } from "react";
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
  Drawer,
  Empty,
  List,
} from "antd";
import Side from "../inc/side";
import CustomerChat from "../../global-components/fbMessanger";
import Header from "../inc/header";
import numeral from "numeral";
import Cart from "../components/Cart";
import { ArrowRightOutlined } from "@ant-design/icons";
import ProductList from "../components/ProductList";
import { checkAuth } from "../../helper/authCheck";
import { withRouter, Link } from "react-router-dom";
import axios from "axios";
import LoadingPage from "../../global-components/loading";
import { api_base_url_orders, api_base_url } from "../../../keys/index";
import { SettingContext } from "../../../routes/routes";
import BasicScrollToBottom from "react-scroll-to-bottom/lib/BasicScrollToBottom";
const { Content } = Layout;
const { TabPane } = Tabs;
const { Text, Title } = Typography;
const scrollToRef = (ref) => window.scrollTo(0, 1000);
function Dashboard(props) {
  const myRef = useRef(null);
  const [searchFilterProducts, setSearchFilterProducts] = useState("");
  const [searchEntered, setsearchEntered] = useState(false);
  const executeScroll = () => scrollToRef(myRef);
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
  const [itemdrawer, setitemdrawer] = useState(false);
  const [proceed, setProceed] = useState(false);
  const [subtotal, setsubtotoal] = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState("Standard Delivery");
  const [customerNote, setCustomerNote] = useState("");
  const [cartrow, setCartrow] = useState([]);
  const [excl, setExcl] = useState(false);
  console.log("home loggedin", loggedin);
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
  useEffect(() => {
    if (cart != null) {
      setProceed(true);
      const filteredcart = [];
      let sub = 0;
      for (let x = 0; x < cart.line_item.length; x++) {
        let node = cart.line_item[x];
        if (node.product_type == "Product" || node.product_type == undefined) {
          let category =
            node.product.length != 0 && node.product[0].product_type.length != 0
              ? node.product[0].product_type[0].product_type_name
              : "No Category";
          if (
            category.toLowerCase() == "meat" ||
            category.toLowerCase() == "meats"
          ) {
            setExcl(true);
          }
          let taggg =
            node.product.length != 0 &&
            node.product[0].product_tags != undefined
              ? node.product[0].product_tags.map((d) => {
                  return [d.tag_label];
                })
              : [];
          for (let c = 0; c < taggg.length; c++) {
            if (
              taggg[c][0].toLowerCase() == "meat" ||
              taggg[c][0].toLowerCase() == "meats"
            ) {
              setExcl(true);
              break;
            }
          }
          let image =
            node.product[0].length != 0 &&
            node.product[0].variants[0].length != 0
              ? node.product[0].variants[0].images != "" &&
                node.product[0].variants[0].images != undefined &&
                node.product[0].variants[0].images != null
                ? node.product[0].variants[0].images
                : null
              : null;
          let price =
            node.product.length != 0 && node.product[0].variants.length != 0
              ? node.product[0].variants[0].price
              : 0;
          let quantity = node.quantity_max;
          filteredcart.push({
            key: x,
            type: node.product_type,
            order_id: cart._id,
            product_id: node.product.length != 0 ? node.product[0]._id : "",
            item_id: node._id,
            product_name:
              node.product.length != 0 ? node.product[0].product_name : "",
            product_description:
              node.product.length != 0
                ? node.product[0].product_description
                : "",
            tags: (
              <>
                {node.product.length != 0 &&
                node.product[0].product_tags != undefined
                  ? node.product[0].product_tags.map((d) => {
                      return [d.tag_label + " "];
                    })
                  : null}
              </>
            ),
            tag_list:
              node.product.length != 0 &&
              node.product[0].product_tags != undefined
                ? node.product[0].product_tags.map((d) => {
                    return [d.tag_label];
                  })
                : [],
            product_variant_id: node.variant_id,
            product_type: category,
            brand:
              node.product.length != 0 && node.product[0].variants.length != 0
                ? node.product[0].variants[0].brand
                : "No Brand",
            size:
              node.product.length != 0 && node.product[0].variants.length != 0
                ? node.product[0].variants[0].size
                : "No Size",
            color:
              node.product.length != 0 && node.product[0].variants.length != 0
                ? node.product[0].variants[0].color
                : "No Color",
            weight:
              node.product.length != 0 && node.product[0].variants.length != 0
                ? node.product[0].variants[0].weight
                : "No Weight",
            stock: parseFloat(quantity) < 1 ? "Out of Stock" : "In Stock",
            image:
              image != null ? (
                <img
                  style={{
                    width: "100%",
                    cursor: "pointer",
                    margin: "0 auto",
                  }}
                  src={image}
                />
              ) : (
                <Empty
                  description={false}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ),

            price: numeral(price).format("0,0.00"),
            price_raw: price,
            quantity: quantity,
            initial_quantity: node.quantity,
            sub_total: numeral(node.quantity * price).format("0,0.00"),
            actionData: node._id,
          });
          sub = parseFloat(sub) + parseFloat(node.quantity) * parseFloat(price);
        } else {
          let category =
            node.bundle.length != 0 &&
            node.bundle[0].product_type != null &&
            node.bundle[0].product_type.length != 0
              ? node.bundle[0].product_type[0].product_type_name
              : "No Category";
          if (
            category.toLowerCase() == "meat" ||
            category.toLowerCase() == "meats"
          ) {
            setExcl(true);
          }
          let taggg =
            node.bundle.length != 0 && node.bundle[0].product_tags != undefined
              ? node.bundle[0].product_tags.map((d) => {
                  return [d.tag_label];
                })
              : [];
          for (let c = 0; c < taggg.length; c++) {
            if (
              taggg[c][0].toLowerCase() == "meat" ||
              taggg[c][0].toLowerCase() == "meats"
            ) {
              setExcl(true);
              break;
            }
          }
          let image =
            node.bundle[0].length != 0
              ? node.bundle[0].image != "" &&
                node.bundle[0].image != undefined &&
                node.bundle[0].image != null
                ? node.bundle[0].image
                : null
              : null;
          let price = node.bundle.length != 0 ? node.bundle[0].bundle_price : 0;
          let quantity = node.quantity_max;
          filteredcart.push({
            key: x,
            type: node.product_type,
            order_id: cart._id,
            product_id: node.bundle.length != 0 ? node.bundle[0]._id : "",
            item_id: node._id,
            product_name: node.bundle.length != 0 ? node.bundle[0].name : "",
            product_description:
              node.bundle.length != 0 ? node.bundle[0].description : "",
            tags: (
              <>
                {node.bundle.length != 0 &&
                node.bundle[0].product_tags != undefined
                  ? node.bundle[0].product_tags.map((d) => {
                      return [d.tag_label + " "];
                    })
                  : null}
              </>
            ),
            tag_list:
              node.bundle.length != 0 &&
              node.bundle[0].product_tags != undefined
                ? node.bundle[0].product_tags.map((d) => {
                    return [d.tag_label];
                  })
                : [],
            product_variant_id: node.variant_id,
            product_type: category,
            brand: node.bundle.length != 0 ? node.bundle[0].brand : "No Brand",
            size: "(" + node.product_type + ")",
            color: "",
            weight: "",
            stock: parseFloat(quantity) < 1 ? "Out of Stock" : "In Stock",
            image:
              image != null ? (
                <img
                  style={{
                    width: "100%",
                    cursor: "pointer",
                    margin: "0 auto",
                  }}
                  src={image}
                />
              ) : (
                <Empty
                  description={false}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ),

            price: numeral(price).format("0,0.00"),
            price_raw: price,
            quantity: quantity,
            initial_quantity: node.quantity,
            sub_total: numeral(node.quantity * price).format("0,0.00"),
            actionData: node._id,
          });
          sub = parseFloat(sub) + parseFloat(node.quantity) * parseFloat(price);
        }
      }
      setsubtotoal(sub);
      setDeliveryMethod(cart.delivery_method);
      setCustomerNote(cart.order_note);
      setCartrow(filteredcart);
    } else {
      setCartrow([]);
      setProceed(false);
    }
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
    let guest_id = localStorage.getItem("guest_cart_id");
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
          <Header
            loggedin={loggedin}
            itemCount={itemCount}
            subtotal={subtotal}
            openSideDrawer={() => setitemdrawer(true)}
            searchFilterProducts={searchFilterProducts}
            setSearchFilterProducts={(value) => setSearchFilterProducts(value)}
            setsearchEntered={(value) => setsearchEntered(value)}
            searchEntered={searchEntered}
          />
          <Content
            style={{
              margin: "0px",
              overflow: "initial",
            }}
          >
            <Drawer
              width="20%"
              height="85vh"
              className="customDrawer"
              title="Quick View Cart"
              placement="right"
              closable={false}
              onClose={() => {
                setitemdrawer(false);
              }}
              footer={
                <div style={{ width: "100%" }}>
                  <Button
                    block
                    onClick={() => {
                      setShowCart(true);
                      setTimeout(() => {
                        console.log("scrolling");
                        if (document.getElementById("cart_div")) {
                          document
                            .getElementById("cart_div")
                            .scrollIntoView({ behavior: "smooth" });
                        }
                        setitemdrawer(false);
                      }, 1000);
                    }}
                    type="primary"
                  >
                    Go to Cart
                  </Button>
                </div>
              }
              visible={itemdrawer}
            >
              <table style={{ width: "95%" }}>
                <thead>
                  <tr>
                    <th
                      style={{
                        verticalAlign: "middle",
                        textAlign: "left",
                        padding: "10px 0px",
                      }}
                    >
                      ITEM
                    </th>
                    <th
                      style={{
                        verticalAlign: "middle",
                        textAlign: "center",
                        padding: "10px 0px",
                      }}
                    >
                      QTY
                    </th>
                    <th
                      style={{
                        verticalAlign: "middle",
                        textAlign: "right",
                        padding: "10px 0px",
                      }}
                    >
                      TOTAL
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cartrow.map((item, index) => {
                    return [
                      <tr>
                        <td
                          style={{
                            verticalAlign: "middle",
                            padding: "10px 0px",
                          }}
                        >
                          <Space direction="vertical" style={{ width: "100%" }}>
                            {item.product_name}
                          </Space>
                        </td>
                        <td
                          style={{
                            verticalAlign: "middle",
                            textAlign: "center",
                            padding: "10px 0px",
                          }}
                        >
                          {item.initial_quantity}
                        </td>
                        <td
                          width="20%"
                          style={{
                            verticalAlign: "middle",
                            padding: "10px 0",
                          }}
                        >
                          <Space
                            direction="vertical"
                            style={{ textAlign: "right", width: "100%" }}
                          >
                            {item.sub_total}
                          </Space>
                        </td>
                      </tr>,
                    ];
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <th
                      colSpan="2"
                      style={{ verticalAlign: "middle", textAlign: "right" }}
                    >
                      {" "}
                      <Text>Total </Text>
                    </th>
                    <th style={{ verticalAlign: "middle", textAlign: "right" }}>
                      {" "}
                      {numeral(subtotal).format("0,0.00")}
                    </th>
                  </tr>
                </tfoot>
              </table>
            </Drawer>
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
            <div className=" dyn-height-no-padding-home">
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <img
                    id="ecombanner"
                    src={process.env.PUBLIC_URL + "/images/banner.png"}
                    width="100%"
                  />
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col
                  span={24}
                  style={{ paddingLeft: "30px", paddingRight: "30px" }}
                >
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
                        style={{ marginBottom: "6px" }}
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
              <Row gutter={[16, 16]}>
                <Col
                  span={24}
                  style={{ paddingLeft: "30px", paddingRight: "30px" }}
                >
                  <Card size="small">
                    <Title level={4} style={{ color: "#2790ff" }}>
                      {category}
                    </Title>
                    <ProductList
                      category={category}
                      products={products}
                      bundle={bundle}
                      cart={cart}
                      searchFilterProducts={searchFilterProducts}
                      setSearchFilterProducts={(value) =>
                        setSearchFilterProducts(value)
                      }
                      setsearchEntered={(value) => setsearchEntered(value)}
                      searchEntered={searchEntered}
                      refresh={() => get_cart()}
                      showCart={showCart}
                      show={() => {
                        setShowCart(true);
                        // messagesEndRef.current.scrollIntoView({
                        //   behavior: "smooth",
                        // });
                        setTimeout(() => {
                          console.log("scrolling");
                          if (document.getElementById("cart_div")) {
                            document
                              .getElementById("cart_div")
                              .scrollIntoView({ behavior: "smooth" });
                          }
                        }, 1000);
                      }}
                    />
                  </Card>
                </Col>
              </Row>

              {showCart ? (
                <Cart
                  setCart={setCart}
                  cart={cart}
                  get_cart={() => get_cart()}
                  refreshCart={refreshCart}
                  show={(ev) => setShowCart(ev)}
                  loggedin={loggedin}
                />
              ) : null}
              <Button
                block
                style={{
                  backgroundColor: "#1890ff",
                  color: "white",
                  height: "8vh",
                }}
                onClick={() =>
                  document
                    .getElementById("ecombanner")
                    .scrollIntoView({ behavior: "smooth" })
                }
              >
                Back to Top
              </Button>
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
