import React, { useState, useEffect } from "react";
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
} from "antd";
import axios from "axios";
import scriptLoader from "react-async-script-loader";
import { api_base_url_orders } from "../../../keys/index";
const CLIENT = {
  sandbox:
    "AdD0UPAaMrRGbG7M-v-O-V1PauKeQSdZ2fhJtuXTYORM-573Byv2YxwGfKQZcyJhEE6Bi3RalwRwrDqk",
  production:
    "ATnwSeIeaje0vM9uaAEDvDszZfY2L5C8bTZg5G3cna3adTrqD-5WZIKsxoQc3WEvxXLhqcTQ_Zhjiav7",
};

const CLIENT_ID =
  process.env.NODE_ENV === "production" ? CLIENT.production : CLIENT.sandbox;
let PayPalButton = null;
function CustomerInfo({
  get_cart,
  cart,
  proceed,
  isScriptLoaded,
  isScriptLoadSucceed,
}) {
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
  useEffect(() => {
    console.log(isScriptLoaded, isScriptLoadSucceed);
    if (isScriptLoaded && isScriptLoadSucceed) {
      PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });
      setloading(false);
    }
  }, [isScriptLoaded, isScriptLoadSucceed]);

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
      setaddress(cart ? cart.customer_info.address : "");
      setemail(cart ? cart.customer_info.email : "");
      setphone(cart ? cart.customer_info.phone : "");
    }
  }, [cart]);
  const saveContactInfo = async () => {
    if (fname == "") {
      message.error("Please Provide your first name");
    } else {
      if (lname == "") {
        message.error("Please Provide your last name");
      } else {
        if (address == "") {
          message.error("Please Provide your address");
        } else {
          if (email == "") {
            message.error("Please Provide your email");
          } else {
            if (phone == "") {
              message.error("Please Provide your phone number");
            } else {
              const headers = {
                "Content-Type": "application/json",
              };
              let landing_customer_login_token = localStorage.getItem(
                "landing_customer_login_token"
              );
              const response = await axios.post(
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
              );

              setshowButtons(true);
            }
          }
        }
      }
    }
  };
  let amou = 0;
  if (cart) {
    for (let c = 0; c < cart.line_item.length; c++) {
      console.log(cart.delivery_method);
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
    console.log(amou);
  }
  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          description: +"Mercedes G-Wagon",
          amount: {
            currency_code: "PHP",
            value: amou,
          },
        },
      ],
    });
  };
  const handleApproveOrder = async (details) => {
    console.log("payment dfetail", details);
    console.log("cart_id", cart._id);
    console.log("amount", amou);
    const headers = {
      "Content-Type": "application/json",
    };
    let landing_customer_login_token = localStorage.getItem(
      "landing_customer_login_token"
    );
    const response = await axios.post(
      api_base_url_orders + "/add_cart_to_order",
      {
        order_id: cart._id,
        details: details,
        amou: amou,
        login_token: landing_customer_login_token,
      },
      { headers: headers }
    );
    get_cart();
    console.log("getting cart");
    window.location.reload();
  };
  const onApprove = (data, actions) => {
    actions.order.capture().then((details) => {
      const paymentData = {
        payerID: data.payerID,
        orderID: data.orderID,
      };
      // console.log("Payment Approved: ", details, data, actions);
      if (details.status === "COMPLETED") {
        handleApproveOrder(details);
      }

      setshowButtons(false);
      setpaid(true);
    });
  };
  return [
    cart == null ? null : (
      <Card id="ResidentialView">
        <Row gutter={[16, 16]}>
          <Col span="24">
            <Row gutter={[16, 16]}>
              <Col span="12">
                <p style={{ marginBottom: "2px" }}>First Name</p>
                <Input
                  value={fname}
                  disabled={proceed}
                  onChange={(event) => setfname(event.target.value)}
                />
              </Col>
              <Col span="12">
                <p style={{ marginBottom: "2px" }}>Last Name</p>
                <Input
                  value={lname}
                  disabled={proceed}
                  onChange={(event) => setlname(event.target.value)}
                />
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span="24">
                <p style={{ marginBottom: "2px" }}>Company Name (Optional)</p>
                <Input
                  value={company_name}
                  disabled={proceed}
                  onChange={(event) => setcompany_name(event.target.value)}
                />
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span="24">
                <p style={{ marginBottom: "2px" }}>Street Address</p>
                <Input
                  disabled={proceed}
                  onChange={(event) => setaddress(event.target.value)}
                  value={address != "" ? address : undefined}
                  defaultValue={
                    cart
                      ? `${
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
                      : ""
                  }
                />
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span="12">
                <p style={{ marginBottom: "2px" }}>Email</p>
                <Input
                  value={email}
                  disabled={proceed}
                  onChange={(event) => setemail(event.target.value)}
                />
              </Col>
              <Col span="12">
                <p style={{ marginBottom: "2px" }}>Mobile No./Phone No.</p>
                <Input
                  value={phone}
                  disabled={proceed}
                  onChange={(event) => setphone(event.target.value)}
                />
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span="18">
                <Modal
                  title="Payment Section"
                  visible={showButtons}
                  onCancel={() => setshowButtons(false)}
                  footer={null}
                >
                  {showButtons && !proceed ? (
                    <PayPalButton
                      style={{ display: "none" }}
                      createOrder={(data, actions) =>
                        createOrder(data, actions)
                      }
                      onApprove={(data, actions) => onApprove(data, actions)}
                    />
                  ) : null}
                </Modal>
              </Col>
              <Col span="6">
                <div style={{ textAlign: "right", marginTop: "15px" }}>
                  {!showButtons ? (
                    <Button
                      type="primary"
                      disabled={proceed}
                      onClick={() => {
                        saveContactInfo();
                      }}
                    >
                      Proceed to Payment
                    </Button>
                  ) : null}
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    ),
  ];
}
export default scriptLoader(
  `https://www.paypal.com/sdk/js?currency=PHP&client-id=${CLIENT_ID}`
  // `https://www.paypal.com/sdk/js?client-id=${CLIENT_ID}`
)(CustomerInfo);
