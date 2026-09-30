import axios from "axios";
import { API_URL } from "./trainService";
import { message, notification } from "antd";

const getHistory = async (): Promise<any> => {
  try {
    const response = await axios.get(
      `${API_URL}/history/getList`,
      {}
    );
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

export { getHistory };
