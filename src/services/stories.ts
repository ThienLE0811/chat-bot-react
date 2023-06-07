import { message, notification } from "antd";
import axios from "axios";

const getStories = async (
  params: any,
  sort: any,
  filters: any
): Promise<any> => {
  try {
    console.log("params", params);
    console.log("filters", filters);
    const response = await axios.get("http://localhost:8000/stories/getList", {
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

const getOneStories = async (id: string): Promise<any> => {
  try {
    const response = await axios.get(`http://localhost:8000/stories/${id}`, {});
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

const createStories = async (formValues: any) => {
  try {
    return await axios.post(`http://localhost:8000/stories/create`, formValues);
  } catch (error) {
    notification.error({ message: "Tạo mới không thành công!" });
  }
};

const updateStories = async (id: string, formValues: any) => {
  console.log("formValues:: ", formValues);
  return await axios.put(
    `http://localhost:8000/stories/update/${id}`,
    formValues
  );
};

const deleteStories = async (id: string) => {
  return await axios.delete(`http://localhost:8000/stories/delete/${id}`, {});
};

export {
  getStories,
  updateStories,
  deleteStories,
  createStories,
  getOneStories,
};
