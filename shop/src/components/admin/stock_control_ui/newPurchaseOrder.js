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
import moment from "moment";
import numeral from "numeral";
import { UserContext, SettingContext } from "../../../routes/routes";
import Papa from "papaparse";
const Search = Input.Search;
const { TextArea } = Input;
const { Option } = Select;
const success = () => {
  message.success("Added New Product", 4);
};
const addDataFirst = () => {
  message.warning("Please add the data first", 4);
};
const fillTheInput = () => {
  message.error("Please fill the necessary inputs", 4);
};
const rowAlreadyAdded = () => {
  message.info("Row has already been added", 4);
};

const notImplemented = () => {
  message.info("Not Implemented Yet", 4);
};

const selectData = () => {
  message.info("Please select a data or Add new Data first", 4);
};
const EditableTable = ({ SupplierList, products, refresh }) => {
  var settings = useContext(SettingContext);
  const [product_variants, set_product_variants] = useState([]);
  const initialProductTagState = [
    {
      po_no: "PO-" + 1,
      invoice_no: 1,
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
      console.log("elements", element);
      console.log("product_name", product_variants[element.product_name]);
      subto =
        parseFloat(subto) + parseFloat(element.total != "" ? element.total : 0);
    }
    let va = parseFloat(subto) * parseFloat(0.12);
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
            });
            counter++;
          }
        }
      }
    }
    set_product_variants(temp);
  }, [products]);
  const [po_note, set_po_note] = useState("");
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
      title: "PO No.",
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
      title: "Invoice No",
      dataIndex: "invoice_no",
      width: "7.09%",
      render: (value, row, index) => {
        return [
          <Input
            key={index}
            disabled={editable}
            value={value}
            onChange={(event) =>
              setInput(event.target.value, index, "invoice_no")
            }
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
      title: "Supplier",
      dataIndex: "product_name",
      width: "14.09%",
      render: (value, row, index) => {
        return [
          row.product_name !== ""
            ? product_variants[row.product_name].supplier_name
            : "",
        ];
      },
    },
    {
      title: "Bill To",
      dataIndex: "bill_to",
      width: "9.09%",
      render: (value, result, index) => {
        return [
          <Select
            value={value}
            showSearch
            maxTagTextLength={10}
            style={{ width: "100%" }}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            dropdownMatchSelectWidth={false}
            onChange={(event) => setInput(event, index, "bill_to")}
          >
            {SupplierList.map((row, index) => {
              return [
                <Option key={index} value={row._id}>
                  {row.display_name}
                </Option>,
              ];
            })}
          </Select>,
        ];
      },
    },
    {
      title: "Ship To",
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
      title: "Quantity",
      dataIndex: "quantity",
      width: "7.09%",
      render: (value, result, index) => {
        return [
          <InputNumber
            key={index}
            disabled={editable}
            min={0}
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
      title: "Tax",
      dataIndex: "tax",
      width: "9.09%",
      align: "center",
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
    tempdata[index]["tax"] =
      parseFloat(tempdata[index]["item_cost"]) *
      parseFloat(tempdata[index]["quantity"]) *
      0.12;
    tempdata[index]["total"] =
      parseFloat(tempdata[index]["item_cost"]) *
        parseFloat(tempdata[index]["quantity"]) +
      parseFloat(tempdata[index]["tax"]);
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
      _id: countPo,
      key: countPo,
      po_no: "PO-" + countPo,
      invoice_no: countPo,
      product_name: "",
      bill_to: "",
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
          row.bill_to == "" ||
          row.ship_to == "" ||
          row.delivery_due_date == "" ||
          row.delivery_due_date == null ||
          row.delivery_due_date == undefined ||
          row.quantity == ""
        ) {
          console.log("row", row);
          valid = 0;
          break;
        } else {
          temp.push({
            po_no: row.po_no,
            invoice_no: row.invoice_no,
            supplier_note: po_note,
            total: row.total,
            product:
              row.product_name !== ""
                ? product_variants[row.product_name].product_id
                : "",
            variant:
              row.product_name !== ""
                ? product_variants[row.product_name].variant_id
                : "",
            supplier:
              row.product_name !== ""
                ? product_variants[row.product_name].supplier_id
                : "",
            bill_to: row.bill_to,
            ship_to: row.ship_to,
            delivery_due_date: row.delivery_due_date,
            quantity: row.quantity,
            item_cost: row.item_cost,
            tax: row.tax,
            entry_by: webadmin_id,
            type: "Purchase Order",
          });
        }
      }
      if (valid == 1) {
        const headers = {
          "Content-Type": "application/json",
        };
        const response = await axios
          .post(
            api_base_url_products + "/add_purchase_order",
            {
              login_token: webadmin_login_token,
              data: temp,
            },
            { headers: headers }
          )
          .then((response) => {
            handleCancel();
            refresh();
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
  };

  const handleCancel = (event) => {
    setfilteredPurchaseOrderData([]);
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
        invoice_no: data[x][1],
        product_name: "",
        bill_to: "",
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
  return (
    <section>
      <header>
        <Row gutter={[16, 8]}>
          <Col span={12}>
            <Space>
              <ReactFileReader handleFiles={handleFiles} fileTypes={".csv"}>
                <Button
                  type="primary"
                  style={{ marginRight: "15px", width: "200px" }}
                >
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
            <h1>Note to supplier: </h1>
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
              <Descriptions.Item label="Subtotal" style={{ width: "200px" }}>
                {numeral(subtotal).format("0,0.00")}
              </Descriptions.Item>
              <Descriptions.Item label="VAT(12%)" style={{ width: "200px" }}>
                {numeral(vat).format("0,0.00")}
              </Descriptions.Item>
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
              <Button
                type="danger"
                style={{ marginRight: "15px", width: "150px" }}
                onClick={handleCancel}
              >
                Clear
              </Button>
              <Button
                type="primary"
                style={{ width: "150px" }}
                onClick={handleSubmit}
              >
                Send to Destination
              </Button>
            </div>
          </Col>
        </Row>
      </header>
    </section>
  );
};

export default EditableTable;
