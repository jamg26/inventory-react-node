import React, { useState, useEffect } from "react";
import axios from "axios";
import { Statistic, Space, Row, Col, Typography, Avatar, Button } from "antd";
import { api_base_url_orders } from "../../../../keys/index";
import {
  ArrowRightOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  AuditOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
const { Text, Title } = Typography;
function UserCount() {
  const [customercount, setcustomercount] = useState(0);
  const get_abandoned_carts = async () => {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.get(
      api_base_url_orders + "/get_delivered_in_a_month",
      {},
      { headers: headers }
    );
    setcustomercount(response.data.count);
  };
  useEffect(() => {
    get_abandoned_carts();
  }, []);
  return [
    <Row gutter={[16, 16]}>
      <Col span="12">
        <Space direction="vertical" size="2">
          <Text strong style={{ color: "#6d7072" }}>
            Total Delivery
          </Text>
          <small style={{ color: "#717998" }}>(Last 30 Days)</small>
        </Space>
      </Col>
      <Col span="12">
        <Avatar
          style={{ backgroundColor: "#fa9c71", color: "white" }}
          size={50}
          icon={<CheckCircleOutlined />}
        />
      </Col>
      <Col span="24">
        <Title style={{ color: "#fa9c71", marginBottom: 0 }}>
          {customercount}
        </Title>
      </Col>
    </Row>,
  ];
}

export default UserCount;
