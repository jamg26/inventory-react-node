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
  Tooltip,
} from "antd";
import Labels from "../../../global-components/labels";
import moment from "moment";
import numeral from "numeral";
import {
  ThunderboltOutlined,
  FileSearchOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { AbandonedList, SettingContext } from "../../../../routes/routes";
import PrivateStaffNote from "../shared/private_staff_note";
const { Search } = Input;
const { Text } = Typography;
var initiallySortedRows = [];
var fresh = 0;
function All(props) {
  const inputEl = useRef(null);
  console.log("all");
  var rows = [];
  var data = useContext(AbandonedList);
  var settings = useContext(SettingContext);
  const [row, setRow] = useState([]);
  if (fresh == 0) {
    for (var c = 0; c < data.length; c++) {
      var node = data[c];
      let dd = node;
      let customer_id = node.customer.length != 0 ? node.customer[0]._id : "";
      let total = 0;
      if (node.line_item) {
        for (let xc = 0; xc < node.line_item.length; xc++) {
          total =
            parseFloat(total) +
            parseFloat(
              parseFloat(node.line_item[xc].price) *
                parseFloat(node.line_item[xc].quantity)
            );
        }
      }

      initiallySortedRows.push({
        key: c,
        order_text: node.order_no,
        status: node.order_status,
        order: node.order_no,
        purchase:
          node.line_item.length != 0
            ? node.line_item.length < 2
              ? node.line_item.length + " Item"
              : node.line_item.length + " Items"
            : "0 Items",
        date: moment(node.order_date).format(
          settings != undefined ? settings.date_format : "MM-DD-YYYY"
        ),
        time: moment(node.order_date).format("h:mm a"),
        note: node.order_note,
        noteIcon:
          node.order_note != "" ? (
            <Tooltip title="Note Attached">
              <FileTextOutlined />
            </Tooltip>
          ) : null,
        customer:
          node.customer.length != 0 ? (
            props.report ? (
              node.customer[0].fname + " " + node.customer[0].lname
            ) : (
              <Button
                type="link"
                onClick={() => props.setCustomer(customer_id)}
              >
                {node.customer[0].fname + " " + node.customer[0].lname}
              </Button>
            )
          ) : (
            <Text type="secondary">{"no Customer"}</Text>
          ),
        email: node.customer.length != 0 ? node.customer[0].email : "",
        ip_address: node.ip_address,
        payment_text: node.payment_status,
        payment: (
          <Labels
            color={node.payment_status == "Paid" ? "success" : "warning"}
            label={node.payment_status}
          />
        ),
        fulfillment_text: node.fulfillment_status,
        fulfillment: (
          <Labels
            color={
              node.fulfillment_status == "Completed" ? "success" : "warning"
            }
            label={node.fulfillment_status}
          />
        ),
        total_text:
          "\u20B1 " +
          numeral(total).format("0,0.00") +
          " " +
          node.payment_method,
        total: (
          <>
            <Text>{"\u20B1 " + numeral(total).format("0,0.00")}</Text>
          </>
        ),
        actions: (
          <Space>
            <Button
              onClick={() => {
                inputEl.current.setVisiblle(dd);
              }}
              type="link"
              icon={<FileSearchOutlined />}
            ></Button>
          </Space>
        ),
      });
    }
    if (initiallySortedRows.length != 0) {
      fresh = 1;
    }
  }

  rows = initiallySortedRows;
  const ClearFilter = (event) => {
    if (event.target.value == "") {
      onFilter("");
    }
  };
  const onFilter = (event) => {
    initiallySortedRows = [];
    for (var c = 0; c < data.length; c++) {
      var node = data[c];
      let dd = node;
      let customer_id = node.customer.length != 0 ? node.customer[0]._id : "";
      var item_number =
        node.line_item.length != 0
          ? node.line_item.length < 2
            ? node.line_item.length + " Item"
            : node.line_item.length + " Items"
          : "0 Items";
      var custom =
        node.customer.length != 0
          ? node.customer[0].fname + " " + node.customer[0].lname
          : "no Customer";
      let total = 0;
      console.log(node.line_item);
      if (node.line_item) {
        for (let xc = 0; xc < node.line_item.length; xc++) {
          total =
            parseFloat(total) +
            parseFloat(
              parseFloat(node.line_item[xc].price) *
                parseFloat(node.line_item[xc].quantity)
            );
        }
      }
      if (
        (node.order_no ? node.order_no.includes(event) : "") ||
        item_number.includes(event) ||
        moment(node.order_date)
          .format(settings != undefined ? settings.date_format : "MM-DD-YYYY")
          .includes(event) ||
        moment(node.order_date).format("h:mm a").includes(event) ||
        (node.order_note != undefined ? node.order_note.includes(event) : "") ||
        custom.includes(event) ||
        node.payment_status.includes(event) ||
        node.fulfillment_status.includes(event) ||
        numeral(total).format("0,0.00").includes(event) ||
        (node.payment_method ? node.payment_method.includes(event) : "")
      ) {
        initiallySortedRows.push({
          key: c,
          order_text: node.order_no,
          status: node.order_status,
          order: node.order_no,
          purchase:
            node.line_item.length != 0
              ? node.line_item.length < 2
                ? node.line_item.length + " Item"
                : node.line_item.length + " Items"
              : "0 Items",
          date: moment(node.order_date).format(
            settings != undefined ? settings.date_format : "MM-DD-YYYY"
          ),
          time: moment(node.order_date).format("h:mm a"),
          note: node.order_note,
          noteIcon:
            node.order_note != "" ? (
              <Tooltip title="Note Attached">
                <FileTextOutlined />
              </Tooltip>
            ) : null,
          customer:
            node.customer.length != 0 ? (
              <Button
                type="link"
                onClick={() => props.setCustomer(customer_id)}
              >
                {node.customer[0].fname + " " + node.customer[0].lname}
              </Button>
            ) : (
              <Text type="secondary">{"no Customer"}</Text>
            ),
          email: node.customer.length != 0 ? node.customer[0].email : "",
          ip_address: node.ip_address,
          payment_text: node.payment_status,
          payment: (
            <Labels
              color={node.payment_status == "Paid" ? "success" : "warning"}
              label={node.payment_status}
            />
          ),
          fulfillment_text: node.fulfillment_status,
          fulfillment: (
            <Labels
              color={
                node.fulfillment_status == "Completed" ? "success" : "warning"
              }
              label={node.fulfillment_status}
            />
          ),
          total_text:
            "\u20B1 " +
            numeral(total).format("0,0.00") +
            " " +
            node.payment_method,
          total: (
            <>
              <Text>{"\u20B1 " + numeral(total).format("0,0.00")}</Text>
              <br />
              <Text type="secondary">{node.payment_method}</Text>
            </>
          ),
          actions: (
            <Space>
              <Button
                onClick={() => {
                  inputEl.current.setVisiblle(dd);
                }}
                type="link"
                icon={<FileSearchOutlined />}
              ></Button>
            </Space>
          ),
        });
      }
    }
    rows = initiallySortedRows;

    setRow(rows);
  };

  const columns = [
    {
      title: "Order",
      dataIndex: "order",
      sorter: (a, b) => a.order_text.length - b.order_text.length,
      sortDirections: ["descend", "ascend"],
      align: "left",
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: (a, b) => a.purchase.length - b.purchase.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Purchase",
      dataIndex: "purchase",
      sorter: (a, b) => a.purchase.length - b.purchase.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Date",
      dataIndex: "date",
      sorter: (a, b) => a.date.length - b.date.length,
      sortDirections: ["descend", "ascend"],
      align: "center",
    },
    {
      title: "Time",
      dataIndex: "time",
      sorter: (a, b) => a.time.length - b.time.length,
      sortDirections: ["descend", "ascend"],
      align: "center",
    },
    {
      title: "Customer",
      dataIndex: "customer",
      sorter: (a, b) => a.customer.length - b.customer.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Ip Address",
      dataIndex: "ip_address",
      sorter: (a, b) => a.ip_address.length - b.ip_address.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.length - b.email.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Total",
      dataIndex: "total",
      sorter: (a, b) => a.total_text.length - b.total_text.length,
      render: (value, row, index) => {
        return [value];
      },
      sortDirections: ["descend", "ascend"],
    },
  ];
  useEffect(() => {});
  return [
    <div>
      <Row gutter={[16, 16]}>
        <Col span="24">
          <PrivateStaffNote ref={inputEl} />
          <Search
            placeholder="input search text"
            onChange={ClearFilter}
            onSearch={onFilter}
            style={{ width: 200, float: "right" }}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span="24">
          {rows.length != 0 ? (
            <Table
              scroll={{
                y: 300,
              }}
              columns={columns}
              dataSource={rows}
              pagination={{ position: ["bottomCenter"], size: "small" }}
            />
          ) : (
            <Empty description={<span>No Data Found</span>} />
          )}
        </Col>
      </Row>
    </div>,
  ];
}

export default All;
