import React from "react";
import moment from "moment";
import "./Message.css";
import { Avatar, Space, Typography, Row, Col } from "antd";
import ReactEmoji from "react-emoji";
import {
  ArrowRightOutlined,
  RightOutlined,
  UserOutlined,
} from "@ant-design/icons";
const { Text } = Typography;
const Message = ({ message: { text, user }, name, date }) => {
  let isSentByCurrentUser = false;

  const trimmedName = name.trim().toLowerCase();

  if (user === trimmedName) {
    isSentByCurrentUser = true;
  }

  return isSentByCurrentUser ? (
    <div className="messageContainer justifyEnd">
      <Space direction="vertical" size="0" style={{ width: "100%" }}>
        <Row>
          <Col span="24">
            <div
              className="messageBox backgroundBlue"
              style={{ float: "right" }}
            >
              <p className="messageText colorWhite">
                {ReactEmoji.emojify(text)}
              </p>
            </div>
          </Col>
          <Col span="24">
            <Text style={{ float: "right" }} type="secondary">
              {moment(date).fromNow()}
            </Text>
          </Col>
        </Row>
      </Space>
      <Avatar title={user} icon={<UserOutlined />} style={{ marginLeft: 4 }} />
    </div>
  ) : (
    <div className="messageContainer justifyStart">
      <Avatar title={user} icon={<UserOutlined />} style={{ marginRight: 4 }} />
      <Space direction="vertical" size="0" style={{ width: "100%" }}>
        <Row>
          <Col span="24">
            <div
              className="messageBox backgroundLight"
              style={{ float: "left" }}
            >
              <p className="messageText colorDark">
                {ReactEmoji.emojify(text)}
              </p>
            </div>
          </Col>
          <Col span="24">
            <Text type="secondary" style={{ float: "left" }}>
              {moment(date).fromNow()}
            </Text>
          </Col>
        </Row>
      </Space>
    </div>
  );
};

export default Message;
