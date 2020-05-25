import React, { useState, useEffect } from "react";
import axios from "axios";
import { Statistic } from "antd";
import { api_base_url } from ".././../../../keys/index";
import {
  ArrowRightOutlined,
  UserOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
function UserCount() {
  const [customercount, setcustomercount] = useState(0);
  const get_abandoned_carts = async () => {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.get(
      api_base_url + "/get_customer_list_count",
      {},
      { headers: headers }
    );
    setcustomercount(response.data.count);
  };
  useEffect(() => {
    get_abandoned_carts();
  }, []);
  return [
    <Statistic
      title="No. of Users Account"
      value={customercount}
      valueStyle={{ color: "#3f8600" }}
      prefix={<UserOutlined />}
      suffix="Accounts"
    />,
  ];
}

export default UserCount;
