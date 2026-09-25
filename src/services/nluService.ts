import { notification } from "antd";
import axios from "axios";

const getNlu = async (params: any, sort: any, filters: any): Promise<any> => {
  try {
    const response = await axios.get("http://localhost:8000/nlu/getList", {
      params: { filters: params.intent },
    });
    console.log("res:: ", response);
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

/** Throws on failure; the form shows the server's reason. */
const createNlu = async (formValues: any) => {
  return await axios.post(`http://localhost:8000/nlu/create`, formValues);
};

const updateNlu = async (id: string, formValues: any) => {
  return await axios.put(`http://localhost:8000/nlu/update/${id}`, formValues);
};

const deleteNlu = async (id: String) => {
  return await axios.delete(`http://localhost:8000/nlu/delete/${id}`, {});
};

const getListIntent = async (): Promise<any> => {
  try {
    const response = await axios.get(
      "http://localhost:8000/intents/getList",
      {}
    );
    console.log("res:: ", response);
    if (response?.statusText === "OK") {
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

export { getNlu, updateNlu, deleteNlu, createNlu, getListIntent };
