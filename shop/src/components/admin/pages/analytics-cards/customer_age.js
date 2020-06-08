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
import moment from "moment";
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
  const [Customers, setCustomers] = useState([]);
  const [data, setData] = useState([]);
  const COLORS = ["#fdd2ed", "#caebfe", "#fde4d3", "#fdd1d7", "#e2d9fe"];

  const get_abandoned_carts = async () => {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.get(
      api_base_url + "/customers",
      {},
      { headers: headers }
    );
    setCustomers(response.data);
  };
  useEffect(() => {
    get_abandoned_carts();
  }, []);
  useEffect(() => {
    let s1 = 0;
    let s2 = 0;
    let s3 = 0;
    let s4 = 0;
    let s5 = 0;
    for (let c = 0; c < Customers.length; c++) {
      const element = Customers[c];
      var a = moment();
      var b = moment(element.birthdate);
      let difference = a.diff(b, "years");
      if (difference <= 10) {
        s1 = parseFloat(s1) + parseFloat(1);
      }
      if (difference > 10 && difference <= 20) {
        s2 = parseFloat(s2) + parseFloat(1);
      }
      if (difference > 20 && difference <= 30) {
        s3 = parseFloat(s3) + parseFloat(1);
      }
      if (difference > 30 && difference <= 40) {
        s4 = parseFloat(s4) + parseFloat(1);
      }
      if (difference > 40) {
        s5 = parseFloat(s5) + parseFloat(1);
      }
    }
    setData([
      { name: "10 And Below", value: s1 },
      { name: "11-20", value: s2 },
      { name: "21-30", value: s3 },
      { name: "31-40", value: s4 },
      { name: "40+", value: s5 },
    ]);
  }, [Customers]);
  return [
    <Row gutter={[16, 16]}>
      <Col span="24">
        <Text strong style={{ color: "#5d646d", marginBottom: 0 }}>
          Client Age
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
