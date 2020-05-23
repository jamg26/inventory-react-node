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
} from "antd";
import Side from "../inc/side";
import Header from "../inc/header";
import Cart from "../components/Cart";
import { ArrowRightOutlined } from "@ant-design/icons";
import ProductList from "../components/ProductList";
import { checkAuth } from "../../helper/authCheck";
import { withRouter, Link } from "react-router-dom";
import axios from "axios";
import LoadingPage from "../../global-components/loading";
import { api_base_url_orders } from "../../../keys/index";
const { Content } = Layout;
const { TabPane } = Tabs;
const { Text } = Typography;
function Dashboard(props) {
  const [collaped, setCollaped] = useState(false);
  const [active, setActive] = useState("0");
  const [category, setCategory] = useState("All Products");
  const [showComponent, setShowComponent] = useState(false);
  const [refreshCart, SetRefreshCart] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [category_list, setcategory_list] = useState([]);
  const [cart, setCart] = useState(null);

  const toggle = () => {
    setCollaped(!collaped);
  };
  useEffect(() => {
    checkAuth(props, setShowComponent);
    get_cart();
    get_products();
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
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.get(
      api_base_url_orders + "/customer_cart/" + customer_id,
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
  if (showComponent) {
    return [
      <Layout key="0">
        {/* <Side setCategory={setCategory} /> */}
        <Layout style={{ height: "100vh" }}>
          <Header />
          <Content
            style={{
              margin: "24px 16px 24px 16px",
              overflow: "initial",
            }}
          >
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
