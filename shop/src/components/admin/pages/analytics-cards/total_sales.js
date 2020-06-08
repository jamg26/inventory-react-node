import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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
import cloneDeep from "lodash/cloneDeep";
const { Text, Title } = Typography;
function Overview() {
  //get_this_weeks_revenue
  const [orders_today, setorders_today] = useState([]);
  const [orders_yesterday, setorders_yesterday] = useState([]);
  const [data, setdata] = useState([]);
  const [order_count, set_order_count] = useState(0);
  const get_abandoned_carts = async () => {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.get(
      api_base_url_orders + "/get_checkout_today",
      {},
      { headers: headers }
    );
    setorders_today(response.data.today);
    setorders_yesterday(response.data.resultyesterday);
  };
  useEffect(() => {
    let temp = 0;
    let temp_data = [
      {
        name: "12AM",
        today: 0,
        yesterday: 0,
      },
      {
        name: "1AM",
        today: 0,
        yesterday: 0,
      },
      {
        name: "2AM",
        today: 0,
        yesterday: 0,
      },
      {
        name: "3AM",
        today: 0,
        yesterday: 0,
      },
      {
        name: "4AM",
        today: 0,
        yesterday: 0,
      },
      {
        name: "5AM",
        today: 0,
        yesterday: 0,
      },
      {
        name: "6AM",
        today: 0,
        yesterday: 0,
      },
      {
        name: "7AM",
        today: 0,
        yesterday: 0,
      },
      {
        name: "8AM",
        today: 0,
        yesterday: 0,
      },
      {
        name: "9AM",
        today: 0,
        yesterday: 0,
      },
      {
        name: "10AM",
        today: 0,
        yesterday: 0,
      },
      {
        name: "11AM",
        today: 0,
        yesterday: 0,
      },
      {
        name: "12PM",
        today: 0,
        yesterday: 0,
      },
      {
        name: "1PM",
        today: 0,
        yesterday: 0,
      },
      {
        name: "2PM",
        today: 0,
        yesterday: 0,
      },
      {
        name: "3PM",
        today: 0,
        yesterday: 0,
      },
      {
        name: "4PM",
        today: 0,
        yesterday: 0,
      },
      {
        name: "5PM",
        today: 0,
        yesterday: 0,
      },
      {
        name: "6PM",
        today: 0,
        yesterday: 0,
      },
      {
        name: "7PM",
        today: 0,
        yesterday: 0,
      },
      {
        name: "8PM",
        today: 0,
        yesterday: 0,
      },
      {
        name: "9PM",
        today: 0,
        yesterday: 0,
      },
      {
        name: "10PM",
        today: 0,
        yesterday: 0,
      },
      {
        name: "11PM",
        today: 0,
        yesterday: 0,
      },
    ];
    for (let c = 0; c < orders_today.length; c++) {
      const element = orders_today[c];
      temp = parseFloat(temp) + parseFloat(element.total_rev);
      if (temp_data[element._id.hour]) {
        temp_data[element._id.hour].today = element.total_rev;
      }
    }
    let temp2 = [];
    for (let c = 0; c < orders_yesterday.length; c++) {
      const element = orders_yesterday[c];
      if (temp_data[element._id.hour]) {
        temp_data[element._id.hour].yesterday = element.total_rev;
      }
    }
    let newcontainer = [];
    for (let c = 0; c < temp_data.length; c++) {
      const element = temp_data[c];
      newcontainer.push(element);
      if (element.today == 0 && element.yesterday == 0) {
      } else {
      }
    }
    console.log("data", newcontainer);
    setdata(newcontainer);
    set_order_count(temp);
  }, [orders_today, orders_yesterday]);

  useEffect(() => {
    get_abandoned_carts();
  }, []);

  return [
    <>
      <Row gutter={[16, 16]}>
        <Col span="8">
          <Space direction="vertical">
            <Text style={{ color: "#474e59" }} strong>
              Total Sales
            </Text>
            <Title strong style={{ color: "#474e59", marginBottom: 0 }}>
              {numeral(order_count).format("0,0")}
            </Title>
            <Text>SALES OVER TIME</Text>
          </Space>
        </Col>
        <Col span="8" style={{ textAlign: "left" }}></Col>
        <Col span="8" style={{ textAlign: "center" }}></Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span="24">
          <div style={{ width: "100%", height: 200 }}>
            <ResponsiveContainer>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="yesterday"
                  stroke="#e3e5ea"
                  activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="today" stroke="#c6abeb" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Col>
      </Row>
    </>,
  ];
}
export default Overview;
