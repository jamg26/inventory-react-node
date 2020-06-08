import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
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
import axios from "axios";
import { api_base_url } from "../../../../keys/index";
import numeral from "numeral";
const { Text, Title } = Typography;
function Overview() {
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
  const [temp_data, set_temp_data] = useState([]);
  const [temp_data2, set_temp_data2] = useState([]);
  const [data, set_data] = useState([]);
  const [total_rev, set_total_rev] = useState(0);

  const [avg, set_avg] = useState(0);
  const [daily_result, setdaily_result] = useState([]);
  const get_abandoned_carts = async () => {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.get(
      api_base_url + "/get_returning_customers",
      {},
      { headers: headers }
    );
    set_temp_data(response.data.today);
    set_temp_data2(response.data.new_visit);
  };
  useEffect(() => {
    get_abandoned_carts();
  }, []);
  useEffect(() => {
    let temp_data33 = [
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
    let temp = [];
    let temp_total = 0;
    let temp_total_new = 0;
    for (let c = 0; c < temp_data.length; c++) {
      const element = temp_data[c];
      console.log("element._id.hour", element._id.hour);
      if (temp_data33[element._id.hour]) {
        temp_data33[element._id.hour].pv = element.number_of_logins;
        temp_total =
          parseFloat(temp_total) + parseFloat(element.number_of_logins);
      }
    }
    let temp2 = [];
    for (let c = 0; c < temp_data2.length; c++) {
      const element = temp_data2[c];
      if (temp_data33[element._id.hour]) {
        temp_data33[element._id.hour].uv = element.number_of_logins;
        temp_total_new =
          parseFloat(temp_total_new) + parseFloat(element.number_of_logins);
      }
    }
    let newcontainer = [];
    for (let c = 0; c < temp_data33.length; c++) {
      const element = temp_data33[c];
      newcontainer.push(element);
      if (element.today == 0 && element.yesterday == 0) {
      } else {
      }
    }
    let percentage =
      (parseFloat(temp_total_new) / parseFloat(temp_total)) * 100;

    set_total_rev(percentage == NaN || percentage == Infinity ? 0 : percentage);
    console.log("newcontainer", newcontainer);
    set_data(newcontainer);
  }, [temp_data, temp_data2]);
  return [
    <>
      <Row gutter={[16, 16]}>
        <Col span="16">
          <Space direction="vertical">
            <Text style={{ color: "#474e59" }} strong>
              Returning Customer Rate
            </Text>
            <Title strong style={{ color: "#474e59", marginBottom: 0 }}>
              {numeral(total_rev).format("0,0")}%
            </Title>
            <Text>CUSTOMERS</Text>
          </Space>
        </Col>

        <Col span="8" style={{ textAlign: "center" }}></Col>
      </Row>
      <Row gutter={[16, 16]}>
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
                  dataKey="uv"
                  stackId="1"
                  stroke="#8884d8"
                  fill="#8884d8"
                />
                <Area
                  type="monotone"
                  dataKey="pv"
                  stackId="1"
                  stroke="#79cecb"
                  fill="#79cecb"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Col>
      </Row>
    </>,
  ];
}
export default Overview;
