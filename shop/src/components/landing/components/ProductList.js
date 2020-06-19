import React, { useState, useEffect } from "react";
import {
  Input,
  Table,
  Typography,
  Tag,
  Row,
  Col,
  InputNumber,
  Button,
  Empty,
  Radio,
  Card,
  Space,
  Collapse,
  Spin,
  notification,
} from "antd";

import axios from "axios";
import Labels from "../../global-components/labels";
import moment from "moment";
import numeral from "numeral";
import { UserContext } from "../../../routes/routes";
import NumberFormat from "react-number-format";
import cloneDeep from "lodash/cloneDeep";
import {
  ShoppingCartOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  CaretRightOutlined,
  EditOutlined,
  EllipsisOutlined,
  SearchOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import PreviewImage from "../../global-components/previewImageModal";
import ProductModal from "./modals/product_modal";
import { api_base_url_orders } from "../../../keys/index";
const { Search } = Input;
const { Text, Paragraph } = Typography;
const { Meta } = Card;
const { Panel } = Collapse;
function ProductList({
  products,
  category,
  refresh,
  showCart,
  show,
  cart,
  bundle,
  searchFilterProducts,
  setSearchFilterProducts,
  setsearchEntered,
  searchEntered,
}) {
  const [filteredproducts, setFilteredProducts] = useState([]);
  const [filteredproductsFiltered, setfilteredproductsFiltered] = useState([]);
  const [visible, setVisible] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [productTitle, setProductTitle] = useState("");

  const [listStyle, setlistStyle] = useState("list");
  const [spinning_product_list, set_spinning_product_list] = useState(false);
  const [product_modal_visible, setproduct_modal_visible] = useState(false);
  const [modal_data, setmodal_data] = useState(undefined);
  useEffect(() => {
    console.log("modal_data", modal_data);
    if (modal_data != undefined) {
      setproduct_modal_visible(true);
    }
  }, [modal_data]);
  useEffect(() => {
    set_spinning_product_list(true);
    let data = [];
    let counter = 0;
    if (bundle.data && bundle.data.length != 0) {
      for (let x = 0; x < bundle.data.length; x++) {
        const element = bundle.data[x];
        let quantity = element.initial_stock ? element.initial_stock : 0;
        let init = 1;
        let item_id = "";
        let order_id = "";
        let alreadyincart = false;
        if (cart != null) {
          order_id = cart._id;
          for (let po = 0; po < cart.line_item.length; po++) {
            if (element._id == cart.line_item[po].variant_id) {
              init = parseFloat(cart.line_item[po].quantity);
              item_id = cart.line_item[po]._id;
              alreadyincart = true;
              break;
            }
          }
        }

        let price = element.bundle_price;
        let image = element.image ? element.image : null;
        data.push({
          key: counter,
          type: "Bundle",
          order_id: order_id,
          item_id: item_id,
          product_id: element._id,
          product_variant_id: element._id,
          product_name: element.name,
          product_description: element.description,
          tags: (
            <>
              {element.product_tags != undefined
                ? element.product_tags.map((d, inss) => {
                    if (
                      element.product_tags.length ==
                      parseFloat(inss) + parseFloat(1)
                    ) {
                      return [d.tag_label + " "];
                    } else {
                      return [d.tag_label + ","];
                    }
                  })
                : null}
            </>
          ),
          tag_list:
            element.product_tags != undefined
              ? element.product_tags.map((d) => {
                  return [d.tag_label];
                })
              : [],

          category_image:
            image != null ? (
              <img
                style={{
                  height: "25vh",
                  cursor: "pointer",
                  margin: "0 auto",
                }}
                src={image}
              />
            ) : (
              <Empty
                style={{
                  marginTop: "0px",
                  marginBottom: "0px",
                }}
                imageStyle={{
                  verticalAlign: "middle",
                  height: "25vh",
                  marginBottom: "0px",
                }}
                description={false}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          category_modal_image:
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
                style={{
                  marginTop: "0px",
                  marginBottom: "0px",
                  height: "100%",
                }}
                imageStyle={{
                  verticalAlign: "middle",
                  width: "100%",
                  marginBottom: "0px",
                }}
                description={false}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
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
                style={{ cursor: "pointer" }}
              />
            ),
          product_type:
            element.product_type && element.product_type.length != 0
              ? element.product_type[0].product_type_name
              : "No Category",
          brand:
            element != undefined
              ? element.length != 0
                ? element.brand
                : "No Brand"
              : "No Brand",
          size: "(Bundle)",
          color: "",
          weight: "",
          alreadyincart: alreadyincart,
          stock: parseFloat(quantity) < 1 ? "Out of Stock" : "In Stock",
          price: numeral(price).format("0,0.00"),
          price_raw: price,
          quantity: quantity,
          initial_quantity: quantity > 0 ? init : 0,
          sub_total: numeral((quantity > 0 ? init : 0) * price).format(
            "0,0.00"
          ),
          actionData: element,
        });
        counter++;
      }
    }
    if (products.length != 0) {
      for (let c = 0; c < products.length; c++) {
        let node = products[c];
        if (node.variants != undefined) {
          for (let x = 0; x < node.variants.length; x++) {
            let quantity =
              node.variants[x] != undefined
                ? node.variants[x].length != 0
                  ? node.variants[x].quantity
                  : 0
                : 0;
            let init = 1;
            let item_id = undefined;
            let order_id = undefined;
            let alreadyincart = false;
            if (cart != null) {
              order_id = cart._id;
              for (let po = 0; po < cart.line_item.length; po++) {
                if (node.variants[x]._id == cart.line_item[po].variant_id) {
                  init = parseFloat(cart.line_item[po].quantity);
                  item_id = cart.line_item[po]._id;
                  alreadyincart = true;
                  break;
                }
              }
            }

            let price =
              node.variants[x] != undefined
                ? node.variants[x].length != 0
                  ? node.variants[x].price
                  : 0
                : 0;
            let image =
              node.variants[x] != undefined
                ? node.variants[x].length != 0
                  ? node.variants[x].images != "" &&
                    node.variants[x].images != undefined &&
                    node.variants[x].images != null
                    ? node.variants[x].images
                    : null
                  : null
                : null;
            data.push({
              key: counter,
              type: "Product",
              order_id: order_id,
              item_id: item_id,
              product_id: node._id,
              product_variant_id: node.variants[x]._id,
              product_name: node.product_name,
              product_description: node.product_description,
              tags: (
                <>
                  {node.product_tags != undefined
                    ? node.product_tags.map((d, inss) => {
                        if (
                          node.product_tags.length ==
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
                node.product_tags != undefined
                  ? node.product_tags.map((d) => {
                      return [d.tag_label];
                    })
                  : [],

              category_image:
                image != null ? (
                  <img
                    style={{
                      height: "25vh",
                      cursor: "pointer",
                      margin: "0 auto",
                    }}
                    src={image}
                  />
                ) : (
                  <Empty
                    style={{
                      marginTop: "0px",
                      marginBottom: "0px",
                      pointer: "cursor",
                    }}
                    imageStyle={{
                      verticalAlign: "middle",
                      height: "25vh",
                      marginBottom: "0px",
                    }}
                    description={false}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                ),
              category_modal_image:
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
                    style={{
                      marginTop: "0px",
                      marginBottom: "0px",
                      height: "100%",
                    }}
                    imageStyle={{
                      verticalAlign: "middle",
                      width: "100%",
                      marginBottom: "0px",
                    }}
                    description={false}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                ),
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
                    style={{ cursor: "pointer" }}
                    description={false}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                ),
              product_type:
                node.product_type.length != 0
                  ? node.product_type[0].product_type_name
                  : "No Category",
              brand:
                node.variants[x] != undefined
                  ? node.variants[x].length != 0
                    ? node.variants[x].brand
                    : "No Brand"
                  : "No Brand",
              size:
                node.variants[x] != undefined
                  ? node.variants[x].length != 0
                    ? node.variants[x].size
                    : "No Size"
                  : "No Size",
              color:
                node.variants[x] != undefined
                  ? node.variants[x].length != 0
                    ? node.variants[x].color
                    : "No Color"
                  : "No Color",
              weight:
                node.variants[x] != undefined
                  ? node.variants[x].length != 0
                    ? node.variants[x].weight == undefined ||
                      node.variants[x].weight == "" ||
                      node.variants[x].weight == null
                      ? "No Weight"
                      : node.variants[x].weight
                    : "No Weight"
                  : "No Weight",
              stock: parseFloat(quantity) < 1 ? "Out of Stock" : "In Stock",
              price: numeral(price).format("0,0.00"),
              price_raw: price,
              quantity: quantity,
              alreadyincart: alreadyincart,
              initial_quantity: quantity > 0 ? init : 0,
              sub_total: numeral((quantity > 0 ? init : 0) * price).format(
                "0,0.00"
              ),
              actionData: node,
            });
            counter++;
          }
        }
      }
      setFilteredProducts(data);
      if (category == "All Products") {
        const filteredProd = data.filter((product) => {
          console.log(product.product_name);
          console.log(product.weight);
          return (
            product.product_name
              .toLowerCase()
              .includes(searchFilterProducts.toLowerCase()) ||
            product.product_description
              .toLowerCase()
              .includes(searchFilterProducts.toLowerCase()) ||
            product.product_type
              .toLowerCase()
              .includes(searchFilterProducts.toLowerCase()) ||
            product.brand
              .toLowerCase()
              .includes(searchFilterProducts.toLowerCase()) ||
            product.size
              .toLowerCase()
              .includes(searchFilterProducts.toLowerCase()) ||
            product.weight
              .toLowerCase()
              .includes(searchFilterProducts.toLowerCase()) ||
            product.color
              .toLowerCase()
              .includes(searchFilterProducts.toLowerCase()) ||
            product.price
              .toLowerCase()
              .includes(searchFilterProducts.toLowerCase()) ||
            product.tag_list
              .toString()
              .toLowerCase()
              .includes(searchFilterProducts.toLowerCase())
          );
        });
        setfilteredproductsFiltered(filteredProd);
        set_spinning_product_list(false);
      } else {
        const filteredProd = data.filter((product) => {
          return (
            (product.product_name
              .toLowerCase()
              .includes(searchFilterProducts.toLowerCase()) ||
              product.product_description
                .toLowerCase()
                .includes(searchFilterProducts.toLowerCase()) ||
              product.product_type
                .toLowerCase()
                .includes(searchFilterProducts.toLowerCase()) ||
              product.brand
                .toLowerCase()
                .includes(searchFilterProducts.toLowerCase()) ||
              product.size
                .toLowerCase()
                .includes(searchFilterProducts.toLowerCase()) ||
              product.weight
                .toLowerCase()
                .includes(searchFilterProducts.toLowerCase()) ||
              product.color
                .toLowerCase()
                .includes(searchFilterProducts.toLowerCase()) ||
              product.price
                .toLowerCase()
                .includes(searchFilterProducts.toLowerCase()) ||
              product.tag_list
                .toString()
                .toLowerCase()
                .includes(searchFilterProducts.toLowerCase())) &&
            product.product_type == category
          );
        });
        setfilteredproductsFiltered(filteredProd);
        set_spinning_product_list(false);
      }
    }
  }, [bundle, products, searchEntered, category]);
  const setInput = (value, index, column) => {
    let tempdata = [...filteredproducts];
    tempdata[index][column] = value;
    tempdata[index]["sub_total"] = numeral(
      tempdata[index]["price_raw"] * tempdata[index]["initial_quantity"]
    ).format("0,0.00");
    setFilteredProducts(tempdata);
  };
  const setInputCatalogue = (value, index, column, data) => {
    if (column == "initial_quantity") {
      let tempdata = [...filteredproducts];
      tempdata[index][column] = value;
      tempdata[index]["sub_total"] = numeral(
        tempdata[index]["price_raw"] * tempdata[index]["initial_quantity"]
      ).format("0,0.00");
      handleAddToCart(data, tempdata[index]);
      // setFilteredProducts(tempdata);
    }
  };

  const handleAddToCart = async (index, data) => {
    if (data.type == "Product") {
      if (data.initial_quantity != 0) {
        //add product to the cart
        let temp = [...index.variants];
        const filteredvariants = temp.filter((tem) => {
          return tem._id.includes(data.product_variant_id);
        });
        index.variants = filteredvariants;

        let customer_id = localStorage.getItem("landing_customer_id");
        let guest_cart_id = localStorage.getItem("guest_cart_id");
        let landing_customer_login_token = localStorage.getItem(
          "landing_customer_login_token"
        );
        let account = localStorage.getItem("landing_remembered_account");
        let customer_info = {};
        if (account === null || account == "") {
          account = undefined;
        }
        if (account === undefined) {
        } else {
          customer_info = JSON.parse(account);
        }

        const headers = {
          "Content-Type": "application/json",
        };
        const response = await axios.post(
          api_base_url_orders + "/add_to_cart",
          {
            guest_cart_id: guest_cart_id,
            index,
            data,
            customer_id,
            login_token: landing_customer_login_token,
            customer_info,
          },
          { headers: headers }
        );
        console.log("guest id defining");
        if (
          customer_id == "" ||
          customer_id == undefined ||
          customer_id == null
        ) {
          localStorage.setItem("guest_cart_id", response.data.guest_id);
        }
        console.log(data);
        notification.open({
          top: 100,
          message: "Item Added",
          description: (
            <table style={{ width: "100%" }}>
              <tbody>
                <tr>
                  <td width="20%" style={{ verticalAlign: "middle" }}>
                    {data.image}
                  </td>
                  <td style={{ verticalAlign: "middle" }}>
                    {" "}
                    {data.product_name}
                  </td>
                  <td style={{ verticalAlign: "middle" }}>
                    {"X" + data.initial_quantity}
                  </td>
                </tr>
              </tbody>
            </table>
          ),
          onClick: () => {
            console.log("Notification Clicked!");
          },
        });
        refresh();
        // setInput(data.quantity > 0 ? 1 : 0, data.key, "initial_quantity");
      } else {
        //remove item to the cart
        let customer_id = localStorage.getItem("landing_customer_id");
        let landing_customer_login_token = localStorage.getItem(
          "landing_customer_login_token"
        );
        const headers = {
          "Content-Type": "application/json",
        };
        const response = await axios.post(
          api_base_url_orders + "/update_cart",
          {
            order_id: data["order_id"],
            product_id: data["product_id"],
            product_variant_id: data["product_variant_id"],
            item_id: data["item_id"],
            quantity: data["initial_quantity"],
            login_token: landing_customer_login_token,
          },
          { headers: headers }
        );
        refresh();
      }
    } else {
      //add to cart bundle
      if (data.initial_quantity != 0) {
        //add bundle to the cart
        index.variants = data.bundle_items;
        let customer_id = localStorage.getItem("landing_customer_id");
        let guest_cart_id = localStorage.getItem("guest_cart_id");
        let landing_customer_login_token = localStorage.getItem(
          "landing_customer_login_token"
        );
        let account = localStorage.getItem("landing_remembered_account");
        let customer_info = {};
        if (account === null || account == "") {
          account = undefined;
        }
        if (account === undefined) {
        } else {
          customer_info = JSON.parse(account);
        }
        const headers = {
          "Content-Type": "application/json",
        };
        const response = await axios.post(
          api_base_url_orders + "/add_to_cart",
          {
            guest_cart_id: guest_cart_id,
            index,
            data,
            customer_id,
            login_token: landing_customer_login_token,
            customer_info,
          },
          { headers: headers }
        );
        console.log("guest id defining 2");
        if (
          customer_id == "" ||
          customer_id == undefined ||
          customer_id == null
        ) {
          localStorage.setItem("guest_cart_id", response.data.guest_id);
        }
        notification.open({
          message: "Item Added",
          top: 100,
          description: (
            <table style={{ width: "100%" }}>
              <tbody>
                <tr>
                  <td width="20%" style={{ verticalAlign: "middle" }}>
                    {data.image}
                  </td>
                  <td style={{ verticalAlign: "middle" }}>
                    {" "}
                    {data.product_name}
                  </td>
                  <td style={{ verticalAlign: "middle" }}>
                    {"X" + data.initial_quantity}
                  </td>
                </tr>
              </tbody>
            </table>
          ),
          onClick: () => {
            console.log("Notification Clicked!");
          },
        });
        refresh();
      } else {
        //remove bundle to the cart
      }
    }
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
  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: "7.08%",
      align: "center",
      render: (value, row, index) => {
        return [
          <div
            onClick={() => {
              setmodal_data(index);
            }}
          >
            {value}
          </div>,
        ];
      },
    },
    {
      title: "Name",
      dataIndex: "product_name",
      key: "product_name",
      width: "21.01‬%",
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
      width: "9.5%",
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      width: "12.08%",
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
      width: "6.61%",
      render: (value, result) => {
        return [
          <Space size="0" direction="vertical">
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
      width: "6%",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: "7.23%",
      render: (value) => {
        return ["\u20B1 " + value];
      },
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      width: "5%",
      render: (value, result, index) => {
        return [
          <div className="def-number-input number-input" key={result.key}>
            <button
              disabled={
                result.quantity > 0 || !result.alreadyincart ? false : true
              }
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
              disabled={
                result.quantity > 0 || !result.alreadyincart ? false : true
              }
              className="quantity"
              name="quantity"
              value={result.initial_quantity}
              min={0}
              max={parseFloat(value)}
              onChange={(event) => {
                console.log("event", event.target.value);
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
              disabled={
                result.quantity > 0 || !result.alreadyincart ? false : true
              }
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
          //   disabled={result.quantity > 0 ? false : true}
          //   value={result.initial_quantity}
          //   min={0}
          //   max={parseFloat(value)}
          //   onChange={(event) =>
          //     setInput(event, result.key, "initial_quantity")
          //   }
          // />,
        ];
      },
    },
    {
      title: "Subtotal",
      dataIndex: "sub_total",
      key: "sub_total",
      width: "10.51%",
      align: "right",
    },
    {
      title: "Action",
      dataIndex: "actionData",
      key: "actionData",
      width: "6%",
      align: "center",
      render: (value, result) => {
        return [
          <>
            {result.quantity > 0 ? (
              result.alreadyincart ? (
                <Button type="primary" block onClick={show}>
                  Go to Cart
                </Button>
              ) : (
                <Button
                  className="ant-btn-succcess"
                  block
                  disabled={
                    result.quantity > 0 && result.initial_quantity > 0
                      ? false
                      : true
                  }
                  onClick={() => {
                    handleAddToCart(value, result);
                  }}
                >
                  <ShoppingCartOutlined /> Add to Cart
                </Button>
              )
            ) : (
              <Button block disabled={result.quantity > 0 ? false : true}>
                <ShoppingCartOutlined /> Out of Stock
              </Button>
            )}
          </>,
        ];
      },
    },
  ];
  return [
    <>
      <Row gutter="16">
        <Col span="24">
          <Search
            enterButton={
              <Space>
                <SearchOutlined />
                Search
              </Space>
            }
            placeholder="search for  products, brands, categories, etc"
            value={searchFilterProducts}
            onChange={(e) => setSearchFilterProducts(e.target.value)}
            onSearch={() => setsearchEntered(!searchEntered)}
            style={{ width: "35%", marginBottom: "3vh" }}
            suffix={
              <CloseCircleOutlined
                style={{ opacity: "0.5" }}
                onClick={() => {
                  setSearchFilterProducts("");
                  setsearchEntered(!searchEntered);
                }}
              />
            }
          />
          <Radio.Group
            className="borderless-radio"
            value={listStyle}
            onChange={(el) => {
              setlistStyle(el.target.value);
            }}
            style={{
              marginBottom: "3vh",

              marginLeft: "5%",
            }}
          >
            <Radio.Button value="list" style={{ fontWeight: "bold" }}>
              <UnorderedListOutlined style={{ fontSize: "18px" }} /> List View
            </Radio.Button>
            <Radio.Button value="card" style={{ fontWeight: "bold" }}>
              <AppstoreOutlined style={{ fontSize: "18px" }} /> Catalogue View
            </Radio.Button>
          </Radio.Group>
        </Col>
      </Row>
      <Spin spinning={spinning_product_list}>
        {filteredproductsFiltered.length !== 0 ? (
          <>
            {listStyle === "list" ? (
              <Table
                key="0"
                dataSource={filteredproductsFiltered}
                columns={columns}
                pagination={{
                  position: ["bottomCenter"],
                  defaultPageSize: 10,
                }}
                size="small"
              />
            ) : (
              <Row gutter={[16, 16]}>
                {filteredproductsFiltered.map((row, index) => {
                  return [
                    <Col span={4} style={{ height: "inherit" }}>
                      <Card
                        hoverable
                        cover={
                          <div style={{ margin: "10px" }}>
                            {row.category_image}
                          </div>
                        }
                        style={{ height: "100%" }}
                        bodyStyle={{
                          padding: "10px",
                          paddingBottom: "0px",
                          position: "relative",
                        }}
                        onMouseEnter={() => {
                          setInput(true, row.key, "hovered");
                        }}
                        onMouseLeave={() => {
                          setInput(false, row.key, "hovered");
                        }}
                      >
                        {row.hovered ? (
                          <Button
                            type="default"
                            style={{
                              position: "absolute",
                              top: 0,
                              left: "25%",
                              width: "50%",
                            }}
                            onClick={() => {
                              setmodal_data(index);
                            }}
                          >
                            Click for more info
                          </Button>
                        ) : null}

                        <Text strong>{row.product_name}</Text>
                        <br />
                        <Text type="secondary">{row.weight}</Text>
                        <br />
                        <Text type="secondary">{row.color}</Text>
                        <br />
                        <Text type="secondary">{row.size}</Text>

                        <Row gutter={[16, 16]}>
                          <Col span="7">
                            <Text strong>
                              {"\u20B1"}
                              {row.price}
                            </Text>
                          </Col>
                          <Col span="10" style={{ textAlign: "center" }}>
                            <div
                              className="def-number-input number-input"
                              key={row.key}
                            >
                              <button
                                disabled={
                                  row.quantity > 0 || !row.alreadyincart
                                    ? false
                                    : true
                                }
                                onClick={() => {
                                  if (
                                    parseFloat(row.initial_quantity) -
                                      parseFloat(1) >=
                                    0
                                  ) {
                                    setInput(
                                      parseFloat(row.initial_quantity) -
                                        parseFloat(1),
                                      row.key,
                                      "initial_quantity"
                                    );
                                  }
                                }}
                                className="minus"
                              ></button>
                              <input
                                disabled={
                                  row.quantity > 0 || !row.alreadyincart
                                    ? false
                                    : true
                                }
                                className="quantity"
                                name="quantity"
                                value={row.initial_quantity}
                                min={0}
                                max={parseFloat(row.quantity)}
                                onChange={(event) => {
                                  console.log("event", event.target.value);
                                  if (parseFloat(event.target.value) < 0) {
                                    setInput(0, row.key, "initial_quantity");
                                  } else if (
                                    parseFloat(event.target.value) >
                                    parseFloat(row.quantity)
                                  ) {
                                    setInput(
                                      row.quantity,
                                      row.key,
                                      "initial_quantity"
                                    );
                                  } else {
                                    setInput(
                                      event.target.value,
                                      row.key,
                                      "initial_quantity"
                                    );
                                  }
                                }}
                                type="number"
                              />
                              <button
                                disabled={
                                  row.quantity > 0 || !row.alreadyincart
                                    ? false
                                    : true
                                }
                                onClick={() => {
                                  if (
                                    parseFloat(row.initial_quantity) +
                                      parseFloat(1) <=
                                    row.quantity
                                  ) {
                                    setInput(
                                      parseFloat(row.initial_quantity) +
                                        parseFloat(1),
                                      row.key,
                                      "initial_quantity"
                                    );
                                  }
                                }}
                                className="plus"
                              ></button>
                            </div>
                          </Col>
                          <Col span="7" style={{ textAlign: "right" }}>
                            <Text strong>
                              {"\u20B1"}
                              {row.sub_total}
                            </Text>
                          </Col>
                        </Row>
                        <Row gutter={[16, 16]}>
                          <Col span="24">
                            <>
                              {row.quantity > 0 ? (
                                row.alreadyincart ? (
                                  <Button type="primary" block onClick={show}>
                                    Go to Cart
                                  </Button>
                                ) : (
                                  <Button
                                    className="ant-btn-succcess"
                                    block
                                    disabled={
                                      row.quantity > 0 &&
                                      row.initial_quantity > 0
                                        ? false
                                        : true
                                    }
                                    onClick={() => {
                                      handleAddToCart(row.actionData, row);
                                    }}
                                  >
                                    <ShoppingCartOutlined /> Add to Cart
                                  </Button>
                                )
                              ) : (
                                <Button
                                  block
                                  disabled={row.quantity > 0 ? false : true}
                                >
                                  <ShoppingCartOutlined /> Out of Stock
                                </Button>
                              )}
                            </>
                          </Col>
                        </Row>
                      </Card>
                    </Col>,
                  ];
                })}
              </Row>
            )}
          </>
        ) : (
          <Empty />
        )}
      </Spin>
      <Row>
        <Col span="23" style={{ textAlign: "right", marginTop: "10px" }}>
          <Button type="primary" onClick={show}>
            View your Cart
          </Button>
        </Col>
        <Col span="1"></Col>
      </Row>
      <ProductModal
        product_modal_visible={product_modal_visible}
        close={() => {
          setproduct_modal_visible(false);
          setmodal_data(undefined);
        }}
        show={show}
        setInput={setInput}
        handleAddToCart={handleAddToCart}
        modal_data={filteredproducts[modal_data]}
      />
      <PreviewImage
        visible={visible}
        imgSrc={imgSrc}
        productTitle={productTitle}
        callback={resetImageModal}
      />
    </>,
  ];
}

export default ProductList;
