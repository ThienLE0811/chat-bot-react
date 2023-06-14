import { notification } from "antd";
import axios from "axios";

const handleLoginApi = async (userName: string, password: string) => {
  return await axios.post("http://localhost:8000/users/login", {
    userName,
    password,
  });
};

const handleLogoutApi = async () => {
  try {
    const response = await axios.post("http://localhost:8000/users/logout");
    console.log("data logout::", response.data);
    localStorage.clear();
  } catch (error) {
    console.error(error);
  }
};

const handleSingUpApi = async (data: any) => {
  return await axios.post("http://localhost:8000/users/register", data);
};

// const getUser = async () => {
//   return await axios.get("http://localhost:8000/users/getList", {})
// };

const getUser = async (): Promise<any> => {
  try {
    const response = await axios.get("http://localhost:8000/users/getList", {});
    if (response?.statusText === "OK") {
      return Promise.resolve(response);
    } else {
      notification.error({ message: "Không lấy được dữ liệu" });
      return Promise.reject();
    }
  } catch (error) {
    notification.error({ message: "Không lấy được dữ liệu" });
    return Promise.reject();
  }
};

const getUserId = async (userId: any) => {
  return await axios.get(`http://localhost:8000/users/${userId}`, {});
};

const deleteUser = async (userId: number) => {
  return await axios.delete(`http://localhost:8000/users/delete/${userId}`, {});
};

const createUser = async (formValues: any) => {
  return await axios.post(`http://localhost:8000/users/create`, formValues);
};

const updateUser = async (id: string, formValues: any) => {
  return await axios.put(
    `http://localhost:8000/users/update/${id}`,
    formValues
  );
};

export {
  handleLoginApi,
  handleLogoutApi,
  handleSingUpApi,
  getUser,
  deleteUser,
  updateUser,
  createUser,
  getUserId,
};
