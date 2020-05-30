import React, { useState, useEffect } from "react";
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
  Modal,
} from "antd";
import {
  CloseOutlined,
  CheckOutlined,
  SaveOutlined,
  EditOutlined,
} from "@ant-design/icons";
import numeral from "numeral";
import { CSVLink } from "react-csv";
import axios from "axios";
import moment from "moment";
import { api_base_url_orders } from "../../../keys/index";
import ViewItem from "./modal/view_item";
const Search = Input.Search;
const { TextArea } = Input;
const success = () => {
  message.success("Added New Product", 4);
};
const fillTheInput = () => {
  message.error("Please fill the necessary inputs", 4);
};
const rowAlreadyAdded = () => {
  message.info("Row has already been added", 4);
};
const EditableTable = ({ refresh_trigger }) => {
  const initialProductTagState = {
    _id: undefined,
    key: "",
    po_no: "ST" + "",
    invoice_no: "",
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

  const [tag, setTag] = useState(initialProductTagState);

  const [loading, setLoading] = useState(false);
  const [x, setX] = useState(0);
  const dateFormat = "YYYY/MM/DD";
  const [editingIndex, setEditingIndex] = useState(undefined);
  const [editable, setEditable] = useState(true);
  const [purchaseOrderData, setpurchaseOrderData] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredPurchaseOrderData, setfilteredPurchaseOrderData] = useState(
    []
  );
  const [toBeSaveData, setToBeSaveData] = useState();
  const [viewitemModal, setviewitemModal] = useState(false);
  const [viewitemData, setviewitemData] = useState(undefined);
  const [flag, setFlag] = useState(true);
  useEffect(() => {
    retrieveAllData();
  }, [refresh_trigger]);

  const retrieveAllData = () => {
    setLoading(true);
    axios
      .get(api_base_url_orders + "/purchase_orders/")

      .then((res) => {
        setpurchaseOrderData(res.data);
        setfilteredPurchaseOrderData(res.data);
        setLoading(false);
        console.log(res.data);
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  const toggleEdit = (index) => {
    setEditingIndex(index);
    setEditable(false);
  };

  const columns = [
    {
      title: "PO No.",
      dataIndex: "po_no",
      render: (value, row, index) => {
        return [<Typography key={index}>{value}</Typography>];
      },
    },
    {
      title: "Name",
      dataIndex: "transfer_name",
      render: (value, row, index) => {
        return [<Typography key={index}>{value}</Typography>];
      },
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (value, row, index) => {
        return [<Typography key={index}>{value}</Typography>];
      },
    },
    {
      title: "Supplier/Source",
      dataIndex: "supplier",
      key: "supplier",
      render: (value, row, index) => {
        return [
          row.supplier && row.supplier.length != 0
            ? row.supplier[0].display_name
            : "",
        ];
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      filters: [
        {
          text: "Open",
          value: "Open",
        },
        {
          text: "Closed",
          value: "Closed",
        },
        {
          text: "Draft",
          value: "DRAFT",
        },
        {
          text: "Issued",
          value: "Issued",
        },
        {
          text: "Void",
          value: "Void",
        },
      ],
      filterMultiple: false,
      onFilter: (value, record) => record.status.indexOf(value) === 0,
      sortDirections: ["descend", "ascend"],
      align: "center",
      render: (value, row, index) => {
        if (value == "Issued") {
          return [
            <Typography key={index} style={{ color: "Green" }}>
              {value}
            </Typography>,
          ];
        } else if (value == "Void") {
          return [
            <Typography key={index} style={{ color: "Red" }}>
              {value}
            </Typography>,
          ];
        } else if (value == "DRAFT") {
          return [
            <Typography key={index} style={{ color: "Orange" }}>
              {"Draft"}
            </Typography>,
          ];
        } else {
          return [<Typography key={index}>{value}</Typography>];
        }
      },
    },
    {
      title: "Received",
      align: "center",
      dataIndex: "received",
      render: (value, row, index) => {
        return [<Typography key={index}>{value ? "Yes" : "No"}</Typography>];
      },
    },
    {
      title: "Quantity",
      align: "right",
      dataIndex: "quantity",
      render: (value, result, index) => {
        return [
          <Typography key={index}>{numeral(value).format("0,0")}</Typography>,
        ];
      },
    },
    {
      title: "Total Cost",
      align: "right",
      dataIndex: "total",
      render: (value, result, index) => {
        return [
          <Typography key={index}>
            {numeral(value).format("0,0.00")}
          </Typography>,
        ];
      },
    },
    {
      title: "Transaction Date",
      dataIndex: "created_at",
      render: (value, result, index) => {
        return [
          <Typography key={index}>
            {moment(value).format("MM-DD-YYYY")}
          </Typography>,
        ];
      },
    },
    {
      title: "Delivery Due",
      dataIndex: "delivery_due_date",
      render: (value, result, index) => {
        return [
          moment().diff(moment(value), "days") > 0 &&
          result.status == "Open" ? (
            <Typography key={index} style={{ color: "red" }}>
              {moment(value).format("MM-DD-YYYY")}
            </Typography>
          ) : (
            <Typography key={index}>
              {moment(value).format("MM-DD-YYYY")}
            </Typography>
          ),
        ];
      },
    },
    {
      title: "Last Updated",
      dataIndex: "updated_at",
      render: (value, result, index) => {
        return [
          <Typography key={index}>
            {moment(value).format("MM-DD-YYYY")}
          </Typography>,
        ];
      },
    },
    {
      title: "Entry by",
      dataIndex: "entry_by",
      key: "entry_by",
      render: (value, row, index) => {
        return [
          row.entry_by && row.entry_by.length != 0 ? row.entry_by[0].name : "",
        ];
      },
    },
    {
      title: "Received by",
      dataIndex: "received_by",
      key: "received_by",
      render: (value, row, index) => {
        return [
          row.received_by && row.received_by.length != 0
            ? row.received_by[0].name
            : "",
        ];
      },
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (text, record) => (
        <span>
          <Button
            type="link"
            onClick={() => {
              viewPO(record);
            }}
          >
            View Item{" "}
          </Button>
        </span>
      ),
    },
  ];

  // For Search Ni siya
  useEffect(() => {
    console.log(purchaseOrderData);
    setfilteredPurchaseOrderData(
      purchaseOrderData.filter(
        (data) =>
          data.po_no.toLowerCase().includes(search.toLowerCase()) ||
          (data.transfer_name
            ? data.transfer_name.toLowerCase().includes(search.toLowerCase())
            : "") ||
          data.invoice_no.toLowerCase().includes(search.toLowerCase()) ||
          (data.supplier && data.supplier.length != 0
            ? data.supplier[0].display_name
            : ""
          )
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          data.status.toLowerCase().includes(search.toLowerCase()) ||
          data.type.toLowerCase().includes(search.toLowerCase()) ||
          (data.received_by && data.received_by.length != 0
            ? data.received_by[0].name
            : ""
          )
            .toLowerCase()
            .includes(search.toLowerCase()) ||
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
  const viewPO = (record) => {
    if (record != undefined) {
      setviewitemModal(true);
      setviewitemData(record);
    }
    console.log(record);
  };
  return (
    <section>
      <header>
        <ViewItem
          viewitemModal={viewitemModal}
          data={viewitemData}
          close={() => {
            setviewitemModal(false);
          }}
          refresh={() => {
            retrieveAllData();
          }}
        />

        <Row gutter={[16, 8]}>
          <Col span={12}></Col>
          <Col span={6}></Col>
          <Col span={6}>
            <Search
              placeholder="Search Here"
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 200, float: "right" }}
            />
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Table
              className="custom-table"
              rowKey={(filteredPurchaseOrderData) =>
                filteredPurchaseOrderData._id
              }
              column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
              pagination={{ position: ["bottomCenter"], size: "small" }}
              dataSource={filteredPurchaseOrderData}
              columns={columns}
            ></Table>
          </Col>
        </Row>
        <Row>
          <Col span={12}></Col>
        </Row>
        <Row style={{ marginTop: "40px" }}>
          <Col span={12}></Col>
        </Row>
      </header>
    </section>
  );
};

export default EditableTable;
