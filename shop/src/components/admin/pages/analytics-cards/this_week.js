import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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
const { Text, Title } = Typography;
function Overview() {
  //get_this_weeks_revenue
  const [revenue, setrevenue] = useState([]);
  const [data, setdata] = useState([]);
  const get_abandoned_carts = async () => {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.get(
      api_base_url_orders + "/get_this_weeks_revenue",
      {},
      { headers: headers }
    );
    setrevenue(response.data);
  };
  useEffect(() => {
    let temp = [];

    for (let c = 0; c < revenue.length; c++) {
      const element = revenue[c];
      temp.push({
        name: moment(element.date).format("MM-DD-YYYY"),
        amt: element.total_rev,
      });
    }
    setdata(temp);
  }, [revenue]);
  useEffect(() => {
    get_abandoned_carts();
  }, []);

  return [
    <>
      <Row gutter={[16, 16]}>
        <Col span="8" style={{ textAlign: "left" }}></Col>
        <Col span="8" style={{ textAlign: "center" }}></Col>
        <Col span="8" style={{ textAlign: "right" }}>
          <Space direction="vertical">
            <Text style={{ color: "#c5c9d5" }}>Performance</Text>
            <Text strong style={{ color: "#3ed5b2" }}>
              +0%
            </Text>
          </Space>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span="24">
          <div style={{ width: "100%", height: 200 }}>
            <ResponsiveContainer>
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="amt"
                  stroke="#5eddc0"
                  fill="#43dbbd"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span="8">
          <Space direction="vertical" size="0">
            <small style={{ color: "#9da3b8" }}>Last Week Profit</small>
            <Text strong style={{ color: "#3b487c" }}>
              +100%
            </Text>
            <Progress strokeColor="#37d1ab" percent={100} showInfo={false} />
          </Space>
        </Col>
        <Col span="8"></Col>
        <Col span="8">
          <Space direction="vertical" size="0">
            <small style={{ color: "#9da3b8" }}>This Week Losses</small>
            <Text strong style={{ color: "#3b487c" }}>
              -0%
            </Text>
            <Progress status="exception" percent={0} showInfo={false} />
          </Space>
        </Col>
      </Row>
    </>,
  ];
}
export default Overview;
