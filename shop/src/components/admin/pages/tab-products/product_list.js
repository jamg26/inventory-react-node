import React, { useEffect, useState } from "react";
import { Table, Typography, Switch, Button, Input, Space } from "antd";
import {
  CloseOutlined,
  CheckOutlined,
  SaveOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import axios from "axios";
import { api_base_url, api_base_url_products } from "../../../../keys/index";

function ProductList() {
  const [data, setData] = useState([]);
  const [tags, setTags] = useState([]);
  const [editingIndex, setEditingIndex] = useState(undefined);
  const [editable, setEditable] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchColumn] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  useEffect(() => {
    retrieveAllProducts();
  }, []);
  const retrieveAllProducts = () => {
    axios
      .get(api_base_url_products + "/products/all")
      .then((res) => {
        let arrtag = [];
        res.data.map((info) =>
          info.product_tags.map((x) =>
            arrtag.push({
              parent_id: info._id,
              tag_id: x._id,
              tag_name: x.tag_label,
            })
          )
        );
        setData(res.data);
      })
      .catch(function (err) {
        console.log(err);
      });
  };
  const handleSwitchChange = (value, index) => {
    let newStatus = !value;
    var newData = {
      active: newStatus,
    };
    axios
      .post(api_base_url_products + "/products/update_status/" + index, newData)
      .then((res) => retrieveAllProducts())
      .catch((err) => console.log(err));
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      //console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      console.log(
        "selectedRowKeys: ",
        selectedRowKeys,
        "selectedRows: ",
        selectedRows
      );
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(selectedRows);
    },
  };
  const bulkAction = () => {
    let arr = [];
    for (let index = 0; index < selectedRows.length; index++) {
      var newData = {
        id: selectedRows[index]._id,
        active: !selectedRows[index].active,
      };
      arr.push(newData);
    }
    axios
      .post(api_base_url_products + "/products/bulk_action", arr)
      .then((res) => {
        setData([...data, arr]);
        retrieveAllProducts();
      })
      .catch((err) => console.log(err));
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };
  const hasSelected = selectedRows.length > 0;
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  });
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "product_name",
      render: (value, row, index) => {
        return [<Typography key={index}>{value}</Typography>];
      },
      ...getColumnSearchProps("product_name"),
    },
    {
      title: "Description",
      dataIndex: "product_description",
      render: (value, row, index) => {
        return [<Typography key={index}>{value}</Typography>];
      },
      ...getColumnSearchProps("product_description"),
    },
    {
      title: "Status",
      dataIndex: "active",
      render: (value, row, index) => {
        return [
          <Switch
            key={index}
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            checked={value ? true : false}
            onChange={() => handleSwitchChange(row.active, row._id)}
          />,
        ];
      },
      filters: [
        {
          text: "Active",
          value: true,
        },
        {
          text: "Disabled",
          value: false,
        },
      ],
      onFilter: (value, record) => String(record.active) === String(value),
    },
    /*{
          title: 'Action',
          dataIndex: 'action',
          render: (value, row, index) => {
            if (index === editingIndex) {
              return [
                <React.Fragment key={index}>
                  <Button icon={<SaveOutlined />} shape={"circle"} type={"primary"} style={{ marginRight: 8 }} />
                  <Button icon={<CloseOutlined />} shape={"circle"}  />
                </React.Fragment>
              ];
            } else {
              return [
                <Button key={index} icon={<EditOutlined />} shape={"circle"} style={{ marginRight: 8 }} disabled={editingIndex !== undefined} />
              ];
            }
          }
        }*/
  ];

  return (
    <div>
      <Button
        type="primary"
        disabled={!hasSelected}
        style={{ marginBottom: 20 }}
        onClick={bulkAction}
      >
        Bulk Change Status
      </Button>
      <Table
        columns={columns}
        rowKey={"_id"}
        dataSource={data}
        pagination={{ position: ["bottomCenter"], size: "small" }}
        rowSelection={{ ...rowSelection }}
      />
    </div>
  );
}

export default ProductList;
