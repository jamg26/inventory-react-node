import React from "react";
import { Tag } from "antd";
function Label(props) {
  return [
    <Tag key="0" color={props.color}>
      {props.label}
    </Tag>,
  ];
}

export default Label;
