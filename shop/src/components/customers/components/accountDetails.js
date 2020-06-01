import React, { useState, useEffect, useContext } from "react";
import moment from "moment";
import { Table, Input, Tabs, PageHeader, Card, Button } from "antd";
import EditCustomerModal from "../modal/EditCustomer";
import { UserContext, SettingContext } from "../../../routes/routes";
function AccountDetails(props) {
  var settings = useContext(SettingContext);
  const [visible, setVisible] = useState(false);
  const [refresh_user_data, set_refresh_user_data] = useState(false);
  const [data, setData] = useState([
    {
      _id: "",
      fname: "",
      lname: "",
      landmarks: "",
      street: "",
      city: "",
      country: "",
      postal_code: "",
      address: "",
      birthdate: "",
      gender: "",
      phone: "",
      email: "",
      h: "",
    },
  ]);
  useEffect(() => {
    let account = localStorage.getItem("landing_remembered_account");
    if (account === null || account == "") {
      account = undefined;
    }
    if (account === undefined) {
    } else {
      const data = JSON.parse(account);
      let comma = "";
      if (data.city || data.country || data.postal_code) {
        comma = ",";
      }
      console.log(data);
      setData([
        {
          _id: data._id,
          fname: data.fname,
          lname: data.lname,
          landmarks: data.landmarks,
          street: data.street,
          city: data.city,
          country: data.country,
          postal_code: data.postal_code,
          address: `${data.landmarks != undefined ? data.landmarks : ""} ${
            data.street != undefined ? data.street : ""
          } ${comma} ${data.city != undefined ? data.city : ""} ${
            data.country != undefined ? data.country : ""
          } ${data.postal_code != undefined ? data.postal_code : ""}`,
          birthdate: data.birthdate
            ? moment(data.birthdate).format(
                settings != undefined ? settings.date_format : "MM-DD-YYYY"
              )
            : "",
          gender: data.gender,
          phone: data.phone,
          email: data.email,
          h: "",
        },
      ]);
    }
  }, [refresh_user_data]);
  const columns = [
    {
      title: "First Name",
      dataIndex: "fname",
      key: "fname",
      width: "12%",
    },
    {
      title: "Last Name",
      dataIndex: "lname",
      key: "lname",
      width: "12%",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: "12%",
    },
    {
      title: "Birthday",
      dataIndex: "birthdate",
      key: "birthdate",
      width: "12%",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      width: "12%",
    },
    {
      title: "Mobile No.",
      dataIndex: "phone",
      key: "phone",
      width: "12%",
    },
    {
      title: "Email Address",
      dataIndex: "email",
      key: "email",
      width: "12%",
    },
    {
      title: "Action",
      dataIndex: "h",
      key: "h",
      width: "12%",
      align: "center",
      render: () => {
        return [
          <Button onClick={() => setVisible(true)} type="link">
            Edit
          </Button>,
        ];
      },
    },
  ];
  return [
    <>
      <Card>
        <Table
          rowKey={(resource) => resource._id}
          dataSource={data}
          columns={columns}
          pagination={false}
          size="small"
        />
      </Card>
      <EditCustomerModal
        setrecheckauth={props.setrecheckauth}
        set_refresh_user_data={() => set_refresh_user_data(!refresh_user_data)}
        data={data}
        visible={visible}
        close={() => setVisible(false)}
      />
    </>,
  ];
}

export default AccountDetails;
