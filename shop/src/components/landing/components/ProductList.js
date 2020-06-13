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
}) {
  const [filteredproducts, setFilteredProducts] = useState([]);
  const [filteredproductsFiltered, setfilteredproductsFiltered] = useState([]);
  const [visible, setVisible] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [productTitle, setProductTitle] = useState("");
  const [searchFilterProducts, setSearchFilterProducts] = useState("");
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
        let init = 0;
        let item_id = "";
        let order_id = "";
        if (cart != null) {
          order_id = cart._id;
          for (let po = 0; po < cart.line_item.length; po++) {
            if (element._id == cart.line_item[po].variant_id) {
              init = parseFloat(cart.line_item[po].quantity);
              item_id = cart.line_item[po]._id;
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
                onClick={() => imageModal(image, element.product_name)}
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
                onClick={() => imageModal(image, element.product_name)}
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
                onClick={() => imageModal(image, element.product_name)}
                style={{
                  width: "100%",
                  cursor: "pointer",
                  margin: "0 auto",
                }}
                src={image}
              />
            ) : (
              <Empty description={false} image={Empty.PRESENTED_IMAGE_SIMPLE} />
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
            let init = 0;
            let item_id = undefined;
            let order_id = undefined;
            if (cart != null) {
              order_id = cart._id;
              for (let po = 0; po < cart.line_item.length; po++) {
                if (node.variants[x]._id == cart.line_item[po].variant_id) {
                  init = parseFloat(cart.line_item[po].quantity);
                  item_id = cart.line_item[po]._id;
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
                    onClick={() => imageModal(image, node.product_name)}
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
                    onClick={() => imageModal(image, node.product_name)}
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
                    onClick={() => imageModal(image, node.product_name)}
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
                    ? node.variants[x].weight
                    : "No Weight"
                  : "No Weight",
              stock: parseFloat(quantity) < 1 ? "Out of Stock" : "In Stock",
              price: numeral(price).format("0,0.00"),
              price_raw: price,
              quantity: quantity,
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
  }, [bundle, products, searchFilterProducts, category]);
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
        localStorage.setItem("guest_id", response.data.guest_id);
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
            index,
            data,
            customer_id,
            login_token: landing_customer_login_token,
            customer_info,
          },
          { headers: headers }
        );
        console.log("guest id defining");
        localStorage.setItem("guest_id", response.data.guest_id);
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
      width: "11.12%",
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      width: "10.96%",
    },
    {
      title: "Brands",
      dataIndex: "brand",
      key: "brand",
      width: "8.48%",
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

      width: "5%",
      render: (value, result, index) => {
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
      width: "5%",
      align: "right",
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
            {result.quantity > 0 ? (
              <Button
                className="ant-btn-succcess"
                disabled={result.quantity > 0 ? false : true}
                onClick={() => {
                  handleAddToCart(value, result);
                }}
              >
                <ShoppingCartOutlined /> Add to Cart
              </Button>
            ) : (
              <Button disabled={result.quantity > 0 ? false : true}>
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
            placeholder="search for  products, brands, categories, etc"
            value={searchFilterProducts}
            onChange={(e) => setSearchFilterProducts(e.target.value)}
            style={{ width: "25%", marginBottom: "3vh" }}
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
            <Radio.Button value="list">
              <UnorderedListOutlined /> List View
            </Radio.Button>
            <Radio.Button value="card">
              <AppstoreOutlined /> Catalogue View
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
                    <Col span={4}>
                      <Card hoverable cover={row.category_image}>
                        <Text strong>{row.product_name}</Text>
                        <br />
                        <Text type="secondary">{row.weight}</Text>
                        <br />
                        <Text type="secondary">{row.color}</Text>
                        <br />
                        <Text type="secondary">{row.size}</Text>
                        <br />

                        <Row gutter={[16, 16]}>
                          <Col span="7">
                            <Text strong>
                              {"\u20B1"}
                              {row.price}
                            </Text>
                          </Col>
                          <Col span="10" style={{ textAlign: "center" }}>
                            <div
                              className={`quantity-input ${
                                row.quantity > 0
                                  ? ""
                                  : "disabled_quantity_component"
                              }`}
                            >
                              <button
                                className="quantity-input__modifier quantity-input__modifier--left"
                                // onClick={this.decrement}
                                disabled={row.quantity > 0 ? false : true}
                                onClick={(event) => {
                                  if (row.initial_quantity == 0) {
                                  } else {
                                    setInputCatalogue(
                                      row.initial_quantity === "" ||
                                        isNaN(row.initial_quantity)
                                        ? 0
                                        : parseFloat(row.initial_quantity) - 1,
                                      row.key,
                                      "initial_quantity",
                                      row.actionData
                                    );
                                  }
                                }}
                              >
                                &mdash;
                              </button>
                              <input
                                className="quantity-input__screen"
                                type="text"
                                disabled={row.quantity > 0 ? false : true}
                                value={row.initial_quantity}
                                readOnly
                                // readonly
                                onBlur={() => {
                                  if (
                                    row.initial_quantity === "" ||
                                    isNaN(row.initial_quantity)
                                  ) {
                                    setInputCatalogue(
                                      row.initial_quantity === "" ||
                                        isNaN(row.initial_quantity)
                                        ? 0
                                        : row.initial_quantity,
                                      row.key,
                                      "initial_quantity",
                                      row.actionData
                                    );
                                  }
                                }}
                                onChange={(event) => {
                                  setInputCatalogue(
                                    row.initial_quantity === "" ||
                                      isNaN(row.initial_quantity)
                                      ? 0
                                      : event.target.value,
                                    row.key,
                                    "initial_quantity",
                                    row.actionData
                                  );
                                }}
                              />
                              <button
                                disabled={row.quantity > 0 ? false : true}
                                className="quantity-input__modifier quantity-input__modifier--right"
                                onClick={(event) => {
                                  if (row.initial_quantity >= row.quantity) {
                                  } else {
                                    setInputCatalogue(
                                      row.initial_quantity === "" ||
                                        isNaN(row.initial_quantity)
                                        ? 0
                                        : parseFloat(row.initial_quantity) +
                                            parseFloat(1),
                                      row.key,
                                      "initial_quantity",
                                      row.actionData
                                    );
                                  }
                                }}
                              >
                                &#xff0b;
                              </button>
                            </div>
                          </Col>
                          <Col span="7" style={{ textAlign: "right" }}>
                            <Text strong>
                              {"\u20B1"}
                              {row.sub_total}
                            </Text>
                          </Col>
                        </Row>
                      </Card>
                      <div style={{ textAlign: "center", width: "100%" }}>
                        <Button
                          type="primary"
                          style={{ marginTop: "3%" }}
                          onClick={() => {
                            setmodal_data(index);
                          }}
                        >
                          Click for more info
                        </Button>
                      </div>
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
      <div style={{ textAlign: "right", marginTop: "10px" }}>
        <Button type="primary" onClick={show}>
          {showCart ? "Hide your Cart" : "View your Cart"}
        </Button>
      </div>
      <ProductModal
        product_modal_visible={product_modal_visible}
        close={() => {
          setproduct_modal_visible(false);
          setmodal_data(undefined);
        }}
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
