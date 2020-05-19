import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../routes/routes";
import { Button, Layout, message, Card, Input, Space } from "antd";
import {
  MailOutlined,
  SmileOutlined,
  UserOutlined,
  LockOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { withRouter, Link } from "react-router-dom";
import axios from "axios";
import { api_base_url } from "../../../keys";
const { Content } = Layout;
function Dashboard(props) {
  const [collaped, setCollaped] = useState(false);
  const [submitloading, setsubmitloading] = useState(false);

  const [initialEmail, setInitialEmail] = useState("");
  const [initialName, setinitialName] = useState("");
  const [initialNameLast, setinitialNameLast] = useState("");
  const [initialUserName, setinitialUserName] = useState("");
  const [NewPassword, setNewPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [OldPassword, setOldPassword] = useState("");
  const [Password, setPassword] = useState("");
  const [userInfo, setUserInfo] = useState([]);
  const toggle = () => {
    setCollaped(!collaped);
  };
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };
  useEffect(() => {
    localStorage.setItem("landing_remember_account", false);
    localStorage.setItem("landing_remembered_account", "");
    localStorage.setItem("landing_credentials", "");
  }, []);

  const submitShop = async () => {
    console.log("userInfo", userInfo);
    console.log("initialEmail", initialEmail);
    if (initialEmail == "") {
      message.error("please provide the email");
    } else {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(initialEmail)) {
        if (initialName == "") {
          message.error("please provide the First Name for the Account");
        } else {
          if (initialNameLast == "") {
            message.error("please provide the Last Name for the Account");
          } else {
            if (initialUserName == "") {
              message.error("please provide the Username for the Account");
            } else {
              if (NewPassword == "") {
                message.error("please provide new Password for the Account");
              } else {
                if (ConfirmPassword == "") {
                  message.error("please provide Confirm Password");
                } else {
                  if (NewPassword == ConfirmPassword) {
                    if (Password == OldPassword) {
                      const headers = {
                        "Content-Type": "application/json",
                      };
                      const response = await axios.post(
                        api_base_url + "/signup",
                        {
                          email: initialEmail,
                          firstname: initialName,
                          lastname: initialNameLast,
                          username: initialUserName,
                          password: NewPassword,
                        },
                        { headers: headers }
                      );
                      if (response.data.message == "OK") {
                        message.success("Username successfully registered");
                        props.history.push("/login");
                      } else {
                        setNewPassword("");
                        setConfirmPassword("");
                        message.error(response.data.message);
                      }
                    } else {
                      message.error("Old Password does not Match");
                    }
                  } else {
                    message.error(
                      "New Password and Confirm Password does not Match"
                    );
                  }
                }
              }
            }
          }
        }
      } else {
        message.error("please provide a valid email");
      }
    }
  };
  return [
    <div style={{ width: "100%", height: "100vh", paddingTop: "15vh" }} key="0">
      <Card
        title="Create a new Account"
        style={{ width: 400, margin: "0 auto" }}
        className="login"
        key="0"
      >
        <Space
          direction="vertical"
          style={{ textAlign: "center", width: "100%" }}
        >
          <Input
            onPressEnter={() => {
              submitShop();
            }}
            allowClear
            addonBefore={<MailOutlined />}
            placeholder="Email.."
            size="large"
            value={initialEmail}
            onChange={(el) => {
              setInitialEmail(el.target.value);
            }}
          />
          <Input
            onPressEnter={() => {
              submitShop();
            }}
            allowClear
            addonBefore={<SmileOutlined />}
            placeholder="First Name.."
            size="large"
            value={initialName}
            onChange={(el) => {
              setinitialName(el.target.value);
            }}
          />
          <Input
            onPressEnter={() => {
              submitShop();
            }}
            allowClear
            addonBefore={<SmileOutlined />}
            placeholder="Last Name.."
            size="large"
            value={initialNameLast}
            onChange={(el) => {
              setinitialNameLast(el.target.value);
            }}
          />

          <Input
            onPressEnter={() => {
              submitShop();
            }}
            allowClear
            maxLength="20"
            addonBefore={<UserOutlined />}
            placeholder="Username.."
            size="large"
            value={initialUserName}
            onChange={(el) => {
              setinitialUserName(el.target.value);
            }}
          />
          <Input.Password
            onPressEnter={() => {
              submitShop();
            }}
            allowClear
            addonBefore={<LockOutlined />}
            placeholder="Password.."
            size="large"
            value={NewPassword}
            onChange={(el) => {
              setNewPassword(el.target.value);
            }}
          />
          <Input.Password
            onPressEnter={() => {
              submitShop();
            }}
            allowClear
            addonBefore={<CheckOutlined />}
            placeholder="Confirm Password.."
            size="large"
            value={ConfirmPassword}
            onChange={(el) => {
              setConfirmPassword(el.target.value);
            }}
          />

          <Space>
            <Button
              key="0"
              type="primary"
              htmlType="submit"
              loading={submitloading}
              onClick={() => submitShop()}
            >
              Signup
            </Button>
            <span>or</span>
            <Link to="/login" style={{ color: "#1890ff", cursor: "pointer" }}>
              already have an account?
            </Link>
          </Space>
        </Space>
      </Card>
    </div>,
  ];
}

export default withRouter(Dashboard);
