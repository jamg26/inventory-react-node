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
  Card,
  Select,
  Descriptions,
  Button,
  Tooltip,
  Typography,
  Table,
  Timeline,
  Empty,
  Space,
} from "antd";
import moment from "moment";
import numeral from "numeral";
import axios from "axios";
import { api_base_url_orders } from "../../../../keys";
import {
  ThunderboltOutlined,
  FileSearchOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import Labels from "../../../global-components/labels";
import PrivateStaffNote from "../shared/private_staff_note";
import { UserContext, SettingContext } from "../../../../routes/routes";
const { Search, TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

function OrderDetail(props) {
  var settings = useContext(SettingContext);
  const inputEl = useRef(null);
  const [orderList, setOrdersList] = useState([]);
  const [order, setOrder] = useState([]);
  const [selected, setSelected] = useState(undefined);
  const [selectedRecord, setselectedRecord] = useState([]);
  const [lineItem, setlineItem] = useState([]);
  const get_customers = async () => {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.get(
      api_base_url_orders + "/all_orders",
      {},
      { headers: headers }
    );
    setOrdersList(response.data);
  };
  useEffect(() => {
    console.log("props.orderID", props.orderID);
    setSelected(props.orderID);
  }, [props]);
  useEffect(() => {
    get_customers();
  }, []);
  const fetch_order = async () => {
    if (selected != "") {
      const headers = {
        "Content-Type": "application/json",
      };
      const response = await axios.post(
        api_base_url_orders + "/order_by_id",
        {
          id: selected,
        },
        { headers: headers }
      );
      var dataSource = [];
      for (var c = 0; c < response.data.length; c++) {
        var node = response.data[c];
        let dd = node;
        let order_id = node._id;
        let customer_id = node.customer.length != 0 ? node.customer[0]._id : "";
        dataSource.push({
          data: node,
          _id: node._id,
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
      var line_items = [];
      for (var c = 0; c < response.data[0].line_item.length; c++) {
        var row = response.data[0].line_item[c];
        line_items.push({
          product: row.product.length != 0 ? row.product[0].product_name : "",
          order_date: moment(row.order_date).format("MM-DD-YYYY"),
          price: numeral(row.price).format("0,0.00"),
          original_price: numeral(row.original_price).format("0,0.00"),
          quantity: row.quantity,
          total: numeral(row.total).format("0,0.00"),
        });
      }
      setlineItem(line_items);
      setOrder(dataSource);
    }
  };
  useEffect(() => {
    console.log("ssss", selected);
    if (selected != undefined) {
      fetch_order();
    }
  }, [selected]);
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
  const line_item_column = [
    {
      title: "Item",
      dataIndex: "product",
      sorter: (a, b) => a.product.length - b.product.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Price",
      dataIndex: "price",
      sorter: (a, b) => a.price.length - b.price.length,
      sortDirections: ["descend", "ascend"],
      align: "right",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      sorter: (a, b) => a.quantity.length - b.quantity.length,
      sortDirections: ["descend", "ascend"],
      align: "center",
    },
    {
      title: "Total",
      dataIndex: "total",
      sorter: (a, b) => a.total.length - b.total.length,
      sortDirections: ["descend", "ascend"],
      align: "right",
    },
  ];
  return [
    <div>
      <Row gutter={[16, 16]}>
        <Col span="24">
          <PrivateStaffNote ref={inputEl} />
          <Select
            showSearch
            value={selected}
            defaultValue={undefined}
            style={{ width: 200, float: "right" }}
            placeholder="Select a Order No"
            optionFilterProp="children"
            onChange={(value) => {
              setSelected(value);
            }}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {orderList.map((dat, index) => {
              return [<Option value={dat._id}>{dat.order_no}</Option>];
            })}
          </Select>
        </Col>
      </Row>
      {selected != undefined ? (
        <>
          <Row gutter={[16, 16]}>
            <Col span="24">
              <Table
                expandable={{
                  expandedRowRender: (record) => (
                    <p style={{ margin: 0 }}>{record.note}</p>
                  ),
                  rowExpandable: (record) =>
                    record.note !== "" && record.note !== undefined,
                }}
                columns={columns}
                dataSource={order}
                pagination={false}
              />
            </Col>
          </Row>
          {order.length != 0 ? (
            <>
              <Row gutter={[16, 16]}>
                <Col span="14">
                  <Row gutter={[16, 16]}>
                    <Col span="24">
                      <Table
                        columns={line_item_column}
                        dataSource={lineItem}
                        pagination={false}
                      />
                    </Col>
                  </Row>
                  <Row gutter={[16, 16]}>
                    <Col span="12">
                      <p>Order Note</p>
                      <TextArea
                        rows={2}
                        value={
                          order[0].data.length != 0
                            ? order[0].data.order_note
                            : ""
                        }
                        placeholder="no note attached.."
                        readOnly
                      />
                    </Col>
                    <Col span="12">
                      <table style={{ width: "100%" }}>
                        <tbody>
                          <tr>
                            <td
                              style={{
                                verticalAlign: "middle",
                                textAlign: "right",
                                fontWeight: "bold",
                              }}
                            >
                              Sub Total:
                            </td>
                            <td
                              style={{
                                verticalAlign: "middle",
                                textAlign: "right",
                              }}
                            >
                              {order[0].data.length != 0
                                ? numeral(
                                    parseFloat(order[0].data.payment_total) -
                                      parseFloat(
                                        order[0].data.delivery_method ==
                                          "Standard Delivery"
                                          ? numeral(350).format("0,0.00")
                                          : "Exclusive Delivery"
                                          ? numeral(500).format("0,0.00")
                                          : 0.0
                                      )
                                  ).format("0,0.00")
                                : 0.0}
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                verticalAlign: "middle",
                                textAlign: "right",
                                fontWeight: "bold",
                              }}
                            >
                              VAT(12%):
                            </td>
                            <td
                              style={{
                                verticalAlign: "middle",
                                textAlign: "right",
                              }}
                            >
                              {order[0].data.length != 0
                                ? numeral(
                                    order[0].data.payment_total * 0.12
                                  ).format("0,0.00")
                                : 0.0}
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                verticalAlign: "middle",
                                textAlign: "right",
                                fontWeight: "bold",
                              }}
                            >
                              Delivery Charge:
                            </td>
                            <td
                              style={{
                                verticalAlign: "middle",
                                textAlign: "right",
                              }}
                            >
                              {order[0].data.length != 0
                                ? order[0].data.delivery_method ==
                                  "Standard Delivery"
                                  ? numeral(350).format("0,0.00")
                                  : "Exclusive Delivery"
                                  ? numeral(500).format("0,0.00")
                                  : 0.0
                                : 0.0}
                            </td>
                          </tr>
                        </tbody>
                        <tfoot style={{ borderTop: "2px solid black" }}>
                          <tr>
                            <td
                              style={{
                                verticalAlign: "middle",
                                textAlign: "right",
                                fontWeight: "bold",
                                fontSize: "16px",
                              }}
                            >
                              Total:
                            </td>
                            <td
                              style={{
                                verticalAlign: "middle",
                                textAlign: "right",
                                fontWeight: "bold",
                                fontSize: "16px",
                              }}
                            >
                              {numeral(
                                parseFloat(
                                  order[0].data.length != 0
                                    ? parseFloat(order[0].data.payment_total) -
                                        parseFloat(
                                          order[0].data.delivery_method ==
                                            "Standard Delivery"
                                            ? numeral(350).format("0,0.00")
                                            : "Exclusive Delivery"
                                            ? numeral(500).format("0,0.00")
                                            : 0.0
                                        )
                                    : 0.0
                                ) +
                                  parseFloat(
                                    order[0].data.length != 0
                                      ? order[0].data.payment_total * 0.12
                                      : 0.0
                                  ) +
                                  parseFloat(
                                    order[0].data.length != 0
                                      ? order[0].data.delivery_method ==
                                        "Standard Delivery"
                                        ? numeral(350).format("0,0.00")
                                        : "Exclusive Delivery"
                                        ? numeral(500).format("0,0.00")
                                        : 0.0
                                      : 0.0
                                  )
                              ).format("0,0.00")}
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                verticalAlign: "middle",
                                textAlign: "right",
                                fontWeight: "bold",
                              }}
                            >
                              Payment Method:
                            </td>
                            <td
                              style={{
                                verticalAlign: "middle",
                                textAlign: "right",
                              }}
                            >
                              {order[0].data.length != 0
                                ? order[0].data.payment_method
                                : ""}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span="14">
                  <Card
                    type="inner"
                    title="Residential and Contact Information"
                  >
                    <Row gutter={[16, 16]}>
                      <Col span="12">
                        <p style={{ marginBottom: "2px" }}>First Name</p>
                        <Input
                          value={
                            order.length != 0 &&
                            order[0].data.customer.length != 0
                              ? order[0].data.customer[0].fname
                              : null
                          }
                          readOnly
                        />
                      </Col>
                      <Col span="12">
                        <p style={{ marginBottom: "2px" }}>Last Name</p>
                        <Input
                          value={
                            order.length != 0 &&
                            order[0].data.customer.length != 0
                              ? order[0].data.customer[0].lname
                              : null
                          }
                          readOnly
                        />
                      </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                      <Col span="24">
                        <p style={{ marginBottom: "2px" }}>Company Name</p>
                        <Input
                          value={
                            order.length != 0 &&
                            order[0].data.customer.length != 0
                              ? order[0].data.customer[0].company
                              : null
                          }
                          readOnly
                        />
                      </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                      <Col span="24">
                        <p style={{ marginBottom: "2px" }}>Street Address</p>
                        <Input
                          value={
                            order.length != 0 &&
                            order[0].data.customer.length != 0
                              ? order[0].data.customer[0].address
                              : null
                          }
                          readOnly
                        />
                      </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                      <Col span="12">
                        <p style={{ marginBottom: "2px" }}>Email</p>
                        <Input
                          value={
                            order.length != 0 &&
                            order[0].data.customer.length != 0
                              ? order[0].data.customer[0].email
                              : null
                          }
                          readOnly
                        />
                      </Col>
                      <Col span="12">
                        <p style={{ marginBottom: "2px" }}>
                          Mobile No./Phone No.
                        </p>
                        <Input
                          value={
                            order.length != 0 &&
                            order[0].data.customer.length != 0
                              ? order[0].data.customer[0].phone
                              : null
                          }
                          readOnly
                        />
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            </>
          ) : null}
        </>
      ) : (
        <Empty description={<span>Select a Order</span>} />
      )}
    </div>,
  ];
}

export default OrderDetail;
