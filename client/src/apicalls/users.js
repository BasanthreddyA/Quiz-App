import axios from "axios";

const { default: axiosInstance } = require(".");

export const registerUser = async (payload) => {
    try {
        const response = await axiosInstance.post('/api/users/register', payload);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const loginUser = async (payload) => {
    try {
        const response = await axiosInstance.post('/api/users/login', payload);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const getUserInfo = async () => {
    try {
        const response = await axiosInstance.post('/api/users/get-user-info');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}





// export const uploadUsersCSV = async (formData) => {
//   try {
//     const response = await axios.post(
//       "/api/users/upload-csv",
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     return {
//       success: false,
//       message: error.message,
//     };
//   }
// };


export const uploadUsersCSV = async (formData) => {
    try {
      const response = await axios.post("/api/users/upload-csv", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message:
          error?.response?.data?.message || error.message || "Unknown error",
      };
    }
  };
  