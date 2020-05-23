import React from "react";
import { Spin } from "antd";

function Loading({ tip }) {
  return [
    <div className="loading_page">
      <Spin size="large" tip={tip} />
    </div>,
  ];
}
export default Loading;
