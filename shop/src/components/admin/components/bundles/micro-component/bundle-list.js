import React, { useState, useEffect } from "react";
import {
  Input,
  Row,
  Col,
  Table,
  Typography,
  Space,
  Button,
  Empty,
  Upload,
  message,
  Select,
  Divider,
  InputNumber,
  Switch,
  Card,
  Drawer,
  List,
  Menu,
} from "antd";
import { api_base_url, api_base_url_orders } from "../../../../../keys/index";
import Labels from "../../../../global-components/labels";
import moment from "moment";
import numeral from "numeral";
import {
  ThunderboltOutlined,
  FileSearchOutlined,
  CheckOutlined,
  AppstoreAddOutlined,
  BranchesOutlined,
  InboxOutlined,
  CloseOutlined,
  RightOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  UngroupOutlined,
} from "@ant-design/icons";
import axios from "axios";
const { Search } = Input;
const { Text } = Typography;
const { Dragger } = Upload;
const { Option } = Select;
const { SubMenu } = Menu;
function BundleList({ bundle_list, listener }) {
  const [showDrawer, setshowDrawer] = useState(true);
  const data = ["Bundle 1", "Bundle 2", "Bundle 3"];
  const [bundle_filter, setbundle_filter] = useState(true);
  const [sort_status, set_sort_status] = useState(undefined);
  const [bundle_list_container, set_bundle_list_container] = useState([]);
  useEffect(() => {
    set_bundle_list_container(bundle_list);
  }, [bundle_list]);
  useEffect(() => {
    console.log(sort_status);
    let bundle_container_temp = [...bundle_list_container];
    bundle_container_temp.sort(function (a, b) {
      var nameA = a.name.toLowerCase(),
        nameB = b.name.toLowerCase();
      if (sort_status == 1) {
        console.log("sorting 1");
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      } else {
        console.log("sorting -1");
        if (nameA > nameB) {
          return -1;
        }
        if (nameA < nameB) {
          return 1;
        }
        return 0;
      }
    });
    set_bundle_list_container(bundle_container_temp);
  }, [sort_status]);
  return [
    <>
      <Row align="middle" style={{ padding: 10 }}>
        <Col span="12">
          <Select
            style={{ width: "fit-content" }}
            dropdownMatchSelectWidth={false}
            bordered={false}
            value={bundle_filter}
            onChange={(e) => setbundle_filter(e)}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option value={true}>Active Bundles</Option>
            <Option value={false}>Inactive Bundles</Option>
          </Select>
        </Col>
        <Col span="12" style={{ textAlign: "right" }}>
          <Button
            type="text"
            onClick={() => {
              if (sort_status == undefined) {
                set_sort_status(1);
              } else {
                if (sort_status == 1) {
                  set_sort_status(-1);
                } else {
                  set_sort_status(1);
                }
              }
            }}
          >
            {sort_status == undefined ? (
              <UngroupOutlined />
            ) : sort_status == 1 ? (
              <SortAscendingOutlined />
            ) : (
              <SortDescendingOutlined />
            )}
          </Button>
        </Col>
      </Row>
      <Divider style={{ margin: "0px" }} />
      <Menu
        onSelect={(item, key) => {
          listener(item.key);
        }}
      >
        {bundle_list_container.map((value, index) => {
          if (bundle_filter == value.active) {
            return [
              <Menu.Item key={value._id}>
                <RightOutlined />
                <Text strong>{value.name}</Text>
                <Text>{" (" + value.bundle_items.length + " items)"}</Text>
              </Menu.Item>,
            ];
          }
        })}
      </Menu>
    </>,
  ];
}

export default BundleList;
