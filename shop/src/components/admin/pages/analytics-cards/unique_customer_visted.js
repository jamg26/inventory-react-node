import React, { useState, useEffect } from "react";
import axios from "axios";
import { Statistic, Space, Row, Col, Typography, Avatar } from "antd";
import { api_base_url } from "../../../../keys/index";
import {
  ArrowRightOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
} from "@ant-design/icons";
const { Text, Title } = Typography;
function UserCount() {
  const [customercount, setcustomercount] = useState(0);
  const get_abandoned_carts = async () => {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.get(
      api_base_url + "/get_unique_customers",
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
        <Avatar
          style={{ backgroundColor: "#1a1c32", color: "white" }}
          size={100}
          icon={<TeamOutlined />}
        />
      </Col>
      <Col span="12" style={{ textAlign: "right" }}>
        <Title style={{ color: "#1a1c32" }}>{customercount}</Title>
        <Text strong style={{ color: "#6d7072" }}>
          Unique Visitors
        </Text>
      </Col>
    </Row>,
  ];
}

export default UserCount;
