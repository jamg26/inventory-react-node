import React, { useState, useEffect, useContext } from "react";
import {
  Layout,
  Button,
  Dropdown,
  Menu,
  Badge,
  notification,
  Row,
  Col,
  Typography,
  Modal,
  Form,
  Input,
  DatePicker,
  Space,
  message,
  Avatar,
} from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  NotificationOutlined,
  BellOutlined,
  LockOutlined,
  HomeOutlined,
  BarChartOutlined,
  InboxOutlined,
  TagOutlined,
  UserAddOutlined,
  TeamOutlined,
  SettingOutlined,
  MessageOutlined,
  MailOutlined,
  BellFilled,
  MessageFilled,
  MessageTwoTone,
  SolutionOutlined,
} from "@ant-design/icons";

import axios from "axios";
import { api_base_url, api_base_url_messages } from "../../../keys/index";
import { Link } from "react-router-dom";
import CredentialsAccount from "./section/accountCredentials";
import { SettingContext } from "../../../routes/routes";
const { Header } = Layout;
const { Text } = Typography;
const { SubMenu } = Menu;
function Head(props) {
  var settings = useContext(SettingContext);
  const [username, setUserName] = useState("");
  const [position, setposition] = useState("");
  const [accountdata, setaccountdata] = useState({});
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [visibleEditCredential, setvisibleEditCredential] = useState(false);
  const [newmessage, setnewmessage] = useState(0);
  const [customer_supports, set_customer_supports] = useState([]);
  const [form_edit_staff] = Form.useForm();
  const [dateBirthday, setBirthday] = useState("");
  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 8,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 16,
      },
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  };
  function onChangeEditBirthday(date, dateString) {
    setBirthday(dateString);
  }
  const handleCancelEdit = () => setVisibleEdit(false);
  const handleFinishEdit = (values) => {
    if (values.value_name == null || values.value_name == "") {
      values.value_name = accountdata.name;
    }
    if (values.value_email == null || values.value_email == "") {
      console.log(true, " email value");
      values.value_email = accountdata.email;
    }
    if (values.value_address == null || values.value_address == "") {
      values.value_address = accountdata.address;
    }
    if (dateBirthday == "") {
      console.log(true, "birhday value null");
      values.value_birthday = accountdata.birthday;
    } else if (dateBirthday != "") {
      values.value_birthday = dateBirthday;
    }
    if (values.value_position == null || values.value_position == "") {
      values.value_position = accountdata.position;
    }
    if (values.value_username == null || values.value_username == "") {
      values.value_username = accountdata.username;
    }
    const save = {
      _id: accountdata._id,
      name: values.value_name,
      address: values.value_address,
      email: values.value_email,
      birthday: values.value_birthday,
      position: values.value_position,
      username: values.value_username,
      password: values.password,
    };

    console.log(save, "this is save values");
    axios.post(api_base_url + "/profile/edit", save).then((res) => {
      if (res.data == "edit staff info successful") {
        setVisibleEdit(false);
        form_edit_staff.resetFields();
      } else {
        message.error(res.data);
      }
    });
  };
  const fetch_customer_supports = async (id) => {
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
    console.log("customer_supports", customer_supports);
    let count = 0;
    for (let c = 0; c < customer_supports.length; c++) {
      const element = customer_supports[c];
      if (element.unseen != 0) {
        console.log("new message");
        count++;
      }
    }
    setnewmessage(count);
  }, [customer_supports]);

  const openNotification = () => {
    notification.open({
      message: "Sample Notification Title",
      description:
        "This is the sample content of the notification. This is the sample content of the notification. This is the sample content of the notification.",
      onClick: () => {
        console.log("Notification Clicked!");
      },
      icon: <NotificationOutlined style={{ color: "#108ee9" }} />,
    });
  };
  useEffect(() => {
    let account = localStorage.getItem("remembered_account");
    if (account === null || account == "") {
      account = undefined;
    }
    if (account === undefined) {
    } else {
      const data = JSON.parse(account);
      setaccountdata(data);
      setUserName(data.username);
      setposition(data.position);
      if (props.no != "12") {
        fetch_customer_supports(data._id);
        setInterval(() => {
          fetch_customer_supports(data._id);
        }, 10000);
      }
    }
  }, []);
  const menu = (
    <Menu>
      <Menu.Item key="user_info_menu">
        <Link
          style={{ fontSize: "inherit" }}
          to={"#"}
          onClick={() => {
            setVisibleEdit(true);
          }}
        >
          <UserOutlined /> Profile
        </Link>
      </Menu.Item>
      <Menu.Item key="user_password_change">
        <Link
          style={{ fontSize: "inherit" }}
          to={"#"}
          onClick={() => {
            setvisibleEditCredential(true);
          }}
        >
          <LockOutlined /> Change Password
        </Link>
      </Menu.Item>
      <Menu.Item key="logout_menu">
        <Link
          to="/web-admin/"
          onClick={() => {
            localStorage.setItem("remember_account", false);
            localStorage.setItem("remembered_account", "");
            localStorage.setItem("credentials", "");
          }}
          style={{ fontSize: "inherit" }}
        >
          <LogoutOutlined /> Logout
        </Link>
      </Menu.Item>
    </Menu>
  );
  const notif = (
    <Menu>
      <Menu.Item key={0}>
        <Link
          to={"#"}
          style={{ fontSize: "inherit" }}
          // onClick={() => openNotification()}
        >
          no new notification
        </Link>
      </Menu.Item>
    </Menu>
  );
  return [
    <Header
      className="site-layout-background ant-layout-header-custom"
      style={{
        paddingRight: 0,
        paddingLeft: 0,
        border: "10px solid #348dff",
      }}
      key="0"
    >
      <div class="topnav">
        <Link to="/web-admin/" key="0">
          {settings && settings.logo != "" && settings.logo ? (
            <img src={settings.logo} style={{ height: "32px" }} />
          ) : null}
        </Link>
        <Link
          to="/web-admin/analytics"
          key="4"
          className={`${props.no.toString() == "6" ? "active" : ""}`}
        >
          <Space direction="vertical" size="0">
            <BarChartOutlined />
            <span className="nav-text">Analytics</span>
          </Space>
        </Link>
        <Link
          to="/web-admin/orders"
          key="1"
          className={`${props.no.toString() == "3" ? "active" : ""}`}
        >
          <Space direction="vertical" size="0">
            <InboxOutlined />
            <span className="nav-text">Orders</span>
          </Space>
        </Link>
        <Link
          to="/web-admin/products"
          key="2"
          className={`${props.no.toString() == "4" ? "active" : ""}`}
        >
          <Space direction="vertical" size="0">
            <TagOutlined />
            <span className="nav-text">Inventory</span>
          </Space>
        </Link>
        <Link
          to="/web-admin/stock_control"
          key="6"
          className={`${props.no.toString() == "2" ? "active" : ""}`}
        >
          <Space direction="vertical" size="0">
            <InboxOutlined />
            <span className="nav-text">Stock Control</span>
          </Space>
        </Link>
        <Link
          to="/web-admin/suppliers"
          key="8"
          className={`${props.no.toString() == "8" ? "active" : ""}`}
        >
          <Space direction="vertical" size="0">
            <TeamOutlined />
            <span className="nav-text">Suppliers</span>
          </Space>
        </Link>

        <Link
          to="/web-admin/customers"
          key="3"
          className={`${props.no.toString() == "5" ? "active" : ""}`}
        >
          <Space direction="vertical" size="0">
            <UserOutlined />
            <span className="nav-text">Customers</span>
          </Space>
        </Link>

        <Link
          to="/web-admin/reports"
          className={`${props.no.toString() == "14" ? "active" : ""}`}
        >
          <Space direction="vertical" size="0">
            <SolutionOutlined />
            <span className="nav-text">Reports</span>
          </Space>
        </Link>

        <Link
          to="/web-admin/messages"
          className={`${props.no.toString() == "12" ? "active" : ""}`}
        >
          <Space direction="vertical" size="0">
            <MessageOutlined />
            <span className="nav-text">Messages</span>
          </Space>
        </Link>
        {/* <Link
          to="/web-admin/email"
          className={`${props.no.toString() == "13" ? "active" : ""}`}
        >
          <Space direction="vertical" size="0">
            <MailOutlined />
            <span className="nav-text">Email</span>
          </Space>
        </Link> */}

        <Space size="0" style={{ height: "100%", float: "right" }}>
          <Link
            to="/web-admin/settings"
            key="9"
            className={`${props.no.toString() == "9" ? "active" : ""}`}
          >
            <Space direction="vertical" size="0">
              <SettingOutlined />
              <span className="nav-text">Settings</span>
            </Space>
          </Link>
          <Dropdown overlay={notif} trigger={["click"]}>
            <Button
              type="link"
              style={{
                textAlign: "left",
                float: "right",
                height: "100%",
                color: "black",
              }}
            >
              <Row gutter="20" align="middle">
                <Col span="6">
                  <Badge count={0}>
                    <BellFilled style={{ color: "#9d9d9d" }} />
                  </Badge>
                </Col>
              </Row>
            </Button>
          </Dropdown>

          <Link
            to="/web-admin/messages"
            style={{
              textAlign: "left",
              float: "right",
              height: "100%",
              color: "black",
            }}
          >
            <Row gutter="20" align="middle">
              <Col span="6">
                <Badge count={newmessage}>
                  <MessageFilled style={{ color: "#9d9d9d", height: "100%" }} />
                </Badge>
              </Col>
            </Row>
          </Link>

          <Dropdown overlay={menu} trigger={["click"]}>
            <Button
              type="link"
              style={{
                textAlign: "left",
                float: "right",
                height: "100%",
                color: "black",
              }}
            >
              <Row gutter="20">
                <Col span="24" align="middle" justify="center">
                  <Space>
                    <Avatar icon={<UserOutlined />} />
                    <Space direction="vertical" size="0">
                      {username}
                      <Text type="secondary">{position}</Text>
                    </Space>
                  </Space>
                </Col>
              </Row>
            </Button>
          </Dropdown>
        </Space>
      </div>
      <Modal
        title="Update Passowrd"
        visible={visibleEditCredential}
        onCancel={() => setvisibleEditCredential(false)}
        width={"50%"}
        footer={null}
      >
        <CredentialsAccount id={accountdata._id} />
      </Modal>
      <Modal
        title="Profile"
        visible={visibleEdit}
        onCancel={() => setVisibleEdit(false)}
        footer={null}
      >
        <Form
          form={form_edit_staff}
          {...formItemLayout}
          onFinish={handleFinishEdit}
        >
          <Form.Item name="value_name" label="Name">
            <Input placeholder={accountdata.name} />
          </Form.Item>

          <Form.Item name="value_email" label="E-mail">
            <Input placeholder={accountdata.email} />
          </Form.Item>
          <Form.Item name="value_birthday" label="Birhdate">
            <DatePicker
              onChange={onChangeEditBirthday}
              placeholder={accountdata.birthday}
            ></DatePicker>
          </Form.Item>
          <Form.Item name="value_address" label="Address">
            <Input placeholder={accountdata.address} />
          </Form.Item>
          <Form.Item name="value_username" label="Username">
            <Input placeholder={accountdata.username} />
          </Form.Item>
          <Form.Item
            name="password"
            label="Current Password"
            rules={[
              {
                required: true,
                message: "Please input password",
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Space>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Button onClick={handleCancelEdit}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Header>,
  ];
}

export default Head;
