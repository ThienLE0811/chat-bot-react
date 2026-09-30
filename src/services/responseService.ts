import { notification } from "antd";
import axios from "axios";
import { API_URL } from "./trainService";

const getResponse = async (
  params: any,
  sort: any,
  filters: any
): Promise<any> => {
  try {
    const response = await axios.get(
      `${API_URL}/responses/getList`,
      { params: { filters: params.title } }
    );
    console.log("res:: ", response);
    if (response?.status === 200) {
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

const createResponse = async (formValues: any) => {
  try {
    return await axios.post(
      `${API_URL}/responses/create`,
      formValues
    );
  } catch (error) {
    notification.error({ message: "Tạo mới không thành công!" });
  }
};

const updateResponse = async (id: string, formValues: any) => {
  return await axios.put(
    `${API_URL}/responses/update/${id}`,
    formValues
  );
};

const deleteResponse = async (id: String) => {
  return await axios.delete(`${API_URL}/responses/delete/${id}`, {});
};

const getListResponse = async (): Promise<any> => {
  try {
    const response = await axios.get(
      `${API_URL}/responses/getList`,
      {}
    );
    console.log("res:: ", response);
    if (response?.status === 200) {
      const roles = response.data.map((item: any) => {
        return { label: item?.title, value: item?.title };
      });
      // console.log("res::",roles); // [{label: "Admin", value:"Admin" }, {label: "User", value:"User" }]
      return roles;
    } else {
      notification.error({ message: "Không lấy được dữ liệu" });
      return Promise.reject();
    }
  } catch (error) {
    notification.error({ message: "Không lấy được dữ liệu" });
    return Promise.reject();
  }
};

export {
  getResponse,
  updateResponse,
  deleteResponse,
  createResponse,
  getListResponse,
};
