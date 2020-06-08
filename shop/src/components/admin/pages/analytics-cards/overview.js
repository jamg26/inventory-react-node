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
import { api_base_url_orders } from "../../../../keys/index";
import numeral from "numeral";
const { Text, Title } = Typography;
function Overview() {
  const months = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const [temp_data, set_temp_data] = useState([]);
  const [data, set_data] = useState([]);
  const [total_rev, set_total_rev] = useState(0);
  const [total_mounth1, set_total_mounth1] = useState(0);
  const [total_mounth2, set_total_mounth2] = useState(0);
  const [total_mounth3, set_total_mounth3] = useState(0);
  const [total_mounth4, set_total_mounth4] = useState(0);
  const [total_mounth5, set_total_mounth5] = useState(0);
  const [avg, set_avg] = useState(0);
  const [daily_result, setdaily_result] = useState([]);
  const get_abandoned_carts = async () => {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.get(
      api_base_url_orders + "/get_total_revenue",
      {},
      { headers: headers }
    );
    set_temp_data(response.data.chart_data);
    set_total_rev(response.data.total_revenue);
    setdaily_result(response.data.daily_result);
    set_total_mounth1(response.data.month_one);
    set_total_mounth2(response.data.month_two);
    set_total_mounth3(response.data.month_three);
    set_total_mounth4(response.data.month_four);
    set_total_mounth5(response.data.month_five);
  };
  useEffect(() => {
    get_abandoned_carts();
  }, []);
  useEffect(() => {
    console.log("temp_data", temp_data);
    let temp = [];
    for (let c = 0; c < temp_data.length; c++) {
      const element = temp_data[c];
      temp.push({
        name: months[element._id.month] + " " + element._id.year,
        uv: element.payment_total,
      });
    }
    set_data(temp);
  }, [temp_data]);
  useEffect(() => {
    let avg = 0;
    let total = 0;
    for (let c = 0; c < daily_result.length; c++) {
      const element = daily_result[c];
      total = parseFloat(total) + parseFloat(element.payment_total);
    }
    avg = parseFloat(total) / parseFloat(daily_result.length);
    set_avg(avg);
  }, [daily_result]);
  return [
    <>
      <Row gutter={[16, 16]}>
        <Col span="8" style={{ textAlign: "left" }}>
          <Text strong style={{ color: "#7181cb" }}>
            {numeral(total_rev).format("0,0.00")}
          </Text>
        </Col>
        <Col span="8" style={{ textAlign: "center" }}>
          <Text strong>TOTAL REVENUE</Text>
        </Col>
        <Col span="8" style={{ textAlign: "right" }}>
          <Space direction="vertical" size={2}>
            <Text strong style={{ color: "#cadfa6" }}>
              {numeral(
                (parseFloat(total_mounth1) / parseFloat(total_rev)) * 100
              ).format("00.0")}
              %
            </Text>
            <small type="secondary" style={{ color: "#dfe6ea" }}>
              30 DAYS AGO
            </small>
          </Space>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span="24">
          <div style={{ width: "100%", height: 200 }}>
            <ResponsiveContainer>
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="uv"
                  stroke="#8884d8"
                  fill="#8884d8"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span="4">
          <Space direction="vertical" size={0} align="center">
            <small style={{ color: "#dde4e9", fontWeight: "bold" }}>
              DAILY AVG
            </small>
            <Text strong>{numeral(avg).format("0,0.00")}</Text>
          </Space>
        </Col>
        <Col span="4">
          <Space direction="vertical" size={0} align="center">
            <small style={{ color: "#dde4e9", fontWeight: "bold" }}>
              1 MONTH AGO
            </small>
            <Text strong>{numeral(total_mounth1).format("0,0.00")}</Text>
            {/* <Text strong style={{ color: "#c0d999" }}>
              +9.25%
            </Text> */}
          </Space>
        </Col>
        <Col span="4">
          <Space direction="vertical" size={0} align="center">
            <small style={{ color: "#dde4e9", fontWeight: "bold" }}>
              2 MONTH AGO
            </small>
            <Text strong>{numeral(total_mounth2).format("0,0.00")}</Text>
            {/* <Text strong style={{ color: "#c0d999" }}>
              +9.25%
            </Text> */}
          </Space>
        </Col>
        <Col span="4">
          <Space direction="vertical" size={0} align="center">
            <small style={{ color: "#dde4e9", fontWeight: "bold" }}>
              3 MONTH AGO
            </small>
            <Text strong>{numeral(total_mounth3).format("0,0.00")}</Text>
            {/* <Text strong style={{ color: "#c0d999" }}>
              +9.25%
            </Text> */}
          </Space>
        </Col>
        <Col span="4">
          <Space direction="vertical" size={0} align="center">
            <small style={{ color: "#dde4e9", fontWeight: "bold" }}>
              6 MONTH AGO
            </small>
            <Text strong>{numeral(total_mounth4).format("0,0.00")}</Text>
          </Space>
        </Col>
        <Col span="4">
          <Space direction="vertical" size={0} align="center">
            <small style={{ color: "#dde4e9", fontWeight: "bold" }}>
              12 MONTH AGO
            </small>
            <Text strong>{numeral(total_mounth5).format("0,0.00")}</Text>
          </Space>
        </Col>
      </Row>
    </>,
  ];
}
export default Overview;
