import React from "react";

import ScrollToBottom from "react-scroll-to-bottom";
import { Divider, Typography, Row, Col } from "antd";
import Message from "./Message/Message";

import "./Messages.css";
const { Text } = Typography;
const Messages = ({ messages, name }) => (
  <ScrollToBottom className="messages">
    <Row>
      <Col span="24" style={{ textAlign: "center" }}>
        <Text type="secondary">This is the start of the conversation</Text>
      </Col>
      <Col span="24">
        {messages.map((message, i) => (
          <div key={i}>
            <Message message={message} name={name} date={message.created_at} />
          </div>
        ))}
      </Col>
    </Row>
  </ScrollToBottom>
);

export default Messages;
