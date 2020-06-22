import React, { useState, useEffect } from "react";
import { Table, Input, Button, Switch, Typography } from "antd";
import {
  CloseOutlined,
  CheckOutlined,
  SaveOutlined,
  EditOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { api_base_url, api_base_url_products } from "../../../../keys/index";

const EditableTable = () => {
  const initialProductTagState = {
    _id: "",
    product_tag_name: "",
    product_tag_description: "",
    product_tag_active: true,
  };

  const [tag, setTag] = useState(initialProductTagState);
  const [data, setData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(undefined);
  const [editable, setEditable] = useState(true);

  useEffect(() => {
    retrieveAllTags();
  }, []);

  const retrieveAllTags = () => {
    axios
      .get(api_base_url_products + "/product_tags/")
      .then((res) => {
        setData(res.data);
        console.log(res.data);
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTag({ ...tag, [name]: value });
  };

  const addTag = () => {
    var data = {
      product_tag_name: tag.product_tag_name,
      product_tag_description: tag.product_tag_name + " tag description",
    };
    axios
      .post(api_base_url_products + "/product_tags/add", data)
      .then((res) => retrieveAllTags())
      .catch((err) => console.log("error why????????"));
    setTag((tag.product_tag_name = ""));
  };

  const toggleEdit = (index) => {
    setEditingIndex(index);
    setEditable(false);
  };

  const onSave = (index, tag_name, tag_desc, tag_status) => {
    var newData = {
      product_tag_name: tag_name,
      product_tag_description: tag_desc,
      product_tag_active: tag_status,
    };

    axios
      .post(api_base_url_products + "/product_tags/update/" + index, newData)
      .then((res) => retrieveAllTags())
      .catch((err) => console.log(newData));
    setEditingIndex(undefined);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "product_tag_name",
      render: (value, row, index) => {
        if (index === editingIndex) {
          return [
            <Input
              key={index}
              disabled={editable}
              value={value}
              onChange={(event) =>
                setInput(event.target.value, index, "product_tag_name")
              }
            />,
          ];
        } else {
          return [<Typography key={index}>{value}</Typography>];
        }
      },
    },
    {
      title: "Description",
      dataIndex: "product_tag_description",
      render: (value, row, index) => {
        if (index === editingIndex) {
          return [
            <Input
              key={index}
              disabled={editable}
              value={value}
              onChange={(event) =>
                setInput(event.target.value, index, "product_tag_description")
              }
            />,
          ];
        } else {
          return [<Typography key={index}>{value}</Typography>];
        }
      },
    },
    {
      title: "Status",
      dataIndex: "product_tag_active",
      render: (value, row, index) => {
        if (index === editingIndex) {
          return [
            <Switch
              key={index}
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
              defaultChecked={value ? true : false}
              disabled={editable}
              onChange={() =>
                handleSwitchChange(value, index, "product_tag_active")
              }
            />,
          ];
        } else {
          return [
            <Switch
              key={index}
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
              defaultChecked={value ? true : false}
              disabled
            />,
          ];
        }
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (value, row, index) => {
        if (index === editingIndex) {
          return [
            <React.Fragment key={index}>
              <Button
                icon={<SaveOutlined />}
                shape={"circle"}
                type={"primary"}
                style={{ marginRight: 8 }}
                onClick={() =>
                  onSave(
                    row._id,
                    row.product_tag_name,
                    row.product_tag_description,
                    row.product_tag_active
                  )
                }
              />
              <Button
                icon={<CloseOutlined />}
                shape={"circle"}
                onClick={() => setEditingIndex(undefined)}
              />
            </React.Fragment>,
          ];
        } else {
          return [
            <Button
              key={index}
              icon={<EditOutlined />}
              shape={"circle"}
              style={{ marginRight: 8 }}
              disabled={editingIndex !== undefined}
              onClick={() => toggleEdit(index)}
            />,
          ];
        }
      },
    },
  ];

  const setInput = (value, index, column) => {
    console.log(value, index, column);
    let tempdata = [...data];
    tempdata[index][column] = value;
    setData(tempdata);
  };

  const handleSwitchChange = (value, index, column) => {
    let newStatus = !value;
    console.log(newStatus, index, column);
    let tempdata = [...data];
    tempdata[index][column] = newStatus;
    setData(tempdata);
  };

  return (
    <div>
      <Input
        placeholder="Enter tag name here"
        value={tag.product_tag_name}
        type="text"
        onChange={handleInputChange}
        id="product_tag_name"
        name="product_tag_name"
        maxLength={22}
        style={{ width: 320, marginBottom: 10 }}
      />
      <Button
        style={{ marginLeft: 3 }}
        type={"primary"}
        onClick={addTag}
        disabled={!tag.product_tag_name}
      >
        Add
      </Button>
      <Table
        columns={columns}
        rowKey={"id"}
        dataSource={data}
        pagination={{ position: ["bottomCenter"], size: "small" }}
      />
    </div>
  );
};
export default EditableTable;
