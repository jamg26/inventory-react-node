import React, { useEffect, useState } from "react";
import { UserContext } from "../../../routes/routes";
import {
  Button,
  Layout,
  Row,
  Col,
  Typography,
  PageHeader,
  Statistic,
  Card,
  Space,
  Avatar,
  Progress,
} from "antd";
import {
  ArrowRightOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  PercentageOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { checkAuth } from "../../helper/authCheckAdmin";
import Side from "../inc/side";
import Header from "../inc/header";
import { withRouter } from "react-router-dom";
import LoadingPage from "../../global-components/loading";
import UserCount from "./analytics-cards/user_count_card";
import OrderCount from "./analytics-cards/order_count_card";
import UniqueVisitors from "./analytics-cards/unique_customer_visted";
import CancelledOrders from "./analytics-cards/cancelled_orders";
import Delivered from "./analytics-cards/delivered_in_a_month";
import CustomerGender from "./analytics-cards/customer_gender_count";
import CustomerAge from "./analytics-cards/customer_age";
import SiteTotalGrowth from "./analytics-cards/site_total_growth";
import BestSelling from "./analytics-cards/best_selling_products";
import CustomerFeedback from "./analytics-cards/customer_feedback";
import TotalOrderComparison from "./analytics-cards/total_order_comparison";
import AverageOrderValue from "./analytics-cards/average_order_value";
import TotalSales from "./analytics-cards/total_sales";
import OnlineStoreSessions from "./analytics-cards/online_store_sessions";
import ReturningCustomer from "./analytics-cards/returnning_customers";
import ConvertionRate from "./analytics-cards/conversion_rate";

import AbandonedCarts from "./analytics-cards/abandoned_cart";
import LowStocks from "./analytics-cards/product_on_low_stock";
import NoStocks from "./analytics-cards/product_on_no_stock";
import ActivePO from "./analytics-cards/active_po";
import DuePO from "./analytics-cards/due_po";
import Overview from "./analytics-cards/overview";
import TodaysRevenue from "./analytics-cards/todays_revenue";
import ThisWeek from "./analytics-cards/this_week";
import { api_base_url_orders } from "../../../keys/index";
const { Content } = Layout;
const { Text, Title } = Typography;
function Dashboard(props) {
  const [collaped, setCollaped] = useState(false);
  const [showComponent, setShowComponent] = useState(false);
  const [products, setProducts] = useState([]);
  const [purchaseOrderData, setpurchaseOrderData] = useState([]);
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
  const retrieveAllData = () => {
    axios
      .get(api_base_url_orders + "/purchase_orders/")

      .then((res) => {
        setpurchaseOrderData(res.data);
      })
      .catch(function (err) {
        console.log(err);
      });
  };
  useEffect(() => {
    checkAuth(props, setShowComponent);
    get_products();
    retrieveAllData();
  }, []);
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
            <div className="dyn-height">
              <Row gutter={[16, 16]}>
                <Col span="12">
                  <Card
                    style={{
                      minHeight: 200,
                      height: "100%",
                      borderBottom: "1px solid rgba(0,0,0,0.2)",
                      borderRight: "1px solid rgba(0,0,0,0.1)",
                    }}
                  >
                    <Overview />
                  </Card>
                </Col>
                <Col span="6">
                  <Card
                    style={{
                      minHeight: 200,
                      height: "100%",
                      borderBottom: "1px solid rgba(0,0,0,0.2)",
                      borderRight: "1px solid rgba(0,0,0,0.1)",
                    }}
                  >
                    <ThisWeek />
                  </Card>
                </Col>
                <Col span="6">
                  <Card
                    style={{
                      minHeight: 200,
                      height: "100%",
                      borderBottom: "1px solid rgba(0,0,0,0.2)",
                      borderRight: "1px solid rgba(0,0,0,0.1)",
                    }}
                  >
                    <TodaysRevenue />
                  </Card>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span="8">
                  <Card
                    style={{
                      minHeight: 200,
                      height: "100%",
                      borderBottom: "1px solid rgba(0,0,0,0.2)",
                      borderRight: "1px solid rgba(0,0,0,0.1)",
                    }}
                  >
                    <TotalSales />
                  </Card>
                </Col>
                <Col span="8">
                  <Card
                    style={{
                      minHeight: 200,
                      height: "100%",
                      borderBottom: "1px solid rgba(0,0,0,0.2)",
                      borderRight: "1px solid rgba(0,0,0,0.1)",
                    }}
                  >
                    <OnlineStoreSessions />
                  </Card>
                </Col>
                <Col span="8">
                  <Card
                    style={{
                      minHeight: 200,
                      height: "100%",
                      borderBottom: "1px solid rgba(0,0,0,0.2)",
                      borderRight: "1px solid rgba(0,0,0,0.1)",
                    }}
                  >
                    <ReturningCustomer />
                  </Card>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span="8">
                  <Card
                    style={{
                      minHeight: 200,
                      height: "100%",
                      borderBottom: "1px solid rgba(0,0,0,0.2)",
                      borderRight: "1px solid rgba(0,0,0,0.1)",
                    }}
                  >
                    <ConvertionRate />
                  </Card>
                </Col>
                <Col span="8">
                  <Card
                    style={{
                      minHeight: 200,
                      height: "100%",
                      borderBottom: "1px solid rgba(0,0,0,0.2)",
                      borderRight: "1px solid rgba(0,0,0,0.1)",
                    }}
                  >
                    <AverageOrderValue />
                  </Card>
                </Col>
                <Col span="8">
                  <Card
                    style={{
                      height: "100%",
                      borderBottom: "1px solid rgba(0,0,0,0.2)",
                      borderRight: "1px solid rgba(0,0,0,0.1)",
                    }}
                  >
                    {" "}
                    <TotalOrderComparison />
                  </Card>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span="5">
                  <Card
                    style={{
                      height: "100%",
                      borderBottom: "1px solid rgba(0,0,0,0.2)",
                      borderRight: "1px solid rgba(0,0,0,0.1)",
                    }}
                  >
                    <OrderCount />
                  </Card>
                </Col>
                <Col span="5">
                  <Card
                    style={{
                      height: "100%",
                      borderBottom: "1px solid rgba(0,0,0,0.2)",
                      borderRight: "1px solid rgba(0,0,0,0.1)",
                    }}
                  >
                    <UserCount />
                  </Card>
                </Col>
                <Col span="5">
                  <Card
                    style={{
                      height: "100%",
                      borderBottom: "1px solid rgba(0,0,0,0.2)",
                      borderRight: "1px solid rgba(0,0,0,0.1)",
                    }}
                  >
                    <UniqueVisitors />
                  </Card>
                </Col>
                <Col span="5">
                  <Card
                    style={{
                      height: "100%",
                      borderBottom: "1px solid rgba(0,0,0,0.2)",
                      borderRight: "1px solid rgba(0,0,0,0.1)",
                    }}
                  >
                    <CancelledOrders />
                  </Card>
                </Col>
                <Col span="4">
                  <Card
                    style={{
                      height: "100%",
                      borderBottom: "1px solid rgba(0,0,0,0.2)",
                      borderRight: "1px solid rgba(0,0,0,0.1)",
                    }}
                  >
                    <Delivered />
                  </Card>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span="12">
                  <Card
                    style={{
                      minHeight: 200,
                      height: "100%",
                      borderBottom: "1px solid rgba(0,0,0,0.2)",
                      borderRight: "1px solid rgba(0,0,0,0.1)",
                    }}
                  >
                    <SiteTotalGrowth />
                  </Card>
                </Col>
                <Col span="6">
                  <Card
                    style={{
                      minHeight: 200,
                      height: "100%",
                      borderBottom: "1px solid rgba(0,0,0,0.2)",
                      borderRight: "1px solid rgba(0,0,0,0.1)",
                    }}
                  >
                    <CustomerGender />
                  </Card>
                </Col>
                <Col span="6">
                  <Card
                    style={{
                      minHeight: 200,
                      height: "100%",
                      borderBottom: "1px solid rgba(0,0,0,0.2)",
                      borderRight: "1px solid rgba(0,0,0,0.1)",
                    }}
                  >
                    <CustomerAge />
                  </Card>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span="10">
                  <Card
                    style={{
                      minHeight: 200,
                      height: "100%",
                      borderBottom: "1px solid rgba(0,0,0,0.2)",
                      borderRight: "1px solid rgba(0,0,0,0.1)",
                    }}
                  >
                    <BestSelling />
                  </Card>
                </Col>
                <Col span="14">
                  <Card
                    style={{
                      minHeight: 200,
                      height: "100%",
                      borderBottom: "1px solid rgba(0,0,0,0.2)",
                      borderRight: "1px solid rgba(0,0,0,0.1)",
                    }}
                  >
                    <CustomerFeedback />
                  </Card>
                </Col>
              </Row>
              {/* <Row gutter={[16, 16]}>
                <Col span={6}>
                  <Card>
                    <UserCount />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <AbandonedCarts />
                  </Card>
                </Col>
              </Row> */}
              {/*               
              <Row gutter={[16, 16]}>
                <Col span="12">
                  <Card
                    style={{
                      borderBottom: "1px solid rgba(0,0,0,0.2)",
                      borderRight: "1px solid rgba(0,0,0,0.1)",
                    }}
                  >
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <Text strong> Products on Low Stocks</Text>

                      <LowStocks products={products} />
                    </Space>
                  </Card>
                </Col>
                <Col span="12">
                  <Card
                    style={{
                      borderBottom: "1px solid rgba(0,0,0,0.2)",
                      borderRight: "1px solid rgba(0,0,0,0.1)",
                    }}
                  >
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <Text strong> Products on No Stocks</Text>

                      <NoStocks products={products} />
                    </Space>
                  </Card>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span="12">
                  <Card
                    style={{
                      borderBottom: "1px solid rgba(0,0,0,0.2)",
                      borderRight: "1px solid rgba(0,0,0,0.1)",
                    }}
                  >
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <Text strong> Active Purchase Orders</Text>
                      <ActivePO po={purchaseOrderData} />
                    </Space>
                  </Card>
                </Col>
                <Col span="12">
                  <Card
                    style={{
                      borderBottom: "1px solid rgba(0,0,0,0.2)",
                      borderRight: "1px solid rgba(0,0,0,0.1)",
                    }}
                  >
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <Text strong> Near Due Purchase Orders</Text>
                      <DuePO po={purchaseOrderData} />
                    </Space>
                  </Card>
                </Col>
              </Row> */}
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
