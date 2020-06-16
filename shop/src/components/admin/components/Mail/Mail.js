import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Button,
  Typography,
  Input,
  Drawer,
  Space,
  message,
  Skeleton,
  Divider,
  Avatar,
} from "antd";
import PropTypes from "prop-types";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
import "react-quill/dist/quill.core.css";
import axios from "axios";
import moment from "moment";
import { api_base_url_messages } from "../../../../keys";

import {
  UserOutlined,
  MailOutlined,
  PicCenterOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import quotedPrintable from "quoted-printable";
import windows1252 from "windows-1252";
const { Text, Title } = Typography;
function Mail(props) {
  const buckets = ["All", "Seen", "Unseen", "Draft"];

  const [email_list, setemail_list] = useState([]);
  const [activeBucket, setActiveBucket] = useState(0);
  const [reply_to, set_reply_to] = useState(undefined);
  const [activeEmail, setactiveEmail] = useState(0);
  const [RetrievedEmail, setRetrievedEmail] = useState([]);
  const [composeemail, setcomposeemail] = useState(false);
  const [userdata, setuserdata] = useState(undefined);
  const [cc, setcc] = useState("");
  const [email, setemail] = useState("");
  const [emailvalid, setemailvalid] = useState(true);
  const [disablebutton, setdisablebutton] = useState(false);
  const [subject, setsubject] = useState("");
  const [emailsubject, setemailsubject] = useState("");
  const [listLoading, setlistLoading] = useState(false);
  const [searchemail, setsearchemail] = useState("");
  const setActive = (e) => {
    setActiveBucket(e);
  };
  const setActiveE = (e) => {
    setactiveEmail(e);
  };
  const clearAll = () => {
    setcc("");
    setemail("");
    setcomposeemail(false);
    setsubject("");
    setemailsubject("");
  };
  useEffect(() => {
    let account = localStorage.getItem("remembered_account");
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
    if (props.system_settings) {
      retrieveEmail();
    }
  }, [activeBucket, props.system_settings]);

  const retrieveEmail = async () => {
    setactiveEmail(0);
    setemail_list([]);
    setRetrievedEmail([]);
    setlistLoading(true);
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios
      .post(
        api_base_url_messages + "/retrieve",
        {
          selected: buckets[activeBucket],
          g_account_password: props.system_settings.g_account_password,
          send_through_email: props.system_settings.send_through_email,
        },
        { headers: headers }
      )
      .then((response) => {
        response.data.content.reverse();
        setRetrievedEmail(response.data.content);
        setlistLoading(false);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.data.message == "No Email Found") {
          message.error("This List is Empty");
          setlistLoading(false);
        } else {
          message.error(
            "something went wrong fetching your email..trying again in 5 seconds..."
          );
          setlistLoading(false);

          setTimeout(() => {
            retrieveEmail();
          }, 5000);
        }
      });
  };
  const set_reply_to_component = (email) => {
    set_reply_to(email);
    setcomposeemail(true);
  };
  useEffect(() => {
    let drawerlist = [];
    for (let c = 0; c < RetrievedEmail.length; c++) {
      const element = RetrievedEmail[c];
      let subject = element
        ? element[0]
          ? element[0].subject != "" &&
            element[0].subject != undefined &&
            element[0].subject != null
            ? element[0].subject
            : "(No Subject)"
          : element[1].subject != "" &&
            element[1].subject != undefined &&
            element[1].subject != null
          ? element[1].subject
          : "(No Subject)"
        : "(No Subject)";
      let address = element
        ? element[0]
          ? element[0].from
            ? element[0].from.value[0].address
            : element[1].from
            ? element[1].from.value[0].address
            : ""
          : element[1].from
          ? element[1].from.value[0].address
          : element[0].from
          ? element[1].from.value[0].address
          : ""
        : "";
      let name = element
        ? element[0]
          ? element[0].from
            ? element[0].from.value[0].name
            : element[1].from
            ? element[1].from.value[0].name
            : ""
          : element[1].from
          ? element[1].from.value[0].name
          : element[0].from
          ? element[1].from.value[0].name
          : ""
        : "";
      let date = element
        ? element[0]
          ? element[0].date
            ? element[0].date
            : element[1].date
            ? element[1].date
            : ""
          : element[1].date
          ? element[1].date
          : element[0].date
          ? element[1].date
          : ""
        : "";
      if (
        subject.toLowerCase().includes(searchemail.toLowerCase()) ||
        address.toLowerCase().includes(searchemail.toLowerCase()) ||
        name.toLowerCase().includes(searchemail.toLowerCase())
      ) {
        drawerlist.push({
          index: c,
          subject: subject,
          address: address,
          name: name,
          date: date,
        });
      }
    }
    setemail_list(drawerlist);
  }, [RetrievedEmail, searchemail]);
  //retrieve
  const SendMessage = async () => {
    console.log("emailsubject", emailsubject);
    console.log("userdata", userdata);
    console.log("props.shop_email", props.shop_email);

    setdisablebutton(true);
    if (email != "") {
      let emails = email.split(/,|;/);
      let valid = 1;
      for (let c = 0; c < emails.length; c++) {
        console.log(emails[c]);
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emails[c])) {
        } else {
          valid = 0;
          break;
        }
      }
      if (valid == 1) {
        if (emailsubject == "") {
          message.error("please provide a message");
          setdisablebutton(false);
        } else {
          if (subject == "") {
            message.error("please provide a subject");
            setdisablebutton(false);
          } else {
            let cc_valid = 1;
            if (cc != "") {
              let cc_emails = cc.split(/,|;/);
              for (let c = 0; c < cc_emails.length; c++) {
                const element = cc_emails[c];
                if (
                  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(element)
                ) {
                } else {
                  cc_valid = 0;
                  break;
                }
              }
            }
            if (cc_valid == 1) {
              console.log(emailsubject);
              setemailvalid(true);
              const headers = {
                "Content-Type": "application/json",
              };
              const response = await axios
                .post(
                  api_base_url_messages + "/admin_send",
                  {
                    cc: cc,
                    send_to: email,
                    sender: props.shop_email,
                    reply_to: reply_to,
                    subject: subject,
                    text: emailsubject,
                    aws_region: props.system_settings.aws_region,
                    aws_access_key_id: props.system_settings.aws_access_key_id,
                    aws_secret_key: props.system_settings.aws_secret_key,
                  },
                  { headers: headers }
                )
                .then((response) => {
                  message.success(response.data.message);
                  setdisablebutton(false);
                  clearAll();
                })
                .catch((err) => {
                  // console.log(err.response.data.message);
                  message.error(err.response.data.message);

                  setdisablebutton(false);
                });
            } else {
              message.error("please provide a valid cc");
              setdisablebutton(false);
            }
          }
        }
      } else {
        message.error("please provide a valid email");
        setemailvalid(false);
        setdisablebutton(false);
      }
    } else {
      message.error("please provide an email");
      setemailvalid(false);
      setdisablebutton(false);
    }
  };

  return [
    <div>
      <Row>
        <Col span="8">
          <table className="bundlecustomtable" style={{ height: "90vh" }}>
            <tbody>
              <tr style={{ height: "10%" }}>
                <td
                  width="40%"
                  style={{
                    verticalAlign: "middle",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Button
                    type="primary"
                    block
                    size="large"
                    onClick={() => setcomposeemail(!composeemail)}
                  >
                    Compose
                  </Button>
                </td>
                <td
                  width="60%"
                  style={{
                    verticalAlign: "middle",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Text strong style={{ color: "#788195" }}>
                    Inbox
                  </Text>
                </td>
              </tr>
              <tr>
                <td style={{ verticalAlign: "top" }} rowSpan="2">
                  {buckets.map((bucket, key) => {
                    const selectedBucket = activeBucket === key;
                    const activeClass = selectedBucket ? "active" : "";
                    return [
                      <li
                        key={`bucket${key}`}
                        onClick={() => {
                          if (listLoading) {
                          } else {
                            setActive(key);
                          }
                        }}
                        style={{ cursor: listLoading ? "no-drop" : "pointer" }}
                        className={`isoSingleBucket ${activeClass}`}
                      >
                        <span>{bucket}</span>
                        <span className="isoMailBadge"></span>
                      </li>,
                    ];
                  })}
                </td>
                <td
                  style={{
                    verticalAlign: "middle",
                    height: "5%",
                    padding: 0,
                  }}
                >
                  <Input
                    placeholder="Search Email"
                    value={searchemail}
                    onChange={(e) => setsearchemail(e.target.value)}
                    style={{
                      border: "0px solid #ccc",
                      backgroundColor: "#f9f9f9",
                      height: "100%",
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    verticalAlign: "top",
                    padding: listLoading ? 20 : 0,
                  }}
                >
                  {listLoading ? (
                    <Skeleton active />
                  ) : (
                    <div className="dyn-height-no-padding">
                      {email_list.map((bucket, key) => {
                        const activeClass = activeEmail === key ? "active" : "";
                        return [
                          <li
                            key={`bucket${key}`}
                            onClick={() => {
                              setActiveE(key);
                            }}
                            className={`isoSingleBucketEmailList ${activeClass}`}
                          >
                            <Space>
                              <Avatar />

                              <span>
                                <Space size="0" direction="vertical">
                                  <Text>{bucket.name}</Text>
                                  <Text type="secondary">{bucket.address}</Text>
                                  <small>{moment(bucket.date).fromNow()}</small>
                                </Space>
                              </span>
                            </Space>
                          </li>,
                        ];
                      })}
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </Col>
        <Col span="16" style={{ overflow: "initial" }}>
          <Drawer
            placement="right"
            width="100%"
            className="customdrawer"
            height="100%"
            closable={false}
            onClose={() => setcomposeemail(false)}
            getContainer={false}
            style={{ position: "absolute" }}
            visible={composeemail}
          >
            <Row gutter={[16, 16]} align="middle">
              <Col span="24" style={{ textAlign: "center" }}>
                <Input
                  placeholder="To"
                  value={email}
                  className={emailvalid ? "valid_input" : "invalid_input"}
                  onChange={(e) => {
                    setemail(e.target.value);
                  }}
                />
              </Col>
            </Row>
            <Row gutter={[16, 16]} align="middle">
              <Col span="24" style={{ textAlign: "center" }}>
                <Input
                  placeholder="CC"
                  value={cc}
                  onChange={(e) => {
                    setcc(e.target.value);
                  }}
                />
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span="24" style={{ textAlign: "center" }}>
                <Input
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
                <ReactQuill
                  theme={"snow"}
                  onChange={(e) => setemailsubject(e)}
                  value={emailsubject}
                  modules={Mail.modules}
                  formats={Mail.formats}
                  placeholder={"Message"}
                />
              </Col>
            </Row>
            <Row gutter={[16, 16]} align="middle">
              <Col span="24">
                <Space>
                  <Button
                    loading={disablebutton}
                    disabled={disablebutton}
                    onClick={() => clearAll()}
                  >
                    CANCEL
                  </Button>
                  <Button
                    loading={disablebutton}
                    disabled={disablebutton}
                    type="primary"
                    onClick={() => {
                      SendMessage();
                    }}
                  >
                    {disablebutton ? (
                      "SENDING..."
                    ) : (
                      <>
                        {"SEND "} <ArrowRightOutlined />{" "}
                      </>
                    )}
                  </Button>
                </Space>
              </Col>
            </Row>
          </Drawer>

          {RetrievedEmail && RetrievedEmail.length != 0 ? (
            <div className="dyn-height-email">
              <div>
                <Row gutter={[16, 16]}>
                  <Col span="24">
                    <Title level={4}>
                      {RetrievedEmail && RetrievedEmail.length != 0
                        ? RetrievedEmail[activeEmail]
                          ? RetrievedEmail[activeEmail][0]
                            ? RetrievedEmail[activeEmail][0].subject != "" &&
                              RetrievedEmail[activeEmail][0].subject !=
                                undefined &&
                              RetrievedEmail[activeEmail][0].subject != null
                              ? RetrievedEmail[activeEmail][0].subject
                              : "(No Subject)"
                            : RetrievedEmail[activeEmail][1].subject != "" &&
                              RetrievedEmail[activeEmail][1].subject !=
                                undefined &&
                              RetrievedEmail[activeEmail][1].subject != null
                            ? RetrievedEmail[activeEmail][1].subject
                            : "(No Subject)"
                          : "(No Subject)"
                        : "(No Subject)"}
                    </Title>
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col span="24">
                    <Space>
                      <Avatar />
                      <Space size="2">
                        <Text strong>
                          {RetrievedEmail && RetrievedEmail.length != 0
                            ? RetrievedEmail[activeEmail]
                              ? RetrievedEmail[activeEmail][0]
                                ? RetrievedEmail[activeEmail][0].from
                                  ? RetrievedEmail[activeEmail][0].from.value[0]
                                      .name
                                  : ""
                                : RetrievedEmail[activeEmail][1].from
                                ? RetrievedEmail[activeEmail][1].from.value[0]
                                    .name
                                : ""
                              : ""
                            : ""}
                        </Text>
                        <Text type="secondary">
                          {RetrievedEmail && RetrievedEmail.length != 0
                            ? RetrievedEmail[activeEmail]
                              ? RetrievedEmail[activeEmail][0]
                                ? RetrievedEmail[activeEmail][0].from
                                  ? "<" +
                                    RetrievedEmail[activeEmail][0].from.value[0]
                                      .address +
                                    ">"
                                  : ""
                                : RetrievedEmail[activeEmail][1].from
                                ? "<" +
                                  RetrievedEmail[activeEmail][1].from.value[0]
                                    .address +
                                  ">"
                                : ""
                              : ""
                            : ""}
                        </Text>
                      </Space>
                    </Space>
                  </Col>
                </Row>
                <Divider />
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      RetrievedEmail && RetrievedEmail.length != 0
                        ? RetrievedEmail[activeEmail]
                          ? RetrievedEmail[activeEmail][1]
                            ? RetrievedEmail[activeEmail][1].text
                              ? // quotedPrintable
                                windows1252
                                  .decode(
                                    quotedPrintable.decode(
                                      RetrievedEmail[activeEmail][1].text
                                        .replace(/\r\n/g, "")
                                        .replace(/=3D/g, "=")
                                    )
                                  )
                                  // .replace(/\n/g, "<br>")
                                  .replace(
                                    /--NextPart Content-Type: text\/plain\;/g,
                                    ""
                                  )
                                  .replace(/Content-Type: text\/html\;/g, "")
                                  .replace(/Content-Type:/g, "")
                                  .replace(/text\/plain\;/g, "")

                                  .replace(/charset="UTF-8"/g, "")
                                  .replace(/charset=UTF-8/g, "")
                                  .replace(
                                    /Content-Transfer-Encoding: 8bit/g,
                                    ""
                                  )
                                  .replace(/charset="utf-8"/g, "")
                                  .replace(/Content-Disposition: inline/g, "")

                                  .replace(
                                    /Content-Transfer-Encoding: quoted-printable/g,
                                    ""
                                  )
                                  .replace(
                                    /Header --NextPart Content-Type: text\/plain\;/g,
                                    ""
                                  )
                                  .replace(/.*?--/, "")

                                  .replace(/--.*?--/g, "")
                                  .replace(/-- .*?--/g, "")
                                  .replace(/--.*? --/g, "")
                                  .replace(/-- .*? --/g, "")
                              : // .replace(/.*?--/g, "")
                              // .replace(/--.*?/g, "")
                              // RetrievedEmail[activeEmail][1].text
                              //     .replace(/=3D/g, "")
                              //     .replace(/=E2/g, "")
                              //     .replace(/=80/g, "")
                              //     .replace(/=8C/g, "")
                              //     .replace(/=EF/g, "")
                              //     .replace(/=BB/g, "")
                              //     .replace(/=BF/g, "")
                              //     .replace(/=\n/g, "")
                              //     .replace(/&amp/g, "")
                              //     .replace(/\n/g, " <br> ")
                              RetrievedEmail[activeEmail]
                              ? RetrievedEmail[activeEmail][0]
                                ? RetrievedEmail[activeEmail][0].text
                                  ? windows1252
                                      .decode(
                                        quotedPrintable.decode(
                                          RetrievedEmail[activeEmail][1].text
                                            .replace(/\r\n/g, "")
                                            .replace(/=3D/g, "=")
                                        )
                                      )
                                      // .replace(/\n/g, "<br>")
                                      .replace(
                                        /--NextPart Content-Type: text\/plain\;/g,
                                        ""
                                      )
                                      .replace(
                                        /Content-Type: text\/html\;/g,
                                        ""
                                      )
                                      .replace(/Content-Type:/g, "")
                                      .replace(/text\/plain\;/g, "")

                                      .replace(/charset="UTF-8"/g, "")
                                      .replace(/charset=UTF-8/g, "")
                                      .replace(
                                        /Content-Transfer-Encoding: 8bit/g,
                                        ""
                                      )
                                      .replace(/charset="utf-8"/g, "")
                                      .replace(
                                        /Content-Disposition: inline/g,
                                        ""
                                      )

                                      .replace(
                                        /Content-Transfer-Encoding: quoted-printable/g,
                                        ""
                                      )
                                      .replace(
                                        /Header --NextPart Content-Type: text\/plain\;/g,
                                        ""
                                      )
                                      .replace(/.*?--/, "")

                                      .replace(/--.*?--/g, "")
                                      .replace(/-- .*?--/g, "")
                                      .replace(/--.*? --/g, "")
                                      .replace(/-- .*? --/g, "")
                                  : // .replace(/.*?--/g, "")
                                    // .replace(/--.*?/g, "")
                                    ""
                                : ""
                              : ""
                            : ""
                          : ""
                        : "",
                  }}
                />
                <Divider />
                <Row gutter={[16, 16]} style={{ marginTop: 30 }}>
                  <Col span="24">
                    <Button
                      type="default"
                      onClick={() => {
                        set_reply_to_component(
                          RetrievedEmail && RetrievedEmail.length != 0
                            ? RetrievedEmail[activeEmail]
                              ? RetrievedEmail[activeEmail][0]
                                ? RetrievedEmail[activeEmail][0].from
                                  ? RetrievedEmail[activeEmail][0].from.value[0]
                                      .address
                                  : ""
                                : RetrievedEmail[activeEmail][1].from
                                ? RetrievedEmail[activeEmail][1].from.value[0]
                                    .address
                                : ""
                              : ""
                            : ""
                        );
                      }}
                    >
                      Reply
                    </Button>
                  </Col>
                </Row>
              </div>
            </div>
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifiedContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Text
                style={{
                  flex: "0 0 100%",
                  fontFamily: "Roboto, sans-serif",
                  textShadow: "rgba(0, 0, 0, 0.004) 1px 1px 1px",
                  color: "#979797",
                  fontSize: "28px",
                }}
              >
                Please Select A Mail To Read
              </Text>
            </div>
          )}
        </Col>
      </Row>
    </div>,
  ];
}
Mail.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};
/*
 * Quill Mail formats
 * See https://quilljs.com/docs/formats/
 */
Mail.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
];

/*
 * PropType validation
 */
Mail.propTypes = {
  placeholder: PropTypes.string,
};
export default Mail;
