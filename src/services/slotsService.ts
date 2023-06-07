import { message, notification } from "antd";
import axios from "axios";

// const getResponse = async () => {
//     const response = await axios.get("http://localhost:8000/responses/getList", {});
//     console.log("res:: ",response)
//     if(response.statusText === "OK"){
//       return response;
//     }
//     else {
//       message.error("Không lấy được dữ liệu")
//       return response
//     }

// };

const getSlots = async (params: any, sort: any, filters: any): Promise<any> => {
  try {
    const response = await axios.get("http://localhost:8000/slots/getList", {
      params: { filters: params.keyword },
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

const createSlots = async (formValues: any) => {
  try {
    return await axios.post(`http://localhost:8000/slots/create`, formValues);
  } catch (error) {
    notification.error({ message: "Tạo mới không thành công!" });
  }
};

const updateSlots = async (id: string, formValues: any) => {
  return await axios.put(
    `http://localhost:8000/slots/update/${id}`,
    formValues
  );
};

const deleteSlots = async (id: String) => {
  return await axios.delete(`http://localhost:8000/slots/delete/${id}`, {});
};

export { getSlots, updateSlots, deleteSlots, createSlots };
