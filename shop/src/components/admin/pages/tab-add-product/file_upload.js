import React, { useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { Empty, Space, Upload, message, Typography } from "antd";
const { Dragger } = Upload;
const { Text } = Typography;
function FileUpload(props) {
  const { imageFile, setImageFile } = props;
  const originColor = "#dfe4e6";
  const [colorBorder, setColorBorder] = useState(originColor);
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };
  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };
  const propsDragger = {
    showUploadList: false,
    name: "file",
    onChange(info) {
      const { status } = info.file;
      console.log(info.file);
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        getBase64(info.file.originFileObj, (imageUrl) => {
          setImageFile(imageUrl);
        });
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  return (
    <div>
      <Text>Upload Image</Text>
      <Space
        direction="vertical"
        style={{ width: "100%", textAlign: "center" }}
      >
        {imageFile ? (
          <img src={imageFile} style={{ width: "80%" }} />
        ) : (
          <Empty />
        )}
        <Dragger
          {...propsDragger}
          beforeUpload={beforeUpload}
          customRequest={dummyRequest}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for a single upload. Strictly prohibit from uploading
            company data or other band files
          </p>
        </Dragger>
      </Space>
    </div>
  );
}

export default FileUpload;
