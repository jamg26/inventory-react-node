import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { api_base_url } from "../../../../keys/index";
import axios from "axios";
import moment from "moment";
import { Typography, Row, Col } from "antd";
const { Text } = Typography;
function Overview() {
  const [datarow, setdatarow] = useState([]);
  const [data, setdata] = useState([]);
  const getdata = async () => {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.get(
      api_base_url + "/get_login_logs",
      {},
      { headers: headers }
    );
    setdatarow(response.data);
  };
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
  useEffect(() => {
    let sdt = [];
    console.log("datarow", datarow);
    if (datarow.data) {
      for (let x = 1; x <= 12; x++) {
        let count = 0;
        for (let c = 0; c < datarow.data.length; c++) {
          const element = datarow.data[c];
          if (element._id.year == moment().format("YYYY")) {
            if (x == element._id.month) {
              console.log("month with content", element._id.month);
              count = element.number_of_logins;
              break;
            }
          }
        }
        sdt.push({ name: months[x], visits: count });
      }
    }

    setdata(sdt);
  }, [datarow]);
  useEffect(() => {
    getdata();
  }, []);

  return [
    <Row gutter={[16, 16]}>
      <Col span="24">
        <Text strong style={{ color: "#5d646d", marginBottom: 0 }}>
          Site Visit Growth
        </Text>
      </Col>
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
                dataKey="visits"
                stroke="#2db0c1"
                fill="#2db0c1"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Col>
    </Row>,
  ];
}
export default Overview;
