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
} from "antd";
import {
  ArrowRightOutlined,
  UserOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { checkAuth } from "../../helper/authCheckAdmin";
import Side from "../inc/side";
import Header from "../inc/header";
import { withRouter } from "react-router-dom";
import LoadingPage from "../../global-components/loading";
import UserCount from "./analytics-cards/user_count_card";
import AbandonedCarts from "./analytics-cards/abandoned_cart";
import LowStocks from "./analytics-cards/product_on_low_stock";
import NoStocks from "./analytics-cards/product_on_no_stock";
import ActivePO from "./analytics-cards/active_po";
import DuePO from "./analytics-cards/due_po";
import { api_base_url_orders } from "../../../keys/index";
const { Content } = Layout;
const { Text } = Typography;
function Dashboard(props) {
  const [collaped, setCollaped] = useState(false);
  const [showComponent, setShowComponent] = useState(false);
  const [products, setProducts] = useState([]);
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
  useEffect(() => {
    checkAuth(props, setShowComponent);
    get_products();
  }, []);
  if (showComponent) {
    return [
      <Layout key="0">
        <Side no={props.no} />
        <Layout style={{ height: "100vh" }}>
          <Header />
          <Content
            style={{
              margin: "24px 16px 24px 16px",
              overflow: "initial",
              backgroundColor: "white",
            }}
          >
            <div className="site-layout-background dyn-height">
              <PageHeader
                className="site-page-header"
                title="Analytics"
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
              />
              <Row gutter={[16, 16]}>
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
              </Row>
              <Row gutter={[16, 16]}>
                <Col span="12">
                  <Card title="Products on Low Stocks">
                    <LowStocks products={products} />
                  </Card>
                </Col>
                <Col span="12">
                  <Card title="Products on No Stocks">
                    <NoStocks products={products} />
                  </Card>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span="12">
                  <Card title="Active Purchase Orders">
                    <ActivePO />
                  </Card>
                </Col>
                <Col span="12">
                  <Card title="Near Due Purchase Orders">
                    <DuePO />
                  </Card>
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
