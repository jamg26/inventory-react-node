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
} from "antd";

import axios from "axios";
import Labels from "../../global-components/labels";
import moment from "moment";
import numeral from "numeral";
import { UserContext } from "../../../routes/routes";
import {
  ShoppingCartOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  CaretRightOutlined,
  EditOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import PreviewImage from "../../global-components/previewImageModal";
import { api_base_url_orders } from "../../../keys/index";
const { Search } = Input;
const { Text, Paragraph } = Typography;
const { Meta } = Card;
const { Panel } = Collapse;
function ProductList({ category, refresh, showCart, show }) {
  const [products, setProducts] = useState([]);
  const [filteredproducts, setFilteredProducts] = useState([]);
  const [visible, setVisible] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [productTitle, setProductTitle] = useState("");
  const [searchFilterProducts, setSearchFilterProducts] = useState("");
  const [listStyle, setlistStyle] = useState("list");

  const get_products = async () => {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.get(
      api_base_url_orders + "/products",
      {},
      { headers: headers }
    );
    setProducts(response.data);
  };
  useEffect(() => {
    get_products();
  }, []);
  useEffect(() => {
    if (products.length != 0) {
      let data = [];
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
              key: c + x,
              product_id: node._id,
              product_variant_id: node.variants[x]._id,
              product_name: node.product_name,
              product_description: node.product_description,
              tags: (
                <>
                  {node.product_tags != undefined
                    ? node.product_tags.map((d) => {
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
                node.product_tags != undefined
                  ? node.product_tags.map((d) => {
                      return [d.tag_label];
                    })
                  : [],
              image:
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
              stock: parseFloat(quantity) < 1 ? "No Stock" : "In Stock",
              price: numeral(price).format("0,0.00"),
              price_raw: price,
              quantity: quantity,
              initial_quantity: quantity > 0 ? 1 : 0,
              sub_total: numeral((quantity > 0 ? 1 : 0) * price).format(
                "0,0.00"
              ),
              actionData: node,
            });
          }
        }
      }
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
      setFilteredProducts(filteredProd);
    }
  }, [products, searchFilterProducts]);
  const setInput = (value, index, column) => {
    let tempdata = [...filteredproducts];
    tempdata[index][column] = value;
    tempdata[index]["sub_total"] = numeral(
      tempdata[index]["price_raw"] * tempdata[index]["initial_quantity"]
    ).format("0,0.00");
    setFilteredProducts(tempdata);
  };
  const handleAddToCart = async (index, data) => {
    if (data.initial_quantity != 0) {
      let temp = [...index.variants];
      const filteredvariants = temp.filter((tem) => {
        return tem._id.includes(data.product_variant_id);
      });
      console.log(filteredvariants);
      index.variants = filteredvariants;
      console.log(index);

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
      refresh();
      setInput(data.quantity > 0 ? 1 : 0, data.key, "initial_quantity");
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
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
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
            min={result.quantity > 0 ? 1 : 0}
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
                <ShoppingCartOutlined /> no Stock
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
            style={{ width: "20%", marginBottom: "10px", float: "right" }}
          />
          <Radio.Group
            value={listStyle}
            onChange={(el) => {
              setlistStyle(el.target.value);
            }}
            buttonStyle="solid"
            style={{
              marginBottom: "10px",
              float: "right",
              marginRight: "10px",
            }}
          >
            <Radio.Button value="list">
              <UnorderedListOutlined />
            </Radio.Button>
            <Radio.Button value="card">
              <AppstoreOutlined />
            </Radio.Button>
          </Radio.Group>
        </Col>
      </Row>
      {filteredproducts.length !== 0 ? (
        <>
          {listStyle === "list" ? (
            <Table
              key="0"
              className="custom-table"
              dataSource={filteredproducts}
              columns={columns}
              pagination={{
                position: ["bottomCenter"],
                defaultPageSize: 10,
              }}
              size="small"
            />
          ) : (
            <Row gutter={[16, 16]}>
              {filteredproducts.map((row, index) => {
                return [
                  <Col span={4}>
                    <Card
                      hoverable
                      cover={row.image}
                      actions={[
                        <Space>
                          <InputNumber
                            key={row.key}
                            disabled={row.quantity > 0 ? false : true}
                            value={row.initial_quantity}
                            min={row.quantity > 0 ? 1 : 0}
                            max={parseFloat(row.quantity)}
                            style={{ width: "100%" }}
                            onChange={(event) =>
                              setInput(event, row.key, "initial_quantity")
                            }
                          />
                          {row.quantity > 0 ? (
                            <Button
                              className="ant-btn-succcess"
                              disabled={row.quantity > 0 ? false : true}
                              onClick={() => {
                                handleAddToCart(row.actionData, row);
                              }}
                            >
                              <ShoppingCartOutlined />
                            </Button>
                          ) : (
                            <Button disabled={row.quantity > 0 ? false : true}>
                              <ShoppingCartOutlined />
                            </Button>
                          )}
                        </Space>,
                      ]}
                    >
                      <Meta title={row.product_name} description={row.tags} />

                      <Text strong>
                        {"\u20B1"} {row.price}
                      </Text>
                      <Text type="secondary"> {row.stock}</Text>
                      <br />
                      <Collapse
                        bordered={false}
                        expandIcon={({ isActive }) => (
                          <CaretRightOutlined rotate={isActive ? 90 : 0} />
                        )}
                        expandIconPosition={"right"}
                        className="site-collapse-custom-collapse"
                      >
                        <Panel
                          header="more info"
                          key="1"
                          className="site-collapse-custom-panel"
                        >
                          <Text>{row.product_description}</Text>
                          <br />
                          <br />
                          <Text type="secondary">{row.product_type}</Text>
                          <br />
                          <Text type="secondary">Brand: {row.brand}</Text>
                          <br />
                          <Text type="secondary">Weight: {row.weight}</Text>
                          <br />
                          <Text type="secondary">Color: {row.color}</Text>
                          <br />
                          <Text type="secondary">Size: {row.size}</Text>
                        </Panel>
                      </Collapse>
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

      <div style={{ textAlign: "right", marginTop: "10px" }}>
        <Button type="primary" onClick={show}>
          {showCart ? "Hide your Cart" : "View your Cart"}
        </Button>
      </div>

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
