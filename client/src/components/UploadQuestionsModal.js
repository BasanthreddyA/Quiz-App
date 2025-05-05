import React, { useState } from "react";
import Papa from "papaparse";
import { Modal, message } from "antd";
import axios from "axios";

function UploadQuestionsModal({ visible, setVisible, examId, refreshData }) {
  const [csvData, setCsvData] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setCsvData(results.data);
      },
      error: () => {
        message.error("Failed to parse CSV");
      },
    });
  };

  const handleUpload = async () => {
    try {
      const response = await axios.post(`/api/exams/${examId}/upload-questions`, {
        questions: csvData,
      });

      if (response.data.success) {
        message.success("Questions uploaded successfully");
        setVisible(false);
        refreshData(); // refresh questions table
      } else {
        message.error(response.data.message || "Upload failed");
      }
    } catch (error) {
      console.error(error);
      message.error("Something went wrong");
    }
  };

  return (
    <Modal
      title="Upload Questions (CSV)"
      open={visible}
      onCancel={() => setVisible(false)}
      onOk={handleUpload}
      okText="Upload"
    >
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      <p className="text-sm text-gray-500 mt-2">
        CSV Format: question, option1, option2, option3, option4, correctOption (1-4)
      </p>
    </Modal>
  );
}

export default UploadQuestionsModal;


