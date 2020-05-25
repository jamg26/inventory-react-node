import React, { useState, useContext } from "react";
import axios from "axios";
import { Statistic } from "antd";
import {
  ArrowRightOutlined,
  UserOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { AbandonedList } from "../../../../routes/routes";
function AbandonedCarts() {
  var data = useContext(AbandonedList);
  return [
    <Statistic
      title="Abandoned Carts"
      value={data.length}
      valueStyle={{ color: "#3f8600" }}
      prefix={<ShoppingCartOutlined />}
      suffix="Cart/s"
    />,
  ];
}

export default AbandonedCarts;
