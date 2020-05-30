import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Table, Space, Empty } from "antd";
import { api_base_url } from "../../../../keys/index";
import LoadingScreen from "../../../global-components/loading";
import {
  ArrowRightOutlined,
  UserOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
const { Text } = Typography;
function UserCount({ products }) {
  const [filteredlist, setfilteredlist] = useState([]);
  useEffect(() => {
    if (products.length != 0) {
      const temp = [];
      for (let c = 0; c < products.length; c++) {
        if (
          products[c].variants &&
          products[c].variants.length != 0 &&
          products[c].active
        ) {
          for (let x = 0; x < products[c].variants.length; x++) {
            if (
              products[c].variants[x].quantity <=
                products[c].variants[x].reorder_point &&
              products[c].variants[x].quantity > 0 &&
              products[c].variants[x].active
            ) {
              let image =
                products[c].variants[x] != undefined
                  ? products[c].variants[x].length != 0
                    ? products[c].variants[x].images != "" &&
                      products[c].variants[x].images != undefined &&
                      products[c].variants[x].images != null
                      ? products[c].variants[x].images
                      : null
                    : null
                  : null;
              temp.push({
                _id: products[c]._id,
                variant_id: products[c].variants[x]._id,
                quantity: products[c].variants[x].quantity,
                image_url: image,
                product_name: products[c].product_name,
                product_color: products[c].variants[x].color,
                product_size: products[c].variants[x].size,
                product_weight: products[c].variants[x].weight,
              });
            }
          }
        }
      }
      setfilteredlist(temp);
    }
  }, [products]);
  const columns = [
    {
      title: "Image",
      dataIndex: "image_url",
      key: "image_url",
      align: "center",
      render: (value) => {
        return [
          value != null ? (
            <img
              style={{
                width: "100%",
                cursor: "pointer",
                margin: "0 auto",
              }}
              src={value}
            />
          ) : (
            <Empty
              style={{
                marginTop: "0px",
                marginBottom: "0px",
              }}
              imageStyle={{
                verticalAlign: "middle",
                width: "100%",
                marginBottom: "0px",
              }}
              description={false}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ),
        ];
      },
      width: "15%",
    },
    {
      title: "Name",
      dataIndex: "product_name",
      key: "product_name",
      width: "40%",
    },
    {
      title: "Variant",
      dataIndex: "product_color",
      key: "product_color",
      render: (value, row) => {
        return [
          <Space direction="vertical">
            {row.product_size &&
            row.product_size != null &&
            row.product_size != "" ? (
              <span>{row.product_size}</span>
            ) : null}
            {row.product_weight &&
            row.product_weight != null &&
            row.product_weight != "" ? (
              <span>{row.product_weight}</span>
            ) : null}
            {row.product_color &&
            row.product_color != null &&
            row.product_color != "" ? (
              <span>{row.product_color}</span>
            ) : null}
          </Space>,
        ];
      },
      width: "30%",
    },
    {
      title: "quantity",
      dataIndex: "quantity",
      key: "quantity",
      align: "right",
      width: "10%",
    },
  ];
  if (products.length == 0) {
    return <LoadingScreen />;
  }
  return [
    <div style={{ overflow: "auto", maxHeight: "30vh", minHeight: "30vh" }}>
      {filteredlist.length != 0 ? (
        <Table
          columns={columns}
          dataSource={filteredlist}
          pagination={{ position: ["bottomCenter"], size: "small" }}
        />
      ) : (
        <Empty />
      )}
    </div>,
  ];
}

export default UserCount;
