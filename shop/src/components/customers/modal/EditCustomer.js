import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Radio,
  DatePicker,
  Button,
  Typography,
  Row,
  Col,
  message,
} from "antd";
import moment from "moment";
import axios from "axios";
import { api_base_url } from "../../../keys/index";
import { checkAuth } from "../../helper/authCheck";
const { Text } = Typography;
function EditCustomerModal({ data, visible, close, set_refresh_user_data }) {
  const [fname, setfname] = useState("");
  const [lname, setlname] = useState("");
  const [landmarks, setlandmark] = useState("");
  const [street, setstreet] = useState("");
  const [city, setcity] = useState("");
  const [country, setcountry] = useState("Philippines");
  const [postal, setpostal] = useState("");
  const [birthdate, setbirthdate] = useState("");
  const [email, setemail] = useState("");
  const [gender, setgender] = useState("");
  const [phone, setphone] = useState("");
  const [_id, set_id] = useState("");
  useEffect(() => {
    setfname(data[0].fname);
    setlname(data[0].lname);
    setlandmark(data[0].landmarks);
    setstreet(data[0].street);
    setcity(data[0].city);
    setcountry(data[0].country);
    setpostal(data[0].postal_code);
    setbirthdate(moment(data[0].birthdate));
    setemail(data[0].email);
    setgender(data[0].gender);
    setphone(data[0].phone);
    set_id(data[0]._id);
  }, [data]);
  const clear = () => {
    setfname("");
    setlname("");
    setlandmark("");
    setstreet("");
    setcity("");
    setcountry("Philippines");
    setpostal("");
    setbirthdate("");
    setemail("");
    setgender("");
    setphone("");
    set_id("");
    close();
  };
  const submitChanges = async () => {
    let emailcheck = 1;
    if (email != "") {
      console.log(email);
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      } else {
        emailcheck = 0;
      }
    }
    if (emailcheck == 1) {
      const headers = {
        "Content-Type": "application/json",
      };
      const response = await axios.post(
        api_base_url + "/update_account",
        {
          _id,
          fname,
          lname,
          landmarks,
          street,
          city,
          country,
          postal,
          birthdate,
          email,
          gender,
          phone,
        },
        { headers: headers }
      );
      const { message: response_message, status, data } = response.data;
      if (status === "OK") {
        message.success(response_message);
        localStorage.setItem(
          "landing_remembered_account",
          JSON.stringify(data)
        );
        set_refresh_user_data();
        close();
      } else {
        message.error(response_message);
      }
    } else {
      message.error("please check the provided email..");
    }
  };
  return [
    <>
      <Modal
        visible={visible}
        title="Edit Information"
        onOk={() => console.log("asd")}
        onCancel={() => clear()}
        footer={[
          <Button key="back" onClick={() => clear()}>
            Return
          </Button>,
          <Button key="submit" type="primary" onClick={() => submitChanges()}>
            Submit
          </Button>,
        ]}
      >
        <Row gutter={[16, 16]}>
          <Col span="12">
            <Text strong>First Name</Text>
            <Input
              value={fname}
              onPressEnter={() => {
                submitChanges();
              }}
              onChange={(event) => setfname(event.target.value)}
            />
          </Col>
          <Col span="12">
            <Text strong>Last Name</Text>
            <Input
              value={lname}
              onPressEnter={() => {
                submitChanges();
              }}
              onChange={(event) => setlname(event.target.value)}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span="12">
            <Text strong>Gender</Text>
            <Radio.Group
              style={{ width: "100%" }}
              onChange={(event) => setgender(event.target.value)}
              value={gender}
            >
              <Radio value={"Male"}>Male</Radio>
              <Radio value={"Female"}>Female</Radio>
            </Radio.Group>
          </Col>
          <Col span="12">
            <Text strong>Birthday</Text>
            <DatePicker
              style={{ width: "100%" }}
              value={birthdate}
              onPressEnter={() => {
                submitChanges();
              }}
              onChange={(event) => setbirthdate(event)}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span="24">
            <Text strong>Email</Text>
            <Input
              allowClear
              placeholder="Email.."
              value={email}
              onPressEnter={() => {
                submitChanges();
              }}
              onChange={(el) => {
                setemail(el.target.value);
              }}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span="24">
            <Text strong>Phone</Text>
            <Input
              allowClear
              onPressEnter={() => {
                submitChanges();
              }}
              placeholder="Phone.."
              value={phone}
              onChange={(el) => {
                setphone(el.target.value);
              }}
            />
          </Col>
        </Row>
        <Row gutter={[16, 2]}>
          <Col span="24">
            <Text strong>Address</Text>
          </Col>
        </Row>
        <Row gutter={[16, 2]}>
          <Col span="12">
            <Text type="secondary">Landmark</Text>
            <Input
              onPressEnter={() => {
                submitChanges();
              }}
              value={landmarks}
              onChange={(event) => setlandmark(event.target.value)}
            />
          </Col>
          <Col span="12">
            <Text type="secondary">Street</Text>
            <Input
              value={street}
              onPressEnter={() => {
                submitChanges();
              }}
              onChange={(event) => setstreet(event.target.value)}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span="8">
            <Text type="secondary">City</Text>
            <Input
              value={city}
              onPressEnter={() => {
                submitChanges();
              }}
              onChange={(event) => setcity(event.target.value)}
            />
          </Col>
          <Col span="8">
            <Text type="secondary">Country</Text>
            <Input
              value={country}
              onPressEnter={() => {
                submitChanges();
              }}
              onChange={(event) => setcountry(event.target.value)}
            />
          </Col>
          <Col span="8">
            <Text type="secondary">postal</Text>
            <Input
              value={postal}
              onPressEnter={() => {
                submitChanges();
              }}
              onChange={(event) => setpostal(event.target.value)}
            />
          </Col>
        </Row>
      </Modal>
    </>,
  ];
}
export default EditCustomerModal;
