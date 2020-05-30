import React, { useState, useEffect } from "react";
import {
  Input,
  Col,
  AutoComplete,
  Row,
  Select,
  Space,
  InputNumber,
  Divider,
  Button,
  message,
} from "antd";
import axios from "axios";
import { api_base_url, api_base_url_orders } from "../../../../keys/index";
import { PlusSquareOutlined } from "@ant-design/icons";
//import Tags from './product_tags';

const { Option } = AutoComplete;
function AddProduct(props) {
  const {
    reorder_point,
    setreorder_point,
    reorder_amount,
    setreorder_amount,
    SupplierList,
    prodName,
    setProdName,
    prodDesc,
    setProdDesc,
    prodType,
    setProdType,
    prodBrand,
    setProdBrand,
    prodSupp,
    setProdSupp,
    prodSuppCode,
    setProdSuppCode,
    prodSKU,
    setProdSKU,
    prodBcode,
    setProdBcode,
    prodIniStock,
    setProdIniStock,
    prodSuppPrice,
    setProdSuppPrice,
    inputTag,
    setInputTag,
    handleInput,
    selectTag,
    setSelectTag,
    markup,
    setMarkup,
  } = props;

  const labelStyle = {
    fontWeight: "bold",
  };
  const [tags, setTags] = useState([]);
  const [product_tytpes, setproduct_tytpes] = useState([]);
  const [newProductType, setnewProductType] = useState("");
  useEffect(() => {
    retrieveAllActiveTags();
    get_product_types();
  }, []);

  const retrieveAllActiveTags = () => {
    axios
      .get(api_base_url_orders + "/product_tags/active")
      .then((res) => {
        setTags(res.data);
        console.log(res.data);
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
  const submitNewProductType = async () => {
    if (newProductType == "") {
      message.error("please provide a product type name");
    } else {
      const headers = {
        "Content-Type": "application/json",
      };
      const response = await axios
        .post(
          api_base_url_orders + "/add_new_product_type",
          {
            newProductType: newProductType,
          },
          { headers: headers }
        )
        .then((response) => {
          message.success(response.data.message);
          get_product_types();
          setnewProductType();
        })
        .catch((err) => {
          message.error(err.response.data.message);
          setnewProductType();
        });
    }
  };
  const addTag = (value) => {
    setSelectTag(value);

    //setInputTag("");
  };
  useEffect(() => {
    console.log("selectTag", selectTag);
  }, [selectTag]);
  return (
    <div style={{ backgroundColor: "#edf1f5", padding: "40px" }}>
      <Row gutter={[16, 16]}>
        <Col span="12">
          <Space direction="vertical" style={{ width: "100%" }} size={2}>
            <label style={labelStyle}>
              Name<label style={{ color: "red" }}>*</label>
            </label>
            <Input
              value={prodName}
              onPressEnter={(e) => e.preventDefault()}
              onChange={(e) => setProdName(e.target.value)}
              type="text"
            />
          </Space>
        </Col>
        <Col span="3"></Col>
        <Col span="9"></Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span="12">
          <Space direction="vertical" style={{ width: "100%" }} size={2}>
            <label style={labelStyle}>Description</label>
            <Input
              value={prodDesc}
              onPressEnter={(e) => e.preventDefault()}
              onChange={(e) => setProdDesc(e.target.value)}
              type="text"
            />
          </Space>
        </Col>
        <Col span="3"></Col>
        <Col span="9"></Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span="12">
          <Space direction="vertical" style={{ width: "100%" }} size={2}>
            <label style={labelStyle}>Tags</label>
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Enter Tags here"
              onChange={addTag}
              value={selectTag}
            >
              {tags.map((tag) => (
                <Option key={tag.id} value={tag.product_tag_name}>
                  {tag.product_tag_name}
                </Option>
              ))}
            </Select>
          </Space>
        </Col>
        <Col span="3"></Col>
        <Col span="9"></Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span="12">
          <Space direction="vertical" style={{ width: "100%" }} size={2}>
            <label style={labelStyle}>Product Type</label>
            <Select
              showSearch
              style={{ width: "100%" }}
              value={prodType}
              onChange={(e) => setProdType(e)}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              dropdownRender={(menu) => (
                <div>
                  <Row gutter={5} style={{ marginRight: 5, marginLeft: 5 }}>
                    <Col span="20">
                      <Input
                        value={newProductType}
                        onChange={(e) => {
                          setnewProductType(e.target.value);
                        }}
                        size="small"
                        style={{ width: "100%" }}
                        placeholder="add new Product Type"
                      />
                    </Col>
                    <Col span="4">
                      <Button
                        size={"small"}
                        type="default"
                        block
                        onClick={() => {
                          submitNewProductType();
                        }}
                      >
                        Add
                      </Button>
                    </Col>
                  </Row>

                  <Divider style={{ margin: "4px 0" }} />
                  {menu}
                </div>
              )}
            >
              {product_tytpes.map((row, index) => {
                return [
                  <Option key={index} value={row._id}>
                    {row.product_type_name}
                  </Option>,
                ];
              })}
            </Select>
          </Space>
        </Col>
        <Col span="3"></Col>
        <Col span="9"></Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span="12">
          <Space direction="vertical" style={{ width: "100%" }} size={2}>
            <label style={labelStyle}>Brand</label>
            <Input
              value={prodBrand}
              onChange={(e) => setProdBrand(e.target.value)}
              type="text"
            />
          </Space>
        </Col>
        <Col span="3"></Col>
        <Col span="9"></Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span="12">
          <Space direction="vertical" style={{ width: "100%" }} size={2}>
            <label style={labelStyle}>Supplier</label>
            <Select
              showSearch
              style={{ width: "100%" }}
              value={prodSupp}
              onChange={(e) => {
                setProdSupp(e);
                setProdSuppCode(e);
              }}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {SupplierList.map((row, index) => {
                return [
                  <Option key={index} value={row._id}>
                    {row.display_name}
                  </Option>,
                ];
              })}
            </Select>
          </Space>
        </Col>
        <Col span="3"></Col>
        <Col span="9">
          <Space direction="vertical" style={{ width: "100%" }} size={2}>
            <label style={labelStyle}>Supplier Code</label>
            <Select
              showSearch
              style={{ width: "100%" }}
              value={prodSuppCode}
              onChange={(e) => {
                setProdSupp(e);
                setProdSuppCode(e);
              }}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {SupplierList.map((row, index) => {
                return [
                  <Option key={index} value={row._id}>
                    {row.supplier_code}
                  </Option>,
                ];
              })}
            </Select>
          </Space>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span="12">
          <Space direction="vertical" style={{ width: "100%" }} size={2}>
            <label style={labelStyle}>SKU</label>
            <Input
              value={prodSKU}
              onChange={(e) => setProdSKU(e.target.value)}
              type="text"
            />
          </Space>
        </Col>
        <Col span="3"></Col>
        <Col span="9">
          <Space direction="vertical" style={{ width: "100%" }} size={2}>
            <label style={labelStyle}>Barcode</label>
            <Input
              value={prodBcode}
              onChange={(e) => setProdBcode(e.target.value)}
              type="text"
            />
          </Space>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span="12">
          <Space direction="vertical" style={{ width: "100%" }} size={2}>
            <label style={labelStyle}>Initial stock</label>
            <InputNumber
              style={{ width: "100%" }}
              value={prodIniStock}
              min={0}
              onChange={(e) => setProdIniStock(e)}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Space>
        </Col>
        <Col span="3"></Col>
        <Col span="9">
          <Space direction="vertical" style={{ width: "100%" }} size={2}>
            <label style={labelStyle}>Reorder Point</label>
            <InputNumber
              style={{ width: "100%" }}
              value={reorder_point}
              min={0}
              onChange={(e) => setreorder_point(e)}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Space>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span="12"></Col>
        <Col span="3"></Col>
        <Col span="9">
          <Space direction="vertical" style={{ width: "100%" }} size={2}>
            <label style={labelStyle}>Reorder Amount</label>
            <InputNumber
              style={{ width: "100%" }}
              value={reorder_amount}
              min={0}
              onChange={(e) => setreorder_amount(e)}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Space>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span="12">
          <Space direction="vertical" style={{ width: "100%" }} size={2}>
            <label style={labelStyle}>Supply Price</label>
            <InputNumber
              style={{ width: "100%" }}
              value={prodSuppPrice}
              min={0}
              onChange={(e) => setProdSuppPrice(e)}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Space>
        </Col>
        <Col span="3"></Col>
        <Col span="9">
          <Space direction="vertical" style={{ width: "100%" }} size={2}>
            <label style={labelStyle}>Markup</label>
            <InputNumber
              style={{ width: "100%" }}
              value={markup}
              min={0}
              onChange={(e) => setMarkup(e)}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Space>
        </Col>
      </Row>
    </div>
  );
}

export default AddProduct;
