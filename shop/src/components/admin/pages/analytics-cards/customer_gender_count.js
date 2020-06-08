import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Statistic,
  Space,
  Row,
  Col,
  Typography,
  Avatar,
  Button,
  Badge,
} from "antd";
import { api_base_url } from "../../../../keys/index";
import {
  ArrowRightOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  AuditOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";
const { Text, Title } = Typography;

function UserCount() {
  const [customercount, setcustomercount] = useState(0);
  const [customercountf, setcustomercountf] = useState(0);
  const [customercountn, setcustomercountn] = useState(0);
  const data = [
    { name: "Male", value: customercount },
    { name: "Female", value: customercountf },
  ];
  const COLORS = ["#caebfe", "#fdd2ed", "#839ba3"];

  const get_abandoned_carts = async () => {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.get(
      api_base_url + "/get_customer_gender_list_count",
      {},
      { headers: headers }
    );
    setcustomercount(response.data.count);
    setcustomercountf(response.data.femalecount);
    setcustomercountn(response.data.count_not_specified);
  };
  useEffect(() => {
    get_abandoned_carts();
  }, []);
  const renderCustomizedLabel = ({ x, y, name }) => {
    return (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor="end"
        dominantBaseline="central"
      >
        {name}
      </text>
    );
  };
  return [
    <Row gutter={[16, 16]}>
      <Col span="24">
        <Text strong style={{ color: "#5d646d", marginBottom: 0 }}>
          Client Gender
        </Text>
      </Col>
      <Col span="24">
        <div style={{ width: "100%", height: 200 }}>
          <ResponsiveContainer>
            <PieChart
              onMouseOver={(e) => {
                console.log(e);
              }}
            >
              <Pie
                data={data}
                fill="#8884d8"
                paddingAngle={0}
                dataKey="value"
                label
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Col>
    </Row>,
  ];
}

export default UserCount;
