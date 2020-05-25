import React, { useState, useEffect } from "react";
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
} from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  NotificationOutlined,
  BellOutlined,
  LockOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { api_base_url } from "../../../keys/index";
import { Link } from "react-router-dom";
import CredentialsAccount from "./section/accountCredentials";
const { Header } = Layout;
const { Text } = Typography;
function Head() {
  const [username, setUserName] = useState("");
  const [position, setposition] = useState("");
  const [accountdata, setaccountdata] = useState({});
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [visibleEditCredential, setvisibleEditCredential] = useState(false);

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
          to={""}
          style={{ fontSize: "inherit" }}
          onClick={() => openNotification()}
        >
          Sample Notification 1
        </Link>
      </Menu.Item>

      <Menu.Item key={1}>
        <Link
          to={""}
          style={{ fontSize: "inherit" }}
          onClick={() => openNotification()}
        >
          Sample Notification 2
        </Link>
      </Menu.Item>
    </Menu>
  );
  return [
    <Header
      className="site-layout-background"
      style={{ paddingRight: "10px", paddingLeft: "10px" }}
      key="0"
    >
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
            <Col span="6" align="middle" justify="center">
              <UserOutlined style={{ height: "100%" }} className="center-svg" />
            </Col>

            <Col span="18">
              {username}
              <br></br> <Text type="secondary">{position}</Text>
            </Col>
          </Row>
        </Button>
      </Dropdown>
      <Dropdown overlay={notif} trigger={["click"]}>
        <Button
          type="link"
          style={{ float: "right", height: "100%", color: "black" }}
        >
          <Badge count={99} dot>
            <BellOutlined />
          </Badge>
        </Button>
      </Dropdown>
    </Header>,
  ];
}

export default Head;
