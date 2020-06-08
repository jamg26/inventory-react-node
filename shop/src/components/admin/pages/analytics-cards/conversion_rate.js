import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { api_base_url_orders } from "../../../../keys/index";
import axios from "axios";
import moment from "moment";
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
import numeral from "numeral";
import cloneDeep from "lodash/cloneDeep";
const { Text, Title } = Typography;
function Overview() {
  //get_this_weeks_revenue
  const [orders_today, setorders_today] = useState(0);
  const [orders_yesterday, setorders_yesterday] = useState(0);
  const [orders_completed, setorders_completed] = useState(0);
  const [data, setdata] = useState([]);
  const [order_count, set_order_count] = useState(0);
  const get_abandoned_carts = async () => {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.get(
      api_base_url_orders + "/get_add_to_cart_today",
      {},
      { headers: headers }
    );
    setorders_today(response.data.carted);
    setorders_yesterday(response.data.ordered);
    setorders_completed(response.data.completed);
    let percetage =
      (parseFloat(response.data.carted) / parseFloat(response.data.ordered)) *
      100;

    set_order_count(percetage == NaN || percetage == Infinity ? 0 : percetage);
  };

  useEffect(() => {
    get_abandoned_carts();
  }, []);

  return [
    <>
      <Row gutter={[16, 24]}>
        <Col span="16">
          <Space direction="vertical">
            <Text style={{ color: "#474e59" }} strong>
              Online store conversion rate
            </Text>
            <Title strong style={{ color: "#474e59", marginBottom: 0 }}>
              {numeral(order_count).format("0.0")}%
            </Title>
            <Text style={{ color: "#474e59" }} strong>
              CONVERSION FUNNEL
            </Text>
          </Space>
        </Col>

        <Col span="8" style={{ textAlign: "center" }}></Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span="16">
          <Text>Added to Cart</Text>
        </Col>
        <Col span="8" style={{ textAlign: "right" }}>
          <Text strong>{numeral(orders_today).format("0,0")}</Text>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span="16">
          <Text>Reached checkout</Text>
        </Col>
        <Col span="8" style={{ textAlign: "right" }}>
          <Text strong>{numeral(orders_yesterday).format("0,0")}</Text>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span="16">
          <Text>Session converted</Text>
        </Col>
        <Col span="8" style={{ textAlign: "right" }}>
          <Text strong>{numeral(orders_completed).format("0,0")}</Text>
        </Col>
      </Row>
    </>,
  ];
}
export default Overview;
