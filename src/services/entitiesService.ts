import { notification } from "antd";
import axios from "axios";
import { API_URL } from "./trainService";

const getEntities = async (
  params: any,
  sort: any,
  filters: any
): Promise<any> => {
  try {
    const response = await axios.get(`${API_URL}/entities/getList`, {
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

const createEntities = async (formValues: any) => {
  try {
    return await axios.post(
      `${API_URL}/entities/create`,
      formValues
    );
  } catch (error) {
    notification.error({ message: "Tạo mới không thành công!" });
  }
};

const updateEntities = async (id: string, formValues: any) => {
  return await axios.put(
    `${API_URL}/entities/update/${id}`,
    formValues
  );
};

const deleteEntities = async (id: String) => {
  return await axios.delete(`${API_URL}/entities/delete/${id}`, {});
};

export { getEntities, updateEntities, deleteEntities, createEntities };
