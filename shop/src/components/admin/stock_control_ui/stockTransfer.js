import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  Input,
  Button,
  Upload,
  message,
  Typography,
  DatePicker,
  InputNumber,
  Col,
  Row,
  Descriptions,
  Space,
  Select,
  Tooltip,
} from "antd";
import {
  CloseOutlined,
  CheckOutlined,
  CloseCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { api_base_url_products } from "../../../keys";
import { CSVLink } from "react-csv";
import ReactFileReader from "react-file-reader";
import axios from "axios";
import { UserContext, SettingContext } from "../../../routes/routes";
import moment from "moment";
import numeral from "numeral";
import Papa from "papaparse";
const Search = Input.Search;
const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

const EditableTable = ({ SupplierList, products, refresh }) => {
  var settings = useContext(SettingContext);
  const [product_variants, set_product_variants] = useState([]);
  const initialProductTagState = [
    {
      po_no: "ST-" + 1,
      ship_from: "",
      ship_to: "",
      delivery_due_date: moment().format(
        settings != undefined ? settings.date_format : "MM-DD-YYYY"
      ),
      quantity: 0,
    },
  ];
  const [filteredPurchaseOrderData, setfilteredPurchaseOrderData] = useState(
    []
  );
  const [subtotal, setsubtotal] = useState(0);
  const [vat, setvat] = useState(0);
  const [totalcost, settotalcost] = useState(0);

  useEffect(() => {
    let subto = 0;

    for (let c = 0; c < filteredPurchaseOrderData.length; c++) {
      const element = filteredPurchaseOrderData[c];
      subto =
        parseFloat(subto) + parseFloat(element.total != "" ? element.total : 0);
    }
    let va = 0;
    let totalco = parseFloat(va) + parseFloat(subto);
    setsubtotal(subto);
    setvat(va);
    settotalcost(totalco);
  }, [filteredPurchaseOrderData]);
  useEffect(() => {
    let temp = [];
    let counter = 0;
    for (let c = 0; c < products.length; c++) {
      if (products[c].active == true) {
        for (let x = 0; x < products[c].variants.length; x++) {
          if (products[c].variants[x].active == true) {
            temp.push({
              index: counter,
              product_id: products[c]._id,
              variant_id: products[c].variants[x]._id,
              title: products[c].variants[x].option_title,
              sku: products[c].variants[x].sku,
              max_quantity: products[c].variants[x].quantity,
              reorder_amount:
                products[c].variants[x].reorder_amount &&
                products[c].variants[x].reorder_amount != ""
                  ? products[c].variants[x].reorder_amount
                  : 1,
              supplier_price:
                products[c].variants[x].supplier_price &&
                products[c].variants[x].supplier_price != ""
                  ? products[c].variants[x].supplier_price
                  : 0,
              supplier_id:
                products[c].variants[x].supplier &&
                products[c].variants[x].supplier.length != 0
                  ? products[c].variants[x].supplier[0]._id
                  : "",
              supplier_name:
                products[c].variants[x].supplier &&
                products[c].variants[x].supplier.length != 0
                  ? products[c].variants[x].supplier[0].display_name
                  : "",
              supplier_code:
                products[c].variants[x].supplier &&
                products[c].variants[x].supplier.length != 0
                  ? products[c].variants[x].supplier[0].supplier_code
                  : "",
            });
            counter++;
          }
        }
      }
    }
    set_product_variants(temp);
  }, [products]);
  const [po_note, set_po_note] = useState("");
  const [TransferName, setTransferName] = useState("");
  const [TransferNameValidator, setTransferNameValidator] = useState(false);
  const [fetched, set_fetched] = useState(false);
  const [loading, setLoading] = useState(false);
  const dateFormat = "YYYY/MM/DD";
  const [editingIndex, setEditingIndex] = useState(undefined);
  const [editable, setEditable] = useState(false);
  const [purchaseOrderData, setpurchaseOrderData] = useState([]);
  const [search, setSearch] = useState("");

  const [toBeSaveData, setToBeSaveData] = useState();
  const [flag, setFlag] = useState(true);

  const [indexer, setIndexer] = useState(undefined);
  const [getTotal, setTotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [itemCost, setItemCost] = useState(0);

  const columns = [
    {
      title: "ST No.",
      dataIndex: "po_no",
      width: "7.09%",
      render: (value, row, index) => {
        return [
          <Input
            key={index}
            disabled={editable}
            value={value}
            onChange={(event) => setInput(event.target.value, index, "po_no")}
          />,
        ];
      },
    },
    {
      title: "Product Name",
      dataIndex: "product_name",
      width: "14.09%",
      render: (value, row, index) => {
        return [
          <Select
            value={value}
            showSearch
            style={{ width: "100%" }}
            maxTagTextLength={10}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            dropdownMatchSelectWidth={false}
            onChange={(event) => setInput(event, index, "product_name")}
          >
            {product_variants.map((row, index) => {
              return [
                <Option key={index} value={row.index}>
                  {row.title}
                </Option>,
              ];
            })}
          </Select>,
        ];
      },
    },

    {
      title: "SKU",
      dataIndex: "product_name",
      width: "5.09%",
      render: (value, row, index) => {
        return [value != "" ? product_variants[value].sku : ""];
      },
    },
    {
      title: "Supplier Code",
      dataIndex: "product_name",
      width: "14.09%",
      render: (value, row, index) => {
        return [value != "" ? product_variants[value].supplier_code : ""];
      },
    },
    {
      title: "Source Outlet",
      dataIndex: "ship_from",
      width: "9.09%",
      render: (value, result, index) => {
        return [
          <Input
            key={index}
            disabled={editable}
            value={result.ship_from}
            onChange={(event) => {
              setInput(event.target.value, index, "ship_from");
            }}
          />,
        ];
      },
    },
    {
      title: "Destination Outlet",
      dataIndex: "ship_to",
      width: "9.09%",
      render: (value, result, index) => {
        return [
          <Input
            key={index}
            disabled={editable}
            value={result.ship_to}
            onChange={(event) => {
              setInput(event.target.value, index, "ship_to");
            }}
          />,
        ];
      },
    },
    {
      title: "Delivery Due",
      dataIndex: "delivery_due_date",
      width: "9.09%",
      render: (value, result, index) => {
        return [
          <DatePicker
            format={dateFormat}
            defaultValue={moment(result.delivery_due_date, dateFormat)}
            key={index}
            disabled={editable}
            onChange={(event) => setInput(event, index, "delivery_due_date")}
          />,
        ];
      },
    },
    {
      title: "Source Stock Count",
      dataIndex: "product_name",
      width: "7.09%",
      align: "center",
      render: (value, result, index) => {
        return [
          <Typography key={index}>
            {numeral(
              value != "" ? product_variants[value].max_quantity : 0
            ).format("0,0")}
          </Typography>,
        ];
      },
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      width: "7.09%",
      render: (value, result, index) => {
        return [
          <InputNumber
            key={index}
            disabled={editable}
            min={0}
            max={
              result.product_name !== ""
                ? product_variants[result.product_name].max_quantity
                : 0
            }
            style={{ width: "100%" }}
            value={result.quantity}
            onChange={(event) => {
              setInput(event, index, "quantity");
            }}
          />,
        ];
      },
    },
    {
      title: "Item Cost",
      dataIndex: "item_cost",
      width: "9.09%",
      align: "right",
      render: (value, result, index) => {
        return [
          <Typography key={index}>
            {numeral(value).format("0,0.00")}
          </Typography>,
        ];
      },
    },
    {
      title: "Total",
      dataIndex: "total",
      width: "9.09%",
      align: "right",
      render: (value, result, index) => {
        return [
          <Typography key={index}>
            {numeral(value).format("0,0.00")}
          </Typography>,
        ];
      },
    },
    {
      title: "Action",
      dataIndex: "total",
      width: "5%",
      align: "center",
      render: (value, result, index) => {
        return [
          <Button
            type="link"
            onClick={() => {
              removeFileItem(index);
            }}
          >
            <CloseCircleOutlined />
          </Button>,
        ];
      },
    },
  ];
  const removeFileItem = (index) => {
    let tempdata = [...filteredPurchaseOrderData];
    console.log(index);
    var removed = tempdata.splice(index, 1);
    setfilteredPurchaseOrderData(tempdata);
  };

  const setInput = (value, index, column) => {
    let tempdata = [...filteredPurchaseOrderData];
    tempdata[index][column] = value;
    if (column == "product_name") {
      if (
        tempdata[index]["quantity"] == 0 ||
        tempdata[index]["quantity"] == ""
      ) {
        tempdata[index]["quantity"] = product_variants[value].reorder_amount;
      }

      tempdata[index]["item_cost"] = product_variants[value].supplier_price;
    }
    tempdata[index]["tax"] = 0;
    tempdata[index]["total"] =
      parseFloat(tempdata[index]["item_cost"]) *
        parseFloat(tempdata[index]["quantity"]) +
      parseFloat(tempdata[index]["tax"]);
    console.log(value, index, column);
    console.log(product_variants[value]);
    console.log(tempdata[index]);
    setfilteredPurchaseOrderData(tempdata);
  };

  // For Search Ni siya
  useEffect(() => {
    console.log(purchaseOrderData);
    setfilteredPurchaseOrderData(
      purchaseOrderData.filter(
        (data) =>
          data.po_no.toLowerCase().includes(search.toLowerCase()) ||
          data.invoice_no.toLowerCase().includes(search.toLowerCase()) ||
          data.type.toLowerCase().includes(search.toLowerCase()) ||
          data.bill_to.toLowerCase().includes(search.toLowerCase()) ||
          data.ship_to.toLowerCase().includes(search.toLowerCase()) ||
          data.ship_from.toLowerCase().includes(search.toLowerCase()) ||
          data.delivery_due_date.toLowerCase().includes(search.toLowerCase()) ||
          data.item_cost
            .toString()
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          data.quantity
            .toString()
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          data.tax.toString().toLowerCase().includes(search.toLowerCase()) ||
          data.total.toString().toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, purchaseOrderData]);
  // End of Search area

  //Add Row
  const handleAdd = () => {
    const countPo = filteredPurchaseOrderData.length + 1;

    const newData = {
      _id: undefined,
      key: countPo,
      po_no: "ST-" + countPo,
      invoice_no: countPo,
      product_name: "",
      bill_to: "",
      ship_from: "",
      ship_to: "",
      delivery_due_date: moment(),
      quantity: 0,
      item_cost: 0,
      tax: 0,
      total: 0,
    };
    setfilteredPurchaseOrderData([...filteredPurchaseOrderData, newData]);
    setToBeSaveData([newData]);
    setFlag(false);
  };
  /// FOR ADD NEW PURCHASE ORDER
  const handleSubmit = async (event) => {
    if (TransferName == "") {
      message.info("Please Add a Transfer Name");
      setTransferNameValidator(true);
    } else {
      setTransferNameValidator(false);
      let valid = 1;
      if (filteredPurchaseOrderData.length == 0) {
        message.info("Please Add an Item");
      } else {
        let temp = [];
        let webadmin_id = localStorage.getItem("webadmin_id");
        let webadmin_login_token = localStorage.getItem("webadmin_login_token");
        for (let c = 0; c < filteredPurchaseOrderData.length; c++) {
          const row = filteredPurchaseOrderData[c];
          if (
            row.po_no == "" ||
            row.invoice_no == "" ||
            row.product_name === "" ||
            row.ship_to == "" ||
            row.ship_from == "" ||
            row.delivery_due_date == "" ||
            row.delivery_due_date == null ||
            row.delivery_due_date == undefined ||
            row.quantity == ""
          ) {
            valid = 0;
            break;
          } else {
            temp.push({
              _id: row._id,
              po_no: row.po_no,
              invoice_no: row.invoice_no,
              supplier_note: po_note,
              total: row.total,
              product:
                row.product_name !== ""
                  ? product_variants[row.product_name].product_id
                  : undefined,
              variant:
                row.product_name !== ""
                  ? product_variants[row.product_name].variant_id
                  : undefined,
              supplier:
                row.product_name !== ""
                  ? product_variants[row.product_name].supplier_id
                  : undefined,
              bill_to: row.bill_to,
              stock_source: row.ship_from,
              ship_to: row.ship_to,
              delivery_due_date: row.delivery_due_date,
              quantity: row.quantity,
              item_cost: row.item_cost,
              tax: row.tax,
              entry_by: webadmin_id,
              type: "Stock Transfer",
              transfer_name: TransferName,
            });
          }
        }
        if (valid == 1) {
          const headers = {
            "Content-Type": "application/json",
          };
          const response = await axios
            .post(
              api_base_url_products + "/add_purchase_order_stock_transfer",
              {
                login_token: webadmin_login_token,
                data: temp,
              },
              { headers: headers }
            )
            .then((response) => {
              refresh();
              handleCancel();

              message.success(
                `Successfully Added new Purchase Order${
                  temp.length > 1 ? "s" : ""
                }`
              );
            })
            .catch((err) => {});
          console.log("temp", temp);
        } else {
          message.error("Please Fill up All information in the Item/s");
          temp = [];
        }
      }
    }
  };
  const handleSubmitDraft = async (event) => {
    if (TransferName == "") {
      message.info("Please Add a Transfer Name");
      setTransferNameValidator(true);
    } else {
      const headers = {
        "Content-Type": "application/json",
      };
      const response = await axios
        .post(
          api_base_url_products + "/check_transfer_name",
          {
            name: TransferName,
          },
          { headers: headers }
        )
        .then(async (response) => {
          if (response.data.count > 0) {
            message.info("Transfer Name Already Exist");
            setTransferNameValidator(true);
          } else {
            setTransferNameValidator(false);
            let valid = 1;
            if (filteredPurchaseOrderData.length == 0) {
              message.info("Please Add an Item");
            } else {
              let temp = [];
              let webadmin_id = localStorage.getItem("webadmin_id");
              let webadmin_login_token = localStorage.getItem(
                "webadmin_login_token"
              );
              for (let c = 0; c < filteredPurchaseOrderData.length; c++) {
                const row = filteredPurchaseOrderData[c];
                temp.push({
                  po_no: row.po_no,
                  invoice_no: row.invoice_no,
                  supplier_note: po_note,
                  total: row.total,
                  product:
                    row.product_name !== ""
                      ? product_variants[row.product_name].product_id
                      : undefined,
                  variant:
                    row.product_name !== ""
                      ? product_variants[row.product_name].variant_id
                      : undefined,
                  supplier:
                    row.product_name !== ""
                      ? product_variants[row.product_name].supplier_id
                      : undefined,
                  bill_to: row.bill_to,
                  stock_source: row.ship_from,
                  ship_to: row.ship_to,
                  delivery_due_date: row.delivery_due_date,
                  quantity: row.quantity,
                  item_cost: row.item_cost,
                  tax: row.tax,
                  entry_by: webadmin_id,
                  type: "Stock Transfer",
                  transfer_name: TransferName,
                  status: "DRAFT",
                });
              }
              if (valid == 1) {
                const headers = {
                  "Content-Type": "application/json",
                };
                const response = await axios
                  .post(
                    api_base_url_products + "/add_purchase_order_drafts",
                    {
                      login_token: webadmin_login_token,
                      data: temp,
                    },
                    { headers: headers }
                  )
                  .then((response) => {
                    refresh();
                    FetchDataTransfer();
                    message.success(
                      `Successfully saved Purchase Order${
                        temp.length > 1 ? "s" : ""
                      } Draft`
                    );
                  })
                  .catch((err) => {});
                console.log("temp", temp);
              } else {
                message.error("Please Fill up All information in the Item/s");
                temp = [];
              }
            }
          }
        })
        .catch((err) => {
          handleSubmitDraft();
        });
    }
  };
  const handleUpdateDraft = async () => {
    if (TransferName == "") {
      message.info("Please Add a Transfer Name");
      setTransferNameValidator(true);
    } else {
      setTransferNameValidator(false);
      let valid = 1;
      if (filteredPurchaseOrderData.length == 0) {
        message.info("Please Add an Item");
      } else {
        let temp = [];
        let webadmin_id = localStorage.getItem("webadmin_id");
        let webadmin_login_token = localStorage.getItem("webadmin_login_token");
        for (let c = 0; c < filteredPurchaseOrderData.length; c++) {
          const row = filteredPurchaseOrderData[c];
          temp.push({
            _id: row._id,
            po_no: row.po_no,
            invoice_no: row.invoice_no,
            supplier_note: po_note,
            total: row.total,
            product:
              row.product_name !== ""
                ? product_variants[row.product_name].product_id
                : undefined,
            variant:
              row.product_name !== ""
                ? product_variants[row.product_name].variant_id
                : undefined,
            supplier:
              row.product_name !== ""
                ? product_variants[row.product_name].supplier_id
                : undefined,
            bill_to: row.bill_to,
            stock_source: row.ship_from,
            ship_to: row.ship_to,
            delivery_due_date: row.delivery_due_date,
            quantity: row.quantity,
            item_cost: row.item_cost,
            tax: row.tax,
            entry_by: webadmin_id,
            type: "Stock Transfer",
            transfer_name: TransferName,
            status: "DRAFT",
          });
        }
        if (valid == 1) {
          const headers = {
            "Content-Type": "application/json",
          };
          const response = await axios
            .post(
              api_base_url_products + "/update_purchase_order_drafts",
              {
                login_token: webadmin_login_token,
                data: temp,
              },
              { headers: headers }
            )
            .then((response) => {
              refresh();
              FetchDataTransfer();
              message.success(
                `Successfully saved Purchase Order${
                  temp.length > 1 ? "s" : ""
                } Draft`
              );
            })
            .catch((err) => {});
          console.log("temp", temp);
        } else {
          message.error("Please Fill up All information in the Item/s");
          temp = [];
        }
      }
    }
  };
  const handleCancel = (event) => {
    setfilteredPurchaseOrderData([]);
    set_fetched(false);
    set_po_note("");
  };
  const handleParsedCSV = (data) => {
    console.log(data, data.length);
    const countPo = filteredPurchaseOrderData.length + 1;
    let temp_storage = [];
    for (let x = 1; x < data.length; x++) {
      const newData = {
        _id: countPo,
        key: countPo,
        po_no: data[x][0],
        invoice_no: "",
        product_name: "",
        bill_to: "",
        ship_from: data[x][1],
        ship_to: data[x][2],
        delivery_due_date: moment(data[x][3]),
        quantity: data[x][4],
        item_cost: 0,
        tax: 0,
        total: 0,
      };
      temp_storage.push(newData);
    }
    setfilteredPurchaseOrderData(temp_storage);
  };
  const handleFiles = (files) => {
    var reader = new FileReader();
    reader.onload = function (e) {
      // Use reader.result
      var results = Papa.parse(reader.result, {});
      handleParsedCSV(results.data);
    };
    reader.readAsText(files[0]);
  };
  const FetchDataTransfer = async () => {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios
      .post(
        api_base_url_products + "/fetch_transfer_data",
        {
          transfer_name: TransferName,
        },
        { headers: headers }
      )
      .then((response) => {
        const countPo = filteredPurchaseOrderData.length + 1;
        let temp_storage = [];
        for (let x = 0; x < response.data.data.length; x++) {
          let product_index = "";
          for (let c = 0; c < product_variants.length; c++) {
            const element = product_variants[c];
            const produ =
              response.data.data[x].product &&
              response.data.data[x].product.length != 0
                ? response.data.data[x].product[0]._id
                : undefined;
            if (response.data.data[x].variant == element.variant_id) {
              product_index = element.index;
            }
          }
          const newData = {
            _id: response.data.data[x]._id,
            key: countPo,
            po_no: response.data.data[x].po_no,
            invoice_no: response.data.data[x].invoice_no,
            product_name: product_index,
            bill_to: "",
            ship_from: response.data.data[x].stock_source,
            ship_to: response.data.data[x].ship_to,
            delivery_due_date: moment(response.data.data[x].delivery_due_date),
            quantity: response.data.data[x].quantity,
            item_cost: response.data.data[x].item_cost,
            tax: response.data.data[x].tax,
            total: response.data.data[x].total,
          };
          console.log(newData);
          temp_storage.push(newData);
        }
        setfilteredPurchaseOrderData(temp_storage);
        if (response.data.data.length != 0) {
          set_fetched(true);
        }
      })
      .catch((err) => {
        FetchDataTransfer();
      });
  };
  return (
    <section>
      <header>
        <Row gutter={[16, 8]}>
          <Col span={12}>
            <Space>
              <Text strong>Transfer Name</Text>
              <Tooltip
                placement="topLeft"
                title={fetched ? "" : "Press Enter key to Fetch Data"}
                trigger="focus"
              >
                <Input
                  placeholder="Enter Transfer Name"
                  onPressEnter={(e) => {
                    if (fetched) {
                    } else {
                      FetchDataTransfer();
                    }
                  }}
                  className={`${
                    TransferNameValidator ? "invalid_input" : "valid_input"
                  }`}
                  readOnly={fetched}
                  value={TransferName}
                  onChange={(event) => {
                    setTransferName(event.target.value);
                  }}
                />
              </Tooltip>
              <ReactFileReader handleFiles={handleFiles} fileTypes={".csv"}>
                <Button type="primary" style={{ width: "200px" }}>
                  Import Order From .CSV
                </Button>
              </ReactFileReader>
              <CSVLink
                filename={"purchase order import template.csv"}
                className="ant-btn ant-btn-primary"
                data={initialProductTagState}
              >
                Download .CSV Template
              </CSVLink>
            </Space>
          </Col>
          <Col span={6}></Col>
          <Col span={6}>
            <Search
              placeholder="Search Here"
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 200, float: "right" }}
            />
          </Col>
          <Col span={6}></Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Table
              tableLayout={"fixed"}
              className="custom-table"
              column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
              pagination={false}
              dataSource={filteredPurchaseOrderData}
              columns={columns}
            ></Table>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={24} style={{ marginBottom: "10px" }}>
            <Button
              type="primary"
              onClick={() => {
                handleAdd();
              }}
              style={{ marginRight: "15px", width: "200px" }}
            >
              Add Another Product
            </Button>
          </Col>
          <Col span={12}>
            <h1>Note to Store Manager: </h1>
            <TextArea
              rows={4}
              placeholder="Type Here.."
              style={{ width: "500px", height: "110px", minWidth: "200px" }}
              value={po_note}
              onChange={(event) => {
                set_po_note(event.target.value);
              }}
            ></TextArea>
          </Col>
          <Col span={12}>
            <Descriptions
              bordered
              size="small"
              column={1}
              style={{ width: "fit-content", float: "right" }}
              className="OpositeAlignment"
            >
              <Descriptions.Item label="Total Cost " style={{ width: "200px" }}>
                {numeral(totalcost).format("0,0.00")}
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={12}></Col>
        </Row>
        <Row style={{ marginTop: "40px" }}>
          <Col span={24}>
            <div style={{ marginTop: "50px", float: "right" }}>
              <Space>
                <Button
                  type="danger"
                  style={{ width: "150px" }}
                  onClick={handleCancel}
                >
                  Clear
                </Button>
                {!fetched ? (
                  <Button
                    type="default"
                    style={{ width: "150px" }}
                    onClick={handleSubmitDraft}
                  >
                    Save to Draft
                  </Button>
                ) : (
                  <Button
                    type="default"
                    style={{ width: "150px" }}
                    onClick={handleUpdateDraft}
                  >
                    Update Draft
                  </Button>
                )}

                <Button
                  type="primary"
                  style={{ width: "150px" }}
                  onClick={handleSubmit}
                >
                  Send to Destination
                </Button>
              </Space>
            </div>
          </Col>
        </Row>
      </header>
    </section>
  );
};

export default EditableTable;
