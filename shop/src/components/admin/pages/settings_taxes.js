import React, { useEffect, useState, useContext } from "react";
import { TaxContext, TaxRefresher } from "../../../routes/routes";
import {
  Button,
  Layout,
  Row,
  Col,
  Typography,
  PageHeader,
  Statistic,
  Card,
  Empty,
  Divider,
  Input,
  Modal,
  message,
  Tabs,
  Space,
  Select,
  Table,
  InputNumber,
} from "antd";
import {
  ArrowRightOutlined,
  UserOutlined,
  PlusOutlined,
  CloseCircleOutlined,
  UndoOutlined,
  EditOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { checkAuth } from "../../helper/authCheckAdmin";
import Side from "../inc/settingsside";
import Header from "../inc/header";
import { withRouter } from "react-router-dom";
import LoadingPage from "../../global-components/loading";
import UserCount from "./analytics-cards/user_count_card";
import AbandonedCarts from "./analytics-cards/abandoned_cart";
import LowStocks from "./analytics-cards/product_on_low_stock";
import NoStocks from "./analytics-cards/product_on_no_stock";
import ActivePO from "./analytics-cards/active_po";
import DuePO from "./analytics-cards/due_po";
import { api_base_url_settings } from "../../../keys/index";
const { Content } = Layout;
const { Option } = Select;
const { TabPane } = Tabs;
const { Text, Paragraph } = Typography;
function Dashboard(props) {
  const tax_list = useContext(TaxContext);
  const tax_list_refresher = useContext(TaxRefresher);
  const [add_tax_group_modal, set_add_tax_group_modal] = useState(false);
  const [submit_loading, set_submit_loading] = useState(false);
  const [new_tax_group_name, set_new_tax_group_name] = useState("");
  const [new_tax_name, set_new_tax_name] = useState("");
  const [tax_rate, set_tax_rate] = useState(0);
  const [tax_name_tax_group, set_tax_name_tax_group] = useState(undefined);
  const [selected_tax_group, set_selected_tax_group] = useState("");
  const [selected_tax_detail, setselected_tax_detail] = useState(undefined);

  const [edit_tax_detail_modal, set_edit_tax_detail_modal] = useState(false);
  const [add_tax_name_modal, set_add_tax_name_modal] = useState(false);
  const [showComponent, setShowComponent] = useState(false);
  const [taxgroup_list, set_tax_group_list] = useState([]);
  const [filter, set_filter] = useState("All");
  const [edit_tax_name, set_edit_tax_name] = useState("");
  const [edit_tax_name_tax_group, set_edit_tax_name_tax_group] = useState(
    undefined
  );
  const [edit_tax_rate, set_edit_tax_rate] = useState(0);

  useEffect(() => {
    set_tax_group_list(tax_list);
    if (tax_list.length != 0) {
      set_selected_tax_group(tax_list[0]._id);
    }
  }, [tax_list]);
  useEffect(() => {
    checkAuth(props, setShowComponent);
  }, []);
  useEffect(() => {
    if (selected_tax_detail) {
      set_edit_tax_name(selected_tax_detail.name);
      set_edit_tax_name_tax_group(selected_tax_detail.tax_group_id);
      set_edit_tax_rate(selected_tax_detail.rate);
    }
  }, [selected_tax_detail]);
  const submit_edit_tax_name = async () => {
    set_submit_loading(true);
    if (edit_tax_name_tax_group == "") {
      set_submit_loading(false);
      message.error("Tax Name Group cannot be blank.");
    } else {
      if (edit_tax_name == "") {
        set_submit_loading(false);
        message.error("Tax Name cannot be blank.");
      } else {
        console.log("tax_rate", edit_tax_rate);
        if (edit_tax_rate === null) {
          set_submit_loading(false);
          message.error("Tax Rate cannot be blank.");
        } else {
          let webadmin_login_token = localStorage.getItem(
            "webadmin_login_token"
          );
          const headers = {
            "Content-Type": "application/json",
          };
          const response = await axios
            .post(
              api_base_url_settings + "/update_tax_name",
              {
                login_token: webadmin_login_token,
                name: edit_tax_name,
                tax_rate: edit_tax_rate,
                sub_id: selected_tax_detail._id,
                tax_name_tax_group: edit_tax_name_tax_group,
              },
              { headers: headers }
            )
            .then((response) => {
              message.success(response.data.message);
              tax_list_refresher();
              set_edit_tax_name("");
              set_edit_tax_name_tax_group(undefined);
              set_edit_tax_rate(0);
              set_edit_tax_detail_modal(false);
              set_submit_loading(false);
            })
            .catch((err) => {
              console.log(err);
              message.error(err.response.data.message);
              set_submit_loading(false);
            });
        }
      }
    }
  };
  const submit_new_tax_name = async () => {
    set_submit_loading(true);
    if (tax_name_tax_group == "") {
      set_submit_loading(false);
      message.error("Tax Name Group cannot be blank.");
    } else {
      if (new_tax_name == "") {
        set_submit_loading(false);
        message.error("Tax Name cannot be blank.");
      } else {
        console.log("tax_rate", tax_rate);
        if (tax_rate === null) {
          set_submit_loading(false);
          message.error("Tax Rate cannot be blank.");
        } else {
          let webadmin_login_token = localStorage.getItem(
            "webadmin_login_token"
          );
          const headers = {
            "Content-Type": "application/json",
          };
          const response = await axios
            .post(
              api_base_url_settings + "/update_tax_name",
              {
                login_token: webadmin_login_token,
                name: new_tax_name,
                tax_rate: tax_rate,
                tax_name_tax_group: tax_name_tax_group,
              },
              { headers: headers }
            )
            .then((response) => {
              message.success(response.data.message);
              tax_list_refresher();
              set_new_tax_name("");
              set_tax_name_tax_group(undefined);
              set_tax_rate(0);
              set_add_tax_name_modal(false);
              set_submit_loading(false);
            })
            .catch((err) => {
              console.log(err);
              message.error(err.response.data.message);
              set_submit_loading(false);
            });
        }
      }
    }
  };
  const submit_new_tax_group = async () => {
    set_submit_loading(true);
    if (new_tax_group_name == "") {
      set_submit_loading(false);
      message.error("Tax Group Name cannot be blank.");
    } else {
      let webadmin_login_token = localStorage.getItem("webadmin_login_token");
      const headers = {
        "Content-Type": "application/json",
      };
      const response = await axios
        .post(
          api_base_url_settings + "/add_tax_group",
          {
            login_token: webadmin_login_token,
            name: new_tax_group_name,
          },
          { headers: headers }
        )
        .then((response) => {
          message.success(response.data.message);
          tax_list_refresher();
          set_submit_loading(false);
          set_new_tax_group_name("");
          set_add_tax_group_modal(false);
        })
        .catch((err) => {
          console.log(err);
          message.error(err.response.data.message);
          set_submit_loading(false);
        });
    }
  };
  const activate_tax_group = async (active, id) => {
    let webadmin_login_token = localStorage.getItem("webadmin_login_token");
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios
      .post(
        api_base_url_settings + "/update_tax_group_status",
        {
          login_token: webadmin_login_token,
          active: active,
          id: id,
        },
        { headers: headers }
      )
      .then((response) => {
        message.success(response.data.message);
        tax_list_refresher();
        set_submit_loading(false);
      })
      .catch((err) => {
        console.log(err);
        message.error(err.response.data.message);
        set_submit_loading(false);
      });
  };
  const rename_tax_group = async (name, id) => {
    let webadmin_login_token = localStorage.getItem("webadmin_login_token");
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios
      .post(
        api_base_url_settings + "/update_tax_group_name",
        {
          login_token: webadmin_login_token,
          name: name,
          id: id,
        },
        { headers: headers }
      )
      .then((response) => {
        message.success(response.data.message);
        tax_list_refresher();
      })
      .catch((err) => {
        console.log(err);
        message.error(err.response.data.message);
      });
  };
  const switchactivestatus = async (newactive, tax_id, tax_group_id) => {
    console.log(newactive, tax_id);
    let webadmin_login_token = localStorage.getItem("webadmin_login_token");
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios
      .post(
        api_base_url_settings + "/update_tax_status",
        {
          login_token: webadmin_login_token,
          newactive: newactive,
          id:
            selected_tax_group == ""
              ? taxgroup_list.length != 0
                ? taxgroup_list[0]._id
                : null
              : selected_tax_group,
          sub_id: tax_id,
        },
        { headers: headers }
      )
      .then((response) => {
        message.success(response.data.message);
        tax_list_refresher();
      })
      .catch((err) => {
        console.log(err);
        message.error(err.response.data.message);
      });
  };
  const edit_tax_detail = (row, index) => {
    setselected_tax_detail(row);
    set_edit_tax_detail_modal(true);
  };
  const columns = [
    {
      title: "Tax Name",
      dataIndex: "name",
      width: "60%",
      render: (value, row, index) => {
        return [
          <Text>
            <Button
              type="link"
              onClick={() => {
                edit_tax_detail(row, index);
              }}
            >
              <EditOutlined />
            </Button>{" "}
            {value}
          </Text>,
        ];
      },
    },
    {
      title: "Rate(%)",
      dataIndex: "rate",
      width: "30%",
      render: (value) => {
        return [value + "%"];
      },
    },
    {
      title: "",
      dataIndex: "_id",
      width: "10%",
      render: (value, row, index) => {
        return [
          row.active ? (
            <Button
              style={{ color: "red" }}
              type="link"
              title="disable"
              onClick={() => {
                switchactivestatus(false, row._id, row.tax_group_id);
              }}
            >
              <CloseCircleOutlined />
            </Button>
          ) : (
            <Button
              type="link"
              title="activate"
              onClick={() => {
                switchactivestatus(true, row._id, row.tax_group_id);
              }}
            >
              <UndoOutlined />
            </Button>
          ),
        ];
      },
    },
  ];
  if (showComponent) {
    return [
      <Layout key="0">
        <Side no={props.no} />
        <Layout style={{ height: "100vh" }}>
          <Header no={props.no} />
          <Content
            style={{
              margin: "24px 16px 24px 16px",
              overflow: "initial",
              backgroundColor: "white",
              borderBottom: "1px solid rgba(0,0,0,0.2)",
              borderRight: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            <div className="site-layout-background dyn-height">
              <Modal
                title="New Tax Group"
                visible={add_tax_group_modal}
                onCancel={() => {
                  set_new_tax_group_name("");
                  set_add_tax_group_modal(false);
                }}
                onOk={() => {
                  submit_new_tax_group();
                }}
                okText="Submit"
                okButtonProps={{ loading: submit_loading }}
              >
                <Text>Tax Group Name</Text>
                <Input
                  placeholder="maximum of 22 characters"
                  onPressEnter={() => {
                    submit_new_tax_group();
                  }}
                  maxLength={22}
                  value={new_tax_group_name}
                  onChange={(event) => {
                    set_new_tax_group_name(event.target.value);
                  }}
                />
              </Modal>
              <Modal
                title="New Tax"
                visible={add_tax_name_modal}
                onCancel={() => {
                  set_new_tax_name("");
                  set_tax_name_tax_group(undefined);
                  set_tax_rate(0);
                  set_add_tax_name_modal(false);
                }}
                onOk={() => {
                  submit_edit_tax_name();
                }}
                okText="Submit"
                okButtonProps={{
                  loading: submit_loading,
                  disabled: submit_loading,
                }}
              >
                <Row gutter={[16, 16]}>
                  <Col span="24">
                    <Text strong>Tax Group Name</Text>
                    <Select
                      showSearch
                      style={{ width: "100%" }}
                      value={tax_name_tax_group}
                      onChange={(e) => {
                        set_tax_name_tax_group(e);
                      }}
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {taxgroup_list.length != 0
                        ? taxgroup_list.map((data, index) => {
                            return [
                              <Option value={data._id}>
                                {data.tax_group_name}
                              </Option>,
                            ];
                          })
                        : null}
                    </Select>
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col span="24">
                    <Text strong>Tax Name</Text>
                    <Input
                      placeholder="maximum of 22 characters"
                      onPressEnter={() => {
                        submit_new_tax_name();
                      }}
                      maxLength={22}
                      value={new_tax_name}
                      onChange={(event) => {
                        set_new_tax_name(event.target.value);
                      }}
                    />
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col span="24">
                    <Text strong>Rate (%)</Text>
                    <InputNumber
                      min={0}
                      style={{ width: "100%" }}
                      formatter={(value) => `${value}%`}
                      parser={(value) => value.replace("%", "")}
                      value={tax_rate}
                      onChange={(event) => {
                        set_tax_rate(event);
                      }}
                      onPressEnter={() => {
                        submit_new_tax_name();
                      }}
                    />
                  </Col>
                </Row>
              </Modal>

              <Modal
                title="Edit Tax"
                visible={edit_tax_detail_modal}
                onCancel={() => {
                  set_edit_tax_name("");
                  set_edit_tax_name_tax_group(undefined);
                  set_edit_tax_rate(0);
                  set_edit_tax_detail_modal(false);
                }}
                onOk={() => {
                  submit_edit_tax_name();
                }}
                okText="Submit"
                okButtonProps={{
                  loading: submit_loading,
                  disabled: submit_loading,
                }}
              >
                <Row gutter={[16, 16]}>
                  <Col span="24">
                    <Text strong>Tax Group Name</Text>
                    <Select
                      showSearch
                      style={{ width: "100%" }}
                      value={edit_tax_name_tax_group}
                      disabled
                      onChange={(e) => {
                        set_edit_tax_name_tax_group(e);
                      }}
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {taxgroup_list.length != 0
                        ? taxgroup_list.map((data, index) => {
                            return [
                              <Option value={data._id}>
                                {data.tax_group_name}
                              </Option>,
                            ];
                          })
                        : null}
                    </Select>
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col span="24">
                    <Text strong>Tax Name</Text>
                    <Input
                      placeholder="maximum of 22 characters"
                      onPressEnter={() => {
                        submit_edit_tax_name();
                      }}
                      maxLength={22}
                      value={edit_tax_name}
                      onChange={(event) => {
                        set_edit_tax_name(event.target.value);
                      }}
                    />
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col span="24">
                    <Text strong>Rate (%)</Text>
                    <InputNumber
                      min={0}
                      style={{ width: "100%" }}
                      formatter={(value) => `${value}%`}
                      parser={(value) => value.replace("%", "")}
                      value={edit_tax_rate}
                      onChange={(event) => {
                        set_edit_tax_rate(event);
                      }}
                      onPressEnter={() => {
                        submit_edit_tax_name();
                      }}
                    />
                  </Col>
                </Row>
              </Modal>

              <h1>Taxes</h1>
              <Divider />
              {taxgroup_list.length != 0 ? (
                <>
                  <h1>Tax Group</h1>
                  <Row gutter={[16, 16]}>
                    <Col span="12">
                      <Select
                        style={{ width: 200 }}
                        value={filter}
                        onChange={(event) => {
                          set_filter(event);
                        }}
                      >
                        <Option value="All">All</Option>
                        <Option value="Active">Active</Option>
                        <Option value="Disabled">Disabled</Option>
                      </Select>
                    </Col>
                    <Col span="12" style={{ textAlign: "right" }}>
                      <Space>
                        <Button
                          type="primary"
                          onClick={() => {
                            set_add_tax_name_modal(true);
                          }}
                        >
                          <PlusOutlined /> New Tax
                        </Button>
                        <Button
                          type="primary"
                          onClick={() => {
                            set_add_tax_group_modal(true);
                          }}
                        >
                          <PlusOutlined /> New Tax Group
                        </Button>
                      </Space>
                    </Col>
                  </Row>
                  <Row gutter={[16, 16]}>
                    <Col span="24">
                      <Tabs
                        defaultActiveKey={"asdsa"}
                        tabPosition="left"
                        tabBarGutter={0}
                        onChange={(activeKey) => {
                          set_selected_tax_group(activeKey);
                        }}
                      >
                        {taxgroup_list.map((data, index) => {
                          let active_status = filter == "Active" ? true : false;
                          if (data.active == active_status || filter == "All") {
                            return [
                              <TabPane tab={data.tax_group_name} key={data._id}>
                                <Row gutter={[16, 16]}>
                                  <Col span="12">
                                    <Paragraph
                                      strong
                                      editable={{
                                        onChange: (str) => {
                                          rename_tax_group(str, data._id);
                                        },
                                      }}
                                    >
                                      {data.tax_group_name}
                                    </Paragraph>
                                  </Col>
                                  <Col span="12" style={{ textAlign: "right" }}>
                                    {data.active ? (
                                      <Button
                                        type="danger"
                                        onClick={() => {
                                          activate_tax_group(false, data._id);
                                        }}
                                      >
                                        Disable Tax Group
                                      </Button>
                                    ) : (
                                      <Button
                                        type="dashed"
                                        onClick={() => {
                                          activate_tax_group(true, data._id);
                                        }}
                                      >
                                        Activate Tax Group
                                      </Button>
                                    )}
                                  </Col>
                                </Row>
                                <Row gutter={[16, 16]}>
                                  <Col span="24">
                                    <Table
                                      columns={columns}
                                      dataSource={data.tax_names}
                                      pagination={{
                                        position: ["bottomCenter"],
                                        size: "small",
                                      }}
                                    />
                                  </Col>
                                </Row>
                              </TabPane>,
                            ];
                          }
                        })}
                      </Tabs>
                    </Col>
                  </Row>
                </>
              ) : (
                <Empty
                  image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                  description={<span>No Tax Group Yet..</span>}
                >
                  <Button
                    type="primary"
                    onClick={() => {
                      set_add_tax_group_modal(true);
                    }}
                  >
                    Create Now
                  </Button>
                </Empty>
              )}
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
