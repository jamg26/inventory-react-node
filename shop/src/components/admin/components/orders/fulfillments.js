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
  Select,
  message,
} from "antd";
import Labels from "../../../global-components/labels";
import { AbandonedList, SettingContext } from "../../../../routes/routes";
import moment from "moment";
import numeral from "numeral";
import axios from "axios";
import { api_base_url_orders } from "../../../../keys";
import {
  ThunderboltOutlined,
  FileSearchOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import PrivateStaffNote from "../shared/private_staff_note";
import {
  UserContext,
  UsersContext,
  FetchOrderList,
} from "../../../../routes/routes";
const { Search } = Input;
const { Text } = Typography;
const { Option } = Select;
var initiallySortedRows = [];
var fresh = 0;
var InputObject = [];
function Fulfillment(props) {
  var settings = useContext(SettingContext);
  const inputEl = useRef(null);
  console.log("fulfillment");
  var rows = [];
  var data = useContext(UserContext);
  var options = useContext(UsersContext);
  var get_orders = useContext(FetchOrderList);
  const [selectedOption, setselectedOption] = useState("Pending");
  const [
    selectedOptionDeliveryMethod,
    setselectedOptionDeliveryMethod,
  ] = useState("For Delivery");
  const [filter, setFilter] = useState([]);
  const [rowInput, setRowInput] = useState([]);
  const [disableDriver, setDisableDriver] = useState(true);
  const [disableBagger, setdisableBagger] = useState(false);
  const [disableChecker, setdisableChecker] = useState(false);
  const [disableSupervisor, setdisableSupervisor] = useState(false);
  const [disableReleaser, setdisableReleaser] = useState(false);

  const update_component = (index, value, column) => {
    let rowInputtemp = [...InputObject];
    rowInputtemp[index][column] = value;
    InputObject = rowInputtemp;
    setRowInput(InputObject);
  };
  const updateStaffs = async (index) => {
    console.log(index);
    let rowInputtemp = [...InputObject];
    rowInputtemp[index]["loading"] = true;
    InputObject = rowInputtemp;
    setRowInput(InputObject);
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.post(
      api_base_url_orders + "/update_staffs",
      {
        order_id: rowInputtemp[index]["_id"],
        bagger: rowInputtemp[index]["bagger"],
        checker: rowInputtemp[index]["checker"],
        releaser: rowInputtemp[index]["releaser"],
        driver: rowInputtemp[index]["driver"],
        supervisor: rowInputtemp[index]["supervisor"],
      },
      { headers: headers }
    );
    let ssssss = [...InputObject];
    ssssss[index]["loading"] = false;
    InputObject = ssssss;
    setRowInput(InputObject);
    message.success("assigned staff updated");
    get_orders();
  };
  if (fresh == fresh) {
    let ind = 0;
    initiallySortedRows = [];
    for (var c = 0; c < data.length; c++) {
      var node = data[c];
      let dd = node;
      if (selectedOptionDeliveryMethod == node.delivery_method) {
        if (node.fulfillment_status == selectedOption) {
          let order_id = node._id;
          let customer_id =
            node.customer.length != 0 ? node.customer[0]._id : "";
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
          var bb =
            node.bagger != null
              ? node.bagger.length != 0
                ? node.bagger[0].name
                : null
              : "";
          var cc =
            node.checker != null
              ? node.checker.length != 0
                ? node.checker[0].name
                : null
              : "";
          var relea =
            node.releaser != null
              ? node.releaser.length != 0
                ? node.releaser[0].name
                : null
              : "";
          var driv =
            node.driver != null
              ? node.driver.length != 0
                ? node.driver[0].name
                : null
              : "";
          var superv =
            node.supervisor != null
              ? node.supervisor.length != 0
                ? node.supervisor[0].name
                : null
              : "";
          if (
            (node.order_no ? node.order_no.includes(filter) : "") ||
            item_number.includes(filter) ||
            moment(node.order_date)
              .format(
                settings != undefined ? settings.date_format : "MM-DD-YYYY"
              )
              .includes(filter) ||
            moment(node.order_date).format("h:mm a").includes(filter) ||
            (node.order_note ? node.order_note.includes(filter) : "") ||
            custom.includes(filter) ||
            bb.includes(filter) ||
            cc.includes(filter) ||
            relea.includes(filter) ||
            driv.includes(filter) ||
            superv.includes(filter) ||
            node.payment_status.includes(filter) ||
            node.fulfillment_status.includes(filter) ||
            numeral(node.payment_total).format("0,0.00").includes(filter) ||
            (node.payment_method ? node.payment_method.includes(filter) : "")
          ) {
            console.log("InputObject.length", InputObject.length);
            console.log("ind", ind);
            if (InputObject.length != data.length) {
              InputObject.push({
                index: c,
                _id: node._id,
                bagger:
                  node.bagger != null
                    ? node.bagger.length != 0
                      ? node.bagger[0]._id
                      : null
                    : null,
                checker:
                  node.checker != null
                    ? node.checker.length != 0
                      ? node.checker[0]._id
                      : null
                    : null,
                releaser:
                  node.releaser != null
                    ? node.releaser.length != 0
                      ? node.releaser[0]._id
                      : null
                    : null,
                driver:
                  node.driver != null
                    ? node.driver.length != 0
                      ? node.driver[0]._id
                      : null
                    : null,
                supervisor:
                  node.supervisor != null
                    ? node.supervisor.length != 0
                      ? node.supervisor[0]._id
                      : null
                    : null,
                loading: false,
              });
            }

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
                node.order_note !== undefined && node.order_note !== "" ? (
                  <Tooltip title="Note Attached">
                    <FileTextOutlined />
                  </Tooltip>
                ) : null,
              claim:
                node.delivery_method != undefined ? (
                  <Labels
                    color={
                      node.delivery_method == "For Delivery" ? "blue" : "gold"
                    }
                    label={node.delivery_method}
                  />
                ) : (
                  ""
                ),
              customer:
                node.customer.length != 0 ? (
                  <Button
                    type="link"
                    onClick={() => props.setCustomer(customer_id)}
                  >
                    {node.customer[0].fname + " " + node.customer[0].lname}
                  </Button>
                ) : (
                  "no Customer"
                ),
              bagger:
                node.bagger != null
                  ? node.bagger.length != 0
                    ? node.bagger[0].name
                    : "not assigned"
                  : "not assigned",
              bagger_input: (
                <Select
                  showSearch
                  disabled={disableBagger}
                  value={
                    InputObject.length != 0 ? InputObject[ind]["bagger"] : ""
                  }
                  style={{ width: 200 }}
                  placeholder="Select a person"
                  optionFilterProp="children"
                  onChange={(value) => {
                    update_component(ind, value, "bagger");
                  }}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {options.map((dat, index) => {
                    return [<Option value={dat._id}>{dat.name}</Option>];
                  })}
                </Select>
              ),
              checker:
                node.checker != null
                  ? node.checker.length != 0
                    ? node.checker[0].name
                    : "not assigned"
                  : "not assigned",
              checker_input: (
                <Select
                  showSearch
                  disabled={disableChecker}
                  value={
                    InputObject.length != 0 ? InputObject[ind]["checker"] : ""
                  }
                  style={{ width: 200 }}
                  placeholder="Select a person"
                  optionFilterProp="children"
                  onChange={(value) => {
                    update_component(ind, value, "checker");
                  }}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {options.map((dat, index) => {
                    return [<Option value={dat._id}>{dat.name}</Option>];
                  })}
                </Select>
              ),
              releaser:
                node.releaser != null
                  ? node.releaser.length != 0
                    ? node.releaser[0].name
                    : "not assigned"
                  : "not assigned",
              releaser_input: (
                <Select
                  showSearch
                  disabled={disableReleaser}
                  value={
                    InputObject.length != 0 ? InputObject[ind]["releaser"] : ""
                  }
                  style={{ width: 200 }}
                  placeholder="Select a person"
                  optionFilterProp="children"
                  onChange={(value) => {
                    update_component(ind, value, "releaser");
                  }}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {options.map((dat, index) => {
                    return [<Option value={dat._id}>{dat.name}</Option>];
                  })}
                </Select>
              ),
              driver:
                node.driver != null
                  ? node.driver.length != 0
                    ? node.driver[0].name
                    : "not assigned"
                  : "not assigned",
              driver_input: (
                <Select
                  disabled={disableDriver}
                  showSearch
                  value={
                    InputObject.length != 0 ? InputObject[ind]["driver"] : ""
                  }
                  style={{ width: 200 }}
                  placeholder="Select a person"
                  optionFilterProp="children"
                  onChange={(value) => {
                    update_component(ind, value, "driver");
                  }}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {options.map((dat, index) => {
                    return [<Option value={dat._id}>{dat.name}</Option>];
                  })}
                </Select>
              ),
              supervisor:
                node.supervisor != null
                  ? node.supervisor.length != 0
                    ? node.supervisor[0].name
                    : "not assigned"
                  : "not assigned",
              supervisor_input: (
                <Select
                  showSearch
                  disabled={disableSupervisor}
                  value={
                    InputObject.length != 0
                      ? InputObject[ind]["supervisor"]
                      : ""
                  }
                  style={{ width: 200 }}
                  placeholder="Select a person"
                  optionFilterProp="children"
                  onChange={(value) => {
                    update_component(ind, value, "supervisor");
                  }}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {options.map((dat, index) => {
                    return [<Option value={dat._id}>{dat.name}</Option>];
                  })}
                </Select>
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
                    node.fulfillment_status == "Completed"
                      ? "success"
                      : "warning"
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
                  <Button
                    loading={
                      InputObject.length != 0
                        ? InputObject[ind]["loading"]
                        : false
                    }
                    type="link"
                    icon={<ThunderboltOutlined />}
                    onClick={() => updateStaffs(ind)}
                  ></Button>
                </Space>
              ),
            });
          }
          ind++;
        }
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
    setFilter(event);
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
      title: "Claim",
      dataIndex: "claim",
      sorter: (a, b) => a.claim.length - b.claim.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Bagger",
      dataIndex: "bagger_input",
      sorter: (a, b) => a.bagger.length - b.bagger.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Checker/Counter",
      dataIndex: "checker_input",
      sorter: (a, b) => a.checker.length - b.checker.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Releaser",
      dataIndex: "releaser_input",
      sorter: (a, b) => a.releaser.length - b.releaser.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Driver",
      dataIndex: "driver_input",
      sorter: (a, b) => a.driver.length - b.driver.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Supervisor",
      dataIndex: "supervisor_input",
      sorter: (a, b) => a.supervisor.length - b.supervisor.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Action",
      dataIndex: "actions",
      align: "center",
    },
  ];
  const SetFilter = (value) => {
    setselectedOption(value);
  };
  const SetFilterDeliveryMethod = (value) => {
    setselectedOptionDeliveryMethod(value);
  };
  return [
    <div>
      <Row gutter={[16, 16]}>
        <Col span="24">
          <PrivateStaffNote ref={inputEl} />
          <Space>
            <Button
              onClick={() => {
                SetFilter("Pending");
              }}
              type={selectedOption == "Pending" ? "danger" : "primary"}
            >
              Pending
            </Button>
            <Button
              onClick={() => {
                SetFilter("Processing");
              }}
              type={selectedOption == "Processing" ? "danger" : "primary"}
            >
              Processing
            </Button>
            <Button
              onClick={() => {
                SetFilter("Picked");
              }}
              type={selectedOption == "Picked" ? "danger" : "primary"}
            >
              Picked
            </Button>
            <Button
              onClick={() => {
                SetFilter("Delivered");
              }}
              type={selectedOption == "Delivered" ? "danger" : "primary"}
            >
              Delivered
            </Button>
            <span> - </span>
            <Button
              onClick={() => {
                SetFilterDeliveryMethod("Standard Delivery");
              }}
              type={
                selectedOptionDeliveryMethod == "Standard Delivery"
                  ? "danger"
                  : "primary"
              }
            >
              Standard Delivery
            </Button>
            <Button
              onClick={() => {
                SetFilterDeliveryMethod("Exclusive Delivery");
              }}
              type={
                selectedOptionDeliveryMethod == "Exclusive Delivery"
                  ? "danger"
                  : "primary"
              }
            >
              Exclusive Delivery
            </Button>
            <Button
              onClick={() => {
                SetFilterDeliveryMethod("For Pick Up");
              }}
              type={
                selectedOptionDeliveryMethod == "For Pick Up"
                  ? "danger"
                  : "primary"
              }
            >
              For Pick Up
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
              className="custom-table"
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

export default Fulfillment;
