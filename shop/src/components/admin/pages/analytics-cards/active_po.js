import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Table, Space, Empty } from "antd";
import { api_base_url } from "../../../../keys/index";
import {
  ArrowRightOutlined,
  UserOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
const { Text } = Typography;
function UserCount() {
  const [filteredlist, setfilteredlist] = useState([]);
  const columns = [
    {
      title: "Name",
      dataIndex: "product_name",
      key: "product_name",
      width: "40%",
    },
  ];
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
