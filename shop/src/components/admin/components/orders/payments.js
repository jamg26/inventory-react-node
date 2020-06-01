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
import PrivateStaffNote from "../shared/private_staff_note";
import { UserContext, SettingContext } from "../../../../routes/routes";
const { Search } = Input;
const { Text } = Typography;
var initiallySortedRows = [];
var fresh = 0;
function Payments(props) {
  const inputEl = useRef(null);
  var settings = useContext(SettingContext);
  console.log("payment");
  var rows = [];
  var data = useContext(UserContext);
  const [row, setRow] = useState([]);
  const [filter, SetFilter] = useState("Paid");
  if (fresh == 0) {
    for (var c = 0; c < data.length; c++) {
      var node = data[c];
      let dd = node;
      let order_id = node._id;
      let customer_id = node.customer.length != 0 ? node.customer[0]._id : "";
      if (node.payment_status == filter) {
        initiallySortedRows.push({
          key: c,
          order_text: node.order_no,
          order: (
            <Button type="link" onClick={() => props.SetOrder(order_id)}>
              {node.order_no}
            </Button>
          ),
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
            node.order_note != undefined ? (
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
            numeral(node.payment_total).format("0,0.00") +
            " " +
            node.payment_method,
          total: (
            <>
              <Text>
                {"\u20B1 " + numeral(node.payment_total).format("0,0.00")}
              </Text>
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
      let order_id = node._id;
      let customer_id = node.customer.length != 0 ? node.customer[0]._id : "";
      if (node.payment_status == filter) {
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
        if (
          node.order_no
            ? node.order_no.includes(event)
            : "" ||
              item_number.includes(event) ||
              moment(node.order_date)
                .format(
                  settings != undefined ? settings.date_format : "MM-DD-YYYY"
                )
                .includes(event) ||
              moment(node.order_date).format("h:mm a").includes(event) ||
              node.order_note.includes(event) ||
              custom.includes(event) ||
              node.payment_status.includes(event) ||
              node.fulfillment_status.includes(event) ||
              numeral(node.payment_total).format("0,0.00").includes(event) ||
              node.payment_method.includes(event)
        ) {
          initiallySortedRows.push({
            key: c,
            order_text: node.order_no,
            order: (
              <Button type="link" onClick={() => props.SetOrder(order_id)}>
                {node.order_no}
              </Button>
            ),
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
              node.order_note != undefined ? (
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
              numeral(node.payment_total).format("0,0.00") +
              " " +
              node.payment_method,
            total: (
              <>
                <Text>
                  {"\u20B1 " + numeral(node.payment_total).format("0,0.00")}
                </Text>
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
      align: "center",
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
      title: "Note",
      dataIndex: "noteIcon",
      align: "center",
    },
    {
      title: "Payment",
      dataIndex: "payment",
      sorter: (a, b) => a.payment_text.length - b.payment_text.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Fulfillment",
      dataIndex: "fulfillment",
      sorter: (a, b) => a.fulfillment_text.length - b.fulfillment_text.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Total",
      dataIndex: "total",
      sorter: (a, b) => a.total_text.length - b.total_text.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Action",
      dataIndex: "actions",
      align: "center",
    },
  ];
  useEffect(() => {
    onFilter("");
  }, [filter]);
  console.log("row outside final", rows);
  return [
    <div>
      <Row gutter={[16, 16]}>
        <Col span="24">
          <PrivateStaffNote ref={inputEl} />
          <Space>
            <Button
              onClick={() => {
                SetFilter("Paid");
              }}
              type={filter == "Paid" ? "danger" : "primary"}
            >
              Paid
            </Button>
            <Button
              onClick={() => {
                SetFilter("Pending");
              }}
              type={filter == "Pending" ? "danger" : "primary"}
            >
              Pending
            </Button>
            <Button
              onClick={() => {
                SetFilter("Failed");
              }}
              type={filter == "Failed" ? "danger" : "primary"}
            >
              Failed
            </Button>
            <Button
              onClick={() => {
                SetFilter("Refunded");
              }}
              type={filter == "Refunded" ? "danger" : "primary"}
            >
              Refunded
            </Button>
          </Space>
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
              expandable={{
                expandedRowRender: (record) => (
                  <p style={{ margin: 0 }}>{record.note}</p>
                ),
                rowExpandable: (record) =>
                  record.note !== undefined && record.note !== "",
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

export default Payments;
