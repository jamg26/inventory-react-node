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
import numeral from "numeral";
import { DeleteOutlined } from "@ant-design/icons";
import PreviewImage from "../../global-components/previewImageModal";
import CustomerInfo from "./CustomerInfo";
import { api_base_url_orders } from "../../../keys/index";
const { Search } = Input;
const { Text } = Typography;
const { TextArea } = Input;
const Cart = ({ refreshCart, show }) => {
  const [visible, setVisible] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [productTitle, setProductTitle] = useState("");
  const [cart, setCart] = useState(null);
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
  const get_cart = async () => {
    console.log("refreshing cart");
    let customer_id = localStorage.getItem("landing_customer_id");
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.get(
      api_base_url_orders + "/customer_cart/" + customer_id,
      {},
      { headers: headers }
    );
    setCart(response.data.cart);
  };
  useEffect(() => {
    if (cart != null) {
      setProceed(true);
      const filteredcart = [];
      let sub = 0;
      for (let x = 0; x < cart.line_item.length; x++) {
        let node = cart.line_item[x];
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
          node.product.length != 0 && node.product[0].product_tags != undefined
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
          node.product[0].length != 0 && node.product[0].variants[0].length != 0
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
          order_id: cart._id,
          product_id: node.product.length != 0 ? node.product[0]._id : "",
          item_id: node._id,
          product_name:
            node.product.length != 0 ? node.product[0].product_name : "",
          product_description:
            node.product.length != 0 ? node.product[0].product_description : "",
          tags: (
            <>
              {node.product.length != 0 &&
              node.product[0].product_tags != undefined
                ? node.product[0].product_tags.map((d) => {
                    return [
                      <Tag color="gold" style={{ marginBottom: "8px" }}>
                        {d.tag_label}
                      </Tag>,
                    ];
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
          image:
            image != null ? (
              <img
                onClick={() => imageModal(image, node.product[0].product_name)}
                style={{
                  width: "25%",
                  cursor: "pointer",
                  margin: "0 auto",
                }}
                src={image}
              />
            ) : (
              <Empty description={false} image={Empty.PRESENTED_IMAGE_SIMPLE} />
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
      setsubtotoal(sub);
      setDeliveryMethod(cart.delivery_method);
      setCustomerNote(cart.order_note);
      setCartrow(filteredcart);
    } else {
      setCartrow([]);
      setProceed(false);
    }
  }, [cart]);
  useEffect(() => {
    get_cart();
  }, [refreshCart]);
  const setInput = async (value, index, column) => {
    let tempdata = [...cartrow];
    let pastvalue = tempdata[index]["initial_quantity"];
    tempdata[index][column] = value;
    tempdata[index]["sub_total"] = numeral(
      tempdata[index]["price_raw"] * tempdata[index]["initial_quantity"]
    ).format("0,0.00");

    if (pastvalue != value) {
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
          product_variant_id: tempdata[index]["product_variant_id"],
          item_id: tempdata[index]["item_id"],
          quantity: value,
          login_token: landing_customer_login_token,
        },
        { headers: headers }
      );

      setCart(response.data.cart);
    }
  };
  const saveNote = async () => {
    console.log(cart);
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
      width: "9%",
      align: "center",
    },
    {
      title: "Name",
      dataIndex: "product_name",
      key: "product_name",
      width: "7%",
      render: (result, row, index) => {
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
      width: "7%",
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      width: "7%",
    },
    {
      title: "Brands",
      dataIndex: "brand",
      key: "brand",
      width: "7%",
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      width: "7%",
    },
    {
      title: "Weight",
      dataIndex: "weight",
      key: "weight",
      width: "7%",
    },
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
      width: "7%",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: "7%",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",

      width: "7%",
      render: (value, result) => {
        return [
          <InputNumber
            key={result.key}
            disabled={result.quantity > 0 ? false : true}
            value={result.initial_quantity}
            min={0}
            max={parseFloat(value)}
            onChange={(event) =>
              setInput(event, result.key, "initial_quantity")
            }
          />,
        ];
      },
    },
    {
      title: "Subtotal",
      dataIndex: "sub_total",
      key: "sub_total",
      width: "7%",
    },
    {
      title: "Action",
      dataIndex: "actionData",
      key: "actionData",
      width: "7%",
      align: "center",
      render: (value, result) => {
        return [
          <>
            <Button
              key="0"
              type="danger"
              disabled={result.quantity > 0 ? false : true}
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
      <PageHeader className="site-page-header" title={"Your Cart"} />
      <Card id="CartSectionView" key="0">
        <Row gutter={[16, 48]} key="0">
          <Col span="24" key="0">
            <Table
              key="0"
              className="custom-table"
              dataSource={cartrow}
              columns={columns}
              pagination={false}
              size="small"
            />
          </Col>
        </Row>

        <Row gutter={[16, 16]} key="1">
          <Col span="7" key="0">
            <Text strong>Order Note</Text>
            <TextArea
              disabled={cart == null ? true : false}
              rows={4}
              placeholder="Type here"
              value={customerNote}
              onChange={(event) => setCustomerNote(event.target.value)}
              onBlur={() => saveNote()}
            />
          </Col>
          <Col span="1" key="1"></Col>
          <Col span="3" key="2"></Col>
          <Col span="5" key="3">
            <Text strong>Delivery Type</Text>
            <br></br>

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
                <Radio value={"Exclusive Delivery"} onBlur={() => saveNote()}>
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
          </Col>
          <Col span="3" key="4"></Col>
          <Col span="5" key="5">
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
              <div style={{ textAlign: "right", marginTop: "15px" }}>
                <Button
                  block
                  type="primary"
                  disabled={!proceed}
                  onClick={() => {
                    document
                      .getElementById("ResidentialView")
                      .scrollIntoView({ behavior: "smooth" });
                    setProceedtoDetail(false);
                  }}
                >
                  Proceed to Checkout
                </Button>
              </div>
            ) : null}
          </Col>
        </Row>
      </Card>
      {cart ? (
        <PageHeader
          className="site-page-header"
          title={"Residential and Contact Details"}
        />
      ) : null}
      <CustomerInfo
        cart={cart}
        get_cart={() => {
          setProceedtoDetail(true);
          get_cart();
        }}
        proceed={proceedtoDetail}
      />
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