import React, { useState, useEffect } from "react";
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
  Radio,
  Space,
  Descriptions,
} from "antd";
import axios from "axios";
import moment from "moment";
import numeral, { set } from "numeral";
import { DeleteOutlined } from "@ant-design/icons";
import PreviewImage from "../../global-components/previewImageModal";
import CustomerInfo from "./CustomerInfo";
import { api_base_url_orders } from "../../../keys/index";
const { Search } = Input;
const { Text, Title } = Typography;
const { TextArea } = Input;
const Cart = ({ refreshCart, show, get_cart, setCart, cart, loggedin }) => {
  console.log("cart loggedin", loggedin);
  const [visible, setVisible] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [productTitle, setProductTitle] = useState("");
  const [cartrow, setCartrow] = useState([]);
  const [deliveryMethod, setDeliveryMethod] = useState("Standard Delivery");
  const [excl, setExcl] = useState(false);
  const [proceed, setProceed] = useState(false);
  const [proceedtoDetail, setProceedtoDetail] = useState(true);
  const [customerNote, setCustomerNote] = useState("");
  const [subtotal, setsubtotoal] = useState(0);
  const radioStyle = {
    display: "block",
    height: "30px",
    lineHeight: "30px",
  };
  const imageModal = (src, name) => {
    setVisible(true);
    setImgSrc(src);
    setProductTitle(name);
  };
  const resetImageModal = () => {
    setVisible(false);
    setProductTitle("");
  };
  useEffect(() => {
    if (excl) {
      setDeliveryMethod("Exlusive Delivery");
    } else {
      setDeliveryMethod("Standard Delivery");
    }
  }, [excl]);

  useEffect(() => {
    if (cart != null) {
      setProceed(true);
      const filteredcart = [];
      let sub = 0;
      for (let x = 0; x < cart.line_item.length; x++) {
        let node = cart.line_item[x];
        if (node.product_type == "Product" || node.product_type == undefined) {
          let category =
            node.product.length != 0 && node.product[0].product_type.length != 0
              ? node.product[0].product_type[0].product_type_name
              : "No Category";
          if (
            category.toLowerCase() == "meat" ||
            category.toLowerCase() == "meats"
          ) {
            setExcl(true);
          }
          let taggg =
            node.product.length != 0 &&
            node.product[0].product_tags != undefined
              ? node.product[0].product_tags.map((d) => {
                  return [d.tag_label];
                })
              : [];
          for (let c = 0; c < taggg.length; c++) {
            if (
              taggg[c][0].toLowerCase() == "meat" ||
              taggg[c][0].toLowerCase() == "meats"
            ) {
              setExcl(true);
              break;
            }
          }
          let image =
            node.product &&
            node.product.length != 0 &&
            node.product[0].length != 0 &&
            node.product[0].variants &&
            node.product[0].variants.length != 0 &&
            node.product[0].variants[0].length != 0
              ? node.product[0].variants[0].images != "" &&
                node.product[0].variants[0].images != undefined &&
                node.product[0].variants[0].images != null
                ? node.product[0].variants[0].images
                : null
              : null;
          let price =
            node.product.length != 0 && node.product[0].variants.length != 0
              ? node.product[0].variants[0].price
              : 0;
          let quantity = node.quantity_max;
          filteredcart.push({
            key: x,
            type: node.product_type,
            order_id: cart._id,
            product_id: node.product.length != 0 ? node.product[0]._id : "",
            item_id: node._id,
            product_name:
              node.product.length != 0 ? node.product[0].product_name : "",
            product_description:
              node.product.length != 0
                ? node.product[0].product_description
                : "",
            tags: (
              <>
                {node.product.length != 0 &&
                node.product[0].product_tags != undefined
                  ? node.product[0].product_tags.map((d, inss) => {
                      if (
                        node.product[0].product_tags.length ==
                        parseFloat(inss) + parseFloat(1)
                      ) {
                        return [d.tag_label];
                      } else {
                        return [d.tag_label + ", "];
                      }
                    })
                  : null}
              </>
            ),
            tag_list:
              node.product.length != 0 &&
              node.product[0].product_tags != undefined
                ? node.product[0].product_tags.map((d) => {
                    return [d.tag_label];
                  })
                : [],
            product_variant_id: node.variant_id,
            product_type: category,
            brand:
              node.product.length != 0 && node.product[0].variants.length != 0
                ? node.product[0].variants[0].brand
                : "No Brand",
            size:
              node.product.length != 0 && node.product[0].variants.length != 0
                ? node.product[0].variants[0].size
                : "No Size",
            color:
              node.product.length != 0 && node.product[0].variants.length != 0
                ? node.product[0].variants[0].color
                : "No Color",
            weight:
              node.product.length != 0 && node.product[0].variants.length != 0
                ? node.product[0].variants[0].weight
                : "No Weight",
            stock: parseFloat(quantity) < 1 ? "Out of Stock" : "In Stock",
            image:
              image != null ? (
                <img
                  style={{
                    width: "100%",
                    cursor: "pointer",
                    margin: "0 auto",
                  }}
                  src={image}
                />
              ) : (
                <Empty
                  description={false}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ),

            price: numeral(price).format("0,0.00"),
            price_raw: price,
            quantity: quantity,
            initial_quantity: node.quantity,
            sub_total: numeral(node.quantity * price).format("0,0.00"),
            actionData: node._id,
          });
          sub = parseFloat(sub) + parseFloat(node.quantity) * parseFloat(price);
        } else {
          let category =
            node.bundle.length != 0 &&
            node.bundle[0].product_type != null &&
            node.bundle[0].product_type.length != 0
              ? node.bundle[0].product_type[0].product_type_name
              : "No Category";
          if (
            category.toLowerCase() == "meat" ||
            category.toLowerCase() == "meats"
          ) {
            setExcl(true);
          }
          let taggg =
            node.bundle.length != 0 && node.bundle[0].product_tags != undefined
              ? node.bundle[0].product_tags.map((d) => {
                  return [d.tag_label];
                })
              : [];
          for (let c = 0; c < taggg.length; c++) {
            if (
              taggg[c][0].toLowerCase() == "meat" ||
              taggg[c][0].toLowerCase() == "meats"
            ) {
              setExcl(true);
              break;
            }
          }
          let image =
            node.bundle[0].length != 0
              ? node.bundle[0].image != "" &&
                node.bundle[0].image != undefined &&
                node.bundle[0].image != null
                ? node.bundle[0].image
                : null
              : null;
          let price = node.bundle.length != 0 ? node.bundle[0].bundle_price : 0;
          let quantity = node.quantity_max;
          filteredcart.push({
            key: x,
            type: node.product_type,
            order_id: cart._id,
            product_id: node.bundle.length != 0 ? node.bundle[0]._id : "",
            item_id: node._id,
            product_name: node.bundle.length != 0 ? node.bundle[0].name : "",
            product_description:
              node.bundle.length != 0 ? node.bundle[0].description : "",
            tags: (
              <>
                {node.bundle.length != 0 &&
                node.bundle[0].product_tags != undefined
                  ? node.bundle[0].product_tags.map((d) => {
                      return [d.tag_label + " "];
                    })
                  : null}
              </>
            ),
            tag_list:
              node.bundle.length != 0 &&
              node.bundle[0].product_tags != undefined
                ? node.bundle[0].product_tags.map((d) => {
                    return [d.tag_label];
                  })
                : [],
            product_variant_id: node.variant_id,
            product_type: category,
            brand: node.bundle.length != 0 ? node.bundle[0].brand : "No Brand",
            size: "(" + node.product_type + ")",
            color: "",
            weight: "",
            stock: parseFloat(quantity) < 1 ? "Out of Stock" : "In Stock",
            image:
              image != null ? (
                <img
                  onClick={() => imageModal(image, node.bundle[0].product_name)}
                  style={{
                    width: "100%",
                    cursor: "pointer",
                    margin: "0 auto",
                  }}
                  src={image}
                />
              ) : (
                <Empty
                  description={false}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ),

            price: numeral(price).format("0,0.00"),
            price_raw: price,
            quantity: quantity,
            initial_quantity: node.quantity,
            sub_total: numeral(node.quantity * price).format("0,0.00"),
            actionData: node._id,
          });
          sub = parseFloat(sub) + parseFloat(node.quantity) * parseFloat(price);
        }
      }
      setsubtotoal(sub);
      setDeliveryMethod(cart.delivery_method);
      setCustomerNote(cart.order_note);
      setCartrow(filteredcart);
    } else {
      setCartrow([]);
      setProceed(false);
    }
  }, [cart]);
  // useEffect(() => {
  //   get_cart();
  // }, [refreshCart]);
  const setInput = async (value, index, column) => {
    let tempdata = [...cartrow];
    let pastvalue = tempdata[index]["initial_quantity"];
    tempdata[index][column] = value;
    tempdata[index]["sub_total"] = numeral(
      tempdata[index]["price_raw"] * tempdata[index]["initial_quantity"]
    ).format("0,0.00");
    console.log(pastvalue, value);
    if (pastvalue != value) {
      // setCartrow(tempdata);
      console.log("quantity", value);
      const headers = {
        "Content-Type": "application/json",
      };
      let landing_customer_login_token = localStorage.getItem(
        "landing_customer_login_token"
      );
      const response = await axios.post(
        api_base_url_orders + "/update_cart",
        {
          order_id: tempdata[index]["order_id"],
          product_id: tempdata[index]["product_id"],
          product_type: tempdata[index]["type"],
          product_variant_id: tempdata[index]["product_variant_id"],
          item_id: tempdata[index]["item_id"],
          quantity: value,
          login_token: landing_customer_login_token,
        },
        { headers: headers }
      );
      get_cart();
      // setCart(response.data.cart);
    }
  };
  const saveNote = async () => {
    const headers = {
      "Content-Type": "application/json",
    };
    let landing_customer_login_token = localStorage.getItem(
      "landing_customer_login_token"
    );
    const response = await axios.post(
      api_base_url_orders + "/update_cart_additional_detail",
      {
        order_id: cart._id,
        note: customerNote,
        deliveryMethod: deliveryMethod,
        login_token: landing_customer_login_token,
      },
      { headers: headers }
    );
    get_cart();
  };
  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: "7.08%",
      align: "center",
    },
    {
      title: "Name",
      dataIndex: "product_name",
      key: "product_name",
      width: "18.01%",
      render: (result, row, index) => {
        console.log();
        return [
          <>
            <Text strong>{result}</Text>
            <br></br>
            <Text type="secondary">{row.product_description}</Text>
          </>,
        ];
      },
    },

    {
      title: "Category",
      dataIndex: "product_type",
      key: "product_type",
      width: "9.5%",
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      width: "10%",
    },
    {
      title: "Brands",
      dataIndex: "brand",
      key: "brand",
      width: "8.98%",
    },
    {
      title: "Variant",
      dataIndex: "weight",
      key: "weight",
      width: "7.61%",
      render: (value, result) => {
        return [
          <Space direction="vertical" size="0">
            <Text>{result.size}</Text>
            <Text>{result.weight}</Text>
            <Text>{result.color}</Text>
          </Space>,
        ];
      },
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      width: "8%",
      render: (value, row, index) => {
        return [
          <Space direction="vertical" size="0">
            <Text>{value}</Text>
            <Text>{value == "In Stock" ? "stock :" + row.quantity : null}</Text>
          </Space>,
        ];
      },
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: "6.82%",
      render: (value) => {
        return ["\u20B1 " + value];
      },
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",

      width: "5%",
      render: (value, result) => {
        return [
          <div className="def-number-input number-input" key={result.key}>
            <button
              onClick={() => {
                if (parseFloat(result.initial_quantity) - parseFloat(1) >= 0) {
                  setInput(
                    parseFloat(result.initial_quantity) - parseFloat(1),
                    result.key,
                    "initial_quantity"
                  );
                }
              }}
              className="minus"
            ></button>
            <input
              className="quantity"
              name="quantity"
              value={result.initial_quantity}
              min={0}
              max={parseFloat(value)}
              onChange={(event) => {
                if (parseFloat(event.target.value) < 0) {
                  setInput(0, result.key, "initial_quantity");
                } else if (parseFloat(event.target.value) > parseFloat(value)) {
                  setInput(value, result.key, "initial_quantity");
                } else {
                  setInput(event.target.value, result.key, "initial_quantity");
                }
              }}
              type="number"
            />
            <button
              onClick={() => {
                if (
                  parseFloat(result.initial_quantity) + parseFloat(1) <=
                  value
                ) {
                  setInput(
                    parseFloat(result.initial_quantity) + parseFloat(1),
                    result.key,
                    "initial_quantity"
                  );
                }
              }}
              className="plus"
            ></button>
          </div>,
          // <InputNumber
          //   key={result.key}
          //   value={result.initial_quantity}
          //   min={0}
          //   max={parseFloat(value)}
          //   onChange={(event) => {
          //     console.log(event, "event", event);
          //     setInput(event, result.key, "initial_quantity");
          //   }}
          // />,
        ];
      },
    },
    {
      title: "Subtotal",
      dataIndex: "sub_total",
      key: "sub_total",
      width: "6.82%",
      align: "right",
      render: (value) => {
        return [value];
      },
    },
    {
      title: "Action",
      dataIndex: "actionData",
      key: "actionData",
      width: "11.51%",
      align: "center",
      render: (value, result) => {
        return [
          <>
            <Button
              key="0"
              block
              style={{
                backgroundColor: "#f0f2f5",

                border: "1px solid #f0f2f5",
              }}
              onClick={() => {
                setInput(0, result.key, "initial_quantity");
              }}
            >
              <DeleteOutlined /> Remove
            </Button>
          </>,
        ];
      },
    },
  ];
  return [
    <>
      <Row gutter={[16, 16]}>
        <Col span={24} style={{ paddingLeft: "5%", paddingRight: "5%" }}>
          <Card id="CartSectionView" key="0" size="small">
            <Row gutter={[16, 48]} key="0">
              <Col span="24" key="0">
                <Title level={4} style={{ color: "#2790ff" }}>
                  Your Cart
                </Title>
                <Table
                  key="0"
                  //className="custom-table"
                  dataSource={cartrow}
                  columns={columns}
                  pagination={false}
                  size="small"
                />
              </Col>
            </Row>

            <Row gutter={[16, 16]} key="1">
              <Col span="10" key="0">
                <Space direction="vertical" size={6} style={{ width: "100%" }}>
                  <Text style={{ marginLeft: "12px" }} strong>
                    Order Note
                  </Text>
                  <TextArea
                    disabled={cart == null ? true : false}
                    rows={4}
                    style={{ width: "100%" }}
                    placeholder="Type here"
                    value={customerNote}
                    onChange={(event) => setCustomerNote(event.target.value)}
                    onBlur={() => saveNote()}
                  />
                </Space>
              </Col>
              <Col span="1" key="1"></Col>
              <Col span="5" key="3">
                <Space direction="vertical" size={6} style={{ width: "100%" }}>
                  <Text strong>Delivery Type</Text>

                  <Radio.Group
                    onChange={(event) => setDeliveryMethod(event.target.value)}
                    value={cart == null ? "" : deliveryMethod}
                    disabled={cart == null ? true : false}
                  >
                    <Space direction="vertical">
                      <Radio
                        value={"Store Pick Up"}
                        disabled={excl}
                        onBlur={() => saveNote()}
                      >
                        Store Pick Up
                      </Radio>
                      <Radio
                        value={"Exclusive Delivery"}
                        onBlur={() => saveNote()}
                      >
                        <Space direction="vertical" size={1}>
                          <Text>Exclusive Delivery</Text>
                          <Text type="secondary">{"\u20B1"} 500.00</Text>
                          <Text type="secondary">
                            Required for orders with meat products
                          </Text>
                        </Space>
                      </Radio>
                      <Radio
                        value={"Standard Delivery"}
                        disabled={excl}
                        onBlur={() => saveNote()}
                      >
                        <Space direction="vertical" size={1}>
                          <Text>Standard Delivery</Text>
                          <Text type="secondary">{"\u20B1"} 350.00</Text>
                        </Space>
                      </Radio>
                    </Space>
                  </Radio.Group>
                </Space>
              </Col>
              <Col span="2" key="4"></Col>
              <Col span="6" key="5">
                <Descriptions
                  bordered
                  column={1}
                  size="small"
                  className="CartDescriptions"
                >
                  <Descriptions.Item label="SUBTOTAL">
                    {numeral(subtotal).format("0,0.00")}
                  </Descriptions.Item>
                  <Descriptions.Item label="DELIVERY CHARGE">
                    {cart == null
                      ? numeral(0).format("0,0.00")
                      : deliveryMethod == "Standard Delivery"
                      ? numeral(350).format("0,0.00")
                      : deliveryMethod == "Exclusive Delivery"
                      ? numeral(500).format("0,0.00")
                      : numeral(0).format("0,0.00")}
                  </Descriptions.Item>
                  <Descriptions.Item label="TOTAL">
                    {numeral(
                      parseFloat(
                        cart == null
                          ? 0
                          : deliveryMethod == "Standard Delivery"
                          ? 350
                          : deliveryMethod == "Exclusive Delivery"
                          ? 500
                          : 0
                      ) + parseFloat(subtotal)
                    ).format("0,0.00")}
                  </Descriptions.Item>
                </Descriptions>
                {proceedtoDetail ? (
                  <div
                    style={{
                      textAlign: "right",
                      marginTop: "15px",
                    }}
                  >
                    <Button
                      block
                      size="large"
                      className="ant-btn-success"
                      disabled={!proceed}
                      onClick={() => {
                        setProceedtoDetail(false);
                        setTimeout(() => {
                          if (document.getElementById("ResidentialView")) {
                            document
                              .getElementById("ResidentialView")
                              .scrollIntoView({ behavior: "smooth" });
                          }
                        }, 1000);
                      }}
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                ) : null}
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      {proceedtoDetail ? (
        <div id="ResidentialView"></div>
      ) : (
        <>
          {/* {cart ? (
            <PageHeader
              className="site-page-header"
              title={"Contact Details and Delivery Address"}
            />
          ) : null} */}
          <Row gutter={[16, 16]}>
            <Col span={24} style={{ paddingLeft: "5%", paddingRight: "5%" }}>
              <CustomerInfo
                cart={cart}
                loggedin={loggedin}
                get_cart={() => {
                  setProceedtoDetail(true);
                  get_cart();
                }}
                proceed={proceedtoDetail}
              />
            </Col>
          </Row>
        </>
      )}

      <PreviewImage
        visible={visible}
        imgSrc={imgSrc}
        productTitle={productTitle}
        callback={resetImageModal}
      />
    </>,
  ];
};

export default Cart;
