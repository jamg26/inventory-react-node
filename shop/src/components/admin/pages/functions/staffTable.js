import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Button,
  Table,
  Row,
  Col,
  Select,
  Input,
  Menu,
  Dropdown,
  Modal,
  Form,
  Space,
  Tag,
  DatePicker,
  message,
  Timeline,
  Badge,
} from "antd";
import {
  UserAddOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
} from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import { api_base_url, api_base_url_orders } from "../../../../keys/index";
var monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
var date = new Date().getDate();
var month = monthNames[new Date().getMonth()];
var year = new Date().getFullYear();

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

function StaffTable() {
  const [staff, setStaff] = useState([]);
  const [dateToday, setDate] = useState("");
  const { Option } = Select;
  const { Search } = Input;

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "15%",
      align: "center",
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
      width: "15%",
      align: "center",
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      width: "25%",
      align: "center",
      render: (note, staff) => (
        <>
          {note.map((notes) =>
            notes.status.toString() == "true" ? (
              <Tag
                color="processing"
                className="site-tag-plus"
                closable={true}
                onClose={() => handleDeleteNote(notes._id, staff._id)}
              >
                {notes.info}
              </Tag>
            ) : null
          )}
        </>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "15%",
      align: "center",
      render: (status) =>
        status.toString() == "true" ? (
          <CheckCircleTwoTone twoToneColor="#52c41a" />
        ) : (
          <CloseCircleTwoTone twoToneColor="#eb2f96" />
        ),
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
      onFilter: (value, record) => {
        console.log(typeof value, "this type");
        return record.status.toString().includes(value);
      },
    },
    {
      title: "Actions",
      dataIndex: "_id",
      key: "_id",
      width: "25%",
      align: "center",
      render: (_id, staff) => {
        return [
          <>
            <Row>
              <Col span={12}>
                <span>
                  <a
                    key={_id}
                    onClick={() => handleViewEdit(_id)}
                    style={{ float: "right" }}
                  >
                    <EditOutlined style={{ fontSize: 20 }} /> Edit
                  </a>
                </span>
              </Col>
              <Col span={12}>
                <span>
                  <a key={_id} onClick={() => viewLogs(staff)}>
                    {" "}
                    <EyeOutlined style={{ fontSize: 20 }} /> Logs
                  </a>
                </span>
              </Col>
            </Row>
          </>,
        ];
      },
    },
  ];
  //delete note
  const [visibleCard, setVisibleCard] = useState(false);
  const handleDeleteNote = (note_id, staff_id) => {
    console.log(note_id, "this delete note");
    console.log(staff_id, "this is id of user");
    const save = {
      staff_id: staff_id,
      note_id: note_id,
    };

    axios
      .post(api_base_url + "/staff/delete/note", save)
      .then((res) => renderData());
  };

  //for view logs
  const [visibleLogs, setVisibleLog] = useState(false);
  const [logInfo, setLogInfo] = useState([]);

  function viewLogs(staff) {
    console.log(staff, "this is staff");
    setLogInfo(staff.action_log);

    openLogModal();
  }

  function openLogModal() {
    setVisibleLog(true);
  }

  const DisplayLogs = () => {
    console.log(logInfo, "this is logs");
    console.log(logs.length, "this display logs length");
    const listOfLogs = logInfo.map((key) => (
      <Timeline.Item>{key}</Timeline.Item>
    ));

    return <Timeline>{listOfLogs}</Timeline>;
  };

  const handleOkLogs = () => setVisibleLog(false);
  //for edit staff info
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [dateBirthday, setBirthday] = useState("");
  const [editValue, setEditValue] = useState("");

  const handleCancelEdit = () => setVisibleEdit(false);

  function onChangeEditBirthday(date, dateString) {
    setBirthday(dateString);
  }

  function handleViewEdit(value) {
    console.log(value, "this is id");
    for (let i = 0; i < staff.length; i++) {
      if (value === staff[i]._id) {
        setEditValue(staff[i]);
        console.log(staff[i], "this is staff in handle edit");
        break;
      }
    }

    openEditModal();
  }
  function openEditModal() {
    setVisibleEdit(true);
    console.log(editValue, "this is editvalue");
  }

  const handleFinishEdit = (values) => {
    console.log(values, "this is values of edit before configure");
    console.log(editValue, "this is values of editValue before configure");
    console.log(dateBirthday, "this is value of birthday before configure");

    if (values.value_name == null || values.value_name == "") {
      values.value_name = editValue.name;
    }
    if (values.value_email == null || values.value_email == "") {
      console.log(true, " email value");
      values.value_email = editValue.email;
    }
    if (values.value_address == null || values.value_address == "") {
      values.value_address = editValue.address;
    }
    if (dateBirthday == "") {
      console.log(true, "birhday value null");
      values.value_birthday = editValue.birthday;
    } else if (dateBirthday != "") {
      values.value_birthday = dateBirthday;
    }
    if (values.value_position == null || values.value_position == "") {
      values.value_position = editValue.position;
    }
    if (values.value_username == null || values.value_username == "") {
      values.value_username = editValue.username;
    }
    console.log(editValue, "this is editValue in submit");
    console.log(values, "this is edit values");
    const save = {
      _id: editValue._id,
      name: values.value_name,
      address: values.value_address,
      email: values.value_email,
      birthday: values.value_birthday,
      position: values.value_position,
      username: values.value_username,
    };

    console.log(save, "this is save values");
    axios.post(api_base_url + "/staff/edit", save).then((res) => {
      if (res.data == "edit staff info successful") {
        renderData();
        setVisibleEdit(false);
        form_edit_staff.resetFields();
      } else {
        message.error(res.data);
      }
    });
  };

  //for display data
  useEffect(() => {
    axios
      .get(api_base_url + "/staff")
      .then((res) => {
        setStaff(res.data);

        setDate(date + "-" + month + "-" + year);
      })
      .catch((err) => {
        console.log(err, "failed fetching data from database");
      });
  }, []);

  //for render
  function renderData() {
    axios
      .get(api_base_url + "/staff")
      .then((res) => {
        setStaff(res.data);

        setDate(date + "-" + month + "-" + year);
      })
      .catch((err) => {
        console.log(err, "failed fetching data from database");
      });
  }

  //search
  const [search, setSearch] = useState("");
  const [filteredStaff, setFilteredStaff] = useState([]);

  useEffect(() => {
    setFilteredStaff(
      staff.filter(
        (data) =>
          (data.name != undefined ? data.name : "")
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          (data.position != undefined ? data.position : "")
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          (data.email != undefined ? data.email : "")
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          (data.username != undefined ? data.username : "")
            .toLowerCase()
            .includes(search.toLowerCase())
      )
    );
  }, [search, staff]);

  // staff info
  const [logs, setLogs] = useState([]);

  const expandedRowRender = (expandedRowKey) => {
    setLogs(expandedRowKey.action_log);

    const columns = [
      {
        title: "Birthdate",
        dataIndex: "birthday",
        key: "birthday",
        align: "center",
      },
      {
        title: "Address",
        dataIndex: "address",
        key: "address",
        align: "center",
      },
      { title: "Email", dataIndex: "email", key: "email", align: "center" },
      {
        title: "Username",
        dataIndex: "username",
        key: "username",
        align: "center",
      },
    ];

    const data = [
      {
        key: expandedRowKey._id,
        birthday: expandedRowKey.birthday,
        address: expandedRowKey.address,
        email: expandedRowKey.email,
        username: expandedRowKey.username,
      },
    ];

    return (
      <div>
        <Table columns={columns} dataSource={data} pagination={false} />
      </div>
    );
  };

  //bulk or select multiple + change staff into active or disabled or add note
  const [visibleNote, setVisibleNote] = useState(false);
  const [keys, setKeys] = useState([]);
  const [hasSelected, setHasSelected] = useState(true);

  const onSelectChange = (selectedRowKeys) => {
    setKeys({ selectedRowKeys });

    if (selectedRowKeys.length > 0) {
      setHasSelected(false);
    } else {
      setHasSelected(true);
    }
  };

  const { selectedRowKeys } = keys;
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  function handleMenuClick(e) {
    if (e.key === "1") {
      const save = [];
      for (let i = 0; i < selectedRowKeys.length; i++) {
        save[i] = {
          _id: selectedRowKeys[i],
          status: true,
        };
      }
      axios
        .post(api_base_url + "/staff/update/status", save)
        .then((res) => renderData());
    } else if (e.key === "2") {
      const save = [];
      for (let i = 0; i < selectedRowKeys.length; i++) {
        save[i] = {
          _id: selectedRowKeys[i],
          status: false,
        };
      }
      axios
        .post(api_base_url + "/staff/update/status", save)
        .then((res) => renderData());
    } else if (e.key === "3") {
      setVisibleNote(true);
    }
  }

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">Activate Staff</Menu.Item>
      <Menu.Item key="2">Disable Staff</Menu.Item>
      <Menu.Item key="3">Add Note</Menu.Item>
    </Menu>
  );

  //add note
  const handleFinishNote = (value) => {
    const save = [];

    for (let i = 0; i < selectedRowKeys.length; i++) {
      save[i] = {
        _id: selectedRowKeys[i],
        info: value.note,
        status: true,
      };
    }
    axios
      .post(api_base_url + "/staff/add_note", save)
      .then((res) => renderData())
      .catch((err) => console.log(err, "error"));
    form.resetFields();
    setVisibleNote(false);
  };

  const handleCancelNote = () => setVisibleNote(false);

  //add staff
  const [visibleAdd, setVisibleAdd] = useState(false);
  const [dateBirthdayAdd, setBirthdayAdd] = useState("");
  const showModalAdd = () => setVisibleAdd(true);

  const handleFinishAdd = (values) => {
    const staff = {
      name: values.name,
      username: values.username,
      birthday: dateBirthdayAdd,
      address: values.address,
      position: values.position,
      password: values.password,
      email: values.email,
      action_log: "Staff was added at " + dateToday,
    };

    axios
      .post(api_base_url + "/staff/add", staff)
      .then((res) => {
        if (res.data == "staff added") {
          renderData();
          form_add_staff.resetFields();
          setVisibleAdd(false);
        } else {
          message.error(res.data);
        }
      })
      .catch((err) => {});
  };
  function onChange(date, dateString) {
    setBirthdayAdd(dateString);
    setDate(dateToday);
  }
  const handleCancelAdd = () => setVisibleAdd(false);
  const [form] = Form.useForm();
  const [form_add_staff] = Form.useForm();
  const [form_edit_staff] = Form.useForm();
  return (
    <>
      <section>
        <div>
          <Modal
            title="Add Staff"
            visible={visibleAdd}
            footer={null}
            onCancel={() => {
              setVisibleAdd(false);
            }}
          >
            <Form
              form={form_add_staff}
              {...formItemLayout}
              onFinish={handleFinishAdd}
            >
              <Form.Item
                name="name"
                label="Name"
                rules={[
                  {
                    required: true,
                    message: "Please input full name",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="position"
                label="Position"
                rules={[
                  {
                    required: true,
                    message: "Please input position",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="email"
                label="E-mail"
                rules={[
                  {
                    type: "email",
                    message: "The input is invalid E-mail",
                  },
                  {
                    required: true,
                    message: "Please input E-mail",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="birthday"
                label="Birhdate"
                rules={[
                  {
                    required: true,
                    message: "Please select birthdate",
                  },
                ]}
              >
                <DatePicker onChange={onChange}></DatePicker>
              </Form.Item>
              <Form.Item
                name="address"
                label="Address"
                rules={[
                  {
                    required: true,
                    message: "Please input address",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="username"
                label="Username"
                rules={[
                  {
                    required: true,
                    message: "Please input username",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  {
                    required: true,
                    message: "Please input password",
                  },
                ]}
                hasFeedback
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                name="confirm"
                label="Confirm Password"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please input username",
                  },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }

                      return Promise.reject("Password does not match!");
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item {...tailFormItemLayout}>
                <Space>
                  <Button type="primary" htmlType="submit">
                    Register
                  </Button>
                  <Button onClick={handleCancelAdd}>Cancel</Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </section>
      <br />
      <section>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Space>
              <Button
                shape="round"
                type="primary"
                size="large"
                onClick={showModalAdd}
              >
                <UserAddOutlined></UserAddOutlined>Add
              </Button>
              <Dropdown overlay={menu} disabled={hasSelected}>
                <Button>
                  Actions <DownOutlined />
                </Button>
              </Dropdown>
            </Space>
          </Col>
          <Col span={12}>
            <Search
              placeholder="Enter Search"
              style={{ width: 200, float: "right" }}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>
        </Row>

        <Table
          className="components-table-demo-nested"
          rowKey={(staff) => staff._id}
          rowSelection={rowSelection}
          expandable={{ expandedRowRender }}
          columns={columns}
          dataSource={filteredStaff}
          pagination={{ defaultPageSize: 10, position: ["bottomCenter"] }}
        ></Table>
      </section>

      <Modal
        title="Add Note"
        visible={visibleNote}
        onCancel={() => setVisibleNote(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleFinishNote}>
          <Form.Item
            name="note"
            key={1}
            rules={[
              {
                required: true,
                message: "Please input note",
              },
            ]}
          >
            <TextArea rows={3}></TextArea>
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Space>
              <Button type="primary" htmlType="submit">
                Ok
              </Button>
              <Button onClick={handleCancelNote}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Edit Staff"
        visible={visibleEdit}
        onCancel={() => setVisibleEdit(false)}
        footer={null}
      >
        <Form
          form={form_edit_staff}
          {...formItemLayout}
          onFinish={handleFinishEdit}
        >
          <Form.Item name="value_name" label="Name">
            <Input placeholder={editValue.name} />
          </Form.Item>
          <Form.Item name="value_position" label="Position">
            <Input placeholder={editValue.position} />
          </Form.Item>
          <Form.Item name="value_email" label="E-mail">
            <Input placeholder={editValue.email} />
          </Form.Item>
          <Form.Item name="value_birthday" label="Birhdate">
            <DatePicker
              onChange={onChangeEditBirthday}
              placeholder={editValue.birthday}
            ></DatePicker>
          </Form.Item>
          <Form.Item name="value_address" label="Address">
            <Input placeholder={editValue.address} />
          </Form.Item>
          <Form.Item name="value_username" label="Username">
            <Input placeholder={editValue.username} />
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Space>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Button onClick={handleCancelEdit}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="User Logs"
        visible={visibleLogs}
        onCancel={handleOkLogs}
        footer={null}
      >
        <DisplayLogs />
      </Modal>
    </>
  );
}
export default StaffTable;
