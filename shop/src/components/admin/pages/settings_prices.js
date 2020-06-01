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
import Side from "../inc/settingsside";
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
              margin: "24px 16px 24px 16px",
              overflow: "initial",
              backgroundColor: "white",
              borderBottom: "1px solid rgba(0,0,0,0.2)",
              borderRight: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            <div className="site-layout-background dyn-height">
              <PageHeader className="site-page-header" title="Price List" />
              {props.no == "9" ? "Organization Profile" : null}
              {props.no == "10" ? "Taxes" : null}
              {props.no == "11" ? "Price List" : null}
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
