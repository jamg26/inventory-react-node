import React, { useEffect, useState } from "react";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";
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
  const COLORS = ["#37d1ab", "#596285"];
  //get_todays_revenue
  const [revenue, setrevenue] = useState(0);
  const data = [{ name: "Group A", value: revenue }];
  const get_abandoned_carts = async () => {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.get(
      api_base_url_orders + "/get_todays_revenue",
      {},
      { headers: headers }
    );
    setrevenue(response.data.total_revenue);
  };
  useEffect(() => {
    get_abandoned_carts();
  }, []);
  return [
    <>
      <Row gutter={[16, 16]}>
        <Col span="24" style={{ textAlign: "left" }}>
          <Space>
            <Avatar
              size={"large"}
              style={{
                color: "#78dcb7",
                backgroundColor: "#cff3e6",
              }}
              icon={<PercentageOutlined />}
            />
            <Space direction="vertical" size={2}>
              <Text strong style={{ color: "#78dcb7", margin: "0px" }}>
                {numeral(revenue).format("0,0.00")}
              </Text>
              <small strong style={{ color: "#999fb5" }}>
                Todays Revenue
              </small>
            </Space>
          </Space>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span="24">
          <div style={{ width: "100%", height: 200 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data}
                  innerRadius={40}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={0}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Col>
      </Row>
    </>,
  ];
}
export default Overview;
