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
} from "antd";
import Labels from "../../../global-components/labels";
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
} from "@ant-design/icons";
import axios from "axios";
import { api_base_url, api_base_url_orders } from "../../../../keys/index";
import BundleListSection from "./micro-component/bundle-list";
import BundleContentSection from "./micro-component/bundle-content";
const { Search } = Input;
const { Text } = Typography;
const { Dragger } = Upload;
const { Option } = Select;
function BundleList() {
  const [showDrawer, setshowDrawer] = useState(true);
  const [bundle_list, set_bundle_list] = useState([]);
  const [selected_bundle, set_selected_bundle] = useState("");
  const data = ["", "", ""];
  const FetchBundleList = async () => {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios
      .get(api_base_url_orders + "/bundle_list", {}, { headers: headers })
      .then((response) => {
        set_bundle_list(response.data.data);
      })
      .catch((err) => {
        FetchBundleList();
      });
  };
  useEffect(() => {
    FetchBundleList();
  }, []);
  useEffect(() => {
    console.log("selected", selected_bundle);
  }, [selected_bundle]);
  const bundleSelectListener = (e) => {
    set_selected_bundle(e);
  };
  return [
    <Row style={{ height: "100" }}>
      <Col span="5">
        <div
          className=" dyn-height"
          style={{
            padding: "0px",
            minHeight: "70vh",
            borderRight: "1px solid #ccc",
          }}
        >
          <BundleListSection
            bundle_list={bundle_list}
            listener={(e) => bundleSelectListener(e)}
          />
        </div>
      </Col>
      <Col span="19">
        <div
          className=" dyn-height"
          style={{
            padding: "0px",
            minHeight: "70vh",
            borderLeft: "1px solid #ccc",
          }}
        >
          <BundleContentSection
            bundle_list={bundle_list}
            selected={selected_bundle}
            refresh={() => {
              FetchBundleList();
              set_selected_bundle("");
            }}
          />
        </div>
      </Col>
    </Row>,
  ];
}

export default BundleList;
