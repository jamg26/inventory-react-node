import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../routes/routes";
import { Modal, Layout, Tabs, PageHeader } from "antd";
import Side from "../inc/side";
import Header from "../inc/header";
import { checkAuth } from "../../helper/authCheck";
import { withRouter, Link } from "react-router-dom";
import axios from "axios";
import AllOrders from "../components/allOrders";
import ProcessingOrders from "../components/ProcessingOrders";
import ForDeliveryOrders from "../components/ForDeliveryOrders";
import PendingOrders from "../components/PendingOrders";
import CancelledOrders from "../components/CancelledOrders";
import OrderDetails from "../components/order_details";
import { api_base_url_orders } from "../../../keys/index";
const { Content } = Layout;
const { TabPane } = Tabs;
function Orders(props) {
  const [recheckauth, setrecheckauth] = useState(false);
  const [collaped, setCollaped] = useState(false);
  const [active, setActive] = useState("0");
  const [category, setCategory] = useState("All Products");
  const [showComponent, setShowComponent] = useState(false);
  const [orderList, setorderList] = useState([]);
  const [visible, SetVisible] = useState(false);
  const [orderID, setOrderId] = useState(undefined);
  const [orderNo, setno] = useState("");
  const toggle = () => {
    setCollaped(!collaped);
  };
  useEffect(() => {
    checkAuth(props, setShowComponent);
  }, [recheckauth]);
  const fetchOrders = async () => {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.get(
      api_base_url_orders +
        "/customer_order_history/" +
        localStorage.getItem("landing_customer_id"),
      {},
      { headers: headers }
    );
    console.log(response.data.cart);
    setorderList(response.data.cart);
  };
  const cancelOrder = async (id) => {
    let landing_customer_login_token = localStorage.getItem(
      "landing_customer_login_token"
    );
    console.log("cancel order", id);
    //Cancelled
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.post(
      api_base_url_orders + "/cancel_order",
      {
        id,
        login_token: landing_customer_login_token,
      },
      { headers: headers }
    );
    fetchOrders();
  };
  useEffect(() => {
    fetchOrders();
  }, []);
  if (showComponent) {
    return [
      <Layout>
        <Side setCategory={setCategory} no={props.no} />
        <Layout style={{ height: "100vh" }}>
          <Header />
          <Content
            style={{
              margin: "24px 16px 24px 16px",
              overflow: "initial",
            }}
          >
            <div className=" dyn-height">
              <PageHeader className="site-page-header" title={"My Orders"} />
              <Tabs
                onChange={(ev) => {
                  setActive(ev);
                }}
                defaultActiveKey="0"
                activeKey={active}
                type="card"
                tabBarStyle={{ paddingLeft: "20px", paddingRight: "20px" }}
              >
                <TabPane tab="All Orders" key="0">
                  <AllOrders
                    orderList={orderList}
                    cancelOrder={cancelOrder}
                    setOrderId={(value, no) => {
                      setOrderId(value);
                      setno(no);
                      SetVisible(true);
                    }}
                  />
                </TabPane>
                <TabPane tab="Processing" key="1">
                  <ProcessingOrders
                    orderList={orderList}
                    setOrderId={(value, no) => {
                      setOrderId(value);
                      setno(no);
                      SetVisible(true);
                    }}
                  />
                </TabPane>
                <TabPane tab="For Delivery/Pick Up" key="2">
                  <ForDeliveryOrders
                    orderList={orderList}
                    setOrderId={(value, no) => {
                      setOrderId(value);
                      setno(no);
                      SetVisible(true);
                    }}
                  />
                </TabPane>
                <TabPane tab="Pending" key="3">
                  <PendingOrders
                    orderList={orderList}
                    setOrderId={(value, no) => {
                      setOrderId(value);
                      setno(no);
                      SetVisible(true);
                    }}
                  />
                </TabPane>
                <TabPane tab="Cancelled" key="4">
                  <CancelledOrders
                    orderList={orderList}
                    setOrderId={(value, no) => {
                      setOrderId(value);
                      setno(no);
                      SetVisible(true);
                    }}
                  />
                </TabPane>
              </Tabs>
              <Modal
                title={`Order # ${orderNo}`}
                visible={visible}
                width={"80%"}
                onCancel={() => SetVisible(false)}
                footer={null}
              >
                <OrderDetails orderID={orderID} />
              </Modal>
            </div>
          </Content>
        </Layout>
      </Layout>,
    ];
  } else {
    return null;
  }
}

export default withRouter(Orders);
