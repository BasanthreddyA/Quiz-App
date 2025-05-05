import React, { useState } from "react";
import { Modal, Form, message } from "antd";
import { uploadUsersCSV } from "../apicalls/users";
import { useDispatch } from "react-redux";
import { ShowLoading, HideLoading } from "../redux/loaderSlice";

function UploadUsersModal({ visible, setVisible, examId }) {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return message.error("Please select a CSV file");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("examId", examId);

    try {
      dispatch(ShowLoading());
      const response = await uploadUsersCSV(formData);
      dispatch(HideLoading());

      if (response.success) {
        message.success("Users uploaded successfully");
        setVisible(false);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error("Upload failed");
    }
  };

  return (
    <Modal
      open={visible}
      title="Upload Users via CSV"
      onCancel={() => setVisible(false)}
      footer={null}
    >
      <Form layout="vertical" onFinish={handleUpload}>
        <Form.Item label="CSV File">
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </Form.Item>
        <div className="flex justify-end gap-2">
          <button
            className="primary-outlined-btn"
            type="button"
            onClick={() => setVisible(false)}
          >
            Cancel
          </button>
          <button className="primary-contained-btn" type="submit">
            Upload
          </button>
        </div>
      </Form>
    </Modal>
  );
}

export default UploadUsersModal;
