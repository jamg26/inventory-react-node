import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../routes/routes";
import {
  Button,
  Layout,
  Result,
  PageHeader,
  message,
  Card,
  Form,
  Input,
  Checkbox,
  Drawer,
  Row,
  Col,
  Space,
} from "antd";
import {
  HomeOutlined,
  CheckCircleOutlined,
  SmileOutlined,
  UserOutlined,
  UnlockOutlined,
  LockOutlined,
  CheckOutlined,
  SendOutlined,
} from "@ant-design/icons";
import Side from "../inc/side";
import Header from "../inc/header";
import { withRouter } from "react-router-dom";
import axios from "axios";
import { api_base_url } from "../../../keys";
import { checkAuth } from "../../helper/authCheckAdmin";
const { Content } = Layout;
function Dashboard(props) {
  const [collaped, setCollaped] = useState(false);
  const [initialSetup, setinitialSetup] = useState(false);
  const [submitloading, setsubmitloading] = useState(false);
  const [rememberMe, setrememberMe] = useState(true);

  const [initialShopname, setinitialShopname] = useState("");
  const [initialName, setinitialName] = useState("");
  const [initialUserName, setinitialUserName] = useState("");
  const [NewPassword, setNewPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [OldPassword, setOldPassword] = useState("");
  const [Password, setPassword] = useState("");
  const [usernamelogin, setusernamelogin] = useState("");
  const [passwordlogin, setpasswordlogin] = useState("");

  const [userInfo, setUserInfo] = useState([]);
  const [showComponent, setShowComponent] = useState(false);
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
    checkAuth(props, setShowComponent, true);
  }, []);
  const submitShop = async () => {
    console.log("userInfo", userInfo);
    console.log("initialShopname", initialShopname);
    if (initialShopname == "") {
      message.error("please provide the name of the shop");
    } else {
      if (initialName == "") {
        message.error("please provide the Name for the Account");
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
              if (OldPassword == "") {
                message.error("please provide the Old Password of the Account");
              } else {
                if (NewPassword == ConfirmPassword) {
                  if (Password == OldPassword) {
                    const headers = {
                      "Content-Type": "application/json",
                    };
                    const response = await axios.post(
                      api_base_url + "/user/initial_setup_account",
                      {
                        account_id: userInfo._id,
                        initialShopname: initialShopname,
                        initialName: initialName,
                        initialUserName: initialUserName,
                        NewPassword: NewPassword,
                      },
                      { headers: headers }
                    );
                    if (rememberMe) {
                      const serializeState = JSON.stringify(response.data);
                      localStorage.setItem("remember_account", rememberMe);
                      localStorage.setItem(
                        "remembered_account",
                        serializeState
                      );
                      localStorage.setItem("credentials", serializeState);
                    }
                    props.history.push("/web-admin/home");
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
    }
  };
  const submitForm = async (values) => {
    setsubmitloading(true);
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.post(
      api_base_url + "/user/login",
      { username: values.username, password: values.password },
      { headers: headers }
    );
    if (response.data.message == "Login Successful") {
      setUserInfo(response.data.user);
      setPassword(values.password);
      setrememberMe(rememberMe);
      message.success(response.data.message);
      if (response.data.check_initial_setup) {
        setPassword(values.password);
        setinitialSetup(true);
        setsubmitloading(false);
      } else {
        //redirect to user router
        const serializeState = JSON.stringify(response.data.user);
        setsubmitloading(false);
        if (rememberMe) {
          console.log(response.data);

          localStorage.setItem("remember_account", rememberMe);
          localStorage.setItem("remembered_account", serializeState);
        }
        localStorage.setItem("credentials", serializeState);
        props.history.push("/web-admin/home");
      }
    } else {
      message.error(response.data.message);
      setsubmitloading(false);
    }
  };
  if (showComponent) {
    return [
      <div
        style={{ width: "100%", height: "100vh", paddingTop: "15vh" }}
        key="0"
      >
        <Drawer
          width={"100vw"}
          placement="right"
          closable={false}
          onClose={() => setinitialSetup(false)}
          visible={initialSetup}
        >
          <Result
            status="success"
            title="Successfully Initial Login!"
            subTitle="But first please provide the Account Detail"
            extra={[
              <Space direction="vertical">
                <Input
                  onPressEnter={() => {
                    submitShop();
                  }}
                  allowClear
                  maxLength="20"
                  addonBefore={<HomeOutlined />}
                  placeholder="Shop Name.."
                  size="large"
                  value={initialShopname}
                  onChange={(el) => {
                    setinitialShopname(el.target.value);
                  }}
                />
                <Input
                  onPressEnter={() => {
                    submitShop();
                  }}
                  allowClear
                  addonBefore={<SmileOutlined />}
                  placeholder="Name.."
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
                  placeholder="New Password.."
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
                  placeholder="Confirm New Password.."
                  size="large"
                  value={ConfirmPassword}
                  onChange={(el) => {
                    setConfirmPassword(el.target.value);
                  }}
                />
                <Input.Password
                  onPressEnter={() => {
                    submitShop();
                  }}
                  allowClear
                  addonBefore={<UnlockOutlined />}
                  placeholder="Old Password.."
                  size="large"
                  value={OldPassword}
                  onChange={(el) => {
                    setOldPassword(el.target.value);
                  }}
                />
                <Button
                  block
                  type="primary"
                  size="large"
                  key="buy"
                  onClick={() => {
                    submitShop();
                  }}
                >
                  {" "}
                  Proceed <SendOutlined />
                </Button>
              </Space>,
              ,
            ]}
          />
        </Drawer>
        <Card
          title="Login"
          style={{ width: 500, margin: "0 auto" }}
          className="login"
          key="0"
        >
          <Form
            {...layout}
            name="basic"
            key="0"
            initialValues={{
              remember: true,
              username: usernamelogin,
              password: passwordlogin,
            }}
            onFinish={(values) => {
              submitForm(values);
            }}
          >
            <Form.Item
              label="Username"
              name="username"
              key="0"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input key="0" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              key="1"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password key="1" />
            </Form.Item>
            {/* 
            <Form.Item
              key="2"
              {...tailLayout}
              name="remember"
              valuePropName="checked"
            >
              <Checkbox key="0">Remember me</Checkbox>
            </Form.Item> */}

            <Form.Item key="3" {...tailLayout}>
              <Button
                key="0"
                type="primary"
                htmlType="submit"
                loading={submitloading}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>,
    ];
  } else {
    return null;
  }
}

export default withRouter(Dashboard);
