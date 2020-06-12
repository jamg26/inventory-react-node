import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import {
  Row,
  Col,
  Menu,
  Typography,
  Avatar,
  Badge,
  Divider,
  Input,
} from "antd";
import {
  ArrowRightOutlined,
  RightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import TextContainer from "./TextContainer/TextContainer";
import Messages from "./Messages/Messages";
import InfoBar from "./InfoBar/InfoBar";
import CustomInput from "./Input/Input";

import "./Chat.css";
import axios from "axios";
import {
  api_base_url,
  api_base_url_orders,
  api_base_url_settings,
  api_base_url_messages,
} from "../../keys";
let { Text } = Typography;
var sound = new Audio(process.env.PUBLIC_URL + "/swiftly.mp3");
let socket;

const Chat = (props) => {
  const { name, room, id } = props;
  const [typingprompt, settypingprompt] = useState("");
  const [name2, setName] = useState("");
  const [room2, setRoom] = useState("");
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [customer_supports, set_customer_supports] = useState([]);
  const [client, setclient] = useState(undefined);
  const ENDPOINT = "localhost:5005";
  const fetch_customer_supports = async () => {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.post(
      api_base_url_messages + "/get_client_messages",
      { client_id: id },
      { headers: headers }
    );
    set_customer_supports(response.data.messages);
  };
  useEffect(() => {
    fetch_customer_supports();
  }, []);
  useEffect(() => {
    console.log("customer_supports", customer_supports);
  }, [customer_supports]);
  useEffect(() => {
    if (name && name != "" && room && room != "" && client) {
      if (socket) {
        socket.disconnect();
      }
      console.log("joining socket");
      socket = io(ENDPOINT);

      setRoom(client.user);
      setName(name);
      socket.emit(
        "join",
        {
          name,
          room: client.customer_id + "-" + id,
          client_id: id,
          customer_id: client.customer_id,
        },
        (error) => {
          if (error) {
            //alert(error);
          } else {
            console.log("socket joined");
          }
        }
      );
      update_message_unseen_status();
    }
  }, [name, room, id, client]);

  useEffect(() => {
    if (name && name != "" && room && room != "" && client) {
      socket.on("old_messsages", ({ messages }) => {
        setMessages(messages);
      });
    }
  }, [name, room, client]);
  useEffect(() => {
    if (name && name != "" && room && room != "" && message != "") {
      socket.emit("typing", { name, room }, (error) => {
        if (error) {
          //alert(error);
        }
      });
    }
  }, [message]);
  useEffect(() => {
    if (name && name != "" && room && room != "" && client) {
      socket.on("typing", ({ user, text }) => {
        if (name.toLowerCase() != user) {
          if (typingprompt == "") {
          } else {
            settypingprompt(user + " is " + text + "...");
            setTimeout(() => {
              settypingprompt("");
            }, 5000);
          }
        }
      });
    }
  }, [name, room, id, client]);
  useEffect(() => {
    if (name && name != "" && room && room != "" && client) {
      socket.on("message", (message) => {
        console.log(
          "messa",
          message.user.toLowerCase(),
          name.toLowerCase(),
          message.user.toLowerCase() != name.toLowerCase()
        );
        if (message.user.toLowerCase() != name.toLowerCase()) {
          sound.currentTime = 0;
          sound.play();
        }
        setMessages((messages) => [...messages, message]);
      });

      socket.on("roomData", ({ users }) => {
        setUsers(users);
      });
    }
  }, [name, room, id, client]);
  useEffect(() => {
    setInterval(() => {
      fetch_customer_supports();
    }, 10000);
  }, []);
  const sendMessage = (event) => {
    event.preventDefault();
    update_message_unseen_status();
    if (message) {
      console.log("message", message);
      socket.emit("sendMessage", message, (s) => {
        update_message_unseen_status();
        if (s) {
          alert(s);
        }
        setMessage("");
      });
    }
  };
  const update_message_unseen_status = async () => {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.post(
      api_base_url_messages + "/update_messages_status",
      { client_id: id, room: client.customer_id + "-" + id },
      { headers: headers }
    );
  };
  const listener = async (id) => {
    const chosenclient = customer_supports.filter((user) => user.client === id);
    console.log("chosenclient", chosenclient[0]);
    setclient(chosenclient[0]);
  };
  return (
    <Row gutter={[0, 0]}>
      <Col span="4">
        <div
          className=" dyn-height"
          style={{
            padding: "0px",
            height: "60vh",
            borderRight: "1px solid #e9e9e9",
          }}
        >
          <Row align="middle" style={{ padding: 4 }}>
            <Col span="24">
              <Input style={{ border: "0px solid #ccc" }} size="large" />
            </Col>
          </Row>
          <Divider style={{ margin: "0px" }} />
          <Menu
            onSelect={(item, key) => {
              listener(item.key);
            }}
          >
            {customer_supports.map((value, index) => {
              return [
                <Menu.Item key={value.client}>
                  <Avatar
                    style={{ backgroundColor: "#87d068" }}
                    icon={<UserOutlined />}
                  />{" "}
                  {value.unseen != 0 ? (
                    <Text strong>
                      {value.user}
                      <Badge dot />
                    </Text>
                  ) : (
                    <Text>{value.user}</Text>
                  )}
                </Menu.Item>,
              ];
            })}
          </Menu>
        </div>
      </Col>
      <Col span="20" style={{ height: "100%" }}>
        {props.name &&
        props.name != "" &&
        props.room &&
        props.room != "" &&
        client ? (
          <div className="outerContainer">
            <div className="container">
              <InfoBar room={room2} />
              <Messages messages={messages} name={name2} />
              <div style={{ padding: "2px" }}>
                <span style={{ color: "rgba(0,0,0,.45)" }}>{typingprompt}</span>
              </div>
              <CustomInput
                message={message}
                setMessage={setMessage}
                sendMessage={sendMessage}
                onfocus={() => {}}
              />
            </div>
          </div>
        ) : null}
      </Col>
    </Row>
  );
};

export default Chat;
