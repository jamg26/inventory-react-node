import React, { useState, useEffect, useContext } from "react";
import numeral from "numeral";
import moment from "moment";
import { Table, Input, Tabs, PageHeader, Card, Button } from "antd";
import { UserContext, SettingContext } from "../../../routes/routes";
function AllOrders({ orderList, setOrderId }) {
  var settings = useContext(SettingContext);
  const [list, setList] = useState([]);
  useEffect(() => {
    if (orderList.length != 0) {
      const filteredList = orderList.filter((order) => {
        return order.order_status
          .toLowerCase()
          .includes("for delivery/pick up");
      });
      setList(filteredList);
    }
  }, [orderList]);
  const columns = [
    {
      title: "Order No",
      dataIndex: "order_no",
      key: "order_no",
      width: "12%",
      render: (value, row, index) => {
        return ["#" + value];
      },
    },
    {
      title: "Status",
      dataIndex: "order_status",
      key: "order_status",
      width: "12%",
    },
    {
      title: "Date of Purchase",
      dataIndex: "order_date",
      key: "order_date",
      width: "12%",
      render: (result) => {
        return [
          moment(result).format(
            settings != undefined ? settings.date_format : "MM-DD-YYYY"
          ),
        ];
      },
    },
    {
      title: "Delivery Date",
      dataIndex: "delivery_date",
      key: "delivery_date",
      width: "12%",
      render: (result) => {
        return [
          result
            ? moment(result).format(
                settings != undefined ? settings.date_format : "MM-DD-YYYY"
              )
            : null,
        ];
      },
    },
    {
      title: "Time of Receipt",
      dataIndex: "delivery_date",
      key: "delivery_date",
      width: "12%",
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
      width: "12%",
    },
    {
      title: "Delivered By",
      dataIndex: "delivered_by",
      key: "delivered_by",
      width: "12%",
    },
    {
      title: "Total",
      dataIndex: "payment_total",
      key: "payment_total",
      width: "12%",
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
          <Button type="link" onClick={() => setOrderId(result, row.order_no)}>
            View
          </Button>,
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
