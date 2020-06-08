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
import { api_base_url_orders } from "../../../../keys/index";
import axios from "axios";
import moment from "moment";
import numeral from "numeral";
import { Typography, Row, Col, List, Divider, Space } from "antd";
const { Text } = Typography;
function Overview() {
  const COLORS = ["#d72d2f", "#80b632", "#61cc77", "#58acdc", "#e2d9fe"];
  const [datarow, setdatarow] = useState([]);
  const [data, setdata] = useState([]);
  const getdata = async () => {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.get(
      api_base_url_orders + "/all_orders_items_grouped",
      {},
      { headers: headers }
    );
    setdatarow(response.data);
  };

  useEffect(() => {
    console.log("datarow", datarow);
    let temp_data = [];
    for (let c = 0; c < datarow.length; c++) {
      const element = datarow[c];
      let image = "";
      if (element.info && element.info.length != 0) {
        for (let x = 0; x < element.info[0].variants.length; x++) {
          const vari = element.info[0].variants[x];
          if (element.variant_id == vari._id) {
            image = vari.images;
            break;
          }
        }
      }
      let temp = {
        image: image,
        name: element.name,
        description: element.description,
        value: element.number_of_orders,
      };
      temp_data.push(temp);
    }
    setdata(temp_data);
  }, [datarow]);
  useEffect(() => {
    getdata();
  }, []);

  return [
    <Row gutter={[16, 16]}>
      <Col span="24">
        <Text strong style={{ color: "#5d646d", marginBottom: 0 }}>
          Best Selling Items
        </Text>
      </Col>
      <Col span="24">
        {data.map((row, index) => {
          return [
            <>
              <Divider style={{ marginTop: 5, marginBottom: 5 }} />
              <Row
                align="middle"
                type="flex"
                style={{ alignItems: "center" }}
                justify="center"
              >
                <Col span="24" style={{ verticalAlign: "middle" }}>
                  <table className="bundlecustomtable-w-40">
                    <tbody>
                      <tr>
                        <td width="10%" style={{ verticalAlign: "middle" }}>
                          <img
                            src={row.image}
                            style={{ width: "100%", marginRight: 5 }}
                          />
                        </td>
                        <td width="50%" style={{ verticalAlign: "middle" }}>
                          <Space direction="vertical" size="0">
                            <Text strong>{row.name}</Text>
                            <Text type="secondary">{row.description}</Text>
                          </Space>
                        </td>
                        <td
                          style={{
                            verticalAlign: "middle",
                            textAlign: "right",
                          }}
                        >
                          <Text
                            width="40%"
                            style={{ color: COLORS[index] }}
                            strong
                          >
                            {numeral(row.value).format("0,0")}
                          </Text>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Col>
              </Row>
            </>,
          ];
        })}
        <Divider style={{ marginTop: 5, marginBottom: 5 }} />
      </Col>
    </Row>,
  ];
}
export default Overview;
