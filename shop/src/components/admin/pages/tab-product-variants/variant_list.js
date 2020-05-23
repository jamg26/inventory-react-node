import React, { useEffect, useState } from "react";
import { Table, Typography, Switch, Button, Input, Space, Empty } from "antd";
import {
  CloseOutlined,
  CheckOutlined,
  SaveOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import axios from "axios";
import { api_base_url, api_base_url_orders } from "../../../../keys/index";

function VariantList() {
  //const [data, setData] = useState([]);
  const [variantArray, setVariantArray] = useState([]);
  const [editingIndex, setEditingIndex] = useState(undefined);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchColumn] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  useEffect(() => {
    retrieveAllVariants();
  }, []);
  const retrieveAllVariants = () => {
    axios
      .get(api_base_url_orders + "/products/variants")
      .then((res) => {
        let arr = [];
        res.data.map((info) =>
          info.variants.map((x) =>
            arr.push({
              parent_id: info._id,
              variant_id: x._id,
              variant_name: x.option_title,
              variant_image: x.images,
              variant_sku: x.sku,
              variant_price: x.price,
              variant_quantity: x.quantity,
              variant_status: x.active,
            })
          )
        );
        setVariantArray(arr);
        console.log(res.data);
        console.log(arr);
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  const handleSwitchChange = (value, index, parentIndex) => {
    let newStatus = !value;
    var newData = {
      _id: index,
      active: newStatus,
    };
    console.log(index, value, parentIndex);
    axios
      .post(
        api_base_url_orders + "/products/variants/update_status/" + parentIndex,
        newData
      )
      .then((res) => retrieveAllVariants())
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
    var newStatus;
    for (let index = 0; index < selectedRows.length; index++) {
      newStatus = selectedRows[index].variant_status;
      let newData = {
        parent_id: selectedRows[index].parent_id,
        variant_id: selectedRows[index].variant_id,
        variant_active: newStatus,
      };
      arr.push(newData);
    }
    console.log(arr);
    axios
      .post(api_base_url_orders + "/products/variants/bulk_action", arr)
      .then((res) => {
        setVariantArray([...variantArray, arr]);
        retrieveAllVariants();
      })
      .catch((err) => console.log(err));
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };
  const bulkAction1 = () => {
    let arr = [];

    for (let index = 0; index < selectedRows.length; index++) {
      let newStatus = selectedRows[index].variant_status;
      let newData = {
        parent_id: selectedRows[index].parent_id,
        variant_id: selectedRows[index].variant_id,
        variant_active: !newStatus,
      };
      arr.push(newData);
    }
    console.log(arr);
    axios
      .post(api_base_url_orders + "/products/variants/bulk_action1", arr)
      .then((res) => {
        setVariantArray([...variantArray, arr]);
        retrieveAllVariants();
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
      title: "Variant Name",
      dataIndex: "variant_name",
      render: (value, row, index) => {
        return [<Typography key={index}>{value}</Typography>];
      },
      ...getColumnSearchProps("variant_name"),
    },
    {
      title: "Image",
      dataIndex: "variant_image",
      render: (value, row, index) => {
        console.log("value", value);
        return [
          <>
            {value == "" || value == undefined ? (
              Empty.PRESENTED_IMAGE_SIMPLE
            ) : (
              <img
                key={index}
                src={value}
                style={{ width: 50 }}
                alt={"No image"}
              />
            )}
          </>,
        ];
      },
    },
    {
      title: "SKU",
      dataIndex: "variant_sku",
      render: (value, row, index) => {
        return [<Typography key={index}>{value}</Typography>];
      },
      ...getColumnSearchProps("variant_sku"),
    },
    {
      title: "Quantity",
      dataIndex: "variant_quantity",
      render: (value, row, index) => {
        return [<Typography key={index}>{value}</Typography>];
      },
      ...getColumnSearchProps("variant_quantity"),
    },
    {
      title: "Price",
      dataIndex: "variant_price",
      render: (value, row, index) => {
        return [<Typography key={index}>{value}</Typography>];
      },
      ...getColumnSearchProps("variant_price"),
    },
    {
      title: "Status",
      dataIndex: "variant_status",
      render: (value, row, index) => {
        return [
          <Switch
            key={index}
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            checked={value ? true : false}
            onChange={() =>
              handleSwitchChange(
                row.variant_status,
                row.variant_id,
                row.parent_id
              )
            }
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
      //sorter: (a, b) =>  (a.active === b.active) ? 0 : a.active ? -1 : 1 ,
      //sortDirections: ['descend', 'ascend'],
    },
  ];
  return (
    <div>
      <Button
        type="primary"
        disabled={!hasSelected}
        style={{ marginBottom: 20 }}
        onClick={bulkAction}
      >
        Bulk Activate
      </Button>
      <Button
        type="primary"
        disabled={!hasSelected}
        style={{ marginBottom: 20, marginLeft: 20 }}
        onClick={bulkAction1}
      >
        Bulk Disable
      </Button>
      <Table
        columns={columns}
        rowKey={"variant_id"}
        dataSource={variantArray}
        pagination={{ position: "bottomRight" }}
        rowSelection={{ ...rowSelection }}
      />
    </div>
  );
}

export default VariantList;
