import { message, notification } from "antd";
import axios from "axios";

// const getEntities = async () => {
//     const response = await axios.get("http://localhost:8000/entities/getList", {});
//     console.log("res:: ",response)
//     if(response.statusText === "OK"){
//       return response;
//     }
//     else {
//       message.error("Không lấy được dữ liệu")
//       return response
//     }

// };

const getNlu = async (): Promise<any> => {
  try {
    const response = await axios.get("http://localhost:8000/nlu/getList", {});
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

const createNlu = async (formValues: any) => {
  return await axios.post(`http://localhost:8000/nlu/create`, formValues);
};

const updateNlu = async (id: string, formValues: any) => {
  return await axios.put(`http://localhost:8000/nlu/update/${id}`, formValues);
};

const deleteNlu = async (id: String) => {
  return await axios.delete(`http://localhost:8000/nlu/delete/${id}`, {});
};

export { getNlu, updateNlu, deleteNlu, createNlu };
