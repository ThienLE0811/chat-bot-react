import { notification } from "antd";
import axios from "axios";
import { API_URL } from "./trainService";

const getRules = async (): Promise<any> => {
  try {
    const response = await axios.get(`${API_URL}/rules/getList`, {});
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

const createRules = async (formValues: any) => {
  return await axios.post(`${API_URL}/rules/create`, formValues);
};

const updateRules = async (id: string, formValues: any) => {
  return await axios.put(
    `${API_URL}/rules/update/${id}`,
    formValues
  );
};

const deleteRules = async (id: String) => {
  return await axios.delete(`${API_URL}/rules/delete/${id}`, {});
};

export { getRules, updateRules, deleteRules, createRules };
