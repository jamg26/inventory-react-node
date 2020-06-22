import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Switch,
  Select,
  Input,
  Typography,
  Popconfirm,
  InputNumber,
} from "antd";
import {
  CloseOutlined,
  CheckOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import numeral from "numeral";
import { api_base_url, api_base_url_products } from "../../../../keys/index";

function Pricing(props) {
  const {
    priceData,
    priceColumn,
    colors,
    setColors,
    sizes,
    setSizes,
    variants,
    setVariants,
    variantToTable,
    markupData,
    showDiv,
    setshowDiv,
  } = props;
  useEffect(() => {
    variantToTable();
  }, [colors, sizes]);
  const [elementDisabled, setElementDisabled] = useState(true);
  // const [showDiv, setshowDiv] = useState(false);
  const [editingIndex, setEditingIndex] = useState(undefined);
  const [editable, setEditable] = useState(true);
  const handleChangeColor = (value) => {
    setColors(value);
  };
  const handleChangeSize = (value) => {
    setSizes(value);
  };
  const showOrEnable = () => {
    setElementDisabled(!elementDisabled);
    setshowDiv(!showDiv);
    setColors([]);
    setSizes([]);
  };
  const toggleEdit = (index) => {
    setEditingIndex(index);
    setEditable(false);
  };
  const setInput = (value, index, column) => {
    console.log(value, index, column);
    let tempdata = [...variants];
    tempdata[index][column] = value;
    setVariants(tempdata);
  };
  const onSave = (index) => {
    console.log(index);
    let tempdata = [...variants];
    let indexKey = tempdata.findIndex((item) => index === item.key);
    if (index > -1) {
      let item = tempdata[index];
      let supplier_price = item.supplier_price;
      let supplier_markup = parseFloat(markupData) / parseFloat(100);
      item.price_without_tax =
        parseFloat(supplier_price) +
        parseFloat(supplier_price) * parseFloat(supplier_markup);
      item.price_with_tax =
        parseFloat(supplier_price) +
        parseFloat(supplier_price) * parseFloat(supplier_markup) +
        parseFloat(supplier_price) * parseFloat(0.12);
      item.price =
        parseFloat(supplier_price) +
        parseFloat(supplier_price) * parseFloat(supplier_markup) +
        parseFloat(supplier_price) * parseFloat(0.12);

      console.log("item", tempdata);
      console.log("indexKey", indexKey);
      tempdata.splice(index, 1, { ...item });
      console.log("item 2", tempdata);
      setVariants(tempdata);
      setEditingIndex(undefined);
    }
    console.log(variants);
  };
  const removeItem = (key) => {
    const dataSource = [...variants];
    setVariants(dataSource.filter((item) => item.id !== key));
  };
  const variantColumns = [
    {
      title: "Variant Name",
      dataIndex: "option_title",
    },
    {
      title: "SKU",
      dataIndex: "sku",
      render: (value, row, index) => {
        if (index === editingIndex) {
          return [
            <Input
              key={index}
              disabled={editable}
              value={value}
              onChange={(event) => setInput(event.target.value, index, "sku")}
            />,
          ];
        } else {
          return [<Typography key={index}>{value}</Typography>];
        }
      },
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      render: (value, row, index) => {
        if (index === editingIndex) {
          return [
            <InputNumber
              key={index}
              style={{ width: "100%" }}
              disabled={editable}
              value={value}
              onChange={(event) => setInput(event, index, "quantity")}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />,
          ];
        } else {
          return [<Typography key={index}>{value}</Typography>];
        }
      },
    },
    {
      title: "Supply Price",
      dataIndex: "supplier_price",
      render: (value, row, index) => {
        if (index === editingIndex) {
          return [
            <InputNumber
              key={index}
              style={{ width: "100%" }}
              disabled={editable}
              value={value}
              onChange={(event) => setInput(event, index, "supplier_price")}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />,
          ];
        } else {
          return [<Typography key={index}>{value}</Typography>];
        }
      },
    },
    {
      title: "Markup (%)",
      dataIndex: "markup",
      render: (value) => <p style={{ marginBottom: -3 }}>{markupData + "%"}</p>,
    },
    {
      title: "Retail Price (w/o tax)",
      dataIndex: "price_without_tax",
      render: (value) => {
        return [numeral(value).format("0,0.0")];
      },
    },
    {
      title: "Retail Price (w/ tax)",
      dataIndex: "price_with_tax",
      render: (value) => {
        return [numeral(value).format("0,0.0")];
      },
    },
    {
      title: "Final Retail Price",
      dataIndex: "price",
      render: (value) => {
        return [numeral(value).format("0,0.0")];
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
                type={"link"}
                style={{ marginRight: 8 }}
                onClick={() => onSave(row.id)}
              >
                Save
              </Button>
            </React.Fragment>,
          ];
        } else {
          return [
            <React.Fragment key={index}>
              <Button
                style={{ marginRight: 8 }}
                type={"link"}
                disabled={editingIndex !== undefined}
                onClick={() => toggleEdit(index)}
              >
                Edit
              </Button>
              |
              <Popconfirm
                title="Are you sure?"
                okText="Yes"
                cancelText="No"
                onConfirm={() => removeItem(index)}
              >
                <Button
                  type={"link"}
                  style={{ marginLeft: -5 }}
                  disabled={editingIndex !== undefined}
                >
                  Delete
                </Button>
              </Popconfirm>
            </React.Fragment>,
          ];
        }
      },
    },
  ];

  return (
    <div>
      <div style={{ padding: "30px 0px 30px 40px", fontWeight: "bold" }}>
        <Switch
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          style={{ marginRight: 20 }}
          onChange={showOrEnable}
        />
        This product has multiple variants.
      </div>
      <div
        style={{
          backgroundColor: "#edf1f5",
          fontWeight: "bold",
          fontSize: "18px",
          padding: "15px 40px 20px 40px",
          marginBottom: 30,
          width: "50%",
          display: showDiv ? "block" : "none",
        }}
      >
        Variant Attribute/s
        <div style={{ paddingTop: "15px", paddingBottom: "10px" }}>
          <Button style={{ backgroundColor: "#6acfd4", width: 100 }}>
            Color <DownloadOutlined />
          </Button>
          <Select
            mode="tags"
            style={{ width: "43%", marginLeft: 15 }}
            placeholder="Enter color here"
            disabled={elementDisabled}
            onChange={handleChangeColor}
            value={colors}
          >
            {colors}
          </Select>
        </div>
        <div style={{ paddingBottom: "15px" }}>
          <Button style={{ backgroundColor: "#6acfd4", width: 100 }}>
            Size <DownloadOutlined />
          </Button>
          <Select
            mode="tags"
            style={{ width: "43%", marginLeft: 15 }}
            placeholder="Enter size here"
            disabled={elementDisabled}
            onChange={handleChangeSize}
            value={sizes}
          >
            {sizes}
          </Select>
        </div>
      </div>
      <div
        style={{
          backgroundColor: "#edf1f5",
          fontWeight: "bold",
          fontSize: "18px",
          padding: "15px 40px 20px 40px",
          marginBottom: 30,
          width: "75%",
        }}
      >
        Pricing
        <Table
          columns={priceColumn}
          dataSource={priceData}
          rowKey={"id"}
          bordered
          pagination={false}
          size={"small"}
          style={{ paddingTop: "10px", paddingBottom: "20px" }}
        />
        <Button
          type="primary"
          disabled={elementDisabled}
          onClick={variantToTable}
        >
          Apply to multiple variants
        </Button>
      </div>
      <div
        style={{
          backgroundColor: "#edf1f5",
          fontWeight: "bold",
          fontSize: "18px",
          padding: "15px 15px 20px 15px",
          display: showDiv ? "block" : "none",
          marginBottom: 40,
        }}
      >
        Variant Details - {variants.length} Variants
        <Table
          columns={variantColumns}
          dataSource={variants}
          rowKey={"id"}
          bordered
          pagination={false}
          size={"small"}
          style={{
            paddingTop: "10px",
            paddingBottom: "20px",
            fontWeight: "normal",
          }}
        />
      </div>
    </div>
  );
}

export default Pricing;
