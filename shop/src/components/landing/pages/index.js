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
import { withRouter, Link } from "react-router-dom";
import axios from "axios";
import { api_base_url } from "../../../keys";
import { checkAuth } from "../../helper/authCheck";
import LoadingPage from "../../global-components/loading";

// import FBLOGIN from "../../global-components/fb-login";
const { Content } = Layout;
function Dashboard(props) {
  const [collaped, setCollaped] = useState(false);
  const [initialSetup, setinitialSetup] = useState(false);
  const [submitloading, setsubmitloading] = useState(false);
  const [rememberMe, setrememberMe] = useState(true);

  const [usernamelogin, setusernamelogin] = useState("");
  const [passwordlogin, setpasswordlogin] = useState("");
  const [showComponent, setShowComponent] = useState(false);
  const [userInfo, setUserInfo] = useState([]);

  const componentClicked = () => {
    console.log("clicked");
  };
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

  const submitForm = async (values) => {
    setsubmitloading(true);
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.post(
      api_base_url + "/login",
      { username: values.username, password: values.password },
      { headers: headers }
    );
    if (response.data.message == "Login Successful") {
      setUserInfo(response.data.user);
      setrememberMe(rememberMe);
      message.success(response.data.message);

      const serializeState = JSON.stringify(response.data.user);
      setsubmitloading(false);
      if (rememberMe) {
        console.log(response.data);

        localStorage.setItem("landing_remember_account", rememberMe);
      }
      localStorage.setItem("landing_remembered_account", serializeState);
      localStorage.setItem("landing_credentials", serializeState);
      props.history.push("/");
    } else {
      setpasswordlogin("");
      message.error(response.data.message);
      setsubmitloading(false);
    }
  };

  if (showComponent === true) {
    return [
      <div
        style={{ width: "100%", height: "100vh", paddingTop: "15vh" }}
        key="0"
      >
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
              <Space>
                <Button
                  key="0"
                  type="primary"
                  htmlType="submit"
                  loading={submitloading}
                >
                  Login
                </Button>
                <span>or</span>
                <Link
                  to="/signup"
                  style={{ color: "#1890ff", cursor: "pointer" }}
                >
                  create a new account
                </Link>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>,
    ];
  } else {
    return [<LoadingPage tip="loading page..." />];
  }
}

export default withRouter(Dashboard);
