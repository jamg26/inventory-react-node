import React from "react";
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
  SendOutlined,
  SmileOutlined,
  UserOutlined,
  LockOutlined,
  CheckOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import "./Input.css";

const SInput = ({ onfocus, setMessage, sendMessage, message }) => (
  <form className="form">
    <input
      className="input"
      type="text"
      placeholder="Type a message..."
      onFocus={() => {
        onfocus();
      }}
      value={message}
      onChange={({ target: { value } }) => setMessage(value)}
      onKeyPress={(event) =>
        event.key === "Enter" ? sendMessage(event) : null
      }
    />
  </form>
);

export default SInput;
