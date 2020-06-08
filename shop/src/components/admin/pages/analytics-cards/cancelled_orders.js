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
      api_base_url_orders + "/get_cancelled_orders",
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
          style={{ backgroundColor: "#829ba3", color: "white" }}
          size={100}
          icon={<AuditOutlined />}
        />
      </Col>
      <Col span="12" style={{ textAlign: "right" }}>
        <Title style={{ color: "#829ba3" }}>{customercount}</Title>
        <Text strong style={{ color: "#6d7072" }}>
          Cancelled Orders
        </Text>
        <Link to="/web-admin/orders" key="0">
          <Button type="dashed">View All Data</Button>
        </Link>
      </Col>
    </Row>,
  ];
}

export default UserCount;
