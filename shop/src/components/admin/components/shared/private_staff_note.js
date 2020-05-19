import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Modal, Select, Space, Typography, Input, Button, message } from "antd";
import { UsersContext } from "../../../../routes/routes";
import axios from "axios";
import { api_base_url_orders } from "../../../../keys";
const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;
const StaffNote = forwardRef((props, ref) => {
  const [visible, setVisibility] = useState(false);
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(false);
  const [staff, setStaff] = useState(undefined);
  const [note, setNote] = useState("");
  useImperativeHandle(ref, () => ({
    setVisiblle(node) {
      setVisibility(!visible);
      setOrder(node);
      console.log(node);
    },
  }));
  const Update_staff_note = async () => {
    setLoading(true);
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.post(
      api_base_url_orders + "/update_staffs_note",
      {
        order_id: order._id,
        staff_id: staff,
        note: note,
      },
      { headers: headers }
    );
    message.success("staff note added to Order " + order.order_no);
    ResetStates();
  };
  function ResetStates() {
    setLoading(false);
    setOrder([]);
    setStaff(undefined);
    setNote("");
    setVisibility(false);
  }
  const first =
    order.bagger != null
      ? order.bagger.length != 0
        ? order.bagger[0]._id
        : null
      : null;
  const second =
    order.checker != null
      ? order.checker.length != 0
        ? first != order.checker[0]._id
          ? order.checker[0]._id
          : null
        : null
      : null;
  const third =
    order.releaser != null
      ? order.releaser.length != 0
        ? first != order.releaser[0]._id && second != order.releaser[0]._id
          ? order.releaser[0]._id
          : null
        : null
      : null;
  const fourth =
    order.driver != null
      ? order.driver.length != 0
        ? first != order.driver[0]._id &&
          second != order.driver[0]._id &&
          third != order.driver[0]._id
          ? order.driver[0]._id
          : null
        : null
      : null;
  const last =
    order.supervisor != null
      ? order.supervisor.length != 0
        ? first != order.supervisor[0]._id &&
          second != order.supervisor[0]._id &&
          third != order.supervisor[0]._id &&
          fourth != order.supervisor[0]._id
          ? order.supervisor[0]._id
          : null
        : null
      : null;
  return [
    <div key="0">
      <Modal
        title={"Staff Note for Order " + order.order_no}
        visible={visible}
        footer={[
          <Button key="back" onClick={() => setVisibility(false)}>
            Return
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={() => Update_staff_note()}
          >
            Submit
          </Button>,
        ]}
        onCancel={() => setVisibility(false)}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Select a staff"
            optionFilterProp="children"
            onChange={(value) => setStaff(value)}
            value={staff}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {first != null ? (
              <Option value={order.bagger[0]._id}>
                {order.bagger[0].name}
              </Option>
            ) : null}
            {second != null ? (
              <Option value={order.checker[0]._id}>
                {order.checker[0].name}
              </Option>
            ) : null}
            {third != null ? (
              <Option value={order.releaser[0]._id}>
                {order.releaser[0].name}
              </Option>
            ) : null}
            {fourth != null ? (
              <Option value={order.driver[0]._id}>
                {order.driver[0].name}
              </Option>
            ) : null}
            {last != null ? (
              <Option value={order.supervisor[0]._id}>
                {order.supervisor[0].name}
              </Option>
            ) : null}
          </Select>

          <TextArea
            rows={4}
            placeholder="Place note here.."
            onChange={(event) => setNote(event.target.value)}
            value={note}
          />
        </Space>
      </Modal>
    </div>,
  ];
});

export default StaffNote;
