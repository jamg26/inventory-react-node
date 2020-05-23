import React, { useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { Empty } from "antd";
function FileUpload(props) {
  const { imageFile, setImageFile } = props;
  const originColor = "#dfe4e6";
  const [colorBorder, setColorBorder] = useState(originColor);
  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e) => {
        setImageFile(e.target.result);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };
  const changeColor = () => {
    setColorBorder("#23a4eb");
  };
  const changeBackColor = () => {
    setColorBorder(originColor);
  };
  console.log(imageFile);
  return (
    <div style={{ padding: "40px 40px 0px 70px" }}>
      <label style={{ fontWeight: "bold", color: "black" }}>Upload image</label>
      <div style={{ textAlign: "center", padding: "10px" }}>
        {imageFile == "" ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <img alt="preview" style={{ width: "50%" }} src={imageFile} />
        )}
      </div>
      <div
        style={{
          width: "100%",
          textAlign: "center",
          border: "1px dashed",
          borderColor: colorBorder,
          padding: "8px 15px 10px 15px",
          backgroundColor: "#f7f9fa",
          cursor: "pointer",
        }}
        onMouseEnter={changeColor}
        onMouseLeave={changeBackColor}
      >
        <label htmlFor="group_image" style={{ cursor: "pointer" }}>
          <div style={{ margin: -15, paddingTop: "20px" }}>
            <InboxOutlined style={{ fontSize: 45, color: "#23a4eb" }} />
          </div>
          <p
            style={{
              marginTop: "20px",
              color: "rgba(0, 0, 0, 0.85)",
              fontSize: "14px",
            }}
          >
            Click or drag file to this area to upload
          </p>
          <p
            style={{
              fontSize: "12px",
              color: "rgba(0, 0, 0, 0.45)",
              marginTop: "5px",
            }}
          >
            Support for a single or bulk upload. Strictly prohibit from
            uploading company data or other band files
          </p>
        </label>
      </div>
      <input
        type={"file"}
        onChange={onImageChange}
        style={{ display: "none" }}
        id="group_image"
      />
    </div>
  );
}

export default FileUpload;
