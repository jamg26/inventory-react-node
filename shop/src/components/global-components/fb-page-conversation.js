import React, { useState, useEffect } from "react";
import FacebookLogin from "react-facebook-login";
import LoadingPage from "./loading";
import { Row, Col, Space, Typography, Input, Avatar, Badge } from "antd";
import { FacebookOutlined } from "@ant-design/icons";
import ReactEmoji from "react-emoji";
const { Text } = Typography;
function MessangerManager() {
  const [loggedin, setloggedin] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [conversation_msg, setConversation_msg] = useState([]);
  const [selected_conversation, set_selected_conversation] = useState(
    undefined
  );
  const [AccessToken, setAccessToken] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [refresher, set_refresher] = useState(false);
  var refreshIntervalId;
  useEffect(() => {
    console.log("Permissions", window.permission);
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
    } else {
      // Redirec.requestPermission();
    }
  }, []);
  useEffect(() => {
    if (loggedin) {
      refresh_messages();
    }
  }, [loggedin]);
  const refresh_messages = () => {
    getFBConversations();
    console.log("refreshIntervalId", refreshIntervalId);
    clearInterval(refreshIntervalId);
    refreshIntervalId = setInterval(() => {
      getFBConversations();
    }, 30000);
  };
  useEffect(() => {
    console.log("conversations", conversations);
  }, [conversations]);
  const getFBConversations = () => {
    //get account
    var account_detail = window.FB.api("/me/accounts", (result) => {
      console.log(result.data ? result.data[0].access_token : "");
      //get conversation
      let conversation = window.FB.api(
        "/101533494943366/conversations?fields=unread_count,senders{profile_pic},message_count,participants{profile_pic},snippet,messages{message,from}",
        {
          access_token:
            result && result.data ? result.data[0].access_token : "",
        },
        (ss) => {
          let proceed_conversation = [];
          if (ss && ss.data && ss.data.length != 0) {
            for (let c = 0; c < ss.data.length; c++) {
              const element = ss.data[c];
              let name = "";
              let recipient = "";
              console.log("element", element);
              if (element.senders && element.senders.data) {
                for (let x = 0; x < element.senders.data.length; x++) {
                  let sender_data = element.senders.data[x];
                  if (sender_data.id != "101533494943366") {
                    name = sender_data.name;
                    recipient = sender_data.id;
                  }
                }
              }

              proceed_conversation.push({
                id: element.id,
                unread_count: element.unread_count,
                snippet: element.snippet,
                recipient: recipient,
                name: name,
              });
            }
          }
          setAccessToken(
            result && result.data ? result.data[0].access_token : ""
          );
          setConversations(proceed_conversation);
        }
      );
    });
  };
  useEffect(() => {
    console.log("selected_conversation", selected_conversation);
    if (
      selected_conversation &&
      selected_conversation.id != "" &&
      selected_conversation.id != undefined
    ) {
      //fetching messages from the conversation
      let messages = window.FB.api(
        "/" +
          selected_conversation.id +
          "/messages?fields=message,from,to,unread_count,created_time,shares{id,link,description,name}",
        {
          access_token: AccessToken,
        },
        (msg) => {
          setConversation_msg(msg.data.reverse());
          console.log("msg", msg);
        }
      );
    }
  }, [selected_conversation, refresher]);
  const GetConversationMessages = (conversation) => {
    console.log(conversation);
    set_selected_conversation(conversation);
  };
  const sendFBMessage = () => {
    if (
      newMessage != "" &&
      selected_conversation &&
      selected_conversation.recipient != ""
    ) {
      let messages = window.FB.api(
        "/101533494943366/messages?access_token=" + AccessToken,
        "POST",
        {
          messaging_type: "UPDATE",
          message: { text: newMessage },
          recipient: {
            id: selected_conversation.recipient,
          },
        },
        (msg) => {
          console.log("result send", msg);
          refresh_messages();
          set_refresher(!refresher);
        }
      );
      setNewMessage("");
    }
  };
  if (!loggedin) {
    return [
      <FacebookLogin
        appId="309671157102004"
        autoLoad={true}
        fields="name,email,picture"
        scope="pages_messaging,pages_manage_engagement,pages_manage_metadata,read_mailbox,read_page_mailboxes,email"
        version="7.0"
        cssClass="my-facebook-button-class"
        icon={<FacebookOutlined />}
        onClick={() => console.log("")}
        onFailure={(err) => {
          console.log(err);
        }}
        callback={(response) => {
          console.log("response", response);
          if (response.status == "unknown") {
          } else {
            setloggedin(true);
          }
        }}
      />,
    ];
  } else {
    return [
      <table className="FBMessangerTABLE">
        <tbody>
          <tr style={{ maxHeight: "60px", height: "60px" }}>
            <td style={{ width: "20%" }}>
              <Space style={{ width: "100%" }}>
                <Text strong>Conversation</Text>{" "}
                <Input placeholder="Search Conversation" />
              </Space>
            </td>
            <td>
              {selected_conversation && selected_conversation.id != "" ? (
                <Text strong>{selected_conversation.name}</Text>
              ) : (
                ""
              )}
            </td>
          </tr>
          <tr>
            <td rowSpan="2" style={{ verticalAlign: "top", padding: 0 }}>
              <div
                className=" dyn-height"
                style={{
                  padding: "0px",
                }}
              >
                {conversations.map((conversation, inde) => {
                  return [
                    <li
                      key={inde}
                      className="ConversationItem"
                      onClick={() => {
                        GetConversationMessages(conversation);
                      }}
                    >
                      <Space style={{ width: "100%" }}>
                        <Badge dot count={conversation.unread_count}>
                          <Avatar />
                        </Badge>
                        <Space direction="vertical" size="0">
                          <Text strong>{conversation.name}</Text>

                          <Text
                            type={`${
                              conversation.unread_count == 0 ? "secondary" : ""
                            }`}
                          >
                            {conversation.snippet.length > 20
                              ? ReactEmoji.emojify(
                                  conversation.snippet.substring(0, 20 - 3) +
                                    "..."
                                )
                              : ReactEmoji.emojify(conversation.snippet)}
                          </Text>
                        </Space>
                      </Space>
                    </li>,
                  ];
                })}
              </div>
            </td>
            <td style={{ verticalAlign: "bottom", padding: 0 }}>
              <div
                className="dyn-height"
                style={{
                  padding: "0px",
                }}
              >
                <Space
                  direction="vertical"
                  style={{ width: "100%" }}
                  className=" dyn-height"
                  size={12}
                >
                  {conversation_msg.map((message, index) => {
                    if (
                      parseFloat(index) + parseFloat(1) ==
                      conversation_msg.length
                    ) {
                      setTimeout(() => {
                        document
                          .getElementById("last_message")
                          .scrollIntoView();
                      }, 1000);
                    }
                    if (message.from.id == "101533494943366") {
                      return [
                        <Space
                          style={{ float: "right" }}
                          id={
                            parseFloat(index) + parseFloat(1) ==
                            conversation_msg.length
                              ? "last_message"
                              : ""
                          }
                        >
                          {message.shares ? (
                            <img src={message.shares.data[0].link} />
                          ) : (
                            <Text
                              style={{
                                backgroundColor: "#1984ff",
                                padding: "10px 16px",
                                borderRadius: "20px",
                                color: "white",
                              }}
                            >
                              {ReactEmoji.emojify(message.message)}
                            </Text>
                          )}

                          <Avatar />
                        </Space>,
                      ];
                    } else {
                      return [
                        <Space
                          id={
                            parseFloat(index) + parseFloat(1) ==
                            conversation_msg.length
                              ? "last_message"
                              : ""
                          }
                        >
                          <Avatar />

                          {message.shares ? (
                            <img src={message.shares.data[0].link} />
                          ) : (
                            <Text
                              style={{
                                backgroundColor: "#f1f0f0",
                                padding: "10px 16px",
                                borderRadius: "20px",
                              }}
                            >
                              {ReactEmoji.emojify(message.message)}
                            </Text>
                          )}
                        </Space>,
                      ];
                    }
                  })}
                </Space>
              </div>
            </td>
          </tr>
          <tr>
            <td style={{ height: "50px", maxHeight: "50px", padding: 0 }}>
              <Input
                disabled={!selected_conversation}
                placeholder="write a message"
                style={{ height: "100%", border: "0px solid #ccc" }}
                value={newMessage}
                onPressEnter={() => {
                  sendFBMessage();
                }}
                onChange={(e) => setNewMessage(e.target.value)}
              />
            </td>
          </tr>
        </tbody>
      </table>,
    ];
  }
}

export default MessangerManager;
