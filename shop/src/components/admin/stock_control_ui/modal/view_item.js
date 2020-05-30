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
  Popconfirm,
  Card,
  Modal,
} from "antd";
import {
  CloseOutlined,
  CheckOutlined,
  EditOutlined,
  StopOutlined,
} from "@ant-design/icons";
import numeral from "numeral";
import { CSVLink } from "react-csv";
import axios from "axios";
import moment from "moment";
import { api_base_url_orders } from "../../../../keys/index";
const { Text } = Typography;
function ViewItem({ viewitemModal, close, data, refresh }) {
  const [viewdata, setviewdata] = useState(undefined);
  const [editdata, seteditdata] = useState(false);
  const [loadingreceive, setloadingreceive] = useState(false);
  const [po_no_edit, setpo_no_edit] = useState("");
  useEffect(() => {
    if (data != undefined) {
      console.log(data.supplier);
      setviewdata(data);
    }
  }, [data]);
  const receive_item = async (id) => {
    setloadingreceive(true);
    let webadmin_id = localStorage.getItem("webadmin_id");
    let webadmin_login_token = localStorage.getItem("webadmin_login_token");
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios
      .post(
        api_base_url_orders + "/receive_po_item",
        {
          login_token: webadmin_login_token,
          webadmin_id: webadmin_id,
          id: id,
        },
        { headers: headers }
      )
      .then((response) => {
        setloadingreceive(false);
        close();
        refresh();
        message.success(`Successfully received an item`);
      })
      .catch((err) => {
        setloadingreceive(false);
      });
  };
  const void_item = async (id) => {
    setloadingreceive(true);
    let webadmin_id = localStorage.getItem("webadmin_id");
    let webadmin_login_token = localStorage.getItem("webadmin_login_token");
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios
      .post(
        api_base_url_orders + "/void_po_item",
        {
          login_token: webadmin_login_token,
          webadmin_id: webadmin_id,
          id: id,
        },
        { headers: headers }
      )
      .then((response) => {
        setloadingreceive(false);
        close();
        refresh();
        message.success(`Successfully received an item`);
      })
      .catch((err) => {
        setloadingreceive(false);
      });
  };
  if (viewdata == undefined) {
    return null;
  }
  return [
    <Modal
      title={viewdata ? viewdata.type : "No Type"}
      visible={viewitemModal}
      width="35%"
      footer={[
        !editdata ? (
          viewdata.status != "Void" &&
          viewdata.status != "Issued" &&
          viewdata.status != "DRAFT" ? (
            <Popconfirm
              title="Are you Sure?"
              onConfirm={() => {
                void_item(viewdata._id);
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button type="danger">
                <StopOutlined /> Void
              </Button>
            </Popconfirm>
          ) : null
        ) : null,
        !editdata ? (
          viewdata.status != "Void" &&
          viewdata.status != "Issued" &&
          viewdata.status != "DRAFT" ? (
            <Popconfirm
              title="Are you Sure?"
              onConfirm={() => {
                receive_item(viewdata._id);
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" loading={loadingreceive}>
                <CheckOutlined /> Receive
              </Button>
            </Popconfirm>
          ) : null
        ) : null,
        editdata ? (
          <Button
            type="default"
            onClick={() => {
              seteditdata(true);
            }}
          >
            <EditOutlined /> Edit
          </Button>
        ) : null,
        editdata ? (
          <Button
            type="defalt"
            onClick={() => {
              seteditdata(false);
            }}
          >
            Cancel
          </Button>
        ) : null,
        editdata ? (
          <Button type="primary" onClick={() => {}}>
            Update
          </Button>
        ) : null,
      ]}
      onCancel={close}
    >
      <Text strong>{viewdata ? viewdata.type : ""}</Text>
      <br />
      <Text strong>PO No.: </Text>
      {editdata ? (
        <Input value={viewdata.po_no} />
      ) : (
        <Text>{viewdata ? viewdata.po_no : ""}</Text>
      )}

      <br />
      <Text strong>Date.: </Text>
      <Text>
        {viewdata ? moment(viewdata.created_at).format("MM-DD-YYYY") : ""}
      </Text>
      <br />
      <Text strong>PO Status.: </Text>
      <Text>{viewdata ? viewdata.status : ""}</Text>
      <br />

      <table className="table-card-type">
        <thead>
          <tr>
            <th style={{ verticalAlign: "middle" }} colSpan="2">
              SUPPLIER
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ verticalAlign: "middle" }}>
              {viewdata ? (
                viewdata.supplier &&
                viewdata.supplier != 0 &&
                viewdata.supplier[0].display_name != "" ? (
                  <Text strong>{viewdata.supplier[0].display_name}</Text>
                ) : (
                  ""
                )
              ) : (
                ""
              )}

              {viewdata ? (
                viewdata.supplier &&
                viewdata.supplier != 0 &&
                viewdata.supplier[0].company_name != "" ? (
                  <>
                    <br />
                    <Text>{viewdata.supplier[0].company_name}</Text>
                  </>
                ) : (
                  ""
                )
              ) : (
                ""
              )}

              {viewdata ? (
                viewdata.supplier &&
                viewdata.supplier != 0 &&
                viewdata.supplier[0].supplier_code != "" ? (
                  <>
                    <br />
                    <Text>{viewdata.supplier[0].supplier_code}</Text>
                  </>
                ) : (
                  ""
                )
              ) : (
                ""
              )}
            </td>
            <td style={{ verticalAlign: "middle" }}>
              {viewdata ? (
                viewdata.supplier &&
                viewdata.supplier != 0 &&
                viewdata.supplier[0].email != "" ? (
                  <>
                    {" "}
                    <Text>{viewdata.supplier[0].email}</Text>{" "}
                  </>
                ) : (
                  ""
                )
              ) : (
                ""
              )}

              {viewdata ? (
                viewdata.supplier &&
                viewdata.supplier != 0 &&
                viewdata.supplier[0].site_url != "" ? (
                  <>
                    <br />
                    <Text>{viewdata.supplier[0].site_url} </Text>
                  </>
                ) : (
                  ""
                )
              ) : (
                ""
              )}

              {viewdata ? (
                viewdata.supplier &&
                viewdata.supplier != 0 &&
                viewdata.supplier[0].address != "" ? (
                  <>
                    <br />
                    <Text>{viewdata.supplier[0].address}</Text>
                  </>
                ) : (
                  ""
                )
              ) : (
                ""
              )}
            </td>
          </tr>
        </tbody>
      </table>
      <table className="table-card-type">
        <thead>
          <tr>
            <th style={{ verticalAlign: "middle" }}>DELIVERY DATE</th>
            <th style={{ verticalAlign: "middle" }}>ENTRY BY</th>
            <th style={{ verticalAlign: "middle" }}>RECEIVED BY</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ verticalAlign: "middle" }}>
              {moment(viewdata.delivery_due_date).format("MM-DD-YYYY")}
            </td>
            <td style={{ verticalAlign: "middle" }}>
              {viewdata.entry_by && viewdata.entry_by.length != 0
                ? viewdata.entry_by[0].name
                : ""}
            </td>
            <td style={{ verticalAlign: "middle" }}>
              {viewdata.received_by && viewdata.received_by.length != 0
                ? viewdata.received_by[0].name
                : ""}
            </td>
          </tr>
        </tbody>
      </table>
      <table className="table-card-type">
        <thead>
          <tr>
            <th style={{ verticalAlign: "middle" }}>NOTES</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ verticalAlign: "middle" }}>
              {viewdata.supplier_note != ""
                ? viewdata.supplier_note
                : "No Note attached"}
            </td>
          </tr>
        </tbody>
      </table>
      <table className="table-card-type">
        <thead>
          <tr>
            <th style={{ verticalAlign: "middle" }}>ITEM NAME</th>
            <th style={{ verticalAlign: "middle" }}>SKU</th>
            <th style={{ verticalAlign: "middle", textAlign: "center" }}>
              QTY.
            </th>
            <th style={{ verticalAlign: "middle", textAlign: "right" }}>
              PRICE
            </th>
            <th style={{ verticalAlign: "middle", textAlign: "right" }}>
              TOTAL
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ verticalAlign: "middle" }}>
              {viewdata.product && viewdata.product.length != 0
                ? viewdata.product[0].variants.map((row, index) => {
                    if (row._id == viewdata.variant) {
                      return [row.option_title];
                    }
                  })
                : ""}
            </td>
            <td style={{ verticalAlign: "middle" }}>
              {viewdata.product && viewdata.product.length != 0
                ? viewdata.product[0].variants.map((row, index) => {
                    if (row._id == viewdata.variant) {
                      return [row.sku];
                    }
                  })
                : ""}
            </td>
            <td style={{ verticalAlign: "middle", textAlign: "center" }}>
              {numeral(viewdata.quantity).format("0,0")}
            </td>
            <td style={{ verticalAlign: "middle", textAlign: "right" }}>
              {numeral(
                parseFloat(viewdata.item_cost) +
                  parseFloat(
                    parseFloat(viewdata.tax) / parseFloat(viewdata.quantity)
                  )
              ).format("0,0.00")}
            </td>
            <td style={{ verticalAlign: "middle", textAlign: "right" }}>
              {numeral(viewdata.total).format("0,0.00")}
            </td>
          </tr>
        </tbody>
      </table>
    </Modal>,
  ];
}
export default ViewItem;
