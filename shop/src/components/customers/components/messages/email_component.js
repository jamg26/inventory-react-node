import React, { useState, useEffect } from "react";
import {
  Modal,
  Layout,
  Tabs,
  PageHeader,
  Col,
  Row,
  Typography,
  Result,
  Input,
  Button,
  Space,
  message,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PicCenterOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { api_base_url_messages } from "../../../../keys/index";
import TextArea from "antd/lib/input/TextArea";
import axios from "axios";
import RichTextEditor from "react-rte";
import "draft-js/dist/Draft.css";
const { Title, Text } = Typography;
function EmailComponent(props) {
  const [userdata, setuserdata] = useState(undefined);
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [emailvalid, setemailvalid] = useState(true);
  const [disablebutton, setdisablebutton] = useState(false);
  const [subject, setsubject] = useState("");
  const [emailsubject, setemailsubject] = useState(() =>
    RichTextEditor.createEmptyValue()
  );
  useEffect(() => {
    let account = localStorage.getItem("landing_remembered_account");
    if (account === null || account == "") {
      account = undefined;
    }
    if (account === undefined) {
    } else {
      const data = JSON.parse(account);

      setuserdata(data);
    }
  }, []);
  useEffect(() => {
    console.log("userdata", userdata);
    if (userdata) {
      setname(userdata ? userdata.fname + " " + userdata.lname : "");
      setemail(userdata ? userdata.email : "");
    }
  }, [userdata]);
  const clearAll = () => {
    if (userdata) {
      setname(userdata ? userdata.fname + " " + userdata.lname : "");
      setemail(userdata ? userdata.email : "");
    } else {
      setname("");
      setemail("");
    }

    setsubject("");
    setemailsubject(RichTextEditor.createEmptyValue());
  };
  const SendMessage = async () => {
    console.log("emailsubject", emailsubject.toString("html"));
    setdisablebutton(true);
    if (email != "") {
      if (name == "") {
        message.error("please provide an name");
        setdisablebutton(false);
      } else {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
          if (emailsubject.toString("html") == "") {
            message.error("please provide a message");
            setdisablebutton(false);
          } else {
            if (subject == "") {
              message.error("please provide a subject");
              setdisablebutton(false);
            } else {
              setemailvalid(true);
              const headers = {
                "Content-Type": "application/json",
              };
              const response = await axios
                .post(
                  api_base_url_messages + "/send",
                  {
                    name: name,
                    customer_email: email,
                    customer_id: userdata ? userdata._id : "",
                    to: props.shop_email,
                    aws_region: props.system_settings.aws_region,
                    aws_access_key_id: props.system_settings.aws_access_key_id,
                    aws_secret_key: props.system_settings.aws_secret_key,
                    subject: subject,
                    text: emailsubject.toString("html"),
                  },
                  { headers: headers }
                )
                .then((response) => {
                  message.success(response.data.message);
                  setdisablebutton(false);
                  clearAll();
                })
                .catch((err) => {
                  message.error(
                    "something went wrong..please try again later."
                  );
                  setdisablebutton(false);
                });
            }
          }
        } else {
          message.error("please provide a valid email");
          setdisablebutton(false);
        }
      }
    } else {
      message.error("please provide an email");
      setemailvalid(false);
      setdisablebutton(false);
    }
  };
  if (
    props.shop_email &&
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(props.shop_email)
  ) {
    return [
      <>
        <Row gutter={[16, 16]}>
          <Col span="7"></Col>
          <Col span="10">
            <Row gutter={[16, 16]} align="middle">
              <Col span="24" style={{ textAlign: "center" }}>
                <Title level={4}>Contact Us</Title>
              </Col>
            </Row>
            <Row gutter={[16, 16]} align="middle">
              <Col span="24" style={{ textAlign: "center" }}>
                <Input
                  addonBefore={<UserOutlined />}
                  placeholder="Name"
                  value={name}
                  onChange={(e) => {
                    setname(e.target.value);
                  }}
                />
              </Col>
            </Row>
            <Row gutter={[16, 16]} align="middle">
              <Col span="24" style={{ textAlign: "center" }}>
                <Input
                  addonBefore={<MailOutlined />}
                  placeholder="Email"
                  value={email}
                  className={emailvalid ? "valid_input" : "invalid_input"}
                  onChange={(e) => {
                    setemail(e.target.value);
                  }}
                />
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span="24" style={{ textAlign: "center" }}>
                <Input
                  addonBefore={<PicCenterOutlined />}
                  placeholder="Subject"
                  value={subject}
                  onChange={(e) => {
                    setsubject(e.target.value);
                  }}
                />
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span="24">
                <RichTextEditor
                  value={emailsubject}
                  onChange={(e) => setemailsubject(e)}
                  placeholder="Message"
                />
                {/* <TextArea
                  placeholder="Message"
                  rows={5}
                  value={emailsubject}
                  onChange={(e) => {
                    setemailsubject(e.target.value);
                  }}
                /> */}
              </Col>
            </Row>
            <Row gutter={[16, 16]} align="middle">
              <Col span="24" style={{ textAlign: "center" }}>
                <Space>
                  <Button
                    loading={disablebutton}
                    disabled={disablebutton}
                    onClick={() => clearAll()}
                  >
                    Clear
                  </Button>
                  <Button
                    loading={disablebutton}
                    disabled={disablebutton}
                    className="ant-btn-succcess"
                    onClick={() => {
                      SendMessage();
                    }}
                  >
                    {disablebutton ? (
                      "Sending..."
                    ) : (
                      <>
                        {"Send "} <ArrowRightOutlined />{" "}
                      </>
                    )}
                  </Button>
                </Space>
              </Col>
            </Row>
          </Col>
          <Col span="7"></Col>
        </Row>
      </>,
    ];
  } else {
    return [
      <Row gutter={[16, 16]} align="middle">
        <Col span="12" style={{ height: "100%" }}></Col>
        <Col span="12" style={{ height: "100%" }}></Col>
      </Row>,
    ];
  }
}

export default EmailComponent;