import React, { useState, useEffect } from "react";
import {
  Input,
  Row,
  Col,
  Table,
  Typography,
  Space,
  Button,
  Empty,
  Upload,
  message,
  Select,
  Divider,
  InputNumber,
  Switch,
  Card,
  Drawer,
  List,
  Menu,
  Badge,
  Tag,
  Modal,
} from "antd";
import Labels from "../../../../global-components/labels";
import moment from "moment";
import numeral from "numeral";
import { api_base_url, api_base_url_orders } from "../../../../../keys/index";
import {
  ThunderboltOutlined,
  FileSearchOutlined,
  CheckOutlined,
  AppstoreAddOutlined,
  BranchesOutlined,
  InboxOutlined,
  CloseOutlined,
  RightOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  UngroupOutlined,
  EditOutlined,
  PlusOutlined,
  StopOutlined,
} from "@ant-design/icons";

import cloneDeep from "lodash/cloneDeep";
import axios from "axios";
import TextArea from "antd/lib/input/TextArea";
const { Search } = Input;
const { Text, Title } = Typography;
const { Dragger } = Upload;
const { Option } = Select;
const { SubMenu } = Menu;
function BundleList({ bundle_list, selected, refresh }) {
  const [tags, setTags] = useState([]);
  const [product_tytpes, setproduct_tytpes] = useState([]);
  const [bundle, set_bundle] = useState(undefined);
  const [bundleorig, set_bundleorig] = useState(undefined);
  const [editable, seteditable] = useState(false);
  const [add_item_modal, set_add_item_modal] = useState(false);
  const [variantArray, setVariantArray] = useState([]);
  const [add_item_product_index, set_add_item_product_index] = useState("");
  const [add_item_product, set_add_item_product] = useState(undefined);
  const submit_add_item = async () => {
    let webadmin_login_token = localStorage.getItem("webadmin_login_token");
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios
      .post(
        api_base_url_orders + "/bundles/add_bundle_item",
        {
          login_token: webadmin_login_token,
          data: add_item_product,
          selected: selected,
        },
        { headers: headers }
      )
      .then((response) => {
        message.success(response.data.message);
        cancel_add_items();
        refresh();
      })
      .catch((err) => {
        message.error(err.response.data.message);
      });
  };
  const update_add_items_info = (value) => {
    let notset = true;
    for (let c = 0; c < bundle.bundle_items.length; c++) {
      const element = bundle.bundle_items[c];
      if (element.variant_id == variantArray[value].variant_id) {
        notset = false;
        break;
      }
    }

    if (notset) {
      set_add_item_product_index(value);
      console.log(variantArray[value]);
      set_add_item_product(variantArray[value]);
    } else {
      message.warning("item already in the bundle.");
    }
  };
  const update_add_items_digits = (value, column) => {
    let temp = cloneDeep(add_item_product);
    temp[column] = value;
    set_add_item_product(temp);
  };
  const open_add_item_modal = () => {
    set_add_item_modal(true);
  };
  const cancel_add_items = () => {
    set_add_item_modal(false);
    set_add_item_product(undefined);
    set_add_item_product_index("");
  };
  const retrieveAllActiveTags = () => {
    axios
      .get(api_base_url_orders + "/product_tags/active")
      .then((res) => {
        setTags(res.data);
      })
      .catch(function (err) {
        console.log(err);
      });
  };
  const get_product_types = async () => {
    axios
      .get(api_base_url_orders + "/product_type_list")
      .then((res) => {
        setproduct_tytpes(res.data);
      })
      .catch(function (err) {
        get_product_types();
      });
  };
  const retrieveAllVariants = () => {
    axios
      .get(api_base_url_orders + "/products")
      .then((res) => {
        let arr = [];
        let po_index = 0;
        res.data.map((info) =>
          info.variants.map((x) => {
            arr.push({
              index: po_index,
              key: x._id,
              product_info: info,
              parent_id: info._id,
              variant_id: x._id,
              variant_name: x.option_title,
              variant_image: x.images,
              variant_sku: x.sku,
              variant_supplier_price: x.supplier_price,
              variant_markup: x.markup,
              variant_price_without_tax: x.price_without_tax,
              variant_price_with_tax: x.price_with_tax,
              variant_price: x.price,
              variant_quantity: x.quantity > 0 ? 1 : 0,
              variant_quantity_max: x.quantity,
              variant_status: x.active,
              product_name: info.product_name,
              product_description: info.product_description,
              product_brand: x.product_brand,
              product_tags:
                info.product_tags && info.product_tags.length != 0
                  ? info.product_tags
                  : [],
              product_type:
                info.product_type && info.product_type.length != 0
                  ? info.product_type[0].product_type_name
                  : "",
              product_supplier:
                x.supplier && x.supplier.length != 0
                  ? x.supplier[0].display_name
                  : "",
            });
            po_index++;
          })
        );
        setVariantArray(arr);
      })
      .catch(function (err) {
        console.log(err);
      });
  };
  useEffect(() => {
    retrieveAllVariants();
    retrieveAllActiveTags();
    get_product_types();
  }, []);
  useEffect(() => {
    if (selected == "") {
      set_bundle(undefined);
    } else {
      seteditable(false);
      set_bundleorig(undefined);
      console.log("selected");
      let cc = [...bundle_list];
      for (let x = 0; x < cc.length; x++) {
        if (selected == cc[x]._id) {
          set_bundle(cc[x]);
          break;
        }
      }
    }
  }, [selected]);
  useEffect(() => {
    console.log("bundle changes");
  }, [bundle]);
  const edit_bundle = (data) => {
    seteditable(!editable);
    if (!editable == false) {
      set_bundleorig(undefined);
    } else {
      let temp = cloneDeep(data);
      temp.tags = [];
      temp.category =
        temp.product_type && temp.product_type.length != 0
          ? temp.product_type[0]._id
          : "";

      for (let c = 0; c < temp.product_tags.length; c++) {
        temp.tags.push(temp.product_tags[c].tag_label);
        console.log("tags", temp.product_tags[c].tag_label);
      }

      set_bundleorig(temp);
    }
  };
  const update_bundleorig = (value, column) => {
    console.log("edited", value, column);
    let temp = cloneDeep(bundleorig);
    temp[column] = value;
    console.log(column, temp[column]);
    set_bundleorig(temp);
  };
  const update_bundleorig_items = (value, column, index) => {
    console.log("update_bundleorig_items", value, column, index);
    let tempmain = cloneDeep(bundleorig);
    tempmain.bundle_items[index][column] = value;
    for (let c = 0; c < variantArray.length; c++) {
      const element = variantArray[c];
      if (value == element.variant_id) {
        tempmain.bundle_items[index]["key"] = element.key;
        tempmain.bundle_items[index]["parent_id"] = element.parent_id;
        tempmain.bundle_items[index]["variant_image"] = element.variant_image;
        tempmain.bundle_items[index]["variant_sku"] = element.variant_sku;
        tempmain.bundle_items[index]["variant_supplier_price"] =
          element.variant_supplier_price;
        tempmain.bundle_items[index]["variant_markup"] = element.variant_markup;
        tempmain.bundle_items[index]["variant_price_without_tax"] =
          element.variant_price_without_tax;
        tempmain.bundle_items[index]["variant_price_with_tax"] =
          element.variant_price_with_tax;
        tempmain.bundle_items[index]["variant_price"] = element.variant_price;
        tempmain.bundle_items[index]["variant_quantity"] =
          element.variant_quantity;
        tempmain.bundle_items[index]["variant_quantity_max"] =
          element.variant_quantity_max;
        tempmain.bundle_items[index]["product_name"] = element.product_name;
        tempmain.bundle_items[index]["product_description"] =
          element.product_description;
        tempmain.bundle_items[index]["product_type"] = element.product_type;
        tempmain.bundle_items[index]["product_supplier"] =
          element.product_supplier;
        break;
      }
    }
    set_bundleorig(tempmain);
  };
  const update_bundleorig_items_pricing = (value, column, index) => {
    let tempmain = cloneDeep(bundleorig);
    tempmain.bundle_items[index][column] = value;
    set_bundleorig(tempmain);
  };
  const toogle_bundle = async (value) => {
    let webadmin_login_token = localStorage.getItem("webadmin_login_token");
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios
      .post(
        api_base_url_orders + "/bundles/toogle_bundle",
        {
          login_token: webadmin_login_token,
          value: value,
          selected: selected,
        },
        { headers: headers }
      )
      .then((response) => {
        message.success(response.data.message);
        refresh();
      })
      .catch((err) => {
        message.error(err.response.data.message);
      });
  };
  const submit_Changes = async () => {
    console.log("bundleorig", bundleorig);
    let selectedt = [];
    for (let c = 0; c < bundleorig.tags.length; c++) {
      selectedt.push({
        tag_label: bundleorig.tags[c],
      });
    }
    let tempmain = cloneDeep(bundleorig);
    tempmain.product_tags = selectedt;
    tempmain.product_type = tempmain.category;

    console.log("tempmain", tempmain);
    let webadmin_login_token = localStorage.getItem("webadmin_login_token");
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios
      .post(
        api_base_url_orders + "/bundles/update_to_bundle",
        {
          login_token: webadmin_login_token,
          data: tempmain,
        },
        { headers: headers }
      )
      .then((response) => {
        message.success(response.data.message);
        edit_bundle(tempmain);
        refresh();
      })
      .catch((err) => {
        message.error(err.response.data.message);
      });
  };

  const columns = [
    {
      title: "ITEM DETAILS",
      dataIndex: "variant_name",
      width: "30%",
      render: (value, row, index) => {
        return [
          <>
            <Row align="middle" gutter={16}>
              <Col span="5">
                {row.variant_image &&
                row.variant_image != "" &&
                row.variant_image != null ? (
                  <img src={row.variant_image} style={{ width: "100%" }} />
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
                )}
              </Col>
              <Col span="19">
                {editable ? (
                  <Select
                    showSearch
                    style={{ width: "100%", minWidth: 200 }}
                    dropdownMatchSelectWidth={false}
                    value={row.variant_id}
                    onChange={(e) =>
                      update_bundleorig_items(e, "variant_id", index)
                    }
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {variantArray.map((data, index) => {
                      return [
                        <Option
                          key={data.key}
                          value={data.variant_id}
                          disabled={
                            data.variant_quantity_max == 0 ? true : false
                          }
                          title="no Stock"
                        >
                          {data.variant_name}
                        </Option>,
                      ];
                    })}
                  </Select>
                ) : (
                  <Text strong>{value}</Text>
                )}

                <br />
                <Text type="secondary">{row.product_description}</Text>
              </Col>
            </Row>
          </>,
        ];
      },
    },
    {
      title: "PURCHASE COST",
      dataIndex: "variant_supplier_price",
      align: "right",
      render: (value, row, index) => {
        return [numeral(value).format("0,0.00")];
      },
    },
    {
      title: "MARKUP",
      dataIndex: "variant_markup",
      align: "right",
      render: (value, row, index) => {
        return [value + "%"];
      },
    },

    {
      title: "QUANTITY",
      dataIndex: "variant_quantity",
      align: "right",
      render: (value, row, index) => {
        return [
          editable ? (
            <InputNumber
              min={0}
              max={row.variant_quantity_max}
              value={numeral(value).format("0,0")}
              onChange={(e) => {
                update_bundleorig_items_pricing(e, "variant_quantity", index);
              }}
              style={{ width: "100%" }}
            />
          ) : (
            numeral(value).format("0,0")
          ),
        ];
      },
    },
    {
      title: "SELLING PRICE",
      dataIndex: "variant_price",
      align: "right",
      render: (value, row, index) => {
        return [
          editable ? (
            <InputNumber
              value={numeral(value).format("0,0.00")}
              min={0}
              onChange={(e) => {
                update_bundleorig_items_pricing(e, "variant_price", index);
              }}
              style={{ width: "100%" }}
            />
          ) : (
            numeral(value).format("0,0.00")
          ),
        ];
      },
    },
  ];
  if (bundle == undefined) {
    return null;
  }

  return [
    <>
      <Modal
        title="Add Item"
        visible={add_item_modal}
        onOk={() => {
          submit_add_item();
        }}
        onCancel={() => {
          cancel_add_items();
        }}
      >
        <Row gutter={[16, 16]}>
          <Col span="24">
            <Text>Product</Text>
            <Select
              showSearch
              style={{ width: "100%", minWidth: 200 }}
              dropdownMatchSelectWidth={false}
              value={add_item_product_index}
              onChange={(e) => update_add_items_info(e)}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {variantArray.map((data, index) => {
                return [
                  <Option
                    key={data.key}
                    value={index}
                    disabled={data.variant_quantity_max == 0 ? true : false}
                    title="no Stock"
                  >
                    {data.variant_name}
                  </Option>,
                ];
              })}
            </Select>
          </Col>
          <Col span="24">
            <Text>Purchase Cost : </Text>
            <Text strong>
              {add_item_product
                ? numeral(add_item_product.variant_supplier_price).format(
                    "0,0.00"
                  )
                : ""}
            </Text>
          </Col>
          <Col span="24">
            <Text>Markup : </Text>
            <Text strong>
              {add_item_product ? add_item_product.variant_markup + "%" : ""}
            </Text>
          </Col>
          <Col span="24">
            <Text>Quantity</Text>
            <InputNumber
              style={{ width: "100%" }}
              onChange={(e) => update_add_items_digits(e, "variant_quantity")}
              value={add_item_product ? add_item_product.variant_quantity : ""}
            />
          </Col>
          <Col span="24">
            <Text>Selling Price</Text>
            <InputNumber
              style={{ width: "100%" }}
              onChange={(e) => update_add_items_digits(e, "variant_price")}
              value={
                add_item_product
                  ? numeral(add_item_product.variant_price).format("0,0.00")
                  : ""
              }
            />
          </Col>
        </Row>
      </Modal>
      <Row align="middle" style={{ padding: 10 }}>
        <Col span="24">
          <Space>
            <Button
              type={editable ? "danger" : "default"}
              onClick={() => {
                edit_bundle(cloneDeep(bundle));
              }}
            >
              {editable ? <StopOutlined /> : <EditOutlined />}
            </Button>
            {editable ? (
              <Button
                type="primary"
                onClick={() => {
                  submit_Changes();
                }}
              >
                <CheckOutlined /> Save
              </Button>
            ) : (
              <>
                <Button
                  type="primary"
                  onClick={() => {
                    open_add_item_modal();
                  }}
                >
                  <PlusOutlined />
                  Add Item
                </Button>
                {bundle.active ? (
                  <Button
                    type="danger"
                    onClick={() => {
                      toogle_bundle(false);
                    }}
                  >
                    Disable
                  </Button>
                ) : (
                  <Button
                    className="ant-btn-succcess"
                    onClick={() => {
                      toogle_bundle(true);
                    }}
                  >
                    Enable
                  </Button>
                )}
              </>
            )}
          </Space>
        </Col>
      </Row>

      <Divider style={{ marginTop: "0px" }} />
      <Row style={{ paddingLeft: 20 }} gutter={[0, 24]}>
        <Col span="24">
          {editable ? (
            <Input
              value={bundleorig.name}
              onChange={(e) => update_bundleorig(e.target.value, "name")}
            />
          ) : (
            <Title level={3} style={{ marginBottom: "2px" }}>
              {bundle.name}
            </Title>
          )}

          <Text type="secondary">
            {bundle.bundle_items.length}{" "}
            {bundle.bundle_items.length > 1 ? "items" : "item"}
          </Text>
        </Col>
        <Col span="24">
          <table className="bundlecustomtable-w-40">
            <tbody>
              <tr>
                <td width="10%">
                  <Text>Brand </Text>
                </td>
                <td>
                  {editable ? (
                    <Input
                      value={bundleorig.brand}
                      style={{ width: "fit-content", display: "block" }}
                      onChange={(e) =>
                        update_bundleorig(e.target.value, "brand")
                      }
                    />
                  ) : (
                    <Text strong>{bundle.brand} </Text>
                  )}
                </td>
              </tr>
              <tr>
                <td width="10%">
                  <Text>Tags </Text>
                </td>
                <td>
                  {editable ? (
                    <Select
                      mode="tags"
                      style={{ width: "100%" }}
                      placeholder="Enter Tags here"
                      onChange={(e) => {
                        update_bundleorig(e, "tags");
                      }}
                      value={bundleorig.tags}
                    >
                      {tags.map((tag) => (
                        <Option key={tag.id} value={tag.product_tag_name}>
                          {tag.product_tag_name}
                        </Option>
                      ))}
                    </Select>
                  ) : bundle.product_tags && bundle.product_tags.length != 0 ? (
                    bundle.product_tags.map((data, index) => {
                      return [<Tag color="#108ee9">{data.tag_label} </Tag>];
                    })
                  ) : null}
                </td>
              </tr>
              <tr>
                <td width="10%">
                  <Text>Category </Text>
                </td>
                <td>
                  {editable ? (
                    <Select
                      showSearch
                      style={{ width: "100%" }}
                      value={bundleorig.category}
                      onChange={(e) => update_bundleorig(e, "category")}
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {product_tytpes.map((row, index) => {
                        return [
                          <Option key={index} value={row._id}>
                            {row.product_type_name}
                          </Option>,
                        ];
                      })}
                    </Select>
                  ) : (
                    <Text strong>
                      {bundle.product_type != null &&
                      bundle.product_type &&
                      bundle.product_type.length != 0
                        ? bundle.product_type[0].product_type_name
                        : ""}{" "}
                    </Text>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </Col>
        <Col span="24">
          <table className="bundlecustomtable-w-40">
            <tbody>
              <tr>
                <td>
                  <Text>Description </Text>
                </td>
              </tr>
              <tr>
                <td>
                  {editable ? (
                    <TextArea
                      value={bundleorig.description}
                      onChange={(e) => {
                        update_bundleorig(e.target.value, "description");
                      }}
                    />
                  ) : (
                    <Text strong>{bundle.description} </Text>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </Col>
        <Col span="24">
          <Table
            columns={columns}
            dataSource={
              editable ? bundleorig.bundle_items : bundle.bundle_items
            }
            pagination={{ position: ["bottomCenter"], size: "small" }}
          />
        </Col>
      </Row>
    </>,
  ];
}

export default BundleList;
