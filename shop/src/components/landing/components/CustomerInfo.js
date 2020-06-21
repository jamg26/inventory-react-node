import React, { useState, useEffect, useContext } from "react";
import ReactDOM from "react-dom";
import Customer from "../../admin/components/orders/customer";
import {
  Input,
  PageHeader,
  Typography,
  Card,
  Table,
  Tag,
  InputNumber,
  Button,
  Empty,
  Col,
  Row,
  message,
  Modal,
  Descriptions,
  Space,
  Checkbox,
  Radio,
} from "antd";
import axios from "axios";
import scriptLoader from "react-async-script-loader";
import {
  api_base_url_orders,
  sandbox,
  production,
  api_base_url,
} from "../../../keys/index";
import { SettingContext } from "../../../routes/routes";
import { withRouter, Link } from "react-router-dom";
const { Title, Text } = Typography;
function CustomerInfo({
  history,
  get_cart,
  cart,
  proceed,
  isScriptLoaded,
  isScriptLoadSucceed,
  loggedin = false,
}) {
  console.log("loggedin", loggedin);
  const setting_configuration = useContext(SettingContext);
  const guest_address = localStorage.getItem("guest_address");
  const [loading, setloading] = useState(true);
  const [showButtons, setshowButtons] = useState(false);
  const [paid, setpaid] = useState(false);
  const [fname, setfname] = useState("");
  const [lname, setlname] = useState("");
  const [company_name, setcompany_name] = useState("");
  const [landmarks, setlandmarks] = useState("");
  const [street, setstreet] = useState("");
  const [city, setcity] = useState("");
  const [country, setcountry] = useState("");
  const [postal_code, setpostal_code] = useState("");
  const [address, setaddress] = useState("");
  const [email, setemail] = useState("");
  const [phone, setphone] = useState("");
  const [amount, setamount] = useState(0);
  const [validfname, setvalidfname] = useState(true);
  const [validlname, setvalidlname] = useState(true);
  const [validaddress, setvalidaddress] = useState(true);
  const [validemail, setvalidemail] = useState(true);
  const [validphone, setvalidphone] = useState(true);

  const [create_account, setcreate_account] = useState(false);
  const [username_typevalid, setusername_typevalid] = useState(true);
  const [new_password, setnew_password] = useState(true);
  const [new_confirmpassword, setnew_confirmpassword] = useState(true);
  const [username_type, set_username_type] = useState("");
  const [
    create_account_new_password,
    set_create_account_new_password,
  ] = useState("");
  const [
    create_account_new_password_confirm,
    set_create_account_new_password_confirm,
  ] = useState("");
  useEffect(() => {
    if (cart != null) {
      setfname(cart ? cart.customer_info.fname : "");
      setlname(cart ? cart.customer_info.lname : "");
      setcompany_name(cart ? cart.customer_info.company_name : "");
      setlandmarks(
        cart.customer_info.landmarks != undefined
          ? cart.customer_info.landmarks
          : ""
      );
      setstreet(
        cart.customer_info.street != undefined ? cart.customer_info.street : ""
      );
      setcity(
        cart.customer_info.city != undefined ? cart.customer_info.city : ""
      );
      setcountry(
        cart.customer_info.country != undefined
          ? cart.customer_info.country
          : ""
      );
      setpostal_code(
        cart.customer_info.postal_code != undefined
          ? cart.customer_info.postal_code
          : ""
      );
      console.log(
        "cart.customer_info.address",
        cart.customer_info.address,
        guest_address
      );
      setaddress(
        cart
          ? cart.customer_info.address != undefined &&
            cart.customer_info.address != "" &&
            cart.customer_info.address != null
            ? cart.customer_info.address
            : guest_address
          : guest_address
      );
      setemail(cart ? cart.customer_info.email : "");
      setphone(cart ? cart.customer_info.phone : "");
    }
  }, [cart]);
  const radioStyle = {
    display: "block",
    height: "30px",
    lineHeight: "30px",
  };
  console.log("new_password", validemail, email);
  console.log(
    "create_account",
    create_account,
    username_type,
    create_account_new_password,
    create_account_new_password_confirm
  );
  const saveContactInfo = async () => {
    let validfname = true;
    let validlname = true;
    let validaddress = true;
    let validemail = true;
    let validphone = true;
    if (fname == "" || fname == undefined) {
      setvalidfname(false);
      validfname = false;
    } else {
      setvalidfname(true);
      validfname = true;
    }
    if (lname == "" || lname == undefined) {
      setvalidlname(false);
      validlname = false;
    } else {
      setvalidlname(true);
      validlname = true;
      console.log(address);
    }
    if (address == "" || address == undefined) {
      setvalidaddress(false);
      validaddress = false;
    } else {
      setvalidaddress(true);
      validaddress = true;
    }
    if (email == "" || email == undefined) {
      setvalidemail(false);
      validemail = false;
    } else {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        console.log("valid email");
        setvalidemail(true);
        validemail = true;
      } else {
        console.log("invalid email");
        setvalidemail(false);
        validemail = false;
      }
    }

    if (phone == "" || phone == undefined) {
      console.log("invalid phone");
      setvalidphone(false);
      validphone = false;
    } else {
      console.log("valid phone");
      setvalidphone(true);
      validphone = true;
    }

    let username_typevalid = true;
    let new_password = true;
    let new_confirmpassword = true;
    let matchpassword = false;
    if (create_account) {
      console.log("creating account");
      if (username_type == "") {
        setusername_typevalid(false);
        username_typevalid = false;
      } else {
        setusername_typevalid(true);
        username_typevalid = true;
      }
      if (create_account_new_password == "") {
        setnew_password(false);
        new_password = false;
      } else {
        setnew_password(true);
        new_password = true;
      }
      if (create_account_new_password_confirm == "") {
        setnew_confirmpassword(false);
        new_confirmpassword = false;
      } else {
        setnew_confirmpassword(true);
        new_confirmpassword = true;
      }
      if (new_password && new_confirmpassword) {
        if (
          create_account_new_password == create_account_new_password_confirm
        ) {
          matchpassword = true;
          setnew_password(true);
          new_password = true;
          setnew_confirmpassword(true);
          new_confirmpassword = true;
        } else {
          matchpassword = false;
          setnew_password(false);
          new_password = false;
          setnew_confirmpassword(false);
          new_confirmpassword = false;
        }
      }

      if (
        validfname &&
        validlname &&
        validaddress &&
        validemail &&
        validphone &&
        username_typevalid &&
        new_password &&
        new_confirmpassword &&
        matchpassword
      ) {
        let guest_cart_id = localStorage.getItem("guest_cart_id");
        const headers = {
          "Content-Type": "application/json",
        };
        const response = await axios
          .post(
            api_base_url + "/signup_from_guest",
            {
              _id: guest_cart_id,
              email: email,
              firstname: fname,
              lastname: lname,
              username: username_type == "Mobile" ? phone : email,
              password: create_account_new_password,
            },
            { headers: headers }
          )
          .then(async (result) => {
            if (result.data.message == "OK") {
              const user_data = result.data.user;
              console.log("user_data", user_data, JSON.stringify(user_data));
              const serializeState = JSON.stringify(user_data);
              message.success("User successfully registered");
              message.info("Processing Cart...");
              try {
                setTimeout(() => {
                  localStorage.setItem("landing_remember_account", true);
                  localStorage.setItem(
                    "landing_remembered_account",
                    JSON.stringify(user_data)
                  );
                  localStorage.setItem(
                    "landing_credentials",
                    JSON.stringify(user_data)
                  );
                  localStorage.removeItem("guest_cart_id");
                }, 1000);
              } catch (error) {
              } finally {
                setTimeout(async () => {
                  const headers = {
                    "Content-Type": "application/json",
                  };
                  let landing_customer_login_token = localStorage.getItem(
                    "landing_customer_login_token"
                  );
                  const response = await axios
                    .post(
                      api_base_url_orders + "/update_cart_contact_info",
                      {
                        order_id: cart._id,
                        fname,
                        lname,
                        company_name,
                        address,
                        email,
                        phone,
                        login_token: landing_customer_login_token,
                      },
                      { headers: headers }
                    )
                    .then((response) => {
                      history.push({
                        pathname: "/payment",
                        state: { cart: response.data.cart },
                      });
                      // setshowButtons(true);
                    })
                    .catch((err) => {
                      message.err(
                        "something went wrong please try again later.."
                      );
                    });
                }, 1000);
              }
            } else {
              set_create_account_new_password("");
              set_create_account_new_password_confirm("");
              message.error(response.data.message);
            }
          })
          .catch((err) => {
            console.log(err);
            message.error("something went wrong..please try again later");
          });
      } else {
      }
    } else {
      if (
        validfname &&
        validlname &&
        validaddress &&
        validemail &&
        validphone
      ) {
        const headers = {
          "Content-Type": "application/json",
        };
        let landing_customer_login_token = localStorage.getItem(
          "landing_customer_login_token"
        );
        const response = await axios
          .post(
            api_base_url_orders + "/update_cart_contact_info",
            {
              order_id: cart._id,
              fname,
              lname,
              company_name,
              address,
              email,
              phone,
              login_token: landing_customer_login_token,
            },
            { headers: headers }
          )
          .then((response) => {
            history.push({
              pathname: "/payment",
              state: { cart: response.data.cart },
            });
            // setshowButtons(true);
          })
          .catch((err) => {
            message.err("something went wrong please try again later..");
          });
      } else {
      }
    }
  };
  let amou = 0;
  if (cart) {
    for (let c = 0; c < cart.line_item.length; c++) {
      amou =
        parseFloat(amou) +
        parseFloat(cart.line_item[c].total) +
        parseFloat(
          cart.delivery_method == "Standard Delivery"
            ? 350
            : cart.delivery_method == "Exclusive Delivery"
            ? 500
            : 0
        );
    }
    // setamount(amou);
  }
  console.log(
    "falsification",
    validfname,
    validlname,
    validaddress,
    validemail,
    validphone,
    new_password,
    new_confirmpassword,
    username_typevalid
  );
  useEffect(() => {
    document
      .getElementById("ResidentialView")
      .scrollIntoView({ behavior: "smooth" });
  }, []);
  return [
    cart == null ? null : (
      <Card id="ResidentialView">
        <Row gutter={[16, 16]}>
          <Col span="24">
            <Space align="center">
              <Title level={4} style={{ color: "#2790ff" }}>
                Contact Details and Delivery Address
              </Title>
              {validfname &&
              validlname &&
              validaddress &&
              validemail &&
              validphone &&
              new_password &&
              new_confirmpassword &&
              username_typevalid ? null : (
                <Title
                  style={{
                    fontSize: "14px",
                    color: "red",
                    fontWeight: "unset",
                  }}
                >
                  (Please provide information in the required{" "}
                  {parseFloat(validfname ? 0 : 1) +
                    parseFloat(validlname ? 0 : 1) +
                    parseFloat(validaddress ? 0 : 1) +
                    parseFloat(validemail ? 0 : 1) +
                    parseFloat(validphone ? 0 : 1) +
                    parseFloat(new_password ? 0 : 1) +
                    parseFloat(new_confirmpassword ? 0 : 1) +
                    parseFloat(username_typevalid ? 0 : 1) >
                  1
                    ? "boxes"
                    : "box"}
                  .)
                </Title>
              )}
            </Space>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span="24">
            <Row gutter={[16, 16]}>
              <Col span="8">
                <p style={{ marginBottom: "2px" }}>
                  First Name <span style={{ color: "red" }}>*</span>
                </p>
                <Input
                  value={fname}
                  disabled={proceed}
                  className={`${validfname ? "valid_input" : "invalid_input"}`}
                  onChange={(event) => setfname(event.target.value)}
                />
              </Col>
              <Col span="8">
                <p style={{ marginBottom: "2px" }}>
                  Last Name <span style={{ color: "red" }}>*</span>
                </p>
                <Input
                  value={lname}
                  className={`${validlname ? "valid_input" : "invalid_input"}`}
                  disabled={proceed}
                  onChange={(event) => setlname(event.target.value)}
                />
              </Col>
              <Col span="8">
                <p style={{ marginBottom: "2px" }}>Company Name (Optional)</p>
                <Input
                  value={company_name}
                  disabled={proceed}
                  onChange={(event) => setcompany_name(event.target.value)}
                />
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span="8">
                <p style={{ marginBottom: "2px" }}>
                  Street Address <span style={{ color: "red" }}>*</span>
                </p>
                <Input
                  disabled={proceed}
                  className={`${
                    validaddress ? "valid_input" : "invalid_input"
                  }`}
                  onChange={(event) => setaddress(event.target.value)}
                  value={address != "" ? address : undefined}
                  defaultValue={
                    cart
                      ? guest_address
                        ? guest_address
                        : `${
                            cart.customer_info.landmarks != undefined
                              ? cart.customer_info.landmarks
                              : ""
                          } ${
                            cart.customer_info.street != undefined
                              ? cart.customer_info.street
                              : ""
                          } ${
                            cart.customer_info.city ||
                            cart.customer_info.country ||
                            cart.customer_info.postal_code
                              ? ","
                              : ""
                          } ${
                            cart.customer_info.city != undefined
                              ? cart.customer_info.city
                              : ""
                          } ${
                            cart.customer_info.country != undefined
                              ? cart.customer_info.country
                              : ""
                          } ${
                            cart.customer_info.postal_code != undefined
                              ? cart.customer_info.postal_code
                              : ""
                          }`
                      : guest_address
                  }
                />
              </Col>
              <Col span="8">
                <p style={{ marginBottom: "2px" }}>
                  Email <span style={{ color: "red" }}>*</span>
                </p>
                <Input
                  value={email}
                  className={`${validemail ? "valid_input" : "invalid_input"}`}
                  disabled={proceed}
                  onChange={(event) => setemail(event.target.value)}
                />
              </Col>
              <Col span="8">
                <p style={{ marginBottom: "2px" }}>
                  Mobile No. <span style={{ color: "red" }}>*</span>
                </p>
                <Input
                  value={phone}
                  className={`${validphone ? "valid_input" : "invalid_input"}`}
                  disabled={proceed}
                  onChange={(event) => setphone(event.target.value)}
                />
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span="5">
                {loggedin ? null : (
                  <Space direction="vertical">
                    <Checkbox
                      onChange={(e) => {
                        setcreate_account(e.target.checked);
                        if (e.target.checked) {
                        } else {
                          setnew_password(false);
                          setnew_confirmpassword(false);
                          set_username_type(false);
                        }
                      }}
                      checked={create_account}
                    >
                      {"Create an account?"}
                    </Checkbox>
                    <div style={{ paddingLeft: "20px" }}>
                      <Space size="0" direction="vertical">
                        <Text>Having an account will help you track</Text>
                        <Text>your orders and see your order history</Text>
                      </Space>

                      <br />
                      <br />
                      <Space size="0" direction="vertical">
                        <Text>By clicking "SIGN UP", I agree to</Text>
                        <Text>
                          Smart Supermarket's{" "}
                          <a href="#" target="_blank">
                            Terms of Use
                          </a>{" "}
                          and
                        </Text>
                        <Text>
                          <a href="#" target="_blank">
                            Privacy Policy
                          </a>
                        </Text>
                      </Space>
                    </div>
                  </Space>
                )}
              </Col>
              <Col span="3">
                {create_account ? (
                  <>
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <Text>
                        Create Account Using:{" "}
                        <span style={{ color: "red" }}>*</span>
                      </Text>

                      <Radio.Group
                        className={`${
                          username_typevalid ? "valid_input" : "invalid_input"
                        }`}
                        onChange={(e) => {
                          set_username_type(e.target.value);
                        }}
                        value={username_type}
                      >
                        <Radio style={radioStyle} value={"Mobile"}>
                          Mobile No.
                        </Radio>
                        <Radio style={radioStyle} value={"Email"}>
                          Email Address
                        </Radio>
                      </Radio.Group>
                    </Space>
                  </>
                ) : null}
              </Col>
              <Col span="8">
                {create_account ? (
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Space
                      direction="vertical"
                      size="0"
                      style={{ width: "100%" }}
                    >
                      <Text>
                        Create Account Password{" "}
                        <span style={{ color: "red" }}>*</span>
                      </Text>
                      <Input.Password
                        className={`${
                          new_password ? "valid_input" : "invalid_input"
                        }`}
                        value={create_account_new_password}
                        onChange={(e) => {
                          set_create_account_new_password(e.target.value);
                        }}
                      />
                    </Space>
                    <Space
                      direction="vertical"
                      size="0"
                      style={{ width: "100%" }}
                    >
                      <Text>
                        Confirm Password <span style={{ color: "red" }}>*</span>
                      </Text>
                      <Input.Password
                        className={`${
                          new_confirmpassword ? "valid_input" : "invalid_input"
                        }`}
                        value={create_account_new_password_confirm}
                        onChange={(e) => {
                          set_create_account_new_password_confirm(
                            e.target.value
                          );
                        }}
                      />
                    </Space>
                  </Space>
                ) : null}
              </Col>
              <Col span="8" style={{ verticalAlign: "bottom" }}>
                <table style={{ width: "100%", height: "100%" }}>
                  <tbody>
                    <tr>
                      <td
                        style={{
                          verticalAlign: "bottom",
                          textAlign: "right",
                        }}
                      >
                        {!showButtons ? (
                          <Button
                            className="ant-btn-success-custom"
                            disabled={proceed}
                            onClick={() => {
                              saveContactInfo();
                            }}
                          >
                            Proceed to Payment
                          </Button>
                        ) : null}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Col>
            </Row>
            <Modal
              centered
              title="Payment Section"
              visible={showButtons}
              onCancel={() => setshowButtons(false)}
              footer={null}
            ></Modal>
          </Col>
        </Row>
      </Card>
    ),
  ];
}
export default withRouter(CustomerInfo);
