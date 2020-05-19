import React, { useState } from "react";
import {
  Magnifier,
  GlassMagnifier,
  SideBySideMagnifier,
  PictureInPictureMagnifier,
  MOUSE_ACTIVATION,
  TOUCH_ACTIVATION,
} from "react-image-magnifiers";
import { Modal, Button } from "antd";
function PreviewImageModal({ productTitle, visible, imgSrc, callback }) {
  return [
    <Modal
      title={productTitle}
      visible={visible}
      onCancel={callback}
      footer={[null]}
    >
      <GlassMagnifier
        magnifierSize="50%"
        style={{ width: "80%", margin: "0 auto" }}
        imageSrc={imgSrc}
        imageAlt={productTitle}
        largeImageSrc={imgSrc}
      />
    </Modal>,
  ];
}

export default PreviewImageModal;
