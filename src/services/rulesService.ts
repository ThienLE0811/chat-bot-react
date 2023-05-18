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

const getRules = async (): Promise<any> => {
  console.log("log:: ", process.env);
  try {
    const response = await axios.get(`http://localhost:8000/rules/getList`, {});
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

const createRules = async (formValues: any) => {
  return await axios.post(`http://localhost:8000/rules/create`, formValues);
};

const updateRules = async (id: string, formValues: any) => {
  return await axios.put(
    `http://localhost:8000/rules/update/${id}`,
    formValues
  );
};

const deleteRules = async (id: String) => {
  return await axios.delete(`http://localhost:8000/rules/delete/${id}`, {});
};

export { getRules, updateRules, deleteRules, createRules };
