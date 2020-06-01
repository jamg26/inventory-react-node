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
        <Side no={props.no} />
        <Layout style={{ height: "100vh" }}>
          <Header />
          <Content
            style={{
              margin: "0px 0px",
              overflow: "initial",
            }}
          >
            <div className="dyn-height">
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
