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
} from "antd";
import moment from "moment";
import numeral from "numeral";
import axios from "axios";
import { api_base_url, api_base_url_orders } from "../../../../keys/index";
import {
  ThunderboltOutlined,
  FileSearchOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import Labels from "../../../global-components/labels";
const { Search, TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

function Customer(props) {
  const [customers, setCustomers] = useState([]);
  const [selected, setSelected] = useState(undefined);
  const [order, setOrder] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [lineItem, setlineItem] = useState([]);
  const [selectedRecord, setselectedRecord] = useState([]);
  const get_customers = async () => {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.get(
      api_base_url + "/customers",
      {},
      { headers: headers }
    );
    setCustomers(response.data);
  };
  useEffect(() => {
    console.log("props.customer", props.customer);
    setSelected(props.customer);
  }, [props]);
  useEffect(() => {
    get_customers();
  }, []);
  const fetch_order = async () => {
    if (selected != "") {
      console.log(selected);
      const headers = {
        "Content-Type": "application/json",
      };
      const response = await axios.post(
        api_base_url_orders + "/order_by_customer",
        {
          id: selected,
        },
        { headers: headers }
      );
      var dataSource = [];
      for (var c = 0; c < response.data.length; c++) {
        var node = response.data[c];
        dataSource.push({
          data: node,
          _id: node._id,
          order_text: node.order_no,
          order: node.order_no,
          purchase:
            node.line_item.length != 0
              ? node.line_item.length < 2
                ? node.line_item.length + " Item"
                : node.line_item.length + " Items"
              : "0 Items",
          date: moment(node.order_date).format("MM-DD-YYYY"),
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
        });
      }
      setOrderList(dataSource);
      setOrder(response.data);
    }
  };
  useEffect(() => {
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
  console.log("selected", selected);
  console.log("order", order);
  const onRowClick = (record) => {
    console.log("record ", record);
    var line_items = [];
    for (var c = 0; c < record.data.line_item.length; c++) {
      var row = record.data.line_item[c];
      line_items.push({
        product: row.product.length != 0 ? row.product[0].product_name : "",
        order_date: moment(row.order_date).format("MM-DD-YYYY"),
        price: numeral(row.price).format("0,0.00"),
        original_price: numeral(row.original_price).format("0,0.00"),
        quantity: row.quantity,
        total: numeral(row.total).format("0,0.00"),
      });
    }
    setselectedRecord(record.data);
    setlineItem(line_items);
  };
  return [
    <div>
      <Row gutter={[16, 16]}>
        <Col span="24">
          <Select
            showSearch
            value={selected}
            defaultValue={undefined}
            style={{ width: 200, float: "right" }}
            placeholder="Select a Customer"
            optionFilterProp="children"
            onChange={(value) => {
              setSelected(value);
            }}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {customers.map((dat, index) => {
              return [
                <Option value={dat._id}>{dat.fname + " " + dat.lname}</Option>,
              ];
            })}
          </Select>
        </Col>
      </Row>
      {selected != undefined ? (
        <>
          <Row gutter={[16, 16]}>
            <Col span="24">
              <Card type="inner" title="Residential and Contact Information">
                <Row gutter={[16, 16]}>
                  <Col span="8">
                    <p style={{ marginBottom: "2px" }}>First Name</p>
                    <Input
                      value={
                        order.length != 0 ? order[0].customer[0].fname : null
                      }
                      readOnly
                    />
                  </Col>
                  <Col span="8">
                    <p style={{ marginBottom: "2px" }}>Last Name</p>
                    <Input
                      value={
                        order.length != 0 ? order[0].customer[0].lname : null
                      }
                      readOnly
                    />
                  </Col>
                  <Col span="2"></Col>
                  <Col span="6">
                    <p style={{ marginBottom: "2px" }}>Email</p>
                    <Input
                      value={
                        order.length != 0 ? order[0].customer[0].email : null
                      }
                      readOnly
                    />
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col span="16">
                    <p style={{ marginBottom: "2px" }}>Company Name</p>
                    <Input
                      value={
                        order.length != 0 ? order[0].customer[0].company : null
                      }
                      readOnly
                    />
                  </Col>
                  <Col span="2"></Col>
                  <Col span="6">
                    <p style={{ marginBottom: "2px" }}>Mobile No./Phone No.</p>
                    <Input
                      value={
                        order.length != 0 ? order[0].customer[0].phone : null
                      }
                      readOnly
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span="14">
              <Table
                className="pointer-table"
                onRow={(record) => ({
                  onClick: () => {
                    onRowClick(record);
                  },
                })}
                scroll={{
                  y: 500,
                }}
                columns={columns}
                dataSource={orderList}
                pagination={false}
              />
            </Col>
            {selectedRecord.length != 0 ? (
              <Col span="10">
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
                        selectedRecord.length != 0
                          ? selectedRecord.order_note
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
                            {selectedRecord.length != 0
                              ? numeral(selectedRecord.payment_total).format(
                                  "0,0.00"
                                )
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
                            {selectedRecord.length != 0
                              ? numeral(
                                  selectedRecord.payment_total * 0.12
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
                            {selectedRecord.length != 0
                              ? selectedRecord.delivery_method == "For Delivery"
                                ? numeral(350).format("0,0.00")
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
                                selectedRecord.length != 0
                                  ? selectedRecord.payment_total
                                  : 0.0
                              ) +
                                parseFloat(
                                  selectedRecord.length != 0
                                    ? selectedRecord.payment_total * 0.12
                                    : 0.0
                                ) +
                                parseFloat(
                                  selectedRecord.length != 0
                                    ? selectedRecord.delivery_method ==
                                      "For Delivery"
                                      ? 350
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
                            {selectedRecord.length != 0
                              ? selectedRecord.payment_method
                              : ""}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col span="24">
                    <Card
                      headStyle={{
                        textAlign: "center",
                      }}
                      type="inner"
                      title="Transaction Timeline"
                      bodyStyle={{ maxHeight: "300px", overflowY: "auto" }}
                    >
                      <Timeline mode={"left"}>
                        {selectedRecord.length != 0 ? (
                          selectedRecord.order_log != undefined &&
                          selectedRecord.order_log.length != 0 ? (
                            selectedRecord.order_log
                              .slice(0)
                              .reverse()
                              .map((da, index) => {
                                return [
                                  <Timeline.Item>
                                    <Text type="secondary">
                                      {moment(da.created_at).format(
                                        "MM-DD-YYYY h:mm a"
                                      )}
                                    </Text>
                                    <br></br>
                                    <Text style={{ marginLeft: "20px" }}>
                                      {da.log}
                                    </Text>
                                  </Timeline.Item>,
                                ];
                              })
                          ) : (
                            <Empty description={<span>no Log found</span>} />
                          )
                        ) : null}
                      </Timeline>
                    </Card>
                  </Col>
                </Row>
              </Col>
            ) : null}
          </Row>
        </>
      ) : (
        <Empty description={<span>Select a Customer</span>} />
      )}
    </div>,
  ];
}

export default Customer;
