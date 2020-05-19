import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../routes/routes";
import { Button, Layout, Tabs, PageHeader } from "antd";
import Side from "../inc/side";
import Header from "../inc/header";
import Cart from "../components/Cart";
import { ArrowRightOutlined } from "@ant-design/icons";
import ProductList from "../components/ProductList";
import { checkAuth } from "../../helper/authCheck";
import { withRouter, Link } from "react-router-dom";
import axios from "axios";
import { api_base_url_orders } from "../../../keys/index";
const { Content } = Layout;
const { TabPane } = Tabs;
function Dashboard(props) {
  const [collaped, setCollaped] = useState(false);
  const [active, setActive] = useState("0");
  const [category, setCategory] = useState("All Products");
  const [showComponent, setShowComponent] = useState(false);
  const [refreshCart, SetRefreshCart] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const toggle = () => {
    setCollaped(!collaped);
  };
  useEffect(() => {
    checkAuth(props, setShowComponent);
    get_cart();
  }, []);
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
        <Side setCategory={setCategory} />
        <Layout style={{ height: "100vh" }}>
          <Header />
          <Content
            style={{
              margin: "24px 16px 24px 16px",
              overflow: "initial",
            }}
          >
            <div className=" dyn-height">
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
                    refresh={() => SetRefreshCart(!refreshCart)}
                    showCart={showCart}
                    show={() => {
                      setShowCart(!showCart);
                    }}
                  />
                </TabPane>
              </Tabs>
              {showCart ? (
                <Cart
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
    return null;
  }
}

export default withRouter(Dashboard);
