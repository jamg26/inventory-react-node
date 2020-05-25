import React, { useState, useEffect } from "react";
import { Modal, Row, Col, Input, message } from "antd";
import TextArea from "antd/lib/input/TextArea";
import axios from "axios";
import { api_base_url_orders } from "../../keys/index";
function AddSupplier({ show_edit_supplier_modal, close, callback, edit_data }) {
  const [display_name, set_display_name] = useState("");
  const [supplier_code, set_supplier_code] = useState("");
  const [company_name, set_company_name] = useState("");
  const [address, set_address] = useState("");
  const [email, set_email] = useState("");
  const [site_url, set_site_url] = useState("");
  const [note, set_note] = useState("");
  const [supplier_name_valid, set_supplier_name_valid] = useState(true);
  const [supplier_code_valid, set_supplier_code_valid] = useState(true);
  const [email_valid, set_email_valid] = useState(true);
  //  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(initialEmail)
  const resetall = () => {
    set_display_name("");
    set_supplier_code("");
    set_company_name("");
    set_address("");
    set_email("");
    set_site_url("");
    set_note("");
    set_supplier_name_valid(true);
    set_supplier_code_valid(true);
    set_email_valid(true);
    close();
  };
  useEffect(() => {
    if (edit_data) {
      set_display_name(edit_data.display_name);
      set_supplier_code(edit_data.supplier_code);
      set_company_name(edit_data.company_name);
      set_address(edit_data.address);
      set_email(edit_data.email);
      set_site_url(edit_data.site_url);
      set_note(edit_data.note);
    }
  }, [edit_data]);
  const submitSupplier = async () => {
    let email_valid = true;
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      email_valid = true;
    } else {
      if (email != "") {
        email_valid = false;
        message.error("Email is invalid");
      }
    }
    set_email_valid(email_valid);
    if (email_valid) {
      if (display_name != "") {
        set_supplier_name_valid(true);
        if (supplier_code != "") {
          set_supplier_code_valid(true);
          const headers = {
            "Content-Type": "application/json",
          };

          await axios
            .post(
              api_base_url_orders + "/update_supplier",
              {
                id: edit_data._id,
                original_supplier_name: edit_data.display_name,
                original_supplier_code: edit_data.supplier_code,
                display_name,
                supplier_code,
                company_name,
                address,
                email,
                site_url,
                note,
              },
              { headers: headers }
            )
            .then((response) => {
              message.success(response.data.message);
              resetall();
              callback();
            })
            .catch((err) => {
              if (err.response.data.status == "SUPPLIER NAME ALREADY EXIST") {
                set_supplier_name_valid(false);
              }
              if (err.response.data.status == "SUPPLIER CODE ALREADY EXIST") {
                set_supplier_code_valid(false);
              }
              message.error(err.response.data.message);
            });
        } else {
          set_supplier_code_valid(false);
          message.error("Supplier Code cannot be blank.");
        }
      } else {
        set_supplier_name_valid(false);
        message.error("Supplier Name cannot be blank.");
      }
    }
  };
  return [
    <Modal
      title="Edit Supplier"
      visible={show_edit_supplier_modal}
      onOk={() => {
        submitSupplier();
      }}
      okText="Submit"
      onCancel={resetall}
    >
      <Row gutter={[16, 16]}>
        <Col span="12">
          <Input
            placeholder="Supplier Name"
            className={`${
              supplier_name_valid ? "valid_input" : "invalid_input"
            }`}
            value={display_name}
            onPressEnter={() => {
              submitSupplier();
            }}
            onChange={(event) => {
              set_display_name(event.target.value);
            }}
          />
        </Col>
        <Col span="12">
          <Input
            placeholder="Supplier Code"
            className={`${
              supplier_code_valid ? "valid_input" : "invalid_input"
            }`}
            onPressEnter={() => {
              submitSupplier();
            }}
            value={supplier_code}
            onChange={(event) => {
              set_supplier_code(event.target.value);
            }}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span="24">
          <Input
            placeholder="Company Name"
            value={company_name}
            onPressEnter={() => {
              submitSupplier();
            }}
            onChange={(event) => {
              set_company_name(event.target.value);
            }}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span="24">
          <TextArea
            placeholder="Address"
            value={address}
            onPressEnter={() => {
              submitSupplier();
            }}
            onChange={(event) => {
              set_address(event.target.value);
            }}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span="12">
          <Input
            placeholder="Email"
            className={`${email_valid ? "valid_input" : "invalid_input"}`}
            value={email}
            onPressEnter={() => {
              submitSupplier();
            }}
            onChange={(event) => {
              set_email(event.target.value);
            }}
          />
        </Col>
        <Col span="12">
          <Input
            placeholder="Site Url"
            value={site_url}
            onPressEnter={() => {
              submitSupplier();
            }}
            onChange={(event) => {
              set_site_url(event.target.value);
            }}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span="24">
          <TextArea
            placeholder="Supplier Note"
            value={note}
            onChange={(event) => {
              set_note(event.target.value);
            }}
          />
        </Col>
      </Row>
    </Modal>,
  ];
}

export default AddSupplier;
