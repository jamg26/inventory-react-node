import React, { useState } from "react";
import axios from "axios";
import { Button, Modal, Form, Input, Space, DatePicker } from "antd";
import { api_base_url, api_base_url_orders } from "../../../../keys/index";
import { UserAddOutlined } from "@ant-design/icons";
var monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
var day = new Date().getDate();
var month = monthNames[new Date().getMonth()];
var year = new Date().getFullYear();

function AddStaff() {
  const [visible, setVisible] = useState(false);
  const [dateBirthday, setBirthday] = useState("");
  const [dateToday, setDate] = useState("");
  const showModal = () => setVisible(true);

  const handleFinish = (values) => {
    const staff = {
      name: values.name,
      username: values.username,
      birthday: dateBirthday,
      address: values.address,
      position: values.position,
      password: values.password,
      email: values.email,
      action_log: "Staff was added at " + dateToday,
    };
    axios
      .post(api_base_url + "/staff/add", staff)
      .then((res) => console.log(res.data));

    setVisible(false);
  };
  const handleCancel = () => setVisible(false);

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

  function onChange(date, dateString) {
    setBirthday(dateString);
    setDate(day + "-" + month + "-" + year);
  }

  return (
    <div>
      <Space direction="vertical">
        <Button shape="round" type="primary" size="large" onClick={showModal}>
          <UserAddOutlined></UserAddOutlined>Add
        </Button>
      </Space>
      <Modal
        title="Add Staff"
        visible={visible}
        footer={[<Modal footer={null} />]}
      >
        <Form {...formItemLayout} onFinish={handleFinish}>
          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: "Please input full name",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="position"
            label="Position"
            rules={[
              {
                required: true,
                message: "Please input position",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                type: "email",
                message: "The input is invalid E-mail",
              },
              {
                required: true,
                message: "Please input E-mail",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="birthday"
            label="Birhdate"
            rules={[
              {
                required: true,
                message: "Please select birthdate",
              },
            ]}
          >
            <DatePicker onChange={onChange}></DatePicker>
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[
              {
                required: true,
                message: "Please input address",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="username"
            label="Username"
            rules={[
              {
                required: true,
                message: "Please input username",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
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
          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please input username",
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject("Password does not match!");
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Space>
              <Button type="primary" htmlType="submit">
                Register
              </Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
export default AddStaff;
