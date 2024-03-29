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

const getResponse = async (
  params: any,
  sort: any,
  filters: any
): Promise<any> => {
  try {
    const response = await axios.get(
      "http://localhost:8000/responses/getList",
      { params: { filters: params.title } }
    );
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

const createResponse = async (formValues: any) => {
  try {
    return await axios.post(
      `http://localhost:8000/responses/create`,
      formValues
    );
  } catch (error) {
    notification.error({ message: "Tạo mới không thành công!" });
  }
};

const updateResponse = async (id: string, formValues: any) => {
  return await axios.put(
    `http://localhost:8000/responses/update/${id}`,
    formValues
  );
};

const deleteResponse = async (id: String) => {
  return await axios.delete(`http://localhost:8000/responses/delete/${id}`, {});
};

const getListResponse = async (): Promise<any> => {
  try {
    const response = await axios.get(
      "http://localhost:8000/responses/getList",
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

export {
  getResponse,
  updateResponse,
  deleteResponse,
  createResponse,
  getListResponse,
};
