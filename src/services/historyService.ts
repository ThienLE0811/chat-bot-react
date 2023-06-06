import axios from "axios";
import { message, notification } from "antd";

const getHistory = async (): Promise<any> => {
  try {
    const response = await axios.get(
      "http://localhost:8000/history/getList",
      {}
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

export { getHistory };
