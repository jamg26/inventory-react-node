import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
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
} from "antd";
import Labels from "../../../global-components/labels";
import moment from "moment";
import numeral from "numeral";
import {
  ThunderboltOutlined,
  FileSearchOutlined,
  CheckOutlined,
  AppstoreAddOutlined,
  BranchesOutlined,
  InboxOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { UserContext, SettingContext } from "../../../../routes/routes";
import { api_base_url, api_base_url_products } from "../../../../keys/index";
import PrivateStaffNote from "../shared/private_staff_note";
import axios from "axios";
const { Search } = Input;
const { Text } = Typography;
const { Dragger } = Upload;
const { Option } = Select;
function AddBundle({ SupplierList }) {
  const [variant, setVariant] = useState([]);
  const [product, setProduct] = useState([]);
  const labelStyle = {
    fontWeight: "bold",
  };
  //states of product
  const [reorder_point, setreorder_point] = useState(10);
  const [reorder_amount, setreorder_amount] = useState(0);
  const [manualselection, setmanualselection] = useState(true);
  const [productName, setProductName] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [productType, setProductType] = useState(null);
  const [productBrand, setProductBrand] = useState("");
  const [productSupplier, setProductSupplier] = useState(null);
  const [productSupplierCode, setProductSupplierCode] = useState(null);
  const [productSKU, setProductSKU] = useState("");
  const [productBarcode, setProductBarcode] = useState("");
  const [productInitialStock, setProductInitialStock] = useState(0);
  const [productSupplyPrice, setProductSupplyPrice] = useState(0);
  const [prodMarkup, setProdMarkup] = useState(0);
  const [total_bundle_price, set_total_bundle_price] = useState(0);
  const [imageFile, setImageFile] = useState(undefined);
  const originColor = "#dfe4e6";
  const [colorBorder, setColorBorder] = useState(originColor);
  const [inputValue, setInputValue] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [variantArray, setVariantArray] = useState([]);
  const [productselectionproduct, setproductselectionproduct] = useState(null);
  const addTag = (value) => {
    setSelectedTags(value);

    //setInputTag("");
  };
  const changeColor = () => {
    setColorBorder("#23a4eb");
  };
  const changeBackColor = () => {
    setColorBorder(originColor);
  };
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };
  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };
  const propsDragger = {
    showUploadList: false,
    name: "file",
    onChange(info) {
      const { status } = info.file;
      console.log(info.file);
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        getBase64(info.file.originFileObj, (imageUrl) => {
          setImageFile(imageUrl);
        });
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  const [tags, setTags] = useState([]);
  const [product_tytpes, setproduct_tytpes] = useState([]);
  const [selected_products, setselected_products] = useState([]);
  const [newProductType, setnewProductType] = useState("");
  const [invalid_bundle_name, setinvalid_bundle_name] = useState(false);
  const [conditionalfilterresults, setconditionalfilterresults] = useState([]);
  const [conditionData, setconditionData] = useState([
    {
      key: 0,
      category: "",
      conditional_expression: "==",
      keyword: "",
    },
  ]);
  const add_conditional_expression = () => {
    let con = [...conditionData];
    con.push({
      key: conditionData.length,
      category: "",
      conditional_expression: "==",
      keyword: "",
    });
    setconditionData(con);
  };
  const modify_conditional_expression = (index, value, column) => {
    let con = [...conditionData];
    con[index][column] = value;
    setconditionData(con);
  };
  const remove_conditional_expression = (index) => {
    let con = [...conditionData];
    con.splice(index, 1);
    setconditionData(con);
  };
  const compare = (field, operator, value) => {
    switch (operator) {
      case ">":
        return field > value;
      case "<":
        return field < value;
      case ">=":
        return field >= value;
      case "<=":
        return field <= value;
      case "==":
        return field == value;
      case "!=":
        return field != value;
      case "===":
        return field === value;
      case "!==":
        return field !== value;
    }
  };
  const filter_results = () => {
    let temp_container = [];
    for (let c = 0; c < variantArray.length; c++) {
      let inscope = true;
      for (let x = 0; x < conditionData.length; x++) {
        if (
          conditionData[x].category == "variant_price" ||
          conditionData[x].category == "variant_quantity_max"
        ) {
          if (
            compare(
              parseFloat(variantArray[c][conditionData[x].category]),
              conditionData[x].conditional_expression,
              parseFloat(conditionData[x].keyword)
            )
          ) {
          } else {
            inscope = false;
            break;
          }
        } else if (conditionData[x].category != "Tags") {
          if (
            compare(
              variantArray[c][conditionData[x].category],
              conditionData[x].conditional_expression,
              conditionData[x].keyword
            )
          ) {
          } else {
            inscope = false;
            break;
          }
        } else {
          if (
            variantArray[c].product_tags &&
            variantArray[c].product_tags.length != 0
          ) {
            for (let z = 0; z < variantArray[c].product_tags.length; z++) {
              const element = variantArray[c].product_tags[z];
              if (
                compare(
                  variantArray[c].product_tags[z],
                  conditionData[x].conditional_expression,
                  conditionData[x].keyword
                )
              ) {
              } else {
                inscope = false;
                break;
              }
            }
          }
        }
      }
      if (inscope) {
        temp_container.push(variantArray[c]);
      }
    }
    setconditionalfilterresults(temp_container);
  };
  useEffect(() => {
    setconditionData([
      { key: 0, category: "", conditional_expression: "==", keyword: "" },
    ]);
    setproductselectionproduct(null);
    setselected_products([]);
  }, [manualselection]);
  useEffect(() => {
    retrieveAllActiveTags();
    get_product_types();
    retrieveAllVariants();
  }, []);
  useEffect(() => {
    console.log("conditionalfilterresults", conditionalfilterresults);
  }, [conditionalfilterresults]);
  const clearAddBundleInputs = () => {
    setreorder_amount(0);
    setreorder_point(10);
    setProductName("");
    setProductDesc("");
    setProductType("");
    setInputValue("");
    setSelectedTags([]);
    setImageFile("");
    setProductBrand("");
    setProductSupplier("");
    setProductSupplierCode("");
    setProductSKU("");
    setProductBarcode("");
    setProductInitialStock("");
    setProductSupplyPrice("");
    setProdMarkup("");
    setproductselectionproduct(null);
    setColorBorder([]);
    setselected_products([]);
    setmanualselection(true);
  };
  const retrieveAllVariants = () => {
    axios
      .get(api_base_url_products + "/products")
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
  const retrieveAllActiveTags = () => {
    axios
      .get(api_base_url_products + "/product_tags/active")
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
      .get(api_base_url_products + "/product_type_list")
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
          api_base_url_products + "/add_new_product_type",
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
  const add_to_bundle = (index) => {
    console.log(variantArray[index]);
    if (index != null) {
      let alreadyin = false;

      for (let c = 0; c < selected_products.length; c++) {
        if (selected_products[c].key == variantArray[index].key) {
          alreadyin = true;
          break;
        } else {
        }
      }
      console.log("alreadyin", alreadyin);
      if (alreadyin == false) {
        let row = [...selected_products];
        row.push(variantArray[index]);
        console.log("row", row);
        setselected_products(row);
      }
    }
  };
  const remove_from_bundle = (index) => {
    let row = [...selected_products];
    row.splice(index, 1);
    setselected_products(row);
  };
  const submitAddBundle = async () => {
    if (productName == "") {
      message.error("Please provide a Bundle Name");
      setinvalid_bundle_name(true);
    } else {
      setinvalid_bundle_name(false);
      if (selected_products.length == 0) {
        message.error("Please provide a product/s for this Bundle");
      } else {
        let selectedt = [];
        for (let c = 0; c < selectedTags.length; c++) {
          selectedt.push({
            id: c,
            tag_label: selectedTags[c],
          });
        }
        let webadmin_login_token = localStorage.getItem("webadmin_login_token");
        const headers = {
          "Content-Type": "application/json",
        };
        const response = await axios
          .post(
            api_base_url_products + "/bundles/add_to_bundle",
            {
              login_token: webadmin_login_token,
              name: productName,
              description: productDesc,
              tags: selectedt,
              image: imageFile,
              type: productType,
              items: selected_products,
              product_selection: manualselection,
              bundle_total: total_bundle_price,
              brand: productBrand,
              supplier: productSupplier,
              supplier_code: productSupplierCode,
              sku: productSKU,
              barcode: productBarcode,
              initial_stock: productInitialStock,
            },
            { headers: headers }
          )
          .then((response) => {
            message.success(response.data.message);
            clearAddBundleInputs();
          })
          .catch((err) => {
            message.error(err.response.data.message);
          });
      }
    }
  };
  useEffect(() => {
    let total_price = 0;
    for (let x = 0; x < selected_products.length; x++) {
      total_price =
        parseFloat(total_price) +
        parseFloat(selected_products[x].variant_price);
    }
    set_total_bundle_price(total_price);
  }, [selected_products]);
  const update_bundle_item = (column, value, index) => {
    let row = [...selected_products];
    row[index][column] = value;
    setselected_products(row);
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: "variant_name",
      width: "16%",
    },
    {
      title: "SKU",
      dataIndex: "variant_sku",
    },
    {
      title: "Supplier Price",
      dataIndex: "variant_supplier_price",
      render: (value) => {
        return [numeral(value).format("0,0.00")];
      },
      width: "11%",
    },
    {
      title: "Markup(%)",
      dataIndex: "variant_markup",
      render: (value) => {
        return [numeral(value).format("0.00") + "%"];
      },
      width: "8%",
    },
    {
      title: "Retail Price(w/o tax)",
      dataIndex: "variant_price_without_tax",
      render: (value) => {
        return [numeral(value).format("0,0.00")];
      },
      width: "11%",
    },
    {
      title: "Sales Tax",
      dataIndex: "variant_price_with_tax",
      render: (value) => {
        return [numeral(value).format("0,0.00")];
      },
      width: "11%",
    },
    {
      title: "Quantity",
      dataIndex: "variant_quantity",
      render: (value, row, index) => {
        return [
          <InputNumber
            min={0}
            max={row.variant_quantity_max}
            value={numeral(value).format("0,0")}
            onChange={(e) => {
              update_bundle_item("variant_quantity", e, index);
            }}
            style={{ width: "100%" }}
          />,
        ];
      },
      width: "11%",
    },
    {
      title: "Final Retail Price",
      dataIndex: "variant_price",
      render: (value, row, index) => {
        return [
          <InputNumber
            value={numeral(value).format("0,0.00")}
            min={0}
            onChange={(e) => {
              update_bundle_item("variant_price", e, index);
            }}
            style={{ width: "100%" }}
          />,
        ];
      },
      width: "11%",
    },
    {
      title: "Action",
      dataIndex: "key",
      render: (value, row, index) => {
        return [
          <Button
            type="link"
            onClick={() => {
              remove_from_bundle(index);
            }}
          >
            Remove
          </Button>,
        ];
      },
      width: "11%",
    },
  ];
  const columnsfilteredresult = [
    {
      title: "Image",
      dataIndex: "variant_image",
      width: "5%",
      render: (value) => {
        return [<img src={value} style={{ width: "100%" }} />];
      },
    },
    {
      title: "Name",
      dataIndex: "product_name",
      width: "10%",
      render: (value, row, index) => {
        return [
          <Space direction="vertical">
            <Text strong>{value}</Text>
            <Text type="secondary">{row.product_description}</Text>
          </Space>,
        ];
      },
    },
    {
      title: "SKU",
      dataIndex: "variant_sku",
    },
    {
      title: "Type",
      dataIndex: "product_type",
    },
    {
      title: "Tags",
      dataIndex: "product_tags",
      render: (value) => {
        return [
          value.map((data, index) => {
            return [data.tag_label + " \n"];
          }),
        ];
      },
    },
    {
      title: "Brand",
      dataIndex: "variant_brand",
    },
    {
      title: "Variant",
      dataIndex: "variant_name",
    },
    {
      title: "In Stock",
      dataIndex: "variant_quantity_max",
      render: (value) => {
        return [value == 0 ? "Out of Stock" : numeral(value).format("0,0")];
      },
    },
    {
      title: "Price",
      dataIndex: "variant_price",
      render: (value, row, index) => {
        return [numeral(value).format("0,0.00")];
      },
    },
    {
      title: "Supplier",
      dataIndex: "product_supplier",
    },
    {
      title: "Action",
      dataIndex: "key",
      render: (value, row, index) => {
        return [
          <Button
            disabled={row.variant_quantity_max == 0 ? true : false}
            type="link"
            onClick={() => {
              add_to_bundle(row.index);
            }}
          >
            Add to Bundle List
          </Button>,
        ];
      },
      width: "11%",
    },
  ];
  const conditioncolumns = [
    {
      title: "Category",
      dataIndex: "category",
      render: (value, row, index) => {
        return [
          <Select
            showSearch
            style={{ width: "100%", minWidth: 200 }}
            dropdownMatchSelectWidth={false}
            value={value}
            onChange={(e) =>
              modify_conditional_expression(index, e, "category")
            }
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option value="product_name">Product Name</Option>
            <Option value="variant_sku">SKU</Option>
            <Option value="product_type">Type</Option>
            <Option value="product_brand">Brand</Option>
            <Option value="Tags">Tags</Option>
            <Option value="variant_price">Price</Option>
            <Option value="variant_quantity_max">Inventory Stock</Option>
            <Option value="variant_name">Variant Name</Option>
            <Option value="product_supplier">Supplier</Option>
          </Select>,
        ];
      },
    },
    {
      title: "Conditional Match",
      dataIndex: "conditional_expression",
      render: (value, row, index) => {
        return [
          <Select
            showSearch
            style={{ width: "100%", minWidth: 200 }}
            dropdownMatchSelectWidth={false}
            value={value}
            onChange={(e) =>
              modify_conditional_expression(index, e, "conditional_expression")
            }
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option value="==">is equal to</Option>
            {row.category == "variant_price" ||
            row.category == "variant_quantity_max" ? (
              <>
                <Option value="<">is lower than</Option>
                <Option value=">">is greater than</Option>
              </>
            ) : null}
          </Select>,
        ];
      },
    },
    {
      title: "Keyword Match",
      dataIndex: "keyword",
      render: (value, row, index) => {
        return [
          <Input
            value={value}
            onChange={(e) =>
              modify_conditional_expression(index, e.target.value, "keyword")
            }
          />,
        ];
      },
    },
    {
      title: "Action",
      dataIndex: "key",
      render: (value, row, index) => {
        return [
          <Button
            type="link"
            onClick={() => {
              remove_conditional_expression(index);
            }}
          >
            Remove
          </Button>,
        ];
      },
    },
  ];
  return [
    <>
      <Space direction="vertical" style={{ width: "100%" }}>
        <div
          style={{
            borderTop: "1px solid black",
            fontWeight: "bold",
            fontSize: "17px",
            color: "black",
            backgroundColor: "#e1e4e8",
            padding: "10px 10px 10px 40px",
          }}
        >
          Add Bundle
        </div>
        <div style={{ padding: "15px 0px 0px 0px", display: "flex" }}>
          <div style={{ width: "55%" }}>
            <div style={{ backgroundColor: "#edf1f5", padding: "40px" }}>
              <Row gutter={[16, 16]}>
                <Col span="12">
                  <Space
                    direction="vertical"
                    style={{ width: "100%" }}
                    size={2}
                  >
                    <label style={labelStyle}>
                      Bundle Name<label style={{ color: "red" }}>*</label>
                    </label>
                    <Input
                      className={
                        invalid_bundle_name ? "invalid_input" : "valid_input"
                      }
                      value={productName}
                      onPressEnter={(e) => e.preventDefault()}
                      onChange={(e) => setProductName(e.target.value)}
                      type="text"
                    />
                  </Space>
                </Col>
                <Col span="3"></Col>
                <Col span="9"></Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span="12">
                  <Space
                    direction="vertical"
                    style={{ width: "100%" }}
                    size={2}
                  >
                    <label style={labelStyle}>Description</label>
                    <Input
                      value={productDesc}
                      onPressEnter={(e) => e.preventDefault()}
                      onChange={(e) => setProductDesc(e.target.value)}
                      type="text"
                    />
                  </Space>
                </Col>
                <Col span="3"></Col>
                <Col span="9"></Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span="12">
                  <Space
                    direction="vertical"
                    style={{ width: "100%" }}
                    size={2}
                  >
                    <label style={labelStyle}>Tags</label>
                    <Select
                      mode="tags"
                      style={{ width: "100%" }}
                      placeholder="Enter Tags here"
                      onChange={addTag}
                      value={selectedTags}
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
                  <Space
                    direction="vertical"
                    style={{ width: "100%" }}
                    size={2}
                  >
                    <label style={labelStyle}>Product Type</label>
                    <Select
                      showSearch
                      style={{ width: "100%" }}
                      value={productType}
                      onChange={(e) => setProductType(e)}
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      dropdownRender={(menu) => (
                        <div>
                          <Row
                            gutter={5}
                            style={{ marginRight: 5, marginLeft: 5 }}
                          >
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
                  <Space
                    direction="vertical"
                    style={{ width: "100%" }}
                    size={2}
                  >
                    <label style={labelStyle}>Brand</label>
                    <Input
                      value={productBrand}
                      onChange={(e) => setProductBrand(e.target.value)}
                      type="text"
                    />
                  </Space>
                </Col>
                <Col span="3"></Col>
                <Col span="9"></Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span="12">
                  <Space
                    direction="vertical"
                    style={{ width: "100%" }}
                    size={2}
                  >
                    <label style={labelStyle}>Supplier</label>
                    <Select
                      showSearch
                      style={{ width: "100%" }}
                      value={productSupplier}
                      onChange={(e) => {
                        setProductSupplier(e);
                        setProductSupplierCode(e);
                      }}
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
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
                  <Space
                    direction="vertical"
                    style={{ width: "100%" }}
                    size={2}
                  >
                    <label style={labelStyle}>Supplier Code</label>
                    <Select
                      showSearch
                      style={{ width: "100%" }}
                      value={productSupplierCode}
                      onChange={(e) => {
                        setProductSupplier(e);
                        setProductSupplierCode(e);
                      }}
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
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
                  <Space
                    direction="vertical"
                    style={{ width: "100%" }}
                    size={2}
                  >
                    <label style={labelStyle}>SKU</label>
                    <Input
                      value={productSKU}
                      onChange={(e) => setProductSKU(e.target.value)}
                      type="text"
                    />
                  </Space>
                </Col>
                <Col span="3"></Col>
                <Col span="9">
                  <Space
                    direction="vertical"
                    style={{ width: "100%" }}
                    size={2}
                  >
                    <label style={labelStyle}>Barcode</label>
                    <Input
                      value={productBarcode}
                      onChange={(e) => setProductBarcode(e.target.value)}
                      type="text"
                    />
                  </Space>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span="12">
                  <Space
                    direction="vertical"
                    style={{ width: "100%" }}
                    size={2}
                  >
                    <label style={labelStyle}>Initial stock</label>
                    <InputNumber
                      style={{ width: "100%" }}
                      value={productInitialStock}
                      min={0}
                      onChange={(e) => setProductInitialStock(e)}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    />
                  </Space>
                </Col>
                <Col span="3"></Col>
                <Col span="9"></Col>
              </Row>
            </div>
          </div>
          <div style={{ flexGrow: 1, width: "45%", padding: "10px" }}>
            <Text>Upload Image</Text>
            <Space
              direction="vertical"
              style={{ width: "100%", textAlign: "center" }}
            >
              {imageFile ? (
                <img src={imageFile} style={{ width: "80%" }} />
              ) : (
                <Empty />
              )}
              <Dragger
                {...propsDragger}
                beforeUpload={beforeUpload}
                customRequest={dummyRequest}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Support for a single upload. Strictly prohibit from uploading
                  company data or other band files
                </p>
              </Dragger>
            </Space>
          </div>
        </div>
        <div
          style={{
            backgroundColor: "#edf1f5",
            padding: "20px",
            marginTop: "8px",
          }}
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            <Text style={{ marginLeft: "20px" }} strong>
              Product Selection
            </Text>
            <Space style={{ marginLeft: "20px" }}>
              <Switch
                checked={manualselection}
                onChange={(value) => setmanualselection(value)}
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
              />
              <Text>Manual product selection</Text>
            </Space>
            <Space style={{ marginLeft: "20px" }}>
              <Switch
                checked={!manualselection}
                onChange={(value) => setmanualselection(!value)}
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
              />
              <Text>Select Product based on conditions</Text>
            </Space>
            {manualselection ? null : (
              <>
                <Card>
                  <Row gutter={[16, 16]}>
                    <Col span="20">
                      <Table
                        columns={conditioncolumns}
                        dataSource={conditionData}
                        pagination={false}
                      />
                    </Col>
                  </Row>
                  <Row gutter={[16, 16]}>
                    <Col span="20">
                      <Button
                        type="primary"
                        onClick={() => {
                          add_conditional_expression();
                        }}
                      >
                        Add New Condition
                      </Button>
                    </Col>
                  </Row>
                  <Row gutter={[16, 16]}>
                    <Col span="20" style={{ textAlign: "right" }}>
                      <Button
                        type="primary"
                        onClick={() => {
                          filter_results();
                        }}
                      >
                        Filter Results
                      </Button>
                    </Col>
                  </Row>
                </Card>
                <Card>
                  <Row gutter={[16, 16]}>
                    <Col span="24">
                      <Table
                        columns={columnsfilteredresult}
                        dataSource={conditionalfilterresults}
                        pagination={false}
                      />
                    </Col>
                  </Row>
                </Card>
              </>
            )}
            <Card>
              {manualselection ? (
                <Row gutter={[16, 16]}>
                  <Col span="24">
                    <Space align="end" style={{ width: "100%" }}>
                      <Space direction="vertical">
                        <Text>Products</Text>
                        <Select
                          showSearch
                          style={{ width: "100%", minWidth: 200 }}
                          dropdownMatchSelectWidth={false}
                          value={productselectionproduct}
                          onChange={(e) => setproductselectionproduct(e)}
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
                                value={index}
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
                      </Space>
                      <Space direction="vertical">
                        <Button
                          type="primary"
                          onClick={() => {
                            add_to_bundle(productselectionproduct);

                            setproductselectionproduct(null);
                          }}
                        >
                          Add to Bundle List
                        </Button>
                      </Space>
                    </Space>
                  </Col>
                </Row>
              ) : (
                <Row gutter={[16, 16]}>
                  <Col span="24"></Col>
                </Row>
              )}

              <Row gutter={[16, 16]}>
                <Col span="24">
                  <Text style={{ marginTop: "20px" }} strong>
                    Bundle List
                  </Text>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span="24">
                  <Table
                    columns={columns}
                    dataSource={selected_products}
                    bordered
                    pagination={{ position: ["bottomCenter"], size: "small" }}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span="10">
                  <table className="bundlecustomtable">
                    <tbody>
                      <tr>
                        <th width="40%">Bundle Name</th>
                        <td width="60%">{productName}</td>
                      </tr>
                      <tr>
                        <th>Bundle Final Retail Price</th>
                        <td>{numeral(total_bundle_price).format("0,0.00")}</td>
                      </tr>
                    </tbody>
                  </table>
                </Col>
              </Row>
            </Card>
          </Space>
        </div>
        <Row gutter={[16, 16]} style={{ marginTop: "10px" }}>
          <Col span="24" style={{ textAlign: "right" }}>
            <Space>
              <Button
                type="default"
                onClick={() => {
                  clearAddBundleInputs();
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  submitAddBundle();
                }}
              >
                Save New Bundle
              </Button>
            </Space>
          </Col>
        </Row>
      </Space>
    </>,
  ];
}
export default AddBundle;
