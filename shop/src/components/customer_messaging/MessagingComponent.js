import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import { Row, Col, Menu, Typography, Avatar } from "antd";
import {
  ArrowRightOutlined,
  RightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import TextContainer from "./TextContainer/TextContainer";
import Messages from "./Messages/Messages";
import InfoBar from "./InfoBar/InfoBar";
import Input from "./Input/Input";

import "./Chat.css";
import axios from "axios";
import {
  chat_endpoint,
  api_base_url,
  api_base_url_orders,
  api_base_url_settings,
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
  const ENDPOINT = chat_endpoint;
  const fetch_customer_supports = async () => {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.get(
      api_base_url + "/users",
      {},
      { headers: headers }
    );
    set_customer_supports(response.data);
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

      setRoom(client.name);
      setName(name);
      console.log(id + "-" + client._id);
      socket.emit(
        "join",
        {
          name,
          room: id + "-" + client._id,
          client_id: client._id,
          customer_id: id,
        },
        (error) => {
          if (error) {
            //alert(error);
          } else {
            console.log("socket joined");
          }
        }
      );
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
        console.log(name + " is " + user);
        if (name.toLowerCase() != user) {
          settypingprompt(user + " is " + text + "...");
          setTimeout(() => {
            settypingprompt("");
          }, 5000);
        }
      });
    }
  }, [name, room, id, client]);
  useEffect(() => {
    if (name && name != "" && room && room != "" && client) {
      socket.on("message", (message) => {
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

  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      console.log("message", message);
      socket.emit("sendMessage", message, (s) => {
        if (s) {
          alert(s);
        }
        setMessage("");
      });
    }
  };
  const listener = (id) => {
    const chosenclient = customer_supports.filter((user) => user._id === id);
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
            borderRight: "1px solid #ccc",
          }}
        >
          <Menu
            onSelect={(item, key) => {
              listener(item.key);
            }}
          >
            {customer_supports.map((value, index) => {
              return [
                <Menu.Item key={value._id}>
                  <Avatar
                    style={{ backgroundColor: "#87d068" }}
                    icon={<UserOutlined />}
                  />{" "}
                  <Text strong>{value.name}</Text>
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
              <Input
                message={message}
                setMessage={setMessage}
                sendMessage={sendMessage}
              />
            </div>
          </div>
        ) : null}
      </Col>
    </Row>
  );
};

export default Chat;
