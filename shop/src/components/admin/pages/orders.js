import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../routes/routes";
import {
  Button,
  Layout,
  PageHeader,
  Empty,
  Table,
  Drawer,
  Tabs,
  Card,
  Typography,
  Collapse,
  Checkbox,
} from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import Side from "../inc/side";
import Header from "../inc/header";
import { withRouter } from "react-router-dom";
import { checkAuth } from "../../helper/authCheckAdmin";
import All from "../components/orders/all";
import Payments from "../components/orders/payments";
import Fulfillments from "../components/orders/fulfillments";
import Customer from "../components/orders/customer";
import AbandonedCart from "../components/orders/abandoned_cart";
import OrderDetails from "../components/orders/order_details";
import LoadingPage from "../../global-components/loading";
const { Content } = Layout;
const { TabPane } = Tabs;
const { Text } = Typography;
function Dashboard(props) {
  const [collaped, setCollaped] = useState(false);
  const [customer, setCustomerID] = useState(undefined);

  const [orderID, setOrderID] = useState(undefined);
  const [active, setActive] = useState("0");
  const [showComponent, setShowComponent] = useState(false);
  useEffect(() => {
    checkAuth(props, setShowComponent);
  }, []);
  const toggle = () => {
    setCollaped(!collaped);
  };
  const setCustomer = (customer_id) => {
    setCustomerID(customer_id);
    setActive("5");
    console.log("customer_id", customer_id);
  };
  const SetOrder = (Order_id) => {
    setOrderID(Order_id);
    setActive("2");
    console.log("Order_id", Order_id);
  };
  if (showComponent) {
    return [
      <Layout key="0">
        {/* <Side no={props.no} /> */}
        <Layout style={{ height: "100vh" }}>
          <Header no={props.no} />
          <Content
            style={{
              margin: "0px 0px",
              overflow: "initial",
            }}
          >
            <div className=" dyn-height">
              <PageHeader
                className="site-page-header"
                title="Orders"
                onBack={() => props.history.goBack()}
                extra={[
                  <Button
                    key="0"
                    onClick={() => {
                      props.history.go(+1);
                    }}
                    type="link"
                    className="ant-page-header-back-button"
                    style={{ fontSize: "16px" }}
                  >
                    <ArrowRightOutlined />
                  </Button>,
                  ,
                ]}
                // subTitle="This is a subtitle"
              />
              <Tabs
                onChange={(ev) => {
                  setActive(ev);
                }}
                defaultActiveKey="0"
                activeKey={active}
                type="card"
                tabBarStyle={{ paddingLeft: "20px", paddingRight: "20px" }}
              >
                <TabPane tab="All" key="0">
                  <All setCustomer={setCustomer} SetOrder={SetOrder} />
                </TabPane>
                <TabPane tab="Fulfillment" key="1">
                  <Fulfillments setCustomer={setCustomer} SetOrder={SetOrder} />
                </TabPane>
                <TabPane tab="Order Detail" key="2">
                  <OrderDetails
                    setCustomer={setCustomer}
                    SetOrder={SetOrder}
                    orderID={orderID}
                  />
                </TabPane>
                <TabPane tab="Payments" key="3">
                  <Payments setCustomer={setCustomer} SetOrder={SetOrder} />
                </TabPane>
                <TabPane tab="Abandoned Carts" key="4">
                  <AbandonedCart setCustomer={setCustomer} />
                </TabPane>
                <TabPane tab="Customers" key="5">
                  <Customer setCustomer={setCustomer} customer={customer} />
                </TabPane>
              </Tabs>
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
