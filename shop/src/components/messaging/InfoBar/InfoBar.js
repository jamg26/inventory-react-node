import React from "react";

import onlineIcon from "../icons/onlineIcon.png";
import closeIcon from "../icons/closeIcon.png";
import {
  Button,
  Layout,
  message,
  Card,
  Input,
  Space,
  Select,
  Radio,
  DatePicker,
  Row,
  Col,
} from "antd";
import {
  MailOutlined,
  SmileOutlined,
  UserOutlined,
  LockOutlined,
  CheckOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";

const InfoBar = ({ room }) => (
  <div style={{ borderBottom: "1px solid #ccc", borderTop: "1px solid #ccc" }}>
    <Row gutter={[16]} align="middle">
      <Col span="24">
        <Space align="center" style={{ margin: 10 }}>
          <h3
            style={{
              marginBottom: 0,
              color: "#454645",
              fontWeight: "bold",
            }}
          >
            {room}
          </h3>
        </Space>
      </Col>
    </Row>
  </div>
);

export default InfoBar;
