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

const getEntities = async (
  params: any,
  sort: any,
  filters: any
): Promise<any> => {
  try {
    const response = await axios.get("http://localhost:8000/entities/getList", {
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

const createEntities = async (formValues: any) => {
  try {
    return await axios.post(
      `http://localhost:8000/entities/create`,
      formValues
    );
  } catch (error) {
    notification.error({ message: "Tạo mới không thành công!" });
  }
};

const updateEntities = async (id: string, formValues: any) => {
  return await axios.put(
    `http://localhost:8000/entities/update/${id}`,
    formValues
  );
};

const deleteEntities = async (id: String) => {
  return await axios.delete(`http://localhost:8000/entities/delete/${id}`, {});
};

export { getEntities, updateEntities, deleteEntities, createEntities };
