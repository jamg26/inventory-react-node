import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { api_base_url_orders } from "../../../../keys/index";
import axios from "axios";
import moment from "moment";
import numeral from "numeral";

import { Typography, Row, Col, Progress, Divider, Space } from "antd";
const { Text } = Typography;
function Overview() {
  const COLORS = ["#d72d2f", "#80b632", "#61cc77", "#58acdc", "#e2d9fe"];
  const [datarow, setdatarow] = useState([]);
  const [negative, set_negative] = useState(0);
  const [positive, set_positive] = useState(0);
  const data = [
    { name: "Positive", value: 0 },
    { name: "Negative", value: 0 },
  ];
  return [
    <>
      <Row gutter={[16, 16]}>
        <Col span="24">
          <Text strong style={{ color: "#5d646d", marginBottom: 0 }}>
            Customers Feedback
          </Text>
        </Col>
        <Col span="24">
          <Divider style={{ marginTop: 5, marginBottom: 5 }} />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span="12">
          <Space direction="vertical" size="0" style={{ width: "100%" }}>
            <Text strong style={{ color: "#9da3b8" }}>
              Positive
            </Text>

            <Progress strokeColor="#4da741" percent={0} showInfo={false} />
            <Text strong style={{ color: "#4da741" }}>
              0
            </Text>
          </Space>
        </Col>

        <Col span="12">
          <Space direction="vertical" size="0" style={{ width: "100%" }}>
            <Text strong style={{ color: "#9da3b8" }}>
              Negative
            </Text>

            <Progress strokeColor="#d83545" percent={0} showInfo={false} />
            <Text strong style={{ color: "#d83545" }}>
              0
            </Text>
          </Space>
        </Col>
        <Col span="24">
          <div
            style={{
              width: "100%",
              height: negative == 0 && positive == 0 ? 0 : 200,
            }}
          >
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
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Col>
      </Row>
    </>,
  ];
}
export default Overview;
