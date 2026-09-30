import { message, notification } from "antd";
import axios from "axios";
import { API_URL } from "./trainService";

const getStories = async (
  params: any,
  sort: any,
  filters: any
): Promise<any> => {
  try {
    console.log("params", params);
    console.log("filters", filters);
    const response = await axios.get(`${API_URL}/stories/getList`, {
      params: { filters: params.keyword },
    });
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

const getOneStories = async (id: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_URL}/stories/${id}`, {});
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

const createStories = async (formValues: any) => {
  try {
    return await axios.post(`${API_URL}/stories/create`, formValues);
  } catch (error) {
    notification.error({ message: "Tạo mới không thành công!" });
  }
};

const updateStories = async (id: string, formValues: any) => {
  console.log("formValues:: ", formValues);
  return await axios.put(
    `${API_URL}/stories/update/${id}`,
    formValues
  );
};

const deleteStories = async (id: string) => {
  return await axios.delete(`${API_URL}/stories/delete/${id}`, {});
};

export {
  getStories,
  updateStories,
  deleteStories,
  createStories,
  getOneStories,
};
