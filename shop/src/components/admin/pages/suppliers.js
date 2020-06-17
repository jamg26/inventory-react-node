import React, { useEffect, useState } from "react";
import { UserContext } from "../../../routes/routes";
import {
  Button,
  Layout,
  Row,
  Col,
  Typography,
  PageHeader,
  Switch,
  Input,
  Table,
  message,
} from "antd";
import {
  ArrowRightOutlined,
  InboxOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { checkAuth } from "../../helper/authCheckAdmin";
import Side from "../inc/side";
import Header from "../inc/header";
import { withRouter } from "react-router-dom";
import LoadingPage from "../../global-components/loading";

import { api_base_url_orders } from "../../../keys/index";
import AddSupplierModal from "../../global-components/add_supplier";
import EditSupplierModal from "../../global-components/edit_supplier";
const { Content } = Layout;
const { Search } = Input;
const { Text } = Typography;
function Dashboard(props) {
  const [collaped, setCollaped] = useState(false);
  const [showComponent, setShowComponent] = useState(false);
  const [products, setProducts] = useState([]);
  const [show_add_supplier_modal, set_show_add_supplier_modal] = useState(
    false
  );
  const [SupplierList, setSupplierList] = useState([]);
  const [SupplierListFiltered, setSupplierListFiltered] = useState([]);
  const [searchword, setsearchword] = useState("");
  const [trigger, settrigger] = useState("");
  const [edit_data, set_edit_data] = useState(undefined);
  const [show_edit_supplier_modal, set_show_edit_supplier_modal] = useState(
    false
  );
  const get_suppliers = async () => {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.get(
      api_base_url_orders + "/supplier_list_all",
      {},
      { headers: headers }
    );
    setSupplierList(response.data);
  };
  useEffect(() => {
    let filtered = [];
    for (let c = 0; c < SupplierList.length; c++) {
      if (
        SupplierList[c].display_name
          .toLowerCase()
          .includes(searchword.toLowerCase()) ||
        SupplierList[c].supplier_code
          .toLowerCase()
          .includes(searchword.toLowerCase()) ||
        SupplierList[c].address
          .toLowerCase()
          .includes(searchword.toLowerCase()) ||
        SupplierList[c].email
          .toLowerCase()
          .includes(searchword.toLowerCase()) ||
        SupplierList[c].note.toLowerCase().includes(searchword.toLowerCase())
      ) {
        filtered.push(SupplierList[c]);
      }
    }
    setSupplierListFiltered(filtered);
  }, [SupplierList, trigger]);
  useEffect(() => {
    checkAuth(props, setShowComponent);
    get_suppliers();
  }, []);
  const update_status = async (value, id) => {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios
      .post(
        api_base_url_orders + "/update_supplier_status",
        { value, id },
        { headers: headers }
      )
      .then((response) => {
        message.success(response.data.message);
        get_suppliers();
      })
      .catch((err) => {
        message.error(err.response.data.message);
      });
  };
  const columns = [
    {
      title: "Supplier Name",
      dataIndex: "display_name",
      width: "11%",
    },
    {
      title: "Supplier Code",
      dataIndex: "supplier_code",
      width: "11%",
    },
    {
      title: "Company Name",
      dataIndex: "company_name",
      width: "11%",
    },
    {
      title: "Address",
      dataIndex: "address",
      width: "11%",
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "11%",
    },
    {
      title: "Note",
      dataIndex: "note",
      width: "11%",
    },
    {
      title: "Active",
      dataIndex: "active",
      width: "8%",
      align: "right",
      render: (value, row, index) => {
        return [
          <Switch
            onChange={(value) => {
              update_status(value, row._id);
            }}
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            checked={value}
          />,
        ];
      },
    },
    {
      title: "Action",
      dataIndex: "_id",
      width: "8%",
      align: "right",
      render: (value, row, index) => {
        return [
          <Button
            type="link"
            onClick={() => {
              set_edit_data(row);
              set_show_edit_supplier_modal(true);
            }}
          >
            Edit
          </Button>,
        ];
      },
    },
  ];
  if (showComponent) {
    return [
      <Layout key="0">
        {/* <Side no={props.no} /> */}
        <Layout style={{ height: "100vh" }}>
          <Header no={props.no} />
          <Content
            style={{
              margin: "0px 0px",
              overflow: "initial",
            }}
          >
            <div className="dyn-height">
              <PageHeader className="site-page-header" title="Suppliers" />
              <AddSupplierModal
                show_add_supplier_modal={show_add_supplier_modal}
                close={() => {
                  set_show_add_supplier_modal(false);
                }}
                callback={() => {
                  get_suppliers();
                }}
              />
              <EditSupplierModal
                show_edit_supplier_modal={show_edit_supplier_modal}
                edit_data={edit_data}
                close={() => {
                  set_show_edit_supplier_modal(false);
                }}
                callback={() => {
                  get_suppliers();
                }}
              />
              <Button
                type="primary"
                style={{ marginBottom: "10px" }}
                onClick={() => {
                  set_show_add_supplier_modal(true);
                }}
              >
                <InboxOutlined /> Add Supplier
              </Button>
              <Search
                placeholder="input search text"
                value={searchword}
                onChange={(event) => {
                  setsearchword(event.target.value);
                }}
                onSearch={(value) => {
                  settrigger(value);
                }}
                style={{ width: 200, float: "right" }}
              />
              <Table
                columns={columns}
                dataSource={SupplierListFiltered}
                pagination={{ position: ["bottomCenter"], size: "small" }}
              />
            </div>
          </Content>
        </Layout>
      </Layout>,
    ];
  } else {
    return [<LoadingPage tip="loading page..." />];
  }
}

export default withRouter(Dashboard);
