import React, { useState, useEffect } from "react";
import numeral from "numeral";
import moment from "moment";
import { Table, Tabs, PageHeader, Popconfirm, Button } from "antd";
import ButtonGroup from "antd/lib/button/button-group";
function AllOrders({ orderList, setOrderId, cancelOrder }) {
  const [list, setList] = useState([]);
  useEffect(() => {
    if (orderList.length != 0) {
      const filteredList = orderList.filter((order) => {
        return order.order_status.toLowerCase().includes("pending");
      });
      setList(filteredList);
    }
  }, [orderList]);
  const columns = [
    {
      title: "Order No",
      dataIndex: "order_no",
      key: "order_no",
      width: "9%",
      render: (value, row, index) => {
        return ["#" + value];
      },
    },
    {
      title: "Status",
      dataIndex: "order_status",
      key: "order_status",
      width: "9%",
    },
    {
      title: "Date of Purchase",
      dataIndex: "order_date",
      key: "order_date",
      width: "9%",
      render: (result) => {
        return [moment(result).format("MM-DD-YYYY")];
      },
    },
    {
      title: "Delivery Date",
      dataIndex: "delivery_date",
      key: "delivery_date",
      width: "9%",
      render: (result) => {
        return [result ? moment(result).format("MM-DD-YYYY") : null];
      },
    },
    {
      title: "Time of Receipt",
      dataIndex: "delivery_date",
      key: "delivery_date",
      width: "9%",
      render: (result, row) => {
        return [
          row.payment_info
            ? moment(row.payment_info.create_time).format("h:mm a")
            : null,
        ];
      },
    },
    {
      title: "Received By",
      dataIndex: "received_by",
      key: "received_by",
      width: "9%",
    },
    {
      title: "Delivered By",
      dataIndex: "delivered_by",
      key: "delivered_by",
      width: "9%",
    },
    {
      title: "Total",
      dataIndex: "payment_total",
      key: "payment_total",
      width: "9%",
      render: (result) => {
        return [result ? numeral(result).format("0,0.00") : ""];
      },
    },

    {
      title: "Action",
      dataIndex: "_id",
      key: "_id",
      width: "12%",
      align: "center",
      render: (result, row) => {
        return [
          <>
            <ButtonGroup>
              <Button
                type="link"
                size={"small"}
                onClick={() => setOrderId(result, row.order_no)}
              >
                View
              </Button>
              {row.order_status == "Pending" ? (
                <Popconfirm
                  title="Are you sure ?"
                  onConfirm={() => cancelOrder(row._id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="link" size={"small"}>
                    Cancel
                  </Button>
                </Popconfirm>
              ) : null}
            </ButtonGroup>
          </>,
        ];
      },
    },
  ];
  return [
    <div>
      <Table
        rowKey={(resource) => resource._id}
        dataSource={list}
        columns={columns}
        pagination={{
          position: ["bottomCenter"],
          defaultPageSize: 10,
        }}
        size="small"
      />
    </div>,
  ];
}

export default AllOrders;
