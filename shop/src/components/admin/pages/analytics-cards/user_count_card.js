import React, { useState, useEffect } from "react";
import axios from "axios";
import { Statistic, Space, Row, Col, Typography, Avatar } from "antd";
import { api_base_url } from ".././../../../keys/index";
import {
  ArrowRightOutlined,
  UserOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
const { Text, Title } = Typography;
function UserCount() {
  const [customercount, setcustomercount] = useState(0);
  const get_abandoned_carts = async () => {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.get(
      api_base_url + "/get_customer_list_count",
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
          style={{ backgroundColor: "#f74343", color: "white" }}
          size={100}
          icon={<UserOutlined />}
        />
      </Col>
      <Col span="12" style={{ textAlign: "right" }}>
        <Title style={{ color: "#f74343" }}>{customercount}</Title>
        <Text strong style={{ color: "#6d7072" }}>
          New Users
        </Text>
      </Col>
    </Row>,
  ];
}

export default UserCount;
