import React, { useState, useEffect } from "react";
import { Table, Input, Tabs, message, Card, Button } from "antd";
import axios from "axios";
import { api_base_url } from "../../../../keys";
import { withRouter } from "react-router-dom";
function AccountCredentials(props) {
  const [current_password, set_current_password] = useState("");
  const [new_password, set_new_password] = useState("");
  const [confirm_password, set_confirm_password] = useState("");
  const submitPasswordChange = async () => {
    if (current_password == "") {
      message.error("Please provide Current Password");
    } else {
      if (new_password == "") {
        message.error("Please provide New Password");
      } else {
        if (confirm_password == "") {
          message.error("Please provide Confirm Password");
        } else {
          if (new_password != confirm_password) {
            message.error("New Password does not match with Comfirm Password");
          } else {
            const headers = {
              "Content-Type": "application/json",
            };
            const response = await axios.post(
              api_base_url + "/profile/update_account_password",
              {
                _id: props.id,
                current_password,
                new_password,
              },
              { headers: headers }
            );
            set_current_password("");
            set_new_password("");
            set_confirm_password("");
            if (response.data.status === "OK") {
              message.success(response.data.message);
              message.info(
                "Please Re-Authenticate your account by loggin in again"
              );
              localStorage.setItem("landing_remember_account", false);
              localStorage.setItem("landing_remembered_account", "");
              localStorage.setItem("landing_credentials", "");
              props.history.push("/web-admin");
            } else {
              message.error(response.data.message);
            }
          }
        }
      }
    }
  };
  const columns = [
    {
      title: "Current Password",
      dataIndex: "a",
      key: "a",
      render: () => {
        return [
          <Input.Password
            onPressEnter={() => {
              submitPasswordChange();
            }}
            value={current_password}
            onChange={(event) => set_current_password(event.target.value)}
            placeholder="Input Current Password"
          />,
        ];
      },
    },
    {
      title: "New Password",
      dataIndex: "b",
      key: "b",
      render: () => {
        return [
          <Input.Password
            value={new_password}
            onPressEnter={() => {
              submitPasswordChange();
            }}
            onChange={(event) => set_new_password(event.target.value)}
            placeholder="Input New Password"
          />,
        ];
      },
    },
    {
      title: "Confirm New Password",
      dataIndex: "c",
      key: "c",
      render: () => {
        return [
          <Input.Password
            onPressEnter={() => {
              submitPasswordChange();
            }}
            value={confirm_password}
            onChange={(event) => set_confirm_password(event.target.value)}
            placeholder="Input Confirm Password"
          />,
        ];
      },
    },
    {
      title: "Action",
      dataIndex: "d",
      key: "d",
      align: "center",
      render: () => {
        return [
          <Button type="primary" onClick={() => submitPasswordChange()}>
            Submit
          </Button>,
        ];
      },
    },
  ];
  return [
    <>
      <Card style={{ width: "100%" }}>
        <Table
          rowKey={(resource) => resource._id}
          dataSource={[{ _id: "0", a: "", b: "", c: "", d: "" }]}
          columns={columns}
          pagination={false}
          size="small"
        />
      </Card>
    </>,
  ];
}

export default withRouter(AccountCredentials);
